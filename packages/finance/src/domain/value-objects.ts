export enum BillingCycle { MONTHLY = 'MONTHLY', QUARTERLY = 'QUARTERLY', YEARLY = 'YEARLY' }
export enum BillingAccountStatus { ACTIVE = 'ACTIVE', SUSPENDED = 'SUSPENDED', CANCELLED = 'CANCELLED' }

export enum InvoiceStatus { PENDING = 'PENDING', SENT = 'SENT', PAID = 'PAID', OVERDUE = 'OVERDUE', CANCELLED = 'CANCELLED' }

export enum PaymentSource { ERP = 'ERP', SELF = 'SELF', BANK = 'BANK', WEBHOOK = 'WEBHOOK', CSV = 'CSV', API = 'API' }
export enum PaymentConfidence { HIGH = 'HIGH', MEDIUM = 'MEDIUM', LOW = 'LOW' }
export enum PaymentStatus { PENDING = 'PENDING', VERIFIED = 'VERIFIED', RECONCILED = 'RECONCILED', REVERSED = 'REVERSED' }

export enum CommissionFinancialState { PENDING = 'PENDING', HELD = 'HELD', AVAILABLE = 'AVAILABLE', PAID = 'PAID', REVERSED = 'REVERSED', EXPIRED = 'EXPIRED' }
export enum CommissionOperationalState { CALCULATED = 'CALCULATED', APPROVED = 'APPROVED', SCHEDULED = 'SCHEDULED', EXPORTED = 'EXPORTED', SETTLED = 'SETTLED' }

export enum PolicyType { PERCENTAGE = 'PERCENTAGE', FIXED = 'FIXED', TIERED = 'TIERED', MUNICIPALITY = 'MUNICIPALITY', PLAN_BASED = 'PLAN_BASED' }

export enum TransactionType { COMMISSION = 'COMMISSION', ADJUSTMENT = 'ADJUSTMENT', BONUS = 'BONUS', HOLD = 'HOLD', RELEASE = 'RELEASE', PAYOUT = 'PAYOUT', REVERSAL = 'REVERSAL', PROMOTION = 'PROMOTION' }

export enum PayoutMethod { BANK_TRANSFER = 'BANK_TRANSFER', CASH = 'CASH', DIGITAL_WALLET = 'DIGITAL_WALLET' }
export enum PayoutStatus { REQUESTED = 'REQUESTED', APPROVED = 'APPROVED', PROCESSING = 'PROCESSING', COMPLETED = 'COMPLETED', FAILED = 'FAILED', REVERSED = 'REVERSED' }

export interface InvoiceLineItem {
  description: string;
  amount: number;
  quantity: number;
}

export interface PaymentEvidence {
  transactionId: string;
  receiptUrl: string | null;
  notes: string | null;
}
