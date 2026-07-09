import { Module } from '@nestjs/common';
import {
  SUBSCRIPTION_REPOSITORY, ISubscriptionRepository,
} from '../domain/repository.interface';
import { InMemoryEventStore } from '../infrastructure/event-store/in-memory-event-store';
import { InMemorySubscriptionRepository } from '../infrastructure/in-memory/in-memory-subscription.repository';
import { InMemoryUnitOfWork } from './transaction/in-memory-unit-of-work';
import { InMemoryOutbox } from './outbox/in-memory-outbox';
import { InMemoryCommandBus } from './bus/in-memory-command-bus';
import { InMemoryQueryBus } from './bus/in-memory-query-bus';
import { InMemoryReadModelRepository } from './read-models/in-memory-read-model.repository';
import { InMemorySubscriptionBillingAcl } from './acl/in-memory-billing.acl';
import { MetricsBehavior } from './pipeline/metrics.behavior';
import { LoggingBehavior } from './pipeline/logging.behavior';
import { IdempotencyBehavior } from './pipeline/idempotency.behavior';
import { ValidationBehavior } from './pipeline/validation.behavior';
import { AuthorizationBehavior } from './pipeline/authorization.behavior';
import { ExplainabilityBehavior } from './pipeline/explainability.behavior';

import { CreateSubscriptionHandler } from './commands/create-subscription.handler';
import {
  ValidateSubscriptionHandler, ConfirmCoverageHandler, SubmitDocumentsHandler,
  ApproveSubscriptionHandler, RejectSubscriptionHandler, ScheduleInstallationHandler,
  StartInstallationHandler, CompleteInstallationHandler, ActivateSubscriptionHandler,
  SuspendSubscriptionHandler, ReactivateSubscriptionHandler, CancelSubscriptionHandler,
  ArchiveSubscriptionHandler, RenewSubscriptionHandler, TransferSubscriptionHandler,
  MigratePlanHandler, AddCapabilityHandler, RemoveCapabilityHandler,
  AddEquipmentHandler, RemoveEquipmentHandler,
} from './commands/lifecycle-handlers';
import {
  GetSubscriptionHandler, GetSubscriptionByPublicIdHandler, SearchSubscriptionsHandler,
  SubscriptionTimelineHandler, SubscriptionHistoryHandler, SubscriptionHealthHandler,
} from './queries/subscription-query-handlers';
import { SubscriptionOrchestrationService } from './services/subscription-orchestration.service';
import { CreateSubscriptionCommand, ValidateSubscriptionCommand, ConfirmCoverageCommand, SubmitDocumentsCommand, ApproveSubscriptionCommand, RejectSubscriptionCommand, ScheduleInstallationCommand, StartInstallationCommand, CompleteInstallationCommand, ActivateSubscriptionCommand, SuspendSubscriptionCommand, ReactivateSubscriptionCommand, CancelSubscriptionCommand, ArchiveSubscriptionCommand, RenewSubscriptionCommand, TransferSubscriptionCommand, MigratePlanCommand, AddCapabilityCommand, RemoveCapabilityCommand, AddEquipmentCommand, RemoveEquipmentCommand } from './commands/subscription-commands';
import { GetSubscriptionQuery, GetSubscriptionByPublicIdQuery, SearchSubscriptionsQuery, SubscriptionTimelineQuery, SubscriptionHistoryQuery, SubscriptionHealthQuery } from './queries/subscription-queries';

function registerCommandHandlers(bus: InMemoryCommandBus, repo: ISubscriptionRepository, eventStore: InMemoryEventStore, outbox: InMemoryOutbox, uow: InMemoryUnitOfWork): void {
  const handlers: [string, any][] = [
    [new CreateSubscriptionCommand('','','','','','','','','').type, new CreateSubscriptionHandler(repo, uow, eventStore, outbox)],
    [new ValidateSubscriptionCommand('','','','','').type, new ValidateSubscriptionHandler(repo, eventStore, outbox, uow)],
    [new ConfirmCoverageCommand('','','','','','').type, new ConfirmCoverageHandler(repo, eventStore, outbox, uow)],
    [new SubmitDocumentsCommand('','','','',[]).type, new SubmitDocumentsHandler(repo, eventStore, outbox, uow)],
    [new ApproveSubscriptionCommand('','','','','',null).type, new ApproveSubscriptionHandler(repo, eventStore, outbox, uow)],
    [new RejectSubscriptionCommand('','','','','','').type, new RejectSubscriptionHandler(repo, eventStore, outbox, uow)],
    [new ScheduleInstallationCommand('','','','','',new Date(),'').type, new ScheduleInstallationHandler(repo, eventStore, outbox, uow)],
    [new StartInstallationCommand('','','','','').type, new StartInstallationHandler(repo, eventStore, outbox, uow)],
    [new CompleteInstallationCommand('','','','',[],[]).type, new CompleteInstallationHandler(repo, eventStore, outbox, uow)],
    [new ActivateSubscriptionCommand('','','','').type, new ActivateSubscriptionHandler(repo, eventStore, outbox, uow)],
    [new SuspendSubscriptionCommand('','','','','').type, new SuspendSubscriptionHandler(repo, eventStore, outbox, uow)],
    [new ReactivateSubscriptionCommand('','','','').type, new ReactivateSubscriptionHandler(repo, eventStore, outbox, uow)],
    [new CancelSubscriptionCommand('','','','','').type, new CancelSubscriptionHandler(repo, eventStore, outbox, uow)],
    [new ArchiveSubscriptionCommand('','','','','').type, new ArchiveSubscriptionHandler(repo, eventStore, outbox, uow)],
    [new RenewSubscriptionCommand('','','','',0).type, new RenewSubscriptionHandler(repo, eventStore, outbox, uow)],
    [new TransferSubscriptionCommand('','','','','',null).type, new TransferSubscriptionHandler(repo, eventStore, outbox, uow)],
    [new MigratePlanCommand('','','','','').type, new MigratePlanHandler(repo, eventStore, outbox, uow)],
    [new AddCapabilityCommand('','','','','','',0,'').type, new AddCapabilityHandler(repo, eventStore, outbox, uow)],
    [new RemoveCapabilityCommand('','','','','').type, new RemoveCapabilityHandler(repo, eventStore, outbox, uow)],
    [new AddEquipmentCommand('','','','','','','','').type, new AddEquipmentHandler(repo, eventStore, outbox, uow)],
    [new RemoveEquipmentCommand('','','','','').type, new RemoveEquipmentHandler(repo, eventStore, outbox, uow)],
  ];
  for (const [type, handler] of handlers) {
    bus.register(type, handler);
  }
}

function registerQueryHandlers(bus: InMemoryQueryBus, readRepo: InMemoryReadModelRepository): void {
  bus.register(new GetSubscriptionQuery('','').type, new GetSubscriptionHandler(readRepo));
  bus.register(new GetSubscriptionByPublicIdQuery('','').type, new GetSubscriptionByPublicIdHandler(readRepo));
  bus.register(new SearchSubscriptionsQuery('').type, new SearchSubscriptionsHandler(readRepo));
  bus.register(new SubscriptionTimelineQuery('','').type, new SubscriptionTimelineHandler(readRepo));
  bus.register(new SubscriptionHistoryQuery('','').type, new SubscriptionHistoryHandler(readRepo));
  bus.register(new SubscriptionHealthQuery('','').type, new SubscriptionHealthHandler(readRepo));
}

@Module({
  providers: [
    InMemoryCommandBus,
    InMemoryQueryBus,
    InMemoryUnitOfWork,
    InMemoryOutbox,
    MetricsBehavior,
    LoggingBehavior,
    IdempotencyBehavior,
    ValidationBehavior,
    AuthorizationBehavior,
    ExplainabilityBehavior,
    InMemorySubscriptionBillingAcl,
    SubscriptionOrchestrationService,
    {
      provide: InMemoryReadModelRepository,
      useFactory: (domainRepo: InMemorySubscriptionRepository, eventStore: InMemoryEventStore) => {
        return new InMemoryReadModelRepository(domainRepo, eventStore);
      },
      inject: [InMemorySubscriptionRepository, InMemoryEventStore],
    },
    {
      provide: 'APPLICATION_BOOTSTRAP',
      useFactory: (
        cmdBus: InMemoryCommandBus, qryBus: InMemoryQueryBus,
        repo: InMemorySubscriptionRepository, eventStore: InMemoryEventStore,
        outbox: InMemoryOutbox, uow: InMemoryUnitOfWork,
        readRepo: InMemoryReadModelRepository,
      ) => {
        registerCommandHandlers(cmdBus, repo, eventStore, outbox, uow);
        registerQueryHandlers(qryBus, readRepo);

        cmdBus.registerBehavior(new LoggingBehavior());
        cmdBus.registerBehavior(new IdempotencyBehavior());
        cmdBus.registerBehavior(new MetricsBehavior());
        cmdBus.registerBehavior(new ExplainabilityBehavior());

        return true;
      },
      inject: [
        InMemoryCommandBus, InMemoryQueryBus,
        InMemorySubscriptionRepository, InMemoryEventStore,
        InMemoryOutbox, InMemoryUnitOfWork, InMemoryReadModelRepository,
      ],
    },
  ],
  exports: [
    InMemoryCommandBus, InMemoryQueryBus, InMemoryUnitOfWork,
    InMemoryOutbox, SubscriptionOrchestrationService,
    MetricsBehavior, LoggingBehavior, IdempotencyBehavior,
    ValidationBehavior, AuthorizationBehavior, ExplainabilityBehavior,
  ],
})
export class ApplicationModule {}
