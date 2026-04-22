import React, { useState } from 'react';
import {
  Box, Typography, Grid, TextField, Checkbox, FormControlLabel,
  Divider, Paper, Button, Stack, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow
} from '@mui/material';
import apeccLogo from '../../../assets/images/APECC-Logo.jpg';

const goldAccent = '#d4a843'; 

export default function LeaveApplicationForm({ employee, onCancel, onSubmit, isReadOnly = false, initialData = null }) {
  const [formData, setFormData] = useState(initialData || {
    addressOnLeave: '',
    personResponsible: '',
    startDate: '',
    endDate: '',
    totalDays: '',
    designation: 'Others',
    purpose: '',
    signature: '',
    date: new Date().toISOString().split('T')[0]
  });

  return (
    <Box sx={{ p: 2, bgcolor: '#f5f5f5', minHeight: isReadOnly ? 'auto' : '100vh', display: 'flex', justifyContent: 'center' }}>
      <Paper elevation={isReadOnly ? 0 : 1} sx={{ p: isReadOnly ? 2 : 4, width: '100%', maxWidth: 850, bgcolor: '#FDFDFC', border: isReadOnly ? 'none' : '1px solid #ddd' }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Box component="img" src={apeccLogo} alt="Logo" sx={{ width: 60, mr: 2 }} />
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800, fontSize: '1.2rem', color: '#000' }}>
              ASA PHILIPPINES EMPLOYEES CREDIT COOPERATIVE
            </Typography>
            <Typography variant="caption" sx={{ display: 'block', fontWeight: 600 }}>
              18 E. San Martin Corner San Francisco, Brgy. Kapitolyo, Pasig City
            </Typography>
          </Box>
        </Box>
        
        <Box sx={{ textAlign: 'right', mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 800 }}>Application for Leave</Typography>
        </Box>

        <Box sx={{ border: '2px solid #000', p: 0 }}>
            {/* Reason(s) for Request Section */}
            <Typography variant="caption" sx={{ fontWeight: 800, bgcolor: '#eee', display: 'block', p: 0.5, borderBottom: '1px solid #000' }}>
                REASON (S) FOR REQUEST
            </Typography>
            <Grid container sx={{ borderBottom: '1px solid #000' }}>
                <Grid item xs={8} sx={{ p: 1, borderRight: '1px solid #000' }}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: 600, minWidth: 100 }}>Complete Name</Typography>
                        <Typography variant="body2" sx={{ flex: 1, borderBottom: '1px solid #000', px: 1 }}>
                            {employee ? `${employee.firstName} ${employee.lastName}` : ''}
                        </Typography>
                    </Box>
                </Grid>
                <Grid item xs={4} sx={{ p: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>Position:</Typography>
                        <Typography variant="body2" sx={{ flex: 1, borderBottom: '1px solid #000', px: 1 }}>
                            {employee?.designation || ''}
                        </Typography>
                    </Box>
                </Grid>
            </Grid>

            <Box sx={{ p: 1, borderBottom: '1px solid #000' }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1, mb: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600, minWidth: 180 }}>Address & contact # while on leave</Typography>
                    <TextField variant="standard" fullWidth value={formData.addressOnLeave} onChange={(e) => setFormData({...formData, addressOnLeave: e.target.value})} InputProps={{ readOnly: isReadOnly, disableUnderline: isReadOnly }} />
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600, minWidth: 180 }}>Person responsible in my absence</Typography>
                    <TextField variant="standard" fullWidth value={formData.personResponsible} onChange={(e) => setFormData({...formData, personResponsible: e.target.value})} InputProps={{ readOnly: isReadOnly, disableUnderline: isReadOnly }} />
                </Box>
            </Box>

            <Grid container sx={{ borderBottom: '1px solid #000' }}>
                <Grid item xs={6} sx={{ p: 1, borderRight: '1px solid #000' }}>
                     <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>Period covered</Typography>
                        <TextField type={isReadOnly ? "text" : "date"} variant="standard" value={formData.startDate} onChange={(e) => setFormData({...formData, startDate: e.target.value})} InputProps={{ readOnly: isReadOnly, disableUnderline: isReadOnly }} />
                        <Typography variant="body2">to</Typography>
                        <TextField type={isReadOnly ? "text" : "date"} variant="standard" value={formData.endDate} onChange={(e) => setFormData({...formData, endDate: e.target.value})} InputProps={{ readOnly: isReadOnly, disableUnderline: isReadOnly }} />
                    </Box>
                </Grid>
                <Grid item xs={6} sx={{ p: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>Total No. Of Days</Typography>
                        <TextField variant="standard" fullWidth value={formData.totalDays} onChange={(e) => setFormData({...formData, totalDays: e.target.value})} InputProps={{ readOnly: isReadOnly, disableUnderline: isReadOnly }} />
                    </Box>
                </Grid>
            </Grid>

            <Box sx={{ p: 1, borderBottom: '1px solid #000', display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography variant="body2" sx={{ fontWeight: 800 }}>LEAVE DESIGNATION:</Typography>
                {['Sick', 'Earn', 'Annual', 'Maternity/Patern', 'Others'].map((type) => (
                    <FormControlLabel
                        key={type}
                        control={<Checkbox size="small" checked={formData.designation === type} onChange={() => setFormData({...formData, designation: type})} disabled={isReadOnly} />}
                        label={<Typography variant="caption" sx={{ fontWeight: 600 }}>{type}</Typography>}
                    />
                ))}
            </Box>

            <Box sx={{ p: 1, borderBottom: '1px solid #000' }}>
                <Typography variant="body2" sx={{ fontWeight: 800, mb: 1 }}>PURPOSE OF LEAVE:</Typography>
                <TextField multiline rows={2} fullWidth variant="outlined" sx={{ '& .MuiOutlinedInput-root': { borderRadius: 0 } }} value={formData.purpose} onChange={(e) => setFormData({...formData, purpose: e.target.value})} InputProps={{ readOnly: isReadOnly }} />
            </Box>

            <Grid container sx={{ borderBottom: '2px solid #000' }}>
                <Grid item xs={6} sx={{ p: 1, borderRight: '1px solid #000' }}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1, mt: 2 }}>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>Signature</Typography>
                        <TextField variant="standard" fullWidth sx={{ borderBottom: isReadOnly ? 'none' : '1px solid #000' }} InputProps={{ readOnly: isReadOnly, disableUnderline: isReadOnly }} />
                    </Box>
                </Grid>
                <Grid item xs={6} sx={{ p: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1, mt: 2 }}>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>Date</Typography>
                        <Typography variant="body2" sx={{ flex: 1, borderBottom: isReadOnly ? 'none' : '1px solid #000', px: 1 }}>{formData.date}</Typography>
                    </Box>
                </Grid>
            </Grid>

            {/* Administrative Action Section */}
            <Typography variant="caption" sx={{ fontWeight: 800, bgcolor: '#eee', display: 'block', p: 0.5, borderBottom: '1px solid #000' }}>
                ADMINISTRATIVE ACTION
            </Typography>
            <Box sx={{ p: 2, borderBottom: '2px solid #000' }}>
                <Grid container spacing={4}>
                    <Grid item xs={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Box sx={{ width: 30, height: 30, border: '1px solid #000' }} />
                            <Typography variant="caption" sx={{ fontWeight: 600 }}>Approval for ______ day/s</Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={6}>
                         <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Box sx={{ width: 30, height: 30, border: '1px solid #000' }} />
                            <Typography variant="caption" sx={{ fontWeight: 600 }}>Disapproval and reason ____________________</Typography>
                        </Box>
                    </Grid>
                </Grid>

                <Grid container sx={{ mt: 4, textAlign: 'center' }}>
                    <Grid item xs={4}>
                        <Box sx={{ borderTop: '1px solid #000', pt: 0.5, mx: 1 }}>
                            <Typography variant="caption" sx={{ fontWeight: 800 }}>UNIT HEAD</Typography>
                        </Box>
                        <Typography variant="caption" sx={{ display: 'block', mt: 1 }}>Date: ______________</Typography>
                    </Grid>
                    <Grid item xs={4}>
                        <Box sx={{ borderTop: '1px solid #000', pt: 0.5, mx: 1 }}>
                            <Typography variant="caption" sx={{ fontWeight: 800 }}>ASSISTANT GENERAL MANAGER</Typography>
                        </Box>
                        <Typography variant="caption" sx={{ display: 'block', mt: 1 }}>Date: ______________</Typography>
                    </Grid>
                    <Grid item xs={4}>
                        <Box sx={{ borderTop: '1px solid #000', pt: 0.5, mx: 1 }}>
                            <Typography variant="caption" sx={{ fontWeight: 800 }}>OIC</Typography>
                        </Box>
                    </Grid>
                </Grid>
            </Box>

            {/* HRD Action Section */}
             <Typography variant="caption" sx={{ fontWeight: 800, bgcolor: '#eee', display: 'block', p: 0.5, borderBottom: '1px solid #000' }}>
                HRD ACTION
            </Typography>
            <Box sx={{ p: 2 }}>
                <Stack direction="row" spacing={10} sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ width: 30, height: 30, border: '1px solid #000' }} />
                        <Typography variant="caption" sx={{ fontWeight: 800 }}>APPROVED</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ width: 30, height: 30, border: '1px solid #000' }} />
                        <Typography variant="caption" sx={{ fontWeight: 800 }}>DISAPPROVED</Typography>
                    </Box>
                </Stack>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Typography variant="caption" sx={{ fontWeight: 800 }}>LEAVE CREDIT BALANCES</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Box sx={{ width: 35, height: 25, border: '1px solid #000' }} />
                        <Typography variant="caption" sx={{ fontWeight: 700 }}>SL</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Box sx={{ width: 35, height: 25, border: '1px solid #000' }} />
                        <Typography variant="caption" sx={{ fontWeight: 700 }}>EL</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Box sx={{ width: 35, height: 25, border: '1px solid #000' }} />
                        <Typography variant="caption" sx={{ fontWeight: 700 }}>AL</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Box sx={{ width: 35, height: 25, border: '1px solid #000' }} />
                        <Typography variant="caption" sx={{ fontWeight: 700 }}>ML/PL</Typography>
                    </Box>
                </Box>

                <Box sx={{ mb: 4 }}>
                    <Typography variant="caption" sx={{ fontWeight: 800 }}>COMMENTS</Typography>
                    <Box sx={{ borderBottom: '1px solid #000', minHeight: 40 }} />
                </Box>

                <Grid container>
                    <Grid item xs={6} />
                    <Grid item xs={6} sx={{ textAlign: 'center' }}>
                         <Typography variant="body2" sx={{ fontWeight: 700 }}>Kyzeel Estrella</Typography>
                         <Box sx={{ borderTop: '1px solid #000', mx: 4 }}>
                            <Typography variant="caption" sx={{ display: 'block', fontWeight: 600 }}>Signature with ID #</Typography>
                            <Typography variant="caption" sx={{ display: 'block', fontWeight: 800 }}>HR - Officer</Typography>
                         </Box>
                         <Typography variant="caption" sx={{ display: 'block', textAlign: 'right', mt: 1 }}>Date: _________</Typography>
                    </Grid>
                </Grid>
            </Box>
        </Box>

        <Box sx={{ textAlign: 'right', mt: 0.5 }}>
            <Typography variant="caption" sx={{ fontSize: '0.6rem', fontWeight: 600 }}>1. HRD and/or A/Cs copy</Typography>
        </Box>

        {!isReadOnly && (
          <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 4 }}>
              <Button variant="outlined" color="inherit" onClick={onCancel}>Cancel</Button>
              <Button variant="contained" color="primary" onClick={() => onSubmit(formData)}>Submit Request</Button>
          </Stack>
        )}
      </Paper>
    </Box>
  );
}
