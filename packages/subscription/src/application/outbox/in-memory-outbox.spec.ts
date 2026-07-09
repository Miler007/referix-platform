import { InMemoryOutbox } from './in-memory-outbox';

describe('InMemoryOutbox', () => {
  let outbox: InMemoryOutbox;

  beforeEach(() => {
    outbox = new InMemoryOutbox();
  });

  it('should enqueue and retrieve unprocessed messages', async () => {
    await outbox.enqueue({
      tenantId: 't-1', aggregateType: 'subscription', aggregateId: 's-1',
      eventName: 'subscription.created', eventVersion: '1.0.0',
      payload: {}, correlationId: 'c-1', causationId: null, actorId: 'a-1',
    });

    const msgs = await outbox.getUnprocessed();
    expect(msgs).toHaveLength(1);
    expect(msgs[0].eventName).toBe('subscription.created');
    expect(msgs[0].processedAt).toBeNull();
  });

  it('should mark messages as processed', async () => {
    await outbox.enqueue({
      tenantId: 't-1', aggregateType: 'subscription', aggregateId: 's-1',
      eventName: 'subscription.created', eventVersion: '1.0.0',
      payload: {}, correlationId: null, causationId: null, actorId: null,
    });

    const msgs = await outbox.getUnprocessed();
    await outbox.markProcessed(msgs.map(m => m.id));

    const remaining = await outbox.getUnprocessed();
    expect(remaining).toHaveLength(0);
  });

  it('should return failed messages after max retries', async () => {
    const msg = {
      tenantId: 't-1', aggregateType: 'subscription', aggregateId: 's-1',
      eventName: 'subscription.created', eventVersion: '1.0.0',
      payload: {}, correlationId: null, causationId: null, actorId: null,
    };

    await outbox.enqueue(msg);
    const msgs = await outbox.getUnprocessed();
    outbox.recordFailure(msgs[0].id);
    outbox.recordFailure(msgs[0].id);
    outbox.recordFailure(msgs[0].id);

    const failed = await outbox.getFailed();
    expect(failed).toHaveLength(1);
  });

  it('should batch enqueue messages', async () => {
    await outbox.enqueueBatch([
      {
        tenantId: 't-1', aggregateType: 'subscription', aggregateId: 's-1',
        eventName: 'subscription.created', eventVersion: '1.0.0',
        payload: {}, correlationId: null, causationId: null, actorId: 'a-1',
      },
      {
        tenantId: 't-1', aggregateType: 'subscription', aggregateId: 's-1',
        eventName: 'subscription.activated', eventVersion: '1.0.0',
        payload: {}, correlationId: null, causationId: null, actorId: 'a-1',
      },
    ]);

    const msgs = await outbox.getUnprocessed();
    expect(msgs).toHaveLength(2);
  });
});
