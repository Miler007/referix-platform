import { Injectable } from '@nestjs/common';
import { TenantContext } from '../kernel-core.interface';

@Injectable()
export class TenantService {
  private readonly tenants: Map<string, TenantContext> = new Map();
  private currentTenant?: TenantContext;

  async register(tenant: TenantContext): Promise<void> {
    this.tenants.set(tenant.tenantId, tenant);
  }

  async resolve(subdomain: string): Promise<TenantContext | null> {
    for (const tenant of this.tenants.values()) {
      if (tenant.subdomain === subdomain) return tenant;
    }
    return null;
  }

  async getById(tenantId: string): Promise<TenantContext | null> {
    return this.tenants.get(tenantId) ?? null;
  }

  async suspend(tenantId: string): Promise<void> {
    const tenant = this.tenants.get(tenantId);
    if (tenant) tenant.schema = `${tenant.schema}_suspended_${Date.now()}`;
  }

  setCurrent(context: TenantContext): void {
    this.currentTenant = context;
  }

  getCurrent(): TenantContext | null {
    return this.currentTenant ?? null;
  }

  listAll(): TenantContext[] {
    return Array.from(this.tenants.values());
  }
}
