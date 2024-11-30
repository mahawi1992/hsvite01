export interface StaffMember {
  id: string;
  name: string;
  role: string;
  department: string;
  status: 'ACTIVE' | 'INACTIVE' | 'ON_LEAVE';
  email: string;
  phone: string;
  avatar?: string;
  lastCheckIn: string;
  specialties?: string[];
  schedule?: {
    shift: string;
    startTime: string;
    endTime: string;
  };
}

export const sampleStaff: StaffMember[] = [
  {
    id: 'EMP001',
    name: 'Dr. Emily Johnson',
    role: 'Doctor',
    department: 'Cardiology',
    email: 'emily.johnson@healsmartly.com',
    phone: '123-456-7890',
    status: 'ACTIVE',
    lastCheckIn: 'Today, 9:00 AM',
    specialties: ['Cardiology', 'Internal Medicine'],
    schedule: {
      shift: 'Morning',
      startTime: '8:00 AM',
      endTime: '4:00 PM',
    },
  },
  {
    id: 'EMP002',
    name: 'Sarah Thompson',
    role: 'Nurse',
    department: 'Emergency',
    email: 'sarah.thompson@healsmartly.com',
    phone: '987-654-3210',
    status: 'ACTIVE',
    lastCheckIn: 'Today, 8:30 AM',
    specialties: ['Emergency Care', 'Critical Care'],
    schedule: {
      shift: 'Morning',
      startTime: '7:00 AM',
      endTime: '3:00 PM',
    },
  },
  {
    id: 'EMP003',
    name: 'Dr. Michael Chen',
    role: 'Doctor',
    department: 'Neurology',
    email: 'michael.chen@healsmartly.com',
    phone: '555-123-4567',
    status: 'ON_LEAVE',
    lastCheckIn: 'Yesterday, 5:00 PM',
    specialties: ['Neurology', 'Neurosurgery'],
    schedule: {
      shift: 'Evening',
      startTime: '2:00 PM',
      endTime: '10:00 PM',
    },
  },
  {
    id: 'EMP004',
    name: 'Jessica Martinez',
    role: 'Nurse',
    department: 'ICU',
    email: 'jessica.martinez@healsmartly.com',
    phone: '555-987-6543',
    status: 'ACTIVE',
    lastCheckIn: 'Today, 9:15 AM',
    specialties: ['Critical Care', 'Ventilator Management'],
    schedule: {
      shift: 'Night',
      startTime: '11:00 PM',
      endTime: '7:00 AM',
    },
  },
  {
    id: 'EMP005',
    name: 'Dr. James Wilson',
    role: 'Doctor',
    department: 'Oncology',
    email: 'james.wilson@healsmartly.com',
    phone: '555-789-0123',
    status: 'ACTIVE',
    lastCheckIn: 'Today, 8:45 AM',
    specialties: ['Medical Oncology', 'Hematology'],
    schedule: {
      shift: 'Morning',
      startTime: '8:00 AM',
      endTime: '4:00 PM',
    },
  },
  {
    id: 'EMP006',
    name: 'Robert Taylor',
    role: 'Technician',
    department: 'Radiology',
    email: 'robert.taylor@healsmartly.com',
    phone: '555-456-7890',
    status: 'INACTIVE',
    lastCheckIn: '3 days ago',
    specialties: ['MRI', 'CT Scan'],
    schedule: {
      shift: 'Afternoon',
      startTime: '12:00 PM',
      endTime: '8:00 PM',
    },
  },
];
