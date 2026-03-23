import React, { useState, useRef } from 'react';
import {
  Box, Card, CardContent, Typography, Grid, Button, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Chip, IconButton,
  Tooltip, TextField, InputAdornment, Dialog, DialogTitle, DialogContent,
  DialogActions, MenuItem, Avatar, Stack
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Rule as AdjustmentIcon,
  History as HistoryIcon,
  FileDownload as CsvIcon,
  PictureAsPdf as PdfIcon,
  Print as PrintIcon,
} from '@mui/icons-material';
import { employees, payrollAdjustments } from '../../data/mockData';
import { exportToCSV, printTable, exportToPDF } from '../../utils/exportUtils';
import * as XLSX from 'xlsx';
import { CloudUpload as UploadIcon } from '@mui/icons-material';

const goldAccent = '#d4a843';

export default function PayrollAdjustments() {
  const [data, setData] = useState(payrollAdjustments);
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const fileInputRef = useRef(null);

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const bstr = event.target.result;
      const wb = XLSX.read(bstr, { type: 'binary' });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const parsedData = XLSX.utils.sheet_to_json(ws);
      
      const newAdjustments = parsedData.map((row) => ({
        id: Date.now() + Math.random(),
        employeeId: row['Employee ID'] || row['employeeId'] || '',
        type: row['Adjustment Type'] || row['type'] || 'Salary Adjustment',
        amount: parseFloat(row['Amount'] || row['amount'] || 0),
        reason: row['Reason'] || row['reason'] || '',
        status: row['Status'] || row['status'] || 'Pending',
      }));

      setData(prev => [...prev, ...newAdjustments]);
    };
    reader.readAsBinaryString(file);
    e.target.value = '';
  };

  const getEmployeeName = (id) => {
    const emp = employees.find(e => e.id === id);
    return emp ? `${emp.firstName} ${emp.lastName}` : id;
  };

  const filtered = data.filter(a => 
    getEmployeeName(a.employeeId).toLowerCase().includes(search.toLowerCase()) ||
    a.type.toLowerCase().includes(search.toLowerCase())
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
            Payroll Adjustments
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
            Process manual corrections, retroactive pay, and one-time deductions
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
          New Adjustment
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Adjustments Table */}
        <Grid item xs={12}>
          <Card sx={{ borderRadius: 4, boxShadow: '0 12px 32px rgba(10,22,40,0.05)', overflow: 'hidden' }}>
            <Box sx={{ p: 3, borderBottom: '1px solid rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#023DFB' }}>Pending &amp; Recent Adjustments</Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
                <TextField
                  size="small"
                  placeholder="Search adjustments..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ color: 'text.disabled', fontSize: '1.1rem' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ width: 300 }}
                />
                <Stack direction="row" spacing={1}>
                  <input 
                    type="file" 
                    accept=".xlsx, .xls, .csv" 
                    hidden 
                    ref={fileInputRef} 
                    onChange={handleImport} 
                  />
                  <Button size="small" variant="outlined" startIcon={<UploadIcon />}
                    onClick={() => fileInputRef.current.click()}
                    sx={{ borderRadius: 2, fontSize: '0.75rem', borderColor: '#d4a843', color: '#d4a843', '&:hover': { borderColor: '#b08930', bgcolor: 'rgba(212,168,67,0.04)' } }}>
                    Import
                  </Button>
                  <Button size="small" variant="outlined" startIcon={<CsvIcon />}
                    onClick={() => exportToCSV(['Employee ID','Employee','Adjustment Type','Amount','Reason','Status'], filtered.map(a => [a.employeeId, getEmployeeName(a.employeeId), a.type, a.amount, a.reason, a.status]), 'payroll_adjustments')}
                    sx={{ borderRadius: 2, fontSize: '0.75rem' }}>CSV</Button>
                  <Button size="small" variant="outlined" startIcon={<PdfIcon />}
                    onClick={() => exportToPDF('Payroll Adjustments', ['Employee ID','Employee','Adjustment Type','Amount','Reason','Status'], filtered.map(a => [a.employeeId, getEmployeeName(a.employeeId), a.type, a.amount, a.reason, a.status]))}
                    sx={{ borderRadius: 2, fontSize: '0.75rem' }}>PDF</Button>
                  <Button size="small" variant="outlined" startIcon={<PrintIcon />}
                    onClick={() => printTable('Payroll Adjustments', ['Employee ID','Employee','Adjustment Type','Amount','Reason','Status'], filtered.map(a => [a.employeeId, getEmployeeName(a.employeeId), a.type, a.amount, a.reason, a.status]))}
                    sx={{ borderRadius: 2, fontSize: '0.75rem' }}>Print</Button>
                </Stack>
              </Box>
            </Box>
            <TableContainer>
              <Table>
                <TableHead sx={{ bgcolor: 'rgba(2, 61, 251, 0.02)' }}>
                  <TableRow>
                    {['Employee', 'Adjustment Type', 'Amount', 'Reason', 'Status', 'Actions'].map((h) => (
                      <TableCell key={h} sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.75rem', textTransform: 'uppercase' }}>{h}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filtered.map((adj) => (
                    <TableRow key={adj.id} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Avatar sx={{ width: 32, height: 32, bgcolor: goldAccent }}>{adj.employeeId.slice(1)}</Avatar>
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>{getEmployeeName(adj.employeeId)}</Typography>
                            <Typography variant="caption" sx={{ color: 'text.secondary' }}>{adj.employeeId}</Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>{adj.type}</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: adj.amount >= 0 ? '#2e7d32' : '#d32f2f' }}>
                        {adj.amount >= 0 ? '+' : ''}{adj.amount.toLocaleString()}
                      </TableCell>
                      <TableCell sx={{ maxWidth: 200, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {adj.reason}
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={adj.status} 
                          size="small" 
                          sx={{ 
                            bgcolor: adj.status === 'Approved' ? '#e8f5e9' : '#fff3e0', 
                            color: adj.status === 'Approved' ? '#2e7d32' : '#f57c00', 
                            fontWeight: 700, fontSize: '0.72rem' 
                          }} 
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                          <Tooltip title="View History"><IconButton size="small"><HistoryIcon sx={{ fontSize: '1.1rem' }} /></IconButton></Tooltip>
                          <IconButton size="small" sx={{ color: '#023DFB' }}><EditIcon sx={{ fontSize: '1.1rem' }} /></IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Grid>
      </Grid>

      {/* New Adjustment Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontWeight: 800, color: '#023DFB' }}>Create New Adjustment</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={3} sx={{ mt: 0.5 }}>
            <Grid item xs={12}>
              <TextField fullWidth select label="Select Employee">
                {employees.map(e => (
                  <MenuItem key={e.id} value={e.id}>{e.firstName} {e.lastName} ({e.id})</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth select label="Adjustment Type">
                <MenuItem value="Salary Adjustment">Salary Adjustment</MenuItem>
                <MenuItem value="Allowance Adjustment">Allowance Adjustment</MenuItem>
                <MenuItem value="Deduction Adjustment">Deduction Adjustment</MenuItem>
                <MenuItem value="Retroactive Pay">Retroactive Pay</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Amount" type="number" />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Reason / Remarks" multiline rows={3} placeholder="Provide details for the adjustment..." />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpen(false)} sx={{ color: 'text.secondary', fontWeight: 600 }}>Cancel</Button>
          <Button variant="contained" onClick={() => setOpen(false)} sx={{ background: 'linear-gradient(135deg, #023DFB, #4a75e6)', fontWeight: 700 }}>
            Submit Adjustment
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
