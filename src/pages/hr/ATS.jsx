import React, { useState } from 'react';
import {
  Box, Card, CardContent, Typography, Grid, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Chip, Button, TextField,
  InputAdornment, MenuItem, Select, FormControl, InputLabel, Avatar,
  Stepper, Step, StepLabel, LinearProgress, IconButton, Tooltip, Divider,
  Checkbox, Menu, ListItemIcon, ListItemText, Stack
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Timeline as PipelineIcon,
  Info as InfoIcon,
  Mail as MailIcon,
  Phone as PhoneIcon,
  MoreVert as MoreIcon,
  CheckCircle as PassIcon,
  Cancel as FailIcon,
  Cancel as RejectIcon,
  ArrowForward as MoveIcon,
  Work as OfferIcon,
  Block as CancelIcon,
  FileDownload as CsvIcon,
  PictureAsPdf as PdfIcon,
  Print as PrintIcon,
} from '@mui/icons-material';
import { applicants } from '../../data/mockData';
import { exportToCSV, printTable, exportToPDF } from '../../utils/exportUtils';

const goldAccent = '#d4a843';

// Pipeline steps as defined by the user
const pipelineSteps = [
  'Application Submitted',
  'Under Review',
  'For Initial Interview',
  'Initial Interview Failed',
  'For Final Interview',
  'Final Interview Failed',
  'Job Offer',
  'Job Offer Declined',
  'Cancelled Application',
  'Onboarding',
];

export default function ApplicantTracking() {
  const [localApplicants, setLocalApplicants] = useState(applicants);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedApplicantId, setSelectedApplicantId] = useState(applicants[0]?.id);
  
  // Action Menu State
  const [anchorEl, setAnchorEl] = useState(null);
  const [actionApplicant, setActionApplicant] = useState(null);

  const selectedApplicant = localApplicants.find(a => a.id === selectedApplicantId);

  const handleToggleRequirement = (applicantId, reqKey) => {
    setLocalApplicants(prev => prev.map(app => {
      if (app.id === applicantId) {
        return {
          ...app,
          requirements: {
            ...app.requirements,
            items: {
              ...app.requirements.items,
              [reqKey]: !app.requirements.items[reqKey]
            }
          }
        };
      }
      return app;
    }));
  };

  const getSuggestedPosition = (course) => {
    const c = (course || '').toLowerCase();
    if (c.includes('account') || c.includes('bsa')) return 'Bookkeeper';
    if (c.includes('business') || c.includes('commerce')) return 'Product Disbursement Officer';
    if (c.includes('it') || c.includes('computer') || c.includes('information')) return 'Compliance Officer'; // Assuming tech compliance
    if (c.includes('psych') || c.includes('hr') || c.includes('human')) return 'HR Head';
    return 'Admin Assistant'; // Default
  };

  const handleStatusTransition = (applicant, nextStatus) => {
    setLocalApplicants(prev => prev.map(app => {
      if (app.id === applicant.id) {
        let updatedApp = { ...app, status: nextStatus };
        
        // Auto-suggest position if moving to Job Offer
        if (nextStatus === 'Job Offer') {
          updatedApp.position = getSuggestedPosition(app.course);
        }

        // Add to pipeline history (optional but good for UI)
        if (updatedApp.pipeline) {
          updatedApp.pipeline = [
            ...updatedApp.pipeline,
            { step: nextStatus, date: new Date().toISOString().split('T')[0], status: 'Completed' }
          ];
        }

        return updatedApp;
      }
      return app;
    }));
    setAnchorEl(null);
  };

  const handleMenuOpen = (event, applicant) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setActionApplicant(applicant);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setActionApplicant(null);
  };

  const filteredApplicants = localApplicants.filter((app) => {
    const matchesSearch = app.name.toLowerCase().includes(search.toLowerCase()) || 
                         app.position.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'All' || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Onboarding': return { bgcolor: '#e8f5e9', color: '#2e7d32' };
      case 'Initial Interview Failed':
      case 'Final Interview Failed':
      case 'Job Offer Declined':
      case 'Cancelled Application': return { bgcolor: '#ffebee', color: '#c62828' };
      case 'For Initial Interview':
      case 'For Final Interview': return { bgcolor: '#e3f2fd', color: '#1565c0' };
      case 'Job Offer': return { bgcolor: '#fff3e0', color: '#e65100' };
      case 'Under Review': return { bgcolor: '#f3e5f5', color: '#7b1fa2' };
      default: return { bgcolor: '#f5f5f5', color: '#616161' };
    }
  };

  const currentStepIndex = (status) => {
    const idx = pipelineSteps.indexOf(status);
    return idx === -1 ? (status === 'Declined' ? -1 : 0) : idx;
  };

  return (
    <Box className="page-container">

      {/* Page Header and Stats */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ 
          fontWeight: 800, color: '#023DFB', 
          background: 'linear-gradient(90deg, #023DFB, #4a75e6)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          mb: 1 
        }}>
          Applicant Tracking System (ATS)
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500, mb: 3 }}>
          Monitor the recruitment pipeline and manage candidate status.
        </Typography>

        <Grid container spacing={2}>
          {[
            { label: 'Total Applicants', value: localApplicants.length, color: '#023DFB' },
            { label: 'For Interview', value: localApplicants.filter(a => a.status.includes('Interview')).length, color: '#1565c0' },
            { label: 'Job Offers', value: localApplicants.filter(a => a.status.includes('Offer')).length, color: '#e65100' },
            { label: 'Onboarding', value: localApplicants.filter(a => a.status === 'Onboarding').length, color: '#2e7d32' },
          ].map((stat) => (
            <Grid item xs={12} sm={6} md={3} key={stat.label}>
              <Card sx={{ borderRadius: 3, borderLeft: `4px solid ${stat.color}`, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                <CardContent sx={{ py: 2, '&:last-child': { pb: 2 } }}>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase' }}>{stat.label}</Typography>
                  <Typography variant="h5" sx={{ fontWeight: 800, color: stat.color }}>{stat.value}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Grid container spacing={3}>
        {/* Main List */}
        <Grid item xs={12} lg={8}>
          <Card sx={{ borderRadius: 4, boxShadow: '0 12px 32px rgba(10,22,40,0.05)', overflow: 'hidden' }}>
            <Box sx={{ p: 3, borderBottom: '1px solid rgba(0,0,0,0.05)', display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
              <TextField
                size="small"
                placeholder="Search candidates..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                InputProps={{
                  startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: '#023DFB' }} /></InputAdornment>,
                }}
                sx={{ flex: 1, minWidth: 200 }}
              />
              <FormControl size="small" sx={{ minWidth: 160 }}>
                <InputLabel>Status</InputLabel>
                <Select
                  value={statusFilter}
                  label="Status"
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <MenuItem value="All">All Statuses</MenuItem>
                  {pipelineSteps.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
                  <MenuItem value="Declined">Declined</MenuItem>
                </Select>
              </FormControl>
              <Stack direction="row" spacing={1}>
                <Button size="small" variant="outlined" startIcon={<CsvIcon />}
                  onClick={() => exportToCSV(['App No.','Name','Position','Date Applied','Status'], filteredApplicants.map(a => [a.id, a.name, a.position, a.dateApplied, a.status]), 'applicants')}
                  sx={{ borderRadius: 2, fontSize: '0.75rem' }}>CSV</Button>
                <Button size="small" variant="outlined" startIcon={<PdfIcon />}
                  onClick={() => exportToPDF('Applicant Tracking System', ['App No.','Name','Position','Date Applied','Status'], filteredApplicants.map(a => [a.id, a.name, a.position, a.dateApplied, a.status]))}
                  sx={{ borderRadius: 2, fontSize: '0.75rem' }}>PDF</Button>
                <Button size="small" variant="outlined" startIcon={<PrintIcon />}
                  onClick={() => printTable('Applicant Tracking System', ['App No.','Name','Position','Date Applied','Status'], filteredApplicants.map(a => [a.id, a.name, a.position, a.dateApplied, a.status]))}
                  sx={{ borderRadius: 2, fontSize: '0.75rem' }}>Print</Button>
              </Stack>
            </Box>
            
            <TableContainer>
              <Table>
                <TableHead sx={{ bgcolor: 'rgba(2, 61, 251, 0.02)' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.75rem' }}>APPLICATION NO</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.75rem' }}>APPLICANT NAME</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.75rem' }}>POSITION APPLIED</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.75rem' }}>REQUIREMENTS</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.75rem' }}>DATE OF APPLICATION</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.75rem' }}>APPLICATION STATUS</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.75rem' }}>ACTIONS</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredApplicants.map((app) => (
                    <TableRow 
                      key={app.id} 
                      hover 
                      selected={selectedApplicantId === app.id}
                      onClick={() => setSelectedApplicantId(app.id)}
                      sx={{ cursor: 'pointer', '&.Mui-selected': { bgcolor: 'rgba(2, 61, 251, 0.04)' } }}
                    >
                      <TableCell sx={{ fontWeight: 700, color: '#023DFB' }}>{app.id}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Avatar sx={{ width: 32, height: 32, bgcolor: app.status === 'Cancelled Application' ? '#fafafa' : '#023DFB', color: app.status === 'Cancelled Application' ? '#ccc' : '#fff', fontSize: '0.8rem', fontWeight: 700 }}>
                            {app.name.split(' ').map(n => n[0]).join('')}
                          </Avatar>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>{app.name}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell><Typography variant="body2">{app.position}</Typography></TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="caption" sx={{ fontWeight: 700 }}>
                            {Object.values(app.requirements?.items || {}).filter(Boolean).length} / {Object.keys(app.requirements?.items || {}).length}
                          </Typography>
                          <LinearProgress 
                            variant="determinate" 
                            value={(Object.values(app.requirements?.items || {}).filter(Boolean).length / Object.keys(app.requirements?.items || {}).length) * 100} 
                            sx={{ width: 40, height: 4, borderRadius: 2, bgcolor: 'rgba(0,0,0,0.05)', '& .MuiLinearProgress-bar': { bgcolor: goldAccent } }} 
                          />
                        </Box>
                      </TableCell>
                      <TableCell><Typography variant="caption" sx={{ color: 'text.secondary' }}>{app.dateApplied}</Typography></TableCell>
                      <TableCell>
                        <Chip 
                          label={app.status} 
                          size="small" 
                          sx={{ 
                            fontWeight: 700, fontSize: '0.68rem', height: 22,
                            ...getStatusColor(app.status)
                          }} 
                        />
                      </TableCell>
                      <TableCell align="right">
                        <IconButton size="small" onClick={(e) => handleMenuOpen(e, app)}>
                          <MoreIcon sx={{ fontSize: '1.1rem' }} />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredApplicants.length === 0 && (
                    <TableRow><TableCell colSpan={7} align="center" sx={{ py: 4, color: 'text.secondary' }}>No applicants found.</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Grid>

        {/* Applicant Insights / Pipeline Detail */}
        <Grid item xs={12} lg={4}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {selectedApplicant && (
              <Card sx={{ borderRadius: 4, boxShadow: '0 8px 32px rgba(13,27,62,0.1)', overflow: 'hidden' }}>
                <Box sx={{ p: 3, background: 'linear-gradient(135deg, #023DFB, #4a75e6)', color: '#fff' }}>
                  <Typography variant="subtitle2" sx={{ opacity: 0.8, fontWeight: 700, mb: 0.5 }}>CANDIDATE PROFILE</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 800 }}>{selectedApplicant.name}</Typography>
                  <Typography variant="caption" sx={{ opacity: 0.9 }}>{selectedApplicant.position}</Typography>
                </Box>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Avatar sx={{ bgcolor: 'rgba(2, 61, 251, 0.1)', color: '#023DFB' }}><MailIcon fontSize="small" /></Avatar>
                      <Box>
                        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>Email</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>{selectedApplicant.email}</Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Avatar sx={{ bgcolor: 'rgba(212, 168, 67, 0.1)', color: goldAccent }}><PhoneIcon fontSize="small" /></Avatar>
                      <Box>
                        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>Contact</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>{selectedApplicant.contact}</Typography>
                      </Box>
                    </Box>
                  </Box>

                  <Divider sx={{ mb: 3 }} />
                  
                  <Box sx={{ mb: 4 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#023DFB', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <PipelineIcon sx={{ fontSize: '1.2rem' }} /> Requirements Checklist
                    </Typography>
                    
                    <Box sx={{ maxHeight: 300, overflowY: 'auto', pr: 1, '&::-webkit-scrollbar': { width: 4 }, '&::-webkit-scrollbar-thumb': { bgcolor: 'rgba(0,0,0,0.1)', borderRadius: 2 } }}>
                      {Object.entries(selectedApplicant.requirements?.items || {}).map(([key, val]) => (
                        <Box key={key} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
                          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>{key}</Typography>
                          <Checkbox 
                            size="small" 
                            checked={val}
                            onChange={() => handleToggleRequirement(selectedApplicant.id, key)}
                            sx={{ 
                              p: 0.5,
                              color: goldAccent,
                              '&.Mui-checked': { color: '#2e7d32' }
                            }}
                          />
                        </Box>
                      ))}
                    </Box>

                    <Box sx={{ mt: 3, p: 2, borderRadius: 2, bgcolor: 'rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.05)' }}>
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>Date Submitted</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 700 }}>{selectedApplicant.requirements?.dateSubmitted || 'N/A'}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>Req. Status</Typography>
                          <Chip label={selectedApplicant.requirements?.status} size="small" color={selectedApplicant.requirements?.status === 'Complete' ? 'success' : 'warning'} sx={{ height: 20, fontSize: '0.6rem', fontWeight: 800 }} />
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>Onboarding Date</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 700 }}>{selectedApplicant.requirements?.onboardingDate || 'Pending'}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>Orientation Status</Typography>
                          <Box sx={{ display: 'flex', gap: 0.5 }}>
                            <Tooltip title="Orientation 1"><Chip label="O1" size="small" sx={{ height: 18, fontSize: '0.55rem', bgcolor: selectedApplicant.requirements?.training1 ? '#2e7d32' : '#ccc', color: '#fff' }} /></Tooltip>
                            <Tooltip title="Orientation 2"><Chip label="O2" size="small" sx={{ height: 18, fontSize: '0.55rem', bgcolor: selectedApplicant.requirements?.training2 ? '#2e7d32' : '#ccc', color: '#fff' }} /></Tooltip>
                          </Box>
                        </Grid>
                      </Grid>
                    </Box>
                  </Box>

                  <Divider sx={{ mb: 3 }} />
                  
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#023DFB', mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PipelineIcon sx={{ fontSize: '1.2rem' }} /> Hiring Pipeline
                  </Typography>

                  {selectedApplicant.status === 'Cancelled Application' ? (
                    <Box sx={{ textAlign: 'center', py: 2 }}>
                      <RejectIcon sx={{ color: '#c62828', fontSize: '3rem', opacity: 0.2, mb: 1 }} />
                      <Typography variant="body2" sx={{ color: '#c62828', fontWeight: 700 }}>APPLICATION CANCELLED</Typography>
                    </Box>
                  ) : (
                    <Stepper activeStep={currentStepIndex(selectedApplicant.status)} orientation="vertical" sx={{ mb: 2 }}>
                      {pipelineSteps.map((label, index) => {
                        const isCompleted = index < currentStepIndex(selectedApplicant.status);
                        const isCurrent = index === currentStepIndex(selectedApplicant.status);
                        
                        return (
                          <Step key={label} completed={isCompleted}>
                            <StepLabel 
                              StepIconProps={{
                                sx: {
                                  '&.Mui-active': { color: '#023DFB' },
                                  '&.Mui-completed': { color: '#2e7d32' },
                                }
                              }}
                            >
                              <Typography variant="caption" sx={{ 
                                fontWeight: isCurrent ? 800 : 600, 
                                color: isCurrent ? '#023DFB' : (isCompleted ? '#2e7d32' : 'text.secondary'),
                                fontSize: '0.75rem' 
                              }}>
                                {label}
                              </Typography>
                            </StepLabel>
                          </Step>
                        );
                      })}
                    </Stepper>
                  )}

                  <Box sx={{ mt: 3, display: 'flex', gap: 1 }}>
                    <Button variant="contained" fullWidth size="small" sx={{ bgcolor: '#023DFB', fontWeight: 700, borderRadius: 2 }}>
                      Move to Next
                    </Button>
                    <Button variant="outlined" color="error" fullWidth size="small" sx={{ fontWeight: 700, borderRadius: 2 }}>
                      Decline
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            )}

            <Card sx={{ 
              borderRadius: 4, 
              background: `linear-gradient(135deg, ${goldAccent}22 0%, #fff 100%)`,
              boxShadow: '0 4px 12px rgba(212, 168, 67, 0.1)', 
              border: `1px solid ${goldAccent}44` 
            }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2, color: goldAccent }}>Recruitment Sources</Typography>
                {['LinkedIn', 'Indeed', 'JobStreet', 'Apecc Website', 'Referral'].map((source) => {
                  const count = localApplicants.filter(a => a.source === source).length;
                  const percentage = (count / localApplicants.length) * 100;
                  return (
                    <Box key={source} sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="caption" sx={{ fontWeight: 600 }}>{source}</Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>{count}</Typography>
                      </Box>
                      <LinearProgress 
                        variant="determinate" 
                        value={percentage} 
                        sx={{ height: 4, borderRadius: 2, bgcolor: 'rgba(0,0,0,0.05)', '& .MuiLinearProgress-bar': { bgcolor: goldAccent } }} 
                      />
                    </Box>
                  );
                })}
              </CardContent>
            </Card>
          </Box>
        </Grid>
      </Grid>

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            borderRadius: 2,
            minWidth: 200,
            boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
            border: '1px solid rgba(0,0,0,0.05)'
          }
        }}
      >
        <Box sx={{ px: 2, py: 1, borderBottom: '1px solid rgba(0,0,0,0.05)', mb: 1 }}>
          <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase' }}>
            Workflow Actions
          </Typography>
        </Box>

        {actionApplicant?.status === 'For Initial Interview' && [
          <MenuItem key="pass-initial" onClick={() => handleStatusTransition(actionApplicant, 'For Final Interview')}>
            <ListItemIcon><PassIcon fontSize="small" color="success" /></ListItemIcon>
            <ListItemText primary="Pass Initial Interview" secondary="Move to Final Stage" secondaryTypographyProps={{ fontSize: '0.65rem' }} />
          </MenuItem>,
          <MenuItem key="fail-initial" onClick={() => handleStatusTransition(actionApplicant, 'Initial Interview Failed')}>
            <ListItemIcon><FailIcon fontSize="small" color="error" /></ListItemIcon>
            <ListItemText primary="Fail Initial Interview" secondary="Stop Application" secondaryTypographyProps={{ fontSize: '0.65rem' }} />
          </MenuItem>
        ]}

        {actionApplicant?.status === 'For Final Interview' && [
          <MenuItem key="pass-final" onClick={() => handleStatusTransition(actionApplicant, 'Job Offer')}>
            <ListItemIcon><PassIcon fontSize="small" color="success" /></ListItemIcon>
            <ListItemText primary="Pass Final Interview" secondary="Move to Job Offer" secondaryTypographyProps={{ fontSize: '0.65rem' }} />
          </MenuItem>,
          <MenuItem key="fail-final" onClick={() => handleStatusTransition(actionApplicant, 'Final Interview Failed')}>
            <ListItemIcon><FailIcon fontSize="small" color="error" /></ListItemIcon>
            <ListItemText primary="Fail Final Interview" secondary="Stop Application" secondaryTypographyProps={{ fontSize: '0.65rem' }} />
          </MenuItem>
        ]}

        {actionApplicant?.status === 'Job Offer' && [
          <MenuItem key="accept-offer" onClick={() => handleStatusTransition(actionApplicant, 'Onboarding')}>
            <ListItemIcon><OfferIcon fontSize="small" color="primary" /></ListItemIcon>
            <ListItemText primary="Accept Job Offer" secondary="Move to Onboarding" secondaryTypographyProps={{ fontSize: '0.65rem' }} />
          </MenuItem>,
          <MenuItem key="decline-offer" onClick={() => handleStatusTransition(actionApplicant, 'Job Offer Declined')}>
            <ListItemIcon><FailIcon fontSize="small" color="error" /></ListItemIcon>
            <ListItemText primary="Decline Job Offer" secondary="Candidate Rejected" secondaryTypographyProps={{ fontSize: '0.65rem' }} />
          </MenuItem>
        ]}

        {actionApplicant?.status !== 'Cancelled Application' && actionApplicant?.status !== 'Onboarding' && (
          <MenuItem onClick={() => handleStatusTransition(actionApplicant, 'Cancelled Application')}>
            <ListItemIcon><CancelIcon fontSize="small" color="disabled" /></ListItemIcon>
            <ListItemText primary="Cancel Application" />
          </MenuItem>
        )}

        <Divider />
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon><InfoIcon fontSize="small" /></ListItemIcon>
          <ListItemText primary="View Full Profile" />
        </MenuItem>
      </Menu>
    </Box>
  );
}
