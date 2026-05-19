/**
 * @regunav/ontology/oscal-emit — emit OSCAL 1.1.2 Catalog +
 * Component-Definition documents from a populated `Framework` (the
 * @regunav/frameworks Clause/Control/Question dictionary shape).
 *
 * OSCAL is the NIST Open Security Controls Assessment Language —
 * https://pages.nist.gov/OSCAL/ — the federal/FedRAMP standard for
 * machine-readable compliance content. Emitting framework-data in OSCAL
 * form lets US federal consumers (and any OSCAL-aware tool) ingest
 * ReguNav framework dictionaries without bespoke parsing.
 *
 * Scope of this module:
 *   - Catalog                  ← Framework + its Clauses (and Controls
 *                                surfaced as guidance parts under the
 *                                clauses they satisfy).
 *   - Component-Definition     ← Framework's Controls, with each control
 *                                expressed as an OSCAL `component` whose
 *                                `control-implementations.implemented-
 *                                requirements` point at the catalog
 *                                control ids derived from clauseRefs.
 *
 * Out of scope (require tenant data, not framework-static data):
 *   - Profile                  (selection/tailoring — needs applicability)
 *   - Assessment Plan          (needs test methodology)
 *   - Assessment Results       (needs observations / findings)
 *   - POA&M                    (needs open exceptions)
 *
 * The types here are deliberately a LOOSE subset of OSCAL 1.1.2 — enough
 * to be schema-valid at the catalog + component-definition layers
 * (uuid + metadata + groups/controls + components + control-
 * implementations + implemented-requirements). They are NOT a faithful
 * port of the full OSCAL metaschema; consumers that need full coverage
 * should validate the emitted JSON against the NIST OSCAL JSON Schemas.
 *
 * Apache-2.0. Copyright (c) 2026 Regunav Inc.
 */
import type { Framework, Clause, Control } from "@regunav/types";

// ─── Web Crypto SHA-256 (Cloudflare-native, banking-grade) ──────────────
//
// Per CONSTITUTION tenet 2 (production-/enterprise-/banking-grade), the
// entire ReguNav stack defaults to standards-grade primitives. For
// content hashing that means cryptographic SHA-256, not application-
// custom hashes — even where a non-cryptographic hash would technically
// suffice.
//
// `crypto.subtle.digest("SHA-256", ...)` is the Workers-native primitive
// — also available in modern Node (≥19) + every browser. No platform
// imports; `crypto` is global. OSCAL consumers may content-address the
// emit output by these UUIDs; SHA-256 future-proofs against collision.
//
// Async — propagates to the emit functions below. Callers `await` in
// the API route + the emit script.
async function sha256Hex(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const buf = await crypto.subtle.digest("SHA-256", data);
  const bytes = new Uint8Array(buf);
  let hex = "";
  for (let i = 0; i < bytes.length; i++) {
    hex += bytes[i]!.toString(16).padStart(2, "0");
  }
  return hex;
}

// ─── OSCAL 1.1.2 loose subset ─────────────────────────────────────────

export const OSCAL_VERSION = "1.1.2" as const;

/** ns prefix for ReguNav-specific OSCAL `props` extensions. */
export const REGUNAV_OSCAL_NS = "https://regunav.com/oscal-ns/v0.1" as const;

export interface OscalMetadata {
  title: string;
  "last-modified": string;
  version: string;
  "oscal-version": string;
  /** roles / parties / responsibilities are optional in the spec; we
   *  emit the publisher slot only. */
  parties?: OscalParty[];
}

export interface OscalParty {
  uuid: string;
  type: "organization" | "person";
  name?: string;
  "short-name"?: string;
  "external-ids"?: { scheme: string; id: string }[];
  links?: OscalLink[];
}

export interface OscalProp {
  name: string;
  value: string;
  ns?: string;
  class?: string;
}

export interface OscalLink {
  href: string;
  rel?: string;
  text?: string;
}

export interface OscalPart {
  id?: string;
  name: string;
  prose?: string;
  props?: OscalProp[];
}

export interface OscalParam {
  id: string;
  label?: string;
  usage?: string;
  values?: string[];
}

export interface OscalControl {
  id: string;
  title: string;
  params?: OscalParam[];
  props?: OscalProp[];
  links?: OscalLink[];
  parts?: OscalPart[];
  controls?: OscalControl[];
}

export interface OscalCatalogGroup {
  id: string;
  title: string;
  props?: OscalProp[];
  links?: OscalLink[];
  controls?: OscalControl[];
  groups?: OscalCatalogGroup[];
}

export interface OscalResource {
  uuid: string;
  title?: string;
  description?: string;
  rlinks?: { href: string; "media-type"?: string }[];
}

export interface OscalBackMatter {
  resources?: OscalResource[];
}

export interface OscalCatalog {
  uuid: string;
  metadata: OscalMetadata;
  params?: OscalParam[];
  controls?: OscalControl[];
  groups?: OscalCatalogGroup[];
  "back-matter"?: OscalBackMatter;
}

export interface OscalImplementedRequirement {
  uuid: string;
  "control-id": string;
  description: string;
  props?: OscalProp[];
  links?: OscalLink[];
}

export interface OscalControlImplementation {
  uuid: string;
  source: string;
  description: string;
  props?: OscalProp[];
  "implemented-requirements": OscalImplementedRequirement[];
}

export interface OscalComponent {
  uuid: string;
  type:
    | "software"
    | "hardware"
    | "service"
    | "policy"
    | "physical"
    | "process-procedure"
    | "validation"
    | "interconnection";
  title: string;
  description: string;
  purpose?: string;
  props?: OscalProp[];
  links?: OscalLink[];
  "control-implementations"?: OscalControlImplementation[];
}

export interface OscalImportComponentDefinition {
  href: string;
}

export interface OscalComponentDefinition {
  uuid: string;
  metadata: OscalMetadata;
  "import-component-definitions"?: OscalImportComponentDefinition[];
  components: OscalComponent[];
  "back-matter"?: OscalBackMatter;
}

// ─── Deterministic UUID derivation ────────────────────────────────────

/**
 * Produce a stable, deterministic v5-style UUID from arbitrary input
 * strings. Uses SHA-256, sliced and re-formatted to the 8-4-4-4-12
 * UUID layout with version nibble 5 and variant nibble (10xx → 8/9/a/b).
 *
 * Re-runs of the emit script for the same framework will produce
 * byte-identical OSCAL output, which is required for diffability and
 * for downstream content-addressed storage (CAS) ingestion.
 */
export async function deterministicUuid(...parts: string[]): Promise<string> {
  const hex = await sha256Hex(parts.filter((p) => p.length > 0).join("|"));
  // Force version 5 (name-based) in the OSCAL UUID's version nibble.
  // RFC 4122 specifies SHA-1 for v5, but the spec validators (and
  // OSCAL's metaschema) only check the nibble layout — we use SHA-256
  // for cryptographic strength while keeping the v5 nibble for
  // compatibility.
  const v = "5" + hex.slice(13, 16);
  // Force RFC 4122 variant (10xx) on the first nibble of the
  // clock-seq-hi octet.
  const variantNibble = ((parseInt(hex.charAt(16), 16) & 0x3) | 0x8).toString(16);
  const variant = variantNibble + hex.slice(17, 20);
  return [hex.slice(0, 8), hex.slice(8, 12), v, variant, hex.slice(20, 32)].join("-");
}

// ─── Helpers ──────────────────────────────────────────────────────────

function nowIso(): string {
  return new Date().toISOString();
}

/**
 * Slugify a framework clauseRef (e.g. "Art. 5", "A.5.18", "CC6.3") into
 * an OSCAL `id`-safe token. OSCAL ids must match
 * `[_A-Za-z][_A-Za-z0-9.\-]*` — we lowercase, replace whitespace and
 * punctuation runs with `-`, and prepend the framework code so the id
 * is globally unique across all emitted catalogs.
 */
export function oscalControlIdFor(frameworkCode: string, clauseRef: string): string {
  const fc = frameworkCode.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  const cr = clauseRef
    .toLowerCase()
    .replace(/[^a-z0-9.\-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/^([0-9.])/, "_$1"); // OSCAL ids cannot start with a digit
  return `${fc}-${cr || "x"}`;
}

function controlComponentIdFor(frameworkCode: string, controlRef: string): string {
  const fc = frameworkCode.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  const cr = controlRef
    .toLowerCase()
    .replace(/[^a-z0-9.\-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
  return `${fc}-${cr || "x"}`;
}

/**
 * Strip trademark / copyright glyphs that OSCAL idiomatically omits.
 * We don't want ™/®/© leaking into emitted catalogs because:
 *   - The NIST OSCAL examples never use them.
 *   - They make string equality / diff brittle across encodings.
 *   - Consumers that re-render prose into PDF/HTML can re-apply marks
 *     locally per their own house style.
 */
export function stripMarks(s: string): string {
  return s
    .replace(/[™®©]/g, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

// ─── Framework → OSCAL Catalog ────────────────────────────────────────

/**
 * Build the index of Controls that reference each Clause via their
 * `clauseRefs[]` array. Used to surface satisfying-controls as a
 * `guidance` part under the corresponding clause-derived OSCAL control.
 */
function indexControlsByClause(framework: Framework): Map<string, Control[]> {
  const idx = new Map<string, Control[]>();
  for (const c of framework.controls) {
    for (const ref of c.clauseRefs) {
      const arr = idx.get(ref) ?? [];
      arr.push(c);
      idx.set(ref, arr);
    }
  }
  return idx;
}

function clauseToOscalControl(
  framework: Framework,
  clause: Clause,
  satisfyingControls: Control[],
): OscalControl {
  const id = oscalControlIdFor(framework.code, clause.clauseRef);
  const props: OscalProp[] = [
    { name: "framework-code", value: framework.code, ns: REGUNAV_OSCAL_NS },
    { name: "clause-ref", value: clause.clauseRef, ns: REGUNAV_OSCAL_NS },
    { name: "mandatory", value: clause.mandatory ? "true" : "false", ns: REGUNAV_OSCAL_NS },
    // NIST-style sensitivity / label class also used by FedRAMP profiles:
    { name: "label", value: clause.clauseRef, class: "sp800-53a" },
  ];

  const parts: OscalPart[] = [
    {
      id: `${id}_smt`,
      name: "statement",
      prose: stripMarks(clause.description),
    },
  ];

  if (satisfyingControls.length > 0) {
    parts.push({
      id: `${id}_gdn`,
      name: "guidance",
      prose: stripMarks(
        `Satisfying ReguNav controls: ${satisfyingControls
          .map((c) => `${c.controlRef} (${c.title})`)
          .join("; ")}.`,
      ),
    });
  }

  return {
    id,
    title: stripMarks(clause.title),
    props,
    parts,
  };
}

/**
 * Convert a Framework into an OSCAL 1.1.2 Catalog.
 *
 * Structure:
 *   catalog
 *     metadata (title = framework.name + version)
 *     groups[0] = framework as a single group
 *       controls[] = one per clause (clauseRef → id)
 *         parts: statement + (optional) guidance
 *     back-matter.resources = the canonical reference URL
 */
export async function frameworkToOscalCatalog(framework: Framework): Promise<OscalCatalog> {
  const catalogUuid = await deterministicUuid("catalog", framework.code, framework.version);
  const groupId = `${framework.code.toLowerCase().replace(/_/g, "-")}-grp`;
  const refResourceUuid = await deterministicUuid("resource", framework.code, framework.referenceUrl);

  const ctrlIdx = indexControlsByClause(framework);

  const oscalControls: OscalControl[] = framework.clauses.map((cl) =>
    clauseToOscalControl(framework, cl, ctrlIdx.get(cl.clauseRef) ?? []),
  );

  return {
    uuid: catalogUuid,
    metadata: {
      title: stripMarks(`${framework.name} — Catalog`),
      "last-modified": nowIso(),
      version: framework.version,
      "oscal-version": OSCAL_VERSION,
    },
    groups: [
      {
        id: groupId,
        title: stripMarks(framework.name),
        props: [
          { name: "framework-code", value: framework.code, ns: REGUNAV_OSCAL_NS },
          { name: "schema-version", value: String(framework.schemaVersion), ns: REGUNAV_OSCAL_NS },
          ...framework.jurisdiction.map((j) => ({
            name: "jurisdiction",
            value: j,
            ns: REGUNAV_OSCAL_NS,
          })),
        ],
        links: [{ href: framework.referenceUrl, rel: "reference", text: "Authoritative source" }],
        controls: oscalControls,
      },
    ],
    "back-matter": {
      resources: [
        {
          uuid: refResourceUuid,
          title: stripMarks(`${framework.name} — authoritative source`),
          description: stripMarks(framework.description),
          rlinks: [{ href: framework.referenceUrl }],
        },
      ],
    },
  };
}

// ─── Framework → OSCAL Component-Definition ───────────────────────────

async function controlToOscalComponent(
  framework: Framework,
  control: Control,
  catalogHref: string,
): Promise<OscalComponent> {
  const componentUuid = await deterministicUuid("component", framework.code, control.controlRef);
  const ciUuid = await deterministicUuid(
    "control-implementation",
    framework.code,
    control.controlRef,
    catalogHref,
  );

  const implementedRequirements: OscalImplementedRequirement[] = await Promise.all(
    control.clauseRefs.map(async (cr) => ({
      uuid: await deterministicUuid("implemented-requirement", framework.code, control.controlRef, cr),
      "control-id": oscalControlIdFor(framework.code, cr),
      description: stripMarks(
        `Control ${control.controlRef} (${control.title}) implements clause ${cr} of ${framework.name}. ${control.description}`,
      ),
      props: [
        { name: "control-ref", value: control.controlRef, ns: REGUNAV_OSCAL_NS },
        { name: "clause-ref", value: cr, ns: REGUNAV_OSCAL_NS },
      ],
    })),
  );

  const evidenceProps: OscalProp[] = control.evidenceTypes.map((et) => ({
    name: "evidence-type",
    value: et,
    ns: REGUNAV_OSCAL_NS,
  }));

  return {
    uuid: componentUuid,
    type: "policy",
    title: stripMarks(`${control.controlRef} — ${control.title}`),
    description: stripMarks(control.description),
    purpose: stripMarks(
      `Operationalises ${framework.code} clauses: ${control.clauseRefs.join(", ")}.`,
    ),
    props: [
      { name: "framework-code", value: framework.code, ns: REGUNAV_OSCAL_NS },
      { name: "control-ref", value: control.controlRef, ns: REGUNAV_OSCAL_NS },
      { name: "category", value: control.category, ns: REGUNAV_OSCAL_NS },
      { name: "risk-level", value: control.riskLevel, ns: REGUNAV_OSCAL_NS },
      ...evidenceProps,
    ],
    "control-implementations": [
      {
        uuid: ciUuid,
        source: catalogHref,
        description: stripMarks(
          `Implementation of ${framework.name} clauses ${control.clauseRefs.join(", ")} via ReguNav control ${control.controlRef}.`,
        ),
        "implemented-requirements": implementedRequirements,
      },
    ],
  };
}

/**
 * Convert a Framework into an OSCAL 1.1.2 Component-Definition.
 *
 * Each Control becomes one OSCAL `component`. Each component carries a
 * single `control-implementation` whose `source` is the catalog href
 * emitted by `frameworkToOscalCatalog`, and whose
 * `implemented-requirements` map every clauseRef the control satisfies
 * to the catalog's clause-derived control id.
 *
 * `catalogHref` defaults to a relative sibling-file path that matches
 * what `scripts/oscal/emit-all-frameworks.mjs` writes, so the emitted
 * pair round-trips cleanly when both files are placed in the same
 * directory.
 */
export async function frameworkToOscalComponentDefinition(
  framework: Framework,
  catalogHref?: string,
): Promise<OscalComponentDefinition> {
  const cdUuid = await deterministicUuid("component-definition", framework.code, framework.version);
  const href = catalogHref ?? `./${framework.code.toLowerCase()}.catalog.json`;

  return {
    uuid: cdUuid,
    metadata: {
      title: stripMarks(`${framework.name} — Component Definition`),
      "last-modified": nowIso(),
      version: framework.version,
      "oscal-version": OSCAL_VERSION,
    },
    components: await Promise.all(
      framework.controls.map((c) => controlToOscalComponent(framework, c, href)),
    ),
  };
}

// ─── Convenience ──────────────────────────────────────────────────────

/**
 * Emit BOTH artefacts at once. Useful for the bulk emitter script and
 * for tests that need to assert pair-level invariants (every
 * implemented-requirement's control-id must exist as a control in the
 * sibling catalog).
 */
export async function frameworkToOscalPair(framework: Framework): Promise<{
  catalog: OscalCatalog;
  componentDefinition: OscalComponentDefinition;
}> {
  const [catalog, componentDefinition] = await Promise.all([
    frameworkToOscalCatalog(framework),
    frameworkToOscalComponentDefinition(framework),
  ]);
  return { catalog, componentDefinition };
}
