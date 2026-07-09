import { PersonRole } from './person-role.entity';
import { PersonRoleStatus, RoleType } from './value-objects';

export const PERSON_ROLE_REPOSITORY = 'PERSON_ROLE_REPOSITORY';

export interface IPersonRoleRepository {
  save(role: PersonRole): Promise<void>;
  findById(tenantId: string, roleId: string): Promise<PersonRole | null>;
  findByPersonId(tenantId: string, personId: string): Promise<PersonRole[]>;
  findByPersonAndType(tenantId: string, personId: string, roleType: RoleType): Promise<PersonRole | null>;
  findByStatus(tenantId: string, status: PersonRoleStatus, roleType?: RoleType): Promise<PersonRole[]>;
}
