# Security

## Reporting a vulnerability

If you discover a security issue in the framework's:

- **Conformance validator** (`conformance/validate.mjs`)
- **Reference Cerbos bundle** (`examples/cerbos-bundle/`)
- **Reference IaC patterns** (`examples/iac/`)
- **Public spec endpoint** (`framework.regunav.com/spec.json`)
- **JSON Schemas** (`schemas/*.schema.json`)

email **security@regunav.com** with:

- A clear description of the issue.
- Steps to reproduce.
- The version of the framework affected (e.g. `v0.1.0`).
- Your suggested fix, if any.

We will acknowledge within 48 hours and aim to ship a fix within 14 days
for high-severity issues, 30 days for medium, 90 days for low.

## What is in scope

| In scope | Out of scope |
|---|---|
| Validator that accepts non-conformant input as conformant (false negative) | Validator rejecting conformant input (false positive — open a normal issue) |
| Cerbos bundle that allows an action it shouldn't | Stylistic preferences in the bundle |
| IaC pattern that creates an insecure-by-default resource | IaC pattern that doesn't suit your architecture |
| Spec endpoint serving stale / corrupted JSON | Spec endpoint serving content you disagree with — open an issue |
| Authority citation pointing to a malicious domain | Authority citation that's outdated — open an issue |

## What this framework cannot guarantee

The framework's *content* (obligations, controls, crosswalks) is
interpretive. A mapping that you believe is incorrect is **not** a
security issue; open a `mapping-dispute` issue under the governance
process (`GOVERNANCE.md`).

## Public disclosure

We follow a coordinated-disclosure model. After a fix ships, we publish
an advisory under `docs/security/<year>-<id>.md` with:

- Affected versions.
- Severity.
- The fix (PR + commit).
- Reporter credit (if requested).

## Supply chain

The framework's runtime artefacts (`conformance/validate.mjs`, JSON
Schemas, reference bundles) are pure-Node, zero-deps. We do not pull
third-party libraries into the conformance path. PRs that introduce
runtime dependencies into the conformance suite are rejected.

The framework's TypeScript types (`src/types.ts`) are devDeps only and
do not ship to runtime consumers.
