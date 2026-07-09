import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { TenantModule } from './tenants/tenant.module';
import { RbacModule } from './rbac/rbac.module';
import { AuditModule } from './audit/audit.module';
import { ConfigModule } from './config/config.module';
import { FeatureFlagsModule } from './flags/feature-flags.module';
import { ObservabilityModule } from './observability/observability.module';
import { SecurityModule } from './security/security.module';
import { DatabaseModule } from './database/database.module';
import { CacheModule } from './cache/cache.module';
import { EventBusModule } from './events/event-bus.module';

@Module({
  imports: [
    AuthModule,
    TenantModule,
    RbacModule,
    AuditModule,
    ConfigModule,
    FeatureFlagsModule,
    ObservabilityModule,
    SecurityModule,
    DatabaseModule,
    CacheModule,
    EventBusModule,
  ],
  exports: [
    AuthModule,
    TenantModule,
    RbacModule,
    AuditModule,
    ConfigModule,
    FeatureFlagsModule,
    ObservabilityModule,
    SecurityModule,
    DatabaseModule,
    CacheModule,
    EventBusModule,
  ],
})
export class KernelModule {}
