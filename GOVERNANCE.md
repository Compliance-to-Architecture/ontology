# Governance

The Compliance-to-Architecture Framework operates under a transparent
governance model so that consumers (auditors, regulators, enterprise
buyers) can trust that no single party silently changes a mapping that
they rely on for risk decisions.

## Current state — Editor of record

For v0.x (until a multi-stakeholder body is formed), the maintainer team
at **Regunav Inc.** acts as **editor of record**:

- Final say on whether a contributed mapping enters `implemented` status.
- Sole authority to publish a new release.
- Sole authority to deprecate a layer or rename an ID class.
- Subject to the methodology rules in `METHODOLOGY.md` — the editor
  cannot, for example, accept an anonymous mapping into `implemented`.

This concentration of authority is **temporary** and is acknowledged as
a credibility limitation.

## Path to multi-stakeholder governance (target Q1 2027)

Before the framework reaches v1.0.0, an independent advisory board will
be formed with the following composition:

| Seats | Role | How chosen |
|---|---|---|
| 2 | Practising auditors (ISO / SOC 2 / PCI lead-auditor credentials) | Public call for nominations; advisory-board self-elects from nominees with quorum |
| 2 | Regulator-side reviewers (former DPA / former financial-conduct staff) | Same |
| 2 | Engineering implementers (large enterprises that have adopted the framework) | Adopter-only nomination |
| 1 | Academic researcher in compliance / AI governance | Public nomination |
| 1 | Editor of record (Regunav Inc.) | Permanent until v2.0 |

Advisory board responsibilities:

- Approve / reject promotion of authorities from `mapped` → `implemented`.
- Adjudicate disputed crosswalks.
- Review the methodology document annually for drift.
- Sign off on each minor release.

The advisory board does **not**:

- Touch the codebase directly (changes still flow via PR).
- Represent any single tenant's interpretation of regulation.
- Provide legal advice (see `LEGAL_DISCLAIMER.md`).

## Conflict of interest

Editor and board members must disclose:

- Direct employment with vendors that benefit commercially from
  framework mappings.
- Equity / advisory positions in such vendors.
- Active client engagements where the framework's interpretation could
  affect the engagement.

Disclosed conflicts are public. Members with conflicts MUST recuse from
votes that touch the affected authority / vendor.

## Decision log

Significant governance decisions are recorded under `docs/decisions/`
with date, decision, vote outcome (when applicable), and rationale. The
log is append-only.

## How to challenge a decision

If you believe a published mapping is wrong:

1. Open an issue tagged `mapping-dispute` citing the authority text and
   the specific obligation / control / crosswalk you disagree with.
2. Editor responds within 14 days with a position.
3. If unresolved, the issue is escalated to the advisory board (once
   formed) for review at the next monthly meeting.
4. If still unresolved, the disputant may publish a **fork** under
   Apache-2.0; the framework's open licence guarantees the right to do
   so.

The framework's correctness is not enforced by any single editor — it
is enforced by transparency, the conformance test, the methodology, and
the right to fork.

## Funding

Regunav Inc. funds the editor function. Per-authority decomposition
work for the `mapped → implemented` track is funded out of the ReguNav
SaaS revenue. The framework itself accepts no per-authority sponsorship
that could compromise mapping independence.

## Trademark policy

"Compliance-to-Architecture Framework" and "ReguNav" are trademarks
claimed by Regunav Inc. See `TRADEMARKS.md` at the repository root for
the full trademark policy. Permitted uses without separate licence:

- Citing the framework in academic or audit work.
- Stating "implements Compliance-to-Architecture v0.1" if you pass the
  conformance test (badge link goes to the conformance run output).

Commercial use of the marks (e.g. selling a product called "C2A
Compliance Suite") requires a separate written licence.
