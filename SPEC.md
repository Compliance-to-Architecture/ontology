# ReguNav Compliance-to-Architecture Framework

**Version 0.1** · published as an open specification under Apache-2.0.

A machine-readable control, evidence and architecture ontology for regulated
AI, data and software systems.

> The navigation layer between regulation, controls, software architecture
> and audit evidence.

---

## Why this exists

Most companies have:

- legal teams reading regulations,
- compliance teams building spreadsheets,
- engineers building systems without knowing control intent,
- auditors asking for evidence,
- vendors producing random documents,
- AI teams deploying models with weak governance.

These groups speak different vocabularies. Compliance-to-Architecture is the
shared graph that lets each group ask the question they care about and get
an answer the others can verify.

## Scope of v0.1

This specification covers eight typed layers that combine into a single
graph. Implementations are free to extend any layer; they SHOULD NOT
remove fields. Optional fields are explicitly marked `?`.

Implementations MUST:

- assign IDs from the canonical prefix space (`OBL-…`, `CTRL-…`, `EV-…`,
  `ARCH-…`, `POL-…`).
- treat every relationship as an immutable, versioned edge with provenance.
- expose the entire graph through a JSON API that mirrors the type
  definitions in [`src/types.ts`](src/types.ts).
- treat any deviation from a published authority's text as a derivative
  obligation with explicit reasoning, not a silent rewrite.

## The 12-layer Compliance-to-Architecture Graph (canonical)

Earlier drafts of this spec, the homepage, and the operating chain
described different layer counts (8 vs 10 vs 8-different). **This is the
single source of truth** as of v0.1.0. Every other surface (homepage,
README, GitHub, public API) MUST conform to this list.

| # | Layer | Type | What it answers |
|---|---|---|---|
| 0 | **Risk / Harm** | `RiskScenario` | What could go wrong — to whom, how likely, how bad? |
| 1 | **Authority** | `Authority` | Which regulation / standard / contract obligates? |
| 2 | **Jurisdiction** | `Jurisdiction` | Where does the authority have force? |
| 3 | **Applicability** | `ApplicabilityRule` | Does it apply to *this* org / product / activity? |
| 4 | **Obligation** | `Obligation` | What canonical, framework-neutral imperative is created? |
| 5 | **Control** | `Control` | Which reusable capability satisfies the obligation? |
| 6 | **Mitigation** | `Mitigation` | How does the control reduce a specific risk? |
| 7 | **Architecture** | `ArchitectureRequirement` | What must the software actually have? |
| 8 | **Policy-as-Code** | `PolicyAsCode` | What runtime rule enforces this? |
| 9 | **Workflow** | `Workflow` | Who does what, when, with what approvals? |
| 10 | **Evidence** | `EvidenceObject` | What typed proof carries the audit weight? |
| 11 | **Audit Trail** | `AuditTrailLink` | Who owns it, when did it last pass, what's linked? |
| 12 | **Audit Pack** | `AuditPack` | What deliverable goes to the regulator/board/auditor? |

Plus two cross-cutting layers:

| Cross-cutting | Type | Purpose |
|---|---|---|
| **AI / System Governance** | `AiSystemGovernance` | Risk class, lifecycle stage, oversight, monitoring, change log |
| **Runtime Monitoring** | `MonitorBinding` | Drift, performance, incident detectors that emit evidence on event |

Implementations MUST emit data for **at least L1 → L10**. L0 (risk),
L2-L3 (jurisdiction + applicability), L6 (mitigation), L9 (workflow),
L11-L12 (audit trail + pack), and the cross-cutting layers SHOULD be
present for an enterprise-grade implementation.

> **Why 12, not 8 or 10**: the audit field has stable canonical concepts
> that map cleanly to the 12 above. Earlier 8-layer drafts collapsed
> Risk + Mitigation into Obligation (lossy) and Workflow into Policy
> (lossy). The 10-step homepage chain merged Audit Trail + Audit Pack
> into "Audit" (lossy for the difference between the runtime trail and
> the periodic deliverable). The 12 layers preserve every distinction.

## First-class ontology objects

In addition to the 12-layer graph above, the framework publishes typed
schemas for operational objects that cross-cut the layers. Each is a
**first-class** object: implementations MUST validate against the
published JSON Schema and MUST treat the IDs as stable references in the
audit trail.

| Object | Schema | Examples | Cross-cuts / Runtime |
|---|---|---|---|
| **Applicability Test** | [`schemas/applicability-test.schema.json`](./schemas/applicability-test.schema.json) | [`examples/applicability-test.example.json`](./examples/applicability-test.example.json) | L3 Applicability — [`packages/engines/src/applicability-ast.ts`](../engines/src/applicability-ast.ts) |
| **Evidence Freshness Rule** | [`schemas/evidence-freshness-rule.schema.json`](./schemas/evidence-freshness-rule.schema.json) | [`examples/evidence-freshness-rule.example.json`](./examples/evidence-freshness-rule.example.json) | L10 Evidence ↔ L11 Audit Trail ↔ L12 Audit Pack |
| **Control Test** | [`schemas/control-test.schema.json`](./schemas/control-test.schema.json) | [`examples/control-test.example.json`](./examples/control-test.example.json) | L5 Control ↔ L10 Evidence ↔ OSCAL Assessment Plan |
| **Exception / Waiver** | [`schemas/exception-waiver.schema.json`](./schemas/exception-waiver.schema.json) | [`examples/exception-waiver.example.json`](./examples/exception-waiver.example.json) | L5 Control ↔ L0 Risk ↔ L11 Audit Trail (POA&M) |

The `ApplicabilityTest` schema is the canonical contract for the
applicability-AST runtime; the TypeScript runtime mirrors the schema
field-for-field.

ID prefix discipline for these objects:

- `APP-<FRAMEWORK>-<TOPIC>-NNN` for Applicability Test
- `EVRULE-<TOPIC>-NNN` for Evidence Freshness Rule
- `TEST-<CONTROL>-NNN` for Control Test
- `EXC-YYYY-NNNN` for Exception / Waiver

Companion legacy and evidence-body schemas (validated, no first-class
operational status):

| Object | Schema |
|---|---|
| ApplicabilityRule (L3, legacy) | [`schemas/applicability-rule.schema.json`](./schemas/applicability-rule.schema.json) |
| DPIA evidence | [`schemas/dpia.schema.json`](./schemas/dpia.schema.json) |
| FRIA evidence | [`schemas/fria.schema.json`](./schemas/fria.schema.json) |

## Framework coverage (status table)

The framework distinguishes three states for any authority. Don't conflate
them.

| Status | Meaning |
|---|---|
| **`implemented`** | Live in the v0.1 ontology seed (this repo). Conformance validator passes. |
| **`mapped`** | Authoritative crosswalk exists in the private ReguNav SaaS graph; not yet open-sourced. |
| **`roadmap`** | Public roadmap target; not yet mapped. |

### Counts (single source of truth, v0.1.0)

- **9 implemented** (this repo, conformance-validated): EU AI Act 2024/1689, ISO/IEC 42001:2023, ISO/IEC 27001:2022, GDPR 2016/679, SOC 2 TSC 2017, DORA 2022/2554, NIST AI RMF 1.0, PCI DSS 4.0.1, HIPAA 1996, NIST CSF 2.0.
- **13 mapped** (ReguNav SaaS, private): the 9 above + ISO/IEC 27701:2019, NIS2, EU CRA, FERPA.
- **21 roadmap** (public target): the 13 above + UK GDPR + DPA 2018, CCPA/CPRA, DPDP India 2023, LGPD Brazil, PIPL China, APPI Japan, Privacy Act AU 1988, SOC 1.

The site MUST NOT advertise "21 frameworks" without qualifying which
column. Use phrasing like "9 implemented · 13 mapped · 21 on roadmap".

## The eight layers (legacy section — preserved for diff continuity)

> **Deprecated as of v0.1.0.** Kept for one minor version so existing
> readers can find the new canonical model above. Will be removed in v0.2.

### 1. Authority Document Layer
Each regulation, standard or contract that obligates someone is registered
as an `Authority`. Each Authority carries a precise version identifier
(`pci-dss@4.0.1`, `eu-ai-act@2024-1689`, `iso-42001@2023`). Versioning is
mandatory because authority text changes.

### 2. Obligation Layer
Authority clauses are decomposed into canonical, framework-neutral
`Obligation`s. An obligation can be satisfied by one or more controls. The
same obligation can originate in multiple authority clauses — e.g.
"periodic privileged access review" is reinforced by ISO 27001 A.5.18,
SOC 2 CC6.3, and PCI DSS Req. 7.2.

### 3. Common Control Layer
Reusable `Control`s are mapped to obligations. Controls carry a
`crosswalk` array — the explicit list of framework references they cover.
This is what lets ReguNav answer "if I implement CTRL-IAM-ACCESS-REVIEW-001,
which audit clauses am I done with?" — instantly.

### 4. Evidence Layer
Each control's runtime proof is an `EvidenceObject` with: type, owner,
source systems, frequency, retention, and (optionally) a JSON Schema for
the artefact body.

### 5. Software Architecture Layer
The strongest differentiator. Each control declares one or more
`ArchitectureRequirement`s — concrete capabilities the software must have
(RBAC/ABAC engine, immutable audit log, tenant-aware identity, approval
workflow, evidence-export endpoint, drift detector, …). Every requirement
ships with reference patterns per cloud (AWS / Azure / GCP / Cloudflare /
on-prem).

### 6. Policy-as-Code Layer
Each control points at one or more `PolicyAsCode` bundles — Cerbos / OPA /
Cedar / Casbin policies that enforce the control at runtime. Bundles
declare their decision type (`allow_deny` / `abac` / `rbac` / `obligation`)
and whether a passing decision must emit evidence.

### 7. Audit Trail Layer
For each control, a runtime `AuditTrailLink` answers: who owns it, who
owns the evidence, who owns the system, how often is it tested, when did
it last pass, what risks/policies/assets/vendors/AI systems are linked.

### 8. AI Governance Layer
On top of layers 1-7, AI systems carry an `AiSystemGovernance` record:
intended purpose, risk classification (per EU AI Act Art. 6 + Annex III),
ISO 42001 actor role, training-data lineage + bias-test results, human
oversight model, model-monitoring posture, post-market monitoring cadence,
and the model change log.

## What's free, what's paid

**Free / open** (this repository):
- This specification.
- Control taxonomy + sample mappings.
- The seed dataset in [`src/seed.ts`](src/seed.ts) (≈ 9 authorities, 12
  obligations, 6 controls, 8 evidence objects, 6 architecture requirements,
  3 policies — small but end-to-end).
- JSON Schema samples for every evidence type.
- Public whitepaper draft (this file).

**Paid** (the ReguNav SaaS):
- Full machine-readable mappings (every clause across every authority).
- Authoritative crosswalks across all 13 frameworks.
- API access for programmatic queries.
- SaaS dashboards (customer + admin).
- Gap analysis from your current evidence to any target authority.
- Evidence pack generator (auditor-defensible, with hash-chain).
- Regulation-to-architecture mapper.
- AI-system compliance classifier.
- Vendor-document ingestion + auto-mapping to obligations.
- Audit-ready report templates (Board / CISO / Auditor / Regulator).
- Change monitoring when standards update.

## Conformance

Implementations claiming "Compliance-to-Architecture v0.1 conformant"
MUST pass [`conformance/validate.mjs`](./conformance/validate.mjs)
against their published ontology JSON. The validator checks:

1. Structural — all 8 layers present.
2. Layer integrity — every Obligation references an Authority, every
   Control references an Obligation, every EvidenceObject references a
   Control. Dangling references fail.
3. Crosswalk completeness — `Control.crosswalk[].framework` resolves to
   a known Authority shortName / id.
4. ID prefix discipline — `OBL-…`, `CTRL-…`, `EV-…`, `ARCH-…`, `POL-…`.
5. Evidence schema — every `EvidenceObject.type` is one of the 16
   canonical kinds (12 baseline + 4 AI/ops); a JSON Schema for the
   artefact body lives in [`schemas/`](./schemas/).

Run:

```sh
node packages/ontology/conformance/validate.mjs your-ontology.json
```

The seed ontology in this repo is conformant — see
[`packages/ontology/dist/seed.js`](./src/seed.ts).

### Conformance levels (0-6)

[`CONFORMANCE.md`](./CONFORMANCE.md) defines a public Conformance Model
with seven cumulative levels — from Level 0 (uses the terminology)
through Level 6 (versioned jurisdiction and applicability logic). Each
level lists the requirement, the automated invariants in
[`packages/frameworks/test/conformance.test.mjs`](../frameworks/test/conformance.test.mjs)
that cover it, and concrete in-repo artifacts that already satisfy it.
The per-level machine-readable description lives under
[`conformance/level-checks/`](./conformance/level-checks/), one JSON
file per level.

## Reference implementations (Apache-2.0)

- **Cerbos policy bundle** — [`examples/cerbos-bundle/`](./examples/cerbos-bundle/)
  implements `CTRL-IAM-ACCESS-REVIEW-001` (quarterly privileged-access
  review) end-to-end with `four_eyes_approver` derived role + explicit
  self-approval deny.
- **Terraform / Cloudflare** — [`examples/iac/cloudflare/`](./examples/iac/)
  ships `ARCH-IAM-RBAC-ABAC-ENGINE` (embedded PDP Worker) and
  `ARCH-AUDIT-WORM-LOG` (D1 hash-chain table).
- **Evidence JSON Schemas** — [`schemas/`](./schemas/) — 16 schemas
  covering all canonical evidence kinds. Validation is REQUIRED before
  an implementation accepts evidence.

## OSCAL interoperability

The framework is designed for round-tripping with NIST OSCAL (Open
Security Controls Assessment Language). v0.2 ships explicit mappings;
v0.1 documents the intended correspondence below so adopters can plan.

| OSCAL artefact | Maps to / from | Round-trip target |
|---|---|---|
| **Catalog** | `Authority` + `Obligation` + `Control` | Lossless |
| **Profile** | `ApplicabilityRule` selecting controls | Lossless |
| **Component Definition** | `ArchitectureRequirement` + reference patterns | Lossless |
| **Assessment Plan** | `ControlTest` (v0.2) | Lossless |
| **Assessment Results** | `ControlEffectiveness` + `EvidenceObject` | Lossless |
| **POA&M** | open exceptions + `Mitigation` (v0.2) | Lossless |
| **System Security Plan** | `AiSystemGovernance` for AI systems; equivalent type for non-AI in v0.2 | Lossy (C2A is richer; OSCAL emits a subset) |

Where C2A carries data OSCAL has no field for (e.g. `four_eyes_approver`
constraint, four-eyes test discipline), C2A → OSCAL serialisation
preserves the data in the OSCAL `links[]` and `props[]` extensions,
namespace-prefixed `c2a:`. OSCAL → C2A ingestion preserves OSCAL
extension values into `c2a:`-prefixed metadata fields on the matching
C2A entity.

## Risk / Harm / Mitigation layer

L0 (Risk) and L6 (Mitigation) are first-class layers in the canonical
12-layer model. They are scheduled for full type definitions in v0.2;
the worked example
[`examples/launch-readiness-eu-ai-hiring.md`](./examples/launch-readiness-eu-ai-hiring.md)
demonstrates the intended shape.

`RiskScenario` carries:
- `domain` — privacy / security / ai-safety / bias / resilience / financial / operational
- `harmType[]` — discrimination, loss-of-opportunity, financial-harm, psychological-harm, …
- `threatActors[]` — bias, malicious-insider, supply-chain, model-drift, …
- `affectedStakeholders[]` — employees, customers, applicants, third-parties, …
- `likelihood`, `impact` (1-5)
- `inherentScore` — likelihood × impact
- `mappedControls[]` — controls that reduce this risk
- `mappedMitigations[]` — concrete mitigations + their effectiveness evidence
- `residualRiskScore` — post-mitigation

`Mitigation` carries:
- `reduces` — the risk it mitigates
- `control` — the control that operationalises it
- `mechanism` — plain-language description
- `effectivenessEvidence` — id of evidence object that proves it works

## AI lifecycle

The framework's AI Lifecycle Control Map ties obligations / controls /
architecture / evidence to a stage. v0.2 ships the typed mapping; v0.1
documents the stages.

```
plan → data-collection → data-preparation → model-build → evaluation →
deployment → use → monitoring → incident-response → change-management →
retirement
```

For the worked example (EU AI hiring tool), every triggered obligation
in [`examples/launch-readiness-eu-ai-hiring.md`](./examples/launch-readiness-eu-ai-hiring.md)
is annotated with the lifecycle stages it gates.

Patterns for AWS / Azure / GCP / on-prem are scaffolded as `TODO` in
[`examples/iac/README.md`](./examples/iac/README.md); community pull
requests welcome.

## Public spec endpoint

The seed ontology is published as machine-readable JSON at
`https://framework.regunav.com/spec.json`. The same JSON is served from
`compliancetoarchitecture.com/spec.json` (CNAME). Both URLs resolve to
an identical hash; the single source of truth is the seed in this
repository.

## Versioning

The framework follows SemVer. Backwards-incompatible changes bump the
major. Adding optional fields or new authorities is a minor bump. Fixing
typos or expanding examples is a patch.

The current authority versions tracked in v0.1:

- `eu-ai-act@2024-1689` (in force 1 Aug 2024, applicable 2 Aug 2026 for high-risk)
- `iso-42001@2023`
- `iso-27001@2022`
- `gdpr@2016-679`
- `soc2@2017` (revised 2022)
- `dora@2022-2554` (applicable 17 Jan 2025)
- `nist-ai-rmf@1.0`
- `pci-dss@4.0.1` (June 2024 limited revision)
- `hipaa@1996` (amended)

## How to extend

1. Open a PR against `packages/ontology/src/seed.ts` adding your authority,
   obligation, control, evidence, architecture or policy.
2. Cite the source clause inline.
3. Run `pnpm --filter @regunav/ontology build` — it will fail loudly if
   you violate the type contract.
4. The merged change auto-deploys to the public `/v1/ontology` API surface
   on `api.regunav.com` and ships in the next ReguNav release.

## Citing the framework

> ReguNav Compliance-to-Architecture Framework, v0.1 (2026).
> Regunav Inc. https://framework.regunav.com

## Scope of openness

The artefacts published in this repository are **structural** only:

- the eight typed layers and their public field names;
- a small end-to-end seed dataset for illustration;
- JSON Schemas for evidence objects;
- the citation + extension procedure.

Everything that makes the running system non-trivial — regulatory-scope
inference, applicability decision trees, confidence scoring, document-
ingestion pipelines, AI-assisted classification, control-ranking logic,
architecture recommendation, evidence inference, policy-as-code generation,
regulatory change diffing, and the operational dashboards / agents that
consume this graph — is **not** within the scope of this open
specification. Those layers live in the ReguNav commercial engine
(`regunav/app`) and are not licensed by this Apache-2.0 publication.

## Patent posture

This repository is published under Apache-2.0, which includes an express
patent grant from each contributor for any patent claim they own or
control that is necessarily infringed by their contribution. That grant
runs with the code — anyone who uses, modifies, or distributes the
contribution gets the grant.

Regunav Inc. makes no separate assertion of patents over the open
specification or the schemas in this repository, and the Apache-2.0
grant is the exclusive source of patent licence flowing from this
publication. Where Regunav Inc. or other contributors hold patents on
inventions outside the scope of what is contributed here, those rights
are not granted by this licence — but no claim of such ownership is
made in this document.

The Compliance-to-Architecture graph model, dictionary-first /
manifest-first / registry-first structure, applicability-AST
evaluator design, and hash-chained audit-trail with object-lock
retention pattern are published as **defensive prior art**. See
[`docs/defensive-publications/`](../../docs/defensive-publications/)
for dated write-ups.

## Trademark

"ReguNav" and "Compliance-to-Architecture Framework" are claimed
trademarks of Regunav Inc. for the purposes set out in
[`TRADEMARKS.md`](../../TRADEMARKS.md) at the repository root.
The framework is published openly under Apache-2.0; trademark rights
are governed by the separate trademark policy and do not flow with
the code licence.
