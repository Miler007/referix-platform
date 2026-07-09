import { BaseSubscriptionCommand } from './base-subscription.command';

export class CreateSubscriptionCommand extends BaseSubscriptionCommand {
  readonly type = 'CreateSubscription';
  constructor(
    tenantId: string, actorId: string, correlationId: string,
    public readonly personId: string,
    public readonly planId: string,
    public readonly serviceId: string,
    public readonly locationId: string,
    public readonly publicId: string,
    causationId?: string, idempotencyKey?: string,
  ) { super('new', tenantId, actorId, correlationId, causationId, idempotencyKey); }
}

export class ValidateSubscriptionCommand extends BaseSubscriptionCommand {
  readonly type = 'ValidateSubscription';
  constructor(
    subscriptionId: string, tenantId: string, actorId: string, correlationId: string,
    public readonly validatedBy: string,
    causationId?: string, idempotencyKey?: string,
  ) { super(subscriptionId, tenantId, actorId, correlationId, causationId, idempotencyKey); }
}

export class ConfirmCoverageCommand extends BaseSubscriptionCommand {
  readonly type = 'ConfirmCoverage';
  constructor(
    subscriptionId: string, tenantId: string, actorId: string, correlationId: string,
    public readonly serviceType: string,
    public readonly zoneId: string,
    causationId?: string, idempotencyKey?: string,
  ) { super(subscriptionId, tenantId, actorId, correlationId, causationId, idempotencyKey); }
}

export class SubmitDocumentsCommand extends BaseSubscriptionCommand {
  readonly type = 'SubmitDocuments';
  constructor(
    subscriptionId: string, tenantId: string, actorId: string, correlationId: string,
    public readonly documentIds: string[],
    causationId?: string, idempotencyKey?: string,
  ) { super(subscriptionId, tenantId, actorId, correlationId, causationId, idempotencyKey); }
}

export class ApproveSubscriptionCommand extends BaseSubscriptionCommand {
  readonly type = 'ApproveSubscription';
  constructor(
    subscriptionId: string, tenantId: string, actorId: string, correlationId: string,
    public readonly approvedBy: string,
    public readonly creditScore: number | null,
    causationId?: string, idempotencyKey?: string,
  ) { super(subscriptionId, tenantId, actorId, correlationId, causationId, idempotencyKey); }
}

export class RejectSubscriptionCommand extends BaseSubscriptionCommand {
  readonly type = 'RejectSubscription';
  constructor(
    subscriptionId: string, tenantId: string, actorId: string, correlationId: string,
    public readonly reason: string,
    public readonly rejectedBy: string,
    causationId?: string, idempotencyKey?: string,
  ) { super(subscriptionId, tenantId, actorId, correlationId, causationId, idempotencyKey); }
}

export class ScheduleInstallationCommand extends BaseSubscriptionCommand {
  readonly type = 'ScheduleInstallation';
  constructor(
    subscriptionId: string, tenantId: string, actorId: string, correlationId: string,
    public readonly technicianId: string,
    public readonly scheduledDate: Date,
    public readonly workOrderId: string,
    causationId?: string, idempotencyKey?: string,
  ) { super(subscriptionId, tenantId, actorId, correlationId, causationId, idempotencyKey); }
}

export class StartInstallationCommand extends BaseSubscriptionCommand {
  readonly type = 'StartInstallation';
  constructor(
    subscriptionId: string, tenantId: string, actorId: string, correlationId: string,
    public readonly technicianId: string,
    causationId?: string, idempotencyKey?: string,
  ) { super(subscriptionId, tenantId, actorId, correlationId, causationId, idempotencyKey); }
}

export class CompleteInstallationCommand extends BaseSubscriptionCommand {
  readonly type = 'CompleteInstallation';
  constructor(
    subscriptionId: string, tenantId: string, actorId: string, correlationId: string,
    public readonly equipment: string[],
    public readonly evidence: string[],
    causationId?: string, idempotencyKey?: string,
  ) { super(subscriptionId, tenantId, actorId, correlationId, causationId, idempotencyKey); }
}

export class ActivateSubscriptionCommand extends BaseSubscriptionCommand {
  readonly type = 'ActivateSubscription';
  constructor(
    subscriptionId: string, tenantId: string, actorId: string, correlationId: string,
    public readonly activationDate?: Date,
    public readonly billingCycleId?: string | null,
    causationId?: string, idempotencyKey?: string,
  ) { super(subscriptionId, tenantId, actorId, correlationId, causationId, idempotencyKey); }
}

export class SuspendSubscriptionCommand extends BaseSubscriptionCommand {
  readonly type = 'SuspendSubscription';
  constructor(
    subscriptionId: string, tenantId: string, actorId: string, correlationId: string,
    public readonly reason: string,
    public readonly expectedReactivation?: Date | null,
    causationId?: string, idempotencyKey?: string,
  ) { super(subscriptionId, tenantId, actorId, correlationId, causationId, idempotencyKey); }
}

export class ReactivateSubscriptionCommand extends BaseSubscriptionCommand {
  readonly type = 'ReactivateSubscription';
  constructor(
    subscriptionId: string, tenantId: string, actorId: string, correlationId: string,
    public readonly reactivationFee?: number | null,
    causationId?: string, idempotencyKey?: string,
  ) { super(subscriptionId, tenantId, actorId, correlationId, causationId, idempotencyKey); }
}

export class CancelSubscriptionCommand extends BaseSubscriptionCommand {
  readonly type = 'CancelSubscription';
  constructor(
    subscriptionId: string, tenantId: string, actorId: string, correlationId: string,
    public readonly reason: string,
    causationId?: string, idempotencyKey?: string,
  ) { super(subscriptionId, tenantId, actorId, correlationId, causationId, idempotencyKey); }
}

export class ArchiveSubscriptionCommand extends BaseSubscriptionCommand {
  readonly type = 'ArchiveSubscription';
  constructor(
    subscriptionId: string, tenantId: string, actorId: string, correlationId: string,
    public readonly reason: string,
    causationId?: string, idempotencyKey?: string,
  ) { super(subscriptionId, tenantId, actorId, correlationId, causationId, idempotencyKey); }
}

export class RenewSubscriptionCommand extends BaseSubscriptionCommand {
  readonly type = 'RenewSubscription';
  constructor(
    subscriptionId: string, tenantId: string, actorId: string, correlationId: string,
    public readonly newTermMonths: number,
    causationId?: string, idempotencyKey?: string,
  ) { super(subscriptionId, tenantId, actorId, correlationId, causationId, idempotencyKey); }
}

export class TransferSubscriptionCommand extends BaseSubscriptionCommand {
  readonly type = 'TransferSubscription';
  constructor(
    subscriptionId: string, tenantId: string, actorId: string, correlationId: string,
    public readonly newPersonId: string,
    public readonly newLocationId: string | null,
    causationId?: string, idempotencyKey?: string,
  ) { super(subscriptionId, tenantId, actorId, correlationId, causationId, idempotencyKey); }
}

export class MigratePlanCommand extends BaseSubscriptionCommand {
  readonly type = 'MigratePlan';
  constructor(
    subscriptionId: string, tenantId: string, actorId: string, correlationId: string,
    public readonly newPlanId: string,
    causationId?: string, idempotencyKey?: string,
  ) { super(subscriptionId, tenantId, actorId, correlationId, causationId, idempotencyKey); }
}

export class AddCapabilityCommand extends BaseSubscriptionCommand {
  readonly type = 'AddCapability';
  constructor(
    subscriptionId: string, tenantId: string, actorId: string, correlationId: string,
    public readonly typeName: string,
    public readonly name: string,
    public readonly priceAmount: number,
    public readonly priceCurrency: string,
    causationId?: string, idempotencyKey?: string,
  ) { super(subscriptionId, tenantId, actorId, correlationId, causationId, idempotencyKey); }
}

export class RemoveCapabilityCommand extends BaseSubscriptionCommand {
  readonly type = 'RemoveCapability';
  constructor(
    subscriptionId: string, tenantId: string, actorId: string, correlationId: string,
    public readonly capabilityId: string,
    causationId?: string, idempotencyKey?: string,
  ) { super(subscriptionId, tenantId, actorId, correlationId, causationId, idempotencyKey); }
}

export class AddEquipmentCommand extends BaseSubscriptionCommand {
  readonly type = 'AddEquipment';
  constructor(
    subscriptionId: string, tenantId: string, actorId: string, correlationId: string,
    public readonly equipmentType: string,
    public readonly serialNumber: string,
    public readonly model: string,
    public readonly brand: string,
    causationId?: string, idempotencyKey?: string,
  ) { super(subscriptionId, tenantId, actorId, correlationId, causationId, idempotencyKey); }
}

export class RemoveEquipmentCommand extends BaseSubscriptionCommand {
  readonly type = 'RemoveEquipment';
  constructor(
    subscriptionId: string, tenantId: string, actorId: string, correlationId: string,
    public readonly equipmentId: string,
    causationId?: string, idempotencyKey?: string,
  ) { super(subscriptionId, tenantId, actorId, correlationId, causationId, idempotencyKey); }
}
