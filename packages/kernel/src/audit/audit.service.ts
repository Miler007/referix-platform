import { Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { AuditEntry } from '../kernel-core.interface';

export interface AuditLogOptions {
  userId: string;
  tenantId: string;
  action: string;
  entity: string;
  entityId: string;
  before?: Record<string, unknown> | null;
  after?: Record<string, unknown> | null;
  metadata?: Record<string, unknown>;
  correlationId?: string;
}

@Injectable()
export class AuditService {
  private readonly store: AuditEntry[] = [];

  async log(options: AuditLogOptions): Promise<void> {
    const entry: AuditEntry = {
      id: uuid(),
      tenantId: options.tenantId,
      userId: options.userId,
      action: options.action,
      entity: options.entity,
      entityId: options.entityId,
      before: options.before ?? null,
      after: options.after ?? null,
      metadata: options.metadata ?? {},
      timestamp: new Date(),
      correlationId: options.correlationId ?? uuid(),
    };
    this.store.push(entry);
  }

  async query(filters: {
    tenantId?: string;
    userId?: string;
    action?: string;
    entity?: string;
    from?: Date;
    to?: Date;
    limit?: number;
    offset?: number;
  }): Promise<{ data: AuditEntry[]; total: number }> {
    let filtered = [...this.store];

    if (filters.tenantId) filtered = filtered.filter((e) => e.tenantId === filters.tenantId);
    if (filters.userId) filtered = filtered.filter((e) => e.userId === filters.userId);
    if (filters.action) filtered = filtered.filter((e) => e.action.startsWith(filters.action!));
    if (filters.entity) filtered = filtered.filter((e) => e.entity === filters.entity);
    if (filters.from) filtered = filtered.filter((e) => e.timestamp >= filters.from!);
    if (filters.to) filtered = filtered.filter((e) => e.timestamp <= filters.to!);

    filtered.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    const total = filtered.length;
    const limit = filters.limit ?? 50;
    const offset = filters.offset ?? 0;
    const data = filtered.slice(offset, offset + limit);

    return { data, total };
  }
}
