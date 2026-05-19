/**
 * Ontology query helpers.
 *
 * Apache-2.0. Copyright (c) 2026 Regunav Inc.
 */
import type {
  Ontology, OntologySnapshot, Authority, Obligation, Control, EvidenceObject,
  ArchitectureRequirement, PolicyAsCode,
} from "./types.js";

export function findAuthority(o: Ontology, id: string): Authority | undefined {
  return o.authorities.find((a) => a.id === id);
}
export function findObligation(o: Ontology, id: string): Obligation | undefined {
  return o.obligations.find((x) => x.id === id);
}
export function findControl(o: Ontology, id: string): Control | undefined {
  return o.controls.find((c) => c.id === id);
}

/** All controls that satisfy a given obligation id. */
export function controlsForObligation(o: Ontology, obligationId: string): readonly Control[] {
  return o.controls.filter((c) => c.satisfies.includes(obligationId));
}

/** All evidence objects required by a given control id. */
export function evidenceForControl(o: Ontology, controlId: string): readonly EvidenceObject[] {
  return o.evidence.filter((e) => e.forControl === controlId);
}

/** All architecture requirements implementing a given control id. */
export function architectureForControl(o: Ontology, controlId: string): readonly ArchitectureRequirement[] {
  return o.architecture.filter((a) => a.forControl === controlId);
}

/** All policy-as-code bindings for a given control id. */
export function policiesForControl(o: Ontology, controlId: string): readonly PolicyAsCode[] {
  return o.policies.filter((p) => p.forControl === controlId);
}

/** Resolve a clause reference (authorityId + clause) to the obligations + controls + evidence + architecture + policies it touches. */
export function resolveClause(o: Ontology, authorityId: string, clause: string) {
  const obligations = o.obligations.filter((x) =>
    x.originatingClauses.some((c) => c.authorityId === authorityId && c.clause === clause),
  );
  const controls = obligations.flatMap((ob) => controlsForObligation(o, ob.id));
  const evidence = controls.flatMap((c) => evidenceForControl(o, c.id));
  const architecture = controls.flatMap((c) => architectureForControl(o, c.id));
  const policies = controls.flatMap((c) => policiesForControl(o, c.id));
  return { authorityId, clause, obligations, controls, evidence, architecture, policies };
}

/** Cross-walk: find every framework that's covered when you implement a given control. */
export function crosswalkOf(o: Ontology, controlId: string): readonly { framework: string; ref: string }[] {
  return findControl(o, controlId)?.crosswalk ?? [];
}

/** Coverage / posture snapshot of the ontology itself. */
export function snapshot(o: Ontology): OntologySnapshot {
  const obligationsCovered = o.obligations.filter((ob) => controlsForObligation(o, ob.id).length > 0).length;
  const controlsWithEvidence = o.controls.filter((c) => evidenceForControl(o, c.id).length > 0).length;
  const controlsWithArch = o.controls.filter((c) => architectureForControl(o, c.id).length > 0).length;
  const controlsWithPolicy = o.controls.filter((c) => policiesForControl(o, c.id).length > 0).length;
  const total = o.controls.length || 1;
  return {
    version: o.version,
    counts: {
      authorities: o.authorities.length,
      obligations: o.obligations.length,
      controls: o.controls.length,
      evidence: o.evidence.length,
      architecture: o.architecture.length,
      policies: o.policies.length,
    },
    coverage: {
      obligationCoverage: Math.round((obligationsCovered / Math.max(1, o.obligations.length)) * 100),
      evidenceCoverage: Math.round((controlsWithEvidence / total) * 100),
      architectureCoverage: Math.round((controlsWithArch / total) * 100),
      policyCoverage: Math.round((controlsWithPolicy / total) * 100),
    },
    generatedAt: new Date().toISOString(),
  };
}
