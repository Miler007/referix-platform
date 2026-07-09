import { SubscriptionStatus } from './value-objects';

export interface DomainEvent {
  readonly eventName: string;
  readonly eventVersion: string;
  readonly aggregateVersion: number;
  readonly tenantId: string;
  readonly subscriptionId: string;
  readonly timestamp: Date;
  readonly correlationId: string | null;
  readonly causationId: string | null;
  readonly actorId: string | null;
  readonly idempotencyKey: string | null;
  readonly data: Record<string, unknown>;
}

abstract class BaseSubscriptionEvent implements DomainEvent {
  public abstract readonly eventName: string;
  public readonly eventVersion: string;
  public readonly aggregateVersion: number;
  public readonly timestamp: Date;
  public readonly causationId: string | null;
  public readonly actorId: string | null;
  public readonly idempotencyKey: string | null;

  constructor(
    public readonly tenantId: string,
    public readonly subscriptionId: string,
    public readonly correlationId: string | null,
    aggregateVersion: number,
    eventVersion: string = '1.0.0',
    causationId: string | null = null,
    actorId: string | null = null,
    idempotencyKey: string | null = null,
    timestamp?: Date,
  ) {
    this.eventVersion = eventVersion;
    this.aggregateVersion = aggregateVersion;
    this.causationId = causationId;
    this.actorId = actorId;
    this.idempotencyKey = idempotencyKey;
    this.timestamp = timestamp ?? new Date();
  }

  public abstract get data(): Record<string, unknown>;
}

export class SubscriptionCreated extends BaseSubscriptionEvent {
  public readonly eventName = 'subscription.created';

  constructor(
    tenantId: string,
    subscriptionId: string,
    correlationId: string | null,
    aggregateVersion: number,
    causationId: string | null,
    actorId: string | null,
    idempotencyKey: string | null,
    public readonly personId: string,
    public readonly planId: string,
    public readonly serviceId: string,
    public readonly locationId: string,
    public readonly publicId: string,
    timestamp?: Date,
  ) {
    super(tenantId, subscriptionId, correlationId, aggregateVersion, '1.0.0', causationId, actorId, idempotencyKey, timestamp);
  }

  get data(): Record<string, unknown> {
    return { personId: this.personId, planId: this.planId, serviceId: this.serviceId, locationId: this.locationId, publicId: this.publicId };
  }
}

export class SubscriptionValidated extends BaseSubscriptionEvent {
  public readonly eventName = 'subscription.validated';
  constructor(
    tenantId: string, subscriptionId: string, correlationId: string | null, aggregateVersion: number,
    causationId: string | null, actorId: string | null, idempotencyKey: string | null,
    public readonly validatedBy: string, timestamp?: Date,
  ) { super(tenantId, subscriptionId, correlationId, aggregateVersion, '1.0.0', causationId, actorId, idempotencyKey, timestamp); }
  get data(): Record<string, unknown> { return { validatedBy: this.validatedBy }; }
}

export class CoverageConfirmed extends BaseSubscriptionEvent {
  public readonly eventName = 'subscription.coverage.confirmed';
  constructor(
    tenantId: string, subscriptionId: string, correlationId: string | null, aggregateVersion: number,
    causationId: string | null, actorId: string | null, idempotencyKey: string | null,
    public readonly serviceType: string, public readonly zoneId: string, timestamp?: Date,
  ) { super(tenantId, subscriptionId, correlationId, aggregateVersion, '1.0.0', causationId, actorId, idempotencyKey, timestamp); }
  get data(): Record<string, unknown> { return { serviceType: this.serviceType, zoneId: this.zoneId }; }
}

export class DocumentsSubmitted extends BaseSubscriptionEvent {
  public readonly eventName = 'subscription.documents.submitted';
  constructor(
    tenantId: string, subscriptionId: string, correlationId: string | null, aggregateVersion: number,
    causationId: string | null, actorId: string | null, idempotencyKey: string | null,
    public readonly documentIds: string[], timestamp?: Date,
  ) { super(tenantId, subscriptionId, correlationId, aggregateVersion, '1.0.0', causationId, actorId, idempotencyKey, timestamp); }
  get data(): Record<string, unknown> { return { documentIds: this.documentIds }; }
}

export class SubscriptionApproved extends BaseSubscriptionEvent {
  public readonly eventName = 'subscription.approved';
  constructor(
    tenantId: string, subscriptionId: string, correlationId: string | null, aggregateVersion: number,
    causationId: string | null, actorId: string | null, idempotencyKey: string | null,
    public readonly approvedBy: string, public readonly creditScore: number | null, timestamp?: Date,
  ) { super(tenantId, subscriptionId, correlationId, aggregateVersion, '1.0.0', causationId, actorId, idempotencyKey, timestamp); }
  get data(): Record<string, unknown> { return { approvedBy: this.approvedBy, creditScore: this.creditScore }; }
}

export class SubscriptionRejected extends BaseSubscriptionEvent {
  public readonly eventName = 'subscription.rejected';
  constructor(
    tenantId: string, subscriptionId: string, correlationId: string | null, aggregateVersion: number,
    causationId: string | null, actorId: string | null, idempotencyKey: string | null,
    public readonly reason: string, public readonly rejectedBy: string, timestamp?: Date,
  ) { super(tenantId, subscriptionId, correlationId, aggregateVersion, '1.0.0', causationId, actorId, idempotencyKey, timestamp); }
  get data(): Record<string, unknown> { return { reason: this.reason, rejectedBy: this.rejectedBy }; }
}

export class InstallationScheduled extends BaseSubscriptionEvent {
  public readonly eventName = 'subscription.installation.scheduled';
  constructor(
    tenantId: string, subscriptionId: string, correlationId: string | null, aggregateVersion: number,
    causationId: string | null, actorId: string | null, idempotencyKey: string | null,
    public readonly technicianId: string, public readonly scheduledDate: Date, public readonly workOrderId: string, timestamp?: Date,
  ) { super(tenantId, subscriptionId, correlationId, aggregateVersion, '1.0.0', causationId, actorId, idempotencyKey, timestamp); }
  get data(): Record<string, unknown> { return { technicianId: this.technicianId, scheduledDate: this.scheduledDate.toISOString(), workOrderId: this.workOrderId }; }
}

export class InstallationStarted extends BaseSubscriptionEvent {
  public readonly eventName = 'subscription.installation.started';
  constructor(
    tenantId: string, subscriptionId: string, correlationId: string | null, aggregateVersion: number,
    causationId: string | null, actorId: string | null, idempotencyKey: string | null,
    public readonly technicianId: string, timestamp?: Date,
  ) { super(tenantId, subscriptionId, correlationId, aggregateVersion, '1.0.0', causationId, actorId, idempotencyKey, timestamp); }
  get data(): Record<string, unknown> { return { technicianId: this.technicianId }; }
}

export class InstallationCompleted extends BaseSubscriptionEvent {
  public readonly eventName = 'subscription.installation.completed';
  constructor(
    tenantId: string, subscriptionId: string, correlationId: string | null, aggregateVersion: number,
    causationId: string | null, actorId: string | null, idempotencyKey: string | null,
    public readonly equipment: string[], public readonly evidence: string[], timestamp?: Date,
  ) { super(tenantId, subscriptionId, correlationId, aggregateVersion, '1.0.0', causationId, actorId, idempotencyKey, timestamp); }
  get data(): Record<string, unknown> { return { equipment: this.equipment, evidence: this.evidence }; }
}

export class SubscriptionActivated extends BaseSubscriptionEvent {
  public readonly eventName = 'subscription.activated';
  constructor(
    tenantId: string, subscriptionId: string, correlationId: string | null, aggregateVersion: number,
    causationId: string | null, actorId: string | null, idempotencyKey: string | null,
    public readonly activationDate: Date, public readonly billingCycleId: string | null, timestamp?: Date,
  ) { super(tenantId, subscriptionId, correlationId, aggregateVersion, '1.0.0', causationId, actorId, idempotencyKey, timestamp); }
  get data(): Record<string, unknown> { return { activationDate: this.activationDate.toISOString(), billingCycleId: this.billingCycleId }; }
}

export class SubscriptionSuspended extends BaseSubscriptionEvent {
  public readonly eventName = 'subscription.suspended';
  constructor(
    tenantId: string, subscriptionId: string, correlationId: string | null, aggregateVersion: number,
    causationId: string | null, actorId: string | null, idempotencyKey: string | null,
    public readonly reason: string, public readonly expectedReactivation: Date | null, timestamp?: Date,
  ) { super(tenantId, subscriptionId, correlationId, aggregateVersion, '1.0.0', causationId, actorId, idempotencyKey, timestamp); }
  get data(): Record<string, unknown> { return { reason: this.reason, expectedReactivation: this.expectedReactivation?.toISOString() ?? null }; }
}

export class SubscriptionReactivated extends BaseSubscriptionEvent {
  public readonly eventName = 'subscription.reactivated';
  constructor(
    tenantId: string, subscriptionId: string, correlationId: string | null, aggregateVersion: number,
    causationId: string | null, actorId: string | null, idempotencyKey: string | null,
    public readonly reactivationFee: number | null, timestamp?: Date,
  ) { super(tenantId, subscriptionId, correlationId, aggregateVersion, '1.0.0', causationId, actorId, idempotencyKey, timestamp); }
  get data(): Record<string, unknown> { return { reactivationFee: this.reactivationFee }; }
}

export class SubscriptionCancelled extends BaseSubscriptionEvent {
  public readonly eventName = 'subscription.cancelled';
  constructor(
    tenantId: string, subscriptionId: string, correlationId: string | null, aggregateVersion: number,
    causationId: string | null, actorId: string | null, idempotencyKey: string | null,
    public readonly reason: string, public readonly cancelledBy: string, timestamp?: Date,
  ) { super(tenantId, subscriptionId, correlationId, aggregateVersion, '1.0.0', causationId, actorId, idempotencyKey, timestamp); }
  get data(): Record<string, unknown> { return { reason: this.reason, cancelledBy: this.cancelledBy }; }
}

export class SubscriptionArchived extends BaseSubscriptionEvent {
  public readonly eventName = 'subscription.archived';
  constructor(
    tenantId: string, subscriptionId: string, correlationId: string | null, aggregateVersion: number,
    causationId: string | null, actorId: string | null, idempotencyKey: string | null,
    public readonly archiveReason: string, timestamp?: Date,
  ) { super(tenantId, subscriptionId, correlationId, aggregateVersion, '1.0.0', causationId, actorId, idempotencyKey, timestamp); }
  get data(): Record<string, unknown> { return { archiveReason: this.archiveReason }; }
}

export class PlanChanged extends BaseSubscriptionEvent {
  public readonly eventName = 'subscription.plan.changed';
  constructor(
    tenantId: string, subscriptionId: string, correlationId: string | null, aggregateVersion: number,
    causationId: string | null, actorId: string | null, idempotencyKey: string | null,
    public readonly oldPlanId: string, public readonly newPlanId: string, public readonly proratedAmount: number | null, timestamp?: Date,
  ) { super(tenantId, subscriptionId, correlationId, aggregateVersion, '1.0.0', causationId, actorId, idempotencyKey, timestamp); }
  get data(): Record<string, unknown> { return { oldPlanId: this.oldPlanId, newPlanId: this.newPlanId, proratedAmount: this.proratedAmount }; }
}

export class SubscriptionTransferred extends BaseSubscriptionEvent {
  public readonly eventName = 'subscription.transferred';
  constructor(
    tenantId: string, subscriptionId: string, correlationId: string | null, aggregateVersion: number,
    causationId: string | null, actorId: string | null, idempotencyKey: string | null,
    public readonly oldLocationId: string, public readonly newLocationId: string, timestamp?: Date,
  ) { super(tenantId, subscriptionId, correlationId, aggregateVersion, '1.0.0', causationId, actorId, idempotencyKey, timestamp); }
  get data(): Record<string, unknown> { return { oldLocationId: this.oldLocationId, newLocationId: this.newLocationId }; }
}

export class SubscriptionRenewed extends BaseSubscriptionEvent {
  public readonly eventName = 'subscription.renewed';
  constructor(
    tenantId: string, subscriptionId: string, correlationId: string | null, aggregateVersion: number,
    causationId: string | null, actorId: string | null, idempotencyKey: string | null,
    public readonly oldContractEnd: string, public readonly newContractStart: string, public readonly terms: string, timestamp?: Date,
  ) { super(tenantId, subscriptionId, correlationId, aggregateVersion, '1.0.0', causationId, actorId, idempotencyKey, timestamp); }
  get data(): Record<string, unknown> { return { oldContractEnd: this.oldContractEnd, newContractStart: this.newContractStart, terms: this.terms }; }
}

export class SubscriptionMigrating extends BaseSubscriptionEvent {
  public readonly eventName = 'subscription.migrating';
  constructor(
    tenantId: string, subscriptionId: string, correlationId: string | null, aggregateVersion: number,
    causationId: string | null, actorId: string | null, idempotencyKey: string | null,
    public readonly targetPlanId: string, public readonly effectiveDate: string, timestamp?: Date,
  ) { super(tenantId, subscriptionId, correlationId, aggregateVersion, '1.0.0', causationId, actorId, idempotencyKey, timestamp); }
  get data(): Record<string, unknown> { return { targetPlanId: this.targetPlanId, effectiveDate: this.effectiveDate }; }
}

export class StatusChanged extends BaseSubscriptionEvent {
  public readonly eventName = 'subscription.status.changed';
  constructor(
    tenantId: string, subscriptionId: string, correlationId: string | null, aggregateVersion: number,
    causationId: string | null, actorId: string | null, idempotencyKey: string | null,
    public readonly previousStatus: SubscriptionStatus, public readonly newStatus: SubscriptionStatus,
    public readonly reason: string, public readonly changedBy: string, timestamp?: Date,
  ) { super(tenantId, subscriptionId, correlationId, aggregateVersion, '1.0.0', causationId, actorId, idempotencyKey, timestamp); }
  get data(): Record<string, unknown> { return { previousStatus: this.previousStatus, newStatus: this.newStatus, reason: this.reason, changedBy: this.changedBy }; }
}

export class CapabilityAttached extends BaseSubscriptionEvent {
  public readonly eventName = 'subscription.capability.attached';
  constructor(
    tenantId: string, subscriptionId: string, correlationId: string | null, aggregateVersion: number,
    causationId: string | null, actorId: string | null, idempotencyKey: string | null,
    public readonly capabilityId: string, public readonly capabilityType: string, public readonly capabilityName: string, public readonly price: number, timestamp?: Date,
  ) { super(tenantId, subscriptionId, correlationId, aggregateVersion, '1.0.0', causationId, actorId, idempotencyKey, timestamp); }
  get data(): Record<string, unknown> { return { capabilityId: this.capabilityId, capabilityType: this.capabilityType, capabilityName: this.capabilityName, price: this.price }; }
}

export class CapabilitySuspended extends BaseSubscriptionEvent {
  public readonly eventName = 'subscription.capability.suspended';
  constructor(
    tenantId: string, subscriptionId: string, correlationId: string | null, aggregateVersion: number,
    causationId: string | null, actorId: string | null, idempotencyKey: string | null,
    public readonly capabilityId: string, timestamp?: Date,
  ) { super(tenantId, subscriptionId, correlationId, aggregateVersion, '1.0.0', causationId, actorId, idempotencyKey, timestamp); }
  get data(): Record<string, unknown> { return { capabilityId: this.capabilityId }; }
}

export class CapabilityRemoved extends BaseSubscriptionEvent {
  public readonly eventName = 'subscription.capability.removed';
  constructor(
    tenantId: string, subscriptionId: string, correlationId: string | null, aggregateVersion: number,
    causationId: string | null, actorId: string | null, idempotencyKey: string | null,
    public readonly capabilityId: string, timestamp?: Date,
  ) { super(tenantId, subscriptionId, correlationId, aggregateVersion, '1.0.0', causationId, actorId, idempotencyKey, timestamp); }
  get data(): Record<string, unknown> { return { capabilityId: this.capabilityId }; }
}

export class EquipmentAdded extends BaseSubscriptionEvent {
  public readonly eventName = 'subscription.equipment.added';
  constructor(
    tenantId: string, subscriptionId: string, correlationId: string | null, aggregateVersion: number,
    causationId: string | null, actorId: string | null, idempotencyKey: string | null,
    public readonly equipmentId: string, public readonly equipmentType: string, public readonly serialNumber: string, timestamp?: Date,
  ) { super(tenantId, subscriptionId, correlationId, aggregateVersion, '1.0.0', causationId, actorId, idempotencyKey, timestamp); }
  get data(): Record<string, unknown> { return { equipmentId: this.equipmentId, equipmentType: this.equipmentType, serialNumber: this.serialNumber }; }
}

export class EquipmentReplaced extends BaseSubscriptionEvent {
  public readonly eventName = 'subscription.equipment.replaced';
  constructor(
    tenantId: string, subscriptionId: string, correlationId: string | null, aggregateVersion: number,
    causationId: string | null, actorId: string | null, idempotencyKey: string | null,
    public readonly equipmentId: string, public readonly newSerialNumber: string, timestamp?: Date,
  ) { super(tenantId, subscriptionId, correlationId, aggregateVersion, '1.0.0', causationId, actorId, idempotencyKey, timestamp); }
  get data(): Record<string, unknown> { return { equipmentId: this.equipmentId, newSerialNumber: this.newSerialNumber }; }
}

export class EquipmentRemoved extends BaseSubscriptionEvent {
  public readonly eventName = 'subscription.equipment.removed';
  constructor(
    tenantId: string, subscriptionId: string, correlationId: string | null, aggregateVersion: number,
    causationId: string | null, actorId: string | null, idempotencyKey: string | null,
    public readonly equipmentId: string, timestamp?: Date,
  ) { super(tenantId, subscriptionId, correlationId, aggregateVersion, '1.0.0', causationId, actorId, idempotencyKey, timestamp); }
  get data(): Record<string, unknown> { return { equipmentId: this.equipmentId }; }
}

export class HealthChanged extends BaseSubscriptionEvent {
  public readonly eventName = 'subscription.health.changed';
  constructor(
    tenantId: string, subscriptionId: string, correlationId: string | null, aggregateVersion: number,
    causationId: string | null, actorId: string | null, idempotencyKey: string | null,
    public readonly previousHealth: string, public readonly newHealth: string, public readonly factors: string[], timestamp?: Date,
  ) { super(tenantId, subscriptionId, correlationId, aggregateVersion, '1.0.0', causationId, actorId, idempotencyKey, timestamp); }
  get data(): Record<string, unknown> { return { previousHealth: this.previousHealth, newHealth: this.newHealth, factors: this.factors }; }
}

export class MilestoneAchieved extends BaseSubscriptionEvent {
  public readonly eventName = 'subscription.milestone.achieved';
  constructor(
    tenantId: string, subscriptionId: string, correlationId: string | null, aggregateVersion: number,
    causationId: string | null, actorId: string | null, idempotencyKey: string | null,
    public readonly milestoneType: string, public readonly milestoneName: string, timestamp?: Date,
  ) { super(tenantId, subscriptionId, correlationId, aggregateVersion, '1.0.0', causationId, actorId, idempotencyKey, timestamp); }
  get data(): Record<string, unknown> { return { milestoneType: this.milestoneType, milestoneName: this.milestoneName }; }
}

export class ProcessStepRecorded extends BaseSubscriptionEvent {
  public readonly eventName = 'subscription.process.step.recorded';
  constructor(
    tenantId: string, subscriptionId: string, correlationId: string | null, aggregateVersion: number,
    causationId: string | null, actorId: string | null, idempotencyKey: string | null,
    public readonly step: string, public readonly description: string, timestamp?: Date,
  ) { super(tenantId, subscriptionId, correlationId, aggregateVersion, '1.0.0', causationId, actorId, idempotencyKey, timestamp); }
  get data(): Record<string, unknown> { return { step: this.step, description: this.description }; }
}
