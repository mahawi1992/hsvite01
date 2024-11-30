import { describe, it, expect, beforeEach } from 'vitest';
import { notificationService } from '../../services/notification';
import type { StaffMember } from '../../lib/types/staff';
import type { NotificationConfig } from '../../lib/types/notifications';

describe('NotificationService', () => {
  const mockStaff: StaffMember = {
    id: 'test-1',
    name: 'Test User',
    email: 'test@example.com',
    role: 'Nurse',
    department: 'Emergency',
    employmentType: 'FULL_TIME',
    status: 'ACTIVE',
    certifications: ['RN'],
    experience: 2,
    points: 0,
    recoveryShifts: 0,
    shifts: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockConfig: NotificationConfig = {
    type: 'SHIFT_REMINDER',
    priority: 'HIGH',
    channel: ['EMAIL', 'IN_APP'],
    category: 'SCHEDULING',
    groupable: true,
  };

  beforeEach(() => {
    // Reset any stored notifications
    notificationService.getNotifications('test-1', {}).then((notifications) => {
      const ids = notifications.map((n) => ('id' in n ? n.id : n.notifications[0]));
      notificationService.markAsRead(ids);
    });
  });

  describe('sendNotification', () => {
    it('should successfully send a notification', async () => {
      const result = await notificationService.sendNotification(
        mockStaff,
        'Your shift starts in 1 hour',
        mockConfig
      );
      expect(result).toBe(true);
    });

    it('should respect notification preferences', async () => {
      await notificationService.updatePreferences(mockStaff.id, {
        mutedTypes: ['SHIFT_REMINDER'],
      });

      const result = await notificationService.sendNotification(
        mockStaff,
        'Your shift starts in 1 hour',
        mockConfig
      );
      expect(result).toBe(false);
    });
  });

  describe('getNotifications', () => {
    it('should retrieve notifications for a user', async () => {
      await notificationService.sendNotification(mockStaff, 'Test notification', mockConfig);

      const notifications = await notificationService.getNotifications(mockStaff.id, {});
      expect(notifications.length).toBeGreaterThan(0);
    });

    it('should filter by unread status', async () => {
      await notificationService.sendNotification(mockStaff, 'Unread notification', mockConfig);

      const unreadNotifications = await notificationService.getNotifications(mockStaff.id, {
        unreadOnly: true,
      });
      expect(unreadNotifications.length).toBeGreaterThan(0);
    });
  });

  describe('notification grouping', () => {
    it('should group similar notifications', async () => {
      // Send multiple similar notifications
      for (let i = 0; i < 3; i++) {
        await notificationService.sendNotification(
          mockStaff,
          `Shift reminder ${i + 1}`,
          mockConfig
        );
      }

      const groupedNotifications = await notificationService.getNotifications(mockStaff.id, {
        grouped: true,
      });

      // Should have fewer items than individual notifications due to grouping
      expect(groupedNotifications.some((n) => 'notifications' in n)).toBe(true);
    });
  });
});
