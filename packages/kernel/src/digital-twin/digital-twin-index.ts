/**
 * BDTI — Business Digital Twin Index
 * 
 * Mide qué tan fielmente Referix representa la operación real de INTERPLAY.
 */

export interface BDTIComponent {
  name: string;
  weight: number;
  current: number;
  target: number;
  findings: string[];
}

export class BDTICalculator {
  calculate(): { components: BDTIComponent[]; total: number; classification: string } {
    const components: BDTIComponent[] = [
      {
        name: 'Cobertura proceso comercial',
        weight: 20,
        current: 75,
        target: 90,
        findings: [
          '✅ Lead → Referral → Coverage → Subscription: completo',
          '⚠️ No todos los orígenes (WhatsApp, Facebook) están diferenciados en el modelo actual',
        ],
      },
      {
        name: 'Cobertura operacional',
        weight: 20,
        current: 60,
        target: 85,
        findings: [
          '✅ Installation + Technician + Dispatch existen',
          '⚠️ GPS tracking no implementado',
          '⚠️ Offline mode no implementado en operaciones',
        ],
      },
      {
        name: 'Cobertura financiera',
        weight: 15,
        current: 70,
        target: 85,
        findings: [
          '✅ Invoice + Payment + Commission + Wallet completos',
          '⚠️ Integración bancaria no implementada',
        ],
      },
      {
        name: 'Explicabilidad',
        weight: 15,
        current: 65,
        target: 90,
        findings: [
          '✅ DecisionLog en aggregates',
          '✅ ExplainableDomain',
          '⚠️ No todas las decisiones tienen explicación en lenguaje de negocio',
        ],
      },
      {
        name: 'Reproducibilidad',
        weight: 15,
        current: 50,
        target: 85,
        findings: [
          '✅ Event Store almacena todos los eventos',
          '⚠️ Business Replay existe pero no probado con datos reales',
          '⚠️ No hay interfaz de reproducción',
        ],
      },
      {
        name: 'Inteligencia operacional',
        weight: 10,
        current: 35,
        target: 75,
        findings: [
          '✅ Journey Analytics engine creado',
          '⚠️ Operational Heatmap no implementado en UI',
          '⚠️ Knowledge Base existe pero sin datos',
        ],
      },
      {
        name: 'Calidad del historial',
        weight: 5,
        current: 80,
        target: 95,
        findings: [
          '✅ Event versioning',
          '✅ Wallet ledger inmutable',
          '✅ Audit trail en aggregates',
        ],
      },
    ];

    const total = components.reduce((sum, c) => sum + (c.current * c.weight) / 100, 0);

    const classification = total >= 91 ? 'Representación empresarial completa' :
      total >= 71 ? 'Gemelo digital confiable' :
      total >= 41 ? 'Modelo útil' : 'Modelo incompleto';

    return { components, total: Math.round(total), classification };
  }
}

export const bdtiCalculator = new BDTICalculator();
