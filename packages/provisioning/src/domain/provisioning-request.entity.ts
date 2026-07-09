import { v4 as uuid } from 'uuid';
import { ProvisioningStatus, StepStatus, ActivationStepDef, ActivationCertificateData } from './value-objects';

export class ProvisioningRequest {
  private readonly _id: string;
  private _status: ProvisioningStatus;
  private _steps: ActivationStepDef[] = [];
  private _certificate: ActivationCertificateData | null = null;
  private _errorMessage: string | null = null;
  private _currentStepIndex: number = -1;
  private _createdAt: Date;
  private _completedAt: Date | null = null;

  constructor(
    public readonly tenantId: string,
    public readonly subscriptionId: string,
    public readonly provider: string = 'manual',
    public readonly requiredSpeed: number = 100,
    id?: string,
  ) {
    this._id = id ?? uuid();
    this._status = ProvisioningStatus.PENDING;
    this._createdAt = new Date();
    this.initializeSteps();
  }

  get id(): string { return this._id; }
  get status(): ProvisioningStatus { return this._status; }
  get steps(): readonly ActivationStepDef[] { return this._steps; }
  get certificate(): ActivationCertificateData | null { return this._certificate; }
  get errorMessage(): string | null { return this._errorMessage; }
  get currentStep(): string | null { return this._currentStepIndex >= 0 ? this._steps[this._currentStepIndex]?.name ?? null : null; }
  get createdAt(): Date { return this._createdAt; }
  get completedAt(): Date | null { return this._completedAt; }

  private initializeSteps(): void {
    this._steps = [
      { name: 'provisioning', status: StepStatus.PENDING, startedAt: null, completedAt: null, result: null, rollbackAction: 'remove_config' },
      { name: 'connectivity_test', status: StepStatus.PENDING, startedAt: null, completedAt: null, result: null, rollbackAction: null },
      { name: 'speed_test', status: StepStatus.PENDING, startedAt: null, completedAt: null, result: null, rollbackAction: null },
      { name: 'activation', status: StepStatus.PENDING, startedAt: null, completedAt: null, result: null, rollbackAction: 'deactivate' },
      { name: 'welcome_notification', status: StepStatus.PENDING, startedAt: null, completedAt: null, result: null, rollbackAction: null },
    ];
  }

  startStep(stepName: string): void {
    const idx = this._steps.findIndex(s => s.name === stepName);
    if (idx === -1) throw new Error(`Unknown step: ${stepName}`);

    if (idx > 0 && this._steps[idx - 1]!.status !== StepStatus.PASSED) {
      throw new Error(`Previous step ${this._steps[idx - 1]!.name} must be PASSED before ${stepName}`);
    }

    this._currentStepIndex = idx;
    this._steps[idx] = { ...this._steps[idx]!, status: StepStatus.RUNNING, startedAt: new Date() };
  }

  passStep(stepName: string, result: string): void {
    const idx = this._steps.findIndex(s => s.name === stepName);
    if (idx === -1) throw new Error(`Unknown step: ${stepName}`);
    this._steps[idx] = { ...this._steps[idx]!, status: StepStatus.PASSED, completedAt: new Date(), result };
  }

  failStep(stepName: string, error: string): void {
    const idx = this._steps.findIndex(s => s.name === stepName);
    if (idx === -1) throw new Error(`Unknown step: ${stepName}`);
    this._steps[idx] = { ...this._steps[idx]!, status: StepStatus.FAILED, completedAt: new Date(), result: error };
    this._errorMessage = error;
  }

  complete(certificate: ActivationCertificateData): void {
    this._certificate = certificate;
    this._status = ProvisioningStatus.ACTIVE;
    this._completedAt = new Date();
  }

  fail(error: string): void {
    this._errorMessage = error;
    this._status = ProvisioningStatus.FAILED;
    this._completedAt = new Date();
  }

  startRollback(): void {
    this._status = ProvisioningStatus.ROLLING_BACK;
  }

  completeRollback(): void {
    this._status = ProvisioningStatus.ROLLED_BACK;
    this._completedAt = new Date();
  }

  getStepsToRollback(): ActivationStepDef[] {
    return this._steps.filter(s => s.status === StepStatus.PASSED && s.rollbackAction !== null).reverse();
  }
}
