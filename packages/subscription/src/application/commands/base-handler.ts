import { BaseSubscriptionCommand } from './base-subscription.command';
import { Subscription } from '../../domain/subscription.entity';
import { ISubscriptionRepository } from '../../domain/repository.interface';
import { IEventStore } from '../../infrastructure/event-store/event-store.interface';
import { IOutbox } from '../outbox/outbox.interface';

export abstract class BaseHandler {
  constructor(
    protected readonly repo: ISubscriptionRepository,
    protected readonly eventStore: IEventStore,
    protected readonly outbox: IOutbox,
  ) {}

  protected async load(command: BaseSubscriptionCommand): Promise<Subscription> {
    const sub = await this.repo.findById(command.tenantId, command.subscriptionId);
    if (!sub) throw new Error(`Subscription ${command.subscriptionId} not found`);
    return sub;
  }

  protected async save(sub: Subscription, command: BaseSubscriptionCommand): Promise<void> {
    await this.repo.save(sub);

    const events = sub.pullEvents();
    for (const event of events) {
      await this.eventStore.store({
        tenantId: command.tenantId,
        aggregateType: 'subscription',
        aggregateId: sub.id,
        aggregateVersion: event.aggregateVersion,
        event,
      });

      await this.outbox.enqueue({
        tenantId: command.tenantId,
        aggregateType: 'subscription',
        aggregateId: sub.id,
        eventName: event.eventName,
        eventVersion: event.eventVersion,
        payload: event.data as Record<string, unknown>,
        correlationId: event.correlationId,
        causationId: event.causationId,
        actorId: event.actorId,
      });
    }
  }
}
