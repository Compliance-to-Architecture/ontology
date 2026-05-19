# Sector Packs

A **sector pack** is a curated, opinionated bundle of compliance frameworks
for a specific market vertical (fintech, healthtech, AI foundation-model
providers, public sector, etc.). It answers the question every new ReguNav
customer asks on day one:

> "I'm building a fintech in the EU — which of your 21 frameworks do I
> actually need, and in what order?"

A sector pack is a **starting point**, not a substitute for scoping advice
from a qualified counsel or auditor. See
[`LEGAL_DISCLAIMER.md`](./LEGAL_DISCLAIMER.md).

## What's in a sector pack

| Field | Purpose |
| --- | --- |
| `sector_pack_id` | Stable kebab-case slug (e.g. `fintech-eu`) |
| `name` | Display name (e.g. `Fintech (EU)`) |
| `description` | One- or two-sentence pitch for the bundle |
| `version` | SemVer of this pack definition |
| `required_frameworks` | Must-implement to operate in the sector |
| `recommended_frameworks` | Best-practice + commonly-required sub-cases |
| `optional_frameworks` | Apply only in narrow sub-cases |
| `crosswalk_pairs` | Pre-mapped framework pairs from `packages/frameworks/src/crosswalks.ts` that maximise evidence reuse |
| `sequencing_notes` | Ordered guidance: which framework first, and why later ones reuse earlier evidence |
| `last_reviewed` | When the pack was last sanity-checked by a domain SME |

## How to use a sector pack

1. **Pick the closest pack** to your business. Don't over-index on
   perfect fit — `fintech-eu` still applies to an Austrian e-money
   institution even though it doesn't mention Austria specifically.
2. **Stand up the required frameworks** in the order suggested by
   `sequencing_notes`. The order matters because later frameworks
   typically reuse evidence the earlier ones produce (ISO 27001 ISMS
   first → GDPR Art. 32 on top → SOC 2 Type II as an export deliverable).
3. **Map the recommended frameworks** to your product roadmap. A
   recommendation usually fires conditionally — "EU AI Act if you have
   AI scoring", "NIS2 if you're an essential entity under Annex I".
4. **Lean on the crosswalk pairs** when running gap assessments. Each
   pair is a real edge in `packages/frameworks/src/crosswalks.ts` — the
   evidence you already collected for one side is reusable on the other.
5. **Refresh.** Sector packs are versioned (`version` + `last_reviewed`).
   When you bump a pack, the changelog should reference the regulatory
   trigger (e.g. "DORA RTS published — bumped fintech-eu to 0.2.0").

## What a sector pack is NOT

- **Not legal advice.** No sector pack replaces a privacy / cyber /
  financial-services lawyer scoping your obligations against your
  product, customers and geographic footprint.
- **Not a complete audit programme.** A sector pack tells you which
  frameworks; you still need control implementations, evidence
  collection, third-party attestations and ongoing monitoring.
- **Not jurisdiction-specific.** Most packs cover a multi-country
  region (EU/EEA, US states). Pack-level recommendations may still
  hide member-state implementing-law detail (NIS2 transposition,
  GDPR derogations under Art. 23, US state privacy laws).
- **Not exhaustive.** Optional frameworks list common edge cases.
  Real businesses have additional sectoral overlays — telco licensing,
  medical-device CE marking, banking-licence conduct rules — that the
  pack signals but does not enumerate.

## Authoring a new sector pack

1. Create `packages/ontology/sector-packs/<slug>.json`.
2. Validate against
   [`schemas/sector-pack.schema.json`](./schemas/sector-pack.schema.json)
   via `pnpm --filter @regunav/ontology test:schemas`.
3. Every entry in `required_frameworks` / `recommended_frameworks` /
   `optional_frameworks` MUST be a member of the `FrameworkCode` union
   in `packages/types/src/index.ts`.
4. Every `crosswalk_pairs` entry MUST correspond to an actual edge in
   `packages/frameworks/src/crosswalks.ts`. Do not invent mappings;
   add the edge to `crosswalks.ts` first if it's genuinely missing.
5. Set `last_reviewed` to today (ISO-8601 date). Bump `version`
   whenever you change the required / recommended / optional sets or
   the crosswalk pairs.

## Available packs

| Pack | Audience |
| --- | --- |
| `fintech-eu` | Fintech businesses on the EU/EEA market |
| `fintech-us` | Fintech businesses in the United States |
| `healthtech-eu` | EU/EEA digital-health vendors |
| `healthtech-us` | US digital-health vendors (HIPAA scope) |
| `saas-b2b-global` | Horizontal B2B SaaS with mixed buyer geography |
| `ai-foundation-model-eu` | General-purpose AI model providers on the EU market |
| `ai-application-deployer-eu` | Entities deploying AI systems in the EU |
| `public-sector-us` | Vendors selling to US federal / state / local government |
