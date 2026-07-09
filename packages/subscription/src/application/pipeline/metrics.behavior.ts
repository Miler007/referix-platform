import { ICommand } from '../bus/command-bus.interface';
import { IPipelineBehavior } from './pipeline-behavior.interface';

export interface UseCaseMetric {
  useCase: string;
  tenantId: string;
  actorId: string;
  correlationId: string;
  duration: number;
  success: boolean;
  error: string | null;
  timestamp: Date;
}

export class MetricsBehavior implements IPipelineBehavior<ICommand, unknown> {
  private metrics: UseCaseMetric[] = [];

  getMetrics(): UseCaseMetric[] {
    return [...this.metrics];
  }

  async handle(request: ICommand, next: () => Promise<unknown>): Promise<unknown> {
    const start = Date.now();
    let success = true;
    let error: string | null = null;

    try {
      const result = await next();
      return result;
    } catch (e) {
      success = false;
      error = (e as Error).message;
      throw e;
    } finally {
      this.metrics.push({
        useCase: request.type,
        tenantId: request.tenantId,
        actorId: request.actorId,
        correlationId: request.correlationId,
        duration: Date.now() - start,
        success,
        error,
        timestamp: new Date(),
      });
    }
  }
}
