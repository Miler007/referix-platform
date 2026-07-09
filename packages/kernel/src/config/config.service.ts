import { Injectable } from '@nestjs/common';

@Injectable()
export class ConfigService {
  private readonly store: Map<string, string> = new Map();
  private readonly tenantConfigs: Map<string, Map<string, string>> = new Map();

  constructor() {
    this.loadFromEnv();
  }

  private loadFromEnv(): void {
    const envDefaults: Record<string, string> = {
      PORT: '3000',
      NODE_ENV: 'development',
      JWT_ACCESS_EXPIRY: '15m',
      JWT_REFRESH_EXPIRY_DAYS: '7',
      REDIS_URL: 'redis://localhost:6379',
      DATABASE_URL: 'postgresql://postgres:postgres@localhost:5432/referix',
      CORS_ORIGINS: '*',
      RATE_LIMIT_TTL: '60',
      RATE_LIMIT_MAX: '100',
      LOG_LEVEL: 'info',
      JWT_PRIVATE_KEY: '',
      JWT_PUBLIC_KEY: '',
    };

    for (const [key, defaultValue] of Object.entries(envDefaults)) {
      this.store.set(key, process.env[key] ?? defaultValue);
    }
  }

  get(key: string, defaultValue?: string): string {
    return this.store.get(key) ?? defaultValue ?? '';
  }

  getNumber(key: string, defaultValue?: number): number {
    const val = this.store.get(key);
    if (val === undefined || val === '') return defaultValue ?? 0;
    return Number(val);
  }

  getBoolean(key: string, defaultValue?: boolean): boolean {
    const val = this.store.get(key);
    if (val === undefined || val === '') return defaultValue ?? false;
    return val === 'true' || val === '1';
  }

  set(key: string, value: string): void {
    this.store.set(key, value);
  }

  async getTenantConfig(tenantId: string, key: string, defaultValue?: string): Promise<string> {
    return this.tenantConfigs.get(tenantId)?.get(key) ?? defaultValue ?? '';
  }

  async setTenantConfig(tenantId: string, key: string, value: string): Promise<void> {
    if (!this.tenantConfigs.has(tenantId)) {
      this.tenantConfigs.set(tenantId, new Map());
    }
    this.tenantConfigs.get(tenantId)!.set(key, value);
  }

  isProduction(): boolean {
    return this.get('NODE_ENV') === 'production';
  }

  isDevelopment(): boolean {
    return this.get('NODE_ENV') === 'development';
  }
}
