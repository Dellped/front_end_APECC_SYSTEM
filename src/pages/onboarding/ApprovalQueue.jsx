import React, { useState, useEffect } from 'react';
import {
  Box, Card, CardContent, Typography, Grid, Chip, Button,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  Select, MenuItem, FormControl, InputLabel, Paper, Avatar, Divider,
  Accordion, AccordionSummary, AccordionDetails,
  Tabs, Tab
} from '@mui/material';
import {
  CheckCircle as ApproveIcon,
  Cancel as DeclineIcon,
  Visibility as ViewIcon,
  ExpandMore as ExpandMoreIcon,
  Person as PersonIcon,
  SupervisorAccount as RoleIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { onboardingRecords, employees, addExitRequest } from '../../data/mockData';
import PayrollRegister from '../hr/PayrollRegister';
import LeaveApplicationForm from '../hr/LeaveApplicationForm';
import ExitInterviewForm from '../../components/forms/ExitInterviewForm';

const NAV = '#05077E';
const IND = '#0241FB';
const ROY = '#4470ED';
const goldAccent = '#d4a843';

export default function ApprovalQueue() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialType = queryParams.get('type') || 'Onboarding';

  const [records, setRecords] = useState([]);
  const [queueType, setQueueType] = useState(initialType);
  const [role, setRole] = useState('Unit Manager'); // Role Simulator: 'Unit Manager' or 'AGM' or 'HR Officer'
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [actionType, setActionType] = useState(''); // 'verify', 'approve', 'decline'
  const [remarks, setRemarks] = useState('');
  const [exitInterview, setExitInterview] = useState({ date: '', interviewer: '', feedback: '', recommendation: 'Recommended' });

  // Load records on mount
  useEffect(() => {
    // In a real app, this would be an API call.
    setRecords([...onboardingRecords]);
  }, []);

  const refreshRecords = () => setRecords([...onboardingRecords]);

  // Filter records based on role simulation
  const visibleRecords = records.filter(r => {
    const isPayroll = r.type === 'Payroll';
    const isResignation = r.type === 'Resignation';
    const isLeave = r.type === 'Leave';
    
    if (queueType === 'Onboarding' && (isPayroll || isResignation || isLeave)) return false;
    if (queueType === 'Payroll' && !isPayroll) return false;
    if (queueType === 'Resignation' && !isResignation) return false;
    if (queueType === 'Leave' && !isLeave) return false;

    if (role === 'Unit Manager') return r.status === 'Pending Unit Manager' || r.status === 'Declined by AGM - Pending UM';
    if (role === 'AGM') return r.status === 'Pending AGM';
    if (role === 'General Manager') return r.status === 'Pending General Manager';
    if (role === 'HR Officer') return r.status === 'Pending HR Officer' || r.status === 'Declined - Needs Revision' || r.status === 'Approved' || r.status.includes('Pending');
    return true; 
  });

  const handleOpenAction = (record, type) => {
    setSelectedRecord(record);
    setActionType(type);
    setRemarks('');
    setDialogOpen(true);
  };

  const handleActionConfirm = () => {
    const today = new Date().toISOString().split('T')[0];
    const recordIndex = onboardingRecords.findIndex(r => r.id === selectedRecord.id);
    
    if (recordIndex > -1) {
      const record = onboardingRecords[recordIndex];
      const isResig = record.type === 'Resignation';
      const isLeave = record.type === 'Leave';

      if (actionType === 'verify' && role === 'HR Officer' && isResig) {
        record.status = 'Pending Unit Manager';
        record.exitInterview = exitInterview; // Save exit interview data
        record.approvalChain[1] = { 
          role: 'HR Officer', 
          name: 'Simulated HR', 
          status: 'Verified (Exit Interview Done)', 
          date: today, 
          remarks: `Interviewer: ${exitInterview.interviewer} | ${remarks}` 
        };
      } else if (actionType === 'verify' && role === 'HR Officer' && isLeave) {
        record.status = 'Pending Unit Manager';
        record.approvalChain[1] = { role: 'HR Officer', name: 'Simulated HR', status: 'Verified', date: today, remarks: remarks };
      } else if (actionType === 'verify' && role === 'Unit Manager') {
        record.status = 'Pending AGM';
        record.approvalChain[isResig ? 2 : (isLeave ? 2 : 1)] = { role: 'Unit Manager', name: 'Simulated UM', status: 'Verified', date: today, remarks: remarks };
      } else if (actionType === 'verify' && role === 'AGM' && (isResig || isLeave)) {
        if (isLeave) {
          record.status = 'Approved';
          record.approvalChain[3] = { role: 'Asst. General Manager', name: 'Simulated AGM', status: 'Approved', date: today, remarks: remarks };
        } else {
          record.status = 'Pending General Manager';
          record.approvalChain[3] = { role: 'Asst. General Manager', name: 'Simulated AGM', status: 'Verified', date: today, remarks: remarks };
        }
      } else if (actionType === 'approve' && role === 'AGM' && !isResig && !isLeave) {
        record.status = 'Approved';
        record.approvalChain[2] = { role: 'Asst. General Manager', name: 'Simulated AGM', status: 'Approved', date: today, remarks: remarks };
        
        // ... (onboarding logic remains same)
      } else if (actionType === 'approve' && role === 'General Manager' && isResig) {
        record.status = 'Approved';
        record.approvalChain[4] = { role: 'General Manager', name: 'Simulated GM', status: 'Approved', date: today, remarks: remarks };
        
        addExitRequest({
          employeeId: record.employeeData.id,
          name: `${record.employeeData.firstName} ${record.employeeData.lastName}`,
          position: record.employeeData.designation,
          reason: record.employeeData.resignationDetails?.reason || 'Resignation',
          exitDate: record.employeeData.resignationDetails?.date || today,
          remarks: remarks || 'Approved from Queue'
        });
      } else if (actionType === 'resubmit' && role === 'HR Officer') {
        record.status = 'Pending Unit Manager';
        record.approvalChain.push({ role: 'HR Officer', name: 'Simulated HR', status: 'Re-Submitted', date: today, remarks: remarks });
      } else if (actionType === 'decline') {
        if (role === 'HR Officer' && isResig) {
          record.status = 'Declined - Stopped';
          record.approvalChain[1] = { role: 'HR Officer', name: 'Simulated HR', status: 'Declined', date: today, remarks: remarks };
        } else if (role === 'Unit Manager') {
          record.status = 'Declined - Needs Revision';
          record.approvalChain[isResig ? 2 : 1] = { role: 'Unit Manager', name: 'Simulated UM', status: 'Declined', date: today, remarks: remarks };
        } else if (role === 'AGM') {
          record.status = 'Declined by AGM - Pending UM';
          record.approvalChain[isResig ? 3 : 2] = { role: 'Asst. General Manager', name: 'Simulated AGM', status: 'Declined', date: today, remarks: remarks };
        } else if (role === 'General Manager' && isResig) {
          record.status = 'Declined - Stopped';
          record.approvalChain[4] = { role: 'General Manager', name: 'Simulated GM', status: 'Declined', date: today, remarks: remarks };
        }
      } else if (actionType === 'acknowledge' && role === 'Unit Manager') {
        record.status = 'Declined - Needs Revision';
        record.approvalChain.push({ role: 'Unit Manager', name: 'Simulated UM', status: 'Acknowledged Decline', date: today, remarks: remarks });
      }
    }

    setDialogOpen(false);
    refreshRecords();
  };

  const statusColor = (status) => {
    switch(status) {
      case 'Pending Unit Manager': return 'warning';
      case 'Pending AGM': return 'info';
      case 'Pending General Manager': return 'secondary';
      case 'Approved': return 'success';
      case 'Declined - Needs Revision': return 'error';
      case 'Declined by AGM - Pending UM': return 'error';
      default: return 'default';
    }
  };

  return (
    <Box className="page-container" sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Typography variant="h5" sx={{ fontWeight: 800, color: NAV }}>
          {queueType === 'Onboarding' ? 'Onboarding' : 
           queueType === 'Resignation' ? 'Resignation' : 
           queueType === 'Leave' ? 'Leave' : 'Payroll'} Approval Queue
        </Typography>

        {/* Role Simulator */}
        <Paper elevation={0} sx={{ p: 1, px: 2, display: 'flex', alignItems: 'center', gap: 2, bgcolor: 'rgba(2,65,251,0.05)', borderRadius: 3, border: `1px solid rgba(2,65,251,0.15)` }}>
          <RoleIcon sx={{ color: IND }} />
          <Typography variant="body2" sx={{ fontWeight: 700, color: IND }}>Role Simulator:</Typography>
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <Select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              sx={{ bgcolor: '#fff', fontWeight: 600 }}
            >
              <MenuItem value="Unit Manager">Unit Manager</MenuItem>
              <MenuItem value="HR Officer">HR Officer</MenuItem>
              <MenuItem value="AGM">Asst. General Manager (AGM)</MenuItem>
              <MenuItem value="General Manager">General Manager (GM)</MenuItem>
            </Select>
          </FormControl>
        </Paper>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Tabs 
          value={queueType} 
          onChange={(e, nv) => setQueueType(nv)} 
          sx={{ borderBottom: 1, borderColor: 'divider' }}
          textColor="primary"
          indicatorColor="primary"
        >
          <Tab label="Onboarding Approvals" value="Onboarding" sx={{ fontWeight: 700 }} />
          <Tab label="Payroll Approvals" value="Payroll" sx={{ fontWeight: 700 }} />
          <Tab label="Exit Approval Queue" value="Resignation" sx={{ fontWeight: 700 }} />
          <Tab label="Leave Approvals" value="Leave" sx={{ fontWeight: 700 }} />
        </Tabs>
      </Box>

      <Card sx={{ borderRadius: 3, boxShadow: '0 8px 24px rgba(0,0,0,0.06)', borderTop: `4px solid ${goldAccent}` }}>
        <TableContainer>
          <Table>
            <TableHead sx={{ bgcolor: 'rgba(0,0,0,0.02)' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 800, color: NAV }}>ID</TableCell>
                <TableCell sx={{ fontWeight: 800, color: NAV }}>{queueType === 'Payroll' ? 'Batch Description' : 'Applicant Name'}</TableCell>
                <TableCell sx={{ fontWeight: 800, color: NAV }}>{queueType === 'Payroll' ? 'Period Type' : 'Designation'}</TableCell>
                <TableCell sx={{ fontWeight: 800, color: NAV }}>Date Submitted</TableCell>
                <TableCell sx={{ fontWeight: 800, color: NAV }}>Status</TableCell>
                <TableCell align="center" sx={{ fontWeight: 800, color: NAV }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {visibleRecords.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                    <Typography variant="body1" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                      No pending records for your role currently.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                visibleRecords.map((r) => (
                  <TableRow key={r.id} hover>
                    <TableCell sx={{ fontWeight: 600, color: IND }}>{r.id}</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar sx={{ width: 32, height: 32, bgcolor: IND, fontSize: '0.8rem' }}>
                          {r.employeeData.firstName[0]}{r.employeeData.lastName[0]}
                        </Avatar>
                        {`${r.employeeData.firstName} ${r.employeeData.lastName}`}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>{r.employeeData.designation}</Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>{r.employeeData.department}</Typography>
                    </TableCell>
                    <TableCell>{r.submittedDate}</TableCell>
                    <TableCell>
                      <Chip label={r.status} size="small" color={statusColor(r.status)} sx={{ fontWeight: 700 }} />
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                        <Button size="small" variant="outlined" color="primary" onClick={() => handleOpenAction(r, 'view')} sx={{ minWidth: 0, p: '4px 8px' }}>
                          <ViewIcon fontSize="small" />
                        </Button>
                        {role === 'Unit Manager' && r.status === 'Pending Unit Manager' && (
                          <>
                            <Button size="small" variant="contained" color="success" onClick={() => handleOpenAction(r, 'verify')} sx={{ textTransform: 'none', fontWeight: 700 }}>Verify</Button>
                            <Button size="small" variant="outlined" color="error" onClick={() => handleOpenAction(r, 'decline')} sx={{ textTransform: 'none', fontWeight: 700 }}>Decline</Button>
                          </>
                        )}
                        {role === 'Unit Manager' && r.status === 'Declined by AGM - Pending UM' && (
                          <Button size="small" variant="contained" color="warning" onClick={() => handleOpenAction(r, 'acknowledge')} sx={{ textTransform: 'none', fontWeight: 700 }}>Return to HR</Button>
                        )}
                        {role === 'AGM' && r.status === 'Pending AGM' && (
                          <>
                            <Button size="small" variant="contained" color="success" onClick={() => handleOpenAction(r, r.type === 'Resignation' ? 'verify' : 'approve')} sx={{ textTransform: 'none', fontWeight: 700 }}>
                              {r.type === 'Resignation' ? 'Verify' : 'Approve'}
                            </Button>
                            <Button size="small" variant="outlined" color="error" onClick={() => handleOpenAction(r, 'decline')} sx={{ textTransform: 'none', fontWeight: 700 }}>Decline</Button>
                          </>
                        )}
                        {role === 'HR Officer' && (
                          r.status === 'Pending HR Officer' ? (
                            <>
                              <Button size="small" variant="contained" color="success" onClick={() => handleOpenAction(r, 'verify')} sx={{ textTransform: 'none', fontWeight: 700 }}>Verify</Button>
                              <Button size="small" variant="outlined" color="error" onClick={() => handleOpenAction(r, 'decline')} sx={{ textTransform: 'none', fontWeight: 700 }}>Decline</Button>
                            </>
                          ) : r.status === 'Declined - Needs Revision' ? (
                            <Button size="small" variant="contained" color="warning" onClick={() => navigate(`/hr/onboarding/add-employee?editId=${r.id}`)} sx={{ textTransform: 'none', fontWeight: 700 }}>Edit & Re-submit</Button>
                          ) : (
                            <Button size="small" variant="outlined" disabled sx={{ textTransform: 'none' }}>View Only</Button>
                          )
                        )}
                        {role === 'General Manager' && (
                          r.status === 'Pending General Manager' ? (
                            <>
                              <Button size="small" variant="contained" color="success" onClick={() => handleOpenAction(r, 'approve')} sx={{ textTransform: 'none', fontWeight: 700 }}>Approve</Button>
                              <Button size="small" variant="outlined" color="error" onClick={() => handleOpenAction(r, 'decline')} sx={{ textTransform: 'none', fontWeight: 700 }}>Decline</Button>
                            </>
                          ) : (
                            <Button size="small" variant="outlined" disabled sx={{ textTransform: 'none' }}>View Only</Button>
                          )
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Action Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth={queueType === 'Payroll' ? 'xl' : (queueType === 'Leave' ? 'md' : 'sm')} fullWidth>
        <DialogTitle sx={{ fontWeight: 800, color: (actionType === 'decline' || actionType === 'acknowledge') ? '#d32f2f' : (actionType === 'view' ? NAV : '#2e7d32') }}>
          {actionType === 'verify' && (queueType === 'Payroll' ? 'Verify Payroll Batch' : queueType === 'Resignation' ? 'Verify Resignation' : queueType === 'Leave' ? 'Verify Leave Application' : 'Verify 201 Record')}
          {actionType === 'approve' && (queueType === 'Payroll' ? 'Approve & Finalize Payroll' : queueType === 'Resignation' ? 'Approve Exit Request' : queueType === 'Leave' ? 'Approve Leave Request' : 'Approve & Save to Master File')}
          {actionType === 'decline' && 'Decline Record'}
          {actionType === 'acknowledge' && 'Acknowledge Decline & Return to HR'}
          {actionType === 'view' && (queueType === 'Payroll' ? 'View Payroll Details' : queueType === 'Resignation' ? 'View Resignation Details' : queueType === 'Leave' ? 'View Leave Details' : 'View Employee Details')}
          {actionType === 'resubmit' && 'Re-Submit for Verification'}
        </DialogTitle>
        <DialogContent dividers>
          {selectedRecord && (
            <Box>
              {actionType !== 'view' && (
                <Typography variant="body2" sx={{ mb: 2 }}>
                  You are about to <strong>{actionType === 'acknowledge' ? 'acknowledge the decline and return' : actionType}</strong> the record for <strong>{selectedRecord.employeeData.firstName} {selectedRecord.employeeData.lastName}</strong>.
                </Typography>
              )}

              {selectedRecord.approvalChain && selectedRecord.approvalChain.length > 0 && (
                <Box sx={{ mb: 3, p: 2, bgcolor: 'rgba(0,0,0,0.03)', borderRadius: 2, borderLeft: '4px solid #0241FB' }}>
                  <Typography variant="caption" sx={{ fontWeight: 700, color: NAV, mb: 1, display: 'block' }}>Approval History & Remarks:</Typography>
                  {selectedRecord.approvalChain.filter(Boolean).map((step, idx) => (
                    <Box key={idx} sx={{ mb: step.remarks ? 1 : 0.5 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>{step.role} ({step.name}) - <span style={{ color: step.status.includes('Decline') ? '#d32f2f' : (step.status.includes('Verify') || step.status.includes('Approve') ? '#2e7d32' : '#ed6c02') }}>{step.status}</span></Typography>
                      {step.remarks && <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', fontStyle: 'italic', ml: 1 }}>"{step.remarks}"</Typography>}
                    </Box>
                  ))}
                </Box>
              )}

              {actionType === 'approve' && queueType === 'Resignation' && (
                <Typography variant="body2" sx={{ mb: 3, p: 2, bgcolor: 'rgba(46,125,50,0.1)', borderLeft: '4px solid #2e7d32', borderRadius: 1 }}>
                  If approved, this resignation will be finalized and sent to the Exit module for clearance processing.
                </Typography>
              )}

              {actionType === 'approve' && queueType === 'Onboarding' && (
                <Typography variant="body2" sx={{ mb: 3, p: 2, bgcolor: 'rgba(46,125,50,0.1)', borderLeft: '4px solid #2e7d32', borderRadius: 1 }}>
                  If approved, this record will be immediately pushed to the global Employee Master File under the <strong>Probationary</strong> status.
                </Typography>
              )}

              {actionType === 'approve' && queueType === 'Payroll' && (
                <Typography variant="body2" sx={{ mb: 3, p: 2, bgcolor: 'rgba(46,125,50,0.1)', borderLeft: '4px solid #2e7d32', borderRadius: 1 }}>
                  If approved, this payroll batch will be marked as finalized and pay slips will become available for the concerned employees.
                </Typography>
              )}

              {actionType !== 'view' ? (
                queueType === 'Payroll' ? (
                  <Accordion variant="outlined" sx={{ mb: 3 }}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ bgcolor: 'rgba(0,0,0,0.02)' }}>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: IND }}>View Payroll Details</Typography>
                    </AccordionSummary>
                    <AccordionDetails sx={{ p: 0 }}>
                      <Box sx={{ maxHeight: '50vh', overflowY: 'auto' }}>
                        <PayrollRegister isEmbedded={true} />
                      </Box>
                    </AccordionDetails>
                  </Accordion>
                 ) : queueType === 'Resignation' ? (
                  <Box sx={{ mb: 3, border: '1px solid #ddd', borderRadius: 2, overflow: 'hidden' }}>
                    <Box sx={{ bgcolor: 'rgba(0,0,0,0.02)', p: 1.5, borderBottom: '1px solid #ddd' }}>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: '#d32f2f' }}>Resignation Application Details</Typography>
                    </Box>
                    <Box sx={{ maxHeight: '40vh', overflowY: 'auto', p: 1 }}>
                      <ExitInterviewForm 
                        employee={selectedRecord.employeeData} 
                        isReadOnly={true} 
                        initialData={selectedRecord.employeeData.exitInterviewFull || {
                          reasons: { 
                            whyLeave: selectedRecord.employeeData.resignationDetails?.reason || '', 
                            managerRel: '', peersRel: '', generalOpinion: '', 
                            prevention: selectedRecord.employeeData.resignationDetails?.remarks || '' 
                          },
                          experience: { managementOpinion: '', feedback: '', missingPrograms: '', recognition: '', overall: '' },
                          role: { resources: '', training: '', expectations: '', rewardChallenge: '', skillUtilization: '', support: '', workload: '', careerGoals: '', likedMost: '', likedLeast: '', growth: '', environment: '', valued: '', whatMadeValued: '' },
                          forward: { advice: '', improvements: '', workAgain: '', recommend: '', oneThingChange: '', additional: selectedRecord.employeeData.resignationDetails?.remarks || '' }
                        }} 
                      />
                    </Box>
                  </Box>
                ) : queueType === 'Leave' ? (
                  <Box sx={{ mb: 3 }}>
                    <LeaveApplicationForm 
                      employee={selectedRecord.employeeData} 
                      isReadOnly={true} 
                      initialData={selectedRecord.employeeData.leaveDetails} 
                    />
                  </Box>
                ) : (
                  <Accordion variant="outlined" sx={{ mb: 3 }}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ bgcolor: 'rgba(0,0,0,0.02)' }}>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: IND }}>View Basic Employee Details</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                           <Typography variant="caption" sx={{ color: 'text.secondary' }}>Full Name</Typography>
                           <Typography variant="body2" sx={{ fontWeight: 600 }}>{selectedRecord.employeeData.firstName} {selectedRecord.employeeData.middleName} {selectedRecord.employeeData.lastName} {selectedRecord.employeeData.suffix}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                           <Typography variant="caption" sx={{ color: 'text.secondary' }}>Department</Typography>
                           <Typography variant="body2" sx={{ fontWeight: 600 }}>{selectedRecord.employeeData.department || '—'}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                           <Typography variant="caption" sx={{ color: 'text.secondary' }}>Designation</Typography>
                           <Typography variant="body2" sx={{ fontWeight: 600 }}>{selectedRecord.employeeData.designation || '—'}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                           <Typography variant="caption" sx={{ color: 'text.secondary' }}>Division</Typography>
                           <Typography variant="body2" sx={{ fontWeight: 600 }}>{selectedRecord.employeeData.employmentDetails?.division || '—'}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                           <Typography variant="caption" sx={{ color: 'text.secondary' }}>Contact</Typography>
                           <Typography variant="body2" sx={{ fontWeight: 600 }}>{selectedRecord.employeeData.personal?.contactNumber1 || '—'}</Typography>
                        </Grid>
                      </Grid>
                    </AccordionDetails>
                  </Accordion>
                )
              ) : queueType === 'Payroll' ? (
                <Box sx={{ minHeight: '60vh' }}>
                  <PayrollRegister isEmbedded={true} />
                </Box>
              ) : queueType === 'Resignation' ? (
                <Box sx={{ maxHeight: '70vh', overflowY: 'auto' }}>
                  <ExitInterviewForm 
                    employee={selectedRecord.employeeData} 
                    isReadOnly={true} 
                    initialData={selectedRecord.employeeData.exitInterviewFull || {
                      reasons: { 
                        whyLeave: selectedRecord.employeeData.resignationDetails?.reason || '', 
                        managerRel: '', peersRel: '', generalOpinion: '', 
                        prevention: selectedRecord.employeeData.resignationDetails?.remarks || '' 
                      },
                      experience: { managementOpinion: '', feedback: '', missingPrograms: '', recognition: '', overall: '' },
                      role: { resources: '', training: '', expectations: '', rewardChallenge: '', skillUtilization: '', support: '', workload: '', careerGoals: '', likedMost: '', likedLeast: '', growth: '', environment: '', valued: '', whatMadeValued: '' },
                      forward: { advice: '', improvements: '', workAgain: '', recommend: '', oneThingChange: '', additional: selectedRecord.employeeData.resignationDetails?.remarks || '' }
                    }} 
                  />
                </Box>
              ) : queueType === 'Leave' ? (
                <Box sx={{ maxHeight: '70vh', overflowY: 'auto' }}>
                  <LeaveApplicationForm 
                    employee={selectedRecord.employeeData} 
                    isReadOnly={true} 
                    initialData={selectedRecord.employeeData.leaveDetails} 
                  />
                </Box>
              ) : (
                <Box sx={{ maxHeight: '60vh', overflowY: 'auto', pr: 1 }}>
                  {/* Comprehensive View Profile */}
                  
                  {/* Section: Personal Info */}
                  <Accordion variant="outlined" defaultExpanded sx={{ mb: 1 }}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ bgcolor: 'rgba(0,0,0,0.02)' }}>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: IND }}>Personal Information</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>Full Name</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>{selectedRecord.employeeData.firstName} {selectedRecord.employeeData.middleName} {selectedRecord.employeeData.lastName} {selectedRecord.employeeData.suffix}</Typography>
                        </Grid>
                        <Grid item xs={4}>
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>Gender</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>{selectedRecord.employeeData.personal.gender}</Typography>
                        </Grid>
                        <Grid item xs={4}>
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>Birthdate</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>{selectedRecord.employeeData.personal.birthdate}</Typography>
                        </Grid>
                        <Grid item xs={4}>
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>Civil Status</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>{selectedRecord.employeeData.personal.civilStatus}</Typography>
                        </Grid>
                        <Grid item xs={4}>
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>Religion</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>{selectedRecord.employeeData.personal.religion}</Typography>
                        </Grid>
                        <Grid item xs={4}>
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>Blood Type</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>{selectedRecord.employeeData.personal.bloodType}</Typography>
                        </Grid>
                        <Grid item xs={12}>
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>Present Address</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>{selectedRecord.employeeData.personal.presentAddress} ({selectedRecord.employeeData.personal.presentZipcode})</Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>Contact Number(s)</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>{selectedRecord.employeeData.personal.contactNumber1} / {selectedRecord.employeeData.personal.contactNumber2}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>Email Addresse(s)</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>{selectedRecord.employeeData.personal.email1} / {selectedRecord.employeeData.personal.email2}</Typography>
                        </Grid>
                      </Grid>
                    </AccordionDetails>
                  </Accordion>

                  {/* Section: Family */}
                  <Accordion variant="outlined" sx={{ mb: 1 }}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ bgcolor: 'rgba(0,0,0,0.02)' }}>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: IND }}>Family Background</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>Father</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>{selectedRecord.employeeData.family.fatherName || '—'} ({selectedRecord.employeeData.family.fatherOccupation || '—'})</Typography>
                        </Grid>
                        <Grid item xs={12}>
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>Mother</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>{selectedRecord.employeeData.family.motherName || '—'} ({selectedRecord.employeeData.family.motherOccupation || '—'})</Typography>
                        </Grid>
                        {selectedRecord.employeeData.family.spouseName && (
                          <Grid item xs={12}>
                            <Typography variant="caption" sx={{ color: 'text.secondary' }}>Spouse</Typography>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>{selectedRecord.employeeData.family.spouseName} ({selectedRecord.employeeData.family.spouseOccupation})</Typography>
                          </Grid>
                        )}
                      </Grid>
                    </AccordionDetails>
                  </Accordion>

                  {/* Section: Education */}
                  <Accordion variant="outlined" sx={{ mb: 1 }}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ bgcolor: 'rgba(0,0,0,0.02)' }}>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: IND }}>Education Backgound</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      {selectedRecord.employeeData.education?.length > 0 ? selectedRecord.employeeData.education.map((edu, idx) => (
                        <Box key={idx} sx={{ mb: 2 }}>
                          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>{edu.level}</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>{edu.school}</Typography>
                          {edu.degree && <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>{edu.degree}</Typography>}
                        </Box>
                      )) : <Typography variant="body2">No education recorded.</Typography>}
                    </AccordionDetails>
                  </Accordion>

                  {/* Section: Employment */}
                  <Accordion variant="outlined" sx={{ mb: 1 }}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ bgcolor: 'rgba(0,0,0,0.02)' }}>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: IND }}>Proposed Employment Details</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>Designation / Job Level</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>{selectedRecord.employeeData.employmentDetails.designation} ({selectedRecord.employeeData.employmentDetails.jobLevel})</Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>Division & Department</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>{selectedRecord.employeeData.employmentDetails.division} / {selectedRecord.employeeData.employmentDetails.department}</Typography>
                        </Grid>
                        <Grid item xs={4}>
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>Employment Type</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>{selectedRecord.employeeData.employmentDetails.employmentType}</Typography>
                        </Grid>
                        <Grid item xs={4}>
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>Shift Schedule</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>{selectedRecord.employeeData.employmentDetails.shift}</Typography>
                        </Grid>
                        <Grid item xs={4}>
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>Payroll Location</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>{selectedRecord.employeeData.employmentDetails.payrollLocation}</Typography>
                        </Grid>
                      </Grid>
                    </AccordionDetails>
                  </Accordion>

                  {/* Section: Statutories */}
                  <Accordion variant="outlined" sx={{ mb: 1 }}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ bgcolor: 'rgba(0,0,0,0.02)' }}>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: IND }}>Statutory & Requirements</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>SSS Number</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>{selectedRecord.employeeData.requirements?.sssNo || '—'}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>PhilHealth Number</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>{selectedRecord.employeeData.requirements?.philhealthNo || '—'}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>Pag-IBIG Number</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>{selectedRecord.employeeData.requirements?.hdmfNo || '—'}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>TIN Number</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>{selectedRecord.employeeData.requirements?.tinNo || '—'}</Typography>
                        </Grid>
                      </Grid>
                    </AccordionDetails>
                  </Accordion>
                </Box>
              )}

              {actionType === 'verify' && role === 'HR Officer' && queueType === 'Resignation' && (
                <Box sx={{ mt: 2, p: 2, bgcolor: 'rgba(5, 7, 126, 0.04)', borderRadius: 2, border: '1px solid rgba(5, 7, 126, 0.1)' }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: NAV, mb: 2 }}>Conduct Exit Interview</Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField 
                        fullWidth size="small" type="date" label="Interview Date" 
                        InputLabelProps={{ shrink: true }}
                        value={exitInterview.date}
                        onChange={(e) => setExitInterview({...exitInterview, date: e.target.value})}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField 
                        fullWidth size="small" label="Interviewer Name" 
                        value={exitInterview.interviewer}
                        onChange={(e) => setExitInterview({...exitInterview, interviewer: e.target.value})}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField 
                        fullWidth multiline rows={2} label="Key Feedback / Summary" 
                        value={exitInterview.feedback}
                        onChange={(e) => setExitInterview({...exitInterview, feedback: e.target.value})}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField 
                        fullWidth select size="small" label="Final Recommendation" 
                        value={exitInterview.recommendation}
                        onChange={(e) => setExitInterview({...exitInterview, recommendation: e.target.value})}
                      >
                        <MenuItem value="Recommended">Recommended for Clearance</MenuItem>
                        <MenuItem value="On Hold">On Hold (Needs further discussion)</MenuItem>
                        <MenuItem value="Not Recommended">Not Recommended</MenuItem>
                      </TextField>
                    </Grid>
                  </Grid>
                </Box>
              )}

              {actionType !== 'view' && (
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  label={actionType === 'verify' && role === 'HR Officer' && queueType === 'Resignation' ? "Additional HR Remarks" : "Remarks (Optional)"}
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="Enter any feedback or notes regarding this action..."
                  sx={{ mt: 2 }}
                />
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          {actionType === 'view' ? (
            <Button onClick={() => setDialogOpen(false)} variant="contained" sx={{ background: `linear-gradient(135deg, ${NAV} 0%, ${IND} 100%)`, fontWeight: 700 }}>Close</Button>
          ) : (
            <>
              <Button onClick={() => setDialogOpen(false)} sx={{ color: 'text.secondary', fontWeight: 600 }}>Cancel</Button>
              <Button 
                onClick={handleActionConfirm} 
                variant="contained" 
                color={(actionType === 'decline' || actionType === 'acknowledge') ? 'error' : (actionType === 'resubmit' ? 'warning' : 'success')}
                startIcon={(actionType === 'decline' || actionType === 'acknowledge') ? <DeclineIcon /> : <ApproveIcon />}
                sx={{ fontWeight: 700 }}
              >
                Confirm {actionType === 'verify' ? 'Verify' : (actionType === 'approve' ? 'Approve' : (actionType === 'decline' ? 'Decline' : (actionType === 'acknowledge' ? 'Return to HR' : 'Re-Submit')))}
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
}
