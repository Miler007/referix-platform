-- Commercial Engine — Motor Comercial de Referix
-- 7 módulos: Catálogo, Ofertas, Cobertura, Recomendación, Pricing, Comisiones, Rentabilidad

-- ─── OFFERS (Ofertas Comerciales) ────────────────────────────────────
CREATE TABLE IF NOT EXISTS commercial_offers (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  name TEXT NOT NULL,
  code TEXT NOT NULL,
  description TEXT,
  benefits TEXT DEFAULT '[]',
  plan_id TEXT NOT NULL,
  status TEXT DEFAULT 'DRAFT',
  version INTEGER DEFAULT 1,
  published_at TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- Services included in an offer (combined from plan + extras)
CREATE TABLE IF NOT EXISTS offer_services (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  offer_id TEXT NOT NULL,
  name TEXT NOT NULL,
  icon TEXT DEFAULT '✔',
  included INTEGER DEFAULT 1
);

-- ─── AVAILABILITY ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS offer_availability (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  offer_id TEXT NOT NULL,
  zone_id TEXT NOT NULL,
  box_id TEXT,
  status TEXT DEFAULT 'AVAILABLE',
  UNIQUE(offer_id, zone_id, box_id)
);

-- ─── RECOMMENDATION RULES ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS recommendation_rules (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  name TEXT NOT NULL,
  conditions TEXT NOT NULL DEFAULT '{}',
  suggested_offer_id TEXT NOT NULL,
  priority INTEGER DEFAULT 1,
  confidence INTEGER DEFAULT 50,
  active INTEGER DEFAULT 1
);

-- ─── PRICING ENGINE ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS pricing_rules (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'TAX',
  value REAL NOT NULL DEFAULT 0,
  applies_to TEXT DEFAULT 'ALL',
  client_type_id TEXT,
  active INTEGER DEFAULT 1
);

CREATE TABLE IF NOT EXISTS promotions (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  offer_id TEXT NOT NULL,
  name TEXT NOT NULL,
  type TEXT DEFAULT 'DISCOUNT',
  value REAL NOT NULL DEFAULT 0,
  duration_days INTEGER,
  valid_from TEXT,
  valid_to TEXT,
  active INTEGER DEFAULT 1
);

-- ─── COMMISSION ENGINE ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS commission_rules (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  offer_id TEXT,
  plan_id TEXT,
  role TEXT DEFAULT 'REFERIDOR',
  type TEXT DEFAULT 'PERCENTAGE',
  value REAL NOT NULL DEFAULT 0,
  min_amount REAL,
  max_amount REAL,
  holding_days INTEGER DEFAULT 15,
  active INTEGER DEFAULT 1
);

-- ─── PROFITABILITY ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS plan_costs (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  plan_id TEXT NOT NULL,
  infrastructure REAL DEFAULT 0,
  support REAL DEFAULT 0,
  equipment REAL DEFAULT 0,
  installation REAL DEFAULT 0,
  commissions REAL DEFAULT 0,
  other REAL DEFAULT 0,
  notes TEXT,
  updated_at TEXT DEFAULT (datetime('now'))
);
