import React, { useState } from 'react';
import {
  Box, Card, CardContent, Typography, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, IconButton, Grid, TextField,
  Button, Paper, Stack, MenuItem, Select, FormControl, InputLabel,
  Dialog, DialogTitle, DialogContent, DialogActions, RadioGroup,
  FormControlLabel, Radio, InputAdornment, Tooltip, Chip
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Add as AddIcon,
  Edit as EditIcon,
  FileDownload as CsvIcon,
  PictureAsPdf as PdfIcon,
  Print as PrintIcon,
} from '@mui/icons-material';
import { exportToCSV, printTable, exportToPDF } from '../../utils/exportUtils';

const apeccBlue = '#023DFB';

const headerStyle = {
  bgcolor: apeccBlue,
  color: '#fff',
  fontWeight: 700,
  fontSize: '0.75rem',
  padding: '12px 16px',
  textTransform: 'uppercase'
};

const mockAssignments = [
  { id: 'EMP001', name: 'Juan Dela Cruz', position: 'Accountant', payType: 'Monthly', basicPay: 25000, effectiveDate: '2026-01-01' },
  { id: 'EMP002', name: 'Maria Santos', position: 'HR Officer', payType: 'Monthly', basicPay: 28000, effectiveDate: '2026-01-01' },
];

export default function BasicPayAssignment() {
  const [data, setData] = useState(mockAssignments);
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingRow, setEditingRow] = useState(null);
  const [formData, setFormData] = useState({
    employeeId: '',
    payType: 'Monthly',
    basicPay: '',
    effectiveDate: ''
  });

  const filteredData = data.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) || 
                          item.id.toLowerCase().includes(search.toLowerCase());
    const matchesDept = deptFilter === 'All' || item.position.includes(deptFilter); // Simplified dept check
    return matchesSearch && matchesDept;
  });

  const handleOpenDialog = (row = null) => {
    if (row) {
      setEditingRow(row);
      setFormData({
        employeeId: row.id,
        payType: row.payType,
        basicPay: row.basicPay,
        effectiveDate: row.effectiveDate
      });
    } else {
      setEditingRow(null);
      setFormData({ employeeId: '', payType: 'Monthly', basicPay: '', effectiveDate: '' });
    }
    setOpenDialog(true);
  };

  const handleSave = () => {
    // Implementation logic for saving
    setOpenDialog(false);
  };

  return (
    <Box sx={{ p: 4, bgcolor: '#f4f7fe', minHeight: '100%' }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, color: apeccBlue, mt: 1 }}>
          Basic Pay Assignment
        </Typography>
      </Box>

      <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.05)', mb: 4 }}>
        <CardContent sx={{ p: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField 
                fullWidth size="small" 
                placeholder="Search Employee..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                InputProps={{ startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} /> }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Department Filter</InputLabel>
                <Select 
                  label="Department Filter" 
                  value={deptFilter}
                  onChange={(e) => setDeptFilter(e.target.value)}
                >
                  <MenuItem value="All">All Departments</MenuItem>
                  <MenuItem value="Accountant">Accountant</MenuItem>
                  <MenuItem value="HR">HR</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={5} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, flexWrap: 'wrap' }}>
              <Button size="small" variant="outlined" startIcon={<CsvIcon />}
                onClick={() => exportToCSV(['Employee ID','Name','Position','Pay Type','Basic Pay','Effective Date'], filteredData.map(r => [r.id, r.name, r.position, r.payType, r.basicPay, r.effectiveDate]), 'basic_pay_assignment')}
                sx={{ borderRadius: 2, fontSize: '0.75rem' }}>CSV</Button>
              <Button size="small" variant="outlined" startIcon={<PdfIcon />}
                onClick={() => exportToPDF('Basic Pay Assignment', ['Employee ID','Name','Position','Pay Type','Basic Pay','Effective Date'], filteredData.map(r => [r.id, r.name, r.position, r.payType, r.basicPay, r.effectiveDate]))}
                sx={{ borderRadius: 2, fontSize: '0.75rem' }}>PDF</Button>
              <Button size="small" variant="outlined" startIcon={<PrintIcon />}
                onClick={() => printTable('Basic Pay Assignment', ['Employee ID','Name','Position','Pay Type','Basic Pay','Effective Date'], filteredData.map(r => [r.id, r.name, r.position, r.payType, r.basicPay, r.effectiveDate]))}
                sx={{ borderRadius: 2, fontSize: '0.75rem' }}>Print</Button>
              <Button 
                variant="contained" 
                startIcon={<AddIcon />} 
                onClick={() => handleOpenDialog()}
                sx={{ bgcolor: apeccBlue, fontWeight: 700 }}
              >
                Add New
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={headerStyle}>Employee ID</TableCell>
              <TableCell sx={headerStyle}>Name</TableCell>
              <TableCell sx={headerStyle}>Position</TableCell>
              <TableCell sx={headerStyle}>Pay Type</TableCell>
              <TableCell sx={headerStyle}>Basic Pay</TableCell>
              <TableCell sx={headerStyle}>Effective Date</TableCell>
              <TableCell align="right" sx={headerStyle}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData.map((row) => (
              <TableRow key={row.id} hover sx={{ '& td': { py: 2 } }}>
                <TableCell sx={{ fontWeight: 600 }}>{row.id}</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>{row.name}</TableCell>
                <TableCell>{row.position}</TableCell>
                <TableCell>
                   <Chip label={row.payType} size="small" sx={{ bgcolor: 'rgba(2, 61, 251, 0.05)', color: apeccBlue, fontWeight: 700 }} />
                </TableCell>
                <TableCell sx={{ fontWeight: 700 }}>₱{row.basicPay.toLocaleString()}</TableCell>
                <TableCell>{row.effectiveDate}</TableCell>
                <TableCell align="right">
                  <Tooltip title="Edit Pay Info">
                    <IconButton size="small" onClick={() => handleOpenDialog(row)} sx={{ color: apeccBlue }}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} PaperProps={{ sx: { borderRadius: 3, minWidth: 450 } }}>
        <DialogTitle sx={{ fontWeight: 800, color: apeccBlue }}>{editingRow ? 'Edit Basic Pay' : 'Assign Basic Pay'}</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Employee</InputLabel>
              <Select value={formData.employeeId} label="Employee">
                <MenuItem value="EMP001">Juan Dela Cruz</MenuItem>
                <MenuItem value="EMP002">Maria Santos</MenuItem>
              </Select>
            </FormControl>

            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 700 }}>Pay Type</Typography>
              <RadioGroup row value={formData.payType} onChange={(e) => setFormData({...formData, payType: e.target.value})}>
                <FormControlLabel value="Monthly" control={<Radio sx={{ color: apeccBlue, '&.Mui-checked': { color: apeccBlue } }} />} label="Monthly" />
                <FormControlLabel value="Daily" control={<Radio sx={{ color: apeccBlue, '&.Mui-checked': { color: apeccBlue } }} />} label="Daily" />
                <FormControlLabel value="Hourly" control={<Radio sx={{ color: apeccBlue, '&.Mui-checked': { color: apeccBlue } }} />} label="Hourly" />
              </RadioGroup>
            </Box>

            <TextField 
              label="Basic Pay" 
              fullWidth 
              value={formData.basicPay}
              InputProps={{ startAdornment: <InputAdornment position="start">₱</InputAdornment> }}
            />

            <TextField 
              label="Effective Date" 
              type="date" 
              fullWidth 
              value={formData.effectiveDate}
              InputLabelProps={{ shrink: true }}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpenDialog(false)} color="inherit">Cancel</Button>
          <Button variant="contained" onClick={handleSave} sx={{ bgcolor: apeccBlue }}>Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
