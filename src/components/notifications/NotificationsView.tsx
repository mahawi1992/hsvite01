import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Paper,
  Button,
  Stack,
  Chip,
  IconButton,
  Badge,
  Divider,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { format, formatDistanceToNow } from 'date-fns';
import { notificationService } from '../../services/notification';
import { Notification, NotificationType } from '../../lib/types/notifications';

// Styled components
const NotificationCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

const ActionButton = styled(Button)(({ theme }) => ({
  textTransform: 'none',
  minWidth: 80,
}));

interface NotificationTabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const NotificationTabPanel = (props: NotificationTabPanelProps) => {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`notification-tabpanel-${index}`}
      aria-labelledby={`notification-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

export const NotificationsView = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    loadNotifications();
  }, [activeTab]);

  const loadNotifications = async () => {
    const type =
      activeTab === 1
        ? 'SHIFT_CHANGE'
        : activeTab === 2
          ? 'TIME_OFF'
          : activeTab === 3
            ? 'ALERT'
            : undefined;

    const result = await notificationService.getNotifications('current-user', {
      type,
      unreadOnly: false,
      limit: 20,
    });
    setNotifications(result as Notification[]);
  };

  const handleApprove = async (notificationId: string) => {
    // Handle approval logic
    await notificationService.markAsRead([notificationId]);
    loadNotifications();
  };

  const handleDeny = async (notificationId: string) => {
    // Handle denial logic
    await notificationService.markAsRead([notificationId]);
    loadNotifications();
  };

  const renderNotificationContent = (notification: Notification) => {
    switch (notification.type) {
      case 'SHIFT_CHANGE':
        return (
          <>
            <Typography variant="subtitle1" color="primary" gutterBottom>
              Shift Change Request
            </Typography>
            <Typography variant="body1" gutterBottom>
              {notification.message}
            </Typography>
            <Stack direction="row" spacing={1} mt={2}>
              <ActionButton
                variant="contained"
                color="success"
                onClick={() => handleApprove(notification.id)}
              >
                Approve
              </ActionButton>
              <ActionButton
                variant="contained"
                color="error"
                onClick={() => handleDeny(notification.id)}
              >
                Deny
              </ActionButton>
            </Stack>
          </>
        );

      case 'TIME_OFF':
        return (
          <>
            <Typography variant="subtitle1" color="primary" gutterBottom>
              Time Off Request
            </Typography>
            <Typography variant="body1" gutterBottom>
              {notification.message}
            </Typography>
            <Stack direction="row" spacing={1} mt={2}>
              <ActionButton
                variant="contained"
                color="success"
                onClick={() => handleApprove(notification.id)}
              >
                Approve
              </ActionButton>
              <ActionButton
                variant="contained"
                color="error"
                onClick={() => handleDeny(notification.id)}
              >
                Deny
              </ActionButton>
            </Stack>
          </>
        );

      case 'ALERT':
        return (
          <>
            <Typography variant="subtitle1" color="error" gutterBottom>
              Alert
            </Typography>
            <Typography variant="body1" gutterBottom>
              {notification.message}
            </Typography>
            <Button
              variant="outlined"
              color="primary"
              sx={{ mt: 2 }}
              onClick={() => {
                /* Handle view details */
              }}
            >
              View Details
            </Button>
          </>
        );

      default:
        return <Typography variant="body1">{notification.message}</Typography>;
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h5" sx={{ mb: 3 }}>
        Notifications
      </Typography>

      <Tabs
        value={activeTab}
        onChange={(_, newValue) => setActiveTab(newValue)}
        sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}
      >
        <Tab label="All" />
        <Tab label="Shift Changes" />
        <Tab label="Time Off Requests" />
        <Tab label="Alerts" />
      </Tabs>

      <NotificationTabPanel value={activeTab} index={0}>
        {notifications.map((notification) => (
          <NotificationCard key={notification.id} elevation={1}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="caption" color="text.secondary">
                {formatDistanceToNow(new Date(notification.timestamp), { addSuffix: true })}
              </Typography>
              {!notification.read && <Chip size="small" label="New" color="primary" />}
            </Box>
            {renderNotificationContent(notification)}
          </NotificationCard>
        ))}
      </NotificationTabPanel>

      <NotificationTabPanel value={activeTab} index={1}>
        {notifications.map((notification) => (
          <NotificationCard key={notification.id} elevation={1}>
            {renderNotificationContent(notification)}
          </NotificationCard>
        ))}
      </NotificationTabPanel>

      <NotificationTabPanel value={activeTab} index={2}>
        {notifications.map((notification) => (
          <NotificationCard key={notification.id} elevation={1}>
            {renderNotificationContent(notification)}
          </NotificationCard>
        ))}
      </NotificationTabPanel>

      <NotificationTabPanel value={activeTab} index={3}>
        {notifications.map((notification) => (
          <NotificationCard key={notification.id} elevation={1}>
            {renderNotificationContent(notification)}
          </NotificationCard>
        ))}
      </NotificationTabPanel>
    </Box>
  );
};
