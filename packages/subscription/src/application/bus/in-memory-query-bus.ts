import { IQuery, IQueryBus, IQueryHandler } from './query-bus.interface';

export class InMemoryQueryBus implements IQueryBus {
  private handlers = new Map<string, IQueryHandler<IQuery, unknown>>();

  register<T extends IQuery, TResult>(type: string, handler: IQueryHandler<T, TResult>): void {
    this.handlers.set(type, handler as IQueryHandler<IQuery, unknown>);
  }

  async execute<TResult>(query: IQuery): Promise<TResult> {
    const handler = this.handlers.get(query.type);
    if (!handler) throw new Error(`No handler registered for query: ${query.type}`);
    return handler.handle(query) as Promise<TResult>;
  }
}
