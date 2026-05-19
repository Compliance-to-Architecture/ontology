# Worked example — medical-device AI launching in US (HIPAA + EU AI Act dual)

A US digital-health company markets an AI-driven radiology assistant
that proposes priority readings to radiologists. Deployed to US
hospitals (HIPAA covered entities) and EU hospitals (high-risk AI per
EU AI Act Annex III row 3 — access to essential public services
including healthcare).

## Inputs

```yaml
productKind: medical-device-ai-saas
classifiedAs:
  fda: device-class-II-510k-cleared
  eu-mdr: class-IIa
operatesIn: [JUR-US, JUR-EU]
hipaaRole: business-associate          # not a covered entity
gdprRole: processor                    # for EU customers
euAiActRole: provider + deployer
intendedPurpose: "Propose CT/MRI study priority orderings to a radiologist."
intendedUsers: ["board-certified radiologists"]
```

## L0 — Risks

```yaml
- id: RISK-MEDICAL-AI-MISDIAGNOSIS
  domain: ai-safety
  harmType: ["physical-harm", "delayed-treatment", "patient-death"]
  threatActors: ["model-bias", "training-data-skew", "rare-pathology"]
  affectedStakeholders: ["patients", "radiologists", "hospital"]
  likelihood: 3
  impact: 5
  inherentScore: 15
  mappedControls: [CTRL-AI-FRIA-AUTHORING-001, CTRL-AI-EVENT-LOG-001, CTRL-AI-DATA-GOV-001]
  mappedMitigations: [MIT-AI-HUMAN-REVIEW-GATE, MIT-AI-BIAS-TEST-PIPELINE]
  residualRiskScore: 6

- id: RISK-PHI-LEAK-HIPAA
  domain: privacy
  harmType: ["regulatory-fine", "patient-harm", "loss-of-trust"]
  threatActors: ["malicious-insider", "supply-chain-compromise", "operational-failure"]
  affectedStakeholders: ["patients", "covered-entity-hospital", "business-associate"]
  likelihood: 3
  impact: 5
  inherentScore: 15
  mappedControls: [CTRL-INC-RESPONSE-72H-001]
  mappedMitigations: [MIT-INC-PAGING-CHAIN]
  residualRiskScore: 6
```

## L2 — Jurisdictions

`JUR-US` (federal HIPAA + FDA) + `JUR-EU` (EU AI Act + GDPR + EU MDR).

## L3 — Applicability

Two rules fire concurrently:

```yaml
- id: APP-EU-AIACT-HEALTHCARE-HIGHRISK
  instrument: eu-ai-act@2024-1689
  appliesIf:
    - aiSystemSoldOrDeployedIn = JUR-EU
    - aiSystemUsedFor in [healthcare-priority-triage]
    - euMdrClass in [IIa, IIb, III]
  output: applies-as-high-risk
  triggeredObligations: [OBL-AI-RISK-MGMT-001, OBL-AI-DATA-GOV-001, OBL-AI-LOGGING-001, OBL-AI-OVERSIGHT-001, OBL-AI-FRIA-001, OBL-AI-INC-REPORT-001]

- id: APP-HIPAA-BUSINESS-ASSOCIATE
  instrument: hipaa@1996
  appliesIf:
    - createsReceivesMaintainsTransmits = "phi"
    - relationshipToCoveredEntity = "business-associate"
  output: applies
  triggeredObligations: [OBL-HIPAA-BAA, OBL-HIPAA-MIN-NECESSARY, OBL-HIPAA-BREACH-NOTIF, OBL-HIPAA-SECURITY-RULE]
```

## L4 — Obligations (combined)

| Obligation | Authority | Actor |
|---|---|---|
| OBL-AI-RISK-MGMT-001 | EU AI Act Art. 9 | Provider |
| OBL-AI-DATA-GOV-001 | EU AI Act Art. 10 | Provider |
| OBL-AI-LOGGING-001 | EU AI Act Art. 12 | Provider |
| OBL-AI-OVERSIGHT-001 | EU AI Act Art. 14 | Provider + Deployer |
| OBL-AI-FRIA-001 | EU AI Act Art. 27 | Deployer (hospital) |
| OBL-AI-INC-REPORT-001 | EU AI Act Art. 73 | Provider |
| OBL-HIPAA-BAA | HIPAA Privacy Rule | Business Associate |
| OBL-HIPAA-BREACH-NOTIF | HIPAA Breach Notification (45 CFR §164.400-414) | Business Associate (notify CE within 60 days) |
| OBL-HIPAA-SECURITY-RULE | HIPAA Security Rule (45 CFR §164.302-318) | Business Associate |
| OBL-PRIV-ACCESS-001 | GDPR Art. 15 | Processor (assist controller) |

## L5 — Controls

CTRL-AI-FRIA-AUTHORING-001 (FRIA), CTRL-AI-EVENT-LOG-001 (logging),
CTRL-AI-DATA-GOV-001 (bias + data gov), CTRL-INC-RESPONSE-72H-001
(breach + serious-incident — applies for both HIPAA 60-day breach + EU
AI Act 15-day serious-incident; the **stricter** EU 15-day applies for
EU patients). Crosswalk recorded as `stricter_than` in
CW-EUAIACT-ART73-DORA-ART19 pattern (HIPAA equivalent in v0.2).

## L6 — Mitigations

```yaml
- MIT-AI-HUMAN-REVIEW-GATE          # always — radiologist final decision
- MIT-AI-BIAS-TEST-PIPELINE         # subgroup parity by age + sex + ethnicity
- (entity-specific) MIT-MEDICAL-MODEL-CARD-PUBLIC: model card published
  publicly per FDA Good Machine Learning Practice (GMLP) guidance.
- (entity-specific) MIT-MEDICAL-PMS-REGISTRY: post-market surveillance
  registry of every flagged study + radiologist override + outcome.
```

## L7 — Architecture

ARCH-AI-LOG-001 (event collector — every inference logged with study
ID, model version, output, confidence, radiologist response). Persisted
in WORM hash-chained log. Retention 10 years per EU AI Act Art. 12 +
HIPAA 6-year minimum.

## L8 — Policy-as-code

POL-AI-FRIA-001 (Cerbos) + a HIPAA-specific bundle (community track —
adapts the four-eyes / region pattern to PHI access reviews).

## L9 — Workflows

- `WF-FRIA-AUTHORING` — for each EU hospital deployer
- `WF-INCIDENT-72H` — adapted: HIPAA 60-day breach window vs EU AI Act
  15-day serious-incident — workflow uses **min(deadlines)** = 15 days

## L10 — Evidence

```yaml
- EV-FRIA-RADIOLOGY-V2          (fria, retain 10y)
- EV-MDL-RADIOLOGY-V2           (model-card, public per GMLP)
- EV-DAT-RADIOLOGY-2025         (data-card, retain 10y)
- EV-AR-RADIOLOGY-PHI-2026Q2    (access-review, retain 6y)
- EV-LOG-RADIOLOGY-2026-04      (log, retain 10y)
- EV-INC-RADIOLOGY-2026-04      (incident-record, retain 10y)
- EV-CTR-BAA-HOSP-MAYO          (contract — Business Associate Agreement)
- EV-CTR-DPA-EU-HOSP-CHARITE    (contract — Data Processing Agreement)
```

## L11 — Audit trail

```yaml
controlId: CTRL-AI-FRIA-AUTHORING-001
controlOwner: Chief Medical Officer
evidenceOwner: AI Risk Owner
systemOwner: ML Platform Lead
testFrequency: on-event   # per hospital deployment
lastResult: pass
linkedRiskIds: [RISK-MEDICAL-AI-MISDIAGNOSIS, RISK-PHI-LEAK-HIPAA]
linkedAiSystemIds: [AI-SYS-RADIOLOGY-V2]
```

## L12 — Audit packs (two — regulator per jurisdiction)

```
audit-packs/EU-AIACT-RADIOLOGY-V2-2026Q2/
audit-packs/HIPAA-RADIOLOGY-V2-2026/
```

EU pack covers EU AI Act technical documentation Annex IV; HIPAA pack
covers HIPAA Security Rule + breach-notification posture + BAA evidence.

## L13 — AI Governance

```yaml
aiSystemId: AI-SYS-RADIOLOGY-V2
intendedPurpose: "Propose CT/MRI study priority orderings to a board-certified radiologist."
riskClassification: high-risk
euAiActAnnex: annex-iii-row-3
roles: [provider, deployer]
humanOversight: approve-each   # radiologist signs off on every priority change
postMarketMonitoring: { enabled: true, cadence: daily }
modelMonitoring: { driftDetection: true, performanceTracking: true, incidentLog: true }
conformityEvidenceIds:
  - EV-FRIA-RADIOLOGY-V2
  - EV-MDL-RADIOLOGY-V2
  - EV-DAT-RADIOLOGY-2025
modelChangeLog:
  - { version: "2.0.0", at: "2026-02-15T00:00:00Z", summary: "FDA 510(k) clearance + initial deployment." }
```

## Verdict

```yaml
launchReadiness:
  product: "AI radiology priority-ordering assistant"
  markets: [JUR-US, JUR-EU]
  applicableLaws:
    - hipaa@1996 (US PHI)
    - gdpr@2016-679 (EU)
    - eu-ai-act@2024-1689 (high-risk Annex III row 3)
    - eu-mdr (Class IIa medical device)
    - fda 510(k) (cleared)
  triggeredObligations: 10
  controlsImplemented: 5 ('high' confidence)
  architectureBlockers: 0
  evidenceGaps: 0
  residualRisks:
    - RISK-MEDICAL-AI-MISDIAGNOSIS (residual 6)
    - RISK-PHI-LEAK-HIPAA (residual 6)
  status: GO-WITH-CONDITIONS
  conditions:
    - Per-hospital FRIA before first production use (deployer obligation)
    - Daily post-market surveillance review during first 90 days at any new hospital
    - 15-day serious-incident reporting to EU AI Act + relevant national authority (PARALLEL with HIPAA 60-day breach notification — submit on the EARLIER deadline)
    - Maintain BAA with every US covered entity
    - Annual third-party clinical-validation audit
  reviewedBy: "Dr. R. Patel, MD JD (medical-device counsel) + ISO 13485 lead auditor"
  reviewedAt: 2026-04-22T11:30:00Z
```

---

**Disclaimer**: illustrative. See `LEGAL_DISCLAIMER.md`.
