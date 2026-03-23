import React, { useState, useMemo } from 'react';
import {
  Box, Card, CardContent, Typography, Grid, Button, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Paper, Chip, Avatar,
  IconButton, Tooltip, TextField, InputAdornment, Stack, Dialog,
  DialogTitle, DialogContent, DialogActions, MenuItem, FormControl,
  InputLabel, Select, Switch, FormControlLabel, List, ListItem,
  ListItemText, ListItemSecondaryAction
} from '@mui/material';
import {
  Savings as BonusIcon,
  Search as SearchIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Info as InfoIcon,
  Calculate as CalcIcon,
  FileDownload as CsvIcon,
  PictureAsPdf as PdfIcon,
  Print as PrintIcon,
} from '@mui/icons-material';
import { employees, payrollPeriods, specialEarnings as initialEarnings, specialEarningTypes as initialTypes } from '../../data/mockData';
import { exportToCSV, printTable, exportToPDF } from '../../utils/exportUtils';

const goldAccent = '#d4a843';
const TAX_FREE_LIMIT = 90000;

export default function SpecialEarnings() {
  const [earnings, setEarnings] = useState(initialEarnings);
  const [types, setTypes] = useState(initialTypes);
  const [selectedPeriod, setSelectedPeriod] = useState(payrollPeriods[0]?.id || '');
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const [typesOpen, setTypesOpen] = useState(false);
  const [editingEarning, setEditingEarning] = useState(null);

  // New Type State
  const [typeForm, setTypeForm] = useState({ name: '', includedInCap: true });

  // New Earning State
  const [formData, setFormData] = useState({
    employeeId: '',
    typeId: '',
    amount: '',
  });

  const getEarningType = (typeId) => types.find(t => t.id === typeId) || { name: 'Unknown', includedInCap: false };
  const getEmployeeName = (id) => {
    const emp = employees.find(e => e.id === id);
    return emp ? `${emp.firstName} ${emp.lastName}` : id;
  };

  const filteredEarnings = earnings.filter(e => {
    const matchesPeriod = e.periodId === selectedPeriod;
    const name = getEmployeeName(e.employeeId).toLowerCase();
    const id = e.employeeId.toLowerCase();
    const matchesSearch = name.includes(search.toLowerCase()) || id.includes(search.toLowerCase());
    return matchesPeriod && matchesSearch;
  });

  // Calculate totals per employee for the 90k cap
  const employeeSummaries = useMemo(() => {
    const summary = {};
    filteredEarnings.forEach(e => {
      const type = getEarningType(e.typeId);
      if (!summary[e.employeeId]) {
        summary[e.employeeId] = { totalInCap: 0, totalExempt: 0, nonTaxable: 0, taxable: 0 };
      }
      
      if (type.includedInCap) {
        summary[e.employeeId].totalInCap += e.amount;
      } else {
        summary[e.employeeId].totalExempt += e.amount;
      }
    });

    // Apply 90k Limit
    Object.keys(summary).forEach(empId => {
      const s = summary[empId];
      if (s.totalInCap <= TAX_FREE_LIMIT) {
        s.nonTaxable = s.totalInCap + s.totalExempt;
        s.taxable = 0;
      } else {
        s.nonTaxable = TAX_FREE_LIMIT + s.totalExempt;
        s.taxable = s.totalInCap - TAX_FREE_LIMIT;
      }
    });
    return summary;
  }, [filteredEarnings, types]);

  const stats = useMemo(() => {
    let totalNonTaxable = 0;
    let totalTaxable = 0;
    Object.values(employeeSummaries).forEach(s => {
      totalNonTaxable += s.nonTaxable;
      totalTaxable += s.taxable;
    });
    return { totalNonTaxable, totalTaxable, total: totalNonTaxable + totalTaxable };
  }, [employeeSummaries]);

  const handleOpen = (earning = null) => {
    if (earning) {
      setEditingEarning(earning);
      setFormData({ employeeId: earning.employeeId, typeId: earning.typeId, amount: earning.amount });
    } else {
      setEditingEarning(null);
      setFormData({ employeeId: '', typeId: '', amount: '' });
    }
    setOpen(true);
  };

  const handleSave = () => {
    if (editingEarning) {
      setEarnings(prev => prev.map(e => e.id === editingEarning.id ? { ...e, ...formData, amount: parseFloat(formData.amount) } : e));
    } else {
      setEarnings(prev => [...prev, { id: Date.now(), ...formData, amount: parseFloat(formData.amount), periodId: selectedPeriod, createdAt: new Date().toISOString() }]);
    }
    setOpen(false);
  };

  const handleAddType = () => {
    if (!typeForm.name) return;
    setTypes(prev => [...prev, { id: `SET-${Date.now()}`, ...typeForm }]);
    setTypeForm({ name: '', includedInCap: true });
  };

  const handleDeleteType = (id) => {
    setTypes(prev => prev.filter(t => t.id !== id));
  };

  return (
    <Box className="page-container">
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ 
            fontWeight: 800, color: '#023DFB', 
            background: 'linear-gradient(90deg, #023DFB, #4a75e6)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            mb: 0.5 
          }}>
            Non-Taxable / Special Earnings
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
            Management of 13th month, bonuses, and ₱90k BIR tax exemption tracking
          </Typography>
        </Box>
        <Stack direction="row" spacing={2}>
          <Button 
            variant="outlined" 
            startIcon={<CalcIcon />} 
            sx={{ borderRadius: 2 }}
            onClick={() => setTypesOpen(true)}
          >
            Manage Types
          </Button>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />}
            onClick={() => handleOpen()}
            sx={{ 
              borderRadius: 2, 
              background: 'linear-gradient(135deg, #023DFB, #4a75e6)',
              boxShadow: '0 4px 12px rgba(2, 61, 251, 0.2)' 
            }}
          >
            Add Special Earning
          </Button>
        </Stack>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 4, bgcolor: '#023DFB', color: '#fff' }}>
            <CardContent>
              <Typography variant="subtitle2" sx={{ opacity: 0.8, fontWeight: 700 }}>Total Distributed</Typography>
              <Typography variant="h4" sx={{ fontWeight: 800, my: 1 }}>₱{stats.total.toLocaleString()}</Typography>
              <Typography variant="caption" sx={{ opacity: 0.7 }}>Across all selected employees</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 4, border: '1px solid rgba(0,0,0,0.05)' }}>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 700 }}>Non-Taxable Portion</Typography>
              <Typography variant="h4" sx={{ fontWeight: 800, my: 1, color: '#2e7d32' }}>₱{stats.totalNonTaxable.toLocaleString()}</Typography>
              <Typography variant="caption" color="text.secondary">Within ₱90,000 BIR limit</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 4, border: '1px solid rgba(0,0,0,0.05)' }}>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 700 }}>Taxable Portion</Typography>
              <Typography variant="h4" sx={{ fontWeight: 800, my: 1, color: '#d32f2f' }}>₱{stats.totalTaxable.toLocaleString()}</Typography>
              <Typography variant="caption" color="text.secondary">Excess of ₱90,000 threshold</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Main Table */}
      <Card sx={{ borderRadius: 4, overflow: 'hidden', boxShadow: '0 12px 32px rgba(0,0,0,0.05)' }}>
        <Box sx={{ p: 3, borderBottom: '1px solid rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Stack direction="row" spacing={3} alignItems="center">
            <Typography variant="h6" sx={{ fontWeight: 700 }}>Earning Records</Typography>
            <TextField
              select
              size="small"
              label="Payroll Period"
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              sx={{ width: 220 }}
            >
              {payrollPeriods.map(p => (
                <MenuItem key={p.id} value={p.id}>{p.startDate} - {p.endDate}</MenuItem>
              ))}
            </TextField>
            <TextField
              size="small"
              placeholder="Search by name or ID..."
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
          </Stack>
          <Stack direction="row" spacing={1}>
            <Button size="small" startIcon={<CsvIcon />} onClick={() => exportToCSV(['Employee','Type','Amount','Cap Status'], filteredEarnings.map(e => [getEmployeeName(e.employeeId), getEarningType(e.typeId).name, e.amount, getEarningType(e.typeId).includedInCap ? 'Included' : 'Exempt']), 'special_earnings')}>CSV</Button>
            <Button size="small" startIcon={<PdfIcon />} onClick={() => exportToPDF('Special Earnings Summary', ['Employee','Type','Amount','Cap Status'], filteredEarnings.map(e => [getEmployeeName(e.employeeId), getEarningType(e.typeId).name, e.amount, getEarningType(e.typeId).includedInCap ? 'Included' : 'Exempt']))}>PDF</Button>
          </Stack>
        </Box>
        <TableContainer>
          <Table>
            <TableHead sx={{ bgcolor: 'rgba(2, 61, 251, 0.02)' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Employee</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Earning Type</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>Amount</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Cap Tracking</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredEarnings.map((row) => {
                const type = getEarningType(row.typeId);
                return (
                  <TableRow key={row.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar sx={{ width: 32, height: 32, bgcolor: '#023DFB', fontSize: '0.8rem' }}>
                          {row.employeeId.slice(1)}
                        </Avatar>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>{getEmployeeName(row.employeeId)}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip label={type.name} size="small" variant="outlined" sx={{ fontWeight: 600 }} />
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700 }}>₱{row.amount.toLocaleString()}</TableCell>
                    <TableCell>
                      {type.includedInCap ? (
                        <Tooltip title="Included in ₱90k non-taxable cap">
                          <Chip label="Cap Tracked" size="small" color="primary" variant="filled" sx={{ height: 20, fontSize: '0.65rem' }} />
                        </Tooltip>
                      ) : (
                        <Tooltip title="Exempt from ₱90k cap (De Minimis)">
                          <Chip label="Exempt" size="small" color="success" variant="outlined" sx={{ height: 20, fontSize: '0.65rem' }} />
                        </Tooltip>
                      )}
                    </TableCell>
                    <TableCell align="right">
                      <IconButton size="small" onClick={() => handleOpen(row)}><EditIcon sx={{ fontSize: '1.2rem' }} /></IconButton>
                      <IconButton size="small" color="error"><DeleteIcon sx={{ fontSize: '1.2rem' }} /></IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
              {filteredEarnings.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 8 }}>
                    <Typography color="text.secondary">No special earning records found for this period.</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle sx={{ fontWeight: 700 }}>{editingEarning ? 'Edit Special Earning' : 'Add Special Earning'}</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <FormControl fullWidth>
              <InputLabel>Employee</InputLabel>
              <Select
                value={formData.employeeId}
                label="Employee"
                onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
              >
                {employees.map(emp => (
                  <MenuItem key={emp.id} value={emp.id}>{emp.firstName} {emp.lastName} ({emp.id})</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Earning Type</InputLabel>
              <Select
                value={formData.typeId}
                label="Earning Type"
                onChange={(e) => setFormData({ ...formData, typeId: e.target.value })}
              >
                {types.map(t => (
                  <MenuItem key={t.id} value={t.id}>
                    {t.name} {t.includedInCap ? '(Cap Tracked)' : '(Exempt)'}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Amount"
              type="number"
              fullWidth
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              InputProps={{ startAdornment: <InputAdornment position="start">₱</InputAdornment> }}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave} sx={{ bgcolor: '#023DFB' }}>Save Earning</Button>
        </DialogActions>
      </Dialog>

      {/* Manage Types Dialog */}
      <Dialog open={typesOpen} onClose={() => setTypesOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontWeight: 700 }}>Manage Earning Types</DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 4, mt: 1, p: 2, bgcolor: 'rgba(0,0,0,0.02)', borderRadius: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 700 }}>Add New Type</Typography>
            <Stack direction="row" spacing={2} alignItems="center">
              <TextField
                size="small"
                label="Type Name"
                fullWidth
                value={typeForm.name}
                onChange={(e) => setTypeForm({ ...typeForm, name: e.target.value })}
              />
              <FormControlLabel
                control={
                  <Switch 
                    checked={typeForm.includedInCap} 
                    onChange={(e) => setTypeForm({ ...typeForm, includedInCap: e.target.checked })} 
                  />
                }
                label="Cap Tracked"
                sx={{ whiteSpace: 'nowrap' }}
              />
              <Button variant="contained" onClick={handleAddType} sx={{ bgcolor: '#023DFB' }}>Add</Button>
            </Stack>
          </Box>
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 700 }}>Existing Types</Typography>
          <List>
            {types.map((type) => (
              <ListItem key={type.id} sx={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                <ListItemText 
                  primary={type.name} 
                  secondary={type.includedInCap ? 'Included in ₱90k BIR Cap' : 'Exempt from cap (De Minimis)'} 
                />
                <ListItemSecondaryAction>
                  <IconButton edge="end" color="error" onClick={() => handleDeleteType(type.id)}>
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setTypesOpen(false)} variant="contained" sx={{ bgcolor: '#023DFB' }}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
