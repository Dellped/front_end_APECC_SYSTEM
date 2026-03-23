import React, { useState, useEffect } from 'react';
import {
  Box, Card, CardContent, Typography, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Chip, Button, IconButton, Divider, Avatar, Autocomplete, TextField, createFilterOptions
} from '@mui/material';
const goldAccent = '#d4a843';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Search as SearchIcon } from '@mui/icons-material';
import { employees } from '../../data/mockData';

export default function WorkExperience() {
  const [selectedEmp, setSelectedEmp] = useState(0);
  const [workHistory, setWorkHistory] = useState(employees[0].workExperience);
  const [references, setReferences] = useState(employees[0].references);

  useEffect(() => {
    setWorkHistory(employees[selectedEmp].workExperience);
    setReferences(employees[selectedEmp].references);
  }, [selectedEmp]);

  const emp = employees[selectedEmp];

  const filterOptions = createFilterOptions({
    stringify: (option) => `${option.firstName} ${option.lastName} ${option.id} ${option.designation}`
  });

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
              bgcolor: '#fff',
              boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
              transition: 'all 0.3s ease',
              '& fieldset': { borderColor: 'rgba(0,0,0,0.1)' },
              '&:hover fieldset': { borderColor: goldAccent },
              '&.Mui-focused fieldset': { borderColor: '#023DFB', boxShadow: '0 4px 20px rgba(2,61,251,0.15)' }
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
          <Avatar sx={{ bgcolor: '#023DFB', width: 45, height: 45, fontWeight: 700 }}>
            {employees[selectedEmp].firstName[0]}
          </Avatar>
          <Box>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>
              Currently Viewing
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#023DFB', lineHeight: 1.2 }}>
              {employees[selectedEmp].firstName} {employees[selectedEmp].lastName}
            </Typography>
          </Box>
        </CardContent>
      </Card>


      {/* Work Experience */}
      <Card sx={{
        borderRadius: 3, mb: 4,
        borderTop: `3px solid ${goldAccent}`,
        boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
      }}>
        <CardContent sx={{ p: 4 }}>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1rem', color: '#023DFB' }}>
              Employment History
            </Typography>
            <Button size="small" variant="contained" startIcon={<AddIcon />}
              sx={{ background: 'linear-gradient(135deg, #023DFB 0%, #4a75e6 100%)' }}>
              Add Experience
            </Button>
          </Box>
          <TableContainer sx={{
            overflowX: 'auto',
            '&::-webkit-scrollbar': { height: 8 },
            '&::-webkit-scrollbar-track': { bgcolor: 'rgba(0,0,0,0.05)', borderRadius: 10 },
            '&::-webkit-scrollbar-thumb': { bgcolor: 'rgba(0,0,0,0.2)', borderRadius: 10, '&:hover': { bgcolor: 'rgba(0,0,0,0.3)' } },
          }}>
            <Table sx={{ minWidth: 1000 }}>
              <TableHead>
                <TableRow>
                  <TableCell>Company</TableCell>
                  <TableCell>Position</TableCell>
                  <TableCell>Salary</TableCell>
                  <TableCell>From</TableCell>
                  <TableCell>To</TableCell>
                  <TableCell>Reason for Separation</TableCell>
                  <TableCell width={100} align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {workHistory.map((wx, i) => (
                  <TableRow key={i}>
                    <TableCell sx={{ fontWeight: 500 }}>{wx.company}</TableCell>
                    <TableCell>{wx.position}</TableCell>
                    <TableCell>{wx.salary || '—'}</TableCell>
                    <TableCell>{wx.from}</TableCell>
                    <TableCell>{wx.to}</TableCell>
                    <TableCell>
                      <Chip label={wx.reason} size="small" variant="outlined" sx={{ fontSize: '0.72rem' }} />
                    </TableCell>
                    <TableCell align="center">
                      <IconButton size="small" sx={{ color: '#023DFB' }}><EditIcon fontSize="small" /></IconButton>
                      <IconButton size="small" color="error"><DeleteIcon fontSize="small" /></IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* References */}
      <Card sx={{ borderRadius: 3, borderTop: `1px solid rgba(0,0,0,0.05)` }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1rem', color: '#023DFB' }}>
              Professional References
            </Typography>
            <Button size="small" variant="contained" startIcon={<AddIcon />}
              sx={{ background: 'linear-gradient(135deg, #023DFB 0%, #4a75e6 100%)' }}>
              Add Reference
            </Button>
          </Box>
          <TableContainer sx={{
            overflowX: 'auto',
            '&::-webkit-scrollbar': { height: 8 },
            '&::-webkit-scrollbar-track': { bgcolor: 'rgba(0,0,0,0.05)', borderRadius: 10 },
            '&::-webkit-scrollbar-thumb': { bgcolor: 'rgba(0,0,0,0.2)', borderRadius: 10, '&:hover': { bgcolor: 'rgba(0,0,0,0.3)' } },
          }}>
            <Table sx={{ minWidth: 900 }}>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Position / Relationship</TableCell>
                  <TableCell>Address / Company</TableCell>
                  <TableCell>Contact Number</TableCell>
                  <TableCell width={100} align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {references.map((ref, i) => (
                  <TableRow key={i}>
                    <TableCell sx={{ fontWeight: 500 }}>{ref.name}</TableCell>
                    <TableCell>{ref.position}</TableCell>
                    <TableCell>{ref.addressCompany || '—'}</TableCell>
                    <TableCell>{ref.contact}</TableCell>
                    <TableCell align="center">
                      <IconButton size="small" sx={{ color: '#023DFB' }}><EditIcon fontSize="small" /></IconButton>
                      <IconButton size="small" color="error"><DeleteIcon fontSize="small" /></IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
}
