import { ApiClient, RequestState } from '../api-client';

export interface Wallet {
  balance: number;
  pendingBalance: number;
  totalEarned: number;
  transactions?: { type: string; amount: number; description: string; created_at: string }[];
}

export interface Commission {
  id: string;
  referralId: string;
  baseAmount: number;
  finalAmount: number;
  financialState: string;
  createdAt: string;
}

export class WalletService {
  constructor(private api: ApiClient) {}

  async getWallet(referrerId: string): Promise<RequestState<Wallet>> {
    return this.api.get<Wallet>(`/api/v1/wallet?referrerId=${referrerId}`);
  }
}

export class CommissionService {
  constructor(private api: ApiClient) {}

  async getCommissions(referrerId?: string): Promise<RequestState<Commission[]>> {
    return this.api.get<Commission[]>(`/api/v1/commissions${referrerId ? `?referrerId=${referrerId}` : ''}`);
  }
}
