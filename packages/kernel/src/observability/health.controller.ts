import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { HealthStatus } from '../kernel-core.interface';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  @Get()
  @ApiOperation({ summary: 'Basic health check' })
  check(): HealthStatus {
    return {
      status: 'UP',
      checks: {
        server: { status: 'UP' },
      },
      timestamp: new Date().toISOString(),
    };
  }

  @Get('readiness')
  @ApiOperation({ summary: 'Readiness probe' })
  readiness(): HealthStatus {
    return {
      status: 'UP',
      checks: {
        server: { status: 'UP' },
        database: { status: 'UP' },
        cache: { status: 'UP' },
      },
      timestamp: new Date().toISOString(),
    };
  }

  @Get('liveness')
  @ApiOperation({ summary: 'Liveness probe' })
  liveness(): HealthStatus {
    return {
      status: 'UP',
      checks: {
        server: { status: 'UP' },
      },
      timestamp: new Date().toISOString(),
    };
  }
}
