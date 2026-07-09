import { IReadModelRepository, PaginatedReadModelResult } from './read-model-repository.interface';
import { SubscriptionReadModel } from './subscription.read-model';
import { TimelineEntry } from './timeline-entry.read-model';
import { HealthReadModel } from './health.read-model';
import { HistoryEntry } from './history-entry.read-model';
import { ISubscriptionRepository } from '../../domain/repository.interface';
import { IEventStore } from '../../infrastructure/event-store/event-store.interface';

export class InMemoryReadModelRepository implements IReadModelRepository {
  constructor(
    private readonly domainRepo: ISubscriptionRepository,
    private readonly eventStore: IEventStore,
  ) {}

  async findById(tenantId: string, subscriptionId: string): Promise<SubscriptionReadModel | null> {
    const sub = await this.domainRepo.findById(tenantId, subscriptionId);
    if (!sub) return null;
    return this.toReadModel(sub);
  }

  async findByPublicId(tenantId: string, publicId: string): Promise<SubscriptionReadModel | null> {
    const sub = await this.domainRepo.findByPublicId(tenantId, publicId);
    if (!sub) return null;
    return this.toReadModel(sub);
  }

  async search(
    tenantId: string,
    filters: { personId?: string; status?: string; planId?: string; query?: string },
    pagination: { page: number; limit: number },
  ): Promise<PaginatedReadModelResult<SubscriptionReadModel>> {
    const result = await this.domainRepo.search(tenantId, {
      tenantId,
      personId: filters.personId,
      status: filters.status as any,
      planId: filters.planId,
      query: filters.query,
      page: pagination.page,
      limit: pagination.limit,
    });

    return {
      data: result.data.map(s => this.toReadModel(s)),
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages,
    };
  }

  async getTimeline(tenantId: string, subscriptionId: string): Promise<TimelineEntry[]> {
    const sub = await this.domainRepo.findById(tenantId, subscriptionId);
    if (!sub) return [];

    const events = await this.eventStore.findByAggregate(tenantId, 'subscription', subscriptionId);
    const timeline: TimelineEntry[] = [];

    for (const e of events) {
      timeline.push({
        timestamp: e.createdAt,
        type: 'event',
        action: e.eventName,
        description: e.eventName,
        actorId: e.actorId,
        correlationId: e.correlationId,
      });
    }

    for (const d of sub.decisionLog) {
      timeline.push({
        timestamp: d.timestamp,
        type: 'decision',
        action: d.action,
        description: d.reason,
        actorId: d.actorId,
        correlationId: null,
      });
    }

    for (const m of sub.milestones) {
      timeline.push({
        timestamp: m.achievedAt,
        type: 'milestone',
        action: m.name,
        description: m.name,
        actorId: null,
        correlationId: null,
      });
    }

    timeline.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
    return timeline;
  }

  async getHistory(tenantId: string, subscriptionId: string): Promise<HistoryEntry[]> {
    const events = await this.eventStore.findByAggregate(tenantId, 'subscription', subscriptionId);
    return events.map(e => ({
      version: e.aggregateVersion,
      eventName: e.eventName,
      eventVersion: e.eventVersion,
      timestamp: e.createdAt,
      actorId: e.actorId,
      correlationId: e.correlationId,
      changes: e.payload,
    }));
  }

  async getHealth(tenantId: string, subscriptionId: string): Promise<HealthReadModel | null> {
    const sub = await this.domainRepo.findById(tenantId, subscriptionId);
    if (!sub) return null;

    const snap = sub.snapshot();
    const today = new Date();
    const lastActivity = new Date(snap.updatedAt as string);
    const daysSince = Math.floor((today.getTime() - lastActivity.getTime()) / 86400000);

    return {
      subscriptionId: sub.id,
      overall: (sub as any).health ?? 'HEALTHY',
      statusStability: sub.currentVersion ?? 0,
      paymentStatus: 'UNKNOWN',
      supportTicketsOpen: 0,
      lastActivityDate: lastActivity,
      daysSinceLastActivity: daysSince,
      warnings: [],
    };
  }

  private toReadModel(sub: any): SubscriptionReadModel {
    const snap = typeof sub.snapshot === 'function' ? sub.snapshot() : sub;
    return {
      id: snap.subscriptionId ?? snap.id ?? sub.id,
      publicId: snap.publicId ?? sub.publicId?.value ?? '',
      tenantId: snap.tenantId ?? sub.tenantId,
      personId: snap.personId ?? sub.personId,
      planId: snap.planId ?? sub.planId,
      serviceId: snap.serviceId ?? sub.serviceId ?? '',
      locationId: snap.locationId ?? sub.locationId,
      contractId: snap.contractId ?? sub.contractId ?? null,
      status: snap.status ?? sub.status,
      health: snap.health ?? 'HEALTHY',
      currentVersion: snap.currentVersion ?? sub.version,
      createdAt: snap.createdAt ? new Date(snap.createdAt as string) : sub.createdAt,
      updatedAt: snap.updatedAt ? new Date(snap.updatedAt as string) : new Date(),
      activatedAt: snap.activatedAt ? new Date(snap.activatedAt as string) : (sub.activatedAt ?? null),
      cancelledAt: snap.cancelledAt ? new Date(snap.cancelledAt as string) : (sub.cancelledAt ?? null),
      archivedAt: snap.archivedAt ? new Date(snap.archivedAt as string) : (sub.archivedAt ?? null),
    };
  }
}
