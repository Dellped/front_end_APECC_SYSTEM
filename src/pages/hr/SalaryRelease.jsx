import React, { useState } from 'react';
import {
  Box, Card, CardContent, Typography, Tabs, Tab, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Chip, Button,
  Avatar, Tooltip, IconButton, Dialog, DialogTitle, DialogContent,
  DialogContentText, DialogActions, Stack
} from '@mui/material';
import {
  CheckCircle as SuccessIcon,
  Payments as ReleaseIcon,
  FileDownload as ExportIcon,
  Print as PrintIcon,
  Warning as WarningIcon
} from '@mui/icons-material';
import { employees } from '../../data/mockData';

const NAV = '#05077E';
const IND = '#0241FB';
const goldAccent = '#d4a843';

export default function SalaryRelease() {
  const [tab, setTab] = useState(0);
  const [releaseDialogOpen, setReleaseDialogOpen] = useState(false);
  const [selectedEmp, setSelectedEmp] = useState(null);
  const [empData, setEmpData] = useState(employees.slice(0, 10).map((e, i) => ({
    ...e,
    netPay: 12000 + (i * 500),
    releaseStatus: i < 3 ? 'Paid' : 'Ready'
  })));

  const handleReleaseClick = (emp) => {
    setSelectedEmp(emp);
    setReleaseDialogOpen(true);
  };

  const handleConfirmRelease = () => {
    setEmpData(prev => prev.map(e => 
      e.id === selectedEmp.id ? { ...e, releaseStatus: 'Paid' } : e
    ));
    setReleaseDialogOpen(false);
  };

  const getStatusChip = (status) => {
    const isPaid = status === 'Paid';
    return (
      <Chip
        label={status}
        size="small"
        icon={isPaid ? <SuccessIcon sx={{ fontSize: '0.9rem !important' }} /> : <ReleaseIcon sx={{ fontSize: '0.9rem !important' }} />}
        sx={{
          fontWeight: 700,
          bgcolor: isPaid ? '#e8f5e9' : '#fff3e0',
          color: isPaid ? '#2e7d32' : '#ef6c00',
          fontSize: '0.7rem',
          '& .MuiChip-icon': { color: 'inherit' }
        }}
      />
    );
  };

  return (
    <Box className="page-container">
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: NAV, mb: 0.5 }}>
            Salary Release
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
            Finalize payroll by marking salaries as paid and generating payslips.
          </Typography>
        </Box>

        <Stack direction="row" spacing={1.5}>
          <Button variant="outlined" startIcon={<ExportIcon />} sx={{ borderRadius: 2, fontWeight: 700, textTransform: 'none' }}>
            Export Payroll
          </Button>
          <Button variant="outlined" startIcon={<PrintIcon />} sx={{ borderRadius: 2, fontWeight: 700, textTransform: 'none' }}>
            Print All Payslips
          </Button>
          <Button 
            variant="contained" 
            startIcon={<SuccessIcon />} 
            sx={{ borderRadius: 2, background: `linear-gradient(135deg, ${NAV} 0%, ${IND} 100%)`, fontWeight: 700, textTransform: 'none' }}
          >
            Bulk Release All
          </Button>
        </Stack>
      </Box>

      {/* Tabs */}
      <Box sx={{ mb: 3 }}>
        <Tabs 
          value={tab} 
          onChange={(e, v) => setTab(v)} 
          sx={{ borderBottom: 1, borderColor: 'divider' }}
          textColor="primary"
          indicatorColor="primary"
        >
          <Tab label="First Half Cutoff" sx={{ fontWeight: 700, textTransform: 'none' }} />
          <Tab label="Second Half Cutoff" sx={{ fontWeight: 700, textTransform: 'none' }} />
        </Tabs>
      </Box>

      {/* Release Table */}
      <Card sx={{ borderRadius: 4, boxShadow: '0 8px 32px rgba(0,0,0,0.06)', borderTop: `4px solid ${goldAccent}` }}>
        <TableContainer>
          <Table>
            <TableHead sx={{ bgcolor: 'rgba(0,0,0,0.02)' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }}>Employee</TableCell>
                <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }}>Position</TableCell>
                <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }}>Net Pay</TableCell>
                <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }}>Status</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700, color: 'text.secondary' }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {empData.map((emp) => (
                <TableRow key={emp.id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Avatar sx={{ width: 32, height: 32, bgcolor: IND, fontSize: '0.8rem', fontWeight: 700 }}>
                        {emp.firstName[0]}
                      </Avatar>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 700, color: NAV, lineHeight: 1.2 }}>
                          {emp.firstName} {emp.lastName}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                          ID: {emp.id}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{emp.designation}</Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>{emp.department}</Typography>
                  </TableCell>
                  <TableCell sx={{ fontWeight: 800, color: IND }}>
                    ₱{emp.netPay.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    {getStatusChip(emp.releaseStatus)}
                  </TableCell>
                  <TableCell align="right">
                    {emp.releaseStatus === 'Paid' ? (
                      <Chip label="Done" color="success" size="small" variant="outlined" sx={{ fontWeight: 800, px: 1 }} />
                    ) : (
                      <Button
                        size="small"
                        variant="contained"
                        color="primary"
                        onClick={() => handleReleaseClick(emp)}
                        sx={{ borderRadius: 1.5, textTransform: 'none', fontWeight: 700, px: 2 }}
                      >
                        Release
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Confirmation Modal */}
      <Dialog
        open={releaseDialogOpen}
        onClose={() => setReleaseDialogOpen(false)}
        PaperProps={{ sx: { borderRadius: 3, p: 1 } }}
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1.5, fontWeight: 800, color: NAV }}>
          <WarningIcon sx={{ color: goldAccent, fontSize: '2rem' }} />
          Confirm Salary Release
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ fontWeight: 500 }}>
            Are you sure you want to mark the payroll for <strong>{selectedEmp?.firstName} {selectedEmp?.lastName}</strong> as <strong>PAID</strong>?
            <br /><br />
            This action will finalize the transaction and mark the payslip as released. This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button onClick={() => setReleaseDialogOpen(false)} sx={{ color: 'text.secondary', fontWeight: 700 }}>
            Cancel
          </Button>
          <Button 
            onClick={handleConfirmRelease} 
            variant="contained" 
            sx={{ background: `linear-gradient(135deg, ${NAV} 0%, ${IND} 100%)`, fontWeight: 700, px: 3, borderRadius: 2 }}
          >
            Confirm Release
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
