import React, { useState } from 'react';
import {
  Box, Card, CardContent, Typography, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Chip, Avatar, TextField, InputAdornment,
  Tooltip, Paper
} from '@mui/material';
import { 
  Search as SearchIcon, 
  Assignment as RequirementsIcon,
  CheckCircle as SuccessIcon,
  Pending as PendingIcon,
  Cancel as MissingIcon
} from '@mui/icons-material';
import { employees } from '../../data/mockData';

const goldAccent = '#d4a843';
const IND = '#0241FB';
const NAV = '#05077E';

export default function Requirements() {
  const [search, setSearch] = useState('');

  const filteredEmployees = employees.filter(emp => {
    const fullName = `${emp.firstName} ${emp.lastName}`.toLowerCase();
    const empId = String(emp.id).toLowerCase();
    const q = search.toLowerCase();
    return fullName.includes(q) || empId.includes(q);
  });

  const getStatusChip = (status) => {
    const isSubmitted = status === 'Submitted';
    const isPending = status === 'Pending';
    
    return (
      <Chip
        label={status || 'Missing'}
        size="small"
        icon={isSubmitted ? <SuccessIcon sx={{ fontSize: '0.9rem !important' }} /> : isPending ? <PendingIcon sx={{ fontSize: '0.9rem !important' }} /> : <MissingIcon sx={{ fontSize: '0.9rem !important' }} />}
        sx={{
          fontWeight: 700,
          fontSize: '0.65rem',
          height: 24,
          bgcolor: isSubmitted ? '#e8f5e9' : isPending ? '#fff3e0' : '#ffebee',
          color: isSubmitted ? '#2e7d32' : isPending ? '#ef6c00' : '#c62828',
          '& .MuiChip-icon': { color: 'inherit' },
          border: '1px solid',
          borderColor: isSubmitted ? 'rgba(46, 125, 50, 0.2)' : isPending ? 'rgba(239, 108, 0, 0.2)' : 'rgba(198, 40, 40, 0.2)',
        }}
      />
    );
  };

  return (
    <Box className="page-container">
      <Card sx={{
        borderRadius: 3,
        borderTop: `3px solid ${goldAccent}`,
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
      }}>
        <CardContent sx={{ p: 3 }}>
          {/* Header & Search */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box sx={{
                width: 40, height: 40, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: `linear-gradient(135deg, ${NAV} 0%, ${IND} 100%)`,
                boxShadow: '0 4px 12px rgba(2,65,251,0.2)',
              }}>
                <RequirementsIcon sx={{ color: '#fff', fontSize: '1.2rem' }} />
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 800, color: IND, letterSpacing: '0.02em' }}>
                EMPLOYEE REQUIREMENTS
              </Typography>
            </Box>

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
                minWidth: 300,
                '& .MuiOutlinedInput-root': { borderRadius: 3, bgcolor: 'rgba(0,0,0,0.02)' }
              }}
            />
          </Box>

          {/* Table */}
          <TableContainer sx={{
            borderRadius: 2,
            border: '1px solid rgba(0,0,0,0.08)',
            maxHeight: 'calc(100vh - 250px)',
            overflowX: 'auto',
          }}>
            <Table stickyHeader size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ bgcolor: NAV, color: '#fff', fontWeight: 700, fontSize: '0.7rem', textTransform: 'uppercase' }}>Employee</TableCell>
                  <TableCell sx={{ bgcolor: NAV, color: '#fff', fontWeight: 700, fontSize: '0.7rem', textTransform: 'uppercase' }}>TIN ID</TableCell>
                  <TableCell sx={{ bgcolor: NAV, color: '#fff', fontWeight: 700, fontSize: '0.7rem', textTransform: 'uppercase' }}>SSS</TableCell>
                  <TableCell sx={{ bgcolor: NAV, color: '#fff', fontWeight: 700, fontSize: '0.7rem', textTransform: 'uppercase' }}>PhilHealth</TableCell>
                  <TableCell sx={{ bgcolor: NAV, color: '#fff', fontWeight: 700, fontSize: '0.7rem', textTransform: 'uppercase' }}>HDMF (Pag-IBIG)</TableCell>
                  <TableCell sx={{ bgcolor: NAV, color: '#fff', fontWeight: 700, fontSize: '0.7rem', textTransform: 'uppercase' }}>NBI Clearance</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredEmployees.map((emp) => (
                  <TableRow key={emp.id} hover sx={{ '&:nth-of-type(even)': { bgcolor: 'rgba(0,0,0,0.01)' } }}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: 0.5 }}>
                        <Avatar sx={{ width: 32, height: 32, fontSize: '0.8rem', bgcolor: goldAccent, fontWeight: 700 }}>
                          {emp.firstName[0]}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 700, color: IND, lineHeight: 1 }}>
                            {emp.firstName} {emp.lastName}
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                            ID: {emp.id}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    
                    <TableCell>
                      <Box>
                        {getStatusChip(emp.requirements?.tinId)}
                        <Typography variant="caption" sx={{ display: 'block', mt: 0.5, fontFamily: 'monospace', color: 'text.secondary' }}>
                          {emp.requirements?.tinNo || '—'}
                        </Typography>
                      </Box>
                    </TableCell>

                    <TableCell>
                      <Box>
                        {getStatusChip(emp.requirements?.sss)}
                        <Typography variant="caption" sx={{ display: 'block', mt: 0.5, fontFamily: 'monospace', color: 'text.secondary' }}>
                          {emp.requirements?.sssNo || '—'}
                        </Typography>
                      </Box>
                    </TableCell>

                    <TableCell>
                      <Box>
                        {getStatusChip(emp.requirements?.philhealth)}
                        <Typography variant="caption" sx={{ display: 'block', mt: 0.5, fontFamily: 'monospace', color: 'text.secondary' }}>
                          {emp.requirements?.philhealthNo || '—'}
                        </Typography>
                      </Box>
                    </TableCell>

                    <TableCell>
                      <Box>
                        {getStatusChip(emp.requirements?.hdmf)}
                        <Typography variant="caption" sx={{ display: 'block', mt: 0.5, fontFamily: 'monospace', color: 'text.secondary' }}>
                          {emp.requirements?.hdmfNo || '—'}
                        </Typography>
                      </Box>
                    </TableCell>

                    <TableCell>
                      <Box>
                        {getStatusChip(emp.requirements?.nbi)}
                        <Typography variant="caption" sx={{ display: 'block', mt: 0.5, fontFamily: 'monospace', color: 'text.secondary' }}>
                          {emp.requirements?.nbiNo || '—'}
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
              Showing {filteredEmployees.length} Employees
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
