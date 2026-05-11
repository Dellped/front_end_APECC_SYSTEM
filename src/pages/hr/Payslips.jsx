import React, { useState, useRef } from 'react';
import {
  Box, Card, CardContent, Typography, Grid, MenuItem, Select,
  FormControl, InputLabel, Button, TableContainer, Table, TableHead, TableRow, TableCell, TableBody,
  TextField, InputAdornment, Paper, Divider, Stack, Chip, IconButton, Dialog, DialogContent, DialogActions, Tooltip
} from '@mui/material';
import {
  Print as PrintIcon,
  Search as SearchIcon,
  PictureAsPdf as PdfIcon,
  Visibility as ViewIcon,
  Description as ExcelIcon
} from '@mui/icons-material';
import { employees, payrollRecords } from '../../data/mockData';
import apeccLogo from '../../../assets/images/APECC-Logo.jpg';
import { exportToExcel } from '../../utils/exportUtils';

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
  
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedEmp, setSelectedEmp] = useState(null);
  const [selectedRecord, setSelectedRecord] = useState(null);

  // Filter employees matching search
  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch = `${emp.firstName} ${emp.lastName} ${emp.id}`
      .toLowerCase()
      .includes(search.toLowerCase());
    return matchesSearch;
  });

  const getRecordForEmp = (empId) => {
    return payrollRecords.find(
      (r) => r.employeeId === empId && r.year === selectedYear && r.monthIndex === selectedMonth
    );
  };

  const tableData = filteredEmployees.map(emp => ({
    emp,
    record: getRecordForEmp(emp.id)
  })).filter(data => data.record); // Only show employees who have a payslip this month

  const generatePayslipHTML = (emp, record, isPdf = false) => {
    return `
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
                  <tr><td>SSS</td><td class="amount">${formatCurrency(record.sssEE || record.sss)}</td></tr>
                  <tr><td>PH</td><td class="amount">${formatCurrency(record.phEE || record.philHealth)}</td></tr>
                  <tr><td>HDMF</td><td class="amount">${formatCurrency(record.hdmfEE || record.pagIbig)}</td></tr>
                  <tr><td>Tax</td><td class="amount">${formatCurrency(record.tax)}</td></tr>
                  <tr><td colspan="2" style="font-weight: 700; background: #ddd; text-align: center; font-size: 8pt; border-bottom: 1px solid #000; border-top: 1px solid #000;">APECC DEDUCTIONS</td></tr>
                  <tr><td>Savings</td><td class="amount">${formatCurrency(record.savings)}</td></tr>
                  <tr><td>Salary loan</td><td class="amount">${formatCurrency(record.salaryLoan)}</td></tr>
                  <tr><td>STL</td><td class="amount">${formatCurrency(record.stl)}</td></tr>
                  <tr><td>HL</td><td class="amount">${formatCurrency(record.hl || record.housingLoan)}</td></tr>
                  <tr><td>Educ Loan</td><td class="amount">${formatCurrency(record.educLoan)}</td></tr>
                  <tr><td>Malasakit</td><td class="amount">${formatCurrency(record.malasakit || record.malasakitLoan)}</td></tr>
                  <tr><td>LWOP</td><td class="amount">${formatCurrency(record.lwop || 0)}</td></tr>
                  <tr><td>Other deduction</td><td class="amount">${formatCurrency(record.otherDeductions || record.otherDeduction)}</td></tr>
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
    `;
  };

  const handlePrintPdf = (emp, record) => {
    if (!record || !emp) return;
    const printWindow = window.open('', '_blank');
    printWindow.document.write(generatePayslipHTML(emp, record, true));
    printWindow.document.close();
    printWindow.focus();
  };

  const handleExportExcel = (emp, record) => {
    if (!record || !emp) return;
    const headers = ['Employee ID', 'Name', 'Month', 'Year', 'Basic Pay', 'Deminimis', 'Repair & Maint', 'Total Paid', 'Savings', 'SSS', 'PH', 'HDMF', 'Salary Loan', 'STL', 'HL', 'Educ Loan', 'Tax', 'Malasakit', 'Other Ded', 'Total Deduction', 'Net Pay', 'First Half', 'Second Half'];
    const row = [
      emp.id, `${emp.lastName}, ${emp.firstName}`, record.month, record.year, record.basicPay, record.deminimis, record.repairMaintenance, record.totalIncome, record.savings, (record.sssEE || record.sss), (record.phEE || record.philHealth), (record.hdmfEE || record.pagIbig), record.salaryLoan, record.stl, (record.hl || record.housingLoan), record.educLoan, record.tax, (record.malasakit || record.malasakitLoan), (record.otherDeductions || record.otherDeduction), record.totalDeduction, record.netPay, record.firstHalf, record.secondHalf
    ];
    exportToExcel(headers, [row], `Payslip_${emp.id}_${record.month}${record.year}`);
  };

  const handleView = (emp, record) => {
    setSelectedEmp(emp);
    setSelectedRecord(record);
    setViewModalOpen(true);
  };

  const handlePrintFromModal = () => {
    if (!selectedRecord || !selectedEmp) return;
    const printWindow = window.open('', '_blank');
    printWindow.document.write(generatePayslipHTML(selectedEmp, selectedRecord, false));
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
        printWindow.print();
        printWindow.close();
    }, 250);
  };

  const handlePdfFromModal = () => {
    handlePrintPdf(selectedEmp, selectedRecord);
  };

  const handleExcelFromModal = () => {
    handleExportExcel(selectedEmp, selectedRecord);
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
            <Grid item xs={12} md={6}>
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
            <Grid item xs={6} md={3}>
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
          </Grid>
        </CardContent>
      </Card>

      {/* ── Payslip List Container ────────────────────────────────────── */}
      <Card sx={{ borderRadius: 3, borderTop: `3px solid ${goldAccent}`, boxShadow: '0 4px 24px rgba(5,7,126,0.08)' }}>
        <TableContainer component={Paper} elevation={0}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead sx={{ bgcolor: '#f4f7fe' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 800, color: NAV }}>ID</TableCell>
                <TableCell sx={{ fontWeight: 800, color: NAV }}>Employee Name</TableCell>
                <TableCell sx={{ fontWeight: 800, color: NAV }}>Department</TableCell>
                <TableCell sx={{ fontWeight: 800, color: NAV }} align="right">Net Pay</TableCell>
                <TableCell sx={{ fontWeight: 800, color: NAV }} align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tableData.length > 0 ? tableData.map((row) => (
                <TableRow key={row.emp.id} hover>
                  <TableCell>{row.emp.id}</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>{row.emp.lastName}, {row.emp.firstName}</TableCell>
                  <TableCell>{row.emp.department}</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700, color: '#2e7d32' }}>
                    {formatCurrency(row.record.netPay)}
                  </TableCell>
                  <TableCell align="center">
                    <Stack direction="row" spacing={1} justifyContent="center">
                      <Tooltip title="View Payslip">
                        <IconButton size="small" onClick={() => handleView(row.emp, row.record)} sx={{ color: NAV, bgcolor: 'rgba(5,7,126,0.08)', '&:hover': { bgcolor: 'rgba(5,7,126,0.15)' } }}>
                          <ViewIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Download PDF">
                        <IconButton size="small" onClick={() => handlePrintPdf(row.emp, row.record)} sx={{ color: '#d32f2f', bgcolor: 'rgba(211,47,47,0.08)', '&:hover': { bgcolor: 'rgba(211,47,47,0.15)' } }}>
                          <PdfIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Download Excel">
                        <IconButton size="small" onClick={() => handleExportExcel(row.emp, row.record)} sx={{ color: '#2e7d32', bgcolor: 'rgba(46,125,50,0.08)', '&:hover': { bgcolor: 'rgba(46,125,50,0.15)' } }}>
                          <ExcelIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                    <Typography variant="h6" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                      No payslips found for this period.
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.disabled', display: 'block', mt: 1 }}>
                      Try selecting a different month/year or clearing the search filter.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* ── Payslip View Modal ────────────────────────────────────────── */}
      <Dialog open={viewModalOpen} onClose={() => setViewModalOpen(false)} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogContent sx={{ p: 0, bgcolor: '#f4f7fe', overflowX: 'hidden' }}>
          {selectedRecord && selectedEmp && (
            <Box sx={{ p: { xs: 2, sm: 4 } }}>
              <Paper elevation={8} sx={{ 
                width: '100%', maxWidth: 850, mx: 'auto', p: { xs: 3, md: 5 }, borderRadius: 2,
                bgcolor: '#ffffff', color: '#000', 
                fontFamily: "'Courier Prime', monospace",
                position: 'relative', overflow: 'hidden', zIndex: 1
              }}>
              
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
                    <Grid item xs={4} sm={3} sx={{ p: 1.5, borderRight: '1px solid #333', fontWeight: 800, bgcolor: '#fafafa', fontFamily: "'Courier Prime', monospace" }}>Name:</Grid>
                    <Grid item xs={8} sm={9} sx={{ p: 1.5, fontWeight: 700, fontFamily: "'Courier Prime', monospace" }}>
                      {selectedEmp.lastName}, {selectedEmp.firstName} {selectedEmp.middleName || ''}
                    </Grid>
                  </Grid>
                  <Grid container sx={{ borderBottom: '1px solid #333' }}>
                    <Grid item xs={4} sm={3} sx={{ p: 1.5, borderRight: '1px solid #333', fontWeight: 800, bgcolor: '#fafafa', fontFamily: "'Courier Prime', monospace" }}>Position:</Grid>
                    <Grid item xs={8} sm={9} sx={{ p: 1.5, fontFamily: "'Courier Prime', monospace" }}>
                      {selectedEmp.designation || 'N/A'} - {selectedEmp.department || 'N/A'}
                    </Grid>
                  </Grid>
                  <Grid container>
                    <Grid item xs={4} sm={3} sx={{ p: 1.5, borderRight: '1px solid #333', fontWeight: 800, bgcolor: '#fafafa', fontFamily: "'Courier Prime', monospace" }}>ID No.</Grid>
                    <Grid item xs={8} sm={9} sx={{ p: 1.5, fontFamily: "'Courier Prime', monospace" }}>{selectedEmp.id}</Grid>
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
                  {selectedRecord.month} {selectedRecord.year} PAYSLIP
                </Box>

                {/* Grid Content */}
                <Grid container sx={{ border: '2px solid #333' }}>
                  {/* Earnings */}
                  <Grid item xs={12} md={4} sx={{ borderRight: { md: '1px solid #333' }, borderBottom: { xs: '2px solid #333', md: 'none' } }}>
                    <Box sx={{ bgcolor: '#eee', borderBottom: '2px solid #333', p: 1, textAlign: 'center', fontWeight: 800, fontFamily: "'Courier Prime', monospace" }}>PAID</Box>
                    <Box sx={{ p: 2, minHeight: { md: 220 } }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                        <Typography variant="body2" sx={{ fontFamily: "'Courier Prime', monospace" }}>Basic pay</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 700, fontFamily: "'Courier Prime', monospace" }}>{formatCurrency(selectedRecord.basicPay)}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                        <Typography variant="body2" sx={{ fontFamily: "'Courier Prime', monospace" }}>Deminimis</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 700, fontFamily: "'Courier Prime', monospace" }}>{formatCurrency(selectedRecord.deminimis)}</Typography>
                      </Box>
                    </Box>
                    <Box sx={{ borderTop: '2px solid #333', p: 1.5, display: 'flex', justifyContent: 'space-between', gap: 2, bgcolor: '#fff9c4' }}>
                      <Typography sx={{ fontWeight: 800, fontFamily: "'Courier Prime', monospace" }}>Total Paid</Typography>
                      <Typography sx={{ fontWeight: 800, fontFamily: "'Courier Prime', monospace" }}>{formatCurrency(selectedRecord.totalIncome)}</Typography>
                    </Box>
                  </Grid>

                  {/* Deductions */}
                  <Grid item xs={12} md={4} sx={{ borderRight: { md: '1px solid #333' }, borderBottom: { xs: '2px solid #333', md: 'none' } }}>
                    <Box sx={{ bgcolor: '#eee', borderBottom: '2px solid #333', p: 1, textAlign: 'center', fontWeight: 800, fontFamily: "'Courier Prime', monospace" }}>DEDUCTIONS</Box>
                    <Box sx={{ pb: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
                       <Box sx={{ bgcolor: '#ddd', borderBottom: '1px solid #333', py: 0.3, px: 2, mb: 1, textAlign: 'center' }}>
                         <Typography sx={{ fontSize: '0.65rem', fontWeight: 800, fontFamily: "'Courier Prime', monospace" }}>GOVERNMENT DEDUCTIONS</Typography>
                       </Box>
                       <Box sx={{ px: 2 }}>
                         {[
                           ['SSS', (selectedRecord.sssEE || selectedRecord.sss)],
                           ['PH', (selectedRecord.phEE || selectedRecord.philHealth)],
                           ['HDMF', (selectedRecord.hdmfEE || selectedRecord.pagIbig)],
                           ['Tax', selectedRecord.tax],
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
                           ['Savings', selectedRecord.savings],
                           ['Salary loan', selectedRecord.salaryLoan],
                           ['STL', selectedRecord.stl],
                           ['HL', (selectedRecord.hl || selectedRecord.housingLoan)],
                           ['Educ Loan', selectedRecord.educLoan],
                           ['Malasakit', (selectedRecord.malasakit || selectedRecord.malasakitLoan)],
                           ['LWOP', selectedRecord.lwop || 0],
                           ['Other deduct', (selectedRecord.otherDeductions || selectedRecord.otherDeduction)],
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
                      <Typography sx={{ fontWeight: 800, fontFamily: "'Courier Prime', monospace" }}>{formatCurrency(selectedRecord.totalDeduction)}</Typography>
                    </Box>
                  </Grid>

                  {/* Take Home Summary */}
                  <Grid item xs={12} md={4}>
                    <Box sx={{ bgcolor: '#fee2b3', borderBottom: '2px solid #333', p: 1.5, display: 'flex', justifyContent: 'space-between', gap: 2 }}>
                      <Typography sx={{ fontWeight: 800, fontFamily: "'Courier Prime', monospace" }}>Net Pay</Typography>
                      <Typography sx={{ fontWeight: 800, fontFamily: "'Courier Prime', monospace" }}>{formatCurrency(selectedRecord.netPay)}</Typography>
                    </Box>
                    <Box sx={{ p: 3, pt: 4, display: 'flex', flexDirection: 'column', gap: 3 }}>
                       <Box sx={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #777', pb: 1 }}>
                         <Typography sx={{ fontWeight: 800, fontFamily: "'Courier Prime', monospace" }}>1ST HALF</Typography>
                         <Typography sx={{ fontWeight: 800, fontFamily: "'Courier Prime', monospace" }}>{formatCurrency(selectedRecord.firstHalf)}</Typography>
                       </Box>
                       <Box sx={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #777', pb: 1 }}>
                         <Typography sx={{ fontWeight: 800, fontFamily: "'Courier Prime', monospace" }}>2ND HALF</Typography>
                         <Typography sx={{ fontWeight: 800, fontFamily: "'Courier Prime', monospace" }}>{formatCurrency(selectedRecord.secondHalf)}</Typography>
                       </Box>
                    </Box>
                  </Grid>
                </Grid>

                {/* Signatories */}
                <Grid container sx={{ mt: 10, pt: 2 }}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" sx={{ fontFamily: "'Courier Prime', monospace" }}>Prepared by:</Typography>
                    <Box sx={{ width: '80%', borderBottom: '1px solid #000', mt: 5, textAlign: 'center' }}>
                      <Typography sx={{ fontWeight: 800, fontFamily: "'Courier Prime', monospace" }}>Kyzeel M. Estrella</Typography>
                    </Box>
                    <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', width: '80%', fontFamily: "'Courier Prime', monospace" }}>HR Officer</Typography>
                  </Grid>
                </Grid>
              </Paper>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3, bgcolor: '#f4f7fe' }}>
          <Button onClick={() => setViewModalOpen(false)} sx={{ color: 'text.secondary', fontWeight: 700 }}>Close</Button>
          <Box sx={{ flexGrow: 1 }} />
          <Button startIcon={<PdfIcon />} onClick={handlePdfFromModal} sx={{ color: '#d32f2f', fontWeight: 700 }}>PDF</Button>
          <Button startIcon={<ExcelIcon />} onClick={handleExcelFromModal} sx={{ color: '#2e7d32', fontWeight: 700 }}>Excel</Button>
          <Button variant="contained" startIcon={<PrintIcon />} onClick={handlePrintFromModal} sx={{ bgcolor: NAV, '&:hover': { bgcolor: IND }, borderRadius: 2, fontWeight: 700 }}>
            Print
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
