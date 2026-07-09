import { ICommand } from '../bus/command-bus.interface';

export interface OutboxMessage {
  id: string;
  tenantId: string;
  aggregateType: string;
  aggregateId: string;
  eventName: string;
  eventVersion: string;
  payload: Record<string, unknown>;
  correlationId: string | null;
  causationId: string | null;
  actorId: string | null;
  createdAt: Date;
  processedAt: Date | null;
}

export interface IOutbox {
  enqueue(message: Omit<OutboxMessage, 'id' | 'createdAt' | 'processedAt'>): Promise<void>;
  enqueueBatch(messages: Omit<OutboxMessage, 'id' | 'createdAt' | 'processedAt'>[]): Promise<void>;
  getUnprocessed(limit?: number): Promise<OutboxMessage[]>;
  markProcessed(ids: string[]): Promise<void>;
  getFailed(maxRetries?: number): Promise<OutboxMessage[]>;
}
