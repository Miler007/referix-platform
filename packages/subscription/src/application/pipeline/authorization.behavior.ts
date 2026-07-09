import { ICommand } from '../bus/command-bus.interface';
import { IPipelineBehavior } from './pipeline-behavior.interface';

export interface IAuthorizationChecker {
  authorize(command: ICommand): boolean;
}

export class AuthorizationBehavior implements IPipelineBehavior<ICommand, unknown> {
  private checkers = new Map<string, IAuthorizationChecker>();

  register(type: string, checker: IAuthorizationChecker): void {
    this.checkers.set(type, checker);
  }

  async handle(request: ICommand, next: () => Promise<unknown>): Promise<unknown> {
    const checker = this.checkers.get(request.type);
    if (checker && !checker.authorize(request)) {
      throw new Error(`Authorization denied for ${request.type}: actor ${request.actorId}`);
    }
    return next();
  }
}
