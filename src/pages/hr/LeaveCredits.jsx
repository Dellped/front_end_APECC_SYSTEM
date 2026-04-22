import React, { useState } from 'react';
import {
  Box, Card, CardContent, Typography, Grid, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, MenuItem, Select, FormControl, InputLabel, TextField, InputAdornment, Button
} from '@mui/material';
import { Search as SearchIcon, FileDownload as CsvIcon, Print as PrintIcon } from '@mui/icons-material';
import { exportToCSV, printTable } from '../../utils/exportUtils';
import { employees } from '../../data/mockData';

const goldAccent = '#d4a843';

const headerStyle = {
  background: 'linear-gradient(135deg, #05077E 0%, #0241FB 60%, #4470ED 100%)',
  color: '#FDFDFC',
  fontWeight: 700,
  fontSize: '0.65rem',
  padding: '4px 2px',
  textAlign: 'center',
  border: '1px solid rgba(255,255,255,0.2)',
  whiteSpace: 'nowrap'
};

const cellStyle = {
  fontSize: '0.7rem',
  padding: '6px 4px',
  border: '1px solid #eee',
  textAlign: 'center',
  whiteSpace: 'nowrap'
};

const mockLeaveCredits = [
  { 
    empId: '0041', name: 'Federio, Norman Aspera', position: 'Clerk- Liason Officer', dept: 'IT', hired: '2020-01-15', tenure: 6, status: 'Regular',
    totalAvail: 15, totalUsed: 5, totalBalance: 10,
    earnedVL: 10, earnedSL: 5, earnedML: 0, earnedPL: 0,
    usedVL: 3, usedSL: 2, usedML: 0, usedPL: 0, usedSPL: 0, usedSEL: 0, usedWL: 0,
    balVL: 7, balSL: 3, balML: 0, balPL: 0, balSPL: 0, balWL: 0
  },
  { 
    empId: '0212', name: 'Saez Arvin, Donyell Aranda', position: 'Clerk-SL Field', dept: 'Human Resources', hired: '2021-06-10', tenure: 4, status: 'Regular',
    totalAvail: 15, totalUsed: 3, totalBalance: 12,
    earnedVL: 10, earnedSL: 5, earnedML: 0, earnedPL: 0,
    usedVL: 2, usedSL: 1, usedML: 0, usedPL: 0, usedSPL: 0, usedSEL: 0, usedWL: 0,
    balVL: 8, balSL: 4, balML: 0, balPL: 0, balSPL: 0, balWL: 0
  },
  { 
    empId: '0222', name: 'Bueza Raymond Alfon', position: 'Clerk-SW Field', dept: 'Finance', hired: '2025-10-01', tenure: 1, status: 'Probitionary',
    totalAvail: 5, totalUsed: 0, totalBalance: 5,
    earnedVL: 2.5, earnedSL: 2.5, earnedML: 0, earnedPL: 0,
    usedVL: 0, usedSL: 0, usedML: 0, usedPL: 0, usedSPL: 0, usedSEL: 0, usedWL: 0,
    balVL: 2.5, balSL: 2.5, balML: 0, balPL: 0, balSPL: 0, balWL: 0
  }
];

const departments = [
  'All', 'IT', 'Human Resources', 'Finance', 'Marketing', 'Operations -Product Disbursement', 
  'Admin/Human Resource Head', 'Manager', 'Operations Product/Collection Head', 
  'Admin', 'Operations -Product Collection'
];
const statuses = ['All', 'Regular', 'Probitionary'];
const months = [
  'All', 'Jan 2026', 'Feb 2026', 'Mar 2026', 'Apr 2026', 'May 2026', 'Jun 2026', 
  'Jul 2026', 'Aug 2026', 'Sep 2026', 'Oct 2026', 'Nov 2026', 'Dec 2026', 'Jan 2027'
];

export default function LeaveCredits() {
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [monthFilter, setMonthFilter] = useState('All');

  const filteredData = mockLeaveCredits.filter(item => {
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase()) || item.empId.toLowerCase().includes(search.toLowerCase());
    const matchDept = deptFilter === 'All' || item.dept === deptFilter;
    const matchStatus = statusFilter === 'All' || item.status === statusFilter;
    // Note: mock data might not be assigned exactly to a month, assuming it matches 'All'
    return matchSearch && matchDept && matchStatus;
  });

  const exportHeaders = [
    'Employee ID', 'Name of Employee', 'Position', 'Department', 'Date Hired', 'Tenure (yrs)', 'Status',
    'Total Avail', 'Total Used', 'Total Balance',
    'Earned VL', 'Earned SL', 'Earned ML', 'Earned PL',
    'Used VL', 'Used SL', 'Used ML', 'Used PL', 'Used SPL', 'Used SEL', 'Used WL',
    'Balance VL', 'Balance SL', 'Balance ML', 'Balance PL', 'Balance SPL', 'Balance WL'
  ];

  const exportRows = filteredData.map(r => [
    r.empId, r.name, r.position, r.dept, r.hired, r.tenure, r.status,
    r.totalAvail, r.totalUsed, r.totalBalance,
    r.earnedVL, r.earnedSL, r.earnedML, r.earnedPL,
    r.usedVL, r.usedSL, r.usedML, r.usedPL, r.usedSPL, r.usedSEL, r.usedWL,
    r.balVL, r.balSL, r.balML, r.balPL, r.balSPL, r.balWL
  ]);

  return (
    <Box className="page-container">
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#0241FB', mb: 1 }}>Leave Credits</Typography>
          <Typography variant="body2" color="text.secondary">Detailed view of allowances, usage, and balances</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="outlined" startIcon={<CsvIcon />} onClick={() => exportToCSV(exportHeaders, exportRows, 'leave_credits')}>CSV</Button>
          <Button variant="outlined" startIcon={<PrintIcon />} onClick={() => printTable('Leave Credits', exportHeaders, exportRows)}>Print</Button>
        </Box>
      </Box>

      <Card sx={{ borderRadius: 3, mb: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.05)', border: `1px solid ${goldAccent}` }}>
        <CardContent sx={{ p: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth size="small"
                placeholder="Search employee..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment> }}
              />
            </Grid>
            <Grid item xs={12} md={3} sx={{ minWidth: 110, '& .MuiInputLabel-root': { maxWidth: 'calc(100% - 24px)' } }} >
              <FormControl fullWidth size="small">
                <InputLabel>Department</InputLabel>
                <Select value={deptFilter} label="Department" onChange={e => setDeptFilter(e.target.value)}>
                  {departments.map((d, i) => <MenuItem key={i} value={d}>{d}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Status</InputLabel>
                <Select value={statusFilter} label="Status" onChange={e => setStatusFilter(e.target.value)}>
                  {statuses.map((s, i) => <MenuItem key={i} value={s}>{s}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Month</InputLabel>
                <Select value={monthFilter} label="Month" onChange={e => setMonthFilter(e.target.value)}>
                  {months.map((m, i) => <MenuItem key={i} value={m}>{m}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: '0 10px 30px rgba(0,0,0,0.08)', overflowX: 'auto', maxHeight: '65vh', border: `1px solid ${goldAccent}` }}>
        <Table stickyHeader size="small" sx={{ minWidth: 2400 }}>
          <TableHead>
            <TableRow>
              <TableCell sx={headerStyle} rowSpan={2}>Employee ID</TableCell>
              <TableCell sx={headerStyle} rowSpan={2}>Name of Employee</TableCell>
              <TableCell sx={headerStyle} rowSpan={2}>Position</TableCell>
              <TableCell sx={headerStyle} rowSpan={2}>Department</TableCell>
              <TableCell sx={headerStyle} rowSpan={2}>Date Hired</TableCell>
              <TableCell sx={headerStyle} rowSpan={2}>Tenure (yrs)</TableCell>
              <TableCell sx={headerStyle} rowSpan={2}>Status</TableCell>
              
              <TableCell sx={{ ...headerStyle, bgcolor: '#1a237e' }} colSpan={3}>Total Leave Credits</TableCell>
              <TableCell sx={{ ...headerStyle, bgcolor: '#8b1a1a' }} colSpan={4}>Allowed/Earned Leave Credits</TableCell>
              <TableCell sx={{ ...headerStyle, bgcolor: '#e65100' }} colSpan={7}>Used Leave</TableCell>
              <TableCell sx={{ ...headerStyle, bgcolor: '#2e7d32' }} colSpan={6}>Leave Balances</TableCell>
            </TableRow>
            <TableRow>
              {/* Total Leave Credits */}
              <TableCell sx={{...headerStyle, bgcolor: '#1a237e'}}>Avail</TableCell>
              <TableCell sx={{...headerStyle, bgcolor: '#1a237e'}}>Used</TableCell>
              <TableCell sx={{...headerStyle, bgcolor: '#1a237e'}}>Balance</TableCell>

              {/* Earned */}
              <TableCell sx={{...headerStyle, bgcolor: '#8b1a1a'}}>Vacation Leave</TableCell>
              <TableCell sx={{...headerStyle, bgcolor: '#8b1a1a'}}>Sick Leave</TableCell>
              <TableCell sx={{...headerStyle, bgcolor: '#8b1a1a'}}>Maternity Leave</TableCell>
              <TableCell sx={{...headerStyle, bgcolor: '#8b1a1a'}}>Paternity Leave</TableCell>

              {/* Used */}
              <TableCell sx={{...headerStyle, bgcolor: '#e65100'}}>VL / Annual Leave</TableCell>
              <TableCell sx={{...headerStyle, bgcolor: '#e65100'}}>Sick Leave</TableCell>
              <TableCell sx={{...headerStyle, bgcolor: '#e65100'}}>Maternity Leave</TableCell>
              <TableCell sx={{...headerStyle, bgcolor: '#e65100'}}>Paternity Leave</TableCell>
              <TableCell sx={{...headerStyle, bgcolor: '#e65100'}}>Solo Parent Leave</TableCell>
              <TableCell sx={{...headerStyle, bgcolor: '#e65100'}}>Calamity Leave</TableCell>
              <TableCell sx={{...headerStyle, bgcolor: '#e65100'}}>Wellness Leave</TableCell>

              {/* Balances */}
              <TableCell sx={{...headerStyle, bgcolor: '#2e7d32'}}>VL / Annual Leave</TableCell>
              <TableCell sx={{...headerStyle, bgcolor: '#2e7d32'}}>Sick Leave</TableCell>
              <TableCell sx={{...headerStyle, bgcolor: '#2e7d32'}}>Maternity Leave</TableCell>
              <TableCell sx={{...headerStyle, bgcolor: '#2e7d32'}}>Paternity Leave</TableCell>
              <TableCell sx={{...headerStyle, bgcolor: '#2e7d32'}}>Solo Parent Leave</TableCell>
              <TableCell sx={{...headerStyle, bgcolor: '#2e7d32'}}>Wellness Leave</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData.map((row, i) => (
              <TableRow key={i} hover>
                <TableCell sx={cellStyle}>{row.empId}</TableCell>
                <TableCell sx={{ ...cellStyle, fontWeight: 700, textAlign: 'left' }}>{row.name}</TableCell>
                <TableCell sx={{ ...cellStyle, textAlign: 'left' }}>{row.position}</TableCell>
                <TableCell sx={{ ...cellStyle, textAlign: 'left' }}>{row.dept}</TableCell>
                <TableCell sx={cellStyle}>{row.hired}</TableCell>
                <TableCell sx={cellStyle}>{row.tenure}</TableCell>
                <TableCell sx={cellStyle}>{row.status}</TableCell>
                
                <TableCell sx={{ ...cellStyle, fontWeight: 700, bgcolor: 'rgba(26,35,126,0.03)' }}>{row.totalAvail}</TableCell>
                <TableCell sx={{ ...cellStyle, fontWeight: 700, color: '#d32f2f', bgcolor: 'rgba(26,35,126,0.03)' }}>{row.totalUsed}</TableCell>
                <TableCell sx={{ ...cellStyle, fontWeight: 800, color: '#0241FB', bgcolor: 'rgba(26,35,126,0.03)' }}>{row.totalBalance}</TableCell>

                <TableCell sx={cellStyle}>{row.earnedVL}</TableCell>
                <TableCell sx={cellStyle}>{row.earnedSL}</TableCell>
                <TableCell sx={cellStyle}>{row.earnedML}</TableCell>
                <TableCell sx={cellStyle}>{row.earnedPL}</TableCell>

                <TableCell sx={cellStyle}>{row.usedVL}</TableCell>
                <TableCell sx={cellStyle}>{row.usedSL}</TableCell>
                <TableCell sx={cellStyle}>{row.usedML}</TableCell>
                <TableCell sx={cellStyle}>{row.usedPL}</TableCell>
                <TableCell sx={cellStyle}>{row.usedSPL}</TableCell>
                <TableCell sx={cellStyle}>{row.usedSEL}</TableCell>
                <TableCell sx={cellStyle}>{row.usedWL}</TableCell>

                <TableCell sx={{ ...cellStyle, fontWeight: 700 }}>{row.balVL}</TableCell>
                <TableCell sx={{ ...cellStyle, fontWeight: 700 }}>{row.balSL}</TableCell>
                <TableCell sx={{ ...cellStyle, fontWeight: 700 }}>{row.balML}</TableCell>
                <TableCell sx={{ ...cellStyle, fontWeight: 700 }}>{row.balPL}</TableCell>
                <TableCell sx={{ ...cellStyle, fontWeight: 700 }}>{row.balSPL}</TableCell>
                <TableCell sx={{ ...cellStyle, fontWeight: 700 }}>{row.balWL}</TableCell>
              </TableRow>
            ))}
            {filteredData.length === 0 && (
              <TableRow>
                <TableCell colSpan={27} align="center" sx={{ py: 4 }}>No leave credits found.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
