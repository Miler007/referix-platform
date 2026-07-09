export interface HistoryEntry {
  version: number;
  eventName: string;
  eventVersion: string;
  timestamp: Date;
  actorId: string | null;
  correlationId: string | null;
  changes: Record<string, unknown>;
}
