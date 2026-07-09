import { Module, Global } from '@nestjs/common';
import { SecurityMiddleware } from './security.middleware';

@Global()
@Module({
  providers: [SecurityMiddleware],
  exports: [SecurityMiddleware],
})
export class SecurityModule {}
