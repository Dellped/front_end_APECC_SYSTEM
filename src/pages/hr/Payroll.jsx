import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Card, CardContent, Typography, Grid, Button, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Paper, Chip, Avatar,
  LinearProgress, IconButton, Tooltip, Stepper, Step, StepLabel,
  FormControl, InputLabel, Select, MenuItem, Checkbox, Divider, Stack, Dialog
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
  const [activeStep, setActiveStep] = useState(0);
  const [selectedPeriod, setSelectedPeriod] = useState(payrollPeriods[0]?.id || '');
  const [selectedEmployees, setSelectedEmployees] = useState(employees.map(e => e.id));
  const [processing, setProcessing] = useState(false);
  const [computed, setComputed] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const navigate = useNavigate();

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

  // Status checks
  const currentQueueRecord = onboardingRecords.find(r => r.type === 'Payroll' && r.payrollPeriodId === selectedPeriod);
  const isApprovedByAGM = currentQueueRecord && currentQueueRecord.status === 'Approved';
  const isAlreadyPending = currentQueueRecord && currentQueueRecord.status !== 'Approved' && !currentQueueRecord.status.includes('Decline');

  const handleSubmitToQueue = () => {
    const today = new Date().toISOString().split('T')[0];
    const newId = `PR-${String(onboardingRecords.length + 1).padStart(3, '0')}`;
    
    onboardingRecords.push({
      id: newId,
      type: 'Payroll',
      payrollPeriodId: selectedPeriod,
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
                          <Typography variant="subtitle2" sx={{ color: '#0241FB', fontWeight: 700, mb: 1 }}>Period Details</Typography>
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
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>Step 3: Pre Computed Salary</Typography>
                  <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2, overflowX: 'auto' }}>
                    <Table stickyHeader size="small" sx={{ minWidth: 2200 }}>
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
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {selectedEmployees.map((id) => {
                          const emp = employees.find(e => e.id === id);
                          const record = payrollRecords.find(r => r.employeeId === id) || {
                              basicPay: 0, deminimis: 0, nonTaxable: 0, totalIncome: 0,
                              sssER: 0, phER: 0, hdmfER: 0, tax: 0, sssEE: 0, phEE: 0, hdmfEE: 0,
                              savings: 0, salaryLoan: 0, stl: 0, hl: 0, educLoan: 0, malasakit: 0, lwop: 0,
                              totalDeduction: 0, netPay: 0
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
    </Box>
  );
}
