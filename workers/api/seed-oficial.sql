-- Catálogo Comercial Oficial INTERPLAY — REF-CFG-003
-- Fresno, Guayabal, Lérida, Alvarado, Venadillo — GPON

-- Limpiar datos demo anteriores
DELETE FROM catalog_plans WHERE tenant_id = 'interplay';
DELETE FROM plan_services WHERE tenant_id = 'interplay';
DELETE FROM plan_equipment WHERE tenant_id = 'interplay';
DELETE FROM plan_documents WHERE tenant_id = 'interplay';
DELETE FROM plan_commissions WHERE tenant_id = 'interplay';

-- ═══════════════════════════════════════════════════════════════════
-- FRESNO — GPON
-- ═══════════════════════════════════════════════════════════════════
INSERT INTO catalog_plans (id, tenant_id, zone_id, technology_id, category_id, name, code, description, benefits, download_speed, upload_speed, is_symmetric, price, installation_days_min, installation_days_max, support_priority, status, version) VALUES
('cp-fresno-50', 'interplay', 'z-fresno', 'tech-gpon', 'cat-hogar', 'MegaUltra 50', 'MU-50', 'Ideal para hogares pequeños, navegación y redes sociales',
'["Internet Ilimitado","Velocidad Simétrica","Router WiFi","Instalación Profesional Sin Costo","Soporte Local INTERPLAY"]', 50, 50, 1, 49990, 2, 3, 'NORMAL', 'PUBLISHED', 1),
('cp-fresno-100', 'interplay', 'z-fresno', 'tech-gpon', 'cat-hogar', 'MegaUltra 100', 'MU-100', 'Ideal para parejas y familias pequeñas con streaming HD',
'["Internet Ilimitado","Velocidad Simétrica","Router WiFi","Instalación Profesional Sin Costo","Soporte Local INTERPLAY"]', 100, 100, 1, 59990, 2, 3, 'NORMAL', 'PUBLISHED', 1),
('cp-fresno-200', 'interplay', 'z-fresno', 'tech-gpon', 'cat-hogar', 'MegaUltra 200', 'MU-200', 'TV Digital HD Gratis. Ideal para familias con streaming 4K',
'["Internet Ilimitado","Velocidad Simétrica","TV Digital HD Gratis","Router WiFi","Instalación Profesional Sin Costo","Soporte Local INTERPLAY"]', 200, 200, 1, 69990, 2, 3, 'NORMAL', 'PUBLISHED', 1),
('cp-fresno-300', 'interplay', 'z-fresno', 'tech-gpon', 'cat-hogar', 'MegaUltra 300', 'MU-300', 'TV Digital HD Gratis. Ideal para hogares grandes y teletrabajo',
'["Internet Ilimitado","Velocidad Simétrica","TV Digital HD Gratis","Router WiFi","Instalación Profesional Sin Costo","Soporte Local INTERPLAY","Soporte Prioritario"]', 300, 300, 1, 79990, 2, 3, 'HIGH', 'PUBLISHED', 1),
('cp-fresno-500', 'interplay', 'z-fresno', 'tech-gpon', 'cat-hogar', 'MegaUltra 500', 'MU-500', 'TV Digital HD Gratis. Ideal para múltiples usuarios y gaming',
'["Internet Ilimitado","Velocidad Simétrica","TV Digital HD Gratis","Router WiFi","Instalación Profesional Sin Costo","Soporte Local INTERPLAY","Soporte VIP"]', 500, 500, 1, 99990, 2, 3, 'HIGH', 'PUBLISHED', 1),
('cp-fresno-600', 'interplay', 'z-fresno', 'tech-gpon', 'cat-hogar', 'MegaUltra 600', 'MU-600', 'TV Digital HD Gratis. Máxima velocidad para hogares exigentes',
'["Internet Ilimitado","Velocidad Simétrica","TV Digital HD Gratis","Router WiFi","Instalación Profesional Sin Costo","Soporte Local INTERPLAY","Soporte VIP","IP Pública Opcional"]', 600, 600, 1, 119990, 2, 3, 'HIGH', 'PUBLISHED', 1);

-- ═══════════════════════════════════════════════════════════════════
-- GUAYABAL — GPON (todos incluyen TV)
-- ═══════════════════════════════════════════════════════════════════
INSERT INTO catalog_plans (id, tenant_id, zone_id, technology_id, category_id, name, code, description, benefits, download_speed, upload_speed, is_symmetric, price, installation_days_min, installation_days_max, status, version) VALUES
('cp-guayabal-50', 'interplay', 'z-guayabal-gpon', 'tech-gpon', 'cat-hogar', 'MegaUltra 50', 'MU-50', 'TV Digital HD Gratis incluida',
'["Internet Ilimitado","Velocidad Simétrica","TV Digital HD Gratis","Router WiFi","Instalación Profesional Sin Costo","Soporte Local INTERPLAY"]', 50, 50, 1, 49990, 2, 3, 'PUBLISHED', 1),
('cp-guayabal-100', 'interplay', 'z-guayabal-gpon', 'tech-gpon', 'cat-hogar', 'MegaUltra 100', 'MU-100', 'TV Digital HD Gratis incluida',
'["Internet Ilimitado","Velocidad Simétrica","TV Digital HD Gratis","Router WiFi","Instalación Profesional Sin Costo","Soporte Local INTERPLAY"]', 100, 100, 1, 59990, 2, 3, 'PUBLISHED', 1),
('cp-guayabal-150', 'interplay', 'z-guayabal-gpon', 'tech-gpon', 'cat-hogar', 'MegaUltra 150', 'MU-150', 'TV Digital HD Gratis incluida',
'["Internet Ilimitado","Velocidad Simétrica","TV Digital HD Gratis","Router WiFi","Instalación Profesional Sin Costo","Soporte Local INTERPLAY"]', 150, 150, 1, 69990, 2, 3, 'PUBLISHED', 1),
('cp-guayabal-200', 'interplay', 'z-guayabal-gpon', 'tech-gpon', 'cat-hogar', 'MegaUltra 200', 'MU-200', 'TV Digital HD Gratis incluida',
'["Internet Ilimitado","Velocidad Simétrica","TV Digital HD Gratis","Router WiFi","Instalación Profesional Sin Costo","Soporte Local INTERPLAY"]', 200, 200, 1, 79990, 2, 3, 'PUBLISHED', 1),
('cp-guayabal-400', 'interplay', 'z-guayabal-gpon', 'tech-gpon', 'cat-hogar', 'MegaUltra 400', 'MU-400', 'TV Digital HD Gratis incluida. Alta velocidad',
'["Internet Ilimitado","Velocidad Simétrica","TV Digital HD Gratis","Router WiFi","Instalación Profesional Sin Costo","Soporte Local INTERPLAY","Soporte Prioritario"]', 400, 400, 1, 99990, 2, 3, 'PUBLISHED', 1);

-- ═══════════════════════════════════════════════════════════════════
-- LERIDA — GPON
-- ═══════════════════════════════════════════════════════════════════
INSERT INTO catalog_plans (id, tenant_id, zone_id, technology_id, category_id, name, code, description, benefits, download_speed, upload_speed, is_symmetric, price, installation_days_min, installation_days_max, status, version) VALUES
('cp-lerida-100', 'interplay', 'z-lerida', 'tech-gpon', 'cat-hogar', 'MegaUltra 100', 'MU-100', 'Ideal para hogares pequeños',
'["Internet Ilimitado","Velocidad Simétrica","Router WiFi","Instalación Profesional Sin Costo","Soporte Local INTERPLAY"]', 100, 100, 1, 59990, 2, 3, 'PUBLISHED', 1),
('cp-lerida-150', 'interplay', 'z-lerida', 'tech-gpon', 'cat-hogar', 'MegaUltra 150', 'MU-150', 'Ideal para parejas con streaming',
'["Internet Ilimitado","Velocidad Simétrica","Router WiFi","Instalación Profesional Sin Costo","Soporte Local INTERPLAY"]', 150, 150, 1, 69990, 2, 3, 'PUBLISHED', 1),
('cp-lerida-200', 'interplay', 'z-lerida', 'tech-gpon', 'cat-hogar', 'MegaUltra 200', 'MU-200', 'TV Digital HD Gratis',
'["Internet Ilimitado","Velocidad Simétrica","TV Digital HD Gratis","Router WiFi","Instalación Profesional Sin Costo","Soporte Local INTERPLAY"]', 200, 200, 1, 79990, 2, 3, 'PUBLISHED', 1),
('cp-lerida-400', 'interplay', 'z-lerida', 'tech-gpon', 'cat-hogar', 'MegaUltra 400', 'MU-400', 'TV Digital HD Gratis. Alta velocidad',
'["Internet Ilimitado","Velocidad Simétrica","TV Digital HD Gratis","Router WiFi","Instalación Profesional Sin Costo","Soporte Local INTERPLAY","Soporte Prioritario"]', 400, 400, 1, 99990, 2, 3, 'PUBLISHED', 1),
('cp-lerida-800', 'interplay', 'z-lerida', 'tech-gpon', 'cat-hogar', 'MegaUltra 800', 'MU-800', 'TV Digital HD Gratis. Velocidad extrema',
'["Internet Ilimitado","Velocidad Simétrica","TV Digital HD Gratis","Router WiFi","Instalación Profesional Sin Costo","Soporte Local INTERPLAY","Soporte VIP","IP Pública Fija"]', 800, 800, 1, 149990, 2, 3, 'PUBLISHED', 1);

-- ═══════════════════════════════════════════════════════════════════
-- ALVARADO — GPON
-- ═══════════════════════════════════════════════════════════════════
INSERT INTO catalog_plans (id, tenant_id, zone_id, technology_id, category_id, name, code, description, benefits, download_speed, upload_speed, is_symmetric, price, installation_days_min, installation_days_max, status, version) VALUES
('cp-alvarado-50', 'interplay', 'z-alvarado', 'tech-gpon', 'cat-hogar', 'MegaUltra 50', 'MU-50', 'Internet esencial',
'["Internet Ilimitado","Velocidad Simétrica","Router WiFi","Instalación Profesional Sin Costo","Soporte Local INTERPLAY"]', 50, 50, 1, 49990, 2, 3, 'PUBLISHED', 1),
('cp-alvarado-60', 'interplay', 'z-alvarado', 'tech-gpon', 'cat-hogar', 'MegaUltra 60', 'MU-60', 'Navegación y redes sociales',
'["Internet Ilimitado","Velocidad Simétrica","Router WiFi","Instalación Profesional Sin Costo","Soporte Local INTERPLAY"]', 60, 60, 1, 59990, 2, 3, 'PUBLISHED', 1),
('cp-alvarado-80', 'interplay', 'z-alvarado', 'tech-gpon', 'cat-hogar', 'MegaUltra 80', 'MU-80', 'Streaming HD',
'["Internet Ilimitado","Velocidad Simétrica","Router WiFi","Instalación Profesional Sin Costo","Soporte Local INTERPLAY"]', 80, 80, 1, 69990, 2, 3, 'PUBLISHED', 1),
('cp-alvarado-100', 'interplay', 'z-alvarado', 'tech-gpon', 'cat-hogar', 'MegaUltra 100', 'MU-100', 'TV Digital HD Gratis',
'["Internet Ilimitado","Velocidad Simétrica","TV Digital HD Gratis","Router WiFi","Instalación Profesional Sin Costo","Soporte Local INTERPLAY"]', 100, 100, 1, 79990, 2, 3, 'PUBLISHED', 1),
('cp-alvarado-200', 'interplay', 'z-alvarado', 'tech-gpon', 'cat-hogar', 'MegaUltra 200', 'MU-200', 'TV Digital HD Gratis',
'["Internet Ilimitado","Velocidad Simétrica","TV Digital HD Gratis","Router WiFi","Instalación Profesional Sin Costo","Soporte Local INTERPLAY","Soporte Prioritario"]', 200, 200, 1, 99990, 2, 3, 'PUBLISHED', 1),
('cp-alvarado-400', 'interplay', 'z-alvarado', 'tech-gpon', 'cat-hogar', 'MegaUltra 400', 'MU-400', 'TV Digital HD Gratis',
'["Internet Ilimitado","Velocidad Simétrica","TV Digital HD Gratis","Router WiFi","Instalación Profesional Sin Costo","Soporte Local INTERPLAY","Soporte VIP"]', 400, 400, 1, 149990, 2, 3, 'PUBLISHED', 1);

-- ═══════════════════════════════════════════════════════════════════
-- VENADILLO — GPON
-- ═══════════════════════════════════════════════════════════════════
INSERT INTO catalog_plans (id, tenant_id, zone_id, technology_id, category_id, name, code, description, benefits, download_speed, upload_speed, is_symmetric, price, installation_days_min, installation_days_max, status, version) VALUES
('cp-venadillo-60', 'interplay', 'z-venadillo', 'tech-gpon', 'cat-hogar', 'MegaUltra 60', 'MU-60', 'Internet esencial',
'["Internet Ilimitado","Velocidad Simétrica","Router WiFi","Instalación Profesional Sin Costo","Soporte Local INTERPLAY"]', 60, 60, 1, 59990, 2, 3, 'PUBLISHED', 1),
('cp-venadillo-80', 'interplay', 'z-venadillo', 'tech-gpon', 'cat-hogar', 'MegaUltra 80', 'MU-80', 'Navegación y streaming',
'["Internet Ilimitado","Velocidad Simétrica","Router WiFi","Instalación Profesional Sin Costo","Soporte Local INTERPLAY"]', 80, 80, 1, 69990, 2, 3, 'PUBLISHED', 1),
('cp-venadillo-100', 'interplay', 'z-venadillo', 'tech-gpon', 'cat-hogar', 'MegaUltra 100', 'MU-100', 'TV Digital HD Gratis',
'["Internet Ilimitado","Velocidad Simétrica","TV Digital HD Gratis","Router WiFi","Instalación Profesional Sin Costo","Soporte Local INTERPLAY"]', 100, 100, 1, 79990, 2, 3, 'PUBLISHED', 1),
('cp-venadillo-200', 'interplay', 'z-venadillo', 'tech-gpon', 'cat-hogar', 'MegaUltra 200', 'MU-200', 'TV Digital HD Gratis',
'["Internet Ilimitado","Velocidad Simétrica","TV Digital HD Gratis","Router WiFi","Instalación Profesional Sin Costo","Soporte Local INTERPLAY","Soporte Prioritario"]', 200, 200, 1, 99990, 2, 3, 'PUBLISHED', 1),
('cp-venadillo-400', 'interplay', 'z-venadillo', 'tech-gpon', 'cat-hogar', 'MegaUltra 400', 'MU-400', 'TV Digital HD Gratis',
'["Internet Ilimitado","Velocidad Simétrica","TV Digital HD Gratis","Router WiFi","Instalación Profesional Sin Costo","Soporte Local INTERPLAY","Soporte Prioritario"]', 400, 400, 1, 149990, 2, 3, 'PUBLISHED', 1),
('cp-venadillo-600', 'interplay', 'z-venadillo', 'tech-gpon', 'cat-hogar', 'MegaUltra 600', 'MU-600', 'TV Digital HD Gratis. Velocidad superior',
'["Internet Ilimitado","Velocidad Simétrica","TV Digital HD Gratis","Router WiFi","Instalación Profesional Sin Costo","Soporte Local INTERPLAY","Soporte VIP"]', 600, 600, 1, 199990, 2, 3, 'PUBLISHED', 1);

-- ═══════════════════════════════════════════════════════════════════
-- COSTOS DE INSTALACIÓN
-- ═══════════════════════════════════════════════════════════════════
INSERT OR REPLACE INTO plan_costs (id, tenant_id, plan_id, installation, equipment, infrastructure, support) SELECT 'cost-' || id, 'interplay', id, 0, 30000, 18000, 4000 FROM catalog_plans WHERE tenant_id = 'interplay';

-- ═══════════════════════════════════════════════════════════════════
-- COMISIONES BASE (10% para todos los planes)
-- ═══════════════════════════════════════════════════════════════════
INSERT INTO plan_commissions (id, tenant_id, plan_id, client_type_id, type, value, holding_days)
SELECT 'pc-' || id || '-res', 'interplay', id, 'ct-residential', 'PERCENTAGE', 10, 15 FROM catalog_plans WHERE tenant_id = 'interplay';

INSERT INTO plan_commissions (id, tenant_id, plan_id, client_type_id, type, value, holding_days)
SELECT 'pc-' || id || '-com', 'interplay', id, 'ct-commercial', 'PERCENTAGE', 8, 15 FROM catalog_plans WHERE tenant_id = 'interplay';
