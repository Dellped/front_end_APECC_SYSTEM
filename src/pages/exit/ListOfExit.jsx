import React, { useState } from 'react';
import {
  Box, Card, CardContent, Typography, TextField, InputAdornment,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Button, Stack, useTheme
} from '@mui/material';
import {
  Search as SearchIcon,
  FileDownload as CsvIcon,
  PictureAsPdf as PdfIcon,
  Print as PrintIcon,
} from '@mui/icons-material';
import { exitRecords } from '../../data/mockData';
import { exportToCSV, printTable, exportToPDF } from '../../utils/exportUtils';

export default function ListOfExit() {
  const theme = useTheme();
  const [search, setSearch] = useState('');

  const filteredRecords = exitRecords.filter((rec) =>
    rec.name.toLowerCase().includes(search.toLowerCase())
  );

  const formatEmployeeId = (id) => {
    if (!id) return '';
    const digits = id.toString().replace(/[^0-9]/g, '');
    return digits.padStart(4, '0');
  };

  const headers = [
    'No.', 'Employee ID', 'DATE OF EXIT', 'NAME', 'DESIGNATION', 'Savings', 
    'Voluntary Savings', 'Share Capital', 'Patronage Refund', 'Savings With Interest', 
    'Dividend', 'Rebates', 'Total', 'Less: STL Loan', 'Less: Salary Loan', 
    'Less: MC Loan', 'Less: Housing Loan', 'Less: Car Loan', 'Less: Educ Loan', 
    'Gadget Loan', 'Malasakit Loan', 'Grand Total', 
    'Reason', 'variance', 'CLEARANCE', 'SYSTEM', 'Rebates', 'Employee Type'
  ];

  const handleExportCSV = () => {
    const rows = filteredRecords.map(r => [
      r.no, formatEmployeeId(r.idNo), r.dateExit, r.name, r.designation, r.savings, 
      r.voluntarySavings, r.shareCapital, r.patronageRefund, r.savingsWithInterest, 
      r.dividend, r.rebates, r.total, r.stlLoan, r.salaryLoan, 
      r.motorcycleLoan, r.housingLoan, r.carLoan, r.educationalLoan, 
      r.gadgetLoan, r.malasakitLoan, r.grandTotal, 
      r.reason, r.variance, r.clearance, r.system, r.rebates2, r.employeeType
    ]);
    exportToCSV(headers, rows, 'list_of_exit');
  };

  const handleExportPDF = () => {
    const rows = filteredRecords.map(r => [
      r.no, formatEmployeeId(r.idNo), r.dateExit, r.name, r.designation, r.savings, 
      r.voluntarySavings, r.shareCapital, r.patronageRefund, r.savingsWithInterest, 
      r.dividend, r.rebates, r.total, r.stlLoan, r.salaryLoan, 
      r.motorcycleLoan, r.housingLoan, r.carLoan, r.educationalLoan, 
      r.gadgetLoan, r.malasakitLoan, r.grandTotal, 
      r.reason, r.variance, r.clearance, r.system, r.rebates2, r.employeeType
    ]);
    exportToPDF('List of Exit', headers, rows, true);
  };

  const handlePrint = () => {
    const rows = filteredRecords.map(r => [
      r.no, formatEmployeeId(r.idNo), r.dateExit, r.name, r.designation, r.savings, 
      r.voluntarySavings, r.shareCapital, r.patronageRefund, r.savingsWithInterest, 
      r.dividend, r.rebates, r.total, r.stlLoan, r.salaryLoan, 
      r.motorcycleLoan, r.housingLoan, r.carLoan, r.educationalLoan, 
      r.gadgetLoan, r.malasakitLoan, r.grandTotal, 
      r.reason, r.variance, r.clearance, r.system, r.rebates2, r.employeeType
    ]);
    printTable('List of Exit', headers, rows, true);
  };

  return (
    <Box className="page-container">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ 
          fontWeight: 800, color: '#0241FB', 
          background: 'linear-gradient(90deg, #0241FB, #4470ED)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          mb: 1 
        }}>
          List of Exit
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
          Comprehensive summary of member and employee exit settlements and accounts.
        </Typography>
      </Box>

      <Card sx={{ borderRadius: 4,borderTop: `3px solid #d4a843`, boxShadow: '0 12px 32px rgba(10,22,40,0.05)', overflow: 'hidden' }}>
        <Box sx={{ p: 3, borderBottom: '1px solid rgba(0,0,0,0.05)', display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center', justifyContent: 'space-between' }}>
          <TextField
            size="small"
            placeholder="Search by name or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: '#0241FB' }} /></InputAdornment>,
            }}
            sx={{ flex: 1, maxWidth: 400 }}
          />

          <Stack direction="row" spacing={1}>
            <Button variant="outlined" startIcon={<CsvIcon />} onClick={handleExportCSV} sx={{ borderRadius: 2 }}>Export CSV</Button>
            <Button variant="outlined" startIcon={<PdfIcon />} onClick={handleExportPDF} sx={{ borderRadius: 2 }}>Download PDF</Button>
            <Button variant="outlined" startIcon={<PrintIcon />} onClick={handlePrint} sx={{ borderRadius: 2 }}>Print</Button>
          </Stack>
        </Box>

        <TableContainer component={Paper} sx={{ boxShadow: 'none', borderRadius: 0, overflowX: 'auto' }}>
          <Table size="small" stickyHeader>
            <TableHead>
              <TableRow>
                {headers.map((header) => (
                  <TableCell key={header} sx={{ 
                    fontWeight: 700, 
                    bgcolor: 'rgba(2, 61, 251, 0.04)', 
                    whiteSpace: 'nowrap',
                    fontSize: '0.75rem',
                    color: '#0241FB',
                    borderBottom: '2px solid rgba(2, 61, 251, 0.1)'
                  }}>
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredRecords.map((row, index) => (
                <TableRow key={index} hover sx={{ '&:nth-of-type(even)': { bgcolor: 'rgba(0,0,0,0.01)' } }}>
                  <TableCell sx={{ fontSize: '0.75rem' }}>{row.no}</TableCell>
                  <TableCell sx={{ fontSize: '0.75rem', fontWeight: 600 }}>{formatEmployeeId(row.idNo)}</TableCell>
                  <TableCell sx={{ fontSize: '0.75rem' }}>{row.dateExit}</TableCell>
                  <TableCell sx={{ fontSize: '0.75rem', fontWeight: 700, whiteSpace: 'nowrap' }}>{row.name}</TableCell>
                  <TableCell sx={{ fontSize: '0.75rem', whiteSpace: 'nowrap' }}>{row.designation}</TableCell>
                  <TableCell sx={{ fontSize: '0.75rem' }}>{row.savings?.toLocaleString()}</TableCell>
                  <TableCell sx={{ fontSize: '0.75rem' }}>{row.voluntarySavings?.toLocaleString()}</TableCell>
                  <TableCell sx={{ fontSize: '0.75rem' }}>{row.shareCapital?.toLocaleString()}</TableCell>
                  <TableCell sx={{ fontSize: '0.75rem' }}>{row.patronageRefund?.toLocaleString()}</TableCell>
                  <TableCell sx={{ fontSize: '0.75rem' }}>{row.savingsWithInterest?.toLocaleString()}</TableCell>
                  <TableCell sx={{ fontSize: '0.75rem' }}>{row.dividend?.toLocaleString()}</TableCell>
                  <TableCell sx={{ fontSize: '0.75rem' }}>{row.rebates?.toLocaleString()}</TableCell>
                  <TableCell sx={{ fontSize: '0.75rem', fontWeight: 700 }}>{row.total?.toLocaleString()}</TableCell>
                  <TableCell sx={{ fontSize: '0.75rem', color: 'error.main' }}>{row.stlLoan?.toLocaleString()}</TableCell>
                  <TableCell sx={{ fontSize: '0.75rem', color: 'error.main' }}>{row.salaryLoan?.toLocaleString()}</TableCell>
                  <TableCell sx={{ fontSize: '0.75rem', color: 'error.main' }}>{row.motorcycleLoan?.toLocaleString()}</TableCell>
                  <TableCell sx={{ fontSize: '0.75rem', color: 'error.main' }}>{row.housingLoan?.toLocaleString()}</TableCell>
                  <TableCell sx={{ fontSize: '0.75rem', color: 'error.main' }}>{row.carLoan?.toLocaleString()}</TableCell>
                  <TableCell sx={{ fontSize: '0.75rem', color: 'error.main' }}>{row.educationalLoan?.toLocaleString()}</TableCell>
                  <TableCell sx={{ fontSize: '0.75rem', color: 'error.main' }}>{row.gadgetLoan?.toLocaleString()}</TableCell>
                  <TableCell sx={{ fontSize: '0.75rem', color: 'error.main' }}>{row.malasakitLoan?.toLocaleString()}</TableCell>
                  <TableCell sx={{ fontSize: '0.75rem', fontWeight: 800, bgcolor: 'rgba(212, 168, 67, 0.05)' }}>{row.grandTotal?.toLocaleString()}</TableCell>
                  <TableCell sx={{ fontSize: '0.75rem' }}>{row.reason}</TableCell>
                  <TableCell sx={{ fontSize: '0.75rem', color: row.variance < 0 ? 'error.main' : 'inherit' }}>{row.variance?.toLocaleString()}</TableCell>
                  <TableCell sx={{ fontSize: '0.75rem' }}>{row.clearance?.toLocaleString()}</TableCell>
                  <TableCell sx={{ fontSize: '0.75rem' }}>{row.system?.toLocaleString()}</TableCell>
                  <TableCell sx={{ fontSize: '0.75rem' }}>{row.rebates2?.toLocaleString()}</TableCell>
                  <TableCell sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#0241FB' }}>{row.employeeType}</TableCell>
                </TableRow>
              ))}
              {filteredRecords.length === 0 && (
                <TableRow>
                  <TableCell colSpan={28} align="center" sx={{ py: 6 }}>
                    <Typography variant="body1" color="text.secondary">No exit records found.</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Box>
  );
}
