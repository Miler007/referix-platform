import { Payment } from './payment.entity';
import { PaymentSource, PaymentConfidence, PaymentStatus } from './value-objects';

describe('Payment', () => {
  it('should create in PENDING status', () => {
    const p = new Payment('t-1', ['inv-1'], 99.99, 'USD', PaymentSource.BANK, PaymentConfidence.HIGH);
    expect(p.status).toBe(PaymentStatus.PENDING);
  });

  it('should verify and reconcile', () => {
    const p = new Payment('t-1', ['inv-1'], 99.99, 'USD', PaymentSource.SELF, PaymentConfidence.HIGH);
    p.verify();
    expect(p.status).toBe(PaymentStatus.VERIFIED);
    p.reconcile();
    expect(p.status).toBe(PaymentStatus.RECONCILED);
  });

  it('should support reversal', () => {
    const p = new Payment('t-1', ['inv-1'], 99.99, 'USD', PaymentSource.BANK, PaymentConfidence.HIGH);
    p.reverse();
    expect(p.status).toBe(PaymentStatus.REVERSED);
    expect(p.reversedAt).not.toBeNull();
  });
});
