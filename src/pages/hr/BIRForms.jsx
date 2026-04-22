import React, { useMemo, useState } from 'react';
import {
  Box, Card, CardContent, Typography, Grid, Button, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Paper, Chip,
  FormControl, InputLabel, Select, MenuItem, Stack, IconButton, Tooltip,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, Autocomplete, Divider
} from '@mui/material';
import {
  Print as PrintIcon,
  Visibility as ViewIcon,
  Refresh as RefreshIcon,
  FileDownload as ExcelIcon,
  PictureAsPdf as PdfIcon
} from '@mui/icons-material';
import { employees, payrollRecords } from '../../data/mockData';
import ExcelJS from 'exceljs';

const logoBlue = '#0241FB';
const goldAccent = '#d4a843';

const COMPANY = {
  name: 'ASA PHILIPPINES EMPLOYEES CREDIT COOPERATIVE (APECC)',
  address: '3RD FL. UNIT 309 PRESTIGE TOWER F. ORTIGAS JR. RD. ORTIGAS CENTER, PASIG CITY',
  tin: '---',
  rdo: '---',
};

function formatCurrency(val) {
  const n = Number(val || 0);
  return n.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function build2316Html({ emp, year, totals }, { mode }) {
  const fullName = `${emp.lastName}, ${emp.firstName}${emp.middleName ? ` ${emp.middleName}` : ''}${emp.suffix ? ` ${emp.suffix}` : ''}`;
  const empTin = emp?.requirements?.tinNo || '---';
  const generatedAt = new Date().toLocaleString('en-PH');

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <title>BIR 2316 - ${fullName} (${year})</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');
    * { box-sizing: border-box; }
    body { margin:0; padding:24px; font-family: Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif; color:#111; background:#fff; }

    .sheet { width: 100%; max-width: 900px; margin: 0 auto; border: 2px solid #111; padding: 18px; }
    .top { display:flex; align-items:flex-start; justify-content:space-between; gap:12px; }
    .bir { font-weight: 900; font-size: 18pt; letter-spacing: 0.5px; }
    .formno { font-weight: 900; font-size: 18pt; text-align:right; }
    .subtitle { margin-top: 2px; font-size: 9.5pt; color:#222; font-weight: 700; }

    .meta { margin-top: 10px; display:flex; justify-content:space-between; font-size: 9pt; color:#444; }
    .meta b { color:#111; }

    .sectionTitle { margin-top: 14px; font-weight: 900; font-size: 10.5pt; text-transform: uppercase; border-top: 2px solid #111; padding-top: 10px; }

    table { width:100%; border-collapse: collapse; margin-top: 8px; }
    td, th { border: 1px solid #111; padding: 6px 8px; font-size: 9pt; vertical-align: top; }
    th { background:#f2f2f2; font-weight: 900; text-align:left; }
    .label { width: 28%; font-weight: 800; background:#fafafa; }
    .amount { text-align:right; font-variant-numeric: tabular-nums; }

    .grid2 { display:grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 8px; }

    .note { margin-top: 10px; font-size: 8.5pt; color:#444; line-height: 1.35; }

    @media print {
      body { padding: 0; }
      .sheet { border: none; padding: 0; max-width: none; }
      @page { size: legal portrait; margin: 0.5in; }
    }
  </style>
</head>
<body>
  <div class="sheet">
    <div class="top">
      <div>
        <div class="bir">BUREAU OF INTERNAL REVENUE</div>
        <div class="subtitle">CERTIFICATE OF COMPENSATION PAYMENT / TAX WITHHELD</div>
      </div>
      <div class="formno">BIR Form No. 2316</div>
    </div>

    <div class="meta">
      <div><b>Calendar Year:</b> ${year}</div>
      <div><b>Generated:</b> ${generatedAt}</div>
    </div>

    <div class="sectionTitle">Part I — Employer Information</div>
    <table>
      <tr><td class="label">Employer Name</td><td>${COMPANY.name}</td></tr>
      <tr><td class="label">Employer Address</td><td>${COMPANY.address}</td></tr>
      <tr><td class="label">Employer TIN / RDO</td><td>${COMPANY.tin} / ${COMPANY.rdo}</td></tr>
    </table>

    <div class="sectionTitle">Part II — Employee Information</div>
    <table>
      <tr><td class="label">Employee Name</td><td>${fullName}</td></tr>
      <tr><td class="label">Employee ID / Department</td><td>${emp.id || '---'} / ${emp.department || '---'}</td></tr>
      <tr><td class="label">Employee TIN</td><td>${empTin}</td></tr>
      <tr><td class="label">Position / Status</td><td>${emp.designation || '---'} / ${emp.status || '---'}</td></tr>
    </table>

    <div class="sectionTitle">Part III — Compensation & Tax Summary</div>
    <table>
      <thead>
        <tr>
          <th>Description</th>
          <th style="width: 28%" class="amount">Amount</th>
        </tr>
      </thead>
      <tbody>
        <tr><td>Basic Compensation</td><td class="amount">${formatCurrency(totals.basicPay)}</td></tr>
        <tr><td>Deminimis Benefits</td><td class="amount">${formatCurrency(totals.deminimis)}</td></tr>
        <tr><td>Other Non-Taxable</td><td class="amount">${formatCurrency(totals.nonTaxable)}</td></tr>
        <tr><td style="font-weight:900">Total Compensation</td><td class="amount" style="font-weight:900">${formatCurrency(totals.totalCompensation)}</td></tr>
        <tr><td>Employee Statutory Contributions (SSS/PH/HDMF)</td><td class="amount">${formatCurrency(totals.statutoryEE)}</td></tr>
        <tr><td style="font-weight:900">Taxable Compensation (System)</td><td class="amount" style="font-weight:900">${formatCurrency(totals.taxableCompensation)}</td></tr>
        <tr><td>Income Tax Withheld</td><td class="amount">${formatCurrency(totals.taxWithheld)}</td></tr>
      </tbody>
    </table>

    <div class="grid2">
      <table>
        <tr><th colspan="2">Breakdown (EE)</th></tr>
        <tr><td class="label">SSS</td><td class="amount">${formatCurrency(totals.sssEE)}</td></tr>
        <tr><td class="label">PhilHealth</td><td class="amount">${formatCurrency(totals.phEE)}</td></tr>
        <tr><td class="label">HDMF</td><td class="amount">${formatCurrency(totals.hdmfEE)}</td></tr>
      </table>
      <table>
        <tr><th colspan="2">Reference</th></tr>
        <tr><td class="label">Payroll Records Count</td><td class="amount">${totals.monthCount}</td></tr>
        <tr><td class="label">Payroll Location</td><td>${emp.payrollLocation || '---'}</td></tr>
        <tr><td class="label">Employment Date</td><td>${emp.employmentDate || emp?.employmentDetails?.dateHired || '---'}</td></tr>
      </table>
    </div>

    <div class="note">
      This is a system-generated preview aligned to the BIR Form 2316 data points available in the system payroll records.
      For official filing, ensure employer registration details and statutory tables are verified.
    </div>
  </div>
  ${
    mode === 'pdf'
      ? `
  <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>
  <script>
    window.onload = function() {
      var element = document.querySelector('.sheet');
      var opt = {
        margin:       0.5,
        filename:     'BIR2316_${emp.id || 'EMP'}_${year}.pdf',
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2 },
        jsPDF:        { unit: 'in', format: 'legal', orientation: 'portrait' }
      };
      html2pdf().set(opt).from(element).save().then(() => {
        setTimeout(() => window.close(), 800);
      });
    };
  </script>`
      : ''
  }
</body>
</html>`;
}

export default function BIRForms() {
  const [year, setYear] = useState('2025');
  const [month, setMonth] = useState('March');

  const birForms = [
    { 
      id: '1604-C', 
      title: 'BIR Form 1604-C', 
      description: 'Annual Information Return of Income Taxes Withheld on Compensation',
      frequency: 'Annual',
      status: 'Pending',
      date: '---'
    }
  ];

  const [employeePickerOpen, setEmployeePickerOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(employees?.[0] ?? null);
  const [pendingAction, setPendingAction] = useState(null); // 'view' | 'pdf' | 'print'

  const employeeOptions = useMemo(() => {
    return (employees || []).map((e) => ({
      ...e,
      display: `${e.id} — ${e.lastName}, ${e.firstName}${e.middleName ? ` ${e.middleName}` : ''}`,
    }));
  }, []);

  const totals = useMemo(() => {
    if (!selectedEmployee) return null;
    const y = Number(year);
    const recs = (payrollRecords || []).filter((r) => r.employeeId === selectedEmployee.id && r.year === y);
    const sum = (k) => recs.reduce((acc, r) => acc + Number(r?.[k] || 0), 0);
    const basicPay = sum('basicPay');
    const deminimis = sum('deminimis');
    const nonTaxable = sum('nonTaxable');
    const sssEE = sum('sssEE');
    const phEE = sum('phEE');
    const hdmfEE = sum('hdmfEE');
    const taxWithheld = sum('tax');
    const totalCompensation = basicPay + deminimis + nonTaxable;
    const statutoryEE = sssEE + phEE + hdmfEE;
    const taxableCompensation = Math.max(totalCompensation - statutoryEE, 0);
    return {
      monthCount: recs.length,
      basicPay,
      deminimis,
      nonTaxable,
      totalCompensation,
      sssEE,
      phEE,
      hdmfEE,
      statutoryEE,
      taxableCompensation,
      taxWithheld,
    };
  }, [selectedEmployee, year]);

  const open2316 = (action) => {
    if (!selectedEmployee) {
      setPendingAction(action);
      setEmployeePickerOpen(true);
      return;
    }
    const w = window.open('', '_blank');
    if (!w) return;
    const html = build2316Html(
      { emp: selectedEmployee, year: Number(year), totals },
      { mode: action === 'pdf' ? 'pdf' : 'print' }
    );
    w.document.write(html);
    w.document.close();
    w.focus();
    if (action === 'print') {
      setTimeout(() => {
        w.print();
        w.close();
      }, 350);
    }
  };

  const download2316Excel = async () => {
    if (!selectedEmployee || !totals) return;
    const emp = selectedEmployee;
    const y = Number(year);

    const fullName = `${emp.lastName}, ${emp.firstName}${emp.middleName ? ` ${emp.middleName}` : ''}${emp.suffix ? ` ${emp.suffix}` : ''}`;
    const empTin = emp?.requirements?.tinNo || '';

    // Load template from public/ so Vite serves it
    const res = await fetch('/reports-template/2316-template.xlsx');
    if (!res.ok) throw new Error('Failed to load 2316 Excel template.');
    const buf = await res.arrayBuffer();

    const wb = new ExcelJS.Workbook();
    await wb.xlsx.load(buf);
    const ws = wb.worksheets[0];

    // ── Header / Part I (Employee) ───────────────────────────────────────────
    ws.getCell('C11').value = y;          // For the Year
    ws.getCell('C14').value = empTin;     // Employee TIN (value area starts at C14)
    ws.getCell('B16').value = fullName;   // Employee Name (value area starts at B16)

    // ── Part II (Employer - Present) ─────────────────────────────────────────
    ws.getCell('C41').value = COMPANY.tin;      // Employer TIN
    ws.getCell('B43').value = COMPANY.name;     // Employer's Name
    ws.getCell('B46').value = COMPANY.address;  // Registered Address

    // ── Part IV-B / Summary values (common fields) ───────────────────────────
    const totalNonTaxable = Number(totals.deminimis || 0) + Number(totals.nonTaxable || 0) + Number(totals.statutoryEE || 0);

    // Right-side Non-taxable section
    ws.getCell('AN33').value = Number(totals.statutoryEE || 0);           // Contributions (EE)
    ws.getCell('AN36').value = Number(totals.basicPay || 0);              // Salaries / Compensation
    ws.getCell('AN39').value = Number(totalNonTaxable || 0);              // Total Non-taxable/Exempt

    // Left-side compensation summary
    ws.getCell('T61').value = Number(totals.totalCompensation || 0);      // Gross compensation from present employer
    ws.getCell('T63').value = Number(totalNonTaxable || 0);               // Less: total non-taxable/exempt compensation
    ws.getCell('T66').value = Number(totals.taxableCompensation || 0);    // Taxable compensation income from present employer
    ws.getCell('T74').value = Number(totals.taxWithheld || 0);            // Taxes withheld - present employer
    ws.getCell('T77').value = Number(totals.taxWithheld || 0);            // Total taxes withheld (adjusted)

    // Taxable compensation total (right-side summary)
    ws.getCell('AN77').value = Number(totals.taxableCompensation || 0);   // Total taxable compensation income

    // Ensure numeric cells stay numeric; template formatting should apply.
    const filename = `BIR2316_${emp.id}_${y}.xlsx`;
    const out = await wb.xlsx.writeBuffer();
    const blob = new Blob([out], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleActionClick = (action) => {
    // All 2316 actions are per-employee; open picker/preview first.
    setPendingAction(action);
    setEmployeePickerOpen(true);
  };

  const headerStyle = {
    bgcolor: logoBlue,
    color: '#FDFDFC',
    fontWeight: 700,
    fontSize: '0.85rem'
  };

  return (
    <Box className="page-container" sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 900, color: '#1a202c', letterSpacing: '-0.5px' }}>
            BIR Forms Module
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500 }}>
            Generate and manage tax compliance forms for APECC employees
          </Typography>
        </Box>
        <Stack direction="row" spacing={2}>
          <Button variant="outlined" startIcon={<RefreshIcon />} sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 700 }}>
            Sync Payroll Data
          </Button>
          <Button variant="contained" sx={{ bgcolor: logoBlue, borderRadius: 2, textTransform: 'none', px: 4, fontWeight: 700 }}>
            Generate All Current
          </Button>
        </Stack>
      </Box>

      {/* Filters */}
      <Card sx={{ mb: 3, borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
        <CardContent sx={{ py: 2, px: 3, display: 'flex', gap: 2, alignItems: 'center' }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 800, color: logoBlue, mr: 2 }}>FILTERS:</Typography>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Year</InputLabel>
            <Select value={year} label="Year" onChange={(e) => setYear(e.target.value)}>
              <MenuItem value="2025">2025</MenuItem>
              <MenuItem value="2024">2024</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Month</InputLabel>
            <Select value={month} label="Month" onChange={(e) => setMonth(e.target.value)}>
              {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map(m => (
                <MenuItem key={m} value={m}>{m}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </CardContent>
      </Card>

      {/* Form List Table */}
      <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: '0 4px 24px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={headerStyle}>Form ID</TableCell>
              <TableCell sx={headerStyle}>Form Description</TableCell>
              <TableCell sx={headerStyle} align="center">Frequency</TableCell>
              <TableCell sx={headerStyle} align="center">Status</TableCell>
              <TableCell sx={headerStyle} align="center">Last Generated</TableCell>
              <TableCell sx={headerStyle} align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {birForms.map((form) => (
              <TableRow key={form.id} hover>
                <TableCell sx={{ fontWeight: 800, color: logoBlue }}>{form.id}</TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>{form.title}</Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>{form.description}</Typography>
                </TableCell>
                <TableCell align="center">
                  <Chip label={form.frequency} size="small" sx={{ fontWeight: 600, fontSize: '0.7rem' }} />
                </TableCell>
                <TableCell align="center">
                  <Chip 
                    label={form.status} 
                    size="small" 
                    sx={{ 
                      fontWeight: 800, 
                      fontSize: '0.7rem',
                      bgcolor: form.status === 'Generated' ? 'rgba(46,125,50,0.1)' : (form.status === 'Ready' ? 'rgba(2, 61, 251, 0.1)' : 'rgba(0,0,0,0.05)'),
                      color: form.status === 'Generated' ? '#2e7d32' : (form.status === 'Ready' ? logoBlue : 'text.secondary')
                    }} 
                  />
                </TableCell>
                <TableCell align="center" sx={{ fontSize: '0.85rem', fontWeight: 500 }}>{form.date}</TableCell>
                <TableCell align="right">
                  <Stack direction="row" spacing={1} justifyContent="flex-end" alignItems="center">
                    <Tooltip title="View Preview">
                      <IconButton size="small" color="primary" onClick={() => handleActionClick('view')}>
                        <ViewIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Download PDF">
                      <IconButton size="small" sx={{ color: '#d32f2f' }} onClick={() => handleActionClick('pdf')}>
                        <PdfIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Download Excel (Template)">
                      <IconButton size="small" sx={{ color: '#2e7d32' }} onClick={() => handleActionClick('excel')}>
                        <ExcelIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Print">
                      <IconButton size="small" onClick={() => handleActionClick('print')}>
                        <PrintIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    
                    {form.id === '1604-C' && (
                      <Tooltip title="Generate DAT File for BIR Sending">
                        <Button 
                          size="small" 
                          variant="contained" 
                          sx={{ 
                            ml: 2, 
                            bgcolor: '#2e7d32', 
                            '&:hover': { bgcolor: '#1b5e20' },
                            textTransform: 'none', 
                            fontWeight: 700, 
                            height: 28 
                          }}
                          onClick={() => alert('DAT file generated for BIR Sending.')}
                        >
                          BIR Sending
                        </Button>
                      </Tooltip>
                    )}
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* 2316 Employee Picker / Preview */}
      <Dialog open={employeePickerOpen} onClose={() => setEmployeePickerOpen(false)} fullWidth maxWidth="md">
        <DialogTitle sx={{ fontWeight: 900, color: '#111' }}>
          BIR Form 2316 — Per Employee
        </DialogTitle>
        <DialogContent dividers sx={{ bgcolor: '#f7f9ff' }}>
          <Stack spacing={2}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
              <Autocomplete
                fullWidth
                options={employeeOptions}
                value={selectedEmployee}
                onChange={(_, v) => setSelectedEmployee(v)}
                getOptionLabel={(opt) => opt?.display || ''}
                renderInput={(params) => <TextField {...params} label="Select Employee" size="small" />}
              />
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Year</InputLabel>
                <Select value={year} label="Year" onChange={(e) => setYear(e.target.value)}>
                  {[2026, 2025, 2024, 2023].map((y) => (
                    <MenuItem key={y} value={String(y)}>{y}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>

            <Divider />

            <Paper sx={{ p: 2.5, borderRadius: 2, border: `1px solid rgba(2, 65, 251, 0.15)` }}>
              <Typography sx={{ fontWeight: 900, color: logoBlue, mb: 1 }}>
                2316 Preview (Summary)
              </Typography>
              {selectedEmployee && totals ? (
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body2" sx={{ fontWeight: 800 }}>Employee</Typography>
                    <Typography variant="body2">
                      {selectedEmployee.lastName}, {selectedEmployee.firstName} {selectedEmployee.middleName || ''} ({selectedEmployee.id})
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1, fontWeight: 800 }}>TIN</Typography>
                    <Typography variant="body2">{selectedEmployee?.requirements?.tinNo || '---'}</Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body2" sx={{ fontWeight: 800 }}>Year</Typography>
                    <Typography variant="body2">{year}</Typography>
                    <Typography variant="body2" sx={{ mt: 1, fontWeight: 800 }}>Payroll Records</Typography>
                    <Typography variant="body2">{totals.monthCount}</Typography>
                  </Grid>

                  <Grid item xs={12}>
                    <Divider sx={{ my: 1.5 }} />
                    <Grid container spacing={1}>
                      {[
                        ['Total Compensation', totals.totalCompensation],
                        ['Statutory (EE)', totals.statutoryEE],
                        ['Taxable Compensation', totals.taxableCompensation],
                        ['Tax Withheld', totals.taxWithheld],
                      ].map(([label, val]) => (
                        <Grid item xs={12} sm={6} key={label}>
                          <Stack direction="row" justifyContent="space-between" sx={{ p: 1, borderRadius: 1, bgcolor: 'rgba(2,65,251,0.04)' }}>
                            <Typography variant="body2" sx={{ fontWeight: 800 }}>{label}</Typography>
                            <Typography variant="body2" sx={{ fontWeight: 900 }}>{formatCurrency(val)}</Typography>
                          </Stack>
                        </Grid>
                      ))}
                    </Grid>
                  </Grid>
                </Grid>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Select an employee to preview BIR Form 2316.
                </Typography>
              )}
            </Paper>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={() => setEmployeePickerOpen(false)} sx={{ textTransform: 'none' }}>
            Close
          </Button>
          <Stack direction="row" spacing={1}>
            <Button
              variant={pendingAction === 'view' ? 'contained' : 'outlined'}
              startIcon={<ViewIcon />}
              onClick={() => {
                setEmployeePickerOpen(false);
                open2316('view');
              }}
              sx={{
                textTransform: 'none',
                fontWeight: 800,
                ...(pendingAction === 'view'
                  ? { bgcolor: logoBlue, '&:hover': { bgcolor: '#0230c4' } }
                  : {}),
              }}
              disabled={!selectedEmployee}
            >
              View (Print Preview)
            </Button>
            <Button
              variant="contained"
              startIcon={<PdfIcon />}
              onClick={() => {
                setEmployeePickerOpen(false);
                open2316('pdf');
              }}
              sx={{ textTransform: 'none', fontWeight: 900, bgcolor: '#d32f2f', '&:hover': { bgcolor: '#b71c1c' } }}
              disabled={!selectedEmployee}
            >
              Download PDF
            </Button>
            <Button
              variant={pendingAction === 'excel' ? 'contained' : 'outlined'}
              startIcon={<ExcelIcon />}
              onClick={async () => {
                setEmployeePickerOpen(false);
                await download2316Excel();
              }}
              sx={{
                textTransform: 'none',
                fontWeight: 900,
                ...(pendingAction === 'excel'
                  ? { bgcolor: '#2e7d32', color: '#fff', '&:hover': { bgcolor: '#1b5e20' } }
                  : { borderColor: '#2e7d32', color: '#1b5e20', '&:hover': { borderColor: '#1b5e20', bgcolor: 'rgba(46,125,50,0.06)' } }),
              }}
              disabled={!selectedEmployee}
            >
              Download Excel
            </Button>
            <Button
              variant={pendingAction === 'print' ? 'contained' : 'outlined'}
              startIcon={<PrintIcon />}
              onClick={() => {
                setEmployeePickerOpen(false);
                open2316('print');
              }}
              sx={{
                textTransform: 'none',
                fontWeight: 900,
                ...(pendingAction === 'print'
                  ? { bgcolor: '#8d6e63', color: '#fff', '&:hover': { bgcolor: '#6d4c41' } }
                  : { borderColor: '#8d6e63', color: '#6d4c41', '&:hover': { borderColor: '#6d4c41', bgcolor: 'rgba(141,110,99,0.06)' } }),
              }}
              disabled={!selectedEmployee}
            >
              Print (Legal)
            </Button>
          </Stack>
        </DialogActions>
      </Dialog>

      {/* Info Cards */}
      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 3, borderLeft: `6px solid ${goldAccent}`, bgcolor: 'rgba(212, 168, 67, 0.05)' }}>
            <CardContent>
              <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 1 }}>Reporting Requirement</Typography>
              <Typography variant="body2" color="text.secondary">
                Ensure all payroll runs for the selected month are **Closed** and **Validated** before generating final BIR forms. 
                Discrepancies in employee TIN or missing contribution data will be flagged during the validation process.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 3, borderLeft: `6px solid ${logoBlue}`, bgcolor: 'rgba(2, 61, 251, 0.05)' }}>
            <CardContent>
              <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 1 }}>Automatic Filing Integration</Typography>
              <Typography variant="body2" color="text.secondary">
                APECC MS is currently configured for manual eFPS uploading. You can download the DAT files directly from the 
                preview section of each form for faster processing in the BIR offline tools.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
