import { useState } from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Button,
  ButtonGroup,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  TextField,
  Stack,
  Popover,
} from '@mui/material';
import { motion } from 'framer-motion';
import { MetricCard } from './MetricCard';
import { AnalyticsCharts } from './AnalyticsCharts';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import FilterListIcon from '@mui/icons-material/FilterList';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { format } from 'date-fns';

// Sample data
const metrics = {
  totalStaff: {
    title: 'Total Staff',
    value: '156',
    trend: '+12',
    trendLabel: 'from last month',
    trendDirection: 'up' as const,
    details: {
      active: 142,
      onLeave: 8,
      new: 12,
      terminated: 6,
    },
  },
  attendanceRate: {
    title: 'Attendance Rate',
    value: '94%',
    trend: '+2.5%',
    trendLabel: 'from last month',
    trendDirection: 'up' as const,
    details: {
      onTime: '89%',
      late: '5%',
      absent: '6%',
      leaveRequested: '4%',
    },
  },
  totalShifts: {
    title: 'Total Shifts',
    value: '1,284',
    trend: '-56',
    trendLabel: 'from last month',
    trendDirection: 'down' as const,
    details: {
      completed: 1156,
      ongoing: 84,
      upcoming: 44,
      understaffed: 12,
    },
  },
};

const MotionGrid = motion.create(Grid);
const MotionPaper = motion.create(Paper);

interface DateRange {
  startDate: Date | null;
  endDate: Date | null;
}

export function AnalyticsDashboard() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
  const [expandedMetric, setExpandedMetric] = useState<string | null>(null);
  const [filterAnchorEl, setFilterAnchorEl] = useState<null | HTMLElement>(null);
  const [datePickerAnchor, setDatePickerAnchor] = useState<null | HTMLElement>(null);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleFilterClick = (event: React.MouseEvent<HTMLElement>) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };

  const handleDatePickerClick = (event: React.MouseEvent<HTMLElement>) => {
    setDatePickerAnchor(event.currentTarget);
  };

  const handleDatePickerClose = () => {
    setDatePickerAnchor(null);
  };

  const handleExport = (format: 'pdf' | 'csv' | 'excel') => {
    console.log(`Exporting as ${format}`);
    handleMenuClose();
  };

  const handleMetricClick = (key: string) => {
    setExpandedMetric(expandedMetric === key ? null : key);
  };

  const formatDateRange = () => {
    const [start, end] = dateRange;
    if (!start && !end) return 'Select date range';
    if (!start) return `Until ${format(end!, 'MMM dd, yyyy')}`;
    if (!end) return `From ${format(start, 'MMM dd, yyyy')}`;
    return `${format(start, 'MMM dd, yyyy')} - ${format(end, 'MMM dd, yyyy')}`;
  };

  return (
    <Box
      sx={{
        p: 3,
        background: 'linear-gradient(145deg, #f6f8fc 0%, #ffffff 100%)',
        minHeight: '100vh',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 4,
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: 600,
              color: '#1a237e',
            }}
          >
            Analytics Dashboard
          </Typography>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Tooltip title="Filter">
              <IconButton onClick={handleFilterClick}>
                <FilterListIcon />
              </IconButton>
            </Tooltip>

            <Button
              variant="outlined"
              startIcon={<CalendarTodayIcon />}
              onClick={handleDatePickerClick}
              sx={{ minWidth: 200 }}
            >
              {formatDateRange()}
            </Button>

            <Tooltip title="Export">
              <IconButton onClick={handleMenuClick}>
                <MoreVertIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        <Grid container spacing={3}>
          {Object.entries(metrics).map(([key, metric], index) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              style={{ width: '33.33%', padding: '12px' }}
            >
              <div onClick={() => handleMetricClick(key)}>
                <MetricCard
                  {...metric}
                  expanded={expandedMetric === key}
                  details={metric.details}
                />
              </div>
            </motion.div>
          ))}
        </Grid>

        <Box sx={{ mt: 4 }}>
          <AnalyticsCharts dateRange={dateRange} />
        </Box>

        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
          <MenuItem onClick={() => handleExport('pdf')}>
            <FileDownloadIcon sx={{ mr: 1 }} /> Export as PDF
          </MenuItem>
          <MenuItem onClick={() => handleExport('csv')}>
            <FileDownloadIcon sx={{ mr: 1 }} /> Export as CSV
          </MenuItem>
          <MenuItem onClick={() => handleExport('excel')}>
            <FileDownloadIcon sx={{ mr: 1 }} /> Export as Excel
          </MenuItem>
        </Menu>

        <Menu anchorEl={filterAnchorEl} open={Boolean(filterAnchorEl)} onClose={handleFilterClose}>
          <MenuItem>Department</MenuItem>
          <MenuItem>Shift Type</MenuItem>
          <MenuItem>Staff Role</MenuItem>
          <MenuItem>Location</MenuItem>
        </Menu>

        <Popover
          open={Boolean(datePickerAnchor)}
          anchorEl={datePickerAnchor}
          onClose={handleDatePickerClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          <Box sx={{ p: 2 }}>
            <Stack spacing={2} sx={{ minWidth: 300 }}>
              <TextField
                label="Start Date"
                type="date"
                value={dateRange[0]?.toISOString().split('T')[0] || ''}
                onChange={(e) => {
                  const date = e.target.value ? new Date(e.target.value) : null;
                  setDateRange([date, dateRange[1]]);
                }}
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
              <TextField
                label="End Date"
                type="date"
                value={dateRange[1]?.toISOString().split('T')[0] || ''}
                onChange={(e) => {
                  const date = e.target.value ? new Date(e.target.value) : null;
                  setDateRange([dateRange[0], date]);
                }}
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
              <Button variant="contained" onClick={handleDatePickerClose} fullWidth>
                Apply
              </Button>
            </Stack>
          </Box>
        </Popover>
      </motion.div>
    </Box>
  );
}
