import type {
  Notification,
  NotificationConfig,
  NotificationChannel,
  NotificationType,
  NotificationPriority,
} from '../lib/types/notifications';
import type { StaffMember } from '../lib/types/staff';
import { mockNotifications } from '../mock/notificationData';

// In-memory storage for demo purposes
let notifications: Notification[] = [...mockNotifications];
let notificationEvents: NotificationEvent[] = [];
let notificationGroups: NotificationGroup[] = [];
let notificationPreferences: Record<string, NotificationPreference> = {};

interface NotificationEvent {
  id: string;
  userId: string;
  type: NotificationType;
  channel: NotificationChannel;
  priority: NotificationPriority;
  timestamp: Date;
  delivered: boolean;
  read?: boolean;
  clickThrough?: boolean;
  actionTaken?: boolean;
  deliveryLatency?: number;
  error?: string;
  context?: Record<string, any>;
  groupId?: string;
  message: string;
  title?: string;
  actionType?: 'APPROVE_DENY' | 'VIEW_DETAILS' | 'CUSTOM';
  actionData?: Record<string, any>;
  relatedUserIds?: string[];
  category?: 'SHIFT' | 'TIME_OFF' | 'ALERT' | 'OTHER';
  expiresAt?: Date;
}

interface NotificationGroup {
  id: string;
  context: string;
  notifications: string[];
  priority: NotificationPriority;
  createdAt: Date;
  updatedAt: Date;
  status: 'ACTIVE' | 'ARCHIVED';
}

interface NotificationPreference {
  userId: string;
  mutedChannels: NotificationChannel[];
  mutedTypes: NotificationType[];
  quietHours: { start: number; end: number }[];
  priorityThreshold: NotificationPriority;
  groupingEnabled: boolean;
  customRules: NotificationRule[];
}

interface NotificationRule {
  condition: (notification: Notification) => boolean;
  action: 'MUTE' | 'PRIORITIZE' | 'ROUTE';
  channelOverride?: NotificationChannel[];
}

interface NotificationMetrics {
  totalSent: number;
  deliveryRate: number;
  readRate: number;
  clickThroughRate: number;
  actionRate: number;
  averageLatency: number;
  errorRate: number;
  channelBreakdown: Record<NotificationChannel, number>;
  typeBreakdown: Record<NotificationType, number>;
  priorityBreakdown: Record<NotificationPriority, number>;
  hourlyDistribution: number[];
  groupEfficiency: number;
}

class NotificationService {
  private async shouldDeliverNotification(
    notification: Notification,
    preference: NotificationPreference | null
  ): Promise<boolean> {
    if (!preference) return true;
    if (preference.mutedTypes?.includes(notification.type)) return false;
    if (notification.priority < (preference.priorityThreshold ?? 'LOW')) return false;

    const hour = new Date().getHours();
    const inQuietHours = preference.quietHours?.some(
      (period) => hour >= period.start && hour <= period.end
    );
    if (inQuietHours && notification.priority !== 'HIGH') return false;

    const matchingRule = preference.customRules?.find((rule) => rule.condition(notification));
    if (matchingRule?.action === 'MUTE') return false;

    return true;
  }

  async sendNotification(
    recipient: StaffMember,
    message: string,
    config: NotificationConfig
  ): Promise<boolean> {
    const notification: Notification = {
      id: crypto.randomUUID(),
      userId: recipient.id,
      message,
      type: config.type,
      channel: config.channel || 'IN_APP',
      priority: config.priority || 'NORMAL',
      timestamp: new Date(),
      delivered: false,
      read: false,
      title: config.title,
      actionType: config.actionType,
      actionData: config.actionData,
      relatedUserIds: config.relatedUserIds,
      category: config.category,
      expiresAt: config.expiresAt,
    };

    const shouldDeliver = await this.shouldDeliverNotification(
      notification,
      notificationPreferences[recipient.id] || null
    );

    if (!shouldDeliver) {
      return false;
    }

    if (notificationPreferences[recipient.id]?.groupingEnabled) {
      notification.groupId = await this.groupNotification(notification);
    }

    notifications.push(notification);

    notificationEvents.push({
      ...notification,
      delivered: true,
      deliveryLatency: 0,
    });

    return true;
  }

  async getNotifications(
    userId: string,
    options: {
      grouped?: boolean;
      unreadOnly?: boolean;
      priority?: NotificationPriority;
      type?: NotificationType;
      limit?: number;
      category?: string;
      startDate?: Date;
      endDate?: Date;
    } = {}
  ): Promise<(Notification | NotificationGroup)[]> {
    let filtered = notifications.filter((n) => n.userId === userId);

    if (options.unreadOnly) {
      filtered = filtered.filter((n) => !n.read);
    }

    if (options.priority) {
      filtered = filtered.filter((n) => n.priority === options.priority);
    }

    if (options.type) {
      filtered = filtered.filter((n) => n.type === options.type);
    }

    if (options.category) {
      filtered = filtered.filter((n) => n.category === options.category);
    }

    if (options.startDate) {
      filtered = filtered.filter((n) => n.timestamp >= options.startDate);
    }

    if (options.endDate) {
      filtered = filtered.filter((n) => n.timestamp <= options.endDate);
    }

    filtered.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    if (options.limit) {
      filtered = filtered.slice(0, options.limit);
    }

    if (options.grouped && notificationPreferences[userId]?.groupingEnabled) {
      return this.groupNotifications(filtered);
    }

    return filtered;
  }

  private async groupNotifications(
    notifications: Notification[]
  ): Promise<(Notification | NotificationGroup)[]> {
    const groups: Record<string, NotificationGroup> = {};
    const ungrouped: Notification[] = [];

    for (const notification of notifications) {
      if (notification.groupId) {
        if (!groups[notification.groupId]) {
          groups[notification.groupId] = {
            id: notification.groupId,
            context: notification.context?.groupContext || '',
            notifications: [],
            priority: notification.priority,
            createdAt: notification.timestamp,
            updatedAt: notification.timestamp,
            status: 'ACTIVE',
          };
        }
        groups[notification.groupId].notifications.push(notification.id);
        if (notification.timestamp > groups[notification.groupId].updatedAt) {
          groups[notification.groupId].updatedAt = notification.timestamp;
        }
      } else {
        ungrouped.push(notification);
      }
    }

    return [...Object.values(groups), ...ungrouped].sort((a, b) => {
      const aTime = 'timestamp' in a ? a.timestamp.getTime() : a.updatedAt.getTime();
      const bTime = 'timestamp' in b ? b.timestamp.getTime() : b.updatedAt.getTime();
      return bTime - aTime;
    });
  }

  async updatePreferences(
    userId: string,
    preferences: Partial<NotificationPreference>
  ): Promise<void> {
    notificationPreferences[userId] = {
      ...notificationPreferences[userId],
      ...preferences,
    };
  }

  async markAsRead(notificationIds: string[]): Promise<void> {
    notificationEvents
      .filter((e) => notificationIds.some((id) => e.id.startsWith(id)))
      .forEach((e) => {
        e.read = true;
      });
  }

  async archiveGroup(groupId: string): Promise<void> {
    const group = notificationGroups.find((g) => g.id === groupId);
    if (group) {
      group.status = 'ARCHIVED';
    }
  }

  getMetrics(): NotificationMetrics {
    const total = notificationEvents.length;
    const delivered = notificationEvents.filter((e) => e.delivered).length;
    const read = notificationEvents.filter((e) => e.read).length;
    const clicked = notificationEvents.filter((e) => e.clickThrough).length;
    const actioned = notificationEvents.filter((e) => e.actionTaken).length;
    const errors = notificationEvents.filter((e) => e.error).length;
    const latencies = notificationEvents
      .filter((e) => e.deliveryLatency !== undefined)
      .map((e) => e.deliveryLatency!);

    const groupEfficiency =
      notificationGroups
        .filter((g) => g.status === 'ACTIVE')
        .map((g) => g.notifications.length)
        .reduce((a, b) => a + b, 0) / notificationGroups.length;

    return {
      totalSent: total,
      deliveryRate: delivered / total,
      readRate: read / delivered,
      clickThroughRate: clicked / read,
      actionRate: actioned / clicked,
      averageLatency: latencies.reduce((a, b) => a + b, 0) / latencies.length,
      errorRate: errors / total,
      channelBreakdown: this.getBreakdown('channel'),
      typeBreakdown: this.getBreakdown('type'),
      priorityBreakdown: this.getBreakdown('priority'),
      hourlyDistribution: this.getHourlyDistribution(),
      groupEfficiency,
    };
  }

  private getBreakdown<K extends keyof NotificationEvent>(
    key: K
  ): Record<NotificationEvent[K] extends string ? NotificationEvent[K] : never, number> {
    return notificationEvents.reduce(
      (acc, event) => {
        const value = event[key] as string;
        acc[value] = (acc[value] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );
  }

  private getHourlyDistribution(): number[] {
    const distribution = new Array(24).fill(0);
    notificationEvents.forEach((event) => {
      const hour = event.timestamp.getHours();
      distribution[hour]++;
    });
    return distribution;
  }
}

export const notificationService = new NotificationService();
