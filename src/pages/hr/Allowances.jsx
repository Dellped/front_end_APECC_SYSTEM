import React, { useState } from 'react';
import {
  Box, Card, CardContent, Typography, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, IconButton, Grid, TextField,
  Button, Paper, Stack, MenuItem, Select, FormControl, InputLabel,
  InputAdornment, Chip, Tooltip, Dialog, DialogTitle, DialogContent, 
  DialogActions, Avatar, Divider
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  EmojiTransportation as TransportIcon,
  Fastfood as MealIcon,
  PhoneIphone as CommIcon,
  Warning as HazardIcon,
  Search as SearchIcon,
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

const mockAllowances = [
  { id: 1, empId: 'EMP001', name: 'Juan Dela Cruz', type: 'Transportation', amount: 2000, frequency: 'Monthly', status: 'Active', date: '2026-03-01' },
  { id: 2, empId: 'EMP002', name: 'Maria Santos', type: 'Meal', amount: 1500, frequency: 'Monthly', status: 'Active', date: '2026-02-01' },
];

export default function Allowances() {
  const [data, setData] = useState(mockAllowances);
  const [search, setSearch] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingRow, setEditingRow] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'Transportation',
    amount: '',
    frequency: 'Monthly',
    status: 'Active',
    date: ''
  });

  const filteredData = data.filter(item => 
    item.name.toLowerCase().includes(search.toLowerCase()) ||
    item.empId.toLowerCase().includes(search.toLowerCase()) ||
    item.type.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenDialog = (row = null) => {
    if (row) {
      setEditingRow(row);
      setFormData({ ...row, amount: row.amount.toString() });
    } else {
      setEditingRow(null);
      setFormData({ name: '', type: 'Transportation', amount: '', frequency: 'Monthly', status: 'Active', date: '' });
    }
    setOpenDialog(true);
  };

  const getIcon = (type) => {
    switch(type) {
      case 'Transportation': return <TransportIcon fontSize="small" />;
      case 'Meal': return <MealIcon fontSize="small" />;
      case 'Communication': return <CommIcon fontSize="small" />;
      case 'Hazard Pay': return <HazardIcon fontSize="small" />;
      default: return <AddIcon fontSize="small" />;
    }
  };

  return (
    <Box sx={{ p: 4, bgcolor: '#f4f7fe', minHeight: '100%' }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: apeccBlue, mt: 1 }}>
            Allowances
          </Typography>
        </Box>
        <Stack direction="row" spacing={1} alignItems="center">
          <Button size="small" variant="outlined" startIcon={<CsvIcon />}
            onClick={() => exportToCSV(['Employee ID','Employee','Allowance Type','Amount','Frequency','Status'], filteredData.map(r => [r.empId, r.name, r.type, r.amount, r.frequency, r.status]), 'allowances')}
            sx={{ borderRadius: 2, fontSize: '0.75rem' }}>CSV</Button>
          <Button size="small" variant="outlined" startIcon={<PdfIcon />}
            onClick={() => exportToPDF('Allowances', ['Employee ID','Employee','Allowance Type','Amount','Frequency','Status'], filteredData.map(r => [r.empId, r.name, r.type, r.amount, r.frequency, r.status]))}
            sx={{ borderRadius: 2, fontSize: '0.75rem' }}>PDF</Button>
          <Button size="small" variant="outlined" startIcon={<PrintIcon />}
            onClick={() => printTable('Allowances', ['Employee ID','Employee','Allowance Type','Amount','Frequency','Status'], filteredData.map(r => [r.empId, r.name, r.type, r.amount, r.frequency, r.status]))}
            sx={{ borderRadius: 2, fontSize: '0.75rem' }}>Print</Button>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />} 
            onClick={() => handleOpenDialog()}
            sx={{ bgcolor: apeccBlue, fontWeight: 700, borderRadius: 2 }}
          >
            Add Allowance
          </Button>
        </Stack>
      </Box>

      <Card sx={{ mb: 3, borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
        <CardContent sx={{ p: 2 }}>
          <TextField 
            fullWidth size="small" 
            placeholder="Search employee or allowance type..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: 'text.secondary' }} />
                </InputAdornment>
              ),
            }}
          />
        </CardContent>
      </Card>

      <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={headerStyle}>Employee ID</TableCell>
              <TableCell sx={headerStyle}>Employee</TableCell>
              <TableCell sx={headerStyle}>Allowance Type</TableCell>
              <TableCell sx={headerStyle}>Amount</TableCell>
              <TableCell sx={headerStyle}>Frequency</TableCell>
              <TableCell sx={headerStyle}>Status</TableCell>
              <TableCell align="right" sx={headerStyle}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData.map((row) => (
              <TableRow key={row.id} hover sx={{ '& td': { py: 2 } }}>
                <TableCell sx={{ fontWeight: 600 }}>{row.empId}</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>{row.name}</TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Avatar sx={{ width: 28, height: 28, bgcolor: 'rgba(2, 61, 251, 0.05)', color: apeccBlue }}>
                      {getIcon(row.type)}
                    </Avatar>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{row.type}</Typography>
                  </Stack>
                </TableCell>
                <TableCell sx={{ fontWeight: 700 }}>₱{row.amount.toLocaleString()}</TableCell>
                <TableCell>{row.frequency}</TableCell>
                <TableCell>
                   <Chip 
                    label={row.status} 
                    size="small" 
                    sx={{ 
                      bgcolor: row.status === 'Active' ? 'rgba(76, 175, 80, 0.1)' : 'rgba(0,0,0,0.05)',
                      color: row.status === 'Active' ? '#2e7d32' : '#666',
                      fontWeight: 700
                    }} 
                  />
                </TableCell>
                <TableCell align="right">
                  <Tooltip title="Edit Allowance">
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
        <DialogTitle sx={{ fontWeight: 800, color: apeccBlue }}>{editingRow ? 'Edit Allowance' : 'Add Allowance'}</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Employee</InputLabel>
              <Select value={formData.name} label="Employee" onChange={(e) => setFormData({...formData, name: e.target.value})}>
                 <MenuItem value="Juan Dela Cruz">Juan Dela Cruz</MenuItem>
                 <MenuItem value="Maria Santos">Maria Santos</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth variant="outlined">
              <InputLabel>Allowance Type</InputLabel>
              <Select value={formData.type} label="Allowance Type" onChange={(e) => setFormData({...formData, type: e.target.value})}>
                 <MenuItem value="Transportation">Transportation</MenuItem>
                 <MenuItem value="Meal">Meal</MenuItem>
                 <MenuItem value="Communication">Communication</MenuItem>
                 <MenuItem value="Hazard Pay">Hazard Pay</MenuItem>
              </Select>
            </FormControl>

            <TextField 
              label="Amount" 
              fullWidth 
              value={formData.amount}
              onChange={(e) => setFormData({...formData, amount: e.target.value})}
              InputProps={{ startAdornment: <InputAdornment position="start">₱</InputAdornment> }}
            />

            <FormControl fullWidth variant="outlined">
              <InputLabel>Frequency</InputLabel>
              <Select value={formData.frequency} label="Frequency" onChange={(e) => setFormData({...formData, frequency: e.target.value})}>
                 <MenuItem value="Monthly">Monthly</MenuItem>
                 <MenuItem value="Per Payroll">Per Payroll</MenuItem>
              </Select>
            </FormControl>

            <TextField 
              label="Effective Date" 
              type="date" 
              fullWidth 
              value={formData.date}
              onChange={(e) => setFormData({...formData, date: e.target.value})}
              InputLabelProps={{ shrink: true }}
            />

            <FormControl fullWidth variant="outlined">
              <InputLabel>Status</InputLabel>
              <Select value={formData.status} label="Status" onChange={(e) => setFormData({...formData, status: e.target.value})}>
                 <MenuItem value="Active">Active</MenuItem>
                 <MenuItem value="Inactive">Inactive</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpenDialog(false)} color="inherit">Cancel</Button>
          <Button variant="contained" sx={{ bgcolor: apeccBlue, fontWeight: 700 }}>Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
