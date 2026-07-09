// Domain
export { Subscription } from './domain/subscription.entity';
export type { CreateSubscriptionProps } from './domain/subscription.entity';
export {
  SubscriptionStatus,
  SubscriptionHealth,
  CapabilityStatus,
  EquipmentStatus,
  // Rich types
  SubscriptionId, PersonId, PlanId, ServiceId, LocationId, TenantId, ContractId,
  CapabilityType, CapabilityId, EquipmentId, MilestoneId, StepId,
  // Value objects
  Money, PublicId, CapabilityAttachment, EquipmentItem, BusinessMilestone, ProcessStep,
  SlaConfig, TransitionContext, DecisionRecord, AggregateCommit,
  ALLOWED_TRANSITIONS, ConcurrencyConflictError, DuplicateIdempotencyKeyError,
  // Intent Objects
  CommandIntent, ActivateCommand, SuspendCommand, CancelCommand,
  TransferCommand, MigratePlanCommand, RenewCommand,
} from './domain/value-objects';
export type { SuspensionReason, CancellationReason, EquipmentType, CommandChannel, CommandSource } from './domain/value-objects';

// Events
export {
  SubscriptionCreated,
  SubscriptionValidated,
  CoverageConfirmed,
  DocumentsSubmitted,
  SubscriptionApproved,
  SubscriptionRejected,
  InstallationScheduled,
  InstallationStarted,
  InstallationCompleted,
  SubscriptionActivated,
  SubscriptionSuspended,
  SubscriptionReactivated,
  SubscriptionCancelled,
  SubscriptionArchived,
  PlanChanged,
  SubscriptionTransferred,
  SubscriptionRenewed,
  SubscriptionMigrating,
  StatusChanged,
  CapabilityAttached,
  CapabilitySuspended,
  CapabilityRemoved,
  EquipmentAdded,
  EquipmentReplaced,
  EquipmentRemoved,
  HealthChanged,
  MilestoneAchieved,
  ProcessStepRecorded,
} from './domain/events';
export type { DomainEvent } from './domain/events';

// Specifications
export {
  Specification,
  SpecificationResult,
  NotDeletedSpecification,
  ActiveStatusForCapabilitiesSpecification,
  ValidTransitionSpecification,
  TerminalTransitionRequiresReasonSpecification,
  UniqueCapabilityTypeSpecification,
  ExistsByIdSpecification,
  NotDeletedByIdSpecification,
} from './domain/specifications';

// Domain Services
export type {
  HealthCalculationContext,
  DuplicateCandidate,
  CapabilityEvaluation,
  ISubscriptionHealthCalculator,
  ISubscriptionDuplicateDetector,
  ICapabilityEvaluator,
} from './domain/domain-services';

// Contracts
export { ISubscriptionRepository, IPolicyEngine, SUBSCRIPTION_REPOSITORY, POLICY_ENGINE } from './domain/repository.interface';
export type { SubscriptionSearchCriteria, PaginatedResult, PolicyContext, PolicyResult } from './domain/repository.interface';
