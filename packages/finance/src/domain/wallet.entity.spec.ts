import { Wallet } from './wallet.entity';
import { TransactionType } from './value-objects';

describe('Wallet', () => {
  it('should start with zero balance', () => {
    const w = new Wallet('t-1', 'ra-1');
    expect(w.balance).toBe(0);
    expect(w.totalEarned).toBe(0);
  });

  it('should add commission transaction', () => {
    const w = new Wallet('t-1', 'ra-1');
    w.addTransaction(TransactionType.COMMISSION, 50, 'Commission for sale', 'comm-1');
    expect(w.balance).toBe(50);
    expect(w.totalEarned).toBe(50);
  });

  it('should record balanceBefore and balanceAfter', () => {
    const w = new Wallet('t-1', 'ra-1');
    const tx = w.addTransaction(TransactionType.COMMISSION, 100, 'Commission');
    expect(tx.balanceBefore).toBe(0);
    expect(tx.balanceAfter).toBe(100);
  });

  it('should support hold and release', () => {
    const w = new Wallet('t-1', 'ra-1');
    w.addTransaction(TransactionType.COMMISSION, 100, 'Earned');
    w.addTransaction(TransactionType.HOLD, 50, 'Hold for guarantee');
    expect(w.balance).toBe(50);
    expect(w.pendingBalance).toBe(50);
    w.addTransaction(TransactionType.RELEASE, 50, 'Released');
    expect(w.balance).toBe(100);
    expect(w.pendingBalance).toBe(0);
  });

  it('should support payout', () => {
    const w = new Wallet('t-1', 'ra-1');
    w.addTransaction(TransactionType.COMMISSION, 200, 'Earned');
    w.addTransaction(TransactionType.PAYOUT, 150, 'Withdrawal');
    expect(w.balance).toBe(50);
    expect(w.totalWithdrawn).toBe(150);
  });

  it('should reject payout exceeding balance', () => {
    const w = new Wallet('t-1', 'ra-1');
    expect(() => w.addTransaction(TransactionType.PAYOUT, 100, 'Overdraft')).toThrow();
  });

  it('should support reversal', () => {
    const w = new Wallet('t-1', 'ra-1');
    w.addTransaction(TransactionType.COMMISSION, 50, 'Earned');
    w.addTransaction(TransactionType.REVERSAL, 50, 'Reversed');
    expect(w.balance).toBe(0);
    expect(w.totalEarned).toBe(0);
  });
});
