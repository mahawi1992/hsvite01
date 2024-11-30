import { HEALTHCARE_ROLES, DEPARTMENTS } from '../constants/roles';
import { SHIFT_TYPES } from '../scheduling/rules';

export type AttendanceStatus =
  | 'ON_TIME'
  | 'TARDY'
  | 'LEFT_EARLY'
  | 'NO_CALL_NO_SHOW'
  | 'CALLED_OFF'
  | 'COMPLETED'
  | 'SWAPPED';

export interface StaffMember {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  department: string;
  employmentType: 'FULL_TIME' | 'PART_TIME' | 'PRN';
  status: 'ACTIVE' | 'INACTIVE' | 'ON_LEAVE';
  certifications: string[];
  experience: number;
  points: number;
  recoveryShifts: number;
  shifts: Shift[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Shift {
  id: string;
  staffId: string;
  type: keyof typeof SHIFT_TYPES;
  date: string;
  startTime: string;
  endTime: string;
  department: string;
  role: string;
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  notes?: string;
  isCancelled?: boolean;
  isSwapped?: boolean;
  swapWithStaffId?: string;
}

export interface Attendance {
  id: string;
  staffId: string;
  shiftId: string;
  date: Date;
  status: AttendanceStatus;
  clockIn?: Date;
  clockOut?: Date;
  points: number;
  notes?: string;
  callOffReason?: string;
  tardyMinutes?: number;
  cancelReason?: string;
  notificationTime?: Date;
  expirationDate?: Date;
  isCancelled?: boolean;
  isSwapped?: boolean;
  swapWithStaffId?: string;
}
