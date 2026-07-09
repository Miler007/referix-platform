/**
 * DT-007: Operational Knowledge Base
 * 
 * Cada excepción operativa se registra como conocimiento.
 * Con el tiempo, la plataforma aprende de la operación real.
 */

export interface OperationalException {
  id: string;
  timestamp: Date;
  tenantId: string;
  processType: string;
  entityId: string;
  exception: string;
  rootCause: string;
  resolution: string;
  preventionRule: string | null;
  reportedBy: string;
  tags: string[];
}

export class OperationalKnowledgeBase {
  private exceptions: OperationalException[] = [];

  record(exception: Omit<OperationalException, 'id'>): OperationalException {
    const entry: OperationalException = { ...exception, id: `kb-${Date.now()}-${Math.random().toString(36).slice(2, 6)}` };
    this.exceptions.push(entry);
    return entry;
  }

  findByProcess(processType: string): OperationalException[] {
    return this.exceptions.filter(e => e.processType === processType);
  }

  findByTag(tag: string): OperationalException[] {
    return this.exceptions.filter(e => e.tags.includes(tag));
  }

  getAll(): OperationalException[] {
    return [...this.exceptions];
  }

  getSuggestedRules(): { pattern: string; suggestedRule: string }[] {
    const suggestions: Map<string, { count: number; resolution: string }> = new Map();
    for (const ex of this.exceptions) {
      if (ex.preventionRule) continue;
      const key = `${ex.exception}:${ex.rootCause}`;
      const existing = suggestions.get(key);
      if (existing) {
        existing.count++;
      } else {
        suggestions.set(key, { count: 1, resolution: ex.resolution });
      }
    }
    return Array.from(suggestions.entries())
      .filter(([, v]) => v.count >= 2)
      .map(([k, v]) => ({ pattern: k.split(':')[0]!, suggestedRule: `Auto-resolve: ${v.resolution}` }));
  }

  getGapCount(): number {
    return this.exceptions.length;
  }
}

export const knowledgeBase = new OperationalKnowledgeBase();
