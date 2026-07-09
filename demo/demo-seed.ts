/**
 * Demo Mode Seed Script
 * 
 * Usage: npx ts-node demo/demo-seed.ts
 * 
 * Seeds a complete demo tenant with simulated data for:
 * - Product demonstrations to prospects
 * - User training without risk
 * - Development and testing
 * - Sales presentations
 * 
 * The full referidor flow can be executed in < 5 minutes.
 */

export const DEMO_TENANT = {
  id: 'demo-tenant',
  name: 'INTERPLAY Demo',
  config: {
    currency: 'MXN',
    timezone: 'America/Mexico_City',
    demoMode: true,
    simulatedPayment: true,
    simulatedProvisioning: true,
  },
};

export const DEMO_PLANS = [
  { id: 'plan-fibra-100', name: 'Fibra 100MB', price: 299, speed: 100, technology: 'FTTH', commissionRate: 15 },
  { id: 'plan-fibra-300', name: 'Fibra 300MB', price: 449, speed: 300, technology: 'FTTH', commissionRate: 15 },
  { id: 'plan-fibra-1g', name: 'Fibra 1GB', price: 699, speed: 1000, technology: 'FTTH', commissionRate: 12 },
];

export const DEMO_COVERAGE_ZONES = [
  {
    id: 'zone-centro', name: 'Centro', technology: 'FTTH', maxSpeed: 1000, installHours: 48,
    polygon: { type: 'Polygon' as const, coordinates: [[[-99.15, 19.42], [-99.13, 19.42], [-99.13, 19.44], [-99.15, 19.44], [-99.15, 19.42]]] },
    boxes: [
      { id: 'box-ct42', name: 'CT-42', totalPorts: 16, usedPorts: 13, address: 'Av. Reforma 123' },
      { id: 'box-ct43', name: 'CT-43', totalPorts: 16, usedPorts: 8, address: 'Calle Madero 45' },
    ],
  },
  {
    id: 'zone-norte', name: 'Norte', technology: 'FTTH', maxSpeed: 500, installHours: 72,
    polygon: { type: 'Polygon' as const, coordinates: [[[-99.12, 19.45], [-99.10, 19.45], [-99.10, 19.47], [-99.12, 19.47], [-99.12, 19.45]]] },
    boxes: [
      { id: 'box-ct50', name: 'CT-50', totalPorts: 8, usedPorts: 8, address: 'Av. Insurgentes 789', saturated: true },
    ],
  },
];

export const DEMO_TECHNICIANS = [
  { id: 'tech-carlos', name: 'Carlos Ruiz', email: 'carlos@demo.com', skills: ['FTTH', 'HFC'], maxDaily: 4, vehicle: 'MOTORCYCLE' as const, zones: ['zone-centro'] },
  { id: 'tech-ana', name: 'Ana López', email: 'ana@demo.com', skills: ['FTTH'], maxDaily: 3, vehicle: 'CAR' as const, zones: ['zone-centro', 'zone-norte'] },
];

export const DEMO_REFERIDORS = [
  { id: 'ref-maria', name: 'María García', email: 'maria@demo.com', phone: '+521234567890', password: 'demo123' },
  { id: 'ref-jose', name: 'José Hernández', email: 'jose@demo.com', phone: '+521234567891', password: 'demo123' },
];

export const DEMO_POLICIES = [
  { name: '50% primera factura', type: 'PERCENTAGE', value: 50, conditions: {}, priority: 1, holdingDays: 15 },
  { name: 'Bono Fibra 1GB', type: 'PERCENTAGE', value: 60, conditions: { planId: 'plan-fibra-1g' }, priority: 2, holdingDays: 15 },
  { name: 'Comisión fija zona rural', type: 'FIXED', value: 100, conditions: { municipality: 'Norte' }, priority: 3, holdingDays: 20 },
];

export const DEMO_REFERRALS = [
  { client: 'Pedro Martínez', address: 'Av. Reforma 123', plan: 'plan-fibra-300', status: 'WON', source: 'WHATSAPP' },
  { client: 'Laura García', address: 'Calle 5 de Mayo 45', plan: 'plan-fibra-100', status: 'INSTALLED', source: 'DIRECT' },
  { client: 'Carlos Ruiz', address: 'Av. Insurgentes 789', plan: 'plan-fibra-1g', status: 'SERVICE_ACTIVE', source: 'FACEBOOK' },
];

/**
 * Demo Flow Script (for sales demonstrations)
 * 
 * 1. Login as María García (maria@demo.com / demo123)
 * 2. Dashboard shows: 0 sales this month, empty state
 * 3. Press "Registrar una venta"
 * 4. Enter "Av. Reforma 123" → Coverage shows GREEN
 * 5. Fill prospect data: Pedro Martínez, +521234567892
 * 6. Select "Fibra 300MB"
 * 7. Confirm → See commission estimate $67.35
 * 8. See success screen with progress tracker
 * 9. Login as supervisor → Approve the referral
 * 10. Schedule installation → Carlos Ruiz assigned
 * 11. Login as technician → See order in schedule
 * 12. Start → Complete with photos + signature
 * 13. Login as admin → Commission Policy Engine calculates $67.35
 * 14. Payment simulated after 30s → Commission released
 * 15. Login as María → Wallet shows $67.35 available
 * 
 * Total demo time: ~4 minutes
 */
