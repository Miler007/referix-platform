PRAGMA defer_foreign_keys=TRUE;
CREATE TABLE tenants (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  currency TEXT DEFAULT 'MXN',
  timezone TEXT DEFAULT 'America/Mexico_City',
  created_at TEXT DEFAULT (datetime('now'))
);
INSERT INTO "tenants" ("id","name","currency","timezone","created_at") VALUES('demo-tenant','INTERPLAY Demo','MXN','America/Mexico_City','2026-07-09 01:02:27');
INSERT INTO "tenants" ("id","name","currency","timezone","created_at") VALUES('interplay','INTERPLAY','COP','America/Bogota','2026-07-09 01:59:11');
CREATE TABLE users (
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
INSERT INTO "users" ("id","tenant_id","name","email","password","role","active","created_at") VALUES('user-maria','demo-tenant','María García','maria@demo.com','demo123','REFERIDOR',1,'2026-07-09 01:02:27');
INSERT INTO "users" ("id","tenant_id","name","email","password","role","active","created_at") VALUES('user-jose','demo-tenant','José Hernández','jose@demo.com','demo123','REFERIDOR',1,'2026-07-09 01:02:27');
INSERT INTO "users" ("id","tenant_id","name","email","password","role","active","created_at") VALUES('user-ana','demo-tenant','Ana López','ana@demo.com','demo123','SUPERVISOR',1,'2026-07-09 01:02:27');
INSERT INTO "users" ("id","tenant_id","name","email","password","role","active","created_at") VALUES('user-carlos','demo-tenant','Carlos Ruiz','carlos@demo.com','demo123','TECHNICIAN',1,'2026-07-09 01:02:27');
INSERT INTO "users" ("id","tenant_id","name","email","password","role","active","created_at") VALUES('ip-admin','interplay','Admin INTERPLAY','mileribata@gmail.com','eb36d44dd23545db:1120627e638e019acbbc0681a400483473b13e68544051afb7883578d143c91d','ADMIN',1,'2026-07-09 01:59:11');
INSERT INTO "users" ("id","tenant_id","name","email","password","role","active","created_at") VALUES('ip-supervisor','interplay','Supervisor','supervisor@interplay.com','d84e72652bdb43c6:e51ffa64c6f4d9b91fd01a3b9e851d35d522620305143492b5c5978503cf15ae','SUPERVISOR',1,'2026-07-09 01:59:11');
INSERT INTO "users" ("id","tenant_id","name","email","password","role","active","created_at") VALUES('e65f9650-e317-41dd-b096-c4a4a43d5736','interplay','Maira Diaz','lizbethdiaz1909@gmail.com','80952514c28c484b:c4d62a237a0958b58e1e02486730145c8aba14fb581ac8cb58d923ce949e9869','ADVISOR',1,'2026-07-11 03:45:28');
CREATE TABLE persons (
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
INSERT INTO "persons" ("id","tenant_id","full_name","email","phone","address","latitude","longitude","created_at") VALUES('person-admin','interplay','Admin INTERPLAY','admin@interplay.com','3000000000',NULL,NULL,NULL,'2026-07-11 03:09:40');
INSERT INTO "persons" ("id","tenant_id","full_name","email","phone","address","latitude","longitude","created_at") VALUES('ip-admin','interplay','Admin INTERPLAY','admin@interplay.com','3000000000',NULL,NULL,NULL,'2026-07-11 03:10:01');
INSERT INTO "persons" ("id","tenant_id","full_name","email","phone","address","latitude","longitude","created_at") VALUES('ip-supervisor','interplay','Supervisor','supervisor@interplay.com','3000000001',NULL,NULL,NULL,'2026-07-11 03:10:01');
CREATE TABLE referidors (
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
INSERT INTO "referidors" ("id","tenant_id","person_id","status","referral_code","approved_by","approved_at","created_at") VALUES('ref-admin','interplay','person-admin','APPROVED','REF-ADMIN-001',NULL,NULL,'2026-07-11 03:09:49');
INSERT INTO "referidors" ("id","tenant_id","person_id","status","referral_code","approved_by","approved_at","created_at") VALUES('ref-admin-2','interplay','ip-admin','APPROVED','REF-ADMIN-002',NULL,NULL,'2026-07-11 03:10:01');
CREATE TABLE plans (
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
INSERT INTO "plans" ("id","tenant_id","name","price","speed","technology","commission_pct","active","created_at") VALUES('plan-fibra-100','demo-tenant','Fibra 100MB',299,100,'FTTH',15,1,'2026-07-09 01:02:27');
INSERT INTO "plans" ("id","tenant_id","name","price","speed","technology","commission_pct","active","created_at") VALUES('plan-fibra-300','demo-tenant','Fibra 300MB',449,300,'FTTH',15,1,'2026-07-09 01:02:27');
INSERT INTO "plans" ("id","tenant_id","name","price","speed","technology","commission_pct","active","created_at") VALUES('plan-fibra-1g','demo-tenant','Fibra 1GB',699,1000,'FTTH',12,1,'2026-07-09 01:02:27');
INSERT INTO "plans" ("id","tenant_id","name","price","speed","technology","commission_pct","active","created_at") VALUES('plan-fresno-50','interplay','MegaUltra 50',49990,50,'GPON',10,1,'2026-07-09 01:59:11');
INSERT INTO "plans" ("id","tenant_id","name","price","speed","technology","commission_pct","active","created_at") VALUES('plan-fresno-100','interplay','MegaUltra 100',59990,100,'GPON',10,1,'2026-07-09 01:59:11');
INSERT INTO "plans" ("id","tenant_id","name","price","speed","technology","commission_pct","active","created_at") VALUES('plan-fresno-200','interplay','MegaUltra 200',69990,200,'GPON',12,1,'2026-07-09 01:59:11');
INSERT INTO "plans" ("id","tenant_id","name","price","speed","technology","commission_pct","active","created_at") VALUES('plan-guayabal-50','interplay','MegaUltra 50',49990,50,'GPON',10,1,'2026-07-09 01:59:11');
INSERT INTO "plans" ("id","tenant_id","name","price","speed","technology","commission_pct","active","created_at") VALUES('plan-guayabal-100','interplay','MegaUltra 100',59990,100,'GPON',10,1,'2026-07-09 01:59:11');
INSERT INTO "plans" ("id","tenant_id","name","price","speed","technology","commission_pct","active","created_at") VALUES('plan-guayabal-200','interplay','MegaUltra 200',69990,200,'GPON',12,1,'2026-07-09 01:59:11');
INSERT INTO "plans" ("id","tenant_id","name","price","speed","technology","commission_pct","active","created_at") VALUES('plan-guayabal-radio-10','interplay','Plan Radio 10',29990,10,'RADIO',8,1,'2026-07-09 01:59:11');
INSERT INTO "plans" ("id","tenant_id","name","price","speed","technology","commission_pct","active","created_at") VALUES('plan-guayabal-radio-20','interplay','Plan Radio 20',39990,20,'RADIO',8,1,'2026-07-09 01:59:11');
INSERT INTO "plans" ("id","tenant_id","name","price","speed","technology","commission_pct","active","created_at") VALUES('plan-guayabal-radio-50','interplay','Plan Radio 50',49990,50,'RADIO',10,1,'2026-07-09 01:59:11');
INSERT INTO "plans" ("id","tenant_id","name","price","speed","technology","commission_pct","active","created_at") VALUES('plan-lerida-50','interplay','MegaUltra 50',49990,50,'GPON',10,1,'2026-07-09 01:59:11');
INSERT INTO "plans" ("id","tenant_id","name","price","speed","technology","commission_pct","active","created_at") VALUES('plan-lerida-100','interplay','MegaUltra 100',59990,100,'GPON',10,1,'2026-07-09 01:59:11');
INSERT INTO "plans" ("id","tenant_id","name","price","speed","technology","commission_pct","active","created_at") VALUES('plan-lerida-200','interplay','MegaUltra 200',69990,200,'GPON',12,1,'2026-07-09 01:59:11');
INSERT INTO "plans" ("id","tenant_id","name","price","speed","technology","commission_pct","active","created_at") VALUES('plan-venadillo-30','interplay','Plan Básico 30',39990,30,'GPON',8,1,'2026-07-09 01:59:11');
INSERT INTO "plans" ("id","tenant_id","name","price","speed","technology","commission_pct","active","created_at") VALUES('plan-venadillo-50','interplay','MegaUltra 50',49990,50,'GPON',10,1,'2026-07-09 01:59:11');
INSERT INTO "plans" ("id","tenant_id","name","price","speed","technology","commission_pct","active","created_at") VALUES('plan-venadillo-100','interplay','MegaUltra 100',59990,100,'GPON',10,1,'2026-07-09 01:59:11');
INSERT INTO "plans" ("id","tenant_id","name","price","speed","technology","commission_pct","active","created_at") VALUES('plan-alvarado-10','interplay','Plan Rural 10',24990,10,'RADIO',8,1,'2026-07-09 01:59:11');
INSERT INTO "plans" ("id","tenant_id","name","price","speed","technology","commission_pct","active","created_at") VALUES('plan-alvarado-20','interplay','Plan Rural 20',34990,20,'RADIO',8,1,'2026-07-09 01:59:11');
INSERT INTO "plans" ("id","tenant_id","name","price","speed","technology","commission_pct","active","created_at") VALUES('plan-alvarado-30','interplay','Plan Rural 30',44990,30,'RADIO',10,1,'2026-07-09 01:59:11');
INSERT INTO "plans" ("id","tenant_id","name","price","speed","technology","commission_pct","active","created_at") VALUES('plan-sierra-10','interplay','Plan Rural 10',24990,10,'RADIO',8,1,'2026-07-09 01:59:11');
INSERT INTO "plans" ("id","tenant_id","name","price","speed","technology","commission_pct","active","created_at") VALUES('plan-sierra-20','interplay','Plan Rural 20',34990,20,'RADIO',8,1,'2026-07-09 01:59:11');
INSERT INTO "plans" ("id","tenant_id","name","price","speed","technology","commission_pct","active","created_at") VALUES('plan-iguacitos-10','interplay','Plan Rural 10',24990,10,'RADIO',8,1,'2026-07-09 01:59:11');
INSERT INTO "plans" ("id","tenant_id","name","price","speed","technology","commission_pct","active","created_at") VALUES('plan-iguacitos-20','interplay','Plan Rural 20',34990,20,'RADIO',8,1,'2026-07-09 01:59:11');
INSERT INTO "plans" ("id","tenant_id","name","price","speed","technology","commission_pct","active","created_at") VALUES('plan-delicias-10','interplay','Plan Rural 10',24990,10,'RADIO',8,1,'2026-07-09 01:59:11');
INSERT INTO "plans" ("id","tenant_id","name","price","speed","technology","commission_pct","active","created_at") VALUES('plan-delicias-20','interplay','Plan Rural 20',34990,20,'RADIO',8,1,'2026-07-09 01:59:11');
CREATE TABLE referrals (
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
CREATE TABLE coverage_zones (
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
INSERT INTO "coverage_zones" ("id","tenant_id","name","technology","max_speed","install_hours","min_lat","max_lat","min_lng","max_lng","active") VALUES('zone-centro','demo-tenant','Centro','FTTH',1000,48,19.42,19.44,-99.15,-99.13,1);
INSERT INTO "coverage_zones" ("id","tenant_id","name","technology","max_speed","install_hours","min_lat","max_lat","min_lng","max_lng","active") VALUES('zone-norte','demo-tenant','Norte','FTTH',500,72,19.45,19.47,-99.12,-99.1,1);
INSERT INTO "coverage_zones" ("id","tenant_id","name","technology","max_speed","install_hours","min_lat","max_lat","min_lng","max_lng","active") VALUES('zone-sur','demo-tenant','Sur','HFC',300,96,19.38,19.41,-99.1,-99.08,1);
INSERT INTO "coverage_zones" ("id","tenant_id","name","technology","max_speed","install_hours","min_lat","max_lat","min_lng","max_lng","active") VALUES('z-fresno','interplay','Fresno','GPON',200,48,5.15,5.2,-75.1,-75.05,1);
INSERT INTO "coverage_zones" ("id","tenant_id","name","technology","max_speed","install_hours","min_lat","max_lat","min_lng","max_lng","active") VALUES('z-guayabal-gpon','interplay','Guayabal','GPON',200,48,5.05,5.1,-75.08,-75.03,1);
INSERT INTO "coverage_zones" ("id","tenant_id","name","technology","max_speed","install_hours","min_lat","max_lat","min_lng","max_lng","active") VALUES('z-guayabal-radio','interplay','Guayabal','RADIO_LINK',50,72,5.05,5.1,-75.08,-75.03,1);
INSERT INTO "coverage_zones" ("id","tenant_id","name","technology","max_speed","install_hours","min_lat","max_lat","min_lng","max_lng","active") VALUES('z-lerida','interplay','Lérida','GPON',200,48,4.9,4.95,-75,-74.95,1);
INSERT INTO "coverage_zones" ("id","tenant_id","name","technology","max_speed","install_hours","min_lat","max_lat","min_lng","max_lng","active") VALUES('z-venadillo','interplay','Venadillo','GPON',100,48,4.7,4.75,-74.85,-74.8,1);
INSERT INTO "coverage_zones" ("id","tenant_id","name","technology","max_speed","install_hours","min_lat","max_lat","min_lng","max_lng","active") VALUES('z-alvarado','interplay','Alvarado','GPON',30,72,4.55,4.6,-74.7,-74.65,1);
INSERT INTO "coverage_zones" ("id","tenant_id","name","technology","max_speed","install_hours","min_lat","max_lat","min_lng","max_lng","active") VALUES('z-sierra','interplay','La Sierra','RADIO_LINK',20,72,5.2,5.25,-75.15,-75.1,1);
INSERT INTO "coverage_zones" ("id","tenant_id","name","technology","max_speed","install_hours","min_lat","max_lat","min_lng","max_lng","active") VALUES('z-iguacitos','interplay','Iguacitos','RADIO_LINK',20,72,5,5.05,-75,-74.95,1);
INSERT INTO "coverage_zones" ("id","tenant_id","name","technology","max_speed","install_hours","min_lat","max_lat","min_lng","max_lng","active") VALUES('z-delicias','interplay','Delicias','RADIO_LINK',20,72,4.8,4.85,-74.7,-74.65,1);
INSERT INTO "coverage_zones" ("id","tenant_id","name","technology","max_speed","install_hours","min_lat","max_lat","min_lng","max_lng","active") VALUES('z-zelandia','interplay','Zelandia','RADIO_LINK',30,72,0,0,0,0,1);
INSERT INTO "coverage_zones" ("id","tenant_id","name","technology","max_speed","install_hours","min_lat","max_lat","min_lng","max_lng","active") VALUES('z-altodelsol','interplay','Alto del Sol','RADIO_LINK',30,72,0,0,0,0,1);
INSERT INTO "coverage_zones" ("id","tenant_id","name","technology","max_speed","install_hours","min_lat","max_lat","min_lng","max_lng","active") VALUES('z-sanantonio','interplay','San Antonio','RADIO_LINK',30,72,0,0,0,0,1);
CREATE TABLE distribution_boxes (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  zone_id TEXT,
  name TEXT NOT NULL,
  address TEXT,
  total_ports INTEGER DEFAULT 16,
  used_ports INTEGER DEFAULT 0,
  status TEXT DEFAULT 'ACTIVE'
);
INSERT INTO "distribution_boxes" ("id","tenant_id","zone_id","name","address","total_ports","used_ports","status") VALUES('box-ct42','demo-tenant','zone-centro','CT-42','Av. Reforma 123',16,13,'ACTIVE');
INSERT INTO "distribution_boxes" ("id","tenant_id","zone_id","name","address","total_ports","used_ports","status") VALUES('box-ct43','demo-tenant','zone-centro','CT-43','Calle Madero 45',16,8,'ACTIVE');
INSERT INTO "distribution_boxes" ("id","tenant_id","zone_id","name","address","total_ports","used_ports","status") VALUES('box-ct50','demo-tenant','zone-norte','CT-50','Av. Insurgentes 789',8,8,'SATURATED');
INSERT INTO "distribution_boxes" ("id","tenant_id","zone_id","name","address","total_ports","used_ports","status") VALUES('box-ct60','demo-tenant','zone-sur','CT-60','Calle Sur 100',12,6,'ACTIVE');
CREATE TABLE subscriptions (
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
CREATE TABLE installations (
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
CREATE TABLE technicians (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  person_id TEXT,
  name TEXT NOT NULL,
  skills TEXT DEFAULT '["FTTH"]',
  max_daily INTEGER DEFAULT 4,
  vehicle_type TEXT DEFAULT 'CAR',
  active INTEGER DEFAULT 1
);
INSERT INTO "technicians" ("id","tenant_id","person_id","name","skills","max_daily","vehicle_type","active") VALUES('tech-carlos','demo-tenant',NULL,'Carlos Ruiz','["FTTH","HFC"]',4,'MOTORCYCLE',1);
INSERT INTO "technicians" ("id","tenant_id","person_id","name","skills","max_daily","vehicle_type","active") VALUES('tech-ana','demo-tenant',NULL,'Ana López','["FTTH"]',3,'CAR',1);
CREATE TABLE invoices (
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
CREATE TABLE payments (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  invoice_id TEXT,
  amount REAL NOT NULL,
  currency TEXT DEFAULT 'MXN',
  source TEXT DEFAULT 'SELF',
  status TEXT DEFAULT 'PENDING',
  created_at TEXT DEFAULT (datetime('now'))
);
CREATE TABLE commissions (
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
INSERT INTO "commissions" ("id","tenant_id","referral_id","subscription_id","policy_id","base_amount","final_amount","financial_state","operational_state","held_until","paid_at","created_at") VALUES('4b1947c5-71ef-423f-ae01-9c7bd7059982','interplay','test-ref-1',NULL,NULL,34995,34995,'HELD','PENDIENTE_FACTURA','2026-07-15',NULL,'2026-07-11 01:55:03');
CREATE TABLE commission_policies (
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
INSERT INTO "commission_policies" ("id","tenant_id","name","type","value","conditions","priority","holding_days","active") VALUES('pol-estandar','demo-tenant','50% primera factura','PERCENTAGE',50,'{}',1,15,1);
INSERT INTO "commission_policies" ("id","tenant_id","name","type","value","conditions","priority","holding_days","active") VALUES('pol-fibra-1g','demo-tenant','Bono Fibra 1GB','PERCENTAGE',60,'{"planId":"plan-fibra-1g"}',2,15,1);
INSERT INTO "commission_policies" ("id","tenant_id","name","type","value","conditions","priority","holding_days","active") VALUES('pol-rural','demo-tenant','Comisión fija zona rural','FIXED',100,'{"municipality":"Norte"}',3,20,1);
INSERT INTO "commission_policies" ("id","tenant_id","name","type","value","conditions","priority","holding_days","active") VALUES('cp-gpon-10','interplay','10% GPON residencial','PERCENTAGE',10,'{"technology":"GPON","clientType":"HOGAR"}',1,15,1);
INSERT INTO "commission_policies" ("id","tenant_id","name","type","value","conditions","priority","holding_days","active") VALUES('cp-gpon-12','interplay','12% GPON premium','PERCENTAGE',12,'{"technology":"GPON","minPrice":60000}',2,15,1);
INSERT INTO "commission_policies" ("id","tenant_id","name","type","value","conditions","priority","holding_days","active") VALUES('cp-radio-8','interplay','8% Radio Enlace básico','PERCENTAGE',8,'{"technology":"RADIO","maxPrice":35000}',3,15,1);
INSERT INTO "commission_policies" ("id","tenant_id","name","type","value","conditions","priority","holding_days","active") VALUES('cp-radio-10','interplay','10% Radio Enlace premium','PERCENTAGE',10,'{"technology":"RADIO","minPrice":35001}',4,15,1);
CREATE TABLE wallets (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  referrer_person_id TEXT UNIQUE,
  balance REAL DEFAULT 0,
  pending_balance REAL DEFAULT 0,
  total_earned REAL DEFAULT 0,
  total_withdrawn REAL DEFAULT 0,
  currency TEXT DEFAULT 'MXN'
, payout_method TEXT DEFAULT '{}');
INSERT INTO "wallets" ("id","tenant_id","referrer_person_id","balance","pending_balance","total_earned","total_withdrawn","currency","payout_method") VALUES('wallet-maria','demo-tenant','person-maria',2450,890,12340,0,'MXN','{}');
INSERT INTO "wallets" ("id","tenant_id","referrer_person_id","balance","pending_balance","total_earned","total_withdrawn","currency","payout_method") VALUES('wallet-jose','demo-tenant','person-jose',1200,450,5600,0,'MXN','{}');
INSERT INTO "wallets" ("id","tenant_id","referrer_person_id","balance","pending_balance","total_earned","total_withdrawn","currency","payout_method") VALUES('wallet-admin','interplay','person-admin',250000,75000,450000,125000,'MXN','{}');
INSERT INTO "wallets" ("id","tenant_id","referrer_person_id","balance","pending_balance","total_earned","total_withdrawn","currency","payout_method") VALUES('wallet-admin-2','interplay','ip-admin',500000,150000,850000,200000,'MXN','{"method":"NEQUI","phone":"3057125578"}');
CREATE TABLE wallet_transactions (
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
INSERT INTO "wallet_transactions" ("id","wallet_id","type","amount","balance_before","balance_after","description","reference_id","created_at") VALUES('wt-admin-1','wallet-admin','COMMISSION',35000,215000,250000,'Comisión por venta MegaUltra 200',NULL,'2026-07-10 10:30:00');
INSERT INTO "wallet_transactions" ("id","wallet_id","type","amount","balance_before","balance_after","description","reference_id","created_at") VALUES('wt-admin-5','wallet-admin-2','COMMISSION',50000,450000,500000,'Comisión MegaUltra 400 - Pedro Sánchez',NULL,'2026-07-11 08:30:00');
INSERT INTO "wallet_transactions" ("id","wallet_id","type","amount","balance_before","balance_after","description","reference_id","created_at") VALUES('wt-admin-6','wallet-admin-2','COMMISSION',35000,415000,450000,'Comisión MegaUltra 200 - Laura Gómez',NULL,'2026-07-10 14:20:00');
INSERT INTO "wallet_transactions" ("id","wallet_id","type","amount","balance_before","balance_after","description","reference_id","created_at") VALUES('wt-admin-7','wallet-admin-2','COMMISSION',25000,390000,415000,'Comisión MegaUltra 100 - Carlos Ruiz',NULL,'2026-07-09 11:00:00');
INSERT INTO "wallet_transactions" ("id","wallet_id","type","amount","balance_before","balance_after","description","reference_id","created_at") VALUES('wt-admin-8','wallet-admin-2','PAYOUT',-200000,590000,390000,'Retiro a Bancolombia Ahorros',NULL,'2026-07-05 16:00:00');
CREATE TABLE events (
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
INSERT INTO "events" ("id","tenant_id","aggregate_type","aggregate_id","event_name","event_version","payload","actor_id","correlation_id","created_at") VALUES('c04c6319-acaf-42ef-bcd7-e2b05d64e60a','interplay','commission','317a03bf-63b7-4367-95fa-add0a75e5002','COMMISSION_CREATED','1.0.0','{"planName":"MegaUltra 200","clientName":"miler ibata","advisorName":"Carlos","amount":34995}',NULL,NULL,'2026-07-11 01:53:13');
INSERT INTO "events" ("id","tenant_id","aggregate_type","aggregate_id","event_name","event_version","payload","actor_id","correlation_id","created_at") VALUES('4bd8bd5d-1668-413f-8f4b-5a7d99f2fedf','interplay','commission','4b1947c5-71ef-423f-ae01-9c7bd7059982','COMMISSION_CREATED','1.0.0','{"planName":"MegaUltra 200","clientName":"Test Client","advisorName":"Carlos","amount":34995}',NULL,NULL,'2026-07-11 01:55:03');
INSERT INTO "events" ("id","tenant_id","aggregate_type","aggregate_id","event_name","event_version","payload","actor_id","correlation_id","created_at") VALUES('02991923-bdf2-4d2b-b5f5-a44f2c8b60f3','interplay','commission','8be8948c-3f96-458b-ab6d-453cc8a3d948','COMMISSION_CREATED','1.0.0','{"planName":"MegaUltra 100","clientName":"miler ibata","advisorName":"Carlos","amount":29995}',NULL,NULL,'2026-07-11 01:56:40');
INSERT INTO "events" ("id","tenant_id","aggregate_type","aggregate_id","event_name","event_version","payload","actor_id","correlation_id","created_at") VALUES('ee85609f-bcf8-40a3-af6e-9a5735bbaf7e','interplay','commission','9d374c82-448f-4573-9ab6-a8e381979c97','COMMISSION_CREATED','1.0.0','{"planName":"MegaUltra 200","clientName":"miler ibata","advisorName":"Admin INTERPLAY","amount":34995}',NULL,NULL,'2026-07-11 03:28:33');
INSERT INTO "events" ("id","tenant_id","aggregate_type","aggregate_id","event_name","event_version","payload","actor_id","correlation_id","created_at") VALUES('8031da05-2b66-45ab-b59e-59780aacaccc','interplay','commission','d6360c42-6345-46f7-a8cc-adeb75902dab','COMMISSION_CREATED','1.0.0','{"planName":"MegaUltra 200","clientName":"miler ibata","advisorName":"Admin INTERPLAY","amount":34995}',NULL,NULL,'2026-07-11 03:30:16');
INSERT INTO "events" ("id","tenant_id","aggregate_type","aggregate_id","event_name","event_version","payload","actor_id","correlation_id","created_at") VALUES('12820fb8-989c-4f0a-9e8b-a5df741b33dd','interplay','commission','60b12891-9a90-41d3-b427-87e2b6a088a3','COMMISSION_CREATED','1.0.0','{"planName":"MegaUltra 200","clientName":"miler ibata","advisorName":"Admin INTERPLAY","amount":34995}',NULL,NULL,'2026-07-11 03:30:23');
INSERT INTO "events" ("id","tenant_id","aggregate_type","aggregate_id","event_name","event_version","payload","actor_id","correlation_id","created_at") VALUES('bd0e4b1d-e0df-414d-88cd-0d4f46b486e8','interplay','commission','fa82ace1-c049-4b11-bab2-9f2240605e8c','COMMISSION_CREATED','1.0.0','{"planName":"MegaUltra 50","clientName":"Test Sale","advisorName":"Carlos","amount":24995}',NULL,NULL,'2026-07-11 03:31:16');
INSERT INTO "events" ("id","tenant_id","aggregate_type","aggregate_id","event_name","event_version","payload","actor_id","correlation_id","created_at") VALUES('ce74792d-2ef5-4109-bd4b-8528cd48e4cc','interplay','commission','1c6f11b7-10cc-4c04-8d0c-c5d3622beedd','COMMISSION_CREATED','1.0.0','{"planName":"MegaUltra 200","clientName":"miler ibata","advisorName":"Admin INTERPLAY","amount":34995}',NULL,NULL,'2026-07-11 03:34:26');
INSERT INTO "events" ("id","tenant_id","aggregate_type","aggregate_id","event_name","event_version","payload","actor_id","correlation_id","created_at") VALUES('2a9b716d-f957-4d55-9953-4bca2a6d916f','interplay','commission','a36a085c-effb-47a8-90fa-80498586a2c7','COMMISSION_CREATED','1.0.0','{"planName":"MegaUltra 200","clientName":"miler ibata","advisorName":"Admin INTERPLAY","amount":34995}',NULL,NULL,'2026-07-11 03:34:51');
INSERT INTO "events" ("id","tenant_id","aggregate_type","aggregate_id","event_name","event_version","payload","actor_id","correlation_id","created_at") VALUES('23a44e3d-7d1e-4218-8503-d7b35c5f8663','interplay','commission','acf7b0fa-ebdf-41c7-9283-763bab711dd7','COMMISSION_CREATED','1.0.0','{"planName":"MegaUltra 100","clientName":"miler ibata","advisorName":"Admin INTERPLAY","amount":29995}',NULL,NULL,'2026-07-11 03:39:34');
INSERT INTO "events" ("id","tenant_id","aggregate_type","aggregate_id","event_name","event_version","payload","actor_id","correlation_id","created_at") VALUES('a4f2236c-2cef-4bde-acbd-2ad10ea2921b','interplay','commission','f82e89c1-a7d2-49bc-93c0-25bce62570ef','COMMISSION_CREATED','1.0.0','{"planName":"MegaUltra 100","clientName":"miler ibata","advisorName":"Admin INTERPLAY","amount":29995}',NULL,NULL,'2026-07-11 03:42:15');
INSERT INTO "events" ("id","tenant_id","aggregate_type","aggregate_id","event_name","event_version","payload","actor_id","correlation_id","created_at") VALUES('ecdd7582-428f-4606-8fb6-3be489c54b16','interplay','commission','c14ed79a-9481-43f3-990f-250dd2e0254d','COMMISSION_CREATED','1.0.0','{"planName":"MegaUltra 100","clientName":"miler ibata","advisorName":"Admin INTERPLAY","amount":29995}',NULL,NULL,'2026-07-11 03:43:31');
INSERT INTO "events" ("id","tenant_id","aggregate_type","aggregate_id","event_name","event_version","payload","actor_id","correlation_id","created_at") VALUES('1562a3f1-2c4f-4cd5-944a-5d8348bf5048','interplay','commission','b82f058c-0da5-46b9-866a-041167ab4e80','COMMISSION_CREATED','1.0.0','{"planName":"MegaUltra 100","clientName":"Miler ibata","advisorName":"Admin INTERPLAY","amount":29995}',NULL,NULL,'2026-07-11 16:20:55');
CREATE TABLE notification_templates (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  event_name TEXT NOT NULL,
  channel TEXT NOT NULL,
  template TEXT NOT NULL,
  active INTEGER DEFAULT 1
);
CREATE TABLE client_types (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  name TEXT NOT NULL,
  code TEXT NOT NULL,
  tax_rate REAL NOT NULL DEFAULT 0,
  description TEXT,
  active INTEGER DEFAULT 1
);
INSERT INTO "client_types" ("id","tenant_id","name","code","tax_rate","description","active") VALUES('ct-residential','interplay','Residencial','RESIDENTIAL',0,'Hogares - IVA 0%',1);
INSERT INTO "client_types" ("id","tenant_id","name","code","tax_rate","description","active") VALUES('ct-commercial','interplay','Comercial','COMMERCIAL',19,'Locales comerciales - IVA 19%',1);
CREATE TABLE technologies (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  name TEXT NOT NULL,
  code TEXT NOT NULL,
  description TEXT,
  active INTEGER DEFAULT 1
);
INSERT INTO "technologies" ("id","tenant_id","name","code","description","active") VALUES('tech-gpon','interplay','Fibra Óptica GPON','GPON','Internet por fibra óptica',1);
INSERT INTO "technologies" ("id","tenant_id","name","code","description","active") VALUES('tech-radio','interplay','Radio Enlace','RADIO_LINK','Internet por radio enlace',1);
CREATE TABLE commercial_categories (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  name TEXT NOT NULL,
  code TEXT NOT NULL,
  description TEXT,
  active INTEGER DEFAULT 1
);
INSERT INTO "commercial_categories" ("id","tenant_id","name","code","description","active") VALUES('cat-hogar','interplay','Hogar','HOGAR',NULL,1);
INSERT INTO "commercial_categories" ("id","tenant_id","name","code","description","active") VALUES('cat-empresa','interplay','Empresa','EMPRESA',NULL,1);
INSERT INTO "commercial_categories" ("id","tenant_id","name","code","description","active") VALUES('cat-rural','interplay','Rural','RURAL',NULL,1);
INSERT INTO "commercial_categories" ("id","tenant_id","name","code","description","active") VALUES('cat-dedicado','interplay','Internet Dedicado','DEDICADO',NULL,1);
CREATE TABLE catalog_plans (
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
, has_tv INTEGER DEFAULT 0, tv_label TEXT DEFAULT 'TV no incluida', installation_cost INTEGER DEFAULT 0, tv_installation_cost INTEGER DEFAULT 30000, additional_tv_point INTEGER DEFAULT 10000, recommended_users TEXT, recommended_devices TEXT, recommended_use TEXT);
INSERT INTO "catalog_plans" ("id","tenant_id","zone_id","technology_id","category_id","name","code","description","benefits","download_speed","upload_speed","is_symmetric","price","tax_included","installation_days_min","installation_days_max","support_priority","max_incident_resolution_hours","sla_availability","status","version","published_at","created_at","updated_at","has_tv","tv_label","installation_cost","tv_installation_cost","additional_tv_point","recommended_users","recommended_devices","recommended_use") VALUES('cp-lerida-100','interplay','z-lerida','tech-gpon','cat-hogar','MegaUltra 100','MU-100','','[]',100,100,1,59990,0,2,3,'NORMAL',24,99.5,'PUBLISHED',1,NULL,'2026-07-10 01:26:26','2026-07-10 01:26:26',0,'TV no incluida',0,30000,10000,'3-4',NULL,NULL);
INSERT INTO "catalog_plans" ("id","tenant_id","zone_id","technology_id","category_id","name","code","description","benefits","download_speed","upload_speed","is_symmetric","price","tax_included","installation_days_min","installation_days_max","support_priority","max_incident_resolution_hours","sla_availability","status","version","published_at","created_at","updated_at","has_tv","tv_label","installation_cost","tv_installation_cost","additional_tv_point","recommended_users","recommended_devices","recommended_use") VALUES('cp-lerida-150','interplay','z-lerida','tech-gpon','cat-hogar','MegaUltra 150','MU-150','','[]',150,150,1,69990,0,2,3,'NORMAL',24,99.5,'PUBLISHED',1,NULL,'2026-07-10 01:26:26','2026-07-10 01:26:26',1,'Incluye TV Digital HD',0,30000,10000,'4-5',NULL,NULL);
INSERT INTO "catalog_plans" ("id","tenant_id","zone_id","technology_id","category_id","name","code","description","benefits","download_speed","upload_speed","is_symmetric","price","tax_included","installation_days_min","installation_days_max","support_priority","max_incident_resolution_hours","sla_availability","status","version","published_at","created_at","updated_at","has_tv","tv_label","installation_cost","tv_installation_cost","additional_tv_point","recommended_users","recommended_devices","recommended_use") VALUES('cp-lerida-200','interplay','z-lerida','tech-gpon','cat-hogar','MegaUltra 200','MU-200','','[]',200,200,1,79990,0,2,3,'NORMAL',24,99.5,'PUBLISHED',1,NULL,'2026-07-10 01:26:26','2026-07-10 01:26:26',1,'Incluye TV Digital HD',0,30000,10000,'4-6',NULL,NULL);
INSERT INTO "catalog_plans" ("id","tenant_id","zone_id","technology_id","category_id","name","code","description","benefits","download_speed","upload_speed","is_symmetric","price","tax_included","installation_days_min","installation_days_max","support_priority","max_incident_resolution_hours","sla_availability","status","version","published_at","created_at","updated_at","has_tv","tv_label","installation_cost","tv_installation_cost","additional_tv_point","recommended_users","recommended_devices","recommended_use") VALUES('cp-lerida-400','interplay','z-lerida','tech-gpon','cat-hogar','MegaUltra 400','MU-400','','[]',400,400,1,99990,0,2,3,'NORMAL',24,99.5,'PUBLISHED',1,NULL,'2026-07-10 01:26:26','2026-07-10 01:26:26',1,'Incluye TV Digital HD',0,30000,10000,'5-8',NULL,NULL);
INSERT INTO "catalog_plans" ("id","tenant_id","zone_id","technology_id","category_id","name","code","description","benefits","download_speed","upload_speed","is_symmetric","price","tax_included","installation_days_min","installation_days_max","support_priority","max_incident_resolution_hours","sla_availability","status","version","published_at","created_at","updated_at","has_tv","tv_label","installation_cost","tv_installation_cost","additional_tv_point","recommended_users","recommended_devices","recommended_use") VALUES('cp-lerida-800','interplay','z-lerida','tech-gpon','cat-hogar','MegaUltra 800','MU-800','','[]',800,800,1,149990,0,2,3,'NORMAL',24,99.5,'PUBLISHED',1,NULL,'2026-07-10 01:26:26','2026-07-10 01:26:26',1,'Incluye TV Digital HD',0,30000,10000,'8-12',NULL,NULL);
INSERT INTO "catalog_plans" ("id","tenant_id","zone_id","technology_id","category_id","name","code","description","benefits","download_speed","upload_speed","is_symmetric","price","tax_included","installation_days_min","installation_days_max","support_priority","max_incident_resolution_hours","sla_availability","status","version","published_at","created_at","updated_at","has_tv","tv_label","installation_cost","tv_installation_cost","additional_tv_point","recommended_users","recommended_devices","recommended_use") VALUES('cp-guayabal-50','interplay','z-guayabal-gpon','tech-gpon','cat-hogar','MegaUltra 50','MU-50','','[]',50,50,1,49990,0,2,3,'NORMAL',24,99.5,'PUBLISHED',1,NULL,'2026-07-10 01:26:26','2026-07-10 01:26:26',1,'Incluye TV Digital HD',0,30000,10000,'2-3',NULL,NULL);
INSERT INTO "catalog_plans" ("id","tenant_id","zone_id","technology_id","category_id","name","code","description","benefits","download_speed","upload_speed","is_symmetric","price","tax_included","installation_days_min","installation_days_max","support_priority","max_incident_resolution_hours","sla_availability","status","version","published_at","created_at","updated_at","has_tv","tv_label","installation_cost","tv_installation_cost","additional_tv_point","recommended_users","recommended_devices","recommended_use") VALUES('cp-guayabal-100','interplay','z-guayabal-gpon','tech-gpon','cat-hogar','MegaUltra 100','MU-100','','[]',100,100,1,59990,0,2,3,'NORMAL',24,99.5,'PUBLISHED',1,NULL,'2026-07-10 01:26:26','2026-07-10 01:26:26',1,'Incluye TV Digital HD',0,30000,10000,'3-4',NULL,NULL);
INSERT INTO "catalog_plans" ("id","tenant_id","zone_id","technology_id","category_id","name","code","description","benefits","download_speed","upload_speed","is_symmetric","price","tax_included","installation_days_min","installation_days_max","support_priority","max_incident_resolution_hours","sla_availability","status","version","published_at","created_at","updated_at","has_tv","tv_label","installation_cost","tv_installation_cost","additional_tv_point","recommended_users","recommended_devices","recommended_use") VALUES('cp-guayabal-150','interplay','z-guayabal-gpon','tech-gpon','cat-hogar','MegaUltra 150','MU-150','','[]',150,150,1,69990,0,2,3,'NORMAL',24,99.5,'PUBLISHED',1,NULL,'2026-07-10 01:26:26','2026-07-10 01:26:26',1,'Incluye TV Digital HD',0,30000,10000,'4-5',NULL,NULL);
INSERT INTO "catalog_plans" ("id","tenant_id","zone_id","technology_id","category_id","name","code","description","benefits","download_speed","upload_speed","is_symmetric","price","tax_included","installation_days_min","installation_days_max","support_priority","max_incident_resolution_hours","sla_availability","status","version","published_at","created_at","updated_at","has_tv","tv_label","installation_cost","tv_installation_cost","additional_tv_point","recommended_users","recommended_devices","recommended_use") VALUES('cp-guayabal-200','interplay','z-guayabal-gpon','tech-gpon','cat-hogar','MegaUltra 200','MU-200','','[]',200,200,1,79990,0,2,3,'NORMAL',24,99.5,'PUBLISHED',1,NULL,'2026-07-10 01:26:26','2026-07-10 01:26:26',1,'Incluye TV Digital HD',0,30000,10000,'4-6',NULL,NULL);
INSERT INTO "catalog_plans" ("id","tenant_id","zone_id","technology_id","category_id","name","code","description","benefits","download_speed","upload_speed","is_symmetric","price","tax_included","installation_days_min","installation_days_max","support_priority","max_incident_resolution_hours","sla_availability","status","version","published_at","created_at","updated_at","has_tv","tv_label","installation_cost","tv_installation_cost","additional_tv_point","recommended_users","recommended_devices","recommended_use") VALUES('cp-guayabal-400','interplay','z-guayabal-gpon','tech-gpon','cat-hogar','MegaUltra 400','MU-400','','[]',400,400,1,99990,0,2,3,'NORMAL',24,99.5,'PUBLISHED',1,NULL,'2026-07-10 01:26:26','2026-07-10 01:26:26',1,'Incluye TV Digital HD',0,30000,10000,'5-8',NULL,NULL);
INSERT INTO "catalog_plans" ("id","tenant_id","zone_id","technology_id","category_id","name","code","description","benefits","download_speed","upload_speed","is_symmetric","price","tax_included","installation_days_min","installation_days_max","support_priority","max_incident_resolution_hours","sla_availability","status","version","published_at","created_at","updated_at","has_tv","tv_label","installation_cost","tv_installation_cost","additional_tv_point","recommended_users","recommended_devices","recommended_use") VALUES('cp-alvarado-50','interplay','z-alvarado','tech-gpon','cat-hogar','MegaUltra 50','MU-50','','[]',50,50,1,49990,0,2,3,'NORMAL',24,99.5,'PUBLISHED',1,NULL,'2026-07-10 01:26:26','2026-07-10 01:26:26',0,'TV no incluida',0,30000,10000,'2-3',NULL,NULL);
INSERT INTO "catalog_plans" ("id","tenant_id","zone_id","technology_id","category_id","name","code","description","benefits","download_speed","upload_speed","is_symmetric","price","tax_included","installation_days_min","installation_days_max","support_priority","max_incident_resolution_hours","sla_availability","status","version","published_at","created_at","updated_at","has_tv","tv_label","installation_cost","tv_installation_cost","additional_tv_point","recommended_users","recommended_devices","recommended_use") VALUES('cp-alvarado-60','interplay','z-alvarado','tech-gpon','cat-hogar','MegaUltra 60','MU-60','','[]',60,60,1,59990,0,2,3,'NORMAL',24,99.5,'PUBLISHED',1,NULL,'2026-07-10 01:26:26','2026-07-10 01:26:26',1,'Incluye TV Digital HD',0,30000,10000,'2-3',NULL,NULL);
INSERT INTO "catalog_plans" ("id","tenant_id","zone_id","technology_id","category_id","name","code","description","benefits","download_speed","upload_speed","is_symmetric","price","tax_included","installation_days_min","installation_days_max","support_priority","max_incident_resolution_hours","sla_availability","status","version","published_at","created_at","updated_at","has_tv","tv_label","installation_cost","tv_installation_cost","additional_tv_point","recommended_users","recommended_devices","recommended_use") VALUES('cp-alvarado-80','interplay','z-alvarado','tech-gpon','cat-hogar','MegaUltra 80','MU-80','','[]',80,80,1,69990,0,2,3,'NORMAL',24,99.5,'PUBLISHED',1,NULL,'2026-07-10 01:26:26','2026-07-10 01:26:26',1,'Incluye TV Digital HD',0,30000,10000,'3-4',NULL,NULL);
INSERT INTO "catalog_plans" ("id","tenant_id","zone_id","technology_id","category_id","name","code","description","benefits","download_speed","upload_speed","is_symmetric","price","tax_included","installation_days_min","installation_days_max","support_priority","max_incident_resolution_hours","sla_availability","status","version","published_at","created_at","updated_at","has_tv","tv_label","installation_cost","tv_installation_cost","additional_tv_point","recommended_users","recommended_devices","recommended_use") VALUES('cp-alvarado-100','interplay','z-alvarado','tech-gpon','cat-hogar','MegaUltra 100','MU-100','','[]',100,100,1,79990,0,2,3,'NORMAL',24,99.5,'PUBLISHED',1,NULL,'2026-07-10 01:26:26','2026-07-10 01:26:26',1,'Incluye TV Digital HD',0,30000,10000,'3-4',NULL,NULL);
INSERT INTO "catalog_plans" ("id","tenant_id","zone_id","technology_id","category_id","name","code","description","benefits","download_speed","upload_speed","is_symmetric","price","tax_included","installation_days_min","installation_days_max","support_priority","max_incident_resolution_hours","sla_availability","status","version","published_at","created_at","updated_at","has_tv","tv_label","installation_cost","tv_installation_cost","additional_tv_point","recommended_users","recommended_devices","recommended_use") VALUES('cp-alvarado-200','interplay','z-alvarado','tech-gpon','cat-hogar','MegaUltra 200','MU-200','','[]',200,200,1,99990,0,2,3,'NORMAL',24,99.5,'PUBLISHED',1,NULL,'2026-07-10 01:26:26','2026-07-10 01:26:26',1,'Incluye TV Digital HD',0,30000,10000,'4-6',NULL,NULL);
INSERT INTO "catalog_plans" ("id","tenant_id","zone_id","technology_id","category_id","name","code","description","benefits","download_speed","upload_speed","is_symmetric","price","tax_included","installation_days_min","installation_days_max","support_priority","max_incident_resolution_hours","sla_availability","status","version","published_at","created_at","updated_at","has_tv","tv_label","installation_cost","tv_installation_cost","additional_tv_point","recommended_users","recommended_devices","recommended_use") VALUES('cp-alvarado-400','interplay','z-alvarado','tech-gpon','cat-hogar','MegaUltra 400','MU-400','','[]',400,400,1,149990,0,2,3,'NORMAL',24,99.5,'PUBLISHED',1,NULL,'2026-07-10 01:26:26','2026-07-10 01:26:26',1,'Incluye TV Digital HD',0,30000,10000,'5-8',NULL,NULL);
INSERT INTO "catalog_plans" ("id","tenant_id","zone_id","technology_id","category_id","name","code","description","benefits","download_speed","upload_speed","is_symmetric","price","tax_included","installation_days_min","installation_days_max","support_priority","max_incident_resolution_hours","sla_availability","status","version","published_at","created_at","updated_at","has_tv","tv_label","installation_cost","tv_installation_cost","additional_tv_point","recommended_users","recommended_devices","recommended_use") VALUES('cp-venadillo-60','interplay','z-venadillo','tech-gpon','cat-hogar','MegaUltra 60','MU-60','','[]',60,60,1,59990,0,2,3,'NORMAL',24,99.5,'PUBLISHED',1,NULL,'2026-07-10 01:26:26','2026-07-10 01:26:26',1,'Incluye TV Digital HD',0,30000,10000,'2-3',NULL,NULL);
INSERT INTO "catalog_plans" ("id","tenant_id","zone_id","technology_id","category_id","name","code","description","benefits","download_speed","upload_speed","is_symmetric","price","tax_included","installation_days_min","installation_days_max","support_priority","max_incident_resolution_hours","sla_availability","status","version","published_at","created_at","updated_at","has_tv","tv_label","installation_cost","tv_installation_cost","additional_tv_point","recommended_users","recommended_devices","recommended_use") VALUES('cp-venadillo-80','interplay','z-venadillo','tech-gpon','cat-hogar','MegaUltra 80','MU-80','','[]',80,80,1,69990,0,2,3,'NORMAL',24,99.5,'PUBLISHED',1,NULL,'2026-07-10 01:26:26','2026-07-10 01:26:26',1,'Incluye TV Digital HD',0,30000,10000,'3-4',NULL,NULL);
INSERT INTO "catalog_plans" ("id","tenant_id","zone_id","technology_id","category_id","name","code","description","benefits","download_speed","upload_speed","is_symmetric","price","tax_included","installation_days_min","installation_days_max","support_priority","max_incident_resolution_hours","sla_availability","status","version","published_at","created_at","updated_at","has_tv","tv_label","installation_cost","tv_installation_cost","additional_tv_point","recommended_users","recommended_devices","recommended_use") VALUES('cp-venadillo-100','interplay','z-venadillo','tech-gpon','cat-hogar','MegaUltra 100','MU-100','','[]',100,100,1,79990,0,2,3,'NORMAL',24,99.5,'PUBLISHED',1,NULL,'2026-07-10 01:26:26','2026-07-10 01:26:26',1,'Incluye TV Digital HD',0,30000,10000,'3-4',NULL,NULL);
INSERT INTO "catalog_plans" ("id","tenant_id","zone_id","technology_id","category_id","name","code","description","benefits","download_speed","upload_speed","is_symmetric","price","tax_included","installation_days_min","installation_days_max","support_priority","max_incident_resolution_hours","sla_availability","status","version","published_at","created_at","updated_at","has_tv","tv_label","installation_cost","tv_installation_cost","additional_tv_point","recommended_users","recommended_devices","recommended_use") VALUES('cp-venadillo-200','interplay','z-venadillo','tech-gpon','cat-hogar','MegaUltra 200','MU-200','','[]',200,200,1,99990,0,2,3,'NORMAL',24,99.5,'PUBLISHED',1,NULL,'2026-07-10 01:26:26','2026-07-10 01:26:26',1,'Incluye TV Digital HD',0,30000,10000,'4-6',NULL,NULL);
INSERT INTO "catalog_plans" ("id","tenant_id","zone_id","technology_id","category_id","name","code","description","benefits","download_speed","upload_speed","is_symmetric","price","tax_included","installation_days_min","installation_days_max","support_priority","max_incident_resolution_hours","sla_availability","status","version","published_at","created_at","updated_at","has_tv","tv_label","installation_cost","tv_installation_cost","additional_tv_point","recommended_users","recommended_devices","recommended_use") VALUES('cp-venadillo-400','interplay','z-venadillo','tech-gpon','cat-hogar','MegaUltra 400','MU-400','','[]',400,400,1,149990,0,2,3,'NORMAL',24,99.5,'PUBLISHED',1,NULL,'2026-07-10 01:26:26','2026-07-10 01:26:26',1,'Incluye TV Digital HD',0,30000,10000,'5-8',NULL,NULL);
INSERT INTO "catalog_plans" ("id","tenant_id","zone_id","technology_id","category_id","name","code","description","benefits","download_speed","upload_speed","is_symmetric","price","tax_included","installation_days_min","installation_days_max","support_priority","max_incident_resolution_hours","sla_availability","status","version","published_at","created_at","updated_at","has_tv","tv_label","installation_cost","tv_installation_cost","additional_tv_point","recommended_users","recommended_devices","recommended_use") VALUES('cp-venadillo-600','interplay','z-venadillo','tech-gpon','cat-hogar','MegaUltra 600','MU-600','','[]',600,600,1,199990,0,2,3,'NORMAL',24,99.5,'PUBLISHED',1,NULL,'2026-07-10 01:26:26','2026-07-10 01:26:26',1,'Incluye TV Digital HD',0,30000,10000,'6-10',NULL,NULL);
INSERT INTO "catalog_plans" ("id","tenant_id","zone_id","technology_id","category_id","name","code","description","benefits","download_speed","upload_speed","is_symmetric","price","tax_included","installation_days_min","installation_days_max","support_priority","max_incident_resolution_hours","sla_availability","status","version","published_at","created_at","updated_at","has_tv","tv_label","installation_cost","tv_installation_cost","additional_tv_point","recommended_users","recommended_devices","recommended_use") VALUES('cp-sierra-10','interplay','z-sierra','tech-radio','cat-rural','MegaUltra 10','MU-10','','[]',10,5,0,59990,0,2,3,'NORMAL',24,99.5,'PUBLISHED',1,NULL,'2026-07-10 01:26:26','2026-07-10 01:26:26',0,'TV no incluida',99990,0,0,'1-2',NULL,NULL);
INSERT INTO "catalog_plans" ("id","tenant_id","zone_id","technology_id","category_id","name","code","description","benefits","download_speed","upload_speed","is_symmetric","price","tax_included","installation_days_min","installation_days_max","support_priority","max_incident_resolution_hours","sla_availability","status","version","published_at","created_at","updated_at","has_tv","tv_label","installation_cost","tv_installation_cost","additional_tv_point","recommended_users","recommended_devices","recommended_use") VALUES('cp-sierra-15','interplay','z-sierra','tech-radio','cat-rural','MegaUltra 15','MU-15','','[]',15,7,0,69990,0,2,3,'NORMAL',24,99.5,'PUBLISHED',1,NULL,'2026-07-10 01:26:26','2026-07-10 01:26:26',0,'TV no incluida',99990,0,0,'1-2',NULL,NULL);
INSERT INTO "catalog_plans" ("id","tenant_id","zone_id","technology_id","category_id","name","code","description","benefits","download_speed","upload_speed","is_symmetric","price","tax_included","installation_days_min","installation_days_max","support_priority","max_incident_resolution_hours","sla_availability","status","version","published_at","created_at","updated_at","has_tv","tv_label","installation_cost","tv_installation_cost","additional_tv_point","recommended_users","recommended_devices","recommended_use") VALUES('cp-sierra-20','interplay','z-sierra','tech-radio','cat-rural','MegaUltra 20','MU-20','','[]',20,10,0,79990,0,2,3,'NORMAL',24,99.5,'PUBLISHED',1,NULL,'2026-07-10 01:26:26','2026-07-10 01:26:26',0,'TV no incluida',99990,0,0,'2-3',NULL,NULL);
INSERT INTO "catalog_plans" ("id","tenant_id","zone_id","technology_id","category_id","name","code","description","benefits","download_speed","upload_speed","is_symmetric","price","tax_included","installation_days_min","installation_days_max","support_priority","max_incident_resolution_hours","sla_availability","status","version","published_at","created_at","updated_at","has_tv","tv_label","installation_cost","tv_installation_cost","additional_tv_point","recommended_users","recommended_devices","recommended_use") VALUES('cp-sierra-30','interplay','z-sierra','tech-radio','cat-rural','MegaUltra 30','MU-30','','[]',30,15,0,99990,0,2,3,'NORMAL',24,99.5,'PUBLISHED',1,NULL,'2026-07-10 01:26:26','2026-07-10 01:26:26',0,'TV no incluida',99990,0,0,'2-3',NULL,NULL);
INSERT INTO "catalog_plans" ("id","tenant_id","zone_id","technology_id","category_id","name","code","description","benefits","download_speed","upload_speed","is_symmetric","price","tax_included","installation_days_min","installation_days_max","support_priority","max_incident_resolution_hours","sla_availability","status","version","published_at","created_at","updated_at","has_tv","tv_label","installation_cost","tv_installation_cost","additional_tv_point","recommended_users","recommended_devices","recommended_use") VALUES('cp-delicias-10','interplay','z-delicias','tech-radio','cat-rural','MegaUltra 10','MU-10','','[]',10,5,0,59990,0,2,3,'NORMAL',24,99.5,'PUBLISHED',1,NULL,'2026-07-10 01:26:26','2026-07-10 01:26:26',0,'TV no incluida',79990,0,0,'1-2',NULL,NULL);
INSERT INTO "catalog_plans" ("id","tenant_id","zone_id","technology_id","category_id","name","code","description","benefits","download_speed","upload_speed","is_symmetric","price","tax_included","installation_days_min","installation_days_max","support_priority","max_incident_resolution_hours","sla_availability","status","version","published_at","created_at","updated_at","has_tv","tv_label","installation_cost","tv_installation_cost","additional_tv_point","recommended_users","recommended_devices","recommended_use") VALUES('cp-delicias-15','interplay','z-delicias','tech-radio','cat-rural','MegaUltra 15','MU-15','','[]',15,7,0,69990,0,2,3,'NORMAL',24,99.5,'PUBLISHED',1,NULL,'2026-07-10 01:26:26','2026-07-10 01:26:26',0,'TV no incluida',79990,0,0,'1-2',NULL,NULL);
INSERT INTO "catalog_plans" ("id","tenant_id","zone_id","technology_id","category_id","name","code","description","benefits","download_speed","upload_speed","is_symmetric","price","tax_included","installation_days_min","installation_days_max","support_priority","max_incident_resolution_hours","sla_availability","status","version","published_at","created_at","updated_at","has_tv","tv_label","installation_cost","tv_installation_cost","additional_tv_point","recommended_users","recommended_devices","recommended_use") VALUES('cp-delicias-20','interplay','z-delicias','tech-radio','cat-rural','MegaUltra 20','MU-20','','[]',20,10,0,79990,0,2,3,'NORMAL',24,99.5,'PUBLISHED',1,NULL,'2026-07-10 01:26:26','2026-07-10 01:26:26',0,'TV no incluida',79990,0,0,'2-3',NULL,NULL);
INSERT INTO "catalog_plans" ("id","tenant_id","zone_id","technology_id","category_id","name","code","description","benefits","download_speed","upload_speed","is_symmetric","price","tax_included","installation_days_min","installation_days_max","support_priority","max_incident_resolution_hours","sla_availability","status","version","published_at","created_at","updated_at","has_tv","tv_label","installation_cost","tv_installation_cost","additional_tv_point","recommended_users","recommended_devices","recommended_use") VALUES('cp-delicias-30','interplay','z-delicias','tech-radio','cat-rural','MegaUltra 30','MU-30','','[]',30,15,0,99990,0,2,3,'NORMAL',24,99.5,'PUBLISHED',1,NULL,'2026-07-10 01:26:26','2026-07-10 01:26:26',0,'TV no incluida',79990,0,0,'2-3',NULL,NULL);
INSERT INTO "catalog_plans" ("id","tenant_id","zone_id","technology_id","category_id","name","code","description","benefits","download_speed","upload_speed","is_symmetric","price","tax_included","installation_days_min","installation_days_max","support_priority","max_incident_resolution_hours","sla_availability","status","version","published_at","created_at","updated_at","has_tv","tv_label","installation_cost","tv_installation_cost","additional_tv_point","recommended_users","recommended_devices","recommended_use") VALUES('cp-iguacitos-10','interplay','z-iguacitos','tech-radio','cat-rural','MegaUltra 10','MU-10','','[]',10,5,0,59990,0,2,3,'NORMAL',24,99.5,'PUBLISHED',1,NULL,'2026-07-10 01:26:26','2026-07-10 01:26:26',0,'TV no incluida',79990,0,0,'1-2',NULL,NULL);
INSERT INTO "catalog_plans" ("id","tenant_id","zone_id","technology_id","category_id","name","code","description","benefits","download_speed","upload_speed","is_symmetric","price","tax_included","installation_days_min","installation_days_max","support_priority","max_incident_resolution_hours","sla_availability","status","version","published_at","created_at","updated_at","has_tv","tv_label","installation_cost","tv_installation_cost","additional_tv_point","recommended_users","recommended_devices","recommended_use") VALUES('cp-iguacitos-15','interplay','z-iguacitos','tech-radio','cat-rural','MegaUltra 15','MU-15','','[]',15,7,0,69990,0,2,3,'NORMAL',24,99.5,'PUBLISHED',1,NULL,'2026-07-10 01:26:26','2026-07-10 01:26:26',0,'TV no incluida',79990,0,0,'1-2',NULL,NULL);
INSERT INTO "catalog_plans" ("id","tenant_id","zone_id","technology_id","category_id","name","code","description","benefits","download_speed","upload_speed","is_symmetric","price","tax_included","installation_days_min","installation_days_max","support_priority","max_incident_resolution_hours","sla_availability","status","version","published_at","created_at","updated_at","has_tv","tv_label","installation_cost","tv_installation_cost","additional_tv_point","recommended_users","recommended_devices","recommended_use") VALUES('cp-iguacitos-20','interplay','z-iguacitos','tech-radio','cat-rural','MegaUltra 20','MU-20','','[]',20,10,0,79990,0,2,3,'NORMAL',24,99.5,'PUBLISHED',1,NULL,'2026-07-10 01:26:26','2026-07-10 01:26:26',0,'TV no incluida',79990,0,0,'2-3',NULL,NULL);
INSERT INTO "catalog_plans" ("id","tenant_id","zone_id","technology_id","category_id","name","code","description","benefits","download_speed","upload_speed","is_symmetric","price","tax_included","installation_days_min","installation_days_max","support_priority","max_incident_resolution_hours","sla_availability","status","version","published_at","created_at","updated_at","has_tv","tv_label","installation_cost","tv_installation_cost","additional_tv_point","recommended_users","recommended_devices","recommended_use") VALUES('cp-iguacitos-30','interplay','z-iguacitos','tech-radio','cat-rural','MegaUltra 30','MU-30','','[]',30,15,0,99990,0,2,3,'NORMAL',24,99.5,'PUBLISHED',1,NULL,'2026-07-10 01:26:26','2026-07-10 01:26:26',0,'TV no incluida',79990,0,0,'2-3',NULL,NULL);
INSERT INTO "catalog_plans" ("id","tenant_id","zone_id","technology_id","category_id","name","code","description","benefits","download_speed","upload_speed","is_symmetric","price","tax_included","installation_days_min","installation_days_max","support_priority","max_incident_resolution_hours","sla_availability","status","version","published_at","created_at","updated_at","has_tv","tv_label","installation_cost","tv_installation_cost","additional_tv_point","recommended_users","recommended_devices","recommended_use") VALUES('cp-fresno-50','interplay','z-fresno','tech-gpon','cat-hogar','MegaUltra 50','MU-50','','[]',50,50,1,49990,0,2,3,'NORMAL',24,99.5,'PUBLISHED',1,NULL,'2026-07-11 00:24:13','2026-07-11 00:24:13',0,'TV no incluida',0,30000,10000,'2-3',NULL,NULL);
INSERT INTO "catalog_plans" ("id","tenant_id","zone_id","technology_id","category_id","name","code","description","benefits","download_speed","upload_speed","is_symmetric","price","tax_included","installation_days_min","installation_days_max","support_priority","max_incident_resolution_hours","sla_availability","status","version","published_at","created_at","updated_at","has_tv","tv_label","installation_cost","tv_installation_cost","additional_tv_point","recommended_users","recommended_devices","recommended_use") VALUES('cp-fresno-100','interplay','z-fresno','tech-gpon','cat-hogar','MegaUltra 100','MU-100','','[]',100,100,1,59990,0,2,3,'NORMAL',24,99.5,'PUBLISHED',1,NULL,'2026-07-11 00:24:13','2026-07-11 00:24:13',0,'TV no incluida',0,30000,10000,'3-4',NULL,NULL);
INSERT INTO "catalog_plans" ("id","tenant_id","zone_id","technology_id","category_id","name","code","description","benefits","download_speed","upload_speed","is_symmetric","price","tax_included","installation_days_min","installation_days_max","support_priority","max_incident_resolution_hours","sla_availability","status","version","published_at","created_at","updated_at","has_tv","tv_label","installation_cost","tv_installation_cost","additional_tv_point","recommended_users","recommended_devices","recommended_use") VALUES('cp-fresno-200','interplay','z-fresno','tech-gpon','cat-hogar','MegaUltra 200','MU-200','','[]',200,200,1,69990,0,2,3,'NORMAL',24,99.5,'PUBLISHED',1,NULL,'2026-07-11 00:24:13','2026-07-11 00:24:13',1,'Incluye TV Digital HD - Cosmos TV',0,30000,10000,'4-6',NULL,NULL);
INSERT INTO "catalog_plans" ("id","tenant_id","zone_id","technology_id","category_id","name","code","description","benefits","download_speed","upload_speed","is_symmetric","price","tax_included","installation_days_min","installation_days_max","support_priority","max_incident_resolution_hours","sla_availability","status","version","published_at","created_at","updated_at","has_tv","tv_label","installation_cost","tv_installation_cost","additional_tv_point","recommended_users","recommended_devices","recommended_use") VALUES('cp-fresno-300','interplay','z-fresno','tech-gpon','cat-hogar','MegaUltra 300','MU-300','','[]',300,300,1,79990,0,2,3,'NORMAL',24,99.5,'PUBLISHED',1,NULL,'2026-07-11 00:24:13','2026-07-11 00:24:13',1,'Incluye TV Digital HD - Cosmos TV',0,30000,10000,'5-7',NULL,NULL);
INSERT INTO "catalog_plans" ("id","tenant_id","zone_id","technology_id","category_id","name","code","description","benefits","download_speed","upload_speed","is_symmetric","price","tax_included","installation_days_min","installation_days_max","support_priority","max_incident_resolution_hours","sla_availability","status","version","published_at","created_at","updated_at","has_tv","tv_label","installation_cost","tv_installation_cost","additional_tv_point","recommended_users","recommended_devices","recommended_use") VALUES('cp-fresno-500','interplay','z-fresno','tech-gpon','cat-hogar','MegaUltra 500','MU-500','','[]',500,500,1,99990,0,2,3,'NORMAL',24,99.5,'PUBLISHED',1,NULL,'2026-07-11 00:24:13','2026-07-11 00:24:13',1,'Incluye TV Digital HD - Cosmos TV',0,30000,10000,'6-8',NULL,NULL);
INSERT INTO "catalog_plans" ("id","tenant_id","zone_id","technology_id","category_id","name","code","description","benefits","download_speed","upload_speed","is_symmetric","price","tax_included","installation_days_min","installation_days_max","support_priority","max_incident_resolution_hours","sla_availability","status","version","published_at","created_at","updated_at","has_tv","tv_label","installation_cost","tv_installation_cost","additional_tv_point","recommended_users","recommended_devices","recommended_use") VALUES('cp-fresno-600','interplay','z-fresno','tech-gpon','cat-hogar','MegaUltra 600','MU-600','','[]',600,600,1,119990,0,2,3,'NORMAL',24,99.5,'PUBLISHED',1,NULL,'2026-07-11 00:24:13','2026-07-11 00:24:13',1,'Incluye TV Digital HD - Cosmos TV',0,30000,10000,'6-10',NULL,NULL);
INSERT INTO "catalog_plans" ("id","tenant_id","zone_id","technology_id","category_id","name","code","description","benefits","download_speed","upload_speed","is_symmetric","price","tax_included","installation_days_min","installation_days_max","support_priority","max_incident_resolution_hours","sla_availability","status","version","published_at","created_at","updated_at","has_tv","tv_label","installation_cost","tv_installation_cost","additional_tv_point","recommended_users","recommended_devices","recommended_use") VALUES('cp-zelandia-10','interplay','z-zelandia','tech-radio','cat-rural','MegaUltra 10','MU-10','','[]',10,5,0,59990,0,2,3,'NORMAL',24,99.5,'PUBLISHED',1,NULL,'2026-07-11 00:56:58','2026-07-11 00:56:58',0,'TV no incluida',79990,0,0,'1-2',NULL,NULL);
INSERT INTO "catalog_plans" ("id","tenant_id","zone_id","technology_id","category_id","name","code","description","benefits","download_speed","upload_speed","is_symmetric","price","tax_included","installation_days_min","installation_days_max","support_priority","max_incident_resolution_hours","sla_availability","status","version","published_at","created_at","updated_at","has_tv","tv_label","installation_cost","tv_installation_cost","additional_tv_point","recommended_users","recommended_devices","recommended_use") VALUES('cp-zelandia-15','interplay','z-zelandia','tech-radio','cat-rural','MegaUltra 15','MU-15','','[]',15,7,0,69990,0,2,3,'NORMAL',24,99.5,'PUBLISHED',1,NULL,'2026-07-11 00:56:58','2026-07-11 00:56:58',0,'TV no incluida',79990,0,0,'1-2',NULL,NULL);
INSERT INTO "catalog_plans" ("id","tenant_id","zone_id","technology_id","category_id","name","code","description","benefits","download_speed","upload_speed","is_symmetric","price","tax_included","installation_days_min","installation_days_max","support_priority","max_incident_resolution_hours","sla_availability","status","version","published_at","created_at","updated_at","has_tv","tv_label","installation_cost","tv_installation_cost","additional_tv_point","recommended_users","recommended_devices","recommended_use") VALUES('cp-zelandia-20','interplay','z-zelandia','tech-radio','cat-rural','MegaUltra 20','MU-20','','[]',20,10,0,79990,0,2,3,'NORMAL',24,99.5,'PUBLISHED',1,NULL,'2026-07-11 00:56:58','2026-07-11 00:56:58',0,'TV no incluida',79990,0,0,'2-3',NULL,NULL);
INSERT INTO "catalog_plans" ("id","tenant_id","zone_id","technology_id","category_id","name","code","description","benefits","download_speed","upload_speed","is_symmetric","price","tax_included","installation_days_min","installation_days_max","support_priority","max_incident_resolution_hours","sla_availability","status","version","published_at","created_at","updated_at","has_tv","tv_label","installation_cost","tv_installation_cost","additional_tv_point","recommended_users","recommended_devices","recommended_use") VALUES('cp-zelandia-30','interplay','z-zelandia','tech-radio','cat-rural','MegaUltra 30','MU-30','','[]',30,15,0,99990,0,2,3,'NORMAL',24,99.5,'PUBLISHED',1,NULL,'2026-07-11 00:56:58','2026-07-11 00:56:58',0,'TV no incluida',79990,0,0,'2-3',NULL,NULL);
INSERT INTO "catalog_plans" ("id","tenant_id","zone_id","technology_id","category_id","name","code","description","benefits","download_speed","upload_speed","is_symmetric","price","tax_included","installation_days_min","installation_days_max","support_priority","max_incident_resolution_hours","sla_availability","status","version","published_at","created_at","updated_at","has_tv","tv_label","installation_cost","tv_installation_cost","additional_tv_point","recommended_users","recommended_devices","recommended_use") VALUES('cp-zelandia-50','interplay','z-zelandia','tech-radio','cat-rural','MegaUltra 50','MU-50','Requiere estudio de cobertura','[]',50,25,0,149990,0,2,3,'NORMAL',24,99.5,'PUBLISHED',1,NULL,'2026-07-11 00:56:58','2026-07-11 00:56:58',0,'TV no incluida',79990,0,0,'2-3',NULL,NULL);
INSERT INTO "catalog_plans" ("id","tenant_id","zone_id","technology_id","category_id","name","code","description","benefits","download_speed","upload_speed","is_symmetric","price","tax_included","installation_days_min","installation_days_max","support_priority","max_incident_resolution_hours","sla_availability","status","version","published_at","created_at","updated_at","has_tv","tv_label","installation_cost","tv_installation_cost","additional_tv_point","recommended_users","recommended_devices","recommended_use") VALUES('cp-altodelsol-10','interplay','z-altodelsol','tech-radio','cat-rural','MegaUltra 10','MU-10','','[]',10,5,0,59990,0,2,3,'NORMAL',24,99.5,'PUBLISHED',1,NULL,'2026-07-11 00:57:23','2026-07-11 00:57:23',0,'TV no incluida',79990,0,0,'1-2',NULL,NULL);
INSERT INTO "catalog_plans" ("id","tenant_id","zone_id","technology_id","category_id","name","code","description","benefits","download_speed","upload_speed","is_symmetric","price","tax_included","installation_days_min","installation_days_max","support_priority","max_incident_resolution_hours","sla_availability","status","version","published_at","created_at","updated_at","has_tv","tv_label","installation_cost","tv_installation_cost","additional_tv_point","recommended_users","recommended_devices","recommended_use") VALUES('cp-altodelsol-15','interplay','z-altodelsol','tech-radio','cat-rural','MegaUltra 15','MU-15','','[]',15,7,0,69990,0,2,3,'NORMAL',24,99.5,'PUBLISHED',1,NULL,'2026-07-11 00:57:23','2026-07-11 00:57:23',0,'TV no incluida',79990,0,0,'1-2',NULL,NULL);
INSERT INTO "catalog_plans" ("id","tenant_id","zone_id","technology_id","category_id","name","code","description","benefits","download_speed","upload_speed","is_symmetric","price","tax_included","installation_days_min","installation_days_max","support_priority","max_incident_resolution_hours","sla_availability","status","version","published_at","created_at","updated_at","has_tv","tv_label","installation_cost","tv_installation_cost","additional_tv_point","recommended_users","recommended_devices","recommended_use") VALUES('cp-altodelsol-20','interplay','z-altodelsol','tech-radio','cat-rural','MegaUltra 20','MU-20','','[]',20,10,0,79990,0,2,3,'NORMAL',24,99.5,'PUBLISHED',1,NULL,'2026-07-11 00:57:23','2026-07-11 00:57:23',0,'TV no incluida',79990,0,0,'2-3',NULL,NULL);
INSERT INTO "catalog_plans" ("id","tenant_id","zone_id","technology_id","category_id","name","code","description","benefits","download_speed","upload_speed","is_symmetric","price","tax_included","installation_days_min","installation_days_max","support_priority","max_incident_resolution_hours","sla_availability","status","version","published_at","created_at","updated_at","has_tv","tv_label","installation_cost","tv_installation_cost","additional_tv_point","recommended_users","recommended_devices","recommended_use") VALUES('cp-altodelsol-30','interplay','z-altodelsol','tech-radio','cat-rural','MegaUltra 30','MU-30','','[]',30,15,0,99990,0,2,3,'NORMAL',24,99.5,'PUBLISHED',1,NULL,'2026-07-11 00:57:23','2026-07-11 00:57:23',0,'TV no incluida',79990,0,0,'2-3',NULL,NULL);
INSERT INTO "catalog_plans" ("id","tenant_id","zone_id","technology_id","category_id","name","code","description","benefits","download_speed","upload_speed","is_symmetric","price","tax_included","installation_days_min","installation_days_max","support_priority","max_incident_resolution_hours","sla_availability","status","version","published_at","created_at","updated_at","has_tv","tv_label","installation_cost","tv_installation_cost","additional_tv_point","recommended_users","recommended_devices","recommended_use") VALUES('cp-altodelsol-50','interplay','z-altodelsol','tech-radio','cat-rural','MegaUltra 50','MU-50','Requiere estudio de cobertura','[]',50,25,0,149990,0,2,3,'NORMAL',24,99.5,'PUBLISHED',1,NULL,'2026-07-11 00:57:23','2026-07-11 00:57:23',0,'TV no incluida',79990,0,0,'2-3',NULL,NULL);
INSERT INTO "catalog_plans" ("id","tenant_id","zone_id","technology_id","category_id","name","code","description","benefits","download_speed","upload_speed","is_symmetric","price","tax_included","installation_days_min","installation_days_max","support_priority","max_incident_resolution_hours","sla_availability","status","version","published_at","created_at","updated_at","has_tv","tv_label","installation_cost","tv_installation_cost","additional_tv_point","recommended_users","recommended_devices","recommended_use") VALUES('cp-sanantonio-10','interplay','z-sanantonio','tech-radio','cat-rural','MegaUltra 10','MU-10','','[]',10,5,0,59990,0,2,3,'NORMAL',24,99.5,'PUBLISHED',1,NULL,'2026-07-11 00:57:33','2026-07-11 00:57:33',0,'TV no incluida',99990,0,0,'1-2',NULL,NULL);
INSERT INTO "catalog_plans" ("id","tenant_id","zone_id","technology_id","category_id","name","code","description","benefits","download_speed","upload_speed","is_symmetric","price","tax_included","installation_days_min","installation_days_max","support_priority","max_incident_resolution_hours","sla_availability","status","version","published_at","created_at","updated_at","has_tv","tv_label","installation_cost","tv_installation_cost","additional_tv_point","recommended_users","recommended_devices","recommended_use") VALUES('cp-sanantonio-15','interplay','z-sanantonio','tech-radio','cat-rural','MegaUltra 15','MU-15','','[]',15,7,0,69990,0,2,3,'NORMAL',24,99.5,'PUBLISHED',1,NULL,'2026-07-11 00:57:45','2026-07-11 00:57:45',0,'TV no incluida',99990,0,0,'1-2',NULL,NULL);
INSERT INTO "catalog_plans" ("id","tenant_id","zone_id","technology_id","category_id","name","code","description","benefits","download_speed","upload_speed","is_symmetric","price","tax_included","installation_days_min","installation_days_max","support_priority","max_incident_resolution_hours","sla_availability","status","version","published_at","created_at","updated_at","has_tv","tv_label","installation_cost","tv_installation_cost","additional_tv_point","recommended_users","recommended_devices","recommended_use") VALUES('cp-sanantonio-20','interplay','z-sanantonio','tech-radio','cat-rural','MegaUltra 20','MU-20','','[]',20,10,0,79990,0,2,3,'NORMAL',24,99.5,'PUBLISHED',1,NULL,'2026-07-11 00:57:45','2026-07-11 00:57:45',0,'TV no incluida',99990,0,0,'2-3',NULL,NULL);
INSERT INTO "catalog_plans" ("id","tenant_id","zone_id","technology_id","category_id","name","code","description","benefits","download_speed","upload_speed","is_symmetric","price","tax_included","installation_days_min","installation_days_max","support_priority","max_incident_resolution_hours","sla_availability","status","version","published_at","created_at","updated_at","has_tv","tv_label","installation_cost","tv_installation_cost","additional_tv_point","recommended_users","recommended_devices","recommended_use") VALUES('cp-sanantonio-30','interplay','z-sanantonio','tech-radio','cat-rural','MegaUltra 30','MU-30','','[]',30,15,0,99990,0,2,3,'NORMAL',24,99.5,'PUBLISHED',1,NULL,'2026-07-11 00:57:45','2026-07-11 00:57:45',0,'TV no incluida',99990,0,0,'2-3',NULL,NULL);
INSERT INTO "catalog_plans" ("id","tenant_id","zone_id","technology_id","category_id","name","code","description","benefits","download_speed","upload_speed","is_symmetric","price","tax_included","installation_days_min","installation_days_max","support_priority","max_incident_resolution_hours","sla_availability","status","version","published_at","created_at","updated_at","has_tv","tv_label","installation_cost","tv_installation_cost","additional_tv_point","recommended_users","recommended_devices","recommended_use") VALUES('cp-sanantonio-50','interplay','z-sanantonio','tech-radio','cat-rural','MegaUltra 50','MU-50','Requiere estudio de cobertura','[]',50,25,0,149990,0,2,3,'NORMAL',24,99.5,'PUBLISHED',1,NULL,'2026-07-11 00:57:45','2026-07-11 00:57:45',0,'TV no incluida',99990,0,0,'2-3',NULL,NULL);
INSERT INTO "catalog_plans" ("id","tenant_id","zone_id","technology_id","category_id","name","code","description","benefits","download_speed","upload_speed","is_symmetric","price","tax_included","installation_days_min","installation_days_max","support_priority","max_incident_resolution_hours","sla_availability","status","version","published_at","created_at","updated_at","has_tv","tv_label","installation_cost","tv_installation_cost","additional_tv_point","recommended_users","recommended_devices","recommended_use") VALUES('cp-sierra-50','interplay','z-sierra','tech-radio','cat-rural','MegaUltra 50','MU-50','Requiere estudio de cobertura','[]',50,25,0,149990,0,2,3,'NORMAL',24,99.5,'PUBLISHED',1,NULL,'2026-07-11 00:57:57','2026-07-11 00:57:57',0,'TV no incluida',99990,0,0,'2-3',NULL,NULL);
INSERT INTO "catalog_plans" ("id","tenant_id","zone_id","technology_id","category_id","name","code","description","benefits","download_speed","upload_speed","is_symmetric","price","tax_included","installation_days_min","installation_days_max","support_priority","max_incident_resolution_hours","sla_availability","status","version","published_at","created_at","updated_at","has_tv","tv_label","installation_cost","tv_installation_cost","additional_tv_point","recommended_users","recommended_devices","recommended_use") VALUES('cp-delicias-50','interplay','z-delicias','tech-radio','cat-rural','MegaUltra 50','MU-50','Requiere estudio de cobertura','[]',50,25,0,149990,0,2,3,'NORMAL',24,99.5,'PUBLISHED',1,NULL,'2026-07-11 00:57:57','2026-07-11 00:57:57',0,'TV no incluida',79990,0,0,'2-3',NULL,NULL);
INSERT INTO "catalog_plans" ("id","tenant_id","zone_id","technology_id","category_id","name","code","description","benefits","download_speed","upload_speed","is_symmetric","price","tax_included","installation_days_min","installation_days_max","support_priority","max_incident_resolution_hours","sla_availability","status","version","published_at","created_at","updated_at","has_tv","tv_label","installation_cost","tv_installation_cost","additional_tv_point","recommended_users","recommended_devices","recommended_use") VALUES('cp-iguacitos-50','interplay','z-iguacitos','tech-radio','cat-rural','MegaUltra 50','MU-50','Requiere estudio de cobertura','[]',50,25,0,149990,0,2,3,'NORMAL',24,99.5,'PUBLISHED',1,NULL,'2026-07-11 00:57:57','2026-07-11 00:57:57',0,'TV no incluida',79990,0,0,'2-3',NULL,NULL);
CREATE TABLE plan_services (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  plan_id TEXT NOT NULL,
  name TEXT NOT NULL,
  code TEXT,
  icon TEXT DEFAULT '✔',
  active INTEGER DEFAULT 1
);
CREATE TABLE plan_equipment (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  plan_id TEXT NOT NULL,
  name TEXT NOT NULL,
  type TEXT,
  quantity INTEGER DEFAULT 1,
  active INTEGER DEFAULT 1
);
CREATE TABLE plan_documents (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  plan_id TEXT NOT NULL,
  name TEXT NOT NULL,
  code TEXT,
  required INTEGER DEFAULT 1,
  active INTEGER DEFAULT 1
);
CREATE TABLE plan_commissions (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  plan_id TEXT NOT NULL,
  client_type_id TEXT,
  type TEXT DEFAULT 'PERCENTAGE',
  value REAL NOT NULL DEFAULT 0,
  holding_days INTEGER DEFAULT 15,
  active INTEGER DEFAULT 1
);
INSERT INTO "plan_commissions" ("id","tenant_id","plan_id","client_type_id","type","value","holding_days","active") VALUES('pc-cp-fresno-50-res','interplay','cp-fresno-50','ct-residential','PERCENTAGE',50,15,1);
INSERT INTO "plan_commissions" ("id","tenant_id","plan_id","client_type_id","type","value","holding_days","active") VALUES('pc-cp-fresno-100-res','interplay','cp-fresno-100','ct-residential','PERCENTAGE',50,15,1);
INSERT INTO "plan_commissions" ("id","tenant_id","plan_id","client_type_id","type","value","holding_days","active") VALUES('pc-cp-fresno-200-res','interplay','cp-fresno-200','ct-residential','PERCENTAGE',50,15,1);
INSERT INTO "plan_commissions" ("id","tenant_id","plan_id","client_type_id","type","value","holding_days","active") VALUES('pc-cp-fresno-300-res','interplay','cp-fresno-300','ct-residential','PERCENTAGE',50,15,1);
INSERT INTO "plan_commissions" ("id","tenant_id","plan_id","client_type_id","type","value","holding_days","active") VALUES('pc-cp-fresno-500-res','interplay','cp-fresno-500','ct-residential','PERCENTAGE',50,15,1);
INSERT INTO "plan_commissions" ("id","tenant_id","plan_id","client_type_id","type","value","holding_days","active") VALUES('pc-cp-fresno-600-res','interplay','cp-fresno-600','ct-residential','PERCENTAGE',50,15,1);
INSERT INTO "plan_commissions" ("id","tenant_id","plan_id","client_type_id","type","value","holding_days","active") VALUES('pc-cp-guayabal-50-res','interplay','cp-guayabal-50','ct-residential','PERCENTAGE',50,15,1);
INSERT INTO "plan_commissions" ("id","tenant_id","plan_id","client_type_id","type","value","holding_days","active") VALUES('pc-cp-guayabal-100-res','interplay','cp-guayabal-100','ct-residential','PERCENTAGE',50,15,1);
INSERT INTO "plan_commissions" ("id","tenant_id","plan_id","client_type_id","type","value","holding_days","active") VALUES('pc-cp-guayabal-150-res','interplay','cp-guayabal-150','ct-residential','PERCENTAGE',50,15,1);
INSERT INTO "plan_commissions" ("id","tenant_id","plan_id","client_type_id","type","value","holding_days","active") VALUES('pc-cp-guayabal-200-res','interplay','cp-guayabal-200','ct-residential','PERCENTAGE',50,15,1);
INSERT INTO "plan_commissions" ("id","tenant_id","plan_id","client_type_id","type","value","holding_days","active") VALUES('pc-cp-guayabal-400-res','interplay','cp-guayabal-400','ct-residential','PERCENTAGE',50,15,1);
INSERT INTO "plan_commissions" ("id","tenant_id","plan_id","client_type_id","type","value","holding_days","active") VALUES('pc-cp-lerida-100-res','interplay','cp-lerida-100','ct-residential','PERCENTAGE',50,15,1);
INSERT INTO "plan_commissions" ("id","tenant_id","plan_id","client_type_id","type","value","holding_days","active") VALUES('pc-cp-lerida-150-res','interplay','cp-lerida-150','ct-residential','PERCENTAGE',50,15,1);
INSERT INTO "plan_commissions" ("id","tenant_id","plan_id","client_type_id","type","value","holding_days","active") VALUES('pc-cp-lerida-200-res','interplay','cp-lerida-200','ct-residential','PERCENTAGE',50,15,1);
INSERT INTO "plan_commissions" ("id","tenant_id","plan_id","client_type_id","type","value","holding_days","active") VALUES('pc-cp-lerida-400-res','interplay','cp-lerida-400','ct-residential','PERCENTAGE',50,15,1);
INSERT INTO "plan_commissions" ("id","tenant_id","plan_id","client_type_id","type","value","holding_days","active") VALUES('pc-cp-lerida-800-res','interplay','cp-lerida-800','ct-residential','PERCENTAGE',50,15,1);
INSERT INTO "plan_commissions" ("id","tenant_id","plan_id","client_type_id","type","value","holding_days","active") VALUES('pc-cp-alvarado-50-res','interplay','cp-alvarado-50','ct-residential','PERCENTAGE',50,15,1);
INSERT INTO "plan_commissions" ("id","tenant_id","plan_id","client_type_id","type","value","holding_days","active") VALUES('pc-cp-alvarado-60-res','interplay','cp-alvarado-60','ct-residential','PERCENTAGE',50,15,1);
INSERT INTO "plan_commissions" ("id","tenant_id","plan_id","client_type_id","type","value","holding_days","active") VALUES('pc-cp-alvarado-80-res','interplay','cp-alvarado-80','ct-residential','PERCENTAGE',50,15,1);
INSERT INTO "plan_commissions" ("id","tenant_id","plan_id","client_type_id","type","value","holding_days","active") VALUES('pc-cp-alvarado-100-res','interplay','cp-alvarado-100','ct-residential','PERCENTAGE',50,15,1);
INSERT INTO "plan_commissions" ("id","tenant_id","plan_id","client_type_id","type","value","holding_days","active") VALUES('pc-cp-alvarado-200-res','interplay','cp-alvarado-200','ct-residential','PERCENTAGE',50,15,1);
INSERT INTO "plan_commissions" ("id","tenant_id","plan_id","client_type_id","type","value","holding_days","active") VALUES('pc-cp-alvarado-400-res','interplay','cp-alvarado-400','ct-residential','PERCENTAGE',50,15,1);
INSERT INTO "plan_commissions" ("id","tenant_id","plan_id","client_type_id","type","value","holding_days","active") VALUES('pc-cp-venadillo-60-res','interplay','cp-venadillo-60','ct-residential','PERCENTAGE',50,15,1);
INSERT INTO "plan_commissions" ("id","tenant_id","plan_id","client_type_id","type","value","holding_days","active") VALUES('pc-cp-venadillo-80-res','interplay','cp-venadillo-80','ct-residential','PERCENTAGE',50,15,1);
INSERT INTO "plan_commissions" ("id","tenant_id","plan_id","client_type_id","type","value","holding_days","active") VALUES('pc-cp-venadillo-100-res','interplay','cp-venadillo-100','ct-residential','PERCENTAGE',50,15,1);
INSERT INTO "plan_commissions" ("id","tenant_id","plan_id","client_type_id","type","value","holding_days","active") VALUES('pc-cp-venadillo-200-res','interplay','cp-venadillo-200','ct-residential','PERCENTAGE',50,15,1);
INSERT INTO "plan_commissions" ("id","tenant_id","plan_id","client_type_id","type","value","holding_days","active") VALUES('pc-cp-venadillo-400-res','interplay','cp-venadillo-400','ct-residential','PERCENTAGE',50,15,1);
INSERT INTO "plan_commissions" ("id","tenant_id","plan_id","client_type_id","type","value","holding_days","active") VALUES('pc-cp-venadillo-600-res','interplay','cp-venadillo-600','ct-residential','PERCENTAGE',50,15,1);
INSERT INTO "plan_commissions" ("id","tenant_id","plan_id","client_type_id","type","value","holding_days","active") VALUES('pc-cp-fresno-50-com','interplay','cp-fresno-50','ct-commercial','PERCENTAGE',50,15,1);
INSERT INTO "plan_commissions" ("id","tenant_id","plan_id","client_type_id","type","value","holding_days","active") VALUES('pc-cp-fresno-100-com','interplay','cp-fresno-100','ct-commercial','PERCENTAGE',50,15,1);
INSERT INTO "plan_commissions" ("id","tenant_id","plan_id","client_type_id","type","value","holding_days","active") VALUES('pc-cp-fresno-200-com','interplay','cp-fresno-200','ct-commercial','PERCENTAGE',50,15,1);
INSERT INTO "plan_commissions" ("id","tenant_id","plan_id","client_type_id","type","value","holding_days","active") VALUES('pc-cp-fresno-300-com','interplay','cp-fresno-300','ct-commercial','PERCENTAGE',50,15,1);
INSERT INTO "plan_commissions" ("id","tenant_id","plan_id","client_type_id","type","value","holding_days","active") VALUES('pc-cp-fresno-500-com','interplay','cp-fresno-500','ct-commercial','PERCENTAGE',50,15,1);
INSERT INTO "plan_commissions" ("id","tenant_id","plan_id","client_type_id","type","value","holding_days","active") VALUES('pc-cp-fresno-600-com','interplay','cp-fresno-600','ct-commercial','PERCENTAGE',50,15,1);
INSERT INTO "plan_commissions" ("id","tenant_id","plan_id","client_type_id","type","value","holding_days","active") VALUES('pc-cp-guayabal-50-com','interplay','cp-guayabal-50','ct-commercial','PERCENTAGE',50,15,1);
INSERT INTO "plan_commissions" ("id","tenant_id","plan_id","client_type_id","type","value","holding_days","active") VALUES('pc-cp-guayabal-100-com','interplay','cp-guayabal-100','ct-commercial','PERCENTAGE',50,15,1);
INSERT INTO "plan_commissions" ("id","tenant_id","plan_id","client_type_id","type","value","holding_days","active") VALUES('pc-cp-guayabal-150-com','interplay','cp-guayabal-150','ct-commercial','PERCENTAGE',50,15,1);
INSERT INTO "plan_commissions" ("id","tenant_id","plan_id","client_type_id","type","value","holding_days","active") VALUES('pc-cp-guayabal-200-com','interplay','cp-guayabal-200','ct-commercial','PERCENTAGE',50,15,1);
INSERT INTO "plan_commissions" ("id","tenant_id","plan_id","client_type_id","type","value","holding_days","active") VALUES('pc-cp-guayabal-400-com','interplay','cp-guayabal-400','ct-commercial','PERCENTAGE',50,15,1);
INSERT INTO "plan_commissions" ("id","tenant_id","plan_id","client_type_id","type","value","holding_days","active") VALUES('pc-cp-lerida-100-com','interplay','cp-lerida-100','ct-commercial','PERCENTAGE',50,15,1);
INSERT INTO "plan_commissions" ("id","tenant_id","plan_id","client_type_id","type","value","holding_days","active") VALUES('pc-cp-lerida-150-com','interplay','cp-lerida-150','ct-commercial','PERCENTAGE',50,15,1);
INSERT INTO "plan_commissions" ("id","tenant_id","plan_id","client_type_id","type","value","holding_days","active") VALUES('pc-cp-lerida-200-com','interplay','cp-lerida-200','ct-commercial','PERCENTAGE',50,15,1);
INSERT INTO "plan_commissions" ("id","tenant_id","plan_id","client_type_id","type","value","holding_days","active") VALUES('pc-cp-lerida-400-com','interplay','cp-lerida-400','ct-commercial','PERCENTAGE',50,15,1);
INSERT INTO "plan_commissions" ("id","tenant_id","plan_id","client_type_id","type","value","holding_days","active") VALUES('pc-cp-lerida-800-com','interplay','cp-lerida-800','ct-commercial','PERCENTAGE',50,15,1);
INSERT INTO "plan_commissions" ("id","tenant_id","plan_id","client_type_id","type","value","holding_days","active") VALUES('pc-cp-alvarado-50-com','interplay','cp-alvarado-50','ct-commercial','PERCENTAGE',50,15,1);
INSERT INTO "plan_commissions" ("id","tenant_id","plan_id","client_type_id","type","value","holding_days","active") VALUES('pc-cp-alvarado-60-com','interplay','cp-alvarado-60','ct-commercial','PERCENTAGE',50,15,1);
INSERT INTO "plan_commissions" ("id","tenant_id","plan_id","client_type_id","type","value","holding_days","active") VALUES('pc-cp-alvarado-80-com','interplay','cp-alvarado-80','ct-commercial','PERCENTAGE',50,15,1);
INSERT INTO "plan_commissions" ("id","tenant_id","plan_id","client_type_id","type","value","holding_days","active") VALUES('pc-cp-alvarado-100-com','interplay','cp-alvarado-100','ct-commercial','PERCENTAGE',50,15,1);
INSERT INTO "plan_commissions" ("id","tenant_id","plan_id","client_type_id","type","value","holding_days","active") VALUES('pc-cp-alvarado-200-com','interplay','cp-alvarado-200','ct-commercial','PERCENTAGE',50,15,1);
INSERT INTO "plan_commissions" ("id","tenant_id","plan_id","client_type_id","type","value","holding_days","active") VALUES('pc-cp-alvarado-400-com','interplay','cp-alvarado-400','ct-commercial','PERCENTAGE',50,15,1);
INSERT INTO "plan_commissions" ("id","tenant_id","plan_id","client_type_id","type","value","holding_days","active") VALUES('pc-cp-venadillo-60-com','interplay','cp-venadillo-60','ct-commercial','PERCENTAGE',50,15,1);
INSERT INTO "plan_commissions" ("id","tenant_id","plan_id","client_type_id","type","value","holding_days","active") VALUES('pc-cp-venadillo-80-com','interplay','cp-venadillo-80','ct-commercial','PERCENTAGE',50,15,1);
INSERT INTO "plan_commissions" ("id","tenant_id","plan_id","client_type_id","type","value","holding_days","active") VALUES('pc-cp-venadillo-100-com','interplay','cp-venadillo-100','ct-commercial','PERCENTAGE',50,15,1);
INSERT INTO "plan_commissions" ("id","tenant_id","plan_id","client_type_id","type","value","holding_days","active") VALUES('pc-cp-venadillo-200-com','interplay','cp-venadillo-200','ct-commercial','PERCENTAGE',50,15,1);
INSERT INTO "plan_commissions" ("id","tenant_id","plan_id","client_type_id","type","value","holding_days","active") VALUES('pc-cp-venadillo-400-com','interplay','cp-venadillo-400','ct-commercial','PERCENTAGE',50,15,1);
INSERT INTO "plan_commissions" ("id","tenant_id","plan_id","client_type_id","type","value","holding_days","active") VALUES('pc-cp-venadillo-600-com','interplay','cp-venadillo-600','ct-commercial','PERCENTAGE',50,15,1);
CREATE TABLE commercial_offers (
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
CREATE TABLE offer_services (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  offer_id TEXT NOT NULL,
  name TEXT NOT NULL,
  icon TEXT DEFAULT '✔',
  included INTEGER DEFAULT 1
);
CREATE TABLE offer_availability (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  offer_id TEXT NOT NULL,
  zone_id TEXT NOT NULL,
  box_id TEXT,
  status TEXT DEFAULT 'AVAILABLE',
  UNIQUE(offer_id, zone_id, box_id)
);
CREATE TABLE recommendation_rules (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  name TEXT NOT NULL,
  conditions TEXT NOT NULL DEFAULT '{}',
  suggested_offer_id TEXT NOT NULL,
  priority INTEGER DEFAULT 1,
  confidence INTEGER DEFAULT 50,
  active INTEGER DEFAULT 1
);
CREATE TABLE pricing_rules (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'TAX',
  value REAL NOT NULL DEFAULT 0,
  applies_to TEXT DEFAULT 'ALL',
  client_type_id TEXT,
  active INTEGER DEFAULT 1
);
CREATE TABLE promotions (
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
CREATE TABLE commission_rules (
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
CREATE TABLE plan_costs (
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
INSERT INTO "plan_costs" ("id","tenant_id","plan_id","infrastructure","support","equipment","installation","commissions","other","notes","updated_at") VALUES('cost-cp-fresno-50','interplay','cp-fresno-50',18000,4000,30000,0,0,0,NULL,'2026-07-09 16:44:38');
INSERT INTO "plan_costs" ("id","tenant_id","plan_id","infrastructure","support","equipment","installation","commissions","other","notes","updated_at") VALUES('cost-cp-fresno-100','interplay','cp-fresno-100',18000,4000,30000,0,0,0,NULL,'2026-07-09 16:44:38');
INSERT INTO "plan_costs" ("id","tenant_id","plan_id","infrastructure","support","equipment","installation","commissions","other","notes","updated_at") VALUES('cost-cp-fresno-200','interplay','cp-fresno-200',18000,4000,30000,0,0,0,NULL,'2026-07-09 16:44:38');
INSERT INTO "plan_costs" ("id","tenant_id","plan_id","infrastructure","support","equipment","installation","commissions","other","notes","updated_at") VALUES('cost-cp-fresno-300','interplay','cp-fresno-300',18000,4000,30000,0,0,0,NULL,'2026-07-09 16:44:38');
INSERT INTO "plan_costs" ("id","tenant_id","plan_id","infrastructure","support","equipment","installation","commissions","other","notes","updated_at") VALUES('cost-cp-fresno-500','interplay','cp-fresno-500',18000,4000,30000,0,0,0,NULL,'2026-07-09 16:44:38');
INSERT INTO "plan_costs" ("id","tenant_id","plan_id","infrastructure","support","equipment","installation","commissions","other","notes","updated_at") VALUES('cost-cp-fresno-600','interplay','cp-fresno-600',18000,4000,30000,0,0,0,NULL,'2026-07-09 16:44:38');
INSERT INTO "plan_costs" ("id","tenant_id","plan_id","infrastructure","support","equipment","installation","commissions","other","notes","updated_at") VALUES('cost-cp-guayabal-50','interplay','cp-guayabal-50',18000,4000,30000,0,0,0,NULL,'2026-07-09 16:44:38');
INSERT INTO "plan_costs" ("id","tenant_id","plan_id","infrastructure","support","equipment","installation","commissions","other","notes","updated_at") VALUES('cost-cp-guayabal-100','interplay','cp-guayabal-100',18000,4000,30000,0,0,0,NULL,'2026-07-09 16:44:38');
INSERT INTO "plan_costs" ("id","tenant_id","plan_id","infrastructure","support","equipment","installation","commissions","other","notes","updated_at") VALUES('cost-cp-guayabal-150','interplay','cp-guayabal-150',18000,4000,30000,0,0,0,NULL,'2026-07-09 16:44:38');
INSERT INTO "plan_costs" ("id","tenant_id","plan_id","infrastructure","support","equipment","installation","commissions","other","notes","updated_at") VALUES('cost-cp-guayabal-200','interplay','cp-guayabal-200',18000,4000,30000,0,0,0,NULL,'2026-07-09 16:44:38');
INSERT INTO "plan_costs" ("id","tenant_id","plan_id","infrastructure","support","equipment","installation","commissions","other","notes","updated_at") VALUES('cost-cp-guayabal-400','interplay','cp-guayabal-400',18000,4000,30000,0,0,0,NULL,'2026-07-09 16:44:38');
INSERT INTO "plan_costs" ("id","tenant_id","plan_id","infrastructure","support","equipment","installation","commissions","other","notes","updated_at") VALUES('cost-cp-lerida-100','interplay','cp-lerida-100',18000,4000,30000,0,0,0,NULL,'2026-07-09 16:44:38');
INSERT INTO "plan_costs" ("id","tenant_id","plan_id","infrastructure","support","equipment","installation","commissions","other","notes","updated_at") VALUES('cost-cp-lerida-150','interplay','cp-lerida-150',18000,4000,30000,0,0,0,NULL,'2026-07-09 16:44:38');
INSERT INTO "plan_costs" ("id","tenant_id","plan_id","infrastructure","support","equipment","installation","commissions","other","notes","updated_at") VALUES('cost-cp-lerida-200','interplay','cp-lerida-200',18000,4000,30000,0,0,0,NULL,'2026-07-09 16:44:38');
INSERT INTO "plan_costs" ("id","tenant_id","plan_id","infrastructure","support","equipment","installation","commissions","other","notes","updated_at") VALUES('cost-cp-lerida-400','interplay','cp-lerida-400',18000,4000,30000,0,0,0,NULL,'2026-07-09 16:44:38');
INSERT INTO "plan_costs" ("id","tenant_id","plan_id","infrastructure","support","equipment","installation","commissions","other","notes","updated_at") VALUES('cost-cp-lerida-800','interplay','cp-lerida-800',18000,4000,30000,0,0,0,NULL,'2026-07-09 16:44:38');
INSERT INTO "plan_costs" ("id","tenant_id","plan_id","infrastructure","support","equipment","installation","commissions","other","notes","updated_at") VALUES('cost-cp-alvarado-50','interplay','cp-alvarado-50',18000,4000,30000,0,0,0,NULL,'2026-07-09 16:44:38');
INSERT INTO "plan_costs" ("id","tenant_id","plan_id","infrastructure","support","equipment","installation","commissions","other","notes","updated_at") VALUES('cost-cp-alvarado-60','interplay','cp-alvarado-60',18000,4000,30000,0,0,0,NULL,'2026-07-09 16:44:38');
INSERT INTO "plan_costs" ("id","tenant_id","plan_id","infrastructure","support","equipment","installation","commissions","other","notes","updated_at") VALUES('cost-cp-alvarado-80','interplay','cp-alvarado-80',18000,4000,30000,0,0,0,NULL,'2026-07-09 16:44:38');
INSERT INTO "plan_costs" ("id","tenant_id","plan_id","infrastructure","support","equipment","installation","commissions","other","notes","updated_at") VALUES('cost-cp-alvarado-100','interplay','cp-alvarado-100',18000,4000,30000,0,0,0,NULL,'2026-07-09 16:44:38');
INSERT INTO "plan_costs" ("id","tenant_id","plan_id","infrastructure","support","equipment","installation","commissions","other","notes","updated_at") VALUES('cost-cp-alvarado-200','interplay','cp-alvarado-200',18000,4000,30000,0,0,0,NULL,'2026-07-09 16:44:38');
INSERT INTO "plan_costs" ("id","tenant_id","plan_id","infrastructure","support","equipment","installation","commissions","other","notes","updated_at") VALUES('cost-cp-alvarado-400','interplay','cp-alvarado-400',18000,4000,30000,0,0,0,NULL,'2026-07-09 16:44:38');
INSERT INTO "plan_costs" ("id","tenant_id","plan_id","infrastructure","support","equipment","installation","commissions","other","notes","updated_at") VALUES('cost-cp-venadillo-60','interplay','cp-venadillo-60',18000,4000,30000,0,0,0,NULL,'2026-07-09 16:44:38');
INSERT INTO "plan_costs" ("id","tenant_id","plan_id","infrastructure","support","equipment","installation","commissions","other","notes","updated_at") VALUES('cost-cp-venadillo-80','interplay','cp-venadillo-80',18000,4000,30000,0,0,0,NULL,'2026-07-09 16:44:38');
INSERT INTO "plan_costs" ("id","tenant_id","plan_id","infrastructure","support","equipment","installation","commissions","other","notes","updated_at") VALUES('cost-cp-venadillo-100','interplay','cp-venadillo-100',18000,4000,30000,0,0,0,NULL,'2026-07-09 16:44:38');
INSERT INTO "plan_costs" ("id","tenant_id","plan_id","infrastructure","support","equipment","installation","commissions","other","notes","updated_at") VALUES('cost-cp-venadillo-200','interplay','cp-venadillo-200',18000,4000,30000,0,0,0,NULL,'2026-07-09 16:44:38');
INSERT INTO "plan_costs" ("id","tenant_id","plan_id","infrastructure","support","equipment","installation","commissions","other","notes","updated_at") VALUES('cost-cp-venadillo-400','interplay','cp-venadillo-400',18000,4000,30000,0,0,0,NULL,'2026-07-09 16:44:38');
INSERT INTO "plan_costs" ("id","tenant_id","plan_id","infrastructure","support","equipment","installation","commissions","other","notes","updated_at") VALUES('cost-cp-venadillo-600','interplay','cp-venadillo-600',18000,4000,30000,0,0,0,NULL,'2026-07-09 16:44:38');
CREATE INDEX idx_referrals_tenant_status ON referrals(tenant_id, funnel_status);
CREATE INDEX idx_events_aggregate ON events(aggregate_id);
CREATE INDEX idx_commissions_tenant_state ON commissions(tenant_id, financial_state);
CREATE INDEX idx_subscriptions_tenant ON subscriptions(tenant_id);
CREATE INDEX idx_installations_tenant_tech ON installations(tenant_id, technician_id);
