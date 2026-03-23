import React, { useState, useRef } from 'react';
import {
  Box, Card, CardContent, Typography, Grid, MenuItem, Select,
  FormControl, InputLabel, Button, TextField, InputAdornment, 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Paper, IconButton, Divider
} from '@mui/material';
import { 
  Print as PrintIcon, 
  Search as SearchIcon, 
  CloudDownload as DownloadIcon,
  FilterList as FilterIcon,
  FileDownload as CsvIcon,
  PictureAsPdf as PdfIcon,
} from '@mui/icons-material';
import { employees, payrollRecords } from '../../data/mockData';
import { exportToCSV, exportToPDF } from '../../utils/exportUtils';

const formatCurrency = (val) => (val || 0).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const tableHeaderStyle = {
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
  padding: '4px 2px',
  border: '1px solid #eee'
};

export default function PayrollRegister() {
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
          <title>Payroll Register - ${months[selectedMonth]} ${selectedYear}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap');
            * { margin: 0; padding: 0; box-sizing: border-box; font-family: 'Inter', sans-serif; }
            body { padding: 40px; }
            h2 { text-align: center; color: #023DFB; margin-bottom: 20px; font-size: 16pt; }
            table { width: 100%; border-collapse: collapse; font-size: 8pt; table-layout: fixed; }
            th { border: 1px solid #000; padding: 6px 2px; background-color: #023DFB !important; color: white !important; font-weight: 700; -webkit-print-color-adjust: exact; }
            td { border: 1px solid #000; padding: 4px 2px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
            .text-center { text-align: center; }
            .text-right { text-align: right; }
            .name-cell { font-weight: 700; text-align: left; padding-left: 4px; }
            @media print {
              body { padding: 0; }
              @page { size: landscape; margin: 1cm; }
            }
          </style>
        </head>
        <body>
          <h2>APECC PAYROLL REGISTER - ${months[selectedMonth].toUpperCase()} ${selectedYear}</h2>
          <table>
            <thead>
              <tr>
                <th style="width: 30px">RN</th>
                <th style="width: 150px">Name of Employee</th>
                <th style="width: 70px">ID no.</th>
                <th style="width: 120px">Designation</th>
                <th>Basic Pay</th>
                <th>Deminimis</th>
                <th>Non-Taxable</th>
                <th>Total Income</th>
                <th>SSS (ER)</th>
                <th>PH (ER)</th>
                <th>HDMF (ER)</th>
                <th>Tax</th>
                <th>SSS(EE)</th>
                <th>PH(EE)</th>
                <th>HDMF(EE)</th>
                <th>Total Deductions</th>
                <th>Take-Home Pay</th>
                <th style="width: 80px">1st / 2nd Half</th>
                <th style="width: 80px">Signature</th>
              </tr>
            </thead>
            <tbody>
              ${filteredRecords.map((r, i) => {
                const emp = employees.find(e => e.id === r.employeeId);
                return `
                  <tr>
                    <td class="text-center">${i + 1}</td>
                    <td class="name-cell">${emp?.lastName}, ${emp?.firstName}</td>
                    <td class="text-center">${emp?.id}</td>
                    <td>${emp?.designation}</td>
                    <td class="text-right">${formatCurrency(r.basicPay)}</td>
                    <td class="text-right">${formatCurrency(r.deminimis)}</td>
                    <td class="text-right">${formatCurrency(r.nonTaxable)}</td>
                    <td class="text-right"><strong>${formatCurrency(r.totalIncome)}</strong></td>
                    <td class="text-right">${formatCurrency(r.sssER)}</td>
                    <td class="text-right">${formatCurrency(r.phER)}</td>
                    <td class="text-right">${formatCurrency(r.hdmfER)}</td>
                    <td class="text-right">${formatCurrency(r.tax)}</td>
                    <td class="text-right">${formatCurrency(r.sssEE)}</td>
                    <td class="text-right">${formatCurrency(r.phEE)}</td>
                    <td class="text-right">${formatCurrency(r.hdmfEE)}</td>
                    <td class="text-right"><strong>${formatCurrency(r.totalDeduction)}</strong></td>
                    <td class="text-right" style="color: #023DFB"><strong>${formatCurrency(r.netPay)}</strong></td>
                    <td class="text-right" style="font-size: 7pt">
                      ${formatCurrency(r.firstHalf)}<br/>${formatCurrency(r.secondHalf)}
                    </td>
                    <td></td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `);
    
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
        printWindow.print();
        printWindow.close();
    }, 500);
  };

  return (
    <Box className="page-container">

      {/* Header & Controls */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <Box>
           <Typography variant="h4" sx={{ fontWeight: 800, color: '#023DFB', mb: 1 }}>Payroll Register</Typography>
           <Typography variant="body2" color="text.secondary">Comprehensive payroll worksheet and statutory contributions report</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
           <Button variant="outlined" startIcon={<CsvIcon />}
             onClick={() => exportToCSV(
               ['#','Employee','ID','Designation','Basic Pay','Deminimis','Non-Taxable','Total Income','SSS (ER)','PH (ER)','HDMF (ER)','Tax','SSS (EE)','PH (EE)','HDMF (EE)','Total Deductions','Net Pay'],
               filteredRecords.map((r, i) => { const emp = employees.find(e => e.id === r.employeeId); return [i+1, `${emp?.lastName}, ${emp?.firstName}`, emp?.id, emp?.designation, r.basicPay, r.deminimis, r.nonTaxable, r.totalIncome, r.sssER, r.phER, r.hdmfER, r.tax, r.sssEE, r.phEE, r.hdmfEE, r.totalDeduction, r.netPay]; }),
               `payroll_register_${months[selectedMonth]}_${selectedYear}`
             )}>Export CSV</Button>
           <Button variant="outlined" startIcon={<PdfIcon />}
             onClick={() => exportToPDF(`Payroll Register - ${months[selectedMonth]} ${selectedYear}`,
               ['#','Employee','ID','Designation','Basic Pay','Deminimis','Non-Taxable','Total Income','SSS (ER)','PH (ER)','HDMF (ER)','Tax','SSS (EE)','PH (EE)','HDMF (EE)','Total Deductions','Net Pay'],
               filteredRecords.map((r, i) => { const emp = employees.find(e => e.id === r.employeeId); return [i+1, `${emp?.lastName}, ${emp?.firstName}`, emp?.id, emp?.designation, r.basicPay, r.deminimis, r.nonTaxable, r.totalIncome, r.sssER, r.phER, r.hdmfER, r.tax, r.sssEE, r.phEE, r.hdmfEE, r.totalDeduction, r.netPay]; })
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
            <Grid item xs={12} md={2}>
               <Button fullWidth variant="text" startIcon={<FilterIcon />}>More Filters</Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Register Table */}
      <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: '0 10px 30px rgba(0,0,0,0.08)', overflowX: 'auto' }} ref={tableRef}>
        <Table stickyHeader size="small" sx={{ minWidth: 1500 }}>
          <TableHead>
            <TableRow>
              <TableCell sx={tableHeaderStyle}>RN</TableCell>
              <TableCell sx={tableHeaderStyle}>Name of Employee</TableCell>
              <TableCell sx={tableHeaderStyle}>ID no.</TableCell>
              <TableCell sx={tableHeaderStyle}>Designation</TableCell>
              <TableCell sx={tableHeaderStyle}>Basic Pay</TableCell>
              <TableCell sx={tableHeaderStyle}>Deminimis</TableCell>
              <TableCell sx={tableHeaderStyle}>Non-Taxable</TableCell>
              <TableCell sx={tableHeaderStyle}>Total Income</TableCell>
              <TableCell sx={tableHeaderStyle}>SSS (ER)</TableCell>
              <TableCell sx={tableHeaderStyle}>PH (ER)</TableCell>
              <TableCell sx={tableHeaderStyle}>HDMF (ER)</TableCell>
              <TableCell sx={tableHeaderStyle}>Tax</TableCell>
              <TableCell sx={tableHeaderStyle}>SSS(EE)</TableCell>
              <TableCell sx={tableHeaderStyle}>PH(EE)</TableCell>
              <TableCell sx={tableHeaderStyle}>HDMF(EE)</TableCell>
              <TableCell sx={tableHeaderStyle}>Total Deductions</TableCell>
              <TableCell sx={tableHeaderStyle}>Take-Home Pay</TableCell>
              <TableCell sx={tableHeaderStyle}>1st / 2nd Half</TableCell>
              <TableCell sx={tableHeaderStyle}>Signature</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRecords.map((record, index) => {
              const emp = employees.find(e => e.id === record.employeeId);
              return (
                <TableRow key={record.id} hover>
                  <TableCell sx={{ ...cellStyle, textAlign: 'center' }}>{index + 1}</TableCell>
                  <TableCell sx={{ ...cellStyle, fontWeight: 700 }}>{emp?.lastName}, {emp?.firstName} {emp?.middleName || ''}</TableCell>
                  <TableCell sx={{ ...cellStyle, textAlign: 'center' }}>{emp?.id}</TableCell>
                  <TableCell sx={{ ...cellStyle }}>{emp?.designation}</TableCell>
                  <TableCell sx={{ ...cellStyle, textAlign: 'right' }}>{formatCurrency(record.basicPay)}</TableCell>
                  <TableCell sx={{ ...cellStyle, textAlign: 'right' }}>{formatCurrency(record.deminimis)}</TableCell>
                  <TableCell sx={{ ...cellStyle, textAlign: 'right' }}>{formatCurrency(record.nonTaxable)}</TableCell>
                  <TableCell sx={{ ...cellStyle, textAlign: 'right', fontWeight: 700, bgcolor: 'rgba(2, 61, 251, 0.02)' }}>{formatCurrency(record.totalIncome)}</TableCell>
                  <TableCell sx={{ ...cellStyle, textAlign: 'right', color: '#666' }}>{formatCurrency(record.sssER)}</TableCell>
                  <TableCell sx={{ ...cellStyle, textAlign: 'right', color: '#666' }}>{formatCurrency(record.phER)}</TableCell>
                  <TableCell sx={{ ...cellStyle, textAlign: 'right', color: '#666' }}>{formatCurrency(record.hdmfER)}</TableCell>
                  <TableCell sx={{ ...cellStyle, textAlign: 'right', color: '#d32f2f' }}>{formatCurrency(record.tax)}</TableCell>
                  <TableCell sx={{ ...cellStyle, textAlign: 'right', color: '#d32f2f' }}>{formatCurrency(record.sssEE)}</TableCell>
                  <TableCell sx={{ ...cellStyle, textAlign: 'right', color: '#d32f2f' }}>{formatCurrency(record.phEE)}</TableCell>
                  <TableCell sx={{ ...cellStyle, textAlign: 'right', color: '#d32f2f' }}>{formatCurrency(record.hdmfEE)}</TableCell>
                  <TableCell sx={{ ...cellStyle, textAlign: 'right', fontWeight: 700, color: '#d32f2f' }}>{formatCurrency(record.totalDeduction)}</TableCell>
                  <TableCell sx={{ ...cellStyle, textAlign: 'right', fontWeight: 800, color: '#023DFB' }}>{formatCurrency(record.netPay)}</TableCell>
                  <TableCell sx={{ ...cellStyle, padding: 0 }}>
                     <Box sx={{ borderBottom: '1px solid #eee', px: 1, py: 0.5, textAlign: 'right' }}>{formatCurrency(record.firstHalf)}</Box>
                     <Box sx={{ px: 1, py: 0.5, textAlign: 'right' }}>{formatCurrency(record.secondHalf)}</Box>
                  </TableCell>
                  <TableCell sx={{ ...cellStyle }}></TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Summary Footer */}
      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
         <Card sx={{ minWidth: 300, bgcolor: '#f8f9fa', borderRadius: 2 }}>
            <CardContent>
               <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>Monthly Totals</Typography>
               <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="caption">Total Gross Payroll:</Typography>
                  <Typography variant="caption" sx={{ fontWeight: 700 }}>{formatCurrency(filteredRecords.reduce((sum, r) => sum + r.totalIncome, 0))}</Typography>
               </Box>
               <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="caption">Total Statutory (ER):</Typography>
                  <Typography variant="caption" sx={{ fontWeight: 700 }}>{formatCurrency(filteredRecords.reduce((sum, r) => sum + r.sssER + r.phER + r.hdmfER, 0))}</Typography>
               </Box>
               <Divider sx={{ my: 1 }} />
               <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" sx={{ fontWeight: 800 }}>Total Net Release:</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 800, color: '#023DFB' }}>{formatCurrency(filteredRecords.reduce((sum, r) => sum + r.netPay, 0))}</Typography>
               </Box>
            </CardContent>
         </Card>
      </Box>
    </Box>
  );
}
