import { ApiClient, RequestState } from '../api-client';

export interface DashboardKpi {
  salesToday: number;
  salesMonth: number;
  commissionsHeld: { count: number; total: number };
  installationsPending: number;
  installationsCompleted: number;
  conversionRate: number;
  activeCustomers: number;
  topPlans: { name: string; count: number }[];
  topAdvisors: { name: string; sales: number }[];
  recentActivity: { event: string; detail: string; time: string }[];
}

export interface KpiDefinition {
  name: string;
  formula: string;
  source: string;
  endpoint: string;
  refreshInterval: string;
  owner: string;
}

export class DashboardService {
  constructor(private api: ApiClient) {}

  async getDashboard(): Promise<RequestState<DashboardKpi>> {
    return this.api.get<DashboardKpi>('/api/v1/dashboard');
  }
}

export class KpiService {
  constructor(private api: ApiClient) {}

  async getKpis(): Promise<RequestState<DashboardKpi>> {
    return this.api.get<DashboardKpi>('/api/v1/dashboard');
  }
}
