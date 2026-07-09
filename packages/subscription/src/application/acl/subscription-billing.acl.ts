export interface BillingPaymentMethod {
  id: string;
  type: 'CREDIT_CARD' | 'DEBIT_CARD' | 'BANK_TRANSFER' | 'CASH';
  lastFour: string;
  isDefault: boolean;
}

export interface InvoiceReadModel {
  id: string;
  subscriptionId: string;
  amount: number;
  currency: string;
  dueDate: Date;
  status: 'PENDING' | 'PAID' | 'OVERDUE' | 'CANCELLED';
}

export interface ISubscriptionBillingAcl {
  getPaymentMethod(subscriptionId: string, tenantId: string): Promise<BillingPaymentMethod>;
  notifyActivation(subscriptionId: string, tenantId: string, activationDate: Date): Promise<void>;
  notifySuspension(subscriptionId: string, tenantId: string, reason: string): Promise<void>;
  notifyCancellation(subscriptionId: string, tenantId: string, reason: string): Promise<void>;
}

export interface IBillingSubscriptionAcl {
  getInvoiceInfo(invoiceId: string, subscriptionId: string, tenantId: string): Promise<InvoiceReadModel>;
}
