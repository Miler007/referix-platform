import { ICommand } from '../bus/command-bus.interface';
import { IPipelineBehavior } from './pipeline-behavior.interface';

export class LoggingBehavior implements IPipelineBehavior<ICommand, unknown> {
  async handle(request: ICommand, next: () => Promise<unknown>): Promise<unknown> {
    const start = Date.now();
    try {
      const result = await next();
      const elapsed = Date.now() - start;
      console.log(`[APP] ${request.type} completed in ${elapsed}ms (tenant=${request.tenantId}, actor=${request.actorId})`);
      return result;
    } catch (error) {
      const elapsed = Date.now() - start;
      console.error(`[APP] ${request.type} failed after ${elapsed}ms: ${(error as Error).message}`);
      throw error;
    }
  }
}
