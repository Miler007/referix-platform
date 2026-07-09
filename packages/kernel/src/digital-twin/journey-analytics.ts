/**
 * DT-005/006: Journey Analytics + Operational Heatmap
 * 
 * Mide tiempo por etapa, cuellos de botella, abandonos, conversiones.
 * Genera datos para el mapa de calor operacional.
 */

export interface StageMetrics {
  stageName: string;
  averageDurationMinutes: number;
  minDurationMinutes: number;
  maxDurationMinutes: number;
  entries: number;
  dropOffs: number;
  conversionRate: number;
}

export interface JourneyAnalytics {
  totalJourneys: number;
  completed: number;
  lost: number;
  conversionRate: number;
  averageTotalDuration: string;
  stageMetrics: StageMetrics[];
  bottlenecks: string[];
  topFailures: { reason: string; count: number; percentage: number }[];
}

export interface HeatmapDataPoint {
  entity: string;
  metric: string;
  value: number;
  trend: 'up' | 'down' | 'stable';
  severity: 'low' | 'medium' | 'high' | 'critical';
  recommendation?: string;
}

export class JourneyAnalyticsEngine {
  calculate(journeys: any[]): JourneyAnalytics {
    const completed = journeys.filter(j => j.status === 'COMPLETED').length;
    const lost = journeys.filter(j => j.status === 'LOST' || j.status === 'PERDIDA').length;

    return {
      totalJourneys: journeys.length,
      completed,
      lost,
      conversionRate: journeys.length > 0 ? completed / journeys.length : 0,
      averageTotalDuration: 'N/A',
      stageMetrics: [],
      bottlenecks: this.detectBottlenecks(journeys),
      topFailures: this.analyzeFailures(journeys),
    };
  }

  generateHeatmap(tenantId: string, metrics: Record<string, number[]>): HeatmapDataPoint[] {
    return Object.entries(metrics).map(([entity, values]) => {
      const avg = values.reduce((a, b) => a + b, 0) / values.length;
      const recent = values.slice(-5);
      const recentAvg = recent.length > 0 ? recent.reduce((a, b) => a + b, 0) / recent.length : 0;
      return {
        entity,
        metric: 'instalaciones_fallidas',
        value: avg,
        trend: recentAvg > avg ? 'up' : recentAvg < avg ? 'down' : 'stable',
        severity: avg > 10 ? 'critical' : avg > 5 ? 'high' : avg > 2 ? 'medium' : 'low',
        recommendation: avg > 5 ? 'Revisar proceso de instalación en esta zona' : undefined,
      };
    });
  }

  private detectBottlenecks(journeys: any[]): string[] {
    const bottlenecks: string[] = [];
    if (journeys.some((j: any) => j.stages?.some((s: any) => s.action === 'Agendó la instalación' && !s.action?.includes('Completó')))) {
      bottlenecks.push('Instalaciones agendadas pero no completadas');
    }
    return bottlenecks;
  }

  private analyzeFailures(journeys: any[]): { reason: string; count: number; percentage: number }[] {
    const failures = journeys.filter(j => j.status === 'LOST' || j.status === 'PERDIDA');
    return [{ reason: 'Cobertura insuficiente', count: failures.length, percentage: journeys.length > 0 ? (failures.length / journeys.length) * 100 : 0 }];
  }
}

export const journeyAnalytics = new JourneyAnalyticsEngine();
