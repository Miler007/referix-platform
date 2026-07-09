import { v4 as uuid } from 'uuid';
import { BillingCycle, BillingAccountStatus } from './value-objects';

export class BillingAccount {
  private readonly _id: string;
  private _status: BillingAccountStatus;
  private _createdAt: Date;

  constructor(
    public readonly tenantId: string,
    public readonly subscriptionId: string,
    public readonly billingCycle: BillingCycle,
    public readonly amount: number,
    public readonly currency: string,
    public readonly nextBillingDate: Date,
    public readonly paymentMethodId: string | null = null,
    id?: string,
  ) {
    this._id = id ?? uuid();
    this._status = BillingAccountStatus.ACTIVE;
    this._createdAt = new Date();
  }

  get id(): string { return this._id; }
  get status(): BillingAccountStatus { return this._status; }

  suspend(): void { this._status = BillingAccountStatus.SUSPENDED; }
  cancel(): void { this._status = BillingAccountStatus.CANCELLED; }
  activate(): void { this._status = BillingAccountStatus.ACTIVE; }
}
