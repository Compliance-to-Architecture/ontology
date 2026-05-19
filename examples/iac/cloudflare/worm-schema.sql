-- WORM hash-chain audit log — companion schema for ARCH-AUDIT-WORM-LOG.
-- Apache-2.0. The Cerbos policy `regunav.audit_trail` (or `cta.audit_trail`)
-- enforces no UPDATE/DELETE; this schema enforces tenant_id + uniqueness.

CREATE TABLE IF NOT EXISTS audit_events (
  id              TEXT PRIMARY KEY,
  tenant_id       TEXT NOT NULL,
  prev_hash       TEXT NOT NULL,                  -- previous row's this_hash; "GENESIS" for the first event
  this_hash       TEXT NOT NULL,                  -- sha256(prev_hash || canonical_json(event))
  actor_id        TEXT NOT NULL,
  actor_email     TEXT,
  action          TEXT NOT NULL,
  resource_kind   TEXT NOT NULL,
  resource_id     TEXT NOT NULL,
  resource_name   TEXT,
  reason          TEXT,
  ip              TEXT,
  user_agent      TEXT,
  ts              TEXT NOT NULL,
  UNIQUE (tenant_id, this_hash)
);
CREATE INDEX IF NOT EXISTS idx_audit_events_tenant_ts ON audit_events(tenant_id, ts DESC);
CREATE INDEX IF NOT EXISTS idx_audit_events_resource ON audit_events(tenant_id, resource_kind, resource_id);
