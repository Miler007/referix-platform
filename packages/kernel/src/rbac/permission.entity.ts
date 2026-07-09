import { v4 as uuid } from 'uuid';

export class Permission {
  readonly id: string;
  constructor(
    public readonly key: string,
    public readonly module: string,
    public readonly action: 'CREATE' | 'READ' | 'UPDATE' | 'DELETE' | 'APPROVE',
    public readonly description: string,
  ) { this.id = uuid(); }
}

export class Role {
  readonly id: string;
  readonly isSystem: boolean;
  public permissions: string[];

  constructor(
    public readonly tenantId: string,
    public readonly name: string,
    permissions: string[],
    isSystem: boolean = false,
  ) {
    this.id = uuid();
    this.isSystem = isSystem;
    this.permissions = permissions;
  }

  addPermission(permissionKey: string): void {
    if (!this.permissions.includes(permissionKey)) this.permissions.push(permissionKey);
  }

  removePermission(permissionKey: string): void {
    this.permissions = this.permissions.filter(p => p !== permissionKey);
  }
}

// Default permissions for MVP roles
export const SYSTEM_PERMISSIONS: Record<string, string[]> = {
  referrals_create: 'Create new referrals',
  referrals_read: 'View referrals',
  referrals_approve: 'Approve referrals',
  referrals_cancel: 'Cancel referrals',
  installations_read: 'View installations',
  installations_start: 'Start installation',
  installations_complete: 'Complete installation',
  installations_assign: 'Assign technicians',
  commissions_read: 'View commissions',
  commissions_release: 'Release commissions',
  payouts_read: 'View payouts',
  payouts_process: 'Process payouts',
  users_manage: 'Manage users',
  config_edit: 'Edit configuration',
  reports_view: 'View reports',
  audit_view: 'View audit log',
};

export const DEFAULT_ROLES: Record<string, string[]> = {
  ADMIN: ['referrals_create', 'referrals_read', 'referrals_approve', 'referrals_cancel',
    'installations_read', 'installations_assign', 'installations_start', 'installations_complete',
    'commissions_read', 'commissions_release', 'payouts_read', 'payouts_process',
    'users_manage', 'config_edit', 'reports_view', 'audit_view'],
  SUPERVISOR: ['referrals_create', 'referrals_read', 'referrals_approve', 'referrals_cancel',
    'installations_read', 'installations_assign', 'commissions_read',
    'payouts_read', 'reports_view'],
  TECHNICIAN: ['installations_read', 'installations_start', 'installations_complete'],
  REFERIDOR: ['referrals_create', 'referrals_read', 'commissions_read', 'payouts_read'],
};
