import React, { useState } from 'react';
import {
  Box, Card, CardContent, Typography, Grid, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, TextField, InputAdornment, Button, Chip
} from '@mui/material';
import { Search as SearchIcon, FileDownload as CsvIcon, Print as PrintIcon } from '@mui/icons-material';
import { exportToCSV, printTable } from '../../utils/exportUtils';

const headerStyle = {
  bgcolor: '#023DFB',
  color: '#fff',
  fontWeight: 700,
  fontSize: '0.65rem',
  padding: '10px 6px',
  textAlign: 'left',
  border: '1px solid rgba(255,255,255,0.1)',
  whiteSpace: 'nowrap'
};

const cellStyle = {
  fontSize: '0.7rem',
  padding: '8px 6px',
  border: '1px solid #eee',
  whiteSpace: 'nowrap'
};

const mockLeaveApps = [
  { 
    id: 1, dateFiled: 'Mar 6, 2026 (Fri)', name: 'Cabangon, Samuel Alauren', empId: '', position: '', dept: '',
    type: 'VL', startDate: 'Feb 18, 2026 (Wed)', endDate: 'Feb 20, 2026 (Fri)', days: '3.0',
    remaining: '', reason: 'Vacation', remarks: 'Approved', systemId: 'Cabangon, Samuel Alauren-VL'
  },
  { 
    id: 2, dateFiled: 'Feb 27, 2026 (Fri)', name: 'Tupas, Ma. Lyn Jee Billones', empId: '', position: '', dept: '',
    type: 'VL', startDate: 'Mar 2, 2026 (Mon)', endDate: 'Mar 3, 2026 (Tue)', days: '2.0',
    remaining: '', reason: 'Vacation', remarks: 'Approved', systemId: 'Tupas, Ma. Lyn Jee Billones-VL'
  }
];

export default function LeaveApplications() {
  const [search, setSearch] = useState('');

  const filteredData = mockLeaveApps.filter(item => 
    item.name.toLowerCase().includes(search.toLowerCase()) || 
    item.systemId.toLowerCase().includes(search.toLowerCase())
  );

  const exportHeaders = [
    'Date Filed', 'Employee ID', 'Name of Employee', 'Position', 'Department', 
    'Type of Leave', 'Start Date', 'End Date', 'No. of Days', 'Remaining Leave', 
    'Reason', 'Remarks', "Dont's delete this column"
  ];

  const exportRows = filteredData.map(r => [
    r.dateFiled, r.empId, r.name, r.position, r.dept,
    r.type, r.startDate, r.endDate, r.days, r.remaining,
    r.reason, r.remarks, r.systemId
  ]);

  return (
    <Box className="page-container">
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#023DFB', mb: 1 }}>Leave Applications</Typography>
          <Typography variant="body2" color="text.secondary">Review and manage filed leaves</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="outlined" startIcon={<CsvIcon />} onClick={() => exportToCSV(exportHeaders, exportRows, 'leave_applications')}>CSV</Button>
          <Button variant="outlined" startIcon={<PrintIcon />} onClick={() => printTable('FILED LEAVES', exportHeaders, exportRows)}>Print</Button>
        </Box>
      </Box>

      <Card sx={{ borderRadius: 3, mb: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="caption" sx={{ color: '#d32f2f', fontWeight: 700, display: 'block', mb: 2 }}>
            ** if the leave duration is halfday only, kindly put 0.5 in no.of days
          </Typography>
          <TextField
            fullWidth size="small"
            placeholder="Search employee..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment> }}
            sx={{ maxWidth: 400 }}
          />
        </CardContent>
      </Card>

      <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: '0 10px 30px rgba(0,0,0,0.08)', overflowX: 'auto', maxHeight: '65vh' }}>
        <Table stickyHeader size="small" sx={{ minWidth: 1600 }}>
          <TableHead>
            <TableRow>
              <TableCell sx={headerStyle}>Date Filed</TableCell>
              <TableCell sx={headerStyle}>Employee ID</TableCell>
              <TableCell sx={headerStyle}>Name of Employee</TableCell>
              <TableCell sx={headerStyle}>Position</TableCell>
              <TableCell sx={headerStyle}>Department</TableCell>
              <TableCell sx={headerStyle}>Type of Leave</TableCell>
              <TableCell sx={headerStyle}>Start Date</TableCell>
              <TableCell sx={headerStyle}>End Date</TableCell>
              <TableCell sx={{ ...headerStyle, textAlign: 'center' }}>No. of Days</TableCell>
              <TableCell sx={headerStyle}>Remaining Leave</TableCell>
              <TableCell sx={headerStyle}>Reason</TableCell>
              <TableCell sx={headerStyle}>Remarks</TableCell>
              <TableCell sx={{ ...headerStyle, bgcolor: '#f5f5f5', color: '#666', fontSize: '0.6rem' }}>Dont's delete this column</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData.map((row) => (
              <TableRow key={row.id} hover>
                <TableCell sx={cellStyle}>{row.dateFiled}</TableCell>
                <TableCell sx={cellStyle}>{row.empId}</TableCell>
                <TableCell sx={{ ...cellStyle, fontWeight: 700, color: '#023DFB' }}>{row.name}</TableCell>
                <TableCell sx={cellStyle}>{row.position}</TableCell>
                <TableCell sx={cellStyle}>{row.dept}</TableCell>
                <TableCell sx={cellStyle}>{row.type}</TableCell>
                <TableCell sx={cellStyle}>{row.startDate}</TableCell>
                <TableCell sx={cellStyle}>{row.endDate}</TableCell>
                <TableCell sx={{ ...cellStyle, textAlign: 'center', fontWeight: 600 }}>{row.days}</TableCell>
                <TableCell sx={cellStyle}>{row.remaining}</TableCell>
                <TableCell sx={cellStyle}>{row.reason}</TableCell>
                <TableCell sx={cellStyle}>
                   <Chip label={row.remarks} size="small" sx={{
                      fontWeight: 700, fontSize: '0.7rem',
                      bgcolor: row.remarks === 'Approved' ? 'rgba(46,125,50,0.1)' : 'rgba(230,81,0,0.1)',
                      color: row.remarks === 'Approved' ? '#2e7d32' : '#ed6c02',
                   }} />
                </TableCell>
                <TableCell sx={{ ...cellStyle, bgcolor: '#fafafa', color: '#999', fontSize: '0.65rem' }}>{row.systemId}</TableCell>
              </TableRow>
            ))}
            {filteredData.length === 0 && (
              <TableRow>
                <TableCell colSpan={13} align="center" sx={{ py: 4 }}>No data found.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
