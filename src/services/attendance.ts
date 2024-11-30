import type { Attendance, AttendanceStatus } from '../lib/types/staff';

// In-memory storage for demo purposes
// In a real app, this would be a database
let attendanceRecords: Attendance[] = [];
let nextId = 1;

export async function createAttendance(data: Omit<Attendance, 'id'>): Promise<Attendance> {
  const attendance: Attendance = {
    id: String(nextId++),
    ...data,
  };
  attendanceRecords.push(attendance);
  return attendance;
}

export async function checkConsecutiveCallOffs(staffId: string, date: string): Promise<boolean> {
  const previousDay = new Date(date);
  previousDay.setDate(previousDay.getDate() - 1);

  return attendanceRecords.some(
    (record) =>
      record.staffId === staffId &&
      record.status === 'CALLED_OFF' &&
      new Date(record.date).toDateString() === previousDay.toDateString()
  );
}

export async function getAttendanceByStaffId(staffId: string): Promise<Attendance[]> {
  return attendanceRecords.filter((record) => record.staffId === staffId);
}

export async function updateAttendance(id: string, data: Partial<Attendance>): Promise<Attendance> {
  const index = attendanceRecords.findIndex((record) => record.id === id);
  if (index === -1) throw new Error('Attendance record not found');

  attendanceRecords[index] = {
    ...attendanceRecords[index],
    ...data,
  };

  return attendanceRecords[index];
}
