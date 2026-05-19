# Mapping Methodology

How clauses become obligations, obligations become controls, and crosswalks
get a confidence score. This is the page enterprise auditors will read
before trusting any of the framework's mappings.

## 1. Source canon

For every Authority, exactly **one** canonical text is recorded as the
source. We track:

- **Publisher** (e.g. European Parliament + Council, ISO/IEC, NIST, AICPA)
- **Version identifier** (e.g. `eu-ai-act@2024-1689`, `iso-27001@2022`)
- **Published-at date** (when the publisher signed the document)
- **In-force-from / applicable-from** (these are *not* always the same;
  the EU AI Act enters into force 1 Aug 2024 but high-risk obligations
  apply from 2 Aug 2026)
- **Citation-format string** (what to cite in audit packs)
- **URL** (to the authoritative copy — `eur-lex.europa.eu` for EU,
  `iso.org` for ISO, `nist.gov` for NIST)

Where the text is paywalled (ISO standards), we record the publicly
available outline + clause numbers and label affected obligations
**`outline-only — full text licensed per tenant`**. We never paraphrase
paywalled text into open repositories.

## 2. Clause → Obligation decomposition

A clause is decomposed into one or more `Obligation`s when it expresses
a discrete, testable imperative. Decomposition is **lossy** in one
direction (one clause → many obligations) but never the other way
(obligations are not silently merged across clauses).

Decomposition follows three rules:

1. **Imperative isolation** — every "shall" / "must" / "is required to"
   becomes a candidate obligation.
2. **Subject discipline** — the obligation records who bears it
   (controller / processor / provider / deployer / etc.).
3. **Test-ability** — if a human auditor cannot test whether the
   obligation is met, the decomposition is wrong; split or refine.

Example:
> EU AI Act Art. 9(1): "A risk management system shall be established,
> implemented, documented and maintained in relation to high-risk AI
> systems."

decomposes to four obligations:
- `OBL-AI-RISK-MGMT-001` "Establish a risk-management system" (provider)
- `OBL-AI-RISK-MGMT-002` "Implement the risk-management system" (provider)
- `OBL-AI-RISK-MGMT-003` "Document the risk-management system" (provider)
- `OBL-AI-RISK-MGMT-004` "Maintain the risk-management system across
  the lifecycle" (provider)

Each becomes individually testable. Implementations that collapse them
back into one are non-conformant.

## 3. Obligation → Control mapping

A `Control` claims to satisfy one or more obligations. The mapping is
recorded as `Control.satisfies: string[]`. Mappings carry an explicit
**confidence score**:

| Score | Meaning |
|---|---|
| `high` | Direct, unambiguous coverage — auditor would accept the control as evidence of the obligation. |
| `medium` | Coverage with documented caveats (e.g. control implements 80% of obligation; remaining 20% needs supplementary evidence). |
| `low` | Partial / interpretive coverage. Local legal review required before the mapping can be relied on. |
| `n/a` | Control does NOT satisfy the obligation — recorded explicitly to prevent silent re-mapping. |

Mappings with `low` or `n/a` confidence are surfaced to auditors
explicitly in the audit pack; they are not silently included in
"covered" tallies.

## 4. Crosswalk relations

When the same control covers multiple authorities, the relation between
those authorities at that clause is recorded as a `CrosswalkRelation`:

| Relation | Meaning |
|---|---|
| `equivalent` | Authorities require the same thing in the same way. |
| `overlaps` | Authorities require similar things but with different scope / cadence / actor. |
| `stricter_than` | Authority A's clause is a superset of B's. |
| `weaker_than` | Authority A's clause is a subset of B's. |
| `conflicts_with` | Authorities require incompatible things; deployer must choose / seek waiver. |

Every crosswalk MUST carry a `rationale` field and a `reviewer`
attribution. Anonymous crosswalks are non-conformant.

## 5. Conflict resolution

When two authorities conflict (e.g. data-localisation rules in
jurisdiction A vs free-data-flow rights in jurisdiction B), the framework
records both authorities + a `conflicts_with` relation. It does **not**
prescribe a resolution — that requires legal counsel under the deployer's
jurisdiction. The framework's job is to surface the conflict, not to
silently pick a side.

## 6. Versioning protocol

Authorities mutate. The framework tracks every change as a new version
with a diff:

- **Patch** to the framework (0.1.0 → 0.1.1): typo fix, expanded example,
  reviewer name change. No mapping changes.
- **Minor** (0.1.0 → 0.2.0): new authority added, optional fields
  introduced, new evidence kind, new crosswalk relation.
- **Major** (0.1.0 → 1.0.0): breaking change — clause IDs renamed,
  obligation IDs renamed, mappings changed. A migration guide ships in
  the same release.

Authority itself versioned within the model: `iso-27001@2022` and
`iso-27001@2013` are distinct entities. Crosswalks state explicitly which
version they target.

## 7. Human review

Every mapping with `medium` or `low` confidence MUST cite a named
reviewer with a credential class (legal counsel / certified auditor /
qualified DPO / certified ISO lead auditor / etc.). Anonymous reviews are
non-conformant. The audit pack reproduces the reviewer attribution
verbatim.

## 8. Contribution flow

External contributors submitting mappings via pull request must:

1. Cite the authority + clause + version explicitly.
2. State the proposed obligation / control / crosswalk in the PR body.
3. Disclose any commercial interest (e.g. "I work for a vendor selling
   tools that benefit from this mapping").
4. Provide a reviewer credential — anonymous PRs are not merged into
   `implemented` status.

The maintainer team (currently Regunav Inc.) operates as **editor of
record** until a multi-stakeholder governance body is formed (see
`GOVERNANCE.md`).

## 9. Limitations

This framework is **not legal advice**. It is a structured representation
of regulatory text + control practice. Any obligation, control, or
mapping in this repo represents the editor's best interpretation; it
does not bind any regulator, certify any implementation, or substitute
for licensed legal review. See `LEGAL_DISCLAIMER.md`.
