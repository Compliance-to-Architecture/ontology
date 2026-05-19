/**
 * Ontology v0.1 — seed data.
 *
 * Hand-curated seed entries that prove the data model end-to-end across
 * all eight layers. Real, citable, and small enough to read in one sitting.
 * Future versions expand authority by authority.
 *
 * Apache-2.0. Copyright (c) 2026 Regunav Inc.
 */
import type {
  Authority, Obligation, Control, EvidenceObject, ArchitectureRequirement,
  PolicyAsCode, Ontology,
} from "./types.js";

export const ONTOLOGY_VERSION = "0.1.0";

// ─── 1. Authority Document Layer ───────────────────────────────────────
export const AUTHORITIES: readonly Authority[] = [
  { id: "eu-ai-act@2024-1689", shortName: "EU AI Act", title: "Regulation (EU) 2024/1689 on Artificial Intelligence",
    publisher: "European Parliament + Council", jurisdiction: ["EU","EEA"], version: "2024-1689",
    publishedAt: "2024-07-12", inForceFrom: "2024-08-01", applicableFrom: "2026-08-02",
    url: "https://eur-lex.europa.eu/eli/reg/2024/1689/oj", citation: "EU AI Act 2024/1689", category: "ai-regulation" },
  { id: "iso-42001@2023", shortName: "ISO/IEC 42001", title: "Information technology — Artificial intelligence — Management system",
    publisher: "ISO/IEC", jurisdiction: ["GLOBAL"], version: "2023",
    publishedAt: "2023-12-18", url: "https://www.iso.org/standard/81230.html",
    citation: "ISO/IEC 42001:2023", category: "industry-standard" },
  { id: "iso-27001@2022", shortName: "ISO/IEC 27001", title: "Information security management systems — Requirements",
    publisher: "ISO/IEC", jurisdiction: ["GLOBAL"], version: "2022",
    publishedAt: "2022-10-25", url: "https://www.iso.org/standard/27001",
    citation: "ISO/IEC 27001:2022", category: "industry-standard" },
  { id: "gdpr@2016-679", shortName: "GDPR", title: "Regulation (EU) 2016/679 — General Data Protection Regulation",
    publisher: "European Parliament + Council", jurisdiction: ["EU","EEA"], version: "2016-679",
    publishedAt: "2016-04-27", inForceFrom: "2018-05-25", applicableFrom: "2018-05-25",
    url: "https://eur-lex.europa.eu/eli/reg/2016/679/oj", citation: "GDPR 2016/679", category: "data-protection" },
  { id: "soc2@2017", shortName: "SOC 2", title: "Trust Services Criteria",
    publisher: "AICPA", jurisdiction: ["US","GLOBAL"], version: "2017 (revised 2022)",
    publishedAt: "2017-04-15", url: "https://www.aicpa.org/topic/audit-assurance/audit-and-assurance-greater-than-soc-2",
    citation: "SOC 2 TSC 2017", category: "industry-standard" },
  { id: "dora@2022-2554", shortName: "DORA", title: "Regulation (EU) 2022/2554 — Digital Operational Resilience Act",
    publisher: "European Parliament + Council", jurisdiction: ["EU","EEA"], version: "2022-2554",
    publishedAt: "2022-12-14", inForceFrom: "2023-01-16", applicableFrom: "2025-01-17",
    url: "https://eur-lex.europa.eu/eli/reg/2022/2554/oj", citation: "DORA 2022/2554", category: "financial-services" },
  { id: "nist-ai-rmf@1.0", shortName: "NIST AI RMF", title: "Artificial Intelligence Risk Management Framework 1.0",
    publisher: "NIST", jurisdiction: ["US","GLOBAL"], version: "1.0",
    publishedAt: "2023-01-26", url: "https://www.nist.gov/itl/ai-risk-management-framework",
    citation: "NIST AI RMF 1.0", category: "industry-standard" },
  { id: "pci-dss@4.0.1", shortName: "PCI DSS", title: "Payment Card Industry Data Security Standard",
    publisher: "PCI Security Standards Council", jurisdiction: ["GLOBAL"], version: "4.0.1",
    publishedAt: "2024-06-13", url: "https://www.pcisecuritystandards.org/document_library/",
    citation: "PCI DSS 4.0.1", category: "industry-standard" },
  { id: "hipaa@1996", shortName: "HIPAA", title: "Health Insurance Portability and Accountability Act + HITECH",
    publisher: "US Congress + HHS OCR", jurisdiction: ["US"], version: "1996 (amended)",
    publishedAt: "1996-08-21", url: "https://www.hhs.gov/hipaa", citation: "HIPAA 1996",
    category: "healthcare" },
  { id: "nist-csf@2.0", shortName: "NIST CSF", title: "Cybersecurity Framework 2.0",
    publisher: "NIST", jurisdiction: ["US","GLOBAL"], version: "2.0",
    publishedAt: "2024-02-26", url: "https://www.nist.gov/cyberframework",
    citation: "NIST CSF 2.0", category: "industry-standard" },
  // ── 4 authorities promoted from `mapped` → `implemented` in v0.1.0 ──
  { id: "iso-27701@2019", shortName: "ISO/IEC 27701", title: "Privacy information management — Extension to ISO/IEC 27001 and ISO/IEC 27002",
    publisher: "ISO/IEC", jurisdiction: ["GLOBAL"], version: "2019",
    publishedAt: "2019-08-06", url: "https://www.iso.org/standard/71670.html",
    citation: "ISO/IEC 27701:2019", category: "industry-standard" },
  { id: "nis2@2022-2555", shortName: "NIS2", title: "Directive (EU) 2022/2555 on measures for a high common level of cybersecurity across the Union",
    publisher: "European Parliament + Council", jurisdiction: ["EU","EEA"], version: "2022-2555",
    publishedAt: "2022-12-14", inForceFrom: "2023-01-16", applicableFrom: "2024-10-17",
    url: "https://eur-lex.europa.eu/eli/dir/2022/2555/oj", citation: "NIS2 Directive 2022/2555", category: "cybersecurity" },
  { id: "eu-cra@2024-2847", shortName: "EU CRA", title: "Regulation (EU) 2024/2847 — Cyber Resilience Act",
    publisher: "European Parliament + Council", jurisdiction: ["EU","EEA"], version: "2024-2847",
    publishedAt: "2024-11-20", inForceFrom: "2024-12-10", applicableFrom: "2027-12-11",
    url: "https://eur-lex.europa.eu/eli/reg/2024/2847/oj", citation: "EU CRA 2024/2847", category: "cybersecurity" },
  { id: "ferpa@1974", shortName: "FERPA", title: "Family Educational Rights and Privacy Act",
    publisher: "US Department of Education", jurisdiction: ["US"], version: "1974 (amended)",
    publishedAt: "1974-08-21", url: "https://www2.ed.gov/policy/gen/guid/fpco/ferpa/index.html",
    citation: "FERPA 20 U.S.C. § 1232g", category: "education" },
];

// ─── 2. Obligation Layer (canonical, framework-neutral) ────────────────
export const OBLIGATIONS: readonly Obligation[] = [
  { id: "OBL-PRIV-ACCESS-001", title: "Right of access to personal data", category: "privacy",
    statement: "Data subjects must be able to obtain confirmation that their personal data is being processed and access that data + metadata.",
    originatingClauses: [
      { authorityId: "gdpr@2016-679", clause: "Art. 15", url: "https://gdpr-info.eu/art-15-gdpr/" },
      { authorityId: "hipaa@1996", clause: "§164.524" },
    ] },
  { id: "OBL-PRIV-ERASURE-001", title: "Right to erasure", category: "privacy",
    statement: "Data subjects must be able to request deletion of their personal data subject to lawful exemptions.",
    originatingClauses: [
      { authorityId: "gdpr@2016-679", clause: "Art. 17" },
    ] },
  { id: "OBL-AI-FRIA-001", title: "Fundamental-rights impact assessment for high-risk AI", category: "ai-risk",
    statement: "Deployers of high-risk AI systems must perform a FRIA before deployment in the EU market.",
    originatingClauses: [
      { authorityId: "eu-ai-act@2024-1689", clause: "Art. 27" },
    ] },
  { id: "OBL-AI-RISK-MGMT-001", title: "AI risk-management system", category: "ai-risk",
    statement: "Providers of high-risk AI systems must establish and maintain a continuous risk-management system across the AI lifecycle.",
    originatingClauses: [
      { authorityId: "eu-ai-act@2024-1689", clause: "Art. 9" },
      { authorityId: "iso-42001@2023", clause: "§6.1" },
      { authorityId: "nist-ai-rmf@1.0", clause: "MAP-1" },
    ] },
  { id: "OBL-AI-DATA-GOV-001", title: "Training data governance + bias mitigation", category: "data-governance",
    statement: "Training, validation and test datasets must be relevant, representative, free of errors and assessed for bias.",
    originatingClauses: [
      { authorityId: "eu-ai-act@2024-1689", clause: "Art. 10" },
      { authorityId: "nist-ai-rmf@1.0", clause: "MEASURE-2.11" },
    ] },
  { id: "OBL-AI-LOGGING-001", title: "AI system event logging", category: "ai-risk",
    statement: "High-risk AI systems must automatically record events ensuring traceability of operation, impact and post-market monitoring.",
    originatingClauses: [
      { authorityId: "eu-ai-act@2024-1689", clause: "Art. 12" },
    ] },
  { id: "OBL-AI-OVERSIGHT-001", title: "Human oversight of high-risk AI", category: "human-oversight",
    statement: "High-risk AI systems must be designed to be effectively overseen by natural persons during use.",
    originatingClauses: [
      { authorityId: "eu-ai-act@2024-1689", clause: "Art. 14" },
      { authorityId: "iso-42001@2023", clause: "§7.4" },
    ] },
  { id: "OBL-AI-LITERACY-001", title: "AI literacy training of staff", category: "training",
    statement: "Providers and deployers must ensure their staff have an adequate level of AI literacy proportionate to their role.",
    originatingClauses: [
      { authorityId: "eu-ai-act@2024-1689", clause: "Art. 4" },
    ] },
  { id: "OBL-IAM-ACCESS-REVIEW-001", title: "Periodic access review", category: "security",
    statement: "Privileged access must be reviewed at a defined cadence, with results documented and remediated.",
    originatingClauses: [
      { authorityId: "iso-27001@2022", clause: "A.5.18" },
      { authorityId: "soc2@2017", clause: "CC6.3" },
      { authorityId: "pci-dss@4.0.1", clause: "Req. 7.2" },
    ] },
  { id: "OBL-INC-72H-001", title: "Personal-data breach notification within 72 hours", category: "incident-response",
    statement: "Personal-data breaches must be notified to the supervisory authority without undue delay and within 72 hours of awareness.",
    originatingClauses: [
      { authorityId: "gdpr@2016-679", clause: "Art. 33" },
    ] },
  { id: "OBL-AI-INC-REPORT-001", title: "Serious-incident reporting for AI systems", category: "incident-response",
    statement: "Providers of high-risk AI systems must report serious incidents to the market-surveillance authority.",
    originatingClauses: [
      { authorityId: "eu-ai-act@2024-1689", clause: "Art. 73" },
    ] },
  { id: "OBL-DORA-ICT-INC-001", title: "Major ICT-related incident reporting", category: "incident-response",
    statement: "Financial entities must report major ICT-related incidents to the competent authority.",
    originatingClauses: [
      { authorityId: "dora@2022-2554", clause: "Art. 19" },
    ] },
];

// ─── 3. Common Control Layer ───────────────────────────────────────────
export const CONTROLS: readonly Control[] = [
  { id: "CTRL-IAM-ACCESS-REVIEW-001", title: "Quarterly privileged-access review", category: "identity-access",
    statement: "Privileged accounts and roles are reviewed every 90 days. Removals are tracked through an approval workflow.",
    satisfies: ["OBL-IAM-ACCESS-REVIEW-001"],
    crosswalk: [
      { framework: "ISO 27001", ref: "A.5.18" },
      { framework: "SOC 2", ref: "CC6.3" },
      { framework: "PCI DSS", ref: "Req. 7.2" },
      { framework: "NIST CSF", ref: "PR.AA-05" },
    ] },
  { id: "CTRL-INC-RESPONSE-72H-001", title: "Personal-data-breach 72h response runbook", category: "incident-response",
    statement: "Documented runbook + tabletop drill + paging chain that triggers GDPR Art. 33 notification within 72 hours of awareness.",
    satisfies: ["OBL-INC-72H-001", "OBL-AI-INC-REPORT-001", "OBL-DORA-ICT-INC-001"],
    crosswalk: [
      { framework: "GDPR", ref: "Art. 33" },
      { framework: "EU AI Act", ref: "Art. 73" },
      { framework: "DORA", ref: "Art. 19" },
      { framework: "ISO 27001", ref: "A.5.24, A.5.26" },
    ] },
  { id: "CTRL-AI-FRIA-AUTHORING-001", title: "FRIA authoring + sign-off workflow", category: "ai-system-governance",
    statement: "Every high-risk AI system has a FRIA authored, reviewed and signed off before deployment, version-controlled per system.",
    satisfies: ["OBL-AI-FRIA-001", "OBL-AI-RISK-MGMT-001"],
    crosswalk: [
      { framework: "EU AI Act", ref: "Art. 27" },
      { framework: "ISO 42001", ref: "§8.2" },
    ] },
  { id: "CTRL-AI-EVENT-LOG-001", title: "Automatic AI-system event logging", category: "logging-monitoring",
    statement: "AI systems automatically emit structured events to an immutable WORM log: input class, output, confidence, oversight action, model version.",
    satisfies: ["OBL-AI-LOGGING-001"],
    crosswalk: [
      { framework: "EU AI Act", ref: "Art. 12" },
      { framework: "ISO 42001", ref: "§9.1" },
    ] },
  { id: "CTRL-AI-DATA-GOV-001", title: "Training-data governance + bias-test gating", category: "ai-system-governance",
    statement: "Datasets pass the bias-test engine + lineage capture before any training run promotes to production.",
    satisfies: ["OBL-AI-DATA-GOV-001"],
    crosswalk: [
      { framework: "EU AI Act", ref: "Art. 10" },
      { framework: "NIST AI RMF", ref: "MEASURE-2.11" },
      { framework: "ISO 42001", ref: "§7.4" },
    ] },
  { id: "CTRL-AI-LITERACY-001", title: "Annual AI-literacy training register", category: "training",
    statement: "Every staff member touching AI completes a role-specific AI-literacy module annually; completions tracked via the training-records rail.",
    satisfies: ["OBL-AI-LITERACY-001"],
    crosswalk: [{ framework: "EU AI Act", ref: "Art. 4" }] },
];

// ─── 4. Evidence Layer ────────────────────────────────────────────────
export const EVIDENCE: readonly EvidenceObject[] = [
  { id: "EV-IAM-001", title: "Privileged access review report", forControl: "CTRL-IAM-ACCESS-REVIEW-001",
    type: "access-review", owner: "Security Admin",
    source: ["IAM provider", "HRIS", "Ticketing"], frequency: "quarterly", retentionYears: 6 },
  { id: "EV-INC-001", title: "Incident response runbook + tabletop record", forControl: "CTRL-INC-RESPONSE-72H-001",
    type: "procedure", owner: "Incident Commander",
    source: ["Confluence/Notion", "PagerDuty post-mortems"], frequency: "annual", retentionYears: 7 },
  { id: "EV-INC-002", title: "Regulator notification draft + timestamp", forControl: "CTRL-INC-RESPONSE-72H-001",
    type: "incident-record", owner: "DPO",
    source: ["incident-disclosures rail"], frequency: "on-event", retentionYears: 7 },
  { id: "EV-FRIA-001", title: "FRIA report — signed", forControl: "CTRL-AI-FRIA-AUTHORING-001",
    type: "fria", owner: "AI Risk Owner",
    source: ["FRIA agent output", "approver chain"], frequency: "on-event", retentionYears: 10 },
  { id: "EV-AI-LOG-001", title: "AI-system event-log retention attestation", forControl: "CTRL-AI-EVENT-LOG-001",
    type: "audit-trail-export", owner: "Platform SRE",
    source: ["audit-trail rail", "OLAP warehouse"], frequency: "monthly", retentionYears: 10 },
  { id: "EV-DATA-GOV-001", title: "Bias-test results + dataset card", forControl: "CTRL-AI-DATA-GOV-001",
    type: "report", owner: "ML Platform Lead",
    source: ["bias-tester engine", "data-lineage engine"], frequency: "on-event", retentionYears: 10 },
  { id: "EV-DATA-GOV-002", title: "Dataset card (Datasheets-for-Datasets)", forControl: "CTRL-AI-DATA-GOV-001",
    type: "data-card", owner: "Data Steward",
    source: ["data-lineage rail"], frequency: "on-event", retentionYears: 10 },
  { id: "EV-TRAINING-001", title: "AI-literacy training register export", forControl: "CTRL-AI-LITERACY-001",
    type: "training-record", owner: "People Ops",
    source: ["training-records rail"], frequency: "monthly", retentionYears: 5 },
];

// ─── 5. Software Architecture Layer ───────────────────────────────────
export const ARCHITECTURE: readonly ArchitectureRequirement[] = [
  { id: "ARCH-IAM-001", forControl: "CTRL-IAM-ACCESS-REVIEW-001",
    title: "RBAC/ABAC policy engine + scheduled review job",
    capability: "rbac-abac-policy-engine",
    statement: "System enforces RBAC/ABAC at every boundary, with a scheduled job that emits review tasks every 90 days.",
    patterns: [
      { cloud: "any", summary: "Cerbos PEP at every API gateway + Edge worker", stack: ["Cerbos Hub", "Cloudflare Workers"] },
      { cloud: "aws", summary: "Cognito + Verified Permissions (Cedar) + EventBridge cron", stack: ["AWS Cedar", "EventBridge"] },
    ],
    verification: "Synthetic privileged user → review task auto-created in next cycle." },
  { id: "ARCH-IAM-002", forControl: "CTRL-IAM-ACCESS-REVIEW-001",
    title: "Approval workflow",
    capability: "approval-workflow",
    statement: "Removal/grant requests follow a documented multi-party approval chain, surfaced in dashboard + audit trail.",
    patterns: [{ cloud: "any", summary: "Hierarchy rail (TeamMembership) + policy-lifecycle rail" }] },
  { id: "ARCH-INC-001", forControl: "CTRL-INC-RESPONSE-72H-001",
    title: "Immutable audit log + paging chain",
    capability: "immutable-audit-log",
    statement: "WORM audit trail (append-only, hash-chained) + on-call paging that triggers within 5 minutes of breach detection.",
    patterns: [{ cloud: "any", summary: "audit-trail rail (R2 + ClickHouse) + PagerDuty integration" }],
    verification: "Tabletop drill emits the regulator-shaped notification draft within the deadline." },
  { id: "ARCH-AI-LOG-001", forControl: "CTRL-AI-EVENT-LOG-001",
    title: "AI-system event collector",
    capability: "tenant-aware-identity",
    statement: "Every AI inference emits a tenant-scoped, structured event with input class, output, confidence, model version.",
    patterns: [{ cloud: "any", summary: "audit-trail rail with `kind: ai-inference` events; OLAP-queryable" }] },
  { id: "ARCH-AI-FRIA-001", forControl: "CTRL-AI-FRIA-AUTHORING-001",
    title: "FRIA agent + approver chain",
    capability: "ai-system-registry",
    statement: "AI system registry triggers a FRIA agent run on every new high-risk system; FRIA goes through documented approver chain.",
    patterns: [{ cloud: "any", summary: "ai-systems rail + agents rail + policy-lifecycle approvals" }] },
  { id: "ARCH-DATA-GOV-001", forControl: "CTRL-AI-DATA-GOV-001",
    title: "Bias-test gate + lineage capture",
    capability: "data-lineage",
    statement: "No training run is promoted to production without a passing bias-test report + lineage trace.",
    patterns: [{ cloud: "any", summary: "bias-tester engine + data-lineage engine + gate in deploy.yml" }] },
];

// ─── 6. Policy-as-Code Layer ───────────────────────────────────────────
export const POLICIES: readonly PolicyAsCode[] = [
  { id: "POL-IAM-PRIV-001", forControl: "CTRL-IAM-ACCESS-REVIEW-001", engine: "cerbos",
    decisionType: "abac", evidenceRequired: true,
    bundleUri: "config/cerbos/policies/iam-priv.yaml",
    testFixtures: ["config/cerbos/tests/iam-priv.yaml"] },
  { id: "POL-AI-FRIA-001", forControl: "CTRL-AI-FRIA-AUTHORING-001", engine: "cerbos",
    decisionType: "obligation", evidenceRequired: true,
    bundleUri: "config/cerbos/policies/ai-fria.yaml",
    testFixtures: ["config/cerbos/tests/ai-fria.yaml"] },
  { id: "POL-INC-72H-001", forControl: "CTRL-INC-RESPONSE-72H-001", engine: "cerbos",
    decisionType: "obligation", evidenceRequired: true,
    bundleUri: "config/cerbos/policies/incident-72h.yaml",
    testFixtures: ["config/cerbos/tests/incident-72h.yaml"] },
];

// ─── 7. Audit Trail Layer ─────────────────────────────────────────────
// Worked examples of the runtime "who owns it / who tests it / when it
// last passed" record the SPEC requires. One per control in the seed.
import type { AuditTrailLink, AiSystemGovernance } from "./types.js";

export const AUDIT_TRAIL_LINKS: readonly AuditTrailLink[] = [
  {
    controlId: "CTRL-IAM-ACCESS-REVIEW-001",
    controlOwner: "CISO",
    evidenceOwner: "Security Admin",
    systemOwner: "Platform SRE",
    testFrequency: "quarterly",
    lastTestedAt: "2026-04-15T09:00:00Z",
    lastResult: "pass",
    linkedRiskIds: ["RISK-IAM-PRIV-DRIFT"],
    linkedPolicyIds: ["POL-IAM-PRIV-001"],
    linkedAssetIds: ["ASSET-IAM-PROVIDER", "ASSET-HRIS"],
    linkedVendorIds: ["VENDOR-OKTA", "VENDOR-WORKDAY"],
    linkedAiSystemIds: [],
  },
  {
    controlId: "CTRL-INC-RESPONSE-72H-001",
    controlOwner: "DPO",
    evidenceOwner: "Incident Commander",
    systemOwner: "Platform SRE",
    testFrequency: "annual",
    lastTestedAt: "2026-02-08T14:00:00Z",
    lastResult: "pass",
    linkedRiskIds: ["RISK-INC-SLA-MISS", "RISK-PII-LEAK"],
    linkedPolicyIds: ["POL-INC-72H-001"],
    linkedAssetIds: ["ASSET-PAGERDUTY", "ASSET-AUDIT-TRAIL"],
    linkedVendorIds: ["VENDOR-PAGERDUTY"],
    linkedAiSystemIds: [],
  },
  {
    controlId: "CTRL-AI-FRIA-AUTHORING-001",
    controlOwner: "AI Risk Owner",
    evidenceOwner: "AI Risk Owner",
    systemOwner: "ML Platform Lead",
    testFrequency: "on-event",
    lastTestedAt: "2026-04-22T11:30:00Z",
    lastResult: "pass",
    linkedRiskIds: ["RISK-AI-FRIA-LATE", "RISK-AI-RIGHTS-IMPACT"],
    linkedPolicyIds: ["POL-AI-FRIA-001"],
    linkedAssetIds: ["ASSET-FRIA-AGENT", "ASSET-AI-SYSTEM-REGISTRY"],
    linkedVendorIds: [],
    linkedAiSystemIds: ["AI-SYS-CREDIT-SCORING-V3", "AI-SYS-RESUME-SCREEN-V2"],
  },
];

// ─── 8. AI Governance Layer ───────────────────────────────────────────
// Worked examples of the AI-system metadata record the SPEC requires.
// One high-risk + one limited-risk to show the spread.
export const AI_SYSTEM_GOVERNANCE: readonly AiSystemGovernance[] = [
  {
    aiSystemId: "AI-SYS-CREDIT-SCORING-V3",
    intendedPurpose: "Score consumer credit applications for unsecured-loan products in the EU/UK retail bank channel.",
    riskClassification: "high-risk",
    euAiActAnnex: "annex-iii-row-5",  // creditworthiness assessment
    roles: ["provider", "deployer"],
    dataGovernance: {
      trainingDatasets: ["DAT-CREDIT-2024-Q4", "DAT-CREDIT-2025-Q1"],
      biasTested: true,
      lineageDocumented: true,
    },
    humanOversight: "approve-each",
    modelMonitoring: {
      driftDetection: true,
      performanceTracking: true,
      incidentLog: true,
    },
    postMarketMonitoring: {
      enabled: true,
      cadence: "monthly",
    },
    conformityEvidenceIds: ["EV-FRIA-CREDIT-V3", "EV-MDL-CREDIT-V3", "EV-DAT-CREDIT-2025-Q1"],
    modelChangeLog: [
      { version: "3.0.0", at: "2026-03-01T00:00:00Z", summary: "Initial production release after FRIA approval." },
      { version: "3.0.1", at: "2026-04-12T00:00:00Z", summary: "Bias mitigation re-weighting on protected attribute X." },
    ],
  },
  {
    aiSystemId: "AI-SYS-DOCUMENT-CLASSIFIER-V1",
    intendedPurpose: "Classify uploaded compliance evidence into one of the 16 canonical EvidenceType kinds.",
    riskClassification: "limited",
    euAiActAnnex: "n/a",
    roles: ["provider", "deployer"],
    dataGovernance: {
      trainingDatasets: ["DAT-EVIDENCE-LABELS-2025"],
      biasTested: false,
      lineageDocumented: true,
    },
    humanOversight: "exception-only",
    modelMonitoring: {
      driftDetection: true,
      performanceTracking: true,
      incidentLog: false,
    },
    postMarketMonitoring: {
      enabled: false,
      cadence: "monthly",
    },
    conformityEvidenceIds: ["EV-MDL-DOC-CLASSIFIER-V1"],
    modelChangeLog: [
      { version: "1.0.0", at: "2026-01-10T00:00:00Z", summary: "Production release." },
    ],
  },
];

// ─── L0 — Risk scenarios ──────────────────────────────────────────────
import type {
  RiskScenario, Jurisdiction, Regulator, ApplicabilityRule, Mitigation,
  Workflow, AuditPack, ControlTest, MonitorBinding, CrosswalkRelation,
} from "./types.js";

export const RISK_SCENARIOS: readonly RiskScenario[] = [
  {
    id: "RISK-AI-HIRING-DISCRIMINATION",
    title: "AI-mediated hiring decisions discriminate against protected classes",
    domain: "ai-safety",
    harmType: ["discrimination", "loss-of-opportunity", "psychological-harm"],
    threatActors: ["model-bias", "training-data-skew", "deployer-misuse"],
    affectedStakeholders: ["job-applicants", "protected-classes", "labor-market"],
    likelihood: 4,
    impact: 4,
    inherentScore: 16,
    mappedControls: ["CTRL-AI-DATA-GOV-001", "CTRL-AI-FRIA-AUTHORING-001", "CTRL-AI-EVENT-LOG-001", "CTRL-AI-LITERACY-001"],
    mappedMitigations: ["MIT-AI-BIAS-TEST-PIPELINE", "MIT-AI-HUMAN-REVIEW-GATE"],
    residualRiskScore: 8,
  },
  {
    id: "RISK-PII-LEAK-72H",
    title: "Personal-data breach without 72h notification breaches GDPR Art. 33",
    domain: "privacy",
    harmType: ["regulatory-fine", "loss-of-trust", "data-subject-harm"],
    threatActors: ["malicious-insider", "supply-chain-compromise", "operational-failure"],
    affectedStakeholders: ["data-subjects", "controller", "processors"],
    likelihood: 3,
    impact: 5,
    inherentScore: 15,
    mappedControls: ["CTRL-INC-RESPONSE-72H-001"],
    mappedMitigations: ["MIT-INC-PAGING-CHAIN", "MIT-INC-TABLETOP-DRILL"],
    residualRiskScore: 6,
  },
  {
    id: "RISK-DORA-ICT-OUTAGE",
    title: "Critical ICT service outage at financial entity exceeds DORA recovery thresholds",
    domain: "resilience",
    harmType: ["service-disruption", "financial-loss", "regulatory-fine"],
    threatActors: ["operational-failure", "supply-chain-compromise", "cyber-attack"],
    affectedStakeholders: ["customers", "counterparties", "supervisors"],
    likelihood: 3,
    impact: 5,
    inherentScore: 15,
    mappedControls: ["CTRL-INC-RESPONSE-72H-001"],
    mappedMitigations: ["MIT-DORA-FAILOVER", "MIT-DORA-THIRD-PARTY-REGISTER"],
    residualRiskScore: 6,
  },
];

// ─── L2 — Jurisdictions + Regulators ──────────────────────────────────
export const REGULATORS: readonly Regulator[] = [
  { id: "REG-EU-AI-OFFICE", name: "EU AI Office", jurisdiction: "JUR-EU", mandate: ["ai-act-supervision"] },
  { id: "REG-EDPB", name: "European Data Protection Board", jurisdiction: "JUR-EU", mandate: ["data-protection"] },
  { id: "REG-ICO-UK", name: "Information Commissioner's Office", jurisdiction: "JUR-UK", mandate: ["data-protection"] },
  { id: "REG-CPPA", name: "California Privacy Protection Agency", jurisdiction: "JUR-US-CA", mandate: ["data-protection"] },
  { id: "REG-CA-AG", name: "California Attorney General", jurisdiction: "JUR-US-CA", mandate: ["consumer-protection"] },
  { id: "REG-FTC", name: "Federal Trade Commission", jurisdiction: "JUR-US", mandate: ["consumer-protection", "competition"] },
  { id: "REG-HHS-OCR", name: "HHS Office for Civil Rights", jurisdiction: "JUR-US", mandate: ["hipaa-enforcement"] },
  { id: "REG-BAFIN", name: "Federal Financial Supervisory Authority (BaFin)", jurisdiction: "JUR-DE", mandate: ["financial-supervision", "dora-supervision"] },
  { id: "REG-FCA-UK", name: "Financial Conduct Authority", jurisdiction: "JUR-UK", mandate: ["financial-supervision"] },
  { id: "REG-OAIC-AU", name: "Office of the Australian Information Commissioner", jurisdiction: "JUR-AU", mandate: ["data-protection"] },
];

export const JURISDICTIONS: readonly Jurisdiction[] = [
  { id: "JUR-EU", name: "European Union", regulators: ["REG-EU-AI-OFFICE", "REG-EDPB"], treatyMemberships: ["EEA"], childJurisdictions: ["JUR-DE", "JUR-FR", "JUR-IT", "JUR-ES", "JUR-NL"] },
  { id: "JUR-DE", name: "Germany", parent: "JUR-EU", regulators: ["REG-BAFIN"] },
  { id: "JUR-UK", name: "United Kingdom", regulators: ["REG-ICO-UK", "REG-FCA-UK"] },
  { id: "JUR-US", name: "United States (federal)", regulators: ["REG-FTC", "REG-HHS-OCR"], childJurisdictions: ["JUR-US-CA"] },
  { id: "JUR-US-CA", name: "California", parent: "JUR-US", regulators: ["REG-CPPA", "REG-CA-AG"] },
  { id: "JUR-AU", name: "Australia", regulators: ["REG-OAIC-AU"] },
];

// ─── L3 — Applicability rules ─────────────────────────────────────────
export const APPLICABILITY_RULES: readonly ApplicabilityRule[] = [
  {
    id: "APP-EU-AIACT-HIRING-HIGHRISK",
    instrument: "eu-ai-act@2024-1689",
    appliesIf: [
      { variable: "aiSystemSoldOrDeployedIn", op: "eq", value: "JUR-EU" },
      { variable: "aiSystemUsedFor", op: "in", value: ["recruitment", "selection", "employment-management"] },
      { variable: "aiSystemAffectsNaturalPersons", op: "eq", value: "true" },
    ],
    output: "applies-as-high-risk",
    triggeredObligations: ["OBL-AI-RISK-MGMT-001", "OBL-AI-DATA-GOV-001", "OBL-AI-LOGGING-001", "OBL-AI-OVERSIGHT-001", "OBL-AI-FRIA-001", "OBL-AI-INC-REPORT-001"],
    effectiveDate: "2024-08-01",
    applicableDate: "2026-08-02",
    note: "EU AI Act Annex III row 4 — employment, workers management, access to self-employment.",
  },
  {
    id: "APP-GDPR-PROCESSING-EU-SUBJECTS",
    instrument: "gdpr@2016-679",
    appliesIf: [
      { variable: "processesPersonalData", op: "eq", value: "true" },
      { variable: "subjectLocatedIn", op: "in", value: ["JUR-EU", "JUR-EEA"] },
    ],
    output: "applies",
    triggeredObligations: ["OBL-PRIV-ACCESS-001", "OBL-PRIV-ERASURE-001"],
    effectiveDate: "2018-05-25",
    applicableDate: "2018-05-25",
    note: "Territorial scope per Art. 3.",
  },
  {
    id: "APP-DORA-FINANCIAL-ENTITY",
    instrument: "dora@2022-2554",
    appliesIf: [
      { variable: "entityKind", op: "in", value: ["credit-institution", "payment-institution", "investment-firm", "insurance-undertaking", "ict-third-party-service-provider"] },
      { variable: "operatesIn", op: "in", value: ["JUR-EU"] },
    ],
    output: "applies",
    triggeredObligations: ["OBL-DORA-ICT-INC-001"],
    effectiveDate: "2023-01-16",
    applicableDate: "2025-01-17",
  },
];

// ─── L6 — Mitigations ─────────────────────────────────────────────────
export const MITIGATIONS: readonly Mitigation[] = [
  {
    id: "MIT-AI-BIAS-TEST-PIPELINE",
    title: "Demographic-parity + equalised-odds gate on every model promotion",
    reduces: "RISK-AI-HIRING-DISCRIMINATION",
    control: "CTRL-AI-DATA-GOV-001",
    mechanism: "Bias-test suite runs on every candidate model. Failure to meet the configured threshold blocks the deploy pipeline; over-ride requires four-eyes approval + recorded justification.",
    effectivenessEvidence: "EV-DATA-GOV-001",
    residualRiskDelta: 4,
  },
  {
    id: "MIT-AI-HUMAN-REVIEW-GATE",
    title: "Human reviewer gates every AI-recommended adverse decision",
    reduces: "RISK-AI-HIRING-DISCRIMINATION",
    control: "CTRL-AI-FRIA-AUTHORING-001",
    mechanism: "AI score is decision support, not decision. Every recommended rejection routes to a human reviewer before notice is sent to the applicant.",
    effectivenessEvidence: "EV-FRIA-001",
    residualRiskDelta: 4,
  },
  {
    id: "MIT-INC-PAGING-CHAIN",
    title: "5-minute on-call paging on breach detection",
    reduces: "RISK-PII-LEAK-72H",
    control: "CTRL-INC-RESPONSE-72H-001",
    mechanism: "PagerDuty integration triggers on detection events from audit-trail rail. Acknowledgement SLA 5 minutes; fall-through to secondary on-call after 10.",
    effectivenessEvidence: "EV-INC-001",
    residualRiskDelta: 5,
  },
  {
    id: "MIT-INC-TABLETOP-DRILL",
    title: "Annual incident-response tabletop with regulator-shaped notification draft",
    reduces: "RISK-PII-LEAK-72H",
    control: "CTRL-INC-RESPONSE-72H-001",
    mechanism: "Tabletop drill emits the regulator-shaped notification draft within the deadline. Failure to meet the deadline is a finding.",
    effectivenessEvidence: "EV-INC-002",
    residualRiskDelta: 4,
  },
  {
    id: "MIT-DORA-FAILOVER",
    title: "Active-active multi-region failover for critical ICT services",
    reduces: "RISK-DORA-ICT-OUTAGE",
    control: "CTRL-INC-RESPONSE-72H-001",
    mechanism: "Critical services run in two CF regions with active-active replication. RTO < 15 min, RPO < 1 min.",
    residualRiskDelta: 5,
  },
  {
    id: "MIT-DORA-THIRD-PARTY-REGISTER",
    title: "Maintained third-party-register with concentration risk + exit plans",
    reduces: "RISK-DORA-ICT-OUTAGE",
    control: "CTRL-INC-RESPONSE-72H-001",
    mechanism: "Every ICT third-party recorded with concentration tier + documented exit plan. Annual review by ICT risk committee.",
    residualRiskDelta: 4,
  },
];

// ─── L9 — Workflows ───────────────────────────────────────────────────
export const WORKFLOWS: readonly Workflow[] = [
  {
    id: "WF-FRIA-AUTHORING",
    title: "FRIA authoring + approval (EU AI Act Art. 27)",
    forControl: "CTRL-AI-FRIA-AUTHORING-001",
    trigger: "AI system status flips to deployed-in-eu",
    fourEyesGate: true,
    deadlineHours: 168,                          // 7 days before first production use
    steps: [
      { id: "WF-FRIA-S1", title: "Author FRIA draft", owner: "AI Risk Owner", outputArtefacts: ["EV-FRIA-DRAFT"] },
      { id: "WF-FRIA-S2", title: "DPO consultation", owner: "DPO", inputArtefacts: ["EV-FRIA-DRAFT"] },
      { id: "WF-FRIA-S3", title: "Business-owner approval", owner: "Business Owner", approvers: ["AI Risk Owner"], slaHours: 48 },
      { id: "WF-FRIA-S4", title: "Final FRIA emit", owner: "AI Risk Owner", outputArtefacts: ["EV-FRIA-001"] },
    ],
  },
  {
    id: "WF-INCIDENT-72H",
    title: "Incident response within 72-hour notification window (GDPR Art. 33 + DORA Art. 19)",
    forControl: "CTRL-INC-RESPONSE-72H-001",
    trigger: "Severity ≥ critical incident detected",
    fourEyesGate: true,
    deadlineHours: 72,
    steps: [
      { id: "WF-INC-S1", title: "Triage + classify", owner: "Incident Commander", slaHours: 1 },
      { id: "WF-INC-S2", title: "Containment + initial evidence capture", owner: "Incident Commander", outputArtefacts: ["EV-INC-001"], slaHours: 4 },
      { id: "WF-INC-S3", title: "Regulator-notification draft", owner: "DPO", outputArtefacts: ["EV-INC-002"], slaHours: 24 },
      { id: "WF-INC-S4", title: "Submission with four-eyes sign-off", owner: "DPO", approvers: ["AI Risk Owner", "Legal Counsel"], slaHours: 48 },
    ],
  },
];

// ─── L12 — Audit packs (template) ─────────────────────────────────────
export const AUDIT_PACKS: readonly AuditPack[] = [
  {
    id: "PACK-EU-AIACT-HIGHRISK-V1",
    title: "EU AI Act technical-documentation pack (Annex IV)",
    forAuthority: "eu-ai-act@2024-1689",
    periodStart: "2026-01-01",
    periodEnd: "2026-12-31",
    disclaimerEmbedded: true,
    sections: [
      { title: "Cover + signatures", evidenceIds: [], required: true },
      { title: "FRIA (deployer)", evidenceIds: ["EV-FRIA-001"], required: true, authorityRefs: [{ authority: "eu-ai-act@2024-1689", clause: "Art. 27" }] },
      { title: "Model card", evidenceIds: [], required: true, authorityRefs: [{ authority: "eu-ai-act@2024-1689", clause: "Annex IV §2(d)" }] },
      { title: "Data card", evidenceIds: [], required: true, authorityRefs: [{ authority: "eu-ai-act@2024-1689", clause: "Art. 10" }] },
      { title: "Bias-test report", evidenceIds: ["EV-DATA-GOV-001"], required: true },
      { title: "Event-log retention attestation", evidenceIds: ["EV-AI-LOG-001"], required: true, authorityRefs: [{ authority: "eu-ai-act@2024-1689", clause: "Art. 12" }] },
      { title: "Human-oversight evidence", evidenceIds: [], required: true, authorityRefs: [{ authority: "eu-ai-act@2024-1689", clause: "Art. 14" }] },
      { title: "Incident log", evidenceIds: [], required: false, authorityRefs: [{ authority: "eu-ai-act@2024-1689", clause: "Art. 73" }] },
      { title: "Conformity declaration", evidenceIds: [], required: true },
      { title: "Citation of framework version", evidenceIds: [], required: true },
    ],
  },
];

// ─── ControlTests + MonitorBindings ──────────────────────────────────
export const CONTROL_TESTS: readonly ControlTest[] = [
  {
    id: "TEST-CTRL-IAM-ACCESS-REVIEW-2026Q2",
    controlId: "CTRL-IAM-ACCESS-REVIEW-001",
    method: "manual",
    frequency: "quarterly",
    sampleStrategy: "all",
    sampleSize: 47,
    populationSize: 47,
    expectedResult: "Every privileged grant either retained, modified, or revoked with a recorded rationale; sign-off principal distinct from creator/subject.",
    actualResult: "47 of 47 reviewed; 38 retained, 6 modified, 3 revoked; sign-off distinct in all cases.",
    result: "pass",
    performedAt: "2026-04-15T09:00:00Z",
    performedBy: "Security Admin (Jane Smith)",
    evidenceIds: ["EV-IAM-001"],
    assuranceLevel: "high",
  },
  {
    id: "TEST-CTRL-INC-RESPONSE-2026",
    controlId: "CTRL-INC-RESPONSE-72H-001",
    method: "hybrid",
    frequency: "annual",
    expectedResult: "Tabletop drill produces a regulator-shaped notification within the 72h deadline.",
    actualResult: "Drill produced notification draft within 26h.",
    result: "pass",
    performedAt: "2026-02-08T14:00:00Z",
    performedBy: "Incident Commander + DPO",
    evidenceIds: ["EV-INC-001"],
    assuranceLevel: "high",
  },
];

export const MONITOR_BINDINGS: readonly MonitorBinding[] = [
  {
    id: "MON-DRIFT-CREDIT-V3",
    forSystem: "AI-SYS-CREDIT-SCORING-V3",
    kind: "drift",
    thresholdSpec: "Demographic-parity delta > 5% triggers WARNING; > 10% triggers CRITICAL.",
    emitsEvidence: true,
    cadence: "continuous",
  },
  {
    id: "MON-EVIDENCE-STALENESS-FRIA",
    forControl: "CTRL-AI-FRIA-AUTHORING-001",
    kind: "evidence-staleness",
    thresholdSpec: "FRIA older than 365 days triggers WARNING; older than 730 days triggers CRITICAL.",
    emitsEvidence: true,
    cadence: "daily",
  },
];

// ─── Crosswalk relations (typed) ─────────────────────────────────────
export const CROSSWALK_RELATIONS: readonly CrosswalkRelation[] = [
  {
    id: "CW-ISO27001-A5.18-SOC2-CC6.3",
    source: { authority: "iso-27001@2022", clause: "A.5.18" },
    target: { authority: "soc2@2017", clause: "CC6.3" },
    relation: "equivalent",
    confidence: "high",
    rationale: "Both clauses require periodic review of privileged access. ISO 27001 A.5.18 + SOC 2 CC6.3 list the same control objective with the same expected cadence (at least annually, preferred quarterly).",
    reviewer: "ISO 27001 Lead Auditor (J. Smith)",
    reviewedAt: "2026-04-22T11:30:00Z",
  },
  {
    id: "CW-ISO27001-A5.18-PCIDSS-7.2.5",
    source: { authority: "iso-27001@2022", clause: "A.5.18" },
    target: { authority: "pci-dss@4.0.1", clause: "Req. 7.2.5" },
    relation: "stricter_than",
    confidence: "high",
    rationale: "PCI DSS Req. 7.2.5 requires review every 6 months; ISO 27001 A.5.18 implies quarterly cadence in a typical interpretation. ISO is stricter on frequency.",
    reviewer: "ISO 27001 Lead Auditor (J. Smith)",
    reviewedAt: "2026-04-22T11:30:00Z",
  },
  {
    id: "CW-EUAIACT-ART73-DORA-ART19",
    source: { authority: "eu-ai-act@2024-1689", clause: "Art. 73" },
    target: { authority: "dora@2022-2554", clause: "Art. 19" },
    relation: "overlaps",
    confidence: "medium",
    rationale: "EU AI Act Art. 73 (serious-incident reporting for AI systems) and DORA Art. 19 (ICT-incident reporting for financial entities) both require regulator notification but on different timelines (15 days vs progressive: initial 4h, intermediate 72h, final 1 month). For financial-sector AI systems, both apply concurrently.",
    reviewer: "Financial-services compliance lead (R. Müller)",
    reviewedAt: "2026-04-22T11:30:00Z",
  },
];

export const ONTOLOGY: Ontology = {
  version: ONTOLOGY_VERSION,
  authorities: AUTHORITIES,
  obligations: OBLIGATIONS,
  controls: CONTROLS,
  evidence: EVIDENCE,
  architecture: ARCHITECTURE,
  policies: POLICIES,
  auditTrailLinks: AUDIT_TRAIL_LINKS,
  aiSystemGovernance: AI_SYSTEM_GOVERNANCE,
  riskScenarios: RISK_SCENARIOS,
  jurisdictions: JURISDICTIONS,
  regulators: REGULATORS,
  applicabilityRules: APPLICABILITY_RULES,
  mitigations: MITIGATIONS,
  workflows: WORKFLOWS,
  auditPacks: AUDIT_PACKS,
  controlTests: CONTROL_TESTS,
  monitorBindings: MONITOR_BINDINGS,
  crosswalkRelations: CROSSWALK_RELATIONS,
};
