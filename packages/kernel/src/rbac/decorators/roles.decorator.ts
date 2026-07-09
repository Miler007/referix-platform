import { SetMetadata } from '@nestjs/common';
import { RoleKey } from '../rbac.service';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: RoleKey[]) => SetMetadata(ROLES_KEY, roles);
