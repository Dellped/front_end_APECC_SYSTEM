import React, { useState, useRef } from 'react';
import {
  Box, Card, CardContent, Typography, Grid, MenuItem, Select,
  FormControl, InputLabel, Button, Divider, IconButton, TableContainer,
  TextField, InputAdornment, Paper
} from '@mui/material';
import { Print as PrintIcon, Search as SearchIcon } from '@mui/icons-material';
import { employees, payrollRecords } from '../../data/mockData';
import apeccLogo from '../../../assets/images/APECC-Logo.jpg';

const goldAccent = '#d4a843';
const formatCurrency = (val) => (val || 0).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export default function Payslips() {
  const [search, setSearch] = useState('');
  const [selectedYear, setSelectedYear] = useState(2026);
  const [selectedMonth, setSelectedMonth] = useState(0);
  const printRef = useRef();

  const filteredEmployees = employees.filter((emp) => {
    return `${emp.firstName} ${emp.lastName} ${emp.id}`
      .toLowerCase()
      .includes(search.toLowerCase());
  });

  const emp = filteredEmployees.length > 0 ? filteredEmployees[0] : null;

  const record = emp ? payrollRecords.find(
    (r) => r.employeeId === emp.id && r.year === selectedYear && r.monthIndex === selectedMonth
  ) : null;

  const handlePrint = () => {
    const content = printRef.current;
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Payslip - ${emp?.lastName}, ${emp?.firstName}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Courier+Prime:wght@400;700&display=swap');
            * { margin: 0; padding: 0; box-sizing: border-box; font-family: 'Courier Prime', monospace; }
            body { padding: 20px; color: #000; background: #fff; }
            .payslip-container { width: 100%; max-width: 800px; margin: 0 auto; border: 1px solid #ddd; padding: 20px; }
            .header-info { text-align: center; margin-bottom: 20px; }
            .company-name { font-weight: 700; font-size: 14pt; }
            .address { font-size: 10pt; }
            
            .employee-box { margin-bottom: 20px; border: 1px solid #000; width: 100%; border-collapse: collapse; }
            .employee-box td { border: 1px solid #000; padding: 4px 8px; font-size: 10pt; }
            .label-cell { font-weight: 700; width: 100px; }
            
            .payslip-title { background: #fee2b3; border: 1px solid #000; text-align: center; font-weight: 700; padding: 4px; margin-bottom: 15px; text-transform: uppercase; font-size: 11pt; }
            
            .grid { display: flex; width: 100%; border: 1px solid #000; }
            .col { flex: 1; border-right: 1px solid #000; }
            .col:last-child { border-right: none; }
            
            .section-header { border-bottom: 1px solid #000; text-align: center; font-weight: 700; padding: 4px; font-size: 10pt; background: #f5f5f5; }
            
            .data-table { width: 100%; border-collapse: collapse; }
            .data-table td { padding: 4px 8px; font-size: 9pt; }
            .amount { text-align: right; }
            .total-row { border-top: 2px solid #000; font-weight: 700; background: #fff9c4; }
            
            .take-home-box { flex: 1.2; padding: 0; }
            .take-home-header { background: #fee2b3; font-weight: 700; padding: 4px 8px; border-bottom: 1px solid #000; display: flex; justify-content: space-between; font-size: 10pt; }
            .half-row { border-bottom: 1px solid #000; display: flex; justify-content: space-between; padding: 4px 8px; font-size: 9pt; }
            
            .footer-sign { margin-top: 40px; display: flex; justify-content: space-between; padding: 0 40px; }
            .sign-box { text-align: center; font-size: 9pt; }
            .sign-line { border-top: 1px solid #000; margin-top: 30px; padding-top: 4px; font-weight: 700; min-width: 200px; }
            .role { font-size: 8pt; font-weight: 400; font-style: italic; }
            
            @media print {
              body { padding: 0; }
              .payslip-container { border: none; }
            }
          </style>
        </head>
        <body>
          <div class="payslip-container">
            <div class="header-info">
              <p class="company-name">ASA PHILIPPINES EMPLOYEES CREDIT COOPERATIVE (APECC)</p>
              <p class="address">18-E San Martin St. Cor. San Francisco Kapitolyo, Pasig City</p>
            </div>
            
            <table class="employee-box">
              <tr>
                <td class="label-cell">Name:</td>
                <td>${emp?.lastName}, ${emp?.firstName} ${emp?.middleName || ''}</td>
              </tr>
              <tr>
                <td class="label-cell">Position:</td>
                <td>${emp?.designation || ''} - ${emp?.department || ''}</td>
              </tr>
              <tr>
                <td class="label-cell">ID No.</td>
                <td>${emp?.id || ''}</td>
              </tr>
            </table>
            
            <div class="payslip-title">${record?.month} ${record?.year} PAYSLIP</div>
            
            <div class="grid">
              <div class="col">
                <div class="section-header">EARNINGS</div>
                <table class="data-table">
                  <tr><td>Basic pay</td><td class="amount">${formatCurrency(record?.basicPay)}</td></tr>
                  <tr><td>Deminimiss</td><td class="amount">${formatCurrency(record?.deminimis)}</td></tr>
                  <tr><td>Repair & Maintenance</td><td class="amount">${formatCurrency(record?.repairMaintenance)}</td></tr>
                  <tr style="height: 100px"><td></td><td></td></tr>
                  <tr class="total-row"><td>Total Income</td><td class="amount">${formatCurrency(record?.totalIncome)}</td></tr>
                </table>
              </div>
              
              <div class="col">
                <div class="section-header">DEDUCTIONS</div>
                <table class="data-table">
                  <tr><td>Savings</td><td class="amount">${formatCurrency(record?.savings)}</td></tr>
                  <tr><td>SSS</td><td class="amount">${formatCurrency(record?.sss)}</td></tr>
                  <tr><td>PH</td><td class="amount">${formatCurrency(record?.philHealth)}</td></tr>
                  <tr><td>HDMF</td><td class="amount">${formatCurrency(record?.pagIbig)}</td></tr>
                  <tr><td>Salary loan</td><td class="amount">${formatCurrency(record?.salaryLoan)}</td></tr>
                  <tr><td>STL</td><td class="amount">${formatCurrency(record?.stl)}</td></tr>
                  <tr><td>HL</td><td class="amount">${formatCurrency(record?.hl)}</td></tr>
                  <tr><td>Educ Loan</td><td class="amount">${formatCurrency(record?.educLoan)}</td></tr>
                  <tr><td>Tax</td><td class="amount">${formatCurrency(record?.tax)}</td></tr>
                  <tr><td>Malasakit</td><td class="amount">${formatCurrency(record?.malasakit)}</td></tr>
                  <tr><td>Other deduction</td><td class="amount">${formatCurrency(record?.otherDeductions)}</td></tr>
                  <tr class="total-row"><td>Total Deduction</td><td class="amount">${formatCurrency(record?.totalDeduction)}</td></tr>
                </table>
              </div>
              
              <div class="take-home-box">
                <div class="take-home-header">
                  <span>Total Take Home Pay</span>
                  <span>${formatCurrency(record?.netPay)}</span>
                </div>
                <div class="half-row">
                  <span>1ST HALF</span>
                  <span>${formatCurrency(record?.firstHalf)}</span>
                </div>
                <div class="half-row">
                  <span>2ND HALF</span>
                  <span>${formatCurrency(record?.secondHalf)}</span>
                </div>
              </div>
            </div>
            
            <div class="footer-sign">
              <div class="sign-box">
                <p>Prepared by:</p>
                <p class="sign-line">Kyzeel M. Estrella</p>
                <p class="role">HR Officer</p>
              </div>
              <div class="sign-box">
                <p>Approved by:</p>
                <p class="sign-line">MA. LYN JEE TUPAS</p>
                <p class="role">FINANCE - UNIT HEAD/ASST. GENERAL MANAGER</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
        printWindow.print();
        printWindow.close();
    }, 250);
  };

  const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];

  return (
    <Box className="page-container">
      {/* Filters Overlay */}
      <Paper elevation={0} sx={{ p: 4, mb: 4, borderRadius: 3, bgcolor: '#ffffff', border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
        <Typography variant="h5" sx={{ fontWeight: 800, color: '#023DFB', mb: 3 }}>Payslip Repository</Typography>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} sm={4}>
            <TextField
                size="small" fullWidth
                placeholder="Search candidates..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                InputProps={{
                  startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: '#023DFB' }} /></InputAdornment>,
                }}
              />
          </Grid>
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Year</InputLabel>
              <Select value={selectedYear} label="Year" onChange={(e) => setSelectedYear(e.target.value)}>
                {[2026, 2025, 2024].map((y) => <MenuItem key={y} value={y}>{y}</MenuItem>)}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Month</InputLabel>
              <Select value={selectedMonth} label="Month" onChange={(e) => setSelectedMonth(e.target.value)}>
                {months.map((m, i) => <MenuItem key={i} value={i}>{m}</MenuItem>)}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={2}>
            <Button
              fullWidth variant="contained"
              startIcon={<PrintIcon />}
              onClick={handlePrint}
              disabled={!record}
              sx={{ bgcolor: '#023DFB', height: 40, borderRadius: 2, fontWeight: 700 }}
            >
              Print
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Payslip Preview */}
      <Paper elevation={12} sx={{ 
        maxWidth: 850, mx: 'auto', p: 5, borderRadius: 0,
        bgcolor: '#fff', color: '#000', 
        fontFamily: "'Courier Prime', monospace",
        border: '1px solid #ddd'
      }} ref={printRef}>
        
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Box component="img" src={apeccLogo} sx={{ width: 80, height: 80, mb: 1, borderRadius: '50%' }} />
          <Typography sx={{ fontWeight: 700, fontSize: '1.2rem' }}>ASA PHILIPPINES EMPLOYEES CREDIT COOPERATIVE (APECC)</Typography>
          <Typography sx={{ fontSize: '0.9rem' }}>18-E San Martin St. Cor. San Francisco Kapitolyo, Pasig City</Typography>
        </Box>

        {/* Employee Info Box */}
        <Box sx={{ border: '1px solid #000', mb: 3 }}>
          <Grid container sx={{ borderBottom: '1px solid #000' }}>
            <Grid item xs={3} sx={{ p: 1, borderRight: '1px solid #000', fontWeight: 700 }}>Name:</Grid>
            <Grid item xs={9} sx={{ p: 1 }}>{emp?.lastName}, {emp?.firstName} {emp?.middleName || ''}</Grid>
          </Grid>
          <Grid container sx={{ borderBottom: '1px solid #000' }}>
            <Grid item xs={3} sx={{ p: 1, borderRight: '1px solid #000', fontWeight: 700 }}>Position:</Grid>
            <Grid item xs={9} sx={{ p: 1 }}>{emp?.designation || 'N/A'}</Grid>
          </Grid>
          <Grid container>
            <Grid item xs={3} sx={{ p: 1, borderRight: '1px solid #000', fontWeight: 700 }}>ID No.</Grid>
            <Grid item xs={9} sx={{ p: 1 }}>{emp?.id || 'N/A'}</Grid>
          </Grid>
        </Box>

        {/* Month Bar */}
        <Box sx={{ 
          bgcolor: '#fee2b3', 
          border: '1px solid #000', 
          textAlign: 'center', 
          py: 1, mb: 3, 
          fontWeight: 800,
          textTransform: 'uppercase',
          fontSize: '1.1rem'
        }}>
          {record?.month} {record?.year} PAYSLIP
        </Box>

        {/* Grid Content */}
        <Grid container sx={{ border: '1px solid #000' }}>
          {/* Earnings */}
          <Grid item xs={4} sx={{ borderRight: '1px solid #000' }}>
            <Box sx={{ bgcolor: '#f5f5f5', borderBottom: '1px solid #000', p: 0.5, textAlign: 'center', fontWeight: 700 }}>EARNINGS</Box>
            <Box sx={{ p: 1, minHeight: 180 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="caption">Basic pay</Typography>
                <Typography variant="caption" sx={{ fontWeight: 600 }}>{formatCurrency(record?.basicPay)}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="caption">Deminimiss</Typography>
                <Typography variant="caption" sx={{ fontWeight: 600 }}>{formatCurrency(record?.deminimis)}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="caption">Repair & Maintena</Typography>
                <Typography variant="caption" sx={{ fontWeight: 600 }}>{formatCurrency(record?.repairMaintenance)}</Typography>
              </Box>
            </Box>
            <Box sx={{ borderTop: '2px solid #000', p: 1, display: 'flex', justifyContent: 'space-between', bgcolor: '#fff9c4' }}>
              <Typography sx={{ fontWeight: 800, fontSize: '0.85rem' }}>Total Income</Typography>
              <Typography sx={{ fontWeight: 800, fontSize: '0.85rem' }}>{formatCurrency(record?.totalIncome)}</Typography>
            </Box>
          </Grid>

          {/* Deductions */}
          <Grid item xs={3.5} sx={{ borderRight: '1px solid #000' }}>
            <Box sx={{ bgcolor: '#f5f5f5', borderBottom: '1px solid #000', p: 0.5, textAlign: 'center', fontWeight: 700 }}>DEDUCTIONS</Box>
            <Box sx={{ p: 1 }}>
              {[
                ['Savings', record?.savings],
                ['SSS', record?.sss],
                ['PH', record?.philHealth],
                ['HDMF', record?.pagIbig],
                ['Salary loan', record?.salaryLoan],
                ['STL', record?.stl],
                ['HL', record?.hl],
                ['Educ Loan', record?.educLoan],
                ['Tax', record?.tax],
                ['Malasakit', record?.malasakit],
                ['Other deduction', record?.otherDeductions],
              ].map(([l, v]) => (
                <Box key={l} sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.4 }}>
                  <Typography variant="caption" sx={{ fontSize: '0.65rem' }}>{l}</Typography>
                  <Typography variant="caption" sx={{ fontWeight: 500, fontSize: '0.65rem' }}>{formatCurrency(v)}</Typography>
                </Box>
              ))}
            </Box>
            <Box sx={{ borderTop: '2px solid #000', p: 1, display: 'flex', justifyContent: 'space-between', bgcolor: '#fff9c4' }}>
              <Typography sx={{ fontWeight: 800, fontSize: '0.8rem' }}>Total Deduction</Typography>
              <Typography sx={{ fontWeight: 800, fontSize: '0.8rem' }}>{formatCurrency(record?.totalDeduction)}</Typography>
            </Box>
          </Grid>

          {/* Take Home Summary */}
          <Grid item xs={4.5}>
            <Box sx={{ bgcolor: '#fee2b3', borderBottom: '1px solid #000', p: 1, display: 'flex', justifyContent: 'space-between' }}>
              <Typography sx={{ fontWeight: 800, fontSize: '0.9rem' }}>Total Take Home Pay</Typography>
              <Typography sx={{ fontWeight: 800, fontSize: '0.9rem' }}>{formatCurrency(record?.netPay)}</Typography>
            </Box>
            <Box sx={{ borderBottom: '1px solid #000', p: 1, display: 'flex', justifyContent: 'space-between' }}>
              <Typography sx={{ fontWeight: 700, fontSize: '0.8rem' }}>1ST HALF</Typography>
              <Typography sx={{ fontWeight: 700, fontSize: '0.8rem' }}>{formatCurrency(record?.firstHalf)}</Typography>
            </Box>
            <Box sx={{ borderBottom: '1px solid #000', p: 1, display: 'flex', justifyContent: 'space-between' }}>
              <Typography sx={{ fontWeight: 700, fontSize: '0.8rem' }}>2ND HALF</Typography>
              <Typography sx={{ fontWeight: 700, fontSize: '0.8rem' }}>{formatCurrency(record?.secondHalf)}</Typography>
            </Box>
          </Grid>
        </Grid>

        {/* Signatories */}
        <Grid container sx={{ mt: 8 }}>
          <Grid item xs={6}>
            <Typography variant="body2">Prepared by:</Typography>
            <Box sx={{ width: '80%', borderBottom: '1px solid #000', mt: 4, textAlign: 'center' }}>
              <Typography sx={{ fontWeight: 700 }}>Kyzeel M. Estrella</Typography>
            </Box>
            <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', width: '80%' }}>HR Officer</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2" sx={{ textAlign: 'right', pr: 5 }}>Approved by:</Typography>
            <Box sx={{ width: '90%', borderBottom: '1px solid #000', mt: 4, textAlign: 'center', ml: 'auto' }}>
              <Typography sx={{ fontWeight: 700 }}>MA. LYN JEE TUPAS</Typography>
            </Box>
            <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', width: '90%', ml: 'auto' }}>
              FINANCE - UNIT HEAD/ASST. GENERAL MANAGER
            </Typography>
          </Grid>
        </Grid>

      </Paper>
    </Box>
  );
}

