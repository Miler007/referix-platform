import { ICommand } from '../bus/command-bus.interface';
import { IPipelineBehavior } from './pipeline-behavior.interface';

export class IdempotencyBehavior implements IPipelineBehavior<ICommand, unknown> {
  private executed = new Set<string>();

  async handle(request: ICommand, next: () => Promise<unknown>): Promise<unknown> {
    if (!request.idempotencyKey) {
      return next();
    }

    const key = `${request.type}:${request.idempotencyKey}`;
    if (this.executed.has(key)) {
      return;
    }

    this.executed.add(key);
    try {
      return await next();
    } catch (error) {
      this.executed.delete(key);
      throw error;
    }
  }

  hasExecuted(type: string, idempotencyKey: string): boolean {
    return this.executed.has(`${type}:${idempotencyKey}`);
  }

  clear(): void {
    this.executed.clear();
  }
}
