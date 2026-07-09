import { SubscriptionReadModel } from './subscription.read-model';
import { TimelineEntry } from './timeline-entry.read-model';
import { HealthReadModel } from './health.read-model';
import { HistoryEntry } from './history-entry.read-model';

export interface PaginatedReadModelResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface IReadModelRepository {
  findById(tenantId: string, subscriptionId: string): Promise<SubscriptionReadModel | null>;
  findByPublicId(tenantId: string, publicId: string): Promise<SubscriptionReadModel | null>;
  search(
    tenantId: string,
    filters: { personId?: string; status?: string; planId?: string; query?: string },
    pagination: { page: number; limit: number },
  ): Promise<PaginatedReadModelResult<SubscriptionReadModel>>;
  getTimeline(tenantId: string, subscriptionId: string): Promise<TimelineEntry[]>;
  getHistory(tenantId: string, subscriptionId: string): Promise<HistoryEntry[]>;
  getHealth(tenantId: string, subscriptionId: string): Promise<HealthReadModel | null>;
}
