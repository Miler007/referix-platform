import { CommissionPolicy } from '../../domain/commission-policy.entity';
import { Commission } from '../../domain/commission.entity';
import { ICommissionPolicyRepository } from '../../domain/repository.interface';

export interface CommissionRequest {
  tenantId: string;
  referralId: string;
  subscriptionId: string;
  municipality: string;
  planId: string;
  invoiceAmount: number;
}

export interface CommissionResult {
  commission: Commission;
  policyApplied: string;
  explanation: string[];
}

export class CommissionPolicyEngine {
  constructor(private readonly policyRepo: ICommissionPolicyRepository) {}

  async calculate(request: CommissionRequest): Promise<CommissionResult> {
    const policies = await this.policyRepo.findAllActive(request.tenantId);
    policies.sort((a, b) => b.priority - a.priority);

    for (const policy of policies) {
      if (policy.matches(request.municipality, request.planId, request.invoiceAmount)) {
        const { baseAmount, explanation } = policy.calculate(request.invoiceAmount);
        const explanations = [explanation, `Policy: ${policy.name}`, `Municipality: ${request.municipality}`, `Plan: ${request.planId}`];

        const commission = new Commission(
          request.tenantId, request.referralId, request.subscriptionId,
          policy.id, baseAmount, baseAmount, explanations,
        );

        if (policy.holdingPeriodDays > 0) {
          const heldUntil = new Date(Date.now() + policy.holdingPeriodDays * 86400000);
          commission.hold(heldUntil);
          explanations.push(`Holding period: ${policy.holdingPeriodDays} days (until ${heldUntil.toISOString().split('T')[0]})`);
        }

        return { commission, policyApplied: policy.name, explanation: explanations };
      }
    }

    throw new Error('No matching commission policy found');
  }
}
