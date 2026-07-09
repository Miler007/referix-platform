import { ICommand, ICommandBus, ICommandHandler } from './command-bus.interface';
import { IPipelineBehavior } from '../pipeline/pipeline-behavior.interface';

export class InMemoryCommandBus implements ICommandBus {
  private handlers = new Map<string, ICommandHandler<ICommand, unknown>>();
  private behaviors: IPipelineBehavior<ICommand, unknown>[] = [];

  register<T extends ICommand, TResult>(type: string, handler: ICommandHandler<T, TResult>): void {
    this.handlers.set(type, handler as ICommandHandler<ICommand, unknown>);
  }

  registerBehavior(behavior: IPipelineBehavior<ICommand, unknown>): void {
    this.behaviors.push(behavior);
  }

  async execute<TResult = void>(command: ICommand): Promise<TResult> {
    const handler = this.handlers.get(command.type);
    if (!handler) throw new Error(`No handler registered for command: ${command.type}`);

    let index = 0;
    const next = async (): Promise<unknown> => {
      if (index < this.behaviors.length) {
        const behavior = this.behaviors[index++]!;
        return behavior.handle(command, next);
      }
      return handler.handle(command);
    };

    return next() as Promise<TResult>;
  }
}
