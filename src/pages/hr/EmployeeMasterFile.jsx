import React, { useState } from 'react';
import {
  Box, Card, CardContent, Typography, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Chip, TextField, InputAdornment,
  Avatar, Tooltip, IconButton, MenuItem,
  Dialog, DialogTitle, DialogContent, DialogActions, Button, Divider, Grid,
} from '@mui/material';
import {
  Search as SearchIcon,
  FileDownload as CsvIcon,
  Visibility as ViewIcon,
  Close as CloseIcon,
  Work as WorkIcon,
} from '@mui/icons-material';
import { employees } from '../../data/mockData';
import { exportToCSV } from '../../utils/exportUtils';

const goldAccent = '#d4a843';
const NAV = '#05077E';
const IND = '#0241FB';

// ── Employment Details Dialog ─────────────────────────────────────────────────
function EmploymentDetailsDialog({ open, onClose, emp }) {
  if (!emp) return null;

  const DetailRow = ({ label, value }) => (
    <Grid item xs={12} sm={6} md={4}>
      <Box sx={{ mb: 1.5 }}>
        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase', fontSize: '0.62rem', letterSpacing: '0.08em' }}>
          {label}
        </Typography>
        <Typography variant="body2" sx={{ fontWeight: 600, color: value ? 'text.primary' : 'text.disabled', mt: 0.2 }}>
          {value || '—'}
        </Typography>
      </Box>
    </Grid>
  );

  const typeColor = {
    Regular:      { bg: '#e8f5e9', color: '#2e7d32', border: '#2e7d32' },
    Probationary: { bg: '#e3f2fd', color: IND,       border: IND       },
    Contractual:  { bg: '#fff3e0', color: '#ef6c00', border: '#ef6c00' },
  }[emp.employmentType] || { bg: '#f5f5f5', color: '#616161', border: '#9e9e9e' };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          borderTop: `4px solid ${goldAccent}`,
          boxShadow: '0 24px 80px rgba(5,7,126,0.18)',
        }
      }}
    >
      {/* Header */}
      <DialogTitle sx={{ pb: 1.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{
              width: 38, height: 38, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: `linear-gradient(135deg, ${NAV} 0%, ${IND} 100%)`,
            }}>
              <WorkIcon sx={{ color: '#fff', fontSize: '1.1rem' }} />
            </Box>
            <Box>
              <Typography sx={{ fontWeight: 800, color: IND, fontSize: '0.95rem', lineHeight: 1.2 }}>
                EMPLOYMENT DETAILS
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                {emp.firstName} {emp.middleName ? emp.middleName[0] + '. ' : ''}{emp.lastName} &nbsp;·&nbsp; {emp.id}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Chip
              label={emp.employmentType}
              size="small"
              sx={{
                fontWeight: 700, fontSize: '0.7rem',
                bgcolor: typeColor.bg, color: typeColor.color,
                border: `1px solid ${typeColor.border}`,
              }}
            />
            <IconButton size="small" onClick={onClose} sx={{ color: 'text.secondary' }}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ pt: 2.5, pb: 2 }}>
        {/* Position Info */}
        <Typography variant="overline" sx={{ fontWeight: 800, color: NAV, fontSize: '0.65rem', letterSpacing: '0.12em', mb: 1, display: 'block' }}>
          Position & Organization
        </Typography>
        <Grid container spacing={1} sx={{ mb: 2 }}>
          <DetailRow label="Position / Designation" value={emp.designation} />
          <DetailRow label="Division" value={emp.employmentDetails?.division || 'APECC'} />
          <DetailRow label="Department" value={emp.department} />
          <DetailRow label="Job Level / Rank" value={emp.employmentDetails?.jobLevel || 'Rank & File'} />
          <DetailRow label="Work Location" value={emp.payrollLocation} />
          <DetailRow label="Supervisor" value={emp.employmentDetails?.supervisor} />
        </Grid>

        <Divider sx={{ mb: 2 }} />

        {/* Dates */}
        <Typography variant="overline" sx={{ fontWeight: 800, color: NAV, fontSize: '0.65rem', letterSpacing: '0.12em', mb: 1, display: 'block' }}>
          Employment Dates
        </Typography>
        <Grid container spacing={1} sx={{ mb: 2 }}>
          <DetailRow label="Date Hired" value={emp.employmentDate} />
          <DetailRow label="End Date" value={emp.employmentDetails?.endDate} />
          <DetailRow label="Regularization Date" value={emp.employmentDetails?.regularizationDate} />
        </Grid>

        <Divider sx={{ mb: 2 }} />

        {/* Schedule */}
        <Typography variant="overline" sx={{ fontWeight: 800, color: NAV, fontSize: '0.65rem', letterSpacing: '0.12em', mb: 1, display: 'block' }}>
          Schedule & Payroll
        </Typography>
        <Grid container spacing={1} sx={{ mb: 1 }}>
          <DetailRow label="Shift" value={emp.employmentDetails?.shift || 'Day'} />
          <DetailRow label="Time In" value={emp.employmentDetails?.timeIn || '08:00 AM'} />
          <DetailRow label="Time Out" value={emp.employmentDetails?.timeOut || '05:00 PM'} />
          <DetailRow label="Basic Salary" value={emp.payrollProfile?.basicSalary ? `₱${emp.payrollProfile.basicSalary.toLocaleString()}` : null} />
          <DetailRow label="Salary Type" value={emp.payrollProfile?.salaryType} />
          <DetailRow label="Pay Frequency" value={emp.payrollProfile?.payrollFrequency} />
          <DetailRow label="Tax Status" value={emp.payrollProfile?.taxStatus} />
          <DetailRow label="Bank Account" value={emp.payrollProfile?.bankAccountNumber} />
        </Grid>
      </DialogContent>

      <Divider />
      <DialogActions sx={{ px: 3, py: 1.5 }}>
        <Button onClick={onClose} variant="contained" size="small"
          sx={{
            borderRadius: 2, textTransform: 'none', fontWeight: 700,
            background: `linear-gradient(135deg, ${NAV} 0%, ${IND} 100%)`,
            boxShadow: 'none',
            '&:hover': { boxShadow: '0 4px 12px rgba(2,65,251,0.3)' }
          }}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function EmployeeMasterFile() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('Active');
  const [employmentFilter, setEmploymentFilter] = useState('Regular');
  const [selectedEmp, setSelectedEmp] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const filtered = employees.filter((emp) => {
    const matchSearch = `${emp.firstName} ${emp.lastName} ${emp.id}`
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchStatus = statusFilter === 'All' || emp.status === statusFilter;
    const matchEmployment = employmentFilter === 'All' || emp.employmentType === employmentFilter;
    return matchSearch && matchStatus && matchEmployment;
  });

  const handleViewDetails = (emp) => {
    setSelectedEmp(emp);
    setDialogOpen(true);
  };

  return (
    <Box className="page-container">
      <Card sx={{
        borderRadius: 3,
        borderTop: `3px solid ${goldAccent}`,
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
      }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 800, color: IND, letterSpacing: '0.02em' }}>
              EMPLOYEE MASTER FILE
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <TextField
                size="small"
                placeholder="Search by name or ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: IND, fontSize: '1.1rem' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  minWidth: 250,
                  '& .MuiOutlinedInput-root': { borderRadius: 2, bgcolor: 'rgba(0,0,0,0.02)' }
                }}
              />
              <TextField
                select
                size="small"
                label="Employment Status"
                value={employmentFilter}
                onChange={(e) => setEmploymentFilter(e.target.value)}
                sx={{
                  minWidth: 160,
                  '& .MuiOutlinedInput-root': { borderRadius: 2, bgcolor: 'rgba(0,0,0,0.02)' }
                }}
              >
                <MenuItem value="All">Employment Status</MenuItem>
                <MenuItem value="Regular">Regular</MenuItem>
                <MenuItem value="Probationary">Probationary</MenuItem>
                <MenuItem value="Contractual">Contractual</MenuItem>
              </TextField>
              <TextField
                select
                size="small"
                label="Status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                sx={{
                  minWidth: 120,
                  '& .MuiOutlinedInput-root': { borderRadius: 2, bgcolor: 'rgba(0,0,0,0.02)' }
                }}
              >
                <MenuItem value="All">File Status</MenuItem>
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Suspended">Suspended</MenuItem>
                <MenuItem value="AWOL">AWOL</MenuItem>
                <MenuItem value="Resigned/Exit">Resigned/Exit</MenuItem>
              </TextField>
              <Tooltip title="Export to CSV">
                <IconButton
                  onClick={() => exportToCSV(
                    ['Employee ID', 'Last Name', 'First Name', 'Middle Name', 'Suffix', 'Gender', 'Civil Status', 'Date of Birth', 'Place of Birth', 'Nationality', 'Religion', 'Contact Number', 'Personal Email', 'Company Email', 'Current Address', 'Permanent Address', 'Emergency Contact', 'Number', 'Relationship', 'Status'],
                    filtered.map(emp => [emp.id, emp.lastName, emp.firstName, emp.middleName || '', emp.suffix || '', emp.personal?.gender, emp.personal?.civilStatus, emp.personal?.birthdate, emp.personal?.birthplace, emp.personal?.citizenship, emp.personal?.religion, emp.personal?.contactNumbers?.[0], emp.personal?.emailAddresses?.[1] || '', emp.personal?.emailAddresses?.[0], emp.personal?.presentAddress, emp.personal?.permanentAddress, emp.personal?.emergencyContact?.name || '', emp.personal?.emergencyContact?.number || '', emp.personal?.emergencyContact?.relationship || '', emp.status]),
                    'employee_master_file'
                  )}
                  sx={{ color: '#2e7d32', bgcolor: 'rgba(46, 125, 50, 0.05)' }}
                >
                  <CsvIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          <TableContainer sx={{
            borderRadius: 2,
            border: '1px solid rgba(0,0,0,0.08)',
            maxHeight: 'calc(100vh - 250px)',
            '&::-webkit-scrollbar': { height: 10, width: 10, display: 'block' },
            '&::-webkit-scrollbar-track': { bgcolor: 'rgba(0,0,0,0.05)', borderRadius: 10 },
            '&::-webkit-scrollbar-thumb': {
              bgcolor: 'rgba(0,0,0,0.2)',
              borderRadius: 10,
              border: '2px solid transparent',
              backgroundClip: 'padding-box',
            },
            overflowX: 'auto',
          }}>
            <Table stickyHeader size="small">
              <TableHead>
                <TableRow>
                  {[
                    'Actions', 'Employee ID', 'Last Name', 'First Name', 'Middle Name', 'Suffix', 'Photo',
                    'Gender', 'Civil Status', 'Date of Birth', 'Place of Birth', 'Nationality',
                    'Religion', 'Contact Number', 'Personal Email', 'Company Email',
                    'Current Address', 'Permanent Address', 'Emergency Contact', 'Number', 'Relationship', 'Status'
                  ].map((h) => (
                    <TableCell key={h} sx={{
                      background: 'linear-gradient(135deg, #05077E 0%, #0241FB 60%, #4470ED 100%)',
                      color: '#FDFDFC',
                      fontWeight: 700,
                      fontSize: '0.7rem',
                      whiteSpace: 'nowrap',
                      textTransform: 'uppercase',
                      py: 1.5
                    }}>
                      {h}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {filtered.map((emp) => (
                  <TableRow key={emp.id} hover sx={{ '&:nth-of-type(even)': { bgcolor: 'rgba(0,0,0,0.01)' } }}>
                    {/* ── View Button ── */}
                    <TableCell align="center">
                      <Tooltip title="View Employment Details">
                        <IconButton
                          size="small"
                          onClick={() => handleViewDetails(emp)}
                          sx={{
                            color: IND,
                            bgcolor: 'rgba(2,65,251,0.07)',
                            border: '1px solid rgba(2,65,251,0.15)',
                            borderRadius: '8px',
                            width: 28, height: 28,
                            '&:hover': {
                              bgcolor: IND,
                              color: '#fff',
                              boxShadow: '0 4px 12px rgba(2,65,251,0.3)',
                            },
                            transition: 'all 0.2s',
                          }}
                        >
                          <ViewIcon sx={{ fontSize: '0.95rem' }} />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700, color: IND }}>{emp.id}</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>{emp.lastName}</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>{emp.firstName}</TableCell>
                    <TableCell>{emp.middleName || '—'}</TableCell>
                    <TableCell>{emp.suffix || '—'}</TableCell>
                    <TableCell align="center">
                      <Avatar sx={{ width: 24, height: 24, fontSize: '0.7rem', bgcolor: goldAccent }}>{emp.firstName[0]}</Avatar>
                    </TableCell>
                    <TableCell>{emp.personal?.gender}</TableCell>
                    <TableCell>{emp.personal?.civilStatus}</TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap' }}>{emp.personal?.birthdate}</TableCell>
                    <TableCell>{emp.personal?.birthplace}</TableCell>
                    <TableCell>{emp.personal?.citizenship}</TableCell>
                    <TableCell>{emp.personal?.religion}</TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap' }}>{emp.personal?.contactNumbers?.[0]}</TableCell>
                    <TableCell>{emp.personal?.emailAddresses?.[1] || '—'}</TableCell>
                    <TableCell>{emp.personal?.emailAddresses?.[0]}</TableCell>
                    <TableCell sx={{ minWidth: 200 }}>{emp.personal?.presentAddress}</TableCell>
                    <TableCell sx={{ minWidth: 200 }}>{emp.personal?.permanentAddress}</TableCell>
                    <TableCell>{emp.personal?.emergencyContact?.name || '—'}</TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap' }}>{emp.personal?.emergencyContact?.number || '—'}</TableCell>
                    <TableCell>{emp.personal?.emergencyContact?.relationship || '—'}</TableCell>
                    <TableCell>
                      <Chip label={emp.status} size="small" sx={{
                        fontWeight: 700, fontSize: '0.65rem', height: 20,
                        bgcolor:
                          emp.status === 'Active' ? '#e8f5e9' :
                          emp.status === 'Suspended' ? '#fff3e0' :
                          emp.status === 'AWOL' ? '#ffebee' :
                          emp.status === 'Resigned/Exit' ? '#fafafa' : '#f5f5f5',
                        color:
                          emp.status === 'Active' ? '#2e7d32' :
                          emp.status === 'Suspended' ? '#ef6c00' :
                          emp.status === 'AWOL' ? '#c62828' :
                          emp.status === 'Resigned/Exit' ? '#9e9e9e' : '#616161',
                        border: emp.status === 'Resigned/Exit' ? '1px solid #e0e0e0' : 'none'
                      }} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
              Showing {filtered.length} Employees
            </Typography>
          </Box>
        </CardContent>
      </Card>

      {/* Employment Details Dialog */}
      <EmploymentDetailsDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        emp={selectedEmp}
      />
    </Box>
  );
}
