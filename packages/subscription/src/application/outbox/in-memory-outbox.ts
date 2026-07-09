import { v4 as uuid } from 'uuid';
import { IOutbox, OutboxMessage } from './outbox.interface';

export class InMemoryOutbox implements IOutbox {
  private messages: OutboxMessage[] = [];
  private failCounts = new Map<string, number>();
  private static MAX_RETRIES = 3;

  async enqueue(message: Omit<OutboxMessage, 'id' | 'createdAt' | 'processedAt'>): Promise<void> {
    this.messages.push({
      ...message,
      id: uuid(),
      createdAt: new Date(),
      processedAt: null,
    });
  }

  async enqueueBatch(messages: Omit<OutboxMessage, 'id' | 'createdAt' | 'processedAt'>[]): Promise<void> {
    for (const msg of messages) {
      await this.enqueue(msg);
    }
  }

  async getUnprocessed(limit: number = 50): Promise<OutboxMessage[]> {
    return this.messages
      .filter(m => m.processedAt === null)
      .slice(0, limit);
  }

  async markProcessed(ids: string[]): Promise<void> {
    const now = new Date();
    for (const msg of this.messages) {
      if (ids.includes(msg.id)) {
        msg.processedAt = now;
      }
    }
  }

  async getFailed(maxRetries: number = InMemoryOutbox.MAX_RETRIES): Promise<OutboxMessage[]> {
    return this.messages.filter(m => {
      if (m.processedAt) return false;
      const count = this.failCounts.get(m.id) ?? 0;
      return count >= maxRetries;
    });
  }

  recordFailure(id: string): void {
    this.failCounts.set(id, (this.failCounts.get(id) ?? 0) + 1);
  }

  clear(): void {
    this.messages = [];
    this.failCounts.clear();
  }
}
