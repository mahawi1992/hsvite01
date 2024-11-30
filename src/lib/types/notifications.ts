export type NotificationChannel = 'EMAIL' | 'SMS' | 'PUSH' | 'IN_APP';
export type NotificationPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
export type NotificationType = 'SHIFT_SWAP' | 'SCHEDULE_CHANGE' | 'REMINDER' | 'ALERT' | 'ERROR';

export interface Notification {
  id: string;
  recipientId: string;
  message: string;
  channels: NotificationChannel[];
  priority: NotificationPriority;
  type: NotificationType;
  status: 'PENDING' | 'SENT' | 'READ' | 'FAILED';
  createdAt: Date;
}

export interface NotificationPreferences {
  channels: NotificationChannel[];
  scheduleUpdates: boolean;
  shiftReminders: boolean;
  urgentAlerts: boolean;
  doNotDisturb: {
    enabled: boolean;
    startTime?: string;
    endTime?: string;
  };
}

export interface NotificationTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  variables: string[];
}

export interface NotificationConfig {
  channels: NotificationChannel[];
  priority: NotificationPriority;
  template?: NotificationTemplate;
  type: NotificationType;
}
