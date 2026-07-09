import { CommissionPolicy } from './commission-policy.entity';
import { PolicyType } from './value-objects';

describe('CommissionPolicy', () => {
  it('should calculate percentage', () => {
    const policy = new CommissionPolicy('t-1', '50% first invoice', PolicyType.PERCENTAGE, 50, {}, 1, 15);
    const result = policy.calculate(100);
    expect(result.baseAmount).toBe(50);
    expect(result.explanation).toContain('50%');
  });

  it('should calculate fixed amount', () => {
    const policy = new CommissionPolicy('t-1', 'Fixed $25', PolicyType.FIXED, 25, {}, 1, 0);
    const result = policy.calculate(100);
    expect(result.baseAmount).toBe(25);
  });

  it('should match conditions', () => {
    const policy = new CommissionPolicy('t-1', 'Plan Premium', PolicyType.PERCENTAGE, 60, { planId: 'premium' }, 2, 15);
    expect(policy.matches('city', 'premium', 100)).toBe(true);
    expect(policy.matches('city', 'basic', 100)).toBe(false);
  });

  it('should respect priority order', () => {
    const p1 = new CommissionPolicy('t-1', 'High', PolicyType.PERCENTAGE, 50, {}, 10, 15);
    const p2 = new CommissionPolicy('t-1', 'Low', PolicyType.PERCENTAGE, 30, {}, 5, 15);
    expect(p1.priority).toBeGreaterThan(p2.priority);
  });

  it('should not match if deactivated', () => {
    const policy = new CommissionPolicy('t-1', 'Test', PolicyType.FIXED, 10, {}, 1, 0);
    policy.deactivate();
    expect(policy.matches('city', 'plan', 100)).toBe(false);
  });
});
