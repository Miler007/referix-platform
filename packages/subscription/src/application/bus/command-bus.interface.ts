export interface ICommand {
  readonly type: string;
  readonly tenantId: string;
  readonly actorId: string;
  readonly correlationId: string;
  readonly causationId?: string;
  readonly idempotencyKey?: string;
  readonly timestamp: Date;
}

export interface ICommandBus {
  execute<TResult = void>(command: ICommand): Promise<TResult>;
}

export interface ICommandHandler<TCommand extends ICommand, TResult = void> {
  handle(command: TCommand): Promise<TResult>;
}
