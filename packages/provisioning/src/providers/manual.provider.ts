import { IProvisioningProvider, ProvisionCommand, ProvisionResult, ActivationResult, CommandResult, ConnectivityTarget, ConnectivityResult } from '../application/services/provisioning-provider.interface';

export class ManualProvisioningProvider implements IProvisioningProvider {
  readonly name = 'manual';

  async provision(request: ProvisionCommand): Promise<ProvisionResult> {
    return {
      success: true,
      provider: 'manual',
      assignedIp: `10.0.0.${Math.floor(Math.random() * 254) + 1}`,
      vlanId: request.vlanId ?? 100,
      pppoeUser: `${request.subscriptionId}@referix`,
    };
  }

  async activate(subscriptionId: string, tenantId: string): Promise<ActivationResult> {
    return { success: true, activatedAt: new Date() };
  }

  async suspend(subscriptionId: string, tenantId: string): Promise<CommandResult> {
    return { success: true };
  }

  async reactivate(subscriptionId: string, tenantId: string): Promise<CommandResult> {
    return { success: true };
  }

  async cancel(subscriptionId: string, tenantId: string): Promise<CommandResult> {
    return { success: true };
  }

  async changePlan(subscriptionId: string, tenantId: string, newPlanId: string): Promise<CommandResult> {
    return { success: true };
  }

  async validateConnectivity(target: ConnectivityTarget): Promise<ConnectivityResult> {
    return {
      reachable: true,
      pingMs: 5,
      dhcpLeaseObtained: true,
      pppSessionActive: true,
    };
  }
}
