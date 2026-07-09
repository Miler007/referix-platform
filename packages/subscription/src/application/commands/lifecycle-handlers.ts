import { ICommandHandler } from '../bus/command-bus.interface';
import { BaseHandler } from './base-handler';
import {
  ValidateSubscriptionCommand, ConfirmCoverageCommand, SubmitDocumentsCommand,
  ApproveSubscriptionCommand, RejectSubscriptionCommand, ScheduleInstallationCommand,
  StartInstallationCommand, CompleteInstallationCommand, ActivateSubscriptionCommand,
  SuspendSubscriptionCommand, ReactivateSubscriptionCommand, CancelSubscriptionCommand,
  ArchiveSubscriptionCommand, RenewSubscriptionCommand, TransferSubscriptionCommand,
  MigratePlanCommand, AddCapabilityCommand, RemoveCapabilityCommand,
  AddEquipmentCommand, RemoveEquipmentCommand,
} from './subscription-commands';
import { ISubscriptionRepository } from '../../domain/repository.interface';
import { IEventStore } from '../../infrastructure/event-store/event-store.interface';
import { IOutbox } from '../outbox/outbox.interface';
import { IUnitOfWork } from '../transaction/transaction-manager.interface';
import { CommandIntent, Money } from '../../domain/value-objects';

function intent(cmd: { actorId: string; correlationId: string; causationId?: string; idempotencyKey?: string }, reason: string): CommandIntent {
  return new CommandIntent(cmd.actorId, reason, 'API', 'CRM', cmd.correlationId, cmd.causationId ?? null, cmd.idempotencyKey ?? null);
}

export class ValidateSubscriptionHandler extends BaseHandler implements ICommandHandler<ValidateSubscriptionCommand, void> {
  constructor(repo: ISubscriptionRepository, eventStore: IEventStore, outbox: IOutbox, private readonly uow: IUnitOfWork) {
    super(repo, eventStore, outbox);
  }
  async handle(command: ValidateSubscriptionCommand): Promise<void> {
    return this.uow.execute(async () => {
      const sub = await this.load(command);
      sub.validate(command.validatedBy, intent(command, 'Validation'));
      await this.save(sub, command);
    });
  }
}

export class ConfirmCoverageHandler extends BaseHandler implements ICommandHandler<ConfirmCoverageCommand, void> {
  constructor(repo: ISubscriptionRepository, eventStore: IEventStore, outbox: IOutbox, private readonly uow: IUnitOfWork) {
    super(repo, eventStore, outbox);
  }
  async handle(command: ConfirmCoverageCommand): Promise<void> {
    return this.uow.execute(async () => {
      const sub = await this.load(command);
      sub.confirmCoverage(command.serviceType, command.zoneId, intent(command, 'Coverage confirmation'));
      await this.save(sub, command);
    });
  }
}

export class SubmitDocumentsHandler extends BaseHandler implements ICommandHandler<SubmitDocumentsCommand, void> {
  constructor(repo: ISubscriptionRepository, eventStore: IEventStore, outbox: IOutbox, private readonly uow: IUnitOfWork) {
    super(repo, eventStore, outbox);
  }
  async handle(command: SubmitDocumentsCommand): Promise<void> {
    return this.uow.execute(async () => {
      const sub = await this.load(command);
      sub.submitDocuments(command.documentIds, intent(command, 'Document submission'));
      await this.save(sub, command);
    });
  }
}

export class ApproveSubscriptionHandler extends BaseHandler implements ICommandHandler<ApproveSubscriptionCommand, void> {
  constructor(repo: ISubscriptionRepository, eventStore: IEventStore, outbox: IOutbox, private readonly uow: IUnitOfWork) {
    super(repo, eventStore, outbox);
  }
  async handle(command: ApproveSubscriptionCommand): Promise<void> {
    return this.uow.execute(async () => {
      const sub = await this.load(command);
      sub.approve(command.approvedBy, command.creditScore, intent(command, 'Approval'));
      await this.save(sub, command);
    });
  }
}

export class RejectSubscriptionHandler extends BaseHandler implements ICommandHandler<RejectSubscriptionCommand, void> {
  constructor(repo: ISubscriptionRepository, eventStore: IEventStore, outbox: IOutbox, private readonly uow: IUnitOfWork) {
    super(repo, eventStore, outbox);
  }
  async handle(command: RejectSubscriptionCommand): Promise<void> {
    return this.uow.execute(async () => {
      const sub = await this.load(command);
      sub.reject(command.reason, command.rejectedBy, intent(command, command.reason));
      await this.save(sub, command);
    });
  }
}

export class ScheduleInstallationHandler extends BaseHandler implements ICommandHandler<ScheduleInstallationCommand, void> {
  constructor(repo: ISubscriptionRepository, eventStore: IEventStore, outbox: IOutbox, private readonly uow: IUnitOfWork) {
    super(repo, eventStore, outbox);
  }
  async handle(command: ScheduleInstallationCommand): Promise<void> {
    return this.uow.execute(async () => {
      const sub = await this.load(command);
      sub.scheduleInstallation(command.technicianId, command.scheduledDate, command.workOrderId, intent(command, 'Installation scheduling'));
      await this.save(sub, command);
    });
  }
}

export class StartInstallationHandler extends BaseHandler implements ICommandHandler<StartInstallationCommand, void> {
  constructor(repo: ISubscriptionRepository, eventStore: IEventStore, outbox: IOutbox, private readonly uow: IUnitOfWork) {
    super(repo, eventStore, outbox);
  }
  async handle(command: StartInstallationCommand): Promise<void> {
    return this.uow.execute(async () => {
      const sub = await this.load(command);
      sub.startInstallation(command.technicianId, intent(command, 'Installation start'));
      await this.save(sub, command);
    });
  }
}

export class CompleteInstallationHandler extends BaseHandler implements ICommandHandler<CompleteInstallationCommand, void> {
  constructor(repo: ISubscriptionRepository, eventStore: IEventStore, outbox: IOutbox, private readonly uow: IUnitOfWork) {
    super(repo, eventStore, outbox);
  }
  async handle(command: CompleteInstallationCommand): Promise<void> {
    return this.uow.execute(async () => {
      const sub = await this.load(command);
      sub.completeInstallation(command.equipment, command.evidence, intent(command, 'Installation completion'));
      await this.save(sub, command);
    });
  }
}

export class ActivateSubscriptionHandler extends BaseHandler implements ICommandHandler<ActivateSubscriptionCommand, void> {
  constructor(repo: ISubscriptionRepository, eventStore: IEventStore, outbox: IOutbox, private readonly uow: IUnitOfWork) {
    super(repo, eventStore, outbox);
  }
  async handle(command: ActivateSubscriptionCommand): Promise<void> {
    return this.uow.execute(async () => {
      const sub = await this.load(command);
      sub.activate(command.activationDate, command.billingCycleId, intent(command, 'Activation'));
      await this.save(sub, command);
    });
  }
}

export class SuspendSubscriptionHandler extends BaseHandler implements ICommandHandler<SuspendSubscriptionCommand, void> {
  constructor(repo: ISubscriptionRepository, eventStore: IEventStore, outbox: IOutbox, private readonly uow: IUnitOfWork) {
    super(repo, eventStore, outbox);
  }
  async handle(command: SuspendSubscriptionCommand): Promise<void> {
    return this.uow.execute(async () => {
      const sub = await this.load(command);
      sub.suspend(command.reason, command.expectedReactivation, intent(command, command.reason));
      await this.save(sub, command);
    });
  }
}

export class ReactivateSubscriptionHandler extends BaseHandler implements ICommandHandler<ReactivateSubscriptionCommand, void> {
  constructor(repo: ISubscriptionRepository, eventStore: IEventStore, outbox: IOutbox, private readonly uow: IUnitOfWork) {
    super(repo, eventStore, outbox);
  }
  async handle(command: ReactivateSubscriptionCommand): Promise<void> {
    return this.uow.execute(async () => {
      const sub = await this.load(command);
      sub.reactivate(command.reactivationFee, intent(command, 'Reactivation'));
      await this.save(sub, command);
    });
  }
}

export class CancelSubscriptionHandler extends BaseHandler implements ICommandHandler<CancelSubscriptionCommand, void> {
  constructor(repo: ISubscriptionRepository, eventStore: IEventStore, outbox: IOutbox, private readonly uow: IUnitOfWork) {
    super(repo, eventStore, outbox);
  }
  async handle(command: CancelSubscriptionCommand): Promise<void> {
    return this.uow.execute(async () => {
      const sub = await this.load(command);
      sub.cancel(command.reason, command.actorId, intent(command, command.reason));
      await this.save(sub, command);
    });
  }
}

export class ArchiveSubscriptionHandler extends BaseHandler implements ICommandHandler<ArchiveSubscriptionCommand, void> {
  constructor(repo: ISubscriptionRepository, eventStore: IEventStore, outbox: IOutbox, private readonly uow: IUnitOfWork) {
    super(repo, eventStore, outbox);
  }
  async handle(command: ArchiveSubscriptionCommand): Promise<void> {
    return this.uow.execute(async () => {
      const sub = await this.load(command);
      sub.archive(command.reason, intent(command, command.reason));
      await this.save(sub, command);
    });
  }
}

export class RenewSubscriptionHandler extends BaseHandler implements ICommandHandler<RenewSubscriptionCommand, void> {
  constructor(repo: ISubscriptionRepository, eventStore: IEventStore, outbox: IOutbox, private readonly uow: IUnitOfWork) {
    super(repo, eventStore, outbox);
  }
  async handle(command: RenewSubscriptionCommand): Promise<void> {
    return this.uow.execute(async () => {
      const sub = await this.load(command);
      sub.renew('old-contract-end', 'new-contract-start', `${command.newTermMonths} months`, intent(command, 'Renewal'));
      await this.save(sub, command);
    });
  }
}

export class TransferSubscriptionHandler extends BaseHandler implements ICommandHandler<TransferSubscriptionCommand, void> {
  constructor(repo: ISubscriptionRepository, eventStore: IEventStore, outbox: IOutbox, private readonly uow: IUnitOfWork) {
    super(repo, eventStore, outbox);
  }
  async handle(command: TransferSubscriptionCommand): Promise<void> {
    return this.uow.execute(async () => {
      const sub = await this.load(command);
      sub.transfer(command.newLocationId ?? '', intent(command, 'Transfer'));
      await this.save(sub, command);
    });
  }
}

export class MigratePlanHandler extends BaseHandler implements ICommandHandler<MigratePlanCommand, void> {
  constructor(repo: ISubscriptionRepository, eventStore: IEventStore, outbox: IOutbox, private readonly uow: IUnitOfWork) {
    super(repo, eventStore, outbox);
  }
  async handle(command: MigratePlanCommand): Promise<void> {
    return this.uow.execute(async () => {
      const sub = await this.load(command);
      sub.migratePlan(command.newPlanId, new Date().toISOString(), intent(command, 'Plan migration'));
      await this.save(sub, command);
    });
  }
}

export class AddCapabilityHandler extends BaseHandler implements ICommandHandler<AddCapabilityCommand, void> {
  constructor(repo: ISubscriptionRepository, eventStore: IEventStore, outbox: IOutbox, private readonly uow: IUnitOfWork) {
    super(repo, eventStore, outbox);
  }
  async handle(command: AddCapabilityCommand): Promise<void> {
    return this.uow.execute(async () => {
      const sub = await this.load(command);
      sub.attachCapability(command.typeName, command.name, new Money(command.priceAmount, command.priceCurrency), {}, command.idempotencyKey ?? null);
      await this.save(sub, command);
    });
  }
}

export class RemoveCapabilityHandler extends BaseHandler implements ICommandHandler<RemoveCapabilityCommand, void> {
  constructor(repo: ISubscriptionRepository, eventStore: IEventStore, outbox: IOutbox, private readonly uow: IUnitOfWork) {
    super(repo, eventStore, outbox);
  }
  async handle(command: RemoveCapabilityCommand): Promise<void> {
    return this.uow.execute(async () => {
      const sub = await this.load(command);
      sub.removeCapability(command.capabilityId, command.idempotencyKey ?? null);
      await this.save(sub, command);
    });
  }
}

export class AddEquipmentHandler extends BaseHandler implements ICommandHandler<AddEquipmentCommand, void> {
  constructor(repo: ISubscriptionRepository, eventStore: IEventStore, outbox: IOutbox, private readonly uow: IUnitOfWork) {
    super(repo, eventStore, outbox);
  }
  async handle(command: AddEquipmentCommand): Promise<void> {
    return this.uow.execute(async () => {
      const sub = await this.load(command);
      sub.addEquipment(command.equipmentType, command.serialNumber, command.model, command.brand, null, command.idempotencyKey ?? null);
      await this.save(sub, command);
    });
  }
}

export class RemoveEquipmentHandler extends BaseHandler implements ICommandHandler<RemoveEquipmentCommand, void> {
  constructor(repo: ISubscriptionRepository, eventStore: IEventStore, outbox: IOutbox, private readonly uow: IUnitOfWork) {
    super(repo, eventStore, outbox);
  }
  async handle(command: RemoveEquipmentCommand): Promise<void> {
    return this.uow.execute(async () => {
      const sub = await this.load(command);
      sub.removeEquipment(command.equipmentId, command.idempotencyKey ?? null);
      await this.save(sub, command);
    });
  }
}
