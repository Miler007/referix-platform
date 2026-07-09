import { Module, Global } from '@nestjs/common';
import { RbacService } from './rbac.service';
import { PermissionGuard } from './guards/permission.guard';
import { RoleGuard } from './guards/role.guard';

@Global()
@Module({
  providers: [RbacService, PermissionGuard, RoleGuard],
  exports: [RbacService, PermissionGuard, RoleGuard],
})
export class RbacModule {}
