import React, { useState } from 'react';
import {
  Box, Card, CardContent, Typography, Grid, Button, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Paper, Chip, Avatar,
  IconButton, Tooltip, TextField, InputAdornment
} from '@mui/material';
import {
  Search as SearchIcon,
  AssignmentTurnedIn as ClearanceIcon,
  Visibility as ViewIcon,
  Print as PrintIcon,
  FilterList as FilterIcon
} from '@mui/icons-material';
import { employees, staffClearanceRecords } from '../../data/mockData';
import StaffClearanceForm from './StaffClearanceForm';

const logoBlue = '#0241FB';

export default function StaffClearance() {
  const [search, setSearch] = useState('');
  const [selectedClearance, setSelectedClearance] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const filteredRecords = staffClearanceRecords.filter(record => {
    const emp = employees.find(e => e.id === record.employeeId);
    const fullName = `${emp?.firstName} ${emp?.lastName}`.toLowerCase();
    return fullName.includes(search.toLowerCase()) || record.id.toLowerCase().includes(search.toLowerCase());
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Cleared': return '#2e7d32';
      case 'Pending': return '#ed6c02';
      case 'Rejected': return '#d32f2f';
      default: return '#0288d1';
    }
  };

  const handleOpenForm = (record) => {
    setSelectedClearance(record);
    setIsFormOpen(true);
  };

  return (
    <Box className="page-container">
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" sx={{ 
            fontWeight: 800, color: logoBlue, 
            background: `linear-gradient(90deg, ${logoBlue}, #4470ED)`,
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            mb: 0.5 
          }}>
            Staff Clearance
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
            Management and tracking of employee clearance forms for exit processing
          </Typography>
        </Box>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {[
          { label: 'Total Requests', count: staffClearanceRecords.length, color: logoBlue },
          { label: 'Pending Clearances', count: staffClearanceRecords.filter(r => r.status === 'Pending').length, color: '#ed6c02' },
          { label: 'Cleared Staff', count: staffClearanceRecords.filter(r => r.status === 'Cleared').length, color: '#2e7d32' },
        ].map((stat, i) => (
          <Grid item xs={12} sm={4} key={i}>
            <Card sx={{ borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <Typography variant="h3" sx={{ fontWeight: 800, color: stat.color }}>{stat.count}</Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 700, mt: 1 }}>{stat.label}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Main Table Card */}
      <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
        <CardContent sx={{ p: 0 }}>
          <Box sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee' }}>
            <TextField
              size="small"
              placeholder="Search by name or Clearance ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              sx={{ width: 350 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: 'text.secondary' }} />
                  </InputAdornment>
                ),
              }}
            />
            <Button startIcon={<FilterIcon />} variant="outlined" sx={{ borderRadius: 2 }}>Filters</Button>
          </Box>

          <TableContainer>
            <Table>
              <TableHead sx={{ bgcolor: 'rgba(0,0,0,0.02)' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700 }}>Clearance ID</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Employee Name</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Exit Date</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Reason</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Overall Status</TableCell>
                  <TableCell sx={{ fontWeight: 700, textAlign: 'center' }}>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredRecords.map((record) => {
                  const emp = employees.find(e => e.id === record.employeeId);
                  return (
                    <TableRow key={record.id} hover>
                      <TableCell sx={{ fontWeight: 800, color: logoBlue }}>{record.id}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Avatar sx={{ width: 32, height: 32, bgcolor: logoBlue, fontSize: '0.8rem' }}>
                            {emp?.firstName[0]}{emp?.lastName[0]}
                          </Avatar>
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 700 }}>{emp?.firstName} {emp?.lastName}</Typography>
                            <Typography variant="caption" color="text.secondary">{emp?.designation} • {emp?.department}</Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell sx={{ fontWeight: 500 }}>{new Date(record.dateExit).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Chip label={record.reason} size="small" sx={{ fontWeight: 600 }} />
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={record.status} 
                          size="small" 
                          sx={{ 
                            bgcolor: `${getStatusColor(record.status)}15`, 
                            color: getStatusColor(record.status),
                            fontWeight: 800,
                            border: `1px solid ${getStatusColor(record.status)}50`
                          }} 
                        />
                      </TableCell>
                      <TableCell sx={{ textAlign: 'center' }}>
                        <Tooltip title="View/Edit Clearance Form">
                          <IconButton onClick={() => handleOpenForm(record)} color="primary">
                            <ViewIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Print Clearance">
                          <IconButton color="secondary">
                            <PrintIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Clearance Form Modal/Drawer */}
      {selectedClearance && (
        <StaffClearanceForm 
          open={isFormOpen} 
          onClose={() => setIsFormOpen(false)} 
          clearance={selectedClearance}
        />
      )}
    </Box>
  );
}
