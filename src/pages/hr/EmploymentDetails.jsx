import React, { useState } from 'react';
import {
  Box, Card, CardContent, Typography, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Chip, TextField, InputAdornment,
  Tooltip, IconButton, MenuItem,
} from '@mui/material';
import { 
  Search as SearchIcon, 
  PictureAsPdf as PdfIcon, 
  GridOn as ExcelIcon,
} from '@mui/icons-material';
import { employees } from '../../data/mockData';

const goldAccent = '#d4a843';

export default function EmploymentDetails() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filtered = employees.filter((emp) => {
    const matchSearch = `${emp.firstName} ${emp.lastName} ${emp.id} ${emp.designation}`
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchStatus = statusFilter === 'All' || emp.employmentType === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleExport = (format) => {
    console.log(`Exporting Employment Details to ${format.toUpperCase()}...`);
    alert(`Success: Employment Details ${format.toUpperCase()} export initiated.`);
  };

  return (
    <Box className="page-container">
      <Card sx={{
        borderRadius: 3,
        borderTop: `3px solid #023DFB`,
        boxShadow: '0 8px 32px rgba(2, 61, 251, 0.12)',
      }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#023DFB', letterSpacing: '0.02em' }}>
              EMPLOYMENT DETAILS
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <TextField
                size="small"
                placeholder="Search by name, ID or position..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: '#023DFB', fontSize: '1.1rem' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  minWidth: 280,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    bgcolor: 'rgba(0,0,0,0.02)',
                  }
                }}
              />
              <TextField
                select
                size="small"
                label="Status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                sx={{
                  minWidth: 150,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    bgcolor: 'rgba(0,0,0,0.02)',
                  }
                }}
              >
                <MenuItem value="All">All Statuses</MenuItem>
                <MenuItem value="Regular">Regular</MenuItem>
                <MenuItem value="Probationary">Probationary</MenuItem>
                <MenuItem value="Contractual">Contractual</MenuItem>
                <MenuItem value="On Call">On Call</MenuItem>
                <MenuItem value="OJT">OJT</MenuItem>
              </TextField>
              <Tooltip title="Export to PDF">
                <IconButton onClick={() => handleExport('pdf')} sx={{ color: '#d32f2f', bgcolor: 'rgba(211, 47, 47, 0.05)' }}>
                  <PdfIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Export to Excel">
                <IconButton onClick={() => handleExport('excel')} sx={{ color: '#2e7d32', bgcolor: 'rgba(46, 125, 50, 0.05)' }}>
                  <ExcelIcon />
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
              '&:hover': { bgcolor: 'rgba(0,0,0,0.3)' } 
            },
            overflowX: 'auto',
          }}>
            <Table stickyHeader size="small">
              <TableHead>
                <TableRow>
                  {[
                    'Employee ID', 'Employee Name', 'Position', 'Basic Salary', 'Salary Type', 'Frequency',
                    'Tax Status', 'Bank Account', 'Division', 'Department',
                    'Job Level / Rank', 'Date Hired', 'End Date', 'Regularization',
                    'Work Location', 'Shift', 'In', 'Out', 'Supervisor', 'Status'
                  ].map((h) => (
                    <TableCell key={h} sx={{ 
                      bgcolor: '#023DFB', 
                      color: '#fff', 
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
                    <TableCell sx={{ fontWeight: 700, color: '#023DFB' }}>{emp.id}</TableCell>
                    <TableCell sx={{ fontWeight: 600, whiteSpace: 'nowrap' }}>{emp.firstName} {emp.lastName}</TableCell>
                    <TableCell>{emp.designation}</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#2e7d32' }}>
                      {emp.payrollProfile?.basicSalary ? `₱${emp.payrollProfile.basicSalary.toLocaleString()}` : '—'}
                    </TableCell>
                    <TableCell>{emp.payrollProfile?.salaryType || '—'}</TableCell>
                    <TableCell>{emp.payrollProfile?.payrollFrequency || '—'}</TableCell>
                    <TableCell>{emp.payrollProfile?.taxStatus || '—'}</TableCell>
                    <TableCell sx={{ fontFamily: 'monospace' }}>{emp.payrollProfile?.bankAccountNumber || '—'}</TableCell>
                    <TableCell>{emp.employmentDetails?.division || 'APECC'}</TableCell>
                    <TableCell>{emp.department}</TableCell>
                    <TableCell>{emp.employmentDetails?.jobLevel || 'Rank & File'}</TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap' }}>{emp.employmentDate}</TableCell>
                    <TableCell>{emp.employmentDetails?.endDate || '—'}</TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap' }}>{emp.employmentDetails?.regularizationDate || '—'}</TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap' }}>{emp.payrollLocation}</TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap' }}>{emp.employmentDetails?.shift || 'Day'}</TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap' }}>{emp.employmentDetails?.timeIn || '08:00 AM'}</TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap' }}>{emp.employmentDetails?.timeOut || '05:00 PM'}</TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap' }}>{emp.employmentDetails?.supervisor || '—'}</TableCell>
                    <TableCell>
                      <Chip label={emp.employmentType} size="small" variant="outlined" sx={{ 
                        fontWeight: 700, fontSize: '0.65rem', height: 20,
                        borderColor: 
                          emp.employmentType === 'Regular' ? '#2e7d32' : 
                          emp.employmentType === 'Probationary' ? '#023DFB' : 
                          emp.employmentType === 'Contractual' ? '#ef6c00' : '#757575',
                        color: 
                          emp.employmentType === 'Regular' ? '#2e7d32' : 
                          emp.employmentType === 'Probationary' ? '#023DFB' : 
                          emp.employmentType === 'Contractual' ? '#ef6c00' : '#757575'
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
    </Box>
  );
}
