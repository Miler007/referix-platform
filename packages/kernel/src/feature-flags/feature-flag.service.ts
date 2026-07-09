import { Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';

export interface FeatureFlag {
  id: string;
  key: string;
  tenantId: string;
  enabled: boolean;
  description: string;
  module: string;
  defaultValue: boolean;
  dependencies: string[];
  beta: boolean;
}

@Injectable()
export class FeatureFlagService {
  private flags = new Map<string, FeatureFlag>();

  async getAll(tenantId: string): Promise<FeatureFlag[]> {
    return Array.from(this.flags.values()).filter(f => f.tenantId === tenantId);
  }

  async getByModule(tenantId: string, module: string): Promise<FeatureFlag[]> {
    return Array.from(this.flags.values()).filter(f => f.tenantId === tenantId && f.module === module);
  }

  async isEnabled(tenantId: string, key: string): Promise<boolean> {
    const flag = this.flags.get(`${tenantId}:${key}`);
    if (!flag) return false;

    // Check dependencies
    for (const dep of flag.dependencies) {
      const depFlag = this.flags.get(`${tenantId}:${dep}`);
      if (depFlag && !depFlag.enabled) return false;
    }

    return flag.enabled;
  }

  async setEnabled(tenantId: string, key: string, enabled: boolean): Promise<void> {
    const flag = this.flags.get(`${tenantId}:${key}`);
    if (!flag) throw new Error(`Flag ${key} not found for tenant ${tenantId}`);
    flag.enabled = enabled;
  }

  async create(tenantId: string, key: string, description: string, module: string, defaultValue: boolean = false, dependencies: string[] = [], beta: boolean = false): Promise<FeatureFlag> {
    if (this.flags.has(`${tenantId}:${key}`)) throw new Error(`Flag ${key} already exists for tenant`);
    const flag: FeatureFlag = { id: uuid(), key, tenantId, enabled: defaultValue, description, module, defaultValue, dependencies, beta };
    this.flags.set(`${tenantId}:${key}`, flag);
    return flag;
  }

  async seedDefaults(tenantId: string): Promise<void> {
    const defaults: Omit<FeatureFlag, 'id' | 'tenantId'>[] = [
      { key: 'DEMO_MODE', enabled: false, description: 'Enable demo mode with simulated data', module: 'platform', defaultValue: false, dependencies: [], beta: false },
      { key: 'AI_SCORING', enabled: false, description: 'Enable AI-powered lead scoring', module: 'ai', defaultValue: false, dependencies: [], beta: true },
      { key: 'CAMPAIGNS', enabled: false, description: 'Enable marketing campaigns module', module: 'marketing', defaultValue: false, dependencies: [], beta: true },
      { key: 'GPS_TRACKING', enabled: false, description: 'Enable real-time GPS tracking', module: 'operations', defaultValue: false, dependencies: [], beta: false },
      { key: 'AUTO_APPROVE_REFERIDORS', enabled: false, description: 'Auto-approve referidor registration', module: 'commercial', defaultValue: false, dependencies: [], beta: false },
      { key: 'OFFLINE_MODE', enabled: true, description: 'Enable offline-first for operations', module: 'operations', defaultValue: true, dependencies: [], beta: false },
      { key: 'MULTI_CAMPAIGN', enabled: false, description: 'Enable multi-campaign attribution', module: 'marketing', defaultValue: false, dependencies: ['CAMPAIGNS'], beta: true },
    ];
    for (const def of defaults) {
      await this.create(tenantId, def.key, def.description, def.module, def.defaultValue, def.dependencies, def.beta);
    }
  }
}
