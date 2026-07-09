import { v4 as uuid } from 'uuid';
import { PromotionType } from './value-objects';

export class Promotion {
  private readonly _id: string;
  private _active: boolean;

  constructor(
    public readonly tenantId: string,
    public readonly name: string,
    public readonly code: string,
    public readonly type: PromotionType,
    public readonly value: number,
    public readonly durationDays: number,
    public readonly conditions: Record<string, unknown> = {},
    public readonly validFrom: Date = new Date(),
    public readonly validTo: Date | null = null,
    id?: string,
  ) {
    this._id = id ?? uuid();
    this._active = true;
  }

  get id(): string { return this._id; }
  get active(): boolean { return this._active; }
  isValid(): boolean { return this._active && (!this.validTo || new Date() <= this.validTo); }
  deactivate(): void { this._active = false; }
}

export class CommissionRule {
  private readonly _id: string;
  private _active: boolean;

  constructor(
    public readonly tenantId: string,
    public readonly name: string,
    public readonly type: string,
    public readonly value: number,
    public readonly conditions: Record<string, unknown> = {},
    public readonly priority: number = 1,
    public readonly holdingDays: number = 15,
    id?: string,
  ) {
    this._id = id ?? uuid();
    this._active = true;
  }

  get id(): string { return this._id; }
  get active(): boolean { return this._active; }
  deactivate(): void { this._active = false; }
}

export class BusinessRule {
  private readonly _id: string;
  private _active: boolean;

  constructor(
    public readonly tenantId: string,
    public readonly name: string,
    public readonly category: string,
    public readonly value: string | number | boolean,
    public readonly description: string = '',
    id?: string,
  ) {
    this._id = id ?? uuid();
    this._active = true;
  }

  get id(): string { return this._id; }
  get active(): boolean { return this._active; }
  deactivate(): void { this._active = false; }
}

export class IncludedService {
  private readonly _id: string;
  private _active: boolean;

  constructor(
    public readonly tenantId: string,
    public readonly name: string,
    public readonly code: string,
    public readonly description: string = '',
    public readonly category: string = '',
    id?: string,
  ) {
    this._id = id ?? uuid();
    this._active = true;
  }

  get id(): string { return this._id; }
  get active(): boolean { return this._active; }
  deactivate(): void { this._active = false; }
}
