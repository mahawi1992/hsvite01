import { useState, useEffect } from 'react';
import { Card, CardContent, Typography, LinearProgress } from '@mui/material';
import type { StaffMember } from '../../lib/types/staff';
import { ATTENDANCE_RULES } from '../../lib/scheduling/attendance-rules';

interface StaffPointsProps {
  staffId: string;
}

export function StaffPoints({ staffId }: StaffPointsProps) {
  const [staff, setStaff] = useState<StaffMember | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, fetch staff data from your API
    // For now, using mock data
    setStaff({
      id: staffId,
      name: 'John Doe',
      role: 'Nurse',
      department: 'Emergency',
      points: 4,
      email: 'john@example.com',
      shifts: [],
    });
    setLoading(false);
  }, [staffId]);

  if (loading) {
    return <LinearProgress />;
  }

  if (!staff) {
    return <Typography color="error">Staff member not found</Typography>;
  }

  const pointsProgress = (staff.points / ATTENDANCE_RULES.CONSEQUENCES.TERMINATION_THRESHOLD) * 100;
  const pointsStatus =
    staff.points >= ATTENDANCE_RULES.CONSEQUENCES.TERMINATION_THRESHOLD
      ? 'Termination Warning'
      : staff.points >= ATTENDANCE_RULES.CONSEQUENCES.PROBATION_THRESHOLD
        ? 'Probation Warning'
        : staff.points >= ATTENDANCE_RULES.CONSEQUENCES.WARNING_THRESHOLD
          ? 'Points Warning'
          : 'Good Standing';

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Attendance Points
        </Typography>

        <div style={{ marginBottom: '1rem' }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Current Points
          </Typography>
          <Typography variant="h4">
            {staff.points}
            <Typography component="span" variant="body2" color="text.secondary" sx={{ ml: 1 }}>
              / {ATTENDANCE_RULES.CONSEQUENCES.TERMINATION_THRESHOLD}
            </Typography>
          </Typography>
        </div>

        <LinearProgress
          variant="determinate"
          value={pointsProgress}
          color={
            staff.points >= ATTENDANCE_RULES.CONSEQUENCES.TERMINATION_THRESHOLD
              ? 'error'
              : staff.points >= ATTENDANCE_RULES.CONSEQUENCES.PROBATION_THRESHOLD
                ? 'warning'
                : 'primary'
          }
          sx={{ height: 8, borderRadius: 4, mb: 1 }}
        />

        <Typography
          variant="body2"
          color={
            staff.points >= ATTENDANCE_RULES.CONSEQUENCES.TERMINATION_THRESHOLD
              ? 'error'
              : staff.points >= ATTENDANCE_RULES.CONSEQUENCES.PROBATION_THRESHOLD
                ? 'warning.main'
                : 'text.secondary'
          }
        >
          Status: {pointsStatus}
        </Typography>

        <div style={{ marginTop: '1rem' }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Points Thresholds
          </Typography>
          <Typography variant="body2">
            Warning: {ATTENDANCE_RULES.CONSEQUENCES.WARNING_THRESHOLD} points
          </Typography>
          <Typography variant="body2">
            Probation: {ATTENDANCE_RULES.CONSEQUENCES.PROBATION_THRESHOLD} points
          </Typography>
          <Typography variant="body2">
            Termination: {ATTENDANCE_RULES.CONSEQUENCES.TERMINATION_THRESHOLD} points
          </Typography>
        </div>
      </CardContent>
    </Card>
  );
}
