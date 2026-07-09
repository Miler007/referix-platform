-- Referix Database Schema — D1 (SQLite)
-- Complete schema for the Operational Pilot

CREATE TABLE IF NOT EXISTS tenants (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  currency TEXT DEFAULT 'MXN',
  timezone TEXT DEFAULT 'America/Mexico_City',
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'REFERIDOR',
  active INTEGER DEFAULT 1,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (tenant_id) REFERENCES tenants(id)
);

CREATE TABLE IF NOT EXISTS persons (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  full_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  address TEXT,
  latitude REAL,
  longitude REAL,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS referidors (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  person_id TEXT NOT NULL,
  status TEXT DEFAULT 'PENDING_APPROVAL',
  referral_code TEXT,
  approved_by TEXT,
  approved_at TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (person_id) REFERENCES persons(id)
);

CREATE TABLE IF NOT EXISTS plans (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  name TEXT NOT NULL,
  price REAL NOT NULL,
  speed INTEGER NOT NULL,
  technology TEXT DEFAULT 'FTTH',
  commission_pct REAL DEFAULT 15,
  active INTEGER DEFAULT 1,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS referrals (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  referrer_person_id TEXT,
  full_name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  address TEXT,
  latitude REAL,
  longitude REAL,
  plan_id TEXT,
  source TEXT DEFAULT 'DIRECT',
  funnel_status TEXT DEFAULT 'NEW',
  subscription_id TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS coverage_zones (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  name TEXT NOT NULL,
  technology TEXT DEFAULT 'FTTH',
  max_speed INTEGER DEFAULT 1000,
  install_hours INTEGER DEFAULT 48,
  min_lat REAL,
  max_lat REAL,
  min_lng REAL,
  max_lng REAL,
  active INTEGER DEFAULT 1
);

CREATE TABLE IF NOT EXISTS distribution_boxes (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  zone_id TEXT,
  name TEXT NOT NULL,
  address TEXT,
  total_ports INTEGER DEFAULT 16,
  used_ports INTEGER DEFAULT 0,
  status TEXT DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS subscriptions (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  person_id TEXT,
  plan_id TEXT,
  status TEXT DEFAULT 'PENDING_PROVISIONING',
  amount REAL DEFAULT 0,
  currency TEXT DEFAULT 'MXN',
  activated_at TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS installations (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  subscription_id TEXT,
  technician_id TEXT,
  scheduled_date TEXT,
  status TEXT DEFAULT 'PENDING',
  evidence TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS technicians (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  person_id TEXT,
  name TEXT NOT NULL,
  skills TEXT DEFAULT '["FTTH"]',
  max_daily INTEGER DEFAULT 4,
  vehicle_type TEXT DEFAULT 'CAR',
  active INTEGER DEFAULT 1
);

CREATE TABLE IF NOT EXISTS invoices (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  subscription_id TEXT,
  amount REAL NOT NULL,
  currency TEXT DEFAULT 'MXN',
  status TEXT DEFAULT 'PENDING',
  due_at TEXT,
  paid_at TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS payments (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  invoice_id TEXT,
  amount REAL NOT NULL,
  currency TEXT DEFAULT 'MXN',
  source TEXT DEFAULT 'SELF',
  status TEXT DEFAULT 'PENDING',
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS commissions (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  referral_id TEXT,
  subscription_id TEXT,
  policy_id TEXT,
  base_amount REAL NOT NULL,
  final_amount REAL NOT NULL,
  financial_state TEXT DEFAULT 'PENDING',
  operational_state TEXT DEFAULT 'CALCULATED',
  held_until TEXT,
  paid_at TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS commission_policies (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  name TEXT NOT NULL,
  type TEXT DEFAULT 'PERCENTAGE',
  value REAL NOT NULL,
  conditions TEXT DEFAULT '{}',
  priority INTEGER DEFAULT 1,
  holding_days INTEGER DEFAULT 15,
  active INTEGER DEFAULT 1
);

CREATE TABLE IF NOT EXISTS wallets (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  referrer_person_id TEXT UNIQUE,
  balance REAL DEFAULT 0,
  pending_balance REAL DEFAULT 0,
  total_earned REAL DEFAULT 0,
  total_withdrawn REAL DEFAULT 0,
  currency TEXT DEFAULT 'MXN'
);

CREATE TABLE IF NOT EXISTS wallet_transactions (
  id TEXT PRIMARY KEY,
  wallet_id TEXT NOT NULL,
  type TEXT NOT NULL,
  amount REAL NOT NULL,
  balance_before REAL NOT NULL,
  balance_after REAL NOT NULL,
  description TEXT,
  reference_id TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS events (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  aggregate_type TEXT NOT NULL,
  aggregate_id TEXT NOT NULL,
  event_name TEXT NOT NULL,
  event_version TEXT DEFAULT '1.0.0',
  payload TEXT DEFAULT '{}',
  actor_id TEXT,
  correlation_id TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS notification_templates (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  event_name TEXT NOT NULL,
  channel TEXT NOT NULL,
  template TEXT NOT NULL,
  active INTEGER DEFAULT 1
);

CREATE INDEX IF NOT EXISTS idx_referrals_tenant_status ON referrals(tenant_id, funnel_status);
CREATE INDEX IF NOT EXISTS idx_events_aggregate ON events(aggregate_id);
CREATE INDEX IF NOT EXISTS idx_commissions_tenant_state ON commissions(tenant_id, financial_state);
CREATE INDEX IF NOT EXISTS idx_subscriptions_tenant ON subscriptions(tenant_id);
CREATE INDEX IF NOT EXISTS idx_installations_tenant_tech ON installations(tenant_id, technician_id);
