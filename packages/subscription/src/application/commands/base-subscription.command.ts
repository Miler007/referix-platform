import { ICommand } from '../bus/command-bus.interface';

export abstract class BaseSubscriptionCommand implements ICommand {
  public abstract readonly type: string;
  public readonly timestamp: Date;

  constructor(
    public readonly subscriptionId: string,
    public readonly tenantId: string,
    public readonly actorId: string,
    public readonly correlationId: string,
    public readonly causationId?: string,
    public readonly idempotencyKey?: string,
  ) {
    this.timestamp = new Date();
  }
}

