/**
 * DT-001: Customer Journey Engine
 * 
 * Reconstruye la narrativa completa de cualquier operación desde los 
 * eventos de dominio, transformando estados técnicos en una historia 
 * de negocio entendible por cualquier persona.
 */

export interface JourneyStep {
  sequence: number;
  timestamp: Date;
  actor: string;
  action: string;           // Business language, e.g., "Registró la venta"
  detail: string;           // What happened in business terms
  duration?: string;        // Time since previous step
  milestone: boolean;       // Is this a key milestone?
  context: {                // Links to domain entities
    entityType: string;
    entityId: string;
    eventName: string;
  };
}

export interface CustomerJourney {
  journeyId: string;
  businessType: 'VENTA' | 'INSTALACION' | 'ACTIVACION' | 'FACTURACION' | 'COMISION' | 'PAGO';
  title: string;
  stages: JourneyStep[];
  status: string;
  totalDuration: string;
  milestones: { total: number; achieved: number; remaining: number };
}

const journeyMappers: Record<string, (event: any, prev?: JourneyStep) => JourneyStep> = {
  'referral.registered': (e) => ({
    sequence: 0, timestamp: e.timestamp, actor: e.fullName ?? 'Referidor',
    action: 'Registró un prospecto',
    detail: `${e.fullName ?? 'El referidor'} registró a un nuevo cliente como prospecto`,
    milestone: true,
    context: { entityType: 'referral', entityId: e.referralId ?? e.referidorId, eventName: 'referral.registered' },
  }),
  'referral.contacted': (e, prev) => ({
    sequence: 1, timestamp: e.timestamp, actor: 'Sistema',
    action: 'Contactó al cliente',
    detail: 'El cliente fue contactado exitosamente',
    duration: prev ? formatDuration(e.timestamp - prev.timestamp) : undefined,
    milestone: true,
    context: { entityType: 'referral', entityId: e.referralId, eventName: 'referral.contacted' },
  }),
  'referral.qualified': (e, prev) => ({
    sequence: 2, timestamp: e.timestamp, actor: 'Sistema de cobertura',
    action: 'Validó cobertura',
    detail: 'Cobertura confirmada y datos completos',
    duration: prev ? formatDuration(e.timestamp - prev.timestamp) : undefined,
    milestone: true,
    context: { entityType: 'referral', entityId: e.referralId, eventName: 'referral.qualified' },
  }),
  'referral.won': (e, prev) => ({
    sequence: 3, timestamp: e.timestamp, actor: 'Cliente',
    action: 'Aceptó la contratación',
    detail: 'El cliente aceptó el servicio y la negociación fue exitosa',
    duration: prev ? formatDuration(e.timestamp - prev.timestamp) : undefined,
    milestone: true,
    context: { entityType: 'referral', entityId: e.referralId, eventName: 'referral.won' },
  }),
  'subscription.created': (e, prev) => ({
    sequence: 4, timestamp: e.timestamp, actor: 'Sistema',
    action: 'Creó la suscripción',
    detail: `Suscripción ${e.subscriptionId ?? ''} creada con plan ${e.planId ?? ''}`,
    duration: prev ? formatDuration(e.timestamp - prev.timestamp) : undefined,
    milestone: true,
    context: { entityType: 'subscription', entityId: e.subscriptionId, eventName: 'subscription.created' },
  }),
  'installation.scheduled': (e, prev) => ({
    sequence: 5, timestamp: e.timestamp, actor: 'Coordinador',
    action: 'Agendó la instalación',
    detail: `Instalación programada para el día ${e.scheduledDate ? new Date(e.scheduledDate).toLocaleDateString() : 'pendiente'}`,
    duration: prev ? formatDuration(e.timestamp - prev.timestamp) : undefined,
    milestone: true,
    context: { entityType: 'installation', entityId: e.installationId, eventName: 'installation.scheduled' },
  }),
  'installation.completed': (e, prev) => ({
    sequence: 6, timestamp: e.timestamp, actor: 'Técnico',
    action: 'Completó la instalación',
    detail: 'Instalación finalizada con éxito. Evidencia registrada.',
    duration: prev ? formatDuration(e.timestamp - prev.timestamp) : undefined,
    milestone: true,
    context: { entityType: 'installation', entityId: e.installationId, eventName: 'installation.completed' },
  }),
  'subscription.activated': (e, prev) => ({
    sequence: 7, timestamp: e.timestamp, actor: 'Sistema',
    action: 'Activó el servicio',
    detail: `Servicio activado exitosamente`,
    duration: prev ? formatDuration(e.timestamp - prev.timestamp) : undefined,
    milestone: true,
    context: { entityType: 'subscription', entityId: e.subscriptionId, eventName: 'subscription.activated' },
  }),
  'referral.lost': (e, prev) => ({
    sequence: 99, timestamp: e.timestamp, actor: 'Sistema',
    action: 'Venta perdida',
    detail: `Motivo: ${e.lostDescription ?? e.reason ?? 'No especificado'}`,
    duration: prev ? formatDuration(e.timestamp - prev.timestamp) : undefined,
    milestone: true,
    context: { entityType: 'referral', entityId: e.referralId, eventName: 'referral.lost' },
  }),
};

export class CustomerJourneyEngine {
  buildJourney(events: any[], businessType: CustomerJourney['businessType'] = 'VENTA'): CustomerJourney {
    const steps: JourneyStep[] = [];
    let prevStep: JourneyStep | undefined;

    for (const event of events) {
      const mapper = journeyMappers[event.eventName];
      if (mapper) {
        const step = mapper(event, prevStep);
        steps.push(step);
        prevStep = step;
      }
    }

    const totalDuration = steps.length > 1 && steps[steps.length - 1] && steps[0]
      ? formatDuration(steps[steps.length - 1]!.timestamp.getTime() - steps[0]!.timestamp.getTime())
      : 'N/A';

    const milestones = steps.filter(s => s.milestone);
    const achieved = milestones.filter(s => s.action !== 'Venta perdida');

    return {
      journeyId: `journey-${events[0]?.referralId ?? events[0]?.subscriptionId ?? Date.now()}`,
      businessType,
      title: this.getTitle(businessType),
      stages: steps,
      status: steps.some(s => s.action.includes('perdida')) ? 'PERDIDA' :
              steps.some(s => s.action.includes('pagó')) ? 'COMPLETADA' :
              steps.some(s => s.action.includes('Activó')) ? 'ACTIVA' : 'EN_PROGRESO',
      totalDuration,
      milestones: { total: milestones.length, achieved: achieved.length, remaining: milestones.length - achieved.length },
    };
  }

  private getTitle(type: CustomerJourney['businessType']): string {
    const titles: Record<string, string> = {
      VENTA: 'Ciclo completo de venta',
      INSTALACION: 'Proceso de instalación',
      ACTIVACION: 'Activación del servicio',
      FACTURACION: 'Ciclo de facturación',
      COMISION: 'Generación de comisión',
      PAGO: 'Pago al referidor',
    };
    return titles[type] ?? 'Proceso';
  }
}

function formatDuration(ms: number): string {
  const minutes = Math.floor(ms / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  if (days > 0) return `${days}d ${hours % 24}h`;
  if (hours > 0) return `${hours}h ${minutes % 60}min`;
  return `${minutes}min`;
}

export const journeyEngine = new CustomerJourneyEngine();
