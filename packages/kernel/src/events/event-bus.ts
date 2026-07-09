export type EventType = 'domain' | 'integration';

export interface ReferixEvent {
  id: string;
  type: EventType;
  name: string;
  version: string;
  source: string;
  tenantId: string;
  correlationId: string;
  causationId?: string;
  actorId?: string;
  aggregateType: string;
  aggregateId: string;
  timestamp: Date;
  data: Record<string, unknown>;
  metadata?: Record<string, unknown>;
}

export interface EventHandler {
  readonly eventName: string;
  handle(event: ReferixEvent): Promise<void>;
}

export class EventBus {
  private handlers = new Map<string, EventHandler[]>();
  private history: ReferixEvent[] = [];

  register(handler: EventHandler): void {
    const handlers = this.handlers.get(handler.eventName) ?? [];
    handlers.push(handler);
    this.handlers.set(handler.eventName, handlers);
  }

  async publish(event: ReferixEvent): Promise<void> {
    this.history.push(event);
    const handlers = this.handlers.get(event.name) ?? [];
    await Promise.all(handlers.map(h => h.handle(event).catch(err => {
      console.error(`[EventBus] Handler ${h.constructor?.name ?? 'unknown'} failed for ${event.name}:`, err);
    })));
  }

  async publishBatch(events: ReferixEvent[]): Promise<void> {
    await Promise.all(events.map(e => this.publish(e)));
  }

  getHistory(aggregateId?: string): ReferixEvent[] {
    if (aggregateId) return this.history.filter(e => e.aggregateId === aggregateId);
    return [...this.history];
  }
}

export const eventBus = new EventBus();
