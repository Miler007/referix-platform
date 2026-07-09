export { KernelModule } from './kernel.module';

// Auth
export { AuthModule } from './auth/auth.module';
export { AuthService } from './auth/auth.service';
export { TokenService } from './auth/token.service';
export { PasswordService } from './auth/password.service';

// Tenants
export { TenantModule } from './tenants/tenant.module';
export { TenantService } from './tenants/tenant.service';
export { TenantMiddleware } from './tenants/tenant.middleware';

// RBAC
export { RbacModule } from './rbac/rbac.module';
export { RbacService, ROLES } from './rbac/rbac.service';
export type { RoleKey } from './rbac/rbac.service';
export { PermissionGuard } from './rbac/guards/permission.guard';
export { RoleGuard } from './rbac/guards/role.guard';
export { RequirePermissions } from './rbac/decorators/permissions.decorator';
export { Roles } from './rbac/decorators/roles.decorator';

// Audit
export { AuditModule } from './audit/audit.module';
export { AuditService } from './audit/audit.service';
export type { AuditLogOptions } from './audit/audit.service';
export { AuditLog } from './audit/decorators/audit-log.decorator';

// Config
export { ConfigModule } from './config/config.module';
export { ConfigService } from './config/config.service';

// Feature Flags
export { FeatureFlagsModule } from './flags/feature-flags.module';
export { FeatureFlagsService, FEATURE_FLAGS } from './flags/feature-flags.service';
export type { FeatureFlag } from './flags/feature-flags.service';

// Observability
export { ObservabilityModule } from './observability/observability.module';
export { LoggerService } from './observability/logger.service';
export { CorrelationService } from './observability/correlation.service';
export { HealthController } from './observability/health.controller';

// Security
export { SecurityModule } from './security/security.module';
export { SecurityMiddleware } from './security/security.middleware';

// Database
export { DatabaseModule } from './database/database.module';
export { PrismaService } from './database/prisma.service';

// Cache
export { CacheModule } from './cache/cache.module';
export { CacheService } from './cache/cache.service';

// Events
export { EventBusModule } from './events/event-bus.module';
export { EventBusService } from './events/event-bus.service';

// Core types
export type {
  TenantContext,
  AuthenticatedUser,
  AuditEntry,
  DomainEvent,
  HealthStatus,
  PaginatedResult,
} from './kernel-core.interface';
