export interface DispatchCriteria {
  requiredSkills: string[];
  preferredTechnicianId?: string;
  maxDistanceKm?: number;
  timeWindow?: { start: Date; end: Date };
}

export interface DispatchResult {
  technicianId: string;
  estimatedArrival: Date;
  routePosition: number;
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface IDispatchEngine {
  assign(tenantId: string, installationId: string, criteria: DispatchCriteria): Promise<DispatchResult>;
}
