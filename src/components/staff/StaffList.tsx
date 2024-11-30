import { useState, useEffect } from 'react';
import {
  UserIcon,
  PencilIcon,
  TrashIcon,
  ClockIcon,
  CalendarIcon,
} from '@heroicons/react/24/outline';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
  Box,
  Avatar,
  Tooltip,
} from '@mui/material';
import { Button } from '../ui/Button';
import { useToastContext } from '../ui/ToastProvider';

export interface StaffMember {
  id: string;
  name: string;
  role: string;
  department: string;
  status: 'ACTIVE' | 'INACTIVE';
}

interface StaffListProps {
  date?: Date;
  onStaffSelect?: (staff: StaffMember) => void;
  showAttendance?: boolean;
  department?: string;
}

// Sample data
const sampleStaffList: StaffMember[] = [
  {
    id: '1',
    name: 'John Doe',
    role: 'Nurse',
    department: 'Emergency',
    status: 'ACTIVE',
  },
  {
    id: '2',
    name: 'Jane Smith',
    role: 'Doctor',
    department: 'ICU',
    status: 'ACTIVE',
  },
  {
    id: '3',
    name: 'Mike Johnson',
    role: 'Staff',
    department: 'Radiology',
    status: 'ACTIVE',
  },
];

export function StaffList({
  date = new Date(),
  onStaffSelect,
  showAttendance = false,
  department,
}: StaffListProps) {
  const [staff] = useState<StaffMember[]>(sampleStaffList);
  const { showToast } = useToastContext();

  const handleEdit = (staffMember: StaffMember) => {
    showToast({
      message: `Editing ${staffMember.name}`,
      type: 'info',
    });
  };

  const handleDelete = (staffMember: StaffMember) => {
    showToast({
      message: `Deleting ${staffMember.name}`,
      type: 'warning',
    });
  };

  const filteredStaff = department ? staff.filter((s) => s.department === department) : staff;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800';
      case 'INACTIVE':
        return 'bg-red-100 text-red-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Employee
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Role
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Department
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Status
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredStaff.map((staffMember) => (
              <tr
                key={staffMember.id}
                className="hover:bg-gray-50 transition-colors duration-150 ease-in-out"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <Avatar className="h-10 w-10 rounded-full">{staffMember.name[0]}</Avatar>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{staffMember.name}</div>
                      {showAttendance && (
                        <div className="text-sm text-gray-500">Last check-in: Today, 9:00 AM</div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{staffMember.role}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{staffMember.department}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(staffMember.status)}`}
                  >
                    {staffMember.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end items-center space-x-2">
                    <Tooltip title="Edit">
                      <IconButton
                        size="small"
                        onClick={() => handleEdit(staffMember)}
                        className="text-gray-400 hover:text-blue-600"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </IconButton>
                    </Tooltip>
                    {showAttendance && (
                      <Tooltip title="View Schedule">
                        <IconButton
                          size="small"
                          onClick={() => onStaffSelect?.(staffMember)}
                          className="text-gray-400 hover:text-blue-600"
                        >
                          <CalendarIcon className="h-4 w-4" />
                        </IconButton>
                      </Tooltip>
                    )}
                    <Tooltip title="Delete">
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(staffMember)}
                        className="text-gray-400 hover:text-red-600"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </IconButton>
                    </Tooltip>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
