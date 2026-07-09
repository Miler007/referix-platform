export interface ProvisionCommand {
  subscriptionId: string;
  tenantId: string;
  speed: number;
  vlanId?: number;
  ipAddress?: string;
  ontSerial?: string;
  extraParams?: Record<string, unknown>;
}

export interface ProvisionResult {
  success: boolean;
  provider: string;
  assignedIp?: string;
  vlanId?: number;
  pppoeUser?: string;
  errorMessage?: string;
  rawResponse?: Record<string, unknown>;
}

export interface ActivationResult {
  success: boolean;
  activatedAt: Date;
  errorMessage?: string;
}

export interface CommandResult {
  success: boolean;
  errorMessage?: string;
}

export interface ConnectivityTarget {
  ipAddress: string;
  expectedPingMs?: number;
}

export interface ConnectivityResult {
  reachable: boolean;
  pingMs: number | null;
  dhcpLeaseObtained: boolean;
  pppSessionActive: boolean | null;
}

export interface IProvisioningProvider {
  readonly name: string;
  provision(request: ProvisionCommand): Promise<ProvisionResult>;
  activate(subscriptionId: string, tenantId: string): Promise<ActivationResult>;
  suspend(subscriptionId: string, tenantId: string): Promise<CommandResult>;
  reactivate(subscriptionId: string, tenantId: string): Promise<CommandResult>;
  cancel(subscriptionId: string, tenantId: string): Promise<CommandResult>;
  changePlan(subscriptionId: string, tenantId: string, newPlanId: string): Promise<CommandResult>;
  validateConnectivity(target: ConnectivityTarget): Promise<ConnectivityResult>;
}
