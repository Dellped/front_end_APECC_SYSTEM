import React from 'react';
import {
  Dialog, DialogContent, Box, Typography, Grid, Divider, Table, 
  TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Paper, Checkbox, TextField, Button, Avatar, IconButton, Stack
} from '@mui/material';
import { 
  Close as CloseIcon, 
  Print as PrintIcon, 
  Download as DownloadIcon 
} from '@mui/icons-material';
import { employees } from '../../data/mockData';

const logoBlue = '#0241FB';

export default function StaffClearanceForm({ open, onClose, clearance }) {
  const emp = employees.find(e => e.id === clearance.employeeId);
  if (!emp) return null;

  const renderSectionHeader = (title, sub) => (
    <Box sx={{ bgcolor: '#f0f4ff', p: 1, mt: 3, mb: 1, border: '1px solid #ddd' }}>
      <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#333' }}>{title}</Typography>
      {sub && <Typography variant="caption" sx={{ fontWeight: 700, color: '#666' }}>{sub}</Typography>}
    </Box>
  );

  const renderItemsTable = (items, headerLabel = 'STATUS', statusKey = 'status') => (
    <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #ddd', borderRadius: 0 }}>
      <Table size="small">
        <TableHead sx={{ bgcolor: '#f8f8f8' }}>
          <TableRow sx={{ height: 30 }}>
            <TableCell sx={{ width: '40px', fontWeight: 800, borderRight: '1px solid #ddd' }}>DEPT</TableCell>
            <TableCell sx={{ fontWeight: 800, borderRight: '1px solid #ddd' }}>ITEM / REQUIREMENT</TableCell>
            <TableCell sx={{ width: '80px', fontWeight: 800, textAlign: 'center', borderRight: '1px solid #ddd' }}>{headerLabel}</TableCell>
            <TableCell sx={{ fontWeight: 800 }}>REMARKS</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((item, idx) => (
            <TableRow key={idx} sx={{ height: 32 }}>
              <TableCell sx={{ borderRight: '1px solid #ddd', fontSize: '0.75rem', fontWeight: 700, p: 0.5, textAlign: 'center' }}>
                {item.code || '-'}
              </TableCell>
              <TableCell sx={{ borderRight: '1px solid #ddd', fontSize: '0.8rem', fontWeight: 600, p: 0.8 }}>
                {item.label}
              </TableCell>
              <TableCell sx={{ borderRight: '1px solid #ddd', p: 0.5, textAlign: 'center' }}>
                <Typography sx={{ 
                  fontSize: '0.75rem', 
                  fontWeight: 900, 
                  color: item.status?.toLowerCase() === 'yes' ? '#2e7d32' : '#d32f2f',
                  textTransform: 'uppercase'
                }}>
                  {item.status || '-'}
                </Typography>
              </TableCell>
              <TableCell sx={{ p: 0.8, fontSize: '0.75rem', color: 'text.secondary' }}>
                {item.remarks}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  const renderSignOff = (label, officer, date) => (
    <Box sx={{ mt: 1, display: 'flex', gap: 2, alignItems: 'flex-end', borderTop: '1px solid #eee', pt: 1 }}>
        <Box sx={{ flex: 1 }}>
            <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary' }}>{label} Officer/Head:</Typography>
            <Typography sx={{ fontWeight: 800, borderBottom: '1px solid #000', pb: 0.2, fontSize: '0.85rem' }}>{officer}</Typography>
        </Box>
        <Box sx={{ flex: 1 }}>
            <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary' }}>Signature:</Typography>
            <Box sx={{ borderBottom: '1px solid #000', height: 20 }} />
        </Box>
        <Box sx={{ width: 120 }}>
            <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary' }}>Date:</Typography>
            <Typography sx={{ fontWeight: 800, borderBottom: '1px solid #000', pb: 0.2, fontSize: '0.85rem' }}>{date}</Typography>
        </Box>
    </Box>
  );

  return (
    <Dialog open={open} onClose={onClose} fullScreen>
      <DialogContent sx={{ bgcolor: '#f5f5f5', p: { xs: 2, md: 4 } }}>
        <Paper sx={{ 
          maxWidth: 900, mx: 'auto', p: 5, pb: 10, bgcolor: '#FDFDFC', 
          boxShadow: '0 0 40px rgba(0,0,0,0.1)', position: 'relative',
          minHeight: '100%'
        }}>
          {/* Controls */}
          <Box sx={{ position: 'absolute', top: 20, right: 20, display: 'flex', gap: 1 }}>
            <IconButton onClick={() => window.print()}><PrintIcon /></IconButton>
            <IconButton><DownloadIcon /></IconButton>
            <IconButton onClick={onClose}><CloseIcon /></IconButton>
          </Box>

          {/* Form Header */}
          <Box sx={{ textAlign: 'center', mb: 3 }}>
             <Typography variant="h5" sx={{ fontWeight: 900, letterSpacing: 1.5, mb: 0.5 }}>
                ASA PHILIPPINES EMPLOYEES CREDIT COOPERATIVE
             </Typography>
             <Typography variant="body2" sx={{ fontWeight: 700, mb: 0.5 }}>
                3RD FLOOR, 309 PRESTIGE TOWER, ORTIGAS PASIG CITY
             </Typography>
             <Typography variant="body2" sx={{ fontWeight: 600 }}>
                Email : asacreditcooperative@gmail.com
             </Typography>
          </Box>

          <Box sx={{ bgcolor: '#000', color: '#FDFDFC', textAlign: 'center', py: 1, mb: 2 }}>
             <Typography sx={{ fontWeight: 950, letterSpacing: 2 }}>EMPLOYEE CLEARANCE FORM</Typography>
          </Box>

          {/* Section I: Employee Info */}
          <TableContainer component={Paper} elevation={0} sx={{ border: '2px solid #000', borderRadius: 0, mb: 3 }}>
            <Table size="small">
                <TableBody sx={{ '& .MuiTableCell-root': { border: '1px solid #000', p: 1 } }}>
                    <TableRow>
                        <TableCell sx={{ width: '150px', bgcolor: '#f0f0f0', fontWeight: 800 }}>Name of Staff:</TableCell>
                        <TableCell sx={{ fontWeight: 900, fontSize: '1rem' }}>{emp.firstName} {emp.lastName}</TableCell>
                        <TableCell sx={{ width: '100px', bgcolor: '#f0f0f0', fontWeight: 800 }}>ID No:</TableCell>
                        <TableCell sx={{ fontWeight: 900 }}>{emp.id}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell sx={{ bgcolor: '#f0f0f0', fontWeight: 800 }}>Branch & Dept:</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>{emp.payrollLocation} - {emp.department}</TableCell>
                        <TableCell sx={{ bgcolor: '#f0f0f0', fontWeight: 800 }}>Position:</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>{emp.designation}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell sx={{ bgcolor: '#f0f0f0', fontWeight: 800 }}>Reason of Exit:</TableCell>
                        <TableCell colSpan={3}>
                            <Box sx={{ display: 'flex', gap: 3 }}>
                                {['Resignation', 'Termination/Dismissal', 'AWOL', 'Others'].map(r => (
                                    <Box key={r} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                        <Box sx={{ width: 14, height: 14, border: '1.5px solid #000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            {clearance.reason === r && <Box sx={{ width: 8, height: 8, bgcolor: '#000' }} />}
                                        </Box>
                                        <Typography sx={{ fontSize: '0.75rem', fontWeight: 700 }}>{r}</Typography>
                                    </Box>
                                ))}
                            </Box>
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell sx={{ bgcolor: '#f0f0f0', fontWeight: 800 }}>Date of Exit:</TableCell>
                        <TableCell colSpan={3} sx={{ fontWeight: 900 }}>{new Date(clearance.dateExit).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
          </TableContainer>

          {/* Departmental Sections */}
          {renderSectionHeader('Departmental Clearances')}
          <Typography variant="caption" sx={{ display: 'block', mb: 1, fontWeight: 800, color: logoBlue }}>I. HR Department</Typography>
          {renderItemsTable(clearance.sections.hr.items)}
          {renderSignOff('HR', clearance.sections.hr.officer, clearance.sections.hr.date)}

          {renderSectionHeader('II. IT Department', 'RETURNED?')}
          {renderItemsTable(clearance.sections.it.items)}
          {renderSignOff('IT', clearance.sections.it.officer, clearance.sections.it.date)}

          {renderSectionHeader('III. UNIT HEAD', 'SUBMITTED? CLEARED? COMPLETED?')}
          {renderItemsTable(clearance.sections.unitHead.items)}
          {renderSignOff('Unit Head', clearance.sections.unitHead.officer, clearance.sections.unitHead.date)}

          {renderSectionHeader('IV. Admin Department', 'RETURNED?')}
          {renderItemsTable(clearance.sections.admin.items)}
          {renderSignOff('Admin', clearance.sections.admin.officer, clearance.sections.admin.date)}

          {renderSectionHeader('V. Finance Department', 'SETTLED?')}
          {renderItemsTable(clearance.sections.finance.items)}
          {renderSignOff('Finance', clearance.sections.finance.officer, clearance.sections.finance.date)}

          {/* Footer Acknowledgement */}
          <Box sx={{ mt: 5, p: 2, border: '1px solid #eee', bgcolor: '#fafafa' }}>
             <Typography sx={{ fontSize: '0.75rem', textAlign: 'center', fontWeight: 700, fontStyle: 'italic', mb: 2 }}>
                Thank you for the service and contributions you have made as a valued member of the APECC family. Please complete the following steps as part of your Exit process. Each step is vital and mandatory so that security and confidentiality is safeguarded for you and all APECC employees and members.
             </Typography>
             <Typography sx={{ fontSize: '0.75rem', textAlign: 'center', fontWeight: 800, mb: 3 }}>
                I acknowledge that all my dues have been cleared and all company properties have been returned as stated above.
             </Typography>

             <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography sx={{ fontWeight: 900, borderBottom: '2px solid #000', width: 250, textAlign: 'center' }}>{clearance.acknowledgement}</Typography>
                <Typography variant="caption" sx={{ fontWeight: 800 }}>Employee Name and Signature</Typography>
             </Box>
          </Box>

          <Box sx={{ mt: 5, pt: 3, borderTop: '2px solid #000' }}>
             <Typography sx={{ fontSize: '0.7rem', fontWeight: 800, textAlign: 'center', fontStyle: 'italic', color: '#666' }}>
                We certify the correctness of above calculations and acknowledge the net amount due to the abovementioned staff. Therefore, we recommend for his settlement of accounts.
             </Typography>
          </Box>

          {/* Approval Signatures Grid */}
          <Grid container spacing={4} sx={{ mt: 2 }}>
             {[
                { label: 'Unit Head Name & Signature:', date: true },
                { label: 'HR Officer Name & Signature:', date: true },
                { label: 'Cashier Name & Signature:', date: true },
                { label: 'HR- unit Head Name & Signature:', date: true },
                { label: 'Finance Head Name & Signature:', date: true },
                { label: 'Admin Head Name & Signature:', date: true },
             ].map((sig, i) => (
                <Grid item xs={12} sm={6} key={i}>
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-end' }}>
                        <Box sx={{ flex: 1 }}>
                            <Typography variant="caption" sx={{ fontWeight: 800 }}>{sig.label}</Typography>
                            <Box sx={{ borderBottom: '1px solid #ccc', pt: 2 }} />
                        </Box>
                        <Box sx={{ width: 80 }}>
                            <Typography variant="caption" sx={{ fontWeight: 800 }}>Date:</Typography>
                            <Box sx={{ borderBottom: '1px solid #ccc', pt: 2 }} />
                        </Box>
                    </Box>
                </Grid>
             ))}
          </Grid>

          <Box sx={{ mt: 4, pt: 2, borderTop: '1px solid #eee', display: 'flex', justifyContent: 'space-between' }}>
             <Typography sx={{ fontWeight: 900, fontSize: '0.8rem' }}>GENERAL ASST. GENERAL MANAGER</Typography>
             <Box sx={{ display: 'flex', gap: 4 }}>
                <Typography sx={{ fontWeight: 900, fontSize: '0.8rem' }}>APPROVED: _________</Typography>
                <Typography sx={{ fontWeight: 900, fontSize: '0.8rem' }}>DISAPPROVED: _________</Typography>
                <Typography sx={{ fontWeight: 900, fontSize: '0.8rem' }}>ON HOLD: _________</Typography>
             </Box>
          </Box>

          <Typography sx={{ mt: 4, textAlign: 'center', fontWeight: 800, fontSize: '0.7rem', color: '#c62828' }}>
            NOTE: This form must be accomplished within 30 days and should not reach more than 45 days from the date of staff formal departure.
          </Typography>
        </Paper>
      </DialogContent>
    </Dialog>
  );
}
