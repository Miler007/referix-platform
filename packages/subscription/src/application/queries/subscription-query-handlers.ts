import { IQueryHandler } from '../bus/query-bus.interface';
import {
  GetSubscriptionQuery, GetSubscriptionByPublicIdQuery, SearchSubscriptionsQuery,
  SubscriptionTimelineQuery, SubscriptionHistoryQuery, SubscriptionHealthQuery,
} from './subscription-queries';
import { IReadModelRepository, PaginatedReadModelResult } from '../read-models/read-model-repository.interface';
import { SubscriptionReadModel } from '../read-models/subscription.read-model';
import { TimelineEntry } from '../read-models/timeline-entry.read-model';
import { HealthReadModel } from '../read-models/health.read-model';
import { HistoryEntry } from '../read-models/history-entry.read-model';

export class GetSubscriptionHandler implements IQueryHandler<GetSubscriptionQuery, SubscriptionReadModel | null> {
  constructor(private readonly readRepo: IReadModelRepository) {}
  async handle(query: GetSubscriptionQuery): Promise<SubscriptionReadModel | null> {
    return this.readRepo.findById(query.tenantId, query.subscriptionId);
  }
}

export class GetSubscriptionByPublicIdHandler implements IQueryHandler<GetSubscriptionByPublicIdQuery, SubscriptionReadModel | null> {
  constructor(private readonly readRepo: IReadModelRepository) {}
  async handle(query: GetSubscriptionByPublicIdQuery): Promise<SubscriptionReadModel | null> {
    return this.readRepo.findByPublicId(query.tenantId, query.publicId);
  }
}

export class SearchSubscriptionsHandler implements IQueryHandler<SearchSubscriptionsQuery, PaginatedReadModelResult<SubscriptionReadModel>> {
  constructor(private readonly readRepo: IReadModelRepository) {}
  async handle(query: SearchSubscriptionsQuery): Promise<PaginatedReadModelResult<SubscriptionReadModel>> {
    return this.readRepo.search(
      query.tenantId,
      { personId: query.personId, status: query.status, planId: query.planId, query: query.query },
      { page: query.page, limit: query.limit },
    );
  }
}

export class SubscriptionTimelineHandler implements IQueryHandler<SubscriptionTimelineQuery, TimelineEntry[]> {
  constructor(private readonly readRepo: IReadModelRepository) {}
  async handle(query: SubscriptionTimelineQuery): Promise<TimelineEntry[]> {
    return this.readRepo.getTimeline(query.tenantId, query.subscriptionId);
  }
}

export class SubscriptionHistoryHandler implements IQueryHandler<SubscriptionHistoryQuery, HistoryEntry[]> {
  constructor(private readonly readRepo: IReadModelRepository) {}
  async handle(query: SubscriptionHistoryQuery): Promise<HistoryEntry[]> {
    return this.readRepo.getHistory(query.tenantId, query.subscriptionId);
  }
}

export class SubscriptionHealthHandler implements IQueryHandler<SubscriptionHealthQuery, HealthReadModel | null> {
  constructor(private readonly readRepo: IReadModelRepository) {}
  async handle(query: SubscriptionHealthQuery): Promise<HealthReadModel | null> {
    return this.readRepo.getHealth(query.tenantId, query.subscriptionId);
  }
}
