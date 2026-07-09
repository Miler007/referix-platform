import { Injectable } from '@nestjs/common';

export const ROLES = {
  SUPER_ADMIN: { level: 100, name: 'Super Admin' },
  TENANT_ADMIN: { level: 80, name: 'Tenant Admin' },
  MANAGER: { level: 60, name: 'Manager' },
  SUPERVISOR: { level: 40, name: 'Supervisor' },
  SELLER: { level: 20, name: 'Seller' },
  TECHNICIAN: { level: 15, name: 'Technician' },
  ACCOUNTANT: { level: 25, name: 'Accountant' },
} as const;

export type RoleKey = keyof typeof ROLES;

@Injectable()
export class RbacService {
  private readonly rolePermissions: Map<RoleKey, Set<string>> = new Map();

  constructor() {
    this.initializeDefaults();
  }

  private initializeDefaults(): void {
    this.assign('SUPER_ADMIN', ['*']);
    this.assign('TENANT_ADMIN', [
      'tenant:read', 'tenant:write', 'tenant:config',
      'user:read', 'user:write', 'user:invite',
      'role:read', 'role:write',
      'report:read', 'report:export',
      'audit:read',
      'feature:read', 'feature:write',
      'plan:read', 'plan:write',
      'commission:read', 'commission:write', 'commission:approve',
    ]);
    this.assign('MANAGER', [
      'user:read', 'user:write',
      'report:read', 'report:export',
      'sale:read', 'sale:write', 'sale:approve',
      'commission:read', 'commission:approve',
      'plan:read',
      'client:read', 'client:write',
    ]);
    this.assign('SUPERVISOR', [
      'user:read',
      'sale:read', 'sale:write', 'sale:approve',
      'commission:read',
      'client:read',
      'report:read',
    ]);
    this.assign('SELLER', [
      'sale:read', 'sale:write',
      'client:read', 'client:write',
      'commission:read',
      'referral:read', 'referral:write',
    ]);
    this.assign('TECHNICIAN', [
      'installation:read', 'installation:write',
      'client:read',
    ]);
    this.assign('ACCOUNTANT', [
      'billing:read', 'billing:write',
      'payment:read', 'payment:write',
      'commission:read',
      'report:read', 'report:export',
    ]);
  }

  private assign(role: RoleKey, permissions: string[]): void {
    this.rolePermissions.set(role, new Set(permissions));
  }

  hasPermission(role: RoleKey, permission: string): boolean {
    const perms = this.rolePermissions.get(role);
    if (!perms) return false;
    if (perms.has('*')) return true;
    return perms.has(permission);
  }

  hasAnyPermission(role: RoleKey, permissions: string[]): boolean {
    return permissions.some((p) => this.hasPermission(role, p));
  }

  hasAllPermissions(role: RoleKey, permissions: string[]): boolean {
    return permissions.every((p) => this.hasPermission(role, p));
  }

  getRoleLevel(role: RoleKey): number {
    return ROLES[role]?.level ?? 0;
  }

  isAtLeast(role: RoleKey, minimum: RoleKey): boolean {
    return this.getRoleLevel(role) >= this.getRoleLevel(minimum);
  }

  getPermissions(role: RoleKey): string[] {
    return Array.from(this.rolePermissions.get(role) ?? []);
  }
}
