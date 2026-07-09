export interface HealthCheckResult {
  status: 'healthy' | 'degraded' | 'unhealthy';
  checks: HealthCheckItem[];
  timestamp: Date;
  version: string;
}

export interface HealthCheckItem {
  name: string;
  status: 'pass' | 'fail' | 'warn';
  metricValue?: number;
  threshold?: number;
  error?: string;
  duration: number;
}

export interface HealthCheckable {
  readonly name: string;
  check(): Promise<HealthCheckItem>;
}

export class HealthCheckRegistry {
  private checks: HealthCheckable[] = [];
  private static VERSION = '1.0.0';

  register(checkable: HealthCheckable): void {
    this.checks.push(checkable);
  }

  async run(): Promise<HealthCheckResult> {
    const results = await Promise.all(this.checks.map(c => this.time(c.check())));
    const hasFail = results.some(r => r.status === 'fail');
    const hasWarn = results.some(r => r.status === 'warn');

    return {
      status: hasFail ? 'unhealthy' : hasWarn ? 'degraded' : 'healthy',
      checks: results,
      timestamp: new Date(),
      version: HealthCheckRegistry.VERSION,
    };
  }

  async isReady(): Promise<boolean> {
    const result = await this.run();
    return result.status === 'healthy' || result.status === 'degraded';
  }

  private async time(promise: Promise<HealthCheckItem>): Promise<HealthCheckItem> {
    const start = Date.now();
    const result = await promise;
    result.duration = Date.now() - start;
    return result;
  }
}

export const healthRegistry = new HealthCheckRegistry();
