export type NotificationChannel = 'PUSH' | 'EMAIL' | 'SMS' | 'WHATSAPP' | 'IN_APP';
export type NotificationPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export interface NotificationEvent {
  type: string;
  tenantId: string;
  actorId: string | null;
  title: string;
  body: string;
  data?: Record<string, unknown>;
  channels?: NotificationChannel[];
  priority?: NotificationPriority;
}

export interface UserNotificationPreferences {
  userId: string;
  channels: NotificationChannel[];
  quietHoursStart?: number;
  quietHoursEnd?: number;
  enabledEvents: string[];
}

export interface INotificationChannelAdapter {
  readonly channel: NotificationChannel;
  send(event: NotificationEvent, recipient: string): Promise<boolean>;
}

export interface INotificationCenter {
  send(event: NotificationEvent): Promise<void>;
  getPreferences(userId: string): Promise<UserNotificationPreferences>;
  updatePreferences(userId: string, prefs: Partial<UserNotificationPreferences>): Promise<void>;
}

export const NOTIFICATION_CENTER = 'NOTIFICATION_CENTER';
