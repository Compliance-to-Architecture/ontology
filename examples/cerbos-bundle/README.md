# Compliance-to-Architecture · Cerbos reference bundle

A complete, runnable Cerbos policy bundle that enforces the example
control `CTRL-IAM-ACCESS-REVIEW-001` (quarterly privileged-access review).

This is the Layer 6 (Policy-as-Code) artefact promised by the framework
specification. It is published under Apache-2.0 alongside the spec so
implementers can fork it.

## What it covers

| Authority clause | Implemented by |
|---|---|
| **ISO 27001 A.5.18** Privileged access rights | This bundle |
| **SOC 2 CC6.3** Logical access — privileged accounts review | This bundle |
| **PCI DSS 7.2.5** Privilege review every 6 months | This bundle |
| **NIST CSF PR.AC-4** Access permissions managed | This bundle |

## Files

```
cerbos-bundle/
├── derived_roles.yaml          # tenant_member, tenant_admin_only,
│                                  four_eyes_approver, region_match
├── access_review.yaml          # resource policy: CTRL-IAM-ACCESS-REVIEW-001
└── README.md                   # this file
```

## Running

```sh
docker run --rm -v "$PWD:/policies:ro" \
  ghcr.io/cerbos/cerbos:latest compile /policies
```

## Verifying

A passing decision MUST emit an `EvidenceObject` of kind `attestation`
that records the reviewer principal id + review outcome. See the
[evidence schemas](../../schemas/) for the required shape.

## Crosswalk to other policy engines

The same control can be implemented in OPA / Cedar / Casbin. A Compliance-
to-Architecture conformant implementation MUST publish the equivalent
bundle for any policy engine it supports, with the same authoritative
clause coverage. See the [conformance test suite](../../conformance/) to
verify your fork.
