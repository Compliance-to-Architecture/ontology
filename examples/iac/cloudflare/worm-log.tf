# ARCH-AUDIT-WORM-LOG — Cloudflare reference pattern.
#
# D1-backed append-only log + Cerbos policy that denies UPDATE/DELETE.
# Hash chain: this_hash = sha256(prev_hash || canonical_json(event)).
# A `verify()` endpoint walks the chain and returns the first id that
# breaks tamper-evidence.
#
# Authority crosswalk: DORA Art. 18, GDPR Art. 25(1), ISO 27001 A.8.15,
#                      SOC 2 CC7.2, EU AI Act Art. 12 (event logging).
# Apache-2.0.

resource "cloudflare_d1_database" "worm" {
  account_id = var.cloudflare_account_id
  name       = "cta-worm-log"
}

resource "null_resource" "schema" {
  # Apply schema.sql once. In production you'd run this through CI.
  provisioner "local-exec" {
    command = "wrangler d1 execute ${cloudflare_d1_database.worm.name} --remote --file=${path.module}/worm-schema.sql"
  }
  depends_on = [cloudflare_d1_database.worm]
}

# Companion Worker that exposes append + verify endpoints. The route
# binding (not shown) sends /v1/audit-trail/* to this Worker.
resource "cloudflare_workers_script" "worm_writer" {
  account_id = var.cloudflare_account_id
  name       = "cta-worm-writer"
  content    = file("${path.module}/worm_worker.js")

  d1_database_binding {
    name        = "DB_AUDIT"
    database_id = cloudflare_d1_database.worm.id
  }
}

variable "cloudflare_account_id" { type = string }

output "evidence_configuration_id" {
  value = "EV-CFG-${cloudflare_workers_script.worm_writer.name}"
}

# Companion file: worm-schema.sql — see neighbouring file for the
# audit_events table with hash-chain columns + tenant_id NOT NULL.
