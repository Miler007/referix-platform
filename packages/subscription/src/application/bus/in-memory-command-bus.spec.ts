import { InMemoryCommandBus } from './in-memory-command-bus';
import { ICommand, ICommandHandler } from './command-bus.interface';
import { LoggingBehavior } from '../pipeline/logging.behavior';
import { IdempotencyBehavior } from '../pipeline/idempotency.behavior';
import { MetricsBehavior } from '../pipeline/metrics.behavior';

class TestCommand implements ICommand {
  readonly type = 'TestCommand';
  readonly timestamp = new Date();
  constructor(
    public readonly tenantId: string,
    public readonly actorId: string,
    public readonly correlationId: string,
    public readonly idempotencyKey?: string,
    public readonly causationId?: string,
  ) {}
}

class TestHandler implements ICommandHandler<TestCommand, string> {
  async handle(command: TestCommand): Promise<string> {
    return `handled:${command.actorId}`;
  }
}

describe('InMemoryCommandBus', () => {
  let bus: InMemoryCommandBus;

  beforeEach(() => {
    bus = new InMemoryCommandBus();
  });

  it('should execute a registered command handler', async () => {
    bus.register('TestCommand', new TestHandler());
    const result = await bus.execute(new TestCommand('tenant-1', 'actor-1', 'corr-1'));
    expect(result).toBe('handled:actor-1');
  });

  it('should throw when no handler is registered', async () => {
    await expect(bus.execute(new TestCommand('t', 'a', 'c'))).rejects.toThrow('No handler registered for command: TestCommand');
  });

  it('should run pipeline behaviors in order', async () => {
    const order: string[] = [];
    bus.registerBehavior({ handle: async (req, next) => { order.push('b1'); return next(); } });
    bus.registerBehavior({ handle: async (req, next) => { order.push('b2'); return next(); } });
    bus.register('TestCommand', new TestHandler());

    await bus.execute(new TestCommand('t', 'a', 'c'));
    expect(order).toEqual(['b1', 'b2']);
  });

  it('should short-circuit if behavior throws', async () => {
    bus.registerBehavior({ handle: async (_req, _next) => { throw new Error('blocked'); } });
    bus.register('TestCommand', new TestHandler());

    await expect(bus.execute(new TestCommand('t', 'a', 'c'))).rejects.toThrow('blocked');
  });

  it('should support idempotency via behavior', async () => {
    const idempotency = new IdempotencyBehavior();
    bus.registerBehavior(idempotency);
    let callCount = 0;
    bus.register('TestCommand', { handle: async () => { callCount++; return 'ok'; } } as ICommandHandler<ICommand, string>);

    const cmd1 = new TestCommand('t', 'a', 'c', 'key-1');
    const cmd2 = new TestCommand('t', 'a', 'c', 'key-1');

    await bus.execute(cmd1);
    await bus.execute(cmd2);

    expect(callCount).toBe(1);
  });

  it('should collect metrics via behavior', async () => {
    const metrics = new MetricsBehavior();
    bus.registerBehavior(metrics);
    bus.register('TestCommand', new TestHandler());

    await bus.execute(new TestCommand('t', 'a', 'corr-1'));

    const collected = metrics.getMetrics();
    expect(collected).toHaveLength(1);
    expect(collected[0].useCase).toBe('TestCommand');
    expect(collected[0].success).toBe(true);
    expect(collected[0].tenantId).toBe('t');
    expect(collected[0].actorId).toBe('a');
    expect(collected[0].correlationId).toBe('corr-1');
    expect(collected[0].duration).toBeGreaterThanOrEqual(0);
  });
});
