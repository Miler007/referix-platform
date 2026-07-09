import { ApiClient, RequestState } from '../api-client';

export interface Zone {
  zone_id: string;
  name: string;
  technology: string;
  technology_code: string;
  technology_id: string;
}

export interface Plan {
  id: string;
  name: string;
  price: number;
  download_speed: number;
  upload_speed: number;
  is_symmetric: number;
  benefits: string;
  technology_name: string;
}

export class CatalogService {
  constructor(private api: ApiClient) {}

  async getZones(): Promise<RequestState<Zone[]>> {
    return this.api.get<Zone[]>('/api/v2/catalog/zones');
  }

  async getPlans(zoneId: string, techId: string): Promise<RequestState<Plan[]>> {
    return this.api.get<Plan[]>(`/api/v2/catalog/plans?zone_id=${zoneId}&technology_id=${techId}`);
  }

  async getPlanDetail(planId: string): Promise<RequestState<Plan>> {
    return this.api.get<Plan>(`/api/v2/catalog/plan-detail?plan_id=${planId}`);
  }
}

export class SalesService {
  constructor(private api: ApiClient) {}

  async createReferral(data: Record<string, unknown>): Promise<RequestState<{ id: string }>> {
    return this.api.post<{ id: string }>('/api/v1/referrals', data);
  }
}

export class OpportunityService {
  constructor(private api: ApiClient) {}
  // Pendiente: endpoint de oportunidades
}
