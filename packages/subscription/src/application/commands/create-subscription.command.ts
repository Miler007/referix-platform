import { BaseSubscriptionCommand } from './base-subscription.command';

export class CreateSubscriptionCommand extends BaseSubscriptionCommand {
  readonly type = 'CreateSubscription';
  constructor(
    tenantId: string, actorId: string, correlationId: string,
    public readonly personId: string,
    public readonly planId: string,
    public readonly serviceId: string,
    public readonly locationId: string,
    public readonly publicId: string,
    causationId?: string, idempotencyKey?: string,
  ) { super('new', tenantId, actorId, correlationId, causationId, idempotencyKey); }
}
