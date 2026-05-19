# ARCH-AUDIT-WORM-LOG — AWS reference pattern.
#
# Append-only audit log on DynamoDB with conditional writes that prevent
# UPDATE/DELETE; cross-region replication for tamper-detection. Hash chain
# in the application layer; verify endpoint walks rows in time order.
#
# Authority crosswalk: DORA Art. 18, GDPR Art. 25(1), ISO 27001 A.8.15,
#                      SOC 2 CC7.2, EU AI Act Art. 12 (event logging).
# Apache-2.0.

resource "aws_dynamodb_table" "audit_events" {
  name         = "cta-audit-events"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "tenant_id"
  range_key    = "ts"

  attribute { name = "tenant_id"     type = "S" }
  attribute { name = "ts"            type = "S" }
  attribute { name = "this_hash"     type = "S" }
  attribute { name = "resource_kind" type = "S" }
  attribute { name = "resource_id"   type = "S" }

  global_secondary_index {
    name            = "by_resource"
    hash_key        = "tenant_id"
    range_key       = "resource_kind"
    projection_type = "ALL"
  }

  global_secondary_index {
    name            = "by_hash"
    hash_key        = "tenant_id"
    range_key       = "this_hash"
    projection_type = "KEYS_ONLY"
  }

  point_in_time_recovery { enabled = true }
  server_side_encryption { enabled = true, kms_key_arn = var.kms_key_arn }
}

# IAM policy that DENIES UpdateItem + DeleteItem on the table (WORM at
# the IAM layer, complementing the application's no-UPDATE/DELETE
# discipline + Cerbos PEP).
resource "aws_iam_policy" "audit_worm_deny" {
  name = "cta-audit-worm-deny"
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect   = "Deny"
      Action   = ["dynamodb:UpdateItem", "dynamodb:DeleteItem", "dynamodb:DeleteTable"]
      Resource = aws_dynamodb_table.audit_events.arn
    }]
  })
}

variable "kms_key_arn" { type = string }

output "evidence_configuration_id" {
  value = "EV-CFG-${aws_dynamodb_table.audit_events.name}"
}
