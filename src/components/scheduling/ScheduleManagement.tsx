import { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  ButtonGroup,
  Tooltip,
  Badge,
  Menu,
  Grid,
} from '@mui/material';
import {
  ChevronLeft,
  ChevronRight,
  Add as AddIcon,
  FileDownload as ExportIcon,
  MoreVert as MoreVertIcon,
  SwapHoriz as SwapIcon,
  Block as BlockIcon,
  Event as EventIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { DatePicker } from '@mui/lab';

interface Employee {
  id: string;
  name: string;
  avatar: string;
  role: string;
  department: string;
}

interface TimeOffRequest {
  id: string;
  employeeId: string;
  startDate: string;
  endDate: string;
  status: 'pending' | 'approved' | 'denied';
}

interface Shift {
  employeeId: string;
  startTime: string;
  endTime: string;
  type: 'morning' | 'afternoon' | 'night';
}

type WeekDay = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';

// Sample data
const employees: Employee[] = [
  { id: '1', name: 'John Doe', avatar: '', role: 'Nurse', department: 'Emergency' },
  { id: '2', name: 'Jane Smith', avatar: '', role: 'Doctor', department: 'ICU' },
  { id: '3', name: 'Mike Johnson', avatar: '', role: 'Nurse', department: 'Emergency' },
];

const timeOffRequests: TimeOffRequest[] = [
  {
    id: '1',
    employeeId: '2',
    startDate: '2024-05-15',
    endDate: '2024-05-20',
    status: 'pending',
  },
  {
    id: '2',
    employeeId: '3',
    startDate: '2024-05-25',
    endDate: '2024-05-25',
    status: 'pending',
  },
];

const MotionPaper = motion.create(Paper);

export function ScheduleManagement() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'Day' | 'Week' | 'Month'>('Week');
  const [openShiftDialog, setOpenShiftDialog] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedTimeOff, setSelectedTimeOff] = useState<TimeOffRequest | null>(null);

  const handlePreviousWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() - 7);
    setCurrentDate(newDate);
  };

  const handleNextWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + 7);
    setCurrentDate(newDate);
  };

  const handleCreateShift = () => {
    setOpenShiftDialog(true);
  };

  const handleExportSchedule = () => {
    // Implementation for exporting schedule
    console.log('Exporting schedule...');
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleTimeOffAction = (requestId: string, action: 'approve' | 'deny') => {
    // Implementation for handling time-off requests
    console.log(`${action} time-off request ${requestId}`);
  };

  const getShiftStyle = (type: string) => {
    switch (type) {
      case '9AM - 5PM':
        return { backgroundColor: '#E3F2FD', color: '#1565C0' };
      case '2PM - 10PM':
        return { backgroundColor: '#E8F5E9', color: '#2E7D32' };
      case '6AM - 2PM':
        return { backgroundColor: '#FFF3E0', color: '#E65100' };
      default:
        return { backgroundColor: '#F5F5F5', color: '#424242' };
    }
  };

  const weekDays: WeekDay[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <Box sx={{ p: 3 }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <Typography variant="h5" fontWeight={600}>
          Schedule Management
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleCreateShift}
          >
            Create Shift
          </Button>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<ExportIcon />}
            onClick={handleExportSchedule}
          >
            Export Schedule
          </Button>
        </Box>
      </Box>

      <MotionPaper
        sx={{
          mb: 3,
          borderRadius: 2,
          overflow: 'hidden',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box
          sx={{
            p: 2,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: 1,
            borderColor: 'divider',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton onClick={handlePreviousWeek}>
              <ChevronLeft />
            </IconButton>
            <Typography variant="h6">May 2025</Typography>
            <IconButton onClick={handleNextWeek}>
              <ChevronRight />
            </IconButton>
          </Box>
          <ButtonGroup>
            <Button
              variant={viewMode === 'Day' ? 'contained' : 'outlined'}
              onClick={() => setViewMode('Day')}
            >
              Day
            </Button>
            <Button
              variant={viewMode === 'Week' ? 'contained' : 'outlined'}
              onClick={() => setViewMode('Week')}
            >
              Week
            </Button>
            <Button
              variant={viewMode === 'Month' ? 'contained' : 'outlined'}
              onClick={() => setViewMode('Month')}
            >
              Month
            </Button>
          </ButtonGroup>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Employees</TableCell>
                {weekDays.map((day) => (
                  <TableCell key={day} sx={{ fontWeight: 600 }}>
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
                  <TableCell>
                    <Chip label="9AM - 5PM" sx={getShiftStyle('9AM - 5PM')} />
                  </TableCell>
                  <TableCell>
                    <Chip label="9AM - 5PM" sx={getShiftStyle('9AM - 5PM')} />
                  </TableCell>
                  <TableCell>
                    <Chip label="2PM - 10PM" sx={getShiftStyle('2PM - 10PM')} />
                  </TableCell>
                  <TableCell>
                    <Chip label="2PM - 10PM" sx={getShiftStyle('2PM - 10PM')} />
                  </TableCell>
                  <TableCell>
                    <Chip label="6AM - 2PM" sx={getShiftStyle('6AM - 2PM')} />
                  </TableCell>
                  <TableCell>
                    <Chip label="6AM - 2PM" sx={getShiftStyle('6AM - 2PM')} />
                  </TableCell>
                  <TableCell>
                    <Chip label="2PM - 10PM" sx={getShiftStyle('2PM - 10PM')} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </MotionPaper>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <MotionPaper
            sx={{ p: 2, borderRadius: 2 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Typography variant="h6" gutterBottom>
              Employee Availability
            </Typography>
            {employees.map((employee) => (
              <Box
                key={employee.id}
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  py: 1,
                  borderBottom: 1,
                  borderColor: 'divider',
                  '&:last-child': { borderBottom: 0 },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Avatar src={employee.avatar}>{employee.name[0]}</Avatar>
                  <Typography>{employee.name}</Typography>
                </Box>
                <Button
                  variant="text"
                  color="primary"
                  onClick={() => console.log(`View availability for ${employee.name}`)}
                >
                  View Availability
                </Button>
              </Box>
            ))}
          </MotionPaper>
        </Grid>

        <Grid item xs={12} md={6}>
          <MotionPaper
            sx={{ p: 2, borderRadius: 2 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Typography variant="h6" gutterBottom>
              Time-Off Requests
            </Typography>
            {timeOffRequests.map((request) => {
              const employee = employees.find((e) => e.id === request.employeeId);
              return (
                <Box
                  key={request.id}
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    py: 1,
                    borderBottom: 1,
                    borderColor: 'divider',
                    '&:last-child': { borderBottom: 0 },
                  }}
                >
                  <Box>
                    <Typography variant="subtitle2">{employee?.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {request.startDate} - {request.endDate}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      variant="contained"
                      color="success"
                      size="small"
                      onClick={() => handleTimeOffAction(request.id, 'approve')}
                    >
                      Approve
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      size="small"
                      onClick={() => handleTimeOffAction(request.id, 'deny')}
                    >
                      Deny
                    </Button>
                  </Box>
                </Box>
              );
            })}
          </MotionPaper>
        </Grid>
      </Grid>

      {/* Create/Edit Shift Dialog */}
      <Dialog
        open={openShiftDialog}
        onClose={() => setOpenShiftDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Create New Shift</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              select
              label="Employee"
              fullWidth
              value={selectedEmployee}
              onChange={(e) => setSelectedEmployee(e.target.value)}
            >
              {employees.map((employee) => (
                <MenuItem key={employee.id} value={employee.id}>
                  {employee.name}
                </MenuItem>
              ))}
            </TextField>
            <TextField select label="Shift Type" fullWidth>
              <MenuItem value="morning">Morning (9AM - 5PM)</MenuItem>
              <MenuItem value="afternoon">Afternoon (2PM - 10PM)</MenuItem>
              <MenuItem value="night">Night (6AM - 2PM)</MenuItem>
            </TextField>
            <DatePicker
              label="Date"
              value={currentDate}
              onChange={(newValue) => {
                if (newValue) {
                  setCurrentDate(newValue);
                }
              }}
              renderInput={(params) => <TextField {...params} fullWidth />}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenShiftDialog(false)}>Cancel</Button>
          <Button variant="contained" color="primary">
            Save Shift
          </Button>
        </DialogActions>
      </Dialog>

      {/* Actions Menu */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={handleMenuClose}>
          <SwapIcon sx={{ mr: 1 }} /> Swap Shift
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <BlockIcon sx={{ mr: 1 }} /> Block Time
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <EventIcon sx={{ mr: 1 }} /> Copy Schedule
        </MenuItem>
      </Menu>
    </Box>
  );
}
