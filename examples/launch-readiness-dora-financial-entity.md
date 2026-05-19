# Worked example — financial entity onboarding under DORA

A retail bank's risk and ICT teams need to certify their core-banking
platform is DORA-compliant before the 17 January 2025 applicable date.
This walkthrough exercises L0 → L13 for a typical mid-market European
bank.

## Inputs

```yaml
entityKind: credit-institution
operatesIn: [JUR-EU, JUR-DE]
criticalIctFunctions:
  - core-banking
  - real-time-payments
  - fraud-detection-ai
icpThirdParties:
  - PROVIDER-CLOUDFLARE     # CDN + WAF
  - PROVIDER-AWS            # primary core-banking compute
  - PROVIDER-AZURE          # disaster-recovery region
  - PROVIDER-FIRSTPARTY-AI  # in-house fraud-detection model
classifiedAs:
  - ict-third-party-service-provider: false
  - significant-ict-third-party: false
```

## L0 — Risks

```yaml
- id: RISK-DORA-ICT-OUTAGE
  inheritedFromSeed: true
  residualRiskScore: 6      # post-mitigation (failover + register)
- id: RISK-DORA-VENDOR-CONCENTRATION
  domain: resilience
  harmType: ["service-disruption", "regulatory-fine"]
  threatActors: ["supply-chain-compromise", "vendor-failure"]
  affectedStakeholders: ["customers", "supervisor", "counterparties"]
  likelihood: 3
  impact: 4
  inherentScore: 12
  mappedControls: [CTRL-INC-RESPONSE-72H-001]
  mappedMitigations: [MIT-DORA-FAILOVER, MIT-DORA-THIRD-PARTY-REGISTER]
  residualRiskScore: 6
```

## L2 — Jurisdictions

`JUR-EU` (parent) → `JUR-DE` (member state). Regulator: BaFin
(`REG-BAFIN`) for German prudential supervision; the EU Commission's
designated supervisor for DORA cross-border functions.

## L3 — Applicability

```yaml
ApplicabilityRule:
  id: APP-DORA-FINANCIAL-ENTITY    # from seed
  output: applies
  triggeredObligations:
    - OBL-DORA-ICT-INC-001          # ICT incident reporting
```

Per DORA Art. 16, the entity's obligations are calibrated by classification
as a credit institution; if it were further designated a "significant"
financial entity, additional obligations apply.

## L4 — Obligations

| Obligation | DORA clause | Actor |
|---|---|---|
| OBL-DORA-ICT-INC-001 | Art. 18 / Art. 19 | Financial entity |
| (v0.2) OBL-DORA-ICT-RISK-MGMT | Art. 6-9 | Financial entity |
| (v0.2) OBL-DORA-DIGITAL-OPS-RESILIENCE | Art. 24-27 (TLPT) | Significant entities |
| (v0.2) OBL-DORA-THIRD-PARTY | Art. 28-30 | Financial entity |

## L5 — Controls

CTRL-INC-RESPONSE-72H-001 covers Art. 18 + Art. 19 incident reporting
crosswalked at high confidence (see `CW-EUAIACT-ART73-DORA-ART19`).

## L6 — Mitigations

```yaml
- MIT-DORA-FAILOVER
- MIT-DORA-THIRD-PARTY-REGISTER
- (entity-specific) MIT-DORA-DR-DRILL: documented quarterly DR drill
  with regulator-shaped notification within 24h.
```

## L7 — Architecture

ARCH-INC-001 (immutable audit log + paging) — implemented on Cloudflare
(`examples/iac/cloudflare/worm-log.tf`) for the audit trail; AWS
(`examples/iac/aws/worm-log.tf`) for the cross-region replicated mirror.

## L8 — Policy-as-code

POL-INC-72H-001 (Cerbos bundle) gates incident-disclosure submission
through four-eyes; embedded in the API gateway.

## L9 — Workflows

`WF-INCIDENT-72H` from seed. SLA-bound:
- 4h: classify + contain
- 24h: regulator-notification draft
- 48h: four-eyes sign-off + submission
- 72h hard deadline (Art. 33 GDPR overlap when personal data involved)

## L10 — Evidence

| Evidence | Type |
|---|---|
| EV-INC-001 | `procedure` (incident-response runbook) |
| EV-INC-002 | `incident-record` (regulator-notification draft + timestamps) |
| EV-CFG-CORE-BANKING-DR | `configuration` (Terraform state hash) |
| EV-RPT-DORA-Q2 | `report` (quarterly DR-drill report) |

## L11 — Audit Trail Link

```yaml
controlId: CTRL-INC-RESPONSE-72H-001
controlOwner: CISO
evidenceOwner: Incident Commander
systemOwner: Platform SRE
testFrequency: annual
lastTestedAt: 2026-02-08T14:00:00Z
lastResult: pass
linkedRiskIds: [RISK-INC-SLA-MISS, RISK-PII-LEAK, RISK-DORA-ICT-OUTAGE, RISK-DORA-VENDOR-CONCENTRATION]
linkedPolicyIds: [POL-INC-72H-001]
linkedAssetIds: [ASSET-PAGERDUTY, ASSET-AUDIT-TRAIL, ASSET-CORE-BANKING]
linkedVendorIds: [VENDOR-PAGERDUTY, PROVIDER-AWS, PROVIDER-CLOUDFLARE]
linkedAiSystemIds: [AI-SYS-FRAUD-V2]
```

## L12 — Audit Pack

```
audit-packs/DORA-CORE-BANKING-2026Q2/
├── 0-cover.pdf                          # signed by CISO + CFO + DPO
├── 1-ict-risk-register.pdf
├── 2-third-party-register.csv           # incl. concentration tier + exit plans
├── 3-incident-runbook.pdf               # EV-INC-001
├── 4-incident-log.pdf                   # any actual incidents in window
├── 5-dr-drill-report.pdf                # EV-RPT-DORA-Q2
├── 6-tlpt-summary.pdf                   # if classified significant; else "n/a — not significant"
├── 7-conformity-attestation.pdf
├── 8-citations.md                       # Compliance-to-Architecture v0.1.0 cited
└── manifest.json                        # SHA-256 + WORM head/tail hashes
```

## L13 — AI Governance (cross-cutting)

The fraud-detection AI (`AI-SYS-FRAUD-V2`) is **not** EU AI Act high-risk
in itself (fraud detection is not on Annex III), but its decisions
inform credit-related actions, so it must be governed under DORA's
operational-resilience track + ISO 42001 management system.

```yaml
aiSystemId: AI-SYS-FRAUD-V2
intendedPurpose: "Score real-time payment instructions for fraud likelihood."
riskClassification: limited
roles: [provider, deployer]
humanOversight: exception-only         # high-volume; humans review flagged tx
postMarketMonitoring:
  enabled: true
  cadence: daily
modelMonitoring:
  driftDetection: true
  performanceTracking: true
  incidentLog: true
```

## Verdict

```yaml
launchReadiness:
  product: "Core-banking platform (incl. real-time payments + fraud-detection AI)"
  market: EU + DE
  applicableLaws:
    - dora@2022-2554 (financial entity)
    - gdpr@2016-679 (controller)
    - eu-ai-act@2024-1689 (limited-risk for fraud-detection AI)
    - iso-27001@2022 (mandatory information security baseline)
  triggeredObligations: 4 (DORA + GDPR + EU AI Act + ISO baseline)
  controlsImplemented: 6 (all 'high' confidence)
  architectureBlockers: 0
  evidenceGaps: 0
  residualRisks:
    - RISK-DORA-ICT-OUTAGE (residual 6)
    - RISK-DORA-VENDOR-CONCENTRATION (residual 6)
    - RISK-PII-LEAK-72H (residual 6)
  status: GO-WITH-CONDITIONS
  conditions:
    - Submit DORA conformity attestation by 2025-01-17 applicable date
    - Quarterly DR drill with regulator-shaped notification within 24h
    - Annual independent ICT risk-management review
    - Document exit plans for AWS + Cloudflare in third-party register
  reviewedBy: "M. Schmidt, BaFin-licensed counsel + CISA + ISO 27001 lead auditor"
  reviewedAt: 2026-04-22T11:30:00Z
```

---

**Disclaimer**: illustrative. See `LEGAL_DISCLAIMER.md`.
