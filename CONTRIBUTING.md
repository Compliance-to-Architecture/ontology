# Contributing

The Compliance-to-Architecture Framework is intentionally open. We
welcome contributions across these tracks:

| Track | Examples |
|---|---|
| **Authority decomposition** | Adding a new regulation as `implemented` (clauses → obligations → controls). |
| **Crosswalk improvements** | Refining the `confidence` rating or `relation` between authorities for a specific obligation. |
| **Reference implementations** | Cerbos / OPA / Cedar / Casbin policy bundles, IaC patterns (AWS / Azure / GCP / on-prem). |
| **Schema extensions** | New evidence types, applicability rules, mitigation patterns. |
| **Bug fixes** | Conformance violations, broken citations, dead links, JSON Schema errors. |

## Before you start

- **Read** `METHODOLOGY.md`. PRs that violate the methodology are
  closed without merge.
- **Open an issue** describing the proposed change before writing code,
  unless it's a typo or a one-line fix.
- **Disclose commercial interest.** If your employer benefits
  commercially from a mapping you propose, say so in the PR body. We
  won't reject it; we'll just need additional reviewer attribution.

## Authority-decomposition PRs

These are the most consequential PRs. Required:

1. **Cite the authority + version explicitly** in the PR body
   (`pci-dss@4.0.1`, link to the publisher's authoritative copy).
2. **List every obligation** you're proposing, with:
   - The clause it derives from
   - Which actor bears it (`provider` / `deployer` / `controller` /
     `processor` / etc.)
   - A test-ability statement ("this is how an auditor would test
     compliance")
3. **For each control** you're cross-walking against the new authority,
   record the `confidence` rating (`high` / `medium` / `low`) and the
   `relation` (`equivalent` / `overlaps` / `stricter_than` / etc.).
4. **Reviewer attribution** — name a reviewer with credentials (e.g.
   "Reviewed by J. Smith, Certified ISO 27001 Lead Auditor"). Anonymous
   PRs cannot promote authorities to `implemented` status. Anonymous
   PRs may land in `mapped` status only.

## Reference-implementation PRs

For Cerbos / OPA / Cedar / Casbin bundles:

- Bundle MUST compile (run the engine's `compile` / `validate` command).
- Include a `README.md` explaining what control(s) the bundle implements.
- Include a `tests/` directory with positive + negative cases.
- Use the **same derived-role pattern** as the existing reference
  bundle (`tenant_member`, `tenant_admin_only`, `four_eyes_approver`,
  `region_match`, `business_hours_or_breakglass`) — this preserves the
  cross-bundle invariants the framework promises.

For Terraform / Pulumi / CDK patterns:

- Pattern MUST be runnable (no pseudocode).
- Include the resource IDs that the corresponding `EvidenceObject` of
  kind `configuration` will reference.
- Target ~50 LoC per pattern. If yours is larger, split it.

## Schema-extension PRs

For new evidence types, applicability rules, or mitigation patterns:

- Update `src/types.ts` with the new TypeScript type.
- Add the JSON Schema under `schemas/<kind>.schema.json`.
- Add the kind to `schemas/index.json`.
- Update the conformance validator's `KNOWN_EVIDENCE_TYPES` list.
- Add at least one worked example to `src/seed.ts`.
- Run `node conformance/validate.mjs` and confirm it passes.

## Pull-request checklist

- [ ] Issue referenced (if non-trivial)
- [ ] Authority cited with version (if obligation/control work)
- [ ] Reviewer attributed (if `implemented` status sought)
- [ ] Conformance validator passes (`node conformance/validate.mjs`)
- [ ] CHANGELOG.md updated under `[Unreleased]`
- [ ] Methodology requirements met (`METHODOLOGY.md`)
- [ ] No paywalled text reproduced (ISO outline-only is OK; full text is not)
- [ ] LEGAL_DISCLAIMER.md still applies (you have not made the framework
      claim it certifies anything)

## Code of conduct

Civil, evidence-based discussion. If you disagree with a mapping, cite
the authority text. If you disagree with the methodology, propose a
specific change to `METHODOLOGY.md`. We will not adjudicate disputes
based on opinion.

## Commercial use

The framework is Apache-2.0. Commercial use of the **content** is
permitted under the licence. Commercial use of the **trademarks**
("Compliance-to-Architecture Framework", "ReguNav") requires a separate
written licence — see `TRADEMARKS.md` at the repository root.
