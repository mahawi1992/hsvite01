import { useState } from 'react';
import {
  Paper,
  Grid,
  Typography,
  Box,
  Card,
  CardContent,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  useTheme,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

interface Staff {
  id: string;
  name: string;
  role: string;
  department: string;
}

interface Shift {
  id: string;
  staffId: string;
  date: string;
  shift: 'Morning' | 'Evening' | 'Night';
  department: string;
}

// Sample data
const sampleStaff: Staff[] = [
  { id: '1', name: 'John Doe', role: 'Nurse', department: 'Emergency' },
  { id: '2', name: 'Jane Smith', role: 'Doctor', department: 'ICU' },
  { id: '3', name: 'Mike Johnson', role: 'Nurse', department: 'Emergency' },
  { id: '4', name: 'Sarah Wilson', role: 'Doctor', department: 'ICU' },
];

const sampleShifts: Shift[] = [
  { id: '1', staffId: '1', date: '2024-02-26', shift: 'Morning', department: 'Emergency' },
  { id: '2', staffId: '2', date: '2024-02-26', shift: 'Evening', department: 'ICU' },
  { id: '3', staffId: '3', date: '2024-02-27', shift: 'Night', department: 'Emergency' },
  { id: '4', staffId: '4', date: '2024-02-27', shift: 'Morning', department: 'ICU' },
];

const MotionGrid = motion.create(Grid);
const MotionCard = motion.create(Card);
const MotionPaper = motion.create(Paper);

export function GroupScheduler() {
  const theme = useTheme();
  const [shifts, setShifts] = useState<Shift[]>(sampleShifts);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedShift, setSelectedShift] = useState<Shift | null>(null);
  const [selectedStaff, setSelectedStaff] = useState<string>('');
  const [selectedShiftType, setSelectedShiftType] = useState<'Morning' | 'Evening' | 'Night'>(
    'Morning'
  );

  const handleEditShift = (shift: Shift) => {
    setSelectedShift(shift);
    setSelectedStaff(shift.staffId);
    setSelectedShiftType(shift.shift);
    setOpenDialog(true);
  };

  const handleDeleteShift = (shiftId: string) => {
    setShifts(shifts.filter((s) => s.id !== shiftId));
  };

  const handleSaveShift = () => {
    if (selectedShift) {
      setShifts(
        shifts.map((s) =>
          s.id === selectedShift.id ? { ...s, staffId: selectedStaff, shift: selectedShiftType } : s
        )
      );
    }
    setOpenDialog(false);
  };

  // Group shifts by date
  const shiftsByDate = shifts.reduce(
    (acc, shift) => {
      if (!acc[shift.date]) {
        acc[shift.date] = [];
      }
      acc[shift.date].push(shift);
      return acc;
    },
    {} as Record<string, Shift[]>
  );

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
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            fontWeight: 600,
            color: '#1a237e',
            mb: 4,
          }}
        >
          Staff Schedule
        </Typography>
      </motion.div>

      <Grid container spacing={3}>
        <AnimatePresence>
          {Object.entries(shiftsByDate).map(([date, dateShifts], dateIndex) => (
            <MotionGrid
              item
              xs={12}
              key={date}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, delay: dateIndex * 0.1 }}
            >
              <MotionPaper
                sx={{
                  p: 3,
                  borderRadius: 2,
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                  background: 'white',
                }}
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Typography variant="h6" gutterBottom sx={{ color: theme.palette.primary.main }}>
                  {new Date(date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </Typography>
                <Grid container spacing={2}>
                  <AnimatePresence>
                    {dateShifts.map((shift, shiftIndex) => {
                      const staff = sampleStaff.find((s) => s.id === shift.staffId);
                      return (
                        <MotionGrid
                          item
                          xs={12}
                          sm={6}
                          md={4}
                          key={shift.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{ duration: 0.3, delay: shiftIndex * 0.1 }}
                        >
                          <MotionCard
                            sx={{
                              position: 'relative',
                              overflow: 'visible',
                              '&:hover': {
                                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
                                transform: 'translateY(-4px)',
                              },
                              transition: 'all 0.3s ease-in-out',
                            }}
                          >
                            <CardContent>
                              <Box
                                sx={{
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  alignItems: 'center',
                                  mb: 2,
                                }}
                              >
                                <Typography variant="h6" sx={{ color: theme.palette.text.primary }}>
                                  {staff?.name}
                                </Typography>
                                <Box
                                  sx={{
                                    opacity: 0.7,
                                    transition: 'opacity 0.2s',
                                    '&:hover': { opacity: 1 },
                                  }}
                                >
                                  <IconButton
                                    size="small"
                                    onClick={() => handleEditShift(shift)}
                                    sx={{ mr: 1 }}
                                  >
                                    <EditIcon />
                                  </IconButton>
                                  <IconButton
                                    size="small"
                                    onClick={() => handleDeleteShift(shift.id)}
                                    color="error"
                                  >
                                    <DeleteIcon />
                                  </IconButton>
                                </Box>
                              </Box>
                              <Typography color="textSecondary" gutterBottom sx={{ mb: 2 }}>
                                {staff?.role} - {staff?.department}
                              </Typography>
                              <Chip
                                label={shift.shift}
                                color={
                                  shift.shift === 'Morning'
                                    ? 'primary'
                                    : shift.shift === 'Evening'
                                      ? 'secondary'
                                      : 'default'
                                }
                                size="small"
                                sx={{
                                  fontWeight: 500,
                                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                                }}
                              />
                            </CardContent>
                          </MotionCard>
                        </MotionGrid>
                      );
                    })}
                  </AnimatePresence>
                </Grid>
              </MotionPaper>
            </MotionGrid>
          ))}
        </AnimatePresence>
      </Grid>

      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          },
        }}
      >
        <DialogTitle
          sx={{
            background: theme.palette.primary.main,
            color: 'white',
            borderRadius: '8px 8px 0 0',
          }}
        >
          Edit Shift
        </DialogTitle>
        <DialogContent sx={{ pt: 3, width: 300 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Staff Member</InputLabel>
              <Select
                value={selectedStaff}
                onChange={(e) => setSelectedStaff(e.target.value)}
                label="Staff Member"
              >
                {sampleStaff.map((staff) => (
                  <MenuItem key={staff.id} value={staff.id}>
                    {staff.name} - {staff.role}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Shift</InputLabel>
              <Select
                value={selectedShiftType}
                onChange={(e) =>
                  setSelectedShiftType(e.target.value as 'Morning' | 'Evening' | 'Night')
                }
                label="Shift"
              >
                <MenuItem value="Morning">Morning</MenuItem>
                <MenuItem value="Evening">Evening</MenuItem>
                <MenuItem value="Night">Night</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button onClick={() => setOpenDialog(false)} variant="outlined">
            Cancel
          </Button>
          <Button onClick={handleSaveShift} variant="contained">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
