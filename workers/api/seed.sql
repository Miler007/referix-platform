-- Seed data for the Operational Pilot

INSERT OR IGNORE INTO tenants (id, name) VALUES ('demo-tenant', 'INTERPLAY Demo');

INSERT OR IGNORE INTO users (id, tenant_id, name, email, password, role) VALUES
  ('user-admin', 'demo-tenant', 'Admin INTERPLAY', 'admin@interplay.com', 'admin123', 'ADMIN'),
  ('user-maria', 'demo-tenant', 'María García', 'maria@demo.com', 'demo123', 'REFERIDOR'),
  ('user-jose', 'demo-tenant', 'José Hernández', 'jose@demo.com', 'demo123', 'REFERIDOR'),
  ('user-ana', 'demo-tenant', 'Ana López', 'ana@demo.com', 'demo123', 'SUPERVISOR'),
  ('user-carlos', 'demo-tenant', 'Carlos Ruiz', 'carlos@demo.com', 'demo123', 'TECHNICIAN');

INSERT OR IGNORE INTO plans (id, tenant_id, name, price, speed, technology, commission_pct) VALUES
  ('plan-fibra-100', 'demo-tenant', 'Fibra 100MB', 299, 100, 'FTTH', 15),
  ('plan-fibra-300', 'demo-tenant', 'Fibra 300MB', 449, 300, 'FTTH', 15),
  ('plan-fibra-1g', 'demo-tenant', 'Fibra 1GB', 699, 1000, 'FTTH', 12);

INSERT OR IGNORE INTO coverage_zones (id, tenant_id, name, technology, max_speed, install_hours, min_lat, max_lat, min_lng, max_lng) VALUES
  ('zone-centro', 'demo-tenant', 'Centro', 'FTTH', 1000, 48, 19.42, 19.44, -99.15, -99.13),
  ('zone-norte', 'demo-tenant', 'Norte', 'FTTH', 500, 72, 19.45, 19.47, -99.12, -99.10),
  ('zone-sur', 'demo-tenant', 'Sur', 'HFC', 300, 96, 19.38, 19.41, -99.10, -99.08);

INSERT OR IGNORE INTO distribution_boxes (id, tenant_id, zone_id, name, address, total_ports, used_ports, status) VALUES
  ('box-ct42', 'demo-tenant', 'zone-centro', 'CT-42', 'Av. Reforma 123', 16, 13, 'ACTIVE'),
  ('box-ct43', 'demo-tenant', 'zone-centro', 'CT-43', 'Calle Madero 45', 16, 8, 'ACTIVE'),
  ('box-ct50', 'demo-tenant', 'zone-norte', 'CT-50', 'Av. Insurgentes 789', 8, 8, 'SATURATED'),
  ('box-ct60', 'demo-tenant', 'zone-sur', 'CT-60', 'Calle Sur 100', 12, 6, 'ACTIVE');

INSERT OR IGNORE INTO commission_policies (id, tenant_id, name, type, value, conditions, priority, holding_days) VALUES
  ('pol-estandar', 'demo-tenant', '50% primera factura', 'PERCENTAGE', 50, '{}', 1, 15),
  ('pol-fibra-1g', 'demo-tenant', 'Bono Fibra 1GB', 'PERCENTAGE', 60, '{"planId":"plan-fibra-1g"}', 2, 15),
  ('pol-rural', 'demo-tenant', 'Comisión fija zona rural', 'FIXED', 100, '{"municipality":"Norte"}', 3, 20);

INSERT OR IGNORE INTO technicians (id, tenant_id, name, skills, max_daily, vehicle_type) VALUES
  ('tech-carlos', 'demo-tenant', 'Carlos Ruiz', '["FTTH","HFC"]', 4, 'MOTORCYCLE'),
  ('tech-ana', 'demo-tenant', 'Ana López', '["FTTH"]', 3, 'CAR');

INSERT OR IGNORE INTO wallets (id, tenant_id, referrer_person_id, balance, pending_balance, total_earned) VALUES
  ('wallet-maria', 'demo-tenant', 'person-maria', 2450, 890, 12340),
  ('wallet-jose', 'demo-tenant', 'person-jose', 1200, 450, 5600);
