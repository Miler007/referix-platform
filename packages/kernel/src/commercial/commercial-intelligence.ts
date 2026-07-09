/**
 * REF-COM-001 — Commercial Intelligence
 * 
 * Centro de Oportunidades + Dashboard Comercial Ejecutivo.
 * Ningún prospecto se pierde por falta de seguimiento.
 */

export type OpportunityReason =
  | 'PRECIO' | 'ESPERANDO_PAGO' | 'COMPARANDO' | 'NO_RESPONDE'
  | 'SIN_DOCUMENTOS' | 'SIN_COBERTURA' | 'LO_PENSARA' | 'HABLAR_FAMILIA'
  | 'ESPERANDO_MUDANZA' | 'QUIERE_MAS_VELOCIDAD' | 'INSTALACION_DESPUES'
  | 'OTRO';

export type OpportunityStatus = 'NUEVA' | 'CONTACTADA' | 'EN_SEGUIMIENTO' | 'CONVERTIDA' | 'PERDIDA';

export interface CommercialOpportunity {
  id: string;
  tenantId: string;
  advisorId: string;
  clientName: string;
  clientPhone: string;
  clientEmail?: string;
  reason: OpportunityReason;
  reasonDetail?: string;
  probability: number;        // 0-100
  followUpDate: Date | null;
  municipality?: string;
  plan?: string;
  status: OpportunityStatus;
  notes: string[];
  createdAt: Date;
  updatedAt: Date;
  convertedAt?: Date;
}

export interface AdvisorDailyAgenda {
  today: Date;
  callsToMake: CommercialOpportunity[];
  pendingFollowUps: CommercialOpportunity[];
  highProbability: CommercialOpportunity[];
  metrics: {
    totalOpportunities: number;
    convertedToday: number;
    conversionRate: number;
    pendingCallbacks: number;
  };
}

export interface CommercialDashboard {
  date: Date;
  salesToday: number;
  salesWeek: number;
  salesMonth: number;
  opportunitiesOpen: number;
  conversionRate: number;
  topPlans: { name: string; count: number }[];
  topAdvisors: { name: string; sales: number }[];
  topMunicipalities: { name: string; sales: number }[];
  byTechnology: { technology: string; sales: number }[];
  reasonsLost: { reason: string; count: number }[];
}

export class CommercialIntelligence {
  private opportunities: CommercialOpportunity[] = [];
  private static reasonsLabels: Record<OpportunityReason, string> = {
    PRECIO: 'Precio', ESPERANDO_PAGO: 'Esperando pago', COMPARANDO: 'Comparando operador',
    NO_RESPONDE: 'No respondió', SIN_DOCUMENTOS: 'Sin documentos', SIN_COBERTURA: 'Sin cobertura',
    LO_PENSARA: 'Lo pensará', HABLAR_FAMILIA: 'Hablar con la familia', ESPERANDO_MUDANZA: 'Esperando mudanza',
    QUIERE_MAS_VELOCIDAD: 'Quiere más velocidad', INSTALACION_DESPUES: 'Instalación más adelante', OTRO: 'Otro',
  };

  static getReasonLabel(reason: OpportunityReason): string {
    return this.reasonsLabels[reason] || reason;
  }

  static getReasons(): { value: OpportunityReason; label: string }[] {
    return Object.entries(this.reasonsLabels).map(([value, label]) => ({ value: value as OpportunityReason, label }));
  }

  // ── Oportunidades ───────────────────────────────────────────────

  createOpportunity(data: Omit<CommercialOpportunity, 'id' | 'createdAt' | 'updatedAt' | 'status'>): CommercialOpportunity {
    const opp: CommercialOpportunity = {
      ...data, id: `opp-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      status: 'NUEVA', notes: [], createdAt: new Date(), updatedAt: new Date(),
    };
    this.opportunities.push(opp);
    return opp;
  }

  updateStatus(id: string, status: OpportunityStatus): void {
    const opp = this.opportunities.find(o => o.id === id);
    if (!opp) return;
    opp.status = status;
    opp.updatedAt = new Date();
    if (status === 'CONVERTIDA') opp.convertedAt = new Date();
  }

  updateFollowUp(id: string, date: Date): void {
    const opp = this.opportunities.find(o => o.id === id);
    if (!opp) return;
    opp.followUpDate = date;
    opp.updatedAt = new Date();
  }

  addNote(id: string, note: string): void {
    const opp = this.opportunities.find(o => o.id === id);
    if (!opp) return;
    opp.notes.push(note);
  }

  getOpportunities(advisorId?: string): CommercialOpportunity[] {
    if (advisorId) return this.opportunities.filter(o => o.advisorId === advisorId);
    return [...this.opportunities];
  }

  // ── Agenda del asesor ───────────────────────────────────────────

  getAdvisorAgenda(advisorId: string): AdvisorDailyAgenda {
    const advisorOpps = this.opportunities.filter(o => o.advisorId === advisorId);
    const today = new Date();
    const todayStr = today.toDateString();
    
    return {
      today,
      callsToMake: advisorOpps.filter(o => o.status === 'EN_SEGUIMIENTO' && o.followUpDate && o.followUpDate <= today),
      pendingFollowUps: advisorOpps.filter(o => o.status !== 'CONVERTIDA' && o.status !== 'PERDIDA'),
      highProbability: advisorOpps.filter(o => o.probability >= 70 && o.status !== 'CONVERTIDA'),
      metrics: {
        totalOpportunities: advisorOpps.length,
        convertedToday: advisorOpps.filter(o => o.status === 'CONVERTIDA' && o.convertedAt?.toDateString() === todayStr).length,
        conversionRate: advisorOpps.length > 0
          ? Math.round((advisorOpps.filter(o => o.status === 'CONVERTIDA').length / advisorOpps.length) * 100) : 0,
        pendingCallbacks: advisorOpps.filter(o => o.status !== 'CONVERTIDA' && o.status !== 'PERDIDA').length,
      },
    };
  }

  // ── Dashboard ejecutivo ─────────────────────────────────────────

  getDashboard(): CommercialDashboard {
    const monthOpps = this.opportunities.filter(o => {
      const monthAgo = new Date(Date.now() - 30 * 86400000);
      return o.createdAt >= monthAgo;
    });

    const lostReasons = monthOpps.filter(o => o.status === 'PERDIDA');
    const reasonsCount: Record<string, number> = {};
    lostReasons.forEach(o => { reasonsCount[o.reason] = (reasonsCount[o.reason] || 0) + 1; });

    const topPlans: Record<string, number> = {};
    monthOpps.filter(o => o.status === 'CONVERTIDA' && o.plan).forEach(o => { topPlans[o.plan!] = (topPlans[o.plan!] || 0) + 1; });

    return {
      date: new Date(),
      salesToday: monthOpps.filter(o => o.status === 'CONVERTIDA' && o.convertedAt?.toDateString() === new Date().toDateString()).length,
      salesWeek: monthOpps.filter(o => o.status === 'CONVERTIDA').length,
      salesMonth: monthOpps.length,
      opportunitiesOpen: monthOpps.filter(o => o.status !== 'CONVERTIDA' && o.status !== 'PERDIDA').length,
      conversionRate: monthOpps.length > 0 ? Math.round((monthOpps.filter(o => o.status === 'CONVERTIDA').length / monthOpps.length) * 100) : 0,
      topPlans: Object.entries(topPlans).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([name, count]) => ({ name, count })),
      topAdvisors: [],
      topMunicipalities: [],
      byTechnology: [],
      reasonsLost: Object.entries(reasonsCount).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([reason, count]) => ({ reason, count })),
    };
  }
}
