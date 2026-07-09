export enum ProvisioningStatus {
  PENDING = 'PENDING',
  PROVISIONING = 'PROVISIONING',
  CONNECTIVITY_CHECK = 'CONNECTIVITY_CHECK',
  SPEED_TEST = 'SPEED_TEST',
  ACTIVATING = 'ACTIVATING',
  ACTIVE = 'ACTIVE',
  FAILED = 'FAILED',
  ROLLING_BACK = 'ROLLING_BACK',
  ROLLED_BACK = 'ROLLED_BACK',
}

export enum StepStatus {
  PENDING = 'PENDING',
  RUNNING = 'RUNNING',
  PASSED = 'PASSED',
  FAILED = 'FAILED',
  SKIPPED = 'SKIPPED',
}

export interface ActivationStepDef {
  name: string;
  status: StepStatus;
  startedAt: Date | null;
  completedAt: Date | null;
  result: string | null;
  rollbackAction: string | null;
}

export interface ActivationCertificateData {
  activatedAt: Date;
  activatedBy: string;
  provisioningProvider: string;
  validatedSpeed: number;
  opticalPower: number | null;
  assignedIp: string | null;
  equipment: string | null;
  profileVersion: string | null;
}
