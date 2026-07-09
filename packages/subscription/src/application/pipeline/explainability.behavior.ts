import { ICommand } from '../bus/command-bus.interface';
import { IPipelineBehavior } from './pipeline-behavior.interface';

export interface ExecutionTraceStep {
  step: string;
  result: string;
  detail?: string;
}

export class ExplainabilityBehavior implements IPipelineBehavior<ICommand, unknown> {
  private traces = new Map<string, ExecutionTraceStep[]>();

  addStep(correlationId: string, step: string, result: string, detail?: string): void {
    const trace = this.traces.get(correlationId) ?? [];
    trace.push({ step, result, detail });
    this.traces.set(correlationId, trace);
  }

  getTrace(correlationId: string): ExecutionTraceStep[] {
    return this.traces.get(correlationId) ?? [];
  }

  async handle(request: ICommand, next: () => Promise<unknown>): Promise<unknown> {
    this.addStep(request.correlationId, 'Pipeline:Start', 'initiated', request.type);
    try {
      const result = await next();
      this.addStep(request.correlationId, 'Pipeline:Complete', 'success');
      return result;
    } catch (error) {
      this.addStep(request.correlationId, 'Pipeline:Failed', 'error', (error as Error).message);
      throw error;
    }
  }
}
