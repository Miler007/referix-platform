import { IQuery } from '../bus/query-bus.interface';

export class GetSubscriptionQuery implements IQuery {
  readonly type = 'GetSubscription';
  constructor(
    public readonly tenantId: string,
    public readonly subscriptionId: string,
  ) {}
}

export class GetSubscriptionByPublicIdQuery implements IQuery {
  readonly type = 'GetSubscriptionByPublicId';
  constructor(
    public readonly tenantId: string,
    public readonly publicId: string,
  ) {}
}

export class SearchSubscriptionsQuery implements IQuery {
  readonly type = 'SearchSubscriptions';
  constructor(
    public readonly tenantId: string,
    public readonly personId?: string,
    public readonly status?: string,
    public readonly planId?: string,
    public readonly query?: string,
    public readonly page: number = 1,
    public readonly limit: number = 20,
  ) {}
}

export class SubscriptionTimelineQuery implements IQuery {
  readonly type = 'SubscriptionTimeline';
  constructor(
    public readonly tenantId: string,
    public readonly subscriptionId: string,
  ) {}
}

export class SubscriptionHistoryQuery implements IQuery {
  readonly type = 'SubscriptionHistory';
  constructor(
    public readonly tenantId: string,
    public readonly subscriptionId: string,
  ) {}
}

export class SubscriptionHealthQuery implements IQuery {
  readonly type = 'SubscriptionHealth';
  constructor(
    public readonly tenantId: string,
    public readonly subscriptionId: string,
  ) {}
}
