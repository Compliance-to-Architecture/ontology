# ARCH-IAM-RBAC-ABAC-ENGINE — Cloudflare reference pattern.
#
# Cerbos PDP runs embedded inside a Cloudflare Worker (no external network
# call per request). Policies are bundled at deploy-time and shipped as a
# JSON-encoded constant. The Worker exposes /v1/check (POST) which routes
# every API call through PDP.check() before reaching the handler.
#
# Authority crosswalk: ISO 27001 A.5.15-18, SOC 2 CC6.3, GDPR Art. 25,
#                      EU AI Act Art. 14 (human oversight).
# Apache-2.0.

terraform {
  required_providers {
    cloudflare = { source = "cloudflare/cloudflare", version = "~> 4.0" }
  }
}

variable "cloudflare_account_id" { type = string }
variable "policy_bundle_path"    { type = string }

resource "cloudflare_workers_script" "abac_engine" {
  account_id = var.cloudflare_account_id
  name       = "cta-abac-engine"
  content    = file("${path.module}/abac_worker.js")

  plain_text_binding {
    name = "POLICY_BUNDLE"
    text = file(var.policy_bundle_path)
  }

  # AUTH_HS256_SECRET is supplied via `wrangler secret put` (or the
  # Cloudflare dashboard). It MUST never be committed to source.
}

# Route /api/* on your zone through the ABAC engine. Replace the zone with
# your own; this pattern assumes a single public-API host.
resource "cloudflare_workers_route" "abac_route" {
  zone_id     = var.cloudflare_zone_id
  pattern     = "${var.api_host}/v1/*"
  script_name = cloudflare_workers_script.abac_engine.name
}

variable "cloudflare_zone_id" { type = string }
variable "api_host"           { type = string }

output "evidence_configuration_id" {
  # The corresponding EvidenceObject of kind `configuration` references this.
  value = "EV-CFG-${cloudflare_workers_script.abac_engine.name}"
}
