export interface TenantContext {
  tenantId: string;
  schema: string;
  subdomain: string;
  name: string;
}

export interface AuthenticatedUser {
  userId: string;
  tenantId: string;
  email: string;
  role: string;
  permissions: string[];
}

export interface AuditEntry {
  id: string;
  tenantId: string;
  userId: string;
  action: string;
  entity: string;
  entityId: string;
  before: Record<string, unknown> | null;
  after: Record<string, unknown> | null;
  metadata: Record<string, unknown>;
  timestamp: Date;
  correlationId: string;
}

export interface DomainEvent {
  eventName: string;
  version: number;
  tenantId: string;
  idempotencyKey: string;
  data: Record<string, unknown>;
  timestamp: Date;
}

export interface HealthStatus {
  status: 'UP' | 'DOWN' | 'DEGRADED';
  checks: Record<string, { status: string; details?: unknown }>;
  timestamp: string;
}

export interface PaginatedResult<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
