import { v4 as uuid } from 'uuid';
import { PlanStatus, PlanSpecs, InternalCosts, PlanSla } from './value-objects';

export interface PlanVersionSnapshot {
  version: number;
  name: string;
  price: number;
  specs: PlanSpecs;
  publishedAt: Date;
  createdBy: string;
  changelog: string;
}

export class ProductPlan {
  private readonly _id: string;
  private _status: PlanStatus;
  private _version: number;
  private _versions: PlanVersionSnapshot[] = [];
  private _publishedAt: Date | null = null;
  private _createdAt: Date;
  private _updatedAt: Date;

  constructor(
    public readonly tenantId: string,
    public readonly productId: string,
    public name: string,
    public readonly code: string,
    public description: string = '',
    public price: number,
    public specs: PlanSpecs = {},
    public promotionalPrice: number | null = null,
    public promotionDurationDays: number | null = null,
    public tax: number = 0,
    public currency: string = 'MXN',
    public internalCosts: InternalCosts = { installation: 0, equipment: 0, monthly: 0, support: 0 },
    public sla: PlanSla = { maxInstallationHours: 48, availability: 99.5, responseTimeHours: 4, repairTimeHours: 24 },
    public includedServiceIds: string[] = [],
    public compatibleEquipmentIds: string[] = [],
    public requiredDocumentTypes: string[] = [],
    public promotionIds: string[] = [],
    public commissionRuleIds: string[] = [],
    public coverageZoneIds: string[] = [],
    public businessRuleIds: string[] = [],
    id?: string,
  ) {
    this._id = id ?? uuid();
    this._status = PlanStatus.DRAFT;
    this._version = 1;
    this._createdAt = new Date();
    this._updatedAt = new Date();
  }

  get id(): string { return this._id; }
  get status(): PlanStatus { return this._status; }
  get version(): number { return this._version; }
  get versions(): readonly PlanVersionSnapshot[] { return this._versions; }
  get publishedAt(): Date | null { return this._publishedAt; }

  submitForReview(): void {
    if (this._status !== PlanStatus.DRAFT) throw new Error(`Cannot submit plan in status ${this._status}`);
    this._status = PlanStatus.REVIEW;
    this._updatedAt = new Date();
  }

  publish(createdBy: string, changelog: string = ''): void {
    if (this._status !== PlanStatus.REVIEW && this._status !== PlanStatus.DRAFT) {
      throw new Error(`Cannot publish plan in status ${this._status}`);
    }
    this._status = PlanStatus.PUBLISHED;
    this._publishedAt = new Date();
    this._version++;

    this._versions.push({
      version: this._version,
      name: this.name,
      price: this.price,
      specs: { ...this.specs },
      publishedAt: this._publishedAt,
      createdBy,
      changelog,
    });
    this._updatedAt = new Date();
  }

  reject(reason: string): void {
    if (this._status !== PlanStatus.REVIEW) throw new Error(`Cannot reject plan in status ${this._status}`);
    this._status = PlanStatus.DRAFT;
    this._updatedAt = new Date();
  }

  archive(): void {
    if (this._status !== PlanStatus.PUBLISHED) throw new Error(`Cannot archive plan in status ${this._status}`);
    this._status = PlanStatus.ARCHIVED;
    this._updatedAt = new Date();
  }

  updatePrices(newPrice: number, promoPrice: number | null, promoDays: number | null): void {
    if (this._status === PlanStatus.PUBLISHED) {
      this._version++;
    }
    this.price = newPrice;
    this.promotionalPrice = promoPrice;
    this.promotionDurationDays = promoDays;
    this._updatedAt = new Date();
  }
}
