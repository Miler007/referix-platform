export enum AccountStatus {
  PENDING_APPROVAL = 'PENDING_APPROVAL',
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
  REJECTED = 'REJECTED',
  INACTIVE = 'INACTIVE',
}

export enum FunnelStatus {
  NEW = 'NEW',
  CONTACTED = 'CONTACTED',
  QUALIFIED = 'QUALIFIED',
  NEGOTIATING = 'NEGOTIATING',
  WON = 'WON',
  LOST = 'LOST',
}

export enum ReferralSource {
  WHATSAPP = 'WHATSAPP',
  FACEBOOK = 'FACEBOOK',
  INSTAGRAM = 'INSTAGRAM',
  TIKTOK = 'TIKTOK',
  DIRECT = 'DIRECT',
  QR = 'QR',
  LANDING_PAGE = 'LANDING_PAGE',
  PROMO_CODE = 'PROMO_CODE',
  CAMPAIGN = 'CAMPAIGN',
  SALES_AGENT = 'SALES_AGENT',
  OTHER = 'OTHER',
}

export enum LostReason {
  COVERAGE_FAILED = 'COVERAGE_FAILED',
  NO_PORT_AVAILABLE = 'NO_PORT_AVAILABLE',
  CLIENT_REJECTED_PRICE = 'CLIENT_REJECTED_PRICE',
  CLIENT_REJECTED_TERMS = 'CLIENT_REJECTED_TERMS',
  DUPLICATE_CLIENT = 'DUPLICATE_CLIENT',
  CLIENT_NOT_CONTACTABLE = 'CLIENT_NOT_CONTACTABLE',
  CLIENT_ALREADY_INSTALLED = 'CLIENT_ALREADY_INSTALLED',
  CLIENT_SUSPENDED = 'CLIENT_SUSPENDED',
  CLIENT_CANCELLED = 'CLIENT_CANCELLED',
  INVALID_ADDRESS = 'INVALID_ADDRESS',
  INVALID_DOCUMENT = 'INVALID_DOCUMENT',
  CREDIT_REJECTED = 'CREDIT_REJECTED',
  REFERIDOR_CANCELLED = 'REFERIDOR_CANCELLED',
  EXPIRED = 'EXPIRED',
  OTHER = 'OTHER',
}

export enum DuplicateClassification {
  EXACT = 'EXACT',
  PROBABLE = 'PROBABLE',
  EXISTING_CLIENT = 'EXISTING_CLIENT',
  SUSPENDED_CLIENT = 'SUSPENDED_CLIENT',
  CANCELLED_CLIENT = 'CANCELLED_CLIENT',
  ACTIVE_CLIENT = 'ACTIVE_CLIENT',
}

export class ReferralCode {
  private static readonly PATTERN = /^[A-Z0-9]{6,12}$/;
  constructor(public readonly value: string) {
    if (!ReferralCode.PATTERN.test(value)) throw new Error(`Invalid referral code: ${value}`);
  }
  equals(other: ReferralCode): boolean { return this.value === other.value; }
}

export class ProspectInfo {
  constructor(
    public readonly fullName: string,
    public readonly phone: string,
    public readonly email: string | null,
    public readonly address: string,
    public readonly latitude: number | null,
    public readonly longitude: number | null,
    public readonly notes?: string,
  ) {}
}

export interface ReferralScore {
  totalReferrals: number;
  conversionRate: number;
  averageActivationDays: number;
  cancellationRate: number;
  activeReferrals: number;
  averageCommissionValue: number;
  lastActivityDate: Date | null;
}
