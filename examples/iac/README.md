# Compliance-to-Architecture · IaC reference patterns

Layer 5 of the framework requires every `ArchitectureRequirement` to ship
with reference patterns per cloud. This directory holds the open
reference implementations.

| Architecture requirement | Cloudflare | AWS | Azure | GCP | On-prem |
|---|---|---|---|---|---|
| ARCH-IAM-RBAC-ABAC-ENGINE | [`cloudflare/abac-engine.tf`](./cloudflare/abac-engine.tf) | [`aws/abac-engine.tf`](./aws/abac-engine.tf) | [`azure/abac-engine.bicep`](./azure/abac-engine.bicep) | [`gcp/abac-engine.tf`](./gcp/abac-engine.tf) | (community) |
| ARCH-AUDIT-WORM-LOG | [`cloudflare/worm-log.tf`](./cloudflare/worm-log.tf) | [`aws/worm-log.tf`](./aws/worm-log.tf) | (community) | (community) | (community) |
| ARCH-EVIDENCE-EXPORT-API | (community) | (community) | (community) | (community) | (community) |
| ARCH-DRIFT-DETECTOR | (community) | (community) | (community) | (community) | (community) |
| ARCH-APPROVAL-WORKFLOW | (community) | (community) | (community) | (community) | (community) |
| ARCH-TENANT-ISOLATION | (community) | (community) | (community) | (community) | (community) |

## Conformance

A Compliance-to-Architecture conformant implementation MUST publish (or
link to) reference patterns for **every** ArchitectureRequirement on at
least **one** cloud. This repo seeds Cloudflare; community contributions
for the other clouds are welcome.

Each pattern MUST:
1. Be runnable Terraform / Pulumi / CDK (no pseudocode).
2. Include the resource IDs that the corresponding `EvidenceObject` of
   kind `configuration` will reference.
3. Be small enough to read in one sitting (target ~50 LoC per pattern).

## How patterns map back to controls

```
Authority (ISO 27001 A.5.18)
  └─ Obligation (OBL-PRIV-ACCESS-REVIEW)
      └─ Control (CTRL-IAM-ACCESS-REVIEW-001)
          ├─ Architecture (ARCH-IAM-RBAC-ABAC-ENGINE)  ← seed Terraform here
          ├─ Policy (POL-CERBOS-ACCESS-REVIEW)         ← seed Cerbos here
          └─ Evidence (EV-RPT-ACCESS-REVIEW-2026-Q2)   ← report kind, schema validated
```
