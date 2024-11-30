import { useState } from 'react';
import { Calendar } from '../ui/Calendar';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/Tabs';
import { Button } from '../ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';
import { StaffList } from './StaffList';
import { StaffModal } from './StaffModal';
import type { StaffMember } from './StaffModal';
import { AttendanceChart } from '../analytics/AttendanceChart';
import { StaffPoints } from './StaffPoints';
import { RecoveryTracker } from './RecoveryTracker';
import { ShiftSwapManager } from '../scheduling/ShiftSwapManager';
import { useToastContext } from '../ui/ToastProvider';
import { EmployeeDirectory } from './EmployeeDirectory';
import {
  UserPlusIcon,
  SparklesIcon,
  SendIcon,
  ViewGridIcon,
  CalendarIcon,
  ClockIcon,
  ChartBarIcon,
} from '../ui/Icons';

export function StaffDashboard() {
  const { toast } = useToastContext();
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [staffModalOpen, setStaffModalOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  const [departments, setDepartments] = useState<Array<{ id: string; name: string }>>([]);

  const handleStaffAction = async (action: string, details: any) => {
    switch (action) {
      case 'add':
        setStaffModalOpen(true);
        return 'Opening staff addition form';

      case 'schedule':
        setActiveTab('schedule');
        return 'Switched to schedule view';

      case 'attendance':
        setActiveTab('attendance');
        return 'Switched to attendance view';

      default:
        return 'Unknown action';
    }
  };

  const handleStaffSave = async (staff: StaffMember) => {
    try {
      // Refresh the staff list after save
      const response = await fetch('/api/staff');
      if (!response.ok) throw new Error('Failed to refresh staff list');

      toast({
        title: 'Success',
        description: `Staff member ${staff.name} ${selectedStaff ? 'updated' : 'added'} successfully`,
        variant: 'success',
      });
    } catch (error) {
      console.error('Error refreshing staff:', error);
      toast({
        title: 'Error',
        description: 'Failed to refresh staff list',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Staff Management</h1>
          <p className="text-gray-600">Manage your healthcare staff and schedules</p>
        </div>
        <Button
          onClick={() => setStaffModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2"
        >
          <UserPlusIcon className="w-5 h-5" />
          Add Staff Member
        </Button>
      </div>

      {/* Natural Language Assistant */}
      <Card className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-none shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <SparklesIcon className="w-5 h-5 text-blue-500" />
            Staff Assistant
          </CardTitle>
          <CardDescription>
            Get help with staff management tasks using natural language
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <input
              type="text"
              className="w-full p-3 pr-12 border rounded-lg bg-white/50 backdrop-blur-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ask me to help manage staff... (e.g., 'Add a new nurse', 'Show today's schedule')"
            />
            <Button size="sm" className="absolute right-2 top-1/2 -translate-y-1/2" variant="ghost">
              <SendIcon className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="bg-white p-1 rounded-lg shadow-sm border">
          <TabsTrigger value="overview" className="rounded-md data-[state=active]:bg-blue-50">
            <ViewGridIcon className="w-4 h-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="schedule" className="rounded-md data-[state=active]:bg-blue-50">
            <CalendarIcon className="w-4 h-4 mr-2" />
            Schedule
          </TabsTrigger>
          <TabsTrigger value="attendance" className="rounded-md data-[state=active]:bg-blue-50">
            <ClockIcon className="w-4 h-4 mr-2" />
            Attendance
          </TabsTrigger>
          <TabsTrigger value="points" className="rounded-md data-[state=active]:bg-blue-50">
            <ChartBarIcon className="w-4 h-4 mr-2" />
            Points & Recovery
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle>Staff Directory</CardTitle>
              <CardDescription>View and manage all staff members</CardDescription>
            </CardHeader>
            <CardContent>
              <EmployeeDirectory />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schedule">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-white shadow-sm">
              <CardHeader>
                <CardTitle>Calendar</CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  className="rounded-md border"
                />
              </CardContent>
            </Card>
            <Card className="bg-white shadow-sm">
              <CardHeader>
                <CardTitle>Staff Schedule</CardTitle>
              </CardHeader>
              <CardContent>
                <StaffList date={selectedDate} onStaffSelect={setSelectedStaff} showAttendance />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="attendance">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-white shadow-sm">
              <CardHeader>
                <CardTitle>Attendance Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <AttendanceChart date={selectedDate} />
              </CardContent>
            </Card>
            <Card className="bg-white shadow-sm">
              <CardHeader>
                <CardTitle>Staff List</CardTitle>
              </CardHeader>
              <CardContent>
                <StaffList date={selectedDate} onStaffSelect={setSelectedStaff} showAttendance />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="points">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {selectedStaff && (
              <>
                <Card className="bg-white shadow-sm">
                  <CardHeader>
                    <CardTitle>Points Overview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <StaffPoints staffId={selectedStaff.id!} />
                  </CardContent>
                </Card>
                <Card className="bg-white shadow-sm">
                  <CardHeader>
                    <CardTitle>Recovery Progress</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <RecoveryTracker staffId={selectedStaff.id!} />
                  </CardContent>
                </Card>
              </>
            )}
            <Card className="bg-white shadow-sm">
              <CardHeader>
                <CardTitle>Shift Management</CardTitle>
              </CardHeader>
              <CardContent>
                <ShiftSwapManager staff={selectedStaff} date={selectedDate} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <StaffModal
        isOpen={staffModalOpen}
        onClose={() => setStaffModalOpen(false)}
        staff={selectedStaff}
        onSave={handleStaffSave}
      />
    </div>
  );
}
