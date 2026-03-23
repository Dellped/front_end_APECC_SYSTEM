import React, { useState } from 'react';
import {
  Box, Card, CardContent, Typography, Grid, Button, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Chip, IconButton,
  Tooltip, TextField, InputAdornment, Dialog, DialogTitle, DialogContent,
  DialogActions, MenuItem, Stack
} from '@mui/material';
import {
  Add as AddIcon,
  CalendarMonth as CalendarIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Schedule as ScheduleIcon,
  FileDownload as CsvIcon,
  PictureAsPdf as PdfIcon,
  Print as PrintIcon,
} from '@mui/icons-material';
import { payrollPeriods } from '../../data/mockData';
import { exportToCSV, printTable, exportToPDF } from '../../utils/exportUtils';

const goldAccent = '#d4a843';

export default function PayrollPeriods() {
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Open': return { bg: '#e3f2fd', color: '#1976d2' };
      case 'Processing': return { bg: '#fff3e0', color: '#f57c00' };
      case 'Closed': return { bg: '#e8f5e9', color: '#2e7d32' };
      default: return { bg: '#f5f5f5', color: '#757575' };
    }
  };

  const filtered = payrollPeriods.filter(p => 
    p.id.toLowerCase().includes(search.toLowerCase()) ||
    p.type.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box className="page-container">
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" sx={{ 
            fontWeight: 800, color: '#023DFB', 
            background: 'linear-gradient(90deg, #023DFB, #4a75e6)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            mb: 0.5 
          }}>
            Payroll Period Management
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
            Create and maintain payroll cycles and cutoff schedules
          </Typography>
        </Box>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          onClick={() => setOpen(true)}
          sx={{ 
            borderRadius: 2, 
            background: 'linear-gradient(135deg, #023DFB, #4a75e6)',
            boxShadow: '0 4px 12px rgba(2, 61, 251, 0.2)',
            px: 3
          }}
        >
          New Period
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Quick Stats */}
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 4, bgcolor: '#023DFB', color: '#fff', p: 1 }}>
            <CardContent>
              <Typography variant="overline" sx={{ opacity: 0.8, fontWeight: 700 }}>Active Period</Typography>
              <Typography variant="h5" sx={{ fontWeight: 800, my: 1 }}>March 1-15, 2025</Typography>
              <Typography variant="body2" sx={{ color: goldAccent, fontWeight: 600 }}>1st Cutoff | Processing</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 4, border: '1px solid rgba(0,0,0,0.08)', p: 1 }}>
            <CardContent>
              <Typography variant="overline" sx={{ color: 'text.secondary', fontWeight: 700 }}>Next Cutoff</Typography>
              <Typography variant="h5" sx={{ fontWeight: 800, my: 1 }}>March 16-31, 2025</Typography>
              <Typography variant="body2" sx={{ color: '#1976d2', fontWeight: 600 }}>2nd Cutoff | Open</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 4, border: '1px solid rgba(0,0,0,0.08)', p: 1 }}>
            <CardContent>
              <Typography variant="overline" sx={{ color: 'text.secondary', fontWeight: 700 }}>Total Cycles (2025)</Typography>
              <Typography variant="h5" sx={{ fontWeight: 800, my: 1 }}>5 Cycles</Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600 }}>Last Closed: Feb 28, 2025</Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Periods Table */}
        <Grid item xs={12}>
          <Card sx={{ borderRadius: 4, boxShadow: '0 12px 32px rgba(10,22,40,0.05)', overflow: 'hidden' }}>
            <Box sx={{ p: 3, borderBottom: '1px solid rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#023DFB' }}>Payroll Schedules</Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
                <TextField
                  size="small"
                  placeholder="Search periods..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ color: 'text.disabled', fontSize: '1.1rem' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ width: 250 }}
                />
                <Button variant="outlined" startIcon={<FilterIcon />} size="small" sx={{ borderRadius: 2 }}>Filter</Button>
                <Stack direction="row" spacing={1}>
                  <Button size="small" variant="outlined" startIcon={<CsvIcon />}
                    onClick={() => exportToCSV(['Period ID','Start Date','End Date','Payroll Type','Status'], filtered.map(p => [p.id, p.startDate, p.endDate, p.type, p.status]), 'payroll_periods')}
                    sx={{ borderRadius: 2, fontSize: '0.75rem' }}>CSV</Button>
                  <Button size="small" variant="outlined" startIcon={<PdfIcon />}
                    onClick={() => exportToPDF('Payroll Periods', ['Period ID','Start Date','End Date','Payroll Type','Status'], filtered.map(p => [p.id, p.startDate, p.endDate, p.type, p.status]))}
                    sx={{ borderRadius: 2, fontSize: '0.75rem' }}>PDF</Button>
                  <Button size="small" variant="outlined" startIcon={<PrintIcon />}
                    onClick={() => printTable('Payroll Periods', ['Period ID','Start Date','End Date','Payroll Type','Status'], filtered.map(p => [p.id, p.startDate, p.endDate, p.type, p.status]))}
                    sx={{ borderRadius: 2, fontSize: '0.75rem' }}>Print</Button>
                </Stack>
              </Box>
            </Box>
            <TableContainer>
              <Table>
                <TableHead sx={{ bgcolor: 'rgba(2, 61, 251, 0.02)' }}>
                  <TableRow>
                    {['Period ID', 'Start Date', 'End Date', 'Payroll Type', 'Status', 'Actions'].map((h) => (
                      <TableCell key={h} sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.75rem', textTransform: 'uppercase' }}>{h}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filtered.map((period) => {
                    const statusStyle = getStatusColor(period.status);
                    return (
                      <TableRow key={period.id} hover>
                        <TableCell sx={{ fontWeight: 600, color: '#023DFB' }}>{period.id}</TableCell>
                        <TableCell>{period.startDate}</TableCell>
                        <TableCell>{period.endDate}</TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <CalendarIcon sx={{ fontSize: '1rem', color: 'text.secondary' }} />
                            <Typography variant="body2">{period.type}</Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={period.status} 
                            size="small" 
                            sx={{ 
                              bgcolor: statusStyle.bg, 
                              color: statusStyle.color, 
                              fontWeight: 700, 
                              fontSize: '0.72rem' 
                            }} 
                          />
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 0.5 }}>
                            <Tooltip title="Edit Period"><IconButton size="small" sx={{ color: '#023DFB' }}><EditIcon sx={{ fontSize: '1.1rem' }} /></IconButton></Tooltip>
                            <Tooltip title="Delete Period"><IconButton size="small" sx={{ color: '#d32f2f' }}><DeleteIcon sx={{ fontSize: '1.1rem' }} /></IconButton></Tooltip>
                          </Box>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Grid>
      </Grid>

      {/* New Period Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontWeight: 800, color: '#023DFB' }}>Create New Payroll Period</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={3} sx={{ mt: 0.5 }}>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Start Date" type="date" InputLabelProps={{ shrink: true }} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="End Date" type="date" InputLabelProps={{ shrink: true }} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth select label="Payroll Type" defaultValue="1st Cutoff">
                <MenuItem value="1st Cutoff">1st Cutoff (1-15)</MenuItem>
                <MenuItem value="2nd Cutoff">2nd Cutoff (16-30/31)</MenuItem>
                <MenuItem value="Monthly">Monthly</MenuItem>
                <MenuItem value="Special">Special / Bonus Run</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth select label="Status" defaultValue="Open">
                <MenuItem value="Open">Open</MenuItem>
                <MenuItem value="Processing">Processing</MenuItem>
                <MenuItem value="Closed">Closed</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpen(false)} sx={{ color: 'text.secondary', fontWeight: 600 }}>Cancel</Button>
          <Button variant="contained" onClick={() => setOpen(false)} sx={{ background: 'linear-gradient(135deg, #023DFB, #4a75e6)', fontWeight: 700 }}>
            Create Period
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
