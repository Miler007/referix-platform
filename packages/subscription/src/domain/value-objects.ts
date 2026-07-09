export enum SubscriptionStatus {
  DRAFT = 'DRAFT',
  PENDING_VALIDATION = 'PENDING_VALIDATION',
  PENDING_COVERAGE = 'PENDING_COVERAGE',
  PENDING_DOCUMENTS = 'PENDING_DOCUMENTS',
  PENDING_APPROVAL = 'PENDING_APPROVAL',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  SCHEDULED = 'SCHEDULED',
  SKIP_INSTALL = 'SKIP_INSTALL',
  INSTALLING = 'INSTALLING',
  INSTALLED = 'INSTALLED',
  ACTIVATING = 'ACTIVATING',
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
  REACTIVATING = 'REACTIVATING',
  CANCELLED = 'CANCELLED',
  ARCHIVED = 'ARCHIVED',
  MIGRATING = 'MIGRATING',
  TRANSFERRING = 'TRANSFERRING',
  RENEWING = 'RENEWING',
  DEGRADED = 'DEGRADED',
  OUTAGE = 'OUTAGE',
  LEGAL_HOLD = 'LEGAL_HOLD',
  MERGED = 'MERGED',
}

export enum SubscriptionHealth {
  HEALTHY = 'HEALTHY',
  WARNING = 'WARNING',
  AT_RISK = 'AT_RISK',
  CRITICAL = 'CRITICAL',
}

export enum CapabilityStatus {
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
  REMOVED = 'REMOVED',
}

export enum EquipmentStatus {
  INSTALLED = 'INSTALLED',
  REPLACED = 'REPLACED',
  REMOVED = 'REMOVED',
}

export type SuspensionReason = 'NON_PAYMENT' | 'CUSTOMER_REQUEST' | 'TECHNICAL_ISSUE' | 'FRAUD' | 'LEGAL' | 'OTHER';
export type CancellationReason = 'CUSTOMER_REQUEST' | 'NON_PAYMENT' | 'TRANSFER_TO_OTHER_PROVIDER' | 'UPGRADE' | 'DOWNGRADE' | 'RELOCATION' | 'DEATH' | 'FRAUD' | 'LEGAL' | 'OTHER';
export type EquipmentType = string;

// ──────────────────────────────────────────────
// Richly-typed identity value objects (Obs. 6)
// ──────────────────────────────────────────────

export class SubscriptionId {
  constructor(public readonly value: string) {
    if (!value || value.trim().length === 0) throw new Error('SubscriptionId cannot be empty');
  }
  equals(other: SubscriptionId): boolean { return this.value === other.value; }
}

export class PersonId {
  constructor(public readonly value: string) {
    if (!value || value.trim().length === 0) throw new Error('PersonId cannot be empty');
  }
  equals(other: PersonId): boolean { return this.value === other.value; }
}

export class PlanId {
  constructor(public readonly value: string) {
    if (!value || value.trim().length === 0) throw new Error('PlanId cannot be empty');
  }
  equals(other: PlanId): boolean { return this.value === other.value; }
}

export class ServiceId {
  constructor(public readonly value: string) {
    if (!value || value.trim().length === 0) throw new Error('ServiceId cannot be empty');
  }
  equals(other: ServiceId): boolean { return this.value === other.value; }
}

export class LocationId {
  constructor(public readonly value: string) {
    if (!value || value.trim().length === 0) throw new Error('LocationId cannot be empty');
  }
  equals(other: LocationId): boolean { return this.value === other.value; }
}

export class TenantId {
  constructor(public readonly value: string) {
    if (!value || value.trim().length === 0) throw new Error('TenantId cannot be empty');
  }
  equals(other: TenantId): boolean { return this.value === other.value; }
}

export class ContractId {
  constructor(public readonly value: string) {
    if (!value || value.trim().length === 0) throw new Error('ContractId cannot be empty');
  }
  equals(other: ContractId): boolean { return this.value === other.value; }
}

export class CapabilityType {
  constructor(public readonly value: string) {
    if (!value || value.trim().length === 0) throw new Error('CapabilityType cannot be empty');
  }
  equals(other: CapabilityType): boolean { return this.value === other.value; }
}

export class CapabilityId {
  constructor(public readonly value: string) {
    if (!value || value.trim().length === 0) throw new Error('CapabilityId cannot be empty');
  }
  equals(other: CapabilityId): boolean { return this.value === other.value; }
}

export class EquipmentId {
  constructor(public readonly value: string) {
    if (!value || value.trim().length === 0) throw new Error('EquipmentId cannot be empty');
  }
  equals(other: EquipmentId): boolean { return this.value === other.value; }
}

export class MilestoneId {
  constructor(public readonly value: string) {
    if (!value || value.trim().length === 0) throw new Error('MilestoneId cannot be empty');
  }
  equals(other: MilestoneId): boolean { return this.value === other.value; }
}

export class StepId {
  constructor(public readonly value: string) {
    if (!value || value.trim().length === 0) throw new Error('StepId cannot be empty');
  }
  equals(other: StepId): boolean { return this.value === other.value; }
}

// ──────────────────────────────────────────────
// Domain value objects
// ──────────────────────────────────────────────

export class Money {
  constructor(
    public readonly amount: number,
    public readonly currency: string = 'USD',
  ) {}

  add(other: Money): Money {
    if (other.currency !== this.currency) throw new Error(`Currency mismatch: ${this.currency} vs ${other.currency}`);
    return new Money(this.amount + other.amount, this.currency);
  }

  multiply(factor: number): Money {
    return new Money(this.amount * factor, this.currency);
  }

  equals(other: Money): boolean {
    return this.amount === other.amount && this.currency === other.currency;
  }
}

export class PublicId {
  private static readonly PATTERN = /^([A-Z]+)-(\d{4})-(\d{9})$/;

  constructor(public readonly value: string) {
    if (!PublicId.PATTERN.test(value)) {
      throw new Error(`Invalid public ID format: ${value}. Expected format: PREFIX-YYYY-NNNNNNNNN`);
    }
  }

  get prefix(): string { return this.value.split('-')[0]!; }
  get year(): number { return parseInt(this.value.split('-')[1]!, 10); }
  get sequence(): number { return parseInt(this.value.split('-')[2]!, 10); }

  equals(other: PublicId): boolean { return this.value === other.value; }
}

export class CapabilityAttachment {
  constructor(
    public readonly capabilityId: CapabilityId,
    public readonly type: CapabilityType,
    public readonly name: string,
    public readonly status: CapabilityStatus,
    public readonly startDate: Date,
    public readonly price: Money,
    public readonly endDate: Date | null = null,
    public readonly metadata: Record<string, unknown> = {},
  ) {}

  suspend(): CapabilityAttachment {
    return new CapabilityAttachment(this.capabilityId, this.type, this.name, CapabilityStatus.SUSPENDED, this.startDate, this.price, this.endDate, this.metadata);
  }

  resume(): CapabilityAttachment {
    return new CapabilityAttachment(this.capabilityId, this.type, this.name, CapabilityStatus.ACTIVE, this.startDate, this.price, this.endDate, this.metadata);
  }

  remove(): CapabilityAttachment {
    return new CapabilityAttachment(this.capabilityId, this.type, this.name, CapabilityStatus.REMOVED, this.startDate, this.price, new Date(), this.metadata);
  }

  equals(other: CapabilityAttachment): boolean {
    return this.capabilityId.equals(other.capabilityId) && this.type.equals(other.type);
  }
}

export class EquipmentItem {
  constructor(
    public readonly equipmentId: EquipmentId,
    public readonly equipmentType: EquipmentType,
    public readonly serialNumber: string,
    public readonly model: string,
    public readonly brand: string,
    public readonly status: EquipmentStatus,
    public readonly warrantyEnd: Date | null = null,
    public readonly installedAt: Date,
    public readonly removedAt: Date | null = null,
  ) {}

  replace(model: string, brand: string, serialNumber: string): EquipmentItem {
    return new EquipmentItem(this.equipmentId, this.equipmentType, serialNumber, model, brand, EquipmentStatus.REPLACED, this.warrantyEnd, this.installedAt, new Date());
  }

  remove(): EquipmentItem {
    return new EquipmentItem(this.equipmentId, this.equipmentType, this.serialNumber, this.model, this.brand, EquipmentStatus.REMOVED, this.warrantyEnd, this.installedAt, new Date());
  }

  isActive(): boolean { return this.status === EquipmentStatus.INSTALLED; }
}

export class BusinessMilestone {
  constructor(
    public readonly milestoneId: MilestoneId,
    public readonly type: string,
    public readonly name: string,
    public readonly achievedAt: Date,
    public readonly metadata: Record<string, unknown> = {},
  ) {}
}

export class ProcessStep {
  constructor(
    public readonly stepId: StepId,
    public readonly step: string,
    public readonly description: string,
    public readonly timestamp: Date,
    public readonly correlationId: string | null = null,
    public readonly metadata: Record<string, unknown> = {},
  ) {}
}

export class SlaConfig {
  constructor(
    public readonly maxInstallationDays: number = 5,
    public readonly maxResponseHours: number = 24,
    public readonly availabilityPct: number = 99.5,
    public readonly maintenanceWindow: string = '03:00-05:00',
    public readonly penaltyRate: number | null = null,
  ) {}
}

export class TransitionContext {
  constructor(
    public readonly newStatus: SubscriptionStatus,
    public readonly reason: string,
    public readonly changedBy: string,
    public readonly correlationId: string | null = null,
    public readonly causationId: string | null = null,
    public readonly idempotencyKey: string | null = null,
    public readonly metadata: Record<string, unknown> = {},
  ) {}
}

// ──────────────────────────────────────────────
// Concurrent version control (Obs. 5)
// ──────────────────────────────────────────────

export class ConcurrencyConflictError extends Error {
  constructor(
    public readonly aggregateId: string,
    public readonly expectedVersion: number,
    public readonly actualVersion: number,
  ) {
    super(`Concurrency conflict on ${aggregateId}: expected version ${expectedVersion}, actual ${actualVersion}`);
  }
}

// ──────────────────────────────────────────────
// Idempotency (Obs. 4)
// ──────────────────────────────────────────────

export class DuplicateIdempotencyKeyError extends Error {
  constructor(public readonly key: string) {
    super(`Idempotency key '${key}' has already been processed`);
  }
}

// ──────────────────────────────────────────────
// Intent Objects (Obs. 9)
// ──────────────────────────────────────────────

export type CommandChannel = 'API' | 'ADMIN_PANEL' | 'WEBHOOK' | 'SYSTEM' | 'IMPORT' | 'WORKFLOW';
export type CommandSource = 'CRM' | 'SELF_SERVICE' | 'BACKOFFICE' | 'INTEGRATION' | 'SCHEDULER' | 'RULE_ENGINE' | 'WORKFLOW_ENGINE';

export class CommandIntent {
  constructor(
    public readonly actorId: string | null = null,
    public readonly reason: string = '',
    public readonly channel: CommandChannel = 'API',
    public readonly source: CommandSource = 'CRM',
    public readonly correlationId: string | null = null,
    public readonly causationId: string | null = null,
    public readonly idempotencyKey: string | null = null,
    public readonly metadata: Record<string, unknown> = {},
  ) {}
}

export class ActivateCommand extends CommandIntent {
  constructor(
    actorId: string | null,
    reason: string,
    channel: CommandChannel = 'API',
    source: CommandSource = 'CRM',
    public readonly activationDate?: Date,
    public readonly billingCycleId?: string | null,
    correlationId?: string | null,
    causationId?: string | null,
    idempotencyKey?: string | null,
    metadata?: Record<string, unknown>,
  ) { super(actorId, reason, channel, source, correlationId, causationId, idempotencyKey, metadata); }
}

export class SuspendCommand extends CommandIntent {
  constructor(
    actorId: string | null,
    reason: string,
    channel: CommandChannel = 'API',
    source: CommandSource = 'CRM',
    public readonly expectedReactivation?: Date | null,
    correlationId?: string | null,
    causationId?: string | null,
    idempotencyKey?: string | null,
    metadata?: Record<string, unknown>,
  ) { super(actorId, reason, channel, source, correlationId, causationId, idempotencyKey, metadata); }
}

export class CancelCommand extends CommandIntent {
  constructor(
    actorId: string | null,
    reason: string,
    channel: CommandChannel = 'API',
    source: CommandSource = 'CRM',
    correlationId?: string | null,
    causationId?: string | null,
    idempotencyKey?: string | null,
    metadata?: Record<string, unknown>,
  ) { super(actorId, reason, channel, source, correlationId, causationId, idempotencyKey, metadata); }
}

export class TransferCommand extends CommandIntent {
  constructor(
    actorId: string | null,
    reason: string,
    channel: CommandChannel = 'API',
    source: CommandSource = 'CRM',
    public readonly newLocationId?: string,
    correlationId?: string | null,
    causationId?: string | null,
    idempotencyKey?: string | null,
    metadata?: Record<string, unknown>,
  ) { super(actorId, reason, channel, source, correlationId, causationId, idempotencyKey, metadata); }
}

export class MigratePlanCommand extends CommandIntent {
  constructor(
    actorId: string | null,
    reason: string,
    channel: CommandChannel = 'API',
    source: CommandSource = 'CRM',
    public readonly targetPlanId?: string,
    public readonly effectiveDate?: string,
    correlationId?: string | null,
    causationId?: string | null,
    idempotencyKey?: string | null,
    metadata?: Record<string, unknown>,
  ) { super(actorId, reason, channel, source, correlationId, causationId, idempotencyKey, metadata); }
}

export class RenewCommand extends CommandIntent {
  constructor(
    actorId: string | null,
    reason: string,
    channel: CommandChannel = 'API',
    source: CommandSource = 'CRM',
    public readonly oldContractEnd?: string,
    public readonly newContractStart?: string,
    public readonly terms?: string,
    correlationId?: string | null,
    causationId?: string | null,
    idempotencyKey?: string | null,
    metadata?: Record<string, unknown>,
  ) { super(actorId, reason, channel, source, correlationId, causationId, idempotencyKey, metadata); }
}

// ──────────────────────────────────────────────
// Domain Decision Log (Obs. 10)
// ──────────────────────────────────────────────

export class DecisionRecord {
  constructor(
    public readonly decisionId: string,
    public readonly action: string,
    public readonly reason: string,
    public readonly actorId: string | null,
    public readonly timestamp: Date,
    public readonly fromStatus: SubscriptionStatus,
    public readonly toStatus: SubscriptionStatus,
    public readonly policies: readonly string[] = [],
    public readonly rules: readonly string[] = [],
    public readonly workflowTransition: string | null = null,
    public readonly metadata: Record<string, unknown> = {},
  ) {}
}

// ──────────────────────────────────────────────
// Aggregate Commit (Directiva de Persistencia)
// ──────────────────────────────────────────────

export class AggregateCommit {
  constructor(
    public readonly aggregateId: string,
    public readonly aggregateVersion: number,
    public readonly snapshot: Record<string, unknown>,
    public readonly events: readonly import('./events').DomainEvent[],
    public readonly correlationId: string | null,
    public readonly causationId: string | null,
    public readonly actorId: string | null,
    public readonly tenantId: string,
    public readonly timestamp: Date,
    public readonly checksum: string | null = null,
  ) {}
}

export const ALLOWED_TRANSITIONS: Record<SubscriptionStatus, SubscriptionStatus[]> = {
  [SubscriptionStatus.DRAFT]: [SubscriptionStatus.PENDING_VALIDATION, SubscriptionStatus.CANCELLED],
  [SubscriptionStatus.PENDING_VALIDATION]: [SubscriptionStatus.PENDING_COVERAGE, SubscriptionStatus.PENDING_DOCUMENTS, SubscriptionStatus.PENDING_APPROVAL, SubscriptionStatus.REJECTED, SubscriptionStatus.CANCELLED],
  [SubscriptionStatus.PENDING_COVERAGE]: [SubscriptionStatus.PENDING_DOCUMENTS, SubscriptionStatus.REJECTED, SubscriptionStatus.CANCELLED],
  [SubscriptionStatus.PENDING_DOCUMENTS]: [SubscriptionStatus.PENDING_APPROVAL, SubscriptionStatus.CANCELLED],
  [SubscriptionStatus.PENDING_APPROVAL]: [SubscriptionStatus.APPROVED, SubscriptionStatus.REJECTED, SubscriptionStatus.CANCELLED],
  [SubscriptionStatus.APPROVED]: [SubscriptionStatus.SCHEDULED, SubscriptionStatus.SKIP_INSTALL, SubscriptionStatus.CANCELLED],
  [SubscriptionStatus.REJECTED]: [SubscriptionStatus.ARCHIVED],
  [SubscriptionStatus.SCHEDULED]: [SubscriptionStatus.INSTALLING, SubscriptionStatus.CANCELLED],
  [SubscriptionStatus.SKIP_INSTALL]: [SubscriptionStatus.ACTIVATING, SubscriptionStatus.CANCELLED],
  [SubscriptionStatus.INSTALLING]: [SubscriptionStatus.INSTALLED, SubscriptionStatus.SCHEDULED, SubscriptionStatus.CANCELLED],
  [SubscriptionStatus.INSTALLED]: [SubscriptionStatus.ACTIVATING, SubscriptionStatus.CANCELLED],
  [SubscriptionStatus.ACTIVATING]: [SubscriptionStatus.ACTIVE, SubscriptionStatus.CANCELLED],
  [SubscriptionStatus.ACTIVE]: [SubscriptionStatus.SUSPENDED, SubscriptionStatus.CANCELLED, SubscriptionStatus.MIGRATING, SubscriptionStatus.TRANSFERRING, SubscriptionStatus.RENEWING, SubscriptionStatus.DEGRADED],
  [SubscriptionStatus.SUSPENDED]: [SubscriptionStatus.REACTIVATING, SubscriptionStatus.CANCELLED, SubscriptionStatus.LEGAL_HOLD],
  [SubscriptionStatus.REACTIVATING]: [SubscriptionStatus.ACTIVE, SubscriptionStatus.CANCELLED],
  [SubscriptionStatus.CANCELLED]: [SubscriptionStatus.ARCHIVED],
  [SubscriptionStatus.ARCHIVED]: [],
  [SubscriptionStatus.MIGRATING]: [SubscriptionStatus.ACTIVE, SubscriptionStatus.CANCELLED],
  [SubscriptionStatus.TRANSFERRING]: [SubscriptionStatus.ACTIVE, SubscriptionStatus.CANCELLED],
  [SubscriptionStatus.RENEWING]: [SubscriptionStatus.ACTIVE, SubscriptionStatus.CANCELLED],
  [SubscriptionStatus.DEGRADED]: [SubscriptionStatus.ACTIVE, SubscriptionStatus.OUTAGE],
  [SubscriptionStatus.OUTAGE]: [SubscriptionStatus.ACTIVE, SubscriptionStatus.DEGRADED],
  [SubscriptionStatus.LEGAL_HOLD]: [SubscriptionStatus.SUSPENDED, SubscriptionStatus.CANCELLED],
  [SubscriptionStatus.MERGED]: [SubscriptionStatus.ARCHIVED],
};
