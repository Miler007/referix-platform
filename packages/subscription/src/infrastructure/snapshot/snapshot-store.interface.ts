export interface SnapshotRecord {
  id: string;
  aggregateId: string;
  aggregateType: string;
  version: number;
  snapshot: Record<string, unknown>;
  validFrom: Date;
  validTo: Date | null;
  eventName: string;
  changedBy: string;
  correlationId: string | null;
  createdAt: Date;
}

export interface ISnapshotStore {
  save(record: Omit<SnapshotRecord, 'id' | 'createdAt'>): Promise<void>;
  findLatest(aggregateType: string, aggregateId: string): Promise<SnapshotRecord | null>;
  findAtVersion(aggregateType: string, aggregateId: string, version: number): Promise<SnapshotRecord | null>;
  findAtDate(aggregateType: string, aggregateId: string, date: Date): Promise<SnapshotRecord | null>;
  listVersions(aggregateType: string, aggregateId: string): Promise<SnapshotRecord[]>;
}
