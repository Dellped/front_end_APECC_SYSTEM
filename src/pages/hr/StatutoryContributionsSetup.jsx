import React, { useState } from 'react';
import {
  Box, Card, CardContent, Typography, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, IconButton, Grid, Avatar,
  Button, Divider, Paper, Stack, Chip, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, MenuItem, Select, FormControl, InputLabel,
  Tooltip
} from '@mui/material';
import {
  Settings as SettingsIcon,
  Edit as EditIcon,
  AccountBalance as SSSIcon,
  LocalHospital as PhilHealthIcon,
  Home as PagibigIcon,
  CalendarMonth as DateIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  FileDownload as CsvIcon,
  PictureAsPdf as PdfIcon,
  Print as PrintIcon,
} from '@mui/icons-material';
import { exportToCSV, printTable, exportToPDF } from '../../utils/exportUtils';

const apeccBlue = '#023DFB';

const headerStyle = {
  bgcolor: apeccBlue,
  color: '#fff',
  fontWeight: 700,
  fontSize: '0.75rem',
  padding: '12px 16px',
  textTransform: 'uppercase',
  letterSpacing: '0.05em'
};

export default function StatutoryContributionsSetup() {
  const [effectiveDateData, setEffectiveDateData] = useState([
    { id: 1, contribution: 'SSS', employee: '4.5%', employer: '9.5%', date: 'Jan 2026' },
    { id: 2, contribution: 'PhilHealth', employee: '2.5%', employer: '2.5%', date: 'Jan 2026' },
    { id: 3, contribution: 'Pag-IBIG', employee: '2%', employer: '2%', date: 'Jan 2026' },
  ]);

  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [editingRow, setEditingRow] = useState(null);
  const [rowToDelete, setRowToDelete] = useState(null);
  const [formData, setFormData] = useState({
    contribution: 'SSS',
    employee: '',
    employer: '',
    date: ''
  });

  const handleOpenDialog = (row = null) => {
    if (row) {
      setEditingRow(row);
      setFormData({
        contribution: row.contribution,
        employee: row.employee.replace('%', ''),
        employer: row.employer.replace('%', ''),
        date: row.date
      });
    } else {
      setEditingRow(null);
      setFormData({
        contribution: 'SSS',
        employee: '',
        employer: '',
        date: ''
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleOpenDeleteDialog = (row) => {
    setRowToDelete(row);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setRowToDelete(null);
  };

  const handleConfirmDelete = () => {
    if (rowToDelete) {
      setEffectiveDateData(prev => prev.filter(item => item.id !== rowToDelete.id));
      handleCloseDeleteDialog();
    }
  };

  const handleSave = () => {
    const newRow = {
      id: editingRow ? editingRow.id : Date.now(),
      contribution: formData.contribution,
      employee: `${formData.employee}%`,
      employer: `${formData.employer}%`,
      date: formData.date
    };

    if (editingRow) {
      setEffectiveDateData(prev => prev.map(item => item.id === editingRow.id ? newRow : item));
    } else {
      setEffectiveDateData(prev => [...prev, newRow]);
    }
    handleCloseDialog();
  };

  const renderSectionHeader = (title, icon) => (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
      <Avatar sx={{ bgcolor: 'rgba(2, 61, 251, 0.1)', color: apeccBlue, width: 40, height: 40 }}>
        {icon}
      </Avatar>
      <Typography variant="h6" sx={{ fontWeight: 700, color: '#333' }}>
        {title}
      </Typography>
    </Box>
  );

  return (
    <Box sx={{ p: 4, minHeight: '100%', bgcolor: '#f4f7fe' }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: apeccBlue, mb: 1 }}>
            Statutory Contributions Setup
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Configure and manage government statutory contribution rates and schedules
          </Typography>
        </Box>
        <Stack direction="row" spacing={1} alignItems="center">
          <Button size="small" variant="outlined" startIcon={<CsvIcon />}
            onClick={() => exportToCSV(['Contribution','Employee %','Employer %','Effective Date'], effectiveDateData.map(r => [r.contribution, r.employee, r.employer, r.date]), 'statutory_contributions')}
            sx={{ borderRadius: 2, fontSize: '0.75rem' }}>CSV</Button>
          <Button size="small" variant="outlined" startIcon={<PdfIcon />}
            onClick={() => exportToPDF('Statutory Contributions Setup', ['Contribution','Employee %','Employer %','Effective Date'], effectiveDateData.map(r => [r.contribution, r.employee, r.employer, r.date]))}
            sx={{ borderRadius: 2, fontSize: '0.75rem' }}>PDF</Button>
          <Button size="small" variant="outlined" startIcon={<PrintIcon />}
            onClick={() => printTable('Statutory Contributions Setup', ['Contribution','Employee %','Employer %','Effective Date'], effectiveDateData.map(r => [r.contribution, r.employee, r.employer, r.date]))}
            sx={{ borderRadius: 2, fontSize: '0.75rem' }}>Print</Button>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
            sx={{ 
              bgcolor: apeccBlue, 
              color: '#fff',
              fontWeight: 700,
              px: 3,
              borderRadius: 2,
              '&:hover': { bgcolor: '#0131c9' }
            }}
          >
            Add New Rate Schedule
          </Button>
        </Stack>
      </Box>

      <Grid container spacing={4}>
        {/* Effective Date Management */}
        <Grid item xs={12}>
          <Card sx={{ 
            borderRadius: 3, 
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
            border: 'none'
          }}>
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ mb: 3 }}>
                {renderSectionHeader('Effective Date Management', <DateIcon />)}
              </Box>
              
              <TableContainer component={Paper} sx={{ 
                borderRadius: 2,
                boxShadow: 'none',
                border: '1px solid #eee',
                overflow: 'hidden'
              }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={headerStyle}>Contribution</TableCell>
                      <TableCell align="center" sx={headerStyle}>Employee %</TableCell>
                      <TableCell align="center" sx={headerStyle}>Employer %</TableCell>
                      <TableCell align="center" sx={headerStyle}>Effective Date</TableCell>
                      <TableCell align="right" sx={headerStyle}>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {effectiveDateData.map((row) => (
                      <TableRow key={row.id} hover sx={{ '& td': { py: 1.5, borderBottom: '1px solid #f0f0f0' } }}>
                        <TableCell>
                          <Stack direction="row" spacing={2} alignItems="center">
                            <Box sx={{ 
                              display: 'flex',
                              alignItems: 'center',
                              color: row.contribution === 'SSS' ? '#4a75e6' : 
                                     row.contribution === 'PhilHealth' ? '#2e7d32' : '#e65100'
                            }}>
                              {row.contribution === 'SSS' && <SSSIcon fontSize="small" />}
                              {row.contribution === 'PhilHealth' && <PhilHealthIcon fontSize="small" />}
                              {row.contribution === 'Pag-IBIG' && <PagibigIcon fontSize="small" />}
                            </Box>
                            <Typography variant="body2" sx={{ fontWeight: 700, color: '#444' }}>{row.contribution}</Typography>
                          </Stack>
                        </TableCell>
                        <TableCell align="center">
                          <Chip 
                            label={row.employee} 
                            size="small" 
                            sx={{ 
                              bgcolor: 'rgba(2, 61, 251, 0.05)', 
                              color: apeccBlue,
                              fontWeight: 700,
                              fontSize: '0.7rem'
                            }} 
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Chip 
                            label={row.employer} 
                            size="small" 
                            sx={{ 
                              bgcolor: 'rgba(2, 61, 251, 0.05)', 
                              color: apeccBlue,
                              fontWeight: 700,
                              fontSize: '0.7rem'
                            }} 
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Typography variant="body2" sx={{ fontWeight: 600, color: '#666' }}>
                            {row.date}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Stack direction="row" spacing={1} justifyContent="flex-end">
                            <Tooltip title="Edit Rate Info">
                              <IconButton 
                                size="small" 
                                onClick={() => handleOpenDialog(row)}
                                sx={{ 
                                  color: apeccBlue,
                                  '&:hover': { bgcolor: 'rgba(2, 61, 251, 0.1)' }
                                }}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete Rate Schedule">
                              <IconButton 
                                size="small" 
                                onClick={() => handleOpenDeleteDialog(row)}
                                sx={{ 
                                  color: '#d32f2f',
                                  '&:hover': { bgcolor: 'rgba(211, 47, 47, 0.1)' }
                                }}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

      </Grid>

      {/* Add/Edit Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog}
        PaperProps={{
          sx: {
            borderRadius: 3,
            minWidth: 400
          }
        }}
      >
        <DialogTitle sx={{ fontWeight: 800, color: apeccBlue, borderBottom: '1px solid #eee', mb: 2 }}>
          {editingRow ? 'Edit Rate Schedule' : 'Add New Rate Schedule'}
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Contribution Type</InputLabel>
              <Select
                value={formData.contribution}
                label="Contribution Type"
                onChange={(e) => setFormData({ ...formData, contribution: e.target.value })}
              >
                <MenuItem value="SSS">SSS</MenuItem>
                <MenuItem value="PhilHealth">PhilHealth</MenuItem>
                <MenuItem value="Pag-IBIG">Pag-IBIG</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Employee %"
              fullWidth
              variant="outlined"
              value={formData.employee}
              onChange={(e) => setFormData({ ...formData, employee: e.target.value })}
            />
            <TextField
              label="Employer %"
              fullWidth
              variant="outlined"
              value={formData.employer}
              onChange={(e) => setFormData({ ...formData, employer: e.target.value })}
            />
            <TextField
              label="Effective Date (e.g. Jan 2026)"
              fullWidth
              variant="outlined"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3, borderTop: '1px solid #eee' }}>
          <Button onClick={handleCloseDialog} color="inherit">Cancel</Button>
          <Button 
            onClick={handleSave} 
            variant="contained"
            sx={{ 
              bgcolor: apeccBlue, 
              color: '#fff', 
              fontWeight: 700,
              '&:hover': { bgcolor: '#0131c9' }
            }}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        PaperProps={{
          sx: { borderRadius: 3, maxWidth: 400 }
        }}
      >
        <DialogTitle sx={{ fontWeight: 800, color: '#d32f2f' }}>
          Confirm Deletion
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the {rowToDelete?.contribution} rate schedule for {rowToDelete?.date}? 
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleCloseDeleteDialog} color="inherit">Cancel</Button>
          <Button 
            onClick={handleConfirmDelete} 
            variant="contained" 
            sx={{ bgcolor: '#d32f2f', color: '#fff', '&:hover': { bgcolor: '#b71c1c' } }}
          >
            Confirm Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
