# Compliance-to-Architecture · conformance test suite

Verifies that any candidate ontology JSON conforms to the framework's
8-layer model. Run before publishing your implementation as
"Compliance-to-Architecture conformant".

## What it checks

1. **Structural** — every top-level array exists (`authorities`, `obligations`,
   `controls`, `evidenceObjects`, `architectureRequirements`, `policies`,
   `auditTrailLinks`, `aiSystemGovernance`).
2. **Layer integrity** — every Obligation references at least one Authority
   that exists in the bundle. Every Control references at least one
   Obligation. Every EvidenceObject references at least one Control.
3. **Cross-walk completeness** — for every Control with a `crosswalk` array,
   each entry references an Authority that is present in `authorities`.
4. **Evidence schema validity** — every EvidenceObject MUST validate
   against the JSON Schema for its `kind` (see `../schemas/`).
5. **ID prefix discipline** — `OBL-…`, `CTRL-…`, `EV-…`, `ARCH-…`, `POL-…`
   per SPEC §"Implementations MUST".

## Running

```sh
node packages/ontology/conformance/validate.mjs path/to/your-ontology.json
```

Exit codes:
- `0` — fully conformant.
- `1` — at least one violation. Stderr lists every failing rule with
  the offending entity id.

## Compliance-to-Architecture badge

A conformant implementation may publish the badge:

```
[![CTA Conformant v0.1](https://compliancetoarchitecture.com/badge/v0.1.svg)](https://compliancetoarchitecture.com/conformant)
```

The badge link MUST point to the run output of this script against your
published ontology JSON, dated within the past 30 days.
