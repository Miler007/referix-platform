export interface ITransaction {
  commit(): Promise<void>;
  rollback(): Promise<void>;
}

export interface ITransactionManager {
  begin(): Promise<ITransaction>;
}

export interface IUnitOfWorkContext {
  transaction: ITransaction;
  onCommit(handler: () => Promise<void>): void;
  onRollback(handler: () => Promise<void>): void;
}

export interface IUnitOfWork {
  execute<T>(work: (uow: IUnitOfWorkContext) => Promise<T>): Promise<T>;
}
