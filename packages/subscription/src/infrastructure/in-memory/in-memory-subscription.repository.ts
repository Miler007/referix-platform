import { Subscription } from '../../domain/subscription.entity';
import { SubscriptionStatus } from '../../domain/value-objects';
import { ISubscriptionRepository, SubscriptionSearchCriteria, PaginatedResult } from '../../domain/repository.interface';

export class InMemorySubscriptionRepository implements ISubscriptionRepository {
  private store = new Map<string, Subscription>();

  private key(tenantId: string, id: string): string {
    return `${tenantId}:${id}`;
  }

  async save(subscription: Subscription): Promise<void> {
    this.store.set(this.key(subscription.tenantId, subscription.id), subscription);
  }

  async findById(tenantId: string, subscriptionId: string): Promise<Subscription | null> {
    return this.store.get(this.key(tenantId, subscriptionId)) ?? null;
  }

  async findByPublicId(tenantId: string, publicId: string): Promise<Subscription | null> {
    for (const sub of this.store.values()) {
      if (sub.tenantId === tenantId && sub.publicId.value === publicId) {
        return sub;
      }
    }
    return null;
  }

  async findByPersonId(tenantId: string, personId: string): Promise<Subscription[]> {
    return Array.from(this.store.values())
      .filter(s => s.tenantId === tenantId && s.personId === personId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async findByLocationId(tenantId: string, locationId: string): Promise<Subscription[]> {
    return Array.from(this.store.values())
      .filter(s => s.tenantId === tenantId && s.locationId === locationId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async search(tenantId: string, criteria: SubscriptionSearchCriteria): Promise<PaginatedResult<Subscription>> {
    let results = Array.from(this.store.values()).filter(s => s.tenantId === tenantId);

    if (criteria.personId) results = results.filter(s => s.personId === criteria.personId);
    if (criteria.status) results = results.filter(s => s.status === criteria.status);
    if (criteria.planId) results = results.filter(s => s.planId === criteria.planId);
    if (criteria.locationId) results = results.filter(s => s.locationId === criteria.locationId);
    if (criteria.query) {
      const q = criteria.query.toLowerCase();
      results = results.filter(s => s.publicId.value.toLowerCase().includes(q) || s.id.toLowerCase().includes(q));
    }

    results.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    const page = criteria.page ?? 1;
    const limit = criteria.limit ?? 20;
    const total = results.length;
    const totalPages = Math.ceil(total / limit);
    const start = (page - 1) * limit;
    const data = results.slice(start, start + limit);

    return { data, total, page, limit, totalPages };
  }

  async findActiveByPersonId(tenantId: string, personId: string): Promise<Subscription[]> {
    return Array.from(this.store.values())
      .filter(s => s.tenantId === tenantId && s.personId === personId && s.status === SubscriptionStatus.ACTIVE)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async delete(tenantId: string, subscriptionId: string): Promise<void> {
    this.store.delete(this.key(tenantId, subscriptionId));
  }

  clear(): void {
    this.store.clear();
  }
}
