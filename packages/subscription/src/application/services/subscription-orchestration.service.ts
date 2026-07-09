import { ICommandBus } from '../bus/command-bus.interface';
import { IQueryBus } from '../bus/query-bus.interface';
import { IUnitOfWork } from '../transaction/transaction-manager.interface';
import { ISubscriptionBillingAcl } from '../acl/subscription-billing.acl';
import { ActivateSubscriptionCommand, CreateSubscriptionCommand } from '../commands/subscription-commands';
import { GetSubscriptionQuery } from '../queries/subscription-queries';
import { SubscriptionReadModel } from '../read-models/subscription.read-model';

export interface SubscriptionActivationResult {
  subscriptionId: string;
  billingSetup: boolean;
}

export class SubscriptionOrchestrationService {
  readonly name = 'SubscriptionOrchestration';

  constructor(
    private readonly commandBus: ICommandBus,
    private readonly queryBus: IQueryBus,
    private readonly uow: IUnitOfWork,
    private readonly billingAcl: ISubscriptionBillingAcl,
  ) {}

  async createAndActivate(
    tenantId: string, actorId: string, correlationId: string,
    personId: string, planId: string, serviceId: string, locationId: string, publicId: string,
  ): Promise<SubscriptionActivationResult> {
    return this.uow.execute(async () => {
      const subId = await this.commandBus.execute<string>(
        new CreateSubscriptionCommand(tenantId, actorId, correlationId, personId, planId, serviceId, locationId, publicId),
      );

      const sub = await this.queryBus.execute<SubscriptionReadModel | null>(
        new GetSubscriptionQuery(tenantId, subId),
      );

      if (!sub) throw new Error(`Subscription ${subId} not found after creation`);

      await this.billingAcl.notifyActivation(subId, tenantId, new Date());

      return { subscriptionId: subId, billingSetup: true };
    });
  }
}
