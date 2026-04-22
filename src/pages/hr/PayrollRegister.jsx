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
  background: 'linear-gradient(135deg, #05077E 0%, #0241FB 60%, #4470ED 100%)',
  color: '#FDFDFC',
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

export default function PayrollRegister({ isEmbedded = false }) {
  const [search, setSearch] = useState('');
  const [selectedYear, setSelectedYear] = useState(2026);
  const [selectedMonth, setSelectedMonth] = useState(0);
  const tableRef = useRef();

  const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const goldAccent = '#d4a843';
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
            h2 { text-align: center; color: #0241FB; margin-bottom: 20px; font-size: 16pt; }
            table { width: 100%; border-collapse: collapse; font-size: 8pt; table-layout: fixed; }
            th { border: 1px solid #000; padding: 6px 2px; background-color: #0241FB !important; color: white !important; font-weight: 700; -webkit-print-color-adjust: exact; }
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
                <th>Savings</th>
                <th>Salary Loan</th>
                <th>STL</th>
                <th>HL</th>
                <th>Educ Loan</th>
                <th>Malasakit</th>
                <th>LWOP</th>
                <th>Total Deductions</th>
                <th>Total Pay</th>
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
                    <td class="text-right">${formatCurrency(r.savings || 0)}</td>
                    <td class="text-right">${formatCurrency(r.salaryLoan || 0)}</td>
                    <td class="text-right">${formatCurrency(r.stl || 0)}</td>
                    <td class="text-right">${formatCurrency(r.hl || 0)}</td>
                    <td class="text-right">${formatCurrency(r.educLoan || 0)}</td>
                    <td class="text-right">${formatCurrency(r.malasakit || 0)}</td>
                    <td class="text-right">${formatCurrency(r.lwop || 0)}</td>
                    <td class="text-right"><strong>${formatCurrency(r.totalDeduction)}</strong></td>
                    <td class="text-right" style="color: #0241FB"><strong>${formatCurrency(r.netPay)}</strong></td>
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
    <Box className={isEmbedded ? "" : "page-container"}>

      {/* Header & Controls */}
      {!isEmbedded && (
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <Box>
           <Typography variant="h4" sx={{ fontWeight: 800, color: '#0241FB', mb: 1 }}>Payroll Register</Typography>
           <Typography variant="body2" color="text.secondary">Comprehensive payroll worksheet and statutory contributions report</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
           <Button variant="outlined" startIcon={<CsvIcon />}
             onClick={() => exportToCSV(
               ['#','Employee','ID','Designation','Basic Pay','Deminimis','Non-Taxable','Total Income','SSS (ER)','PH (ER)','HDMF (ER)','Tax','SSS (EE)','PH (EE)','HDMF (EE)','Savings','Salary Loan','STL','HL','Educ Loan','Malasakit','LWOP','Total Deductions','Net Pay'],
               filteredRecords.map((r, i) => { const emp = employees.find(e => e.id === r.employeeId); return [i+1, `${emp?.lastName}, ${emp?.firstName}`, emp?.id, emp?.designation, r.basicPay, r.deminimis, r.nonTaxable, r.totalIncome, r.sssER, r.phER, r.hdmfER, r.tax, r.sssEE, r.phEE, r.hdmfEE, r.savings || 0, r.salaryLoan || 0, r.stl || 0, r.hl || 0, r.educLoan || 0, r.malasakit || 0, r.lwop || 0, r.totalDeduction, r.netPay]; }),
               `payroll_register_${months[selectedMonth]}_${selectedYear}`
             )}>Export CSV</Button>
           <Button variant="outlined" startIcon={<PdfIcon />}
             onClick={() => exportToPDF(`Payroll Register - ${months[selectedMonth]} ${selectedYear}`,
               ['#','Employee','ID','Designation','Basic Pay','Deminimis','Non-Taxable','Total Income','SSS (ER)','PH (ER)','HDMF (ER)','Tax','SSS (EE)','PH (EE)','HDMF (EE)','Savings','Salary Loan','STL','HL','Educ Loan','Malasakit','LWOP','Total Deductions','Net Pay'],
               filteredRecords.map((r, i) => { const emp = employees.find(e => e.id === r.employeeId); return [i+1, `${emp?.lastName}, ${emp?.firstName}`, emp?.id, emp?.designation, r.basicPay, r.deminimis, r.nonTaxable, r.totalIncome, r.sssER, r.phER, r.hdmfER, r.tax, r.sssEE, r.phEE, r.hdmfEE, r.savings || 0, r.salaryLoan || 0, r.stl || 0, r.hl || 0, r.educLoan || 0, r.malasakit || 0, r.lwop || 0, r.totalDeduction, r.netPay]; })
             )}>Export PDF</Button>
           <Button variant="contained" startIcon={<PrintIcon />} onClick={handlePrint} sx={{ background: 'linear-gradient(135deg, #05077E 0%, #0241FB 60%, #4470ED 100%)' }}>Print Report</Button>
         </Box>
        </Box>
      )}

      {/* Filters */}
      {!isEmbedded && (
        <Card sx={{ 
          borderRadius: 3, 
          mb: 4, 
          boxShadow: '0 8px 32px rgba(5,7,126,0.22)',
          background: 'linear-gradient(160deg, #05077E 0%, #0241FB 55%, #4470ED 80%, #B4B7D3 100%)',
          borderTop: '3px solid #d4a843',
          color: '#ffffff'
        }}>
          <CardContent sx={{ p: 3 }}>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth size="small"
                  placeholder="Search employee..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  InputProps={{
                    startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: 'rgba(255, 255, 255, 0.9)' }} /></InputAdornment>,
                   sx: {
        bgcolor: 'rgba(255,255,255,0.1)',
        color: 'white',
        borderRadius: 2,
      },
    }}
    sx={{
      // ✅ TEXT
      '& .MuiInputBase-input': {
        color: '#fff',
      },

      // ✅ PLACEHOLDER
      '& .MuiInputBase-input::placeholder': {
        color: 'rgba(255,255,255,0.7)',
        opacity: 1,
      },

      // ✅ BORDER (DEFAULT)
      '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
        borderColor: 'rgba(255,255,255,0.9)',
      },

      // ✅ HOVER
      '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
        borderColor: '#fff',
      },

      // ✅ FOCUSED
      '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
        borderColor: '#fff',
      },
    }}
                />
              </Grid>
              <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
                <Typography sx={{ 
                  fontSize: '1.1rem', fontWeight: 800, color: '#fff', 
                  bgcolor: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.3)', 
                  px: 3, py: 1, borderRadius: 2,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }}>
                  {months[selectedMonth]} {selectedYear}
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* Register Table */}
      <TableContainer component={Paper} sx={{ 
        borderTop: `3px solid ${goldAccent}`,borderRadius: 1, boxShadow: '0 10px 30px rgba(0,0,0,0.08)', overflowX: 'auto' }} ref={tableRef}>
        <Table stickyHeader size="small" sx={{ minWidth: 2200 }}>
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
              <TableCell sx={tableHeaderStyle}>Savings</TableCell>
              <TableCell sx={tableHeaderStyle}>Salary Loan</TableCell>
              <TableCell sx={tableHeaderStyle}>STL</TableCell>
              <TableCell sx={tableHeaderStyle}>HL</TableCell>
              <TableCell sx={tableHeaderStyle}>Educ Loan</TableCell>
              <TableCell sx={tableHeaderStyle}>Malasakit</TableCell>
              <TableCell sx={tableHeaderStyle}>LWOP</TableCell>
              <TableCell sx={tableHeaderStyle}>Total Deductions</TableCell>
              <TableCell sx={tableHeaderStyle}>Total Pay</TableCell>
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
                  <TableCell sx={{ ...cellStyle, textAlign: 'right', color: '#d32f2f' }}>{formatCurrency(record.savings || 0)}</TableCell>
                  <TableCell sx={{ ...cellStyle, textAlign: 'right', color: '#d32f2f' }}>{formatCurrency(record.salaryLoan || 0)}</TableCell>
                  <TableCell sx={{ ...cellStyle, textAlign: 'right', color: '#d32f2f' }}>{formatCurrency(record.stl || 0)}</TableCell>
                  <TableCell sx={{ ...cellStyle, textAlign: 'right', color: '#d32f2f' }}>{formatCurrency(record.hl || 0)}</TableCell>
                  <TableCell sx={{ ...cellStyle, textAlign: 'right', color: '#d32f2f' }}>{formatCurrency(record.educLoan || 0)}</TableCell>
                  <TableCell sx={{ ...cellStyle, textAlign: 'right', color: '#d32f2f' }}>{formatCurrency(record.malasakit || 0)}</TableCell>
                  <TableCell sx={{ ...cellStyle, textAlign: 'right', color: '#d32f2f' }}>{formatCurrency(record.lwop || 0)}</TableCell>
                  <TableCell sx={{ ...cellStyle, textAlign: 'right', fontWeight: 700, color: '#d32f2f' }}>{formatCurrency(record.totalDeduction)}</TableCell>
                  <TableCell sx={{ ...cellStyle, textAlign: 'right', fontWeight: 800, color: '#0241FB' }}>{formatCurrency(record.netPay)}</TableCell>
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
      {!isEmbedded && (
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
           <Card sx={{ 
              minWidth: 300, 
              borderRadius: 3,
              boxShadow: '0 8px 32px rgba(2, 65, 251, 0.15)',
              background: 'linear-gradient(135deg, #05077E 0%, #0241FB 60%, #4470ED 100%)',
              color: '#ffffff'
           }}>
              <CardContent>
                 <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 2, letterSpacing: 0.5 }}>Monthly Totals</Typography>
                 <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)' }}>Total Gross Payroll:</Typography>
                    <Typography variant="caption" sx={{ fontWeight: 700 }}>{formatCurrency(filteredRecords.reduce((sum, r) => sum + r.totalIncome, 0))}</Typography>
                 </Box>
                 <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)' }}>Total Statutory (ER):</Typography>
                    <Typography variant="caption" sx={{ fontWeight: 700 }}>{formatCurrency(filteredRecords.reduce((sum, r) => sum + r.sssER + r.phER + r.hdmfER, 0))}</Typography>
                 </Box>
                 <Divider sx={{ my: 1.5, borderColor: 'rgba(255,255,255,0.2)' }} />
                 <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 800 }}>Total Net Release:</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 900, color: '#ffffff', textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>
                      {formatCurrency(filteredRecords.reduce((sum, r) => sum + r.netPay, 0))}
                    </Typography>
                 </Box>
              </CardContent>
           </Card>
        </Box>
      )}
    </Box>
  );
}
