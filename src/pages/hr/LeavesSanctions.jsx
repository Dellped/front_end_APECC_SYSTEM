import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Box, Card, CardContent, Typography, Grid, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Chip, Tabs, Tab, Avatar, Button,
  FormControl, InputLabel, Select, MenuItem, Stack, Paper
} from '@mui/material';
import {
  EventNote as LeavesIcon, Gavel as SanctionsIcon,
  CheckCircle as ApproveIcon, Cancel as RejectIcon,
  FilterList as FilterIcon,
  FileDownload as CsvIcon,
  PictureAsPdf as PdfIcon,
  Print as PrintIcon,
} from '@mui/icons-material';
import { employees, leaveRecords, leaveBalances, sanctions, leaveTypes } from '../../data/mockData';
import { exportToCSV, printTable, exportToPDF } from '../../utils/exportUtils';

const goldAccent = '#d4a843';

const headerStyle = {
  bgcolor: '#023DFB',
  color: '#fff',
  fontWeight: 700,
  fontSize: '0.65rem',
  padding: '8px 2px',
  textAlign: 'center',
  border: '1px solid rgba(255,255,255,0.1)'
};

const cellStyle = {
  fontSize: '0.7rem',
  padding: '6px 4px',
  border: '1px solid #eee'
};

function TabPanel({ children, value, index }) {
  return value === index ? <Box sx={{ pt: 2 }}>{children}</Box> : null;
}

export default function LeavesSanctions() {
  const location = useLocation();
  const [tabValue, setTabValue] = useState(0);
  const [leaveStatusFilter, setLeaveStatusFilter] = useState('All');
  const [leaveTypeFilter, setLeaveTypeFilter] = useState('All');

  // Pre-apply filter when navigated from dashboard
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const filter = params.get('filter');
    if (filter) {
      setTabValue(0); // switch to Applications tab
      setLeaveStatusFilter(filter);
    } else {
      setLeaveStatusFilter('All');
    }
  }, [location.search]);

  const displayedLeaves = leaveRecords.filter((l) => {
    const matchStatus = leaveStatusFilter === 'All' || l.status === leaveStatusFilter;
    const matchType = leaveTypeFilter === 'All' || l.type === leaveTypeFilter;
    return matchStatus && matchType;
  });

  return (
    <Box className="page-container">

      {/* Summary Cards */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        {[
          { title: 'Total Leave Applications', value: leaveRecords.length, gradient: 'linear-gradient(135deg, #023DFB 0%, #4a75e6 100%)', icon: <LeavesIcon /> },
          { title: 'Pending Approval', value: leaveRecords.filter((l) => l.status === 'Pending').length, gradient: 'linear-gradient(135deg, #7c3200, #e65100)', icon: <LeavesIcon /> },
          { title: 'Active Sanctions', value: sanctions.filter((s) => s.status === 'Active').length, gradient: 'linear-gradient(135deg, #8b1a1a, #c0392b)', icon: <SanctionsIcon /> },
        ].map((card, i) => (
          <Grid item xs={12} sm={4} key={i}>
            <Card className="stat-card" sx={{ borderRadius: 3, background: card.gradient, boxShadow: '0 4px 20px rgba(13,27,62,0.25)' }}>
              <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 }, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 500, fontSize: '0.78rem', mb: 0.3 }}>{card.title}</Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#fff' }}>{card.value}</Typography>
                </Box>
                <Avatar sx={{ width: 44, height: 44, bgcolor: 'rgba(255,255,255,0.15)', color: '#fff', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.2)' }}>{card.icon}</Avatar>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Card sx={{ borderRadius: 3, mb: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
              <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.1rem', color: '#023DFB', mr: 2 }}>
                Leave &amp; Sanction Records
              </Typography>

              <FormControl size="small" sx={{ minWidth: 140 }}>
                <InputLabel>Type of Leave</InputLabel>
                <Select
                  label="Type of Leave"
                  value={leaveTypeFilter}
                  onChange={(e) => setLeaveTypeFilter(e.target.value)}
                  sx={{ borderRadius: 2 }}
                >
                  <MenuItem value="All">All Types</MenuItem>
                  {leaveTypes.map((t) => <MenuItem key={t} value={t}>{t}</MenuItem>)}
                </Select>
              </FormControl>

              <FormControl size="small" sx={{ minWidth: 130 }}>
                <InputLabel>Status</InputLabel>
                <Select
                  label="Status"
                  value={leaveStatusFilter}
                  onChange={(e) => setLeaveStatusFilter(e.target.value)}
                  sx={{ borderRadius: 2 }}
                >
                  <MenuItem value="All">All Status</MenuItem>
                  {['Approved', 'Recommended', 'Pending', 'Disapproved'].map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
              <Stack direction="row" spacing={1}>
                <Button size="small" variant="outlined"
                  startIcon={<CsvIcon />}
                  onClick={() => {
                    if (tabValue === 0) exportToCSV(['Employee','Type','Start Date','End Date','Days','Reason','Status'], displayedLeaves.map(l => { const emp = employees.find(e => e.id === l.employeeId); return [emp ? `${emp.firstName} ${emp.lastName}` : l.employeeId, l.type, l.startDate, l.endDate, l.days, l.reason, l.status]; }), 'leave_applications');
                    else if (tabValue === 1) exportToCSV(['Employee','Leave Type','Total','Used','Remaining'], leaveBalances.map(lb => { const emp = employees.find(e => e.id === lb.employeeId); return [emp ? `${emp.firstName} ${emp.lastName}` : lb.employeeId, lb.type, lb.total, lb.used, lb.remaining]; }), 'leave_balances');
                    else exportToCSV(['Employee','Type','Date','Reason','Status'], sanctions.map(s => { const emp = employees.find(e => e.id === s.employeeId); return [emp ? `${emp.firstName} ${emp.lastName}` : s.employeeId, s.type, s.date, s.reason, s.status]; }), 'sanctions');
                  }}
                  sx={{ borderRadius: 2, fontSize: '0.75rem' }}>CSV</Button>
                <Button size="small" variant="outlined"
                  startIcon={<PdfIcon />}
                  onClick={() => {
                    if (tabValue === 0) exportToPDF('Leave Applications', ['Employee','Type','Start Date','End Date','Days','Reason','Status'], displayedLeaves.map(l => { const emp = employees.find(e => e.id === l.employeeId); return [emp ? `${emp.firstName} ${emp.lastName}` : l.employeeId, l.type, l.startDate, l.endDate, l.days, l.reason, l.status]; }));
                    else if (tabValue === 1) exportToPDF('Leave Balances', ['Employee','Leave Type','Total','Used','Remaining'], leaveBalances.map(lb => { const emp = employees.find(e => e.id === lb.employeeId); return [emp ? `${emp.firstName} ${emp.lastName}` : lb.employeeId, lb.type, lb.total, lb.used, lb.remaining]; }));
                    else exportToPDF('Sanctions', ['Employee','Type','Date','Reason','Status'], sanctions.map(s => { const emp = employees.find(e => e.id === s.employeeId); return [emp ? `${emp.firstName} ${emp.lastName}` : s.employeeId, s.type, s.date, s.reason, s.status]; }));
                  }}
                  sx={{ borderRadius: 2, fontSize: '0.75rem' }}>PDF</Button>
                <Button size="small" variant="outlined"
                  startIcon={<PrintIcon />}
                  onClick={() => {
                    if (tabValue === 0) printTable('Leave Applications', ['Employee','Type','Start Date','End Date','Days','Reason','Status'], displayedLeaves.map(l => { const emp = employees.find(e => e.id === l.employeeId); return [emp ? `${emp.firstName} ${emp.lastName}` : l.employeeId, l.type, l.startDate, l.endDate, l.days, l.reason, l.status]; }));
                    else if (tabValue === 1) printTable('Leave Balances', ['Employee','Leave Type','Total','Used','Remaining'], leaveBalances.map(lb => { const emp = employees.find(e => e.id === lb.employeeId); return [emp ? `${emp.firstName} ${emp.lastName}` : lb.employeeId, lb.type, lb.total, lb.used, lb.remaining]; }));
                    else printTable('Sanctions', ['Employee','Type','Date','Reason','Status'], sanctions.map(s => { const emp = employees.find(e => e.id === s.employeeId); return [emp ? `${emp.firstName} ${emp.lastName}` : s.employeeId, s.type, s.date, s.reason, s.status]; }));
                  }}
                  sx={{ borderRadius: 2, fontSize: '0.75rem' }}>Print</Button>
              </Stack>
              <Tabs
                value={tabValue}
                onChange={(_, v) => setTabValue(v)}
                sx={{
                  '& .MuiTab-root': { textTransform: 'none', fontWeight: 600, fontSize: '0.85rem', minHeight: 44 },
                  '& .Mui-selected': { color: `#023DFB !important` },
                  '& .MuiTabs-indicator': { backgroundColor: '#023DFB', height: 3, borderRadius: '3px 3px 0 0' },
                }}
              >
                <Tab label="Applications" />
                <Tab label="Balances" />
                <Tab label="Sanctions" />
              </Tabs>
            </Box>
          </Box>

          {/* Leave Applications */}
          <TabPanel value={tabValue} index={0}>
            <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: '0 10px 30px rgba(0,0,0,0.08)', overflowX: 'auto' }}>
              <Table size="small" sx={{ minWidth: 800 }}>
                <TableHead>
                  <TableRow>
                    <TableCell sx={headerStyle}>Employee</TableCell>
                    <TableCell sx={headerStyle}>Type</TableCell>
                    <TableCell sx={headerStyle}>Start Date</TableCell>
                    <TableCell sx={headerStyle}>End Date</TableCell>
                    <TableCell sx={headerStyle}>Days</TableCell>
                    <TableCell sx={headerStyle}>Reason</TableCell>
                    <TableCell sx={headerStyle}>Status</TableCell>
                    <TableCell sx={headerStyle} align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {displayedLeaves.map((leave) => {
                    const emp = employees.find((e) => e.id === leave.employeeId);
                    return (
                      <TableRow key={leave.id} hover>
                        <TableCell sx={{ ...cellStyle, fontWeight: 700 }}>{emp ? `${emp.firstName} ${emp.lastName}` : leave.employeeId}</TableCell>
                        <TableCell sx={cellStyle}><Chip label={leave.type} size="small" variant="outlined" sx={{ fontSize: '0.72rem' }} /></TableCell>
                        <TableCell sx={cellStyle}>{leave.startDate}</TableCell>
                        <TableCell sx={cellStyle}>{leave.endDate}</TableCell>
                        <TableCell sx={cellStyle}>{leave.days}</TableCell>
                        <TableCell sx={cellStyle}>{leave.reason}</TableCell>
                        <TableCell sx={cellStyle}>
                          <Chip label={leave.status} size="small" sx={{
                            fontWeight: 600, fontSize: '0.72rem', height: 24,
                            bgcolor: leave.status === 'Approved' ? 'rgba(46,125,50,0.1)' 
                              : leave.status === 'Recommended' ? 'rgba(2,61,251,0.1)' 
                              : leave.status === 'Disapproved' ? 'rgba(198,40,40,0.1)' 
                              : 'rgba(230,81,0,0.1)',
                            color: leave.status === 'Approved' ? '#2e7d32' 
                              : leave.status === 'Recommended' ? '#023DFB' 
                              : leave.status === 'Disapproved' ? '#d32f2f' 
                              : '#ed6c02',
                          }} />
                        </TableCell>
                        <TableCell sx={cellStyle} align="center">
                          {(leave.status === 'Pending' || leave.status === 'Recommended') && (
                            <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                              <Button size="small" variant="contained" color="success" sx={{ minWidth: 0, p: 0.5 }}><ApproveIcon fontSize="small" /></Button>
                              <Button size="small" variant="contained" color="error" sx={{ minWidth: 0, p: 0.5 }}><RejectIcon fontSize="small" /></Button>
                            </Box>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {displayedLeaves.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={8} align="center" sx={{ py: 4, color: '#666' }}>
                        No leave records found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>

          {/* Leave Balances */}
          <TabPanel value={tabValue} index={1}>
            <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: '0 10px 30px rgba(0,0,0,0.08)', overflowX: 'auto' }}>
              <Table size="small" sx={{ minWidth: 800 }}>
                <TableHead>
                  <TableRow>
                    <TableCell sx={headerStyle}>Employee</TableCell>
                    <TableCell sx={headerStyle}>Leave Type</TableCell>
                    <TableCell sx={headerStyle} align="center">Total</TableCell>
                    <TableCell sx={headerStyle} align="center">Used</TableCell>
                    <TableCell sx={headerStyle} align="center">Remaining</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {leaveBalances.map((lb, i) => {
                    const emp = employees.find((e) => e.id === lb.employeeId);
                    return (
                      <TableRow key={i} hover>
                        <TableCell sx={{ ...cellStyle, fontWeight: 700 }}>{emp ? `${emp.firstName} ${emp.lastName}` : lb.employeeId}</TableCell>
                        <TableCell sx={cellStyle}>{lb.type}</TableCell>
                        <TableCell sx={cellStyle} align="center">{lb.total}</TableCell>
                        <TableCell sx={{ ...cellStyle, color: '#d32f2f', fontWeight: 600 }} align="center">{lb.used}</TableCell>
                        <TableCell sx={cellStyle} align="center">
                          <Chip label={lb.remaining} size="small" sx={{
                            fontWeight: 700, fontSize: '0.78rem',
                            bgcolor: lb.remaining > 5 ? 'rgba(46,125,50,0.1)' : 'rgba(230,81,0,0.1)',
                            color: lb.remaining > 5 ? '#2e7d32' : '#ed6c02',
                          }} />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>

          {/* Sanctions */}
          <TabPanel value={tabValue} index={2}>
            <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: '0 10px 30px rgba(0,0,0,0.08)', overflowX: 'auto' }}>
              <Table size="small" sx={{ minWidth: 800 }}>
                <TableHead>
                  <TableRow>
                    <TableCell sx={headerStyle}>Employee</TableCell>
                    <TableCell sx={headerStyle}>Type</TableCell>
                    <TableCell sx={headerStyle}>Date</TableCell>
                    <TableCell sx={headerStyle}>Reason</TableCell>
                    <TableCell sx={headerStyle}>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sanctions.map((s) => {
                    const emp = employees.find((e) => e.id === s.employeeId);
                    return (
                      <TableRow key={s.id} hover>
                        <TableCell sx={{ ...cellStyle, fontWeight: 700 }}>{emp ? `${emp.firstName} ${emp.lastName}` : s.employeeId}</TableCell>
                        <TableCell sx={cellStyle}>
                          <Chip label={s.type} size="small" sx={{
                            fontWeight: 600, fontSize: '0.72rem',
                            bgcolor: s.type.includes('Written') ? 'rgba(198,40,40,0.1)' : 'rgba(230,81,0,0.1)',
                            color: s.type.includes('Written') ? '#d32f2f' : '#ed6c02',
                          }} />
                        </TableCell>
                        <TableCell sx={cellStyle}>{s.date}</TableCell>
                        <TableCell sx={cellStyle}>{s.reason}</TableCell>
                        <TableCell sx={cellStyle}>
                          <Chip label={s.status} size="small" sx={{
                            fontWeight: 600, fontSize: '0.72rem',
                            bgcolor: s.status === 'Active' ? 'rgba(198,40,40,0.1)' : 'rgba(46,125,50,0.1)',
                            color: s.status === 'Active' ? '#d32f2f' : '#2e7d32',
                          }} />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>
        </CardContent>
      </Card>
    </Box>
  );
}
