# Legal disclaimer

The Compliance-to-Architecture Framework (the "Framework") is a
**structured representation of regulatory and standards text** plus a
**control / evidence / architecture / policy ontology**. It is not
legal advice and cannot substitute for advice from qualified legal,
compliance, audit, or information-security professionals.

> "Compliance-to-Architecture Framework" and "ReguNav" are trademarks
> claimed by Regunav Inc.; see [`TRADEMARKS.md`](../../TRADEMARKS.md)
> at the repository root for the trademark policy. They are referenced
> in unmarked form throughout this document for readability — that does
> not waive the marks.

## What this framework IS

- A typed graph that maps published authorities (regulations, standards,
  contracts) to canonical obligations, controls, evidence, architecture
  requirements, and policies.
- A machine-readable specification (TypeScript types + JSON Schemas) that
  implementations may import.
- A reference for cross-walking control implementations between
  frameworks.
- An open methodology for obligation decomposition, control mapping, and
  evidence quality.

## What this framework IS NOT

- **Legal advice.** Obligations and mappings represent the editor's
  interpretation of authority text. Reliance on them for any specific
  business, jurisdiction, or product requires review by qualified
  counsel under the relevant jurisdiction.
- **A compliance certification.** Adopting the framework does not by
  itself make any organisation, product, or system compliant with any
  law, regulation, standard, contract, or audit regime. Certification
  remains the exclusive function of the relevant supervisory authority,
  certification body, or attesting auditor.
- **A regulator endorsement.** No regulator has endorsed this framework
  as authoritative. References to specific authority clauses cite the
  underlying authority, not any approval of this representation by that
  authority.
- **Static.** Authority text changes. Mappings can become stale. The
  framework versioning protocol (`METHODOLOGY.md` §6) tracks changes,
  but downstream consumers MUST re-validate when they upgrade between
  versions.
- **A substitute for human review.** Mappings flagged `medium` or `low`
  confidence MUST be reviewed by a qualified human before they are
  relied on for an audit, regulator submission, or risk decision.

## Notice for paywalled standards

ISO/IEC standards (27001, 42001, 27701, etc.) are licensed by their
publishers and not freely redistributable. Where the framework references
ISO clauses, it does so by clause number + outline only. Full text
remains licensed per tenant. Implementations using this framework with
ISO standards must hold their own ISO licence.

## No affiliation

References to specific products (Cerbos, OPA, Cedar, Casbin, Stripe,
Clerk, Cloudflare, AWS, Azure, GCP) are illustrative reference patterns.
They imply no endorsement, partnership, certification, or commercial
arrangement with any of those vendors unless explicitly stated.

## Trademarks

"Compliance-to-Architecture Framework" and "ReguNav" are trademarks
claimed by Regunav Inc. for the purposes set out in
[`TRADEMARKS.md`](../../TRADEMARKS.md) at the repository root. The
underlying framework is published under Apache-2.0; trademark rights
are governed separately by that policy and do not flow with the code
licence.

## Patents

This repository is published under Apache-2.0, which includes an
express patent grant from each contributor for any patent claim that
would be necessarily infringed by their contribution as part of this
work. That grant runs with the code.

Regunav Inc. makes no separate assertion of patents over the open
specification or the schemas in this repository, and the Apache-2.0
grant is the exclusive source of patent licence flowing from this
publication.

Novel abstractions introduced by this work — the Compliance-to-
Architecture graph model, the dictionary-/manifest-/registry-first
package structure, the applicability-AST evaluator, the hash-chained
audit-trail-over-object-lock pattern — are published as defensive
prior art. See [`docs/defensive-publications/`](../../../docs/defensive-publications/).

## Contact

Mapping disputes, factual corrections, and bug reports: open an issue at
the project repository. Legal questions about the framework's
applicability to your specific situation must go to your own counsel,
not to the framework's editors.

---

This disclaimer is reproduced in the README, the spec, the methodology
document, and every audit pack generated from the framework. Any
implementation that strips it is non-conformant.
