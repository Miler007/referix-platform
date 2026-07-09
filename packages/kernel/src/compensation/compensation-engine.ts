/**
 * REF-COM-003 — Compensation Engine
 * 
 * Motor oficial de compensaciones de INTERPLAY.
 * Las comisiones solo se generan cuando el cliente PAGA su primera factura mensual completa.
 * Cortes de pago: 15 y 30 de cada mes.
 * Todo configurable desde Console.
 */

export type CommissionState =
  | 'PENDIENTE'                  // Venta registrada, esperando ciclo
  | 'ESPERANDO_FACTURA'          // Instalado, esperando primera factura completa
  | 'ESPERANDO_PAGO'             // Factura emitida, esperando pago
  | 'LIBERADA'                   // Factura pagada, comisión disponible
  | 'PROGRAMADA'                 // Asignada a un corte (15 o 30)
  | 'PAGADA'                     // Pagada al asesor
  | 'AUDITADA';                  // Conciliada contablemente

export interface CommissionRule {
  id: string;
  tenantId: string;
  name: string;
  type: 'PERCENTAGE' | 'FIXED';
  value: number;
  planId?: string;
  advisorId?: string;
  campaignId?: string;
  active: boolean;
}

export interface Commission {
  id: string;
  tenantId: string;
  referralId: string;
  advisorId: string;
  planId: string;
  planPrice: number;
  ruleApplied: CommissionRule;
  baseAmount: number;
  finalAmount: number;
  state: CommissionState;
  stateHistory: { state: CommissionState; date: Date; reason?: string }[];
  invoicePaidAt?: Date;
  liberatedAt?: Date;
  cutDate?: Date;         // 15 o 30 del mes
  paidAt?: Date;
  createdAt: Date;
}

export interface CutSchedule {
  day: number;  // 15 o 30
  label: string;
}

export class CompensationEngine {
  private commissions: Commission[] = [];
  private rules: CommissionRule[] = [];
  static CUTS: CutSchedule[] = [{ day: 15, label: 'Corte 15' }, { day: 30, label: 'Corte 30' }];

  // ── Reglas ─────────────────────────────────────────────────────
  addRule(rule: CommissionRule): void { this.rules.push(rule); }
  getRules(): CommissionRule[] { return [...this.rules]; }
  getActiveRules(): CommissionRule[] { return this.rules.filter(r => r.active); }

  // ── Calcular comisión ──────────────────────────────────────────
  calculate(planPrice: number, planId?: string, advisorId?: string, campaignId?: string): { rule: CommissionRule; amount: number } {
    const applicable = this.rules.filter(r => r.active)
      .sort((a, b) => {
        let scoreA = 0, scoreB = 0;
        if (a.planId === planId) scoreA += 10;
        if (a.advisorId === advisorId) scoreA += 10;
        if (a.campaignId === campaignId) scoreA += 5;
        if (b.planId === planId) scoreB += 10;
        if (b.advisorId === advisorId) scoreB += 10;
        if (b.campaignId === campaignId) scoreB += 5;
        return scoreB - scoreA;
      });
    const rule = applicable[0] || { id: 'default', tenantId: 'interplay', name: 'Default 10%', type: 'PERCENTAGE' as const, value: 10, active: true };
    const amount = rule.type === 'PERCENTAGE' ? Math.round(planPrice * rule.value / 100) : rule.value;
    return { rule, amount };
  }

  // ── Crear comisión (solo al registrar venta) ──────────────────
  createCommission(data: { tenantId: string; referralId: string; advisorId: string; planId: string; planPrice: number; campaignId?: string }): Commission {
    const { rule, amount } = this.calculate(data.planPrice, data.planId, data.advisorId, data.campaignId);
    const commission: Commission = {
      id: `comm-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      tenantId: data.tenantId,
      referralId: data.referralId,
      advisorId: data.advisorId,
      planId: data.planId,
      planPrice: data.planPrice,
      ruleApplied: rule,
      baseAmount: amount,
      finalAmount: amount,
      state: 'PENDIENTE',
      stateHistory: [{ state: 'PENDIENTE', date: new Date(), reason: 'Venta registrada' }],
      createdAt: new Date(),
    };
    this.commissions.push(commission);
    return commission;
  }

  // ── Avanzar estados ───────────────────────────────────────────
  advanceState(id: string, newState: CommissionState, reason?: string): Commission | null {
    const comm = this.commissions.find(c => c.id === id);
    if (!comm) return null;
    comm.state = newState;
    comm.stateHistory.push({ state: newState, date: new Date(), reason });
    return comm;
  }

  markInstalled(id: string): Commission | null {
    return this.advanceState(id, 'ESPERANDO_FACTURA', 'Instalación completada');
  }

  markInvoiceIssued(id: string): Commission | null {
    return this.advanceState(id, 'ESPERANDO_PAGO', 'Primera factura emitida');
  }

  markPaid(id: string, paidAt: Date): Commission | null {
    const comm = this.advanceState(id, 'LIBERADA', 'Factura pagada');
    if (comm) { comm.invoicePaidAt = paidAt; comm.liberatedAt = new Date(); }
    return comm;
  }

  // ── Asignar a corte ───────────────────────────────────────────
  assignToCut(cutDate: Date): Commission[] {
    const liberated = this.commissions.filter(c => c.state === 'LIBERADA' && !c.cutDate);
    liberated.forEach(c => {
      c.state = 'PROGRAMADA';
      c.cutDate = cutDate;
      c.stateHistory.push({ state: 'PROGRAMADA', date: new Date(), reason: `Asignada a corte ${cutDate.toLocaleDateString()}` });
    });
    return liberated;
  }

  // ── Obtener comisiones por corte ──────────────────────────────
  getByCut(month: number, year: number, cutDay: 15 | 30): Commission[] {
    return this.commissions.filter(c => {
      if (!c.cutDate) return false;
      return c.cutDate.getMonth() === month && c.cutDate.getFullYear() === year && c.cutDate.getDate() === cutDay;
    });
  }

  // ── Dashboard del asesor ──────────────────────────────────────
  getAdvisorSummary(advisorId: string): { pending: number; waitingPayment: number; liberated: number; programmed: number; paid: number; nextCutValue: number } {
    const adv = this.commissions.filter(c => c.advisorId === advisorId);
    return {
      pending: adv.filter(c => c.state === 'PENDIENTE' || c.state === 'ESPERANDO_FACTURA').length,
      waitingPayment: adv.filter(c => c.state === 'ESPERANDO_PAGO').length,
      liberated: adv.filter(c => c.state === 'LIBERADA').length,
      programmed: adv.filter(c => c.state === 'PROGRAMADA').length,
      paid: adv.filter(c => c.state === 'PAGADA' || c.state === 'AUDITADA').length,
      nextCutValue: adv.filter(c => c.state === 'LIBERADA' || c.state === 'PROGRAMADA').reduce((s, c) => s + c.finalAmount, 0),
    };
  }

  // ── Resumen ejecutivo ─────────────────────────────────────────
  getExecutiveSummary(): { pendingLiberation: number; liberatedThisMonth: number; nextCutValue: number; paidThisMonth: number; avgTimeToLiberate: number } {
    const now = new Date();
    const thisMonth = this.commissions.filter(c => c.createdAt.getMonth() === now.getMonth() && c.createdAt.getFullYear() === now.getFullYear());
    return {
      pendingLiberation: this.commissions.filter(c => c.state === 'ESPERANDO_PAGO').length,
      liberatedThisMonth: thisMonth.filter(c => c.state === 'LIBERADA' || c.state === 'PROGRAMADA' || c.state === 'PAGADA').length,
      nextCutValue: this.commissions.filter(c => c.state === 'LIBERADA' || c.state === 'PROGRAMADA').reduce((s, c) => s + c.finalAmount, 0),
      paidThisMonth: thisMonth.filter(c => c.state === 'PAGADA').reduce((s, c) => s + c.finalAmount, 0),
      avgTimeToLiberate: 45, // días promedio (simulado)
    };
  }

  // ── Todas las comisiones ──────────────────────────────────────
  getAll(): Commission[] { return [...this.commissions]; }
  getByAdvisor(advisorId: string): Commission[] { return this.commissions.filter(c => c.advisorId === advisorId); }
}
