import { v4 as uuid } from 'uuid';
import { ISnapshotStore, SnapshotRecord } from './snapshot-store.interface';

export class InMemorySnapshotStore implements ISnapshotStore {
  private snapshots: SnapshotRecord[] = [];

  async save(record: Omit<SnapshotRecord, 'id' | 'createdAt'>): Promise<void> {
    this.snapshots.push({ ...record, id: uuid(), createdAt: new Date() });
  }

  async findLatest(aggregateType: string, aggregateId: string): Promise<SnapshotRecord | null> {
    const matches = this.snapshots
      .filter(s => s.aggregateType === aggregateType && s.aggregateId === aggregateId && s.validTo === null)
      .sort((a, b) => b.version - a.version);
    return matches[0] ?? null;
  }

  async findAtVersion(aggregateType: string, aggregateId: string, version: number): Promise<SnapshotRecord | null> {
    return this.snapshots.find(s => s.aggregateType === aggregateType && s.aggregateId === aggregateId && s.version === version) ?? null;
  }

  async findAtDate(aggregateType: string, aggregateId: string, date: Date): Promise<SnapshotRecord | null> {
    const matches = this.snapshots
      .filter(s => s.aggregateType === aggregateType && s.aggregateId === aggregateId && s.validFrom <= date && (s.validTo === null || s.validTo > date))
      .sort((a, b) => b.version - a.version);
    return matches[0] ?? null;
  }

  async listVersions(aggregateType: string, aggregateId: string): Promise<SnapshotRecord[]> {
    return this.snapshots
      .filter(s => s.aggregateType === aggregateType && s.aggregateId === aggregateId)
      .sort((a, b) => a.version - b.version);
  }

  clear(): void {
    this.snapshots = [];
  }
}
