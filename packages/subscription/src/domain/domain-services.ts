import { Subscription } from './subscription.entity';
import { SubscriptionHealth } from './value-objects';

export interface HealthCalculationContext {
  subscription: Subscription;
  latePaymentCount: number;
  daysSinceLastPayment: number | null;
  supportTicketCount: number;
  slaBreachCount: number;
  pendingWorkOrders: number;
}

export interface ISubscriptionHealthCalculator {
  calculate(context: HealthCalculationContext): { health: SubscriptionHealth; factors: string[] };
}

export interface DuplicateCandidate {
  subscriptionId: string;
  personId: string;
  planId: string;
  locationId: string;
  status: string;
  matchScore: number;
  matchedFields: string[];
}

export interface ISubscriptionDuplicateDetector {
  findDuplicates(subscription: Subscription): Promise<DuplicateCandidate[]>;
}

export interface CapabilityEvaluation {
  allowed: boolean;
  reason?: string;
  requiredPlan?: string;
  maxPerSubscription?: number;
}

export interface ICapabilityEvaluator {
  canAttach(subscription: Subscription, capabilityType: string): Promise<CapabilityEvaluation>;
  canRemove(subscription: Subscription, capabilityId: string): Promise<CapabilityEvaluation>;
}
