import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { KernelModule, TenantMiddleware, SecurityMiddleware } from '@referix/kernel';

@Module({
  imports: [KernelModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(TenantMiddleware, SecurityMiddleware)
      .forRoutes('*');
  }
}
