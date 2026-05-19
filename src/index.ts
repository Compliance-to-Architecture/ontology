/**
 * @regunav/ontology — public API for the ReguNav Compliance-to-Architecture Framework™.
 *
 * Spec: SPEC.md (Version 0.1)
 * Apache-2.0. Copyright (c) 2026 Regunav Inc.
 */
export * from "./types";
export * from "./seed";
export * from "./queries";
export * from "./oscal";
// Framework-dictionary OSCAL 1.1.2 emitter (separate from the
// C2A-ontology → OSCAL mapping in ./oscal). Re-exported under a
// namespace alias to avoid type-name collisions with ./oscal.
export * as OscalEmit from "./oscal-emit";
