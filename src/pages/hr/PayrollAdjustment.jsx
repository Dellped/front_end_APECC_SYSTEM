import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  Box, Card, CardContent, Typography, Grid, TextField,
  Button, Paper, Stack, InputAdornment, Avatar,
  Divider, Snackbar, Alert, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, List, ListItemText, ListItemButton
} from '@mui/material';
import {
  Search as SearchIcon,
  TrendingDown as DeductionIcon,
  Save as SaveIcon
} from '@mui/icons-material';
import { employees, payrollRecords } from '../../data/mockData';

const apeccBlue = '#0241FB';
const goldAccent = '#d4a843';

export default function PayrollAdjustment() {
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedPayroll, setSelectedPayroll] = useState(null);
  const [lwopDays, setLwopDays] = useState('');
  const [lwopAmount, setLwopAmount] = useState('');

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef(null);

  const [snackbarState, setSnackbarState] = useState({ open: false, message: '', severity: 'success' });
  const [adjustments, setAdjustments] = useState([]);

  const handleCloseSnackbar = () => setSnackbarState(prev => ({ ...prev, open: false }));

  // Filter employees by ID or name from a single query
  const filteredEmployees = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    return employees.filter(emp => {
      const fullName = `${emp.firstName} ${emp.lastName}`.toLowerCase();
      const empId = String(emp.id).toLowerCase();
      return empId.includes(q) || fullName.includes(q);
    }).slice(0, 8);
  }, [searchQuery]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const selectEmployee = (emp) => {
    setSelectedEmployee(emp);
    setSearchQuery(`${emp.firstName} ${emp.lastName} (#${String(emp.id).padStart(4, '0')})`);
    setShowDropdown(false);

    const empPayrolls = payrollRecords.filter(p => p.employeeId === emp.id);
    if (empPayrolls.length > 0) {
      const latest = empPayrolls.sort((a, b) => new Date(b.dateProcessed) - new Date(a.dateProcessed))[0];
      setSelectedPayroll(latest);
    } else {
      setSelectedPayroll(null);
    }
    setLwopDays('');
    setLwopAmount('');
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setSelectedEmployee(null);
    setSelectedPayroll(null);
    setShowDropdown(true);
  };

  // If days are inputted, auto-calc amount. Assuming 22 working days / month for daily rate.
  const handleDaysChange = (e) => {
    const days = e.target.value;
    setLwopDays(days);
    if (days && selectedPayroll) {
      const dailyRate = selectedPayroll.basicPay / 22;
      setLwopAmount(Math.round(dailyRate * parseFloat(days)));
    } else if (!days) {
      setLwopAmount('');
    }
  };

  const computedAdjustedSecondHalf = useMemo(() => {
    if (!selectedPayroll) return 0;
    const deduction = parseFloat(lwopAmount) || 0;
    return Math.max(0, selectedPayroll.secondHalf - deduction);
  }, [selectedPayroll, lwopAmount]);

  const handleSubmit = () => {
    if (!selectedPayroll) return;
    if (!lwopAmount || lwopAmount <= 0) {
      setSnackbarState({ open: true, message: 'Please enter a valid LWOP deduction amount.', severity: 'error' });
      return;
    }

    const newAdjustment = {
      id: `ADJ-${Date.now()}`,
      empId: selectedEmployee.id,
      name: `${selectedEmployee.firstName} ${selectedEmployee.lastName}`,
      period: `${selectedPayroll.month} ${selectedPayroll.year}`,
      originalSecondHalf: selectedPayroll.secondHalf,
      deduction: lwopAmount,
      adjustedSecondHalf: computedAdjustedSecondHalf,
      date: new Date().toISOString().split('T')[0]
    };

    // Reflect the adjustment directly into the mock data so PayrollRegister sees it
    selectedPayroll.secondHalf = computedAdjustedSecondHalf;
    selectedPayroll.lwop = (selectedPayroll.lwop || 0) + parseFloat(lwopAmount);
    selectedPayroll.totalDeduction = (selectedPayroll.totalDeduction || 0) + parseFloat(lwopAmount);
    selectedPayroll.netPay = selectedPayroll.netPay - parseFloat(lwopAmount);

    setAdjustments(prev => [newAdjustment, ...prev]);
    setSnackbarState({ open: true, message: 'Payroll adjustment successfully saved!', severity: 'success' });
    
    // Reset form
    setLwopDays('');
    setLwopAmount('');
    setSelectedEmployee(null);
    setSelectedPayroll(null);
    setSearchQuery('');
  };

  return (
    <Box sx={{ p: 4, bgcolor: '#f4f7fe', minHeight: '100%' }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, color: apeccBlue, mt: 1 }}>
          Payroll Adjustment (LWOP)
        </Typography>
        <Typography variant="subtitle1" sx={{ color: 'text.secondary', fontWeight: 600 }}>
          Adjust second-half salary for leave without pay or absences.
        </Typography>
      </Box>

      <Stack spacing={4}>
        <Card sx={{ borderRadius: 3, boxShadow: '0 10px 40px rgba(0,0,0,0.1)', border: `1px solid ${apeccBlue}15`, width: '100%', borderTop: `3px solid ${goldAccent}` }}>
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
              <Avatar sx={{ bgcolor: 'rgba(2, 61, 251, 0.1)', color: apeccBlue }}><DeductionIcon /></Avatar>
              <Typography variant="h6" sx={{ fontWeight: 800 }}>LWOP Deduction Form</Typography>
            </Box>

            <Box ref={searchRef} sx={{ p: 2.5, bgcolor: 'rgba(2, 61, 251, 0.03)', border: '1px solid rgba(2, 61, 251, 0.1)', borderRadius: 2, mb: 4, position: 'relative' }}>
              <TextField
                size="small"
                fullWidth
                label="Search Employee"
                placeholder="Search by Employee ID or Name..."
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={() => searchQuery && setShowDropdown(true)}
                InputLabelProps={{ shrink: true, sx: { fontWeight: 600 } }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" sx={{ color: apeccBlue }} />
                    </InputAdornment>
                  ),
                }}
              />

              {/* Dropdown suggestions */}
              {showDropdown && filteredEmployees.length > 0 && (
                <Paper elevation={6} sx={{ position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 1300, borderRadius: 2, mt: 0.5, overflow: 'hidden', border: `1px solid ${apeccBlue}30`, maxHeight: 300, overflowY: 'auto' }}>
                  <List dense disablePadding>
                    {filteredEmployees.map((emp, idx) => (
                      <ListItemButton
                        key={emp.id}
                        onClick={() => selectEmployee(emp)}
                        divider={idx < filteredEmployees.length - 1}
                        sx={{ '&:hover': { bgcolor: `${apeccBlue}10` } }}
                      >
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                              <Typography variant="body2" sx={{ fontWeight: 800, color: apeccBlue, minWidth: 50 }}>
                                #{String(emp.id).padStart(4, '0')}
                              </Typography>
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                {emp.firstName} {emp.lastName}
                              </Typography>
                              <Typography variant="caption" sx={{ color: 'text.secondary', ml: 'auto' }}>
                                {emp.department || emp.position || ''}
                              </Typography>
                            </Box>
                          }
                        />
                      </ListItemButton>
                    ))}
                  </List>
                </Paper>
              )}

              {showDropdown && searchQuery && filteredEmployees.length === 0 && (
                <Paper elevation={3} sx={{ position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 1300, borderRadius: 2, mt: 0.5, p: 2, textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary">No employees found.</Typography>
                </Paper>
              )}
            </Box>

            {selectedPayroll ? (
              <Grid container spacing={4}>
                {/* Current Payroll Info */}
                <Grid item xs={12} md={6}>
                  <Box sx={{ px: 1 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 1, mb: 2, borderBottom: '2px solid #eee', pb: 1 }}>
                      Current Payroll Period: {selectedPayroll.month} {selectedPayroll.year}
                    </Typography>
                    
                    <Stack spacing={2} sx={{ mt: 3 }}>
                      <Box sx={{ p: 2.5, bgcolor: '#f8fafc', borderRadius: 2, border: '1px solid #e2e8f0' }}>
                        <Grid container spacing={2}>
                          <Grid item xs={6}>
                            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase' }}>Basic Salary</Typography>
                            <Typography variant="h6" sx={{ fontWeight: 800, color: '#475569' }}>₱{selectedPayroll.basicPay.toLocaleString()}</Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase' }}>Net Pay</Typography>
                            <Typography variant="h6" sx={{ fontWeight: 800, color: '#475569' }}>₱{selectedPayroll.netPay.toLocaleString()}</Typography>
                          </Grid>
                        </Grid>
                        <Divider sx={{ my: 2 }} />
                        <Grid container spacing={2}>
                          <Grid item xs={6}>
                            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase' }}>1st Half Release</Typography>
                            <Typography variant="h6" sx={{ fontWeight: 800, color: '#059669' }}>₱{selectedPayroll.firstHalf.toLocaleString()}</Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase' }}>2nd Half Release</Typography>
                            <Typography variant="h6" sx={{ fontWeight: 800, color: apeccBlue }}>₱{selectedPayroll.secondHalf.toLocaleString()}</Typography>
                          </Grid>
                        </Grid>
                      </Box>
                    </Stack>
                  </Box>
                </Grid>

                {/* Adjustment Input */}
                <Grid item xs={12} md={6}>
                  <Box sx={{ px: 1 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#d32f2f', textTransform: 'uppercase', letterSpacing: 1, mb: 2, borderBottom: `2px solid #d32f2f40`, pb: 1 }}>
                      LWOP Deduction (2nd Half)
                    </Typography>
                    
                    <Stack spacing={3} sx={{ mt: 3 }}>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <TextField 
                            size="small" label="LWOP Days (Optional)" 
                            fullWidth 
                            type="number"
                            value={lwopDays}
                            onChange={handleDaysChange}
                            placeholder="e.g. 2.5"
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField 
                            size="small" label="Total Deduction Amount *" 
                            fullWidth 
                            type="number"
                            value={lwopAmount}
                            onChange={(e) => setLwopAmount(e.target.value)}
                            InputProps={{ startAdornment: <InputAdornment position="start">₱</InputAdornment> }}
                            sx={{ '& .MuiOutlinedInput-root': { fontWeight: 700, color: '#d32f2f' } }}
                          />
                        </Grid>
                      </Grid>

                      <Box sx={{ p: 2, bgcolor: 'rgba(2, 61, 251, 0.05)', borderRadius: 2, border: '1px solid rgba(2, 61, 251, 0.2)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <Typography variant="caption" sx={{ color: apeccBlue, fontWeight: 700, textTransform: 'uppercase', lineHeight: 1, mb: 1 }}>Adjusted 2nd Half Release</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                           <Typography variant="h5" sx={{ fontWeight: 800, color: apeccBlue, textDecoration: lwopAmount ? 'line-through' : 'none', opacity: lwopAmount ? 0.5 : 1 }}>
                             ₱{selectedPayroll.secondHalf.toLocaleString()}
                           </Typography>
                           {lwopAmount > 0 && (
                             <>
                              <Typography variant="h5" sx={{ color: 'text.secondary' }}>→</Typography>
                              <Typography variant="h4" sx={{ fontWeight: 900, color: apeccBlue }}>
                                ₱{computedAdjustedSecondHalf.toLocaleString()}
                              </Typography>
                             </>
                           )}
                        </Box>
                      </Box>
                    </Stack>
                  </Box>
                </Grid>
              </Grid>
            ) : (
              selectedEmployee && (
                <Alert severity="warning" sx={{ mt: 2 }}>
                  No recent payroll records found for {selectedEmployee.firstName} {selectedEmployee.lastName}.
                </Alert>
              )
            )}

            <Box sx={{ textAlign: 'right', mt: 4, px: 1 }}>
              <Button 
                variant="contained" 
                size="large" 
                startIcon={<SaveIcon />}
                disabled={!selectedPayroll || !lwopAmount}
                onClick={handleSubmit}
                sx={{ bgcolor: apeccBlue, fontWeight: 700, borderRadius: 2, px: 6, py: 1.2, boxShadow: '0 4px 14px rgba(2, 61, 251, 0.3)' }}
              >
                Save Adjustment
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* History Table */}
        {adjustments.length > 0 && (
          <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.05)', width: '100%', borderTop: `3px solid ${goldAccent}` }}>
            <CardContent sx={{ p: 3 }}>
               <Typography variant="h6" sx={{ fontWeight: 800, mb: 3, color: apeccBlue }}>Recent Adjustments</Typography>
               <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 'none', border: '1px solid #eee' }}>
                 <Table size="small">
                   <TableHead>
                     <TableRow sx={{ bgcolor: apeccBlue }}>
                       <TableCell sx={{ color: '#fff', fontWeight: 700 }}>Employee</TableCell>
                       <TableCell sx={{ color: '#fff', fontWeight: 700 }}>Payroll Period</TableCell>
                       <TableCell sx={{ color: '#fff', fontWeight: 700 }}>Original 2nd Half</TableCell>
                       <TableCell sx={{ color: '#fff', fontWeight: 700 }}>LWOP Deduction</TableCell>
                       <TableCell sx={{ color: '#fff', fontWeight: 700 }}>Adjusted 2nd Half</TableCell>
                       <TableCell sx={{ color: '#fff', fontWeight: 700 }}>Date</TableCell>
                     </TableRow>
                   </TableHead>
                   <TableBody>
                     {adjustments.map((adj) => (
                       <TableRow key={adj.id} hover>
                         <TableCell sx={{ fontWeight: 700 }}>{adj.name} ({adj.empId})</TableCell>
                         <TableCell>{adj.period}</TableCell>
                         <TableCell>₱{adj.originalSecondHalf.toLocaleString()}</TableCell>
                         <TableCell sx={{ color: '#d32f2f', fontWeight: 700 }}>- ₱{parseFloat(adj.deduction).toLocaleString()}</TableCell>
                         <TableCell sx={{ color: apeccBlue, fontWeight: 800 }}>₱{adj.adjustedSecondHalf.toLocaleString()}</TableCell>
                         <TableCell>{adj.date}</TableCell>
                       </TableRow>
                     ))}
                   </TableBody>
                 </Table>
               </TableContainer>
            </CardContent>
          </Card>
        )}
      </Stack>

      <Snackbar 
        open={snackbarState.open} 
        autoHideDuration={4000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarState.severity} sx={{ width: '100%', fontWeight: 600 }}>
          {snackbarState.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
