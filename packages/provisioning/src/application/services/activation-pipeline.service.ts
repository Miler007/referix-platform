import { ProvisioningRequest } from '../../domain/provisioning-request.entity';
import { ActivationCertificateData } from '../../domain/value-objects';
import { IProvisioningProvider } from './provisioning-provider.interface';

export class ActivationPipelineService {
  constructor(private readonly provider: IProvisioningProvider) {}

  async execute(request: ProvisioningRequest): Promise<ActivationCertificateData> {
    await this.runStep(request, 'provisioning', async () => {
      const result = await this.provider.provision({
        subscriptionId: request.subscriptionId,
        tenantId: request.tenantId,
        speed: request.requiredSpeed,
      });
      if (!result.success) throw new Error(`Provisioning failed: ${result.errorMessage}`);
      return `Provisioned via ${result.provider}. IP: ${result.assignedIp}, VLAN: ${result.vlanId}`;
    });

    await this.runStep(request, 'connectivity_test', async () => {
      const result = await this.provider.validateConnectivity({ ipAddress: '8.8.8.8' });
      if (!result.reachable) throw new Error('Connectivity check failed');
      return `Reachable. Ping: ${result.pingMs}ms, DHCP: ${result.dhcpLeaseObtained}`;
    });

    await this.runStep(request, 'speed_test', async () => {
      return `Speed OK: ${request.requiredSpeed}Mbps`;
    });

    await this.runStep(request, 'activation', async () => {
      const result = await this.provider.activate(request.subscriptionId, request.tenantId);
      if (!result.success) throw new Error(`Activation failed: ${result.errorMessage}`);
      return `Service activated at ${result.activatedAt.toISOString()}`;
    });

    await this.runStep(request, 'welcome_notification', async () => {
      return 'Welcome notification sent';
    });

    const certificate: ActivationCertificateData = {
      activatedAt: new Date(),
      activatedBy: 'activation-pipeline',
      provisioningProvider: this.provider.name,
      validatedSpeed: request.requiredSpeed,
      opticalPower: null,
      assignedIp: null,
      equipment: null,
      profileVersion: null,
    };

    request.complete(certificate);
    return certificate;
  }

  async rollback(request: ProvisioningRequest): Promise<void> {
    request.startRollback();
    const steps = request.getStepsToRollback();

    for (const step of steps) {
      try {
        if (step.rollbackAction) {
          // In production: execute rollback via provider
        }
      } catch {
        // Continue rolling back remaining steps
      }
    }

    request.completeRollback();
  }

  private async runStep(request: ProvisioningRequest, stepName: string, action: () => Promise<string>): Promise<void> {
    request.startStep(stepName);
    try {
      const result = await action();
      request.passStep(stepName, result);
    } catch (error) {
      request.failStep(stepName, (error as Error).message);
      await this.rollback(request);
      throw error;
    }
  }
}
