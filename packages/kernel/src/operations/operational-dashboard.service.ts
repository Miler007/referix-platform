import { Injectable } from '@nestjs/common';

export interface OperationalSnapshot {
  tenantId: string;
  timestamp: Date;
  sales: { today: number; week: number; month: number; conversionRate: number };
  installations: { pending: number; today: number; onTime: number; late: number; slaBreaches: number };
  technicians: { active: number; inRoute: number; available: number };
  coverage: { totalBoxes: number; saturatedBoxes: number; saturationRate: number };
  financial: { pendingPayouts: number; heldCommissions: number; overdueInvoices: number };
  integrations: { connected: number; errors: number; total: number };
  alerts: Alert[];
}

export interface Alert {
  severity: 'CRITICAL' | 'WARNING' | 'INFO';
  message: string;
  module: string;
  timestamp: Date;
}

@Injectable()
export class OperationalDashboardService {
  async getSnapshot(tenantId: string): Promise<OperationalSnapshot> {
    return {
      tenantId,
      timestamp: new Date(),
      sales: { today: 3, week: 18, month: 47, conversionRate: 0.34 },
      installations: { pending: 12, today: 5, onTime: 4, late: 1, slaBreaches: 0 },
      technicians: { active: 8, inRoute: 3, available: 2 },
      coverage: { totalBoxes: 24, saturatedBoxes: 3, saturationRate: 12.5 },
      financial: { pendingPayouts: 3240, heldCommissions: 1890, overdueInvoices: 450 },
      integrations: { connected: 3, errors: 0, total: 5 },
      alerts: [
        { severity: 'WARNING', message: 'Caja CT-50 saturada (100%) — Zona Norte', module: 'coverage', timestamp: new Date() },
        { severity: 'INFO', message: '3 instalaciones pendientes de asignar desde ayer', module: 'operations', timestamp: new Date() },
      ],
    };
  }
}
