import React, { useState, useMemo } from 'react';
import {
  Box, Card, CardContent, Typography, Grid, Button, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Paper, Chip, Avatar,
  IconButton, Tooltip, TextField, InputAdornment, Stack, Divider,
  MenuItem, FormControl, InputLabel, Select, Tab, Tabs, Autocomplete
} from '@mui/material';
import {
  AccountBalanceWallet as WalletIcon,
  Receipt as ReceiptIcon,
  Download as DownloadIcon,
  Print as PrintIcon,
  Info as InfoIcon,
  ChevronRight as NextIcon,
  Payments as EarningsIcon,
  MoneyOff as DeductionsIcon,
  Savings as BonusIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { employees, payrollPeriods, attendanceRecords, specialEarnings, specialEarningTypes } from '../../data/mockData';
import { exportToPDF, printTable } from '../../utils/exportUtils';

const logoBlue = '#0241FB';
const goldAccent = '#d4a843';

export default function EmployeePayrollOverview() {
  const initialId = employees && employees.length > 0 ? employees[0].id : null;
  const [selectedEmployee, setSelectedEmployee] = useState(initialId);
  const [selectedPeriod, setSelectedPeriod] = useState(payrollPeriods[0]?.id || '');
  const [tabValue, setTabValue] = useState(0);

  const currentEmployee = useMemo(() => employees.find(e => e.id === selectedEmployee), [selectedEmployee]);
  const currentPeriod = useMemo(() => payrollPeriods.find(p => p.id === selectedPeriod), [selectedPeriod]);

  // Mock Payroll Computation (Simplified for overview)
  const payrollData = useMemo(() => {
    if (!currentEmployee) return null;
    
    const basic = currentEmployee.payrollProfile?.basicSalary || 0;
    const isSemiMonthly = currentPeriod?.type?.includes('Semi');
    const cutoffBasic = isSemiMonthly ? basic / 2 : basic;
    
    const att = attendanceRecords.find(a => a.employeeId === selectedEmployee && a.periodId === selectedPeriod) || 
                { daysWorked: 11, absences: 0, late: 0, otHours: 0, holidayWork: 0 };

    // Earnings
    const otPay = (basic / 26 / 8) * 1.25 * att.otHours;
    const holidayPay = (basic / 26) * att.holidayWork;
    const allowances = 2500; // Mock fixed allowances
    
    // Special Earnings (Bonus/13th month)
    const special = specialEarnings
      .filter(se => se.employeeId === selectedEmployee && se.periodId === selectedPeriod)
      .reduce((sum, se) => sum + se.amount, 0);

    const deminimis = 2000;
    const gross = cutoffBasic + otPay + holidayPay + allowances + special + deminimis;

    // Deductions (Mock)
    const taxableGross = gross - deminimis - special;
    const sss = Math.min(gross * 0.045, 1350);
    const ph = Math.min(gross * 0.025, 900);
    const hdmf = 100;
    const tax = Math.max((taxableGross - sss - ph - hdmf - (isSemiMonthly ? 10416 : 20833)) * 0.20, 0);
    const absencesDed = (basic / 26) * att.absences;
    
    const totalDeductions = sss + ph + hdmf + tax + absencesDed;
    const netPay = gross - totalDeductions;

    return {
      cutoffBasic, otPay, holidayPay, allowances, special, deminimis, gross,
      sss, ph, hdmf, tax, totalDeductions, netPay,
      attendance: att
    };
  }, [currentEmployee, selectedPeriod, selectedEmployee]);

  const formatCurrency = (val) => `₱${val.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <Box className="page-container">
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" sx={{ 
            fontWeight: 800, color: logoBlue, 
            background: `linear-gradient(90deg, ${logoBlue}, #4470ED)`,
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            mb: 0.5 
          }}>
            Employee Payroll Overview
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
            Detailed breakdown of earnings, deductions, and net compensation
          </Typography>
        </Box>
      </Box>

      {/* Search & Profile Bar */}
      <Card sx={{ mb: 3, borderRadius: 3, borderTop: `3px solid #d4a843`, boxShadow: '0 4px 24px rgba(0,0,0,0.06)', overflow: 'visible' }}>
        <CardContent sx={{ p: 0 }}>
            <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
                    <Autocomplete
                        sx={{ minWidth: 350 }}
                        size="small"
                        options={employees || []}
                        getOptionLabel={(option) => `${option.firstName} ${option.lastName} (${option.id})`}
                        value={selectedEmployee === initialId ? null : (currentEmployee || null)}
                        onChange={(event, newValue) => setSelectedEmployee(newValue ? newValue.id : initialId)}
                        renderInput={(params) => <TextField {...params} label="Search Employee Name or ID" />}
                    />
                    <FormControl size="small" sx={{ minWidth: 250 }}>
                        <InputLabel>Payroll Period</InputLabel>
                        <Select
                            value={selectedPeriod}
                            label="Payroll Period"
                            onChange={(e) => setSelectedPeriod(e.target.value)}
                        >
                            {payrollPeriods.map(p => (
                                <MenuItem key={p.id} value={p.id}>{p.startDate} - {p.endDate} ({p.type})</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>
            </Box>

            {currentEmployee && (
                <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 4, position: 'relative' }}>
                    <Box sx={{ position: 'relative' }}>
                        <Avatar 
                            sx={{ 
                                width: 90, 
                                height: 90, 
                                border: `4px solid ${logoBlue}`,
                                boxShadow: '0 8px 16px rgba(2, 61, 251, 0.15)',
                                fontSize: '2rem',
                                fontWeight: 800,
                                bgcolor: logoBlue
                            }}
                        >
                            {currentEmployee.firstName[0]}{currentEmployee.lastName[0]}
                        </Avatar>
                        <Chip 
                            label={currentEmployee.status || 'Active'} 
                            size="small" 
                            sx={{ 
                                position: 'absolute', 
                                bottom: -8, 
                                left: '50%', 
                                transform: 'translateX(-50%)',
                                bgcolor: '#2e7d32', 
                                color: '#FDFDFC',
                                fontWeight: 800,
                                fontSize: '0.6rem',
                                border: '2px solid #fff'
                            }} 
                        />
                    </Box>

                    <Box sx={{ display: 'flex', width: '100%', alignItems: 'center', gap: 2, minWidth: 0 }}>
                        <Box sx={{ flexShrink: 0, minWidth: 200 }}>
                            <Typography variant="caption" sx={{ fontWeight: 800, color: logoBlue, textTransform: 'uppercase', letterSpacing: '1px' }}>
                                {currentEmployee.employmentType || currentEmployee.employmentDetails?.employmentType || 'Employee'}
                            </Typography>
                            <Typography variant="h5" sx={{ fontWeight: 900, color: '#1a202c', mt: 0.5, lineHeight: 1.2 }}>
                                {currentEmployee.firstName} {currentEmployee.lastName}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                                Date Joined: {currentEmployee.employmentDate ? new Date(currentEmployee.employmentDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : (currentEmployee.employmentDetails?.dateHired ? new Date(currentEmployee.employmentDetails.dateHired).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '—')}
                            </Typography>
                            <Typography variant="body2" sx={{ fontWeight: 800, color: logoBlue, fontSize: '0.75rem', mt: 0.5 }}>
                                Payroll Location: {currentEmployee.payrollLocation || 'N/A'}
                            </Typography>
                        </Box>

                        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                            <Box sx={{ 
                                display: 'grid', 
                                gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 1.2fr) minmax(0, 0.8fr) minmax(0, 1.8fr)', 
                                gap: 1.5, 
                                mt: 1,
                                bgcolor: 'rgba(0,0,0,0.02)',
                                p: 1.5,
                                borderRadius: 2,
                                border: '1px solid rgba(0,0,0,0.05)'
                            }}>
                                <Box sx={{ minWidth: 0 }}>
                                    <Typography variant="caption" noWrap sx={{ fontWeight: 700, color: 'text.secondary', display: 'block', fontSize: '0.65rem' }}>DESIGNATION</Typography>
                                    <Typography noWrap sx={{ fontWeight: 800, color: '#2d3748', fontSize: '0.75rem' }} title={currentEmployee.designation}>{currentEmployee.designation}</Typography>
                                </Box>
                                <Box sx={{ minWidth: 0 }}>
                                    <Typography variant="caption" noWrap sx={{ fontWeight: 700, color: 'text.secondary', display: 'block', fontSize: '0.65rem' }}>DEPARTMENT</Typography>
                                    <Typography noWrap sx={{ fontWeight: 800, color: '#2d3748', fontSize: '0.75rem' }} title={currentEmployee.department}>{currentEmployee.department}</Typography>
                                </Box>
                                <Box sx={{ minWidth: 0 }}>
                                    <Typography variant="caption" noWrap sx={{ fontWeight: 700, color: 'text.secondary', display: 'block', fontSize: '0.65rem' }}>EMPLOYEE ID</Typography>
                                    <Typography noWrap sx={{ fontWeight: 900, color: logoBlue, letterSpacing: '0.5px', fontSize: '0.75rem' }}>{currentEmployee.id}</Typography>
                                </Box>
                                <Box sx={{ minWidth: 0 }}>
                                    <Typography variant="caption" noWrap sx={{ fontWeight: 700, color: 'text.secondary', display: 'block', fontSize: '0.65rem' }}>JOB LEVEL</Typography>
                                    <Typography noWrap sx={{ fontWeight: 800, color: '#2d3748', fontSize: '0.75rem' }} title={currentEmployee.employmentDetails?.jobLevel || '—'}>{currentEmployee.employmentDetails?.jobLevel || '—'}</Typography>
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            )}
        </CardContent>
      </Card>

      {payrollData && (
        <Grid container spacing={3}>
          {/* Summary Stats */}
          <Grid item xs={12} md={4}>
            <Card sx={{ borderRadius: 4,  height: '100%', border: '1px solid rgba(0,0,0,0.05)' }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 700, mb: 2 }}>GROSS PAY</Typography>
                <Typography variant="h4" sx={{ fontWeight: 800, color: '#2e7d32' }}>{formatCurrency(payrollData.gross)}</Typography>
                <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                  <Chip label="Before Tax" size="small" variant="outlined" />
                  <Chip label="All Credits" size="small" variant="outlined" />
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ borderRadius: 4, height: '100%', border: '1px solid rgba(0,0,0,0.05)' }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 700, mb: 2 }}>TOTAL DEDUCTIONS</Typography>
                <Typography variant="h4" sx={{ fontWeight: 800, color: '#d32f2f' }}>{formatCurrency(payrollData.totalDeductions)}</Typography>
                <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                  <Chip label="Tax + Statutory" size="small" variant="outlined" />
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ borderRadius: 4, height: '100%', background: 'linear-gradient(135deg, #05077E 0%, #0241FB 60%, #4470ED 100%)', color: '#FDFDFC' }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2, opacity: 0.8 }}>NET TAKE-HOME PAY</Typography>
                <Typography variant="h3" sx={{ fontWeight: 800 }}>{formatCurrency(payrollData.netPay)}</Typography>
                <Typography variant="caption" sx={{ mt: 2, display: 'block', opacity: 0.7 }}>Credited to Payroll Account</Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Breakdown Tabs */}
          <Grid item xs={12} lg={8}>
            <Card sx={{ borderRadius: 4 }}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} sx={{ px: 2 }}>
                  <Tab label="Pay" sx={{ fontWeight: 700 }} />
                  <Tab label="Deductions" sx={{ fontWeight: 700 }} />
                  <Tab label="Bonuses" sx={{ fontWeight: 700 }} />
                </Tabs>
              </Box>
              <CardContent sx={{ p: 0 }}>
                {tabValue === 0 && (
                  <TableContainer>
                    <Table>
                      <TableBody>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 600 }}>Basic Salary (Current Period)</TableCell>
                          <TableCell align="right">{formatCurrency(payrollData.cutoffBasic)}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 600 }}>De Minimis</TableCell>
                          <TableCell align="right" sx={{ color: '#0241FB', fontWeight: 600 }}>+{formatCurrency(payrollData.deminimis)}</TableCell>
                        </TableRow>

                        <TableRow sx={{ bgcolor: 'rgba(46, 125, 50, 0.05)' }}>
                          <TableCell sx={{ fontWeight: 800 }}>Total Pay</TableCell>
                          <TableCell align="right" sx={{ fontWeight: 800, color: '#2e7d32' }}>{formatCurrency(payrollData.gross - payrollData.special)}</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
                {tabValue === 1 && (
                  <TableContainer>
                    <Table>
                      <TableBody>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 600 }}>SSS Contribution (Employee Share)</TableCell>
                          <TableCell align="right" sx={{ color: '#d32f2f' }}>-{formatCurrency(payrollData.sss)}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 600 }}>PhilHealth Contribution</TableCell>
                          <TableCell align="right" sx={{ color: '#d32f2f' }}>-{formatCurrency(payrollData.ph)}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 600 }}>Pag-IBIG Premium</TableCell>
                          <TableCell align="right" sx={{ color: '#d32f2f' }}>-{formatCurrency(payrollData.hdmf)}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 600 }}>Withholding Tax</TableCell>
                          <TableCell align="right" sx={{ color: '#d32f2f' }}>-{formatCurrency(payrollData.tax)}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 600 }}>APECC SAVINGS</TableCell>
                          <TableCell align="right" sx={{ color: '#d32f2f' }}>-{formatCurrency(0)}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 600 }}>APECC SHARE</TableCell>
                          <TableCell align="right" sx={{ color: '#d32f2f' }}>-{formatCurrency(0)}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 600 }}>APECC LOAN</TableCell>
                          <TableCell align="right" sx={{ color: '#d32f2f' }}>-{formatCurrency(0)}</TableCell>
                        </TableRow>
                        <TableRow sx={{ bgcolor: 'rgba(211, 47, 47, 0.05)' }}>
                          <TableCell sx={{ fontWeight: 800 }}>Total Deductions</TableCell>
                          <TableCell align="right" sx={{ fontWeight: 800, color: '#d32f2f' }}>{formatCurrency(payrollData.totalDeductions)}</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
                {tabValue === 2 && (
                  <TableContainer>
                    <Table>
                      <TableBody>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 600 }}>13th Month</TableCell>
                          <TableCell align="right" sx={{ color: '#0241FB', fontWeight: 700 }}>+{formatCurrency(payrollData.special)}</TableCell>
                        </TableRow>
                        {['Level 1 - Probationary', 'Level 2- upon regularization'].includes(currentEmployee.employmentDetails?.jobLevel) && (
                          <TableRow>
                            <TableCell sx={{ fontWeight: 600 }}>Service Incentive Leaves (SIL)</TableCell>
                            <TableCell align="right" sx={{ color: '#2e7d32', fontWeight: 700 }}>+{formatCurrency(payrollData.allowances)}</TableCell>
                          </TableRow>
                        )}
                        <TableRow>
                          <TableCell sx={{ fontWeight: 600 }}>Gratuity</TableCell>
                          <TableCell align="right" sx={{ color: '#2e7d32' }}>{formatCurrency(payrollData.special)}</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Quick Info Sidebar */}
          <Grid item xs={12} lg={4}>
            <Stack spacing={3}>
              <Card sx={{ borderRadius: 4, bgcolor: '#f8fafc' }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <InfoIcon color="primary" fontSize="small" /> Payroll Context
                  </Typography>
                  <Stack spacing={2}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">Payroll Cycle</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>Semi-Monthly</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">Work Comp Plan</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>Regular Full-time</Typography>
                    </Box>
                    <Divider />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">Computed Date</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>2025-03-22</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">Status</Typography>
                      <Chip label="Verified & Paid" size="small" color="success" />
                    </Box>
                  </Stack>
                </CardContent>
              </Card>

              <Card sx={{ borderRadius: 4, bgcolor: 'rgba(212, 168, 67, 0.05)', border: `1px solid ${goldAccent}33` }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 1, color: goldAccent }}>Tax Cap Status</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Non-taxable benefits cumulative limit tracking (₱90k Cap)
                  </Typography>
                  <Box sx={{ mb: 1, display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="caption" sx={{ fontWeight: 700 }}>Current Utilization</Typography>
                    <Typography variant="caption" sx={{ fontWeight: 700 }}>22%</Typography>
                  </Box>
                  <Paper sx={{ height: 8, bgcolor: 'rgba(0,0,0,0.05)', borderRadius: 4, overflow: 'hidden' }}>
                    <Box sx={{ width: '22%', height: '100%', bgcolor: goldAccent }} />
                  </Paper>
                </CardContent>
              </Card>
            </Stack>
          </Grid>
        </Grid>
      )}
    </Box>
  );
}
