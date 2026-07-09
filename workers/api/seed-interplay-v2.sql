-- INTERPLAY Commercial Catalog v2 — Seed completo
-- Zonas, planes, servicios, equipos, documentos, comisiones

-- ─── ZONAS (coverage_zones ya existe) ───────────────────────────────

-- ─── PLANES FRESNO - GPON ──────────────────────────────────────────
INSERT OR REPLACE INTO catalog_plans (id, tenant_id, zone_id, technology_id, category_id, name, code, description, benefits, download_speed, upload_speed, is_symmetric, price, installation_days_min, installation_days_max, support_priority, max_incident_resolution_hours, status, version) VALUES
  ('cp-fresno-50', 'interplay', 'z-fresno', 'tech-gpon', 'cat-hogar', 'MegaUltra 50', 'MU-50', 'Ideal para navegación web, redes sociales y correo electrónico',
   '["Netflix y streaming HD","Redes sociales","Correo y navegación","Hasta 5 dispositivos"]', 50, 50, 1, 49990, 2, 3, 'NORMAL', 24, 'PUBLISHED', 1),
  ('cp-fresno-100', 'interplay', 'z-fresno', 'tech-gpon', 'cat-hogar', 'MegaUltra 100', 'MU-100', 'Ideal para teletrabajo, streaming 4K y gaming online',
   '["Teletrabajo sin interrupciones","Streaming 4K simultáneo","Gaming online","Hasta 10 dispositivos","Soporte prioritario"]', 100, 100, 1, 59990, 2, 3, 'HIGH', 12, 'PUBLISHED', 1),
  ('cp-fresno-200', 'interplay', 'z-fresno', 'tech-gpon', 'cat-hogar', 'MegaUltra 200', 'MU-200', 'Ideal para hogares inteligentes, múltiples usuarios y alta demanda',
   '["Hogar inteligente","Múltiples usuarios simultáneos","Streaming 4K + gaming","Hasta 20 dispositivos","Soporte VIP","IP pública opcional"]', 200, 200, 1, 69990, 2, 3, 'HIGH', 8, 'PUBLISHED', 1);

-- Servicios Fresno
INSERT OR REPLACE INTO plan_services (id, tenant_id, plan_id, name, icon) VALUES
  ('ps-fresno-50-tv', 'interplay', 'cp-fresno-50', 'TV Digital HD', '📺'),
  ('ps-fresno-50-wifi', 'interplay', 'cp-fresno-50', 'Router WiFi', '📡'),
  ('ps-fresno-100-tv', 'interplay', 'cp-fresno-100', 'TV Digital HD', '📺'),
  ('ps-fresno-100-wifi', 'interplay', 'cp-fresno-100', 'Router WiFi Mesh', '📡'),
  ('ps-fresno-100-ip', 'interplay', 'cp-fresno-100', 'IP Pública', '🌐'),
  ('ps-fresno-200-tv', 'interplay', 'cp-fresno-200', 'TV Digital HD + 2 adicionales', '📺'),
  ('ps-fresno-200-wifi', 'interplay', 'cp-fresno-200', 'Router WiFi Mesh', '📡'),
  ('ps-fresno-200-ip', 'interplay', 'cp-fresno-200', 'IP Pública fija', '🌐'),
  ('ps-fresno-200-cloud', 'interplay', 'cp-fresno-200', 'Cloud DVR', '☁️');

-- Equipos Fresno
INSERT OR REPLACE INTO plan_equipment (id, tenant_id, plan_id, name, type) VALUES
  ('pe-fresno-50-ont', 'interplay', 'cp-fresno-50', 'ONT Huawei', 'ONT'),
  ('pe-fresno-50-router', 'interplay', 'cp-fresno-50', 'Router WiFi AC1200', 'ROUTER'),
  ('pe-fresno-100-ont', 'interplay', 'cp-fresno-100', 'ONT Huawei', 'ONT'),
  ('pe-fresno-100-router', 'interplay', 'cp-fresno-100', 'Router WiFi AX3000', 'ROUTER'),
  ('pe-fresno-200-ont', 'interplay', 'cp-fresno-200', 'ONT Huawei GPON', 'ONT'),
  ('pe-fresno-200-router', 'interplay', 'cp-fresno-200', 'Router WiFi AX6000 Mesh', 'ROUTER');

-- Documentos requeridos
INSERT OR REPLACE INTO plan_documents (id, tenant_id, plan_id, name, code) VALUES
  ('pd-fresno-cc', 'interplay', 'cp-fresno-50', 'Copia de cédula', 'CC'),
  ('pd-fresno-rp', 'interplay', 'cp-fresno-50', 'Fotocopia recibo público', 'RECIBO'),
  ('pd-fresno-100-cc', 'interplay', 'cp-fresno-100', 'Copia de cédula', 'CC'),
  ('pd-fresno-100-rp', 'interplay', 'cp-fresno-100', 'Fotocopia recibo público', 'RECIBO'),
  ('pd-fresno-200-cc', 'interplay', 'cp-fresno-200', 'Copia de cédula', 'CC'),
  ('pd-fresno-200-rp', 'interplay', 'cp-fresno-200', 'Fotocopia recibo público', 'RECIBO');

-- Comisiones Fresno
INSERT OR REPLACE INTO plan_commissions (id, tenant_id, plan_id, client_type_id, type, value, holding_days) VALUES
  ('pc-fresno-50-res', 'interplay', 'cp-fresno-50', 'ct-residential', 'PERCENTAGE', 10, 15),
  ('pc-fresno-50-com', 'interplay', 'cp-fresno-50', 'ct-commercial', 'PERCENTAGE', 8, 15),
  ('pc-fresno-100-res', 'interplay', 'cp-fresno-100', 'ct-residential', 'PERCENTAGE', 10, 15),
  ('pc-fresno-100-com', 'interplay', 'cp-fresno-100', 'ct-commercial', 'PERCENTAGE', 8, 15),
  ('pc-fresno-200-res', 'interplay', 'cp-fresno-200', 'ct-residential', 'PERCENTAGE', 12, 15),
  ('pc-fresno-200-com', 'interplay', 'cp-fresno-200', 'ct-commercial', 'PERCENTAGE', 10, 15);

-- ─── PLANES GUAYABAL - GPON ────────────────────────────────────────
INSERT OR REPLACE INTO catalog_plans (id, tenant_id, zone_id, technology_id, category_id, name, code, description, benefits, download_speed, upload_speed, is_symmetric, price, status, version) VALUES
  ('cp-guayabal-50', 'interplay', 'z-guayabal-gpon', 'tech-gpon', 'cat-hogar', 'MegaUltra 50', 'MU-50', 'Navegación y redes sociales', '["Netflix HD","Redes sociales","Hasta 5 dispositivos"]', 50, 50, 1, 49990, 'PUBLISHED', 1),
  ('cp-guayabal-100', 'interplay', 'z-guayabal-gpon', 'tech-gpon', 'cat-hogar', 'MegaUltra 100', 'MU-100', 'Teletrabajo y streaming', '["Teletrabajo","Streaming 4K","Hasta 10 dispositivos"]', 100, 100, 1, 59990, 'PUBLISHED', 1),
  ('cp-guayabal-200', 'interplay', 'z-guayabal-gpon', 'tech-gpon', 'cat-hogar', 'MegaUltra 200', 'MU-200', 'Hogar inteligente', '["Hogar inteligente","Gaming","Hasta 20 dispositivos"]', 200, 200, 1, 69990, 'PUBLISHED', 1);

-- ─── PLANES GUAYABAL - RADIO ───────────────────────────────────────
INSERT OR REPLACE INTO catalog_plans (id, tenant_id, zone_id, technology_id, category_id, name, code, description, benefits, download_speed, upload_speed, is_symmetric, price, status, version) VALUES
  ('cp-guayabal-r10', 'interplay', 'z-guayabal-radio', 'tech-radio', 'cat-rural', 'Plan Radio 10', 'RADIO-10', 'Conexión básica por radio enlace', '["Navegación básica","Correo","Redes sociales","Hasta 3 dispositivos"]', 10, 5, 0, 29990, 'PUBLISHED', 1),
  ('cp-guayabal-r20', 'interplay', 'z-guayabal-radio', 'tech-radio', 'cat-rural', 'Plan Radio 20', 'RADIO-20', 'Conexión estable para el hogar', '["Streaming SD","Teletrabajo básico","Hasta 5 dispositivos"]', 20, 10, 0, 39990, 'PUBLISHED', 1),
  ('cp-guayabal-r50', 'interplay', 'z-guayabal-radio', 'tech-radio', 'cat-rural', 'Plan Radio 50', 'RADIO-50', 'Alta velocidad por radio enlace', '["Streaming HD","Teletrabajo","Hasta 8 dispositivos"]', 50, 25, 0, 49990, 'PUBLISHED', 1);

-- ─── PLANES LERIDA - GPON ──────────────────────────────────────────
INSERT OR REPLACE INTO catalog_plans (id, tenant_id, zone_id, technology_id, category_id, name, code, description, benefits, download_speed, upload_speed, is_symmetric, price, installation_days_min, installation_days_max, support_priority, max_incident_resolution_hours, sla_availability, status, version, created_at, updated_at) VALUES
  ('cp-lerida-50', 'interplay', 'z-lerida', 'tech-gpon', 'cat-hogar', 'MegaUltra 50', 'MU-50', 'Navegación esencial', '["Redes sociales","Correo","Netflix HD","Hasta 5 dispositivos"]', 50, 50, 1, 49990, 2, 3, 'NORMAL', 24, 99.5, 'PUBLISHED', 1, datetime('now'), datetime('now'));

-- ─── PLANES VENADILLO - GPON ───────────────────────────────────────
INSERT OR REPLACE INTO catalog_plans (id, tenant_id, zone_id, technology_id, category_id, name, code, benefits, download_speed, upload_speed, is_symmetric, price, status, version) VALUES
  ('cp-venadillo-30', 'interplay', 'z-venadillo', 'tech-gpon', 'cat-hogar', 'Plan Básico 30', 'BAS-30', '["Navegación esencial","Hasta 3 dispositivos"]', 30, 30, 1, 39990, 'PUBLISHED', 1),
  ('cp-venadillo-50', 'interplay', 'z-venadillo', 'tech-gpon', 'cat-hogar', 'MegaUltra 50', 'MU-50', '["Netflix","Redes sociales","Hasta 5 dispositivos"]', 50, 50, 1, 49990, 'PUBLISHED', 1),
  ('cp-venadillo-100', 'interplay', 'z-venadillo', 'tech-gpon', 'cat-hogar', 'MegaUltra 100', 'MU-100', '["Teletrabajo","Streaming 4K","Hasta 10 dispositivos"]', 100, 100, 1, 59990, 'PUBLISHED', 1);

-- ─── PLANES ALVARADO - RADIO ───────────────────────────────────────
INSERT OR REPLACE INTO catalog_plans (id, tenant_id, zone_id, technology_id, category_id, name, code, benefits, download_speed, upload_speed, is_symmetric, price, status, version) VALUES
  ('cp-alvarado-10', 'interplay', 'z-alvarado', 'tech-radio', 'cat-rural', 'Plan Rural 10', 'RURAL-10', '["Conexión básica","Correo","WhatsApp"]', 10, 5, 0, 24990, 'PUBLISHED', 1),
  ('cp-alvarado-20', 'interplay', 'z-alvarado', 'tech-radio', 'cat-rural', 'Plan Rural 20', 'RURAL-20', '["Navegación familiar","Streaming SD","Redes sociales"]', 20, 10, 0, 34990, 'PUBLISHED', 1),
  ('cp-alvarado-30', 'interplay', 'z-alvarado', 'tech-radio', 'cat-rural', 'Plan Rural 30', 'RURAL-30', '["Streaming HD","Teletrabajo básico","Hasta 6 dispositivos"]', 30, 15, 0, 44990, 'PUBLISHED', 1);

-- ─── PLANES SIERRA - RADIO ─────────────────────────────────────────
INSERT OR REPLACE INTO catalog_plans (id, tenant_id, zone_id, technology_id, category_id, name, code, benefits, download_speed, upload_speed, is_symmetric, price, status, version) VALUES
  ('cp-sierra-10', 'interplay', 'z-sierra', 'tech-radio', 'cat-rural', 'Plan Rural 10', 'RURAL-10', '["Conexión básica","WhatsApp","Correo"]', 10, 5, 0, 24990, 'PUBLISHED', 1),
  ('cp-sierra-20', 'interplay', 'z-sierra', 'tech-radio', 'cat-rural', 'Plan Rural 20', 'RURAL-20', '["Navegación","Redes sociales","Hasta 4 dispositivos"]', 20, 10, 0, 34990, 'PUBLISHED', 1);

-- ─── PLANES IGUACITOS - RADIO ──────────────────────────────────────
INSERT OR REPLACE INTO catalog_plans (id, tenant_id, zone_id, technology_id, category_id, name, code, benefits, download_speed, upload_speed, is_symmetric, price, status, version) VALUES
  ('cp-iguacitos-10', 'interplay', 'z-iguacitos', 'tech-radio', 'cat-rural', 'Plan Rural 10', 'RURAL-10', '["Conexión básica","Mensajería","Correo"]', 10, 5, 0, 24990, 'PUBLISHED', 1),
  ('cp-iguacitos-20', 'interplay', 'z-iguacitos', 'tech-radio', 'cat-rural', 'Plan Rural 20', 'RURAL-20', '["Navegación familiar","Streaming","Redes"]', 20, 10, 0, 34990, 'PUBLISHED', 1);

-- ─── PLANES DELICIAS - RADIO ───────────────────────────────────────
INSERT OR REPLACE INTO catalog_plans (id, tenant_id, zone_id, technology_id, category_id, name, code, benefits, download_speed, upload_speed, is_symmetric, price, status, version) VALUES
  ('cp-delicias-10', 'interplay', 'z-delicias', 'tech-radio', 'cat-rural', 'Plan Rural 10', 'RURAL-10', '["Conexión básica","WhatsApp","Correo"]', 10, 5, 0, 24990, 'PUBLISHED', 1),
  ('cp-delicias-20', 'interplay', 'z-delicias', 'tech-radio', 'cat-rural', 'Plan Rural 20', 'RURAL-20', '["Navegación","Redes sociales","Hasta 4 dispositivos"]', 20, 10, 0, 34990, 'PUBLISHED', 1);

-- Servicios por zona (radio)
INSERT OR REPLACE INTO plan_services (id, tenant_id, plan_id, name, icon) VALUES
  ('ps-radio-ont', 'interplay', 'cp-guayabal-r10', 'Antena radio enlace', '📡'),
  ('ps-radio-router', 'interplay', 'cp-guayabal-r10', 'Router WiFi', '📡');

-- Documentos radio
INSERT OR REPLACE INTO plan_documents (id, tenant_id, plan_id, name, code) VALUES
  ('pd-radio-cc', 'interplay', 'cp-guayabal-r10', 'Copia de cédula', 'CC'),
  ('pd-radio-rp', 'interplay', 'cp-guayabal-r10', 'Fotocopia recibo público', 'RECIBO');

-- Comisiones radio
INSERT OR REPLACE INTO plan_commissions (id, tenant_id, plan_id, type, value, holding_days) VALUES
  ('pc-radio-r10', 'interplay', 'cp-guayabal-r10', 'PERCENTAGE', 8, 15),
  ('pc-radio-r20', 'interplay', 'cp-guayabal-r20', 'PERCENTAGE', 8, 15),
  ('pc-radio-r50', 'interplay', 'cp-guayabal-r50', 'PERCENTAGE', 10, 15);
