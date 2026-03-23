import React, { useState, useMemo } from 'react';
import {
  Box, Card, CardContent, Typography, Grid, Button, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Paper, Chip, Avatar,
  LinearProgress, IconButton, Tooltip, Stepper, Step, StepLabel,
  FormControl, InputLabel, Select, MenuItem, Checkbox, Divider, Stack
} from '@mui/material';
import {
  Payments as PaymentsIcon,
  Schedule as ScheduleIcon,
  CheckCircle as CheckIcon,
  Error as ErrorIcon,
  CloudDownload as DownloadIcon,
  Visibility as ViewIcon,
  PlayArrow as ProcessIcon,
  History as HistoryIcon,
  NavigateNext as NextIcon,
  NavigateBefore as BeforeIcon,
  Calculate as CalcIcon,
  VerifiedUser as ApprovalIcon,
} from '@mui/icons-material';
import { employees, payrollPeriods, attendanceRecords, taxContributions } from '../../data/mockData';

const goldAccent = '#d4a843';

const steps = ['Select Period', 'Select Employees', 'Review Attendance', 'Compute & Finalize'];

export default function Payroll() {
  const [activeStep, setActiveStep] = useState(0);
  const [selectedPeriod, setSelectedPeriod] = useState(payrollPeriods[0]?.id || '');
  const [selectedEmployees, setSelectedEmployees] = useState(employees.map(e => e.id));
  const [processing, setProcessing] = useState(false);
  const [computed, setComputed] = useState(false);

  const formatCurrency = (val) => `₱${val.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => prev - 1);

  const handleProcess = () => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setComputed(true);
      handleNext();
    }, 2000);
  };

  const toggleEmployee = (id) => {
    setSelectedEmployees(prev => 
      prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]
    );
  };

  const currentPeriodData = payrollPeriods.find(p => p.id === selectedPeriod);

  return (
    <Box className="page-container">
      
      {/* Page Header */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" sx={{ 
            fontWeight: 800, color: '#023DFB', 
            background: 'linear-gradient(90deg, #023DFB, #4a75e6)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            mb: 0.5 
          }}>
            Payroll Processing
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
            Execute the core payroll computation workflow
            {currentPeriodData && (
              <Chip 
                label={`Active Cutoff: ${currentPeriodData.startDate} - ${currentPeriodData.endDate}`} 
                size="small" 
                color="primary" 
                sx={{ ml: 2, fontWeight: 700, borderRadius: 1 }}
              />
            )}
          </Typography>
        </Box>
      </Box>

      {/* Workflow Stepper */}
      <Card sx={{ borderRadius: 4, mb: 4, p: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel 
                StepIconProps={{
                  sx: {
                    '&.Mui-active': { color: '#023DFB' },
                    '&.Mui-completed': { color: '#2e7d32' },
                  }
                }}
              >
                <Typography variant="body2" sx={{ fontWeight: 700 }}>{label}</Typography>
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Card>

      {/* Step Content */}
      <Grid container spacing={3}>
        <Grid item xs={12} lg={activeStep === 3 ? 12 : 8}>
          <Card sx={{ borderRadius: 4, minHeight: 400, display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flex: 1, p: 4 }}>
              
              {activeStep === 0 && (
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>Step 1: Select Payroll Period</Typography>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth>
                        <InputLabel>Payroll Period</InputLabel>
                        <Select
                          value={selectedPeriod}
                          label="Payroll Period"
                          onChange={(e) => setSelectedPeriod(e.target.value)}
                        >
                          {payrollPeriods.map(p => (
                            <MenuItem key={p.id} value={p.id}>
                              {p.startDate} to {p.endDate} ({p.type})
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    {currentPeriodData && (
                      <Grid item xs={12}>
                        <Box sx={{ mt: 2, p: 3, borderRadius: 3, bgcolor: 'rgba(2, 61, 251, 0.04)', border: '1px solid rgba(2, 61, 251, 0.1)' }}>
                          <Typography variant="subtitle2" sx={{ color: '#023DFB', fontWeight: 700, mb: 1 }}>Period Details</Typography>
                          <Typography variant="body2"><strong>Status:</strong> {currentPeriodData.status}</Typography>
                          <Typography variant="body2"><strong>Type:</strong> {currentPeriodData.type}</Typography>
                          <Typography variant="body2"><strong>Dates:</strong> {currentPeriodData.startDate} — {currentPeriodData.endDate}</Typography>
                        </Box>
                      </Grid>
                    )}
                  </Grid>
                </Box>
              )}

              {activeStep === 1 && (
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>Step 2: Select Employees</Typography>
                  <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
                    <Table size="small">
                      <TableHead sx={{ bgcolor: 'rgba(0,0,0,0.02)' }}>
                        <TableRow>
                          <TableCell padding="checkbox">
                            <Checkbox 
                              checked={selectedEmployees.length === employees.length}
                              indeterminate={selectedEmployees.length > 0 && selectedEmployees.length < employees.length}
                              onChange={() => setSelectedEmployees(selectedEmployees.length === employees.length ? [] : employees.map(e => e.id))}
                            />
                          </TableCell>
                          <TableCell sx={{ fontWeight: 700 }}>Employee ID</TableCell>
                          <TableCell sx={{ fontWeight: 700 }}>Name</TableCell>
                          <TableCell sx={{ fontWeight: 700 }}>Department</TableCell>
                          <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {employees.map((emp) => (
                          <TableRow key={emp.id} hover onClick={() => toggleEmployee(emp.id)} sx={{ cursor: 'pointer' }}>
                            <TableCell padding="checkbox">
                              <Checkbox checked={selectedEmployees.includes(emp.id)} />
                            </TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>{emp.id}</TableCell>
                            <TableCell>{emp.firstName} {emp.lastName}</TableCell>
                            <TableCell>{emp.department}</TableCell>
                            <TableCell>
                              <Chip label={emp.status} size="small" variant="outlined" sx={{ height: 20, fontSize: '0.65rem' }} />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              )}

              {activeStep === 2 && (
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>Step 3: Review Attendance Summary</Typography>
                  <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
                    <Table size="small">
                      <TableHead sx={{ bgcolor: 'rgba(0,0,0,0.02)' }}>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 700 }}>Employee</TableCell>
                          <TableCell align="right" sx={{ fontWeight: 700 }}>Days Worked</TableCell>
                          <TableCell align="right" sx={{ fontWeight: 700 }}>Absences</TableCell>
                          <TableCell align="right" sx={{ fontWeight: 700 }}>Late (m)</TableCell>
                          <TableCell align="right" sx={{ fontWeight: 700 }}>OT (h)</TableCell>
                          <TableCell align="right" sx={{ fontWeight: 700 }}>Holiday</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {selectedEmployees.map((id) => {
                          const emp = employees.find(e => e.id === id);
                          const att = attendanceRecords.find(a => a.employeeId === id && a.periodId === selectedPeriod) || { daysWorked: 11, absences: 0, late: 0, otHours: 0, holidayWork: 0 };
                          if (!emp) return null;
                          return (
                            <TableRow key={id} hover>
                              <TableCell sx={{ fontWeight: 600 }}>{emp.firstName} {emp.lastName}</TableCell>
                              <TableCell align="right">{att.daysWorked}</TableCell>
                              <TableCell align="right" sx={{ color: att.absences > 0 ? '#d32f2f' : 'inherit' }}>{att.absences}</TableCell>
                              <TableCell align="right">{att.late}</TableCell>
                              <TableCell align="right" sx={{ fontWeight: 600, color: '#2e7d32' }}>{att.otHours}</TableCell>
                              <TableCell align="right">{att.holidayWork}</TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              )}

              {activeStep === 3 && (
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                    <Typography variant="h6" sx={{ fontWeight: 800, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <ApprovalIcon color="success" /> Payroll Computation Results
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <Button variant="outlined" startIcon={<DownloadIcon />}>Export Register</Button>
                      <Button variant="contained" color="success" startIcon={<ApprovalIcon />}>Final Approval</Button>
                    </Box>
                  </Box>
                  
                  <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 3, overflow: 'hidden' }}>
                    <Table>
                      <TableHead sx={{ bgcolor: '#023DFB' }}>
                        <TableRow>
                          <TableCell sx={{ color: '#fff', fontWeight: 700 }}>Employee Name</TableCell>
                          <TableCell align="right" sx={{ color: '#fff', fontWeight: 700 }}>Basic Salary</TableCell>
                          <TableCell align="right" sx={{ color: '#fff', fontWeight: 700 }}>Additions</TableCell>
                          <TableCell align="right" sx={{ color: '#fff', fontWeight: 700 }}>Gross Pay</TableCell>
                          <TableCell align="right" sx={{ color: '#fff', fontWeight: 700 }}>Deductions</TableCell>
                          <TableCell align="right" sx={{ color: '#fff', fontWeight: 700 }}>Tax</TableCell>
                          <TableCell align="right" sx={{ color: '#fff', fontWeight: 700 }}>Net Pay</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {selectedEmployees.map((id) => {
                          const emp = employees.find(e => e.id === id);
                          if (!emp) return null;
                          const basic = emp.payrollProfile?.basicSalary || 20000;
                          const cutoffBasic = basic / 2;
                          const addition = 2500; // Mock addition
                          const gross = cutoffBasic + addition;
                          const sss = Math.min(gross * 0.045, 675);
                          const ph = Math.min(gross * 0.025, 450);
                          const hdmf = 100;
                          const tax = Math.max((gross - sss - ph - hdmf - 10416) * 0.20, 0);
                          const totalDed = sss + ph + hdmf + tax;
                          const net = gross - totalDed;
                          
                          return (
                            <TableRow key={id} hover>
                              <TableCell sx={{ fontWeight: 600 }}>{emp.firstName} {emp.lastName}</TableCell>
                              <TableCell align="right">{formatCurrency(cutoffBasic)}</TableCell>
                              <TableCell align="right" sx={{ color: '#2e7d32' }}>+{formatCurrency(addition)}</TableCell>
                              <TableCell align="right" sx={{ fontWeight: 700 }}>{formatCurrency(gross)}</TableCell>
                              <TableCell align="right" sx={{ color: '#d32f2f' }}>-{formatCurrency(sss + ph + hdmf)}</TableCell>
                              <TableCell align="right" sx={{ color: '#d32f2f' }}>-{formatCurrency(tax)}</TableCell>
                              <TableCell align="right" sx={{ fontWeight: 800, color: '#023DFB' }}>{formatCurrency(net)}</TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              )}

            </CardContent>

            <Divider />
            <Box sx={{ p: 3, display: 'flex', justifyContent: 'space-between' }}>
              <Button 
                startIcon={<BeforeIcon />} 
                onClick={handleBack} 
                disabled={activeStep === 0 || processing}
              >
                Back
              </Button>
              {activeStep < 2 ? (
                <Button 
                  variant="contained" 
                  endIcon={<NextIcon />} 
                  onClick={handleNext} 
                  sx={{ background: 'linear-gradient(135deg, #023DFB, #4a75e6)' }}
                >
                  Continue
                </Button>
              ) : activeStep === 2 ? (
                <Button 
                  variant="contained" 
                  color="warning"
                  startIcon={processing ? <ScheduleIcon className="animate-spin" /> : <CalcIcon />}
                  onClick={handleProcess}
                  disabled={processing}
                  sx={{ px: 4, fontWeight: 700, background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}
                >
                  {processing ? 'Computing Salary...' : 'Compute Salary'}
                </Button>
              ) : (
                <Button 
                  variant="contained" 
                  startIcon={<CheckIcon />}
                  sx={{ background: 'linear-gradient(135deg, #2e7d32, #1b5e20)' }}
                  onClick={() => setActiveStep(0)}
                >
                  Finish & Close Run
                </Button>
              )}
            </Box>
          </Card>
        </Grid>

        {activeStep !== 3 && (
          <Grid item xs={12} lg={4}>
            <Stack spacing={3}>
              <Card sx={{ borderRadius: 4, bgcolor: '#023DFB', color: '#fff' }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="subtitle2" sx={{ opacity: 0.8, fontWeight: 700, mb: 1 }}>Selected Employees</Typography>
                  <Typography variant="h4" sx={{ fontWeight: 800 }}>{selectedEmployees.length}</Typography>
                  <Typography variant="caption" sx={{ opacity: 0.7 }}>Active for processing</Typography>
                </CardContent>
              </Card>
              
              <Card sx={{ borderRadius: 4 }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2, color: '#023DFB' }}>Current Status</Typography>
                  <Stack spacing={2}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">Step Progress</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>{activeStep + 1} / 4</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">Validation State</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: '#2e7d32' }}>Ready</Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Stack>
          </Grid>
        )}
      </Grid>
    </Box>
  );
}
