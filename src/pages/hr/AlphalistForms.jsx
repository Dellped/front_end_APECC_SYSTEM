import React from 'react';
import {
  Box, Card, CardContent, Typography, Grid, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Button, Chip, Avatar, TextField,
  InputAdornment, Paper
} from '@mui/material';
import { Download as DownloadIcon, Description as FormIcon, Print as PrintIcon, PictureAsPdf as PdfIcon, Search as SearchIcon, FileDownload as CsvIcon } from '@mui/icons-material';
import { employees, payrollRecords } from '../../data/mockData';
import { exportToCSV, printTable, exportToPDF, exportToExcel } from '../../utils/exportUtils';

const goldAccent = '#d4a843';
const formatCurrency = (val) => `₱${val.toLocaleString('en-PH', { minimumFractionDigits: 2 })}`;

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

const cellStyle = {
  fontSize: '0.7rem',
  padding: '4px 2px',
  border: '1px solid #eee'
};

export default function AlphalistForms() {
  const [search, setSearch] = React.useState('');
  
  const activeEmps = employees.filter((e) => {
    const isActive = e.status === 'Active';
    const matchesSearch = `${e.firstName} ${e.lastName} ${e.id}`.toLowerCase().includes(search.toLowerCase());
    return isActive && matchesSearch;
  });

  const alphalistData = activeEmps.map((emp) => {
    const records = payrollRecords.filter((r) => r.employeeId === emp.id && r.year === 2024);
    const totalGross = records.reduce((s, r) => s + r.basicPay, 0);
    const totalSSS = records.reduce((s, r) => s + (r.sssEE || 0), 0);
    const totalPhilHealth = records.reduce((s, r) => s + (r.phEE || 0), 0);
    const totalPagIbig = records.reduce((s, r) => s + (r.hdmfEE || 0), 0);
    const totalTax = records.reduce((s, r) => s + r.tax, 0);
    const totalNet = records.reduce((s, r) => s + r.netPay, 0);
    return { ...emp, totalGross, totalSSS, totalPhilHealth, totalPagIbig, totalTax, totalNet };
  });

  return (
    <Box className="page-container">


      {/* Quick Actions & Search */}
      <Grid container spacing={2.5} sx={{ mb: 4 }}>
        {[
          { 
            title: 'Generate Alphalist', 
            desc: 'Annual list of employees with compensation and tax data', 
            icon: <FormIcon />, 
            gradient: 'linear-gradient(135deg, #023DFB, #4a75e6)',
            onClick: () => exportToExcel(['#','Employee Name','Annual Gross','SSS','PhilHealth','Pag-IBIG','Tax Withheld','Net Compensation'], alphalistData.map((e, i) => [i+1, `${e.lastName}, ${e.firstName}`, e.totalGross, e.totalSSS, e.totalPhilHealth, e.totalPagIbig, e.totalTax, e.totalNet]), 'alphalist_forms')
          },
          { 
            title: 'BIR Form 2306', 
            desc: 'Certificate of Creditable Tax Withheld at Source', 
            icon: <FormIcon />, 
            gradient: 'linear-gradient(135deg, #8b1a1a, #c0392b)',
            onClick: () => exportToPDF('BIR Alphalist Forms', ['#','Employee Name','Annual Gross','SSS','PhilHealth','Pag-IBIG','Tax Withheld','Net Compensation'], alphalistData.map((e, i) => [i+1, `${e.lastName}, ${e.firstName}`, e.totalGross, e.totalSSS, e.totalPhilHealth, e.totalPagIbig, e.totalTax, e.totalNet]))
          },
        ].map((action, i) => (
          <Grid item xs={12} sm={6} key={i}>
            <Card onClick={action.onClick} className="stat-card" sx={{ borderRadius: 3, cursor: 'pointer', background: action.gradient, boxShadow: '0 4px 20px rgba(13,27,62,0.25)', '&:hover': { opacity: 0.9, transform: 'translateY(-2px)', transition: 'all 0.2s' } }}>
              <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 }, display: 'flex', gap: 2, alignItems: 'center' }}>
                <Avatar sx={{ width: 48, height: 48, bgcolor: 'rgba(255,255,255,0.15)', color: '#fff', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.2)' }}>
                  {action.icon}
                </Avatar>
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#fff' }}>{action.title}</Typography>
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.72rem' }}>{action.desc}</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}


      </Grid>

      {/* Alphalist Table */}
      <Card sx={{
        borderRadius: 3,
        boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
      }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3.5, flexWrap: 'wrap', gap: 2 }}>
            <Box>
              <Typography variant="h6" sx={{
                fontWeight: 700, fontSize: '1.1rem', color: '#023DFB',
              }}>
                BIR Alphalist Forms
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                Generate and Export BIR-compliant reports for fiscal year {new Date().getFullYear()}
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
              <TextField
                size="small"
                placeholder="Search employee name or ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                sx={{ minWidth: 260 }}
              />
              <Button size="small" variant="outlined" startIcon={<CsvIcon />}
                onClick={() => exportToCSV(['#','Employee Name','Annual Gross','SSS','PhilHealth','Pag-IBIG','Tax Withheld','Net Compensation'], alphalistData.map((e, i) => [i+1, `${e.lastName}, ${e.firstName}`, e.totalGross, e.totalSSS, e.totalPhilHealth, e.totalPagIbig, e.totalTax, e.totalNet]), 'alphalist_forms')}
                sx={{ height: 40 }}>CSV</Button>
              <Button size="small" variant="outlined" startIcon={<PrintIcon />}
                onClick={() => printTable('BIR Alphalist Forms', ['#','Employee Name','Annual Gross','SSS','PhilHealth','Pag-IBIG','Tax Withheld','Net Compensation'], alphalistData.map((e, i) => [i+1, `${e.lastName}, ${e.firstName}`, e.totalGross, e.totalSSS, e.totalPhilHealth, e.totalPagIbig, e.totalTax, e.totalNet]))}
                sx={{ height: 40 }}>Print</Button>
              <Button size="small" variant="contained" startIcon={<PdfIcon />}
                onClick={() => exportToPDF('BIR Alphalist Forms', ['#','Employee Name','Annual Gross','SSS','PhilHealth','Pag-IBIG','Tax Withheld','Net Compensation'], alphalistData.map((e, i) => [i+1, `${e.lastName}, ${e.firstName}`, e.totalGross, e.totalSSS, e.totalPhilHealth, e.totalPagIbig, e.totalTax, e.totalNet]))}
                sx={{ bgcolor: '#023DFB', color: '#fff', fontWeight: 700, height: 40 }}>Download PDF</Button>
            </Box>
          </Box>
          <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: '0 10px 30px rgba(0,0,0,0.08)', overflowX: 'auto' }}>
            <Table stickyHeader size="small" sx={{ minWidth: 800 }}>
              <TableHead>
                <TableRow>
                  <TableCell sx={headerStyle}>#</TableCell>
                  <TableCell sx={headerStyle} align="left">Employee Name</TableCell>
                  <TableCell sx={{ ...headerStyle, textAlign: 'right' }}>Annual Gross</TableCell>
                  <TableCell sx={{ ...headerStyle, textAlign: 'right' }}>SSS</TableCell>
                  <TableCell sx={{ ...headerStyle, textAlign: 'right' }}>PhilHealth</TableCell>
                  <TableCell sx={{ ...headerStyle, textAlign: 'right' }}>Pag-IBIG</TableCell>
                  <TableCell sx={{ ...headerStyle, textAlign: 'right' }}>Tax Withheld</TableCell>
                  <TableCell sx={{ ...headerStyle, textAlign: 'right' }}>Net Compensation</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {alphalistData.map((e, i) => (
                  <TableRow key={e.id} hover>
                    <TableCell sx={{ ...cellStyle, textAlign: 'center' }}>{i + 1}</TableCell>
                    <TableCell sx={{ ...cellStyle, fontWeight: 700 }}>{e.lastName}, {e.firstName} {e.middleName ? e.middleName[0] + '.' : ''}</TableCell>
                    <TableCell sx={{ ...cellStyle, textAlign: 'right' }}>{formatCurrency(e.totalGross)}</TableCell>
                    <TableCell sx={{ ...cellStyle, textAlign: 'right' }}>{formatCurrency(e.totalSSS)}</TableCell>
                    <TableCell sx={{ ...cellStyle, textAlign: 'right' }}>{formatCurrency(e.totalPhilHealth)}</TableCell>
                    <TableCell sx={{ ...cellStyle, textAlign: 'right' }}>{formatCurrency(e.totalPagIbig)}</TableCell>
                    <TableCell sx={{ ...cellStyle, textAlign: 'right', color: '#d32f2f', fontWeight: 600 }}>{formatCurrency(e.totalTax)}</TableCell>
                    <TableCell sx={{ ...cellStyle, textAlign: 'right', color: '#023DFB', fontWeight: 800 }}>{formatCurrency(e.totalNet)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

    </Box>
  );
}
