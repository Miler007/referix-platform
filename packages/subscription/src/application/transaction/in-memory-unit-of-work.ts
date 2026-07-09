import { IUnitOfWork, IUnitOfWorkContext, ITransaction } from './transaction-manager.interface';

class InMemoryTransaction implements ITransaction {
  private _committed = false;
  private _rolledBack = false;

  get committed(): boolean { return this._committed; }
  get rolledBack(): boolean { return this._rolledBack; }

  async commit(): Promise<void> {
    this._committed = true;
  }

  async rollback(): Promise<void> {
    this._rolledBack = true;
  }
}

export class InMemoryUnitOfWork implements IUnitOfWork {
  private commitHandlers: (() => Promise<void>)[] = [];
  private rollbackHandlers: (() => Promise<void>)[] = [];

  async execute<T>(work: (uow: IUnitOfWorkContext) => Promise<T>): Promise<T> {
    const transaction = new InMemoryTransaction();
    const context: IUnitOfWorkContext = {
      transaction,
      onCommit: (handler) => { this.commitHandlers.push(handler); },
      onRollback: (handler) => { this.rollbackHandlers.push(handler); },
    };

    try {
      const result = await work(context);
      await transaction.commit();
      for (const handler of this.commitHandlers) {
        await handler();
      }
      return result;
    } catch (error) {
      await transaction.rollback();
      for (const handler of this.rollbackHandlers) {
        await handler();
      }
      throw error;
    } finally {
      this.commitHandlers = [];
      this.rollbackHandlers = [];
    }
  }
}
