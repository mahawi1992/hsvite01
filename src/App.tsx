import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import { ErrorBoundary } from './components/ErrorBoundary';
import { MainLayout } from './components/layout/MainLayout';
import { Dashboard } from './components/dashboard/Dashboard';
import { AttendanceTracker } from './components/attendance/AttendanceTracker';
import { AnalyticsDashboard } from './components/analytics/AnalyticsDashboard';
import { StaffDashboard } from './components/staff/StaffDashboard';
import { ToastProvider } from './components/ui/ToastProvider';
import { NotificationsView } from './components/notifications/NotificationsView';

// Create a theme instance
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

// Sample data for testing
const sampleStaff = {
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
  role: 'Nurse',
  department: 'Emergency',
  employmentType: 'FULL_TIME' as const,
  status: 'ACTIVE' as const,
  certifications: ['RN', 'BLS'],
  experience: 5,
  points: 0,
  recoveryShifts: 0,
  shifts: [],
  createdAt: new Date(),
  updatedAt: new Date(),
};

const sampleShift = {
  id: '1',
  staffId: '1',
  type: 'DAY' as const,
  date: new Date().toISOString().split('T')[0],
  startTime: '09:00',
  endTime: '17:00',
  department: 'Emergency',
  role: 'Nurse',
  status: 'IN_PROGRESS' as const,
};

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider theme={theme}>
        <ToastProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<MainLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="staff" element={<StaffDashboard />} />
                <Route
                  path="scheduling"
                  element={<AttendanceTracker staff={sampleStaff} shift={sampleShift} />}
                />
                <Route path="analytics" element={<AnalyticsDashboard />} />
                <Route path="notifications" element={<NotificationsView />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </ToastProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
