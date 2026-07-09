import { InMemorySubscriptionRepository } from './in-memory-subscription.repository';
import { Subscription } from '../../domain/subscription.entity';
import { SubscriptionStatus } from '../../domain/value-objects';

let pubSeq = 1;
function nextPub(): string {
  const seq = String(pubSeq).padStart(9, '0');
  pubSeq++;
  return `PUB-2024-${seq}`;
}

function createDefaultSub(overrides: Partial<{ tenantId: string; personId: string; planId: string; locationId: string; publicId: string }> = {}): Subscription {
  const sub = Subscription.create({
    tenantId: overrides.tenantId ?? 'tenant-1',
    personId: overrides.personId ?? 'person-1',
    planId: overrides.planId ?? 'plan-1',
    serviceId: 'service-1',
    locationId: overrides.locationId ?? 'location-1',
    publicId: overrides.publicId ?? nextPub(),
  });
  sub.pullEvents();
  return sub;
}

describe('InMemorySubscriptionRepository', () => {
  let repo: InMemorySubscriptionRepository;

  beforeEach(() => {
    pubSeq = 1;
    repo = new InMemorySubscriptionRepository();
  });

  describe('save and findById', () => {
    it('should persist and retrieve a subscription by id', async () => {
      const sub = createDefaultSub();
      await repo.save(sub);

      const found = await repo.findById('tenant-1', sub.id);
      expect(found).not.toBeNull();
      expect(found!.publicId.value).toBe('PUB-2024-000000001');
    });

    it('should return null for non-existent subscription', async () => {
      const found = await repo.findById('tenant-1', 'non-existent');
      expect(found).toBeNull();
    });

    it('should isolate subscriptions by tenant', async () => {
      const sub1 = createDefaultSub({ tenantId: 'tenant-1' });
      const sub2 = createDefaultSub({ tenantId: 'tenant-2' });
      await repo.save(sub1);
      await repo.save(sub2);

      const found1 = await repo.findById('tenant-1', sub1.id);
      const found2 = await repo.findById('tenant-2', sub1.id);
      expect(found1).not.toBeNull();
      expect(found2).toBeNull();
    });
  });

  describe('findByPublicId', () => {
    it('should find subscription by public id', async () => {
      const sub = createDefaultSub();
      await repo.save(sub);

      const found = await repo.findByPublicId('tenant-1', 'PUB-2024-000000001');
      expect(found).not.toBeNull();
      expect(found!.id).toBe(sub.id);
    });
  });

  describe('findByPersonId', () => {
    it('should return all subscriptions for a person', async () => {
      const sub1 = createDefaultSub({ personId: 'person-1' });
      const sub2 = createDefaultSub({ personId: 'person-1' });
      const sub3 = createDefaultSub({ personId: 'person-2' });

      await repo.save(sub1);
      await repo.save(sub2);
      await repo.save(sub3);

      const result = await repo.findByPersonId('tenant-1', 'person-1');
      expect(result).toHaveLength(2);
    });

    it('should return empty array for person with no subscriptions', async () => {
      const result = await repo.findByPersonId('tenant-1', 'person-1');
      expect(result).toEqual([]);
    });
  });

  function activateSub(sub: Subscription): void {
    sub.validate('actor-1');
    sub.confirmCoverage('service-1', 'zone-1');
    sub.submitDocuments(['doc-1']);
    sub.approve('actor-1', 750);
    sub.scheduleInstallation('tech', new Date(), 'WO-1');
    sub.startInstallation('tech');
    sub.completeInstallation(['ROUTER'], ['evidence']);
    sub.activate(new Date(), 'BC-1');
  }

  describe('search', () => {
    it('should paginate results', async () => {
      for (let i = 1; i <= 25; i++) {
        const sub = createDefaultSub();
        await repo.save(sub);
      }

      const page1 = await repo.search('tenant-1', { page: 1, limit: 10 });
      expect(page1.data).toHaveLength(10);
      expect(page1.total).toBe(25);
      expect(page1.totalPages).toBe(3);

      const page3 = await repo.search('tenant-1', { page: 3, limit: 10 });
      expect(page3.data).toHaveLength(5);
    });

    it('should filter by status', async () => {
      const sub1 = createDefaultSub();
      activateSub(sub1);
      sub1.pullEvents();

      const sub2 = createDefaultSub();
      await repo.save(sub1);
      await repo.save(sub2);

      const result = await repo.search('tenant-1', { status: SubscriptionStatus.ACTIVE });
      expect(result.data).toHaveLength(1);
    });
  });

  describe('findActiveByPersonId', () => {
    it('should return only active subscriptions for a person', async () => {
      const sub1 = createDefaultSub({ personId: 'person-1' });
      const sub2 = createDefaultSub({ personId: 'person-1' });
      activateSub(sub1);
      sub1.pullEvents();

      await repo.save(sub1);
      await repo.save(sub2);

      const result = await repo.findActiveByPersonId('tenant-1', 'person-1');
      expect(result).toHaveLength(1);
    });
  });

  describe('delete', () => {
    it('should remove subscription from store', async () => {
      const sub = createDefaultSub();
      await repo.save(sub);
      await repo.delete('tenant-1', sub.id);

      const found = await repo.findById('tenant-1', sub.id);
      expect(found).toBeNull();
    });
  });
});
