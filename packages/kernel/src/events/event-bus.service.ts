import { Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { DomainEvent } from '../kernel-core.interface';

type EventHandler = (event: DomainEvent) => Promise<void>;

@Injectable()
export class EventBusService {
  private readonly handlers: Map<string, Set<EventHandler>> = new Map();
  private readonly outbox: DomainEvent[] = [];

  async publish(event: Omit<DomainEvent, 'idempotencyKey' | 'timestamp'> & { idempotencyKey?: string }): Promise<void> {
    const fullEvent: DomainEvent = {
      ...event,
      idempotencyKey: event.idempotencyKey ?? uuid(),
      timestamp: new Date(),
    };

    this.outbox.push(fullEvent);

    const eventHandlers = this.handlers.get(event.eventName);
    if (!eventHandlers) return;

    const promises = Array.from(eventHandlers).map((handler) =>
      handler(fullEvent).catch((err) => {
        console.error(`[EventBus] Handler failed for ${event.eventName}:`, err);
      }),
    );
    await Promise.all(promises);
  }

  subscribe(eventName: string, handler: EventHandler): void {
    if (!this.handlers.has(eventName)) {
      this.handlers.set(eventName, new Set());
    }
    this.handlers.get(eventName)!.add(handler);
  }

  subscribeBulk(eventNames: string[], handler: EventHandler): void {
    for (const name of eventNames) {
      this.subscribe(name, handler);
    }
  }

  unsubscribe(eventName: string, handler: EventHandler): void {
    this.handlers.get(eventName)?.delete(handler);
  }

  getOutbox(): DomainEvent[] {
    return [...this.outbox];
  }
}
