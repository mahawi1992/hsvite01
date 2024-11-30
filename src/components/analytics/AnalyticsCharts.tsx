import React, { useState, useCallback } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Button,
  ButtonGroup,
  Tooltip,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  Line,
  LineChart,
  Area,
  AreaChart,
} from 'recharts';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import { motion, AnimatePresence } from 'framer-motion';

interface ChartProps {
  data: any[];
  title: string;
  onDrillDown?: (params: any) => void;
  dateRange?: { startDate: Date | null; endDate: Date | null };
}

interface DateRange {
  startDate: Date | null;
  endDate: Date | null;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const MotionPaper = motion.create(Paper);

function InteractiveChart({
  data,
  title,
  type = 'bar',
  onDrillDown,
  dateRange,
}: ChartProps & { type?: 'bar' | 'line' | 'area' | 'pie' }) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedDataPoint, setSelectedDataPoint] = useState<any>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleExport = (format: 'png' | 'svg' | 'csv') => {
    // Implementation for export functionality
    console.log(`Exporting ${title} as ${format}`);
    handleClose();
  };

  const handleDrillDown = useCallback(
    (data: any) => {
      setSelectedDataPoint(data);
      onDrillDown?.(data);
    },
    [onDrillDown]
  );

  const renderChart = () => {
    switch (type) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data} onClick={(data) => handleDrillDown(data)}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" />
              <YAxis />
              <RechartsTooltip
                contentStyle={{
                  background: 'white',
                  border: 'none',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                  borderRadius: 4,
                }}
              />
              <Legend />
              <Bar dataKey="value" fill="#8884d8">
                {data?.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                    cursor="pointer"
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        );

      case 'line':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" />
              <YAxis />
              <RechartsTooltip
                contentStyle={{
                  background: 'white',
                  border: 'none',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                  borderRadius: 4,
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#8884d8"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        );

      case 'area':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" />
              <YAxis />
              <RechartsTooltip
                contentStyle={{
                  background: 'white',
                  border: 'none',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                  borderRadius: 4,
                }}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#8884d8"
                fill="#8884d8"
                fillOpacity={0.3}
              />
            </AreaChart>
          </ResponsiveContainer>
        );

      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                onClick={(data) => handleDrillDown(data)}
              >
                {data?.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                    cursor="pointer"
                  />
                ))}
              </Pie>
              <Legend />
              <RechartsTooltip
                contentStyle={{
                  background: 'white',
                  border: 'none',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                  borderRadius: 4,
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        );
    }
  };

  return (
    <MotionPaper
      sx={{
        p: 2,
        height: '100%',
        borderRadius: 2,
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
      }}
      whileHover={{ boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)' }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2,
        }}
      >
        <Typography variant="h6">{title}</Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <ButtonGroup size="small" variant="outlined">
            <Button>Day</Button>
            <Button>Week</Button>
            <Button>Month</Button>
          </ButtonGroup>
          <IconButton size="small" onClick={handleClick}>
            <MoreVertIcon />
          </IconButton>
        </Box>
      </Box>

      {renderChart()}

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem onClick={() => handleExport('png')}>
          <FileDownloadIcon sx={{ mr: 1 }} /> Export as PNG
        </MenuItem>
        <MenuItem onClick={() => handleExport('svg')}>
          <FileDownloadIcon sx={{ mr: 1 }} /> Export as SVG
        </MenuItem>
        <MenuItem onClick={() => handleExport('csv')}>
          <FileDownloadIcon sx={{ mr: 1 }} /> Export as CSV
        </MenuItem>
      </Menu>

      <AnimatePresence>
        {selectedDataPoint && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Box
              sx={{
                mt: 2,
                pt: 2,
                borderTop: 1,
                borderColor: 'divider',
              }}
            >
              <Typography variant="subtitle2" gutterBottom>
                Selected Data Point Details
              </Typography>
              <Typography variant="body2">{JSON.stringify(selectedDataPoint, null, 2)}</Typography>
            </Box>
          </motion.div>
        )}
      </AnimatePresence>
    </MotionPaper>
  );
}

// Sample data
const sampleBarData = [
  { name: 'Mon', value: 12 },
  { name: 'Tue', value: 19 },
  { name: 'Wed', value: 15 },
  { name: 'Thu', value: 17 },
  { name: 'Fri', value: 14 },
];

const samplePieData = [
  { name: 'Nurses', value: 45 },
  { name: 'Doctors', value: 25 },
  { name: 'Staff', value: 30 },
];

const sampleLineData = [
  { name: 'Week 1', value: 65 },
  { name: 'Week 2', value: 72 },
  { name: 'Week 3', value: 68 },
  { name: 'Week 4', value: 78 },
];

const sampleAreaData = [
  { name: 'Jan', value: 150 },
  { name: 'Feb', value: 180 },
  { name: 'Mar', value: 165 },
  { name: 'Apr', value: 195 },
];

interface AnalyticsChartsProps {
  dateRange?: DateRange;
  onDrillDown?: (params: any) => void;
}

export function AnalyticsCharts({ dateRange, onDrillDown }: AnalyticsChartsProps) {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <InteractiveChart
          data={sampleBarData}
          title="Weekly Staff Attendance"
          type="bar"
          onDrillDown={onDrillDown}
          dateRange={dateRange}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <InteractiveChart
          data={samplePieData}
          title="Staff Distribution"
          type="pie"
          onDrillDown={onDrillDown}
          dateRange={dateRange}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <InteractiveChart
          data={sampleLineData}
          title="Monthly Performance Trend"
          type="line"
          onDrillDown={onDrillDown}
          dateRange={dateRange}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <InteractiveChart
          data={sampleAreaData}
          title="Resource Utilization"
          type="area"
          onDrillDown={onDrillDown}
          dateRange={dateRange}
        />
      </Grid>
    </Grid>
  );
}
