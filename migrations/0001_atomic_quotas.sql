-- Local preparation only. Apply to the existing LEADS_DB before a separately authorized code deployment.
CREATE TABLE IF NOT EXISTS abuse_quotas (
  quota_key TEXT PRIMARY KEY NOT NULL,
  count INTEGER NOT NULL CHECK(typeof(count) = 'integer' AND count > 0),
  reset_at INTEGER NOT NULL CHECK(typeof(reset_at) = 'integer' AND reset_at > 0),
  reservation_token TEXT NOT NULL CHECK(length(reservation_token) = 36)
);
CREATE INDEX IF NOT EXISTS abuse_quotas_expiry ON abuse_quotas(reset_at);
