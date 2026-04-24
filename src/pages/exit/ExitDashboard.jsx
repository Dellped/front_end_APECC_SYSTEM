import React, { useState } from 'react';
import {
  Box, Card, CardContent, Typography, Grid, Button, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Chip, Avatar,
  LinearProgress, Stack
} from '@mui/material';
import {
  ExitToApp as ExitIcon, Savings as SavingsIcon, AccountBalance as CapitalIcon,
  TrendingUp as DividendIcon, CardGiftcard as RebatesIcon,
  VolunteerActivism as VoluntaryIcon, Percent as InterestIcon,
  Redeem as RefundIcon, CheckCircleOutline as CompletedIcon,
  Schedule as PendingIcon, Sync as InProgressIcon, People as PeopleIcon,
  Visibility as ViewIcon, Print as PrintIcon, ArrowForward as ArrowForwardIcon,
  Email as EmailIcon, Phone as PhoneIcon, CalendarToday as CalendarIcon,
  Business as DeptIcon
} from '@mui/icons-material';
import { exitMembers, employees, staffClearanceRecords } from '../../data/mockData';
import StaffClearanceForm from './StaffClearanceForm';

const goldAccent = '#d4a843';
const NAV = '#05077E';
const IND = '#0241FB';
const ROY = '#4470ED';
const PER = '#B4B7D3';
const formatCurrency = (val) => `₱${val.toLocaleString('en-PH', { minimumFractionDigits: 2 })}`;

const summaryCards = [
  { key: 'savings', label: 'Total Savings', icon: <SavingsIcon />, gradient: `linear-gradient(135deg, ${NAV} 0%, ${IND} 55%, ${ROY} 100%)` },
  { key: 'voluntary', label: 'Total Voluntary', icon: <VoluntaryIcon />, gradient: `linear-gradient(135deg, ${NAV} 0%, #1a2cb0 50%, ${IND} 100%)` },
  { key: 'shareCapital', label: 'Share Capital', icon: <CapitalIcon />, gradient: `linear-gradient(135deg, ${NAV} 0%, ${IND} 100%)` },
  { key: 'patronageRefund', label: 'Patronage Refund', icon: <RefundIcon />, gradient: `linear-gradient(135deg, #b08930 0%, ${goldAccent} 50%, #e8c96a 100%)` },
  { key: 'savingsInterest', label: 'Savings Interest', icon: <InterestIcon />, gradient: `linear-gradient(135deg, ${IND} 0%, ${ROY} 100%)` },
  { key: 'dividend', label: 'Dividend', icon: <DividendIcon />, gradient: 'linear-gradient(135deg, #8b1a1a 0%, #c0392b 50%, #e74c3c 100%)' },
  { key: 'rebates', label: 'Rebates', icon: <RebatesIcon />, gradient: `linear-gradient(135deg, ${goldAccent} 0%, #e8c96a 100%)` },
];

export default function ExitDashboard() {
  const [selectedClearance, setSelectedClearance] = useState(staffClearanceRecords[0] || null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [refresh, setRefresh] = useState(0);

  const totals = {};
  summaryCards.forEach(({ key }) => {
    totals[key] = exitMembers.reduce((sum, m) => sum + m[key], 0);
  });
  const grandTotal = exitMembers.reduce((sum, m) => sum + m.totalAmount, 0);

  const getDeptStatus = (deptItems) => {
    if (!deptItems || deptItems.length === 0) return 'Pending';
    const yesCount = deptItems.filter(i => i.status === 'yes').length;
    if (yesCount === deptItems.length) return 'Yes';
    if (yesCount > 0) return 'Processing';
    return 'Pending';
  };

  const getDeptColorProps = (status) => {
    if (status === 'Yes') return { bgcolor: 'rgba(46, 125, 50, 0.1)', color: '#2e7d32', border: '1px solid rgba(46, 125, 50, 0.3)' };
    if (status === 'Processing') return { bgcolor: 'rgba(237, 108, 2, 0.1)', color: '#ed6c02', border: '1px solid rgba(237, 108, 2, 0.3)' };
    return { bgcolor: 'rgba(198, 40, 40, 0.05)', color: '#c62828', border: '1px solid rgba(198, 40, 40, 0.2)' };
  };

  const calculateOverallProgress = (sections) => {
    let totalItems = 0;
    let completedItems = 0;
    for (const key of Object.keys(sections)) {
      totalItems += sections[key].items.length;
      completedItems += sections[key].items.filter(i => i.status === 'yes').length;
    }
    return totalItems === 0 ? 0 : Math.round((completedItems / totalItems) * 100);
  };

  const enrichedRecords = staffClearanceRecords.map(record => {
    const emp = employees.find(e => e.id === record.employeeId);
    const progress = calculateOverallProgress(record.sections);
    const hrStatus = getDeptStatus(record.sections.hr.items);
    const itStatus = getDeptStatus(record.sections.it.items);
    const financeStatus = getDeptStatus(record.sections.finance.items);
    
    let aggStatus = 'Pending';
    if (progress === 100 || record.status === 'Cleared') aggStatus = 'Completed';
    else if (progress > 0) aggStatus = 'In Progress';

    return { ...record, emp, progress, hrStatus, itStatus, financeStatus, aggStatus };
  });

  const totalReq = enrichedRecords.length;
  const totalCompleted = enrichedRecords.filter(r => r.aggStatus === 'Completed').length;
  const totalInProgress = enrichedRecords.filter(r => r.aggStatus === 'In Progress').length;
  const totalPending = enrichedRecords.filter(r => r.aggStatus === 'Pending').length;

  const handleOpenForm = (record) => {
    setSelectedClearance(record);
    setIsFormOpen(true);
  };

  const selectedEmp = selectedClearance?.emp || employees.find(e => e.id === selectedClearance?.employeeId);

  return (
    <Box className="page-container" sx={{ p: 2, bgcolor: '#f4f6f8', minHeight: '100vh' }}>
      
      {/* Top Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, color: NAV, mb: 0.5 }}>Exit Clearance Dashboard</Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600 }}>Home / Exit Modules / Dashboard</Typography>
      </Box>

      {/* Financial Summary */}
      <Card sx={{
        borderRadius: 4, mb: 4,
        background: `linear-gradient(135deg, ${NAV} 0%, #0a1250 50%, #0e1d6a 100%)`,
        color: '#FDFDFC',
        boxShadow: '0 10px 30px rgba(5,7,126,0.30)',
        position: 'relative', overflow: 'hidden',
        '&::before': {
          content: '""', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          background: `radial-gradient(circle at top right, ${goldAccent}20, transparent 40%)`,
        }
      }}>
        <CardContent sx={{ p: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 1 }}>
          <Box>
            <Typography variant="body2" sx={{ color: 'rgba(253,253,252,0.72)', fontWeight: 600, fontSize: '0.85rem', mb: 1, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              Total Settlement Amount
            </Typography>
            <Typography variant="h3" sx={{ fontWeight: 800, color: goldAccent, letterSpacing: '-0.02em', textShadow: '0 2px 10px rgba(212,168,67,0.3)' }}>
              {formatCurrency(grandTotal)}
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(253,253,252,0.5)', mt: 1 }}>
              Across <strong>{exitMembers.length}</strong> exiting members
            </Typography>
          </Box>
          <Avatar sx={{ width: 72, height: 72, background: `linear-gradient(135deg, ${goldAccent}, #e8c96a)`, color: NAV, boxShadow: `0 0 20px ${goldAccent}40`, border: `4px solid rgba(253,253,252,0.1)` }}>
            <ExitIcon sx={{ fontSize: 36 }} />
          </Avatar>
        </CardContent>
      </Card>

      {/* Summary Cards Grid */}
      <Grid container spacing={2.5} sx={{ mb: 5 }}>
        {summaryCards.map((card) => (
          <Grid item xs={12} sm={6} md={1.71} key={card.key} sx={{ flexBasis: { md: '14.28%' }, maxWidth: { md: '14.28%' } }}>
            <Card sx={{ height: '100%', borderRadius: 3, background: card.gradient, boxShadow: '0 4px 16px rgba(5,7,126,0.28)' }}>
              <CardContent sx={{ p: 2, textAlign: 'center' }}>
                <Avatar sx={{ width: 36, height: 36, mx: 'auto', mb: 1, bgcolor: 'rgba(253,253,252,0.15)', color: '#FDFDFC', border: '1px solid rgba(253,253,252,0.2)' }}>
                  {card.icon}
                </Avatar>
                <Typography variant="caption" sx={{ color: 'rgba(253,253,252,0.72)', fontWeight: 600, fontSize: '0.7rem', display: 'block', mb: 0.5, textTransform: 'uppercase' }}>{card.label}</Typography>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#FDFDFC', fontSize: '0.88rem' }}>{formatCurrency(totals[card.key])}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Grid Layout: Main Clearance Area vs Sidebar */}
      <Grid container spacing={3}>
        <Grid item xs={12} lg={9}>
          {/* Top Stats Cards */}
          <Grid container spacing={2} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ borderRadius: 3, boxShadow: '0 2px 12px rgba(0,0,0,0.04)', height: '100%' }}>
                <CardContent sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{ bgcolor: 'rgba(2,65,251,0.1)', color: IND, width: 56, height: 56 }}><PeopleIcon fontSize="large" /></Avatar>
                  <Box>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700 }}>Total Requests</Typography>
                    <Typography variant="h4" sx={{ fontWeight: 800, color: NAV }}>{totalReq}</Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ borderRadius: 3, boxShadow: '0 2px 12px rgba(0,0,0,0.04)', height: '100%' }}>
                <CardContent sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{ bgcolor: 'rgba(46,125,50,0.1)', color: '#2e7d32', width: 56, height: 56 }}><CompletedIcon fontSize="large" /></Avatar>
                  <Box>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700 }}>Completed</Typography>
                    <Typography variant="h4" sx={{ fontWeight: 800, color: '#2e7d32' }}>{totalCompleted}</Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ borderRadius: 3, boxShadow: '0 2px 12px rgba(0,0,0,0.04)', height: '100%' }}>
                <CardContent sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{ bgcolor: 'rgba(237,108,2,0.1)', color: '#ed6c02', width: 56, height: 56 }}><InProgressIcon fontSize="large" /></Avatar>
                  <Box>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700 }}>In Progress</Typography>
                    <Typography variant="h4" sx={{ fontWeight: 800, color: '#ed6c02' }}>{totalInProgress}</Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ borderRadius: 3, boxShadow: '0 2px 12px rgba(0,0,0,0.04)', height: '100%' }}>
                <CardContent sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{ bgcolor: 'rgba(198,40,40,0.1)', color: '#c62828', width: 56, height: 56 }}><PendingIcon fontSize="large" /></Avatar>
                  <Box>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700 }}>Pending</Typography>
                    <Typography variant="h4" sx={{ fontWeight: 800, color: '#c62828' }}>{totalPending}</Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Clearance Overview Table */}
          <Card sx={{ borderRadius: 3, boxShadow: '0 2px 12px rgba(0,0,0,0.04)', mb: 4 }}>
            <Box sx={{ p: 3, borderBottom: '1px solid #f0f0f0' }}>
              <Typography variant="h6" sx={{ fontWeight: 800, color: NAV }}>Clearance Overview</Typography>
            </Box>
            <TableContainer>
              <Table>
                <TableHead sx={{ bgcolor: '#f8f9fa' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }}>Employee</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: 'text.secondary', textAlign: 'center' }}>HR</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: 'text.secondary', textAlign: 'center' }}>IT</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: 'text.secondary', textAlign: 'center' }}>Finance</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: 'text.secondary', width: 150 }}>Overall Progress</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700, color: 'text.secondary' }}>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {enrichedRecords.map((r) => (
                    <TableRow 
                      key={r.id} hover selected={selectedClearance?.id === r.id}
                      onClick={() => setSelectedClearance(r)}
                      sx={{ cursor: 'pointer', '&.Mui-selected': { bgcolor: 'rgba(2,65,251,0.04)' } }}
                    >
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Avatar sx={{ width: 36, height: 36, bgcolor: IND }}>{r.emp?.firstName[0]}{r.emp?.lastName[0]}</Avatar>
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 700 }}>{r.emp?.firstName} {r.emp?.lastName}</Typography>
                            <Typography variant="caption" sx={{ color: 'text.secondary' }}>{r.emp?.designation}</Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell align="center"><Chip label={r.hrStatus} size="small" sx={{ fontWeight: 700, fontSize: '0.7rem', ...getDeptColorProps(r.hrStatus) }} /></TableCell>
                      <TableCell align="center"><Chip label={r.itStatus} size="small" sx={{ fontWeight: 700, fontSize: '0.7rem', ...getDeptColorProps(r.itStatus) }} /></TableCell>
                      <TableCell align="center"><Chip label={r.financeStatus} size="small" sx={{ fontWeight: 700, fontSize: '0.7rem', ...getDeptColorProps(r.financeStatus) }} /></TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="caption" sx={{ fontWeight: 800, minWidth: 35 }}>{r.progress}%</Typography>
                          <LinearProgress variant="determinate" value={r.progress} sx={{ flex: 1, height: 6, borderRadius: 3, bgcolor: '#eee', '& .MuiLinearProgress-bar': { bgcolor: r.progress === 100 ? '#2e7d32' : IND } }} />
                        </Box>
                      </TableCell>
                      <TableCell align="right">
                        <Button variant="outlined" size="small" startIcon={<ViewIcon />} onClick={(e) => { e.stopPropagation(); handleOpenForm(r); }} sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600, borderColor: '#ddd', color: 'text.primary' }}>View</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>

          {/* Recent Requests */}
          <Card sx={{ borderRadius: 3, boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
            <Box sx={{ p: 3, borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6" sx={{ fontWeight: 800, color: NAV }}>Recent Requests</Typography>
            </Box>
            <TableContainer>
              <Table size="small">
                <TableHead sx={{ bgcolor: '#f8f9fa' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }}>Employee</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }}>Department</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }}>Last Working Day</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }}>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {enrichedRecords.slice(0,5).map((r) => (
                    <TableRow key={`req-${r.id}`} hover onClick={() => setSelectedClearance(r)} sx={{ cursor: 'pointer' }}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Avatar sx={{ width: 28, height: 28, bgcolor: IND, fontSize: '0.7rem' }}>{r.emp?.firstName[0]}{r.emp?.lastName[0]}</Avatar>
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 700 }}>{r.emp?.firstName} {r.emp?.lastName}</Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell><Typography variant="body2">{r.emp?.department}</Typography></TableCell>
                      <TableCell><Typography variant="body2">{new Date(r.dateExit).toLocaleDateString('en-GB')}</Typography></TableCell>
                      <TableCell><Chip label={r.aggStatus} size="small" sx={{ fontWeight: 700, fontSize: '0.65rem', ...getDeptColorProps(r.aggStatus === 'Completed' ? 'Yes' : r.aggStatus === 'In Progress' ? 'Processing' : 'Pending') }} /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} lg={3}>
           {/* Employee Summary Profile */}
           <Card sx={{ borderRadius: 3, boxShadow: '0 2px 12px rgba(0,0,0,0.04)', mb: 3 }}>
             <Box sx={{ p: 2, borderBottom: '1px solid #f0f0f0' }}>
               <Typography variant="subtitle1" sx={{ fontWeight: 800, color: NAV }}>Employee Summary</Typography>
             </Box>
             {selectedEmp ? (
               <CardContent sx={{ p: 3 }}>
                 <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3, textAlign: 'center' }}>
                   <Avatar sx={{ width: 80, height: 80, bgcolor: IND, fontSize: '2rem', mb: 2 }}>{selectedEmp.firstName[0]}{selectedEmp.lastName[0]}</Avatar>
                   <Typography variant="h6" sx={{ fontWeight: 800, color: NAV }}>{selectedEmp.firstName} {selectedEmp.lastName}</Typography>
                   <Typography variant="body2" sx={{ color: IND, fontWeight: 700, mb: 0.5 }}>{selectedEmp.id}</Typography>
                   <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>{selectedEmp.designation}</Typography>
                   <Chip label={selectedClearance?.reason || "Notice Period"} size="small" sx={{ bgcolor: 'rgba(2,65,251,0.1)', color: IND, fontWeight: 700 }} />
                 </Box>
               </CardContent>
             ) : (
               <CardContent sx={{ p: 4, textAlign: 'center' }}>
                 <Typography variant="body2" color="text.secondary">Select an employee from the overview to see details.</Typography>
               </CardContent>
             )}
           </Card>
        </Grid>
      </Grid>

      {/* Form Modal */}
      {selectedClearance && (
        <StaffClearanceForm 
          open={isFormOpen} 
          onClose={() => setIsFormOpen(false)} 
          clearance={selectedClearance}
          onApproveSuccess={() => setRefresh(r => r + 1)}
        />
      )}
    </Box>
  );
}
