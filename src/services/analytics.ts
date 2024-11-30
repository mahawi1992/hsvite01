interface AnalyticsData {
  departmentId: string;
  startDate: string;
  endDate: string;
}

interface StaffMetrics {
  totalStaff: number;
  activeStaff: number;
  onLeave: number;
  utilization: number;
  byDepartment: Record<string, number>;
  byRole: Record<string, number>;
}

interface ShiftMetrics {
  totalShifts: number;
  filledShifts: number;
  openShifts: number;
  swappedShifts: number;
  cancelledShifts: number;
  byShiftType: Record<string, number>;
}

interface AttendanceMetrics {
  onTime: number;
  late: number;
  noShow: number;
  totalPoints: number;
  averagePointsPerStaff: number;
  recoveryShifts: number;
}

interface CostMetrics {
  totalCost: number;
  regularHours: number;
  overtimeHours: number;
  holidayHours: number;
  byDepartment: Record<string, number>;
}

class AnalyticsService {
  async getStaffMetrics({
    departmentId,
    startDate,
    endDate,
  }: AnalyticsData): Promise<StaffMetrics> {
    const response = await fetch(
      `/api/analytics/staff?departmentId=${departmentId}&startDate=${startDate}&endDate=${endDate}`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch staff metrics');
    }

    return response.json();
  }

  async getShiftMetrics({
    departmentId,
    startDate,
    endDate,
  }: AnalyticsData): Promise<ShiftMetrics> {
    const response = await fetch(
      `/api/analytics/shifts?departmentId=${departmentId}&startDate=${startDate}&endDate=${endDate}`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch shift metrics');
    }

    return response.json();
  }

  async getAttendanceMetrics({
    departmentId,
    startDate,
    endDate,
  }: AnalyticsData): Promise<AttendanceMetrics> {
    const response = await fetch(
      `/api/analytics/attendance?departmentId=${departmentId}&startDate=${startDate}&endDate=${endDate}`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch attendance metrics');
    }

    return response.json();
  }

  async getCostMetrics({ departmentId, startDate, endDate }: AnalyticsData): Promise<CostMetrics> {
    const response = await fetch(
      `/api/analytics/costs?departmentId=${departmentId}&startDate=${startDate}&endDate=${endDate}`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch cost metrics');
    }

    return response.json();
  }

  async generateReport({ departmentId, startDate, endDate }: AnalyticsData): Promise<Blob> {
    const response = await fetch(
      `/api/analytics/report?departmentId=${departmentId}&startDate=${startDate}&endDate=${endDate}`,
      { headers: { Accept: 'application/pdf' } }
    );

    if (!response.ok) {
      throw new Error('Failed to generate report');
    }

    return response.blob();
  }
}

export const analyticsService = new AnalyticsService();
