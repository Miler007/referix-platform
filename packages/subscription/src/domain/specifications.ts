import { Subscription } from './subscription.entity';
import { SubscriptionStatus, ALLOWED_TRANSITIONS } from './value-objects';

export interface Specification<T> {
  isSatisfiedBy(subject: T): SpecificationResult;
}

export class SpecificationResult {
  constructor(
    public readonly isSatisfied: boolean,
    public readonly message: string | null = null,
  ) {}

  static satisfied(): SpecificationResult {
    return new SpecificationResult(true);
  }

  static notSatisfied(message: string): SpecificationResult {
    return new SpecificationResult(false, message);
  }

  and(other: SpecificationResult): SpecificationResult {
    if (this.isSatisfied) return other;
    return this;
  }
}

export class NotDeletedSpecification implements Specification<Subscription> {
  isSatisfiedBy(subject: Subscription): SpecificationResult {
    return subject.isDeleted()
      ? SpecificationResult.notSatisfied('Subscription is deleted')
      : SpecificationResult.satisfied();
  }
}

export class ActiveStatusForCapabilitiesSpecification implements Specification<Subscription> {
  isSatisfiedBy(subject: Subscription): SpecificationResult {
    return subject.status !== SubscriptionStatus.ACTIVE
      ? SpecificationResult.notSatisfied(`Subscription must be ACTIVE. Current: ${subject.status}`)
      : SpecificationResult.satisfied();
  }
}

export class ValidTransitionSpecification implements Specification<{ current: SubscriptionStatus; target: SubscriptionStatus }> {
  isSatisfiedBy(subject: { current: SubscriptionStatus; target: SubscriptionStatus }): SpecificationResult {
    const allowed = ALLOWED_TRANSITIONS[subject.current];
    if (!allowed.includes(subject.target)) {
      return SpecificationResult.notSatisfied(
        `Cannot transition from ${subject.current} to ${subject.target}. Allowed: [${allowed.join(', ')}]`,
      );
    }
    return SpecificationResult.satisfied();
  }
}

export class TerminalTransitionRequiresReasonSpecification implements Specification<{ target: SubscriptionStatus; reason: string }> {
  isSatisfiedBy(subject: { target: SubscriptionStatus; reason: string }): SpecificationResult {
    const needsReason: SubscriptionStatus[] = [SubscriptionStatus.CANCELLED, SubscriptionStatus.ARCHIVED];
    if (needsReason.includes(subject.target) && !subject.reason) {
      return SpecificationResult.notSatisfied(`Transition to ${subject.target} requires a reason`);
    }
    return SpecificationResult.satisfied();
  }
}

export class UniqueCapabilityTypeSpecification implements Specification<{ existing: string[]; newType: string }> {
  isSatisfiedBy(subject: { existing: string[]; newType: string }): SpecificationResult {
    return subject.existing.includes(subject.newType)
      ? SpecificationResult.notSatisfied(`Capability '${subject.newType}' is already attached`)
      : SpecificationResult.satisfied();
  }
}

export class ExistsByIdSpecification implements Specification<{ id: string; collection: { id: string }[]; label: string }> {
  isSatisfiedBy(subject: { id: string; collection: { id: string }[]; label: string }): SpecificationResult {
    const found = subject.collection.some(item => item.id === subject.id);
    return found
      ? SpecificationResult.satisfied()
      : SpecificationResult.notSatisfied(`${subject.label} '${subject.id}' not found`);
  }
}

export class NotDeletedByIdSpecification implements Specification<{ id: string }> {
  constructor(private readonly getDeletedAt: (id: string) => Date | null) {}
  isSatisfiedBy(subject: { id: string }): SpecificationResult {
    const deletedAt = this.getDeletedAt(subject.id);
    return deletedAt
      ? SpecificationResult.notSatisfied(`Entity '${subject.id}' is already deleted`)
      : SpecificationResult.satisfied();
  }
}
