/**
 * Business Events — eventos entendibles por un gerente, no solo por desarrolladores.
 */

export type BusinessEventType =
  | 'VENTA_LOGRADA' | 'VENTA_PERDIDA' | 'CLIENTE_CONTACTADO'
  | 'COBERTURA_VALIDADA' | 'INSTALACION_AGENDADA' | 'INSTALACION_COMPLETADA'
  | 'SERVICIO_ACTIVADO' | 'FACTURA_EMITIDA' | 'FACTURA_PAGADA'
  | 'COMISION_GENERADA' | 'COMISION_LIBERADA' | 'PAGO_REALIZADO'
  | 'CLIENTE_RECUPERADO' | 'REFERIDOR_DESTACADO' | 'REENVIO_PROGRAMADO';

export interface BusinessEvent {
  type: BusinessEventType;
  title: string;
  description: string;
  timestamp: Date;
  tenantId: string;
  actorId: string;
  actorName: string;
  value: number | null;
  entityType: string;
  entityId: string;
  metadata: Record<string, unknown>;
}

export class BusinessEventBus {
  private events: BusinessEvent[] = [];
  private listeners: Map<BusinessEventType, ((event: BusinessEvent) => void)[]> = new Map();

  emit(event: BusinessEvent): void {
    this.events.push(event);
    const listeners = this.listeners.get(event.type) ?? [];
    listeners.forEach(fn => fn(event));
  }

  on(type: BusinessEventType, listener: (event: BusinessEvent) => void): void {
    const existing = this.listeners.get(type) ?? [];
    existing.push(listener);
    this.listeners.set(type, existing);
  }

  getRecent(limit: number = 20): BusinessEvent[] {
    return this.events.slice(-limit).reverse();
  }

  getByEntity(entityType: string, entityId: string): BusinessEvent[] {
    return this.events.filter(e => e.entityType === entityType && e.entityId === entityId);
  }

  countByType(): Record<string, number> {
    const counts: Record<string, number> = {};
    for (const e of this.events) counts[e.type] = (counts[e.type] ?? 0) + 1;
    return counts;
  }
}

export const businessEvents = new BusinessEventBus();

/**
 * Explainable Business — cada dashboard responde: qué, por qué, impacto, recomendación.
 */
export interface BusinessExplanation {
  what: string;
  why: string;
  impact: string;
  recommendation: string;
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
}

export class ExplainableBusiness {
  explainSalesDrop(previousPeriod: number, currentPeriod: number): BusinessExplanation {
    const drop = previousPeriod > 0 ? ((previousPeriod - currentPeriod) / previousPeriod) * 100 : 0;
    return {
      what: `Las ventas disminuyeron un ${drop.toFixed(1)}% respecto al período anterior`,
      why: 'Revisa la tasa de conversión por etapa del embudo para identificar el cuello de botella',
      impact: `Ingreso estimado no percibido: ${(drop * 100).toFixed(0)} unidades`,
      recommendation: drop > 20 ? 'Activar campaña promocional en zonas de alta cobertura' : 'Monitorear tendencia la próxima semana',
      confidence: 'HIGH',
    };
  }

  explainInstallationDelay(avgDays: number, targetDays: number): BusinessExplanation {
    return {
      what: `Las instalaciones están tomando ${avgDays.toFixed(1)} días en promedio (objetivo: ${targetDays})`,
      why: avgDays > targetDays ? 'Posible cuello de botella en asignación de técnicos' : 'Dentro del SLA esperado',
      impact: `${((avgDays - targetDays) * 10).toFixed(0)} clientes pudieron haber cancelado por demora`,
      recommendation: avgDays > targetDays ? 'Revisar disponibilidad de técnicos en zonas con mayor demanda' : 'Mantener operación actual',
      confidence: 'HIGH',
    };
  }
}

export const explainableBusiness = new ExplainableBusiness();
