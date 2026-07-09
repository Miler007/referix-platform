import { InMemoryUnitOfWork } from './in-memory-unit-of-work';

describe('InMemoryUnitOfWork', () => {
  let uow: InMemoryUnitOfWork;

  beforeEach(() => {
    uow = new InMemoryUnitOfWork();
  });

  it('should execute work and commit', async () => {
    let committed = false;
    await uow.execute(async (ctx) => {
      ctx.onCommit(async () => { committed = true; });
    });
    expect(committed).toBe(true);
  });

  it('should rollback on error and not commit', async () => {
    let committed = false;
    let rolledBack = false;

    await expect(
      uow.execute(async (ctx) => {
        ctx.onCommit(async () => { committed = true; });
        ctx.onRollback(async () => { rolledBack = true; });
        throw new Error('fail');
      }),
    ).rejects.toThrow('fail');

    expect(committed).toBe(false);
    expect(rolledBack).toBe(true);
  });

  it('should run commit handlers after successful work', async () => {
    const order: string[] = [];
    await uow.execute(async (ctx) => {
      ctx.onCommit(async () => { order.push('commit1'); });
      ctx.onCommit(async () => { order.push('commit2'); });
    });
    expect(order).toEqual(['commit1', 'commit2']);
  });

  it('should run rollback handlers on failure', async () => {
    const order: string[] = [];
    await expect(
      uow.execute(async (ctx) => {
        ctx.onRollback(async () => { order.push('rollback1'); });
        ctx.onRollback(async () => { order.push('rollback2'); });
        throw new Error('fail');
      }),
    ).rejects.toThrow('fail');
    expect(order).toEqual(['rollback1', 'rollback2']);
  });
});
