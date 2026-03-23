import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Box, Card, CardContent, Typography, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Chip, TextField, InputAdornment,
  IconButton, Avatar, MenuItem, Select, FormControl, InputLabel, Button,
  Tooltip, Divider, Stack,
} from '@mui/material';
import { 
  Search as SearchIcon,
  FileDownload as CsvIcon,
  PictureAsPdf as PdfIcon,
  Print as PrintIcon,
} from '@mui/icons-material';
import { employees } from '../../data/mockData';
import { exportToCSV, printTable, exportToPDF } from '../../utils/exportUtils';

export default function EmployeeList() {
  const location = useLocation();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [employmentTypeFilter, setEmploymentTypeFilter] = useState('All');
  const [joinDateFilter, setJoinDateFilter] = useState('');
  
  // Make state available to replacing string for quick test
  window.joinDateFilter = joinDateFilter;
  window.setJoinDateFilter = setJoinDateFilter;

  // Pre-apply filters from dashboard navigation query params
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const filter = params.get('filter');
    const empType = params.get('employmentType');
    if (filter) setStatusFilter(filter);
    if (empType) setEmploymentTypeFilter(empType);
  }, [location.search]);

  const filtered = employees.filter((emp) => {
    const matchSearch = `${emp.firstName} ${emp.lastName} ${emp.designation} ${emp.id}`
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchStatus = statusFilter === 'All' || emp.status === statusFilter;
    const matchType = employmentTypeFilter === 'All' || emp.employmentType === employmentTypeFilter;
    const matchDate = !joinDateFilter || emp.employmentDate.startsWith(joinDateFilter);
    return matchSearch && matchStatus && matchType && matchDate;
  });

  const getStatusChipSx = (status) => {
    if (status === 'Active') return { bgcolor: '#e8f5e9', color: '#2e7d32' };
    if (status === 'Suspended') return { bgcolor: '#fff3e0', color: '#ef6c00' };
    if (status === 'AWOL') return { bgcolor: '#ffebee', color: '#c62828' };
    if (status === 'Resigned/Exit') return { bgcolor: '#fafafa', color: '#9e9e9e', border: '1px solid #e0e0e0' };
    return { bgcolor: '#f5f5f5', color: '#616161' };
  };

  const getAvatarGradient = (status) => {
    if (status === 'Active') return 'linear-gradient(135deg, #023DFB, #4a75e6)';
    if (status === 'Suspended') return 'linear-gradient(135deg, #e67e22, #f39c12)';
    if (status === 'AWOL') return 'linear-gradient(135deg, #c0392b, #e74c3c)';
    if (status === 'Resigned/Exit') return 'linear-gradient(135deg, #7f8c8d, #95a5a6)';
    return 'linear-gradient(135deg, #bdc3c7, #dcdde1)';
  };


  return (
    <Box className="page-container">
      <Card sx={{
        borderRadius: 3,
        borderTop: `3px solid #023DFB`,
        boxShadow: '0 8px 32px rgba(2, 61, 251, 0.15)',
      }}>
        <CardContent sx={{ p: 3 }}>
          {/* Filters */}
          <Box sx={{ display: 'flex', gap: 2.5, mb: 4, flexWrap: 'wrap', alignItems: 'center' }}>
            <TextField
              size="small"
              placeholder="Search employees by name, ID or position..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: '#023DFB', fontSize: '1.2rem' }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                minWidth: 180, flex: 1, maxWidth: 260,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  bgcolor: 'rgba(0,0,0,0.01)',
                  transition: 'all 0.2s ease',
                  '&:hover': { bgcolor: 'rgba(0,0,0,0.03)' },
                  '&.Mui-focused': { bgcolor: '#fff', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }
                }
              }}
            />
            <FormControl size="small" sx={{ minWidth: 180 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                label="Status"
                onChange={(e) => setStatusFilter(e.target.value)}
                sx={{ borderRadius: 2 }}
              >
                <MenuItem value="All">All Statuses</MenuItem>
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Suspended">Suspended</MenuItem>
                <MenuItem value="AWOL">AWOL</MenuItem>
                <MenuItem value="Resigned/Exit">Resigned/Exit</MenuItem>
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 180 }}>
              <InputLabel>Employment Type</InputLabel>
              <Select
                value={employmentTypeFilter}
                label="Employment Type"
                onChange={(e) => setEmploymentTypeFilter(e.target.value)}
                sx={{ borderRadius: 2 }}
              >
                <MenuItem value="All">All Types</MenuItem>
                <MenuItem value="Regular">Regular</MenuItem>
                <MenuItem value="Probationary">Probationary</MenuItem>
                <MenuItem value="Contractual">Contractual</MenuItem>
                <MenuItem value="On Call">On Call</MenuItem>
                <MenuItem value="OJT">OJT</MenuItem>
              </Select>
            </FormControl>
            <TextField
              size="small"
              type="month"
              label="Join Date"
              InputLabelProps={{ shrink: true }}
              value={window.joinDateFilter || ''}
              onChange={(e) => window.setJoinDateFilter(e.target.value)}
              sx={{ minWidth: 180, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />

          </Box>

          {/* Table */}
          <TableContainer sx={{ overflowX: 'auto' }}>
            <Table sx={{ minWidth: 1000 }}>
              <TableHead>
                <TableRow sx={{ bgcolor: '#023DFB' }}>
                  {['Employee ID', 'Member Details', 'Joined Date', 'Designation', 'Department', 'Location', 'Status'].map((h) => (
                    <TableCell key={h} sx={{ fontWeight: 700, color: '#fff', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em' }}>
                      {h}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {filtered.map((emp) => (
                  <TableRow key={emp.id}>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#023DFB', fontSize: '0.82rem' }}>
                        {emp.id}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar
                          sx={{
                            width: 34,
                            height: 34,
                            background: getAvatarGradient(emp.status),
                            fontSize: '0.78rem',
                            fontWeight: 600,
                          }}
                        >
                          {emp.firstName[0]}{emp.lastName[0]}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.85rem', lineHeight: 1.3 }}>
                            {emp.firstName} {emp.middleName ? emp.middleName[0] + '.' : ''} {emp.lastName} {emp.suffix}
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.72rem' }}>
                            {emp.employmentType}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>{new Date(emp.employmentDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</TableCell>
                    <TableCell>{emp.designation}</TableCell>
                    <TableCell>{emp.department}</TableCell>
                    <TableCell>{emp.payrollLocation}</TableCell>
                    <TableCell>
                      <Chip
                        label={emp.status}
                        size="small"
                        sx={{
                          fontWeight: 600,
                          fontSize: '0.72rem',
                          height: 24,
                          ...getStatusChipSx(emp.status),
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                      No employees found matching your criteria.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
            <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.8rem' }}>
              Showing {filtered.length} of {employees.length} employees
            </Typography>
            <Stack direction="row" spacing={1}>
              <Button size="small" variant="outlined" startIcon={<CsvIcon />}
                onClick={() => exportToCSV(
                  ['Employee ID','Full Name','Employment Type','Joined Date','Designation','Department','Location','Status'],
                  filtered.map(e => [e.id, `${e.firstName} ${e.lastName}`, e.employmentType, e.employmentDate, e.designation, e.department, e.payrollLocation, e.status]),
                  'employee_list'
                )}
                sx={{ borderRadius: 2, fontSize: '0.75rem' }}>
                CSV
              </Button>
              <Button size="small" variant="outlined" startIcon={<PdfIcon />}
                onClick={() => exportToPDF('Employee List',
                  ['Employee ID','Full Name','Employment Type','Joined Date','Designation','Department','Location','Status'],
                  filtered.map(e => [e.id, `${e.firstName} ${e.lastName}`, e.employmentType, e.employmentDate, e.designation, e.department, e.payrollLocation, e.status])
                )}
                sx={{ borderRadius: 2, fontSize: '0.75rem' }}>
                PDF
              </Button>
              <Button size="small" variant="outlined" startIcon={<PrintIcon />}
                onClick={() => printTable('Employee List',
                  ['Employee ID','Full Name','Employment Type','Joined Date','Designation','Department','Location','Status'],
                  filtered.map(e => [e.id, `${e.firstName} ${e.lastName}`, e.employmentType, e.employmentDate, e.designation, e.department, e.payrollLocation, e.status])
                )}
                sx={{ borderRadius: 2, fontSize: '0.75rem' }}>
                Print
              </Button>
            </Stack>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
