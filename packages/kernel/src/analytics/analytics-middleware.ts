export interface AnalyticsEvent {
  event: string;
  tenantId: string;
  actorId: string;
  sessionId: string;
  timestamp: Date;
  properties: Record<string, unknown>;
  duration?: number;
}

export interface IAnalyticsCollector {
  track(event: AnalyticsEvent): Promise<void>;
  getMetric(name: string, tenantId: string, from: Date, to: Date): Promise<number>;
}

export class AnalyticsMiddleware {
  constructor(private readonly collector: IAnalyticsCollector) {}

  createEvent(action: string, tenantId: string, actorId: string, properties: Record<string, unknown> = {}): AnalyticsEvent {
    return {
      event: action,
      tenantId,
      actorId,
      sessionId: this.getSessionId(),
      timestamp: new Date(),
      properties,
    };
  }

  async track(event: AnalyticsEvent): Promise<void> {
    await this.collector.track(event);
  }

  private getSessionId(): string {
    return crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  }
}
