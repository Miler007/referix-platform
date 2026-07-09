import { RbacService } from './rbac.service';

describe('RbacService', () => {
  let service: RbacService;

  beforeEach(() => {
    service = new RbacService();
  });

  it('should grant super admin all permissions', () => {
    expect(service.hasPermission('SUPER_ADMIN', 'anything')).toBe(true);
    expect(service.hasPermission('SUPER_ADMIN', '*')).toBe(true);
  });

  it('should grant tenant admin expected permissions', () => {
    expect(service.hasPermission('TENANT_ADMIN', 'tenant:read')).toBe(true);
    expect(service.hasPermission('TENANT_ADMIN', 'user:write')).toBe(true);
  });

  it('should deny seller admin permissions', () => {
    expect(service.hasPermission('SELLER', 'tenant:write')).toBe(false);
    expect(service.hasPermission('SELLER', 'audit:read')).toBe(false);
  });

  it('should grant seller sales permissions', () => {
    expect(service.hasPermission('SELLER', 'sale:read')).toBe(true);
    expect(service.hasPermission('SELLER', 'sale:write')).toBe(true);
  });

  it('should check role hierarchy', () => {
    expect(service.isAtLeast('SUPER_ADMIN', 'SELLER')).toBe(true);
    expect(service.isAtLeast('SELLER', 'SUPER_ADMIN')).toBe(false);
    expect(service.isAtLeast('MANAGER', 'SUPERVISOR')).toBe(true);
  });

  it('should return permissions for role', () => {
    const perms = service.getPermissions('ACCOUNTANT');
    expect(perms).toContain('billing:read');
    expect(perms).toContain('report:export');
  });
});
