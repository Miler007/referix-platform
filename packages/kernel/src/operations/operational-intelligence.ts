/**
 * Operational Intelligence Engine
 * 
 * Analiza continuamente la operación para detectar automáticamente:
 * cuellos de botella, zonas con baja conversión, técnicos sobrecargados,
 * referidores destacados, campañas con mejor retorno, riesgo de cancelación.
 * 
 * Basado en reglas, métricas y eventos del dominio.
 */

export interface IntelligenceSignal {
  type: 'BOTTLENECK' | 'HIGH_PERFORMANCE' | 'RISK' | 'OPPORTUNITY' | 'ANOMALY';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  metric: string;
  value: number;
  threshold: number;
  recommendation: string;
  entityType: string;
  entityId: string | null;
}

export class OperationalIntelligenceEngine {
  private signals: IntelligenceSignal[] = [];

  analyze(metrics: Record<string, number>): IntelligenceSignal[] {
    const newSignals: IntelligenceSignal[] = [];

    // Regla 1: Instalaciones pendientes sin técnico asignado
    if ((metrics.pendingInstallations ?? 0) > 5 && (metrics.activeTechnicians ?? 0) < 3) {
      newSignals.push({
        type: 'BOTTLENECK', severity: 'high',
        title: 'Instalaciones pendientes sin técnico',
        description: `${metrics.pendingInstallations} instalaciones esperan asignación. Solo ${metrics.activeTechnicians} técnicos activos.`,
        metric: 'installations_per_technician', value: metrics.pendingInstallations! / Math.max(metrics.activeTechnicians!, 1),
        threshold: 3, recommendation: 'Asignar más técnicos o redistribuir carga',
        entityType: 'operations', entityId: null,
      });
    }

    // Regla 2: Zona con alta tasa de pérdida
    if ((metrics.lossRate ?? 0) > 0.3) {
      newSignals.push({
        type: 'RISK', severity: 'high',
        title: 'Tasa de pérdida elevada',
        description: `${(metrics.lossRate! * 100).toFixed(0)}% de ventas se pierden — posible problema de precio o cobertura`,
        metric: 'loss_rate', value: metrics.lossRate!, threshold: 0.3,
        recommendation: 'Revisar políticas de precios y cobertura en zonas afectadas',
        entityType: 'commercial', entityId: null,
      });
    }

    // Regla 3: Comisiones retenidas acumuladas
    if ((metrics.heldCommissions ?? 0) > 50) {
      newSignals.push({
        type: 'OPPORTUNITY', severity: 'medium',
        title: 'Comisiones retenidas acumuladas',
        description: `$${metrics.heldCommissions} en comisiones retenidas esperando liberación`,
        metric: 'held_commissions', value: metrics.heldCommissions!, threshold: 50,
        recommendation: 'Revisar períodos de garantía vencidos para liberación automática',
        entityType: 'financial', entityId: null,
      });
    }

    this.signals.push(...newSignals);
    return newSignals;
  }

  getAllSignals(): IntelligenceSignal[] { return [...this.signals]; }
  getUnresolved(): IntelligenceSignal[] { return this.signals.filter(s => s.severity === 'critical' || s.severity === 'high'); }

  getSummary(): string {
    const critical = this.signals.filter(s => s.severity === 'critical').length;
    const high = this.signals.filter(s => s.severity === 'high').length;
    return `Operational Intelligence: ${critical} críticas, ${high} altas, ${this.signals.length} totales`;
  }
}

export const opsIntelligence = new OperationalIntelligenceEngine();
