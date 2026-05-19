# ARCH-IAM-RBAC-ABAC-ENGINE — GCP reference pattern.
#
# Cerbos PDP on Cloud Run; Cloud Endpoints (or API Gateway) routes invoke
# Cloud Run service before backend handlers. Policies in GCS bucket with
# Bucket Lock (WORM).
#
# Authority crosswalk: ISO 27001 A.5.15-18, SOC 2 CC6.3, GDPR Art. 25,
#                      EU AI Act Art. 14.
# Apache-2.0.

terraform {
  required_providers {
    google = { source = "hashicorp/google", version = "~> 5.0" }
  }
}

variable "project_id"      { type = string }
variable "region"          { type = string }
variable "policy_bucket"   { type = string }

resource "google_storage_bucket" "policy" {
  name     = var.policy_bucket
  project  = var.project_id
  location = var.region

  uniform_bucket_level_access = true
  versioning { enabled = true }

  retention_policy {
    retention_period = 31536000  # 365 days
    is_locked        = true       # WORM
  }
}

resource "google_cloud_run_v2_service" "pdp" {
  name     = "cta-cerbos-pdp"
  project  = var.project_id
  location = var.region
  ingress  = "INGRESS_TRAFFIC_INTERNAL_ONLY"

  template {
    containers {
      image = "ghcr.io/cerbos/cerbos:latest"
      ports { container_port = 3593 }
      env {
        name  = "CERBOS_CONFIG"
        value = "/policies/.cerbos.yaml"
      }
    }
    scaling { min_instance_count = 2, max_instance_count = 10 }
  }
}

output "evidence_configuration_id" {
  value = "EV-CFG-${google_cloud_run_v2_service.pdp.name}"
}
