import React, { useState, useEffect } from 'react';
import {
  Box, Card, CardContent, Typography, Grid, TextField, Button, Divider,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, IconButton, Avatar, Autocomplete,
  Dialog, DialogTitle, DialogContent, DialogActions, MenuItem, createFilterOptions
} from '@mui/material';
const goldAccent = '#d4a843';
import { Save as SaveIcon, Add as AddIcon, Delete as DeleteIcon, Search as SearchIcon, Edit as EditIcon } from '@mui/icons-material';
import { employees } from '../../data/mockData';

export default function FamilyBackground() {
  const [selectedEmp, setSelectedEmp] = useState(0);
  const [familyData, setFamilyData] = useState(employees[0].family);

  const filterOptions = createFilterOptions({
    stringify: (option) => `${option.firstName} ${option.lastName} ${option.id} ${option.designation}`
  });

  // Modal states
  const [isAddChildOpen, setIsAddChildOpen] = useState(false);
  const [newChild, setNewChild] = useState({ name: '', birthdate: '', gender: '' });
  const [editingChildIndex, setEditingChildIndex] = useState(null);
  
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [childToDelete, setChildToDelete] = useState(null);

  useEffect(() => {
    setFamilyData(employees[selectedEmp].family);
  }, [selectedEmp]);

  const handleSpouseChange = (e) => {
    const { name, value } = e.target;
    setFamilyData(prev => ({
      ...prev,
      spouse: prev.spouse ? { ...prev.spouse, [name]: value } : null
    }));
  };

  const handleParentChange = (parentType, e) => {
    const { name, value } = e.target;
    setFamilyData(prev => ({
      ...prev,
      [parentType]: { ...prev[parentType], [name]: value }
    }));
  };

  const handleOpenAddChild = () => {
    setNewChild({ name: '', birthdate: '', gender: '' });
    setEditingChildIndex(null);
    setIsAddChildOpen(true);
  };

  const handleEditChildClick = (index) => {
    setNewChild(familyData.children[index]);
    setEditingChildIndex(index);
    setIsAddChildOpen(true);
  };

  const handleSaveChild = () => {
    if (newChild.name && newChild.birthdate) {
      if (editingChildIndex !== null) {
        setFamilyData(prev => {
          const updatedChildren = [...prev.children];
          updatedChildren[editingChildIndex] = newChild;
          return { ...prev, children: updatedChildren };
        });
      } else {
        setFamilyData(prev => ({
          ...prev,
          children: [...prev.children, newChild]
        }));
      }
      setIsAddChildOpen(false);
      setEditingChildIndex(null);
    }
  };

  const handleDeleteClick = (index) => {
    setChildToDelete(index);
    setDeleteConfirmOpen(true);
  };

  const confirmDeleteChild = () => {
    if (childToDelete !== null) {
      setFamilyData(prev => ({
        ...prev,
        children: prev.children.filter((_, i) => i !== childToDelete)
      }));
      setDeleteConfirmOpen(false);
      setChildToDelete(null);
    }
  };

  return (
    <Box className="page-container">

      {/* Employee Search Bar */}
      <Box sx={{ mb: 3, maxWidth: 500 }}>
        <Autocomplete
          options={employees}
          filterOptions={filterOptions}
          getOptionLabel={(option) => `${option.firstName} ${option.lastName}`}
          value={employees[selectedEmp]}
          onChange={(event, newValue) => {
            if (newValue) {
              const index = employees.findIndex(emp => emp.id === newValue.id);
              setSelectedEmp(index);
            } else {
              setSelectedEmp(0);
            }
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 3,
              bgcolor: '#FDFDFC',
              boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
              transition: 'all 0.3s ease',
              '& fieldset': { borderColor: 'rgba(0,0,0,0.1)' },
              '&:hover fieldset': { borderColor: goldAccent },
              '&.Mui-focused fieldset': { borderColor: '#0241FB', boxShadow: '0 4px 20px rgba(2,61,251,0.15)' }
            }
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder="Search by name, ID or position..."
              InputProps={{
                ...params.InputProps,
                startAdornment: (
                  <SearchIcon sx={{ color: 'text.secondary', ml: 1, mr: -0.5, fontSize: '1.2rem' }} />
                ),
              }}
            />
          )}
          renderOption={(props, option) => (
            <Box component="li" {...props} sx={{ display: 'flex', gap: 1.5, py: 1.5 }}>
              <Avatar sx={{ bgcolor: goldAccent, width: 28, height: 28, fontSize: '0.75rem', fontWeight: 700 }}>
                {option.firstName[0]}
              </Avatar>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {option.firstName} {option.lastName}
              </Typography>
            </Box>
          )}
        />
      </Box>

      {/* Selected Employee Name Card */}
      <Card sx={{
        mb: 4, borderRadius: 3, borderLeft: `6px solid ${goldAccent}`,
        background: 'linear-gradient(to right, #fff, rgba(212,168,67,0.02))',
        boxShadow: '0 4px 15px rgba(0,0,0,0.05)'
      }}>
        <CardContent sx={{ py: 2, '&:last-child': { pb: 2 }, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar sx={{ background: 'linear-gradient(135deg, #05077E 0%, #0241FB 60%, #4470ED 100%)', width: 45, height: 45, fontWeight: 700 }}>
            {employees[selectedEmp].firstName[0]}
          </Avatar>
          <Box>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>
              Currently Viewing
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#0241FB', lineHeight: 1.2 }}>
              {employees[selectedEmp].firstName} {employees[selectedEmp].lastName}
            </Typography>
          </Box>
        </CardContent>
      </Card>


      <Card sx={{
        borderRadius: 3,
        borderTop: `4px solid ${goldAccent}`,
        boxShadow: '0 12px 40px rgba(0,0,0,0.08)',
      }}>
        <CardContent sx={{ p: 4 }}>

          {/* Spouse */}
          <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1rem', color: '#0241FB', mb: 2 }}>
            Spouse Information
          </Typography>
          {familyData.spouse ? (
            <Grid container spacing={2.5} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={6} md={3}>
                <TextField fullWidth size="small" label="Spouse Name" name="name" value={familyData.spouse.name || ''} onChange={handleSpouseChange} />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField fullWidth size="small" label="Birthdate" type="date" name="birthdate" value={familyData.spouse.birthdate || ''} onChange={handleSpouseChange} InputLabelProps={{ shrink: true }} />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField fullWidth size="small" label="Occupation" name="occupation" value={familyData.spouse.occupation || ''} onChange={handleSpouseChange} />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField fullWidth size="small" label="Number of Children" type="number" name="numChildren" value={familyData.spouse.numChildren || ''} onChange={handleSpouseChange} />
              </Grid>
              <Grid item xs={12} sm={12} md={6}>
                <TextField fullWidth size="small" label="Address" name="address" value={familyData.spouse.address || ''} onChange={handleSpouseChange} />
              </Grid>
              <Grid item xs={12} sm={12} md={6}>
                <TextField fullWidth size="small" label="Business Address" name="businessAddress" value={familyData.spouse.businessAddress || ''} onChange={handleSpouseChange} />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField fullWidth size="small" label="Contact Number" name="contact" value={familyData.spouse.contact || ''} onChange={handleSpouseChange} />
              </Grid>
            </Grid>
          ) : (
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3, fontStyle: 'italic' }}>
              No spouse information on record.
            </Typography>
          )}

          <Divider sx={{ my: 2.5 }} />

          {/* Parents */}
          <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1rem', color: '#0241FB', mb: 2 }}>
            Parents Information
          </Typography>
          
          <Typography variant="subtitle2" sx={{ fontWeight: 600, fontSize: '0.85rem', color: 'text.secondary', mb: 1.5 }}>
            Father's Information
          </Typography>
          <Grid container spacing={2.5} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} md={3}>
              <TextField fullWidth size="small" label="Father's Name" name="name" value={familyData.father.name || ''} onChange={(e) => handleParentChange('father', e)} />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField fullWidth size="small" label="Birthdate" type="date" name="birthdate" value={familyData.father.birthdate || ''} onChange={(e) => handleParentChange('father', e)} InputLabelProps={{ shrink: true }} />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField fullWidth size="small" label="Occupation" name="occupation" value={familyData.father.occupation || ''} onChange={(e) => handleParentChange('father', e)} />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField fullWidth size="small" label="Contact Number" name="contact" value={familyData.father.contact || ''} onChange={(e) => handleParentChange('father', e)} />
            </Grid>
          </Grid>

          <Typography variant="subtitle2" sx={{ fontWeight: 600, fontSize: '0.85rem', color: 'text.secondary', mb: 1.5 }}>
            Mother's Information
          </Typography>
          <Grid container spacing={2.5} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} md={3}>
              <TextField fullWidth size="small" label="Mother's Name" name="name" value={familyData.mother.name || ''} onChange={(e) => handleParentChange('mother', e)} />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField fullWidth size="small" label="Birthdate" type="date" name="birthdate" value={familyData.mother.birthdate || ''} onChange={(e) => handleParentChange('mother', e)} InputLabelProps={{ shrink: true }} />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField fullWidth size="small" label="Occupation" name="occupation" value={familyData.mother.occupation || ''} onChange={(e) => handleParentChange('mother', e)} />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField fullWidth size="small" label="Contact Number" name="contact" value={familyData.mother.contact || ''} onChange={(e) => handleParentChange('mother', e)} />
            </Grid>
          </Grid>

          <Divider sx={{ my: 2.5 }} />

          {/* Children */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1rem', color: '#0241FB' }}>
              Children
            </Typography>
            <Button size="small" startIcon={<AddIcon />} onClick={handleOpenAddChild} sx={{ color: '#0241FB', fontWeight: 600 }}>
              Add Child
            </Button>
          </Box>
          {familyData.children.length > 0 ? (
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Birthdate</TableCell>
                    <TableCell>Gender</TableCell>
                    <TableCell width={90}>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {familyData.children.map((child, i) => (
                    <TableRow key={i}>
                      <TableCell sx={{ fontWeight: 500 }}>{child.name}</TableCell>
                      <TableCell>{child.birthdate}</TableCell>
                      <TableCell>{child.gender || '—'}</TableCell>
                      <TableCell>
                        <IconButton size="small" color="primary" onClick={() => handleEditChildClick(i)}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small" color="error" onClick={() => handleDeleteClick(i)}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography variant="body2" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
              No children on record.
            </Typography>
          )}

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3, gap: 1.5 }}>
            <Button variant="outlined" sx={{ borderColor: 'rgba(0,0,0,0.15)' }}>Cancel</Button>
            <Button variant="contained" startIcon={<SaveIcon />} sx={{ background: 'linear-gradient(135deg, #05077E 0%, #05077E 100%)' }}>
              Save Changes
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Add/Edit Child Dialog */}
      <Dialog open={isAddChildOpen} onClose={() => setIsAddChildOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, color: '#0241FB' }}>{editingChildIndex !== null ? 'Edit Child' : 'Add Child'}</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField 
                fullWidth size="small" label="Name" 
                value={newChild.name} 
                onChange={(e) => setNewChild({...newChild, name: e.target.value})} 
              />
            </Grid>
            <Grid item xs={12}>
              <TextField 
                fullWidth size="small" label="Birthdate" type="date" 
                InputLabelProps={{ shrink: true }}
                value={newChild.birthdate} 
                onChange={(e) => setNewChild({...newChild, birthdate: e.target.value})} 
              />
            </Grid>
            <Grid item xs={12} sx={{ minWidth: 100 }}>
              <TextField 
                fullWidth size="small" label="Gender" select
                value={newChild.gender} 
                onChange={(e) => setNewChild({...newChild, gender: e.target.value})} 
              >
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 1.5, px: 2 }}>
          <Button onClick={() => setIsAddChildOpen(false)} sx={{ color: 'text.secondary' }}>Cancel</Button>
          <Button onClick={handleSaveChild} variant="contained" sx={{ background: 'linear-gradient(135deg, #05077E 0%, #0241FB 60%, #4470ED 100%)' }}>Save</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, color: '#d32f2f' }}>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to remove this child from the record? This action cannot be undone.</Typography>
        </DialogContent>
        <DialogActions sx={{ p: 1.5, px: 2 }}>
          <Button onClick={() => setDeleteConfirmOpen(false)} sx={{ color: 'text.secondary' }}>No, Cancel</Button>
          <Button onClick={confirmDeleteChild} variant="contained" color="error">Yes, Delete</Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
}
