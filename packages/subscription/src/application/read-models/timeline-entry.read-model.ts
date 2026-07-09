export interface TimelineEntry {
  timestamp: Date;
  type: 'event' | 'decision' | 'milestone' | 'transition' | 'process_step';
  action: string;
  description: string;
  actorId: string | null;
  correlationId: string | null;
}
