# Changelog

All notable changes to the Compliance-to-Architecture Framework are
documented here. The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and the project adheres to [SemVer](https://semver.org/).

## [0.1.0] — 2026-05-05 / 2026-05-06 (revision)

First public release. Revision adds full first-class types for the
canonical 12-layer model + OSCAL bidirectional mapping + 4 authority
promotions + 3 worked examples + reference IaC patterns across 4 clouds.

### Added (revision 2026-05-06)

- **First-class TypeScript types** for every layer in the canonical
  12-layer Compliance-to-Architecture Graph: `RiskScenario`,
  `Jurisdiction`, `Regulator`, `ApplicabilityRule`, `EntityRole`, `Sector`,
  `Mitigation`, `Workflow`, `WorkflowStep`, `AuditPack`, `AuditPackSection`,
  `ControlTest`, `MonitorBinding`, `CrosswalkRelation`. The Ontology
  interface now carries optional fields for each so older snapshots
  still parse.
- **JSON Schemas** for the new layer types: `risk-scenario`,
  `jurisdiction`, `applicability-rule`, `mitigation`, `audit-pack`,
  `control-test`. Index updated.
- **OSCAL bidirectional mapping** (`src/oscal.ts`): `exportCatalog`
  (Authority + Obligation + Control → OSCAL Catalog), `exportProfile`
  (ApplicabilityRule → OSCAL Profile), `exportComponent` /
  `exportComponentDefinition` (ArchitectureRequirement → OSCAL
  Component Definition), `exportPoam` (Mitigation + outstanding
  ControlTest → OSCAL POA&M), `evidenceToOscalObservation`
  (EvidenceObject → OSCAL Assessment-Results observation),
  `importCatalog` (best-effort OSCAL → C2A obligations).
- **4 authority promotions** from `mapped` to `implemented`: ISO/IEC
  27701:2019, NIS2 (Directive 2022/2555), EU CRA (Regulation 2024/2847),
  FERPA. Authority count: 10 → 14.
- **3 worked seed risk scenarios** (`RISK-AI-HIRING-DISCRIMINATION`,
  `RISK-PII-LEAK-72H`, `RISK-DORA-ICT-OUTAGE`) with mapped controls +
  mitigations + residual scores.
- **6 worked seed mitigations** with mechanism + effectiveness evidence.
- **2 workflows** with multi-step approval chains + four-eyes gates.
- **1 audit-pack template** for EU AI Act high-risk technical
  documentation (Annex IV).
- **2 control tests** (IAM access review + incident response tabletop).
- **2 monitor bindings** (drift on credit-scoring V3, evidence-staleness
  on FRIA).
- **3 typed crosswalk relations** with confidence + reviewer + rationale.
- **3 worked end-to-end examples** under `examples/`:
  - `launch-readiness-eu-ai-hiring.md` (high-risk AI under EU AI Act)
  - `launch-readiness-dora-financial-entity.md` (DORA + GDPR + EU AI
    Act for a credit institution)
  - `launch-readiness-hipaa-medical-ai.md` (FDA-cleared medical-device
    AI deployed in US + EU, dual HIPAA + EU AI Act + EU MDR)
- **Reference IaC patterns** for AWS (`abac-engine.tf`, `worm-log.tf`),
  Azure (`abac-engine.bicep`), GCP (`abac-engine.tf`), in addition to
  the existing Cloudflare patterns.
- **Conformance validator** extended to count + warn on empty optional
  layers. Now reports L0-L13 coverage.
- **Published spec endpoint** refreshed: `framework.regunav.com/spec.json`
  now ships 46 KB covering all layers (was 21 KB pre-revision).
- **Conformance run on the seed** — 0 violations, all 16 layer counts > 0.

### Added (initial 2026-05-05)
- **Canonical 12-layer graph** (`SPEC.md`) — replaces the inconsistent
  8-layer / 10-step / 8-pillar drafts that appeared in earlier site copy.
- **9 implemented authorities** (seed) — EU AI Act, ISO/IEC 42001,
  ISO/IEC 27001, GDPR, SOC 2, DORA, NIST AI RMF, PCI DSS, HIPAA, NIST CSF.
- **12 obligations** — privacy, AI risk, IAM, incident response, AI
  literacy, DORA ICT, training categories.
- **6 reusable controls** with crosswalks to the 9 authorities.
- **8 evidence objects** across 8 evidence types.
- **6 architecture requirements** with reference patterns.
- **3 policy-as-code bundles** (Cerbos resource policies).
- **Layer 7 worked examples** — 3 `AuditTrailLink` records (IAM access
  review, incident response, FRIA authoring).
- **Layer 8 worked examples** — 2 `AiSystemGovernance` records (high-risk
  credit scoring + limited-risk evidence classifier).
- **16 evidence-type JSON Schemas** under `schemas/` (12 baseline + 4
  AI/ops kinds: `model-card`, `data-card`, `audit-trail-export`,
  `access-review`).
- **Reference Cerbos bundle** (`examples/cerbos-bundle/`) implementing
  `CTRL-IAM-ACCESS-REVIEW-001` end-to-end with `four_eyes_approver`
  derived role.
- **Reference Terraform patterns** (`examples/iac/cloudflare/`) for
  `ARCH-IAM-RBAC-ABAC-ENGINE` and `ARCH-AUDIT-WORM-LOG`.
- **Conformance test suite** (`conformance/validate.mjs`) — pure-Node,
  zero-deps validator with 5 rules (structural, layer integrity,
  crosswalk completeness, ID prefix discipline, evidence schema
  validity).
- **Methodology** (`METHODOLOGY.md`) — clause decomposition, mapping
  confidence scoring, crosswalk relations, conflict resolution,
  versioning protocol, contribution flow.
- **Legal disclaimer** (`LEGAL_DISCLAIMER.md`) — what the framework is
  and is not. Required to be reproduced in audit packs.
- **Public spec endpoint** — `framework.regunav.com/spec.json` (21 KB
  JSON dump of the seed ontology). Mirror at
  `compliancetoarchitecture.com/spec.json` once the cta zone is unblocked.
- **GitHub-aligned docs** — `ROADMAP.md`, `CONTRIBUTING.md`,
  `GOVERNANCE.md`, `CODEOWNERS`, `SECURITY.md`, `CITATION.cff`.

### Identified gaps for v0.2 (see ROADMAP.md)
- First-class `Jurisdiction` + `ApplicabilityRule` schema
- Risk / Harm / Mitigation layer (L0 + L6 in the canonical model)
- OSCAL Catalog / Profile / Component-Definition / Assessment-Plan /
  Assessment-Results / POA&M import + export mappings
- Evidence quality / provenance / chain-of-custody fields
- Control-test / assurance-level / sample-size model
- AI lifecycle stage map (plan → retire) tied to obligations
- Worked end-to-end example: AI Hiring Tool launching in EU
- Independent advisory board / governance body

### Known inconsistencies fixed in 0.1.0
- Homepage 10-step chain ↔ spec 8-layer model ↔ marketing 8-pillar
  variant — all three were different. **Now**: single canonical 12-layer
  model in `SPEC.md`; older sections kept marked deprecated for one
  minor version.
- "21 frameworks" claim ↔ "13 frameworks" claim ↔ 9-in-seed reality.
  **Now**: explicit 3-state status table — 9 implemented, 13 mapped
  (private), 21 roadmap. Consumers MUST qualify.

[0.1.0]: https://github.com/ReguNav/framework/releases/tag/v0.1.0
