import { Module } from '@nestjs/common';
import { SUBSCRIPTION_REPOSITORY } from '../domain/repository.interface';
import { InMemorySubscriptionRepository } from './in-memory/in-memory-subscription.repository';
import { InMemoryEventStore } from './event-store/in-memory-event-store';
import { InMemorySnapshotStore } from './snapshot/in-memory-snapshot-store';

@Module({
  providers: [
    { provide: SUBSCRIPTION_REPOSITORY, useClass: InMemorySubscriptionRepository },
    InMemoryEventStore,
    InMemorySnapshotStore,
  ],
  exports: [SUBSCRIPTION_REPOSITORY, InMemoryEventStore, InMemorySnapshotStore],
})
export class SubscriptionModule {}
