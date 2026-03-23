import React, { useState, useRef } from 'react';
import {
  Box, Card, CardContent, Typography, Grid, MenuItem, Select,
  FormControl, InputLabel, Button, TextField, InputAdornment, 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Paper, Divider
} from '@mui/material';
import { 
  Print as PrintIcon, 
  Search as SearchIcon, 
  FileDownload as CsvIcon,
  PictureAsPdf as PdfIcon,
  FilterList as FilterIcon
} from '@mui/icons-material';
import { employees, payrollRecords } from '../../data/mockData';
import { exportToCSV, exportToPDF } from '../../utils/exportUtils';

const formatCurrency = (val) => (val || 0).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const headerStyle = {
  bgcolor: '#023DFB',
  color: '#fff',
  fontWeight: 700,
  fontSize: '0.65rem',
  padding: '4px 2px',
  textAlign: 'center',
  border: '1px solid rgba(255,255,255,0.2)',
  whiteSpace: 'normal',
  lineHeight: 1.2
};

const subHeaderStyle = {
  bgcolor: '#f5f5f5',
  color: '#333',
  fontWeight: 700,
  fontSize: '0.6rem',
  padding: '4px 2px',
  textAlign: 'center',
  border: '1px solid #ddd',
  textTransform: 'uppercase'
};

const cellStyle = {
  fontSize: '0.7rem',
  padding: '4px 2px',
  border: '1px solid #eee'
};

export default function RemittancesAndLoans() {
  const [search, setSearch] = useState('');
  const [selectedYear, setSelectedYear] = useState(2026);
  const [selectedMonth, setSelectedMonth] = useState(0);
  const tableRef = useRef();

  const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];

  const filteredRecords = payrollRecords.filter(record => {
    const emp = employees.find(e => e.id === record.employeeId);
    if (!emp) return false;
    
    const matchesSearch = `${emp.firstName} ${emp.lastName} ${emp.id}`.toLowerCase().includes(search.toLowerCase());
    const matchesYear = record.year === selectedYear;
    const matchesMonth = record.monthIndex === selectedMonth;
    
    return matchesSearch && matchesYear && matchesMonth;
  });

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    const tableHtml = tableRef.current.innerHTML;
    
    printWindow.document.write(`
      <html>
        <head>
          <title>Remittances and Loans - ${months[selectedMonth]} ${selectedYear}</title>
          <style>
            @page { size: portrait; margin: 10mm; }
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 20px; color: #333; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; table-layout: fixed; }
            th, td { border: 1px solid #ddd; padding: 4px 2px; text-align: left; font-size: 8px; word-wrap: break-word; overflow: hidden; }
            th { background-color: #023DFB !important; color: white !important; font-weight: bold; text-align: center; text-transform: uppercase; }
            .sub-header { background-color: #f5f5f5 !important; color: #333 !important; font-size: 7px; }
            .earnings-cell { background-color: rgba(2, 61, 251, 0.02); }
            .deduction-cell { color: #d32f2f; }
            .net-pay { font-weight: bold; color: #023DFB; }
            h2 { margin: 0 0 5px 0; color: #023DFB; font-size: 16px; }
            p { margin: 0 0 15px 0; color: #666; font-size: 10px; }
            .footer-note { margin-top: 20px; font-size: 8px; color: #888; border-top: 1px solid #eee; padding-top: 10px; }
          </style>
        </head>
        <body>
          <h2>Remittances and Loans Report</h2>
          <p>Period: ${months[selectedMonth]} ${selectedYear}</p>
          ${tableHtml}
          <div class="footer-note">
            Printed on: ${new Date().toLocaleString()}<br/>
            APECC Web System - Human Resources Module
          </div>
          <script>
            window.onload = () => {
              window.print();
              window.onafterprint = () => window.close();
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <Box className="page-container">

      {/* Header & Controls */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <Box>
           <Typography variant="h4" sx={{ fontWeight: 800, color: '#023DFB', mb: 1 }}>Remittances and Loans</Typography>
           <Typography variant="body2" color="text.secondary">Detailed tracking of statutory remittances and cooperative loans</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
           <Button variant="outlined" startIcon={<CsvIcon />}
             onClick={() => exportToCSV(
               ['#','Name','ID','Position','Basic Pay','Deminimis','Repair & Maint.','Gross','Savings','Membership','Other Ded.','Housing Loan','Salary Loan','STL','Malasakit Loan','Educ Loan','MC Loan','Statutory Remit.','Ded.(Loans,Savings)','Total Deduction','Net Income'],
               filteredRecords.map((r, i) => { const emp = employees.find(e => e.id === r.employeeId); return [i+1, `${emp?.lastName}, ${emp?.firstName}`, emp?.id, emp?.designation, r.basicPay, r.deminimis, r.repairMaintenance, r.totalIncome, r.savings, r.membership, r.otherDeduction, r.housingLoan, r.salaryLoan, r.stl, r.malasakitLoan, r.educLoan, r.mcLoan, r.statutoryRemittance, r.savings+r.membership+r.otherDeduction+r.housingLoan+r.salaryLoan+r.stl+r.malasakitLoan+r.educLoan+r.mcLoan, r.totalDeduction, r.netPay]; }),
               `remittances_loans_${months[selectedMonth]}_${selectedYear}`
             )}>Export CSV</Button>
           <Button variant="outlined" startIcon={<PdfIcon />}
             onClick={() => exportToPDF(`Remittances and Loans - ${months[selectedMonth]} ${selectedYear}`,
               ['#','Name','ID','Position','Basic Pay','Gross','Savings','Membership','Housing Loan','Salary Loan','STL','Total Deduction','Net Income'],
               filteredRecords.map((r, i) => { const emp = employees.find(e => e.id === r.employeeId); return [i+1, `${emp?.lastName}, ${emp?.firstName}`, emp?.id, emp?.designation, r.basicPay, r.totalIncome, r.savings, r.membership, r.housingLoan, r.salaryLoan, r.stl, r.totalDeduction, r.netPay]; })
             )}>Export PDF</Button>
           <Button variant="contained" startIcon={<PrintIcon />} onClick={handlePrint} sx={{ bgcolor: '#023DFB' }}>Print Report</Button>
        </Box>
      </Box>

      {/* Filters */}
      <Card sx={{ borderRadius: 3, mb: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
        <CardContent sx={{ p: 3 }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth size="small"
                placeholder="Search employee..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                InputProps={{
                  startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment>,
                }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Year</InputLabel>
                <Select value={selectedYear} label="Year" onChange={(e) => setSelectedYear(e.target.value)}>
                  {[2026, 2025, 2024].map(y => <MenuItem key={y} value={y}>{y}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Month</InputLabel>
                <Select value={selectedMonth} label="Month" onChange={(e) => setSelectedMonth(e.target.value)}>
                  {months.map((m, i) => <MenuItem key={i} value={i}>{m}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Table */}
      <TableContainer ref={tableRef} component={Paper} sx={{ borderRadius: 3, boxShadow: '0 10px 30px rgba(0,0,0,0.08)', overflowX: 'auto' }}>
        <Table stickyHeader size="small" sx={{ minWidth: 1800 }}>
          <TableHead>
            {/* Main Header Grouping */}
            <TableRow>
              <TableCell sx={headerStyle} rowSpan={2}>#</TableCell>
              <TableCell sx={headerStyle} rowSpan={2}>NAME OF EMPLOYEE</TableCell>
              <TableCell sx={headerStyle} rowSpan={2}>ID #</TableCell>
              <TableCell sx={headerStyle} rowSpan={2}>POSITION</TableCell>
              <TableCell sx={headerStyle} rowSpan={2}>BASIC PAY</TableCell>
              <TableCell sx={headerStyle} rowSpan={2}>DEMINIMIS</TableCell>
              <TableCell sx={headerStyle} rowSpan={2}>REPAIR AND MAINTENEACE</TableCell>
              <TableCell sx={headerStyle} rowSpan={2}>GROSS COMPENSATION</TableCell>
              <TableCell sx={headerStyle} colSpan={3}>LESS</TableCell>
              <TableCell sx={headerStyle} colSpan={6}>LESS LOAN PAYMENT</TableCell>
              <TableCell sx={headerStyle} rowSpan={2}>REMITTANCES & TAX</TableCell>
              <TableCell sx={headerStyle} rowSpan={2}>DEDUCTION (LOANS, SAVINGS)</TableCell>
              <TableCell sx={headerStyle} rowSpan={2}>TOTAL DEDUCTION</TableCell>
              <TableCell sx={headerStyle} rowSpan={2}>NET INCOME</TableCell>
              <TableCell rowSpan={2} sx={{ ...headerStyle, minWidth: 100 }}>SIGNATURE</TableCell>
            </TableRow>
            {/* Sub Headers */}
            <TableRow>
              <TableCell sx={subHeaderStyle}>SAVINGS</TableCell>
              <TableCell sx={subHeaderStyle}>MEMBERSHIP</TableCell>
              <TableCell sx={subHeaderStyle}>OTHER DEDUCTION</TableCell>
              <TableCell sx={subHeaderStyle}>HOUSING</TableCell>
              <TableCell sx={subHeaderStyle}>SALARY</TableCell>
              <TableCell sx={subHeaderStyle}>STL</TableCell>
              <TableCell sx={subHeaderStyle}>MALASAKIT LOAN</TableCell>
              <TableCell sx={subHeaderStyle}>EDUC LOAN</TableCell>
              <TableCell sx={subHeaderStyle}>MC LOAN</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRecords.map((record, index) => {
              const emp = employees.find(e => e.id === record.employeeId);
              return (
                <TableRow key={record.id} hover>
                  <TableCell sx={{ ...cellStyle, textAlign: 'center' }}>{index + 1}</TableCell>
                  <TableCell sx={{ ...cellStyle, fontWeight: 700 }}>{emp?.lastName}, {emp?.firstName}</TableCell>
                  <TableCell sx={{ ...cellStyle, textAlign: 'center' }}>{emp?.id}</TableCell>
                  <TableCell sx={{ ...cellStyle }}>{emp?.designation}</TableCell>
                  <TableCell sx={{ ...cellStyle, textAlign: 'right' }}>{formatCurrency(record.basicPay)}</TableCell>
                  <TableCell sx={{ ...cellStyle, textAlign: 'right' }}>{formatCurrency(record.deminimis)}</TableCell>
                  <TableCell sx={{ ...cellStyle, textAlign: 'right' }}>{formatCurrency(record.repairMaintenance)}</TableCell>
                  <TableCell sx={{ ...cellStyle, textAlign: 'right', fontWeight: 700, bgcolor: 'rgba(2, 61, 251, 0.02)' }}>{formatCurrency(record.totalIncome)}</TableCell>
                  
                  {/* LESS Sections */}
                  <TableCell sx={{ ...cellStyle, textAlign: 'right' }}>{formatCurrency(record.savings)}</TableCell>
                  <TableCell sx={{ ...cellStyle, textAlign: 'right' }}>{formatCurrency(record.membership)}</TableCell>
                  <TableCell sx={{ ...cellStyle, textAlign: 'right' }}>{formatCurrency(record.otherDeduction)}</TableCell>
                  
                  {/* Loans */}
                  <TableCell sx={{ ...cellStyle, textAlign: 'right' }}>{formatCurrency(record.housingLoan)}</TableCell>
                  <TableCell sx={{ ...cellStyle, textAlign: 'right' }}>{formatCurrency(record.salaryLoan)}</TableCell>
                  <TableCell sx={{ ...cellStyle, textAlign: 'right' }}>{formatCurrency(record.stl)}</TableCell>
                  <TableCell sx={{ ...cellStyle, textAlign: 'right' }}>{formatCurrency(record.malasakitLoan)}</TableCell>
                  <TableCell sx={{ ...cellStyle, textAlign: 'right' }}>{formatCurrency(record.educLoan)}</TableCell>
                  <TableCell sx={{ ...cellStyle, textAlign: 'right' }}>{formatCurrency(record.mcLoan)}</TableCell>
                  
                  <TableCell sx={{ ...cellStyle, textAlign: 'right', color: '#d32f2f' }}>{formatCurrency(record.statutoryRemittance)}</TableCell>
                  <TableCell sx={{ ...cellStyle, textAlign: 'right', fontWeight: 700 }}>{formatCurrency(record.savings + record.membership + record.otherDeduction + record.housingLoan + record.salaryLoan + record.stl + record.malasakitLoan + record.educLoan + record.mcLoan)}</TableCell>
                  <TableCell sx={{ ...cellStyle, textAlign: 'right', fontWeight: 700, color: '#d32f2f' }}>{formatCurrency(record.totalDeduction)}</TableCell>
                  <TableCell sx={{ ...cellStyle, textAlign: 'right', fontWeight: 800, color: '#023DFB' }}>{formatCurrency(record.netPay)}</TableCell>
                  <TableCell sx={{ ...cellStyle }}></TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Summary Footer */}
      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
         <Card sx={{ minWidth: 350, bgcolor: '#f8f9fa', borderRadius: 2 }}>
            <CardContent>
               <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5 }}>Remittances & Loans Summary</Typography>
               <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="caption">Total Savings/Memberships:</Typography>
                  <Typography variant="caption" sx={{ fontWeight: 700 }}>{formatCurrency(filteredRecords.reduce((sum, r) => sum + r.savings + r.membership, 0))}</Typography>
               </Box>
               <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="caption">Total Loan Repayments:</Typography>
                  <Typography variant="caption" sx={{ fontWeight: 700 }}>{formatCurrency(filteredRecords.reduce((sum, r) => sum + r.housingLoan + r.salaryLoan + r.stl + r.malasakitLoan + r.educLoan + r.mcLoan, 0))}</Typography>
               </Box>
               <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="caption">Total Statutory Remittances:</Typography>
                  <Typography variant="caption" sx={{ fontWeight: 700 }}>{formatCurrency(filteredRecords.reduce((sum, r) => sum + r.statutoryRemittance, 0))}</Typography>
               </Box>
               <Divider sx={{ my: 1 }} />
               <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" sx={{ fontWeight: 800 }}>Net Payable for Period:</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 800, color: '#023DFB' }}>{formatCurrency(filteredRecords.reduce((sum, r) => sum + r.netPay, 0))}</Typography>
               </Box>
            </CardContent>
         </Card>
      </Box>
    </Box>
  );
}
