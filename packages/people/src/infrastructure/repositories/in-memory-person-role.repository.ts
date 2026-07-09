import { PersonRole } from '../../domain/person-role.entity';
import { PersonRoleStatus, RoleType } from '../../domain/value-objects';
import { IPersonRoleRepository } from '../../domain/person-role.repository.interface';

export class InMemoryPersonRoleRepository implements IPersonRoleRepository {
  private store = new Map<string, PersonRole>();

  private key(tenantId: string, id: string): string {
    return `${tenantId}:${id}`;
  }

  async save(role: PersonRole): Promise<void> {
    this.store.set(this.key(role.tenantId, role.id), role);
  }

  async findById(tenantId: string, roleId: string): Promise<PersonRole | null> {
    return this.store.get(this.key(tenantId, roleId)) ?? null;
  }

  async findByPersonId(tenantId: string, personId: string): Promise<PersonRole[]> {
    return Array.from(this.store.values()).filter(r => r.tenantId === tenantId && r.personId === personId);
  }

  async findByPersonAndType(tenantId: string, personId: string, roleType: RoleType): Promise<PersonRole | null> {
    return Array.from(this.store.values()).find(r => r.tenantId === tenantId && r.personId === personId && r.roleType === roleType) ?? null;
  }

  async findByStatus(tenantId: string, status: PersonRoleStatus, roleType?: RoleType): Promise<PersonRole[]> {
    return Array.from(this.store.values()).filter(r => {
      if (r.tenantId !== tenantId) return false;
      if (r.status !== status) return false;
      if (roleType && r.roleType !== roleType) return false;
      return true;
    });
  }
}
