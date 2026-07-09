/**
 * ERI — Enterprise Readiness Index
 * 
 * Indicador compuesto que representa el estado real del producto
 * para determinar si está listo para operación empresarial.
 */

export interface ERIComponent {
  name: string;
  weight: number;
  score: number;
  source: string;
}

export class ERICalculator {
  calculate(): { components: ERIComponent[]; total: number; classification: string } {
    const components: ERIComponent[] = [
      { name: 'Arquitectura', weight: 15, score: 85, source: 'AUD-001' },
      { name: 'Seguridad', weight: 15, score: 65, source: 'AUD-003 + EH-004' },
      { name: 'Performance', weight: 15, score: 50, source: 'AUD-002 + EH-002 + EH-006' },
      { name: 'Observabilidad', weight: 10, score: 45, source: 'AUD-006 + EH-001' },
      { name: 'Operación', weight: 15, score: 40, source: 'PRI + OCI-2' },
      { name: 'Gemelo Digital', weight: 10, score: 63, source: 'BDTI' },
      { name: 'Experiencia', weight: 10, score: 50, source: 'AUD-004 + Stage IV' },
      { name: 'Calidad', weight: 5, score: 60, source: 'Cobertura de pruebas + deuda técnica' },
      { name: 'Resiliencia', weight: 5, score: 30, source: 'EH-005 + EH-007' },
    ];

    const total = components.reduce((sum, c) => sum + (c.score * c.weight) / 100, 0);

    const classification = total >= 95 ? 'World Class' :
      total >= 85 ? 'Enterprise Ready' :
      total >= 70 ? 'Production Candidate' :
      total >= 50 ? 'Beta' : 'Experimental';

    return { components, total: Math.round(total), classification };
  }
}

export const eriCalculator = new ERICalculator();
