#!/usr/bin/env node
// Conformance validator for @regunav/dictionaries files against
// schemas/dictionary.schema.json. Zero external deps — Node ≥18.
// Apache-2.0.
//
// Usage:
//   node packages/ontology/conformance/validate-dictionaries.mjs [<dir>]
//
// Default dir: packages/dictionaries/dictionaries

import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, dirname, resolve, basename } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(here, "..", "..", "..");
const defaultDir = join(repoRoot, "packages", "dictionaries", "dictionaries");

const target = process.argv[2] ? resolve(process.argv[2]) : defaultDir;

if (!statSync(target, { throwIfNoEntry: false })?.isDirectory()) {
  console.error(`✗ not a directory: ${target}`);
  process.exit(2);
}

const SCHEMA_CATEGORIES = new Set([
  "obligation-category",
  "control-category",
  "evidence-type",
  "evidence-frequency",
  "authority-category",
  "architecture-capability",
  "actor-role",
  "reason-code",
  "jurisdiction",
  "regulator",
  "risk-class",
]);

const SEMVER = /^[0-9]+\.[0-9]+\.[0-9]+$/;
const DICT_ID = /^regunav:dictionary:[a-z0-9-]+$/;
const TERM_ID = /^[a-z0-9-]+:[a-z0-9._-]+$/;

const errors = [];
const fail = (file, msg) => errors.push({ file, msg });

const files = readdirSync(target).filter((f) => f.endsWith(".json")).sort();
if (files.length === 0) {
  console.error(`✗ no .json files under ${target}`);
  process.exit(2);
}

let totalTerms = 0;

for (const f of files) {
  const path = join(target, f);
  let doc;
  try {
    doc = JSON.parse(readFileSync(path, "utf-8"));
  } catch (e) {
    fail(f, `invalid JSON: ${e.message}`);
    continue;
  }

  if (doc.schemaVersion !== "regunav.dictionary.v1") {
    fail(f, `schemaVersion must be 'regunav.dictionary.v1' (got ${JSON.stringify(doc.schemaVersion)})`);
  }
  if (!DICT_ID.test(doc.id ?? "")) {
    fail(f, `id must match ${DICT_ID} (got ${JSON.stringify(doc.id)})`);
  }
  if (!doc.displayName || typeof doc.displayName !== "string") {
    fail(f, "displayName is required");
  }
  if (!SEMVER.test(doc.version ?? "")) {
    fail(f, `version must match ${SEMVER} (got ${JSON.stringify(doc.version)})`);
  }
  if (typeof doc.publishedAt !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(doc.publishedAt)) {
    fail(f, `publishedAt must be YYYY-MM-DD (got ${JSON.stringify(doc.publishedAt)})`);
  }
  if (!SCHEMA_CATEGORIES.has(doc.category)) {
    fail(f, `category must be one of ${[...SCHEMA_CATEGORIES].join(", ")} (got ${JSON.stringify(doc.category)})`);
  }

  // Filename ↔ category contract: file basename equals category slug.
  const expectedBase = `${doc.category}.json`;
  if (basename(path) !== expectedBase) {
    fail(f, `filename must match category (expected ${expectedBase})`);
  }

  // id ↔ category contract: id ends with the category slug.
  if (DICT_ID.test(doc.id ?? "") && !doc.id.endsWith(`:${doc.category}`)) {
    fail(f, `id '${doc.id}' must end with ':${doc.category}'`);
  }

  if (!Array.isArray(doc.terms) || doc.terms.length === 0) {
    fail(f, "terms must be a non-empty array");
    continue;
  }

  const seenIds = new Set();
  const seenTerms = new Set();
  for (const t of doc.terms) {
    if (!TERM_ID.test(t.id ?? "")) {
      fail(f, `term id must match ${TERM_ID} (got ${JSON.stringify(t.id)})`);
    } else {
      // term id prefix must equal the dictionary category.
      const [prefix] = t.id.split(":", 1);
      if (prefix !== doc.category) {
        fail(f, `term id '${t.id}' has prefix '${prefix}' but dictionary category is '${doc.category}'`);
      }
    }
    if (seenIds.has(t.id)) fail(f, `duplicate term id '${t.id}'`);
    seenIds.add(t.id);

    if (typeof t.term !== "string" || t.term.length === 0) {
      fail(f, `term key required (id=${t.id})`);
    } else {
      if (seenTerms.has(t.term)) fail(f, `duplicate term key '${t.term}'`);
      seenTerms.add(t.term);
    }
    if (typeof t.definition !== "string" || t.definition.length === 0) {
      fail(f, `term '${t.term}' missing definition`);
    }
    if (t.deprecated && (!t.deprecated.since || !t.deprecated.replacedBy)) {
      fail(f, `term '${t.term}' deprecated block must have since + replacedBy`);
    }
    totalTerms++;
  }
}

if (errors.length === 0) {
  console.log(`✅ Dictionaries conformant — ${files.length} dictionar${files.length === 1 ? "y" : "ies"}, ${totalTerms} terms.`);
  process.exit(0);
}

console.error(`❌ Non-conformant — ${errors.length} violation(s):`);
for (const e of errors) console.error(`  [${e.file}] ${e.msg}`);
process.exit(1);
