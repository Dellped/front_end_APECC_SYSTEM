import React, { useState, useEffect } from 'react';
import {
  Box, Card, CardContent, Typography, Grid, Chip, Button,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  Select, MenuItem, FormControl, Paper, Avatar, Divider,
  Accordion, AccordionSummary, AccordionDetails,
  Snackbar, Alert
} from '@mui/material';
import {
  CheckCircle as ApproveIcon,
  Cancel as DeclineIcon,
  Visibility as ViewIcon,
  ExpandMore as ExpandMoreIcon,
  SupervisorAccount as RoleIcon,
} from '@mui/icons-material';
import { onboardingRecords } from '../../data/mockData';
import PayrollRegister from './PayrollRegister';

const NAV = '#05077E';
const IND = '#0241FB';
const goldAccent = '#d4a843';

export default function PayrollApprovals() {
  const [records, setRecords] = useState([]);
  const [role, setRole] = useState('Unit Manager'); 
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [actionType, setActionType] = useState(''); 
  const [remarks, setRemarks] = useState('');
  const [snackbarState, setSnackbarState] = useState({ open: false, message: '', severity: 'success' });

  const handleCloseSnackbar = () => setSnackbarState(prev => ({ ...prev, open: false }));

  useEffect(() => {
    setRecords([...onboardingRecords].filter(r => r.type === 'Payroll'));
  }, []);

  const refreshRecords = () => setRecords([...onboardingRecords].filter(r => r.type === 'Payroll'));

  const visibleRecords = records.filter(r => {
    if (role === 'Unit Manager') return r.status === 'Pending Unit Manager' || r.status === 'Declined by AGM - Pending UM';
    if (role === 'AGM') return r.status === 'Pending AGM';
    if (role === 'General Manager') return r.status === 'Pending General Manager';
    if (role === 'HR Officer') return r.status === 'Pending HR Officer' || r.status.includes('Pending');
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
      
      if (actionType === 'verify' && role === 'Unit Manager') {
        record.status = 'Pending AGM';
        record.approvalChain[1] = { role: 'Unit Manager', name: 'Simulated UM', status: 'Verified', date: today, remarks: remarks };
      } else if (actionType === 'approve' && role === 'AGM') {
        record.status = 'Approved';
        record.approvalChain[2] = { role: 'Asst. General Manager', name: 'Simulated AGM', status: 'Approved', date: today, remarks: remarks };
      } else if (actionType === 'approve' && role === 'General Manager') {
        record.status = 'Approved';
        record.approvalChain[3] = { role: 'General Manager', name: 'Simulated GM', status: 'Approved', date: today, remarks: remarks };
      } else if (actionType === 'decline') {
        if (role === 'Unit Manager') {
          record.status = 'Declined - Needs Revision';
          record.approvalChain[1] = { role: 'Unit Manager', name: 'Simulated UM', status: 'Declined', date: today, remarks: remarks };
        } else if (role === 'AGM') {
          record.status = 'Declined by AGM - Pending UM';
          record.approvalChain[2] = { role: 'Asst. General Manager', name: 'Simulated AGM', status: 'Declined', date: today, remarks: remarks };
        }
      }
    }

    setDialogOpen(false);
    refreshRecords();
    setSnackbarState({ open: true, message: `Successfully ${actionType}d record`, severity: 'success' });
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800, color: NAV }}>
            Payroll Approvals
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
            Review and approve pending payroll batches.
          </Typography>
        </Box>

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

      <Card sx={{ borderRadius: 3, boxShadow: '0 8px 24px rgba(0,0,0,0.06)', borderTop: `4px solid ${goldAccent}` }}>
        <TableContainer>
          <Table>
            <TableHead sx={{ bgcolor: 'rgba(0,0,0,0.02)' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 800, color: NAV }}>ID</TableCell>
                <TableCell sx={{ fontWeight: 800, color: NAV }}>Batch Description</TableCell>
                <TableCell sx={{ fontWeight: 800, color: NAV }}>Period Type</TableCell>
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
                      No pending payroll batches for your role currently.
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
                          P
                        </Avatar>
                        {r.employeeData.firstName} {r.employeeData.lastName}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>Semi-Monthly</Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>Regular Batch</Typography>
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
                        {role === 'AGM' && r.status === 'Pending AGM' && (
                          <>
                            <Button size="small" variant="contained" color="success" onClick={() => handleOpenAction(r, 'approve')} sx={{ textTransform: 'none', fontWeight: 700 }}>Approve</Button>
                            <Button size="small" variant="outlined" color="error" onClick={() => handleOpenAction(r, 'decline')} sx={{ textTransform: 'none', fontWeight: 700 }}>Decline</Button>
                          </>
                        )}
                        {role === 'General Manager' && r.status === 'Pending General Manager' && (
                          <>
                            <Button size="small" variant="contained" color="success" onClick={() => handleOpenAction(r, 'approve')} sx={{ textTransform: 'none', fontWeight: 700 }}>Approve</Button>
                            <Button size="small" variant="outlined" color="error" onClick={() => handleOpenAction(r, 'decline')} sx={{ textTransform: 'none', fontWeight: 700 }}>Decline</Button>
                          </>
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

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="xl" fullWidth>
        <DialogTitle sx={{ fontWeight: 800, color: actionType === 'decline' ? '#d32f2f' : (actionType === 'view' ? NAV : '#2e7d32') }}>
          {actionType === 'verify' ? 'Verify Payroll Batch' : 
           actionType === 'approve' ? 'Approve & Finalize Payroll' : 
           actionType === 'decline' ? 'Decline Record' : 'View Payroll Details'}
        </DialogTitle>
        <DialogContent dividers>
          {selectedRecord && (
            <Box>
              {actionType !== 'view' && (
                <Typography variant="body2" sx={{ mb: 2 }}>
                  You are about to <strong>{actionType}</strong> the payroll batch for <strong>{selectedRecord.employeeData.firstName} {selectedRecord.employeeData.lastName}</strong>.
                </Typography>
              )}

              <Accordion variant="outlined" defaultExpanded sx={{ mb: 3 }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ bgcolor: 'rgba(0,0,0,0.02)' }}>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: IND }}>Payroll Register Details</Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ p: 0 }}>
                  <Box sx={{ maxHeight: '60vh', overflowY: 'auto' }}>
                    <PayrollRegister isEmbedded={true} />
                  </Box>
                </AccordionDetails>
              </Accordion>

              {actionType !== 'view' && (
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  label="Remarks (Optional)"
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
          <Button onClick={() => setDialogOpen(false)} sx={{ color: 'text.secondary', fontWeight: 600 }}>Cancel</Button>
          {actionType !== 'view' && (
            <Button 
              onClick={handleActionConfirm} 
              variant="contained" 
              color={actionType === 'decline' ? 'error' : 'success'}
              startIcon={actionType === 'decline' ? <DeclineIcon /> : <ApproveIcon />}
              sx={{ fontWeight: 700 }}
            >
              Confirm {actionType.charAt(0).toUpperCase() + actionType.slice(1)}
            </Button>
          )}
        </DialogActions>
      </Dialog>

      <Snackbar 
        open={snackbarState.open} 
        autoHideDuration={3000} 
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
