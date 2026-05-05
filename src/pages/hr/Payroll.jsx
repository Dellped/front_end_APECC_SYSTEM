import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Card, CardContent, Typography, Grid, Button, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Paper, Chip, Avatar,
  LinearProgress, IconButton, Tooltip, Stepper, Step, StepLabel,
  FormControl, InputLabel, Select, MenuItem, Checkbox, Divider, Stack, Dialog,
  TextField, InputAdornment, DialogTitle, DialogContent, DialogActions
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
  PersonOff as LwopIcon,
} from '@mui/icons-material';
import { employees, payrollPeriods, attendanceRecords, taxContributions, payrollRecords, onboardingRecords } from '../../data/mockData';

const goldAccent = '#d4a843';

const tableHeaderStyle = {
  background: 'linear-gradient(135deg, #05077E 0%, #0241FB 60%, #4470ED 100%)',
  color: '#FDFDFC',
  fontWeight: 700,
  fontSize: '0.65rem',
  padding: '8px 2px',
  textAlign: 'center',
  border: '1px solid rgba(255,255,255,0.1)',
  whiteSpace: 'nowrap'
};

const cellStyle = {
  fontSize: '0.7rem',
  padding: '4px 2px',
  border: '1px solid #eee',
  whiteSpace: 'nowrap'
};

const steps = ['Select Period', 'Select Employees', 'Pre Computed Salary', 'Compute & Finalize'];

export default function Payroll() {
  const activeEmployees = employees.filter(e => e.status === 'Active');

  const [activeStep, setActiveStep] = useState(0);
  const [cutoffFrom, setCutoffFrom] = useState(payrollPeriods[0]?.startDate || '');
  const [cutoffTo, setCutoffTo] = useState(payrollPeriods[0]?.endDate || '');
  const [selectedEmployees, setSelectedEmployees] = useState(activeEmployees.map(e => e.id));
  const [processing, setProcessing] = useState(false);
  const [computed, setComputed] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);

  // LWOP per-employee overrides: { [empId]: { days, amount } }
  const [lwopOverrides, setLwopOverrides] = useState({});
  const [lwopDialogOpen, setLwopDialogOpen] = useState(false);
  const [lwopTarget, setLwopTarget] = useState(null); // { emp, record }
  const [lwopDaysInput, setLwopDaysInput] = useState('');
  const [lwopAmountInput, setLwopAmountInput] = useState('');
  const navigate = useNavigate();

  const formatCurrency = (val) => `₱${val.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => prev - 1);

  // Open LWOP dialog for a specific employee
  const openLwopDialog = (emp, record) => {
    setLwopTarget({ emp, record });
    const existing = lwopOverrides[emp.id];
    setLwopDaysInput(existing?.days || '');
    setLwopAmountInput(existing?.amount || '');
    setLwopDialogOpen(true);
  };

  const handleLwopDaysChange = (e) => {
    const days = e.target.value;
    setLwopDaysInput(days);
    if (days && lwopTarget) {
      const dailyRate = (lwopTarget.record.basicPay || 0) / 22;
      setLwopAmountInput(Math.round(dailyRate * parseFloat(days)));
    } else {
      setLwopAmountInput('');
    }
  };

  const saveLwop = () => {
    if (!lwopTarget || !lwopAmountInput) return;
    setLwopOverrides(prev => ({
      ...prev,
      [lwopTarget.emp.id]: { days: lwopDaysInput, amount: parseFloat(lwopAmountInput) }
    }));
    setLwopDialogOpen(false);
    setLwopTarget(null);
    setLwopDaysInput('');
    setLwopAmountInput('');
  };

  const removeLwop = (empId) => {
    setLwopOverrides(prev => {
      const next = { ...prev };
      delete next[empId];
      return next;
    });
  };

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

  // Derive current period — match against existing periods or build a virtual one
  const currentPeriodData = useMemo(() => {
    if (!cutoffFrom || !cutoffTo) return null;
    const match = payrollPeriods.find(p => p.startDate === cutoffFrom && p.endDate === cutoffTo);
    return match || {
      id: `MANUAL-${cutoffFrom}-${cutoffTo}`,
      startDate: cutoffFrom,
      endDate: cutoffTo,
      type: 'Custom Cut-off',
      status: 'Open'
    };
  }, [cutoffFrom, cutoffTo]);

  // Status checks
  const currentQueueRecord = onboardingRecords.find(r => r.type === 'Payroll' && r.payrollPeriodId === currentPeriodData?.id);
  const isApprovedByAGM = currentQueueRecord && currentQueueRecord.status === 'Approved';
  const isAlreadyPending = currentQueueRecord && currentQueueRecord.status !== 'Approved' && !currentQueueRecord.status.includes('Decline');

  const handleSubmitToQueue = () => {
    const today = new Date().toISOString().split('T')[0];
    const newId = `PR-${String(onboardingRecords.length + 1).padStart(3, '0')}`;
    
    onboardingRecords.push({
      id: newId,
      type: 'Payroll',
      payrollPeriodId: currentPeriodData?.id,
      submittedDate: today,
      submittedBy: 'HR Officer',
      status: 'Pending Unit Manager',
      employeeData: { // Mocked to prevent errors in unmodified queued views
        firstName: 'Payroll',
        lastName: `Run (${currentPeriodData.startDate} to ${currentPeriodData.endDate})`,
        designation: 'Payroll Process',
        department: currentPeriodData.type,
        personal: { contactNumber1: '', presentAddress: '' },
        family: { children: [] },
        employmentDetails: {},
        requirements: {},
        education: [],
        workExperience: [],
        references: []
      },
      approvalChain: [
        { role: 'HR Officer', name: 'HR User', status: 'Submitted', date: today, remarks: 'Payroll generation completed & submitted for review.' },
        { role: 'Unit Manager', name: '', status: 'Pending', date: '', remarks: '' },
        { role: 'Asst. General Manager', name: '', status: 'Pending', date: '', remarks: '' },
      ]
    });
    
    setSubmitted(true);
  };

  const handleFinalApproval = () => {
    if (currentPeriodData) currentPeriodData.status = 'Completed';
    if (currentQueueRecord) currentQueueRecord.status = 'Completed';
    setSuccessModalOpen(true);
  };

  if (submitted) {
    return (
      <Box className="page-container">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <Card sx={{ borderRadius: 3, p: 6, textAlign: 'center', maxWidth: 550, boxShadow: '0 8px 32px rgba(0,0,0,0.08)' }}>
            <Avatar sx={{
              width: 80, height: 80, mx: 'auto', mb: 3,
              background: 'linear-gradient(135deg, #2e7d32 0%, #43a047 100%)',
            }}>
              <CheckIcon sx={{ fontSize: 48 }} />
            </Avatar>
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#2e7d32', mb: 1 }}>
              Payroll Submitted!
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary', mb: 1 }}>
              The payroll run for <strong>{currentPeriodData?.type} ({currentPeriodData?.startDate} to {currentPeriodData?.endDate})</strong> has been successfully forwarded to the approval queue.
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 4 }}>
              Next step: <Chip label="Unit Manager Verification" size="small" sx={{ fontWeight: 700, bgcolor: 'rgba(230,126,34,0.15)', color: '#e67e22' }} />
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
              <Button
                variant="outlined"
                onClick={() => {
                  setSubmitted(false);
                  setActiveStep(0);
                }}
                sx={{ borderColor: '#0241FB', color: '#0241FB', fontWeight: 700, borderRadius: 2 }}
              >
                Create New Run
              </Button>
              <Button
                variant="contained"
                onClick={() => navigate('/hr/onboarding/approvals?type=Payroll')}
                sx={{
                  background: `linear-gradient(135deg, #05077E 0%, #0241FB 100%)`,
                  fontWeight: 700, borderRadius: 2,
                }}
              >
                View Approval Queue
              </Button>
            </Box>
          </Card>
        </Box>
      </Box>
    );
  }

  return (
    <Box className="page-container">
      
      {/* Page Header */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" sx={{ 
            fontWeight: 800, color: '#0241FB', 
            background: 'linear-gradient(90deg, #0241FB, #4470ED)',
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
      <Card sx={{ borderRadius: 4, mb: 4, p: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.05)', borderTop: `3px solid ${goldAccent}` }}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel 
                StepIconProps={{
                  sx: {
                    '&.Mui-active': { color: '#0241FB' },
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
          <Card sx={{ borderRadius: 4, minHeight: 400, display: 'flex', flexDirection: 'column', borderTop: `3px solid ${goldAccent}` }}>
            <CardContent sx={{ flex: 1, p: 4 }}>
              
              {activeStep === 0 && (
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>Step 1: Select Payroll Period</Typography>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="From Cut-off Date *"
                        type="date"
                        value={cutoffFrom}
                        onChange={(e) => setCutoffFrom(e.target.value)}
                        InputLabelProps={{ shrink: true, sx: { fontWeight: 600 } }}
                        inputProps={{ max: cutoffTo || undefined }}
                        helperText="Start of the payroll cut-off period"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="To Cut-off Date *"
                        type="date"
                        value={cutoffTo}
                        onChange={(e) => setCutoffTo(e.target.value)}
                        InputLabelProps={{ shrink: true, sx: { fontWeight: 600 } }}
                        inputProps={{ min: cutoffFrom || undefined }}
                        helperText="End of the payroll cut-off period"
                      />
                    </Grid>
                    {currentPeriodData && cutoffFrom && cutoffTo && (
                      <Grid item xs={12}>
                        <Box sx={{ p: 3, borderRadius: 3, bgcolor: 'rgba(2, 61, 251, 0.04)', border: '1px solid rgba(2, 61, 251, 0.1)' }}>
                          <Typography variant="subtitle2" sx={{ color: '#0241FB', fontWeight: 700, mb: 1 }}>Period Summary</Typography>
                          <Typography variant="body2"><strong>Cut-off:</strong> {cutoffFrom} — {cutoffTo}</Typography>
                          <Typography variant="body2"><strong>Type:</strong> {currentPeriodData.type}</Typography>
                          <Typography variant="body2"><strong>Status:</strong> {currentPeriodData.status}</Typography>
                          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
                            Duration: {Math.ceil((new Date(cutoffTo) - new Date(cutoffFrom)) / (1000 * 60 * 60 * 24)) + 1} days
                          </Typography>
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
                              checked={selectedEmployees.length === activeEmployees.length}
                              indeterminate={selectedEmployees.length > 0 && selectedEmployees.length < activeEmployees.length}
                              onChange={() => setSelectedEmployees(selectedEmployees.length === activeEmployees.length ? [] : activeEmployees.map(e => e.id))}
                            />
                          </TableCell>
                          <TableCell sx={{ fontWeight: 700 }}>Employee ID</TableCell>
                          <TableCell sx={{ fontWeight: 700 }}>Name</TableCell>
                          <TableCell sx={{ fontWeight: 700 }}>Department</TableCell>
                          <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {activeEmployees.map((emp) => (
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
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>Step 3: Pre Computed Salary</Typography>
                    {Object.keys(lwopOverrides).length > 0 && (
                      <Chip
                        icon={<LwopIcon sx={{ fontSize: '0.9rem !important' }} />}
                        label={`${Object.keys(lwopOverrides).length} LWOP Employee${Object.keys(lwopOverrides).length > 1 ? 's' : ''} Added`}
                        size="small"
                        sx={{ bgcolor: 'rgba(211,47,47,0.1)', color: '#d32f2f', fontWeight: 700 }}
                      />
                    )}
                  </Box>
                  <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2, overflowX: 'auto' }}>
                    <Table stickyHeader size="small" sx={{ minWidth: 2300 }}>
                      <TableHead>
                        <TableRow>
                          <TableCell sx={tableHeaderStyle}>Employee ID</TableCell>
                          <TableCell sx={{ ...tableHeaderStyle, minWidth: 150 }}>Name</TableCell>
                          <TableCell sx={tableHeaderStyle}>Basic Pay</TableCell>
                          <TableCell sx={tableHeaderStyle}>Deminimis</TableCell>
                          <TableCell sx={tableHeaderStyle}>Non-Taxable</TableCell>
                          <TableCell sx={tableHeaderStyle}>Total Income</TableCell>
                          <TableCell sx={tableHeaderStyle}>SSS (ER)</TableCell>
                          <TableCell sx={tableHeaderStyle}>PH (ER)</TableCell>
                          <TableCell sx={tableHeaderStyle}>HDMF (ER)</TableCell>
                          <TableCell sx={tableHeaderStyle}>Tax</TableCell>
                          <TableCell sx={tableHeaderStyle}>SSS(EE)</TableCell>
                          <TableCell sx={tableHeaderStyle}>PH(EE)</TableCell>
                          <TableCell sx={tableHeaderStyle}>HDMF(EE)</TableCell>
                          <TableCell sx={tableHeaderStyle}>Savings</TableCell>
                          <TableCell sx={tableHeaderStyle}>Salary Loan</TableCell>
                          <TableCell sx={tableHeaderStyle}>STL</TableCell>
                          <TableCell sx={tableHeaderStyle}>HL</TableCell>
                          <TableCell sx={tableHeaderStyle}>Educ Loan</TableCell>
                          <TableCell sx={tableHeaderStyle}>Malasakit</TableCell>
                          <TableCell sx={tableHeaderStyle}>LWOP</TableCell>
                          <TableCell sx={tableHeaderStyle}>Total Deductions</TableCell>
                          <TableCell sx={tableHeaderStyle}>Total Pay</TableCell>
                          <TableCell sx={{ ...tableHeaderStyle, minWidth: 110 }}>LWOP Action</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {selectedEmployees.map((id) => {
                          const emp = employees.find(e => e.id === id);
                          const baseRecord = payrollRecords.find(r => r.employeeId === id) || {
                              basicPay: 0, deminimis: 0, nonTaxable: 0, totalIncome: 0,
                              sssER: 0, phER: 0, hdmfER: 0, tax: 0, sssEE: 0, phEE: 0, hdmfEE: 0,
                              savings: 0, salaryLoan: 0, stl: 0, hl: 0, educLoan: 0, malasakit: 0, lwop: 0,
                              totalDeduction: 0, netPay: 0
                          };
                          const override = lwopOverrides[id];
                          const lwopVal = override ? override.amount : (baseRecord.lwop || 0);
                          const totalDeduction = (baseRecord.totalDeduction || 0) + (override ? override.amount - (baseRecord.lwop || 0) : 0);
                          const netPay = (baseRecord.netPay || 0) - (override ? override.amount - (baseRecord.lwop || 0) : 0);

                          if (!emp) return null;
                          return (
                            <TableRow key={id} hover sx={override ? { bgcolor: 'rgba(211,47,47,0.03)' } : {}}>
                              <TableCell sx={{ ...cellStyle, textAlign: 'center', fontWeight: 600 }}>{emp.id}</TableCell>
                              <TableCell sx={{ ...cellStyle, fontWeight: 700 }}>{emp.firstName} {emp.lastName}</TableCell>
                              <TableCell sx={{ ...cellStyle, textAlign: 'right' }}>{formatCurrency(baseRecord.basicPay)}</TableCell>
                              <TableCell sx={{ ...cellStyle, textAlign: 'right' }}>{formatCurrency(baseRecord.deminimis)}</TableCell>
                              <TableCell sx={{ ...cellStyle, textAlign: 'right' }}>{formatCurrency(baseRecord.nonTaxable)}</TableCell>
                              <TableCell sx={{ ...cellStyle, textAlign: 'right', fontWeight: 700, bgcolor: 'rgba(2, 61, 251, 0.02)' }}>{formatCurrency(baseRecord.totalIncome)}</TableCell>
                              <TableCell sx={{ ...cellStyle, textAlign: 'right', color: '#666' }}>{formatCurrency(baseRecord.sssER)}</TableCell>
                              <TableCell sx={{ ...cellStyle, textAlign: 'right', color: '#666' }}>{formatCurrency(baseRecord.phER)}</TableCell>
                              <TableCell sx={{ ...cellStyle, textAlign: 'right', color: '#666' }}>{formatCurrency(baseRecord.hdmfER)}</TableCell>
                              <TableCell sx={{ ...cellStyle, textAlign: 'right', color: '#d32f2f' }}>{formatCurrency(baseRecord.tax)}</TableCell>
                              <TableCell sx={{ ...cellStyle, textAlign: 'right', color: '#d32f2f' }}>{formatCurrency(baseRecord.sssEE)}</TableCell>
                              <TableCell sx={{ ...cellStyle, textAlign: 'right', color: '#d32f2f' }}>{formatCurrency(baseRecord.phEE)}</TableCell>
                              <TableCell sx={{ ...cellStyle, textAlign: 'right', color: '#d32f2f' }}>{formatCurrency(baseRecord.hdmfEE)}</TableCell>
                              <TableCell sx={{ ...cellStyle, textAlign: 'right', color: '#d32f2f' }}>{formatCurrency(baseRecord.savings || 0)}</TableCell>
                              <TableCell sx={{ ...cellStyle, textAlign: 'right', color: '#d32f2f' }}>{formatCurrency(baseRecord.salaryLoan || 0)}</TableCell>
                              <TableCell sx={{ ...cellStyle, textAlign: 'right', color: '#d32f2f' }}>{formatCurrency(baseRecord.stl || 0)}</TableCell>
                              <TableCell sx={{ ...cellStyle, textAlign: 'right', color: '#d32f2f' }}>{formatCurrency(baseRecord.hl || 0)}</TableCell>
                              <TableCell sx={{ ...cellStyle, textAlign: 'right', color: '#d32f2f' }}>{formatCurrency(baseRecord.educLoan || 0)}</TableCell>
                              <TableCell sx={{ ...cellStyle, textAlign: 'right', color: '#d32f2f' }}>{formatCurrency(baseRecord.malasakit || 0)}</TableCell>
                              <TableCell sx={{ ...cellStyle, textAlign: 'right', color: '#d32f2f', fontWeight: override ? 800 : 400, bgcolor: override ? 'rgba(211,47,47,0.08)' : 'inherit' }}>{formatCurrency(lwopVal)}</TableCell>
                              <TableCell sx={{ ...cellStyle, textAlign: 'right', fontWeight: 700, color: '#d32f2f' }}>{formatCurrency(totalDeduction)}</TableCell>
                              <TableCell sx={{ ...cellStyle, textAlign: 'right', fontWeight: 800, color: '#0241FB' }}>{formatCurrency(netPay)}</TableCell>
                              <TableCell sx={{ ...cellStyle, textAlign: 'center', padding: '2px 4px' }}>
                                {override ? (
                                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.3 }}>
                                    <Button
                                      size="small"
                                      variant="outlined"
                                      onClick={() => openLwopDialog(emp, baseRecord)}
                                      sx={{ fontSize: '0.6rem', py: 0.2, px: 0.8, minWidth: 0, borderColor: '#d32f2f', color: '#d32f2f', lineHeight: 1.4 }}
                                    >
                                      Edit LWOP
                                    </Button>
                                    <Button
                                      size="small"
                                      variant="text"
                                      onClick={() => removeLwop(id)}
                                      sx={{ fontSize: '0.6rem', py: 0, px: 0.8, minWidth: 0, color: 'text.secondary', lineHeight: 1.4 }}
                                    >
                                      Remove
                                    </Button>
                                  </Box>
                                ) : (
                                  <Button
                                    size="small"
                                    variant="contained"
                                    startIcon={<LwopIcon sx={{ fontSize: '0.75rem !important' }} />}
                                    onClick={() => openLwopDialog(emp, baseRecord)}
                                    sx={{ fontSize: '0.6rem', py: 0.3, px: 0.8, minWidth: 0, bgcolor: '#d32f2f', '&:hover': { bgcolor: '#b71c1c' }, lineHeight: 1.4 }}
                                  >
                                    Add LWOP
                                  </Button>
                                )}
                              </TableCell>
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
                      <Button 
                        variant="contained" 
                        color="success" 
                        startIcon={<ApprovalIcon />}
                        disabled={!isApprovedByAGM}
                        onClick={handleFinalApproval}
                      >
                        Final Approval
                      </Button>
                    </Box>
                  </Box>
                  
                  <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 3, overflowX: 'auto' }}>
                    <Table stickyHeader size="small" sx={{ minWidth: 2300 }}>
                      <TableHead>
                        <TableRow>
                          <TableCell sx={tableHeaderStyle}>Employee ID</TableCell>
                          <TableCell sx={{ ...tableHeaderStyle, minWidth: 150 }}>Name</TableCell>
                          <TableCell sx={tableHeaderStyle}>Basic Pay</TableCell>
                          <TableCell sx={tableHeaderStyle}>Deminimis</TableCell>
                          <TableCell sx={tableHeaderStyle}>Non-Taxable</TableCell>
                          <TableCell sx={tableHeaderStyle}>Total Income</TableCell>
                          <TableCell sx={tableHeaderStyle}>SSS (ER)</TableCell>
                          <TableCell sx={tableHeaderStyle}>PH (ER)</TableCell>
                          <TableCell sx={tableHeaderStyle}>HDMF (ER)</TableCell>
                          <TableCell sx={tableHeaderStyle}>Tax</TableCell>
                          <TableCell sx={tableHeaderStyle}>SSS(EE)</TableCell>
                          <TableCell sx={tableHeaderStyle}>PH(EE)</TableCell>
                          <TableCell sx={tableHeaderStyle}>HDMF(EE)</TableCell>
                          <TableCell sx={tableHeaderStyle}>Savings</TableCell>
                          <TableCell sx={tableHeaderStyle}>Salary Loan</TableCell>
                          <TableCell sx={tableHeaderStyle}>STL</TableCell>
                          <TableCell sx={tableHeaderStyle}>HL</TableCell>
                          <TableCell sx={tableHeaderStyle}>Educ Loan</TableCell>
                          <TableCell sx={tableHeaderStyle}>Malasakit</TableCell>
                          <TableCell sx={tableHeaderStyle}>LWOP</TableCell>
                          <TableCell sx={tableHeaderStyle}>Total Deductions</TableCell>
                          <TableCell sx={tableHeaderStyle}>Total Pay</TableCell>
                          <TableCell sx={tableHeaderStyle}>1st / 2nd Half</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {selectedEmployees.map((id) => {
                          const emp = employees.find(e => e.id === id);
                          const record = payrollRecords.find(r => r.employeeId === id) || {
                              basicPay: 0, deminimis: 0, nonTaxable: 0, totalIncome: 0,
                              sssER: 0, phER: 0, hdmfER: 0, tax: 0, sssEE: 0, phEE: 0, hdmfEE: 0,
                              savings: 0, salaryLoan: 0, stl: 0, hl: 0, educLoan: 0, malasakit: 0, lwop: 0,
                              totalDeduction: 0, netPay: 0, firstHalf: 0, secondHalf: 0
                          };
                          
                          if (!emp) return null;
                          return (
                            <TableRow key={id} hover>
                              <TableCell sx={{ ...cellStyle, textAlign: 'center', fontWeight: 600 }}>{emp.id}</TableCell>
                              <TableCell sx={{ ...cellStyle, fontWeight: 700 }}>{emp.firstName} {emp.lastName}</TableCell>
                              <TableCell sx={{ ...cellStyle, textAlign: 'right' }}>{formatCurrency(record.basicPay)}</TableCell>
                              <TableCell sx={{ ...cellStyle, textAlign: 'right' }}>{formatCurrency(record.deminimis)}</TableCell>
                              <TableCell sx={{ ...cellStyle, textAlign: 'right' }}>{formatCurrency(record.nonTaxable)}</TableCell>
                              <TableCell sx={{ ...cellStyle, textAlign: 'right', fontWeight: 700, bgcolor: 'rgba(2, 61, 251, 0.02)' }}>{formatCurrency(record.totalIncome)}</TableCell>
                              <TableCell sx={{ ...cellStyle, textAlign: 'right', color: '#666' }}>{formatCurrency(record.sssER)}</TableCell>
                              <TableCell sx={{ ...cellStyle, textAlign: 'right', color: '#666' }}>{formatCurrency(record.phER)}</TableCell>
                              <TableCell sx={{ ...cellStyle, textAlign: 'right', color: '#666' }}>{formatCurrency(record.hdmfER)}</TableCell>
                              <TableCell sx={{ ...cellStyle, textAlign: 'right', color: '#d32f2f' }}>{formatCurrency(record.tax)}</TableCell>
                              <TableCell sx={{ ...cellStyle, textAlign: 'right', color: '#d32f2f' }}>{formatCurrency(record.sssEE)}</TableCell>
                              <TableCell sx={{ ...cellStyle, textAlign: 'right', color: '#d32f2f' }}>{formatCurrency(record.phEE)}</TableCell>
                              <TableCell sx={{ ...cellStyle, textAlign: 'right', color: '#d32f2f' }}>{formatCurrency(record.hdmfEE)}</TableCell>
                              <TableCell sx={{ ...cellStyle, textAlign: 'right', color: '#d32f2f' }}>{formatCurrency(record.savings || 0)}</TableCell>
                              <TableCell sx={{ ...cellStyle, textAlign: 'right', color: '#d32f2f' }}>{formatCurrency(record.salaryLoan || 0)}</TableCell>
                              <TableCell sx={{ ...cellStyle, textAlign: 'right', color: '#d32f2f' }}>{formatCurrency(record.stl || 0)}</TableCell>
                              <TableCell sx={{ ...cellStyle, textAlign: 'right', color: '#d32f2f' }}>{formatCurrency(record.hl || 0)}</TableCell>
                              <TableCell sx={{ ...cellStyle, textAlign: 'right', color: '#d32f2f' }}>{formatCurrency(record.educLoan || 0)}</TableCell>
                              <TableCell sx={{ ...cellStyle, textAlign: 'right', color: '#d32f2f' }}>{formatCurrency(record.malasakit || 0)}</TableCell>
                              <TableCell sx={{ ...cellStyle, textAlign: 'right', color: '#d32f2f' }}>{formatCurrency(record.lwop || 0)}</TableCell>
                              <TableCell sx={{ ...cellStyle, textAlign: 'right', fontWeight: 700, color: '#d32f2f' }}>{formatCurrency(record.totalDeduction)}</TableCell>
                              <TableCell sx={{ ...cellStyle, textAlign: 'right', fontWeight: 800, color: '#0241FB' }}>{formatCurrency(record.netPay)}</TableCell>
                              <TableCell sx={{ ...cellStyle, padding: 0 }}>
                                 <Box sx={{ borderBottom: '1px solid #eee', px: 1, py: 0.5, textAlign: 'right' }}>{formatCurrency(record.firstHalf)}</Box>
                                 <Box sx={{ px: 1, py: 0.5, textAlign: 'right' }}>{formatCurrency(record.secondHalf)}</Box>
                              </TableCell>
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
                  sx={{ background: 'linear-gradient(135deg, #0241FB, #4470ED)' }}
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
                  sx={isAlreadyPending || isApprovedByAGM ? {} : { background: 'linear-gradient(135deg, #2e7d32, #1b5e20)' }}
                  onClick={handleSubmitToQueue}
                  disabled={isAlreadyPending || isApprovedByAGM}
                >
                  {isAlreadyPending ? 'Pending in Queue...' : isApprovedByAGM ? 'Submit Success' : 'Finish & Close Run'}
                </Button>
              )}
            </Box>
          </Card>
        </Grid>

        {activeStep !== 3 && (
          <Grid item xs={12} lg={4}>
            <Stack spacing={3}>
              <Card sx={{ borderRadius: 4, background: 'linear-gradient(135deg, #05077E 0%, #0241FB 60%, #4470ED 100%)', color: '#FDFDFC' }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="subtitle2" sx={{ opacity: 0.8, fontWeight: 700, mb: 1 }}>Selected Employees</Typography>
                  <Typography variant="h4" sx={{ fontWeight: 800 }}>{selectedEmployees.length}</Typography>
                  <Typography variant="caption" sx={{ opacity: 0.7 }}>Active for processing</Typography>
                </CardContent>
              </Card>
              
              <Card sx={{ borderRadius: 4 }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2, color: '#0241FB' }}>Current Status</Typography>
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

      {/* Success Modal */}
      <Dialog 
        open={successModalOpen}
        onClose={() => setSuccessModalOpen(false)}
        PaperProps={{ sx: { borderRadius: 4, p: 3, maxWidth: 450, textAlign: 'center' } }}
      >
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center' }}>
          <Avatar sx={{ width: 80, height: 80, bgcolor: 'rgba(46, 125, 50, 0.1)', color: '#2e7d32' }}>
            <CheckIcon sx={{ fontSize: 50 }} />
          </Avatar>
        </Box>
        <Typography variant="h5" sx={{ fontWeight: 800, color: '#2e7d32', mb: 2 }}>
          Run Finalized & Closed
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4, px: 2, lineHeight: 1.6 }}>
          Payroll Run for <strong>{currentPeriodData?.startDate} to {currentPeriodData?.endDate}</strong> has been FINALIZED and CLOSED. 
          The data has been dispatched and is now available in your records.
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mb: 1 }}>
          <Button 
            variant="outlined" 
            onClick={() => navigate('/hr/payroll-history')}
            sx={{ fontWeight: 700, borderRadius: 2, borderColor: '#0241FB', color: '#0241FB', px: 3 }}
          >
            Payroll History
          </Button>
          <Button 
            variant="contained" 
            color="success"
            onClick={() => navigate('/hr/payroll-register')}
            sx={{ fontWeight: 700, borderRadius: 2, px: 3, background: 'linear-gradient(135deg, #2e7d32, #1b5e20)' }}
          >
            View Register
          </Button>
        </Box>
      </Dialog>
      {/* LWOP Dialog */}
      <Dialog
        open={lwopDialogOpen}
        onClose={() => setLwopDialogOpen(false)}
        PaperProps={{ sx: { borderRadius: 3, minWidth: 380 } }}
      >
        <DialogTitle sx={{ fontWeight: 800, color: '#d32f2f', display: 'flex', alignItems: 'center', gap: 1 }}>
          <LwopIcon /> Add LWOP Deduction
        </DialogTitle>
        <DialogContent dividers>
          {lwopTarget && (
            <Stack spacing={2} sx={{ pt: 1 }}>
              <Box sx={{ p: 1.5, bgcolor: 'rgba(211,47,47,0.05)', borderRadius: 2, border: '1px solid rgba(211,47,47,0.15)' }}>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>
                  {lwopTarget.emp.firstName} {lwopTarget.emp.lastName}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  ID: {lwopTarget.emp.id} &nbsp;|&nbsp; Basic Pay: {formatCurrency(lwopTarget.record.basicPay)}
                </Typography>
              </Box>
              <TextField
                size="small"
                fullWidth
                label="LWOP Days (Optional)"
                type="number"
                placeholder="e.g. 2.5"
                value={lwopDaysInput}
                onChange={handleLwopDaysChange}
                helperText="Auto-calculates amount based on daily rate (Basic ÷ 22)"
              />
              <TextField
                size="small"
                fullWidth
                label="Deduction Amount *"
                type="number"
                value={lwopAmountInput}
                onChange={(e) => setLwopAmountInput(e.target.value)}
                InputProps={{ startAdornment: <InputAdornment position="start">₱</InputAdornment> }}
                sx={{ '& .MuiOutlinedInput-root': { fontWeight: 700, color: '#d32f2f' } }}
              />
              {lwopAmountInput > 0 && (
                <Box sx={{ p: 1.5, bgcolor: 'rgba(2,61,251,0.05)', borderRadius: 2, border: '1px solid rgba(2,61,251,0.15)' }}>
                  <Typography variant="caption" sx={{ color: '#0241FB', fontWeight: 700 }}>Adjusted Net Pay</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: '#0241FB' }}>
                    {formatCurrency(Math.max(0, (lwopTarget.record.netPay || 0) - parseFloat(lwopAmountInput)))}
                  </Typography>
                </Box>
              )}
            </Stack>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button onClick={() => setLwopDialogOpen(false)} sx={{ fontWeight: 700, color: 'text.secondary' }}>Cancel</Button>
          <Button
            variant="contained"
            disabled={!lwopAmountInput || parseFloat(lwopAmountInput) <= 0}
            onClick={saveLwop}
            sx={{ bgcolor: '#d32f2f', fontWeight: 700, '&:hover': { bgcolor: '#b71c1c' } }}
          >
            Apply LWOP
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
