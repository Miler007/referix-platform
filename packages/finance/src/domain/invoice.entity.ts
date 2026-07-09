import { v4 as uuid } from 'uuid';
import { InvoiceStatus, InvoiceLineItem } from './value-objects';

export class Invoice {
  private readonly _id: string;
  private _status: InvoiceStatus;
  private _paidAt: Date | null = null;
  private _sentAt: Date | null = null;
  private _createdAt: Date;
  private static sequence = new Map<string, number>();

  constructor(
    public readonly tenantId: string,
    public readonly billingAccountId: string,
    public readonly amount: number,
    public readonly currency: string,
    public readonly dueAt: Date,
    public readonly lineItems: InvoiceLineItem[] = [],
    id?: string,
    number?: string,
  ) {
    this._id = id ?? uuid();
    this._status = InvoiceStatus.PENDING;
    this._createdAt = new Date();
  }

  get id(): string { return this._id; }
  get status(): InvoiceStatus { return this._status; }
  get paidAt(): Date | null { return this._paidAt; }
  get sentAt(): Date | null { return this._sentAt; }
  get createdAt(): Date { return this._createdAt; }

  send(): void {
    if (this._status !== InvoiceStatus.PENDING) throw new Error(`Cannot send invoice in status ${this._status}`);
    this._status = InvoiceStatus.SENT;
    this._sentAt = new Date();
  }

  markPaid(paidAt: Date = new Date()): void {
    if (this._status !== InvoiceStatus.SENT && this._status !== InvoiceStatus.OVERDUE) {
      throw new Error(`Cannot pay invoice in status ${this._status}`);
    }
    this._status = InvoiceStatus.PAID;
    this._paidAt = paidAt;
  }

  markOverdue(): void {
    if (this._status !== InvoiceStatus.SENT) throw new Error(`Cannot overdue invoice in status ${this._status}`);
    this._status = InvoiceStatus.OVERDUE;
  }

  cancel(): void {
    if (this._status === InvoiceStatus.PAID) throw new Error('Cannot cancel paid invoice');
    this._status = InvoiceStatus.CANCELLED;
  }
}
