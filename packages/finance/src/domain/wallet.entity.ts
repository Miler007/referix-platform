import { v4 as uuid } from 'uuid';
import { WalletTransaction } from './wallet-transaction.entity';
import { TransactionType } from './value-objects';

export class Wallet {
  private readonly _id: string;
  private _balance: number;
  private _pendingBalance: number;
  private _totalEarned: number;
  private _totalWithdrawn: number;
  private _transactions: WalletTransaction[] = [];
  private _createdAt: Date;

  constructor(
    public readonly tenantId: string,
    public readonly referralAccountId: string,
    public readonly currency: string = 'USD',
    id?: string,
  ) {
    this._id = id ?? uuid();
    this._balance = 0;
    this._pendingBalance = 0;
    this._totalEarned = 0;
    this._totalWithdrawn = 0;
    this._createdAt = new Date();
  }

  get id(): string { return this._id; }
  get balance(): number { return this._balance; }
  get pendingBalance(): number { return this._pendingBalance; }
  get totalEarned(): number { return this._totalEarned; }
  get totalWithdrawn(): number { return this._totalWithdrawn; }
  get transactions(): readonly WalletTransaction[] { return this._transactions; }

  addTransaction(type: TransactionType, amount: number, description: string, referenceId: string | null = null, metadata: Record<string, unknown> = {}): WalletTransaction {
    const balanceBefore = this._balance;

    switch (type) {
      case TransactionType.COMMISSION:
      case TransactionType.BONUS:
      case TransactionType.PROMOTION:
        this._balance += amount;
        this._totalEarned += amount;
        break;
      case TransactionType.PAYOUT:
        if (amount > this._balance) throw new Error('Insufficient balance');
        this._balance -= amount;
        this._totalWithdrawn += amount;
        break;
      case TransactionType.REVERSAL:
        this._balance -= amount;
        this._totalEarned = Math.max(0, this._totalEarned - amount);
        break;
      case TransactionType.HOLD:
        if (amount > this._balance) throw new Error('Insufficient balance');
        this._balance -= amount;
        this._pendingBalance += amount;
        break;
      case TransactionType.RELEASE:
        this._pendingBalance -= amount;
        this._balance += amount;
        break;
      case TransactionType.ADJUSTMENT:
        this._balance += amount;
        if (amount > 0) this._totalEarned += amount;
        break;
    }

    const tx = new WalletTransaction(
      uuid(), this._id, type, amount, balanceBefore, this._balance,
      description, referenceId, metadata, new Date(),
    );
    this._transactions.push(tx);
    return tx;
  }

  getAvailableForPayout(): number {
    return this._balance;
  }
}
