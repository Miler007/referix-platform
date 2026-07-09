import { ReferralAccount } from './referral-account.entity';
import { AccountStatus } from './value-objects';

describe('ReferralAccount', () => {
  it('should create with PENDING_APPROVAL status', () => {
    const acc = new ReferralAccount('t-1', 'person-1');
    expect(acc.status).toBe(AccountStatus.PENDING_APPROVAL);
    expect(acc.referralCode).toBeDefined();
    expect(acc.referralCode.length).toBe(8);
  });

  it('should approve and set metadata', () => {
    const acc = new ReferralAccount('t-1', 'person-1');
    acc.approve('supervisor-1');
    expect(acc.status).toBe(AccountStatus.ACTIVE);
    expect(acc.approvedBy).toBe('supervisor-1');
    expect(acc.approvedAt).not.toBeNull();
  });

  it('should reject with reason', () => {
    const acc = new ReferralAccount('t-1', 'person-1');
    acc.reject('Document not clear');
    expect(acc.status).toBe(AccountStatus.REJECTED);
    expect(acc.rejectionReason).toBe('Document not clear');
  });

  it('should throw on double approve', () => {
    const acc = new ReferralAccount('t-1', 'person-1');
    acc.approve('supervisor-1');
    expect(() => acc.approve('supervisor-2')).toThrow();
  });

  it('should support suspend/activate cycle', () => {
    const acc = new ReferralAccount('t-1', 'person-1');
    acc.approve('supervisor-1');
    acc.suspend('Fraud suspicion');
    expect(acc.status).toBe(AccountStatus.SUSPENDED);
    acc.activate();
    expect(acc.status).toBe(AccountStatus.ACTIVE);
  });

  it('should track referral counts', () => {
    const acc = new ReferralAccount('t-1', 'person-1');
    acc.approve('supervisor-1');
    acc.incrementReferrals();
    expect(acc.totalReferrals).toBe(1);
    expect(acc.activeReferrals).toBe(1);
    acc.decrementActiveReferral();
    expect(acc.activeReferrals).toBe(0);
  });
});
