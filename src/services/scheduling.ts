import { SCHEDULING_RULES } from '../lib/scheduling/rules';
import { notificationService } from './notification';

interface HolidaySchedulingOptions {
  bonusRate?: number;
  volunteerFirst?: boolean;
  rotateFromLast?: boolean;
}

interface StaffAssignment {
  staffId: string;
  shiftId: string;
  date: Date;
  department: string;
}

class SchedulingService {
  private async fetchStaffAssignments(
    holiday: Date,
    department: string
  ): Promise<StaffAssignment[]> {
    const response = await fetch('/api/scheduling/assignments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date: holiday, department }),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch staff assignments');
    }

    return response.json();
  }

  async handleHolidayScheduling(
    holiday: Date,
    department: string,
    options: HolidaySchedulingOptions = {}
  ): Promise<void> {
    const assignments = await this.fetchStaffAssignments(holiday, department);

    // Notify staff of holiday assignments
    for (const assignment of assignments) {
      await notificationService.sendNotification({
        type: 'HOLIDAY_ASSIGNMENT',
        priority: 'HIGH',
        title: 'Holiday Shift Assignment',
        message: `You have been assigned to work on ${holiday.toLocaleDateString()}`,
        data: { shiftId: assignment.shiftId },
        channels: ['EMAIL', 'PUSH', 'IN_APP'],
        userId: assignment.staffId,
      });
    }
  }

  async checkStaffWorkload(staffId: string, startDate: Date, endDate: Date) {
    const response = await fetch(
      `/api/scheduling/workload?staffId=${staffId}&start=${startDate.toISOString()}&end=${endDate.toISOString()}`
    );

    if (!response.ok) {
      throw new Error('Failed to check staff workload');
    }

    const workload = await response.json();
    const maxHours = SCHEDULING_RULES.MAX_CONSECUTIVE_HOURS[workload.role];
    const restHours = SCHEDULING_RULES.MIN_REST_HOURS[workload.role];

    return {
      ...workload,
      isOverworked: workload.consecutiveHours > maxHours,
      needsRest: workload.restBetweenShifts < restHours,
    };
  }

  async generateScheduleStats(departmentId: string, startDate: Date, endDate: Date) {
    const response = await fetch(
      `/api/scheduling/stats?departmentId=${departmentId}&start=${startDate.toISOString()}&end=${endDate.toISOString()}`
    );

    if (!response.ok) {
      throw new Error('Failed to generate schedule stats');
    }

    return response.json();
  }

  async generateCostReport(departmentId: string, startDate: Date, endDate: Date) {
    const response = await fetch(
      `/api/scheduling/costs?departmentId=${departmentId}&start=${startDate.toISOString()}&end=${endDate.toISOString()}`
    );

    if (!response.ok) {
      throw new Error('Failed to generate cost report');
    }

    return response.json();
  }
}

export const schedulingService = new SchedulingService();
