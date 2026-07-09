import { Subscription } from './subscription.entity';
import { SubscriptionStatus } from './value-objects';

export const SUBSCRIPTION_REPOSITORY = 'SUBSCRIPTION_REPOSITORY';
export const POLICY_ENGINE = 'POLICY_ENGINE';

export interface SubscriptionSearchCriteria {
  tenantId?: string;
  personId?: string;
  status?: SubscriptionStatus;
  planId?: string;
  locationId?: string;
  query?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ISubscriptionRepository {
  save(subscription: Subscription): Promise<void>;
  findById(tenantId: string, subscriptionId: string): Promise<Subscription | null>;
  findByPublicId(tenantId: string, publicId: string): Promise<Subscription | null>;
  findByPersonId(tenantId: string, personId: string): Promise<Subscription[]>;
  findByLocationId(tenantId: string, locationId: string): Promise<Subscription[]>;
  search(tenantId: string, criteria: SubscriptionSearchCriteria): Promise<PaginatedResult<Subscription>>;
  findActiveByPersonId(tenantId: string, personId: string): Promise<Subscription[]>;
  delete(tenantId: string, subscriptionId: string): Promise<void>;
}

export interface PolicyContext {
  tenantId: string;
  personId: string;
  subscription: Subscription;
  correlationId?: string;
}

export interface PolicyResult {
  allowed: boolean;
  reason?: string;
  requiredActions?: string[];
}

export interface IPolicyEngine {
  canTransition(from: SubscriptionStatus, to: SubscriptionStatus, context: PolicyContext): PolicyResult;
  canCancel(subscription: Subscription, context: PolicyContext): PolicyResult;
  canSuspend(subscription: Subscription, context: PolicyContext): PolicyResult;
  canReactivate(subscription: Subscription, context: PolicyContext): PolicyResult;
  canChangePlan(subscription: Subscription, newPlanId: string, context: PolicyContext): PolicyResult;
  canTransfer(subscription: Subscription, newLocationId: string, context: PolicyContext): PolicyResult;
  canAttachCapability(subscription: Subscription, capabilityType: string, context: PolicyContext): PolicyResult;
  canRemoveCapability(subscription: Subscription, capabilityId: string, context: PolicyContext): PolicyResult;
}
