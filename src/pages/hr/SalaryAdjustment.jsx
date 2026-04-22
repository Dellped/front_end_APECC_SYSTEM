import React, { useState, useRef } from 'react';
import {
  Box, Card, CardContent, Typography, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, IconButton, Grid, TextField,
  Button, Paper, Stack, MenuItem, Select, FormControl, InputLabel,
  InputAdornment, Chip, Divider, Tooltip, Avatar,
  Dialog, DialogTitle, DialogContent, DialogActions, Autocomplete
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
import { JOB_LEVELS, EMPLOYMENT_STATUSES, employees } from '../../data/mockData';

const apeccBlue = '#0241FB';
const goldAccent = '#d4a843';

const headerStyle = {
  bgcolor: apeccBlue,
  color: '#FDFDFC',
  fontWeight: 700,
  fontSize: '0.75rem',
  padding: '12px 16px',
  textTransform: 'uppercase'
};

const mockAdjustments = [
  { id: 1, empId: '0001', name: 'Juan Dela Cruz', currentSalary: 25000, type: 'Increase', newSalary: 27000, date: '2026-03-01' },
  { id: 2, empId: '0002', name: 'Maria Santos', currentSalary: 28000, type: 'Promotion', newSalary: 32000, date: '2026-02-01' },
];

export default function SalaryAdjustment() {
  const [data, setData] = useState(mockAdjustments);
  const [search, setSearch] = useState('');
  const [selectedAdjustment, setSelectedAdjustment] = useState(null);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [formData, setFormData] = useState({
    empId: '',
    name: 'Juan Dela Cruz',
    currentSalary: 25000,
    currentJobLevel: 'Level 1 - Probationary',
    currentEmploymentType: 'Probationary',
    type: 'Increase',
    amount: '',
    newJobLevel: 'Level 1 - Probationary',
    newEmploymentType: 'Probationary',
    currentDeminimis: 0,
    newDeminimis: '',
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
    if (formData.type === 'Increase' || formData.type === 'Promotion' || formData.type === 'DOLE changes') {
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

      <Stack spacing={4}>
        {/* Adjustment Form (Landscape Layout) */}
        <Card sx={{ borderRadius: 3, boxShadow: '0 10px 40px rgba(0,0,0,0.1)', border: `1px solid ${apeccBlue}15`, width: '100%', borderTop: `3px solid ${goldAccent}` }}>
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                <Avatar sx={{ bgcolor: 'rgba(2, 61, 251, 0.1)', color: apeccBlue }}><AdjustmentIcon /></Avatar>
                <Typography variant="h6" sx={{ fontWeight: 800 }}>Adjustment / Promotion Form</Typography>
              </Box>
              
              <Box sx={{  p: 2.5, bgcolor: 'rgba(2, 61, 251, 0.03)', border: '1px solid rgba(2, 61, 251, 0.1)', borderRadius: 2, mb: 3 }}>
                <Grid container spacing={3} alignItems="center">
                  <Grid item xs={12} md={6}>
                    <Autocomplete
                      size="small"
                      forcePopupIcon={false}
                      options={employees}
                      getOptionLabel={(option) => `${option.firstName} ${option.lastName} (${option.id})`}
                      onChange={(e, newValue) => {
                        if (newValue) {
                          setFormData({
                            ...formData,
                            empId: newValue.id,
                            name: `${newValue.firstName} ${newValue.lastName}`,
                            currentSalary: newValue.payrollProfile?.basicSalary || 0,
                            currentJobLevel: newValue.employmentDetails?.jobLevel || '',
                            currentEmploymentType: newValue.employmentType || '',
                            newJobLevel: newValue.employmentDetails?.jobLevel || '',
                            newEmploymentType: newValue.employmentType || '',
                            currentDeminimis: newValue.payrollProfile?.deminimis || 0,
                          });
                        }
                      }}
                      renderInput={(params) => (
                        <TextField 
                          {...params} 
                          label="Search Employee *" 
                          placeholder="Type name or ID..."
                          InputLabelProps={{ shrink: true, sx: { fontWeight: 600 } }}
                          InputProps={{
                            ...params.InputProps,
                            startAdornment: (
                              <InputAdornment position="start">
                                <SearchIcon fontSize="small" sx={{ ml: 0.5, color: 'text.secondary' }} />
                              </InputAdornment>
                            ),
                          }}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <FormControl fullWidth size="small">
                      <InputLabel sx={{ fontWeight: 600 }}>Nature of Action *</InputLabel>
                      <Select 
                        value={formData.type} 
                        label="Nature of Action *"
                        onChange={(e) => setFormData({...formData, type: e.target.value})}
                        sx={{ fontWeight: 700, color: apeccBlue }}
                      >
                        <MenuItem value="Increase">Salary Increase</MenuItem>
                        <MenuItem value="Promotion">Promotion</MenuItem>
                        <MenuItem value="DOLE changes">DOLE changes</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <TextField 
                      size="small" label="Effective Date *" 
                      type="date" fullWidth
                      value={formData.date}
                      onChange={(e) => setFormData({...formData, date: e.target.value})}
                      InputLabelProps={{ shrink: true, sx: { fontWeight: 600 } }}
                      sx={{ '& .MuiInputBase-input': { fontWeight: 700 } }}
                    />
                  </Grid>
                </Grid>
              </Box>

              <Grid container spacing={4}>
                {/* Current Status Column */}
                <Grid item xs={12} md={6}>
                  <Box sx={{ px: 1 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 1, mb: 2, borderBottom: '2px solid #eee', pb: 1 }}>
                      Current Status
                    </Typography>
                    
                    <Stack spacing={3}>
                      <TextField 
                        size="small" select label="Current Job Level" 
                        fullWidth value={formData.currentJobLevel}
                        onChange={(e) => setFormData({...formData, currentJobLevel: e.target.value})}
                      >
                        {JOB_LEVELS.map(l => <MenuItem key={l} value={l}>{l}</MenuItem>)}
                      </TextField>
                      
                      <TextField 
                        size="small" select label="Current Employment Type" 
                        fullWidth value={formData.currentEmploymentType}
                        onChange={(e) => setFormData({...formData, currentEmploymentType: e.target.value})}
                      >
                        {EMPLOYMENT_STATUSES.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
                      </TextField>
                      
                      <Box sx={{ p: 2, bgcolor: '#f4f7fe', borderRadius: 2, border: '1px solid #e2e8f0' }}>
                        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase' }}>Current Basic Salary</Typography>
                        <Typography variant="h5" sx={{ fontWeight: 800, mt: 0.5, color: '#475569' }}>₱{formData.currentSalary.toLocaleString()}</Typography>

                        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase', mt: 2, display: 'block' }}>Current Deminimis</Typography>
                        <Typography variant="h6" sx={{ fontWeight: 800, mt: 0.5, color: '#475569' }}>₱{(formData.currentDeminimis || 0).toLocaleString()}</Typography>
                      </Box>
                    </Stack>
                  </Box>
                </Grid>

                {/* Proposed Status Column */}
                <Grid item xs={12} md={6}>
                  <Box sx={{ px: 1 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, color: apeccBlue, textTransform: 'uppercase', letterSpacing: 1, mb: 2, borderBottom: `2px solid ${apeccBlue}40`, pb: 1 }}>
                      Proposed Action / New Status
                    </Typography>
                    
                    <Stack spacing={3}>
                      <TextField 
                        size="small" select label="New Job Level" 
                        fullWidth value={formData.newJobLevel}
                        onChange={(e) => setFormData({...formData, newJobLevel: e.target.value})}
                      >
                        {JOB_LEVELS.map(l => <MenuItem key={"new-" + l} value={l}>{l}</MenuItem>)}
                      </TextField>

                      <TextField 
                        size="small" select label="New Employment Type" 
                        fullWidth value={formData.newEmploymentType}
                        onChange={(e) => setFormData({...formData, newEmploymentType: e.target.value})}
                      >
                        {EMPLOYMENT_STATUSES.map(s => <MenuItem key={"new-" + s} value={s}>{s}</MenuItem>)}
                      </TextField>

                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <TextField 
                            size="small" label="Salary Adjustment Amount" 
                            fullWidth 
                            value={formData.amount}
                            onChange={(e) => setFormData({...formData, amount: e.target.value})}
                            InputProps={{ startAdornment: <InputAdornment position="start">₱</InputAdornment> }}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField 
                            size="small" label="New Deminimis" 
                            fullWidth 
                            value={formData.newDeminimis}
                            onChange={(e) => setFormData({...formData, newDeminimis: e.target.value})}
                            InputProps={{ startAdornment: <InputAdornment position="start">₱</InputAdornment> }}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <Box sx={{ p: 1.5, bgcolor: 'rgba(76, 175, 80, 0.05)', borderRadius: 2, border: '1px solid rgba(76, 175, 80, 0.3)', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                            <Typography variant="caption" sx={{ color: '#2e7d32', fontWeight: 700, textTransform: 'uppercase', lineHeight: 1 }}>Computed New Salary</Typography>
                            <Typography variant="h6" sx={{ fontWeight: 800, color: '#1b5e20', mt: 0.5 }}>₱{newSalaryComputed.toLocaleString()}</Typography>
                          </Box>
                        </Grid>
                      </Grid>
                    </Stack>
                  </Box>
                </Grid>
              </Grid>

              <Divider sx={{ my: 4 }} />

              <Box sx={{ px: 1 }}>
                 <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 1, mb: 2 }}>
                    Justification / Remarks
                 </Typography>
                 <TextField 
                    size="small" placeholder="Enter formal justification for the promotion or salary adjustment..." 
                    fullWidth multiline rows={3}
                    value={formData.reason}
                    onChange={(e) => setFormData({...formData, reason: e.target.value})}
                    sx={{ bgcolor: '#fafafa' }}
                 />
              </Box>

              <Box sx={{ textAlign: 'right', mt: 4, px: 1 }}>
                  <Button variant="outlined" sx={{ mr: 2, fontWeight: 700, borderRadius: 2, px: 4, color: 'text.secondary', borderColor: '#ccc' }}>
                    Cancel
                  </Button>
                  <Button 
                    variant="contained" 
                    size="large" 
                    sx={{ bgcolor: apeccBlue, fontWeight: 700, borderRadius: 2, px: 6, py: 1.2, boxShadow: '0 4px 14px rgba(2, 61, 251, 0.3)' }}
                  >
                    Submit
                  </Button>
              </Box>
            </CardContent>
        </Card>

        {/* Adjustment Table */}
        <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.05)', mb: 4, width: '100%', borderTop: `3px solid ${goldAccent}` }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <TextField 
                fullWidth size="small" 
                placeholder="Search Employee..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                sx={{ mb: 0, mr: 2, maxWidth: 400 }}
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
      </Stack>

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
