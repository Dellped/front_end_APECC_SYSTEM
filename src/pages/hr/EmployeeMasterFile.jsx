import React, { useState } from 'react';
import {
  Box, Card, CardContent, Typography, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Chip, TextField, InputAdornment,
  Avatar, Tooltip, IconButton, MenuItem,
} from '@mui/material';
import { 
  Search as SearchIcon, 
  FileDownload as CsvIcon,
} from '@mui/icons-material';
import { employees } from '../../data/mockData';
import { exportToCSV } from '../../utils/exportUtils';

const goldAccent = '#d4a843';

export default function EmployeeMasterFile() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filtered = employees.filter((emp) => {
    const matchSearch = `${emp.firstName} ${emp.lastName} ${emp.id}`
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchStatus = statusFilter === 'All' || emp.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleExport = (format) => {
    console.log(`Exporting Master File to ${format.toUpperCase()}...`);
    alert(`Success: Master File ${format.toUpperCase()} export initiated.`);
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
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#023DFB', letterSpacing: '0.02em' }}>
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
                      <SearchIcon sx={{ color: '#023DFB', fontSize: '1.1rem' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  minWidth: 250,
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
              '&:hover': { bgcolor: 'rgba(0,0,0,0.3)' } 
            },
            overflowX: 'auto',
          }}>
            <Table stickyHeader size="small">
              <TableHead>
                <TableRow>
                  {[
                    'Employee ID', 'Last Name', 'First Name', 'Middle Name', 'Suffix', 'Photo',
                    'Gender', 'Civil Status', 'Date of Birth', 'Place of Birth', 'Nationality',
                    'Religion', 'Contact Number', 'Personal Email', 'Company Email',
                    'Current Address', 'Permanent Address', 'Emergency Contact', 'Number', 'Relationship', 'Status'
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
    </Box>
  );
}
