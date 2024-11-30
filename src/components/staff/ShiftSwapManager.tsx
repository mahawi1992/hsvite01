import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Autocomplete,
  Chip,
  Alert,
} from '@mui/material';
import type { StaffMember, Shift } from '../../lib/types/staff';
import { notificationService } from '../../services/notification';

interface ShiftSwapManagerProps {
  staff: StaffMember | null;
  date: Date;
}

interface SwapRequest {
  id: string;
  requestingStaffId: string;
  requestingStaffName: string;
  targetStaffId: string;
  targetStaffName: string;
  shiftDate: string;
  shiftType: string;
  status: 'pending' | 'approved' | 'rejected';
  reason?: string;
}

export function ShiftSwapManager({ staff, date }: ShiftSwapManagerProps) {
  const [availableStaff, setAvailableStaff] = useState<StaffMember[]>([]);
  const [swapRequests, setSwapRequests] = useState<SwapRequest[]>([]);
  const [showSwapDialog, setShowSwapDialog] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  const [swapReason, setSwapReason] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // In a real app, fetch available staff and swap requests from your API
    // For now, using mock data
    setAvailableStaff([
      {
        id: '2',
        name: 'Jane Smith',
        role: 'Nurse',
        department: 'Emergency',
        email: 'jane@example.com',
        points: 2,
        shifts: [],
      },
      {
        id: '3',
        name: 'Bob Johnson',
        role: 'Nurse',
        department: 'ICU',
        email: 'bob@example.com',
        points: 1,
        shifts: [],
      },
    ]);

    setSwapRequests([
      {
        id: '1',
        requestingStaffId: '1',
        requestingStaffName: 'John Doe',
        targetStaffId: '2',
        targetStaffName: 'Jane Smith',
        shiftDate: '2024-02-01',
        shiftType: 'Morning',
        status: 'pending',
        reason: 'Family emergency',
      },
    ]);
  }, []);

  const handleRequestSwap = async () => {
    if (!staff || !selectedStaff) return;

    setLoading(true);
    try {
      // In a real app, make an API call to create the swap request
      const newRequest: SwapRequest = {
        id: (swapRequests.length + 1).toString(),
        requestingStaffId: staff.id,
        requestingStaffName: staff.name,
        targetStaffId: selectedStaff.id,
        targetStaffName: selectedStaff.name,
        shiftDate: date.toISOString().split('T')[0],
        shiftType: 'Morning', // This should come from the actual shift
        status: 'pending',
        reason: swapReason,
      };

      setSwapRequests([...swapRequests, newRequest]);

      // Send notifications
      await notificationService.sendNotification(
        staff,
        `Your shift swap request with ${selectedStaff.name} has been submitted.`,
        {
          channels: ['IN_APP', 'EMAIL'],
          priority: 'MEDIUM',
          type: 'INFO',
        }
      );

      await notificationService.sendNotification(
        selectedStaff,
        `${staff.name} has requested to swap shifts with you for ${date.toLocaleDateString()}.`,
        {
          channels: ['IN_APP', 'EMAIL'],
          priority: 'HIGH',
          type: 'ALERT',
        }
      );

      setShowSwapDialog(false);
      setSelectedStaff(null);
      setSwapReason('');
    } catch (error) {
      console.error('Error requesting shift swap:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRespondToSwap = async (requestId: string, approve: boolean) => {
    if (!staff) return;

    setLoading(true);
    try {
      // In a real app, make an API call to update the swap request
      const updatedRequests = swapRequests.map((request) =>
        request.id === requestId
          ? { ...request, status: approve ? 'approved' : 'rejected' }
          : request
      );
      setSwapRequests(updatedRequests);

      const request = swapRequests.find((r) => r.id === requestId);
      if (!request) return;

      // Send notification to the requesting staff
      const targetStaff: StaffMember = {
        id: request.requestingStaffId,
        name: request.requestingStaffName,
        role: 'Unknown',
        department: 'Unknown',
        email: 'unknown@example.com',
        points: 0,
        shifts: [],
      };

      await notificationService.sendNotification(
        targetStaff,
        `Your shift swap request for ${request.shiftDate} has been ${approve ? 'approved' : 'rejected'} by ${staff.name}.`,
        {
          channels: ['IN_APP', 'EMAIL'],
          priority: 'HIGH',
          type: approve ? 'SUCCESS' : 'ALERT',
        }
      );
    } catch (error) {
      console.error('Error responding to shift swap:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Shift Swaps
        </Typography>

        {staff && (
          <Button
            variant="contained"
            color="primary"
            onClick={() => setShowSwapDialog(true)}
            sx={{ mb: 2 }}
          >
            Request Shift Swap
          </Button>
        )}

        <List>
          {swapRequests.map((request) => (
            <ListItem key={request.id}>
              <ListItemText
                primary={
                  <>
                    {request.requestingStaffName} ↔ {request.targetStaffName}
                    <Chip
                      label={request.status}
                      color={
                        request.status === 'approved'
                          ? 'success'
                          : request.status === 'rejected'
                            ? 'error'
                            : 'warning'
                      }
                      size="small"
                      sx={{ ml: 1 }}
                    />
                  </>
                }
                secondary={
                  <>
                    {new Date(request.shiftDate).toLocaleDateString()}
                    {' • '}
                    {request.shiftType}
                    {request.reason && (
                      <>
                        {' • '}
                        Reason: {request.reason}
                      </>
                    )}
                  </>
                }
              />
              {staff && request.targetStaffId === staff.id && request.status === 'pending' && (
                <ListItemSecondaryAction>
                  <Button
                    variant="outlined"
                    color="success"
                    size="small"
                    onClick={() => handleRespondToSwap(request.id, true)}
                    disabled={loading}
                    sx={{ mr: 1 }}
                  >
                    Approve
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    onClick={() => handleRespondToSwap(request.id, false)}
                    disabled={loading}
                  >
                    Reject
                  </Button>
                </ListItemSecondaryAction>
              )}
            </ListItem>
          ))}
        </List>

        {swapRequests.length === 0 && (
          <Alert severity="info" sx={{ mt: 2 }}>
            No shift swap requests at this time.
          </Alert>
        )}

        <Dialog open={showSwapDialog} onClose={() => setShowSwapDialog(false)}>
          <DialogTitle>Request Shift Swap</DialogTitle>
          <DialogContent>
            <Autocomplete
              options={availableStaff}
              getOptionLabel={(option) => `${option.name} (${option.role} - ${option.department})`}
              value={selectedStaff}
              onChange={(_, newValue) => setSelectedStaff(newValue)}
              renderInput={(params) => (
                <TextField {...params} margin="dense" label="Swap With" fullWidth />
              )}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              label="Reason for Swap"
              type="text"
              fullWidth
              multiline
              rows={3}
              value={swapReason}
              onChange={(e) => setSwapReason(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowSwapDialog(false)}>Cancel</Button>
            <Button
              onClick={handleRequestSwap}
              disabled={!selectedStaff || loading}
              variant="contained"
            >
              Request Swap
            </Button>
          </DialogActions>
        </Dialog>
      </CardContent>
    </Card>
  );
}
