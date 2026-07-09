/**
 * DT-003: Business Replay
 * 
 * Permite reproducir paso a paso cualquier operación comercial,
 * reconstruyendo el estado del sistema en cada momento.
 */

export interface ReplayFrame {
  timestamp: Date;
  stepNumber: number;
  eventName: string;
  businessAction: string;
  systemState: Record<string, unknown>;
  decision: DecisionSnapshot | null;
  duration: string;
}

export interface DecisionSnapshot {
  actorId: string;
  action: string;
  reason: string;
  policies: string[];
  rules: string[];
  workflowTransition: string | null;
  timestamp: Date;
}

export class BusinessReplay {
  private frameCache = new Map<string, ReplayFrame[]>();

  buildFrames(events: any[], decisions: any[] = []): ReplayFrame[] {
    const frames: ReplayFrame[] = [];
    let stepNumber = 0;

    for (const event of events) {
      const relatedDecisions = decisions.filter((d: any) =>
        Math.abs(new Date(d.timestamp).getTime() - new Date(event.timestamp).getTime()) < 5000
      );

      const frame: ReplayFrame = {
        timestamp: event.timestamp,
        stepNumber: ++stepNumber,
        eventName: event.eventName,
        businessAction: this.toBusinessAction(event),
        systemState: event.data ?? {},
        decision: relatedDecisions[0] ? {
          actorId: relatedDecisions[0].actorId ?? event.actorId,
          action: relatedDecisions[0].action,
          reason: relatedDecisions[0].reason ?? '',
          policies: relatedDecisions[0].policies ?? [],
          rules: relatedDecisions[0].rules ?? [],
          workflowTransition: relatedDecisions[0].workflowTransition ?? null,
          timestamp: relatedDecisions[0].timestamp,
        } : null,
        duration: stepNumber > 1 && frames[stepNumber - 2]
          ? `${Math.round((new Date(event.timestamp).getTime() - new Date(frames[stepNumber - 2]!.timestamp).getTime()) / 1000)}s`
          : '0s',
      };

      frames.push(frame);
    }

    const key = `replay-${events[0]?.referralId ?? events[0]?.subscriptionId ?? Date.now()}`;
    this.frameCache.set(key, frames);
    return frames;
  }

  getFrames(key: string): ReplayFrame[] {
    return this.frameCache.get(key) ?? [];
  }

  private toBusinessAction(event: any): string {
    const map: Record<string, string> = {
      'referral.registered': 'Prospecto registrado',
      'referral.contacted': 'Cliente contactado',
      'referral.qualified': 'Cobertura validada',
      'referral.won': 'Venta cerrada',
      'referral.lost': 'Venta perdida',
      'subscription.created': 'Suscripción creada',
      'subscription.activated': 'Servicio activado',
      'installation.scheduled': 'Instalación agendada',
      'installation.completed': 'Instalación completada',
      'invoice.paid': 'Factura pagada',
      'commission.generated': 'Comisión generada',
      'commission.paid': 'Comisión pagada',
      'payout.completed': 'Pago al referidor completado',
    };
    return map[event.eventName] ?? event.eventName;
  }
}

export const businessReplay = new BusinessReplay();
