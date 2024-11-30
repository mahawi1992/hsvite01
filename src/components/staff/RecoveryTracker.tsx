import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import {
  EventAvailable as EventAvailableIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';
import type { StaffMember } from '../../lib/types/staff';
import { notificationService } from '../../services/notification';

interface RecoveryShift {
  id: string;
  date: string;
  type: string;
  department: string;
  pointsRecoverable: number;
  status: 'available' | 'claimed' | 'completed';
}

interface RecoveryTrackerProps {
  staffId: string;
}

export function RecoveryTracker({ staffId }: RecoveryTrackerProps) {
  const [staff, setStaff] = useState<StaffMember | null>(null);
  const [recoveryShifts, setRecoveryShifts] = useState<RecoveryShift[]>([]);
  const [showClaimDialog, setShowClaimDialog] = useState(false);
  const [selectedShift, setSelectedShift] = useState<RecoveryShift | null>(null);
  const [claimNotes, setClaimNotes] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // In a real app, fetch staff and recovery shifts from your API
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

    setRecoveryShifts([
      {
        id: '1',
        date: '2024-02-01',
        type: 'Extra Shift',
        department: 'Emergency',
        pointsRecoverable: 1,
        status: 'available',
      },
      {
        id: '2',
        date: '2024-02-05',
        type: 'Coverage',
        department: 'ICU',
        pointsRecoverable: 2,
        status: 'claimed',
      },
      {
        id: '3',
        date: '2024-01-28',
        type: 'Extra Shift',
        department: 'Emergency',
        pointsRecoverable: 1,
        status: 'completed',
      },
    ]);
  }, [staffId]);

  const handleClaimShift = async () => {
    if (!selectedShift || !staff) return;

    setLoading(true);
    try {
      // In a real app, make an API call to claim the shift
      const updatedShifts = recoveryShifts.map((shift) =>
        shift.id === selectedShift.id ? { ...shift, status: 'claimed' } : shift
      );
      setRecoveryShifts(updatedShifts);

      // Send notification
      await notificationService.sendNotification(
        staff,
        `You have claimed a recovery shift for ${selectedShift.date}. Complete this shift to recover ${selectedShift.pointsRecoverable} points.`,
        {
          channels: ['IN_APP', 'EMAIL'],
          priority: 'MEDIUM',
          type: 'INFO',
        }
      );

      setShowClaimDialog(false);
      setSelectedShift(null);
      setClaimNotes('');
    } catch (error) {
      console.error('Error claiming recovery shift:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: RecoveryShift['status']) => {
    switch (status) {
      case 'available':
        return <EventAvailableIcon color="primary" />;
      case 'claimed':
        return <ScheduleIcon color="warning" />;
      case 'completed':
        return <CheckCircleIcon color="success" />;
    }
  };

  const getStatusColor = (status: RecoveryShift['status']) => {
    switch (status) {
      case 'available':
        return 'primary';
      case 'claimed':
        return 'warning';
      case 'completed':
        return 'success';
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Points Recovery Opportunities
        </Typography>

        <List>
          {recoveryShifts.map((shift) => (
            <ListItem
              key={shift.id}
              secondaryAction={
                shift.status === 'available' && (
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => {
                      setSelectedShift(shift);
                      setShowClaimDialog(true);
                    }}
                  >
                    Claim
                  </Button>
                )
              }
            >
              <ListItemIcon>{getStatusIcon(shift.status)}</ListItemIcon>
              <ListItemText
                primary={
                  <>
                    {shift.type}
                    <Chip
                      label={shift.status}
                      color={getStatusColor(shift.status)}
                      size="small"
                      sx={{ ml: 1 }}
                    />
                  </>
                }
                secondary={
                  <>
                    {new Date(shift.date).toLocaleDateString()}
                    {' • '}
                    {shift.department}
                    {' • '}
                    {shift.pointsRecoverable} point{shift.pointsRecoverable !== 1 && 's'}{' '}
                    recoverable
                  </>
                }
              />
            </ListItem>
          ))}
        </List>

        <Dialog open={showClaimDialog} onClose={() => setShowClaimDialog(false)}>
          <DialogTitle>Claim Recovery Shift</DialogTitle>
          <DialogContent>
            <Typography variant="body2" color="text.secondary" paragraph>
              Claiming this shift will allow you to recover {selectedShift?.pointsRecoverable} point
              {selectedShift?.pointsRecoverable !== 1 && 's'} upon completion.
            </Typography>
            <TextField
              autoFocus
              margin="dense"
              label="Notes (optional)"
              type="text"
              fullWidth
              multiline
              rows={3}
              value={claimNotes}
              onChange={(e) => setClaimNotes(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowClaimDialog(false)}>Cancel</Button>
            <Button onClick={handleClaimShift} disabled={loading} variant="contained">
              Claim Shift
            </Button>
          </DialogActions>
        </Dialog>
      </CardContent>
    </Card>
  );
}
