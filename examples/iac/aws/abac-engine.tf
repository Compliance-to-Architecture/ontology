# ARCH-IAM-RBAC-ABAC-ENGINE — AWS reference pattern.
#
# Cerbos PDP runs as an ECS Fargate sidecar; API Gateway routes invoke
# a Lambda authoriser that calls the local PDP. Policies are bundled
# in S3 and pulled on cold start.
#
# Authority crosswalk: ISO 27001 A.5.15-18, SOC 2 CC6.3, GDPR Art. 25,
#                      EU AI Act Art. 14 (human oversight).
# Apache-2.0.

terraform {
  required_providers {
    aws = { source = "hashicorp/aws", version = "~> 5.0" }
  }
}

variable "policy_bundle_s3_key" { type = string }
variable "policy_bucket_name"   { type = string }
variable "vpc_subnets"          { type = list(string) }
variable "security_group_ids"   { type = list(string) }

resource "aws_s3_bucket" "policy" {
  bucket = var.policy_bucket_name
  force_destroy = false
}

resource "aws_s3_bucket_versioning" "policy" {
  bucket = aws_s3_bucket.policy.id
  versioning_configuration { status = "Enabled" }
}

resource "aws_s3_bucket_object_lock_configuration" "policy" {
  bucket = aws_s3_bucket.policy.id
  object_lock_configuration {
    rule { default_retention { mode = "COMPLIANCE", days = 365 } }
  }
}

resource "aws_ecs_cluster" "pdp" {
  name = "cta-pdp-cluster"
}

resource "aws_ecs_task_definition" "pdp" {
  family                   = "cta-cerbos-pdp"
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  cpu                      = "256"
  memory                   = "512"

  container_definitions = jsonencode([{
    name      = "cerbos"
    image     = "ghcr.io/cerbos/cerbos:latest"
    essential = true
    portMappings = [{ containerPort = 3593, hostPort = 3593, protocol = "tcp" }]
    environment = [
      { name = "CERBOS_CONFIG", value = "/policies/.cerbos.yaml" },
    ]
  }])
}

resource "aws_ecs_service" "pdp" {
  name            = "cta-pdp"
  cluster         = aws_ecs_cluster.pdp.id
  task_definition = aws_ecs_task_definition.pdp.arn
  desired_count   = 2
  launch_type     = "FARGATE"

  network_configuration {
    subnets         = var.vpc_subnets
    security_groups = var.security_group_ids
  }
}

output "evidence_configuration_id" {
  value = "EV-CFG-${aws_ecs_service.pdp.name}"
}
