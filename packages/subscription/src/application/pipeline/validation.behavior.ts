import { ICommand } from '../bus/command-bus.interface';
import { IPipelineBehavior } from './pipeline-behavior.interface';

export interface IValidationRule<T extends ICommand> {
  validate(command: T): string | null;
}

export class ValidationBehavior implements IPipelineBehavior<ICommand, unknown> {
  private rules = new Map<string, IValidationRule<ICommand>>();

  register<T extends ICommand>(type: string, rule: IValidationRule<T>): void {
    this.rules.set(type, rule as IValidationRule<ICommand>);
  }

  async handle(request: ICommand, next: () => Promise<unknown>): Promise<unknown> {
    const rule = this.rules.get(request.type);
    if (rule) {
      const error = rule.validate(request);
      if (error) throw new Error(`Validation failed for ${request.type}: ${error}`);
    }
    return next();
  }
}
