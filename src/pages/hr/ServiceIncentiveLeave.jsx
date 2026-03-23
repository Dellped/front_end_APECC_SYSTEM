import React, { useState } from 'react';
import {
  Box, Card, CardContent, Typography, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, TextField, InputAdornment, Button
} from '@mui/material';
import { Search as SearchIcon, FileDownload as CsvIcon, Print as PrintIcon } from '@mui/icons-material';
import { exportToCSV, printTable } from '../../utils/exportUtils';

const headerStyle = {
  bgcolor: '#023DFB',
  color: '#fff',
  fontWeight: 700,
  fontSize: '0.75rem',
  padding: '12px 16px',
  textTransform: 'uppercase'
};

const cellStyle = {
  fontSize: '0.85rem',
  padding: '12px 16px',
  fontWeight: 500
};

const mockSILData = [
  { id: 1, empId: 'E0041', name: 'Federio, Norman Aspera', designation: 'Clerk- Liason Officer', basicPay: '24,000', dailyRate: '920', remainingVL: '1', silAmount: '920' },
  { id: 2, empId: 'E0212', name: 'Saez Arvin  Donyell Aranda', designation: 'Clerk-SL Field', basicPay: '19,000', dailyRate: '728.50', remainingVL: '4', silAmount: '2,914' },
  { id: 3, empId: 'E0222', name: 'Bueza Raymond Alfon', designation: 'Clerk-SW Field', basicPay: '19000', dailyRate: '1,278', remainingVL: '3', silAmount: '3,834' }
];

export default function ServiceIncentiveLeave() {
  const [search, setSearch] = useState('');

  const filteredData = mockSILData.filter(item => 
    item.name.toLowerCase().includes(search.toLowerCase()) || 
    item.empId.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box className="page-container">
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#023DFB', mb: 1 }}>Service Incentive Leave (SIL)</Typography>
          <Typography variant="body2" color="text.secondary">Management of monetized unused leave credits</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="outlined" startIcon={<CsvIcon />} onClick={() => exportToCSV(['NO.', 'Employee ID', 'Employee NAME', 'DESIGNATION', 'Basic Pay', 'Per Day Amount', 'Remaining Leave VL/AL', 'SIL'], filteredData.map(r => [r.id, r.empId, r.name, r.designation, r.basicPay, r.dailyRate, r.remainingVL, r.silAmount]), 'Service_Incentive_Leave')}>CSV</Button>
          <Button variant="outlined" startIcon={<PrintIcon />} onClick={() => printTable('Service Incentive Leave', ['NO.', 'Employee ID', 'Employee NAME', 'DESIGNATION', 'Basic Pay', 'Per Day Amount', 'Remaining Leave VL/AL', 'SIL'], filteredData.map(r => [r.id, r.empId, r.name, r.designation, r.basicPay, r.dailyRate, r.remainingVL, r.silAmount]))}>Print</Button>
        </Box>
      </Box>

      <Card sx={{ borderRadius: 3, mb: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
        <CardContent sx={{ p: 3 }}>
          <TextField
            fullWidth size="small"
            placeholder="Search employee by name or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment> }}
            sx={{ maxWidth: 400 }}
          />
        </CardContent>
      </Card>

      <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: '0 10px 30px rgba(0,0,0,0.08)' }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell sx={headerStyle}>NO.</TableCell>
              <TableCell sx={headerStyle}>Employee ID</TableCell>
              <TableCell sx={headerStyle}>Employee NAME</TableCell>
              <TableCell sx={headerStyle}>DESIGNATION</TableCell>
              <TableCell sx={headerStyle} align="right">Basic Pay</TableCell>
              <TableCell sx={headerStyle} align="right">Per Day Amount</TableCell>
              <TableCell sx={headerStyle} align="center">Remaining Leave VL/AL</TableCell>
              <TableCell sx={headerStyle} align="right">SIL</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData.map((row) => (
              <TableRow key={row.id} hover>
                <TableCell sx={cellStyle}>{row.id}</TableCell>
                <TableCell sx={cellStyle}>{row.empId}</TableCell>
                <TableCell sx={{ ...cellStyle, fontWeight: 700 }}>{row.name}</TableCell>
                <TableCell sx={cellStyle}>{row.designation}</TableCell>
                <TableCell sx={{ ...cellStyle, textAlign: 'right' }}>{row.basicPay}</TableCell>
                <TableCell sx={{ ...cellStyle, textAlign: 'right', fontWeight: 600 }}>{row.dailyRate}</TableCell>
                <TableCell sx={{ ...cellStyle, textAlign: 'center', color: '#023DFB', fontWeight: 700 }}>{row.remainingVL}</TableCell>
                <TableCell sx={{ ...cellStyle, textAlign: 'right', color: '#d32f2f', fontWeight: 800 }}>{row.silAmount}</TableCell>
              </TableRow>
            ))}
            {filteredData.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} sx={{ textAlign: 'center', py: 5, color: '#999' }}>No data found</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
