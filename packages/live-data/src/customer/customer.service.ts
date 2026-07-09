import { ApiClient, RequestState } from '../api-client';

export interface CustomerSummary {
  id: string;
  name: string;
  phone: string;
  address: string;
  status: string;
  plan?: string;
}

export class CustomerService {
  constructor(private api: ApiClient) {}

  async search(query: string): Promise<RequestState<CustomerSummary[]>> {
    return this.api.get<CustomerSummary[]>(`/api/v1/referrals?query=${encodeURIComponent(query)}&limit=10`);
  }
}

export class Customer360Service {
  constructor(private api: ApiClient) {}

  async getFullProfile(customerId: string): Promise<RequestState<CustomerSummary>> {
    return this.api.get<CustomerSummary>(`/api/v1/referrals/${customerId}`);
  }
}
