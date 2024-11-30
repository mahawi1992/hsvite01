import { useState } from 'react';
import {
  Card,
  CardContent,
  Button,
  Chip,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Alert,
  Snackbar,
} from '@mui/material';
import { format } from 'date-fns';
import type { Attendance, StaffMember, Shift, AttendanceStatus } from '../../lib/types/staff';
import { ATTENDANCE_RULES } from '../../lib/scheduling/attendance-rules';
import { createAttendance, checkConsecutiveCallOffs } from '../../services/attendance';
import { notificationService } from '../../services/notification';

interface AttendanceTrackerProps {
  staff: StaffMember;
  shift: Shift;
  onUpdate?: (attendance: Attendance) => void;
}

export function AttendanceTracker({ staff, shift, onUpdate }: AttendanceTrackerProps) {
  const [attendance, setAttendance] = useState<Attendance | null>(null);
  const [loading, setLoading] = useState(false);
  const [showCallOffDialog, setShowCallOffDialog] = useState(false);
  const [callOffReason, setCallOffReason] = useState('');
  const [showSwapDialog, setShowSwapDialog] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [swapWithStaffId, setSwapWithStaffId] = useState('');
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'warning' | 'error';
  }>({ open: false, message: '', severity: 'success' });

  // Calculate minutes late based on shift start time and clock in time
  function calculateTardyMinutes(clockIn: Date): number {
    const shiftStart = new Date(`${shift.date}T${shift.startTime}`);
    return Math.floor((clockIn.getTime() - shiftStart.getTime()) / (1000 * 60));
  }

  // Calculate points based on attendance type and circumstances
  function getPoints(status: AttendanceStatus, tardyMinutes?: number): number {
    switch (status) {
      case 'ON_TIME':
        return ATTENDANCE_RULES.ON_TIME.POINTS;

      case 'TARDY':
        if (!tardyMinutes) return ATTENDANCE_RULES.TARDY.POINTS;
        if (tardyMinutes <= 15) return ATTENDANCE_RULES.TARDY.UNDER_15_MIN;
        if (tardyMinutes <= 30) return ATTENDANCE_RULES.TARDY.OVER_15_MIN;
        return ATTENDANCE_RULES.TARDY.OVER_30_MIN;

      case 'LEFT_EARLY':
        if (!tardyMinutes) return ATTENDANCE_RULES.LEFT_EARLY.POINTS;
        if (tardyMinutes <= 15) return ATTENDANCE_RULES.LEFT_EARLY.UNDER_15_MIN;
        if (tardyMinutes <= 30) return ATTENDANCE_RULES.LEFT_EARLY.OVER_15_MIN;
        return ATTENDANCE_RULES.LEFT_EARLY.OVER_30_MIN;

      case 'NO_CALL_NO_SHOW':
        return ATTENDANCE_RULES.NO_SHOW.POINTS;

      case 'CALLED_OFF':
        return ATTENDANCE_RULES.CALLED_OFF.WITH_APPROVAL;

      case 'COMPLETED':
        return ATTENDANCE_RULES.COMPLETED.POINTS;

      default:
        return 0;
    }
  }

  // Calculate expiration date based on attendance type
  function calculateExpirationDate(status: AttendanceStatus, date: Date): Date {
    const expirationDate = new Date(date);

    switch (status) {
      case 'CALLED_OFF':
        expirationDate.setDate(
          expirationDate.getDate() + ATTENDANCE_RULES.CALLED_OFF.EXPIRATION_DAYS
        );
        break;
      case 'NO_CALL_NO_SHOW':
      case 'TARDY':
      case 'LEFT_EARLY':
        // Default expiration is 30 days
        expirationDate.setDate(expirationDate.getDate() + 30);
        break;
      default:
        // For other statuses, points don't expire
        expirationDate.setFullYear(expirationDate.getFullYear() + 1);
    }

    return expirationDate;
  }

  async function handleClockIn() {
    setLoading(true);
    try {
      const now = new Date();
      const shiftStart = new Date(`${shift.date}T${shift.startTime}`);
      const tardyMinutes = Math.max(0, calculateTardyMinutes(now));
      const status = tardyMinutes > ATTENDANCE_RULES.TARDY.THRESHOLD_MINUTES ? 'TARDY' : 'ON_TIME';
      const points = getPoints(status, tardyMinutes);

      const newAttendance = await createAttendance({
        staffId: staff.id,
        shiftId: shift.id,
        date: now,
        clockIn: now,
        status,
        points,
        tardyMinutes: status === 'TARDY' ? tardyMinutes : undefined,
      });

      setAttendance(newAttendance);
      onUpdate?.(newAttendance);

      // Send notification if tardy
      if (status === 'TARDY') {
        await notificationService.sendNotification(
          staff,
          `You clocked in ${tardyMinutes} minutes late. ${points} points have been added to your record.`,
          {
            channels: ['IN_APP', 'EMAIL'],
            priority: 'HIGH',
            type: 'ALERT',
          }
        );
      }

      setSnackbar({
        open: true,
        message:
          status === 'TARDY'
            ? `Clocked in ${tardyMinutes} minutes late. ${points} points added.`
            : 'Clocked in on time',
        severity: status === 'TARDY' ? 'warning' : 'success',
      });
    } catch (error) {
      console.error('Error clocking in:', error);
      setSnackbar({
        open: true,
        message: 'Failed to clock in',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleCallOff(reason: string) {
    setLoading(true);
    try {
      const now = new Date();
      const shiftStart = new Date(`${shift.date}T${shift.startTime}`);
      const hasNotice = shiftStart.getTime() - now.getTime() >= 24 * 60 * 60 * 1000; // 24 hours notice
      const isConsecutive = await checkConsecutiveCallOffs(staff.id, shift.date.toString());
      const points = getPoints('CALLED_OFF');
      const expirationDate = calculateExpirationDate('CALLED_OFF', now);

      const newAttendance = await createAttendance({
        staffId: staff.id,
        shiftId: shift.id,
        date: now,
        status: 'CALLED_OFF',
        points,
        callOffReason: reason,
        notificationTime: now,
        expirationDate,
      });

      setAttendance(newAttendance);
      onUpdate?.(newAttendance);
      setShowCallOffDialog(false);

      // Send notification for call-off
      await notificationService.sendNotification(
        staff,
        `Your call-off has been recorded. ${points} points have been added to your record${isConsecutive ? ' (consecutive call-off)' : ''}.`,
        {
          channels: ['IN_APP', 'EMAIL'],
          priority: isConsecutive ? 'HIGH' : 'MEDIUM',
          type: 'ALERT',
        }
      );

      setSnackbar({
        open: true,
        message: `Call-off recorded with ${points} points${isConsecutive ? ' (consecutive)' : ''}`,
        severity: 'warning',
      });
    } catch (error) {
      console.error('Error recording call-off:', error);
      setSnackbar({
        open: true,
        message: 'Failed to record call-off',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleNoCallNoShow() {
    setLoading(true);
    try {
      const now = new Date();
      const points = getPoints('NO_CALL_NO_SHOW');
      const expirationDate = calculateExpirationDate('NO_CALL_NO_SHOW', now);

      const newAttendance = await createAttendance({
        staffId: staff.id,
        shiftId: shift.id,
        date: now,
        status: 'NO_CALL_NO_SHOW',
        points,
        expirationDate,
      });

      setAttendance(newAttendance);
      onUpdate?.(newAttendance);

      // Send urgent notification for no-call-no-show
      await notificationService.sendNotification(
        staff,
        `You have been marked as a no-call-no-show. ${points} points have been added to your record.`,
        {
          channels: ['IN_APP', 'EMAIL', 'SMS'],
          priority: 'URGENT',
          type: 'ALERT',
        }
      );

      setSnackbar({
        open: true,
        message: `Recorded no-call-no-show. ${points} points added.`,
        severity: 'error',
      });
    } catch (error) {
      console.error('Error recording no-call-no-show:', error);
      setSnackbar({
        open: true,
        message: 'Failed to record no-call-no-show',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleShiftCancel(reason: string) {
    setLoading(true);
    try {
      const now = new Date();
      const shiftStart = new Date(`${shift.date}T${shift.startTime}`);
      const hasNotice = shiftStart.getTime() - now.getTime() >= 24 * 60 * 60 * 1000; // 24 hours notice
      const points = hasNotice ? 0 : ATTENDANCE_RULES.CALLED_OFF.WITHOUT_APPROVAL;
      const expirationDate = calculateExpirationDate('CALLED_OFF', now);

      const newAttendance = await createAttendance({
        staffId: staff.id,
        shiftId: shift.id,
        date: now,
        status: 'CALLED_OFF',
        points,
        cancelReason: reason,
        notificationTime: now,
        expirationDate,
        isCancelled: true,
      });

      setAttendance(newAttendance);
      onUpdate?.(newAttendance);
      setShowCancelDialog(false);

      // Send notification for shift cancellation
      await notificationService.sendNotification(
        staff,
        `Your shift has been cancelled. ${points > 0 ? `${points} points have been added to your record.` : 'No points added (sufficient notice provided).'}`,
        {
          channels: ['IN_APP', 'EMAIL'],
          priority: hasNotice ? 'MEDIUM' : 'HIGH',
          type: 'ALERT',
        }
      );

      setSnackbar({
        open: true,
        message: `Shift cancelled${points > 0 ? ` with ${points} points` : ' (no points added)'}`,
        severity: hasNotice ? 'warning' : 'error',
      });
    } catch (error) {
      console.error('Error cancelling shift:', error);
      setSnackbar({
        open: true,
        message: 'Failed to cancel shift',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleShiftSwap(targetStaffId: string) {
    setLoading(true);
    try {
      const now = new Date();

      const newAttendance = await createAttendance({
        staffId: staff.id,
        shiftId: shift.id,
        date: now,
        status: 'SWAPPED',
        points: 0,
        swapWithStaffId: targetStaffId,
        notificationTime: now,
        isSwapped: true,
      });

      setAttendance(newAttendance);
      onUpdate?.(newAttendance);
      setShowSwapDialog(false);

      // Send notifications for shift swap
      await notificationService.sendNotification(
        staff,
        `Your shift has been swapped with staff ID: ${targetStaffId}`,
        {
          channels: ['IN_APP', 'EMAIL'],
          priority: 'MEDIUM',
          type: 'INFO',
        }
      );

      setSnackbar({
        open: true,
        message: 'Shift successfully swapped',
        severity: 'success',
      });
    } catch (error) {
      console.error('Error swapping shift:', error);
      setSnackbar({
        open: true,
        message: 'Failed to swap shift',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Attendance Tracker
          {attendance?.status && (
            <Chip
              label={attendance.status}
              color={
                attendance.status === 'ON_TIME'
                  ? 'success'
                  : attendance.status === 'NO_CALL_NO_SHOW'
                    ? 'error'
                    : 'warning'
              }
              sx={{ ml: 1 }}
            />
          )}
        </Typography>

        <div>
          <Typography variant="subtitle1" gutterBottom>
            Points: {attendance?.points || 0}
            {attendance?.status === 'NO_CALL_NO_SHOW' && attendance.expirationDate && (
              <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                (Expires: {format(new Date(attendance.expirationDate), 'MM/dd/yyyy')})
              </Typography>
            )}
            {attendance?.points &&
              attendance.points >= ATTENDANCE_RULES.CONSEQUENCES.WARNING_THRESHOLD && (
                <Chip
                  label={
                    attendance.points >= ATTENDANCE_RULES.CONSEQUENCES.TERMINATION_THRESHOLD
                      ? 'Termination Warning'
                      : attendance.points >= ATTENDANCE_RULES.CONSEQUENCES.PROBATION_THRESHOLD
                        ? 'Probation Warning'
                        : 'Points Warning'
                  }
                  color="error"
                  size="small"
                  sx={{ ml: 1 }}
                />
              )}
          </Typography>
        </div>

        <div style={{ marginTop: '1rem' }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleClockIn}
            disabled={loading || !!attendance || attendance?.isCancelled || attendance?.isSwapped}
            sx={{ mr: 1 }}
          >
            Clock In
          </Button>
          <Button
            variant="outlined"
            color="warning"
            onClick={() => setShowCallOffDialog(true)}
            disabled={loading || !!attendance || attendance?.isCancelled || attendance?.isSwapped}
            sx={{ mr: 1 }}
          >
            Call Off
          </Button>
          <Button
            variant="outlined"
            color="error"
            onClick={handleNoCallNoShow}
            disabled={loading || !!attendance || attendance?.isCancelled || attendance?.isSwapped}
            sx={{ mr: 1 }}
          >
            No Call No Show
          </Button>
          <Button
            variant="outlined"
            color="info"
            onClick={() => setShowSwapDialog(true)}
            disabled={loading || !!attendance || attendance?.isCancelled}
            sx={{ mr: 1 }}
          >
            Swap Shift
          </Button>
          <Button
            variant="outlined"
            color="error"
            onClick={() => setShowCancelDialog(true)}
            disabled={loading || !!attendance || attendance?.isSwapped}
          >
            Cancel Shift
          </Button>
        </div>

        <Dialog open={showCallOffDialog} onClose={() => setShowCallOffDialog(false)}>
          <DialogTitle>Call Off Shift</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Reason for Call Off"
              type="text"
              fullWidth
              multiline
              rows={4}
              value={callOffReason}
              onChange={(e) => setCallOffReason(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowCallOffDialog(false)}>Cancel</Button>
            <Button
              onClick={() => handleCallOff(callOffReason)}
              disabled={!callOffReason.trim()}
              color="primary"
            >
              Submit
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={showCancelDialog} onClose={() => setShowCancelDialog(false)}>
          <DialogTitle>Cancel Shift</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Reason for Cancellation"
              type="text"
              fullWidth
              multiline
              rows={4}
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowCancelDialog(false)}>Cancel</Button>
            <Button
              onClick={() => handleShiftCancel(cancelReason)}
              disabled={!cancelReason.trim()}
              color="primary"
            >
              Submit
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={showSwapDialog} onClose={() => setShowSwapDialog(false)}>
          <DialogTitle>Swap Shift</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Staff ID to Swap With"
              type="text"
              fullWidth
              value={swapWithStaffId}
              onChange={(e) => setSwapWithStaffId(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowSwapDialog(false)}>Cancel</Button>
            <Button
              onClick={() => handleShiftSwap(swapWithStaffId)}
              disabled={!swapWithStaffId.trim()}
              color="primary"
            >
              Submit
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        >
          <Alert
            onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
            severity={snackbar.severity}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </CardContent>
    </Card>
  );
}
