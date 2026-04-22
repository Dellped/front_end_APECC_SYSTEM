import React, { useState, useMemo } from 'react';
import {
  Box, Card, CardContent, Typography, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, MenuItem, Select, FormControl,
  InputLabel, Grid, Chip, TextField, InputAdornment, Paper, Divider,
  TablePagination, Button, Stack, Avatar
} from '@mui/material';
import {
  Search as SearchIcon,
  FileDownload as CsvIcon,
  PictureAsPdf as PdfIcon,
  Print as PrintIcon,
  CalendarMonth as CalendarIcon,
  AccountBalanceWallet as WalletIcon,
  TrendingDown as DeductionIcon,
  AccountBalance as TaxIcon,
  Receipt as NetPayIcon,
} from '@mui/icons-material';
import { employees, payrollRecords } from '../../data/mockData';
import { exportToCSV, printTable, exportToPDF } from '../../utils/exportUtils';

// ── Palette ──────────────────────────────────────────────────────────────────
const NAV = '#05077E';
const IND = '#0241FB';
const ROY = '#4470ED';
const PER = '#B4B7D3';
const WHT = '#FDFDFC';
const goldAccent = '#d4a843';
// ─────────────────────────────────────────────────────────────────────────────

const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December'
];

const tableHeaderStyle = {
  background: `linear-gradient(135deg, ${NAV} 0%, ${IND} 60%, ${ROY} 100%)`,
  color: WHT,
  fontWeight: 700,
  fontSize: '0.75rem',
  padding: '12px 8px',
  textAlign: 'center',
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
  whiteSpace: 'nowrap',
};

const cellStyle = {
  fontSize: '0.82rem',
  padding: '10px 8px',
  borderBottom: `1px solid rgba(5,7,126,0.06)`,
};

export default function PayrollHistory() {
  const [search, setSearch] = useState('');
  const [selectedYear, setSelectedYear] = useState(() => {
    const years = [...new Set(payrollRecords.map((r) => r.year))].sort((a, b) => b - a);
    return years[0] || 2026;
  });
  const [selectedMonth, setSelectedMonth] = useState('All');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const years = [...new Set(payrollRecords.map((r) => r.year))].sort((a, b) => b - a);

  const formatCurrency = (val) =>
    `₱${(val || 0).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const filtered = useMemo(() => {
    return payrollRecords.filter((r) => {
      const emp = employees.find(e => e.id === r.employeeId);
      const fullName = emp ? `${emp.firstName} ${emp.lastName}`.toLowerCase() : '';
      const matchesSearch =
        fullName.includes(search.toLowerCase()) ||
        r.employeeId.toLowerCase().includes(search.toLowerCase());
      const matchesYear  = r.year === selectedYear;
      const matchesMonth = selectedMonth === 'All' || r.month === selectedMonth;
      return matchesSearch && matchesYear && matchesMonth;
    }).sort((a, b) => a.monthIndex - b.monthIndex);
  }, [search, selectedYear, selectedMonth]);

  const totals = useMemo(() => {
    return filtered.reduce((acc, r) => ({
      basicPay:   acc.basicPay   + (r.basicPay || 0),
      deminimis:  acc.deminimis  + (r.deminimis || 0),
      sss:        acc.sss        + (r.sssEE  || 0),
      philHealth: acc.philHealth + (r.phEE   || 0),
      pagIbig:    acc.pagIbig    + (r.hdmfEE || 0),
      erSss:      acc.erSss      + (r.sssER || 0),
      erPh:       acc.erPh       + (r.phER || 0),
      erHdmf:     acc.erHdmf     + (r.hdmfER || 0),
      tax:        acc.tax        + (r.tax    || 0),
      netPay:     acc.netPay     + (r.netPay || 0),
    }), { basicPay: 0, deminimis: 0, sss: 0, philHealth: 0, pagIbig: 0, erSss: 0, erPh: 0, erHdmf: 0, tax: 0, netPay: 0 });
  }, [filtered]);

  const handleChangePage = (_, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); };

  const pagedData = useMemo(
    () => filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [filtered, page, rowsPerPage]
  );

  // Export helpers
  const exportRows = () => filtered.map(r => {
    const emp = employees.find(e => e.id === r.employeeId);
    return [
      r.employeeId, emp ? `${emp.firstName} ${emp.lastName}` : '---', r.month, r.basicPay, r.deminimis || 0,
      r.tax, r.sssEE || 0, r.sssER || 0, r.phEE || 0, r.phER || 0, r.hdmfEE || 0, r.hdmfER || 0,
      r.netPay, r.status
    ];
  });
  const exportHeaders = [
    'Employee ID','Employee','Month','Basic Pay','De Minimis','Tax',
    'SSS (EE)','SSS (ER)','PhilHealth (EE)','PhilHealth (ER)','HDMF (EE)','HDMF (ER)',
    'Net Pay','Status'
  ];
  const exportTitle   = `Payroll History ${selectedYear}${selectedMonth !== 'All' ? ` – ${selectedMonth}` : ''}`;

  return (
    <Box className="page-container">

      {/* ── Page Header ──────────────────────────────────────────────────── */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{
            fontWeight: 800,
            background: `linear-gradient(135deg, ${NAV} 0%, ${IND} 55%, ${ROY} 100%)`,
            backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>
            Payroll History
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
            {selectedMonth !== 'All' ? `${selectedMonth} ${selectedYear}` : `Full Year ${selectedYear}`} • {filtered.length} records
          </Typography>
        </Box>

        <Stack direction="row" spacing={1} alignItems="center">
          <Chip
            label={`${filtered.length} records`}
            sx={{ bgcolor: `rgba(2,65,251,0.08)`, color: IND, fontWeight: 700, border: `1px solid rgba(2,65,251,0.15)` }}
          />
          <Button size="small" variant="outlined" startIcon={<CsvIcon />}
            onClick={() => exportToCSV(exportHeaders, exportRows(), `payroll_history_${selectedYear}`)}
            sx={{ borderRadius: 2, fontSize: '0.75rem', borderColor: IND, color: IND, '&:hover': { bgcolor: `rgba(2,65,251,0.06)` } }}>
            CSV
          </Button>
          <Button size="small" variant="outlined" startIcon={<PdfIcon />}
            onClick={() => exportToPDF(exportTitle, exportHeaders, exportRows())}
            sx={{ borderRadius: 2, fontSize: '0.75rem', borderColor: IND, color: IND, '&:hover': { bgcolor: `rgba(2,65,251,0.06)` } }}>
            PDF
          </Button>
          <Button size="small" variant="outlined" startIcon={<PrintIcon />}
            onClick={() => printTable(exportTitle, exportHeaders, exportRows())}
            sx={{ borderRadius: 2, fontSize: '0.75rem', borderColor: IND, color: IND, '&:hover': { bgcolor: `rgba(2,65,251,0.06)` } }}>
            Print
          </Button>
        </Stack>
      </Box>

      {/* ── Summary Stat Cards ───────────────────────────────────────────── */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        {[
          {
            label: 'Total Gross Pay',
            value: formatCurrency(totals.basicPay),
            icon: <WalletIcon />,
            gradient: `linear-gradient(135deg, ${NAV} 0%, ${IND} 60%, ${ROY} 100%)`,
          },
          {
            label: 'Total Deductions',
            value: formatCurrency(totals.sss + totals.philHealth + totals.pagIbig),
            icon: <DeductionIcon />,
            gradient: `linear-gradient(135deg, #7d1515 0%, #c0392b 60%, #e74c3c 100%)`,
          },
          {
            label: 'Total Tax Withheld',
            value: formatCurrency(totals.tax),
            icon: <TaxIcon />,
            gradient: `linear-gradient(135deg, #7c5200 0%, ${goldAccent} 60%, #e8c96a 100%)`,
          },
          {
            label: 'Total Net Pay',
            value: formatCurrency(totals.netPay),
            icon: <NetPayIcon />,
            gradient: `linear-gradient(135deg, #1a4a00 0%, #2e7d32 60%, #4caf50 100%)`,
          },
        ].map((stat, i) => (
          <Grid item xs={12} sm={6} lg={3} key={i}>
            <Card sx={{
              borderRadius: 3,
              background: stat.gradient,
              boxShadow: '0 4px 20px rgba(5,7,126,0.18)',
              transition: 'transform 0.2s',
              '&:hover': { transform: 'translateY(-3px)', boxShadow: '0 8px 24px rgba(5,7,126,0.22)' },
            }}>
              <CardContent sx={{ p: 2.5, display: 'flex', alignItems: 'center', gap: 2, '&:last-child': { pb: 2.5 } }}>
                <Avatar sx={{
                  bgcolor: 'rgba(253,253,252,0.15)', color: WHT,
                  backdropFilter: 'blur(8px)', border: '1px solid rgba(253,253,252,0.2)',
                  width: 44, height: 44,
                }}>
                  {stat.icon}
                </Avatar>
                <Box>
                  <Typography variant="caption" sx={{ color: 'rgba(253,253,252,0.72)', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.68rem', letterSpacing: '0.04em', display: 'block' }}>
                    {stat.label}
                  </Typography>
                  <Typography variant="subtitle1" sx={{ color: WHT, fontWeight: 800, fontSize: '1rem', lineHeight: 1.2 }}>
                    {stat.value}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* ── Filters Card ─────────────────────────────────────────────────── */}
      <Card sx={{
        borderRadius: 3, 
        mb: 4, 
        boxShadow: '0 8px 32px rgba(5,7,126,0.22)',
        background: 'linear-gradient(160deg, #05077E 0%, #0241FB 55%, #4470ED 80%, #B4B7D3 100%)',
        borderTop: '3px solid #d4a843',
        color: '#ffffff'
      }}>
        <CardContent sx={{ p: 2.5 }}>
          <Grid container spacing={2} alignItems="center">
            {/* Search */}
            <Grid item xs={12} md={5}>
              <TextField
                fullWidth size="small"
                placeholder="Search by employee name or ID…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: IND, fontSize: '1.1rem' }} />
                    </InputAdornment>
                  ),
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

            {/* Fiscal Year */}
            <Grid item xs={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel sx={{ color: 'rgba(255,255,255,0.7)', '&.Mui-focused': { color: 'white' } }}>Fiscal Year</InputLabel>
                <Select
                  value={selectedYear}
                  label="Fiscal Year"
                  onChange={(e) => { setSelectedYear(e.target.value); setPage(0); }}
                   sx={{
                    borderRadius: 2,
                    color:'#fff',
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: `rgba(5,7,126,0.18)` },
                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: ROY },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'white' },
                    '& .MuiSvgIcon-root': { color: 'white' } 
                  }}
                >
                  {years.map((y) => <MenuItem key={y} value={y}>{y}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>

            {/* Month Filter — NEW */}
            <Grid item xs={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel sx={{ color: 'rgba(255,255,255,0.7)', '&.Mui-focused': { color: 'white' } }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <CalendarIcon sx={{ fontSize: '1rem' }} /> Month
                  </Box>
                </InputLabel>
                <Select
                  value={selectedMonth}
                  label="Month"
                  onChange={(e) => { setSelectedMonth(e.target.value); setPage(0); }}
                  sx={{
                    borderRadius: 2,
                    color:'#fff',
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: `rgba(5,7,126,0.18)` },
                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: ROY },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'white' },
                    '& .MuiSvgIcon-root': { color: 'white' } 
                  }}
                >
                  <MenuItem value="All">All Months</MenuItem>
                  {MONTHS.map((m) => <MenuItem key={m} value={m}>{m}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>

            {/* Clear Filters */}
            <Grid item xs={12} md={1} sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
              {(search || selectedMonth !== 'All') && (
                <Button
                  size="small" variant="outlined"
                  onClick={() => { setSearch(''); setSelectedMonth('All'); setPage(0); }}
                   sx={{
                color: '#fff',           // text color white
                borderColor: '#fff',     // border white
                fontSize: '0.75rem',
                whiteSpace: 'nowrap',
                borderRadius: 2,
                transition: 'all 0.3s ease', // smooth hover
                '&:hover': {
                  color: '#fff',                // keep text white
                  borderColor: '#fff',          // keep border white
                  backgroundColor: 'rgba(255,255,255,0.1)', // subtle hover bg
                  transform: 'translateY(-3px)',            // float effect
                  boxShadow: '0 4px 20px rgba(0,0,0,0.3)',  // shadow on hover
                },
                }}
                >
                  Clear
                </Button>
              )}
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* ── History Table ─────────────────────────────────────────────────── */}
      <Card sx={{
        borderRadius: 3,
        background: WHT,
        boxShadow: `0 4px 24px rgba(5,7,126,0.08)`,
        overflow: 'hidden',
        borderTop: `3px solid ${goldAccent}`,
      }}>
        <CardContent sx={{ p: 0 }}>
          <TableContainer sx={{ backgroundColor: 'transparent', overflowX: 'auto' }}>
            <Table stickyHeader size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={tableHeaderStyle}>Employee ID</TableCell>
                  <TableCell sx={tableHeaderStyle}>Employee</TableCell>
                  <TableCell sx={tableHeaderStyle}>Month</TableCell>
                  <TableCell align="right" sx={tableHeaderStyle}>Basic Pay</TableCell>
                  <TableCell align="right" sx={tableHeaderStyle}>De Minimis</TableCell>
                  <TableCell align="right" sx={tableHeaderStyle}>Tax</TableCell>
                  <TableCell align="right" sx={tableHeaderStyle}>SSS (EE)</TableCell>
                  <TableCell align="right" sx={tableHeaderStyle}>SSS (ER)</TableCell>
                  <TableCell align="right" sx={tableHeaderStyle}>PhilHealth (EE)</TableCell>
                  <TableCell align="right" sx={tableHeaderStyle}>PhilHealth (ER)</TableCell>
                  <TableCell align="right" sx={tableHeaderStyle}>HDMF (EE)</TableCell>
                  <TableCell align="right" sx={tableHeaderStyle}>HDMF (ER)</TableCell>
                  <TableCell align="right" sx={tableHeaderStyle}>Net Pay</TableCell>
                  <TableCell align="center" sx={tableHeaderStyle}>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pagedData.map((r) => {
                  const emp = employees.find((e) => e.id === r.employeeId);
                  return (
                    <TableRow key={r.id} sx={{
                      '&:hover': { background: 'rgba(2,65,251,0.04)' },
                      '& td': { color: '#333', borderBottom: '1px solid rgba(5,7,126,0.06)', fontSize: '0.82rem', padding: '10px 8px' },
                    }}>
                      <TableCell sx={{ fontWeight: 700, color: `${NAV} !important` }}>{r.employeeId}</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: `#111 !important` }}>
                        {emp ? `${emp.firstName} ${emp.lastName}` : '---'}
                      </TableCell>
                      <TableCell>
                        <Chip label={r.month} size="small" sx={{
                          bgcolor: 'rgba(68,112,237,0.1)', color: ROY,
                          fontWeight: 700, fontSize: '0.7rem', height: 22,
                        }} />
                      </TableCell>
                      <TableCell align="right">{formatCurrency(r.basicPay)}</TableCell>
                      <TableCell align="right">{formatCurrency(r.deminimis || 0)}</TableCell>
                      <TableCell align="right" sx={{ color: '#d32f2f !important' }}>{formatCurrency(r.tax)}</TableCell>
                      <TableCell align="right" sx={{ color: '#d32f2f !important' }}>{formatCurrency(r.sssEE || 0)}</TableCell>
                      <TableCell align="right" sx={{ color: '#d32f2f !important' }}>{formatCurrency(r.sssER || 0)}</TableCell>
                      <TableCell align="right" sx={{ color: '#d32f2f !important' }}>{formatCurrency(r.phEE || 0)}</TableCell>
                      <TableCell align="right" sx={{ color: '#d32f2f !important' }}>{formatCurrency(r.phER || 0)}</TableCell>
                      <TableCell align="right" sx={{ color: '#d32f2f !important' }}>{formatCurrency(r.hdmfEE || 0)}</TableCell>
                      <TableCell align="right" sx={{ color: '#d32f2f !important' }}>{formatCurrency(r.hdmfER || 0)}</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 800, color: `${IND} !important` }}>{formatCurrency(r.netPay)}</TableCell>
                      <TableCell align="center">
                        <Chip
                          label={r.status}
                          size="small"
                          sx={{
                            bgcolor: 'rgba(46,125,50,0.1)', color: '#2e7d32',
                            fontWeight: 700, fontSize: '0.7rem', height: 22,
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={14} align="center" sx={{ py: 8, color: 'text.secondary', fontSize: '0.9rem' }}>
                      No payroll records found for the selected criteria.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <Box sx={{ borderTop: '1px solid rgba(5,7,126,0.08)' }}>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filtered.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              sx={{ color: '#555', '& .MuiTablePagination-select': { color: '#333' }, '& .MuiIconButton-root': { color: NAV } }}
            />
          </Box>
        </CardContent>
      </Card>

      {/* ── Annual Totals Summary ─────────────────────────────────────────── */}
      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <Card sx={{
          minWidth: 370,
          borderRadius: 3,
          background: `linear-gradient(135deg, ${NAV} 0%, ${IND} 55%, ${ROY} 100%)`,
          boxShadow: '0 8px 28px rgba(5,7,126,0.30)',
          overflow: 'hidden',
          position: 'relative',
          '&::before': {
            content: '""', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
            background: `radial-gradient(circle at top right, ${goldAccent}15, transparent 50%)`,
          },
        }}>
          <CardContent sx={{ p: 3, position: 'relative', zIndex: 1, '&:last-child': { pb: 3 } }}>
            <Typography variant="subtitle2" sx={{
              fontWeight: 800, mb: 2.5, fontSize: '0.9rem',
              background: `linear-gradient(135deg, ${goldAccent}, #e8c96a)`,
              backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>
              {selectedMonth !== 'All' ? `${selectedMonth} ${selectedYear}` : `${selectedYear}`} — Totals Summary
            </Typography>
            {[
              { label: 'Total Gross Basic', value: formatCurrency(totals.basicPay), color: WHT },
              { label: 'Total De Minimis', value: formatCurrency(totals.deminimis), color: WHT },
              { label: 'Total EE Deductions', value: formatCurrency(totals.sss + totals.philHealth + totals.pagIbig), color: '#ff8a80' },
              { label: 'Total ER Deductions', value: formatCurrency(totals.erSss + totals.erPh + totals.erHdmf), color: '#ff8a80' },
              { label: 'Total Withholding Tax', value: formatCurrency(totals.tax), color: '#ff8a80' },
            ].map((row, i) => (
              <Box key={i} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                <Typography variant="body2" sx={{ color: 'rgba(253,253,252,0.65)', fontSize: '0.82rem' }}>{row.label}:</Typography>
                <Typography variant="body2" sx={{ fontWeight: 700, color: row.color, fontSize: '0.82rem' }}>{row.value}</Typography>
              </Box>
            ))}
            <Divider sx={{ my: 2, borderColor: 'rgba(253,253,252,0.15)' }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6" sx={{ fontWeight: 800, color: WHT, fontSize: '0.95rem' }}>Total Net Pay:</Typography>
              <Typography variant="h5" sx={{ fontWeight: 900, color: '#69f0ae', fontSize: '1.25rem' }}>
                {formatCurrency(totals.netPay)}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
