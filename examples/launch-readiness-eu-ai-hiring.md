# Worked example — AI hiring tool launching in the EU

This is the flagship end-to-end example for the Compliance-to-Architecture
Framework. It walks every layer (L0 → L13 cross-cutting) for a single,
realistic launch question:

> **"Can we deploy our AI résumé-screening tool to EU customers?"**

The example is intentionally one we expect every regulator and tier-1
bank's compliance team to recognise. It demonstrates how a launch
readiness check resolves into concrete obligations, controls, evidence,
and a launch verdict.

## L0 — Risk / Harm

```yaml
RiskScenario:
  id: RISK-AI-HIRING-DISCRIMINATION
  domain: ai-safety
  harmType: ["discrimination", "loss-of-opportunity", "psychological-harm"]
  threatActors: ["model-bias", "training-data-skew", "deployer-misuse"]
  affectedStakeholders: ["job-applicants", "protected-classes", "labor-market"]
  likelihood: 4   # 1-5
  impact: 4
  inherentScore: 16
  mappedControls:
    - CTRL-AI-DATA-GOV-001
    - CTRL-AI-FRIA-AUTHORING-001
    - CTRL-AI-EVENT-LOG-001
    - CTRL-AI-LITERACY-001
  mappedMitigations:
    - MIT-AI-BIAS-TEST-PIPELINE
    - MIT-AI-HUMAN-REVIEW-GATE
  residualRiskScore: 8       # post-mitigation
```

## L1 — Authority

EU AI Act (`eu-ai-act@2024-1689`) is the primary instrument. Secondary:
GDPR (`gdpr@2016-679`), national employment law (`fr-labor-code`,
`de-betriebsverfassungsgesetz`, etc.), national equality law.

## L2 — Jurisdiction

```yaml
Jurisdiction:
  id: JUR-EU
  name: European Union
  parent: null
  regulators:
    - REG-EU-COMMISSION-AI-OFFICE         # central oversight
    - REG-EDPB                             # data protection
  childJurisdictions:
    - JUR-FR-LABOR
    - JUR-DE-LABOR
    - ...   # one per member state
```

## L3 — Applicability

```yaml
ApplicabilityRule:
  id: APP-EU-AIACT-HIRING-HIGHRISK
  instrument: eu-ai-act@2024-1689
  appliesIf:
    - aiSystemSold_or_deployed_in_EU
    - aiSystemUsed_for: "employment-management"            # Annex III row 4
    - aiSystemUsed_for: "recruitment-or-selection"
    - aiSystemAffects_natural_persons
  output: applies-as-high-risk
  triggeredObligations:
    - OBL-AI-RISK-MGMT-001        # Art. 9
    - OBL-AI-DATA-GOV-001         # Art. 10
    - OBL-AI-LOGGING-001          # Art. 12
    - OBL-AI-OVERSIGHT-001        # Art. 14
    - OBL-AI-FRIA-001             # Art. 27 (deployer)
    - OBL-AI-INC-REPORT-001       # Art. 73
  effectiveDate: 2024-08-01
  applicableDate: 2026-08-02      # high-risk systems
```

## L4 — Obligations triggered

| Obligation | Authority clause | Actor |
|---|---|---|
| OBL-AI-RISK-MGMT-001 | EU AI Act Art. 9 | Provider |
| OBL-AI-DATA-GOV-001 | EU AI Act Art. 10 | Provider |
| OBL-AI-LOGGING-001 | EU AI Act Art. 12 | Provider |
| OBL-AI-OVERSIGHT-001 | EU AI Act Art. 14 | Provider + Deployer |
| OBL-AI-FRIA-001 | EU AI Act Art. 27 | Deployer |
| OBL-AI-INC-REPORT-001 | EU AI Act Art. 73 | Provider |
| OBL-PRIV-ACCESS-001 | GDPR Art. 15 | Controller |
| OBL-PRIV-ERASURE-001 | GDPR Art. 17 | Controller |

## L5 — Controls satisfying those obligations

Six controls cover the obligation set:

| Control | Satisfies |
|---|---|
| CTRL-AI-FRIA-AUTHORING-001 | OBL-AI-FRIA-001 |
| CTRL-AI-EVENT-LOG-001 | OBL-AI-LOGGING-001 |
| CTRL-AI-DATA-GOV-001 | OBL-AI-DATA-GOV-001 |
| CTRL-AI-LITERACY-001 | OBL-AI-LITERACY-001 |
| CTRL-IAM-ACCESS-REVIEW-001 | (security) |
| CTRL-INC-RESPONSE-72H-001 | OBL-AI-INC-REPORT-001 + OBL-DORA-ICT-INC-001 |

## L6 — Mitigations

```yaml
- id: MIT-AI-BIAS-TEST-PIPELINE
  reduces: RISK-AI-HIRING-DISCRIMINATION
  control: CTRL-AI-DATA-GOV-001
  mechanism: "Demographic-parity + equalised-odds tests gate every model
              promotion to production. Failing test blocks deploy."
  effectivenessEvidence: EV-DAT-CREDIT-2025-Q1   # bias-test report

- id: MIT-AI-HUMAN-REVIEW-GATE
  reduces: RISK-AI-HIRING-DISCRIMINATION
  control: CTRL-AI-FRIA-AUTHORING-001
  mechanism: "Every AI-recommended rejection routes to a human reviewer
              before notice is sent to applicant. Human decision is
              final. AI score is decision support, not decision."
  effectivenessEvidence: EV-AR-HIRING-2026-Q2
```

## L7 — Architecture requirements

| ARCH | Capability | Reference pattern |
|---|---|---|
| ARCH-AI-FRIA-001 | ai-system-registry | examples/iac/cloudflare/abac-engine.tf |
| ARCH-AI-LOG-001 | tenant-aware-identity + immutable-audit-log | examples/iac/cloudflare/worm-log.tf |
| ARCH-DATA-GOV-001 | data-lineage | (community track) |
| ARCH-IAM-PRIV-001 | rbac-abac-engine | examples/iac/cloudflare/abac-engine.tf |
| ARCH-INC-001 | immutable-audit-log + paging | examples/iac/cloudflare/worm-log.tf |
| ARCH-AI-OVERSIGHT | approval-workflow | (community track) |

## L8 — Policy-as-code

| Policy | Engine | Bundle |
|---|---|---|
| POL-IAM-PRIV-001 | Cerbos | examples/cerbos-bundle/access_review.yaml |
| POL-AI-FRIA-001 | Cerbos | (private) |
| POL-INC-72H-001 | Cerbos | (private) |

## L9 — Workflow

For each obligation, who does what, when, with what approvals:

- **OBL-AI-FRIA-001 (deployer FRIA)**
  - Trigger: AI system status flips to `deployed-in-eu`
  - Owner: deployer's AI Risk Owner
  - Approvers: deployer's DPO + business owner (four-eyes)
  - Output: `EV-FRIA-HIRING-V3`
  - Deadline: before first production use
- **OBL-AI-INC-REPORT-001 (incident reporting)**
  - Trigger: severity ≥ critical incident detected
  - Owner: Incident Commander
  - Approvers: DPO + AI Risk Owner (four-eyes for submission)
  - Output: `EV-INC-…` + regulator submission record
  - Deadline: 15 days for serious incidents (Art. 73)

## L10 — Evidence

Per the 16-canonical-kind schema (`schemas/`):

| Evidence | Type | Schema |
|---|---|---|
| EV-FRIA-HIRING-V3 | `fria` | schemas/fria.schema.json |
| EV-DPIA-HIRING-V3 | `dpia` | schemas/dpia.schema.json |
| EV-MDL-HIRING-V3 | `model-card` | schemas/model-card.schema.json |
| EV-DAT-HIRING-2025-Q1 | `data-card` | schemas/data-card.schema.json |
| EV-AR-HIRING-2026-Q2 | `access-review` | schemas/access-review.schema.json |
| EV-RPT-HIRING-2026-H1 | `report` | schemas/report.schema.json |
| EV-LOG-HIRING-2026-04 | `log` | schemas/log.schema.json |
| EV-ATE-HIRING-2026-Q2 | `audit-trail-export` | schemas/audit-trail-export.schema.json |

## L11 — Audit Trail

```yaml
- controlId: CTRL-AI-FRIA-AUTHORING-001
  controlOwner: AI Risk Owner
  evidenceOwner: AI Risk Owner
  systemOwner: ML Platform Lead
  testFrequency: on-event
  lastTestedAt: 2026-04-22T11:30:00Z
  lastResult: pass
  linkedRiskIds: [RISK-AI-HIRING-DISCRIMINATION]
  linkedPolicyIds: [POL-AI-FRIA-001]
  linkedAssetIds: [ASSET-FRIA-AGENT, ASSET-AI-SYSTEM-REGISTRY]
  linkedAiSystemIds: [AI-SYS-HIRING-V3]
```

## L12 — Audit Pack

Generated artefact for the regulator submission, structured per the
EU AI Act technical-documentation Annex IV template:

```
audit-packs/EU-AIACT-HIRING-V3-2026Q2/
├── 0-cover.pdf                      # signed by deployer + provider
├── 1-fria.pdf                       # EV-FRIA-HIRING-V3
├── 2-dpia.pdf                       # EV-DPIA-HIRING-V3
├── 3-model-card.json                # EV-MDL-HIRING-V3
├── 4-data-card.json                 # EV-DAT-HIRING-2025-Q1
├── 5-bias-test-report.pdf           # mitigation effectiveness
├── 6-event-log-extract.csv.gz       # EV-LOG-HIRING-2026-04
├── 7-incident-log.pdf               # EV-INC-* (none if no incidents)
├── 8-human-oversight-evidence.pdf   # human-reviewer decisions
├── 9-conformity-declaration.pdf
├── 10-citations.md                  # framework version cited (v0.1.0)
└── manifest.json                    # SHA-256 of every artefact + audit-trail head + tail
```

## L13 — AI / System Governance

```yaml
aiSystemId: AI-SYS-HIRING-V3
intendedPurpose: "Score CVs for software-engineering roles in the EU."
riskClassification: high-risk
euAiActAnnex: annex-iii-row-4   # employment, workers management
roles: [provider, deployer]
dataGovernance:
  trainingDatasets: [DAT-HIRING-EU-2024]
  biasTested: true
  lineageDocumented: true
humanOversight: approve-each
modelMonitoring:
  driftDetection: true
  performanceTracking: true
  incidentLog: true
postMarketMonitoring:
  enabled: true
  cadence: monthly
conformityEvidenceIds:
  - EV-FRIA-HIRING-V3
  - EV-MDL-HIRING-V3
  - EV-DAT-HIRING-2025-Q1
modelChangeLog:
  - { version: "3.0.0", at: "2026-03-01T00:00:00Z", summary: "Initial production release after FRIA approval." }
  - { version: "3.0.1", at: "2026-04-12T00:00:00Z", summary: "Bias mitigation re-weighting on protected attribute X." }
```

## Launch verdict

```yaml
launchReadiness:
  product: "AI résumé-screening tool"
  market: EU
  applicableLaws:
    - eu-ai-act@2024-1689 (high-risk, Annex III row 4)
    - gdpr@2016-679 (controller obligations)
    - national equality law (per member state)
  triggeredObligations: 8 (all listed above)
  controlsImplemented: 6 (all required mappings present, 'high' confidence)
  architectureBlockers: 0
  evidenceGaps: 0
  residualRisks:
    - RISK-AI-HIRING-DISCRIMINATION (residual 8/25 — within tolerance)
  status: GO       # alternatives: GO-WITH-CONDITIONS / NO-GO / NEEDS-LEGAL-REVIEW
  conditions:
    - Renew FRIA annually or on material model change
    - Quarterly bias-test re-run
    - Monthly post-market monitoring report
    - Incident-disclosure within 15 days for serious incidents (Art. 73)
  reviewedBy: "J. Smith, GDPR-licensed counsel + ISO 27001 lead auditor"
  reviewedAt: 2026-04-22T11:30:00Z
```

This is the kind of structured launch verdict a tier-1 bank or a global
recruiter would expect to drop into a board pack. Every claim above is
grounded in an authority clause cited explicitly in the framework.

---

**Disclaimer**: this example is illustrative. It does not constitute
legal advice. A real launch decision requires review by qualified
counsel under the relevant jurisdiction. See `LEGAL_DISCLAIMER.md`.
