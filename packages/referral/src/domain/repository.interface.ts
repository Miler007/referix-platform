import { ReferralAccount } from './referral-account.entity';
import { Referral } from './referral.entity';
import { AccountStatus } from './value-objects';

export const REFERRAL_ACCOUNT_REPOSITORY = 'REFERRAL_ACCOUNT_REPOSITORY';
export const REFERRAL_REPOSITORY = 'REFERRAL_REPOSITORY';

export interface IReferralAccountRepository {
  save(account: ReferralAccount): Promise<void>;
  findById(tenantId: string, accountId: string): Promise<ReferralAccount | null>;
  findByPersonId(tenantId: string, personId: string): Promise<ReferralAccount | null>;
  findByStatus(tenantId: string, status: AccountStatus): Promise<ReferralAccount[]>;
}

export interface IReferralRepository {
  save(referral: Referral): Promise<void>;
  findById(tenantId: string, referralId: string): Promise<Referral | null>;
  findByReferrer(tenantId: string, referrerPersonId: string): Promise<Referral[]>;
  search(tenantId: string, criteria: { status?: string; referrerId?: string; page?: number; limit?: number }): Promise<{ data: Referral[]; total: number }>;
}
