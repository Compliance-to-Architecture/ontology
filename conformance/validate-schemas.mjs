#!/usr/bin/env node
/**
 * Schema + Examples validation harness.
 *
 * For every `packages/ontology/schemas/X.schema.json`, find the
 * companion `packages/ontology/examples/X.example.json`. Validate
 * the example against the schema (AJV, Draft-07, all errors).
 *
 * Fails with non-zero exit code if any example does not validate, or
 * if any schema doesn't have a paired example to keep it honest.
 *
 * Schemas that intentionally have no example file (because they are
 * referenced-only — like `dictionary.schema.json` which is used by
 * `framework.schema.json`) are listed in `NO_EXAMPLE_REQUIRED` below.
 *
 * Apache-2.0. Copyright (c) 2026 Regunav Inc.
 *
 * Usage:
 *   node packages/ontology/conformance/validate-schemas.mjs
 *
 * Exit codes:
 *   0  all good
 *   1  one or more example failed schema validation
 *   2  one or more schema is missing a paired example
 */

import { readFileSync, readdirSync, existsSync } from "node:fs";
import { dirname, join, basename } from "node:path";
import { fileURLToPath } from "node:url";

import Ajv from "ajv/dist/2019.js";
import draft07MetaSchema from "ajv/dist/refs/json-schema-draft-07.json" with { type: "json" };
import addFormats from "ajv-formats";

const here = dirname(fileURLToPath(import.meta.url));
const SCHEMAS_DIR = join(here, "..", "schemas");
const EXAMPLES_DIR = join(here, "..", "examples");

// Schemas that intentionally have no paired `examples/<name>.example.json`.
// Each entry has a justification — the schema is exercised elsewhere
// (a manifest folder, a per-framework data file, a sample audit pack,
// the seed dataset, or a runtime adapter), so the example would be
// duplicated content. New ENTRIES MUST CITE the actual exerciser.
const NO_EXAMPLE_REQUIRED = new Set([
  // Framework / manifest internals — exercised by real data, not examples.
  "dictionary.schema.json",             // referenced by framework.schema.json; real instances under packages/dictionaries/dictionaries/
  "manifest.schema.json",               // exercised by packages/frameworks/manifests/*.manifest.json
  "rule-pack-manifest.schema.json",     // exercised by packages/frameworks/applicability/*.applicability.json
  "profile.schema.json",                // exercised by packages/ontology/profiles/*.profile.json
  // Evidence-type schemas — each kind is exercised by the corresponding
  // sample-audit-pack in packages/sample-audit-packs/ (SOC2/EUAI/GDPR).
  // These twelve track the 12-kind EvidenceType union in @regunav/types.
  "policy.schema.json",
  "procedure.schema.json",
  "log.schema.json",
  "screenshot.schema.json",
  "report.schema.json",
  "attestation.schema.json",
  "configuration.schema.json",
  "training_record.schema.json",
  "incident_record.schema.json",
  "fria.schema.json",                   // exercised by sample-audit-packs/EUAI-HIGH-RISK-AUDIT-PACK.md Art. 27
  "dpia.schema.json",                   // exercised by sample-audit-packs/GDPR-DSAR-AUDIT-PACK.md
  "contract.schema.json",
  // Extended ontology objects — exercised by the runtime + seed dataset.
  "applicability-rule.schema.json",     // exercised by packages/frameworks/applicability/*.applicability.json
  "audit-pack.schema.json",             // exercised by sample-audit-packs/ (md form)
  "audit-trail-export.schema.json",     // exercised by runtime; example would duplicate the export format spec
  "data-card.schema.json",              // exercised by AI-system seed (packages/ontology/src/seed.ts)
  "model-card.schema.json",             // ditto
  "jurisdiction.schema.json",           // exercised by packages/ontology/src/seed.ts JURISDICTIONS
  "risk-scenario.schema.json",          // exercised by seed.ts
  "mitigation.schema.json",             // exercised by seed.ts
  "access-review.schema.json",          // exercised by sample-audit-packs/SOC2-IAM-AUDIT-PACK.md TEST block
]);

// ─── Build the AJV instance ────────────────────────────────────────────────

const ajv = new Ajv({
  // Many of the schemas use Draft-07 ("$schema":"http://json-schema.org/draft-07/schema#").
  // Some use Draft-2019. We add the draft-07 meta-schema explicitly.
  allErrors: true,
  strict: false,
  validateFormats: true,
  // Some schemas reference each other; allow that without choking on
  // unrecognised $id formats.
  allowMatchingProperties: true,
});
ajv.addMetaSchema(draft07MetaSchema);
addFormats.default(ajv);

// ─── Walk schemas ──────────────────────────────────────────────────────────

const schemaFiles = readdirSync(SCHEMAS_DIR).filter((f) => f.endsWith(".schema.json"));
const failures = [];
const missingExamples = [];
let okCount = 0;

console.log(`Validating ${schemaFiles.length} schemas in ${SCHEMAS_DIR}`);

for (const schemaFile of schemaFiles) {
  const schemaPath = join(SCHEMAS_DIR, schemaFile);
  const exampleFile = schemaFile.replace(/\.schema\.json$/, ".example.json");
  const examplePath = join(EXAMPLES_DIR, exampleFile);

  let schema;
  try {
    schema = JSON.parse(readFileSync(schemaPath, "utf8"));
  } catch (e) {
    failures.push({ schema: schemaFile, where: "load-schema", error: String(e) });
    continue;
  }

  let validate;
  try {
    validate = ajv.compile(schema);
  } catch (e) {
    failures.push({ schema: schemaFile, where: "compile-schema", error: String(e) });
    continue;
  }

  if (!existsSync(examplePath)) {
    if (NO_EXAMPLE_REQUIRED.has(schemaFile)) {
      console.log(`  ⊘ ${schemaFile} — no example required`);
      continue;
    }
    missingExamples.push(schemaFile);
    continue;
  }

  let example;
  try {
    example = JSON.parse(readFileSync(examplePath, "utf8"));
  } catch (e) {
    failures.push({ schema: schemaFile, where: "load-example", error: String(e) });
    continue;
  }

  // Examples are sometimes a single record, sometimes an array of records.
  // Validate every record under the same schema.
  const records = Array.isArray(example) ? example : [example];
  let allValid = true;
  for (const [i, record] of records.entries()) {
    if (!validate(record)) {
      allValid = false;
      failures.push({
        schema: schemaFile,
        where: `example record ${i}`,
        errors: validate.errors,
      });
    }
  }
  if (allValid) {
    okCount++;
    console.log(`  ✓ ${schemaFile} — ${records.length} record(s) valid`);
  } else {
    console.log(`  ✗ ${schemaFile} — INVALID`);
  }
}

// ─── Report ────────────────────────────────────────────────────────────────

console.log("");
console.log(`Result: ${okCount} schema(s) validated cleanly.`);

if (missingExamples.length > 0) {
  console.error(`\nMissing example file for ${missingExamples.length} schema(s):`);
  for (const s of missingExamples) {
    console.error(`  - ${s}  →  expected ${s.replace(/\.schema\.json$/, ".example.json")}`);
  }
  console.error(`\nEither add the example file, or add the schema name to NO_EXAMPLE_REQUIRED in this script with a justification.`);
}

if (failures.length > 0) {
  console.error(`\n${failures.length} validation failure(s):`);
  for (const f of failures) {
    console.error(`\n  [${f.schema}] @ ${f.where}`);
    if (f.error) console.error(`    ${f.error}`);
    if (f.errors) {
      for (const e of f.errors) {
        console.error(`    - ${e.instancePath || "<root>"} ${e.message} (${e.keyword})`);
      }
    }
  }
}

if (failures.length > 0) process.exit(1);
if (missingExamples.length > 0) process.exit(2);
process.exit(0);
