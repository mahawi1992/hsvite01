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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
} from '@mui/material';
import {
  SwapHoriz as SwapIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { useToastContext } from '../ui/ToastProvider';
import type { StaffMember } from '../../lib/types/staff';

interface ShiftSwap {
  id: string;
  requesterId: string;
  requesterName: string;
  originalShift: {
    date: string;
    startTime: string;
    endTime: string;
    department: string;
  };
  status: 'pending' | 'accepted' | 'rejected' | 'completed';
  responderId?: string;
  responderName?: string;
}

interface ShiftSwapManagerProps {
  staffId: string;
}

export function ShiftSwapManager({ staffId }: ShiftSwapManagerProps) {
  const { toast } = useToastContext();
  const [swapRequests, setSwapRequests] = useState<ShiftSwap[]>([]);
  const [showRequestDialog, setShowRequestDialog] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSwapRequests();
  }, [staffId]);

  const fetchSwapRequests = async () => {
    try {
      const response = await fetch(`/api/shifts/swaps?staffId=${staffId}`);
      if (!response.ok) throw new Error('Failed to fetch swap requests');

      const data = await response.json();
      setSwapRequests(data);
    } catch (error) {
      console.error('Error fetching swap requests:', error);
      toast({
        title: 'Error',
        description: 'Failed to load shift swap requests',
        variant: 'destructive',
      });
    }
  };

  const handleCreateSwapRequest = async () => {
    if (!selectedDate) {
      toast({
        title: 'Error',
        description: 'Please select a date',
        variant: 'destructive',
      });
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('/api/shifts/swaps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          staffId,
          date: selectedDate.toISOString(),
          reason,
        }),
      });

      if (!response.ok) throw new Error('Failed to create swap request');

      toast({
        title: 'Success',
        description: 'Shift swap request created successfully',
        variant: 'success',
      });

      setShowRequestDialog(false);
      setSelectedDate(null);
      setReason('');
      fetchSwapRequests();
    } catch (error) {
      console.error('Error creating swap request:', error);
      toast({
        title: 'Error',
        description: 'Failed to create shift swap request',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRespondToSwap = async (swapId: string, accept: boolean) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/shifts/swaps/${swapId}/respond`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          staffId,
          accept,
        }),
      });

      if (!response.ok) throw new Error('Failed to respond to swap request');

      toast({
        title: 'Success',
        description: `Shift swap request ${accept ? 'accepted' : 'rejected'} successfully`,
        variant: 'success',
      });

      fetchSwapRequests();
    } catch (error) {
      console.error('Error responding to swap request:', error);
      toast({
        title: 'Error',
        description: 'Failed to respond to shift swap request',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Shift Swap Requests
        </Typography>

        <Button
          variant="contained"
          startIcon={<SwapIcon />}
          onClick={() => setShowRequestDialog(true)}
          sx={{ mb: 2 }}
        >
          Request Swap
        </Button>

        <List>
          {swapRequests.map((swap) => (
            <ListItem
              key={swap.id}
              secondaryAction={
                swap.status === 'pending' &&
                swap.requesterId !== staffId && (
                  <>
                    <Button
                      color="success"
                      onClick={() => handleRespondToSwap(swap.id, true)}
                      disabled={loading}
                    >
                      Accept
                    </Button>
                    <Button
                      color="error"
                      onClick={() => handleRespondToSwap(swap.id, false)}
                      disabled={loading}
                    >
                      Reject
                    </Button>
                  </>
                )
              }
            >
              <ListItemIcon>
                {swap.status === 'completed' ? (
                  <CheckCircleIcon color="success" />
                ) : (
                  <ScheduleIcon />
                )}
              </ListItemIcon>
              <ListItemText
                primary={
                  <>
                    <Typography component="span" variant="body1">
                      {swap.requesterName}
                    </Typography>
                    {' requested swap for '}
                    <Typography component="span" variant="body1">
                      {new Date(swap.originalShift.date).toLocaleDateString()}
                    </Typography>
                    <Chip
                      size="small"
                      label={swap.status}
                      color={
                        swap.status === 'completed'
                          ? 'success'
                          : swap.status === 'accepted'
                            ? 'primary'
                            : swap.status === 'rejected'
                              ? 'error'
                              : 'default'
                      }
                      sx={{ ml: 1 }}
                    />
                  </>
                }
                secondary={
                  <>
                    {swap.originalShift.department} - {swap.originalShift.startTime} to{' '}
                    {swap.originalShift.endTime}
                    {swap.responderName && (
                      <Typography component="span" color="textSecondary">
                        {' • Accepted by '}
                        {swap.responderName}
                      </Typography>
                    )}
                  </>
                }
              />
            </ListItem>
          ))}
        </List>

        <Dialog open={showRequestDialog} onClose={() => setShowRequestDialog(false)}>
          <DialogTitle>Request Shift Swap</DialogTitle>
          <DialogContent>
            <TextField
              label="Date"
              type="date"
              fullWidth
              margin="normal"
              InputLabelProps={{ shrink: true }}
              value={selectedDate ? selectedDate.toISOString().split('T')[0] : ''}
              onChange={(e) => setSelectedDate(new Date(e.target.value))}
            />
            <TextField
              label="Reason"
              fullWidth
              margin="normal"
              multiline
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowRequestDialog(false)}>Cancel</Button>
            <Button
              variant="contained"
              onClick={handleCreateSwapRequest}
              disabled={loading || !selectedDate}
            >
              Submit Request
            </Button>
          </DialogActions>
        </Dialog>
      </CardContent>
    </Card>
  );
}
