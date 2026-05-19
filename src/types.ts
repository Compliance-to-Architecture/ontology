/**
 * @regunav/ontology — Compliance-to-Architecture Framework™
 *
 * The Universal Compliance Ontology. Eight typed layers that turn the chaos
 * of "ISO maps to GDPR" into an executable graph from regulation → control
 * → evidence → software architecture → policy-as-code → audit trail →
 * AI governance.
 *
 * This package is INTENTIONALLY minimal in surface — types + IDs + queries
 * only. The data lives in @regunav/ontology-seed (next package) and the
 * HTTP surface is mounted by services/api/src/routes/ontology.ts.
 *
 * The framework is published openly (Apache-2.0) — the engine that runs
 * on it is the commercial product. See SPEC.md for the public framework
 * specification.
 *
 * Apache-2.0. Copyright (c) 2026 Regunav Inc.
 */

// ─── 1. Authority Document Layer ───────────────────────────────────────
/** A regulatory or standards document we track as a source of truth. */
export interface Authority {
  readonly id: string;                  // "eu-ai-act@2024-1689"
  readonly shortName: string;           // "EU AI Act"
  readonly title: string;               // "Regulation (EU) 2024/1689"
  readonly publisher: string;           // "European Parliament + Council"
  readonly jurisdiction: readonly string[];   // ["EU", "EEA"]
  readonly version: string;             // "2024-1689"
  readonly publishedAt: string;         // ISO date
  readonly inForceFrom?: string;        // ISO date
  readonly applicableFrom?: string;     // ISO date — different from publication
  readonly url: string;                 // canonical URL
  readonly citation: string;            // "EU AI Act 2024/1689"
  readonly category: AuthorityCategory;
}

export type AuthorityCategory =
  | "ai-regulation"
  | "data-protection"
  | "information-security"
  | "financial-services"
  | "healthcare"
  | "education"
  | "cybersecurity"
  | "sector-specific"
  | "industry-standard";

// ─── 2. Obligation Layer ───────────────────────────────────────────────
/** A canonical, framework-neutral obligation. Multiple authority clauses
 *  can map to the same obligation. */
export interface Obligation {
  readonly id: string;                  // "OBL-PRIV-ACCESS-001"
  readonly title: string;               // "Right of access to personal data"
  readonly statement: string;           // Plain-language imperative
  readonly category: ObligationCategory;
  /** Source clauses that originate / reinforce this obligation. */
  readonly originatingClauses: readonly ClauseRef[];
}

export type ObligationCategory =
  | "privacy"
  | "security"
  | "ai-risk"
  | "incident-response"
  | "vendor-risk"
  | "data-governance"
  | "human-oversight"
  | "transparency"
  | "training"
  | "audit"
  | "continuity";

export interface ClauseRef {
  readonly authorityId: string;         // "eu-ai-act@2024-1689"
  readonly clause: string;              // "Art. 27" or "A.5.18"
  readonly url?: string;
}

// ─── 3. Common Control Layer ───────────────────────────────────────────
/** Reusable control. Multiple obligations can require the same control. */
export interface Control {
  readonly id: string;                  // "CTRL-IAM-ACCESS-REVIEW-001"
  readonly title: string;               // "Periodic privileged-access review"
  readonly statement: string;
  readonly category: ControlCategory;
  /** Obligations this control fully or partially satisfies. */
  readonly satisfies: readonly string[];
  /** ISO 27001 Annex A / SOC 2 TSC / NIST CSF / etc. cross-references. */
  readonly crosswalk: readonly { framework: string; ref: string }[];
}

export type ControlCategory =
  | "identity-access"
  | "data-protection"
  | "encryption"
  | "logging-monitoring"
  | "incident-response"
  | "change-management"
  | "vulnerability-management"
  | "vendor-management"
  | "physical-security"
  | "ai-system-governance"
  | "training"
  | "business-continuity";

// ─── 4. Evidence Layer ─────────────────────────────────────────────────
/** A typed evidence object that proves a control. */
export interface EvidenceObject {
  readonly id: string;                  // "EV-IAM-001"
  readonly title: string;
  readonly forControl: string;          // Control.id
  readonly type: EvidenceType;
  readonly owner: string;               // role, e.g. "Security Admin"
  readonly source: readonly string[];   // systems / artefact stores
  readonly frequency: EvidenceFrequency;
  readonly retentionYears: number;
  readonly schemaUri?: string;          // JSON Schema for the artefact body
}

export type EvidenceType =
  | "policy"
  | "procedure"
  | "log"
  | "report"
  | "screenshot"
  | "attestation"
  | "configuration"
  | "training-record"
  | "incident-record"
  | "fria"
  | "dpia"
  | "contract"
  | "model-card"
  | "data-card"
  | "audit-trail-export"
  | "access-review";

export type EvidenceFrequency = "continuous" | "daily" | "weekly" | "monthly" | "quarterly" | "annual" | "on-event";

// ─── 5. Software Architecture Layer (the strong differentiator) ───────
/** A concrete architecture requirement that implements a control. */
export interface ArchitectureRequirement {
  readonly id: string;                  // "ARCH-IAM-001"
  readonly forControl: string;          // Control.id
  readonly title: string;
  readonly capability: ArchitectureCapability;
  readonly statement: string;           // What the system must do
  /** Reference implementation patterns (cloud / on-prem / hybrid). */
  readonly patterns: readonly ImplementationPattern[];
  /** Test that verifies the capability is in place. */
  readonly verification?: string;
}

export type ArchitectureCapability =
  | "rbac-abac-policy-engine"
  | "immutable-audit-log"
  | "tenant-aware-identity"
  | "approval-workflow"
  | "evidence-export-endpoint"
  | "log-retention-policy"
  | "encryption-at-rest"
  | "encryption-in-transit"
  | "key-rotation"
  | "secret-vault"
  | "incident-runbook"
  | "ai-system-registry"
  | "model-card-publisher"
  | "drift-detector"
  | "dlp-redaction"
  | "sso-mfa"
  | "scim-provisioning"
  | "byok-byoc"
  | "data-lineage";

export interface ImplementationPattern {
  readonly cloud: "any" | "aws" | "azure" | "gcp" | "cloudflare" | "on-prem";
  readonly summary: string;
  readonly stack?: readonly string[];   // ["Cerbos", "OPA", "Cedar", ...]
  readonly notes?: string;
}

// ─── 6. Policy-as-Code Layer ───────────────────────────────────────────
/** A compiled policy that enforces a control at runtime. */
export interface PolicyAsCode {
  readonly id: string;                  // "POL-IAM-PRIV-001"
  readonly forControl: string;          // Control.id
  readonly engine: "cerbos" | "opa" | "cedar" | "casbin";
  readonly decisionType: "allow_deny" | "abac" | "rbac" | "obligation";
  readonly bundleUri?: string;          // where the bundle is published
  readonly evidenceRequired: boolean;   // whether decisions emit evidence
  readonly testFixtures: readonly string[]; // YAML/JSON fixture URIs
}

// ─── 7. Audit Trail Layer ──────────────────────────────────────────────
/** A control's runtime audit record — the "who owns what, when did it pass". */
export interface AuditTrailLink {
  readonly controlId: string;
  readonly controlOwner: string;        // person / role
  readonly evidenceOwner: string;
  readonly systemOwner: string;
  readonly testFrequency: EvidenceFrequency;
  readonly lastTestedAt?: string;
  readonly lastResult?: "pass" | "fail" | "partial" | "not-tested";
  readonly linkedRiskIds: readonly string[];
  readonly linkedPolicyIds: readonly string[];
  readonly linkedAssetIds: readonly string[];
  readonly linkedVendorIds: readonly string[];
  readonly linkedAiSystemIds: readonly string[];
}

// ─── 8. AI Governance Layer ────────────────────────────────────────────
/** AI-specific governance metadata layered on top of the rest. */
export interface AiSystemGovernance {
  readonly aiSystemId: string;
  readonly intendedPurpose: string;
  readonly riskClassification: "minimal" | "limited" | "high-risk" | "prohibited" | "gpai";
  readonly euAiActAnnex?: "annex-iii-row-1" | "annex-iii-row-2" | "annex-iii-row-3" | "annex-iii-row-4" | "annex-iii-row-5" | "annex-iii-row-6" | "annex-iii-row-7" | "annex-iii-row-8" | "art-5-prohibited" | "art-50-transparency" | "n/a";
  /** ISO 42001 + EU AI Act roles. A given party can hold multiple. */
  readonly roles: readonly AiActorRole[];
  readonly dataGovernance: {
    readonly trainingDatasets: readonly string[]; // dataset IDs
    readonly biasTested: boolean;
    readonly lineageDocumented: boolean;
  };
  readonly humanOversight: "approve-each" | "review-batches" | "exception-only" | "none";
  readonly modelMonitoring: {
    readonly driftDetection: boolean;
    readonly performanceTracking: boolean;
    readonly incidentLog: boolean;
  };
  readonly postMarketMonitoring: {
    readonly enabled: boolean;
    readonly cadence: EvidenceFrequency;
  };
  readonly conformityEvidenceIds: readonly string[];
  readonly modelChangeLog: readonly { version: string; at: string; summary: string }[];
}

export type AiActorRole = "provider" | "deployer" | "importer" | "distributor" | "authorized-representative";

// ─── Compose: the full ontology graph ──────────────────────────────────
export interface Ontology {
  readonly version: string;             // ontology version itself
  readonly authorities: readonly Authority[];
  readonly obligations: readonly Obligation[];
  readonly controls: readonly Control[];
  readonly evidence: readonly EvidenceObject[];
  readonly architecture: readonly ArchitectureRequirement[];
  readonly policies: readonly PolicyAsCode[];
  // Layer 7 + 8 — optional on the type so older snapshots still parse;
  // conformance validators flag any control without an AuditTrailLink as
  // a coverage gap (warning, not violation).
  readonly auditTrailLinks?: readonly AuditTrailLink[];
  readonly aiSystemGovernance?: readonly AiSystemGovernance[];
  // ── 12-layer canonical extensions (v0.1.0 first-class types) ──────────
  readonly riskScenarios?: readonly RiskScenario[];
  readonly jurisdictions?: readonly Jurisdiction[];
  readonly regulators?: readonly Regulator[];
  readonly applicabilityRules?: readonly ApplicabilityRule[];
  readonly mitigations?: readonly Mitigation[];
  readonly workflows?: readonly Workflow[];
  readonly auditPacks?: readonly AuditPack[];
  readonly controlTests?: readonly ControlTest[];
  readonly monitorBindings?: readonly MonitorBinding[];
  readonly crosswalkRelations?: readonly CrosswalkRelation[];
}

// ─── L0 — RiskScenario ────────────────────────────────────────────────
export type RiskDomain =
  | "privacy"
  | "security"
  | "ai-safety"
  | "bias"
  | "resilience"
  | "financial"
  | "operational"
  | "regulatory";

export interface RiskScenario {
  readonly id: string;                           // "RISK-AI-HIRING-DISCRIMINATION"
  readonly title: string;
  readonly domain: RiskDomain;
  readonly harmType: readonly string[];
  readonly threatActors: readonly string[];
  readonly affectedStakeholders: readonly string[];
  readonly likelihood: 1 | 2 | 3 | 4 | 5;
  readonly impact: 1 | 2 | 3 | 4 | 5;
  readonly inherentScore: number;                // likelihood * impact
  readonly mappedControls: readonly string[];
  readonly mappedMitigations: readonly string[];
  readonly residualRiskScore?: number;
}

// ─── L2 — Jurisdiction + Regulator + LegalInstrument ─────────────────
export interface Jurisdiction {
  readonly id: string;                           // "JUR-EU", "JUR-US-CA"
  readonly name: string;
  readonly parent?: string;                      // parent jurisdiction id
  readonly regulators: readonly string[];        // Regulator.id[]
  readonly treatyMemberships?: readonly string[];
  readonly childJurisdictions?: readonly string[];
}

export interface Regulator {
  readonly id: string;                           // "REG-EDPB", "REG-CPPA"
  readonly name: string;
  readonly jurisdiction: string;                 // Jurisdiction.id
  readonly mandate: readonly string[];           // ["data-protection", "competition", ...]
  readonly submissionEndpoints?: readonly { name: string; url: string; protocol: string }[];
  readonly contactUrl?: string;
}

// ─── L3 — Applicability ───────────────────────────────────────────────
export type EntityRole =
  | "controller"
  | "processor"
  | "sub-processor"
  | "provider"
  | "deployer"
  | "importer"
  | "distributor"
  | "authorized-representative"
  | "merchant"
  | "payment-processor"
  | "ict-service-provider"
  | "financial-entity";

export type Sector =
  | "financial-services"
  | "healthcare"
  | "education"
  | "government"
  | "employment"
  | "retail"
  | "telecommunications"
  | "energy"
  | "transport"
  | "media"
  | "saas"
  | "other";

export interface ApplicabilityCondition {
  readonly variable: string;                     // "aiSystemUsedFor", "marketRevenue", "subjectsAffected"
  readonly op: "eq" | "neq" | "in" | "not-in" | "gte" | "lte" | "matches";
  readonly value: string | number | readonly string[];
}

export interface ApplicabilityRule {
  readonly id: string;                           // "APP-EU-AIACT-HIRING-HIGHRISK"
  readonly instrument: string;                   // Authority.id
  readonly appliesIf: readonly ApplicabilityCondition[];
  readonly output: "applies" | "applies-as-high-risk" | "does-not-apply" | "needs-legal-review";
  readonly triggeredObligations: readonly string[];
  readonly effectiveDate?: string;
  readonly applicableDate?: string;
  readonly transitionDate?: string;
  readonly note?: string;
}

// ─── L6 — Mitigation ──────────────────────────────────────────────────
export interface Mitigation {
  readonly id: string;                           // "MIT-AI-BIAS-TEST-PIPELINE"
  readonly title: string;
  readonly reduces: string;                      // RiskScenario.id
  readonly control: string;                      // Control.id that operationalises it
  readonly mechanism: string;
  readonly effectivenessEvidence?: string;       // EvidenceObject.id
  readonly residualRiskDelta?: number;           // points subtracted from inherentScore
}

// ─── L9 — Workflow ────────────────────────────────────────────────────
export interface WorkflowStep {
  readonly id: string;
  readonly title: string;
  readonly owner: string;                        // role or principal-class
  readonly approvers?: readonly string[];        // four-eyes if multiple distinct from owner
  readonly inputArtefacts?: readonly string[];
  readonly outputArtefacts?: readonly string[];  // EvidenceObject ids produced
  readonly slaHours?: number;
}

export interface Workflow {
  readonly id: string;                           // "WF-FRIA-AUTHORING"
  readonly title: string;
  readonly forControl: string;                   // Control.id
  readonly trigger: string;                      // plain-language event description
  readonly steps: readonly WorkflowStep[];
  readonly fourEyesGate: boolean;
  readonly deadlineHours?: number;
}

// ─── L12 — AuditPack ──────────────────────────────────────────────────
export interface AuditPackSection {
  readonly title: string;
  readonly evidenceIds: readonly string[];
  readonly required: boolean;
  readonly authorityRefs?: readonly { authority: string; clause: string }[];
}

export interface AuditPack {
  readonly id: string;                           // "PACK-EU-AIACT-HIRING-V3-2026Q2"
  readonly title: string;
  readonly forAuthority: string;                 // Authority.id
  readonly forSystem?: string;                   // AiSystemGovernance.aiSystemId or asset id
  readonly periodStart: string;
  readonly periodEnd: string;
  readonly sections: readonly AuditPackSection[];
  readonly disclaimerEmbedded: boolean;
  readonly manifestSha256?: string;
}

// ─── ControlTest + ControlEffectiveness (audit assurance) ────────────
export type AssuranceLevel = "low" | "moderate" | "high";

export interface ControlTest {
  readonly id: string;                           // "TEST-CTRL-IAM-ACCESS-REVIEW-2026Q2"
  readonly controlId: string;                    // Control.id
  readonly method: "automated" | "manual" | "hybrid";
  readonly frequency: EvidenceFrequency;
  readonly sampleStrategy?: "all" | "random" | "stratified" | "judgemental";
  readonly sampleSize?: number;
  readonly populationSize?: number;
  readonly expectedResult: string;
  readonly actualResult?: string;
  readonly result?: "pass" | "fail" | "partial" | "not-tested";
  readonly performedAt?: string;
  readonly performedBy?: string;
  readonly evidenceIds: readonly string[];
  readonly exceptions?: readonly string[];
  readonly remediationIds?: readonly string[];
  readonly assuranceLevel?: AssuranceLevel;
}

// ─── Runtime monitoring binding ──────────────────────────────────────
export interface MonitorBinding {
  readonly id: string;                           // "MON-DRIFT-CREDIT-V3"
  readonly forControl?: string;                  // Control.id
  readonly forSystem?: string;                   // AI system id
  readonly kind: "drift" | "performance" | "incident" | "evidence-staleness" | "policy-decision";
  readonly thresholdSpec: string;                // human-readable threshold description
  readonly emitsEvidence: boolean;               // true → produces EvidenceObject on event
  readonly cadence: EvidenceFrequency;
}

// ─── Crosswalk relation between authorities (per-clause) ─────────────
export type CrosswalkRelationKind =
  | "equivalent"
  | "overlaps"
  | "stricter_than"
  | "weaker_than"
  | "conflicts_with"
  | "requires_local_legal_review"
  | "implementation_dependent";

export interface CrosswalkRelation {
  readonly id: string;                           // "CW-ISO27001-A5.18-SOC2-CC6.3"
  readonly source: { authority: string; clause: string };
  readonly target: { authority: string; clause: string };
  readonly relation: CrosswalkRelationKind;
  readonly confidence: "high" | "medium" | "low";
  readonly rationale: string;
  readonly reviewer: string;
  readonly reviewedAt: string;
}

// ─── Snapshots / queries ───────────────────────────────────────────────
export interface OntologySnapshot {
  readonly version: string;
  readonly counts: {
    readonly authorities: number;
    readonly obligations: number;
    readonly controls: number;
    readonly evidence: number;
    readonly architecture: number;
    readonly policies: number;
  };
  readonly coverage: {
    /** % of obligations that have at least one control. */
    readonly obligationCoverage: number;
    /** % of controls with at least one evidence object. */
    readonly evidenceCoverage: number;
    /** % of controls with at least one architecture pattern. */
    readonly architectureCoverage: number;
    /** % of controls with at least one policy-as-code binding. */
    readonly policyCoverage: number;
  };
  readonly generatedAt: string;
}
