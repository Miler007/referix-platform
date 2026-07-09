import { v4 as uuid } from 'uuid';

export class CommercialProduct {
  private readonly _id: string;
  private _active: boolean;
  private _version: number;
  private _createdAt: Date;
  private _updatedAt: Date;

  constructor(
    public readonly tenantId: string,
    public readonly name: string,
    public readonly code: string,
    public readonly description: string = '',
    public readonly category: string = '',
    public readonly icon: string = '',
    id?: string,
  ) {
    this._id = id ?? uuid();
    this._active = true;
    this._version = 1;
    this._createdAt = new Date();
    this._updatedAt = new Date();
  }

  get id(): string { return this._id; }
  get active(): boolean { return this._active; }
  get version(): number { return this._version; }

  deactivate(): void { this._active = false; this._updatedAt = new Date(); this._version++; }
  activate(): void { this._active = true; this._updatedAt = new Date(); this._version++; }
}
