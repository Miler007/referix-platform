import { v4 as uuid } from 'uuid';
import { createHash } from 'crypto';
import { IEventStore, StoredEvent, StoreEventParams } from './event-store.interface';

export class InMemoryEventStore implements IEventStore {
  private events: StoredEvent[] = [];

  async store(params: StoreEventParams): Promise<void> {
    const payload = { ...params.event.data };
    const raw = JSON.stringify({ eventName: params.event.eventName, aggregateVersion: params.aggregateVersion, payload });
    const integrityHash = createHash('sha256').update(raw).digest('hex');

    this.events.push({
      id: uuid(),
      tenantId: params.tenantId,
      aggregateType: params.aggregateType,
      aggregateId: params.aggregateId,
      aggregateVersion: params.aggregateVersion,
      eventName: params.event.eventName,
      eventVersion: params.event.eventVersion,
      correlationId: params.event.correlationId,
      causationId: params.event.causationId,
      actorId: params.event.actorId,
      workflowId: params.workflowId ?? null,
      policyIds: params.policyIds ?? [],
      ruleIds: params.ruleIds ?? [],
      integrityHash,
      payload,
      metadata: params.metadata ?? {},
      createdAt: params.event.timestamp,
    });
  }

  async storeBatch(params: StoreEventParams[]): Promise<void> {
    for (const p of params) {
      await this.store(p);
    }
  }

  async findByAggregate(tenantId: string, aggregateType: string, aggregateId: string): Promise<StoredEvent[]> {
    return this.events.filter(e => e.tenantId === tenantId && e.aggregateType === aggregateType && e.aggregateId === aggregateId)
      .sort((a, b) => a.aggregateVersion - b.aggregateVersion);
  }

  async findByCorrelationId(correlationId: string): Promise<StoredEvent[]> {
    return this.events.filter(e => e.correlationId === correlationId)
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }

  async findSince(tenantId: string, since: Date): Promise<StoredEvent[]> {
    return this.events.filter(e => e.tenantId === tenantId && e.createdAt >= since)
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }

  clear(): void {
    this.events = [];
  }
}
