import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  IconButton,
  Avatar,
  Card,
  Grid,
  InputAdornment,
  FormControl,
  InputLabel,
  Button,
  Menu,
  Chip,
  Tooltip,
  useTheme,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Stack,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  Search as SearchIcon,
  MoreVert as MoreVertIcon,
  ViewModule as GridViewIcon,
  ViewList as ListViewIcon,
  Add as AddIcon,
  Mail as MailIcon,
  Business as BuildingOfficeIcon,
  Edit as PencilIcon,
  Visibility as EyeIcon,
  CalendarMonth as CalendarIcon,
  Delete as TrashIcon,
  FilterList as FilterIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { sampleStaff, type StaffMember } from '../../data/sampleStaff';

const departments = Array.from(new Set(sampleStaff.map((staff) => staff.department)));
departments.unshift('All Departments');

const roles = Array.from(new Set(sampleStaff.map((staff) => staff.role)));
roles.unshift('All Roles');

export function EmployeeDirectory() {
  const theme = useTheme();
  const [view, setView] = useState<'grid' | 'list'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('All Departments');
  const [selectedRole, setSelectedRole] = useState('All Roles');
  const [selectedEmployee, setSelectedEmployee] = useState<StaffMember | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [filterAnchorEl, setFilterAnchorEl] = useState<null | HTMLElement>(null);
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'INACTIVE' | 'ON_LEAVE'>(
    'ALL'
  );

  const handleActionClick = (event: React.MouseEvent<HTMLElement>, employee: StaffMember) => {
    setSelectedEmployee(employee);
    setAnchorEl(event.currentTarget);
  };

  const handleActionClose = () => {
    setAnchorEl(null);
  };

  const handleFilterClick = (event: React.MouseEvent<HTMLElement>) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };

  const handleDetailsOpen = (employee: StaffMember) => {
    setSelectedEmployee(employee);
    setDetailsOpen(true);
    handleActionClose();
  };

  const handleDetailsClose = () => {
    setDetailsOpen(false);
    setSelectedEmployee(null);
  };

  const filteredEmployees = sampleStaff.filter((employee) => {
    const matchesSearch =
      employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.department.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDepartment =
      selectedDepartment === 'All Departments' || employee.department === selectedDepartment;
    const matchesRole = selectedRole === 'All Roles' || employee.role === selectedRole;

    return matchesSearch && matchesDepartment && matchesRole;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'success';
      case 'INACTIVE':
        return 'error';
      case 'ON_LEAVE':
        return 'warning';
      default:
        return 'default';
    }
  };

  const renderGridView = () => (
    <Grid container spacing={3}>
      {filteredEmployees.map((employee) => (
        <Grid item xs={12} sm={6} md={4} key={employee.id}>
          <Card
            component={motion.div}
            whileHover={{ y: -4 }}
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
              cursor: 'pointer',
              '&:hover': {
                boxShadow: (theme) => theme.shadows[4],
              },
            }}
            onClick={() => handleDetailsOpen(employee)}
          >
            <Box
              sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar
                  src={employee.avatar}
                  alt={employee.name}
                  sx={{ width: 48, height: 48, mr: 2 }}
                />
                <Box>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {employee.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {employee.role}
                  </Typography>
                </Box>
              </Box>
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  handleActionClick(e, employee);
                }}
              >
                <MoreVertIcon />
              </IconButton>
            </Box>
            <Box sx={{ flexGrow: 1 }}>
              <Stack direction="row" spacing={1} mb={1}>
                <Chip size="small" label={employee.department} icon={<BuildingOfficeIcon />} />
                <Chip
                  size="small"
                  color={getStatusColor(employee.status)}
                  label={employee.status.replace('_', ' ')}
                />
              </Stack>
              <Typography variant="body2" color="text.secondary">
                {employee.email}
              </Typography>
            </Box>
          </Card>
        </Grid>
      ))}
    </Grid>
  );

  const renderListView = () => (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Name</TableCell>
          <TableCell>Role</TableCell>
          <TableCell>Department</TableCell>
          <TableCell>Status</TableCell>
          <TableCell>Email</TableCell>
          <TableCell align="right">Actions</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {filteredEmployees.map((employee) => (
          <TableRow
            key={employee.id}
            hover
            onClick={() => handleDetailsOpen(employee)}
            sx={{ cursor: 'pointer' }}
          >
            <TableCell>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar
                  src={employee.avatar}
                  alt={employee.name}
                  sx={{ width: 32, height: 32, mr: 2 }}
                />
                <Typography variant="body1">{employee.name}</Typography>
              </Box>
            </TableCell>
            <TableCell>{employee.role}</TableCell>
            <TableCell>{employee.department}</TableCell>
            <TableCell>
              <Chip
                size="small"
                color={getStatusColor(employee.status)}
                label={employee.status.replace('_', ' ')}
              />
            </TableCell>
            <TableCell>{employee.email}</TableCell>
            <TableCell align="right">
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  handleActionClick(e, employee);
                }}
              >
                <MoreVertIcon />
              </IconButton>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <TextField
            size="small"
            placeholder="Search staff..."
            variant="outlined"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          <Button variant="outlined" startIcon={<FilterIcon />} onClick={handleFilterClick}>
            Filters
          </Button>
        </Stack>

        <Stack direction="row" spacing={1}>
          <Button variant="contained" startIcon={<AddIcon />} color="primary">
            Add Staff
          </Button>
          <IconButton onClick={() => setView(view === 'grid' ? 'list' : 'grid')}>
            {view === 'grid' ? <ListViewIcon /> : <GridViewIcon />}
          </IconButton>
        </Stack>
      </Box>

      {view === 'list' ? renderListView() : renderGridView()}

      {/* Actions Menu */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleActionClose}>
        <MenuItem
          onClick={() => {
            handleDetailsOpen(selectedEmployee!);
            handleActionClose();
          }}
        >
          <ListItemIcon>
            <EyeIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>View Details</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleActionClose}>
          <ListItemIcon>
            <PencilIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleActionClose}>
          <ListItemIcon>
            <CalendarIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>View Schedule</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleActionClose}>
          <ListItemIcon>
            <MailIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Send Message</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleActionClose} sx={{ color: 'error.main' }}>
          <ListItemIcon>
            <TrashIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Remove</ListItemText>
        </MenuItem>
      </Menu>

      {/* Filters Menu */}
      <Menu anchorEl={filterAnchorEl} open={Boolean(filterAnchorEl)} onClose={handleFilterClose}>
        <Box sx={{ p: 2, minWidth: 200 }}>
          <FormControl fullWidth size="small" sx={{ mb: 2 }}>
            <InputLabel>Department</InputLabel>
            <Select
              value={selectedDepartment}
              label="Department"
              onChange={(e) => setSelectedDepartment(e.target.value)}
            >
              {departments.map((dept) => (
                <MenuItem key={dept} value={dept}>
                  {dept}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth size="small" sx={{ mb: 2 }}>
            <InputLabel>Role</InputLabel>
            <Select
              value={selectedRole}
              label="Role"
              onChange={(e) => setSelectedRole(e.target.value)}
            >
              {roles.map((role) => (
                <MenuItem key={role} value={role}>
                  {role}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth size="small">
            <InputLabel>Status</InputLabel>
            <Select
              value={statusFilter}
              label="Status"
              onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
            >
              <MenuItem value="ALL">All Status</MenuItem>
              <MenuItem value="ACTIVE">Active</MenuItem>
              <MenuItem value="INACTIVE">Inactive</MenuItem>
              <MenuItem value="ON_LEAVE">On Leave</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Menu>

      {/* Employee Details Dialog */}
      <Dialog open={detailsOpen} onClose={handleDetailsClose} maxWidth="sm" fullWidth>
        {selectedEmployee && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar
                  src={selectedEmployee.avatar}
                  alt={selectedEmployee.name}
                  sx={{ width: 56, height: 56 }}
                >
                  {selectedEmployee.name[0]}
                </Avatar>
                <Box>
                  <Typography variant="h6">{selectedEmployee.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {selectedEmployee.role} • {selectedEmployee.department}
                  </Typography>
                </Box>
              </Box>
            </DialogTitle>
            <DialogContent dividers>
              <Stack spacing={2}>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Contact Information
                  </Typography>
                  <Stack direction="row" spacing={2}>
                    <Chip
                      icon={<MailIcon />}
                      label={selectedEmployee.email}
                      variant="outlined"
                      onClick={() => (window.location.href = `mailto:${selectedEmployee.email}`)}
                    />
                  </Stack>
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Status
                  </Typography>
                  <Chip
                    color={getStatusColor(selectedEmployee.status)}
                    label={selectedEmployee.status.replace('_', ' ')}
                  />
                </Box>
                {selectedEmployee.certifications && (
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Certifications
                    </Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                      {selectedEmployee.certifications.map((cert) => (
                        <Chip key={cert} label={cert} size="small" />
                      ))}
                    </Stack>
                  </Box>
                )}
                {selectedEmployee.specialties && (
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Specialties
                    </Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                      {selectedEmployee.specialties.map((specialty) => (
                        <Chip key={specialty} label={specialty} size="small" />
                      ))}
                    </Stack>
                  </Box>
                )}
              </Stack>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleDetailsClose}>Close</Button>
              <Button variant="contained" onClick={handleDetailsClose}>
                Edit Profile
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
}
