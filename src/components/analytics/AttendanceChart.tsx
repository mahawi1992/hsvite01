import { useEffect, useState } from 'react';
import { Box, Paper, Typography } from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface AttendanceData {
  date: string;
  onTime: number;
  late: number;
  noShow: number;
}

interface AttendanceChartProps {
  staffId?: string;
  department?: string;
  startDate?: Date;
  endDate?: Date;
}

export function AttendanceChart({
  staffId,
  department,
  startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
  endDate = new Date(),
}: AttendanceChartProps) {
  const [data, setData] = useState<AttendanceData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const queryParams = new URLSearchParams({
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          ...(staffId && { staffId }),
          ...(department && { department }),
        });

        const response = await fetch(`/api/analytics/attendance?${queryParams}`);
        if (!response.ok) throw new Error('Failed to fetch attendance data');

        const jsonData = await response.json();
        setData(jsonData);
      } catch (error) {
        console.error('Error fetching attendance data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [staffId, department, startDate, endDate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Paper sx={{ p: 2, height: '100%' }}>
      <Typography variant="h6" gutterBottom>
        Attendance Trends
      </Typography>
      <Box sx={{ height: 300, width: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="onTime" stroke="#4CAF50" name="On Time" />
            <Line type="monotone" dataKey="late" stroke="#FFC107" name="Late" />
            <Line type="monotone" dataKey="noShow" stroke="#F44336" name="No Show" />
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
}
