/**
 * Pilot Confidence Score (PCS)
 * 
 * Indicador específico para decidir si el piloto puede ampliarse.
 * 0–49: No continuar | 50–69: Restringido | 70–84: Ampliado | 85–100: Clientes externos
 */

export interface PCSComponent {
  name: string;
  weight: number;
  score: number;
  evidence: string;
}

export class PilotConfidenceScore {
  calculate(overrides?: Partial<PCSComponent>[]): { components: PCSComponent[]; total: number; classification: string } {
    const defaults: PCSComponent[] = [
      { name: 'Estabilidad', weight: 20, score: 50, evidence: 'Incidentes críticos: 0 en 7 días' },
      { name: 'Rendimiento', weight: 15, score: 45, evidence: 'P95 < 500ms en flujos principales' },
      { name: 'Seguridad', weight: 15, score: 65, evidence: '0 vulnerabilidades críticas abiertas' },
      { name: 'Experiencia', weight: 15, score: 40, evidence: 'Usuarios completan tareas sin asistencia' },
      { name: 'Exactitud del negocio', weight: 15, score: 55, evidence: 'BDTI 63/100' },
      { name: 'Calidad de datos', weight: 10, score: 60, evidence: 'Event Store íntegro, Wallet ledger inmutable' },
      { name: 'Incidentes', weight: 5, score: 70, evidence: '2 incidentes mayores, 0 críticos' },
      { name: 'Satisfacción usuarios', weight: 5, score: 30, evidence: 'Sin encuesta aún' },
    ];

    const components = defaults.map((c, i) => overrides?.[i] ? { ...c, ...overrides[i] } : c);
    const total = components.reduce((sum, c) => sum + (c.score * c.weight) / 100, 0);

    const classification = total >= 85 ? 'Listo para clientes externos' :
      total >= 70 ? 'Piloto ampliado' :
      total >= 50 ? 'Piloto restringido' : 'No continuar';

    return { components, total: Math.round(total), classification };
  }
}

export const pcsCalculator = new PilotConfidenceScore();
