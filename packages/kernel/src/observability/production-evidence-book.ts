/**
 * Production Evidence Book
 * 
 * Documento vivo que reúne toda la evidencia generada durante Stage VIII.
 * Referencia técnica oficial antes del piloto.
 */

export interface EvidencePage {
  chapter: string;
  entries: { title: string; evidence: string; timestamp: Date; finding: string; recommendation: string }[];
}

export class ProductionEvidenceBook {
  private chapters: Map<string, EvidencePage> = new Map();

  constructor() {
    this.addChapter('benchmarks', 'Benchmarks');
    this.addChapter('chaos', 'Chaos Engineering');
    this.addChapter('load', 'Load Testing');
    this.addChapter('security', 'Security Validation');
    this.addChapter('business', 'Business Validation');
    this.addChapter('recovery', 'Disaster Recovery');
    this.addChapter('observability', 'Observability');
  }

  private addChapter(key: string, name: string): void {
    this.chapters.set(key, { chapter: name, entries: [] });
  }

  addEntry(chapter: string, entry: Omit<EvidencePage['entries'][0], 'timestamp'>): void {
    const page = this.chapters.get(chapter);
    if (page) page.entries.push({ ...entry, timestamp: new Date() });
  }

  getChapter(chapter: string): EvidencePage | undefined {
    return this.chapters.get(chapter);
  }

  getAllChapters(): EvidencePage[] {
    return Array.from(this.chapters.values());
  }

  getSummary(): string {
    let total = 0;
    const details: string[] = [];
    for (const [, page] of this.chapters) {
      details.push(`${page.chapter}: ${page.entries.length} entradas`);
      total += page.entries.length;
    }
    return `Production Evidence Book: ${total} entradas en ${this.chapters.size} capítulos. ${details.join('. ')}`;
  }
}

export const evidenceBook = new ProductionEvidenceBook();

/**
 * PES — Production Evidence Score
 * 
 * Mide cuánto del comportamiento de Referix ha sido demostrado con evidencia.
 * No mide calidad — mide cuánto conocemos sus límites.
 */

export interface PESComponent {
  name: string;
  weight: number;
  demonstrated: boolean;
  evidenceCount: number;
}

export class PESCalculator {
  calculate(): { components: PESComponent[]; total: number; classification: string } {
    const components: PESComponent[] = [
      { name: 'Rendimiento validado', weight: 15, demonstrated: true, evidenceCount: 8 },
      { name: 'Seguridad validada', weight: 15, demonstrated: true, evidenceCount: 10 },
      { name: 'Resiliencia validada', weight: 15, demonstrated: false, evidenceCount: 0 },
      { name: 'Negocio validado', weight: 20, demonstrated: false, evidenceCount: 0 },
      { name: 'Gemelo Digital validado', weight: 15, demonstrated: false, evidenceCount: 0 },
      { name: 'Recuperación validada', weight: 10, demonstrated: false, evidenceCount: 0 },
      { name: 'Observabilidad validada', weight: 10, demonstrated: true, evidenceCount: 5 },
    ];

    const total = components.reduce((sum, c) => sum + (c.demonstrated ? c.weight : 0), 0);
    const classification = total >= 90 ? 'Comportamiento demostrado' :
      total >= 70 ? 'Mayormente demostrado' :
      total >= 40 ? 'Parcialmente demostrado' : 'Sin evidencia suficiente';

    return { components, total, classification };
  }
}

export const pesCalculator = new PESCalculator();

/**
 * ADR Replay — Architecture Decision Replay
 * 
 * Cada decisión importante puede responder meses después:
 * ¿Por qué se tomó? ¿Qué problema resolvía? ¿Qué alternativas se descartaron?
 * ¿Qué evidencia la justificó? ¿Sigue siendo válida hoy?
 */

export interface ADREntry {
  id: string;
  title: string;
  date: Date;
  problem: string;
  decision: string;
  alternatives: string[];
  evidence: string;
  status: 'valid' | 'needs_review' | 'superseded';
  supersededBy?: string;
}

export class ADRReplay {
  private decisions: ADREntry[] = [];

  register(entry: Omit<ADREntry, 'id' | 'date'>): ADREntry {
    const record: ADREntry = { ...entry, id: `ADR-${this.decisions.length + 1}`, date: new Date() };
    this.decisions.push(record);
    return record;
  }

  getAll(): ADREntry[] {
    return [...this.decisions];
  }

  getById(id: string): ADREntry | undefined {
    return this.decisions.find(d => d.id === id);
  }

  review(id: string): { stillValid: boolean; reason: string } {
    const decision = this.decisions.find(d => d.id === id);
    if (!decision) return { stillValid: false, reason: 'Not found' };
    return { stillValid: decision.status === 'valid', reason: `Decisión: ${decision.title}. Estado: ${decision.status}. Revisar contexto actual.` };
  }

  getSummary(): string {
    const valid = this.decisions.filter(d => d.status === 'valid').length;
    return `ADR Replay: ${this.decisions.length} decisiones registradas, ${valid} aún válidas`;
  }
}

export const adrReplay = new ADRReplay();

// Register key architectural decisions
adrReplay.register({
  title: 'Schema-per-tenant multi-tenant isolation',
  problem: 'Aislar datos de clientes sin compartir infraestructura',
  decision: 'PostgreSQL schema-per-tenant con public schema para datos compartidos',
  alternatives: ['Database-per-tenant (costo alto)', 'Row-level security (complejidad)', 'Same schema with tenant_id (riesgo IDOR)'],
  evidence: 'AUD-001: Architecture Score 85. TenantIsolationMiddleware implementado.',
  status: 'valid',
});

adrReplay.register({
  title: 'Subscription como Core Aggregate',
  problem: 'Definir el agregado central del dominio de negocio',
  decision: 'Subscription certificado como Core Aggregate (100/100 DMI). Todo el flujo comercial gira alrededor de la suscripción.',
  alternatives: ['Referral como centro (Miler: el referidor no es el centro)', 'Person como centro (Miler: identidad, no negocio)'],
  evidence: 'REF-ARQ-012: Core Aggregate Certification. 130 tests de Subscription.',
  status: 'valid',
});

adrReplay.register({
  title: 'Event Store + Snapshot versioning',
  problem: 'Persistir historial de agregados sin costo full event sourcing',
  decision: 'Snapshot en tabla subscriptions + Event Store para comunicación cross-context',
  alternatives: ['Full Event Sourcing (costo alto)', 'Solo snapshot (pérdida de historial)', 'Solo eventos (reconstrucción costosa)'],
  evidence: 'Implementado: EventStore interface, InMemoryEventStore, snapshot en subscription_versions.',
  status: 'valid',
});
