import React, { useState } from 'react';
import {
  Box, Card, CardContent, Typography, Grid, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Chip, Avatar, Button,
  FormControl, InputLabel, Select, MenuItem, Dialog, DialogContent, Stack,
  Autocomplete, TextField, Divider
} from '@mui/material';
import {
  EventNote as LeavesIcon, Gavel as SanctionsIcon,
  AccountBalanceWallet as CreditsIcon, Add as AddIcon
} from '@mui/icons-material';
import { employees, leaveRecords, leaveBalances, sanctions } from '../../data/mockData';
import LeaveApplicationForm from './LeaveApplicationForm';

const logoBlue = '#023DFB';

export default function EmployeeLeaveSummary() {
  const initialId = employees && employees.length > 0 ? employees[0].id : null;
  const [selectedEmpId, setSelectedEmpId] = useState(initialId);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const currentEmployee = employees.find(e => e.id === selectedEmpId);
  const employeeLeaves = leaveRecords.filter(l => l.employeeId === selectedEmpId);
  const employeeBalances = leaveBalances.filter(lb => lb.employeeId === selectedEmpId);
  const employeeSanctions = sanctions.filter(s => s.employeeId === selectedEmpId);

  const headerStyle = {
    bgcolor: logoBlue,
    color: '#fff',
    fontWeight: 700,
    fontSize: '0.75rem',
  };

  return (
    <Box className="page-container">
      {/* Search & Profile Bar */}
      <Card sx={{ mb: 3, borderRadius: 3, boxShadow: '0 4px 24px rgba(0,0,0,0.06)', overflow: 'visible' }}>
        <CardContent sx={{ p: 0 }}>
            <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
                    <Autocomplete
                        size="small"
                        options={employees || []}
                        getOptionLabel={(option) => `${option.firstName} ${option.lastName} (${option.id})`}
                        value={selectedEmpId === initialId ? null : (currentEmployee || null)}
                        onChange={(event, newValue) => setSelectedEmpId(newValue ? newValue.id : initialId)}
                        renderInput={(params) => (
                            <TextField 
                                {...params} 
                                label="Search Employee Name or ID" 
                                sx={{ minWidth: 350, '& .MuiOutlinedInput-root': { borderRadius: 2 } }} 
                            />
                        )}
                    />
                </Box>
                <Button 
                    variant="contained" 
                    startIcon={<AddIcon />}
                    disabled={!selectedEmpId}
                    onClick={() => setIsFormOpen(true)}
                    sx={{ bgcolor: logoBlue, borderRadius: 2, textTransform: 'none', px: 3, ml: 2, '&:hover': { bgcolor: '#012dc7' } }}
                >
                    Apply for a Leave
                </Button>
            </Box>

            {currentEmployee && (
                <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 4, position: 'relative' }}>
                    <Box sx={{ position: 'relative' }}>
                        <Avatar 
                            src={currentEmployee.photo} 
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
                                color: '#fff',
                                fontWeight: 800,
                                fontSize: '0.6rem',
                                border: '2px solid #fff'
                            }} 
                        />
                    </Box>

                    <Grid container columnSpacing={4} rowSpacing={1}>
                        <Grid item xs={12} sm={4}>
                            <Typography variant="caption" sx={{ fontWeight: 800, color: logoBlue, textTransform: 'uppercase', letterSpacing: '1px' }}>
                                Employee Full Name
                            </Typography>
                            <Typography variant="h5" sx={{ fontWeight: 900, color: '#1a202c', mt: 0.5, lineHeight: 1.2 }}>
                                {currentEmployee.firstName} {currentEmployee.lastName}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                                Employee Account Profile
                            </Typography>
                        </Grid>

                        <Grid item xs={12} sm={8}>
                            <Box sx={{ 
                                display: 'grid', 
                                gridTemplateColumns: 'repeat(3, 1fr)', 
                                gap: 3, 
                                mt: 1,
                                bgcolor: 'rgba(0,0,0,0.02)',
                                p: 2,
                                borderRadius: 2,
                                border: '1px solid rgba(0,0,0,0.05)'
                            }}>
                                <Box>
                                    <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', display: 'block' }}>DESIGNATION</Typography>
                                    <Typography variant="body1" sx={{ fontWeight: 800, color: '#2d3748' }}>{currentEmployee.designation}</Typography>
                                </Box>
                                <Box>
                                    <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', display: 'block' }}>DEPARTMENT</Typography>
                                    <Typography variant="body1" sx={{ fontWeight: 800, color: '#2d3748' }}>{currentEmployee.department}</Typography>
                                </Box>
                                <Box>
                                    <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', display: 'block' }}>EMPLOYEE ID</Typography>
                                    <Typography variant="body1" sx={{ fontWeight: 900, color: logoBlue, letterSpacing: '1px' }}>{currentEmployee.id}</Typography>
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            )}
        </CardContent>
      </Card>

      {!selectedEmpId ? (
        <Typography>Loading employee data...</Typography>
      ) : (
        <>
          {/* Summary Cards */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={4}>
                <Card sx={{ borderRadius: 3, background: 'linear-gradient(135deg, #023DFB 0%, #4a75e6 100%)', color: '#fff' }}>
                    <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box>
                            <Typography variant="body2" sx={{ opacity: 0.8 }}>Pending Applications</Typography>
                            <Typography variant="h4" sx={{ fontWeight: 800 }}>{employeeLeaves?.filter(l => l.status === 'Pending').length || 0}</Typography>
                        </Box>
                        <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}><LeavesIcon /></Avatar>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={12} sm={4}>
                <Card sx={{ borderRadius: 3, background: 'linear-gradient(135deg, #2e7d32 0%, #4caf50 100%)', color: '#fff' }}>
                    <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box>
                            <Typography variant="body2" sx={{ opacity: 0.8 }}>Remaining Credits</Typography>
                            <Typography variant="h4" sx={{ fontWeight: 800 }}>{employeeBalances?.reduce((acc, b) => acc + (b.remaining || 0), 0) || 0}</Typography>
                        </Box>
                        <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}><CreditsIcon /></Avatar>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={12} sm={4}>
                <Card sx={{ borderRadius: 3, background: 'linear-gradient(135deg, #c62828 0%, #ef5350 100%)', color: '#fff' }}>
                    <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box>
                            <Typography variant="body2" sx={{ opacity: 0.8 }}>Active Sanctions</Typography>
                            <Typography variant="h4" sx={{ fontWeight: 800 }}>{employeeSanctions?.filter(s => s.status === 'Active').length || 0}</Typography>
                        </Box>
                        <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}><SanctionsIcon /></Avatar>
                    </CardContent>
                </Card>
            </Grid>
          </Grid>

          <Grid container spacing={3}>
            {/* Leave History */}
            <Grid item xs={12} md={8}>
                <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                    <CardContent>
                        <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>Leave Application History</Typography>
                        <TableContainer component={Box} sx={{ maxHeight: 400 }}>
                            <Table stickyHeader size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={headerStyle}>Type</TableCell>
                                        <TableCell sx={headerStyle}>Start Date</TableCell>
                                        <TableCell sx={headerStyle}>End Date</TableCell>
                                        <TableCell sx={headerStyle}>Days</TableCell>
                                        <TableCell sx={headerStyle}>Status</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {employeeLeaves?.map((l, i) => (
                                        <TableRow key={i} hover>
                                            <TableCell sx={{ fontWeight: 600 }}>{l.type}</TableCell>
                                            <TableCell>{l.startDate}</TableCell>
                                            <TableCell>{l.endDate}</TableCell>
                                            <TableCell>{l.days}</TableCell>
                                            <TableCell>
                                                <Chip 
                                                    label={l.status} 
                                                    size="small" 
                                                    sx={{ 
                                                        fontWeight: 700, fontSize: '0.7rem',
                                                        bgcolor: l.status === 'Approved' ? 'rgba(46,125,50,0.1)' : 'rgba(230,81,0,0.1)',
                                                        color: l.status === 'Approved' ? '#2e7d32' : '#ed6c02'
                                                    }} 
                                                />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </CardContent>
                </Card>
            </Grid>

            {/* Credits & Sanctions */}
            <Grid item xs={12} md={4}>
                <Stack spacing={3}>
                    <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
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
                                    {employeeBalances?.map((lb, i) => (
                                        <TableRow key={i}>
                                            <TableCell sx={{ fontSize: '0.8rem' }}>{lb.type}</TableCell>
                                            <TableCell align="center" sx={{ fontSize: '0.8rem', color: '#d32f2f' }}>{lb.used}</TableCell>
                                            <TableCell align="center" sx={{ fontSize: '0.8rem', fontWeight: 600, color: '#2e7d32' }}>{lb.remaining}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>

                    <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                        <CardContent>
                            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>Active Sanctions</Typography>
                            {employeeSanctions?.filter(s => s.status === 'Active').length > 0 ? (
                                employeeSanctions.filter(s => s.status === 'Active').map((s, i) => (
                                    <Box key={i} sx={{ p: 1, borderLeft: '3px solid #d32f2f', bgcolor: 'rgba(211,47,47,0.05)', mb: 1 }}>
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
        </>
      )}

      {/* Leave Application Dialog */}
      <Dialog 
        open={isFormOpen} 
        onClose={() => setIsFormOpen(false)}
        maxWidth="md"
        fullWidth
        scroll="paper"
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogContent sx={{ p: 0 }}>
            <LeaveApplicationForm 
                employee={currentEmployee} 
                onCancel={() => setIsFormOpen(false)}
                onSubmit={(data) => {
                    console.log('Leave Request Submitted:', data);
                    setIsFormOpen(false);
                    // In a real app, this would update the backend/state
                }}
            />
        </DialogContent>
      </Dialog>
    </Box>
  );
}
