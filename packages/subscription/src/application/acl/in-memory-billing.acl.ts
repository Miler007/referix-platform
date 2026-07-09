import { ISubscriptionBillingAcl, BillingPaymentMethod, IBillingSubscriptionAcl, InvoiceReadModel } from './subscription-billing.acl';

export class InMemorySubscriptionBillingAcl implements ISubscriptionBillingAcl {
  async getPaymentMethod(subscriptionId: string, tenantId: string): Promise<BillingPaymentMethod> {
    return { id: 'pm-1', type: 'CREDIT_CARD', lastFour: '4242', isDefault: true };
  }

  async notifyActivation(subscriptionId: string, tenantId: string, activationDate: Date): Promise<void> {
    // In production: publishes event or calls Billing API
  }

  async notifySuspension(subscriptionId: string, tenantId: string, reason: string): Promise<void> {
    // In production: publishes event or calls Billing API
  }

  async notifyCancellation(subscriptionId: string, tenantId: string, reason: string): Promise<void> {
    // In production: publishes event or calls Billing API
  }
}

export class InMemoryBillingSubscriptionAcl implements IBillingSubscriptionAcl {
  async getInvoiceInfo(invoiceId: string, subscriptionId: string, tenantId: string): Promise<InvoiceReadModel> {
    return { id: invoiceId, subscriptionId, amount: 0, currency: 'USD', dueDate: new Date(), status: 'PENDING' };
  }
}
