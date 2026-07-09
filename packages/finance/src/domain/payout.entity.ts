import { v4 as uuid } from 'uuid';
import { PayoutMethod, PayoutStatus } from './value-objects';

export class Payout {
  private readonly _id: string;
  private _status: PayoutStatus;
  private _completedAt: Date | null = null;
  private _createdAt: Date;

  constructor(
    public readonly tenantId: string,
    public readonly walletId: string,
    public readonly amount: number,
    public readonly currency: string,
    public readonly paymentMethod: PayoutMethod,
    public readonly evidence: string | null = null,
    id?: string,
    status?: PayoutStatus,
  ) {
    this._id = id ?? uuid();
    this._status = status ?? PayoutStatus.REQUESTED;
    this._createdAt = new Date();
  }

  get id(): string { return this._id; }
  get status(): PayoutStatus { return this._status; }
  get completedAt(): Date | null { return this._completedAt; }

  approve(): void {
    if (this._status !== PayoutStatus.REQUESTED) throw new Error(`Cannot approve payout in status ${this._status}`);
    this._status = PayoutStatus.APPROVED;
  }

  process(): void {
    if (this._status !== PayoutStatus.APPROVED) throw new Error(`Cannot process payout in status ${this._status}`);
    this._status = PayoutStatus.PROCESSING;
  }

  complete(evidence: string): void {
    if (this._status !== PayoutStatus.PROCESSING) throw new Error(`Cannot complete payout in status ${this._status}`);
    this._status = PayoutStatus.COMPLETED;
    this._completedAt = new Date();
  }

  fail(reason: string): void {
    if (this._status !== PayoutStatus.PROCESSING) throw new Error(`Cannot fail payout in status ${this._status}`);
    this._status = PayoutStatus.FAILED;
    this._completedAt = new Date();
  }
}
