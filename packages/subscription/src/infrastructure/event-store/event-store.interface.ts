import { DomainEvent } from '../../domain/events';

export interface StoredEvent {
  id: string;
  tenantId: string;
  aggregateType: string;
  aggregateId: string;
  aggregateVersion: number;
  eventName: string;
  eventVersion: string;
  correlationId: string | null;
  causationId: string | null;
  actorId: string | null;
  workflowId: string | null;
  policyIds: string[];
  ruleIds: string[];
  integrityHash: string | null;
  payload: Record<string, unknown>;
  metadata: Record<string, unknown>;
  createdAt: Date;
}

export interface StoreEventParams {
  tenantId: string;
  aggregateType: string;
  aggregateId: string;
  aggregateVersion: number;
  event: DomainEvent;
  workflowId?: string | null;
  policyIds?: string[];
  ruleIds?: string[];
  metadata?: Record<string, unknown>;
}

export interface IEventStore {
  store(params: StoreEventParams): Promise<void>;
  storeBatch(params: StoreEventParams[]): Promise<void>;
  findByAggregate(tenantId: string, aggregateType: string, aggregateId: string): Promise<StoredEvent[]>;
  findByCorrelationId(correlationId: string): Promise<StoredEvent[]>;
  findSince(tenantId: string, since: Date): Promise<StoredEvent[]>;
}
