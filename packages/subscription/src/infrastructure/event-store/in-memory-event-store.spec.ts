import { InMemoryEventStore } from './in-memory-event-store';
import { StoreEventParams } from './event-store.interface';
import { SubscriptionCreated } from '../../domain/events';

interface EventOverrides {
  tenantId?: string;
  subscriptionId?: string;
  correlationId?: string | null;
  causationId?: string | null;
  actorId?: string | null;
  idempotencyKey?: string | null;
  personId?: string;
  planId?: string;
  serviceId?: string;
  locationId?: string;
  publicId?: string;
  timestamp?: Date;
}

function makeEvent(aggregateVersion: number, overrides: EventOverrides = {}): SubscriptionCreated {
  return new SubscriptionCreated(
    overrides.tenantId ?? 'tenant-1',
    overrides.subscriptionId ?? 'sub-1',
    overrides.correlationId ?? 'corr-1',
    aggregateVersion,
    overrides.causationId ?? 'caus-1',
    overrides.actorId ?? 'actor-1',
    overrides.idempotencyKey ?? 'idem-1',
    overrides.personId ?? 'person-1',
    overrides.planId ?? 'plan-1',
    overrides.serviceId ?? 'service-1',
    overrides.locationId ?? 'location-1',
    overrides.publicId ?? `PUB-${aggregateVersion}`,
    overrides.timestamp,
  );
}

describe('InMemoryEventStore', () => {
  let store: InMemoryEventStore;

  beforeEach(() => {
    store = new InMemoryEventStore();
  });

  it('should store and retrieve events by aggregate', async () => {
    const event = makeEvent(1);

    await store.store({
      tenantId: 'tenant-1',
      aggregateType: 'subscription',
      aggregateId: 'sub-1',
      aggregateVersion: 1,
      event,
      workflowId: 'wf-1',
      policyIds: ['policy-1'],
      ruleIds: ['rule-1'],
    });

    const events = await store.findByAggregate('tenant-1', 'subscription', 'sub-1');
    expect(events).toHaveLength(1);
    expect(events[0].eventName).toBe('subscription.created');
    expect(events[0].aggregateVersion).toBe(1);
    expect(events[0].workflowId).toBe('wf-1');
    expect(events[0].integrityHash).toBeDefined();
  });

  it('should store events in version order', async () => {
    for (let v = 1; v <= 3; v++) {
      const event = makeEvent(v);
      await store.store({ tenantId: 'tenant-1', aggregateType: 'subscription', aggregateId: 'sub-1', aggregateVersion: v, event });
    }

    const events = await store.findByAggregate('tenant-1', 'subscription', 'sub-1');
    expect(events).toHaveLength(3);
    expect(events.map(e => e.aggregateVersion)).toEqual([1, 2, 3]);
  });

  it('should find events by correlation id', async () => {
    const event1 = makeEvent(1, { correlationId: 'corr-x' });
    const event2 = makeEvent(1, { subscriptionId: 'sub-2', correlationId: 'corr-x' });
    const event3 = makeEvent(1, { subscriptionId: 'sub-3', correlationId: 'corr-y' });

    await store.store({ tenantId: 'tenant-1', aggregateType: 'subscription', aggregateId: 'sub-1', aggregateVersion: 1, event: event1 });
    await store.store({ tenantId: 'tenant-1', aggregateType: 'subscription', aggregateId: 'sub-2', aggregateVersion: 1, event: event2 });
    await store.store({ tenantId: 'tenant-1', aggregateType: 'subscription', aggregateId: 'sub-3', aggregateVersion: 1, event: event3 });

    const events = await store.findByCorrelationId('corr-x');
    expect(events).toHaveLength(2);
  });

  it('should find events since a date', async () => {
    const old = makeEvent(1, { correlationId: null, causationId: null, actorId: null, idempotencyKey: null, timestamp: new Date('2024-01-01') });
    const recent = makeEvent(2, { correlationId: null, causationId: null, actorId: null, idempotencyKey: null, timestamp: new Date('2024-06-01') });

    await store.store({ tenantId: 'tenant-1', aggregateType: 'subscription', aggregateId: 'sub-1', aggregateVersion: 1, event: old });
    await store.store({ tenantId: 'tenant-1', aggregateType: 'subscription', aggregateId: 'sub-1', aggregateVersion: 2, event: recent });

    const events = await store.findSince('tenant-1', new Date('2024-03-01'));
    expect(events).toHaveLength(1);
    expect(events[0].aggregateVersion).toBe(2);
  });

  it('should store a batch of events', async () => {
    const params: StoreEventParams[] = [
      { tenantId: 'tenant-1', aggregateType: 'subscription', aggregateId: 'sub-1', aggregateVersion: 1, event: makeEvent(1, { correlationId: null, causationId: null, actorId: null, idempotencyKey: 'idem-1' }) },
      { tenantId: 'tenant-1', aggregateType: 'subscription', aggregateId: 'sub-1', aggregateVersion: 2, event: makeEvent(2, { correlationId: null, causationId: null, actorId: null, idempotencyKey: 'idem-2' }) },
    ];

    await store.storeBatch(params);

    const events = await store.findByAggregate('tenant-1', 'subscription', 'sub-1');
    expect(events).toHaveLength(2);
  });
});
