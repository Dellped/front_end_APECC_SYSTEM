import React, { useState, useRef } from 'react';
import {
  Box, Card, CardContent, Typography, Grid, MenuItem, Select,
  FormControl, InputLabel, Button, TableContainer,
  TextField, InputAdornment, Paper, Divider, Stack, Chip
} from '@mui/material';
import {
  Print as PrintIcon,
  Search as SearchIcon,
  FileDownload as CsvIcon,
  PictureAsPdf as PdfIcon
} from '@mui/icons-material';
import { employees, payrollRecords } from '../../data/mockData';
import apeccLogo from '../../../assets/images/APECC-Logo.jpg';
import { exportToCSV } from '../../utils/exportUtils';

// ── Palette ──────────────────────────────────────────────────────────────────
const NAV = '#05077E';
const IND = '#0241FB';
const ROY = '#4470ED';
const PER = '#B4B7D3';
const WHT = '#FDFDFC';
const goldAccent = '#d4a843';
// ─────────────────────────────────────────────────────────────────────────────

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

  const handlePrint = (isPdf = false) => {
    if (!record || !emp) return;
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Payslip - ${emp.lastName}, ${emp.firstName}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Courier+Prime:wght@400;700&display=swap');
            * { margin: 0; padding: 0; box-sizing: border-box; font-family: 'Courier Prime', monospace; }
            body { padding: 20px; color: #000; background: #fff; }
            .payslip-container { width: 100%; max-width: 1000px; margin: 0 auto; border: 1px solid #ddd; padding: 30px; position: relative; overflow: hidden; z-index: 1; }
            .header-info { text-align: center; margin-bottom: 20px; }
            .company-name { font-weight: 700; font-size: 16pt; }
            .address { font-size: 11pt; }
            
            .employee-box { margin-bottom: 20px; border: 1px solid #000; width: 100%; border-collapse: collapse; }
            .employee-box td { border: 1px solid #000; padding: 6px 12px; font-size: 11pt; }
            .label-cell { font-weight: 700; width: 120px; }
            
            .payslip-title { background: #fee2b3; border: 1px solid #000; text-align: center; font-weight: 700; padding: 8px; margin-bottom: 20px; text-transform: uppercase; font-size: 13pt; }
            
            .grid { display: flex; width: 100%; border: 1px solid #000; }
            .col { flex: 1; border-right: 1px solid #000; display: flex; flex-direction: column; }
            .col:last-child { border-right: none; }
            
            .section-header { border-bottom: 1px solid #000; text-align: center; font-weight: 700; padding: 6px; font-size: 11pt; background: #f5f5f5; }
            
            .data-table { width: 100%; border-collapse: collapse; }
            .data-table td { padding: 6px 10px; font-size: 11pt; vertical-align: top; }
            .amount { text-align: right; }
            .spacer-row td { height: 100px; }
            .total-row { border-top: 2px solid #000; font-weight: 700; background: #fff9c4; font-size: 12pt; height: auto; }
            
            .take-home-box { flex: 1.2; padding: 0; display: flex; flex-direction: column; justify-content: flex-start; }
            .take-home-header { background: #fee2b3; font-weight: 700; padding: 8px 12px; border-bottom: 1px solid #000; display: flex; justify-content: space-between; font-size: 12pt; }
            .half-row { border-bottom: 1px solid #000; display: flex; justify-content: space-between; padding: 8px 12px; font-size: 11pt; }
            
            .footer-sign { margin-top: 50px; padding-top: 20px; display: flex; justify-content: space-between; padding: 0 40px; }
            .sign-box { text-align: center; font-size: 11pt; }
            .sign-line { border-top: 1px solid #000; margin-top: 50px; padding-top: 6px; font-weight: 700; min-width: 250px; }
            .role { font-size: 9pt; font-weight: 400; font-style: italic; }
            
            .watermark { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(-30deg); font-size: 44pt; font-weight: 900; color: rgba(0,0,0,0.06); text-align: center; white-space: nowrap; z-index: -1; pointer-events: none; line-height: 1.2; }

            @media print {
              @page { size: legal portrait; margin: 0.5in; }
              body { padding: 0; }
              .payslip-container { border: none; padding: 0; max-width: none; }
            }
          </style>
        </head>
        <body>
          <div class="payslip-container">
            <div class="watermark">THIS IS A SYSTEM GENERATED PAYSLIP<br/>NO SIGNATURE REQUIRED</div>
            <div class="header-info">
              <p class="company-name">ASA PHILIPPINES EMPLOYEES CREDIT COOPERATIVE (APECC)</p>
              <p class="address">3RD FL. UNIT 309 PRESTIGE TOWER F. ORTIGAS JR. RD. ORTIGAS CENTER, PASIG CITY</p>
            </div>
            
            <table class="employee-box">
              <tr>
                <td class="label-cell">Name:</td>
                <td>${emp.lastName}, ${emp.firstName} ${emp.middleName || ''}</td>
              </tr>
              <tr>
                <td class="label-cell">Position:</td>
                <td>${emp.designation || ''} - ${emp.department || ''}</td>
              </tr>
              <tr>
                <td class="label-cell">ID No.</td>
                <td>${emp.id || ''}</td>
              </tr>
            </table>
            
            <div class="payslip-title">${record.month} ${record.year} PAYSLIP</div>
            
            <div class="grid">
              <div class="col">
                <div class="section-header">PAID</div>
                <table class="data-table">
                  <tr><td>Basic pay</td><td class="amount">${formatCurrency(record.basicPay)}</td></tr>
                  <tr><td>Deminimis</td><td class="amount">${formatCurrency(record.deminimis)}</td></tr>
                  <tr><td>Repair & Maintenance</td><td class="amount">${formatCurrency(record.repairMaintenance)}</td></tr>
                  <tr class="spacer-row"><td></td><td></td></tr>
                  <tr class="total-row"><td>Total Paid</td><td class="amount">${formatCurrency(record.totalIncome)}</td></tr>
                </table>
              </div>
              
              <div class="col">
                <div class="section-header">DEDUCTIONS</div>
                <table class="data-table">
                  <tr><td colspan="2" style="font-weight: 700; background: #ddd; text-align: center; font-size: 8pt; border-bottom: 1px solid #000; border-top: 1px solid #000;">GOVERNMENT DEDUCTIONS</td></tr>
                  <tr><td>SSS</td><td class="amount">${formatCurrency(record.sss)}</td></tr>
                  <tr><td>PH</td><td class="amount">${formatCurrency(record.philHealth)}</td></tr>
                  <tr><td>HDMF</td><td class="amount">${formatCurrency(record.pagIbig)}</td></tr>
                  <tr><td>Tax</td><td class="amount">${formatCurrency(record.tax)}</td></tr>
                  <tr><td colspan="2" style="font-weight: 700; background: #ddd; text-align: center; font-size: 8pt; border-bottom: 1px solid #000; border-top: 1px solid #000;">APECC DEDUCTIONS</td></tr>
                  <tr><td>Savings</td><td class="amount">${formatCurrency(record.savings)}</td></tr>
                  <tr><td>Salary loan</td><td class="amount">${formatCurrency(record.salaryLoan)}</td></tr>
                  <tr><td>STL</td><td class="amount">${formatCurrency(record.stl)}</td></tr>
                  <tr><td>HL</td><td class="amount">${formatCurrency(record.hl)}</td></tr>
                  <tr><td>Educ Loan</td><td class="amount">${formatCurrency(record.educLoan)}</td></tr>
                  <tr><td>Malasakit</td><td class="amount">${formatCurrency(record.malasakit)}</td></tr>
                  <tr><td>LWOP</td><td class="amount">${formatCurrency(record.lwop || 0)}</td></tr>
                  <tr><td>Other deduction</td><td class="amount">${formatCurrency(record.otherDeductions)}</td></tr>
                  <tr class="spacer-row"><td></td><td></td></tr>
                  <tr class="total-row"><td>Total Deduction</td><td class="amount">${formatCurrency(record.totalDeduction)}</td></tr>
                </table>
              </div>
              
              <div class="take-home-box">
                <div class="take-home-header">
                  <span>Total Take Home Pay</span>
                  <span>${formatCurrency(record.netPay)}</span>
                </div>
                <div class="half-row">
                  <span>1ST HALF</span>
                  <span>${formatCurrency(record.firstHalf)}</span>
                </div>
                <div class="half-row">
                  <span>2ND HALF</span>
                  <span>${formatCurrency(record.secondHalf)}</span>
                </div>
              </div>
            </div>
            
            <div class="footer-sign">
              <div class="sign-box">
                <p>Prepared by:</p>
                <p class="sign-line">Kyzeel M. Estrella</p>
                <p class="role">HR Officer</p>
              </div>
            </div>
          </div>
          ${isPdf ? `
            <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>
            <script>
              window.onload = function() {
                var element = document.querySelector('.payslip-container');
                var opt = {
                  margin:       0.5,
                  filename:     'Payslip_${emp.lastName}_${record.month}${record.year}.pdf',
                  image:        { type: 'jpeg', quality: 0.98 },
                  html2canvas:  { scale: 2 },
                  jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
                };
                html2pdf().set(opt).from(element).save().then(() => {
                   setTimeout(() => window.close(), 1000);
                });
              };
            </script>
          ` : ''}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    if (!isPdf) {
       setTimeout(() => {
           printWindow.print();
           printWindow.close();
       }, 250);
    }
  };

  const handleExportCSV = () => {
    if (!record || !emp) return;
    const headers = ['Employee ID', 'Name', 'Month', 'Year', 'Basic Pay', 'Deminimis', 'Repair & Maint', 'Total Paid', 'Savings', 'SSS', 'PH', 'HDMF', 'Salary Loan', 'STL', 'HL', 'Educ Loan', 'Tax', 'Malasakit', 'Other Ded', 'Total Deduction', 'Net Pay', 'First Half', 'Second Half'];
    const row = [
      emp.id, `${emp.lastName}, ${emp.firstName}`, record.month, record.year, record.basicPay, record.deminimis, record.repairMaintenance, record.totalIncome, record.savings, record.sss, record.philHealth, record.pagIbig, record.salaryLoan, record.stl, record.hl, record.educLoan, record.tax, record.malasakit, record.otherDeductions, record.totalDeduction, record.netPay, record.firstHalf, record.secondHalf
    ];
    exportToCSV(headers, [row], `Payslip_${emp.id}_${record.month}${record.year}`);
  };

  const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];

  return (
    <Box className="page-container">

      {/* ── Page Header & Quick Stats ─────────────────────────────────────── */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{
            fontWeight: 800,
            background: `linear-gradient(135deg, ${NAV} 0%, ${IND} 55%, ${ROY} 100%)`,
            backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>
            Payslip Repository
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
            View, print, and download employee payslips
          </Typography>
        </Box>
      </Box>

      {/* ── Filters Card ─────────────────────────────────────────────────── */}
      <Card sx={{
        borderRadius: 3, mb: 4,
        background: `linear-gradient(160deg, ${NAV} 0%, ${IND} 55%, ${ROY} 80%, ${PER} 100%)`,
        borderTop: `3px solid ${goldAccent}`,
        boxShadow: '0 8px 32px rgba(5,7,126,0.22)',
      }}>
        <CardContent sx={{ p: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth size="small"
                placeholder="Search Employee Name or ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                InputProps={{
                  startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: WHT, opacity: 0.8 }} /></InputAdornment>,
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    bgcolor: 'rgba(253,253,252,0.1)', color: WHT, borderRadius: 2,
                    '& fieldset': { borderColor: 'rgba(253,253,252,0.3)' },
                    '&:hover fieldset': { borderColor: WHT },
                    '&.Mui-focused fieldset': { borderColor: goldAccent, borderWidth: '2px' },
                  },
                  '& .MuiInputBase-input::placeholder': { color: 'rgba(253,253,252,0.6)', opacity: 1 },
                }}
              />
            </Grid>
            <Grid item xs={6} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel sx={{ color: 'rgba(253,253,252,0.8)', '&.Mui-focused': { color: goldAccent } }}>Year</InputLabel>
                <Select
                  value={selectedYear} label="Year" onChange={(e) => setSelectedYear(e.target.value)}
                  sx={{
                    bgcolor: 'rgba(253,253,252,0.1)', color: WHT, borderRadius: 2,
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(253,253,252,0.3)' },
                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: WHT },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: goldAccent, borderWidth: '2px' },
                    '& .MuiSvgIcon-root': { color: WHT },
                  }}
                >
                  {[2026, 2025, 2024].map((y) => <MenuItem key={y} value={y}>{y}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel sx={{ color: 'rgba(253,253,252,0.8)', '&.Mui-focused': { color: goldAccent } }}>Month</InputLabel>
                <Select
                  value={selectedMonth} label="Month" onChange={(e) => setSelectedMonth(e.target.value)}
                  sx={{
                    bgcolor: 'rgba(253,253,252,0.1)', color: WHT, borderRadius: 2,
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(253,253,252,0.3)' },
                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: WHT },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: goldAccent, borderWidth: '2px' },
                    '& .MuiSvgIcon-root': { color: WHT },
                  }}
                >
                  {months.map((m, i) => <MenuItem key={i} value={i}>{m}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={3} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Stack direction="row" spacing={1}>
                <Button size="small" variant="contained"
                  startIcon={<PdfIcon />} onClick={() => handlePrint(true)} disabled={!record}
                  sx={{
                    background: 'linear-gradient(135deg, #d32f2f 0%, #ef5350 100%)', color: WHT, borderRadius: 2, fontWeight: 800,
                    boxShadow: '0 4px 12px rgba(211,47,47,0.3)',
                    '&:hover': { filter: 'brightness(1.15)', boxShadow: '0 6px 16px rgba(211,47,47,0.4)' },
                    '&.Mui-disabled': { background: 'rgba(253,253,252,0.2)', color: 'rgba(253,253,252,0.5)', boxShadow: 'none' }
                  }}>
                  PDF
                </Button>
                <Button size="small" variant="contained"
                  startIcon={<CsvIcon />} onClick={handleExportCSV} disabled={!record}
                  sx={{
                    background: 'linear-gradient(135deg, #2e7d32 0%, #66bb6a 100%)', color: WHT, borderRadius: 2, fontWeight: 800,
                    boxShadow: '0 4px 12px rgba(46,125,50,0.3)',
                    '&:hover': { filter: 'brightness(1.15)', boxShadow: '0 6px 16px rgba(46,125,50,0.4)' },
                    '&.Mui-disabled': { background: 'rgba(253,253,252,0.2)', color: 'rgba(253,253,252,0.5)', boxShadow: 'none' }
                  }}>
                  CSV
                </Button>
                <Button size="small" variant="contained"
                  startIcon={<PrintIcon />} onClick={() => handlePrint(false)} disabled={!record}
                  sx={{
                    background: 'linear-gradient(135deg, #8d6e63 0%, #a1887f 100%)', color: WHT, borderRadius: 2, fontWeight: 800,
                    boxShadow: '0 4px 12px rgba(141,110,99,0.3)',
                    '&:hover': { filter: 'brightness(1.15)', boxShadow: '0 6px 16px rgba(141,110,99,0.4)' },
                    '&.Mui-disabled': { background: 'rgba(253,253,252,0.2)', color: 'rgba(253,253,252,0.5)', boxShadow: 'none' }
                  }}>
                  Print
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* ── Payslip Preview Container ────────────────────────────────────── */}
      <Card sx={{ borderRadius: 3, borderTop: `3px solid ${goldAccent}`, boxShadow: '0 4px 24px rgba(5,7,126,0.08)' }}>
        <CardContent sx={{ p: 0, bgcolor: '#f4f7fe' }}>
          
          {record && emp ? (
            <Box sx={{ p: { xs: 2, sm: 4, md: 5 } }}>
              <Paper elevation={12} sx={{ 
                width: '100%', maxWidth: 850, mx: 'auto', p: { xs: 3, md: 6 }, borderRadius: 2,
                bgcolor: '#ffffff', color: '#000', 
                fontFamily: "'Courier Prime', monospace",
                position: 'relative', overflo : 'hidden', zIndex: 1
              }} ref={printRef}>
              
                <Box sx={{
                  position: 'absolute', top: '50%', left: '50%',
                  transform: 'translate(-50%, -50%) rotate(-30deg)',
                  fontSize: { xs: '1.5rem', md: '2.5rem' },
                  fontWeight: 900, color: 'rgba(0,0,0,0.06)',
                  textAlign: 'center', whiteSpace: 'nowrap',
                  zIndex: -1, pointerEvents: 'none', lineHeight: 1.2
                }}>
                  THIS IS A SYSTEM GENERATED PAYSLIP<br/>NO SIGNATURE REQUIRED
                </Box>
                
                {/* Header */}
                <Box sx={{ textAlign: 'center', mb: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Box component="img" src={apeccLogo} sx={{ width: 80, height: 80, mb: 2, borderRadius: '50%', border: '2px solid #ddd' }} />
                  <Typography sx={{ fontWeight: 800, fontSize: '1.25rem', fontFamily: "'Courier Prime', monospace" }}>
                    ASA PHILIPPINES EMPLOYEES CREDIT COOPERATIVE (APECC)
                  </Typography>
                  <Typography sx={{ fontSize: '0.9rem', color: '#555', fontFamily: "'Courier Prime', monospace" }}>
                    3RD FL. UNIT 309 PRESTIGE TOWER F. ORTIGAS JR. RD. ORTIGAS CENTER, PASIG CITY
                  </Typography>
                </Box>

                {/* Employee Info Box */}
                <Box sx={{ border: '2px solid #333', mb: 4 }}>
                  <Grid container sx={{ borderBottom: '1px solid #333' }}>
                    <Grid item xs={3} sx={{ p: 1.5, borderRight: '1px solid #333', fontWeight: 800, bgcolor: '#fafafa', fontFamily: "'Courier Prime', monospace" }}>Name:</Grid>
                    <Grid item xs={9} sx={{ p: 1.5, fontWeight: 700, fontFamily: "'Courier Prime', monospace" }}>
                      {emp.lastName}, {emp.firstName} {emp.middleName || ''}
                    </Grid>
                  </Grid>
                  <Grid container sx={{ borderBottom: '1px solid #333' }}>
                    <Grid item xs={3} sx={{ p: 1.5, borderRight: '1px solid #333', fontWeight: 800, bgcolor: '#fafafa', fontFamily: "'Courier Prime', monospace" }}>Position:</Grid>
                    <Grid item xs={9} sx={{ p: 1.5, fontFamily: "'Courier Prime', monospace" }}>
                      {emp.designation || 'N/A'} - {emp.department || 'N/A'}
                    </Grid>
                  </Grid>
                  <Grid container>
                    <Grid item xs={3} sx={{ p: 1.5, borderRight: '1px solid #333', fontWeight: 800, bgcolor: '#fafafa', fontFamily: "'Courier Prime', monospace" }}>ID No.</Grid>
                    <Grid item xs={9} sx={{ p: 1.5, fontFamily: "'Courier Prime', monospace" }}>{emp.id}</Grid>
                  </Grid>
                </Box>

                {/* Month Bar */}
                <Box sx={{ 
                  bgcolor: '#fee2b3', 
                  border: '2px solid #333', 
                  textAlign: 'center', 
                  py: 1.5, mb: 4, 
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  fontSize: '1.2rem',
                  fontFamily: "'Courier Prime', monospace"
                }}>
                  {record.month} {record.year} PAYSLIP
                </Box>

                {/* Grid Content */}
                <Grid container sx={{ border: '2px solid #333' }}>
                  {/* Earnings */}
                  <Grid item xs={4} sx={{ borderRight: '1px solid #333' }}>
                    <Box sx={{ bgcolor: '#eee', borderBottom: '2px solid #333', p: 1, textAlign: 'center', fontWeight: 800, fontFamily: "'Courier Prime', monospace" }}>PAID</Box>
                    <Box sx={{ p: 2, minHeight: 220 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                        <Typography variant="body2" sx={{ fontFamily: "'Courier Prime', monospace" }}>Basic pay</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 700, fontFamily: "'Courier Prime', monospace" }}>{formatCurrency(record.basicPay)}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                        <Typography variant="body2" sx={{ fontFamily: "'Courier Prime', monospace" }}>Deminimis</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 700, fontFamily: "'Courier Prime', monospace" }}>{formatCurrency(record.deminimis)}</Typography>
                      </Box>
                    </Box>
                    <Box sx={{ borderTop: '2px solid #333', p: 1.5, display: 'flex', justifyContent: 'space-between', gap: 2, bgcolor: '#fff9c4' }}>
                      <Typography sx={{ fontWeight: 800, fontFamily: "'Courier Prime', monospace" }}>Total Paid</Typography>
                      <Typography sx={{ fontWeight: 800, fontFamily: "'Courier Prime', monospace" }}>{formatCurrency(record.totalIncome)}</Typography>
                    </Box>
                  </Grid>

                  {/* Deductions */}
                  <Grid item xs={4} sx={{ borderRight: '1px solid #333' }}>
                    <Box sx={{ bgcolor: '#eee', borderBottom: '2px solid #333', p: 1, textAlign: 'center', fontWeight: 800, fontFamily: "'Courier Prime', monospace" }}>DEDUCTIONS</Box>
                    <Box sx={{ pb: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
                       <Box sx={{ bgcolor: '#ddd', borderBottom: '1px solid #333', py: 0.3, px: 2, mb: 1, textAlign: 'center' }}>
                         <Typography sx={{ fontSize: '0.65rem', fontWeight: 800, fontFamily: "'Courier Prime', monospace" }}>GOVERNMENT DEDUCTIONS</Typography>
                       </Box>
                       <Box sx={{ px: 2 }}>
                         {[
                           ['SSS', record.sss],
                           ['PH', record.philHealth],
                           ['HDMF', record.pagIbig],
                           ['Tax', record.tax],
                         ].map(([l, v]) => (
                           <Box key={l} sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                             <Typography variant="caption" sx={{ fontFamily: "'Courier Prime', monospace", fontSize: '0.7rem' }}>{l}</Typography>
                             <Typography variant="caption" sx={{ fontWeight: 700, fontFamily: "'Courier Prime', monospace", fontSize: '0.7rem' }}>{formatCurrency(v)}</Typography>
                           </Box>
                         ))}
                       </Box>
                       <Box sx={{ bgcolor: '#ddd', borderBottom: '1px solid #333', borderTop: '1px solid #333', py: 0.3, px: 2, mb: 1, mt: 1, textAlign: 'center' }}>
                         <Typography sx={{ fontSize: '0.65rem', fontWeight: 800, fontFamily: "'Courier Prime', monospace" }}>APECC DEDUCTIONS</Typography>
                       </Box>
                       <Box sx={{ px: 2, flex: 1 }}>
                         {[
                           ['Savings', record.savings],
                           ['Salary loan', record.salaryLoan],
                           ['STL', record.stl],
                           ['HL', record.hl],
                           ['Educ Loan', record.educLoan],
                           ['Malasakit', record.malasakit],
                           ['LWOP', record.lwop || 0],
                           ['Other deduct', record.otherDeductions],
                         ].map(([l, v]) => (
                           <Box key={l} sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                             <Typography variant="caption" sx={{ fontFamily: "'Courier Prime', monospace", fontSize: '0.7rem' }}>{l}</Typography>
                             <Typography variant="caption" sx={{ fontWeight: 700, fontFamily: "'Courier Prime', monospace", fontSize: '0.7rem' }}>{formatCurrency(v)}</Typography>
                           </Box>
                         ))}
                       </Box>
                    </Box>
                    <Box sx={{ borderTop: '2px solid #333', p: 1.5, display: 'flex', justifyContent: 'space-between', gap: 2, bgcolor: '#fff9c4' }}>
                      <Typography sx={{ fontWeight: 800, fontFamily: "'Courier Prime', monospace" }}>Total Deduct.</Typography>
                      <Typography sx={{ fontWeight: 800, fontFamily: "'Courier Prime', monospace" }}>{formatCurrency(record.totalDeduction)}</Typography>
                    </Box>
                  </Grid>

                  {/* Take Home Summary */}
                  <Grid item xs={4}>
                    <Box sx={{ bgcolor: '#fee2b3', borderBottom: '2px solid #333', p: 1.5, display: 'flex', justifyContent: 'space-between', gap: 2 }}>
                      <Typography sx={{ fontWeight: 800, fontFamily: "'Courier Prime', monospace" }}>Net Pay</Typography>
                      <Typography sx={{ fontWeight: 800, fontFamily: "'Courier Prime', monospace" }}>{formatCurrency(record.netPay)}</Typography>
                    </Box>
                    <Box sx={{ p: 3, pt: 4, display: 'flex', flexDirection: 'column', gap: 3 }}>
                       <Box sx={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #777', pb: 1 }}>
                         <Typography sx={{ fontWeight: 800, fontFamily: "'Courier Prime', monospace" }}>1ST HALF</Typography>
                         <Typography sx={{ fontWeight: 800, fontFamily: "'Courier Prime', monospace" }}>{formatCurrency(record.firstHalf)}</Typography>
                       </Box>
                       <Box sx={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #777', pb: 1 }}>
                         <Typography sx={{ fontWeight: 800, fontFamily: "'Courier Prime', monospace" }}>2ND HALF</Typography>
                         <Typography sx={{ fontWeight: 800, fontFamily: "'Courier Prime', monospace" }}>{formatCurrency(record.secondHalf)}</Typography>
                       </Box>
                    </Box>
                  </Grid>
                </Grid>

                {/* Signatories */}
                <Grid container sx={{ mt: 10, pt: 2 }}>
                  <Grid item xs={6}>
                    <Typography variant="body2" sx={{ fontFamily: "'Courier Prime', monospace" }}>Prepared by:</Typography>
                    <Box sx={{ width: '80%', borderBottom: '1px solid #000', mt: 5, textAlign: 'center' }}>
                      <Typography sx={{ fontWeight: 800, fontFamily: "'Courier Prime', monospace" }}>Kyzeel M. Estrella</Typography>
                    </Box>
                    <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', width: '80%', fontFamily: "'Courier Prime', monospace" }}>HR Officer</Typography>
                  </Grid>
                </Grid>

              </Paper>
            </Box>
          ) : (
            <Box sx={{ p: 8, textAlign: 'center' }}>
              <Typography variant="h6" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                {search ? 'No payslip found for the given search terms.' : 'Search for an employee to generate payslip.'}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.disabled', display: 'block', mt: 1 }}>
                Ensure selected year and month have matching payroll records.
              </Typography>
            </Box>
          )}

        </CardContent>
      </Card>
    </Box>
  );
}
