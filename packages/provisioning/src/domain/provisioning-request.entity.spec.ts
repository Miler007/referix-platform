import { ProvisioningRequest } from './provisioning-request.entity';
import { ProvisioningStatus, StepStatus } from './value-objects';

describe('ProvisioningRequest', () => {
  it('should create in PENDING status with 5 steps', () => {
    const req = new ProvisioningRequest('t-1', 'sub-1', 'manual', 100);
    expect(req.status).toBe(ProvisioningStatus.PENDING);
    expect(req.steps).toHaveLength(5);
    expect(req.steps[0].name).toBe('provisioning');
  });

  it('should execute a step successfully', () => {
    const req = new ProvisioningRequest('t-1', 'sub-1');
    req.startStep('provisioning');
    expect(req.steps[0].status).toBe(StepStatus.RUNNING);
    req.passStep('provisioning', 'OK');
    expect(req.steps[0].status).toBe(StepStatus.PASSED);
  });

  it('should fail a step', () => {
    const req = new ProvisioningRequest('t-1', 'sub-1');
    req.startStep('provisioning');
    req.failStep('provisioning', 'OLT not responding');
    expect(req.steps[0].status).toBe(StepStatus.FAILED);
    expect(req.errorMessage).toBe('OLT not responding');
  });

  it('should require previous step to pass', () => {
    const req = new ProvisioningRequest('t-1', 'sub-1');
    expect(() => req.startStep('connectivity_test')).toThrow();
  });

  it('should generate certificate on completion', () => {
    const req = new ProvisioningRequest('t-1', 'sub-1');
    req.startStep('provisioning'); req.passStep('provisioning', 'OK');
    req.startStep('connectivity_test'); req.passStep('connectivity_test', 'OK');
    req.startStep('speed_test'); req.passStep('speed_test', 'OK');
    req.startStep('activation'); req.passStep('activation', 'OK');
    req.startStep('welcome_notification'); req.passStep('welcome_notification', 'OK');

    req.complete({
      activatedAt: new Date(), activatedBy: 'pipeline', provisioningProvider: 'manual',
      validatedSpeed: 100, opticalPower: null, assignedIp: null, equipment: null, profileVersion: null,
    });
    expect(req.status).toBe(ProvisioningStatus.ACTIVE);
    expect(req.certificate).not.toBeNull();
    expect(req.certificate!.validatedSpeed).toBe(100);
  });

  it('should support rollback', () => {
    const req = new ProvisioningRequest('t-1', 'sub-1');
    req.startStep('provisioning'); req.passStep('provisioning', 'OK');
    req.startStep('connectivity_test'); req.passStep('connectivity_test', 'OK');

    const toRollback = req.getStepsToRollback();
    expect(toRollback.length).toBeGreaterThan(0);

    req.startRollback();
    expect(req.status).toBe(ProvisioningStatus.ROLLING_BACK);
    req.completeRollback();
    expect(req.status).toBe(ProvisioningStatus.ROLLED_BACK);
  });

  it('should fail when error occurs', () => {
    const req = new ProvisioningRequest('t-1', 'sub-1');
    req.fail('Provider unavailable');
    expect(req.status).toBe(ProvisioningStatus.FAILED);
    expect(req.completedAt).not.toBeNull();
  });
});
