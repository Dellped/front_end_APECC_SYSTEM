import React, { useState } from 'react';
import {
  Box, Card, CardContent, Typography, Grid, Button, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Paper, Chip,
  FormControl, InputLabel, Select, MenuItem, Stack, IconButton, Tooltip
} from '@mui/material';
import {
  Description as FormIcon,
  Download as DownloadIcon,
  Print as PrintIcon,
  Visibility as ViewIcon,
  Refresh as RefreshIcon,
  FileDownload as ExcelIcon,
  PictureAsPdf as PdfIcon
} from '@mui/icons-material';

const logoBlue = '#023DFB';
const goldAccent = '#d4a843';

export default function BIRForms() {
  const [year, setYear] = useState('2025');
  const [month, setMonth] = useState('March');

  const birForms = [
    { 
      id: '1601-C', 
      title: 'BIR Form 1601-C', 
      description: 'Monthly Remittance Return of Income Taxes Withheld on Compensation',
      frequency: 'Monthly',
      status: 'Generated',
      date: '2025-03-10'
    },
    { 
      id: '0619-C', 
      title: 'BIR Form 0619-C', 
      description: 'Monthly Remittance Form for Creditable Income Taxes Withheld',
      frequency: 'Monthly',
      status: 'Ready',
      date: '2025-03-12'
    },
    { 
      id: '1604-CF', 
      title: 'BIR Form 1604-CF', 
      description: 'Annual Information Return of Income Taxes Withheld on Compensation',
      frequency: 'Annual',
      status: 'Pending',
      date: '---'
    },
    { 
      id: '2316', 
      title: 'BIR Form 2316', 
      description: 'Certificate of Compensation Payment / Tax Withheld',
      frequency: 'Annual/Exit',
      status: 'Generated',
      date: '2025-01-15'
    }
  ];

  const headerStyle = {
    bgcolor: logoBlue,
    color: '#fff',
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
                  <Stack direction="row" spacing={1} justifyContent="flex-end">
                    <Tooltip title="View Preview">
                      <IconButton size="small" color="primary"><ViewIcon fontSize="small" /></IconButton>
                    </Tooltip>
                    <Tooltip title="Download PDF">
                      <IconButton size="small" sx={{ color: '#d32f2f' }}><PdfIcon fontSize="small" /></IconButton>
                    </Tooltip>
                    <Tooltip title="Export Excel">
                      <IconButton size="small" sx={{ color: '#2e7d32' }}><ExcelIcon fontSize="small" /></IconButton>
                    </Tooltip>
                    <Tooltip title="Print">
                      <IconButton size="small"><PrintIcon fontSize="small" /></IconButton>
                    </Tooltip>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

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
