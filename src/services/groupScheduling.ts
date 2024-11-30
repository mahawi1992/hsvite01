interface StaffGroup {
  id: string;
  name: string;
  department: string;
  staffIds: string[];
  shiftPattern?: {
    type: 'fixed' | 'rotating';
    pattern: string[];
    startDate: string;
  };
}

interface GroupScheduleRequest {
  groupId: string;
  startDate: Date;
  endDate: Date;
  pattern?: string[];
  excludeDates?: Date[];
}

interface AvailableShift {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  department: string;
  role: string;
  status: 'OPEN' | 'FILLED' | 'CANCELLED';
}

interface ShiftFilter {
  status?: 'OPEN' | 'FILLED' | 'CANCELLED';
  startDate?: Date;
  endDate?: Date;
  department?: string;
  role?: string;
}

class GroupSchedulingService {
  async createGroup(group: Omit<StaffGroup, 'id'>): Promise<StaffGroup> {
    const response = await fetch('/api/scheduling/groups', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(group),
    });

    if (!response.ok) throw new Error('Failed to create staff group');
    return response.json();
  }

  async getGroup(groupId: string): Promise<StaffGroup> {
    const response = await fetch(`/api/scheduling/groups/${groupId}`);
    if (!response.ok) throw new Error('Failed to get staff group');
    return response.json();
  }

  async updateGroup(groupId: string, updates: Partial<StaffGroup>): Promise<StaffGroup> {
    const response = await fetch(`/api/scheduling/groups/${groupId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });

    if (!response.ok) throw new Error('Failed to update staff group');
    return response.json();
  }

  async deleteGroup(groupId: string): Promise<void> {
    const response = await fetch(`/api/scheduling/groups/${groupId}`, {
      method: 'DELETE',
    });

    if (!response.ok) throw new Error('Failed to delete staff group');
  }

  async listGroups(department?: string): Promise<StaffGroup[]> {
    const url = department
      ? `/api/scheduling/groups?department=${department}`
      : '/api/scheduling/groups';

    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to list staff groups');
    return response.json();
  }

  async scheduleGroup(request: GroupScheduleRequest): Promise<void> {
    const response = await fetch('/api/scheduling/groups/schedule', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });

    if (!response.ok) throw new Error('Failed to schedule group');
  }

  async listAvailableShifts(filters: ShiftFilter = {}): Promise<AvailableShift[]> {
    const queryParams = new URLSearchParams();

    if (filters.status) queryParams.append('status', filters.status);
    if (filters.startDate) queryParams.append('startDate', filters.startDate.toISOString());
    if (filters.endDate) queryParams.append('endDate', filters.endDate.toISOString());
    if (filters.department) queryParams.append('department', filters.department);
    if (filters.role) queryParams.append('role', filters.role);

    const response = await fetch(`/api/scheduling/available-shifts?${queryParams}`);
    if (!response.ok) throw new Error('Failed to list available shifts');
    return response.json();
  }

  async assignShift(shiftId: string, staffId: string): Promise<void> {
    const response = await fetch(`/api/scheduling/shifts/${shiftId}/assign`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ staffId }),
    });

    if (!response.ok) throw new Error('Failed to assign shift');
  }

  async createRotationPattern(
    groupId: string,
    pattern: {
      shifts: Array<{
        dayOffset: number;
        shiftType: string;
        role: string;
      }>;
      rotationLength: number;
      startDate: Date;
    }
  ): Promise<void> {
    const response = await fetch(`/api/scheduling/groups/${groupId}/rotation`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pattern),
    });

    if (!response.ok) throw new Error('Failed to create rotation pattern');
  }

  async getGroupScheduleStats(
    groupId: string,
    startDate: Date,
    endDate: Date
  ): Promise<{
    totalShifts: number;
    filledShifts: number;
    staffDistribution: Record<string, number>;
    shiftTypeDistribution: Record<string, number>;
  }> {
    const response = await fetch(
      `/api/scheduling/groups/${groupId}/stats?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`
    );

    if (!response.ok) throw new Error('Failed to get group schedule stats');
    return response.json();
  }

  async checkGroupWorkload(
    groupId: string,
    startDate: Date,
    endDate: Date
  ): Promise<{
    overworkedStaff: Array<{
      staffId: string;
      consecutiveDays: number;
      totalHours: number;
      overtime: boolean;
    }>;
    underutilizedStaff: Array<{
      staffId: string;
      totalHours: number;
      targetHours: number;
    }>;
  }> {
    const response = await fetch(
      `/api/scheduling/groups/${groupId}/workload?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`
    );

    if (!response.ok) throw new Error('Failed to check group workload');
    return response.json();
  }
}

export const groupSchedulingService = new GroupSchedulingService();
