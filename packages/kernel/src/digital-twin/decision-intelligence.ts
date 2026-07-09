/**
 * DT-004: Decision Intelligence
 * 
 * Cada decisión de negocio registra: quién, por qué, con qué información,
 * qué regla se aplicó y qué consecuencias tuvo.
 */

export interface BusinessDecision {
  id: string;
  timestamp: Date;
  actorId: string;
  actorName: string;
  decisionType: string;
  description: string;
  reasoning: string;
  context: {
    entityType: string;
    entityId: string;
    stateBefore: string;
    stateAfter: string;
  };
  policiesApplied: string[];
  rulesEvaluated: string[];
  workflowStep: string | null;
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
  impact: string | null;
  duration: number;
}

export class DecisionIntelligence {
  private decisions: BusinessDecision[] = [];
  private static nextId = 1;

  record(decision: Omit<BusinessDecision, 'id'>): BusinessDecision {
    const record: BusinessDecision = { ...decision, id: `dec-${DecisionIntelligence.nextId++}` };
    this.decisions.push(record);
    return record;
  }

  getByEntity(entityType: string, entityId: string): BusinessDecision[] {
    return this.decisions.filter(d => d.context.entityType === entityType && d.context.entityId === entityId)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  getByActor(actorId: string): BusinessDecision[] {
    return this.decisions.filter(d => d.actorId === actorId);
  }

  getByType(type: string): BusinessDecision[] {
    return this.decisions.filter(d => d.decisionType === type);
  }

  getAll(): BusinessDecision[] {
    return [...this.decisions];
  }

  explain(decisionId: string): string {
    const d = this.decisions.find(dec => dec.id === decisionId);
    if (!d) return 'Decisión no encontrada';

    const lines = [
      `📋 Decisión: ${d.decisionType}`,
      `👤 Actor: ${d.actorName} (${d.actorId})`,
      `📝 Descripción: ${d.description}`,
      `💡 Razonamiento: ${d.reasoning}`,
      `📊 Estado anterior: ${d.context.stateBefore} → ${d.context.stateAfter}`,
      `📏 Políticas aplicadas: ${d.policiesApplied.join(', ') || 'Ninguna'}`,
      `📐 Reglas evaluadas: ${d.rulesEvaluated.join(', ') || 'Ninguna'}`,
      `⏱ Duración: ${d.duration}ms`,
      `🎯 Impacto: ${d.impact ?? 'No registrado'}`,
    ];
    return lines.join('\n');
  }
}

export const decisionIntelligence = new DecisionIntelligence();
