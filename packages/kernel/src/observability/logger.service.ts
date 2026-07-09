import { Injectable } from '@nestjs/common';
import { CorrelationService } from './correlation.service';

export interface LogEntry {
  level: string;
  message: string;
  correlationId?: string;
  tenantId?: string;
  userId?: string;
  module?: string;
  [key: string]: unknown;
}

@Injectable()
export class LoggerService {
  constructor(private readonly correlationService: CorrelationService) {}

  private log(level: string, message: string, meta?: Record<string, unknown>): void {
    const entry: LogEntry = {
      level,
      message,
      correlationId: this.correlationService.getCurrent(),
      ...meta,
      timestamp: new Date().toISOString(),
    };

    const output = JSON.stringify(entry);
    switch (level) {
      case 'error': console.error(output); break;
      case 'warn': console.warn(output); break;
      case 'debug': console.debug(output); break;
      default: console.log(output);
    }
  }

  info(message: string, meta?: Record<string, unknown>): void { this.log('info', message, meta); }
  error(message: string, meta?: Record<string, unknown>): void { this.log('error', message, meta); }
  warn(message: string, meta?: Record<string, unknown>): void { this.log('warn', message, meta); }
  debug(message: string, meta?: Record<string, unknown>): void { this.log('debug', message, meta); }
}
