import React, { useState, useEffect } from 'react';
import {
  Box, Card, CardContent, Typography, Grid, Autocomplete, TextField,
  InputAdornment, Button, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, ToggleButton, ToggleButtonGroup, Chip, Divider,
  Snackbar, Alert
} from '@mui/material';
import {
  Search as SearchIcon,
  CheckCircle as ApproveIcon,
  Save as SaveIcon
} from '@mui/icons-material';
import { staffClearanceRecords, employees, exitMembers } from '../../data/mockData';

const NAV = '#05077E';
const IND = '#0241FB';
const goldAccent = '#d4a843';

export default function StaffClearanceTracker() {
  const [selectedRecord, setSelectedRecord] = useState(staffClearanceRecords[0] || null);
  const [formData, setFormData] = useState(null);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [currentRole, setCurrentRole] = useState('Superadmin');

  const ROLES = [
    { id: 'Superadmin', label: 'Superadmin (All Access)' },
    { id: 'General Manager', label: 'General Manager' },
    { id: 'HR Officer', label: 'HR Officer' },
    { id: 'IT Officer', label: 'IT Officer' },
    { id: 'Unit Head', label: 'Unit Head' },
    { id: 'Admin Head', label: 'Admin Head' },
    { id: 'Finance Head', label: 'Finance Head' }
  ];

  const ROLE_DEPT_MAP = {
    'HR Officer': 'hr',
    'IT Officer': 'it',
    'Unit Head': 'unitHead',
    'Admin Head': 'admin',
    'Finance Head': 'finance',
    'General Manager': 'all',
    'Superadmin': 'all'
  };

  useEffect(() => {
    if (selectedRecord) {
      setFormData(JSON.parse(JSON.stringify(selectedRecord.sections)));
    } else {
      setFormData(null);
    }
  }, [selectedRecord]);

  const handleItemChange = (dept, itemIndex, field, value) => {
    setFormData(prev => {
      const newData = { ...prev };
      newData[dept].items[itemIndex][field] = value;
      return newData;
    });
  };

  const checkAllCleared = () => {
    if (!formData) return false;
    for (const deptKey of Object.keys(formData)) {
      for (const item of formData[deptKey].items) {
        if (item.status !== 'yes') return false;
      }
    }
    return true;
  };

  const handleSave = () => {
    if (selectedRecord && formData) {
      selectedRecord.sections = formData;
      setSnackbarMessage('Department clearance details saved successfully.');
    }
  };

  const handleCancel = () => {
    if (selectedRecord) {
      // Revert formData back to the original selectedRecord's state
      setFormData(JSON.parse(JSON.stringify(selectedRecord.sections)));
      setSnackbarMessage('Changes cancelled.');
    }
  };

  const handleApprove = () => {
    if (selectedRecord && formData) {
      selectedRecord.sections = formData;
      selectedRecord.status = 'Cleared';
      
      const member = exitMembers.find(m => m.memberId === selectedRecord.employeeId);
      if (member) member.clearanceStatus = 'Cleared';
      
      setSnackbarMessage('Clearance officially Approved and Finalized!');
    }
  };

  const renderTable = (deptKey, title, headers) => {
    if (!formData) return null;
    
    // Only display the specific department if the user is a department officer
    if (currentRole !== 'Superadmin' && currentRole !== 'General Manager' && ROLE_DEPT_MAP[currentRole] !== deptKey) {
      return null;
    }

    const dept = formData[deptKey];
    
    // Check if current role has permission to edit this specific department table
    const canEdit = currentRole === 'Superadmin' || ROLE_DEPT_MAP[currentRole] === deptKey;

    return (
      <Card sx={{ mb: 4, borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.05)', borderTop: `4px solid ${IND}` }}>
        <Box sx={{ p: 2, bgcolor: '#fafafa', borderBottom: '1px solid #eee' }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 800, color: NAV, textTransform: 'uppercase' }}>
            {title}
          </Typography>
        </Box>
        <TableContainer>
          <Table size="small">
            <TableHead sx={{ bgcolor: 'rgba(2,65,251,0.03)' }}>
              <TableRow>
                {headers.map((h, i) => (
                  <TableCell key={i} sx={{ fontWeight: 700, color: NAV, width: h.width || 'auto' }}>
                    {h.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {dept.items.map((item, idx) => (
                <TableRow key={idx} hover>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {item.code ? `${item.code}.) ` : ''}{item.label}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <ToggleButtonGroup
                      value={item.status}
                      exclusive
                      onChange={(e, val) => {
                        if (val !== null && canEdit) handleItemChange(deptKey, idx, 'status', val);
                      }}
                      size="small"
                      disabled={!canEdit}
                      sx={{ height: 30 }}
                    >
                      <ToggleButton value="yes" sx={{ '&.Mui-selected': { bgcolor: 'rgba(46,125,50,0.1)', color: '#2e7d32', fontWeight: 800 } }}>YES</ToggleButton>
                      <ToggleButton value="no" sx={{ '&.Mui-selected': { bgcolor: 'rgba(211,47,47,0.1)', color: '#d32f2f', fontWeight: 800 } }}>NO</ToggleButton>
                    </ToggleButtonGroup>
                  </TableCell>
                  <TableCell>
                    <TextField
                      fullWidth
                      size="small"
                      variant="outlined"
                      value={item.remarks || ''}
                      onChange={(e) => handleItemChange(deptKey, idx, 'remarks', e.target.value)}
                      placeholder={canEdit ? "Remarks..." : ""}
                      disabled={!canEdit}
                      sx={{ '& .MuiInputBase-root': { fontSize: '0.8rem', bgcolor: canEdit ? '#fff' : '#f5f5f5' } }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    );
  };

  const isAllCleared = checkAllCleared();
  const canApproveFinal = currentRole === 'Superadmin' || currentRole === 'General Manager';
  const isDeptRole = currentRole !== 'Superadmin' && currentRole !== 'General Manager';

  return (
    <Box className="page-container" sx={{ p: 3, bgcolor: '#f4f6f8', minHeight: '100vh' }}>
      
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: NAV, mb: 0.5 }}>Staff Clearance Tracker</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600 }}>Home / Exit Modules / Tracker</Typography>
        </Box>
        
        {/* Role Simulator */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, bgcolor: '#fff', p: 1, px: 2, borderRadius: 2, border: '1px solid #ddd' }}>
          <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary' }}>VIEW AS ROLE:</Typography>
          <Autocomplete
            options={ROLES}
            getOptionLabel={(option) => option.label}
            value={ROLES.find(r => r.id === currentRole)}
            onChange={(e, val) => { if(val) setCurrentRole(val.id) }}
            disableClearable
            renderInput={(params) => <TextField {...params} size="small" sx={{ width: 220, '& .MuiInputBase-root': { fontSize: '0.85rem', fontWeight: 700, color: IND } }} />}
          />
        </Box>
      </Box>

      {/* Employee Selector */}
      <Card sx={{ mb: 4, borderRadius: 3, boxShadow: '0 2px 12px rgba(0,0,0,0.04)', borderTop: `3px solid ${goldAccent}` }}>
        <CardContent sx={{ p: 4 }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" sx={{ color: 'text.secondary', mb: 1, fontWeight: 700 }}>Select Pending Clearance Record</Typography>
              <Autocomplete
                options={staffClearanceRecords}
                getOptionLabel={(option) => {
                  const emp = employees.find(e => e.id === option.employeeId);
                  return emp ? `${emp.firstName} ${emp.lastName} (${emp.id})` : option.employeeId;
                }}
                value={selectedRecord}
                onChange={(event, newValue) => setSelectedRecord(newValue)}
                renderInput={(params) => (
                  <TextField 
                    {...params} placeholder="Search by Employee..." size="small"
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <>
                          <InputAdornment position="start" sx={{ pl: 1 }}><SearchIcon /></InputAdornment>
                          {params.InputProps.startAdornment}
                        </>
                      ),
                    }}
                  />
                )}
              />
            </Grid>
            {selectedRecord && (
              <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, bgcolor: 'rgba(2,65,251,0.04)', borderRadius: 2 }}>
                  <Box>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, display: 'block' }}>Current Status</Typography>
                    <Chip 
                      label={selectedRecord.status === 'Cleared' ? 'FULLY CLEARED' : 'PENDING'} 
                      color={selectedRecord.status === 'Cleared' ? 'success' : 'warning'}
                      sx={{ fontWeight: 800, letterSpacing: '0.05em' }}
                    />
                  </Box>
                  <Divider orientation="vertical" flexItem />
                  <Box>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, display: 'block' }}>Effective Date</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>{selectedRecord.dateExit}</Typography>
                  </Box>
                </Box>
              </Grid>
            )}
          </Grid>
        </CardContent>
      </Card>

      {/* Tables Tracker */}
      {selectedRecord && formData && (
        <Box>
          {renderTable('hr', 'I. HR Department', [
            { label: 'Item', width: '40%' },
            { label: 'STATUS', width: '20%' },
            { label: 'REMARKS', width: '40%' }
          ])}

          {renderTable('it', 'II. IT Department', [
            { label: 'RETURNED?', width: '40%' },
            { label: 'STATUS', width: '20%' },
            { label: 'REMARKS', width: '40%' }
          ])}

          {renderTable('unitHead', 'III. UNIT HEAD', [
            { label: 'SUBMITTED? CLEARED? COMPLETED?', width: '40%' },
            { label: 'YES / NO', width: '20%' },
            { label: 'REMARKS', width: '40%' }
          ])}

          {renderTable('admin', 'IV. Admin Department', [
            { label: 'RETURNED?', width: '40%' },
            { label: 'STATUS', width: '20%' },
            { label: 'REMARKS', width: '40%' }
          ])}

          {renderTable('finance', 'V. Finance Department', [
            { label: 'SETTLED?', width: '40%' },
            { label: 'STATUS', width: '20%' },
            { label: 'REMARKS', width: '40%' }
          ])}

          {/* Action Bar */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 4, mb: 8 }}>
            
            {/* Dept Role Buttons */}
            {isDeptRole && (
              <>
                <Button 
                  variant="outlined" 
                  size="large"
                  onClick={handleCancel}
                  sx={{ fontWeight: 700, px: 4, borderRadius: 2, color: 'text.secondary', borderColor: '#ccc' }}
                >
                  Cancel
                </Button>
                <Button 
                  variant="contained" 
                  size="large"
                  startIcon={<SaveIcon />}
                  onClick={handleSave}
                  sx={{ fontWeight: 700, px: 4, borderRadius: 2, bgcolor: IND }}
                >
                  Save Progress
                </Button>
              </>
            )}

            {/* General Manager / Superadmin Buttons */}
            {canApproveFinal && (
              <Button 
                variant="contained" 
                size="large"
                startIcon={<ApproveIcon />}
                onClick={handleApprove}
                disabled={!isAllCleared || selectedRecord.status === 'Cleared'}
                sx={{ 
                  fontWeight: 800, px: 4, borderRadius: 2,
                  background: (!isAllCleared || selectedRecord.status === 'Cleared') ? '#e0e0e0' : `linear-gradient(90deg, #2e7d32, #4caf50)`
                }}
              >
                {selectedRecord.status === 'Cleared' ? 'Clearance Already Approved' : (isAllCleared ? 'Approve Final Clearance' : 'Waiting for All Departments')}
              </Button>
            )}
            
            {/* Show Save for Superadmin too just in case */}
            {currentRole === 'Superadmin' && (
               <Button 
                 variant="outlined" 
                 size="large"
                 startIcon={<SaveIcon />}
                 onClick={handleSave}
                 sx={{ fontWeight: 700, px: 4, borderRadius: 2 }}
               >
                 Save Overrides
               </Button>
            )}

          </Box>
        </Box>
      )}

      <Snackbar open={!!snackbarMessage} autoHideDuration={4000} onClose={() => setSnackbarMessage('')} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert onClose={() => setSnackbarMessage('')} severity="success" sx={{ width: '100%', fontWeight: 700 }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>

    </Box>
  );
}
