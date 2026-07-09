import { v4 as uuid } from 'uuid';
import { CommissionFinancialState, CommissionOperationalState } from './value-objects';

export class Commission {
  private readonly _id: string;
  private _financialState: CommissionFinancialState;
  private _operationalState: CommissionOperationalState;
  private _adjustments: number[] = [];
  private _heldUntil: Date | null = null;
  private _paidAt: Date | null = null;
  private _reversedAt: Date | null = null;
  private _createdAt: Date;

  constructor(
    public readonly tenantId: string,
    public readonly referralId: string,
    public readonly subscriptionId: string,
    public readonly policyId: string,
    public readonly baseAmount: number,
    public readonly finalAmount: number,
    public readonly explanation: string[],
    id?: string,
  ) {
    this._id = id ?? uuid();
    this._financialState = CommissionFinancialState.PENDING;
    this._operationalState = CommissionOperationalState.CALCULATED;
    this._createdAt = new Date();
  }

  get id(): string { return this._id; }
  get financialState(): CommissionFinancialState { return this._financialState; }
  get operationalState(): CommissionOperationalState { return this._operationalState; }
  get heldUntil(): Date | null { return this._heldUntil; }
  get paidAt(): Date | null { return this._paidAt; }
  get reversedAt(): Date | null { return this._reversedAt; }
  get createdAt(): Date { return this._createdAt; }

  hold(heldUntil: Date): void {
    if (this._financialState !== CommissionFinancialState.PENDING) throw new Error(`Cannot hold commission in state ${this._financialState}`);
    this._financialState = CommissionFinancialState.HELD;
    this._heldUntil = heldUntil;
  }

  release(): void {
    if (this._financialState !== CommissionFinancialState.HELD) throw new Error(`Cannot release commission in state ${this._financialState}`);
    this._financialState = CommissionFinancialState.AVAILABLE;
  }

  markPaid(paidAt: Date = new Date()): void {
    if (this._financialState !== CommissionFinancialState.AVAILABLE) throw new Error(`Cannot pay commission in state ${this._financialState}`);
    this._financialState = CommissionFinancialState.PAID;
    this._paidAt = paidAt;
  }

  reverse(): void {
    if (this._financialState === CommissionFinancialState.REVERSED) {
      throw new Error('Commission already reversed');
    }
    this._financialState = CommissionFinancialState.REVERSED;
    this._reversedAt = new Date();
  }

  approve(): void {
    if (this._operationalState !== CommissionOperationalState.CALCULATED) throw new Error(`Cannot approve commission in state ${this._operationalState}`);
    this._operationalState = CommissionOperationalState.APPROVED;
  }

  schedule(): void {
    if (this._operationalState !== CommissionOperationalState.APPROVED) throw new Error(`Cannot schedule commission in state ${this._operationalState}`);
    this._operationalState = CommissionOperationalState.SCHEDULED;
  }
}
