import React, { useState, useMemo } from 'react';
import {
  Box, Card, CardContent, Typography, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, MenuItem, Select, FormControl,
  InputLabel, Grid, Chip, TextField, InputAdornment, Paper, Divider,
  TablePagination, Button, Stack
} from '@mui/material';
import { Search as SearchIcon, FileDownload as CsvIcon, PictureAsPdf as PdfIcon, Print as PrintIcon } from '@mui/icons-material';
import { employees, payrollRecords } from '../../data/mockData';
import { exportToCSV, printTable, exportToPDF } from '../../utils/exportUtils';

const apeccBlue = '#023DFB';

const tableHeaderStyle = {
  bgcolor: apeccBlue,
  color: '#fff',
  fontWeight: 700,
  fontSize: '0.75rem',
  padding: '12px 8px',
  textAlign: 'center',
  textTransform: 'uppercase'
};

const cellStyle = {
  fontSize: '0.82rem',
  padding: '10px 8px',
  borderBottom: '1px solid #f0f0f0'
};

export default function PayrollHistory() {
  const [search, setSearch] = useState('');
  const [selectedYear, setSelectedYear] = useState(() => {
    const years = [...new Set(payrollRecords.map((r) => r.year))].sort((a, b) => b - a);
    return years[0] || 2026;
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const years = [...new Set(payrollRecords.map((r) => r.year))].sort((a, b) => b - a);

  const formatCurrency = (val) => `₱${(val || 0).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const filtered = useMemo(() => {
    return payrollRecords.filter((r) => {
      const emp = employees.find(e => e.id === r.employeeId);
      const fullName = emp ? `${emp.firstName} ${emp.lastName}`.toLowerCase() : '';
      const matchesSearch = fullName.includes(search.toLowerCase()) || r.employeeId.toLowerCase().includes(search.toLowerCase());
      const matchesYear = r.year === selectedYear;
      return matchesSearch && matchesYear;
    }).sort((a, b) => a.monthIndex - b.monthIndex);
  }, [search, selectedYear]);

  const totals = useMemo(() => {
    return filtered.reduce((acc, r) => ({
      basicPay: acc.basicPay + r.basicPay,
      sss: acc.sss + (r.sssEE || 0),
      philHealth: acc.philHealth + (r.phEE || 0),
      pagIbig: acc.pagIbig + (r.hdmfEE || 0),
      tax: acc.tax + (r.tax || 0),
      netPay: acc.netPay + r.netPay,
    }), { basicPay: 0, sss: 0, philHealth: 0, pagIbig: 0, tax: 0, netPay: 0 });
  }, [filtered]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const pagedData = useMemo(() => {
    return filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [filtered, page, rowsPerPage]);

  return (
    <Box sx={{ p: 4, bgcolor: '#f4f7fe', minHeight: '100%' }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <Box>
           <Typography variant="h4" sx={{ fontWeight: 800, color: apeccBlue, mt: 1 }}>
             Payroll History
           </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
          <Chip 
            label={`${filtered.length} records`} 
            sx={{ bgcolor: 'rgba(2, 61, 251, 0.1)', color: apeccBlue, fontWeight: 700 }} 
          />
          <Stack direction="row" spacing={1}>
            <Button size="small" variant="outlined" startIcon={<CsvIcon />}
              onClick={() => { const months = ['January','February','March','April','May','June','July','August','September','October','November','December']; exportToCSV(['Employee ID','Employee','Month','Basic Pay','Deductions','Tax','Net Pay','Status'], filtered.map(r => { const emp = employees.find(e => e.id === r.employeeId); const ded = (r.sssEE||0)+(r.phEE||0)+(r.hdmfEE||0); return [r.employeeId, emp ? `${emp.firstName} ${emp.lastName}` : '---', r.month, r.basicPay, ded, r.tax, r.netPay, r.status]; }), `payroll_history_${selectedYear}`); }}
              sx={{ borderRadius: 2, fontSize: '0.75rem' }}>CSV</Button>
            <Button size="small" variant="outlined" startIcon={<PdfIcon />}
              onClick={() => { const months = ['January','February','March','April','May','June','July','August','September','October','November','December']; exportToPDF(`Payroll History ${selectedYear}`, ['Employee ID','Employee','Month','Basic Pay','Deductions','Tax','Net Pay','Status'], filtered.map(r => { const emp = employees.find(e => e.id === r.employeeId); const ded = (r.sssEE||0)+(r.phEE||0)+(r.hdmfEE||0); return [r.employeeId, emp ? `${emp.firstName} ${emp.lastName}` : '---', r.month, r.basicPay, ded, r.tax, r.netPay, r.status]; })); }}
              sx={{ borderRadius: 2, fontSize: '0.75rem' }}>PDF</Button>
            <Button size="small" variant="outlined" startIcon={<PrintIcon />}
              onClick={() => { const months = ['January','February','March','April','May','June','July','August','September','October','November','December']; printTable(`Payroll History ${selectedYear}`, ['Employee ID','Employee','Month','Basic Pay','Deductions','Tax','Net Pay','Status'], filtered.map(r => { const emp = employees.find(e => e.id === r.employeeId); const ded = (r.sssEE||0)+(r.phEE||0)+(r.hdmfEE||0); return [r.employeeId, emp ? `${emp.firstName} ${emp.lastName}` : '---', r.month, r.basicPay, ded, r.tax, r.netPay, r.status]; })); }}
              sx={{ borderRadius: 2, fontSize: '0.75rem' }}>Print</Button>
          </Stack>
        </Box>
      </Box>

      {/* Filters Card */}
      <Card sx={{ borderRadius: 3, mb: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
        <CardContent sx={{ p: 3 }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                size="small"
                placeholder="Search Employee name or ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: 'text.secondary' }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Fiscal Year</InputLabel>
                <Select 
                  value={selectedYear} 
                  label="Fiscal Year" 
                  onChange={(e) => setSelectedYear(e.target.value)}
                >
                  {years.map((y) => <MenuItem key={y} value={y}>{y}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* History Table */}
      <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: '0 10px 30px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={tableHeaderStyle}>Employee ID</TableCell>
              <TableCell sx={tableHeaderStyle}>Employee</TableCell>
              <TableCell sx={tableHeaderStyle}>Month</TableCell>
              <TableCell align="right" sx={tableHeaderStyle}>Basic Pay</TableCell>
              <TableCell align="right" sx={tableHeaderStyle}>Deductions (EE)</TableCell>
              <TableCell align="right" sx={tableHeaderStyle}>Tax</TableCell>
              <TableCell align="right" sx={tableHeaderStyle}>Net Pay</TableCell>
              <TableCell align="center" sx={tableHeaderStyle}>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pagedData.map((r) => {
              const emp = employees.find((e) => e.id === r.employeeId);
              const totalDeductions = (r.sssEE || 0) + (r.phEE || 0) + (r.hdmfEE || 0);
              return (
                <TableRow key={r.id} hover>
                  <TableCell sx={{ ...cellStyle, fontWeight: 600 }}>{r.employeeId}</TableCell>
                  <TableCell sx={{ ...cellStyle, fontWeight: 700 }}>
                    {emp ? `${emp.firstName} ${emp.lastName}` : '---'}
                  </TableCell>
                  <TableCell sx={cellStyle}>{r.month}</TableCell>
                  <TableCell align="right" sx={cellStyle}>{formatCurrency(r.basicPay)}</TableCell>
                  <TableCell align="right" sx={{ ...cellStyle, color: '#d32f2f' }}>
                    {formatCurrency(totalDeductions)}
                  </TableCell>
                  <TableCell align="right" sx={{ ...cellStyle, color: '#d32f2f' }}>
                    {formatCurrency(r.tax)}
                  </TableCell>
                  <TableCell align="right" sx={{ ...cellStyle, fontWeight: 800, color: apeccBlue }}>
                    {formatCurrency(r.netPay)}
                  </TableCell>
                  <TableCell align="center" sx={cellStyle}>
                    <Chip 
                      label={r.status} 
                      size="small"
                      sx={{ 
                        bgcolor: 'rgba(76, 175, 80, 0.1)', 
                        color: '#2e7d32', 
                        fontWeight: 700, 
                        fontSize: '0.7rem' 
                      }} 
                    />
                  </TableCell>
                </TableRow>
              );
            })}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 8, color: 'text.secondary' }}>
                  No payroll records found for the selected criteria.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filtered.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      {/* Summary Footer */}
      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
         <Card sx={{ minWidth: 350, bgcolor: '#fff', borderRadius: 3, boxShadow: '0 4px 15px rgba(0,0,0,0.05)', border: '1px solid #eee' }}>
            <CardContent sx={{ p: 3 }}>
               <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 2, color: apeccBlue }}>Annual Totals Summary</Typography>
               <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                  <Typography variant="body2" color="text.secondary">Total Gross Basic:</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>{formatCurrency(totals.basicPay)}</Typography>
               </Box>
               <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                  <Typography variant="body2" color="text.secondary">Total EE Deductions:</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: '#d32f2f' }}>{formatCurrency(totals.sss + totals.philHealth + totals.pagIbig)}</Typography>
               </Box>
               <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                  <Typography variant="body2" color="text.secondary">Total Withholding Tax:</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: '#d32f2f' }}>{formatCurrency(totals.tax)}</Typography>
               </Box>
               <Divider sx={{ my: 2 }} />
               <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6" sx={{ fontWeight: 800 }}>Total Net Pay:</Typography>
                  <Typography variant="h5" sx={{ fontWeight: 900, color: apeccBlue }}>{formatCurrency(totals.netPay)}</Typography>
               </Box>
            </CardContent>
         </Card>
      </Box>
    </Box>
  );
}
