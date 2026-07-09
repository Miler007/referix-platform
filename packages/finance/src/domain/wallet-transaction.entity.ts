import { TransactionType } from './value-objects';

export class WalletTransaction {
  constructor(
    public readonly id: string,
    public readonly walletId: string,
    public readonly type: TransactionType,
    public readonly amount: number,
    public readonly balanceBefore: number,
    public readonly balanceAfter: number,
    public readonly description: string,
    public readonly referenceId: string | null,
    public readonly metadata: Record<string, unknown>,
    public readonly createdAt: Date,
  ) {}
}
