import { Subscription } from './subscription.entity';
import {
  SubscriptionStatus,
  SubscriptionHealth,
  Money,
  PublicId,
  SlaConfig,
  TransitionContext,
  CapabilityStatus,
  EquipmentStatus,
} from './value-objects';

const TENANT = 'tenant-1';
const PERSON = 'person-1';
const PLAN = 'plan-1';
const SERVICE = 'service-1';
const LOCATION = 'location-1';

function createSubscription(overrides: Partial<Parameters<typeof Subscription.create>[0]> = {}): Subscription {
  return Subscription.create({
    tenantId: TENANT,
    personId: PERSON,
    planId: PLAN,
    serviceId: SERVICE,
    locationId: LOCATION,
    ...overrides,
  });
}

function transition(sub: Subscription, newStatus: SubscriptionStatus, reason = 'test', changedBy = 'tester'): void {
  sub.transitionTo(new TransitionContext(newStatus, reason, changedBy));
}

function activeSubscription(): Subscription {
  const sub = createSubscription();
  transition(sub, SubscriptionStatus.PENDING_VALIDATION);
  transition(sub, SubscriptionStatus.PENDING_COVERAGE);
  transition(sub, SubscriptionStatus.PENDING_DOCUMENTS);
  transition(sub, SubscriptionStatus.PENDING_APPROVAL);
  transition(sub, SubscriptionStatus.APPROVED);
  transition(sub, SubscriptionStatus.SKIP_INSTALL);
  transition(sub, SubscriptionStatus.ACTIVATING);
  sub.pullEvents();
  transition(sub, SubscriptionStatus.ACTIVE);
  return sub;
}

describe('Subscription Aggregate', () => {
  describe('creation', () => {
    it('should create a subscription in DRAFT status', () => {
      const sub = createSubscription();
      expect(sub.status).toBe(SubscriptionStatus.DRAFT);
      expect(sub.id).toBeDefined();
      expect(sub.id.length).toBeGreaterThan(0);
      expect(sub.tenantId).toBe(TENANT);
      expect(sub.personId).toBe(PERSON);
      expect(sub.planId).toBe(PLAN);
      expect(sub.serviceId).toBe(SERVICE);
      expect(sub.locationId).toBe(LOCATION);
    });

    it('should generate a valid public ID', () => {
      const sub = createSubscription();
      expect(sub.publicId.value).toMatch(/^SUB-\d{4}-\d{9}$/);
    });

    it('should accept a custom public ID', () => {
      const sub = createSubscription({ publicId: 'SUB-2026-000000001' });
      expect(sub.publicId.value).toBe('SUB-2026-000000001');
    });

    it('should reject an invalid public ID format', () => {
      expect(() => new PublicId('INVALID')).toThrow();
    });

    it('should emit SubscriptionCreated event', () => {
      const sub = createSubscription();
      const events = sub.pullEvents();
      expect(events).toHaveLength(1);
      expect(events[0]!.eventName).toBe('subscription.created');
    });

    it('should start with HEALTHY health', () => {
      const sub = createSubscription();
      expect(sub.health).toBe(SubscriptionHealth.HEALTHY);
    });

    it('should start with version 0', () => {
      const sub = createSubscription();
      expect(sub.currentVersion).toBe(0);
    });

    it('should accept SLA config on creation', () => {
      const sla = new SlaConfig(3, 12, 99.9, '02:00-04:00', 0.05);
      const sub = createSubscription({ sla });
      expect(sub.sla).toBeDefined();
      expect(sub.sla!.maxInstallationDays).toBe(3);
      expect(sub.sla!.availabilityPct).toBe(99.9);
    });

    it('should accept a contract ID on creation', () => {
      const sub = createSubscription({ contractId: 'contract-1' });
      expect(sub.contractId).toBe('contract-1');
    });
  });

  describe('status transitions', () => {
    it('should transition from DRAFT to PENDING_VALIDATION', () => {
      const sub = createSubscription();
      transition(sub, SubscriptionStatus.PENDING_VALIDATION);
      expect(sub.status).toBe(SubscriptionStatus.PENDING_VALIDATION);
    });

    it('should emit StatusChanged event on transition', () => {
      const sub = createSubscription();
      sub.pullEvents();
      transition(sub, SubscriptionStatus.PENDING_VALIDATION);
      const events = sub.pullEvents();
      expect(events).toHaveLength(1);
      expect(events[0]!.eventName).toBe('subscription.status.changed');
      expect(events[0]!.data.previousStatus).toBe(SubscriptionStatus.DRAFT);
      expect(events[0]!.data.newStatus).toBe(SubscriptionStatus.PENDING_VALIDATION);
    });

    it('should reject an invalid transition', () => {
      const sub = createSubscription();
      expect(() => transition(sub, SubscriptionStatus.ACTIVE)).toThrow(/Cannot transition/);
    });

    it('should follow the full happy path to ACTIVE', () => {
      const sub = createSubscription();
      transition(sub, SubscriptionStatus.PENDING_VALIDATION);
      transition(sub, SubscriptionStatus.PENDING_COVERAGE);
      transition(sub, SubscriptionStatus.PENDING_DOCUMENTS);
      transition(sub, SubscriptionStatus.PENDING_APPROVAL);
      transition(sub, SubscriptionStatus.APPROVED);
      transition(sub, SubscriptionStatus.SCHEDULED);
      transition(sub, SubscriptionStatus.INSTALLING);
      transition(sub, SubscriptionStatus.INSTALLED);
      transition(sub, SubscriptionStatus.ACTIVATING);
      transition(sub, SubscriptionStatus.ACTIVE);
      expect(sub.status).toBe(SubscriptionStatus.ACTIVE);
      expect(sub.activatedAt).toBeDefined();
    });

    it('should support skip-install flow', () => {
      const sub = createSubscription();
      transition(sub, SubscriptionStatus.PENDING_VALIDATION);
      transition(sub, SubscriptionStatus.PENDING_COVERAGE);
      transition(sub, SubscriptionStatus.PENDING_DOCUMENTS);
      transition(sub, SubscriptionStatus.PENDING_APPROVAL);
      transition(sub, SubscriptionStatus.APPROVED);
      transition(sub, SubscriptionStatus.SKIP_INSTALL);
      transition(sub, SubscriptionStatus.ACTIVATING);
      transition(sub, SubscriptionStatus.ACTIVE);
      expect(sub.status).toBe(SubscriptionStatus.ACTIVE);
    });

    it('should support suspension and reactivation', () => {
      const sub = createSubscription();
      // Go to active
      transition(sub, SubscriptionStatus.PENDING_VALIDATION);
      transition(sub, SubscriptionStatus.PENDING_COVERAGE);
      transition(sub, SubscriptionStatus.PENDING_DOCUMENTS);
      transition(sub, SubscriptionStatus.PENDING_APPROVAL);
      transition(sub, SubscriptionStatus.APPROVED);
      transition(sub, SubscriptionStatus.SKIP_INSTALL);
      transition(sub, SubscriptionStatus.ACTIVATING);
      transition(sub, SubscriptionStatus.ACTIVE);

      transition(sub, SubscriptionStatus.SUSPENDED, 'non_payment');
      expect(sub.status).toBe(SubscriptionStatus.SUSPENDED);

      transition(sub, SubscriptionStatus.REACTIVATING, 'payment_received');
      transition(sub, SubscriptionStatus.ACTIVE);
      expect(sub.status).toBe(SubscriptionStatus.ACTIVE);
    });

    it('should support cancellation flow', () => {
      const sub = createSubscription();
      transition(sub, SubscriptionStatus.PENDING_VALIDATION);
      transition(sub, SubscriptionStatus.PENDING_COVERAGE);
      transition(sub, SubscriptionStatus.PENDING_DOCUMENTS);
      transition(sub, SubscriptionStatus.PENDING_APPROVAL);
      transition(sub, SubscriptionStatus.CANCELLED, 'customer_request');
      expect(sub.status).toBe(SubscriptionStatus.CANCELLED);
      expect(sub.cancelledAt).toBeDefined();
    });

    it('should support archive from CANCELLED', () => {
      const sub = createSubscription();
      transition(sub, SubscriptionStatus.CANCELLED, 'customer_request', 'tester');
      transition(sub, SubscriptionStatus.ARCHIVED, 'data_retention_policy');
      expect(sub.status).toBe(SubscriptionStatus.ARCHIVED);
      expect(sub.archivedAt).toBeDefined();
    });

    it('should enforce reason requirement for CANCELLED', () => {
      const sub = createSubscription();
      expect(() =>
        sub.transitionTo(new TransitionContext(SubscriptionStatus.CANCELLED, '', 'tester')),
      ).toThrow(/requires a reason/);
    });

    it('should enforce reason requirement for ARCHIVED', () => {
      const sub = createSubscription();
      transition(sub, SubscriptionStatus.CANCELLED, 'customer_request', 'tester');
      expect(() =>
        sub.transitionTo(new TransitionContext(SubscriptionStatus.ARCHIVED, '', 'tester')),
      ).toThrow(/requires a reason/);
    });

    it('should prevent transition from ARCHIVED (terminal state)', () => {
      const sub = createSubscription();
      transition(sub, SubscriptionStatus.CANCELLED, 'customer_request', 'tester');
      transition(sub, SubscriptionStatus.ARCHIVED, 'policy', 'tester');
      expect(() => transition(sub, SubscriptionStatus.ACTIVE)).toThrow(/Cannot transition/);
    });

    it('should not set activatedAt on second activation', () => {
      const sub = createSubscription();
      transition(sub, SubscriptionStatus.PENDING_VALIDATION);
      transition(sub, SubscriptionStatus.PENDING_COVERAGE);
      transition(sub, SubscriptionStatus.PENDING_DOCUMENTS);
      transition(sub, SubscriptionStatus.PENDING_APPROVAL);
      transition(sub, SubscriptionStatus.APPROVED);
      transition(sub, SubscriptionStatus.SKIP_INSTALL);
      transition(sub, SubscriptionStatus.ACTIVATING);
      transition(sub, SubscriptionStatus.ACTIVE);
      // Suspend and reactivate
      transition(sub, SubscriptionStatus.SUSPENDED, 'non_payment');
      transition(sub, SubscriptionStatus.REACTIVATING, 'paid');
      transition(sub, SubscriptionStatus.ACTIVE);
      // activatedAt should still be the original date
      expect(sub.activatedAt).toBeDefined();
    });
  });

  describe('capability attachments', () => {
    it('should attach a capability to an active subscription', () => {
      const sub = activeSubscription();
      sub.attachCapability('ANTIVIRUS', 'Antivirus Pro', new Money(5.99));
      expect(sub.capabilities).toHaveLength(1);
      expect(sub.capabilities[0]!.type.value).toBe('ANTIVIRUS');
      expect(sub.capabilities[0]!.status).toBe(CapabilityStatus.ACTIVE);
    });

    it('should emit CapabilityAttached event', () => {
      const sub = activeSubscription();
      sub.pullEvents();
      sub.attachCapability('ANTIVIRUS', 'Antivirus Pro', new Money(5.99));
      const events = sub.pullEvents();
      expect(events.some(e => e.eventName === 'subscription.capability.attached')).toBe(true);
    });

    it('should reject duplicate capability type', () => {
      const sub = activeSubscription();
      sub.attachCapability('ANTIVIRUS', 'Antivirus Pro', new Money(5.99));
      expect(() => sub.attachCapability('ANTIVIRUS', 'Antivirus Pro', new Money(5.99))).toThrow(
        /already attached/,
      );
    });

    it('should suspend a capability', () => {
      const sub = activeSubscription();
      sub.attachCapability('FIXED_IP', 'Static IP', new Money(2.0));
      const capId = sub.capabilities[0]!.capabilityId.value;
      sub.suspendCapability(capId);
      expect(sub.capabilities[0]!.status).toBe(CapabilityStatus.SUSPENDED);
    });

    it('should resume a suspended capability', () => {
      const sub = activeSubscription();
      sub.attachCapability('FIXED_IP', 'Static IP', new Money(2.0));
      const capId = sub.capabilities[0]!.capabilityId.value;
      sub.suspendCapability(capId);
      sub.resumeCapability(capId);
      expect(sub.capabilities[0]!.status).toBe(CapabilityStatus.ACTIVE);
    });

    it('should remove a capability', () => {
      const sub = activeSubscription();
      sub.attachCapability('FIXED_IP', 'Static IP', new Money(2.0));
      const capId = sub.capabilities[0]!.capabilityId.value;
      sub.removeCapability(capId);
      expect(sub.capabilities[0]!.status).toBe(CapabilityStatus.REMOVED);
    });

    it('should reject capability actions on non-ACTIVE subscriptions', () => {
      const sub = createSubscription();
      expect(() => sub.attachCapability('X', 'X', new Money(1))).toThrow(/must be ACTIVE/);
    });

    it('should throw on unknown capability ID', () => {
      const sub = activeSubscription();
      expect(() => sub.suspendCapability('nonexistent')).toThrow(/not found/);
      expect(() => sub.removeCapability('nonexistent')).toThrow(/not found/);
    });
  });

  describe('equipment management', () => {
    it('should add equipment', () => {
      const sub = createSubscription();
      sub.addEquipment('ROUTER', 'SN-123', 'AX6000', 'TP-Link');
      expect(sub.equipment).toHaveLength(1);
      expect(sub.equipment[0]!.equipmentType).toBe('ROUTER');
      expect(sub.equipment[0]!.status).toBe(EquipmentStatus.INSTALLED);
    });

    it('should emit EquipmentAdded event', () => {
      const sub = createSubscription();
      sub.pullEvents();
      sub.addEquipment('ONT', 'ONT-001', 'HG8245', 'Huawei');
      const events = sub.pullEvents();
      expect(events.some(e => e.eventName === 'subscription.equipment.added')).toBe(true);
    });

    it('should replace equipment', () => {
      const sub = createSubscription();
      sub.addEquipment('ROUTER', 'SN-OLD', 'AX3000', 'TP-Link');
      const equipId = sub.equipment[0]!.equipmentId.value;
      sub.replaceEquipment(equipId, 'AX6000', 'TP-Link', 'SN-NEW');
      expect(sub.equipment[0]!.model).toBe('AX6000');
      expect(sub.equipment[0]!.status).toBe(EquipmentStatus.REPLACED);
    });

    it('should remove equipment', () => {
      const sub = createSubscription();
      sub.addEquipment('ROUTER', 'SN-123', 'AX6000', 'TP-Link');
      const equipId = sub.equipment[0]!.equipmentId.value;
      sub.removeEquipment(equipId);
      expect(sub.equipment[0]!.status).toBe(EquipmentStatus.REMOVED);
    });

    it('should throw on unknown equipment ID', () => {
      const sub = createSubscription();
      expect(() => sub.replaceEquipment('x', 'y', 'z', 'w')).toThrow(/not found/);
    });
  });

  describe('health tracking', () => {
    it('should update health and emit event', () => {
      const sub = createSubscription();
      sub.pullEvents();
      sub.updateHealth(SubscriptionHealth.WARNING, ['late_payment']);
      expect(sub.health).toBe(SubscriptionHealth.WARNING);
      const events = sub.pullEvents();
      expect(events.some(e => e.eventName === 'subscription.health.changed')).toBe(true);
    });

    it('should not emit event when health unchanged', () => {
      const sub = createSubscription();
      sub.pullEvents();
      sub.updateHealth(SubscriptionHealth.HEALTHY);
      expect(sub.pullEvents()).toHaveLength(0);
    });

    it('should cascade through health levels', () => {
      const sub = createSubscription();
      sub.updateHealth(SubscriptionHealth.WARNING, ['late_payment']);
      sub.updateHealth(SubscriptionHealth.AT_RISK, ['multiple_late_payments']);
      sub.updateHealth(SubscriptionHealth.CRITICAL, ['collections']);
      expect(sub.health).toBe(SubscriptionHealth.CRITICAL);
    });
  });

  describe('milestones', () => {
    it('should achieve milestones and emit event', () => {
      const sub = createSubscription();
      sub.pullEvents();
      sub.achieveMilestone('FIRST_PAYMENT', 'Primera factura pagada');
      expect(sub.milestones).toHaveLength(1);
      expect(sub.milestones[0]!.type).toBe('FIRST_PAYMENT');
      expect(sub.milestones[0]!.name).toBe('Primera factura pagada');
      const events = sub.pullEvents();
      expect(events.some(e => e.eventName === 'subscription.milestone.achieved')).toBe(true);
    });

    it('should support multiple milestones', () => {
      const sub = createSubscription();
      sub.achieveMilestone('FIRST_PAYMENT', 'Primera factura pagada');
      sub.achieveMilestone('FIRST_YEAR', 'Primer año cumplido');
      sub.achieveMilestone('PLAN_UPGRADE', 'Cambio de plan');
      expect(sub.milestones).toHaveLength(3);
    });
  });

  describe('digital process twin', () => {
    it('should record process steps', () => {
      const sub = createSubscription();
      sub.recordProcessStep('lead_created', 'Lead creado en CRM');
      expect(sub.processSteps).toHaveLength(1);
      expect(sub.processSteps[0]!.step).toBe('lead_created');
    });

    it('should emit ProcessStepRecorded event', () => {
      const sub = createSubscription();
      sub.pullEvents();
      sub.recordProcessStep('contract_signed', 'Contrato firmado digitalmente', 'corr-123');
      const events = sub.pullEvents();
      expect(events.some(e => e.eventName === 'subscription.process.step.recorded')).toBe(true);
    });

    it('should record full business process timeline', () => {
      const steps = [
        'solicitud_creada',
        'cobertura_validada',
        'documentacion_aprobada',
        'contrato_firmado',
        'agenda_creada',
        'instalacion_realizada',
        'servicio_activado',
        'factura_emitida',
        'pago_recibido',
        'comision_liberada',
      ];
      const sub = createSubscription();
      for (const step of steps) {
        sub.recordProcessStep(step, `Step: ${step}`);
      }
      expect(sub.processSteps).toHaveLength(steps.length);
    });
  });

  describe('deletion protection', () => {
    it('should soft-delete the subscription', () => {
      const sub = createSubscription();
      expect(sub.isDeleted()).toBe(false);
      sub.delete();
      expect(sub.isDeleted()).toBe(true);
      expect(sub.deletedAt).toBeDefined();
    });

    it('should reject operations on deleted subscription', () => {
      const sub = createSubscription();
      sub.delete();
      expect(() => sub.transitionTo(new TransitionContext(SubscriptionStatus.CANCELLED, 'reason', 'tester'))).toThrow(
        /deleted/,
      );
      expect(() => sub.attachCapability('X', 'X', new Money(1))).toThrow(/deleted/);
      expect(() => sub.addEquipment('ROUTER', 'SN', 'M', 'B')).toThrow(/deleted/);
      expect(() => sub.updateHealth(SubscriptionHealth.CRITICAL)).toThrow(/deleted/);
      expect(() => sub.recordProcessStep('x', 'x')).toThrow(/deleted/);
    });

    it('should reject double deletion', () => {
      const sub = createSubscription();
      sub.delete();
      expect(() => sub.delete()).toThrow(/already deleted/);
    });
  });

  describe('snapshot', () => {
    it('should produce a serializable snapshot', () => {
      const sub = createSubscription({ contractId: 'contract-1' });
      transition(sub, SubscriptionStatus.PENDING_VALIDATION, 'initial_validation', 'system');
      sub.addEquipment('ROUTER', 'SN-001', 'AX6000', 'TP-Link');
      sub.achieveMilestone('CREATED', 'Suscripción creada');
      const snap = sub.snapshot();
      expect(snap.subscriptionId).toBe(sub.id);
      expect(snap.tenantId).toBe(TENANT);
      expect(snap.status).toBe(SubscriptionStatus.PENDING_VALIDATION);
      expect(snap.publicId).toBe(sub.publicId.value);
      expect(snap.contractId).toBe('contract-1');
      expect(snap.currentVersion).toBe(1);
      expect((snap.capabilities as unknown[]).length).toBe(0);
      expect((snap.equipment as unknown[]).length).toBe(1);
      expect((snap.milestones as unknown[]).length).toBe(1);
    });
  });

  describe('event management', () => {
    it('should clear events after pull', () => {
      const sub = createSubscription();
      expect(sub.pullEvents()).toHaveLength(1);
      expect(sub.pullEvents()).toHaveLength(0);
    });

    it('should accumulate events across operations', () => {
      const sub = createSubscription();
      sub.pullEvents();
      sub.addEquipment('ROUTER', 'SN', 'M', 'B');
      sub.achieveMilestone('M1', 'Milestone');
      sub.recordProcessStep('step_1', 'First step');
      expect(sub.pullEvents()).toHaveLength(3);
    });
  });

  describe('helpers', () => {
    it('should correctly identify active status', () => {
      const sub = createSubscription();
      expect(sub.isActive()).toBe(false);
      transition(sub, SubscriptionStatus.CANCELLED, 'testing');
      expect(sub.isActive()).toBe(false);
    });

    it('should correctly identify terminal status', () => {
      const sub = createSubscription();
      expect(sub.isTerminal()).toBe(false);
      transition(sub, SubscriptionStatus.CANCELLED, 'testing');
      expect(sub.isTerminal()).toBe(true);
    });

    it('should increment version on each transition', () => {
      const sub = createSubscription();
      expect(sub.currentVersion).toBe(0);
      transition(sub, SubscriptionStatus.PENDING_VALIDATION);
      expect(sub.currentVersion).toBe(1);
      transition(sub, SubscriptionStatus.CANCELLED, 'testing');
      expect(sub.currentVersion).toBe(2);
    });
  });

  // ─────────────────────────────────────────────────
  // Obs. 3: Event versioning
  // ─────────────────────────────────────────────────
  describe('event versioning', () => {
    it('should include eventVersion in all events', () => {
      const sub = createSubscription();
      const events = sub.pullEvents();
      expect(events[0]!.eventVersion).toBe('1.0.0');
    });

    it('should include aggregateVersion in all events', () => {
      const sub = createSubscription();
      const events = sub.pullEvents();
      expect(events[0]!.aggregateVersion).toBe(0);
    });

    it('should include causationId and actorId when provided', () => {
      const sub = createSubscription({ causationId: 'cmd-123', actorId: 'user-1' });
      const events = sub.pullEvents();
      expect(events[0]!.causationId).toBe('cmd-123');
      expect(events[0]!.actorId).toBe('user-1');
    });

    it('should include idempotencyKey when provided', () => {
      const sub = createSubscription({ idempotencyKey: 'idem-001' });
      const events = sub.pullEvents();
      expect(events[0]!.idempotencyKey).toBe('idem-001');
    });

    it('should include timestamp in UTC on all events', () => {
      const sub = createSubscription();
      const events = sub.pullEvents();
      expect(events[0]!.timestamp).toBeDefined();
      expect(events[0]!.timestamp instanceof Date).toBe(true);
    });
  });

  // ─────────────────────────────────────────────────
  // Obs. 4: Idempotency
  // ─────────────────────────────────────────────────
  describe('idempotency', () => {
    it('should reject duplicate idempotency key on transition', () => {
      const sub = createSubscription();
      const ctx = new TransitionContext(SubscriptionStatus.PENDING_VALIDATION, 'test', 'tester', null, null, 'idem-001');
      sub.transitionTo(ctx);
      const ctx2 = new TransitionContext(SubscriptionStatus.PENDING_COVERAGE, 'test', 'tester', null, null, 'idem-001');
      expect(() => sub.transitionTo(ctx2)).toThrow(/Idempotency key/);
    });

    it('should accept unique idempotency keys on multiple transitions', () => {
      const sub = createSubscription();
      sub.transitionTo(new TransitionContext(SubscriptionStatus.PENDING_VALIDATION, 'test', 'tester', null, null, 'idem-01'));
      sub.transitionTo(new TransitionContext(SubscriptionStatus.PENDING_COVERAGE, 'test', 'tester', null, null, 'idem-02'));
      sub.transitionTo(new TransitionContext(SubscriptionStatus.PENDING_DOCUMENTS, 'test', 'tester', null, null, 'idem-03'));
      expect(sub.status).toBe(SubscriptionStatus.PENDING_DOCUMENTS);
    });

    it('should reject duplicate idempotency key on capability attach', () => {
      const sub = activeSubscription();
      sub.attachCapability('ANTIVIRUS', 'Av', new Money(5), {}, 'idem-cap-1');
      expect(() => sub.attachCapability('BACKUP', 'Bk', new Money(3), {}, 'idem-cap-1')).toThrow(/Idempotency key/);
    });

    it('should track idempotency keys via hasIdempotencyKey', () => {
      const sub = createSubscription();
      sub.transitionTo(new TransitionContext(SubscriptionStatus.PENDING_VALIDATION, 'test', 'tester', null, null, 'track-1'));
      expect(sub.hasIdempotencyKey('track-1')).toBe(true);
      expect(sub.hasIdempotencyKey('unknown')).toBe(false);
    });

    it('should return stored events via getIdempotencyResult', () => {
      const sub = createSubscription({ idempotencyKey: 'get-idem' });
      const original = sub.pullEvents();
      const stored = sub.getIdempotencyResult('get-idem');
      expect(stored).toBeDefined();
      expect(stored!.length).toBe(1);
      expect(stored![0]!.eventName).toBe(original[0]!.eventName);
    });
  });

  // ─────────────────────────────────────────────────
  // Obs. 5: Optimistic concurrency
  // ─────────────────────────────────────────────────
  describe('optimistic concurrency', () => {
    it('should accept setExpectedVersion', () => {
      const sub = createSubscription();
      sub.setExpectedVersion(0);
      expect(sub.expectedVersion).toBe(0);
      transition(sub, SubscriptionStatus.PENDING_VALIDATION);
      expect(sub.currentVersion).toBe(1);
    });

    it('should pass concurrency check when versions match', () => {
      const sub = createSubscription();
      sub.setExpectedVersion(0);
      expect(() => sub.checkConcurrency(0)).not.toThrow();
    });

    it('should throw ConcurrencyConflictError when versions mismatch', () => {
      const sub = createSubscription();
      sub.setExpectedVersion(0);
      expect(() => sub.checkConcurrency(1)).toThrow(/Concurrency conflict/);
    });

    it('should allow checkConcurrency without expected version set', () => {
      const sub = createSubscription();
      expect(() => sub.checkConcurrency(5)).not.toThrow();
    });
  });

  // ─────────────────────────────────────────────────
  // Obs. 6: Richly typed IDs
  // ─────────────────────────────────────────────────
  describe('richly typed IDs', () => {
    it('should expose typed SubscriptionId', () => {
      const sub = createSubscription();
      expect(sub.subscriptionId).toBeDefined();
      expect(sub.subscriptionId.value).toBe(sub.id);
    });

    it('should expose typed PersonId', () => {
      const sub = createSubscription();
      expect(sub.personIdObj).toBeDefined();
      expect(sub.personIdObj.value).toBe(PERSON);
    });

    it('should expose typed TenantId', () => {
      const sub = createSubscription();
      expect(sub.tenantIdObj).toBeDefined();
      expect(sub.tenantIdObj.value).toBe(TENANT);
    });

    it('should reject invalid typed IDs', () => {
      const { SubscriptionId, PersonId, PlanId, TenantId } = require('./value-objects');
      expect(() => new SubscriptionId('')).toThrow(/cannot be empty/i);
      expect(() => new PersonId('')).toThrow(/cannot be empty/i);
      expect(() => new PlanId('')).toThrow(/cannot be empty/i);
      expect(() => new TenantId('')).toThrow(/cannot be empty/i);
    });
  });

  // ─────────────────────────────────────────────────
  // Obs. 1: Specifications
  // ─────────────────────────────────────────────────
  describe('specifications', () => {
    const {
      NotDeletedSpecification,
      ActiveStatusForCapabilitiesSpecification,
      ValidTransitionSpecification,
      TerminalTransitionRequiresReasonSpecification,
      UniqueCapabilityTypeSpecification,
    } = require('./specifications');

    it('NotDeletedSpecification: satisfied when not deleted', () => {
      const spec = new NotDeletedSpecification();
      const sub = createSubscription();
      expect(spec.isSatisfiedBy(sub).isSatisfied).toBe(true);
    });

    it('NotDeletedSpecification: not satisfied when deleted', () => {
      const spec = new NotDeletedSpecification();
      const sub = createSubscription();
      sub.delete();
      expect(spec.isSatisfiedBy(sub).isSatisfied).toBe(false);
    });

    it('ValidTransitionSpecification: satisfied for valid transition', () => {
      const spec = new ValidTransitionSpecification();
      const result = spec.isSatisfiedBy({ current: SubscriptionStatus.DRAFT, target: SubscriptionStatus.PENDING_VALIDATION });
      expect(result.isSatisfied).toBe(true);
    });

    it('ValidTransitionSpecification: not satisfied for invalid transition', () => {
      const spec = new ValidTransitionSpecification();
      const result = spec.isSatisfiedBy({ current: SubscriptionStatus.DRAFT, target: SubscriptionStatus.ACTIVE });
      expect(result.isSatisfied).toBe(false);
    });

    it('UniqueCapabilityTypeSpecification: rejects duplicate type', () => {
      const spec = new UniqueCapabilityTypeSpecification();
      const result = spec.isSatisfiedBy({ existing: ['ANTIVIRUS'], newType: 'ANTIVIRUS' });
      expect(result.isSatisfied).toBe(false);
    });
  });

  // ─────────────────────────────────────────────────
  // Obs. 7: Events as public API
  // ─────────────────────────────────────────────────
  describe('domain compatibility', () => {
    it('every event should have eventName, eventVersion, aggregateVersion', () => {
      const sub = createSubscription();
      sub.pullEvents();
      transition(sub, SubscriptionStatus.PENDING_VALIDATION);
      sub.addEquipment('R', 'S', 'M', 'B');
      sub.recordProcessStep('x', 'y');
      const events = sub.pullEvents();
      for (const evt of events) {
        expect(evt.eventName).toBeDefined();
        expect(typeof evt.eventName).toBe('string');
        expect(evt.eventVersion).toBeDefined();
        expect(typeof evt.aggregateVersion).toBe('number');
        expect(evt.tenantId).toBe(TENANT);
        expect(evt.subscriptionId).toBe(sub.id);
      }
    });
  });

  // ─────────────────────────────────────────────────
  // Obs. 8: Semantic Commands
  // ─────────────────────────────────────────────────
  describe('semantic commands', () => {
    function fullSubscription(): Subscription {
      const sub = createSubscription();
      sub.pullEvents();
      return sub;
    }

    it('validate should transition to PENDING_VALIDATION', () => {
      const sub = fullSubscription();
      sub.validate('verifier');
      expect(sub.status).toBe(SubscriptionStatus.PENDING_VALIDATION);
    });

    it('approve should transition to APPROVED', () => {
      const sub = fullSubscription();
      sub.validate('verifier');
      sub.confirmCoverage('INTERNET', 'zone-1');
      sub.submitDocuments(['doc-1']);
      sub.approve('manager', 750);
      expect(sub.status).toBe(SubscriptionStatus.APPROVED);
    });

    it('reject should transition to REJECTED', () => {
      const sub = fullSubscription();
      sub.validate('verifier');
      sub.confirmCoverage('INTERNET', 'zone-1');
      sub.submitDocuments(['doc-1']);
      sub.reject('Incomplete documentation', 'underwriter');
      expect(sub.status).toBe(SubscriptionStatus.REJECTED);
    });

    it('activate should reach ACTIVE status', () => {
      const sub = fullSubscription();
      sub.validate('v'); sub.confirmCoverage('I', 'z'); sub.submitDocuments(['d']);
      sub.approve('m', 750); sub.scheduleInstallation('tech', new Date(), 'WO-1');
      sub.startInstallation('tech'); sub.completeInstallation(['ROUTER'], ['evidence']);
      sub.activate(new Date(), 'BC-1');
      expect(sub.status).toBe(SubscriptionStatus.ACTIVE);
    });

    it('suspend and reactivate cycle', () => {
      const sub = fullSubscription();
      sub.validate('v'); sub.confirmCoverage('I', 'z'); sub.submitDocuments(['d']);
      sub.approve('m', 750); sub.scheduleInstallation('tech', new Date(), 'WO-1');
      sub.startInstallation('tech'); sub.completeInstallation(['R'], ['e']);
      sub.activate();
      sub.suspend('non_payment', new Date(Date.now() + 30 * 86400000));
      expect(sub.status).toBe(SubscriptionStatus.SUSPENDED);
      sub.reactivate(null);
      expect(sub.status).toBe(SubscriptionStatus.ACTIVE);
    });

    it('cancel and archive flow', () => {
      const sub = fullSubscription();
      sub.cancel('customer_request', 'customer');
      expect(sub.status).toBe(SubscriptionStatus.CANCELLED);
      sub.archive('data_retention');
      expect(sub.status).toBe(SubscriptionStatus.ARCHIVED);
    });

    it('should accept CommandIntent with rich metadata', () => {
      const sub = fullSubscription();
      const intent = new (require('./value-objects').CommandIntent)('ops-user', 'Manual validation', 'ADMIN_PANEL', 'BACKOFFICE');
      sub.validate('ops-user', intent);
      expect(sub.status).toBe(SubscriptionStatus.PENDING_VALIDATION);
    });
  });

  // ─────────────────────────────────────────────────
  // Obs. 10: Domain Decision Log
  // ─────────────────────────────────────────────────
  describe('decision log', () => {
    it('should record initial creation decision', () => {
      const sub = createSubscription();
      expect(sub.decisionLog.length).toBeGreaterThanOrEqual(1);
      expect(sub.decisionLog[0]!.action).toBe('SUBSCRIPTION_CREATED');
    });

    it('should record a decision after validate', () => {
      const sub = createSubscription();
      const before = sub.decisionLog.length;
      sub.pullEvents();
      sub.validate('verifier');
      expect(sub.decisionLog.length).toBe(before + 1);
      expect(sub.decisionLog[before]!.action).toBe('VALIDATE');
      expect(sub.decisionLog[before]!.policies).toBeDefined();
    });

    it('should record decision with policies after approve', () => {
      const sub = createSubscription();
      sub.pullEvents();
      sub.validate('v'); sub.confirmCoverage('I', 'z'); sub.submitDocuments(['d']);
      sub.approve('manager', 750);
      const decision = sub.decisionLog.find(d => d.action === 'APPROVE');
      expect(decision).toBeDefined();
      expect(decision!.policies.length).toBeGreaterThanOrEqual(1);
    });

    it('should record all lifecycle decisions', () => {
      const sub = createSubscription();
      sub.pullEvents();
      sub.validate('v'); sub.confirmCoverage('I', 'z'); sub.submitDocuments(['d']);
      sub.approve('m', 750); sub.scheduleInstallation('tech', new Date(), 'WO-1');
      sub.startInstallation('tech'); sub.completeInstallation(['R'], ['e']);
      sub.activate();
      sub.suspend('payment');
      sub.reactivate();
      const actions = sub.decisionLog.map(d => d.action);
      expect(actions).toContain('VALIDATE');
      expect(actions).toContain('CONFIRM_COVERAGE');
      expect(actions).toContain('SUBMIT_DOCUMENTS');
      expect(actions).toContain('APPROVE');
      expect(actions).toContain('SCHEDULE_INSTALLATION');
      expect(actions).toContain('START_INSTALLATION');
      expect(actions).toContain('COMPLETE_INSTALLATION');
      expect(actions).toContain('ACTIVATE');
      expect(actions).toContain('SUSPEND');
      expect(actions).toContain('REACTIVATE');
    });

    it('should include decision log in snapshot', () => {
      const sub = createSubscription();
      sub.pullEvents();
      sub.validate('v');
      sub.cancel('customer_request', 'customer');
      const snap = sub.snapshot();
      expect(snap.decisionLog).toBeDefined();
      expect((snap.decisionLog as unknown[]).length).toBeGreaterThanOrEqual(3);
    });
  });
});
