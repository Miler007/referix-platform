import { v4 as uuid } from 'uuid';
import { PolicyType } from './value-objects';

export interface PolicyConditions {
  municipality?: string;
  planId?: string;
  minInvoiceAmount?: number;
}

export class CommissionPolicy {
  private readonly _id: string;
  private _active: boolean;

  constructor(
    public readonly tenantId: string,
    public readonly name: string,
    public readonly type: PolicyType,
    public readonly value: number,
    public readonly conditions: PolicyConditions,
    public readonly priority: number,
    public readonly holdingPeriodDays: number = 15,
    id?: string,
    active?: boolean,
  ) {
    this._id = id ?? uuid();
    this._active = active ?? true;
  }

  get id(): string { return this._id; }
  get active(): boolean { return this._active; }

  matches(municipality: string, planId: string, invoiceAmount: number): boolean {
    if (!this._active) return false;
    if (this.conditions.municipality && this.conditions.municipality !== municipality) return false;
    if (this.conditions.planId && this.conditions.planId !== planId) return false;
    if (this.conditions.minInvoiceAmount && invoiceAmount < this.conditions.minInvoiceAmount) return false;
    return true;
  }

  calculate(invoiceAmount: number): { baseAmount: number; explanation: string } {
    switch (this.type) {
      case PolicyType.PERCENTAGE:
        return {
          baseAmount: invoiceAmount * (this.value / 100),
          explanation: `${this.value}% of invoice $${invoiceAmount} = $${(invoiceAmount * this.value / 100).toFixed(2)}`,
        };
      case PolicyType.FIXED:
        return {
          baseAmount: this.value,
          explanation: `Fixed commission: $${this.value}`,
        };
      case PolicyType.TIERED:
        return {
          baseAmount: this.value,
          explanation: `Tiered commission: $${this.value}`,
        };
      default:
        return { baseAmount: 0, explanation: 'No matching policy type' };
    }
  }

  deactivate(): void { this._active = false; }
  activate(): void { this._active = true; }
}
