export interface IQuery {
  readonly type: string;
  readonly tenantId: string;
}

export interface IQueryBus {
  execute<TResult>(query: IQuery): Promise<TResult>;
}

export interface IQueryHandler<TQuery extends IQuery, TResult> {
  handle(query: TQuery): Promise<TResult>;
}
