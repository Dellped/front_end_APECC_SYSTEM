import React, { useState } from 'react';
import {
  Box, Card, CardContent, Typography, Grid, Button, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, IconButton,
  Tooltip, TextField, InputAdornment, Avatar, Chip, Stack, MenuItem
} from '@mui/material';
import {
  FileOpen as ImportIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Edit as EditIcon,
  MoreVert as MoreIcon,
  AccessTime as TimeIcon,
  CheckCircle as CheckIcon,
  Error as ErrorIcon,
  FileDownload as CsvIcon,
  PictureAsPdf as PdfIcon,
  Print as PrintIcon,
} from '@mui/icons-material';
import { employees, attendanceRecords, payrollPeriods } from '../../data/mockData';
import { exportToCSV, printTable, exportToPDF } from '../../utils/exportUtils';

const goldAccent = '#d4a843';

export default function AttendanceDTR() {
  const [search, setSearch] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState(payrollPeriods[0]?.id || '');

  const getEmployeeName = (id) => {
    if (!id) return 'Unknown';
    const emp = employees?.find(e => e.id === id);
    return emp ? `${emp.firstName} ${emp.lastName}` : id;
  };

  const filtered = (attendanceRecords || []).filter(r => {
    const matchesSearch = 
      (getEmployeeName(r.employeeId) || '').toLowerCase().includes(search.toLowerCase()) ||
      (r.employeeId || '').toLowerCase().includes(search.toLowerCase());
    const matchesPeriod = r.periodId === selectedPeriod;
    return matchesSearch && matchesPeriod;
  });

  const currentPeriod = payrollPeriods.find(p => p.id === selectedPeriod);

  return (
    <Box className="page-container">
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ 
            fontWeight: 800, color: '#023DFB', 
            background: 'linear-gradient(90deg, #023DFB, #4a75e6)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            mb: 0.5 
          }}>
            Attendance & Timekeeping
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
            Sync and review employee DTR data for the current payroll cutoff
          </Typography>
        </Box>
        <Stack direction="row" spacing={2}>
          <Button 
            variant="outlined" 
            startIcon={<ImportIcon />}
            sx={{ borderRadius: 2, height: 45, px: 3, border: '2px solid' }}
          >
            Import Biometric Data
          </Button>
          <Button 
            variant="contained" 
            startIcon={<CheckIcon />}
            sx={{ 
              borderRadius: 2, 
              height: 45,
              background: 'linear-gradient(135deg, #023DFB, #4a75e6)',
              boxShadow: '0 4px 12px rgba(2, 61, 251, 0.2)',
              px: 3
            }}
          >
            Approve All
          </Button>
        </Stack>
      </Box>

      <Grid container spacing={3}>
        {/* DTR Table */}
        <Grid item xs={12}>
          <Card sx={{ borderRadius: 4, boxShadow: '0 12px 32px rgba(10,22,40,0.05)', overflow: 'hidden' }}>
            <Box sx={{ p: 3, borderBottom: '1px solid rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#023DFB' }}>
                    Cutoff: {currentPeriod ? `${currentPeriod.startDate} - ${currentPeriod.endDate}` : 'Select Period'}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                    {currentPeriod?.type || 'Payroll'} | {filtered.length} Records Found
                  </Typography>
                </Box>
                <TextField
                  select
                  size="small"
                  label="Payroll Period"
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  sx={{ width: 220 }}
                >
                  {payrollPeriods.map((p) => (
                    <MenuItem key={p.id} value={p.id}>
                      {p.startDate} - {p.endDate}
                    </MenuItem>
                  ))}
                </TextField>
              </Box>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
                <TextField
                  size="small"
                  placeholder="Search employee..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ color: 'text.disabled', fontSize: '1.1rem' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ width: 200 }}
                />
                <IconButton><FilterIcon /></IconButton>
                <Stack direction="row" spacing={1}>
                  <Button size="small" variant="outlined" startIcon={<CsvIcon />}
                    onClick={() => exportToCSV(
                      ['Employee ID','Employee','Days Worked','Absences','Late (m)','Undertime (m)','OT Hours','Holiday Work','Status'],
                      filtered.map(r => [r.employeeId, getEmployeeName(r.employeeId), r.daysWorked, r.absences, r.late, r.undertime, r.otHours, r.holidayWork, r.absences === 0 ? 'Verified' : 'Check Needed']),
                      'attendance_dtr'
                    )}
                    sx={{ borderRadius: 2, fontSize: '0.75rem' }}>CSV</Button>
                  <Button size="small" variant="outlined" startIcon={<PdfIcon />}
                    onClick={() => exportToPDF('Attendance & Timekeeping - DTR',
                      ['Employee ID','Employee','Days Worked','Absences','Late (m)','Undertime (m)','OT Hours','Holiday Work','Status'],
                      filtered.map(r => [r.employeeId, getEmployeeName(r.employeeId), r.daysWorked, r.absences, r.late, r.undertime, r.otHours, r.holidayWork, r.absences === 0 ? 'Verified' : 'Check Needed'])
                    )}
                    sx={{ borderRadius: 2, fontSize: '0.75rem' }}>PDF</Button>
                  <Button size="small" variant="outlined" startIcon={<PrintIcon />}
                    onClick={() => printTable('Attendance & Timekeeping - DTR',
                      ['Employee ID','Employee','Days Worked','Absences','Late (m)','Undertime (m)','OT Hours','Holiday Work','Status'],
                      filtered.map(r => [r.employeeId, getEmployeeName(r.employeeId), r.daysWorked, r.absences, r.late, r.undertime, r.otHours, r.holidayWork, r.absences === 0 ? 'Verified' : 'Check Needed'])
                    )}
                    sx={{ borderRadius: 2, fontSize: '0.75rem' }}>Print</Button>
                </Stack>
              </Box>
            </Box>
            <TableContainer>
              <Table size="small">
                <TableHead sx={{ bgcolor: 'rgba(2, 61, 251, 0.02)' }}>
                  <TableRow>
                    {['Employee', 'Days Worked', 'Absences', 'Late', 'Undertime', 'OT Hours', 'Holiday Work', 'Status', 'Actions'].map((h) => (
                      <TableCell key={h} sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.75rem', textTransform: 'uppercase', py: 2 }}>{h}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filtered.map((record, i) => (
                    <TableRow key={i} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Avatar sx={{ width: 32, height: 32, bgcolor: i % 2 === 0 ? '#023DFB' : goldAccent, fontSize: '0.8rem' }}>
                            {record.employeeId ? record.employeeId.toString().slice(1) : '?'}
                          </Avatar>
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>{getEmployeeName(record.employeeId)}</Typography>
                            <Typography variant="caption" sx={{ color: 'text.secondary' }}>{record.employeeId}</Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>{record.daysWorked}</TableCell>
                      <TableCell sx={{ color: record.absences > 0 ? '#d32f2f' : 'inherit' }}>{record.absences}</TableCell>
                      <TableCell sx={{ color: record.late > 0 ? '#f57c00' : 'inherit' }}>{record.late}m</TableCell>
                      <TableCell>{record.undertime}m</TableCell>
                      <TableCell sx={{ color: record.otHours > 0 ? '#2e7d32' : 'inherit', fontWeight: 600 }}>{record.otHours}h</TableCell>
                      <TableCell>{record.holidayWork > 0 ? `${record.holidayWork}d` : '0'}</TableCell>
                      <TableCell>
                        <Chip 
                          icon={record.absences === 0 ? <CheckIcon style={{ fontSize: '0.9rem' }} /> : <ErrorIcon style={{ fontSize: '0.9rem' }} />}
                          label={record.absences === 0 ? "Verified" : "Check Needed"}
                          size="small"
                          sx={{ 
                            height: 24, fontSize: '0.7rem', fontWeight: 700,
                            bgcolor: record.absences === 0 ? '#e8f5e9' : '#ffebee',
                            color: record.absences === 0 ? '#2e7d32' : '#d32f2f'
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex' }}>
                          <Tooltip title="View DTR Details"><IconButton size="small" sx={{ color: '#023DFB' }}><TimeIcon sx={{ fontSize: '1.1rem' }} /></IconButton></Tooltip>
                          <Tooltip title="Edit Record"><IconButton size="small"><EditIcon sx={{ fontSize: '1.1rem' }} /></IconButton></Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
