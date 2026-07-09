import { v4 as uuid } from 'uuid';
import {
  SubscriptionStatus,
  SubscriptionHealth,
  CapabilityStatus,
  EquipmentStatus,
  ALLOWED_TRANSITIONS,
  SubscriptionId, PersonId, PlanId, ServiceId, LocationId, TenantId, ContractId,
  CapabilityType, CapabilityId, EquipmentId, MilestoneId, StepId,
  Money, PublicId, SlaConfig, TransitionContext,
  CapabilityAttachment, EquipmentItem, BusinessMilestone, ProcessStep, DecisionRecord,
  DuplicateIdempotencyKeyError, ConcurrencyConflictError,
  CommandIntent,
} from './value-objects';
import {
  DomainEvent,
  SubscriptionCreated,
  StatusChanged,
  SubscriptionValidated, CoverageConfirmed, DocumentsSubmitted,
  SubscriptionApproved, SubscriptionRejected,
  InstallationScheduled, InstallationStarted, InstallationCompleted,
  SubscriptionActivated, SubscriptionSuspended, SubscriptionReactivated,
  SubscriptionCancelled, SubscriptionArchived,
  PlanChanged, SubscriptionTransferred, SubscriptionRenewed, SubscriptionMigrating,
  CapabilityAttached, CapabilitySuspended, CapabilityRemoved,
  EquipmentAdded, EquipmentReplaced, EquipmentRemoved,
  HealthChanged, MilestoneAchieved, ProcessStepRecorded,
} from './events';

export interface CreateSubscriptionProps {
  tenantId: string; personId: string; planId: string; serviceId: string; locationId: string;
  contractId?: string; correlationId?: string; causationId?: string; actorId?: string;
  idempotencyKey?: string; publicId?: string; sla?: SlaConfig;
}

export class Subscription {
  private readonly _subscriptionId: SubscriptionId;
  private readonly _tenantId: TenantId;
  private _personId: PersonId;
  private _planId: PlanId;
  private _serviceId: ServiceId;
  private _locationId: LocationId;
  private _contractId: ContractId | null;
  private _status: SubscriptionStatus;
  private _publicId: PublicId;
  private _health: SubscriptionHealth;
  private _sla: SlaConfig | null;
  private _currentVersion: number;
  private _expectedVersion: number | null;
  private _createdAt: Date;
  private _updatedAt: Date;
  private _activatedAt: Date | null;
  private _cancelledAt: Date | null;
  private _archivedAt: Date | null;
  private _deletedAt: Date | null;
  private _capabilities: CapabilityAttachment[];
  private _equipment: EquipmentItem[];
  private _milestones: BusinessMilestone[];
  private _processSteps: ProcessStep[];
  private _decisionLog: DecisionRecord[];
  private readonly _events: DomainEvent[];
  private readonly _idempotencyLog: Map<string, DomainEvent[]>;
  private _causationId: string | null;
  private _actorId: string | null;
  private _correlationId: string | null;

  private constructor(
    subscriptionId: SubscriptionId, tenantId: TenantId, personId: PersonId,
    planId: PlanId, serviceId: ServiceId, locationId: LocationId,
  ) {
    this._subscriptionId = subscriptionId; this._tenantId = tenantId;
    this._personId = personId; this._planId = planId; this._serviceId = serviceId; this._locationId = locationId;
    this._contractId = null; this._status = SubscriptionStatus.DRAFT;
    this._health = SubscriptionHealth.HEALTHY;
    this._publicId = new PublicId('TMP-0000-000000000');
    this._sla = null; this._currentVersion = 0; this._expectedVersion = null;
    this._createdAt = new Date(); this._updatedAt = new Date();
    this._activatedAt = null; this._cancelledAt = null; this._archivedAt = null; this._deletedAt = null;
    this._capabilities = []; this._equipment = []; this._milestones = []; this._processSteps = []; this._decisionLog = [];
    this._events = []; this._idempotencyLog = new Map();
    this._causationId = null; this._actorId = null; this._correlationId = null;
  }

  static create(props: CreateSubscriptionProps): Subscription {
    const id = new SubscriptionId(uuid());
    const entity = new Subscription(id, new TenantId(props.tenantId), new PersonId(props.personId),
      new PlanId(props.planId), new ServiceId(props.serviceId), new LocationId(props.locationId));
    entity._causationId = props.causationId ?? null;
    entity._actorId = props.actorId ?? null;
    entity._correlationId = props.correlationId ?? null;
    if (props.contractId) entity._contractId = new ContractId(props.contractId);
    const year = new Date().getFullYear();
    entity._publicId = props.publicId ? new PublicId(props.publicId) : new PublicId(`SUB-${year}-${String(Math.floor(Math.random() * 1000000000)).padStart(9, '0')}`);
    if (props.sla) entity._sla = props.sla;
    const event = new SubscriptionCreated(entity._tenantId.value, entity._subscriptionId.value, entity._correlationId,
      entity._currentVersion, entity._causationId, entity._actorId, props.idempotencyKey ?? null,
      entity._personId.value, entity._planId.value, entity._serviceId.value, entity._locationId.value, entity._publicId.value);
    if (props.idempotencyKey) entity._idempotencyLog.set(props.idempotencyKey, [event]);
    entity._events.push(event);
    entity._decisionLog.push(new DecisionRecord(uuid(), 'SUBSCRIPTION_CREATED', 'New subscription created', props.actorId ?? null,
      new Date(), SubscriptionStatus.DRAFT, SubscriptionStatus.DRAFT));
    return entity;
  }

  setExpectedVersion(version: number): void { this._expectedVersion = version; }

  checkConcurrency(actualVersion: number): void {
    if (this._expectedVersion !== null && this._expectedVersion !== actualVersion) {
      throw new ConcurrencyConflictError(this._subscriptionId.value, this._expectedVersion, actualVersion);
    }
  }

  // ── Semantic Commands (Obs. 8) ──────────────────────────────────

  validate(validatedBy: string, intent?: CommandIntent): void {
    this.transitionTo(new TransitionContext(SubscriptionStatus.PENDING_VALIDATION, intent?.reason ?? 'Validation', validatedBy,
      intent?.correlationId, intent?.causationId, intent?.idempotencyKey));
    this.recordDecision('VALIDATE', intent, 'ensure_data_completeness');
    this._events.push(new SubscriptionValidated(this._tenantId.value, this._subscriptionId.value, this._correlationId,
      this._currentVersion, this._causationId, validatedBy, intent?.idempotencyKey ?? null, validatedBy));
  }

  confirmCoverage(serviceType: string, zoneId: string, intent?: CommandIntent): void {
    this.transitionTo(new TransitionContext(SubscriptionStatus.PENDING_COVERAGE, intent?.reason ?? 'Coverage confirmed', intent?.actorId ?? 'system',
      intent?.correlationId, intent?.causationId, intent?.idempotencyKey));
    this.recordDecision('CONFIRM_COVERAGE', intent, 'coverage_validation_passed');
    this._events.push(new CoverageConfirmed(this._tenantId.value, this._subscriptionId.value, this._correlationId,
      this._currentVersion, this._causationId, intent?.actorId ?? null, intent?.idempotencyKey ?? null, serviceType, zoneId));
  }

  submitDocuments(documentIds: string[], intent?: CommandIntent): void {
    this.transitionTo(new TransitionContext(SubscriptionStatus.PENDING_DOCUMENTS, intent?.reason ?? 'Documents submitted', intent?.actorId ?? 'customer',
      intent?.correlationId, intent?.causationId, intent?.idempotencyKey));
    this.recordDecision('SUBMIT_DOCUMENTS', intent, 'document_collection_completed');
    this._events.push(new DocumentsSubmitted(this._tenantId.value, this._subscriptionId.value, this._correlationId,
      this._currentVersion, this._causationId, intent?.actorId ?? null, intent?.idempotencyKey ?? null, documentIds));
  }

  approve(approvedBy: string, creditScore: number | null = null, intent?: CommandIntent): void {
    if (this._status === SubscriptionStatus.PENDING_DOCUMENTS) {
      this.transitionTo(new TransitionContext(SubscriptionStatus.PENDING_APPROVAL, 'Auto-forward for approval', approvedBy,
        intent?.correlationId, intent?.causationId, intent?.idempotencyKey));
    }
    this.transitionTo(new TransitionContext(SubscriptionStatus.APPROVED, intent?.reason ?? 'Approved', approvedBy,
      intent?.correlationId, intent?.causationId, intent?.idempotencyKey));
    this.recordDecision('APPROVE', intent, 'credit_approval', 'Policy P-14: credit_check_passed', 'Rule R-203: payment_method_valid');
    if (this._sla) {
      this.achieveMilestone('APPROVED', 'Subscription approved', { approvedBy, creditScore });
    }
    this._events.push(new SubscriptionApproved(this._tenantId.value, this._subscriptionId.value, this._correlationId,
      this._currentVersion, this._causationId, approvedBy, intent?.idempotencyKey ?? null, approvedBy, creditScore));
  }

  reject(reason: string, rejectedBy: string, intent?: CommandIntent): void {
    if (this._status === SubscriptionStatus.PENDING_DOCUMENTS) {
      this.transitionTo(new TransitionContext(SubscriptionStatus.PENDING_APPROVAL, 'Auto-forward for rejection', rejectedBy,
        intent?.correlationId, intent?.causationId, intent?.idempotencyKey));
    }
    this.transitionTo(new TransitionContext(SubscriptionStatus.REJECTED, reason, rejectedBy,
      intent?.correlationId, intent?.causationId, intent?.idempotencyKey));
    this.recordDecision('REJECT', intent, 'rejection_criteria_met');
    this._events.push(new SubscriptionRejected(this._tenantId.value, this._subscriptionId.value, this._correlationId,
      this._currentVersion, this._causationId, rejectedBy, intent?.idempotencyKey ?? null, reason, rejectedBy));
  }

  scheduleInstallation(technicianId: string, scheduledDate: Date, workOrderId: string, intent?: CommandIntent): void {
    this.transitionTo(new TransitionContext(SubscriptionStatus.SCHEDULED, intent?.reason ?? 'Installation scheduled', intent?.actorId ?? 'operations',
      intent?.correlationId, intent?.causationId, intent?.idempotencyKey));
    this.recordDecision('SCHEDULE_INSTALLATION', intent, 'technician_availability', 'Workflow WF-07: installation_scheduling');
    this._events.push(new InstallationScheduled(this._tenantId.value, this._subscriptionId.value, this._correlationId,
      this._currentVersion, this._causationId, intent?.actorId ?? null, intent?.idempotencyKey ?? null, technicianId, scheduledDate, workOrderId));
  }

  startInstallation(technicianId: string, intent?: CommandIntent): void {
    this.transitionTo(new TransitionContext(SubscriptionStatus.INSTALLING, intent?.reason ?? 'Installation started', technicianId,
      intent?.correlationId, intent?.causationId, intent?.idempotencyKey));
    this.recordDecision('START_INSTALLATION', intent, 'technician_on_site', 'Workflow WF-08: installation_in_progress');
    this._events.push(new InstallationStarted(this._tenantId.value, this._subscriptionId.value, this._correlationId,
      this._currentVersion, this._causationId, technicianId, intent?.idempotencyKey ?? null, technicianId));
  }

  completeInstallation(equipment: string[], evidence: string[], intent?: CommandIntent): void {
    this.transitionTo(new TransitionContext(SubscriptionStatus.INSTALLED, intent?.reason ?? 'Installation completed', intent?.actorId ?? 'technician',
      intent?.correlationId, intent?.causationId, intent?.idempotencyKey));
    this.recordDecision('COMPLETE_INSTALLATION', intent, 'installation_checklist_passed', 'Workflow WF-09: installation_verification');
    this._events.push(new InstallationCompleted(this._tenantId.value, this._subscriptionId.value, this._correlationId,
      this._currentVersion, this._causationId, intent?.actorId ?? null, intent?.idempotencyKey ?? null, equipment, evidence));
  }

  activate(activationDate?: Date, billingCycleId?: string | null, intent?: CommandIntent): void {
    this.transitionTo(new TransitionContext(SubscriptionStatus.ACTIVATING, intent?.reason ?? 'Activating', intent?.actorId ?? 'system',
      intent?.correlationId, intent?.causationId, intent?.idempotencyKey));
    this.transitionTo(new TransitionContext(SubscriptionStatus.ACTIVE, intent?.reason ?? 'Activated', intent?.actorId ?? 'system',
      intent?.correlationId, intent?.causationId, intent?.idempotencyKey));
    this.recordDecision('ACTIVATE', intent, 'activation_conditions_met', 'Rule R-203: payment_method_valid', 'Workflow WF-10: service_activation');
    const evt = new SubscriptionActivated(this._tenantId.value, this._subscriptionId.value, this._correlationId,
      this._currentVersion, this._causationId, intent?.actorId ?? null, intent?.idempotencyKey ?? null,
      activationDate ?? new Date(), billingCycleId ?? null);
    this._decisionLog[this._decisionLog.length - 1] = new DecisionRecord(uuid(), 'ACTIVATE', intent?.reason ?? 'Activated',
      intent?.actorId ?? null, new Date(), SubscriptionStatus.ACTIVATING, SubscriptionStatus.ACTIVE,
      ['activation_conditions_met'], ['Rule R-203: payment_method_valid'], 'Workflow WF-10: service_activation');
    this._events.push(evt);
  }

  suspend(reason: string, expectedReactivation?: Date | null, intent?: CommandIntent): void {
    this.transitionTo(new TransitionContext(SubscriptionStatus.SUSPENDED, reason, intent?.actorId ?? 'system',
      intent?.correlationId, intent?.causationId, intent?.idempotencyKey));
    this.recordDecision('SUSPEND', intent, 'suspension_criteria_met');
    this._events.push(new SubscriptionSuspended(this._tenantId.value, this._subscriptionId.value, this._correlationId,
      this._currentVersion, this._causationId, intent?.actorId ?? null, intent?.idempotencyKey ?? null, reason, expectedReactivation ?? null));
  }

  reactivate(reactivationFee: number | null = null, intent?: CommandIntent): void {
    this.transitionTo(new TransitionContext(SubscriptionStatus.REACTIVATING, intent?.reason ?? 'Reactivating', intent?.actorId ?? 'system',
      intent?.correlationId, intent?.causationId, intent?.idempotencyKey));
    this.transitionTo(new TransitionContext(SubscriptionStatus.ACTIVE, intent?.reason ?? 'Reactivated', intent?.actorId ?? 'system',
      intent?.correlationId, intent?.causationId, intent?.idempotencyKey));
    this.recordDecision('REACTIVATE', intent, 'reactivation_policy_passed', 'Policy P-22: outstanding_balance_cleared');
    this._events.push(new SubscriptionReactivated(this._tenantId.value, this._subscriptionId.value, this._correlationId,
      this._currentVersion, this._causationId, intent?.actorId ?? null, intent?.idempotencyKey ?? null, reactivationFee));
  }

  cancel(reason: string, cancelledBy: string, intent?: CommandIntent): void {
    this.transitionTo(new TransitionContext(SubscriptionStatus.CANCELLED, reason, cancelledBy,
      intent?.correlationId, intent?.causationId, intent?.idempotencyKey));
    this.recordDecision('CANCEL', intent, 'cancellation_policy_applied');
    this._events.push(new SubscriptionCancelled(this._tenantId.value, this._subscriptionId.value, this._correlationId,
      this._currentVersion, this._causationId, cancelledBy, intent?.idempotencyKey ?? null, reason, cancelledBy));
  }

  archive(archiveReason: string, intent?: CommandIntent): void {
    this.transitionTo(new TransitionContext(SubscriptionStatus.ARCHIVED, archiveReason, intent?.actorId ?? 'system',
      intent?.correlationId, intent?.causationId, intent?.idempotencyKey));
    this.recordDecision('ARCHIVE', intent, 'data_retention_policy');
    this._events.push(new SubscriptionArchived(this._tenantId.value, this._subscriptionId.value, this._correlationId,
      this._currentVersion, this._causationId, intent?.actorId ?? null, intent?.idempotencyKey ?? null, archiveReason));
  }

  transfer(newLocationId: string, intent?: CommandIntent): void {
    this.transitionTo(new TransitionContext(SubscriptionStatus.TRANSFERRING, intent?.reason ?? 'Transferring', intent?.actorId ?? 'system',
      intent?.correlationId, intent?.causationId, intent?.idempotencyKey));
    const oldLocationId = this._locationId.value;
    this._locationId = new LocationId(newLocationId);
    this._currentVersion++;
    this.transitionTo(new TransitionContext(SubscriptionStatus.ACTIVE, intent?.reason ?? 'Transferred', intent?.actorId ?? 'system',
      intent?.correlationId, intent?.causationId, intent?.idempotencyKey));
    this.recordDecision('TRANSFER', intent, 'location_change_approved');
    this._events.push(new SubscriptionTransferred(this._tenantId.value, this._subscriptionId.value, this._correlationId,
      this._currentVersion, this._causationId, intent?.actorId ?? null, intent?.idempotencyKey ?? null, oldLocationId, newLocationId));
  }

  migratePlan(targetPlanId: string, effectiveDate: string, intent?: CommandIntent): void {
    this.transitionTo(new TransitionContext(SubscriptionStatus.MIGRATING, intent?.reason ?? 'Migrating', intent?.actorId ?? 'system',
      intent?.correlationId, intent?.causationId, intent?.idempotencyKey));
    const oldPlanId = this._planId.value;
    this._planId = new PlanId(targetPlanId);
    this._currentVersion++;
    this.transitionTo(new TransitionContext(SubscriptionStatus.ACTIVE, intent?.reason ?? 'Migrated', intent?.actorId ?? 'system',
      intent?.correlationId, intent?.causationId, intent?.idempotencyKey));
    this.recordDecision('MIGRATE_PLAN', intent, 'plan_change_eligible', 'Policy P-18: plan_upgrade_allowed');
    this._events.push(new PlanChanged(this._tenantId.value, this._subscriptionId.value, this._correlationId,
      this._currentVersion, this._causationId, intent?.actorId ?? null, intent?.idempotencyKey ?? null, oldPlanId, targetPlanId, null));
    this._events.push(new SubscriptionMigrating(this._tenantId.value, this._subscriptionId.value, this._correlationId,
      this._currentVersion, this._causationId, intent?.actorId ?? null, intent?.idempotencyKey ?? null, targetPlanId, effectiveDate));
  }

  renew(oldContractEnd: string, newContractStart: string, terms: string, intent?: CommandIntent): void {
    this.transitionTo(new TransitionContext(SubscriptionStatus.RENEWING, intent?.reason ?? 'Renewing', intent?.actorId ?? 'system',
      intent?.correlationId, intent?.causationId, intent?.idempotencyKey));
    this.transitionTo(new TransitionContext(SubscriptionStatus.ACTIVE, intent?.reason ?? 'Renewed', intent?.actorId ?? 'system',
      intent?.correlationId, intent?.causationId, intent?.idempotencyKey));
    this.recordDecision('RENEW', intent, 'contract_renewal_approved');
    this._events.push(new SubscriptionRenewed(this._tenantId.value, this._subscriptionId.value, this._correlationId,
      this._currentVersion, this._causationId, intent?.actorId ?? null, intent?.idempotencyKey ?? null, oldContractEnd, newContractStart, terms));
  }

  // ── Transition Engine (for Workflow Engine integration) ──────────

  transitionTo(context: TransitionContext): void {
    this.assertNotDeleted();
    this.tryIdempotency(context.idempotencyKey, () => {
      const allowed = ALLOWED_TRANSITIONS[this._status];
      if (!allowed.includes(context.newStatus)) {
        throw new Error(`Cannot transition from ${this._status} to ${context.newStatus}. Allowed: [${allowed.join(', ')}]`);
      }
      if ((context.newStatus === SubscriptionStatus.CANCELLED || context.newStatus === SubscriptionStatus.ARCHIVED) && !context.reason) {
        throw new Error(`Transition to ${context.newStatus} requires a reason`);
      }
      const previousStatus = this._status;
      this._status = context.newStatus;
      this._updatedAt = new Date();
      this._currentVersion++;
      if (context.newStatus === SubscriptionStatus.ACTIVE && !this._activatedAt) this._activatedAt = new Date();
      if (context.newStatus === SubscriptionStatus.CANCELLED) this._cancelledAt = new Date();
      if (context.newStatus === SubscriptionStatus.ARCHIVED) this._archivedAt = new Date();
      return new StatusChanged(this._tenantId.value, this._subscriptionId.value, context.correlationId ?? this._correlationId,
        this._currentVersion, context.causationId ?? this._causationId, context.changedBy, context.idempotencyKey,
        previousStatus, context.newStatus, context.reason, context.changedBy);
    });
  }

  // ── Capabilities ─────────────────────────────────────────────────

  attachCapability(type: string, name: string, price: Money, metadata: Record<string, unknown> = {}, idempotencyKey?: string | null): void {
    this.assertNotDeleted(); this.assertActive();
    this.tryIdempotency(idempotencyKey, () => {
      const capabilityType = new CapabilityType(type);
      if (this._capabilities.find(c => c.type.equals(capabilityType) && c.status === CapabilityStatus.ACTIVE)) {
        throw new Error(`Capability '${type}' is already attached`);
      }
      const capability = new CapabilityAttachment(new CapabilityId(uuid()), capabilityType, name, CapabilityStatus.ACTIVE, new Date(), price, null, metadata);
      this._capabilities.push(capability); this._updatedAt = new Date();
      return new CapabilityAttached(this._tenantId.value, this._subscriptionId.value, this._correlationId,
        this._currentVersion, this._causationId, this._actorId, idempotencyKey ?? null, capability.capabilityId.value, type, name, price.amount);
    });
  }

  suspendCapability(capabilityId: string, idempotencyKey?: string | null): void {
    this.assertNotDeleted();
    this.tryIdempotency(idempotencyKey, () => {
      const idx = this._capabilities.findIndex(c => c.capabilityId.value === capabilityId);
      if (idx === -1) throw new Error(`Capability '${capabilityId}' not found`);
      this._capabilities[idx] = this._capabilities[idx]!.suspend(); this._updatedAt = new Date();
      return new CapabilitySuspended(this._tenantId.value, this._subscriptionId.value, this._correlationId,
        this._currentVersion, this._causationId, this._actorId, idempotencyKey ?? null, capabilityId);
    });
  }

  resumeCapability(capabilityId: string, idempotencyKey?: string | null): void {
    this.assertNotDeleted();
    this.tryIdempotency(idempotencyKey, () => {
      const idx = this._capabilities.findIndex(c => c.capabilityId.value === capabilityId);
      if (idx === -1) throw new Error(`Capability '${capabilityId}' not found`);
      this._capabilities[idx] = this._capabilities[idx]!.resume(); this._updatedAt = new Date();
      return null;
    });
  }

  removeCapability(capabilityId: string, idempotencyKey?: string | null): void {
    this.assertNotDeleted();
    this.tryIdempotency(idempotencyKey, () => {
      const idx = this._capabilities.findIndex(c => c.capabilityId.value === capabilityId);
      if (idx === -1) throw new Error(`Capability '${capabilityId}' not found`);
      this._capabilities[idx] = this._capabilities[idx]!.remove(); this._updatedAt = new Date();
      return new CapabilityRemoved(this._tenantId.value, this._subscriptionId.value, this._correlationId,
        this._currentVersion, this._causationId, this._actorId, idempotencyKey ?? null, capabilityId);
    });
  }

  // ── Equipment ────────────────────────────────────────────────────

  addEquipment(equipmentType: string, serialNumber: string, model: string, brand: string, warrantyEnd: Date | null = null, idempotencyKey?: string | null): void {
    this.assertNotDeleted();
    this.tryIdempotency(idempotencyKey, () => {
      const equipment = new EquipmentItem(new EquipmentId(uuid()), equipmentType, serialNumber, model, brand, EquipmentStatus.INSTALLED, warrantyEnd, new Date());
      this._equipment.push(equipment); this._updatedAt = new Date();
      return new EquipmentAdded(this._tenantId.value, this._subscriptionId.value, this._correlationId,
        this._currentVersion, this._causationId, this._actorId, idempotencyKey ?? null, equipment.equipmentId.value, equipmentType, serialNumber);
    });
  }

  replaceEquipment(equipmentId: string, model: string, brand: string, serialNumber: string, idempotencyKey?: string | null): void {
    this.assertNotDeleted();
    this.tryIdempotency(idempotencyKey, () => {
      const idx = this._equipment.findIndex(e => e.equipmentId.value === equipmentId);
      if (idx === -1) throw new Error(`Equipment '${equipmentId}' not found`);
      this._equipment[idx] = this._equipment[idx]!.replace(model, brand, serialNumber); this._updatedAt = new Date();
      return new EquipmentReplaced(this._tenantId.value, this._subscriptionId.value, this._correlationId,
        this._currentVersion, this._causationId, this._actorId, idempotencyKey ?? null, equipmentId, serialNumber);
    });
  }

  removeEquipment(equipmentId: string, idempotencyKey?: string | null): void {
    this.assertNotDeleted();
    this.tryIdempotency(idempotencyKey, () => {
      const idx = this._equipment.findIndex(e => e.equipmentId.value === equipmentId);
      if (idx === -1) throw new Error(`Equipment '${equipmentId}' not found`);
      this._equipment[idx] = this._equipment[idx]!.remove(); this._updatedAt = new Date();
      return new EquipmentRemoved(this._tenantId.value, this._subscriptionId.value, this._correlationId,
        this._currentVersion, this._causationId, this._actorId, idempotencyKey ?? null, equipmentId);
    });
  }

  // ── Health & Milestones & Process Twin ───────────────────────────

  updateHealth(health: SubscriptionHealth, factors: string[] = [], idempotencyKey?: string | null): void {
    this.assertNotDeleted();
    this.tryIdempotency(idempotencyKey, () => {
      if (health === this._health) return null;
      const previous = this._health; this._health = health; this._updatedAt = new Date();
      return new HealthChanged(this._tenantId.value, this._subscriptionId.value, this._correlationId,
        this._currentVersion, this._causationId, this._actorId, idempotencyKey ?? null, previous, health, factors);
    });
  }

  achieveMilestone(type: string, name: string, metadata: Record<string, unknown> = {}, idempotencyKey?: string | null): void {
    this.assertNotDeleted();
    this.tryIdempotency(idempotencyKey, () => {
      const milestone = new BusinessMilestone(new MilestoneId(uuid()), type, name, new Date(), metadata);
      this._milestones.push(milestone); this._updatedAt = new Date();
      return new MilestoneAchieved(this._tenantId.value, this._subscriptionId.value, this._correlationId,
        this._currentVersion, this._causationId, this._actorId, idempotencyKey ?? null, type, name);
    });
  }

  recordProcessStep(step: string, description: string, correlationId: string | null = null, idempotencyKey?: string | null): void {
    this.assertNotDeleted();
    this.tryIdempotency(idempotencyKey, () => {
      const ps = new ProcessStep(new StepId(uuid()), step, description, new Date(), correlationId);
      this._processSteps.push(ps); this._updatedAt = new Date();
      return new ProcessStepRecorded(this._tenantId.value, this._subscriptionId.value, this._correlationId,
        this._currentVersion, this._causationId, this._actorId, idempotencyKey ?? null, step, description);
    });
  }

  // ── Location / Plan / Contract updates ───────────────────────────

  updateLocation(locationId: string, changedBy: string): void {
    this.assertNotDeleted(); this._locationId = new LocationId(locationId); this._updatedAt = new Date(); this._currentVersion++;
  }

  updatePlan(planId: string, changedBy: string): void {
    this.assertNotDeleted(); this._planId = new PlanId(planId); this._updatedAt = new Date(); this._currentVersion++;
  }

  updateContract(contractId: string): void {
    this.assertNotDeleted(); this._contractId = new ContractId(contractId); this._updatedAt = new Date();
  }

  delete(): void {
    if (this._deletedAt) throw new Error('Subscription is already deleted');
    this._deletedAt = new Date(); this._updatedAt = new Date();
  }

  // ── Snapshot ─────────────────────────────────────────────────────

  snapshot(): Record<string, unknown> {
    return {
      subscriptionId: this._subscriptionId.value, tenantId: this._tenantId.value,
      personId: this._personId.value, planId: this._planId.value, serviceId: this._serviceId.value, locationId: this._locationId.value,
      contractId: this._contractId?.value ?? null, status: this._status, publicId: this._publicId.value,
      health: this._health, currentVersion: this._currentVersion, expectedVersion: this._expectedVersion,
      createdAt: this._createdAt.toISOString(), updatedAt: this._updatedAt.toISOString(),
      activatedAt: this._activatedAt?.toISOString() ?? null, cancelledAt: this._cancelledAt?.toISOString() ?? null,
      archivedAt: this._archivedAt?.toISOString() ?? null, deletedAt: this._deletedAt?.toISOString() ?? null,
      capabilities: this._capabilities.map(c => ({ capabilityId: c.capabilityId.value, type: c.type.value, name: c.name, status: c.status, price: { amount: c.price.amount, currency: c.price.currency }, startDate: c.startDate.toISOString(), endDate: c.endDate?.toISOString() ?? null })),
      equipment: this._equipment.map(e => ({ equipmentId: e.equipmentId.value, type: e.equipmentType, serialNumber: e.serialNumber, model: e.model, brand: e.brand, status: e.status })),
      milestones: this._milestones.map(m => ({ milestoneId: m.milestoneId.value, type: m.type, name: m.name, achievedAt: m.achievedAt.toISOString() })),
      decisionLog: this._decisionLog.map(d => ({ decisionId: d.decisionId, action: d.action, reason: d.reason, actorId: d.actorId, timestamp: d.timestamp.toISOString(), fromStatus: d.fromStatus, toStatus: d.toStatus, policies: d.policies, rules: d.rules, workflowTransition: d.workflowTransition })),
    };
  }

  // ── Event management ─────────────────────────────────────────────

  pullEvents(): DomainEvent[] { const events = [...this._events]; this._events.length = 0; return events; }
  getIdempotencyResult(key: string): DomainEvent[] | null { return this._idempotencyLog.get(key) ?? null; }
  hasIdempotencyKey(key: string): boolean { return this._idempotencyLog.has(key); }

  // ── Getters ──────────────────────────────────────────────────────

  get id(): string { return this._subscriptionId.value; }
  get subscriptionId(): SubscriptionId { return this._subscriptionId; }
  get tenantId(): string { return this._tenantId.value; }
  get tenantIdObj(): TenantId { return this._tenantId; }
  get personId(): string { return this._personId.value; }
  get personIdObj(): PersonId { return this._personId; }
  get planId(): string { return this._planId.value; }
  get planIdObj(): PlanId { return this._planId; }
  get serviceId(): string { return this._serviceId.value; }
  get serviceIdObj(): ServiceId { return this._serviceId; }
  get locationId(): string { return this._locationId.value; }
  get locationIdObj(): LocationId { return this._locationId; }
  get contractId(): string | null { return this._contractId?.value ?? null; }
  get contractIdObj(): ContractId | null { return this._contractId; }
  get status(): SubscriptionStatus { return this._status; }
  get publicId(): PublicId { return this._publicId; }
  get health(): SubscriptionHealth { return this._health; }
  get sla(): SlaConfig | null { return this._sla; }
  get currentVersion(): number { return this._currentVersion; }
  get expectedVersion(): number | null { return this._expectedVersion; }
  get createdAt(): Date { return this._createdAt; }
  get updatedAt(): Date { return this._updatedAt; }
  get activatedAt(): Date | null { return this._activatedAt; }
  get cancelledAt(): Date | null { return this._cancelledAt; }
  get archivedAt(): Date | null { return this._archivedAt; }
  get deletedAt(): Date | null { return this._deletedAt; }
  get capabilities(): readonly CapabilityAttachment[] { return this._capabilities; }
  get equipment(): readonly EquipmentItem[] { return this._equipment; }
  get milestones(): readonly BusinessMilestone[] { return this._milestones; }
  get processSteps(): readonly ProcessStep[] { return this._processSteps; }
  get decisionLog(): readonly DecisionRecord[] { return this._decisionLog; }

  isActive(): boolean { return this._status === SubscriptionStatus.ACTIVE; }
  isTerminal(): boolean { return this._status === SubscriptionStatus.CANCELLED || this._status === SubscriptionStatus.ARCHIVED || this._status === SubscriptionStatus.MERGED; }
  isDeleted(): boolean { return this._deletedAt !== null; }

  // ── Private helpers ──────────────────────────────────────────────

  private assertNotDeleted(): void { if (this._deletedAt) throw new Error('Cannot modify a deleted subscription'); }
  private assertActive(): void { if (this._status !== SubscriptionStatus.ACTIVE) throw new Error(`Subscription must be ACTIVE to manage capabilities. Current: ${this._status}`); }

  private recordDecision(action: string, intent: CommandIntent | undefined, ...explanations: string[]): void {
    this._decisionLog.push(new DecisionRecord(
      uuid(), action, intent?.reason ?? explanations.join('; '), intent?.actorId ?? null, new Date(),
      this._status, this._status,
      explanations.filter(e => e.startsWith('Policy')), explanations.filter(e => e.startsWith('Rule')),
      explanations.find(e => e.startsWith('Workflow')) ?? null,
      intent?.metadata,
    ));
  }

  private tryIdempotency(key: string | null | undefined, operation: () => DomainEvent | null): void {
    if (key && this._idempotencyLog.has(key)) throw new DuplicateIdempotencyKeyError(key);
    const event = operation();
    if (key && event) this._idempotencyLog.set(key, [event]);
    if (event) this._events.push(event);
  }
}
