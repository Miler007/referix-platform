import { InMemoryCommandBus } from '../bus/in-memory-command-bus';
import { InMemoryQueryBus } from '../bus/in-memory-query-bus';
import { InMemoryUnitOfWork } from '../transaction/in-memory-unit-of-work';
import { InMemoryOutbox } from '../outbox/in-memory-outbox';
import { InMemorySubscriptionRepository } from '../../infrastructure/in-memory/in-memory-subscription.repository';
import { InMemoryEventStore } from '../../infrastructure/event-store/in-memory-event-store';
import { InMemoryReadModelRepository } from '../read-models/in-memory-read-model.repository';
import { MetricsBehavior } from '../pipeline/metrics.behavior';
import { LoggingBehavior } from '../pipeline/logging.behavior';
import { IdempotencyBehavior } from '../pipeline/idempotency.behavior';
import { ExplainabilityBehavior } from '../pipeline/explainability.behavior';
import { IQuery } from '../bus/query-bus.interface';

import { CreateSubscriptionCommand, ActivateSubscriptionCommand, SuspendSubscriptionCommand, CancelSubscriptionCommand, ReactivateSubscriptionCommand, ValidateSubscriptionCommand, ConfirmCoverageCommand, SubmitDocumentsCommand, ApproveSubscriptionCommand, ScheduleInstallationCommand, StartInstallationCommand, CompleteInstallationCommand, RenewSubscriptionCommand, TransferSubscriptionCommand, MigratePlanCommand, AddCapabilityCommand, RemoveCapabilityCommand, AddEquipmentCommand, RemoveEquipmentCommand, ArchiveSubscriptionCommand } from './subscription-commands';
import { CreateSubscriptionHandler } from './create-subscription.handler';
import {
  ValidateSubscriptionHandler, ConfirmCoverageHandler, SubmitDocumentsHandler,
  ApproveSubscriptionHandler, ScheduleInstallationHandler,
  StartInstallationHandler, CompleteInstallationHandler, ActivateSubscriptionHandler,
  SuspendSubscriptionHandler, ReactivateSubscriptionHandler, CancelSubscriptionHandler,
  RenewSubscriptionHandler, TransferSubscriptionHandler, MigratePlanHandler,
  AddCapabilityHandler, RemoveCapabilityHandler, AddEquipmentHandler, RemoveEquipmentHandler,
  ArchiveSubscriptionHandler,
} from './lifecycle-handlers';

import { GetSubscriptionQuery, SearchSubscriptionsQuery, SubscriptionTimelineQuery, SubscriptionHistoryQuery, SubscriptionHealthQuery } from '../queries/subscription-queries';
import { GetSubscriptionHandler, SearchSubscriptionsHandler, SubscriptionTimelineHandler, SubscriptionHistoryHandler, SubscriptionHealthHandler } from '../queries/subscription-query-handlers';
import { SubscriptionReadModel } from '../read-models/subscription.read-model';
import { TimelineEntry } from '../read-models/timeline-entry.read-model';
import { HealthReadModel } from '../read-models/health.read-model';

// Type-safe query helper
async function query<T>(bus: InMemoryQueryBus, q: IQuery): Promise<T> {
  return bus.execute(q) as Promise<T>;
}

function buildApp() {
  const cmdBus = new InMemoryCommandBus();
  const qryBus = new InMemoryQueryBus();
  const uow = new InMemoryUnitOfWork();
  const domainRepo = new InMemorySubscriptionRepository();
  const eventStore = new InMemoryEventStore();
  const outbox = new InMemoryOutbox();
  const readRepo = new InMemoryReadModelRepository(domainRepo, eventStore);

  const metrics = new MetricsBehavior();
  const idempotency = new IdempotencyBehavior();

  cmdBus.registerBehavior(new LoggingBehavior());
  cmdBus.registerBehavior(idempotency);
  cmdBus.registerBehavior(metrics);
  cmdBus.registerBehavior(new ExplainabilityBehavior());

  cmdBus.register(new CreateSubscriptionCommand('','','','','','','','','','').type, new CreateSubscriptionHandler(domainRepo, uow, eventStore, outbox));
  cmdBus.register(new ValidateSubscriptionCommand('','','','','').type, new ValidateSubscriptionHandler(domainRepo, eventStore, outbox, uow));
  cmdBus.register(new ConfirmCoverageCommand('','','','','','').type, new ConfirmCoverageHandler(domainRepo, eventStore, outbox, uow));
  cmdBus.register(new SubmitDocumentsCommand('','','','',[]).type, new SubmitDocumentsHandler(domainRepo, eventStore, outbox, uow));
  cmdBus.register(new ApproveSubscriptionCommand('','','','','',null).type, new ApproveSubscriptionHandler(domainRepo, eventStore, outbox, uow));
  cmdBus.register(new ScheduleInstallationCommand('','','','','',new Date(),'').type, new ScheduleInstallationHandler(domainRepo, eventStore, outbox, uow));
  cmdBus.register(new StartInstallationCommand('','','','','').type, new StartInstallationHandler(domainRepo, eventStore, outbox, uow));
  cmdBus.register(new CompleteInstallationCommand('','','','',[],[]).type, new CompleteInstallationHandler(domainRepo, eventStore, outbox, uow));
  cmdBus.register(new ActivateSubscriptionCommand('','','','').type, new ActivateSubscriptionHandler(domainRepo, eventStore, outbox, uow));
  cmdBus.register(new SuspendSubscriptionCommand('','','','','').type, new SuspendSubscriptionHandler(domainRepo, eventStore, outbox, uow));
  cmdBus.register(new ReactivateSubscriptionCommand('','','','').type, new ReactivateSubscriptionHandler(domainRepo, eventStore, outbox, uow));
  cmdBus.register(new CancelSubscriptionCommand('','','','','').type, new CancelSubscriptionHandler(domainRepo, eventStore, outbox, uow));
  cmdBus.register(new ArchiveSubscriptionCommand('','','','','').type, new ArchiveSubscriptionHandler(domainRepo, eventStore, outbox, uow));
  cmdBus.register(new RenewSubscriptionCommand('','','','',0).type, new RenewSubscriptionHandler(domainRepo, eventStore, outbox, uow));
  cmdBus.register(new TransferSubscriptionCommand('','','','','',null).type, new TransferSubscriptionHandler(domainRepo, eventStore, outbox, uow));
  cmdBus.register(new MigratePlanCommand('','','','','').type, new MigratePlanHandler(domainRepo, eventStore, outbox, uow));
  cmdBus.register(new AddCapabilityCommand('','','','','','',0,'').type, new AddCapabilityHandler(domainRepo, eventStore, outbox, uow));
  cmdBus.register(new RemoveCapabilityCommand('','','','','').type, new RemoveCapabilityHandler(domainRepo, eventStore, outbox, uow));
  cmdBus.register(new AddEquipmentCommand('','','','','','','','').type, new AddEquipmentHandler(domainRepo, eventStore, outbox, uow));
  cmdBus.register(new RemoveEquipmentCommand('','','','','').type, new RemoveEquipmentHandler(domainRepo, eventStore, outbox, uow));

  qryBus.register(new GetSubscriptionQuery('','').type, new GetSubscriptionHandler(readRepo));
  qryBus.register(new SearchSubscriptionsQuery('').type, new SearchSubscriptionsHandler(readRepo));
  qryBus.register(new SubscriptionTimelineQuery('','').type, new SubscriptionTimelineHandler(readRepo));
  qryBus.register(new SubscriptionHistoryQuery('','').type, new SubscriptionHistoryHandler(readRepo));
  qryBus.register(new SubscriptionHealthQuery('','').type, new SubscriptionHealthHandler(readRepo));

  return { cmdBus, qryBus, domainRepo, eventStore, outbox, metrics, idempotency };
}

describe('Subscription Application Layer — Integration', () => {
  let app: ReturnType<typeof buildApp>;
  const tenantId = 'tenant-1';
  const actorId = 'actor-1';
  const correlationId = 'corr-lifecycle';
  let subId: string;

  beforeEach(async () => {
    app = buildApp();
    subId = await app.cmdBus.execute(
      new CreateSubscriptionCommand(tenantId, actorId, correlationId, 'person-1', 'plan-1', 'service-1', 'location-1', 'PUB-2024-000000001'),
    );
  });

  it('should create a subscription in DRAFT', async () => {
    const sub = await query<SubscriptionReadModel | null>(app.qryBus, new GetSubscriptionQuery(tenantId, subId));
    expect(sub).not.toBeNull();
    expect(sub!.status).toBe('DRAFT');
    expect(sub!.publicId).toBe('PUB-2024-000000001');
  });

  it('should execute full activation lifecycle', async () => {
    await app.cmdBus.execute(new ValidateSubscriptionCommand(subId, tenantId, actorId, correlationId, actorId));
    await app.cmdBus.execute(new ConfirmCoverageCommand(subId, tenantId, actorId, correlationId, 'internet', 'zone-1'));
    await app.cmdBus.execute(new SubmitDocumentsCommand(subId, tenantId, actorId, correlationId, ['doc-1']));
    await app.cmdBus.execute(new ApproveSubscriptionCommand(subId, tenantId, actorId, correlationId, actorId, 750));
    await app.cmdBus.execute(new ScheduleInstallationCommand(subId, tenantId, actorId, correlationId, 'tech-1', new Date(), 'WO-1'));
    await app.cmdBus.execute(new StartInstallationCommand(subId, tenantId, actorId, correlationId, 'tech-1'));
    await app.cmdBus.execute(new CompleteInstallationCommand(subId, tenantId, actorId, correlationId, ['ROUTER'], ['evidence']));
    await app.cmdBus.execute(new ActivateSubscriptionCommand(subId, tenantId, actorId, correlationId));

    const sub = await query<SubscriptionReadModel | null>(app.qryBus, new GetSubscriptionQuery(tenantId, subId));
    expect(sub!.status).toBe('ACTIVE');
  });

  it('should handle suspend and reactivate', async () => {
    await app.cmdBus.execute(new ValidateSubscriptionCommand(subId, tenantId, actorId, correlationId, actorId));
    await app.cmdBus.execute(new ConfirmCoverageCommand(subId, tenantId, actorId, correlationId, 'internet', 'zone-1'));
    await app.cmdBus.execute(new SubmitDocumentsCommand(subId, tenantId, actorId, correlationId, ['doc-1']));
    await app.cmdBus.execute(new ApproveSubscriptionCommand(subId, tenantId, actorId, correlationId, actorId, 750));
    await app.cmdBus.execute(new ScheduleInstallationCommand(subId, tenantId, actorId, correlationId, 'tech-1', new Date(), 'WO-1'));
    await app.cmdBus.execute(new StartInstallationCommand(subId, tenantId, actorId, correlationId, 'tech-1'));
    await app.cmdBus.execute(new CompleteInstallationCommand(subId, tenantId, actorId, correlationId, ['R'], ['e']));
    await app.cmdBus.execute(new ActivateSubscriptionCommand(subId, tenantId, actorId, correlationId));

    await app.cmdBus.execute(new SuspendSubscriptionCommand(subId, tenantId, actorId, correlationId, 'non_payment'));
    expect((await query<SubscriptionReadModel | null>(app.qryBus, new GetSubscriptionQuery(tenantId, subId)))!.status).toBe('SUSPENDED');

    await app.cmdBus.execute(new ReactivateSubscriptionCommand(subId, tenantId, actorId, correlationId));
    expect((await query<SubscriptionReadModel | null>(app.qryBus, new GetSubscriptionQuery(tenantId, subId)))!.status).toBe('ACTIVE');
  });

  it('should cancel a subscription', async () => {
    await app.cmdBus.execute(new CancelSubscriptionCommand(subId, tenantId, actorId, correlationId, 'customer_request'));
    expect((await query<SubscriptionReadModel | null>(app.qryBus, new GetSubscriptionQuery(tenantId, subId)))!.status).toBe('CANCELLED');
  });

  it('should provide timeline and history', async () => {
    await app.cmdBus.execute(new ValidateSubscriptionCommand(subId, tenantId, actorId, correlationId, actorId));

    const timeline = await query<TimelineEntry[]>(app.qryBus, new SubscriptionTimelineQuery(tenantId, subId));
    expect(timeline.length).toBeGreaterThanOrEqual(2);
    expect(timeline[0].type).toBe('event');
    expect(timeline.some(t => t.action.includes('validated'))).toBe(true);

    const history = await query<TimelineEntry[]>(app.qryBus, new SubscriptionHistoryQuery(tenantId, subId));
    expect(history.length).toBeGreaterThanOrEqual(2);
  });

  it('should provide health check', async () => {
    const health = await query<HealthReadModel | null>(app.qryBus, new SubscriptionHealthQuery(tenantId, subId));
    expect(health).not.toBeNull();
    expect(health!.overall).toBeDefined();
  });

  it('should enforce idempotency', async () => {
    await app.cmdBus.execute(
      new CancelSubscriptionCommand(subId, tenantId, actorId, correlationId, 'reason', undefined, 'idem-1'),
    );
    const statusAfter = (await query<SubscriptionReadModel | null>(app.qryBus, new GetSubscriptionQuery(tenantId, subId)))!.status;
    expect(statusAfter).toBe('CANCELLED');

    await app.cmdBus.execute(
      new CancelSubscriptionCommand(subId, tenantId, actorId, correlationId, 'reason', undefined, 'idem-1'),
    );
    const statusAfterSecond = (await query<SubscriptionReadModel | null>(app.qryBus, new GetSubscriptionQuery(tenantId, subId)))!.status;
    expect(statusAfterSecond).toBe('CANCELLED');
  });

  it('should handle renew and migrate commands', async () => {
    await app.cmdBus.execute(new ValidateSubscriptionCommand(subId, tenantId, actorId, correlationId, actorId));
    await app.cmdBus.execute(new ConfirmCoverageCommand(subId, tenantId, actorId, correlationId, 'internet', 'zone-1'));
    await app.cmdBus.execute(new SubmitDocumentsCommand(subId, tenantId, actorId, correlationId, ['doc-1']));
    await app.cmdBus.execute(new ApproveSubscriptionCommand(subId, tenantId, actorId, correlationId, actorId, 750));
    await app.cmdBus.execute(new ScheduleInstallationCommand(subId, tenantId, actorId, correlationId, 'tech-1', new Date(), 'WO-1'));
    await app.cmdBus.execute(new StartInstallationCommand(subId, tenantId, actorId, correlationId, 'tech-1'));
    await app.cmdBus.execute(new CompleteInstallationCommand(subId, tenantId, actorId, correlationId, ['R'], ['e']));
    await app.cmdBus.execute(new ActivateSubscriptionCommand(subId, tenantId, actorId, correlationId));

    await app.cmdBus.execute(new RenewSubscriptionCommand(subId, tenantId, actorId, correlationId, 12));
    expect((await query<SubscriptionReadModel | null>(app.qryBus, new GetSubscriptionQuery(tenantId, subId)))!.status).toBe('ACTIVE');

    await app.cmdBus.execute(new MigratePlanCommand(subId, tenantId, actorId, correlationId, 'plan-premium'));
    expect((await query<SubscriptionReadModel | null>(app.qryBus, new GetSubscriptionQuery(tenantId, subId)))!.status).toBe('ACTIVE');
  });

  it('should handle capabilities and equipment', async () => {
    await app.cmdBus.execute(new ValidateSubscriptionCommand(subId, tenantId, actorId, correlationId, actorId));
    await app.cmdBus.execute(new ConfirmCoverageCommand(subId, tenantId, actorId, correlationId, 'internet', 'zone-1'));
    await app.cmdBus.execute(new SubmitDocumentsCommand(subId, tenantId, actorId, correlationId, ['doc-1']));
    await app.cmdBus.execute(new ApproveSubscriptionCommand(subId, tenantId, actorId, correlationId, actorId, 750));
    await app.cmdBus.execute(new ScheduleInstallationCommand(subId, tenantId, actorId, correlationId, 'tech-1', new Date(), 'WO-1'));
    await app.cmdBus.execute(new StartInstallationCommand(subId, tenantId, actorId, correlationId, 'tech-1'));
    await app.cmdBus.execute(new CompleteInstallationCommand(subId, tenantId, actorId, correlationId, ['R'], ['e']));
    await app.cmdBus.execute(new ActivateSubscriptionCommand(subId, tenantId, actorId, correlationId));

    await app.cmdBus.execute(new AddCapabilityCommand(subId, tenantId, actorId, correlationId, 'SPEED', '1Gbps', 99.99, 'USD'));
    await app.cmdBus.execute(new AddEquipmentCommand(subId, tenantId, actorId, correlationId, 'ROUTER', 'SN-001', 'Model-X', 'Brand-Y'));

    const sub = await query<SubscriptionReadModel | null>(app.qryBus, new GetSubscriptionQuery(tenantId, subId));
    expect(sub).not.toBeNull();
  });
});
