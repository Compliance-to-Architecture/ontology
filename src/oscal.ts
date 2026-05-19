/**
 * @regunav/ontology/oscal — bidirectional mapping between Compliance-to-
 * Architecture and NIST OSCAL.
 *
 * Round-trip targets (per SPEC.md OSCAL section):
 *   OSCAL Catalog              ↔ Authority + Obligation + Control
 *   OSCAL Profile              ↔ ApplicabilityRule (selecting controls)
 *   OSCAL Component Definition ↔ ArchitectureRequirement
 *   OSCAL Assessment Plan      ↔ ControlTest
 *   OSCAL Assessment Results   ↔ ControlTest result + EvidenceObject
 *   OSCAL POA&M                ↔ open exceptions + Mitigation
 *
 * Extension fields use namespace prefix `c2a:` so they survive a
 * round-trip without collision with native OSCAL fields.
 *
 * Apache-2.0. Copyright (c) 2026 Regunav Inc.
 */
import type {
  Authority,
  Obligation,
  Control,
  ApplicabilityRule,
  ArchitectureRequirement,
  ControlTest,
  EvidenceObject,
  Mitigation,
} from "./types.js";

// ─── OSCAL minimal subset ───────────────────────────────────────────────

export interface OscalCatalog {
  uuid: string;
  metadata: { title: string; "last-modified": string; version: string; "oscal-version": string };
  groups?: OscalCatalogGroup[];
  controls?: OscalControl[];
  "back-matter"?: { resources?: OscalResource[] };
}

export interface OscalCatalogGroup {
  id: string;
  title: string;
  controls?: OscalControl[];
  groups?: OscalCatalogGroup[];
}

export interface OscalControl {
  id: string;
  title: string;
  props?: OscalProp[];
  links?: OscalLink[];
  parts?: OscalPart[];
}

export interface OscalPart {
  id?: string;
  name: string;
  prose?: string;
}

export interface OscalProp {
  name: string;
  value: string;
  ns?: string;
  class?: string;
}

export interface OscalLink {
  href: string;
  rel?: string;
  text?: string;
}

export interface OscalResource {
  uuid: string;
  title?: string;
  rlinks?: { href: string }[];
}

export interface OscalProfile {
  uuid: string;
  metadata: { title: string; "last-modified": string; version: string; "oscal-version": string };
  imports: { href: string; "include-controls"?: { "with-ids": string[] }[] }[];
}

export interface OscalComponentDefinition {
  uuid: string;
  metadata: { title: string; "last-modified": string; version: string; "oscal-version": string };
  components: OscalComponent[];
}

export interface OscalComponent {
  uuid: string;
  type: "software" | "hardware" | "service" | "policy" | "physical" | "process-procedure" | "validation" | "interconnection";
  title: string;
  description: string;
  props?: OscalProp[];
  "control-implementations"?: OscalControlImplementation[];
}

export interface OscalControlImplementation {
  uuid: string;
  source: string;
  description: string;
  "implemented-requirements": { uuid: string; "control-id": string; description: string }[];
}

// ─── C2A → OSCAL ────────────────────────────────────────────────────────

const OSCAL_VERSION = "1.1.2";
const NS = "https://compliancetoarchitecture.com/oscal-ns/v0.1";

function nowIso(): string {
  return new Date().toISOString();
}

function uuid(): string {
  return crypto.randomUUID();
}

/**
 * Convert a C2A Authority + its Obligations + Controls into an OSCAL
 * Catalog. The Authority becomes the catalog root; obligations become
 * top-level controls; satisfying-controls become parts under each
 * obligation.
 */
export function exportCatalog(
  authority: Authority,
  obligationsForAuthority: readonly Obligation[],
  controlsByObligation: Map<string, readonly Control[]>,
): OscalCatalog {
  return {
    uuid: uuid(),
    metadata: {
      title: authority.title,
      "last-modified": nowIso(),
      version: authority.version,
      "oscal-version": OSCAL_VERSION,
    },
    groups: [
      {
        id: authority.id.replace(/[^a-zA-Z0-9-]/g, "-"),
        title: authority.shortName,
        controls: obligationsForAuthority.map((o) => obligationToOscalControl(o, controlsByObligation.get(o.id) ?? [])),
      },
    ],
    "back-matter": {
      resources: [
        {
          uuid: uuid(),
          title: `${authority.shortName} authoritative source`,
          rlinks: [{ href: authority.url }],
        },
      ],
    },
  };
}

function obligationToOscalControl(o: Obligation, satisfying: readonly Control[]): OscalControl {
  return {
    id: o.id,
    title: o.title,
    props: [
      { name: "category", value: o.category, ns: NS },
      { name: "originating-clauses", value: JSON.stringify(o.originatingClauses), ns: NS },
    ],
    parts: [
      { id: `${o.id}_stmt`, name: "statement", prose: o.statement },
      ...(satisfying.length > 0
        ? [{
            id: `${o.id}_satisfying-controls`,
            name: "guidance",
            prose: `Satisfying C2A controls: ${satisfying.map((c) => c.id).join(", ")}.`,
          }]
        : []),
    ],
    links: o.originatingClauses.map((c) => ({
      href: c.url ?? "#",
      rel: "reference",
      text: `${c.authorityId} ${c.clause}`,
    })),
  };
}

/**
 * Convert a C2A ApplicabilityRule into an OSCAL Profile that imports
 * the catalog and selects only the obligations that apply.
 */
export function exportProfile(rule: ApplicabilityRule, catalogHref: string): OscalProfile {
  return {
    uuid: uuid(),
    metadata: {
      title: `Profile — ${rule.id}`,
      "last-modified": nowIso(),
      version: "0.1.0",
      "oscal-version": OSCAL_VERSION,
    },
    imports: [
      {
        href: catalogHref,
        "include-controls": [{ "with-ids": [...rule.triggeredObligations] }],
      },
    ],
  };
}

/**
 * Convert a C2A ArchitectureRequirement into an OSCAL Component.
 */
export function exportComponent(req: ArchitectureRequirement): OscalComponent {
  return {
    uuid: uuid(),
    type: "software",
    title: req.title,
    description: req.statement,
    props: [
      { name: "capability", value: req.capability, ns: NS },
      { name: "for-control", value: req.forControl, ns: NS },
      ...(req.verification ? [{ name: "verification", value: req.verification, ns: NS }] : []),
    ],
    "control-implementations": [
      {
        uuid: uuid(),
        source: `urn:c2a:control:${req.forControl}`,
        description: `Architecture pattern fulfilling ${req.forControl}`,
        "implemented-requirements": [
          {
            uuid: uuid(),
            "control-id": req.forControl,
            description: req.statement,
          },
        ],
      },
    ],
  };
}

export function exportComponentDefinition(reqs: readonly ArchitectureRequirement[]): OscalComponentDefinition {
  return {
    uuid: uuid(),
    metadata: {
      title: "Compliance-to-Architecture reference component definition",
      "last-modified": nowIso(),
      version: "0.1.0",
      "oscal-version": OSCAL_VERSION,
    },
    components: reqs.map(exportComponent),
  };
}

// ─── OSCAL → C2A (import) ─────────────────────────────────────────────

export interface ImportedFromOscal {
  obligations: Partial<Obligation>[];
  controls: Partial<Control>[];
}

/**
 * Best-effort OSCAL Catalog → C2A. Returns a partial structure because
 * OSCAL doesn't carry the full C2A field set (e.g. originatingClauses
 * provenance). Use the returned data as a starting point; a credentialed
 * reviewer must complete the missing fields per METHODOLOGY.md.
 */
export function importCatalog(cat: OscalCatalog): ImportedFromOscal {
  const obligations: Partial<Obligation>[] = [];
  const walk = (group?: OscalCatalogGroup) => {
    if (!group) return;
    for (const c of group.controls ?? []) {
      const stmt = c.parts?.find((p) => p.name === "statement")?.prose ?? c.title;
      const cat = c.props?.find((p) => p.name === "category" && p.ns === NS)?.value;
      const originatingClausesProp = c.props?.find((p) => p.name === "originating-clauses" && p.ns === NS)?.value;
      let originatingClauses: Obligation["originatingClauses"] | undefined;
      if (originatingClausesProp) {
        try { originatingClauses = JSON.parse(originatingClausesProp); } catch { /* */ }
      }
      const ob: Partial<Obligation> = {
        id: c.id,
        title: c.title,
        statement: stmt,
      };
      if (cat) (ob as { category?: string }).category = cat;
      if (originatingClauses) (ob as { originatingClauses?: Obligation["originatingClauses"] }).originatingClauses = originatingClauses;
      obligations.push(ob);
    }
    for (const sub of group.groups ?? []) walk(sub);
  };
  for (const g of cat.groups ?? []) walk(g);
  return { obligations, controls: [] };
}

// ─── POA&M (mitigation tracking) ───────────────────────────────────────

export interface OscalPoam {
  uuid: string;
  metadata: { title: string; "last-modified": string; version: string; "oscal-version": string };
  "poam-items": OscalPoamItem[];
}

export interface OscalPoamItem {
  uuid: string;
  title: string;
  description: string;
  "related-findings"?: { "finding-uuid": string }[];
  "related-observations"?: { "observation-uuid": string }[];
  props?: OscalProp[];
}

export function exportPoam(
  mitigations: readonly Mitigation[],
  outstandingTests: readonly ControlTest[],
): OscalPoam {
  const items: OscalPoamItem[] = [
    ...mitigations.map<OscalPoamItem>((m) => ({
      uuid: uuid(),
      title: m.title,
      description: m.mechanism,
      props: [
        { name: "reduces-risk", value: m.reduces, ns: NS },
        { name: "operationalises-control", value: m.control, ns: NS },
        ...(m.effectivenessEvidence ? [{ name: "effectiveness-evidence", value: m.effectivenessEvidence, ns: NS }] : []),
      ],
    })),
    ...outstandingTests
      .filter((t) => t.result === "fail" || t.result === "partial")
      .map<OscalPoamItem>((t) => ({
        uuid: uuid(),
        title: `Remediation — ${t.controlId}`,
        description: t.actualResult ?? "Control test did not fully pass; remediation required.",
        props: [
          { name: "for-control", value: t.controlId, ns: NS },
          { name: "test-result", value: t.result ?? "unknown", ns: NS },
          ...(t.assuranceLevel ? [{ name: "assurance-level", value: t.assuranceLevel, ns: NS }] : []),
        ],
      })),
  ];
  return {
    uuid: uuid(),
    metadata: {
      title: "Compliance-to-Architecture POA&M (mitigations + outstanding remediations)",
      "last-modified": nowIso(),
      version: "0.1.0",
      "oscal-version": OSCAL_VERSION,
    },
    "poam-items": items,
  };
}

// ─── Re-export evidence helpers (for assessment-results) ──────────────

export function evidenceToOscalObservation(ev: EvidenceObject) {
  return {
    uuid: uuid(),
    title: ev.title,
    description: `${ev.type} evidence — ${ev.title}`,
    methods: [ev.frequency === "continuous" ? "AUTOMATED-MONITORING" : "EXAMINE"],
    types: [ev.type],
    "collected": nowIso(),
    props: [
      { name: "owner", value: ev.owner, ns: NS },
      { name: "for-control", value: ev.forControl, ns: NS },
      { name: "frequency", value: ev.frequency, ns: NS },
      { name: "retention-years", value: String(ev.retentionYears), ns: NS },
    ],
  };
}
