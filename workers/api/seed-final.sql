-- Catálogo Oficial INTERPLAY
-- 5 zonas GPON + Zonas Veredales Radio Enlace

DELETE FROM catalog_plans WHERE tenant_id = 'interplay';

-- LERIDA GPON
INSERT INTO catalog_plans (id,tenant_id,zone_id,technology_id,category_id,name,code,description,benefits,download_speed,upload_speed,is_symmetric,price,tax_included,installation_days_min,installation_days_max,support_priority,max_incident_resolution_hours,sla_availability,status,version,published_at,created_at,updated_at,has_tv,tv_label,installation_cost,tv_installation_cost,additional_tv_point,recommended_users,recommended_devices,recommended_use) VALUES
('cp-lerida-100','interplay','z-lerida','tech-gpon','cat-hogar','MegaUltra 100','MU-100','',100,100,1,59990,0,2,3,'NORMAL',24,99.5,'PUBLISHED',1,NULL,0,'TV no incluida',0,30000,10000,NULL,NULL,NULL),
('cp-lerida-150','interplay','z-lerida','tech-gpon','cat-hogar','MegaUltra 150','MU-150','',150,150,1,69990,0,2,3,'NORMAL',24,99.5,'PUBLISHED',1,NULL,1,'Incluye TV Digital HD',0,30000,10000,NULL,NULL,NULL),
('cp-lerida-200','interplay','z-lerida','tech-gpon','cat-hogar','MegaUltra 200','MU-200','',200,200,1,79990,0,2,3,'NORMAL',24,99.5,'PUBLISHED',1,NULL,1,'Incluye TV Digital HD',0,30000,10000,NULL,NULL,NULL),
('cp-lerida-400','interplay','z-lerida','tech-gpon','cat-hogar','MegaUltra 400','MU-400','',400,400,1,99990,0,2,3,'NORMAL',24,99.5,'PUBLISHED',1,NULL,1,'Incluye TV Digital HD',0,30000,10000,NULL,NULL,NULL),
('cp-lerida-800','interplay','z-lerida','tech-gpon','cat-hogar','MegaUltra 800','MU-800','',800,800,1,149990,0,2,3,'NORMAL',24,99.5,'PUBLISHED',1,NULL,1,'Incluye TV Digital HD',0,30000,10000,NULL,NULL,NULL);

-- GUAYABAL GPON
INSERT INTO catalog_plans (id,tenant_id,zone_id,technology_id,category_id,name,code,download_speed,upload_speed,is_symmetric,price,status,version,has_tv,tv_label,installation_cost,tv_installation_cost,additional_tv_point) VALUES
('cp-guayabal-50','interplay','z-guayabal-gpon','tech-gpon','cat-hogar','MegaUltra 50','MU-50',50,50,1,49990,'PUBLISHED',1,1,'Incluye TV Digital HD',0,30000,10000),
('cp-guayabal-100','interplay','z-guayabal-gpon','tech-gpon','cat-hogar','MegaUltra 100','MU-100',100,100,1,59990,'PUBLISHED',1,1,'Incluye TV Digital HD',0,30000,10000),
('cp-guayabal-150','interplay','z-guayabal-gpon','tech-gpon','cat-hogar','MegaUltra 150','MU-150',150,150,1,69990,'PUBLISHED',1,1,'Incluye TV Digital HD',0,30000,10000),
('cp-guayabal-200','interplay','z-guayabal-gpon','tech-gpon','cat-hogar','MegaUltra 200','MU-200',200,200,1,79990,'PUBLISHED',1,1,'Incluye TV Digital HD',0,30000,10000),
('cp-guayabal-400','interplay','z-guayabal-gpon','tech-gpon','cat-hogar','MegaUltra 400','MU-400',400,400,1,99990,'PUBLISHED',1,1,'Incluye TV Digital HD',0,30000,10000);

-- ALVARADO GPON
INSERT INTO catalog_plans (id,tenant_id,zone_id,technology_id,category_id,name,code,download_speed,upload_speed,is_symmetric,price,status,version,has_tv,tv_label,installation_cost,tv_installation_cost,additional_tv_point) VALUES
('cp-alvarado-50','interplay','z-alvarado','tech-gpon','cat-hogar','MegaUltra 50','MU-50',50,50,1,49990,'PUBLISHED',1,0,'TV no incluida',0,30000,10000),
('cp-alvarado-60','interplay','z-alvarado','tech-gpon','cat-hogar','MegaUltra 60','MU-60',60,60,1,59990,'PUBLISHED',1,1,'Incluye TV Digital HD',0,30000,10000),
('cp-alvarado-80','interplay','z-alvarado','tech-gpon','cat-hogar','MegaUltra 80','MU-80',80,80,1,69990,'PUBLISHED',1,1,'Incluye TV Digital HD',0,30000,10000),
('cp-alvarado-100','interplay','z-alvarado','tech-gpon','cat-hogar','MegaUltra 100','MU-100',100,100,1,79990,'PUBLISHED',1,1,'Incluye TV Digital HD',0,30000,10000),
('cp-alvarado-200','interplay','z-alvarado','tech-gpon','cat-hogar','MegaUltra 200','MU-200',200,200,1,99990,'PUBLISHED',1,1,'Incluye TV Digital HD',0,30000,10000),
('cp-alvarado-400','interplay','z-alvarado','tech-gpon','cat-hogar','MegaUltra 400','MU-400',400,400,1,149990,'PUBLISHED',1,1,'Incluye TV Digital HD',0,30000,10000);

-- VENADILLO GPON
INSERT INTO catalog_plans (id,tenant_id,zone_id,technology_id,category_id,name,code,download_speed,upload_speed,is_symmetric,price,status,version,has_tv,tv_label,installation_cost,tv_installation_cost,additional_tv_point) VALUES
('cp-venadillo-60','interplay','z-venadillo','tech-gpon','cat-hogar','MegaUltra 60','MU-60',60,60,1,59990,'PUBLISHED',1,1,'Incluye TV Digital HD',0,30000,10000),
('cp-venadillo-80','interplay','z-venadillo','tech-gpon','cat-hogar','MegaUltra 80','MU-80',80,80,1,69990,'PUBLISHED',1,1,'Incluye TV Digital HD',0,30000,10000),
('cp-venadillo-100','interplay','z-venadillo','tech-gpon','cat-hogar','MegaUltra 100','MU-100',100,100,1,79990,'PUBLISHED',1,1,'Incluye TV Digital HD',0,30000,10000),
('cp-venadillo-200','interplay','z-venadillo','tech-gpon','cat-hogar','MegaUltra 200','MU-200',200,200,1,99990,'PUBLISHED',1,1,'Incluye TV Digital HD',0,30000,10000),
('cp-venadillo-400','interplay','z-venadillo','tech-gpon','cat-hogar','MegaUltra 400','MU-400',400,400,1,149990,'PUBLISHED',1,1,'Incluye TV Digital HD',0,30000,10000),
('cp-venadillo-600','interplay','z-venadillo','tech-gpon','cat-hogar','MegaUltra 600','MU-600',600,600,1,199990,'PUBLISHED',1,1,'Incluye TV Digital HD',0,30000,10000);

-- LA SIERRA - RADIO ENLACE
INSERT INTO catalog_plans (id,tenant_id,zone_id,technology_id,category_id,name,code,download_speed,upload_speed,is_symmetric,price,status,version,has_tv,tv_label,installation_cost) VALUES
('cp-sierra-10','interplay','z-sierra','tech-radio','cat-rural','Plan Rural 10','RURAL-10',10,5,0,59990,'PUBLISHED',1,0,'TV no incluida',79000),
('cp-sierra-15','interplay','z-sierra','tech-radio','cat-rural','Plan Rural 15','RURAL-15',15,7,0,69990,'PUBLISHED',1,0,'TV no incluida',79000),
('cp-sierra-20','interplay','z-sierra','tech-radio','cat-rural','Plan Rural 20','RURAL-20',20,10,0,79990,'PUBLISHED',1,0,'TV no incluida',79000),
('cp-sierra-30','interplay','z-sierra','tech-radio','cat-rural','Plan Rural 30','RURAL-30',30,15,0,99990,'PUBLISHED',1,0,'TV no incluida',79000);

-- DELICIAS - RADIO ENLACE (copy from sierra)
INSERT INTO catalog_plans SELECT 'cp-delicias-10','interplay','z-delicias','tech-radio','cat-rural','Plan Rural 10','RURAL-10',10,5,0,59990,'PUBLISHED',1,0,'TV no incluida',79000,0,0;
INSERT INTO catalog_plans SELECT 'cp-delicias-15','interplay','z-delicias','tech-radio','cat-rural','Plan Rural 15','RURAL-15',15,7,0,69990,'PUBLISHED',1,0,'TV no incluida',79000,0,0;
INSERT INTO catalog_plans SELECT 'cp-delicias-20','interplay','z-delicias','tech-radio','cat-rural','Plan Rural 20','RURAL-20',20,10,0,79990,'PUBLISHED',1,0,'TV no incluida',79000,0,0;
INSERT INTO catalog_plans SELECT 'cp-delicias-30','interplay','z-delicias','tech-radio','cat-rural','Plan Rural 30','RURAL-30',30,15,0,99990,'PUBLISHED',1,0,'TV no incluida',79000,0,0;

-- IGUACITOS (RURAL) - RADIO ENLACE
INSERT INTO catalog_plans SELECT 'cp-iguacitos-10','interplay','z-iguacitos','tech-radio','cat-rural','Plan Rural 10','RURAL-10',10,5,0,59990,'PUBLISHED',1,0,'TV no incluida',79000,0,0;
INSERT INTO catalog_plans SELECT 'cp-iguacitos-15','interplay','z-iguacitos','tech-radio','cat-rural','Plan Rural 15','RURAL-15',15,7,0,69990,'PUBLISHED',1,0,'TV no incluida',79000,0,0;
INSERT INTO catalog_plans SELECT 'cp-iguacitos-20','interplay','z-iguacitos','tech-radio','cat-rural','Plan Rural 20','RURAL-20',20,10,0,79990,'PUBLISHED',1,0,'TV no incluida',79000,0,0;
INSERT INTO catalog_plans SELECT 'cp-iguacitos-30','interplay','z-iguacitos','tech-radio','cat-rural','Plan Rural 30','RURAL-30',30,15,0,99990,'PUBLISHED',1,0,'TV no incluida',79000,0,0;
