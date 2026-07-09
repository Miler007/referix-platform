import { ICommandHandler } from '../bus/command-bus.interface';
import { CreateSubscriptionCommand } from './subscription-commands';
import { Subscription } from '../../domain/subscription.entity';
import { ISubscriptionRepository } from '../../domain/repository.interface';
import { IUnitOfWork } from '../transaction/transaction-manager.interface';
import { IEventStore } from '../../infrastructure/event-store/event-store.interface';
import { IOutbox } from '../outbox/outbox.interface';

export class CreateSubscriptionHandler implements ICommandHandler<CreateSubscriptionCommand, string> {
  constructor(
    private readonly repo: ISubscriptionRepository,
    private readonly uow: IUnitOfWork,
    private readonly eventStore: IEventStore,
    private readonly outbox: IOutbox,
  ) {}

  async handle(command: CreateSubscriptionCommand): Promise<string> {
    return this.uow.execute(async () => {
      const sub = Subscription.create({
        tenantId: command.tenantId,
        personId: command.personId,
        planId: command.planId,
        serviceId: command.serviceId,
        locationId: command.locationId,
        contractId: undefined,
        publicId: command.publicId,
      });

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
          payload: event.data,
          correlationId: event.correlationId,
          causationId: event.causationId,
          actorId: event.actorId,
        });
      }

      return sub.id;
    });
  }
}
