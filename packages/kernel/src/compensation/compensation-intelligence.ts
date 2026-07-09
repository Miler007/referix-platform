/**
 * REF-COM-004 — Compensation Intelligence
 * 
 * Sistema de Gestión de Compensaciones.
 * Comisiones inmutables, liquidaciones por corte, recibos, cancelaciones, multi-beneficiario.
 */

export type CommissionReason = 'VENTA_NUEVA' | 'UPGRADE' | 'MIGRACION' | 'CAMPANIA' | 'RECUPERACION' | 'PROMOCION' | 'REFERIDO';
export type BeneficiaryType = 'ASESOR' | 'REFERIDOR' | 'SUPERVISOR' | 'COORDINADOR' | 'DISTRIBUIDOR';

export interface CommissionSnapshot {
  planId: string;
  planName: string;
  planPrice: number;
  ruleType: string;
  ruleValue: number;
  ruleName: string;
  createdAt: Date;
}

export interface CommissionTimelineEntry {
  date: Date;
  event: string;
  detail: string;
}

export interface Liquidation {
  id: string;
  tenantId: string;
  cutDate: Date;
  period: string;       // "15 Agosto 2024"
  commissions: string[];
  totalAmount: number;
  status: 'PENDIENTE' | 'APROBADA' | 'PAGADA' | 'REVERTIDA';
  paidAt?: Date;
  receipt?: string;
  createdAt: Date;
}

export class CompensationIntelligence {
  private timelines = new Map<string, CommissionTimelineEntry[]>();
  private liquidations: Liquidation[] = [];
  private cancelledCommissions: string[] = [];

  // ── Timeline ──────────────────────────────────────────────────
  addTimelineEntry(commissionId: string, event: string, detail: string): void {
    const entries = this.timelines.get(commissionId) || [];
    entries.push({ date: new Date(), event, detail });
    this.timelines.set(commissionId, entries);
  }

  getTimeline(commissionId: string): CommissionTimelineEntry[] {
    return this.timelines.get(commissionId) || [];
  }

  // ── Cancelación ──────────────────────────────────────────────
  cancelCommission(commissionId: string, reason: string): boolean {
    if (this.cancelledCommissions.includes(commissionId)) return false;
    this.cancelledCommissions.push(commissionId);
    this.addTimelineEntry(commissionId, 'ANULADA', reason);
    return true;
  }

  isCancelled(commissionId: string): boolean {
    return this.cancelledCommissions.includes(commissionId);
  }

  // ── Liquidación ──────────────────────────────────────────────
  createLiquidation(cutDate: Date, commissionIds: string[], totalAmount: number): Liquidation {
    const months = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
    const liq: Liquidation = {
      id: `liq-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      tenantId: 'interplay',
      cutDate,
      period: `${cutDate.getDate()} ${months[cutDate.getMonth()]} ${cutDate.getFullYear()}`,
      commissions: commissionIds,
      totalAmount,
      status: 'PENDIENTE',
      createdAt: new Date(),
    };
    this.liquidations.push(liq);
    commissionIds.forEach(id => this.addTimelineEntry(id, 'PROGRAMADA', `Asignada a liquidación ${liq.period}`));
    return liq;
  }

  approveLiquidation(id: string): Liquidation | null {
    const liq = this.liquidations.find(l => l.id === id);
    if (!liq || liq.status !== 'PENDIENTE') return null;
    liq.status = 'APROBADA';
    return liq;
  }

  payLiquidation(id: string, receipt?: string): Liquidation | null {
    const liq = this.liquidations.find(l => l.id === id);
    if (!liq || liq.status !== 'APROBADA') return null;
    liq.status = 'PAGADA';
    liq.paidAt = new Date();
    liq.receipt = receipt;
    liq.commissions.forEach(cid => this.addTimelineEntry(cid, 'PAGADA', `Pagada en liquidación ${liq.period}`));
    return liq;
  }

  getLiquidations(): Liquidation[] { return [...this.liquidations]; }

  getAdvisorSummary(commissions: { id: string; state: string; finalAmount: number }[]): {
    waitingInstall: number; waitingInvoice: number; waitingPayment: number;
    liberated: number; nextCutValue: number;
  } {
    return {
      waitingInstall: commissions.filter(c => c.state === 'PENDIENTE').length,
      waitingInvoice: commissions.filter(c => c.state === 'ESPERANDO_FACTURA').length,
      waitingPayment: commissions.filter(c => c.state === 'ESPERANDO_PAGO').length,
      liberated: commissions.filter(c => c.state === 'LIBERADA' || c.state === 'PROGRAMADA').length,
      nextCutValue: commissions.filter(c => c.state === 'LIBERADA' || c.state === 'PROGRAMADA').reduce((s, c) => s + c.finalAmount, 0),
    };
  }
}
