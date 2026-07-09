import { ApiClient, RequestState } from '../api-client';

export interface Installation {
  id: string;
  subscriptionId: string;
  technicianId: string;
  scheduledDate: string;
  status: string;
}

export interface CoverageResult {
  available: boolean;
  technology: string;
  freePorts: number;
  message: string;
}

export class InstallationService {
  constructor(private api: ApiClient) {}

  async getPending(tenantId: string): Promise<RequestState<Installation[]>> {
    return this.api.get<Installation[]>(`/api/v1/installations?status=PENDING`);
  }
}

export class CoverageService {
  constructor(private api: ApiClient) {}

  async check(address: string, lat: number, lng: number): Promise<RequestState<CoverageResult>> {
    return this.api.post<CoverageResult>('/api/v1/coverage/check', { address, latitude: lat, longitude: lng });
  }
}
