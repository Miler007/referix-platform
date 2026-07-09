import { BillingAccount } from './billing-account.entity';
import { Invoice } from './invoice.entity';
import { Payment } from './payment.entity';
import { Commission } from './commission.entity';
import { CommissionPolicy } from './commission-policy.entity';
import { Wallet } from './wallet.entity';
import { Payout } from './payout.entity';

export const BILLING_ACCOUNT_REPOSITORY = 'BILLING_ACCOUNT_REPOSITORY';
export const INVOICE_REPOSITORY = 'INVOICE_REPOSITORY';
export const PAYMENT_REPOSITORY = 'PAYMENT_REPOSITORY';
export const COMMISSION_REPOSITORY = 'COMMISSION_REPOSITORY';
export const COMMISSION_POLICY_REPOSITORY = 'COMMISSION_POLICY_REPOSITORY';
export const WALLET_REPOSITORY = 'WALLET_REPOSITORY';
export const PAYOUT_REPOSITORY = 'PAYOUT_REPOSITORY';

export interface IBillingAccountRepository { save(account: BillingAccount): Promise<void>; findById(tenantId: string, id: string): Promise<BillingAccount | null>; findBySubscription(tenantId: string, subscriptionId: string): Promise<BillingAccount | null>; }
export interface IInvoiceRepository { save(invoice: Invoice): Promise<void>; findById(tenantId: string, id: string): Promise<Invoice | null>; findByBillingAccount(tenantId: string, billingAccountId: string): Promise<Invoice[]>; }
export interface IPaymentRepository { save(payment: Payment): Promise<void>; findById(tenantId: string, id: string): Promise<Payment | null>; findByInvoice(tenantId: string, invoiceId: string): Promise<Payment[]>; }
export interface ICommissionRepository { save(commission: Commission): Promise<void>; findById(tenantId: string, id: string): Promise<Commission | null>; findByReferral(tenantId: string, referralId: string): Promise<Commission[]>; }
export interface ICommissionPolicyRepository { save(policy: CommissionPolicy): Promise<void>; findById(tenantId: string, id: string): Promise<CommissionPolicy | null>; findAllActive(tenantId: string): Promise<CommissionPolicy[]>; }
export interface IWalletRepository { save(wallet: Wallet): Promise<void>; findById(tenantId: string, id: string): Promise<Wallet | null>; findByReferralAccount(tenantId: string, referralAccountId: string): Promise<Wallet | null>; }
export interface IPayoutRepository { save(payout: Payout): Promise<void>; findById(tenantId: string, id: string): Promise<Payout | null>; findByWallet(tenantId: string, walletId: string): Promise<Payout[]>; }
