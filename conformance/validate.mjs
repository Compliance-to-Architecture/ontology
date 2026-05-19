#!/usr/bin/env node
// Compliance-to-Architecture conformance validator.
// Runs zero external deps — pure Node ≥18.
// Apache-2.0.

import { readFileSync, readdirSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const schemasDir = resolve(here, "../schemas");

const target = process.argv[2];
if (!target) {
  console.error("Usage: validate.mjs <path-to-ontology.json>");
  process.exit(2);
}

const ontology = JSON.parse(readFileSync(target, "utf-8"));
const errors = [];

function err(rule, msg, id) {
  errors.push({ rule, msg, id: id ?? "" });
}

// ── 1. Structural ────────────────────────────────────────────────────────
const TOP_LEVEL = [
  "authorities",
  "obligations",
  "controls",
  "evidenceObjects",
  "architectureRequirements",
  "policies",
  "auditTrailLinks",
  "aiSystemGovernance",
];

// ── 1b. Optional 12-layer extensions ─ presence is conformant; absence is
//        a coverage *warning*, not a violation, for v0.1.x.
const OPTIONAL_LAYERS = [
  "riskScenarios",
  "jurisdictions",
  "regulators",
  "applicabilityRules",
  "mitigations",
  "workflows",
  "auditPacks",
  "controlTests",
  "monitorBindings",
  "crosswalkRelations",
];

const layerWarnings = [];
for (const k of OPTIONAL_LAYERS) {
  if (!Array.isArray(ontology[k]) || ontology[k].length === 0) {
    layerWarnings.push(`L coverage warning: '${k}' is empty — implementation is structurally conformant but not enterprise-grade.`);
  }
}
for (const k of TOP_LEVEL) {
  if (!Array.isArray(ontology[k])) err("structural", `missing top-level array '${k}'`);
}

// Build id indices for lookup
const idsBy = (kind) => new Set((ontology[kind] ?? []).map((e) => e.id));
const authIds = idsBy("authorities");
const oblIds = idsBy("obligations");
const ctrlIds = idsBy("controls");
const authShortNames = new Set(
  (ontology.authorities ?? []).map((a) => String(a.shortName ?? "").toLowerCase()),
);

// ── 2. Layer integrity ──────────────────────────────────────────────────
// Field names match packages/ontology/src/types.ts (the canonical SPEC):
//   Obligation.originatingClauses[].authorityId
//   Control.satisfies[]            → Obligation.id
//   Control.crosswalk[].framework  → Authority.id (or shortName/code)
//   EvidenceObject.forControl      → Control.id (singular)
//   EvidenceObject.type            → EvidenceType (one of 12 kinds)
const authIdsLower = new Set([...authIds].map((s) => String(s).toLowerCase()));
function refsKnownAuthority(ref) {
  if (!ref) return false;
  const lower = String(ref).toLowerCase();
  // Normalise "ISO/IEC 27001" ↔ "ISO 27001" — the slash form and the
  // omitted-IEC form are commonly used interchangeably.
  const normaliseIso = (s) => s.replace(/\biso\/iec\b/g, "iso");
  const normLower = normaliseIso(lower);
  if (authIds.has(ref) || authIdsLower.has(lower)) return true;
  if (authShortNames.has(lower)) return true;
  for (const sn of authShortNames) {
    if (normaliseIso(sn) === normLower) return true;
  }
  // Accept short codes like "iso-27001" matching authority id "iso-27001@2022".
  for (const id of authIds) {
    if (String(id).toLowerCase().startsWith(lower + "@")) return true;
  }
  return false;
}

for (const o of ontology.obligations ?? []) {
  const clauses = o.originatingClauses ?? o.authorityRefs ?? [];
  if (!Array.isArray(clauses) || clauses.length === 0) {
    err("layer-integrity", "obligation has no originatingClauses", o.id);
    continue;
  }
  for (const c of clauses) {
    const authId = c?.authorityId ?? c?.authorityRef ?? c;
    if (!refsKnownAuthority(authId)) {
      err("layer-integrity", `obligation references missing authority '${authId}'`, o.id);
    }
  }
}
for (const c of ontology.controls ?? []) {
  const obls = c.satisfies ?? c.obligationRefs ?? [];
  if (!Array.isArray(obls) || obls.length === 0) {
    err("layer-integrity", "control has no satisfies[]", c.id);
    continue;
  }
  for (const ref of obls) {
    if (!oblIds.has(ref)) err("layer-integrity", `control references missing obligation '${ref}'`, c.id);
  }
}
for (const e of ontology.evidenceObjects ?? []) {
  const refs = e.forControl ? [e.forControl] : (e.controlRefs ?? []);
  if (!Array.isArray(refs) || refs.length === 0) {
    err("layer-integrity", "evidence has no forControl", e.id);
    continue;
  }
  for (const ref of refs) {
    if (!ctrlIds.has(ref)) err("layer-integrity", `evidence references missing control '${ref}'`, e.id);
  }
}

// ── 3. Crosswalk completeness ───────────────────────────────────────────
// Crosswalk entries reference frameworks by short code/name (per SPEC),
// not necessarily an Authority.id verbatim. Accept either form.
for (const c of ontology.controls ?? []) {
  for (const cw of c.crosswalk ?? []) {
    const ref = typeof cw === "string" ? cw : (cw.framework ?? cw.authorityId);
    if (ref && !refsKnownAuthority(ref)) {
      err("crosswalk", `control crosswalk references unknown framework '${ref}'`, c.id);
    }
  }
}

// ── 4. ID prefix discipline ─────────────────────────────────────────────
const prefixes = {
  obligations: /^OBL-/,
  controls: /^CTRL-/,
  evidenceObjects: /^EV-/,
  architectureRequirements: /^ARCH-/,
  policies: /^POL-/,
};
for (const [kind, re] of Object.entries(prefixes)) {
  for (const e of ontology[kind] ?? []) {
    if (!re.test(e.id ?? "")) err("id-prefix", `${kind} entry has non-conformant id (must match ${re})`, e.id);
  }
}

// ── 5. Evidence schema validity ─────────────────────────────────────────
// Lightweight validator: required fields + pattern check for `id` only.
// A full JSON Schema engine would pull in ajv; we keep this dep-free so it
// runs anywhere.
const schemaCache = {};
function loadSchema(kind) {
  if (schemaCache[kind]) return schemaCache[kind];
  const path = join(schemasDir, `${kind}.schema.json`);
  try {
    schemaCache[kind] = JSON.parse(readFileSync(path, "utf-8"));
  } catch {
    schemaCache[kind] = null;
  }
  return schemaCache[kind];
}
// Evidence schema check: validates the catalogue entry has the *minimum*
// shape (id, title, type, owner, source, frequency, retentionYears) per
// types.ts EvidenceObject — the per-kind schema in ../schemas/ applies to
// the evidence *artefact body*, not the catalogue entry. Catalogue entry
// only needs to declare a known kind.
// Per types.ts EvidenceType union (16 canonical kinds: the 12 baseline
// kinds + 4 specialised AI/ops kinds — model-card, data-card,
// audit-trail-export, access-review). Implementations may extend the
// union but MUST publish a JSON Schema for any custom kind.
const KNOWN_EVIDENCE_TYPES = [
  "policy","procedure","log","screenshot","report","attestation",
  "configuration","training_record","training-record",
  "incident_record","incident-record","fria","dpia","contract",
  "model-card","data-card","audit-trail-export","access-review",
];
for (const e of ontology.evidenceObjects ?? []) {
  const kind = e.type ?? e.kind;
  if (!kind) { err("evidence-schema", "evidence has no type", e.id); continue; }
  if (!KNOWN_EVIDENCE_TYPES.includes(kind)) {
    err("evidence-schema", `unknown evidence type '${kind}' (must be one of ${KNOWN_EVIDENCE_TYPES.join(",")})`, e.id);
  }
  // Catalogue entry minimums.
  for (const f of ["title", "owner", "frequency", "retentionYears"]) {
    if (e[f] === undefined || e[f] === null || e[f] === "") {
      err("evidence-schema", `evidence missing catalogue field '${f}'`, e.id);
    }
  }
  // Confirm there's a per-kind schema available for the artefact body.
  const schema = loadSchema(kind);
  if (!schema) {
    err("evidence-schema", `no JSON Schema published for evidence kind '${kind}'`, e.id);
  }
}

// ── Report ──────────────────────────────────────────────────────────────
if (errors.length === 0) {
  console.log("✅ Conformant — Compliance-to-Architecture v0.1");
  console.log("   authorities:    ", (ontology.authorities ?? []).length);
  console.log("   obligations:    ", (ontology.obligations ?? []).length);
  console.log("   controls:       ", (ontology.controls ?? []).length);
  console.log("   evidence:       ", (ontology.evidenceObjects ?? []).length);
  console.log("   architecture:   ", (ontology.architectureRequirements ?? []).length);
  console.log("   policies:       ", (ontology.policies ?? []).length);
  // 12-layer extension counts (v0.1.0 first-class types)
  console.log("   risk-scenarios: ", (ontology.riskScenarios ?? []).length);
  console.log("   jurisdictions:  ", (ontology.jurisdictions ?? []).length);
  console.log("   regulators:     ", (ontology.regulators ?? []).length);
  console.log("   applicability:  ", (ontology.applicabilityRules ?? []).length);
  console.log("   mitigations:    ", (ontology.mitigations ?? []).length);
  console.log("   workflows:      ", (ontology.workflows ?? []).length);
  console.log("   audit-packs:    ", (ontology.auditPacks ?? []).length);
  console.log("   control-tests:  ", (ontology.controlTests ?? []).length);
  console.log("   monitors:       ", (ontology.monitorBindings ?? []).length);
  console.log("   crosswalk-rels: ", (ontology.crosswalkRelations ?? []).length);
  if (layerWarnings.length > 0) {
    console.log("");
    for (const w of layerWarnings) console.log("⚠ ", w);
  }
  process.exit(0);
} else {
  console.error(`❌ Non-conformant — ${errors.length} violation(s):`);
  for (const e of errors) {
    console.error(`  [${e.rule}] ${e.id}: ${e.msg}`);
  }
  process.exit(1);
}

void readdirSync;
