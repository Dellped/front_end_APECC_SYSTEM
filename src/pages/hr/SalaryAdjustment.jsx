import React, { useState, useRef } from 'react';
import {
  Box, Card, CardContent, Typography, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, IconButton, Grid, TextField,
  Button, Paper, Stack, MenuItem, Select, FormControl, InputLabel,
  InputAdornment, Chip, Divider, Tooltip, Avatar,
  Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import {
  Search as SearchIcon,
  Visibility as ViewIcon,
  TrendingUp as AdjustmentIcon,
  FileDownload as CsvIcon,
  PictureAsPdf as PdfIcon,
  Print as PrintIcon,
} from '@mui/icons-material';
import { exportToCSV, printTable, exportToPDF } from '../../utils/exportUtils';
import * as XLSX from 'xlsx';
import { CloudUpload as UploadIcon } from '@mui/icons-material';

const apeccBlue = '#023DFB';

const headerStyle = {
  bgcolor: apeccBlue,
  color: '#fff',
  fontWeight: 700,
  fontSize: '0.75rem',
  padding: '12px 16px',
  textTransform: 'uppercase'
};

const mockAdjustments = [
  { id: 1, empId: 'EMP001', name: 'Juan Dela Cruz', currentSalary: 25000, type: 'Increase', newSalary: 27000, date: '2026-03-01' },
  { id: 2, empId: 'EMP002', name: 'Maria Santos', currentSalary: 28000, type: 'Promotion', newSalary: 32000, date: '2026-02-01' },
];

export default function SalaryAdjustment() {
  const [data, setData] = useState(mockAdjustments);
  const [search, setSearch] = useState('');
  const [selectedAdjustment, setSelectedAdjustment] = useState(null);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [formData, setFormData] = useState({
    name: 'Juan Dela Cruz',
    currentSalary: 25000,
    type: 'Increase',
    amount: '',
    reason: '',
    date: ''
  });
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
        empId: row['Employee ID'] || row['empId'] || '',
        name: row['Employee'] || row['name'] || '',
        currentSalary: parseFloat(row['Current Salary'] || row['currentSalary'] || 0),
        type: row['Adjustment Type'] || row['type'] || 'Increase',
        newSalary: parseFloat(row['New Salary'] || row['newSalary'] || 0),
        date: row['Effective Date'] || row['date'] || new Date().toISOString().split('T')[0],
      }));

      setData(prev => [...prev, ...newAdjustments]);
    };
    reader.readAsBinaryString(file);
    e.target.value = '';
  };

  // Compute new salary inline instead of using useEffect to avoid potential loop
  const computeNewSalary = () => {
    const amount = parseFloat(formData.amount) || 0;
    const current = formData.currentSalary;
    if (formData.type === 'Increase' || formData.type === 'Promotion') {
      return current + amount;
    } else if (formData.type === 'Decrease') {
      return current - amount;
    }
    return current;
  };

  const newSalaryComputed = computeNewSalary();

  const filteredData = data.filter(item => 
    item.name.toLowerCase().includes(search.toLowerCase()) ||
    item.empId.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenView = (row) => {
    setSelectedAdjustment(row);
    setOpenViewDialog(true);
  };

  return (
    <Box sx={{ p: 4, bgcolor: '#f4f7fe', minHeight: '100%' }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, color: apeccBlue, mt: 1 }}>
          Salary Adjustment
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* Adjustment Table */}
        <Grid item xs={12} lg={7}>
          <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.05)', mb: 4 }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <TextField 
                fullWidth size="small" 
                placeholder="Search Employee..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                sx={{ mb: 0, mr: 2 }}
                InputProps={{ startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} /> }}
              />
              <Stack direction="row" spacing={1} sx={{ flexShrink: 0 }}>
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
                  onClick={() => exportToCSV(['Employee ID','Employee','Adjustment Type','New Salary','Effective Date'], filteredData.map(r => [r.empId, r.name, r.type, r.newSalary, r.date]), 'salary_adjustments')}
                  sx={{ borderRadius: 2, fontSize: '0.75rem' }}>CSV</Button>
                <Button size="small" variant="outlined" startIcon={<PdfIcon />}
                  onClick={() => exportToPDF('Salary Adjustments', ['Employee ID','Employee','Adjustment Type','New Salary','Effective Date'], filteredData.map(r => [r.empId, r.name, r.type, r.newSalary, r.date]))}
                  sx={{ borderRadius: 2, fontSize: '0.75rem' }}>PDF</Button>
                <Button size="small" variant="outlined" startIcon={<PrintIcon />}
                  onClick={() => printTable('Salary Adjustments', ['Employee ID','Employee','Adjustment Type','New Salary','Effective Date'], filteredData.map(r => [r.empId, r.name, r.type, r.newSalary, r.date]))}
                  sx={{ borderRadius: 2, fontSize: '0.75rem' }}>Print</Button>
              </Stack>
            </Box>
              <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 'none', border: '1px solid #eee' }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={headerStyle}>Employee ID</TableCell>
                      <TableCell sx={headerStyle}>Employee</TableCell>
                      <TableCell sx={headerStyle}>Adjustment Type</TableCell>
                      <TableCell sx={headerStyle}>New Salary</TableCell>
                      <TableCell sx={headerStyle}>Effective Date</TableCell>
                      <TableCell align="right" sx={headerStyle}>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredData.map((row) => (
                      <TableRow key={row.id} hover sx={{ '& td': { py: 1.5 } }}>
                        <TableCell sx={{ fontWeight: 600 }}>{row.empId}</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>{row.name}</TableCell>
                        <TableCell>
                          <Chip 
                            label={row.type} 
                            size="small" 
                            sx={{ 
                              bgcolor: row.type === 'Increase' ? 'rgba(76, 175, 80, 0.1)' : 'rgba(2, 61, 251, 0.1)',
                              color: row.type === 'Increase' ? '#2e7d32' : apeccBlue,
                              fontWeight: 700
                            }} 
                          />
                        </TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>₱{row.newSalary.toLocaleString()}</TableCell>
                        <TableCell>{row.date}</TableCell>
                        <TableCell align="right">
                          <Tooltip title="View Details">
                            <IconButton 
                              size="small" 
                              sx={{ color: apeccBlue }}
                              onClick={() => handleOpenView(row)}
                            >
                              <ViewIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Adjustment Form */}
        <Grid item xs={12} lg={5}>
          <Card sx={{ borderRadius: 3, boxShadow: '0 10px 40px rgba(0,0,0,0.1)', border: `1px solid ${apeccBlue}15` }}>
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                <Avatar sx={{ bgcolor: 'rgba(2, 61, 251, 0.1)', color: apeccBlue }}><AdjustmentIcon /></Avatar>
                <Typography variant="h6" sx={{ fontWeight: 800 }}>Adjustment Form</Typography>
              </Box>
              
              <Stack spacing={3}>
                <Box>
                  <Typography variant="body2" color="text.secondary">Selected Employee</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>{formData.name}</Typography>
                </Box>
                
                <Box sx={{ p: 2, bgcolor: '#f8f9fa', borderRadius: 2 }}>
                  <Typography variant="body2" color="text.secondary">Current Salary</Typography>
                  <Typography variant="h5" sx={{ fontWeight: 800, color: apeccBlue }}>₱{formData.currentSalary.toLocaleString()}</Typography>
                </Box>

                <FormControl fullWidth variant="outlined">
                  <InputLabel>Adjustment Type</InputLabel>
                  <Select 
                    value={formData.type} 
                    label="Adjustment Type"
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                  >
                    <MenuItem value="Increase">Salary Increase</MenuItem>
                    <MenuItem value="Promotion">Promotion</MenuItem>
                    <MenuItem value="Decrease">Salary Decrease</MenuItem>
                  </Select>
                </FormControl>

                <TextField 
                  label="Adjustment Amount" 
                  fullWidth 
                  value={formData.amount}
                  onChange={(e) => setFormData({...formData, amount: e.target.value})}
                  InputProps={{ startAdornment: <InputAdornment position="start">₱</InputAdornment> }}
                />

                <Box sx={{ p: 2, bgcolor: 'rgba(2, 61, 251, 0.05)', borderRadius: 2, border: `1px dashed ${apeccBlue}40` }}>
                  <Typography variant="body2" color="text.secondary">Computed New Salary</Typography>
                  <Typography variant="h5" sx={{ fontWeight: 800, color: apeccBlue }}>₱{newSalaryComputed.toLocaleString()}</Typography>
                </Box>

                <TextField 
                  label="Reason / Remarks" 
                  fullWidth multiline rows={2}
                  value={formData.reason}
                  onChange={(e) => setFormData({...formData, reason: e.target.value})}
                />

                <TextField 
                  label="Effective Date" 
                  type="date" 
                  fullWidth 
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  InputLabelProps={{ shrink: true }}
                />

                <Button 
                  variant="contained" 
                  size="large" 
                  fullWidth
                  sx={{ bgcolor: apeccBlue, py: 1.5, fontWeight: 700, borderRadius: 2 }}
                >
                  Submit Adjustment
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* View Details Dialog */}
      <Dialog 
        open={openViewDialog} 
        onClose={() => setOpenViewDialog(false)}
        PaperProps={{ sx: { borderRadius: 3, minWidth: 400 } }}
      >
        <DialogTitle sx={{ fontWeight: 800, color: apeccBlue }}>Adjustment Details</DialogTitle>
        <DialogContent dividers>
          {selectedAdjustment && (
            <Stack spacing={2} sx={{ py: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="caption" color="text.secondary">Employee</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 700 }}>{selectedAdjustment.name}</Typography>
                </Box>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography variant="caption" color="text.secondary">Employee ID</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{selectedAdjustment.empId}</Typography>
                </Box>
              </Box>
              <Divider />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="caption" color="text.secondary">Current Salary</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>₱{selectedAdjustment.currentSalary.toLocaleString()}</Typography>
                </Box>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography variant="caption" color="text.secondary">New Salary</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 800, color: apeccBlue }}>₱{selectedAdjustment.newSalary.toLocaleString()}</Typography>
                </Box>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">Adjustment Type</Typography>
                <Box sx={{ mt: 0.5 }}>
                  <Chip 
                    label={selectedAdjustment.type} 
                    size="small" 
                    sx={{ fontWeight: 700, bgcolor: 'rgba(2, 61, 251, 0.1)', color: apeccBlue }} 
                  />
                </Box>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">Effective Date</Typography>
                <Typography variant="body1">{selectedAdjustment.date}</Typography>
              </Box>
            </Stack>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpenViewDialog(false)} variant="contained" sx={{ bgcolor: apeccBlue }}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
