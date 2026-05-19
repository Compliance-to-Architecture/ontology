# Roadmap

The Compliance-to-Architecture Framework ships in incremental, dated
releases. Items here are public commitments; community PRs welcome.

## v0.1.0 — Foundation (released 2026-05-05)
See `CHANGELOG.md`.

## v0.2.0 — Jurisdiction + Risk + OSCAL (target Q3 2026)

The two structural gaps in v0.1.0:

### Jurisdiction + Applicability schema
First-class types so applicability can actually be computed:
- `Jurisdiction` (id, name, parent, regulators, treaty memberships)
- `Regulator` (id, name, jurisdiction, submission endpoints)
- `LegalInstrument` (id, name, jurisdiction, in-force, applicable-from)
- `ApplicabilityRule` (id, instrument, conditions, output)
- `EntityRole` (provider | deployer | controller | processor | importer
  | distributor | sub-processor | …)
- `Sector`, `ProductScope`, `DataCategory`, `ProcessingActivity`,
  `MarketActivity`, `Threshold`, `CloudRegion`, `TerritorialTrigger`

### Risk / Harm / Mitigation layer (L0 + L6 in canonical model)
- `RiskScenario` (domain, harm types, threat actors, affected
  stakeholders, likelihood, impact)
- `Mitigation` (control linkage, residual-risk delta, effectiveness
  evidence)
- `ControlEffectiveness` (test result, sample size, exceptions, retest
  cadence)

### OSCAL interop
- OSCAL **Catalog** import/export (every Authority with controls maps
  to / from an OSCAL catalog)
- OSCAL **Profile** import/export (selection of controls per
  ApplicabilityRule)
- OSCAL **Component Definition** mapping (architecture requirements as
  components)
- OSCAL **Assessment Plan** / **Assessment Results** mapping (control
  tests + evidence)
- OSCAL **POA&M** mapping (open exceptions + remediation plan)

### Authorities promoted from `mapped` → `implemented`
Targeting four authority promotions in v0.2:
- ISO/IEC 27701:2019
- NIS2
- EU CRA
- FERPA

## v0.3.0 — Lifecycle + Entity Graph (target Q4 2026)

### AI Lifecycle Control Map
For each lifecycle stage (plan / data collection / data preparation /
model build / evaluation / deployment / use / monitoring / incident
response / change management / retirement):
- Risks, obligations, controls, architecture requirements, evidence
  objects, approvers, audit-pack sections, runtime monitors.

### KYE Protocol entity-state integration
Optional bind to `kyeprotocol.com` so applicability can resolve:
- Who is acting (entity + role + delegation chain)
- In what state (active / suspended / certified / revoked)
- With what authority (instrument + jurisdiction + scope)

### Authorities promoted to `implemented`
- UK GDPR + DPA 2018
- CCPA / CPRA
- DPDP India 2023

## v0.4.0 — Evidence + Audit-pack rigor (target Q1 2027)

### Evidence quality model
- `EvidenceProvenance` (collection method, source-system trust level,
  chain of custody, signature, hash)
- `EvidenceConfidence` (high / medium / low) with explicit propagation
  to control coverage tallies
- `ChainOfCustody` (transferring principal + timestamp + signature for
  every hand-off)

### Control testing model
- `ControlTest`, `TestProcedure`, `TestFrequency`, `SamplePopulation`,
  `SampleSize`, `TestResult`, `Exception`, `Remediation`, `Retest`,
  `AssuranceLevel`

### Audit pack templates
Per-authority templates for the `AuditPack` deliverable:
- EU AI Act technical-documentation (Annex IV) pack
- DORA ICT-incident report pack
- ISO 27001 SoA + Stage-1/Stage-2 audit pack
- SOC 2 Type II evidence pack
- GDPR Art. 30 records-of-processing export

## v1.0.0 — Stable specification (target H2 2027)

### Authorities promoted to `implemented`
The remaining 8 from the v0.1 roadmap list (LGPD, PIPL, APPI, AU
Privacy, SOC 1).

### Stability commitments
- ID schemes frozen (no rename of existing `OBL-*`, `CTRL-*`, `EV-*`,
  `ARCH-*`, `POL-*`)
- Backwards-compat guarantees for v0.x → v1.0 published as a migration
  guide
- Independent advisory board active
- Conformance certification path (badge + listing)

## Speculative — beyond v1.0

- Regulator change-diff service (when an authority publishes an update,
  diff against the prior version, surface affected obligations + controls
  + tenants)
- Multi-vendor reference implementations (not just ReguNav SaaS)
- Conformance test suite for OSCAL→C2A round-trips
- Reference patterns for AWS / Azure / GCP / on-prem (community track —
  AWS first)
- Public dashboard at `compliancetoarchitecture.com/conformant` listing
  conformant implementations + their published spec.json

## How to influence the roadmap

- Open an issue tagged `roadmap` with the proposal + a use case.
- For authorities: include the published version, in-force date,
  applicable date, and at least three obligations you'd like
  decomposed.
- The maintainer team triages monthly; high-signal proposals enter the
  next minor release.

## What is explicitly **not** on this roadmap

- **Auto-fabricated mappings.** The framework forbids generating
  obligations, controls, or crosswalks without authority-text grounding.
- **Closed extensions.** Any new layer or relationship type added to
  the open spec must publish its types + JSON Schema + conformance test
  in the same release.
- **Vendor-locked dependencies.** Reference patterns showcase concrete
  vendors (Cerbos, Cloudflare, …) but the spec MUST be implementable
  with open / alternative vendors.
