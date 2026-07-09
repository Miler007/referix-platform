export interface LogEntry {
  level: 'DEBUG' | 'INFO' | 'WARN' | 'ERROR' | 'FATAL';
  message: string;
  correlationId?: string;
  tenantId?: string;
  userId?: string;
  requestId?: string;
  subscriptionId?: string;
  installationId?: string;
  referralId?: string;
  duration?: number;
  error?: string;
  metadata?: Record<string, unknown>;
}

export class StructuredLogger {
  private static instance: StructuredLogger;

  static get(): StructuredLogger {
    if (!this.instance) this.instance = new StructuredLogger();
    return this.instance;
  }

  log(entry: LogEntry): void {
    const payload = {
      ...entry,
      timestamp: new Date().toISOString(),
      service: 'referix',
      environment: process.env.NODE_ENV ?? 'development',
    };
    const output = JSON.stringify(payload);

    switch (entry.level) {
      case 'ERROR': case 'FATAL': console.error(output); break;
      case 'WARN': console.warn(output); break;
      default: console.log(output); break;
    }
  }

  info(message: string, ctx?: Partial<LogEntry>): void { this.log({ level: 'INFO', message, ...ctx }); }
  warn(message: string, ctx?: Partial<LogEntry>): void { this.log({ level: 'WARN', message, ...ctx }); }
  error(message: string, error?: Error, ctx?: Partial<LogEntry>): void {
    this.log({ level: 'ERROR', message, error: error?.message ?? error, ...ctx });
  }
  debug(message: string, ctx?: Partial<LogEntry>): void { this.log({ level: 'DEBUG', message, ...ctx }); }

  child(defaults: Partial<LogEntry>): StructuredLogger {
    const logger = new StructuredLogger();
    const originalLog = logger.log.bind(logger);
    logger.log = (entry) => originalLog({ ...defaults, ...entry });
    return logger;
  }
}

export const logger = StructuredLogger.get();
