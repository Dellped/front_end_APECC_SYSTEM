import React, { useState, useMemo } from 'react';
import {
  Box, Card, CardContent, Typography, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Chip, Grid, Avatar, Divider,
  TextField, InputAdornment, Paper, Button, Stack
} from '@mui/material';
import {
  MoneyOff as DeductionsIcon, Search as SearchIcon,
  AccountBalance as SSSIcon,
  LocalHospital as PhilHealthIcon,
  Home as PagibigIcon,
  FileDownload as CsvIcon,
  PictureAsPdf as PdfIcon,
  Print as PrintIcon,
} from '@mui/icons-material';
import { employees, payrollRecords } from '../../data/mockData';
import { exportToCSV, printTable, exportToPDF } from '../../utils/exportUtils';

const apeccBlue = '#023DFB';
const formatCurrency = (val) => `₱${(val || 0).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

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

export default function DeductionsCompliance() {
  const [search, setSearch] = useState('');

  const activeEmps = useMemo(() => {
    return employees.filter((e) => {
      const isActive = e.status === 'Active';
      const fullName = `${e.firstName} ${e.lastName}`.toLowerCase();
      const matchesSearch = fullName.includes(search.toLowerCase()) || e.id.toLowerCase().includes(search.toLowerCase());
      return isActive && matchesSearch;
    });
  }, [search]);

  const empDeductionSummary = useMemo(() => {
    return activeEmps.map((emp) => {
      const records2026 = payrollRecords.filter((r) => r.employeeId === emp.id && r.year === 2026);
      const totalSSS = records2026.reduce((sum, r) => sum + (r.sssEE || 0), 0);
      const totalPhilHealth = records2026.reduce((sum, r) => sum + (r.phEE || 0), 0);
      const totalPagIbig = records2026.reduce((sum, r) => sum + (r.hdmfEE || 0), 0);
      const totalTax = records2026.reduce((sum, r) => sum + (r.tax || 0), 0);
      return {
        ...emp,
        totalSSS,
        totalPhilHealth,
        totalPagIbig,
        totalTax,
        totalDeductions: totalSSS + totalPhilHealth + totalPagIbig + totalTax,
      };
    });
  }, [activeEmps]);

  const grandTotals = useMemo(() => {
    return empDeductionSummary.reduce((acc, e) => ({
      sss: acc.sss + e.totalSSS,
      philHealth: acc.philHealth + e.totalPhilHealth,
      pagIbig: acc.pagIbig + e.totalPagIbig,
      tax: acc.tax + e.totalTax,
      total: acc.total + e.totalDeductions,
    }), { sss: 0, philHealth: 0, pagIbig: 0, tax: 0, total: 0 });
  }, [empDeductionSummary]);

  const contributionCards = [
    { title: 'SSS', icon: <SSSIcon />, amount: grandTotals.sss, rate: '4.5%', gradient: 'linear-gradient(135deg, #023DFB, #4a75e6)' },
    { title: 'PhilHealth', icon: <PhilHealthIcon />, amount: grandTotals.philHealth, rate: '2.5%', gradient: 'linear-gradient(135deg, #1a3a1a, #2e7d32)' },
    { title: 'Pag-IBIG', icon: <PagibigIcon />, amount: grandTotals.pagIbig, rate: '2.0%', gradient: 'linear-gradient(135deg, #7c3200, #e65100)' },
    { title: 'Withholding Tax', icon: <DeductionsIcon />, amount: grandTotals.tax, rate: 'Progressive', gradient: 'linear-gradient(135deg, #8b1a1a, #c0392b)' },
  ];

  return (
    <Box sx={{ p: 4, bgcolor: '#f4f7fe', minHeight: '100%' }}>
      {/* Page Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, color: apeccBlue, mt: 1 }}>
          Deductions & Compliance
        </Typography>
      </Box>

      {/* Summary Cards - Preserved Gradients as requested */}
      <Grid container spacing={2.5} sx={{ mb: 4 }}>
        {contributionCards.map((card, i) => (
          <Grid item xs={12} sm={6} md={3} key={i}>
            <Card className="stat-card" sx={{ borderRadius: 3, background: card.gradient, boxShadow: '0 4px 20px rgba(13,27,62,0.25)' }}>
              <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 500, fontSize: '0.78rem', mb: 0.3 }}>
                      {card.title}
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: '#fff', fontSize: '1.25rem' }}>
                      {formatCurrency(card.amount)}
                    </Typography>
                    <Chip label={`Rate: ${card.rate}`} size="small"
                      sx={{ mt: 0.5, fontSize: '0.68rem', height: 20, bgcolor: 'rgba(255,255,255,0.15)', color: '#fff', fontWeight: 600 }} />
                  </Box>
                  <Avatar sx={{ width: 40, height: 40, bgcolor: 'rgba(255,255,255,0.15)', color: '#fff', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.2)' }}>
                    {card.icon}
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Deductions Table - Light Theme to match Payroll Register */}
      <Card sx={{ borderRadius: 3, boxShadow: '0 10px 30px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
        <Box sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee', flexWrap: 'wrap', gap: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 800, color: apeccBlue }}>
             Statutory Deductions &amp; Compliance Report (2026)
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
            <TextField
                size="small"
                placeholder="Search by name or ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: 'text.secondary' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{ minWidth: 300 }}
              />
            <Stack direction="row" spacing={1}>
              <Button size="small" variant="outlined" startIcon={<CsvIcon />}
                onClick={() => exportToCSV(['Employee','Employee ID','SSS','PhilHealth','Pag-IBIG','Tax','Total Deductions'], empDeductionSummary.map(e => [`${e.firstName} ${e.lastName}`, e.id, e.totalSSS, e.totalPhilHealth, e.totalPagIbig, e.totalTax, e.totalDeductions]), 'deductions_compliance')}
                sx={{ borderRadius: 2, fontSize: '0.75rem' }}>CSV</Button>
              <Button size="small" variant="outlined" startIcon={<PdfIcon />}
                onClick={() => exportToPDF('Deductions & Compliance Report (2026)', ['Employee','Employee ID','SSS','PhilHealth','Pag-IBIG','Tax','Total Deductions'], empDeductionSummary.map(e => [`${e.firstName} ${e.lastName}`, e.id, e.totalSSS, e.totalPhilHealth, e.totalPagIbig, e.totalTax, e.totalDeductions]))}
                sx={{ borderRadius: 2, fontSize: '0.75rem' }}>PDF</Button>
              <Button size="small" variant="outlined" startIcon={<PrintIcon />}
                onClick={() => printTable('Deductions & Compliance Report (2026)', ['Employee','Employee ID','SSS','PhilHealth','Pag-IBIG','Tax','Total Deductions'], empDeductionSummary.map(e => [`${e.firstName} ${e.lastName}`, e.id, e.totalSSS, e.totalPhilHealth, e.totalPagIbig, e.totalTax, e.totalDeductions]))}
                sx={{ borderRadius: 2, fontSize: '0.75rem' }}>Print</Button>
            </Stack>
          </Box>
        </Box>
        <TableContainer component={Paper} elevation={0} sx={{ maxHeight: 600 }}>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={tableHeaderStyle}>Employee ID</TableCell>
                <TableCell sx={{ ...tableHeaderStyle, textAlign: 'left' }}>Employee</TableCell>
                <TableCell align="right" sx={tableHeaderStyle}>SSS</TableCell>
                <TableCell align="right" sx={tableHeaderStyle}>PhilHealth</TableCell>
                <TableCell align="right" sx={tableHeaderStyle}>Pag-IBIG</TableCell>
                <TableCell align="right" sx={tableHeaderStyle}>Tax</TableCell>
                <TableCell align="right" sx={tableHeaderStyle}>Total Deductions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {empDeductionSummary.map((e) => (
                <TableRow key={e.id} hover>
                   <TableCell align="center" sx={cellStyle}>{e.id}</TableCell>
                  <TableCell sx={{ ...cellStyle, fontWeight: 700, color: '#333' }}>
                    {e.firstName} {e.lastName}
                  </TableCell>
                  <TableCell align="right" sx={cellStyle}>{formatCurrency(e.totalSSS)}</TableCell>
                  <TableCell align="right" sx={cellStyle}>{formatCurrency(e.totalPhilHealth)}</TableCell>
                  <TableCell align="right" sx={cellStyle}>{formatCurrency(e.totalPagIbig)}</TableCell>
                  <TableCell align="right" sx={cellStyle}>{formatCurrency(e.totalTax)}</TableCell>
                  <TableCell align="right" sx={{ ...cellStyle, fontWeight: 800, color: '#d32f2f' }}>
                    {formatCurrency(e.totalDeductions)}
                  </TableCell>
                </TableRow>
              ))}
              
              {/* Grand Total Row */}
              <TableRow sx={{ bgcolor: 'rgba(2, 61, 251, 0.04)' }}>
                <TableCell colSpan={2} sx={{ py: 2, fontWeight: 900, color: apeccBlue, fontSize: '0.9rem' }}>
                  GRAND TOTAL
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: 800 }}>{formatCurrency(grandTotals.sss)}</TableCell>
                <TableCell align="right" sx={{ fontWeight: 800 }}>{formatCurrency(grandTotals.philHealth)}</TableCell>
                <TableCell align="right" sx={{ fontWeight: 800 }}>{formatCurrency(grandTotals.pagIbig)}</TableCell>
                <TableCell align="right" sx={{ fontWeight: 800 }}>{formatCurrency(grandTotals.tax)}</TableCell>
                <TableCell align="right" sx={{ fontWeight: 900, color: '#d32f2f', fontSize: '1rem' }}>
                  {formatCurrency(grandTotals.total)}
                </TableCell>
              </TableRow>

              {empDeductionSummary.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 8, color: 'text.secondary' }}>
                    No matching employee records found.
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
