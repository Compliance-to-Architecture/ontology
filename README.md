<div align="center">

# Compliance-to-Architecture / ontology

**JSON-LD ontology + schemas for the Compliance-to-Architecture Framework™.**

[![License](https://img.shields.io/badge/license-Apache--2.0-blue.svg)](https://www.apache.org/licenses/LICENSE-2.0) [![Status](https://img.shields.io/badge/status-public%20OSS-brightgreen.svg)](#) [![Spec](https://img.shields.io/badge/spec-v0.1-orange.svg)](#) [![PRs welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](#) [![Schemas](https://img.shields.io/badge/JSON--Schema-supported-blue.svg)](schemas/) [![IaC](https://img.shields.io/badge/IaC-AWS%20·%20GCP%20·%20Azure%20·%20Cloudflare-1F6FEB.svg)](examples/iac/)

</div>

---

## 12-layer model

```
  L1  Authority         — who issues the obligation
  L2  Jurisdiction      — where the obligation applies
  L3  Risk              — the harm protected against
  L4  Obligation        — canonical "must" statement
  L5  Control           — mitigation
  L6  Mitigation        — residual-risk treatment
  L7  Architecture      — system surface bearing the control
  L8  Policy-as-Code    — Cerbos / OPA / Cedar enforcement
  L9  Workflow          — operational procedure
  L10 Evidence          — produced artefact
  L11 Audit-Trail       — immutable record
  L12 Audit-Pack        — auditor-ready bundle
```

## What `schemas/` contains

JSON Schemas for every node + edge class. Validate any artefact body against the canonical schema.

## What `examples/iac/` contains

Reference Terraform / OpenTofu modules per cloud (AWS, GCP, Azure, Cloudflare) that emit graph-shaped state.

## Spec

See `SPEC.md` for the canonical specification, `METHODOLOGY.md` for the design principles, and `GOVERNANCE.md` for the contribution model.

---

## Sibling repos

| Repo | What |
| --- | --- |
| [`framework`](https://github.com/Compliance-to-Architecture/framework) | 25 framework dictionaries + crosswalks + policy-as-code compile targets |
| [`ontology`](https://github.com/Compliance-to-Architecture/ontology) | JSON-LD ontology + schemas + IaC examples |
| [`sector-packs`](https://github.com/Compliance-to-Architecture/sector-packs) | Maritime / legal / oil-and-gas vertical bundles |
| [`dictionaries`](https://github.com/Compliance-to-Architecture/dictionaries) | Canonical taxonomies (8 JSON dictionaries) |
| [`playbooks`](https://github.com/Compliance-to-Architecture/playbooks) | Skill files + worked examples |

## Provenance

Mirrored from the upstream [ReguNav/app](https://github.com/ReguNav/app) monorepo. Apache-2.0 contributions welcome — by contributing you agree your contribution is Apache-2.0.

[![Site](https://img.shields.io/badge/compliancetoarchitecture.com-→-1F6FEB.svg)](https://compliancetoarchitecture.com)
