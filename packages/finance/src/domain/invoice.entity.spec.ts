import { Invoice } from './invoice.entity';
import { InvoiceStatus } from './value-objects';

describe('Invoice', () => {
  it('should create in PENDING status', () => {
    const inv = new Invoice('t-1', 'ba-1', 99.99, 'USD', new Date(Date.now() + 30 * 86400000));
    expect(inv.status).toBe(InvoiceStatus.PENDING);
  });

  it('should transition SENT → PAID', () => {
    const inv = new Invoice('t-1', 'ba-1', 99.99, 'USD', new Date());
    inv.send();
    expect(inv.status).toBe(InvoiceStatus.SENT);
    inv.markPaid();
    expect(inv.status).toBe(InvoiceStatus.PAID);
    expect(inv.paidAt).not.toBeNull();
  });

  it('should cancel from PENDING', () => {
    const inv = new Invoice('t-1', 'ba-1', 99.99, 'USD', new Date());
    inv.cancel();
    expect(inv.status).toBe(InvoiceStatus.CANCELLED);
  });

  it('should throw on invalid transitions', () => {
    const inv = new Invoice('t-1', 'ba-1', 99.99, 'USD', new Date());
    expect(() => inv.markPaid()).toThrow();
  });
});
