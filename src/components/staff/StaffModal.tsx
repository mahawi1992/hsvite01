import { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { Label } from '../ui/Label';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { useToastContext } from '../ui/ToastProvider';

interface StaffMember {
  id?: string;
  name: string;
  email: string;
  role: string;
  department: string;
  employmentType: 'FULL_TIME' | 'PART_TIME' | 'PRN';
  status: 'ACTIVE' | 'INACTIVE' | 'ON_LEAVE';
  certifications: string[];
  experience: number;
}

interface StaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  staff?: StaffMember;
  onSave?: (staff: StaffMember) => void;
}

export function StaffModal({ isOpen, onClose, staff, onSave }: StaffModalProps) {
  const { toast } = useToastContext();
  const [formData, setFormData] = useState<StaffMember>({
    name: '',
    email: '',
    role: '',
    department: '',
    employmentType: 'FULL_TIME',
    status: 'ACTIVE',
    certifications: [],
    experience: 0,
  });

  useEffect(() => {
    if (staff) {
      setFormData({
        ...staff,
        certifications: staff.certifications || [],
      });
    }
  }, [staff]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const endpoint = staff ? `/api/staff/${staff.id}` : '/api/staff';
      const method = staff ? 'PUT' : 'POST';

      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to save staff member');

      const savedStaff = await response.json();
      onSave?.(savedStaff);
      onClose();

      toast({
        title: 'Success',
        description: `Staff member ${staff ? 'updated' : 'added'} successfully`,
        variant: 'success',
      });
    } catch (error) {
      console.error('Error saving staff:', error);
      toast({
        title: 'Error',
        description: 'Failed to save staff member',
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-md rounded bg-white p-6 shadow-xl">
          <Dialog.Title className="text-lg font-medium leading-6 text-gray-900 mb-4">
            {staff ? 'Edit Staff Member' : 'Add New Staff Member'}
          </Dialog.Title>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="role">Role</Label>
                <select
                  id="role"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full rounded-md border border-gray-300 p-2"
                  required
                >
                  <option value="">Select Role</option>
                  <option value="PHYSICIAN">Physician</option>
                  <option value="NURSE">Nurse</option>
                  <option value="PA">Physician Assistant</option>
                  <option value="NP">Nurse Practitioner</option>
                  <option value="TECH">Technician</option>
                </select>
              </div>

              <div>
                <Label htmlFor="department">Department</Label>
                <select
                  id="department"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full rounded-md border border-gray-300 p-2"
                  required
                >
                  <option value="">Select Department</option>
                  <option value="EMERGENCY">Emergency</option>
                  <option value="ICU">ICU</option>
                  <option value="SURGERY">Surgery</option>
                  <option value="PEDIATRICS">Pediatrics</option>
                  <option value="CARDIOLOGY">Cardiology</option>
                </select>
              </div>

              <div>
                <Label htmlFor="employmentType">Employment Type</Label>
                <select
                  id="employmentType"
                  value={formData.employmentType}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      employmentType: e.target.value as StaffMember['employmentType'],
                    })
                  }
                  className="w-full rounded-md border border-gray-300 p-2"
                  required
                >
                  <option value="FULL_TIME">Full Time</option>
                  <option value="PART_TIME">Part Time</option>
                  <option value="PRN">PRN</option>
                </select>
              </div>

              <div>
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value as StaffMember['status'] })
                  }
                  className="w-full rounded-md border border-gray-300 p-2"
                  required
                >
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                  <option value="ON_LEAVE">On Leave</option>
                </select>
              </div>

              <div>
                <Label htmlFor="experience">Years of Experience</Label>
                <Input
                  id="experience"
                  type="number"
                  min="0"
                  value={formData.experience}
                  onChange={(e) =>
                    setFormData({ ...formData, experience: parseInt(e.target.value) || 0 })
                  }
                  required
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">{staff ? 'Update' : 'Add'} Staff Member</Button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
