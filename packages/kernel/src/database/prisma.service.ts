import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleDestroy {
  private readonly tenantConnections: Map<string, PrismaClient> = new Map();

  constructor() {
    super({
      log: [
        { emit: 'event', level: 'query' },
        { emit: 'stdout', level: 'info' },
        { emit: 'stdout', level: 'warn' },
        { emit: 'stdout', level: 'error' },
      ],
    });
  }

  async onModuleDestroy(): Promise<void> {
    await this.$disconnect().catch(() => {});
    for (const client of this.tenantConnections.values()) {
      await client.$disconnect().catch(() => {});
    }
  }

  async getTenantConnection(schema: string): Promise<PrismaClient> {
    const existing = this.tenantConnections.get(schema);
    if (existing) return existing;

    const url = process.env.DATABASE_URL;
    const tenantUrl = `${url}?schema=${schema}`;

    const client = new PrismaClient({
      datasources: { db: { url: tenantUrl } },
    });

    await client.$connect();
    this.tenantConnections.set(schema, client);
    return client;
  }
}
