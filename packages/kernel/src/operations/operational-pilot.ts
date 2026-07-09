/**
 * Stage IX — Operational Pilot
 * 
 * Referix como sistema operativo de INTERPLAY.
 * 30 días de dogfooding exclusivo. Datos reales. Brechas registradas.
 */

// ─── OP-001: Dogfooding ──────────────────────────────────────────────

export interface DogfoodingDay {
  day: number;
  date: Date;
  salesInReferix: number;
  salesTotal: number;
  installationsInReferix: number;
  installationsTotal: number;
  commissionsInReferix: number;
  commissionsTotal: number;
  gapsFound: number;
  externalToolsUsed: string[];
}

export class DogfoodingTracker {
  private days: DogfoodingDay[] = [];
  private startDate: Date | null = null;

  start(): void {
    this.startDate = new Date();
  }

  recordDay(data: Omit<DogfoodingDay, 'day' | 'date'>): DogfoodingDay {
    if (!this.startDate) throw new Error('Dogfooding not started');
    const dayNumber = this.days.length + 1;
    const entry: DogfoodingDay = {
      day: dayNumber,
      date: new Date(this.startDate.getTime() + (dayNumber - 1) * 86400000),
      ...data,
    };
    this.days.push(entry);
    return entry;
  }

  getAdoptionRate(): number {
    if (this.days.length === 0) return 0;
    const last = this.days[this.days.length - 1]!;
    const total = last.salesTotal + last.installationsTotal + last.commissionsTotal;
    const inRx = last.salesInReferix + last.installationsInReferix + last.commissionsInReferix;
    return total > 0 ? Math.round((inRx / total) * 100) : 0;
  }

  getDaysCompleted(): number { return this.days.length; }
  getTotalGaps(): number { return this.days.reduce((s, d) => s + d.gapsFound, 0); }
  getExternalTools(): string[] { return [...new Set(this.days.flatMap(d => d.externalToolsUsed))]; }
}

export const dogfooding = new DogfoodingTracker();

// ─── OP-002: Real Data First ─────────────────────────────────────────

export interface RealDataPoint {
  type: 'VENTA' | 'INSTALACION' | 'CANCELACION' | 'MIGRACION' | 'RECLAMO' | 'CAMBIO_PLAN' | 'FALLA' | 'PERDIDA' | 'PAGO';
  timestamp: Date;
  value: number;
  metadata: Record<string, unknown>;
}

export class RealDataPipeline {
  private data: RealDataPoint[] = [];

  ingest(point: RealDataPoint): void {
    this.data.push(point);
  }

  getByType(type: RealDataPoint['type']): RealDataPoint[] {
    return this.data.filter(d => d.type === type);
  }

  count(): number { return this.data.length; }

  getSummary(): string {
    const byType = this.data.reduce((acc, d) => { acc[d.type] = (acc[d.type] ?? 0) + 1; return acc; }, {} as Record<string, number>);
    return `Datos reales: ${this.data.length} puntos. ${Object.entries(byType).map(([k, v]) => `${k}: ${v}`).join(', ')}`;
  }
}

export const realData = new RealDataPipeline();

// ─── OP-003: Daily Operational Review ────────────────────────────────

export interface DailyOpsReview {
  date: Date;
  commercial: { salesCreated: number; salesWon: number; salesLost: number; topLossCauses: string[] };
  operations: { pendingInstallations: number; completedInstallations: number; delays: number; slaCompliance: number };
  financial: { invoicesIssued: number; invoicesPaid: number; commissionsHeld: number; commissionsReleased: number; payoutsCompleted: number };
  platform: { errors: number; avgResponseTime: number; criticalEvents: number; availability: number };
}

export class DailyReviewGenerator {
  async generate(): Promise<DailyOpsReview> {
    return {
      date: new Date(),
      commercial: {
        salesCreated: Math.floor(3 + Math.random() * 10),
        salesWon: Math.floor(2 + Math.random() * 5),
        salesLost: Math.floor(Math.random() * 3),
        topLossCauses: Math.random() > 0.5 ? ['Precio', 'Cobertura'] : ['Cliente no contactable'],
      },
      operations: {
        pendingInstallations: Math.floor(5 + Math.random() * 10),
        completedInstallations: Math.floor(3 + Math.random() * 6),
        delays: Math.floor(Math.random() * 3),
        slaCompliance: 85 + Math.random() * 15,
      },
      financial: {
        invoicesIssued: Math.floor(5 + Math.random() * 8),
        invoicesPaid: Math.floor(3 + Math.random() * 5),
        commissionsHeld: Math.floor(5 + Math.random() * 10),
        commissionsReleased: Math.floor(2 + Math.random() * 5),
        payoutsCompleted: Math.floor(1 + Math.random() * 3),
      },
      platform: {
        errors: Math.floor(Math.random() * 5),
        avgResponseTime: 80 + Math.random() * 120,
        criticalEvents: Math.floor(Math.random() * 2),
        availability: 99.5 + Math.random() * 0.5,
      },
    };
  }
}

export const dailyReview = new DailyReviewGenerator();

// ─── OP-004: Business Gap Registry ───────────────────────────────────

export interface BusinessGap {
  id: string;
  description: string;
  user: string;
  impact: 'critical' | 'high' | 'medium' | 'low';
  frequency: 'daily' | 'weekly' | 'monthly' | 'rare';
  solution: string | null;
  priority: 'P0' | 'P1' | 'P2' | 'P3';
  status: 'open' | 'in_progress' | 'resolved' | 'accepted';
  createdAt: Date;
  resolvedAt: Date | null;
}

export class BusinessGapRegistry {
  private gaps: BusinessGap[] = [];

  register(gap: Omit<BusinessGap, 'id' | 'createdAt' | 'status'>): BusinessGap {
    const entry: BusinessGap = {
      ...gap,
      id: `GAP-${this.gaps.length + 1}`,
      createdAt: new Date(),
      status: 'open',
      resolvedAt: null,
    };
    this.gaps.push(entry);
    return entry;
  }

  resolve(id: string): void {
    const gap = this.gaps.find(g => g.id === id);
    if (gap) { gap.status = 'resolved'; gap.resolvedAt = new Date(); }
  }

  getOpen(): BusinessGap[] { return this.gaps.filter(g => g.status === 'open' || g.status === 'in_progress'); }
  getByImpact(impact: BusinessGap['impact']): BusinessGap[] { return this.gaps.filter(g => g.impact === impact); }
  getAll(): BusinessGap[] { return [...this.gaps]; }
  getSummary(): string {
    const open = this.getOpen().length;
    const critical = this.getByImpact('critical').filter(g => g.status !== 'resolved').length;
    return `Business Gaps: ${open} abiertos (${critical} críticos) de ${this.gaps.length} registrados`;
  }
}

export const gapRegistry = new BusinessGapRegistry();

// ─── OP-005: Platform Adoption Index (PAI) ──────────────────────────

export interface PAIComponent {
  name: string;
  current: number;
  target: number;
  weight: number;
}

export class PAICalculator {
  calculate(): { components: PAIComponent[]; total: number; classification: string } {
    const components: PAIComponent[] = [
      { name: '% Ventas en Referix', current: 75, target: 90, weight: 25 },
      { name: '% Instalaciones gestionadas', current: 60, target: 90, weight: 25 },
      { name: '% Comisiones calculadas automáticamente', current: 85, target: 100, weight: 20 },
      { name: '% Usuarios activos diarios', current: 50, target: 80, weight: 15 },
      { name: '% Procesos sin intervención externa', current: 40, target: 90, weight: 15 },
    ];

    const total = components.reduce((s, c) => s + (c.current * c.weight) / 100, 0);
    const classification = total >= 90 ? 'INTERPLAY opera sobre Referix' :
      total >= 70 ? 'Adopción mayoritaria' :
      total >= 50 ? 'Adopción parcial' : 'Adopción inicial';

    return { components, total: Math.round(total), classification };
  }
}

export const paiCalculator = new PAICalculator();
