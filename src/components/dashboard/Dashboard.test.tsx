import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Dashboard } from './Dashboard';
import { BrowserRouter } from 'react-router-dom';

describe('Dashboard', () => {
  it('renders metric cards', () => {
    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );

    expect(screen.getByText('Total Staff')).toBeInTheDocument();
    expect(screen.getByText('Attendance Rate')).toBeInTheDocument();
    expect(screen.getByText('Open Shifts')).toBeInTheDocument();
  });

  it('displays metric values', () => {
    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );

    expect(screen.getByText('24')).toBeInTheDocument();
    expect(screen.getByText('96%')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });
});
