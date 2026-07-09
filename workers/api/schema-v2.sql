-- REF-INT-001: INTERPLAY Commercial Catalog v2
-- Catálogo completamente configurable por zona, tecnología y tipo de cliente

CREATE TABLE IF NOT EXISTS client_types (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  name TEXT NOT NULL,
  code TEXT NOT NULL,
  tax_rate REAL NOT NULL DEFAULT 0,
  description TEXT,
  active INTEGER DEFAULT 1
);

CREATE TABLE IF NOT EXISTS technologies (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  name TEXT NOT NULL,
  code TEXT NOT NULL,
  description TEXT,
  active INTEGER DEFAULT 1
);

CREATE TABLE IF NOT EXISTS commercial_categories (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  name TEXT NOT NULL,
  code TEXT NOT NULL,
  description TEXT,
  active INTEGER DEFAULT 1
);

CREATE TABLE IF NOT EXISTS catalog_plans (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  zone_id TEXT NOT NULL,
  technology_id TEXT NOT NULL,
  category_id TEXT,
  name TEXT NOT NULL,
  code TEXT NOT NULL,
  description TEXT,
  benefits TEXT DEFAULT '[]',
  download_speed INTEGER NOT NULL DEFAULT 0,
  upload_speed INTEGER NOT NULL DEFAULT 0,
  is_symmetric INTEGER DEFAULT 1,
  price REAL NOT NULL DEFAULT 0,
  tax_included INTEGER DEFAULT 0,
  installation_days_min INTEGER DEFAULT 2,
  installation_days_max INTEGER DEFAULT 3,
  support_priority TEXT DEFAULT 'NORMAL',
  max_incident_resolution_hours INTEGER DEFAULT 24,
  sla_availability REAL DEFAULT 99.5,
  status TEXT DEFAULT 'DRAFT',
  version INTEGER DEFAULT 1,
  published_at TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS plan_services (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  plan_id TEXT NOT NULL,
  name TEXT NOT NULL,
  code TEXT,
  icon TEXT DEFAULT '✔',
  active INTEGER DEFAULT 1
);

CREATE TABLE IF NOT EXISTS plan_equipment (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  plan_id TEXT NOT NULL,
  name TEXT NOT NULL,
  type TEXT,
  quantity INTEGER DEFAULT 1,
  active INTEGER DEFAULT 1
);

CREATE TABLE IF NOT EXISTS plan_documents (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  plan_id TEXT NOT NULL,
  name TEXT NOT NULL,
  code TEXT,
  required INTEGER DEFAULT 1,
  active INTEGER DEFAULT 1
);

CREATE TABLE IF NOT EXISTS plan_commissions (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  plan_id TEXT NOT NULL,
  client_type_id TEXT,
  type TEXT DEFAULT 'PERCENTAGE',
  value REAL NOT NULL DEFAULT 0,
  holding_days INTEGER DEFAULT 15,
  active INTEGER DEFAULT 1
);

-- Client Types
INSERT OR REPLACE INTO client_types (id, tenant_id, name, code, tax_rate, description) VALUES
  ('ct-residential', 'interplay', 'Residencial', 'RESIDENTIAL', 0, 'Hogares - IVA 0%'),
  ('ct-commercial', 'interplay', 'Comercial', 'COMMERCIAL', 19, 'Locales comerciales - IVA 19%');

-- Technologies
INSERT OR REPLACE INTO technologies (id, tenant_id, name, code, description) VALUES
  ('tech-gpon', 'interplay', 'Fibra Óptica GPON', 'GPON', 'Internet por fibra óptica'),
  ('tech-radio', 'interplay', 'Radio Enlace', 'RADIO_LINK', 'Internet por radio enlace');

-- Commercial Categories
INSERT OR REPLACE INTO commercial_categories (id, tenant_id, name, code) VALUES
  ('cat-hogar', 'interplay', 'Hogar', 'HOGAR'),
  ('cat-empresa', 'interplay', 'Empresa', 'EMPRESA'),
  ('cat-rural', 'interplay', 'Rural', 'RURAL'),
  ('cat-dedicado', 'interplay', 'Internet Dedicado', 'DEDICADO');
