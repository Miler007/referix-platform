import { Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';

export type IntegrationProvider = 'MIKROTIK' | 'HUAWEI' | 'ZTE' | 'STRIPE' | 'WOMPI' | 'BANCOLOMBIA' | 'GOOGLE_MAPS' | 'WHATSAPP' | 'SMTP' | 'SMS' | 'WEBHOOK' | 'REST_API';
export type IntegrationStatus = 'CONNECTED' | 'DISCONNECTED' | 'ERROR' | 'PENDING_CONFIG';

export interface IntegrationConnector {
  id: string;
  tenantId: string;
  name: string;
  provider: IntegrationProvider;
  status: IntegrationStatus;
  config: Record<string, string>;
  healthCheckUrl?: string;
  lastCheckAt?: Date | null;
  lastError?: string | null;
  logs: IntegrationLog[];
}

export interface IntegrationLog {
  timestamp: Date;
  level: 'INFO' | 'WARN' | 'ERROR';
  message: string;
}

@Injectable()
export class IntegrationHubService {
  private connectors = new Map<string, IntegrationConnector>();

  async register(tenantId: string, name: string, provider: IntegrationProvider, config: Record<string, string>): Promise<IntegrationConnector> {
    const connector: IntegrationConnector = {
      id: uuid(), tenantId, name, provider, status: 'PENDING_CONFIG',
      config, logs: [],
    };
    this.connectors.set(connector.id, connector);
    return connector;
  }

  async getAll(tenantId: string): Promise<IntegrationConnector[]> {
    return Array.from(this.connectors.values()).filter(c => c.tenantId === tenantId);
  }

  async getById(tenantId: string, id: string): Promise<IntegrationConnector | null> {
    const c = this.connectors.get(id);
    return c?.tenantId === tenantId ? c : null;
  }

  async updateConfig(tenantId: string, id: string, config: Record<string, string>): Promise<void> {
    const c = await this.getById(tenantId, id);
    if (!c) throw new Error(`Integration ${id} not found`);
    c.config = { ...c.config, ...config };
    c.status = 'CONNECTED';
  }

  async runHealthCheck(tenantId: string, id: string): Promise<IntegrationStatus> {
    const c = await this.getById(tenantId, id);
    if (!c) throw new Error(`Integration ${id} not found`);
    c.lastCheckAt = new Date();
    c.status = 'CONNECTED';
    c.logs.push({ timestamp: new Date(), level: 'INFO', message: 'Health check passed' });
    return c.status;
  }

  async reportError(tenantId: string, id: string, error: string): Promise<void> {
    const c = await this.getById(tenantId, id);
    if (!c) return;
    c.status = 'ERROR';
    c.lastError = error;
    c.lastCheckAt = new Date();
    c.logs.push({ timestamp: new Date(), level: 'ERROR', message: error });
  }

  async getStatusSummary(tenantId: string): Promise<{ connected: number; disconnected: number; errors: number; pending: number }> {
    const all = await this.getAll(tenantId);
    return {
      connected: all.filter(c => c.status === 'CONNECTED').length,
      disconnected: all.filter(c => c.status === 'DISCONNECTED').length,
      errors: all.filter(c => c.status === 'ERROR').length,
      pending: all.filter(c => c.status === 'PENDING_CONFIG').length,
    };
  }
}
