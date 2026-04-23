import React, { useState, useMemo } from 'react';
import {
  Box, Card, CardContent, Typography, Tabs, Tab, Grid, Avatar, Chip,
  Button, Divider, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, IconButton, Paper, Autocomplete, TextField, createFilterOptions,
  FormControl, InputLabel, Select, MenuItem, Stack
} from '@mui/material';
import {
  CloudUpload as UploadIcon, Edit as EditIcon, Print as PrintIcon,
  Person as PersonIcon, FamilyRestroom as FamilyIcon, School as SchoolIcon,
  Work as WorkIcon, ListAlt as AlphalistIcon, Search as SearchIcon,
  ExitToApp as ExitIcon, AssignmentTurnedIn as InterviewIcon,
  Info as InfoIcon, AccountBalanceWallet as WalletIcon,
  EventNote as LeavesIcon, Gavel as SanctionsIcon, Add as AddIcon
} from '@mui/icons-material';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Avatar as MuiAvatar
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { 
  CheckCircle as ApproveIcon 
} from '@mui/icons-material';
import { employees, payrollPeriods, attendanceRecords, specialEarnings, leaveRecords, leaveBalances, sanctions, onboardingRecords, payrollRecords } from '../../data/mockData';
import LeaveApplicationForm from './LeaveApplicationForm';
import ExitInterviewForm from '../../components/forms/ExitInterviewForm';

const goldAccent = '#d4a843';

function TabPanel({ children, value, index }) {
  return value === index ? <Box sx={{ pt: 2.5 }}>{children}</Box> : null;
}

function InfoRow({ label, value }) {
  return (
    <Box sx={{ display: 'flex', py: 1, borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
      <Typography variant="body2" sx={{ width: 180, color: 'text.secondary', fontWeight: 500, fontSize: '0.82rem', flexShrink: 0 }}>
        {label}
      </Typography>
      <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '0.85rem' }}>
        {value || '—'}
      </Typography>
    </Box>
  );
}

export default function EmployeeProfile() {
  const navigate = useNavigate();
  const [selectedEmployee, setSelectedEmployee] = useState(0);
  const [tabValue, setTabValue] = useState(0);
  const [openResignation, setOpenResignation] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [successModalType, setSuccessModalType] = useState('Resignation'); // 'Resignation' or 'Leave'
  const [exitInterviewData, setExitInterviewData] = useState({
    reasons: { whyLeave: '', managerRel: '', peersRel: '', generalOpinion: '', prevention: '' },
    experience: { managementOpinion: '', feedback: '', missingPrograms: '', recognition: '', overall: '' },
    role: { resources: '', training: '', expectations: '', rewardChallenge: '', skillUtilization: '', support: '', workload: '', careerGoals: '', likedMost: '', likedLeast: '', growth: '', environment: '', valued: '', whatMadeValued: '' },
    forward: { advice: '', improvements: '', workAgain: '', recommend: '', oneThingChange: '', additional: '' }
  });
  const [payrollTabValue, setPayrollTabValue] = useState(0);
  const [selectedPeriod, setSelectedPeriod] = useState(payrollPeriods[0]?.id || '');
  const [isLeaveFormOpen, setIsLeaveFormOpen] = useState(false);

  const historyMonths = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const currentYear = new Date().getFullYear();
  const historyYears = Array.from({ length: currentYear - 2017 }, (_, i) => currentYear - i);
  const [historyMonth, setHistoryMonth] = useState(new Date().getMonth());
  const [historyYear, setHistoryYear] = useState(currentYear);
  const [expandedLeaveRow, setExpandedLeaveRow] = useState(null);

  const handleExitFormSubmit = (data) => {
    setExitInterviewData(data);
    handleResignationSubmit(data);
  };

  const handleResignationSubmit = (interviewData) => {
    const today = new Date().toISOString().split('T')[0];
    const newId = `RES-${String(onboardingRecords.length + 1).padStart(3, '0')}`;
    const emp = employees[selectedEmployee];

    onboardingRecords.push({
      id: newId,
      type: 'Resignation',
      submittedDate: today,
      submittedBy: 'System',
      status: 'Pending HR Officer',
      employeeData: {
        ...emp,
        resignationDetails: {
          reason: exitInterviewData.reasons.whyLeave,
          date: today, // or add a specific date field to the form
          remarks: (interviewData || exitInterviewData).forward.additional
        },
        exitInterviewFull: interviewData || exitInterviewData // Store the full comprehensive interview
      },
      approvalChain: [
        { role: 'Employee Action', name: `${emp.firstName} ${emp.lastName}`, status: 'Submitted', date: today, remarks: 'Exit Interview Completed' },
        { role: 'HR Officer', name: '', status: 'Pending', date: '', remarks: '' },
        { role: 'Unit Manager', name: '', status: 'Pending', date: '', remarks: '' },
        { role: 'Asst. General Manager', name: '', status: 'Pending', date: '', remarks: '' },
        { role: 'General Manager', name: '', status: 'Pending', date: '', remarks: '' },
      ]
    });

    setOpenResignation(false);
    setSuccessModal(true);
  };

  const emp = employees[selectedEmployee];

  // Leave data for selected employee
  const employeeLeaves = useMemo(() => leaveRecords.filter(l => l.employeeId === emp?.id), [emp]);
  const employeeBalances = useMemo(() => leaveBalances.filter(lb => lb.employeeId === emp?.id), [emp]);
  const employeeSanctions = useMemo(() => sanctions.filter(s => s.employeeId === emp?.id), [emp]);

  const currentPeriod = useMemo(() => payrollPeriods.find(p => p.id === selectedPeriod), [selectedPeriod]);

  const payrollData = useMemo(() => {
    if (!emp) return null;
    const basic = emp.payrollProfile?.basicSalary || 0;
    const isSemiMonthly = currentPeriod?.type?.includes('Semi');
    const cutoffBasic = isSemiMonthly ? basic / 2 : basic;
    const att = attendanceRecords.find(a => a.employeeId === emp.id && a.periodId === selectedPeriod) ||
                { daysWorked: 11, absences: 0, late: 0, otHours: 0, holidayWork: 0 };
    const otPay = (basic / 26 / 8) * 1.25 * att.otHours;
    const holidayPay = (basic / 26) * att.holidayWork;
    const allowances = 2500;
    const special = specialEarnings
      .filter(se => se.employeeId === emp.id && se.periodId === selectedPeriod)
      .reduce((sum, se) => sum + se.amount, 0);
    const deminimis = 2000;
    const gross = cutoffBasic + otPay + holidayPay + allowances + special + deminimis;
    const taxableGross = gross - deminimis - special;
    const sss = Math.min(gross * 0.045, 1350);
    const ph = Math.min(gross * 0.025, 900);
    const hdmf = 100;
    const tax = Math.max((taxableGross - sss - ph - hdmf - (isSemiMonthly ? 10416 : 20833)) * 0.20, 0);
    const absencesDed = (basic / 26) * att.absences;
    const totalDeductions = sss + ph + hdmf + tax + absencesDed;
    const netPay = gross - totalDeductions;
    return { cutoffBasic, otPay, holidayPay, allowances, special, deminimis, gross, sss, ph, hdmf, tax, totalDeductions, netPay, attendance: att };
  }, [emp, selectedPeriod, currentPeriod]);

  const formatCurrency = (val) => `₱${val.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;


  const filterOptions = createFilterOptions({
    stringify: (option) => `${option.firstName} ${option.lastName} ${option.id} ${option.designation}`
  });

  return (
    <Box className="page-container">
      {/* Search & Profile Bar */}
      <Card sx={{ mb: 3, borderRadius: 3,borderTop: `3px solid #d4a843`, boxShadow: '0 4px 24px rgba(0,0,0,0.06)', overflow: 'visible' }}>
        <CardContent sx={{ p: 0 }}>
            <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
                    <Autocomplete
                        size="small"
                        options={employees || []}
                        getOptionLabel={(option) => `${option.firstName} ${option.lastName} (${option.id})`}
                        value={null}
                        onChange={(event, newValue) => {
                          if (newValue) {
                            const index = employees.findIndex(e => e.id === newValue.id);
                            setSelectedEmployee(index);
                          }
                        }}
                        renderInput={(params) => (
                            <TextField 
                                {...params} 
                                label="Search Employee Name or ID" 
                                sx={{ minWidth: 350, '& .MuiOutlinedInput-root': { borderRadius: 2 } }} 
                            />
                        )}
                    />
                </Box>
                <Box sx={{ display: 'flex', gap: 1.5 }}>
                    <Button 
                        variant="outlined" 
                        color="error"
                        startIcon={<ExitIcon />}
                        onClick={() => setOpenResignation(true)}
                        sx={{ borderRadius: 2, textTransform: 'none', px: 2.5 }}
                    >
                        Apply for Resignation
                    </Button>
                    <Button 
                        variant="outlined"
                        startIcon={<LeavesIcon />}
                        onClick={() => setIsLeaveFormOpen(true)}
                        sx={{ borderRadius: 2, textTransform: 'none', px: 2.5, borderColor: '#2e7d32', color: '#2e7d32', '&:hover': { bgcolor: 'rgba(46,125,50,0.05)', borderColor: '#2e7d32' } }}
                    >
                        Apply for Leave
                    </Button>
                    <Button 
                        variant="contained" 
                        startIcon={<PrintIcon />}
                        sx={{ background: 'linear-gradient(135deg, #05077E 0%, #0241FB 60%, #4470ED 100%)', borderRadius: 2, textTransform: 'none', px: 2.5, '&:hover': { bgcolor: '#012dc7' } }}
                    >
                        Print Profile
                    </Button>
                </Box>
            </Box>

            {emp && (
                <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 4, position: 'relative' }}>
                    <Box sx={{ position: 'relative' }}>
                        <Avatar 
                            sx={{ 
                                width: 90, 
                                height: 90, 
                                border: `4px solid #0241FB`,
                                boxShadow: '0 8px 16px rgba(2, 61, 251, 0.15)',
                                fontSize: '2rem',
                                fontWeight: 800,
                                background: 'linear-gradient(135deg, #05077E 0%, #0241FB 60%, #4470ED 100%)'
                            }}
                        >
                            {emp.firstName[0]}{emp.lastName[0]}
                        </Avatar>
                        <Chip 
                            label={emp.status || 'Active'} 
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
                            <Typography variant="caption" sx={{ fontWeight: 800, color: '#0241FB', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                {emp.employmentType || emp.employmentDetails?.employmentType || 'Employee'}
                            </Typography>
                            <Typography variant="h5" sx={{ fontWeight: 900, color: '#1a202c', mt: 0.5, lineHeight: 1.2 }}>
                                {emp.firstName} {emp.lastName}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                                Date Joined: {emp.employmentDate ? new Date(emp.employmentDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : (emp.employmentDetails?.dateHired ? new Date(emp.employmentDetails.dateHired).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '—')}
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
                                    <Typography noWrap sx={{ fontWeight: 800, color: '#2d3748', fontSize: '0.75rem' }} title={emp.designation}>{emp.designation}</Typography>
                                </Box>
                                <Box sx={{ minWidth: 0 }}>
                                    <Typography variant="caption" noWrap sx={{ fontWeight: 700, color: 'text.secondary', display: 'block', fontSize: '0.65rem' }}>DEPARTMENT</Typography>
                                    <Typography noWrap sx={{ fontWeight: 800, color: '#2d3748', fontSize: '0.75rem' }} title={emp.department}>{emp.department}</Typography>
                                </Box>
                                <Box sx={{ minWidth: 0 }}>
                                    <Typography variant="caption" noWrap sx={{ fontWeight: 700, color: 'text.secondary', display: 'block', fontSize: '0.65rem' }}>EMPLOYEE ID</Typography>
                                    <Typography noWrap sx={{ fontWeight: 900, color: '#0241FB', letterSpacing: '0.5px', fontSize: '0.75rem' }}>{emp.id}</Typography>
                                </Box>
                                <Box sx={{ minWidth: 0 }}>
                                    <Typography variant="caption" noWrap sx={{ fontWeight: 700, color: 'text.secondary', display: 'block', fontSize: '0.65rem' }}>JOB LEVEL</Typography>
                                    <Typography noWrap sx={{ fontWeight: 800, color: '#2d3748', fontSize: '0.75rem' }} title={emp.employmentDetails?.jobLevel || '—'}>{emp.employmentDetails?.jobLevel || '—'}</Typography>
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            )}
        </CardContent>
      </Card>


      <Grid container spacing={3}>
        {/* Detail Tabs */}
        <Grid item xs={12}>
          <Card sx={{ borderRadius: 3,borderTop: `3px solid #d4a843` }}>
            <CardContent sx={{ p: 2.5 }}>
              <Tabs
                value={tabValue}
                onChange={(_, v) => setTabValue(v)}
                variant="scrollable"
                scrollButtons="auto"
                sx={{
                  '& .MuiTab-root': { textTransform: 'none', fontWeight: 500, fontSize: '0.75rem', minHeight: 38, px: 1.5, minWidth: 'unset' },
                  '& .Mui-selected': { color: '#0241FB', fontWeight: 700 },
                  '& .MuiTabs-indicator': { backgroundColor: goldAccent, height: 3, borderRadius: '3px 3px 0 0' },
                }}
              >
                <Tab icon={<PersonIcon sx={{ fontSize: '1rem' }} />} iconPosition="start" label="Personal Info" />
                <Tab icon={<FamilyIcon sx={{ fontSize: '1rem' }} />} iconPosition="start" label="Family" />
                <Tab icon={<SchoolIcon sx={{ fontSize: '1rem' }} />} iconPosition="start" label="Education" />
                <Tab icon={<WorkIcon sx={{ fontSize: '1rem' }} />} iconPosition="start" label="Work Experience" />
                <Tab icon={<AlphalistIcon sx={{ fontSize: '1rem' }} />} iconPosition="start" label="Requirements" />
                <Tab icon={<WalletIcon sx={{ fontSize: '1rem' }} />} iconPosition="start" label="Payroll Overview" />
                <Tab icon={<LeavesIcon sx={{ fontSize: '1rem' }} />} iconPosition="start" label="Leave Summary" />
              </Tabs>

              {/* Personal Info */}
              <TabPanel value={tabValue} index={0}>
                <Grid container spacing={2}>
                  {[
                    ['Birthdate', new Date(emp.personal.birthdate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })],
                    ['Birthplace', emp.personal.birthplace],
                    ['Gender', emp.personal.gender],
                    ['Civil Status', emp.personal.civilStatus],
                    ['Religion', emp.personal.religion],
                    ['Citizenship', emp.personal.citizenship],
                    ['Height', emp.personal.height],
                    ['Weight', emp.personal.weight],
                    ['Blood Type', emp.personal.bloodType],
                  ].map(([label, val]) => (
                    <Grid item xs={12} sm={6} key={label}>
                      <InfoRow label={label} value={val} />
                    </Grid>
                  ))}
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" sx={{ color: '#0241FB', fontWeight: 600, mt: 2, mb: 1 }}>Present Address</Typography>
                    <InfoRow label="Address" value={emp.personal.presentAddress} />
                    <InfoRow label="Tenureship" value={emp.personal.tenureship} />
                    <InfoRow label="Zipcode" value={emp.personal.presentZipcode} />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" sx={{ color: '#0241FB', fontWeight: 600, mt: 1, mb: 1 }}>Permanent Address</Typography>
                    <InfoRow label="Address" value={emp.personal.permanentAddress} />
                    <InfoRow label="Zipcode" value={emp.personal.permanentZipcode} />
                  </Grid>
                  <Grid item xs={12}>
                    <InfoRow label="Contact" value={emp.personal.contactNumbers.join(', ')} />
                  </Grid>
                  <Grid item xs={12}>
                    <InfoRow label="Email" value={emp.personal.emailAddresses.join(', ')} />
                  </Grid>
                </Grid>

                <Typography variant="subtitle2" sx={{ color: '#0241FB', fontWeight: 600, mt: 3, mb: 1.5 }}>
                  Requirements Document Upload
                </Typography>
                <Grid container spacing={2}>
                  {[
                    { label: 'Tin ID', key: 'tinId' },
                    { label: 'SSS ID / E1', key: 'sss' },
                    { label: 'Philhealth ID / MDR', key: 'philhealth' },
                    { label: 'HDMF ID/MDF', key: 'hdmf' },
                    { label: 'NBI Clearance', key: 'nbi' },
                  ].map((item) => (
                    <Grid item xs={12} sm={4} key={item.key}>
                      <Box sx={{
                        p: 1.5,
                        border: '1px dashed rgba(0,0,0,0.12)',
                        borderRadius: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 0.5,
                        '&:hover': { borderColor: '#d4a843', bgcolor: 'rgba(212,168,67,0.02)' }
                      }}>
                        <Typography variant="caption" sx={{ fontWeight: 600 }}>{item.label}</Typography>
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<UploadIcon sx={{ fontSize: '0.9rem !important' }} />}
                          component="label"
                          sx={{
                            borderColor: 'rgba(0,0,0,0.12)',
                            color: 'text.secondary',
                            textTransform: 'none',
                            fontSize: '0.7rem',
                            py: 0.2,
                            '&:hover': { borderColor: '#d4a843', color: '#d4a843' }
                          }}
                        >
                          Upload
                          <input type="file" hidden />
                        </Button>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </TabPanel>

              {/* Family */}
              <TabPanel value={tabValue} index={1}>
                {emp.family.spouse && (
                  <Box sx={{ mb: 2.5 }}>
                    <Typography variant="subtitle2" sx={{ color: '#0241FB', fontWeight: 600, mb: 1 }}>Spouse</Typography>
                    <InfoRow label="Name" value={emp.family.spouse.name} />
                    <InfoRow label="Birthdate" value={emp.family.spouse.birthdate} />
                    <InfoRow label="Occupation" value={emp.family.spouse.occupation} />
                    <InfoRow label="Contact" value={emp.family.spouse.contact} />
                    <InfoRow label="Address" value={emp.family.spouse.address} />
                    <InfoRow label="Business Address" value={emp.family.spouse.businessAddress} />
                    <InfoRow label="Number of Children" value={emp.family.spouse.numChildren} />
                  </Box>
                )}
                <Box sx={{ mb: 2.5 }}>
                  <Typography variant="subtitle2" sx={{ color: '#0241FB', fontWeight: 600, mb: 1 }}>Parents</Typography>
                  <InfoRow label="Father" value={`${emp.family.father.name} (${emp.family.father.birthdate}) — ${emp.family.father.occupation}`} />
                  <InfoRow label="Mother" value={`${emp.family.mother.name} (${emp.family.mother.birthdate}) — ${emp.family.mother.occupation}`} />
                </Box>
                {emp.family.children.length > 0 && (
                  <Box>
                    <Typography variant="subtitle2" sx={{ color: '#0241FB', fontWeight: 600, mb: 1 }}>Children</Typography>
                    <TableContainer sx={{
                      overflowX: 'auto',
                      '&::-webkit-scrollbar': { height: 6 },
                      '&::-webkit-scrollbar-thumb': { bgcolor: 'rgba(0,0,0,0.1)', borderRadius: 3 }
                    }}>
                      <Table size="small" sx={{ minWidth: 600 }}>
                        <TableHead>
                          <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Birthdate</TableCell>
                            <TableCell>School</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {emp.family.children.map((child, i) => (
                            <TableRow key={i}>
                              <TableCell sx={{ fontWeight: 500 }}>{child.name}</TableCell>
                              <TableCell>{child.birthdate}</TableCell>
                              <TableCell>{child.school}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Box>
                )}
              </TabPanel>

              {/* Education */}
              <TabPanel value={tabValue} index={2}>
                <TableContainer sx={{
                  overflowX: 'auto',
                  '&::-webkit-scrollbar': { height: 6 },
                  '&::-webkit-scrollbar-thumb': { bgcolor: 'rgba(0,0,0,0.1)', borderRadius: 3 }
                }}>
                  <Table size="small" sx={{ minWidth: 900 }}>
                    <TableHead>
                      <TableRow>
                        <TableCell>Level</TableCell>
                        <TableCell>School</TableCell>
                        <TableCell>Degree</TableCell>
                        <TableCell>Area of Study</TableCell>
                        <TableCell>Distinction</TableCell>
                        <TableCell>Units</TableCell>
                        <TableCell>From</TableCell>
                        <TableCell>To</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {emp.education.map((ed, i) => (
                        <TableRow key={i}>
                          <TableCell sx={{ fontWeight: 500 }}>{ed.level}</TableCell>
                          <TableCell>{ed.school}</TableCell>
                          <TableCell>{ed.degree || '—'}</TableCell>
                          <TableCell>{ed.areaOfStudy || '—'}</TableCell>
                          <TableCell>{ed.distinction || '—'}</TableCell>
                          <TableCell>{ed.units || '—'}</TableCell>
                          <TableCell>{ed.from || '—'}</TableCell>
                          <TableCell>{ed.till || '—'}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </TabPanel>

              {/* Work Experience */}
              <TabPanel value={tabValue} index={3}>
                <TableContainer sx={{
                  overflowX: 'auto',
                  '&::-webkit-scrollbar': { height: 6 },
                  '&::-webkit-scrollbar-thumb': { bgcolor: 'rgba(0,0,0,0.1)', borderRadius: 3 }
                }}>
                  <Table size="small" sx={{ minWidth: 800 }}>
                    <TableHead>
                      <TableRow>
                        <TableCell>Company</TableCell>
                        <TableCell>Position</TableCell>
                        <TableCell>Salary</TableCell>
                        <TableCell>From</TableCell>
                        <TableCell>To</TableCell>
                        <TableCell>Reason for Leaving</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {emp.workExperience.map((wx, i) => (
                        <TableRow key={i}>
                          <TableCell sx={{ fontWeight: 500 }}>{wx.company}</TableCell>
                          <TableCell>{wx.position}</TableCell>
                          <TableCell>{wx.salary || '—'}</TableCell>
                          <TableCell>{wx.from}</TableCell>
                          <TableCell>{wx.to}</TableCell>
                          <TableCell>{wx.reason}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>

                {emp.references.length > 0 && (
                  <Box sx={{ mt: 3 }}>
                    <Typography variant="subtitle2" sx={{ color: '#0241FB', fontWeight: 600, mb: 1 }}>References</Typography>
                    <TableContainer sx={{
                      overflowX: 'auto',
                      '&::-webkit-scrollbar': { height: 6 },
                      '&::-webkit-scrollbar-thumb': { bgcolor: 'rgba(0,0,0,0.1)', borderRadius: 3 }
                    }}>
                      <Table size="small" sx={{ minWidth: 700 }}>
                        <TableHead>
                          <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Position</TableCell>
                            <TableCell>Address / Company</TableCell>
                            <TableCell>Contact</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {emp.references.map((ref, i) => (
                            <TableRow key={i}>
                              <TableCell sx={{ fontWeight: 500 }}>{ref.name}</TableCell>
                              <TableCell>{ref.position}</TableCell>
                              <TableCell>{ref.addressCompany || '—'}</TableCell>
                              <TableCell>{ref.contact}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Box>
                )}
              </TabPanel>

              {/* Requirements */}
              <TabPanel value={tabValue} index={4}>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 600 }}>Requirement</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Document Number</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {[
                        ['Tin ID', emp.requirements.tinId, emp.requirements.tinNo],
                        ['SSS', emp.requirements.sss, emp.requirements.sssNo],
                        ['Philhealth', emp.requirements.philhealth, emp.requirements.philhealthNo],
                        ['HDMF (Pag-IBIG)', emp.requirements.hdmf, emp.requirements.hdmfNo],
                        ['NBI Clearance', emp.requirements.nbi, emp.requirements.nbiNo],
                      ].map(([label, status, docNo], i) => (
                        <TableRow key={i}>
                          <TableCell sx={{ fontWeight: 500 }}>{label}</TableCell>
                          <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>{docNo}</TableCell>
                          <TableCell>
                            <Chip
                              label={status}
                              size="small"
                              sx={{
                                fontWeight: 600,
                                bgcolor: status === 'Submitted' ? '#e8f5e9' : '#fff3e0',
                                color: status === 'Submitted' ? '#2e7d32' : '#ef6c00',
                                fontSize: '0.72rem',
                              }}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </TabPanel>

              {/* Payroll Overview */}
              <TabPanel value={tabValue} index={5}>
                {/* Period Selector */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                  <FormControl size="small" sx={{ minWidth: 280 }}>
                    <InputLabel>Payroll Period</InputLabel>
                    <Select
                      value={selectedPeriod}
                      label="Payroll Period"
                      onChange={(e) => setSelectedPeriod(e.target.value)}
                    >
                      {payrollPeriods.map(p => (
                        <MenuItem key={p.id} value={p.id}>{p.startDate} – {p.endDate} ({p.type})</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>

                {payrollData ? (
                  <Grid container spacing={3}>
                    {/* Summary Cards */}
                    <Grid item xs={12} md={4}>
                      <Card sx={{ borderRadius: 3, border: '1px solid rgba(0,0,0,0.06)', height: '100%' }}>
                        <CardContent sx={{ p: 2.5 }}>
                          <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Gross Pay</Typography>
                          <Typography variant="h5" sx={{ fontWeight: 800, color: '#2e7d32', mt: 0.5 }}>{formatCurrency(payrollData.gross)}</Typography>
                          <Stack direction="row" spacing={0.5} sx={{ mt: 1.5 }}>
                            <Chip label="Before Tax" size="small" variant="outlined" sx={{ fontSize: '0.65rem' }} />
                            <Chip label="All Credits" size="small" variant="outlined" sx={{ fontSize: '0.65rem' }} />
                          </Stack>
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Card sx={{ borderRadius: 3, border: '1px solid rgba(0,0,0,0.06)', height: '100%' }}>
                        <CardContent sx={{ p: 2.5 }}>
                          <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Deductions</Typography>
                          <Typography variant="h5" sx={{ fontWeight: 800, color: '#d32f2f', mt: 0.5 }}>{formatCurrency(payrollData.totalDeductions)}</Typography>
                          <Stack direction="row" spacing={0.5} sx={{ mt: 1.5 }}>
                            <Chip label="Tax + Statutory" size="small" variant="outlined" sx={{ fontSize: '0.65rem' }} />
                          </Stack>
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Card sx={{ borderRadius: 3, background: 'linear-gradient(135deg, #05077E 0%, #0241FB 60%, #4470ED 100%)', color: '#FDFDFC', height: '100%' }}>
                        <CardContent sx={{ p: 2.5 }}>
                          <Typography variant="caption" sx={{ fontWeight: 700, opacity: 0.8, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Net Take-Home Pay</Typography>
                          <Typography variant="h4" sx={{ fontWeight: 800, mt: 0.5 }}>{formatCurrency(payrollData.netPay)}</Typography>
                          <Typography variant="caption" sx={{ display: 'block', opacity: 0.7, mt: 1 }}>Credited to Payroll Account</Typography>
                        </CardContent>
                      </Card>
                    </Grid>

                    {/* Breakdown & Sidebar */}
                    <Grid item xs={12} lg={8}>
                      <Card sx={{ borderRadius: 3, border: '1px solid rgba(0,0,0,0.06)' }}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                          <Tabs
                            value={payrollTabValue}
                            onChange={(e, v) => setPayrollTabValue(v)}
                            sx={{
                              px: 2,
                              '& .MuiTab-root': { textTransform: 'none', fontWeight: 600, fontSize: '0.82rem', minHeight: 40 },
                              '& .Mui-selected': { color: '#0241FB' },
                              '& .MuiTabs-indicator': { backgroundColor: goldAccent, height: 3, borderRadius: '3px 3px 0 0' },
                            }}
                          >
                            <Tab label="Pay" />
                            <Tab label="Deductions" />
                            <Tab label="Bonuses" />
                          </Tabs>
                        </Box>
                        <CardContent sx={{ p: 0 }}>
                          {payrollTabValue === 0 && (
                            <TableContainer>
                              <Table size="small">
                                <TableBody>
                                  <TableRow>
                                    <TableCell sx={{ fontWeight: 600 }}>Basic Salary (Current Period)</TableCell>
                                    <TableCell align="right">{formatCurrency(payrollData.cutoffBasic)}</TableCell>
                                  </TableRow>
                                  <TableRow>
                                    <TableCell sx={{ fontWeight: 600 }}>De Minimis</TableCell>
                                    <TableCell align="right" sx={{ color: '#0241FB', fontWeight: 600 }}>+{formatCurrency(payrollData.deminimis)}</TableCell>
                                  </TableRow>
                                  <TableRow sx={{ bgcolor: 'rgba(46,125,50,0.05)' }}>
                                    <TableCell sx={{ fontWeight: 800 }}>Total Pay</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 800, color: '#2e7d32' }}>{formatCurrency(payrollData.gross - payrollData.special)}</TableCell>
                                  </TableRow>
                                </TableBody>
                              </Table>
                            </TableContainer>
                          )}
                          {payrollTabValue === 1 && (
                            <TableContainer>
                              <Table size="small">
                                <TableBody>
                                  {[['SSS Contribution (Employee Share)', payrollData.sss], ['PhilHealth Contribution', payrollData.ph], ['Pag-IBIG Premium', payrollData.hdmf], ['Withholding Tax', payrollData.tax], ['APECC SAVINGS', 0], ['APECC SHARE', 0], ['APECC LOAN', 0]].map(([label, val]) => (
                                    <TableRow key={label}>
                                      <TableCell sx={{ fontWeight: 600 }}>{label}</TableCell>
                                      <TableCell align="right" sx={{ color: '#d32f2f' }}>-{formatCurrency(val)}</TableCell>
                                    </TableRow>
                                  ))}
                                  <TableRow sx={{ bgcolor: 'rgba(211,47,47,0.05)' }}>
                                    <TableCell sx={{ fontWeight: 800 }}>Total Deductions</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 800, color: '#d32f2f' }}>{formatCurrency(payrollData.totalDeductions)}</TableCell>
                                  </TableRow>
                                </TableBody>
                              </Table>
                            </TableContainer>
                          )}
                          {payrollTabValue === 2 && (
                            <TableContainer>
                              <Table size="small">
                                <TableBody>
                                  <TableRow>
                                    <TableCell sx={{ fontWeight: 600 }}>13th Month</TableCell>
                                    <TableCell align="right" sx={{ color: '#0241FB', fontWeight: 700 }}>+{formatCurrency(payrollData.special)}</TableCell>
                                  </TableRow>
                                  {['Level 1 - Probationary', 'Level 2- upon regularization'].includes(emp.employmentDetails?.jobLevel) && (
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
                      <Stack spacing={2.5}>
                        <Card sx={{ borderRadius: 3, bgcolor: '#f8fafc' }}>
                          <CardContent sx={{ p: 2.5 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                              <InfoIcon color="primary" fontSize="small" /> Payroll Context
                            </Typography>
                            <Stack spacing={1.5}>
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
                                <Typography variant="body2" color="text.secondary">Status</Typography>
                                <Chip label="Verified & Paid" size="small" color="success" />
                              </Box>
                            </Stack>
                          </CardContent>
                        </Card>

                        <Card sx={{ borderRadius: 3, bgcolor: 'rgba(212,168,67,0.05)', border: `1px solid ${goldAccent}33` }}>
                          <CardContent sx={{ p: 2.5 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1, color: goldAccent }}>Tax Cap Status</Typography>
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
                ) : (
                  <Box sx={{ textAlign: 'center', py: 6, color: 'text.secondary' }}>
                    <WalletIcon sx={{ fontSize: 48, opacity: 0.3, mb: 1 }} />
                    <Typography variant="body2">No payroll data available for this period.</Typography>
                  </Box>
                )}

                {/* ─── Payroll History ─── */}
                <Box sx={{ mt: 4 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0241FB' }}>
                      Payroll History
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1.5 }}>
                      <FormControl size="small" sx={{ minWidth: 140 }}>
                        <InputLabel>Month</InputLabel>
                        <Select
                          value={historyMonth}
                          label="Month"
                          onChange={(e) => setHistoryMonth(e.target.value)}
                        >
                          {historyMonths.map((m, i) => (
                            <MenuItem key={i} value={i}>{m}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      <FormControl size="small" sx={{ minWidth: 100 }}>
                        <InputLabel>Year</InputLabel>
                        <Select
                          value={historyYear}
                          label="Year"
                          onChange={(e) => setHistoryYear(e.target.value)}
                        >
                          {historyYears.map(y => (
                            <MenuItem key={y} value={y}>{y}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Box>
                  </Box>

                  {(() => {
                    const histRecords = payrollRecords.filter(
                      r => r.employeeId === emp?.id && r.year === historyYear && r.monthIndex === historyMonth
                    );
                    if (histRecords.length === 0) {
                      return (
                        <Box sx={{ textAlign: 'center', py: 5, color: 'text.secondary', bgcolor: 'rgba(0,0,0,0.02)', borderRadius: 2, border: '1px dashed rgba(0,0,0,0.1)' }}>
                          <WalletIcon sx={{ fontSize: 40, opacity: 0.25, mb: 1 }} />
                          <Typography variant="body2">No payroll record for {historyMonths[historyMonth]} {historyYear}.</Typography>
                        </Box>
                      );
                    }
                    return (
                      <TableContainer component={Paper} sx={{ borderRadius: 2, border: '1px solid rgba(0,0,0,0.08)', overflowX: 'auto',
                        '&::-webkit-scrollbar': { height: 6 },
                        '&::-webkit-scrollbar-thumb': { bgcolor: 'rgba(0,0,0,0.12)', borderRadius: 3 }
                      }}>
                        <Table size="small" sx={{ minWidth: 1100 }}>
                          <TableHead>
                            <TableRow sx={{ background: 'linear-gradient(135deg, #05077E 0%, #0241FB 60%, #4470ED 100%)' }}>
                              {[
                                'Period', 'Basic Pay', 'De Minimis', 'Total Income',
                                'SSS (EE)', 'PhilHealth (EE)', 'Pag-IBIG (EE)', 'Tax',
                                'Savings', 'Salary Loan', 'STL', 'LWOP',
                                'Total Deductions', 'Net Pay', 'Status'
                              ].map(h => (
                                <TableCell key={h} sx={{ color: '#fff', fontWeight: 700, fontSize: '0.68rem', whiteSpace: 'nowrap', py: 1, px: 1.5, border: '1px solid rgba(255,255,255,0.1)' }}>{h}</TableCell>
                              ))}
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {histRecords.map((r, i) => (
                              <TableRow key={r.id} hover sx={{ '&:hover': { bgcolor: 'rgba(2,65,251,0.03)' } }}>
                                <TableCell sx={{ fontSize: '0.75rem', fontWeight: 600, whiteSpace: 'nowrap', px: 1.5 }}>{r.month} {r.year}</TableCell>
                                <TableCell align="right" sx={{ fontSize: '0.75rem', px: 1.5 }}>₱{r.basicPay.toLocaleString('en-PH', { minimumFractionDigits: 2 })}</TableCell>
                                <TableCell align="right" sx={{ fontSize: '0.75rem', px: 1.5, color: '#0241FB' }}>₱{(r.deminimis||0).toLocaleString('en-PH', { minimumFractionDigits: 2 })}</TableCell>
                                <TableCell align="right" sx={{ fontSize: '0.75rem', px: 1.5, fontWeight: 700, color: '#2e7d32' }}>₱{r.totalIncome.toLocaleString('en-PH', { minimumFractionDigits: 2 })}</TableCell>
                                <TableCell align="right" sx={{ fontSize: '0.75rem', px: 1.5, color: '#d32f2f' }}>₱{(r.sssEE||0).toLocaleString('en-PH', { minimumFractionDigits: 2 })}</TableCell>
                                <TableCell align="right" sx={{ fontSize: '0.75rem', px: 1.5, color: '#d32f2f' }}>₱{(r.phEE||0).toLocaleString('en-PH', { minimumFractionDigits: 2 })}</TableCell>
                                <TableCell align="right" sx={{ fontSize: '0.75rem', px: 1.5, color: '#d32f2f' }}>₱{(r.hdmfEE||0).toLocaleString('en-PH', { minimumFractionDigits: 2 })}</TableCell>
                                <TableCell align="right" sx={{ fontSize: '0.75rem', px: 1.5, color: '#d32f2f' }}>₱{(r.tax||0).toLocaleString('en-PH', { minimumFractionDigits: 2 })}</TableCell>
                                <TableCell align="right" sx={{ fontSize: '0.75rem', px: 1.5, color: '#d32f2f' }}>₱{(r.savings||0).toLocaleString('en-PH', { minimumFractionDigits: 2 })}</TableCell>
                                <TableCell align="right" sx={{ fontSize: '0.75rem', px: 1.5, color: '#d32f2f' }}>₱{(r.salaryLoan||0).toLocaleString('en-PH', { minimumFractionDigits: 2 })}</TableCell>
                                <TableCell align="right" sx={{ fontSize: '0.75rem', px: 1.5, color: '#d32f2f' }}>₱{(r.stl||0).toLocaleString('en-PH', { minimumFractionDigits: 2 })}</TableCell>
                                <TableCell align="right" sx={{ fontSize: '0.75rem', px: 1.5, color: '#d32f2f' }}>₱{(r.lwop||0).toLocaleString('en-PH', { minimumFractionDigits: 2 })}</TableCell>
                                <TableCell align="right" sx={{ fontSize: '0.75rem', px: 1.5, fontWeight: 700, color: '#d32f2f' }}>₱{r.totalDeduction.toLocaleString('en-PH', { minimumFractionDigits: 2 })}</TableCell>
                                <TableCell align="right" sx={{ fontSize: '0.75rem', px: 1.5, fontWeight: 800, color: '#0241FB' }}>₱{r.netPay.toLocaleString('en-PH', { minimumFractionDigits: 2 })}</TableCell>
                                <TableCell sx={{ px: 1.5 }}>
                                  <Chip label={r.status || 'Paid'} size="small" sx={{ fontWeight: 700, fontSize: '0.65rem', bgcolor: 'rgba(46,125,50,0.1)', color: '#2e7d32' }} />
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    );
                  })()}
                </Box>
              </TabPanel>

              {/* Leave Summary */}
              <TabPanel value={tabValue} index={6}>
                {/* Summary Stat Cards */}
                <Grid container spacing={2.5} sx={{ mb: 3 }}>
                  <Grid item xs={12} sm={4}>
                    <Card sx={{ borderRadius: 3, background: 'linear-gradient(135deg, #05077E 0%, #4470ED 100%)', color: '#FDFDFC' }}>
                      <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 2 }}>
                        <Box>
                          <Typography variant="body2" sx={{ opacity: 0.8 }}>Pending Applications</Typography>
                          <Typography variant="h4" sx={{ fontWeight: 800 }}>{employeeLeaves.filter(l => l.status === 'Pending').length}</Typography>
                        </Box>
                        <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}><LeavesIcon /></Avatar>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Card sx={{ borderRadius: 3, background: 'linear-gradient(135deg, #2e7d32 0%, #4caf50 100%)', color: '#FDFDFC' }}>
                      <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 2 }}>
                        <Box>
                          <Typography variant="body2" sx={{ opacity: 0.8 }}>Remaining Credits</Typography>
                          <Typography variant="h4" sx={{ fontWeight: 800 }}>{employeeBalances.reduce((acc, b) => acc + (b.remaining || 0), 0)}</Typography>
                        </Box>
                        <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}><WalletIcon /></Avatar>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Card sx={{ borderRadius: 3, background: 'linear-gradient(135deg, #c62828 0%, #ef5350 100%)', color: '#FDFDFC' }}>
                      <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 2 }}>
                        <Box>
                          <Typography variant="body2" sx={{ opacity: 0.8 }}>Active Sanctions</Typography>
                          <Typography variant="h4" sx={{ fontWeight: 800 }}>{employeeSanctions.filter(s => s.status === 'Active').length}</Typography>
                        </Box>
                        <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}><SanctionsIcon /></Avatar>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>

                {/* History + Sidebar */}
                <Grid container spacing={2.5}>
                  {/* Leave Application Monitoring */}
                  <Grid item xs={12} md={8}>
                    <Card sx={{ borderRadius: 3, border: '1px solid rgba(0,0,0,0.06)' }}>
                      <CardContent sx={{ p: 0 }}>
                        <Box sx={{ px: 2.5, pt: 2.5, pb: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0241FB' }}>Leave Application Tracker</Typography>
                          <Typography variant="caption" color="text.secondary">Click a row to view approval chain</Typography>
                        </Box>
                        {(() => {
                          // Merge static leaveRecords + submitted ones from onboardingRecords
                          const submittedLeaves = onboardingRecords
                            .filter(r => r.type === 'Leave' && r.employeeData?.id === emp?.id)
                            .map(r => ({
                              id: r.id,
                              type: r.employeeData?.leaveDetails?.designation || 'Leave',
                              startDate: r.employeeData?.leaveDetails?.startDate || r.submittedDate,
                              endDate: r.employeeData?.leaveDetails?.endDate || r.submittedDate,
                              days: r.employeeData?.leaveDetails?.days || '—',
                              reason: r.employeeData?.leaveDetails?.reason || '—',
                              status: r.status,
                              approvalChain: r.approvalChain,
                              submittedDate: r.submittedDate,
                              _isQueued: true,
                            }));

                          const staticLeaves = employeeLeaves.map(l => ({
                            ...l,
                            approvalChain: [
                              { role: 'HR Officer', status: l.status === 'Approved' ? 'Approved' : l.status === 'Declined' ? 'Declined' : 'Pending', date: l.startDate, remarks: '' },
                              { role: 'Unit Manager', status: l.status === 'Approved' ? 'Approved' : 'Pending', date: '', remarks: '' },
                            ],
                            _isQueued: false,
                          }));

                          const allLeaves = [...submittedLeaves, ...staticLeaves];

                          const statusColor = (s) => {
                            if (!s) return { bg: 'rgba(0,0,0,0.06)', color: '#555' };
                            const sl = s.toLowerCase();
                            if (sl.includes('approved') || sl === 'paid') return { bg: 'rgba(46,125,50,0.1)', color: '#2e7d32' };
                            if (sl.includes('declined') || sl.includes('reject')) return { bg: 'rgba(211,47,47,0.1)', color: '#d32f2f' };
                            if (sl.includes('pending') || sl.includes('officer')) return { bg: 'rgba(237,108,2,0.1)', color: '#ed6c02' };
                            if (sl.includes('manager') || sl.includes('unit')) return { bg: 'rgba(2,65,251,0.08)', color: '#0241FB' };
                            return { bg: 'rgba(0,0,0,0.06)', color: '#555' };
                          };

                          if (allLeaves.length === 0) return (
                            <Box sx={{ textAlign: 'center', py: 6, color: 'text.secondary' }}>
                              <LeavesIcon sx={{ fontSize: 44, opacity: 0.2, mb: 1 }} />
                              <Typography variant="body2">No leave applications found.</Typography>
                            </Box>
                          );

                          return (
                            <TableContainer sx={{ maxHeight: 420, '&::-webkit-scrollbar': { width: 5 }, '&::-webkit-scrollbar-thumb': { bgcolor: 'rgba(0,0,0,0.1)', borderRadius: 3 } }}>
                              <Table stickyHeader size="small">
                                <TableHead>
                                  <TableRow>
                                    {['Leave Type', 'Start', 'End', 'Days', 'Reason', 'Status', ''].map(h => (
                                      <TableCell key={h} sx={{ fontWeight: 700, bgcolor: '#0241FB', color: '#FDFDFC', fontSize: '0.72rem', whiteSpace: 'nowrap', py: 1 }}>{h}</TableCell>
                                    ))}
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {allLeaves.map((l, i) => {
                                    const isExpanded = expandedLeaveRow === i;
                                    const sc = statusColor(l.status);
                                    return (
                                      <React.Fragment key={i}>
                                        <TableRow
                                          hover
                                          onClick={() => setExpandedLeaveRow(isExpanded ? null : i)}
                                          sx={{ cursor: 'pointer', bgcolor: isExpanded ? 'rgba(2,65,251,0.03)' : 'inherit', '&:hover': { bgcolor: 'rgba(2,65,251,0.04)' } }}
                                        >
                                          <TableCell sx={{ fontWeight: 700, fontSize: '0.78rem' }}>{l.type}</TableCell>
                                          <TableCell sx={{ fontSize: '0.75rem', whiteSpace: 'nowrap' }}>{l.startDate}</TableCell>
                                          <TableCell sx={{ fontSize: '0.75rem', whiteSpace: 'nowrap' }}>{l.endDate}</TableCell>
                                          <TableCell sx={{ fontSize: '0.75rem', textAlign: 'center' }}>{l.days}</TableCell>
                                          <TableCell sx={{ fontSize: '0.75rem', maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={l.reason}>{l.reason || '—'}</TableCell>
                                          <TableCell>
                                            <Chip label={l.status} size="small" sx={{ fontWeight: 700, fontSize: '0.65rem', bgcolor: sc.bg, color: sc.color }} />
                                          </TableCell>
                                          <TableCell sx={{ textAlign: 'center', color: '#0241FB', fontSize: '0.7rem', fontWeight: 700 }}>
                                            {isExpanded ? '▲' : '▼'}
                                          </TableCell>
                                        </TableRow>
                                        {isExpanded && (
                                          <TableRow>
                                            <TableCell colSpan={7} sx={{ py: 0, px: 2, bgcolor: 'rgba(2,65,251,0.02)', borderBottom: '2px solid rgba(2,65,251,0.1)' }}>
                                              <Box sx={{ py: 2 }}>
                                                <Typography variant="caption" sx={{ fontWeight: 800, color: '#0241FB', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', mb: 1.5 }}>
                                                  Approval Chain Progress
                                                </Typography>
                                                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                                  {(l.approvalChain || []).filter(s => s.role !== 'Employee Action').map((step, si) => {
                                                    const ssc = statusColor(step.status);
                                                    return (
                                                      <Box key={si} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                        <Box sx={{ p: 1.5, borderRadius: 2, border: `1px solid ${ssc.color}22`, bgcolor: ssc.bg, minWidth: 120 }}>
                                                          <Typography variant="caption" sx={{ fontWeight: 800, color: ssc.color, display: 'block' }}>{step.role}</Typography>
                                                          <Chip label={step.status || 'Pending'} size="small" sx={{ mt: 0.5, fontWeight: 700, fontSize: '0.6rem', bgcolor: ssc.bg, color: ssc.color, border: `1px solid ${ssc.color}44` }} />
                                                          {step.date && <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary', mt: 0.5, fontSize: '0.62rem' }}>{step.date}</Typography>}
                                                          {step.remarks && <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary', fontSize: '0.62rem', fontStyle: 'italic' }}>{step.remarks}</Typography>}
                                                        </Box>
                                                        {si < (l.approvalChain || []).filter(s => s.role !== 'Employee Action').length - 1 && (
                                                          <Typography sx={{ color: 'text.disabled', fontWeight: 800, fontSize: '1rem' }}>→</Typography>
                                                        )}
                                                      </Box>
                                                    );
                                                  })}
                                                </Box>
                                              </Box>
                                            </TableCell>
                                          </TableRow>
                                        )}
                                      </React.Fragment>
                                    );
                                  })}
                                </TableBody>
                              </Table>
                            </TableContainer>
                          );
                        })()}
                      </CardContent>
                    </Card>
                  </Grid>

                  {/* Credits & Sanctions */}
                  <Grid item xs={12} md={4}>
                    <Stack spacing={2.5}>
                      <Card sx={{ borderRadius: 3, border: '1px solid rgba(0,0,0,0.06)' }}>
                        <CardContent>
                          <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>Leave Credit Details</Typography>
                          <Table size="small">
                            <TableHead>
                              <TableRow>
                                <TableCell sx={{ fontWeight: 700 }}>Type</TableCell>
                                <TableCell align="center" sx={{ fontWeight: 700 }}>Used</TableCell>
                                <TableCell align="center" sx={{ fontWeight: 700 }}>Rem.</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {employeeBalances.length > 0 ? employeeBalances.map((lb, i) => (
                                <TableRow key={i}>
                                  <TableCell sx={{ fontSize: '0.8rem' }}>{lb.type}</TableCell>
                                  <TableCell align="center" sx={{ fontSize: '0.8rem', color: '#d32f2f' }}>{lb.used}</TableCell>
                                  <TableCell align="center" sx={{ fontSize: '0.8rem', fontWeight: 600, color: '#2e7d32' }}>{lb.remaining}</TableCell>
                                </TableRow>
                              )) : (
                                <TableRow><TableCell colSpan={3} align="center" sx={{ color: 'text.secondary', py: 2 }}>No credits found.</TableCell></TableRow>
                              )}
                            </TableBody>
                          </Table>
                        </CardContent>
                      </Card>

                      <Card sx={{ borderRadius: 3, border: '1px solid rgba(0,0,0,0.06)' }}>
                        <CardContent>
                          <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>Active Sanctions</Typography>
                          {employeeSanctions.filter(s => s.status === 'Active').length > 0 ? (
                            employeeSanctions.filter(s => s.status === 'Active').map((s, i) => (
                              <Box key={i} sx={{ p: 1, borderLeft: '3px solid #d32f2f', bgcolor: 'rgba(211,47,47,0.05)', mb: 1, borderRadius: '0 4px 4px 0' }}>
                                <Typography variant="body2" sx={{ fontWeight: 700 }}>{s.type}</Typography>
                                <Typography variant="caption" sx={{ display: 'block' }}>{s.reason}</Typography>
                                <Typography variant="caption" color="text.secondary">{s.date}</Typography>
                              </Box>
                            ))
                          ) : (
                            <Typography variant="body2" color="text.secondary">No active sanctions.</Typography>
                          )}
                        </CardContent>
                      </Card>
                    </Stack>
                  </Grid>
                </Grid>
              </TabPanel>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Leave Application Dialog */}
      <Dialog
        open={isLeaveFormOpen}
        onClose={() => setIsLeaveFormOpen(false)}
        maxWidth="md"
        fullWidth
        scroll="paper"
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogContent sx={{ p: 0 }}>
          <LeaveApplicationForm
            employee={emp}
            onCancel={() => setIsLeaveFormOpen(false)}
            onSubmit={(data) => {
              const today = new Date().toISOString().split('T')[0];
              const newId = `LV-${String(onboardingRecords.length + 1).padStart(3, '0')}`;
              const emp = employees[selectedEmployee];

              onboardingRecords.push({
                id: newId,
                type: 'Leave',
                submittedDate: today,
                submittedBy: 'System',
                status: 'Pending HR Officer',
                employeeData: {
                  ...emp,
                  leaveDetails: {
                    ...data,
                    submittedAt: today
                  }
                },
                approvalChain: [
                  { role: 'Employee Action', name: `${emp.firstName} ${emp.lastName}`, status: 'Submitted', date: today, remarks: `Applied for ${data.designation} Leave` },
                  { role: 'HR Officer', name: '', status: 'Pending', date: '', remarks: '' },
                  { role: 'Unit Manager', name: '', status: 'Pending', date: '', remarks: '' },
                  { role: 'Asst. General Manager', name: '', status: 'Pending', date: '', remarks: '' },
                ]
              });

              setIsLeaveFormOpen(false);
              setSuccessModal(true);
              setSuccessModalType('Leave');
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Exit Interview Dialog */}
      <Dialog open={openResignation} onClose={() => setOpenResignation(false)} maxWidth="md" fullWidth>
        <DialogContent dividers sx={{ p: 0 }}>
          <ExitInterviewForm 
            employee={emp}
            initialData={exitInterviewData}
            onCancel={() => setOpenResignation(false)}
            onSubmit={handleExitFormSubmit}
          />
        </DialogContent>
      </Dialog>

      {/* Submission Success Modal (Payroll Style) */}
      <Dialog 
        open={successModal} 
        onClose={() => setSuccessModal(false)} 
        maxWidth="xs" 
        fullWidth
        PaperProps={{ sx: { borderRadius: 4, p: 3, textAlign: 'center' } }}
      >
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center' }}>
          <MuiAvatar sx={{ width: 80, height: 80, bgcolor: 'rgba(46, 125, 50, 0.1)', color: '#2e7d32' }}>
            <ApproveIcon sx={{ fontSize: 50 }} />
          </MuiAvatar>
        </Box>
        <Typography variant="h5" sx={{ fontWeight: 800, color: '#2e7d32', mb: 2 }}>
          Submission Successful
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4, px: 2, lineHeight: 1.6 }}>
          {successModalType === 'Resignation' 
            ? 'Resignation application and Exit Interview forwarded to HR for review.' 
            : 'Leave application successfully submitted and forwarded to the approval queue.'}
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
          <Button 
            variant="outlined" 
            onClick={() => setSuccessModal(false)}
            sx={{ fontWeight: 700, borderRadius: 2, borderColor: 'rgba(0,0,0,0.15)', color: 'text.secondary', px: 3 }}
          >
            Close
          </Button>
          <Button 
            variant="contained" 
            onClick={() => {
              setSuccessModal(false);
              navigate(`/hr/onboarding/approvals?type=${successModalType}`);
            }}
            sx={{ fontWeight: 700, borderRadius: 2, px: 3, background: 'linear-gradient(135deg, #05077E, #0241FB)' }}
          >
            View Queue
          </Button>
        </Box>
      </Dialog>

    </Box>
  );
}
