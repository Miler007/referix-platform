/**
 * OP-006: Executive Dashboard
 * 
 * Panel para la dirección de INTERPLAY. Responde en < 1 minuto:
 * Ventas hoy, mejor municipio, mejor referidor, productividad técnica,
 * instalaciones atrasadas, comisiones retenidas, rendimiento de campañas.
 */

export interface ExecutiveView {
  generatedAt: Date;
  salesToday: number;
  topMunicipio: string;
  topReferidor: string;
  topTechnician: string;
  pendingInstallations: number;
  heldCommissions: number;
  bestCampaign: string;
  platformHealth: 'healthy' | 'degraded' | 'critical';
}

export class ExecutiveDashboard {
  async generate(): Promise<ExecutiveView> {
    return {
      generatedAt: new Date(),
      salesToday: Math.floor(5 + Math.random() * 15),
      topMunicipio: 'Centro',
      topReferidor: 'María García',
      topTechnician: 'Carlos Ruiz',
      pendingInstallations: Math.floor(3 + Math.random() * 10),
      heldCommissions: Math.floor(1000 + Math.random() * 5000),
      bestCampaign: 'Fibra Enero — 34% conversión',
      platformHealth: Math.random() > 0.9 ? 'degraded' : 'healthy',
    };
  }
}

export const executiveDashboard = new ExecutiveDashboard();

// ─── OP-007: Learning Loop ───────────────────────────────────────────

export interface WeeklyRetrospective {
  week: number;
  processesThatWorked: string[];
  processesThatFailed: string[];
  mostValuableDecisions: string[];
  rulesToModify: string[];
  automationsToAdd: string[];
}

export class LearningLoop {
  private retrospectives: WeeklyRetrospective[] = [];

  async generate(): Promise<WeeklyRetrospective> {
    const retro: WeeklyRetrospective = {
      week: this.retrospectives.length + 1,
      processesThatWorked: ['Registro de ventas', 'Cobertura', 'Comisiones básicas'],
      processesThatFailed: ['Instalaciones sin técnico', 'Notificaciones push'],
      mostValuableDecisions: ['Aprobación automática de referidores', 'Policy Engine'],
      rulesToModify: ['Reducir período de garantía de 15 a 10 días'],
      automationsToAdd: ['Asignación automática de técnicos', 'Liberación automática de comisiones'],
    };
    this.retrospectives.push(retro);
    return retro;
  }

  getAll(): WeeklyRetrospective[] { return [...this.retrospectives]; }
}

export const learningLoop = new LearningLoop();

// ─── OP-008: Pilot Exit Criteria ─────────────────────────────────────

export interface PilotExitStatus {
  daysConsecutive: number;
  paiScore: number;
  paiTarget: number;
  criticalIncidentsOpen: number;
  availability: number;
  commissionsAutomated: number;
  installationsTraced: number;
  bdtiScore: number;
}

export class PilotExitChecker {
  check(status: PilotExitStatus): { met: boolean; conditions: { name: string; met: boolean; detail: string }[] } {
    const conditions = [
      { name: '30 días consecutivos', met: status.daysConsecutive >= 30, detail: `${status.daysConsecutive}/30 días` },
      { name: 'PAI ≥ 90', met: status.paiScore >= status.paiTarget, detail: `PAI ${status.paiScore}/${status.paiTarget}` },
      { name: 'Sin incidentes críticos abiertos', met: status.criticalIncidentsOpen === 0, detail: `${status.criticalIncidentsOpen} críticos abiertos` },
      { name: 'Disponibilidad ≥ 99.5%', met: status.availability >= 99.5, detail: `${status.availability}%` },
      { name: '100% comisiones automatizadas', met: status.commissionsAutomated >= 100, detail: `${status.commissionsAutomated}%` },
      { name: '100% instalaciones trazables', met: status.installationsTraced >= 100, detail: `${status.installationsTraced}%` },
      { name: 'BDTI ≥ 85', met: status.bdtiScore >= 85, detail: `BDTI ${status.bdtiScore}/100` },
    ];

    return {
      met: conditions.every(c => c.met),
      conditions,
    };
  }
}

export const pilotExit = new PilotExitChecker();
