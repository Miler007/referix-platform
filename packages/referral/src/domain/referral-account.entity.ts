import { v4 as uuid } from 'uuid';
import { AccountStatus, ReferralCode } from './value-objects';

export class ReferralAccount {
  private readonly _id: string;
  private _status: AccountStatus;
  private _referralCode: ReferralCode;
  private _approvedBy: string | null = null;
  private _approvedAt: Date | null = null;
  private _rejectionReason: string | null = null;
  private _createdAt: Date;
  private _walletId: string | null = null;
  private _totalReferrals: number = 0;
  private _activeReferrals: number = 0;

  constructor(
    public readonly tenantId: string,
    public readonly personId: string,
    id?: string,
    status?: AccountStatus,
    referralCode?: string,
  ) {
    this._id = id ?? uuid();
    this._status = status ?? AccountStatus.PENDING_APPROVAL;
    this._referralCode = new ReferralCode(referralCode ?? this.generateCode());
    this._createdAt = new Date();
  }

  get id(): string { return this._id; }
  get status(): AccountStatus { return this._status; }
  get referralCode(): string { return this._referralCode.value; }
  get createdAt(): Date { return this._createdAt; }
  get approvedBy(): string | null { return this._approvedBy; }
  get approvedAt(): Date | null { return this._approvedAt; }
  get rejectionReason(): string | null { return this._rejectionReason; }
  get walletId(): string | null { return this._walletId; }
  get totalReferrals(): number { return this._totalReferrals; }
  get activeReferrals(): number { return this._activeReferrals; }

  approve(approvedBy: string): void {
    if (this._status !== AccountStatus.PENDING_APPROVAL) {
      throw new Error(`Cannot approve account in status ${this._status}`);
    }
    this._approvedBy = approvedBy;
    this._approvedAt = new Date();
    this._status = AccountStatus.ACTIVE;
  }

  reject(reason: string): void {
    if (this._status !== AccountStatus.PENDING_APPROVAL) {
      throw new Error(`Cannot reject account in status ${this._status}`);
    }
    this._rejectionReason = reason;
    this._status = AccountStatus.REJECTED;
  }

  suspend(reason: string): void {
    if (this._status !== AccountStatus.ACTIVE) {
      throw new Error(`Cannot suspend account in status ${this._status}`);
    }
    this._status = AccountStatus.SUSPENDED;
  }

  activate(): void {
    if (this._status !== AccountStatus.SUSPENDED) {
      throw new Error(`Cannot activate account in status ${this._status}`);
    }
    this._status = AccountStatus.ACTIVE;
  }

  linkWallet(walletId: string): void {
    this._walletId = walletId;
  }

  incrementReferrals(): void {
    this._totalReferrals++;
    this._activeReferrals++;
  }

  decrementActiveReferral(): void {
    this._activeReferrals = Math.max(0, this._activeReferrals - 1);
  }

  private generateCode(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
      code += chars[Math.floor(Math.random() * chars.length)];
    }
    return code;
  }
}
