import { Injectable } from '@nestjs/common';
import { PrismaService } from '@referix/kernel';
import { Subscription } from '../../domain/subscription.entity';
import { SubscriptionStatus } from '../../domain/value-objects';
import { ISubscriptionRepository, SubscriptionSearchCriteria, PaginatedResult } from '../../domain/repository.interface';

@Injectable()
export class PrismaSubscriptionRepository implements ISubscriptionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(subscription: Subscription): Promise<void> {
    const snap = subscription.snapshot();
    const data = {
      id: snap.subscriptionId as string,
      tenantId: snap.tenantId as string,
      personId: snap.personId as string,
      planId: snap.planId as string,
      serviceId: snap.serviceId as string,
      locationId: snap.locationId as string,
      contractId: snap.contractId as string | null,
      status: snap.status as string,
      publicId: snap.publicId as string,
      health: snap.health as string,
      currentVersion: snap.currentVersion as number,
      createdAt: new Date(snap.createdAt as string),
      updatedAt: new Date(snap.updatedAt as string),
      activatedAt: snap.activatedAt ? new Date(snap.activatedAt as string) : null,
      cancelledAt: snap.cancelledAt ? new Date(snap.cancelledAt as string) : null,
      archivedAt: snap.archivedAt ? new Date(snap.archivedAt as string) : null,
    };

    await this.prisma.subscription.upsert({
      where: { id: data.id },
      create: data,
      update: data,
    });

    const events = subscription.pullEvents();
    for (const event of events) {
      await this.prisma.eventStore.create({
        data: {
          tenantId: event.tenantId,
          aggregateType: 'subscription',
          aggregateId: event.subscriptionId,
          aggregateVersion: event.aggregateVersion,
          eventName: event.eventName,
          eventVersion: event.eventVersion,
          correlationId: event.correlationId,
          causationId: event.causationId,
          actorId: event.actorId,
          payload: event.data as Record<string, unknown>,
        },
      });
    }
  }

  async findById(tenantId: string, subscriptionId: string): Promise<Subscription | null> {
    const row = await this.prisma.subscription.findFirst({
      where: { id: subscriptionId, tenantId, deletedAt: null },
    });
    if (!row) return null;
    return this.rowToEntity(row);
  }

  async findByPublicId(tenantId: string, publicId: string): Promise<Subscription | null> {
    const row = await this.prisma.subscription.findFirst({
      where: { publicId, tenantId, deletedAt: null },
    });
    if (!row) return null;
    return this.rowToEntity(row);
  }

  async findByPersonId(tenantId: string, personId: string): Promise<Subscription[]> {
    const rows = await this.prisma.subscription.findMany({
      where: { tenantId, personId, deletedAt: null },
      orderBy: { createdAt: 'desc' },
    });
    return rows.map(r => this.rowToEntity(r));
  }

  async findByLocationId(tenantId: string, locationId: string): Promise<Subscription[]> {
    const rows = await this.prisma.subscription.findMany({
      where: { tenantId, locationId, deletedAt: null },
      orderBy: { createdAt: 'desc' },
    });
    return rows.map(r => this.rowToEntity(r));
  }

  async search(tenantId: string, criteria: SubscriptionSearchCriteria): Promise<PaginatedResult<Subscription>> {
    const where: Record<string, unknown> = { tenantId, deletedAt: null };
    if (criteria.personId) where.personId = criteria.personId;
    if (criteria.status) where.status = criteria.status;
    if (criteria.planId) where.planId = criteria.planId;
    if (criteria.locationId) where.locationId = criteria.locationId;

    const page = criteria.page ?? 1;
    const limit = criteria.limit ?? 20;
    const skip = (page - 1) * limit;

    const [rows, total] = await Promise.all([
      this.prisma.subscription.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' } }),
      this.prisma.subscription.count({ where }),
    ]);

    return {
      data: rows.map(r => this.rowToEntity(r)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findActiveByPersonId(tenantId: string, personId: string): Promise<Subscription[]> {
    const rows = await this.prisma.subscription.findMany({
      where: { tenantId, personId, status: SubscriptionStatus.ACTIVE, deletedAt: null },
      orderBy: { createdAt: 'desc' },
    });
    return rows.map(r => this.rowToEntity(r));
  }

  async delete(tenantId: string, subscriptionId: string): Promise<void> {
    await this.prisma.subscription.update({
      where: { id: subscriptionId },
      data: { deletedAt: new Date() },
    });
  }

  private rowToEntity(row: Record<string, unknown>): Subscription {
    const sub = Subscription.create({
      tenantId: row.tenantId as string,
      personId: row.personId as string,
      planId: row.planId as string,
      serviceId: row.serviceId as string,
      locationId: row.locationId as string,
      contractId: (row.contractId as string) ?? undefined,
      publicId: row.publicId as string,
    });
    sub.setExpectedVersion(row.currentVersion as number);
    return sub;
  }
}
