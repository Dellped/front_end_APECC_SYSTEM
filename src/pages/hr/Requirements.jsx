import React, { useState, useEffect } from 'react';
import {
  Box, Card, CardContent, Typography, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Chip, Avatar, Autocomplete, TextField, createFilterOptions
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { employees } from '../../data/mockData';

const goldAccent = '#d4a843';

export default function Requirements() {
  const [selectedEmp, setSelectedEmp] = useState(0);
  const [requirements, setRequirements] = useState(employees[0].requirements);

  useEffect(() => {
    setRequirements(employees[selectedEmp].requirements);
  }, [selectedEmp]);

  const getStatusChip = (status) => {
    const isSubmitted = status === 'Submitted';
    return (
      <Chip
        label={status}
        size="small"
        sx={{
          fontWeight: 600,
          bgcolor: isSubmitted ? '#e8f5e9' : '#fff3e0',
          color: isSubmitted ? '#2e7d32' : '#ef6c00',
          fontSize: '0.72rem',
        }}
      />
    );
  };

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

      {/* Requirements Table */}
      <Card sx={{
        borderRadius: 3,
        borderTop: `3px solid ${goldAccent}`,
        boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
      }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1rem', color: '#0241FB', mb: 2.5 }}>
            List of Requirements
          </Typography>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>Requirement</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Government / Statutory Number</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Expiration Date of IDS</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {[
                  ['Tin ID', requirements.tinNo, requirements.tinId, requirements.tinExpiry],
                  ['SSS', requirements.sssNo, requirements.sss, requirements.sssExpiry],
                  ['Philhealth', requirements.philhealthNo, requirements.philhealth, requirements.philhealthExpiry],
                  ['HDMF (Pag-IBIG)', requirements.hdmfNo, requirements.hdmf, requirements.hdmfExpiry],
                  ['NBI Clearance', requirements.nbiNo, requirements.nbi, requirements.nbiExpiry],
                ].map(([label, docNo, status, expiry], i) => (
                  <TableRow key={i}>
                    <TableCell sx={{ fontWeight: 500 }}>{label}</TableCell>
                    <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>{docNo}</TableCell>
                    <TableCell sx={{ fontSize: '0.85rem' }}>{expiry || '—'}</TableCell>
                    <TableCell>{getStatusChip(status)}</TableCell>
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
