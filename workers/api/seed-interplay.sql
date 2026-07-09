-- Seed: INTERPLAY Commercial Catalog
-- Todas las zonas, tecnologias y planes confirmados

-- ─── TENANT ──────────────────────────────────────────────────────────
INSERT OR REPLACE INTO tenants (id, name, currency, timezone) VALUES ('interplay', 'INTERPLAY', 'COP', 'America/Bogota');

-- ─── USERS ───────────────────────────────────────────────────────────
INSERT OR REPLACE INTO users (id, tenant_id, name, email, password, role) VALUES
  ('ip-admin', 'interplay', 'Admin INTERPLAY', 'admin@interplay.com', 'admin123', 'ADMIN'),
  ('ip-supervisor', 'interplay', 'Supervisor', 'supervisor@interplay.com', 'admin123', 'SUPERVISOR');

-- ─── COVERAGE ZONES ──────────────────────────────────────────────────
INSERT OR REPLACE INTO coverage_zones (id, tenant_id, name, technology, max_speed, install_hours, min_lat, max_lat, min_lng, max_lng, active) VALUES
  ('z-fresno', 'interplay', 'Fresno', 'GPON', 200, 48, 5.15, 5.20, -75.10, -75.05, 1),
  ('z-guayabal-gpon', 'interplay', 'Guayabal', 'GPON', 200, 48, 5.05, 5.10, -75.08, -75.03, 1),
  ('z-guayabal-radio', 'interplay', 'Guayabal', 'RADIO', 50, 72, 5.05, 5.10, -75.08, -75.03, 1),
  ('z-lerida', 'interplay', 'Lérida', 'GPON', 200, 48, 4.90, 4.95, -75.00, -74.95, 1),
  ('z-venadillo', 'interplay', 'Venadillo', 'GPON', 100, 48, 4.70, 4.75, -74.85, -74.80, 1),
  ('z-alvarado', 'interplay', 'Alvarado', 'RADIO', 30, 72, 4.55, 4.60, -74.70, -74.65, 1),
  ('z-sierra', 'interplay', 'La Sierra', 'RADIO', 20, 72, 5.20, 5.25, -75.15, -75.10, 1),
  ('z-iguacitos', 'interplay', 'Iguacitos', 'RADIO', 20, 72, 5.00, 5.05, -75.00, -74.95, 1),
  ('z-delicias', 'interplay', 'Delicias', 'RADIO', 20, 72, 4.80, 4.85, -74.70, -74.65, 1);

-- ─── PRODUCTS ────────────────────────────────────────────────────────
INSERT OR REPLACE INTO plans (id, tenant_id, name, price, speed, technology, commission_pct, active) VALUES
  -- FRESNO - GPON
  ('plan-fresno-50', 'interplay', 'MegaUltra 50', 49990, 50, 'GPON', 10, 1),
  ('plan-fresno-100', 'interplay', 'MegaUltra 100', 59990, 100, 'GPON', 10, 1),
  ('plan-fresno-200', 'interplay', 'MegaUltra 200', 69990, 200, 'GPON', 12, 1),
  
  -- GUAYABAL - GPON
  ('plan-guayabal-50', 'interplay', 'MegaUltra 50', 49990, 50, 'GPON', 10, 1),
  ('plan-guayabal-100', 'interplay', 'MegaUltra 100', 59990, 100, 'GPON', 10, 1),
  ('plan-guayabal-200', 'interplay', 'MegaUltra 200', 69990, 200, 'GPON', 12, 1),
  
  -- GUAYABAL - RADIO ENLACE
  ('plan-guayabal-radio-10', 'interplay', 'Plan Radio 10', 29990, 10, 'RADIO', 8, 1),
  ('plan-guayabal-radio-20', 'interplay', 'Plan Radio 20', 39990, 20, 'RADIO', 8, 1),
  ('plan-guayabal-radio-50', 'interplay', 'Plan Radio 50', 49990, 50, 'RADIO', 10, 1),
  
  -- LERIDA - GPON
  ('plan-lerida-50', 'interplay', 'MegaUltra 50', 49990, 50, 'GPON', 10, 1),
  ('plan-lerida-100', 'interplay', 'MegaUltra 100', 59990, 100, 'GPON', 10, 1),
  ('plan-lerida-200', 'interplay', 'MegaUltra 200', 69990, 200, 'GPON', 12, 1),
  
  -- VENADILLO - GPON
  ('plan-venadillo-30', 'interplay', 'Plan Básico 30', 39990, 30, 'GPON', 8, 1),
  ('plan-venadillo-50', 'interplay', 'MegaUltra 50', 49990, 50, 'GPON', 10, 1),
  ('plan-venadillo-100', 'interplay', 'MegaUltra 100', 59990, 100, 'GPON', 10, 1),
  
  -- ALVARADO - RADIO ENLACE
  ('plan-alvarado-10', 'interplay', 'Plan Rural 10', 24990, 10, 'RADIO', 8, 1),
  ('plan-alvarado-20', 'interplay', 'Plan Rural 20', 34990, 20, 'RADIO', 8, 1),
  ('plan-alvarado-30', 'interplay', 'Plan Rural 30', 44990, 30, 'RADIO', 10, 1),
  
  -- SIERRA - RADIO ENLACE
  ('plan-sierra-10', 'interplay', 'Plan Rural 10', 24990, 10, 'RADIO', 8, 1),
  ('plan-sierra-20', 'interplay', 'Plan Rural 20', 34990, 20, 'RADIO', 8, 1),
  
  -- IGUACITOS - RADIO ENLACE
  ('plan-iguacitos-10', 'interplay', 'Plan Rural 10', 24990, 10, 'RADIO', 8, 1),
  ('plan-iguacitos-20', 'interplay', 'Plan Rural 20', 34990, 20, 'RADIO', 8, 1),
  
  -- DELICIAS - RADIO ENLACE
  ('plan-delicias-10', 'interplay', 'Plan Rural 10', 24990, 10, 'RADIO', 8, 1),
  ('plan-delicias-20', 'interplay', 'Plan Rural 20', 34990, 20, 'RADIO', 8, 1);

-- ─── COMMISSION POLICIES ──────────────────────────────────────────────
INSERT OR REPLACE INTO commission_policies (id, tenant_id, name, type, value, conditions, priority, holding_days, active) VALUES
  ('cp-gpon-10', 'interplay', '10% GPON residencial', 'PERCENTAGE', 10, '{"technology":"GPON","clientType":"HOGAR"}', 1, 15, 1),
  ('cp-gpon-12', 'interplay', '12% GPON premium', 'PERCENTAGE', 12, '{"technology":"GPON","minPrice":60000}', 2, 15, 1),
  ('cp-radio-8', 'interplay', '8% Radio Enlace básico', 'PERCENTAGE', 8, '{"technology":"RADIO","maxPrice":35000}', 3, 15, 1),
  ('cp-radio-10', 'interplay', '10% Radio Enlace premium', 'PERCENTAGE', 10, '{"technology":"RADIO","minPrice":35001}', 4, 15, 1);
