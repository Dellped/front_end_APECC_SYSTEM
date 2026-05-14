import React, { useState } from 'react';
import {
  Box, Card, CardContent, Typography, Grid, Button, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Chip, IconButton,
  Tooltip, TextField, InputAdornment, Dialog, DialogTitle, DialogContent,
  DialogActions, MenuItem, Stack, Paper
} from '@mui/material';
import {
  Add as AddIcon,
  CalendarMonth as CalendarIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';

const goldAccent = '#d4a843';
const NAV = '#05077E';
const IND = '#0241FB';

const initialPeriods = [
  { id: 1, name: 'May 2026', start: '2026-05-01', end: '2026-05-15', cutoff: 'First Half', payDate: '2026-05-20', status: 'Active' },
  { id: 2, name: 'May 2026', start: '2026-05-16', end: '2026-05-31', cutoff: 'Second Half', payDate: '2026-06-05', status: 'Active' },
  { id: 3, name: 'April 2026', start: '2026-04-16', end: '2026-04-30', cutoff: 'Second Half', payDate: '2026-05-05', status: 'Closed' },
  { id: 4, name: 'April 2026', start: '2026-04-01', end: '2026-04-15', cutoff: 'First Half', payDate: '2026-04-20', status: 'Closed' },
];

export default function PayrollPeriods() {
  const [periods, setPeriods] = useState(initialPeriods);
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState(null);

  const handleOpen = (period = null) => {
    setSelectedPeriod(period);
    setOpen(true);
  };

  const getStatusChip = (status) => {
    const isActive = status === 'Active';
    return (
      <Chip
        label={status}
        size="small"
        sx={{
          fontWeight: 700,
          bgcolor: isActive ? '#e8f5e9' : '#f5f5f5',
          color: isActive ? '#2e7d32' : '#757575',
          fontSize: '0.7rem',
          border: '1px solid',
          borderColor: isActive ? 'rgba(46, 125, 50, 0.2)' : 'rgba(0,0,0,0.1)'
        }}
      />
    );
  };

  return (
    <Box className="page-container">
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: NAV, mb: 0.5 }}>
            Payroll Periods
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
            Define and control cutoff schedules and pay dates.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
          sx={{
            borderRadius: 2,
            background: `linear-gradient(135deg, ${NAV} 0%, ${IND} 100%)`,
            boxShadow: '0 4px 12px rgba(2,65,251,0.2)',
            fontWeight: 700,
            px: 3
          }}
        >
          Create Payroll Period
        </Button>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={selectedPeriod ? 8 : 12} sx={{ transition: 'all 0.3s ease' }}>
          <Card sx={{ borderRadius: 4, boxShadow: '0 8px 32px rgba(0,0,0,0.06)', borderTop: `4px solid ${goldAccent}` }}>
            <Box sx={{ p: 3, borderBottom: '1px solid rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <TextField
                size="small"
                placeholder="Search periods..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: 'text.disabled', fontSize: '1.1rem' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{ width: 300, '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
              />
            </Box>
            <TableContainer>
              <Table>
                <TableHead sx={{ bgcolor: 'rgba(0,0,0,0.02)' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }}>Period Name</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }}>Start Date</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }}>End Date</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }}>Cutoff Type</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }}>Pay Date</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }}>Status</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700, color: 'text.secondary' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {periods.map((period) => (
                    <TableRow 
                      key={period.id} 
                      hover 
                      selected={selectedPeriod?.id === period.id}
                      onClick={() => setSelectedPeriod(period)}
                      sx={{ cursor: 'pointer' }}
                    >
                      <TableCell sx={{ fontWeight: 700, color: IND }}>{period.name}</TableCell>
                      <TableCell>{period.start}</TableCell>
                      <TableCell>{period.end}</TableCell>
                      <TableCell>
                        <Chip label={period.cutoff} size="small" variant="outlined" sx={{ fontWeight: 600, fontSize: '0.65rem' }} />
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>{period.payDate}</TableCell>
                      <TableCell>{getStatusChip(period.status)}</TableCell>
                      <TableCell align="right">
                        <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleOpen(period); }} sx={{ color: IND }}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Grid>

        {selectedPeriod && (
          <Grid item xs={12} md={4}>
            <Card sx={{ borderRadius: 4, boxShadow: '0 8px 32px rgba(0,0,0,0.08)', position: 'sticky', top: 20 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 800, color: NAV, mb: 3 }}>
                  Period Details
                </Typography>
                
                <Stack spacing={3}>
                  <Box>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase' }}>
                      Period Name
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 700 }}>{selectedPeriod.name}</Typography>
                  </Box>

                  <Box>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase' }}>
                      Cutoff Range
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 700 }}>
                      {selectedPeriod.start} — {selectedPeriod.end}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase' }}>
                      Scheduled Pay Date
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                      <CalendarIcon sx={{ color: goldAccent }} />
                      <Typography variant="body1" sx={{ fontWeight: 700, color: goldAccent }}>
                        {selectedPeriod.payDate}
                      </Typography>
                    </Box>
                  </Box>

                  <Divider />

                  <Box>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase', mb: 1, display: 'block' }}>
                      Management Actions
                    </Typography>
                    <Stack spacing={1.5}>
                      <Button fullWidth variant="outlined" color="primary" sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 700 }}>
                        Edit Schedule
                      </Button>
                      <Button 
                        fullWidth 
                        variant="contained" 
                        color={selectedPeriod.status === 'Active' ? 'error' : 'success'} 
                        sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 700 }}
                      >
                        {selectedPeriod.status === 'Active' ? 'Deactivate Period' : 'Activate Period'}
                      </Button>
                    </Stack>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>

      {/* Create/Edit Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontWeight: 800, color: NAV }}>
          {selectedPeriod ? 'Edit Payroll Period' : 'Create New Payroll Period'}
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={3} sx={{ mt: 0.5 }}>
            <Grid item xs={12}>
              <TextField fullWidth label="Period Name" placeholder="e.g. May 2026" />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Start Date" type="date" InputLabelProps={{ shrink: true }} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="End Date" type="date" InputLabelProps={{ shrink: true }} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth select label="Cutoff Type" defaultValue="First Half">
                <MenuItem value="First Half">First Half (1-15)</MenuItem>
                <MenuItem value="Second Half">Second Half (16-31)</MenuItem>
                <MenuItem value="Monthly">Monthly</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Pay Date" type="date" InputLabelProps={{ shrink: true }} />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpen(false)} sx={{ color: 'text.secondary', fontWeight: 600 }}>Cancel</Button>
          <Button variant="contained" onClick={() => setOpen(false)} sx={{ background: `linear-gradient(135deg, ${NAV} 0%, ${IND} 100%)`, fontWeight: 700 }}>
            {selectedPeriod ? 'Save Changes' : 'Create Period'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
