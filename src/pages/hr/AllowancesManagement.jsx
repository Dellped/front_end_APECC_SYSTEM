import React, { useState } from 'react';
import {
  Box, Card, CardContent, Typography, Grid, Button, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Chip, IconButton,
  Tooltip, TextField, InputAdornment, Dialog, DialogTitle, DialogContent,
  DialogActions, MenuItem, Switch, FormControlLabel, Stack
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CardGiftcard as BonusIcon,
  LocalShipping as TranspoIcon,
  Fastfood as MealIcon,
  PhoneIphone as CommsIcon,
  FileDownload as CsvIcon,
  PictureAsPdf as PdfIcon,
  Print as PrintIcon,
} from '@mui/icons-material';
import { allowances } from '../../data/mockData';
import { exportToCSV, printTable, exportToPDF } from '../../utils/exportUtils';

const goldAccent = '#d4a843';

export default function AllowancesManagement() {
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);

  const getIcon = (name) => {
    const n = name.toLowerCase();
    if (n.includes('transportation')) return <TranspoIcon sx={{ color: '#023DFB' }} />;
    if (n.includes('meal')) return <MealIcon sx={{ color: '#d32f2f' }} />;
    if (n.includes('communication')) return <CommsIcon sx={{ color: '#2e7d32' }} />;
    return <BonusIcon sx={{ color: goldAccent }} />;
  };

  const filtered = allowances.filter(a => 
    a.name.toLowerCase().includes(search.toLowerCase())
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
            Earnings & Allowances
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
            Manage recurring and one-time employee benefits and incentives
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
          Add Allowance Type
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Statistics */}
        <Grid item xs={12} md={3}>
          <Card sx={{ borderRadius: 4, bgcolor: 'rgba(2, 61, 251, 0.04)', border: '1px solid rgba(2, 61, 251, 0.1)' }}>
            <CardContent>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700 }}>Active Allowances</Typography>
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#023DFB' }}>{allowances.length}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card sx={{ borderRadius: 4, bgcolor: 'rgba(212, 168, 67, 0.04)', border: '1px solid rgba(212, 168, 67, 0.1)' }}>
            <CardContent>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700 }}>Total Monthly Liability</Typography>
              <Typography variant="h4" sx={{ fontWeight: 800, color: goldAccent }}>₱45,000</Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Allowances Table */}
        <Grid item xs={12}>
          <Card sx={{ borderRadius: 4, boxShadow: '0 12px 32px rgba(10,22,40,0.05)', overflow: 'hidden' }}>
            <Box sx={{ p: 3, borderBottom: '1px solid rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#023DFB' }}>Configuration Table</Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
                <TextField
                  size="small"
                  placeholder="Search allowances..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ color: 'text.disabled', fontSize: '1.1rem' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ width: 300, bgcolor: 'rgba(0,0,0,0.02)', borderRadius: 2 }}
                />
                <Stack direction="row" spacing={1}>
                  <Button size="small" variant="outlined" startIcon={<CsvIcon />}
                    onClick={() => exportToCSV(['Allowance Name','Type','Amount','Frequency','Status'], filtered.map(a => [a.name, a.type, a.amount, 'Monthly', 'Active']), 'allowance_types')}
                    sx={{ borderRadius: 2, fontSize: '0.75rem' }}>CSV</Button>
                  <Button size="small" variant="outlined" startIcon={<PdfIcon />}
                    onClick={() => exportToPDF('Earnings & Allowances', ['Allowance Name','Type','Amount','Frequency','Status'], filtered.map(a => [a.name, a.type, a.amount, 'Monthly', 'Active']))}
                    sx={{ borderRadius: 2, fontSize: '0.75rem' }}>PDF</Button>
                  <Button size="small" variant="outlined" startIcon={<PrintIcon />}
                    onClick={() => printTable('Earnings & Allowances', ['Allowance Name','Type','Amount','Frequency','Status'], filtered.map(a => [a.name, a.type, a.amount, 'Monthly', 'Active']))}
                    sx={{ borderRadius: 2, fontSize: '0.75rem' }}>Print</Button>
                </Stack>
              </Box>
            </Box>
            <TableContainer>
              <Table>
                <TableHead sx={{ bgcolor: 'rgba(2, 61, 251, 0.02)' }}>
                  <TableRow>
                    {['Allowance Name', 'Type', 'Amount', 'Taxable', 'Frequency', 'Status', 'Actions'].map((h) => (
                      <TableCell key={h} sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.75rem', textTransform: 'uppercase' }}>{h}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filtered.map((allowance) => (
                    <TableRow key={allowance.id} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Box sx={{ 
                            p: 1, borderRadius: 2, bgcolor: 'rgba(0,0,0,0.03)', 
                            display: 'flex', alignItems: 'center', justifyContent: 'center' 
                          }}>
                            {getIcon(allowance.name)}
                          </Box>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>{allowance.name}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell><Chip label={allowance.type} size="small" sx={{ fontWeight: 700, fontSize: '0.7rem' }} /></TableCell>
                      <TableCell sx={{ fontWeight: 700, color: '#2e7d32' }}>₱{allowance.amount.toLocaleString()}</TableCell>
                      <TableCell>
                        <Chip 
                          label="Taxable" 
                          size="small" 
                          variant="outlined"
                          sx={{ color: '#d32f2f', borderColor: '#d32f2f', fontWeight: 700, fontSize: '0.65rem' }} 
                        />
                      </TableCell>
                      <TableCell>Monthly</TableCell>
                      <TableCell>
                        <Switch defaultChecked size="small" color="primary" />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                          <IconButton size="small" sx={{ color: '#023DFB' }}><EditIcon sx={{ fontSize: '1.1rem' }} /></IconButton>
                          <IconButton size="small" sx={{ color: '#d32f2f' }}><DeleteIcon sx={{ fontSize: '1.1rem' }} /></IconButton>
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

      {/* New Allowance Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontWeight: 800, color: '#023DFB' }}>Add New Allowance Type</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={3} sx={{ mt: 0.5 }}>
            <Grid item xs={12}>
              <TextField fullWidth label="Allowance Name" variant="outlined" placeholder="e.g. Rice Subsidy" />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth select label="Type" defaultValue="Fixed">
                <MenuItem value="Fixed">Fixed Amount</MenuItem>
                <MenuItem value="Variable">Variable / Hourly</MenuItem>
                <MenuItem value="Percentage">Percentage of Basic</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Default Amount" type="number" InputProps={{ startAdornment: <InputAdornment position="start">₱</InputAdornment> }} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth select label="Frequency" defaultValue="Monthly">
                <MenuItem value="Weekly">Weekly</MenuItem>
                <MenuItem value="Semi-Monthly">Semi-Monthly</MenuItem>
                <MenuItem value="Monthly">Monthly</MenuItem>
                <MenuItem value="Annually">Annually</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box sx={{ mt: 1 }}>
                <FormControlLabel control={<Switch defaultChecked />} label="Is Taxable?" />
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpen(false)} sx={{ color: 'text.secondary', fontWeight: 600 }}>Cancel</Button>
          <Button variant="contained" onClick={() => setOpen(false)} sx={{ background: 'linear-gradient(135deg, #023DFB, #4a75e6)', fontWeight: 700 }}>
            Save Allowance
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
