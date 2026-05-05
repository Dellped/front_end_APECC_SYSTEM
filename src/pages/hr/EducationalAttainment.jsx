import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Box, Card, CardContent, Typography, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Chip, Button, IconButton, Avatar, TextField, InputAdornment, Paper, List, ListItemButton, ListItemText
} from '@mui/material';
const goldAccent = '#d4a843';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Search as SearchIcon } from '@mui/icons-material';
import { employees } from '../../data/mockData';

export default function EducationalAttainment() {
  const [selectedEmp, setSelectedEmp] = useState(0);
  const [educationRecords, setEducationRecords] = useState(employees[0].education);

  // Unified employee search
  const [empSearchQuery, setEmpSearchQuery] = useState('');
  const [showEmpDropdown, setShowEmpDropdown] = useState(false);
  const empSearchRef = useRef(null);

  const filteredEmpOptions = useMemo(() => {
    const q = empSearchQuery.trim().toLowerCase();
    if (!q) return [];
    return employees.filter(emp => {
      const fullName = `${emp.firstName} ${emp.lastName}`.toLowerCase();
      const empId = String(emp.id).toLowerCase();
      return empId.includes(q) || fullName.includes(q);
    }).slice(0, 8);
  }, [empSearchQuery]);

  useEffect(() => {
    const handleClick = (e) => {
      if (empSearchRef.current && !empSearchRef.current.contains(e.target)) {
        setShowEmpDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  useEffect(() => {
    setEducationRecords(employees[selectedEmp].education);
  }, [selectedEmp]);

  const emp = employees[selectedEmp];

  return (
    <Box className="page-container">

      {/* Employee Search Bar */}
      <Box ref={empSearchRef} sx={{ mb: 3, maxWidth: 500, position: 'relative' }}>
        <TextField
          fullWidth
          size="small"
          label="Search Employee Name or ID"
          placeholder="Type name or ID..."
          value={empSearchQuery}
          onChange={(e) => { setEmpSearchQuery(e.target.value); setShowEmpDropdown(true); }}
          onFocus={() => empSearchQuery && setShowEmpDropdown(true)}
          InputLabelProps={{ shrink: true, sx: { fontWeight: 600 } }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: '#0241FB', fontSize: '1.2rem' }} />
              </InputAdornment>
            )
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
        />
        {showEmpDropdown && filteredEmpOptions.length > 0 && (
          <Paper elevation={6} sx={{ position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 1300, borderRadius: 2, mt: 0.5, overflow: 'hidden', border: '1px solid rgba(2,61,251,0.15)', maxHeight: 280, overflowY: 'auto' }}>
            <List dense disablePadding>
              {filteredEmpOptions.map((opt, idx) => (
                <ListItemButton
                  key={opt.id}
                  divider={idx < filteredEmpOptions.length - 1}
                  onClick={() => {
                    const index = employees.findIndex(e => e.id === opt.id);
                    setSelectedEmp(index);
                    setEmpSearchQuery(`${opt.firstName} ${opt.lastName} (#${opt.id})`);
                    setShowEmpDropdown(false);
                  }}
                  sx={{ '&:hover': { bgcolor: 'rgba(2,61,251,0.06)' } }}
                >
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar sx={{ bgcolor: goldAccent, width: 28, height: 28, fontSize: '0.75rem', fontWeight: 700, flexShrink: 0 }}>
                          {opt.firstName[0]}
                        </Avatar>
                        <Typography variant="body2" sx={{ fontWeight: 800, color: '#0241FB', minWidth: 45 }}>#{opt.id}</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>{opt.firstName} {opt.lastName}</Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary', ml: 'auto' }}>{opt.department || opt.designation}</Typography>
                      </Box>
                    }
                  />
                </ListItemButton>
              ))}
            </List>
          </Paper>
        )}
        {showEmpDropdown && empSearchQuery && filteredEmpOptions.length === 0 && (
          <Paper elevation={3} sx={{ position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 1300, borderRadius: 2, mt: 0.5, p: 2, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">No employees found.</Typography>
          </Paper>
        )}
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
        borderTop: `3px solid ${goldAccent}`,
        boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
      }}>
        <CardContent sx={{ p: 4 }}>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1rem', color: '#0241FB' }}>
              Education Records
            </Typography>
            <Button size="small" variant="contained" startIcon={<AddIcon />}
              sx={{ background: 'linear-gradient(135deg, #05077E 0%, #4470ED 100%)', fontWeight: 600 }}>
              Add Record
            </Button>
          </Box>

          <TableContainer sx={{
            overflowX: 'auto',
            '&::-webkit-scrollbar': { height: 8 },
            '&::-webkit-scrollbar-track': { bgcolor: 'rgba(0,0,0,0.05)', borderRadius: 10 },
            '&::-webkit-scrollbar-thumb': { bgcolor: 'rgba(0,0,0,0.2)', borderRadius: 10, '&:hover': { bgcolor: 'rgba(0,0,0,0.3)' } },
          }}>
            <Table sx={{ minWidth: 1200 }}>
              <TableHead>
                <TableRow>
                  <TableCell>Degree Level</TableCell>
                  <TableCell>School / University</TableCell>
                  <TableCell>Course Title</TableCell>
                  <TableCell>Area of Study</TableCell>
                  <TableCell>Distinction</TableCell>
                  <TableCell>Units</TableCell>
                  <TableCell>From</TableCell>
                  <TableCell>To</TableCell>
                  <TableCell width={100} align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {educationRecords.map((ed, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <Chip label={ed.level} size="small"
                        sx={{
                          fontWeight: 600, fontSize: '0.72rem', height: 24,
                          bgcolor: ed.level === 'College' ? '#e3f2fd' : ed.level === 'Post-Graduate' ? '#fce4ec' : '#f3e5f5',
                          color: ed.level === 'College' ? '#1565c0' : ed.level === 'Post-Graduate' ? '#c62828' : '#7b1fa2',
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ fontWeight: 500 }}>{ed.school}</TableCell>
                    <TableCell>{ed.degree || '—'}</TableCell>
                    <TableCell>{ed.areaOfStudy || '—'}</TableCell>
                    <TableCell>{ed.distinction || '—'}</TableCell>
                    <TableCell>{ed.units || '—'}</TableCell>
                    <TableCell>{ed.from || '—'}</TableCell>
                    <TableCell>{ed.till || '—'}</TableCell>
                    <TableCell align="center">
                      <IconButton size="small" sx={{ color: '#05077E' }}><EditIcon fontSize="small" /></IconButton>
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
