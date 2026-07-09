import { Commission } from './commission.entity';
import { CommissionFinancialState, CommissionOperationalState } from './value-objects';

describe('Commission', () => {
  it('should create in PENDING + CALCULATED state', () => {
    const c = new Commission('t-1', 'ref-1', 'sub-1', 'pol-1', 100, 100, ['50% of $200']);
    expect(c.financialState).toBe(CommissionFinancialState.PENDING);
    expect(c.operationalState).toBe(CommissionOperationalState.CALCULATED);
  });

  it('should transition through hold → release → paid', () => {
    const c = new Commission('t-1', 'ref-1', 'sub-1', 'pol-1', 50, 50, ['test']);
    c.hold(new Date(Date.now() + 15 * 86400000));
    expect(c.financialState).toBe(CommissionFinancialState.HELD);
    c.release();
    expect(c.financialState).toBe(CommissionFinancialState.AVAILABLE);
    c.markPaid();
    expect(c.financialState).toBe(CommissionFinancialState.PAID);
    expect(c.paidAt).not.toBeNull();
  });

  it('should support operational approval', () => {
    const c = new Commission('t-1', 'ref-1', 'sub-1', 'pol-1', 25, 25, ['test']);
    c.approve();
    expect(c.operationalState).toBe(CommissionOperationalState.APPROVED);
    c.schedule();
    expect(c.operationalState).toBe(CommissionOperationalState.SCHEDULED);
  });

  it('should reverse', () => {
    const c = new Commission('t-1', 'ref-1', 'sub-1', 'pol-1', 50, 50, ['test']);
    c.hold(new Date());
    c.release();
    c.reverse();
    expect(c.financialState).toBe(CommissionFinancialState.REVERSED);
    expect(c.reversedAt).not.toBeNull();
  });
});
