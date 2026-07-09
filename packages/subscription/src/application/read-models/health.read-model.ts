export interface HealthReadModel {
  subscriptionId: string;
  overall: 'HEALTHY' | 'DEGRADED' | 'CRITICAL';
  statusStability: number;
  paymentStatus: 'CURRENT' | 'LATE' | 'UNKNOWN';
  supportTicketsOpen: number;
  lastActivityDate: Date | null;
  daysSinceLastActivity: number | null;
  warnings: string[];
}
