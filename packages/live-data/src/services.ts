/**
 * Live Data Services
 * 
 * Cada servicio es el único responsable de consumir la API.
 * Ninguna aplicación consulta datos directamente.
 */

import { ApiClient, RequestState } from './api-client';

export interface DashboardData {
  salesToday: number;
  commissionsHeld: { count: number; total: number };
  installationsPending: number;
  topReferidors: { name: string; sales: number; commission: number }[];
  recentActivity: { event: string; detail: string; time: string }[];
}

export interface PlanData {
  id: string;
  name: string;
  price: number;
  download_speed: number;
  is_symmetric: number;
  benefits: string;
  [key: string]: unknown;
}

export interface WalletData {
  balance: number;
  pendingBalance: number;
  totalEarned: number;
  transactions?: { type: string; amount: number; description: string; created_at: string }[];
}

export interface CustomerData {
  id: string;
  name: string;
  phone: string;
  address: string;
  status: string;
  plan: string;
}

export class DashboardService {
  constructor(private api: ApiClient) {}
  async get(): Promise<RequestState<DashboardData>> {
    return this.api.get<DashboardData>('/api/v1/dashboard');
  }
}

export class SalesService {
  constructor(private api: ApiClient) {}
  async getZones() { return this.api.get('/api/v2/catalog/zones'); }
  async getPlans(zoneId: string, techId: string) {
    return this.api.get<PlanData[]>(`/api/v2/catalog/plans?zone_id=${zoneId}&technology_id=${techId}`);
  }
  async createReferral(data: Record<string, unknown>) {
    return this.api.post('/api/v1/referrals', data);
  }
}

export class PartnerService {
  constructor(private api: ApiClient) {}
  async getWallet(referrerId: string) {
    return this.api.get<WalletData>(`/api/v1/wallet?referrerId=${referrerId}`);
  }
}

export class CustomerService {
  constructor(private api: ApiClient) {}
  async search(query: string) {
    return this.api.get<CustomerData[]>(`/api/v1/referrals?query=${encodeURIComponent(query)}&limit=10`);
  }
}

export class ExecutiveService {
  constructor(private api: ApiClient) {}
  async getKpis() {
    return this.api.get<DashboardData>('/api/v1/dashboard');
  }
}
