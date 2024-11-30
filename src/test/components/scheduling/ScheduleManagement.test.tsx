import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ScheduleManagement } from '../../../components/scheduling/ScheduleManagement';
import { BrowserRouter } from 'react-router-dom';

describe('ScheduleManagement', () => {
  const mockShifts = [
    {
      id: '1',
      staffId: '1',
      type: 'DAY',
      date: new Date().toISOString().split('T')[0],
      startTime: '09:00',
      endTime: '17:00',
      department: 'Emergency',
      role: 'Nurse',
      status: 'SCHEDULED',
    },
  ];

  const renderWithRouter = (component: React.ReactElement) => {
    return render(<BrowserRouter>{component}</BrowserRouter>);
  };

  it('renders schedule management interface', () => {
    renderWithRouter(<ScheduleManagement />);
    expect(screen.getByText(/Schedule Management/i)).toBeInTheDocument();
  });

  it('displays shift calendar', async () => {
    renderWithRouter(<ScheduleManagement />);
    expect(screen.getByText(/Calendar View/i)).toBeInTheDocument();
  });

  it('allows creating new shifts', async () => {
    renderWithRouter(<ScheduleManagement />);

    const addButton = screen.getByText(/Add Shift/i);
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(screen.getByText(/New Shift/i)).toBeInTheDocument();
    });

    // Fill in shift details
    fireEvent.change(screen.getByLabelText(/Department/i), {
      target: { value: 'Emergency' },
    });
    fireEvent.change(screen.getByLabelText(/Role/i), {
      target: { value: 'Nurse' },
    });

    const submitButton = screen.getByText(/Save/i);
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Shift created successfully/i)).toBeInTheDocument();
    });
  });

  it('handles shift conflicts', async () => {
    renderWithRouter(<ScheduleManagement />);

    // Try to create overlapping shifts
    const addButton = screen.getByText(/Add Shift/i);
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(screen.getByText(/New Shift/i)).toBeInTheDocument();
    });

    // Fill in overlapping shift details
    fireEvent.change(screen.getByLabelText(/Department/i), {
      target: { value: 'Emergency' },
    });
    fireEvent.change(screen.getByLabelText(/Role/i), {
      target: { value: 'Nurse' },
    });

    const submitButton = screen.getByText(/Save/i);
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Shift conflict detected/i)).toBeInTheDocument();
    });
  });

  it('allows filtering shifts by department', async () => {
    renderWithRouter(<ScheduleManagement />);

    const filterSelect = screen.getByLabelText(/Filter by Department/i);
    fireEvent.change(filterSelect, {
      target: { value: 'Emergency' },
    });

    await waitFor(() => {
      const shifts = screen.getAllByTestId('shift-item');
      shifts.forEach((shift) => {
        expect(shift).toHaveTextContent(/Emergency/i);
      });
    });
  });

  it('supports drag and drop shift rescheduling', async () => {
    renderWithRouter(<ScheduleManagement />);

    const shiftElement = screen.getByTestId('shift-1');
    const targetDate = screen.getByTestId('calendar-cell-2023-12-25');

    fireEvent.dragStart(shiftElement);
    fireEvent.drop(targetDate);

    await waitFor(() => {
      expect(screen.getByText(/Shift rescheduled/i)).toBeInTheDocument();
    });
  });
});
