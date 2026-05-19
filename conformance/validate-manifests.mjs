#!/usr/bin/env node
// Conformance validator for rule-pack manifests against
// schemas/manifest.schema.json and schemas/rule-pack-manifest.schema.json.
// Zero external deps — pure Node ≥18.
// Apache-2.0.
//
// Usage:
//   node packages/ontology/conformance/validate-manifests.mjs [<dir>]
//
// Default dir: packages/frameworks/manifests/

import { readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join, resolve, basename } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(here, "..", "..", "..");
const defaultDir = join(repoRoot, "packages", "frameworks", "manifests");

const target = process.argv[2] ? resolve(process.argv[2]) : defaultDir;

if (!statSync(target, { throwIfNoEntry: false })?.isDirectory()) {
  console.error(`✗ not a directory: ${target}`);
  process.exit(2);
}

const errors = [];
const fail = (file, msg) => errors.push({ file, msg });

const SEMVER = /^[0-9]+\.[0-9]+\.[0-9]+$/;
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const MANIFEST_ID = /^regunav:manifest:rule-pack:[a-z0-9][a-z0-9.-]*:[0-9]+\.[0-9]+\.[0-9]+$/;
const DICT_ID = /^regunav:dictionary:[a-z0-9-]+(@[0-9]+\.[0-9]+\.[0-9]+)?$/;
const PROFILE_ID = /^regunav\.(core|conformance|connector)\.v[0-9]+$/;
const AUTHORITY_ID = /^[a-z][a-z0-9-]*@[a-z0-9.-]+$/;
const RULE_GROUP = /^[a-z][a-z0-9_-]*$/;
const VALID_STATUSES = new Set(["active", "preview", "deprecated", "retired"]);
const VALID_KINDS = new Set(["rule-pack"]);

const files = readdirSync(target).filter((f) => f.endsWith(".manifest.json")).sort();
if (files.length === 0) {
  console.error(`✗ no .manifest.json files under ${target}`);
  process.exit(2);
}

const seenIds = new Set();
const seenSlugs = new Set();

for (const f of files) {
  const path = join(target, f);
  let doc;
  try {
    doc = JSON.parse(readFileSync(path, "utf-8"));
  } catch (e) {
    fail(f, `invalid JSON: ${e.message}`);
    continue;
  }

  if (doc.schemaVersion !== "regunav.manifest.v1")
    fail(f, `schemaVersion must be 'regunav.manifest.v1' (got ${JSON.stringify(doc.schemaVersion)})`);

  if (!VALID_KINDS.has(doc.kind))
    fail(f, `kind must be one of ${[...VALID_KINDS].join(", ")} (got ${JSON.stringify(doc.kind)})`);

  if (!MANIFEST_ID.test(doc.id ?? ""))
    fail(f, `id must match ${MANIFEST_ID} (got ${JSON.stringify(doc.id)})`);

  if (typeof doc.displayName !== "string" || !doc.displayName.length)
    fail(f, "displayName required");

  if (!SEMVER.test(doc.version ?? ""))
    fail(f, `version must be semver (got ${JSON.stringify(doc.version)})`);

  if (!ISO_DATE.test(doc.publishedAt ?? ""))
    fail(f, `publishedAt must be YYYY-MM-DD`);

  if (!doc.publisher?.name) fail(f, "publisher.name required");
  if (typeof doc.license !== "string" || !doc.license.length) fail(f, "license required");
  if (!VALID_STATUSES.has(doc.status)) fail(f, `status must be one of ${[...VALID_STATUSES].join(", ")}`);

  // id ↔ filename ↔ slug consistency
  const m = (doc.id ?? "").match(/^regunav:manifest:rule-pack:([a-z0-9][a-z0-9.-]*):([0-9]+\.[0-9]+\.[0-9]+)$/);
  if (m) {
    const slug = m[1];
    const ver = m[2];
    if (ver !== doc.version) fail(f, `id version (${ver}) does not match doc.version (${doc.version})`);
    const expected = `${slug}.manifest.json`;
    if (basename(path) !== expected) fail(f, `filename '${basename(path)}' does not match slug '${slug}' (expected '${expected}')`);
    if (seenSlugs.has(slug)) fail(f, `duplicate rule-pack slug '${slug}'`);
    seenSlugs.add(slug);
  }

  if (seenIds.has(doc.id)) fail(f, `duplicate manifest id`);
  seenIds.add(doc.id);

  for (const d of doc.requiredDictionaries ?? []) {
    if (!DICT_ID.test(d)) fail(f, `requiredDictionaries: invalid dictionary id '${d}'`);
  }
  for (const p of doc.requiredProfiles ?? []) {
    if (!PROFILE_ID.test(p)) fail(f, `requiredProfiles: invalid profile id '${p}'`);
  }

  // payload
  const p = doc.payload;
  if (!p || typeof p !== "object") {
    fail(f, "payload required");
    continue;
  }
  if (!p.authority?.id || !AUTHORITY_ID.test(p.authority.id))
    fail(f, `authority.id must match ${AUTHORITY_ID} (got ${JSON.stringify(p.authority?.id)})`);
  if (!p.authority?.shortName) fail(f, "authority.shortName required");
  if (!p.authority?.citation) fail(f, "authority.citation required");
  if (!Array.isArray(p.jurisdictions) || p.jurisdictions.length === 0)
    fail(f, "jurisdictions must be non-empty array");
  if (!Array.isArray(p.includedRuleGroups) || p.includedRuleGroups.length === 0)
    fail(f, "includedRuleGroups must be non-empty array");
  for (const g of p.includedRuleGroups ?? [])
    if (!RULE_GROUP.test(g)) fail(f, `includedRuleGroups: invalid group name '${g}'`);
  // dedupe within the array
  if (new Set(p.includedRuleGroups ?? []).size !== (p.includedRuleGroups ?? []).length)
    fail(f, "includedRuleGroups contains duplicates");

  if (!p.artefacts || typeof p.artefacts !== "object")
    fail(f, "artefacts required");
}

if (errors.length === 0) {
  console.log(`✅ Rule-pack manifests conformant — ${files.length} manifest${files.length === 1 ? "" : "s"}.`);
  process.exit(0);
}

console.error(`❌ Non-conformant — ${errors.length} violation(s):`);
for (const e of errors) console.error(`  [${e.file}] ${e.msg}`);
process.exit(1);
