# Compliance-to-Architecture · Conformance Model (Levels 0-6)

**Status: draft, v0.1.** This document defines the public Conformance Model
for the ReguNav Compliance-to-Architecture Framework so that downstream
implementers can claim compatibility at a defined level. It complements
[`SPEC.md`](./SPEC.md) (the structural specification) and the
structural validator at
[`conformance/validate.mjs`](./conformance/validate.mjs) by giving each
claim a name, a precise requirement, the automated checks that cover
it, and a list of concrete artifacts already shipped in this repository
that satisfy it.

The model is cumulative: a Level-N implementation MUST satisfy Levels 0
through N. A claim of "Conformance Level N" without satisfying the lower
levels is invalid.

The per-level machine-readable description lives under
[`conformance/level-checks/`](./conformance/level-checks/), one JSON
file per level. Tools consuming this model SHOULD read the JSON, not the
Markdown, as the canonical source.

---

## Where the invariants live

The automated checks cited below are the 16 structural invariants
enforced by [`packages/frameworks/test/conformance.test.mjs`](../frameworks/test/conformance.test.mjs).
The header of that file documents each invariant; the short form is:

| Id | Invariant |
|----|-----------|
| I1 | `schemaVersion` is 1 |
| I2 | registry key === `framework.code` |
| I3 | `name` + `version` + `description` + `referenceUrl` are non-empty (and `referenceUrl` is http(s)) |
| I4 | `jurisdiction` is a non-empty list of ISO-3166-alpha-2 codes or a recognised sentinel (`GLOBAL`, `EU`, `EEA`, `UK`) |
| I5 | every Clause has a non-empty `clauseRef` + `title` + `description` |
| I6 | `clauseRef` values within a framework are unique |
| I7 | every Control has a non-empty `controlRef` + `title` + `description` (+ `category`) |
| I8 | `controlRef` values within a framework are unique |
| I9 | every `Control.evidenceTypes` is a non-empty subset of the 12-kind EvidenceType union |
| I10 | every `Control.clauseRefs` is non-empty AND each entry exists in the framework's clauses list |
| I11 | every `Control.riskLevel` is a valid `RiskLevel` |
| I12 | every Question has a non-empty `questionRef` + `text` + `category` |
| I13 | `questionRef` values within a framework are unique |
| I14 | every `Question.riskWeight` is in [0, 1] |
| I15 | every `Question.clauseRefs` is non-empty AND each entry exists in the framework's clauses list |
| I16 | no fabricated trademark / registered / copyright markers in user-facing strings |

Invariants I5-I15 are skipped (not failed) for frameworks whose clauses,
controls and questions arrays are all empty. That allows the suite to
ship alongside stubs and start enforcing the moment a framework is
populated.

The twelve `EvidenceType` values referenced by I9 are defined in
[`packages/types/src/index.ts`](../types/src/index.ts) as:
`policy`, `procedure`, `log`, `screenshot`, `report`, `attestation`,
`configuration`, `training_record`, `incident_record`, `fria`, `dpia`,
`contract`.

---

## Level 0 — Uses the terminology

A Level-0 implementer adopts the framework's public vocabulary without
yet committing to any data shape. It uses the canonical layer names
(Authority, Obligation, Control, Evidence, Architecture Requirement,
Policy-as-Code, Audit Trail, Audit Pack, Risk Scenario, Mitigation,
Workflow, AI System Governance, Monitor Binding) and the layer numbering
from [`SPEC.md`](./SPEC.md) when describing its system, slides, or
marketing material. Level 0 makes no claim about machine-readable data;
it is a documentation and communication baseline that lets the rest of
the model build on a shared dictionary.

### How to test conformance

Level 0 is documentation-only and is not directly exercised by
`packages/frameworks/test/conformance.test.mjs`. The closest automated
signal is invariant I16, which forbids fabricated trademark or
copyright markers in user-facing strings — i.e. it disciplines the way
the terminology is published. A Level-0 conformance review is
otherwise manual: an editor confirms the implementer's surface uses
the canonical layer names and the 12-layer numbering in
[`SPEC.md`](./SPEC.md).

### Examples

- [`packages/ontology/SPEC.md`](./SPEC.md) — the public spec itself
  enumerates every layer with its canonical name and number.
- [`packages/ontology/src/types.ts`](./src/types.ts) — the TypeScript
  types use the same vocabulary as the spec (Authority, Obligation,
  Control, EvidenceObject, ArchitectureRequirement, PolicyAsCode,
  AuditTrailLink, AiSystemGovernance, RiskScenario, Mitigation, Workflow,
  AuditPack, MonitorBinding).
- [`packages/ontology/METHODOLOGY.md`](./METHODOLOGY.md) — the
  methodology document uses the same layer names when describing how
  authorities are decomposed into obligations and controls.

---

## Level 1 — Uses canonical IDs (FrameworkCode + clauseRef + controlRef)

A Level-1 implementer publishes a `Framework` object that uses the
canonical identifiers: a `FrameworkCode` from the published union
(`EU_AI_ACT`, `ISO_42001`, `GDPR`, etc.), stable `clauseRef` strings
that match the authority's own numbering, and stable `controlRef`
strings that are unique within the framework. The point of this level
is that other tools can refer to an obligation or control with a
guaranteed-stable identifier — no two clauses share a `clauseRef`, no
two controls share a `controlRef`, and the registry key matches the
framework's own `code` field.

### How to test conformance

Invariants **I1** (`schemaVersion`), **I2** (registry key matches
`framework.code`), **I3** (non-empty `name` / `version` / `description`
/ `referenceUrl`), **I4** (well-formed jurisdiction), **I5**
(well-formed clauses), **I6** (unique `clauseRef`), **I7** (well-formed
controls), **I8** (unique `controlRef`) and **I16** (no fabricated
trademark markers in metadata) are all enforced by
[`packages/frameworks/test/conformance.test.mjs`](../frameworks/test/conformance.test.mjs).

### Examples

- [`packages/frameworks/src/eu-ai-act.ts`](../frameworks/src/eu-ai-act.ts)
  — declares `code: "EU_AI_ACT"`, registers clauses with refs like
  `Art. 5(1)(a)`, `Art. 27`, `Annex III`, and controls with refs like
  `EUAI-RM-001`, `EUAI-FRIA-001`.
- [`packages/frameworks/src/iso-27001.ts`](../frameworks/src/iso-27001.ts)
  — declares `code: "ISO_27001"` and uses ISO Annex A numbering for
  clauseRefs (`A.5.18`, `A.5.24`, etc.).
- [`packages/frameworks/src/gdpr.ts`](../frameworks/src/gdpr.ts) —
  declares `code: "GDPR"` and uses Article numbering for clauseRefs
  (`Art. 15`, `Art. 17`, `Art. 33`).

---

## Level 2 — Maps obligations to controls (every control has clauseRefs)

A Level-2 implementer connects controls to the authority clauses they
satisfy. Every control in the framework carries a non-empty `clauseRefs`
array, and every entry in that array MUST be a `clauseRef` that exists
in the same framework's `clauses` list. This is the smallest claim that
lets an external party answer "if I implement control X, which clauses
am I addressing?" — the dangling-reference check makes it impossible
to ship a control that points at a clause that does not exist.

### How to test conformance

Invariant **I10** enforces both halves of this claim — `clauseRefs`
must be non-empty per control, and each entry must resolve against the
same framework's clauses list. Invariant **I7** ensures the control
itself is well-formed (`controlRef` + `title` + `description` +
`category`) and **I11** ensures `riskLevel` is one of the recognised
values, so the linkage is anchored on both sides.

### Examples

- [`packages/frameworks/src/eu-ai-act.ts`](../frameworks/src/eu-ai-act.ts)
  — control `EUAI-FRIA-001` links to `Art. 27`; control `EUAI-DOC-001`
  links to `Art. 11` and `Annex IV`.
- [`packages/frameworks/src/dora.ts`](../frameworks/src/dora.ts) — every
  control declares the DORA Article(s) it satisfies in `clauseRefs`.
- [`packages/ontology/src/seed.ts`](./src/seed.ts) — the seed
  `OBLIGATIONS` array carries `originatingClauses[]` and the seed
  `CONTROLS` array carries `satisfies[]` linking back to obligations,
  demonstrating the same idea at the cross-framework level.

---

## Level 3 — Maps controls to architecture requirements (linkage exists; can be partial in V1)

A Level-3 implementer expresses the link between an abstract control
and a concrete software capability that implements it. In the ontology
layer this is the `ArchitectureRequirement.forControl` edge from
[`packages/ontology/src/types.ts`](./src/types.ts); in implementer-shipped
data it is the same idea expressed however that implementer chooses
(an architecture row keyed by control id, a Terraform module tagged
with the control id, etc.). At V1 of this model the linkage can be
**partial** — coverage across every control is a Level-5/6 problem.
What Level 3 requires is that the linkage exists for the controls the
implementer claims architectural backing for, and that the linkage is
machine-readable (i.e. an `ArchitectureRequirement` that names a
`forControl`, or its equivalent).

### How to test conformance

`packages/frameworks/test/conformance.test.mjs` does not enforce
architecture-requirement linkage directly — invariants I1-I16 cover the
`Framework` shape (clauses + controls + questions) and not the
`ArchitectureRequirement` graph. The structural validator at
[`conformance/validate.mjs`](./conformance/validate.mjs) checks that
every `ArchitectureRequirement.forControl` resolves to a known control;
Level 3 review consequently combines that validator's output with a
manual check that the implementer has declared architecture
requirements for the controls they claim. The 16-invariant suite is
still required to pass (so the underlying controls are well-formed),
but the linkage itself is not yet bolted into that suite.

### Examples

- [`packages/ontology/src/seed.ts`](./src/seed.ts) `ARCHITECTURE` array
  — `ARCH-IAM-001` and `ARCH-IAM-002` both name
  `forControl: "CTRL-IAM-ACCESS-REVIEW-001"`.
- [`packages/ontology/examples/iac/`](./examples/iac/) — the
  reference-implementation Terraform / Cloudflare bundle materialises
  `ARCH-IAM-RBAC-ABAC-ENGINE` and `ARCH-AUDIT-WORM-LOG`, each linked
  to a control.
- [`packages/ontology/SPEC.md`](./SPEC.md) §"Software Architecture
  Layer" — documents the rule that every architecture requirement
  declares which control it implements.

---

## Level 4 — Emits evidence objects (every control has evidenceTypes from the 12-kind union)

A Level-4 implementer produces typed evidence for every control it
claims. In the framework registry this means every `Control` declares
a non-empty `evidenceTypes` array, and every entry in that array is
one of the twelve canonical `EvidenceType` values: `policy`,
`procedure`, `log`, `screenshot`, `report`, `attestation`,
`configuration`, `training_record`, `incident_record`, `fria`, `dpia`,
`contract`. In the ontology layer this extends to actual
`EvidenceObject` instances with a `forControl` reference, an owner, a
source, a frequency and a retention. The 12-kind union is fixed; an
implementer SHOULD NOT invent a thirteenth kind without an upstream
proposal.

### How to test conformance

Invariant **I9** in
[`packages/frameworks/test/conformance.test.mjs`](../frameworks/test/conformance.test.mjs)
enforces both halves: `evidenceTypes` must be non-empty per control,
and each entry must be one of the twelve canonical values. The
together-set `{policy, procedure, log, screenshot, report, attestation,
configuration, training_record, incident_record, fria, dpia, contract}`
is the only acceptable vocabulary.

### Examples

- [`packages/frameworks/src/eu-ai-act.ts`](../frameworks/src/eu-ai-act.ts)
  — control `EUAI-FRIA-001` declares `evidenceTypes:
  ["fria", "report", "attestation"]`.
- [`packages/frameworks/src/iso-27001.ts`](../frameworks/src/iso-27001.ts)
  — controls declare evidence types like `policy`, `procedure`,
  `attestation`, `configuration` aligned with the ISO Annex A
  expectations.
- [`packages/ontology/src/seed.ts`](./src/seed.ts) `EVIDENCE` array —
  worked instances such as `EV-FRIA-001` (`type: "fria"`),
  `EV-INC-002` (`type: "incident-record"`), `EV-DATA-GOV-001`
  (`type: "report"`), `EV-TRAINING-001` (`type: "training-record"`).

---

## Level 5 — Produces audit packs (renders a per-framework + per-control pack)

A Level-5 implementer renders an audit pack: a stable, periodised
deliverable that bundles the evidence behind a stated authority and a
stated set of controls, with a manifest that lets a reviewer verify
the pack's contents independently. The ontology models this as
`AuditPack` in [`packages/ontology/src/types.ts`](./src/types.ts):
each pack names the authority it serves, the period it covers, the
sections it contains, and the evidence ids attached to each section.
A Level-5 claim requires that the implementer can render at least one
pack per implemented framework and at least one pack scoped to a
specific control or AI system, and that the rendered output declares
which evidence ids it carries.

### How to test conformance

`packages/frameworks/test/conformance.test.mjs` does not exercise
the audit-pack layer — the 16 invariants stop at the framework's
clauses / controls / questions. Level 5 review therefore combines:
the full 16-invariant suite passing (so the upstream data is sound),
[`conformance/validate.mjs`](./conformance/validate.mjs) passing
against the implementer's published ontology (so dangling references
in packs are caught), and a manual review that the rendered pack
actually points at evidence ids that resolve and is scoped to either a
framework or a control. There is currently no automated check that the
pack's manifest is well-formed beyond reference integrity; that test
is on the roadmap.

### Examples

- [`packages/ontology/src/seed.ts`](./src/seed.ts) `AUDIT_PACKS` array —
  `PACK-EU-AIACT-HIGHRISK-V1` is a worked EU AI Act Annex IV
  technical-documentation pack with `forAuthority`, `periodStart`,
  `periodEnd`, and ten sections each linked to clauses and evidence
  ids.
- [`packages/report-templates/src/catalog.ts`](../report-templates/src/catalog.ts)
  — declares per-framework templates such as `fria-art27` (EU AI Act
  Art. 27), `dora-tlpt` (DORA threat-led pen test), and `soc2-readiness`
  (SOC 2 Trust Services Criteria), each scoped to a stakeholder lens.
- [`packages/ontology/examples/launch-readiness-eu-ai-hiring.md`](./examples/launch-readiness-eu-ai-hiring.md)
  — worked launch-readiness pack for an EU AI Act hiring tool with
  every triggered obligation cited.

---

## Level 6 — Supports versioned jurisdiction/applicability logic (effective windows, supersession, exemption)

A Level-6 implementer treats the question "does this authority apply
to this system, in this jurisdiction, on this date?" as first-class
and versioned. That means: every `Authority` carries explicit
`publishedAt`, `inForceFrom` and `applicableFrom` dates; every
`ApplicabilityRule` carries `effectiveDate`, `applicableDate` and where
relevant a `transitionDate`; and the implementer can answer the
applicability question for any (system, jurisdiction, date) triple
without silently merging in newer-than-the-date rules. Supersession
(when a later authority or rule replaces an earlier one) and exemption
(when an applicability condition removes obligations the rule would
otherwise trigger) are expressed through the same versioned graph, not
through out-of-band annotations.

### How to test conformance

`packages/frameworks/test/conformance.test.mjs` does not yet enforce
versioned jurisdiction / applicability — the 16 invariants check
framework `jurisdiction` shape (**I4**) and forbid trademark drift in
metadata strings (**I16**), but the temporal dimension is checked
structurally by [`conformance/validate.mjs`](./conformance/validate.mjs)
(it confirms that authorities carry the version metadata) and
otherwise reviewed manually against the implementer's applicability
logic. The `ApplicabilityRule` type, its `effectiveDate` /
`applicableDate` / `transitionDate` fields, and the parent / child
`Jurisdiction` graph in
[`packages/ontology/src/types.ts`](./src/types.ts) define the shape a
Level-6 implementer is expected to produce. Tightening this into a
dedicated invariant suite is on the roadmap.

### Examples

- [`packages/ontology/src/seed.ts`](./src/seed.ts) `AUTHORITIES` array
  — `eu-ai-act@2024-1689` carries `publishedAt: "2024-07-12"`,
  `inForceFrom: "2024-08-01"`, `applicableFrom: "2026-08-02"`;
  `dora@2022-2554` carries `inForceFrom: "2023-01-16"`,
  `applicableFrom: "2025-01-17"`.
- [`packages/ontology/src/seed.ts`](./src/seed.ts) `APPLICABILITY_RULES`
  array — `APP-EU-AIACT-HIRING-HIGHRISK` carries `effectiveDate:
  "2024-08-01"` + `applicableDate: "2026-08-02"` and triggers six
  specific obligations only when the conditions match.
- [`packages/ontology/src/seed.ts`](./src/seed.ts) `JURISDICTIONS`
  array — `JUR-EU` declares `childJurisdictions: ["JUR-DE", ...]`,
  `JUR-DE` declares `parent: "JUR-EU"`, and `JUR-US` declares
  `childJurisdictions: ["JUR-US-CA"]` so applicability can be reasoned
  about hierarchically.

---

## Claiming a level

An implementer publishes its claim as a short statement in its public
documentation, naming the level, the version of this document it
claims against, and (for Level 1 and above) the result of the
automated checks:

```
Compliance-to-Architecture conformance: Level 4 against
packages/ontology/CONFORMANCE.md v0.1.
Verified via packages/frameworks/test/conformance.test.mjs
(I1-I16 pass) on YYYY-MM-DD.
```

A claim of Level 0 or Level 3 / 5 / 6 (which include manual review
components) SHOULD additionally name the reviewer.

This document is a draft; the roadmap is to harden the manual-review
portions into automated invariants over the next two minor versions so
that every level can be verified by running a single test suite.
