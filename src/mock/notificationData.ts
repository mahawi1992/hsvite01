import { Notification } from '../lib/types/notifications';

export const mockNotifications: Notification[] = [
  {
    id: '1',
    userId: 'current-user',
    type: 'SHIFT_CHANGE',
    channel: 'IN_APP',
    priority: 'NORMAL',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    delivered: true,
    read: false,
    message: 'John Doe has requested to swap shifts with Jane Smith on July 15, 2025.',
    title: 'Shift Change Request',
    actionType: 'APPROVE_DENY',
    category: 'SHIFT',
    relatedUserIds: ['john-doe', 'jane-smith'],
  },
  {
    id: '2',
    userId: 'current-user',
    type: 'TIME_OFF',
    channel: 'IN_APP',
    priority: 'NORMAL',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    delivered: true,
    read: false,
    message: 'Sarah Johnson has requested time off from August 1-5, 2025.',
    title: 'Time Off Request',
    actionType: 'APPROVE_DENY',
    category: 'TIME_OFF',
    relatedUserIds: ['sarah-johnson'],
  },
  {
    id: '3',
    userId: 'current-user',
    type: 'ALERT',
    channel: 'IN_APP',
    priority: 'HIGH',
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    delivered: true,
    read: false,
    message: 'Overtime threshold reached for the Marketing department this week.',
    title: 'Alert',
    actionType: 'VIEW_DETAILS',
    category: 'ALERT',
  },
];
