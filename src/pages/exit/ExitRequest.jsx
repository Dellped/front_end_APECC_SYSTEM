import React, { useState } from 'react';
import {
  Box, Card, CardContent, Typography, Grid, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Chip, Button, TextField,
  InputAdornment, MenuItem, Select, FormControl, InputLabel, Avatar,
  Stepper, Step, StepLabel, Divider, IconButton, Stack
} from '@mui/material';
import {
  Search as SearchIcon,
  Timeline as PipelineIcon,
  CheckCircle as SuccessIcon,
  Cancel as RejectIcon,
  Mail as MailIcon,
  Phone as PhoneIcon,
  MoreVert as MoreIcon,
  FileDownload as CsvIcon,
  PictureAsPdf as PdfIcon,
  Print as PrintIcon,
} from '@mui/icons-material';
import { exitRequests, exitRequestSteps } from '../../data/mockData';
import { exportToCSV, printTable, exportToPDF } from '../../utils/exportUtils';

const goldAccent = '#d4a843';

export default function ExitRequest() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedRequest, setSelectedRequest] = useState(exitRequests[0]);

  const filteredRequests = exitRequests.filter((req) => {
    const matchesSearch = req.name.toLowerCase().includes(search.toLowerCase()) || 
                          req.memberId.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'All' || req.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Final Approval': return { bgcolor: '#e8f5e9', color: '#2e7d32' };
      case 'Rejected': return { bgcolor: '#ffebee', color: '#c62828' };
      case 'Clearance Process': return { bgcolor: '#e3f2fd', color: '#1565c0' };
      case 'HR Review & Approval': return { bgcolor: '#fff3e0', color: '#e65100' };
      default: return { bgcolor: '#f5f5f5', color: '#616161' };
    }
  };

  const currentStepIndex = (status) => {
    const idx = exitRequestSteps.indexOf(status);
    return idx === -1 ? (status === 'Rejected' ? -1 : 0) : idx;
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
          Exit Request
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500, mb: 3 }}>
          Monitor the exit process workflow for members and employees.
        </Typography>

        <Grid container spacing={2}>
          {[
            { label: 'Total Requests', value: exitRequests.length, color: '#023DFB' },
            { label: 'Under Review', value: exitRequests.filter(r => r.status === 'HR Review & Approval').length, color: '#e65100' },
            { label: 'In Clearance', value: exitRequests.filter(r => r.status === 'Clearance Process').length, color: '#1565c0' },
            { label: 'Completed', value: exitRequests.filter(r => r.status === 'Final Approval').length, color: '#2e7d32' },
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
                placeholder="Search by name or ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                InputProps={{
                  startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: '#023DFB' }} /></InputAdornment>,
                }}
                sx={{ flex: 1, minWidth: 200 }}
              />
              <FormControl size="small" sx={{ minWidth: 160 }}>
                <InputLabel>Pipeline Stage</InputLabel>
                <Select
                  value={statusFilter}
                  label="Pipeline Stage"
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <MenuItem value="All">All Stages</MenuItem>
                  {exitRequestSteps.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
                  <MenuItem value="Rejected">Rejected</MenuItem>
                </Select>
              </FormControl>
              <Stack direction="row" spacing={1}>
                <Button size="small" variant="outlined" startIcon={<CsvIcon />}
                  onClick={() => exportToCSV(['Name','Member ID','Role Type','Exit Type','Stage','Date'], filteredRequests.map(r => [r.name, r.memberId, r.roleType, r.exitType, r.status, r.dateSubmitted]), 'exit_requests')}
                  sx={{ borderRadius: 2, fontSize: '0.75rem' }}>CSV</Button>
                <Button size="small" variant="outlined" startIcon={<PdfIcon />}
                  onClick={() => exportToPDF('Exit Request & Pipeline', ['Name','Member ID','Role Type','Exit Type','Stage','Date'], filteredRequests.map(r => [r.name, r.memberId, r.roleType, r.exitType, r.status, r.dateSubmitted]))}
                  sx={{ borderRadius: 2, fontSize: '0.75rem' }}>PDF</Button>
                <Button size="small" variant="outlined" startIcon={<PrintIcon />}
                  onClick={() => printTable('Exit Request & Pipeline', ['Name','Member ID','Role Type','Exit Type','Stage','Date'], filteredRequests.map(r => [r.name, r.memberId, r.roleType, r.exitType, r.status, r.dateSubmitted]))}
                  sx={{ borderRadius: 2, fontSize: '0.75rem' }}>Print</Button>
              </Stack>
            </Box>
            
            <TableContainer>
              <Table>
                <TableHead sx={{ bgcolor: 'rgba(2, 61, 251, 0.02)' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.75rem' }}>PERSON</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.75rem' }}>ROLE TYPE</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.75rem' }}>EXIT TYPE</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.75rem' }}>STAGE</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.75rem' }}>ACTIONS</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredRequests.map((req) => (
                    <TableRow 
                      key={req.id} 
                      hover 
                      selected={selectedRequest?.id === req.id}
                      onClick={() => setSelectedRequest(req)}
                      sx={{ cursor: 'pointer', '&.Mui-selected': { bgcolor: 'rgba(2, 61, 251, 0.04)' } }}
                    >
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Avatar sx={{ width: 32, height: 32, bgcolor: req.status === 'Rejected' ? '#fafafa' : '#023DFB', color: req.status === 'Rejected' ? '#ccc' : '#fff', fontSize: '0.8rem', fontWeight: 700 }}>
                            {req.name.split(' ').map(n => n[0]).join('').substring(0,2)}
                          </Avatar>
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>{req.name}</Typography>
                            <Typography variant="caption" sx={{ color: 'text.secondary' }}>{req.memberId}</Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell><Typography variant="body2">{req.roleType}</Typography></TableCell>
                      <TableCell><Typography variant="body2">{req.exitType}</Typography></TableCell>
                      <TableCell>
                        <Chip 
                          label={req.status} 
                          size="small" 
                          sx={{ 
                            fontWeight: 700, fontSize: '0.68rem', height: 22,
                            ...getStatusColor(req.status)
                          }} 
                        />
                      </TableCell>
                      <TableCell align="right">
                        <IconButton size="small"><MoreIcon sx={{ fontSize: '1.1rem' }} /></IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredRequests.length === 0 && (
                    <TableRow><TableCell colSpan={5} align="center" sx={{ py: 4, color: 'text.secondary' }}>No exit requests found.</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Grid>

        {/* Exit Insights / Pipeline Detail */}
        <Grid item xs={12} lg={4}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {selectedRequest && (
              <Card sx={{ borderRadius: 4, boxShadow: '0 8px 32px rgba(13,27,62,0.1)', overflow: 'hidden' }}>
                <Box sx={{ p: 3, background: 'linear-gradient(135deg, #023DFB, #4a75e6)', color: '#fff' }}>
                  <Typography variant="subtitle2" sx={{ opacity: 0.8, fontWeight: 700, mb: 0.5 }}>EXIT TRACKER</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 800 }}>{selectedRequest.name}</Typography>
                  <Typography variant="caption" sx={{ opacity: 0.9 }}>{selectedRequest.memberId} • {selectedRequest.roleType}</Typography>
                </Box>
                <CardContent sx={{ p: 3 }}>
                   <Box sx={{ mb: 3 }}>
                     <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>Remarks / Reason:</Typography>
                     <Typography variant="body2" sx={{ fontWeight: 500, mt: 0.5, fontStyle: 'italic' }}>"{selectedRequest.remarks}"</Typography>
                   </Box>

                  <Divider sx={{ mb: 3 }} />
                  
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#023DFB', mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PipelineIcon sx={{ fontSize: '1.2rem' }} /> Exit Process Pipeline
                  </Typography>

                  {selectedRequest.status === 'Rejected' ? (
                    <Box sx={{ textAlign: 'center', py: 2 }}>
                      <RejectIcon sx={{ color: '#c62828', fontSize: '3rem', opacity: 0.2, mb: 1 }} />
                      <Typography variant="body2" sx={{ color: '#c62828', fontWeight: 700 }}>REQUEST REJECTED</Typography>
                    </Box>
                  ) : (
                    <Stepper activeStep={currentStepIndex(selectedRequest.status)} orientation="vertical" sx={{ mb: 2 }}>
                      {exitRequestSteps.map((label, index) => {
                        const isCompleted = index < currentStepIndex(selectedRequest.status) || (selectedRequest.status === 'Final Approval' && index === currentStepIndex(selectedRequest.status));
                        const isCurrent = index === currentStepIndex(selectedRequest.status) && selectedRequest.status !== 'Final Approval';
                        
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

                  {selectedRequest.status !== 'Final Approval' && selectedRequest.status !== 'Rejected' && (
                     <Box sx={{ mt: 3, display: 'flex', gap: 1 }}>
                       <Button variant="contained" fullWidth size="small" sx={{ bgcolor: '#023DFB', fontWeight: 700, borderRadius: 2 }}>
                         Move to Next
                       </Button>
                       <Button variant="outlined" color="error" fullWidth size="small" sx={{ fontWeight: 700, borderRadius: 2 }}>
                         Reject
                       </Button>
                     </Box>
                  )}
                </CardContent>
              </Card>
            )}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
