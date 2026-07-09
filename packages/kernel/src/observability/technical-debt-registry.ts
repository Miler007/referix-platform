/**
 * No Hidden Technical Debt — toda deuda técnica registrada formalmente.
 */

export type DebtSeverity = 'critical' | 'high' | 'medium' | 'low';
export type DebtStatus = 'open' | 'in_progress' | 'accepted' | 'resolved';

export interface TechnicalDebtItem {
  id: string;
  title: string;
  description: string;
  impact: string;
  likelihood: 'high' | 'medium' | 'low';
  severity: DebtSeverity;
  module: string;
  createdBy?: string;
  createdAt: Date;
  targetDate?: Date;
  resolvedAt?: Date;
  status: DebtStatus;
  notes?: string;
}

export class TechnicalDebtRegistry {
  private items: TechnicalDebtItem[] = [];
  private static counter = 0;

  register(item: Omit<TechnicalDebtItem, 'id' | 'createdAt'>): TechnicalDebtItem {
    const entry: TechnicalDebtItem = {
      ...item,
      id: `TECH-DEBT-${String(++TechnicalDebtRegistry.counter).padStart(4, '0')}`,
      createdAt: new Date(),
    };
    this.items.push(entry);
    return entry;
  }

  resolve(id: string): void {
    const item = this.items.find(i => i.id === id);
    if (item) { item.status = 'resolved'; item.resolvedAt = new Date(); }
  }

  accept(id: string, reason: string): void {
    const item = this.items.find(i => i.id === id);
    if (item) { item.status = 'accepted'; item.notes = reason; }
  }

  getAll(): TechnicalDebtItem[] {
    return [...this.items];
  }

  getOpen(): TechnicalDebtItem[] {
    return this.items.filter(i => i.status === 'open' || i.status === 'in_progress');
  }

  getBySeverity(severity: DebtSeverity): TechnicalDebtItem[] {
    return this.items.filter(i => i.severity === severity);
  }

  getSummary(): string {
    const total = this.items.length;
    const open = this.getOpen().length;
    const critical = this.getBySeverity('critical').filter(i => i.status !== 'resolved').length;
    return `Deuda técnica: ${open} items abiertos (${critical} críticos) de ${total} registrados`;
  }
}

export const debtRegistry = new TechnicalDebtRegistry();

// Register known technical debt
debtRegistry.register({
  title: 'Sin implementación de Prisma para la mayoría de paquetes nuevos',
  description: 'Los paquetes referral, coverage, operations, provisioning y finance usan repositorios in-memory. No hay adaptadores Prisma para producción.',
  impact: 'No se puede desplegar en producción sin migrar a base de datos real',
  likelihood: 'high', severity: 'critical', module: 'infrastructure',
  targetDate: new Date('2024-03-01'), status: 'open',
});

debtRegistry.register({
  title: 'Sin pruebas automatizadas de IDOR',
  description: 'No existen pruebas que verifiquen el aislamiento entre tenants a nivel de API',
  impact: 'Riesgo de fuga de datos entre tenants',
  likelihood: 'medium', severity: 'high', module: 'security',
  targetDate: new Date('2024-02-15'), status: 'in_progress',
});

debtRegistry.register({
  title: 'Console App sin conectar a APIs reales',
  description: 'Las pantallas de la Console muestran datos mock. No hay integración con los servicios del backend.',
  impact: 'No se puede configurar una empresa real desde la interfaz',
  likelihood: 'high', severity: 'critical', module: 'console',
  targetDate: new Date('2024-03-15'), status: 'open',
});

debtRegistry.register({
  title: 'Sin implementación de Refrest Token Rotation',
  description: 'Los tokens de refresco actuales no se rotan al usarse',
  impact: 'Un token robado permite acceso indefinido',
  likelihood: 'medium', severity: 'high', module: 'security',
  status: 'open',
});
