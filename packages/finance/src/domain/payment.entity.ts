import { v4 as uuid } from 'uuid';
import { PaymentSource, PaymentConfidence, PaymentStatus, PaymentEvidence } from './value-objects';

export class Payment {
  private readonly _id: string;
  private _status: PaymentStatus;
  private _reversedAt: Date | null = null;
  private _createdAt: Date;

  constructor(
    public readonly tenantId: string,
    public readonly invoiceIds: string[],
    public readonly amount: number,
    public readonly currency: string,
    public readonly source: PaymentSource,
    public readonly confidence: PaymentConfidence,
    public readonly evidence: PaymentEvidence | null = null,
    id?: string,
    status?: PaymentStatus,
  ) {
    this._id = id ?? uuid();
    this._status = status ?? PaymentStatus.PENDING;
    this._createdAt = new Date();
  }

  get id(): string { return this._id; }
  get status(): PaymentStatus { return this._status; }
  get reversedAt(): Date | null { return this._reversedAt; }
  get createdAt(): Date { return this._createdAt; }

  verify(): void {
    if (this._status !== PaymentStatus.PENDING) throw new Error(`Cannot verify payment in status ${this._status}`);
    this._status = PaymentStatus.VERIFIED;
  }

  reconcile(): void {
    if (this._status !== PaymentStatus.VERIFIED) throw new Error(`Cannot reconcile payment in status ${this._status}`);
    this._status = PaymentStatus.RECONCILED;
  }

  reverse(): void {
    if (this._status === PaymentStatus.REVERSED) throw new Error('Payment already reversed');
    this._status = PaymentStatus.REVERSED;
    this._reversedAt = new Date();
  }
}
