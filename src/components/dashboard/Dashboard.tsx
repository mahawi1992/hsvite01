import { useState } from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Button,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
} from '@mui/material';
import {
  Add as AddIcon,
  Notifications as NotificationIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const MotionPaper = motion.create(Paper);

interface Employee {
  id: string;
  name: string;
  role: string;
  avatar: string;
  availability: Record<string, 'Available' | 'Unavailable' | 'Pending'>;
}

interface Shift {
  name: string;
  time: string;
  employeesAssigned: number;
}

interface Notification {
  type: 'schedule_update' | 'time_off_request';
  message: string;
  details: string;
}

// Sample data
const employees: Employee[] = [
  {
    id: '1',
    name: 'John Doe',
    role: 'Nurse',
    avatar: '',
    availability: {
      Mon: 'Available',
      Tue: 'Available',
      Wed: 'Unavailable',
      Thu: 'Available',
      Fri: 'Available',
      Sat: 'Pending',
      Sun: 'Unavailable',
    },
  },
  {
    id: '2',
    name: 'Jane Smith',
    role: 'Registered Nurse',
    avatar: '',
    availability: {
      Mon: 'Available',
      Tue: 'Available',
      Wed: 'Available',
      Thu: 'Available',
      Fri: 'Available',
      Sat: 'Available',
      Sun: 'Unavailable',
    },
  },
  {
    id: '3',
    name: 'Michael Johnson',
    role: 'Physician Assistant',
    avatar: '',
    availability: {
      Mon: 'Available',
      Tue: 'Unavailable',
      Wed: 'Available',
      Thu: 'Available',
      Fri: 'Available',
      Sat: 'Available',
      Sun: 'Available',
    },
  },
];

const shifts: Shift[] = [
  { name: 'Morning Shift', time: '07:00 - 15:00', employeesAssigned: 3 },
  { name: 'Evening Shift', time: '15:00 - 23:00', employeesAssigned: 4 },
];

const notifications: Notification[] = [
  {
    type: 'schedule_update',
    message: 'Schedule Update',
    details: 'Your shift on Friday, July 15, 2025 has been changed.',
  },
  {
    type: 'time_off_request',
    message: 'Time-off Request',
    details: 'New time-off request from Sarah Johnson for August 1-5, 2025.',
  },
];

const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function Dashboard() {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const getAvailabilityColor = (status: string) => {
    switch (status) {
      case 'Available':
        return { backgroundColor: '#E8F5E9', color: '#2E7D32' };
      case 'Unavailable':
        return { backgroundColor: '#FFEBEE', color: '#C62828' };
      case 'Pending':
        return { backgroundColor: '#FFF3E0', color: '#E65100' };
      default:
        return { backgroundColor: '#F5F5F5', color: '#424242' };
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        {/* Schedule Overview */}
        <Grid item xs={12} md={8}>
          <MotionPaper
            sx={{ p: 3, borderRadius: 2, mb: 3 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Typography variant="h6" gutterBottom>
              Schedule Overview
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    {weekDays.map((day) => (
                      <TableCell key={day} align="center">
                        {day}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    {weekDays.map((day) => (
                      <TableCell key={day} align="center">
                        {day === 'Sun' && (
                          <Box>
                            <Typography variant="subtitle2">1</Typography>
                            <Typography variant="caption" color="text.secondary">
                              3 shifts
                            </Typography>
                          </Box>
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </MotionPaper>
        </Grid>

        {/* Shift Management */}
        <Grid item xs={12} md={4}>
          <MotionPaper
            sx={{ p: 3, borderRadius: 2, mb: 3 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Box
              sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}
            >
              <Typography variant="h6">Shift Management</Typography>
              <Button variant="contained" startIcon={<AddIcon />} size="small">
                Create New Shift
              </Button>
            </Box>
            {shifts.map((shift, index) => (
              <Box
                key={index}
                sx={{
                  p: 2,
                  mb: 2,
                  borderRadius: 1,
                  bgcolor: 'background.default',
                  '&:last-child': { mb: 0 },
                }}
              >
                <Typography variant="subtitle1">{shift.name}</Typography>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mt: 1,
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    {shift.time}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {shift.employeesAssigned} employees assigned
                  </Typography>
                </Box>
              </Box>
            ))}
          </MotionPaper>
        </Grid>

        {/* Employee Availability */}
        <Grid item xs={12}>
          <MotionPaper
            sx={{ p: 3, borderRadius: 2, mb: 3 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Typography variant="h6" gutterBottom>
              Employee Availability
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Employee</TableCell>
                    {weekDays.map((day) => (
                      <TableCell key={day} align="center">
                        {day}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {employees.map((employee) => (
                    <TableRow key={employee.id}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Avatar src={employee.avatar}>{employee.name[0]}</Avatar>
                          <Typography>{employee.name}</Typography>
                        </Box>
                      </TableCell>
                      {weekDays.map((day) => (
                        <TableCell key={day} align="center">
                          <Chip
                            label={employee.availability[day]}
                            size="small"
                            sx={getAvailabilityColor(employee.availability[day])}
                          />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </MotionPaper>
        </Grid>

        {/* Notifications */}
        <Grid item xs={12} md={6}>
          <MotionPaper
            sx={{ p: 3, borderRadius: 2, mb: 3 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Typography variant="h6" gutterBottom>
              Notifications
            </Typography>
            {notifications.map((notification, index) => (
              <Box
                key={index}
                sx={{
                  p: 2,
                  mb: 2,
                  borderRadius: 1,
                  bgcolor: notification.type === 'schedule_update' ? '#E3F2FD' : '#FFF3E0',
                  '&:last-child': { mb: 0 },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <NotificationIcon color="primary" fontSize="small" />
                  <Typography variant="subtitle2">{notification.message}</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {notification.details}
                </Typography>
              </Box>
            ))}
          </MotionPaper>
        </Grid>

        {/* Employee Directory */}
        <Grid item xs={12} md={6}>
          <MotionPaper
            sx={{ p: 3, borderRadius: 2 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Typography variant="h6" gutterBottom>
              Employee Directory
            </Typography>
            {employees.map((employee, index) => (
              <Box
                key={employee.id}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  p: 2,
                  borderBottom: index < employees.length - 1 ? 1 : 0,
                  borderColor: 'divider',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar src={employee.avatar}>{employee.name[0]}</Avatar>
                  <Box>
                    <Typography variant="subtitle2">{employee.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {employee.role}
                    </Typography>
                  </Box>
                </Box>
                <Button variant="text" size="small">
                  View Profile
                </Button>
              </Box>
            ))}
          </MotionPaper>
        </Grid>
      </Grid>
    </Box>
  );
}
