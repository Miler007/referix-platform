import { Injectable } from '@nestjs/common';

export const FEATURE_FLAGS = {
  ACADEMY: 'ACADEMY',
  REFERRALS: 'REFERRALS',
  CAMPAIGNS: 'CAMPAIGNS',
  CONTRACTS: 'CONTRACTS',
  INSTALLATIONS: 'INSTALLATIONS',
  WALLET: 'WALLET',
  BILLING: 'BILLING',
  COMMISSIONS: 'COMMISSIONS',
  RECURRING_COMMISSIONS: 'RECURRING_COMMISSIONS',
  ANTICIPO_COMMISSIONS: 'ANTICIPO_COMMISSIONS',
  MULTI_CURRENCY: 'MULTI_CURRENCY',
  CREDIT_NOTES: 'CREDIT_NOTES',
  COBRANZA: 'COBRANZA',
  ACUERDOS_PAGO: 'ACUERDOS_PAGO',
  NOTIFICACIONES_WHATSAPP: 'NOTIFICACIONES_WHATSAPP',
  NOTIFICACIONES_SMS: 'NOTIFICACIONES_SMS',
  NOTIFICACIONES_EMAIL: 'NOTIFICACIONES_EMAIL',
  DASHBOARD_ANALYTICS: 'DASHBOARD_ANALYTICS',
  REPORTES_PROGRAMADOS: 'REPORTES_PROGRAMADOS',
  CUSTOM_WORKFLOWS: 'CUSTOM_WORKFLOWS',
  CUSTOM_RULES: 'CUSTOM_RULES',
  OCR: 'OCR',
  AI_ASSISTANT: 'AI_ASSISTANT',
  MULTI_BRANCH: 'MULTI_BRANCH',
} as const;

export type FeatureFlag = keyof typeof FEATURE_FLAGS;

@Injectable()
export class FeatureFlagsService {
  private readonly tenantFlags: Map<string, Set<FeatureFlag>> = new Map();
  private readonly defaults: Partial<Record<FeatureFlag, boolean>> = {
    ACADEMY: true,
    REFERRALS: true,
    CAMPAIGNS: true,
    INSTALLATIONS: true,
    WALLET: true,
    BILLING: true,
    COMMISSIONS: true,
    NOTIFICACIONES_EMAIL: true,
    DASHBOARD_ANALYTICS: true,
  };

  async isEnabled(tenantId: string, feature: FeatureFlag): Promise<boolean> {
    const tenantSet = this.tenantFlags.get(tenantId);
    if (!tenantSet) return this.defaults[feature] ?? false;
    return tenantSet.has(feature);
  }

  async getAll(tenantId: string): Promise<Record<FeatureFlag, boolean>> {
    const result = {} as Record<FeatureFlag, boolean>;
    for (const flag of Object.values(FEATURE_FLAGS)) {
      result[flag as FeatureFlag] = await this.isEnabled(tenantId, flag as FeatureFlag);
    }
    return result;
  }

  async enable(tenantId: string, feature: FeatureFlag): Promise<void> {
    if (!this.tenantFlags.has(tenantId)) {
      this.tenantFlags.set(tenantId, new Set());
    }
    this.tenantFlags.get(tenantId)!.add(feature);
  }

  async disable(tenantId: string, feature: FeatureFlag): Promise<void> {
    this.tenantFlags.get(tenantId)?.delete(feature);
  }

  async set(tenantId: string, feature: FeatureFlag, enabled: boolean): Promise<void> {
    if (enabled) await this.enable(tenantId, feature);
    else await this.disable(tenantId, feature);
  }
}
