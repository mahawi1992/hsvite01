import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { StaffDashboard } from '../../../components/staff/StaffDashboard';
import { BrowserRouter } from 'react-router-dom';

// Mock the necessary providers and services
vi.mock('../../../services/notification', () => ({
  notificationService: {
    getNotifications: vi.fn().mockResolvedValue([]),
    markAsRead: vi.fn().mockResolvedValue(undefined),
  },
}));

describe('StaffDashboard', () => {
  const renderWithRouter = (component: React.ReactElement) => {
    return render(<BrowserRouter>{component}</BrowserRouter>);
  };

  it('renders staff dashboard with key metrics', async () => {
    renderWithRouter(<StaffDashboard />);

    // Check for main dashboard elements
    expect(screen.getByText(/Staff Dashboard/i)).toBeInTheDocument();
    expect(screen.getByText(/Points/i)).toBeInTheDocument();
    expect(screen.getByText(/Recovery Shifts/i)).toBeInTheDocument();
  });

  it('displays staff schedule', async () => {
    renderWithRouter(<StaffDashboard />);

    // Check for schedule elements
    expect(screen.getByText(/Upcoming Shifts/i)).toBeInTheDocument();
  });

  it('handles shift swap requests', async () => {
    renderWithRouter(<StaffDashboard />);

    const swapButton = screen.getByText(/Request Swap/i);
    expect(swapButton).toBeInTheDocument();

    fireEvent.click(swapButton);

    // Check if swap modal appears
    await waitFor(() => {
      expect(screen.getByText(/Shift Swap Request/i)).toBeInTheDocument();
    });
  });

  it('displays notifications', async () => {
    renderWithRouter(<StaffDashboard />);

    // Check for notifications section
    expect(screen.getByText(/Notifications/i)).toBeInTheDocument();
  });

  it('updates points display when earning points', async () => {
    renderWithRouter(<StaffDashboard />);

    const initialPoints = screen.getByText(/Points:/i);
    expect(initialPoints).toBeInTheDocument();

    // Simulate completing a shift
    const completeShiftButton = screen.getByText(/Complete Shift/i);
    fireEvent.click(completeShiftButton);

    // Check if points increased
    await waitFor(() => {
      const updatedPoints = screen.getByText(/Points:/i);
      expect(updatedPoints).not.toEqual(initialPoints);
    });
  });
});
