import { InMemorySnapshotStore } from './in-memory-snapshot-store';

describe('InMemorySnapshotStore', () => {
  let store: InMemorySnapshotStore;

  beforeEach(() => {
    store = new InMemorySnapshotStore();
  });

  it('should save and retrieve latest snapshot', async () => {
    await store.save({
      aggregateId: 'sub-1',
      aggregateType: 'subscription',
      version: 1,
      snapshot: { status: 'DRAFT' },
      validFrom: new Date('2024-01-01'),
      validTo: null,
      eventName: 'subscription.created',
      changedBy: 'actor-1',
      correlationId: 'corr-1',
    });

    const latest = await store.findLatest('subscription', 'sub-1');
    expect(latest).not.toBeNull();
    expect(latest!.version).toBe(1);
    expect(latest!.snapshot).toEqual({ status: 'DRAFT' });
  });

  it('should return latest snapshot by version only', async () => {
    await store.save({
      aggregateId: 'sub-1', aggregateType: 'subscription', version: 1, snapshot: { status: 'DRAFT' },
      validFrom: new Date('2024-01-01'), validTo: new Date('2024-06-01'), eventName: 'subscription.created', changedBy: 'actor-1', correlationId: null,
    });
    await store.save({
      aggregateId: 'sub-1', aggregateType: 'subscription', version: 2, snapshot: { status: 'ACTIVE' },
      validFrom: new Date('2024-06-01'), validTo: null, eventName: 'subscription.activated', changedBy: 'actor-1', correlationId: null,
    });

    const latest = await store.findLatest('subscription', 'sub-1');
    expect(latest!.version).toBe(2);
    expect(latest!.snapshot).toEqual({ status: 'ACTIVE' });
  });

  it('should find snapshot at specific version', async () => {
    await store.save({
      aggregateId: 'sub-1', aggregateType: 'subscription', version: 1, snapshot: { status: 'DRAFT' },
      validFrom: new Date('2024-01-01'), validTo: null, eventName: 'subscription.created', changedBy: 'actor-1', correlationId: null,
    });

    const found = await store.findAtVersion('subscription', 'sub-1', 1);
    expect(found).not.toBeNull();
    expect(found!.snapshot).toEqual({ status: 'DRAFT' });

    const notFound = await store.findAtVersion('subscription', 'sub-1', 99);
    expect(notFound).toBeNull();
  });

  it('should find snapshot valid at a specific date', async () => {
    await store.save({
      aggregateId: 'sub-1', aggregateType: 'subscription', version: 1, snapshot: { status: 'DRAFT' },
      validFrom: new Date('2024-01-01'), validTo: new Date('2024-06-01'), eventName: 'subscription.created', changedBy: 'actor-1', correlationId: null,
    });
    await store.save({
      aggregateId: 'sub-1', aggregateType: 'subscription', version: 2, snapshot: { status: 'ACTIVE' },
      validFrom: new Date('2024-06-01'), validTo: null, eventName: 'subscription.activated', changedBy: 'actor-1', correlationId: null,
    });

    const atApril = await store.findAtDate('subscription', 'sub-1', new Date('2024-04-15'));
    expect(atApril).not.toBeNull();
    expect(atApril!.snapshot).toEqual({ status: 'DRAFT' });

    const atJuly = await store.findAtDate('subscription', 'sub-1', new Date('2024-07-15'));
    expect(atJuly!.snapshot).toEqual({ status: 'ACTIVE' });
  });

  it('should list all versions in order', async () => {
    await store.save({
      aggregateId: 'sub-1', aggregateType: 'subscription', version: 2, snapshot: { status: 'ACTIVE' },
      validFrom: new Date('2024-06-01'), validTo: null, eventName: 'subscription.activated', changedBy: 'actor-1', correlationId: null,
    });
    await store.save({
      aggregateId: 'sub-1', aggregateType: 'subscription', version: 1, snapshot: { status: 'DRAFT' },
      validFrom: new Date('2024-01-01'), validTo: new Date('2024-06-01'), eventName: 'subscription.created', changedBy: 'actor-1', correlationId: null,
    });

    const versions = await store.listVersions('subscription', 'sub-1');
    expect(versions).toHaveLength(2);
    expect(versions.map(v => v.version)).toEqual([1, 2]);
  });
});
