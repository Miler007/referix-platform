export type MetricType = 'counter' | 'gauge' | 'histogram';

export interface MetricDefinition {
  name: string;
  type: MetricType;
  description: string;
  labels?: string[];
}

export class MetricsCollector {
  private counters = new Map<string, number>();
  private gauges = new Map<string, number>();
  private histograms = new Map<string, number[]>();
  private definitions: MetricDefinition[] = [];

  define(metric: MetricDefinition): void {
    this.definitions.push(metric);
  }

  increment(name: string, value: number = 1, labels?: Record<string, string>): void {
    const key = this.key(name, labels);
    this.counters.set(key, (this.counters.get(key) ?? 0) + value);
  }

  gauge(name: string, value: number, labels?: Record<string, string>): void {
    this.gauges.set(this.key(name, labels), value);
  }

  observe(name: string, value: number, labels?: Record<string, string>): void {
    const key = this.key(name, labels);
    const arr = this.histograms.get(key) ?? [];
    arr.push(value);
    this.histograms.set(key, arr);
  }

  snapshot(): Record<string, unknown> {
    const result: Record<string, unknown> = {};
    for (const [k, v] of this.counters) result[`counter_${k}`] = v;
    for (const [k, v] of this.gauges) result[`gauge_${k}`] = v;
    for (const [k, v] of this.histograms) {
      const sorted = [...v].sort((a, b) => a - b);
      result[`histogram_${k}`] = {
        count: v.length, sum: v.reduce((a, b) => a + b, 0),
        min: sorted[0], max: sorted[sorted.length - 1],
        p50: sorted[Math.floor(sorted.length * 0.5)],
        p95: sorted[Math.floor(sorted.length * 0.95)],
        p99: sorted[Math.floor(sorted.length * 0.99)],
      };
    }
    return result;
  }

  async expose(): Promise<string> {
    const lines: string[] = [];
    for (const def of this.definitions) {
      lines.push(`# HELP ${def.name} ${def.description}`);
      lines.push(`# TYPE ${def.name} ${def.type}`);
    }
    for (const [k, v] of this.counters) lines.push(`${k} ${v}`);
    for (const [k, v] of this.gauges) lines.push(`${k} ${v}`);
    return lines.join('\n');
  }

  private key(name: string, labels?: Record<string, string>): string {
    if (!labels) return name;
    const labelStr = Object.entries(labels).map(([k, v]) => `${k}="${v}"`).join(',');
    return `${name}{${labelStr}}`;
  }
}

export const metrics = new MetricsCollector();

// Business metrics definitions
metrics.define({ name: 'referix_sales_total', type: 'counter', description: 'Total sales registered', labels: ['tenantId'] });
metrics.define({ name: 'referix_installations_total', type: 'counter', description: 'Total installations completed', labels: ['tenantId'] });
metrics.define({ name: 'referix_commissions_total', type: 'counter', description: 'Total commissions generated', labels: ['tenantId'] });
metrics.define({ name: 'referix_http_duration_ms', type: 'histogram', description: 'HTTP request duration in ms', labels: ['method', 'path'] });
metrics.define({ name: 'referix_active_technicians', type: 'gauge', description: 'Currently active technicians', labels: ['tenantId'] });
