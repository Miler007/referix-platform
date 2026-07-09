/**
 * Evidence Repository
 * 
 * Todo resultado de Stage VII se almacena aquí: benchmarks, reportes,
 * métricas, capturas, dashboards, tests, incidentes, correcciones.
 */

export type EvidenceType = 'benchmark' | 'report' | 'metric' | 'screenshot' | 'dashboard' | 'test_result' | 'incident' | 'fix';

export interface EvidenceEntry {
  id: string;
  type: EvidenceType;
  title: string;
  description: string;
  source: string;
  timestamp: Date;
  data: Record<string, unknown>;
  tags: string[];
}

export class EvidenceRepository {
  private entries: EvidenceEntry[] = [];

  record(entry: Omit<EvidenceEntry, 'id'>): EvidenceEntry {
    const record: EvidenceEntry = { ...entry, id: `ev-${Date.now()}-${Math.random().toString(36).slice(2, 6)}` };
    this.entries.push(record);
    return record;
  }

  findByType(type: EvidenceType): EvidenceEntry[] {
    return this.entries.filter(e => e.type === type);
  }

  findByTag(tag: string): EvidenceEntry[] {
    return this.entries.filter(e => e.tags.includes(tag));
  }

  getAll(): EvidenceEntry[] {
    return [...this.entries];
  }

  getSummary(): string {
    const byType = this.entries.reduce((acc, e) => { acc[e.type] = (acc[e.type] ?? 0) + 1; return acc; }, {} as Record<string, number>);
    return `Evidence Repository: ${this.entries.length} entradas. Tipos: ${JSON.stringify(byType)}`;
  }
}

export const evidenceRepo = new EvidenceRepository();
