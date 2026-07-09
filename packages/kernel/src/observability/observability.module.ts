import { Module, Global } from '@nestjs/common';
import { LoggerService } from './logger.service';
import { CorrelationService } from './correlation.service';
import { HealthController } from './health.controller';

@Global()
@Module({
  controllers: [HealthController],
  providers: [LoggerService, CorrelationService],
  exports: [LoggerService, CorrelationService],
})
export class ObservabilityModule {}
