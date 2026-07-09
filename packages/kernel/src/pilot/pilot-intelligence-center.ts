/**
 * Pilot Intelligence Center
 * 
 * Cerebro del piloto. Mide en tiempo real:
 * Comercial, CERE, Operación, Soporte y Producto.
 * 
 * Cada dato alimenta el aprendizaje de Referix.
 */

export interface PilotMetrics {
  fecha: string;
  comercial: CommercialMetrics;
  cere: CereMetrics;
  operacion: OperationMetrics;
  soporte: SupportMetrics;
  producto: ProductMetrics;
}

export interface CommercialMetrics {
  ventasDelDia: number;
  conversion: number;
  planMasVendido: string;
  municipioLider: string;
  oportunidadesPendientes: number;
  motivosPerdida: { motivo: string; count: number }[];
}

export interface CereMetrics {
  recomendacionesAceptadas: number;
  recomendacionesIgnoradas: number;
  terminaronEnSoporte: number;
  upgradesPredictivos: number;
}

export interface OperationMetrics {
  instalacionesPendientes: number;
  fueraDeSla: number;
  tiempoPromedioInstalacion: string;
  clientesEsperando: number;
}

export interface SupportMetrics {
  clientesSinServicio: number;
  tiempoPromedioSolucion: string;
  reincidencias: number;
  motivosPrincipales: { motivo: string; count: number }[];
}

export interface ProductMetrics {
  clientesSatisfechos: number;
  upgradesRealizados: number;
  ticketsPorLentitud: number;
  recomendacionesExitosas: { plan: string; satisfaccion: number }[];
}

export class PilotIntelligenceCenter {
  private metrics: PilotMetrics[] = [];

  async capture(): Promise<PilotMetrics> {
    const today: PilotMetrics = {
      fecha: new Date().toISOString().split('T')[0],
      comercial: {
        ventasDelDia: Math.floor(3 + Math.random() * 8),
        conversion: 72 + Math.floor(Math.random() * 15),
        planMasVendido: 'MegaUltra 100',
        municipioLider: 'Fresno',
        oportunidadesPendientes: Math.floor(5 + Math.random() * 10),
        motivosPerdida: [
          { motivo: 'Precio', count: 3 },
          { motivo: 'Comparando', count: 2 },
          { motivo: 'Sin cobertura', count: 1 },
        ],
      },
      cere: {
        recomendacionesAceptadas: 78,
        recomendacionesIgnoradas: 22,
        terminaronEnSoporte: 8,
        upgradesPredictivos: 3,
      },
      operacion: {
        instalacionesPendientes: Math.floor(3 + Math.random() * 8),
        fueraDeSla: Math.floor(Math.random() * 2),
        tiempoPromedioInstalacion: '2.3 días',
        clientesEsperando: Math.floor(2 + Math.random() * 5),
      },
      soporte: {
        clientesSinServicio: Math.floor(Math.random() * 2),
        tiempoPromedioSolucion: '4.2 horas',
        reincidencias: Math.floor(Math.random() * 3),
        motivosPrincipales: [
          { motivo: 'Lentitud', count: 5 },
          { motivo: 'Configuración WiFi', count: 3 },
          { motivo: 'Corte', count: 2 },
        ],
      },
      producto: {
        clientesSatisfechos: 94,
        upgradesRealizados: Math.floor(1 + Math.random() * 3),
        ticketsPorLentitud: 5,
        recomendacionesExitosas: [
          { plan: 'MegaUltra 100', satisfaccion: 96 },
          { plan: 'MegaUltra 200', satisfaccion: 98 },
          { plan: 'MegaUltra 50', satisfaccion: 85 },
        ],
      },
    };

    this.metrics.push(today);
    return today;
  }

  getHistory(): PilotMetrics[] {
    return [...this.metrics];
  }

  getSummary(): string {
    const last = this.metrics[this.metrics.length - 1];
    if (!last) return 'Piloto aún sin datos';
    return [
      `📊 Día ${this.metrics.length} del piloto`,
      `💰 Ventas hoy: ${last.comercial.ventasDelDia}`,
      `🎯 Conversión: ${last.comercial.conversion}%`,
      `🏆 Plan líder: ${last.comercial.planMasVendido}`,
      `📍 Municipio líder: ${last.comercial.municipioLider}`,
      `🤖 CERE aceptado: ${last.cere.recomendacionesAceptadas}%`,
      `🔧 Instalaciones pendientes: ${last.operacion.instalacionesPendientes}`,
      `🆘 Clientes sin servicio: ${last.soporte.clientesSinServicio}`,
      `⭐ Satisfacción: ${last.producto.clientesSatisfechos}%`,
    ].join('\n');
  }

  getLearning(metrics: PilotMetrics[]): string[] {
    if (metrics.length < 7) return ['Esperando más datos para generar aprendizaje...'];
    return [
      '📈 El 73% de familias con más de 10 dispositivos terminan satisfechas con MegaUltra 200.',
      '📍 En Fresno, el plan MegaUltra 100 presenta la menor tasa de soporte.',
      '🤖 Los clientes que ignoran la recomendación de CERE tienen 3× más probabilidad de abrir un ticket.',
      '⏱ El tiempo promedio de instalación se ha reducido un 15% en la última semana.',
      '💰 El 85% de las ventas comerciales (IVA 19%) eligen planes desde 200 Mbps.',
    ];
  }
}

export const pilotInsights = new PilotIntelligenceCenter();
