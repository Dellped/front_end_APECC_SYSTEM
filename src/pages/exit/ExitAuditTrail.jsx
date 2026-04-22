import React, { useState } from 'react';
import {
  Box, Card, CardContent, Typography, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, TextField, InputAdornment,
  FormControl, InputLabel, Select, MenuItem, Chip, Button, Stack
} from '@mui/material';
import { Search as SearchIcon, FileDownload as CsvIcon, PictureAsPdf as PdfIcon, Print as PrintIcon } from '@mui/icons-material';
import { exitAuditLogs } from '../../data/mockData';
import { exportToCSV, printTable, exportToPDF } from '../../utils/exportUtils';

export default function ExitAuditTrail() {
  const [search, setSearch] = useState('');
  const [moduleFilter, setModuleFilter] = useState('All');

  const filteredLogs = exitAuditLogs.filter(log => {
    const matchesSearch = log.user.toLowerCase().includes(search.toLowerCase()) || 
                          log.action.toLowerCase().includes(search.toLowerCase()) ||
                          log.details.toLowerCase().includes(search.toLowerCase());
    const matchesModule = moduleFilter === 'All' || log.module === moduleFilter;
    return matchesSearch && matchesModule;
  });

  const uniqueModules = ['All', ...new Set(exitAuditLogs.map(log => log.module))];

  return (
    <Box className="page-container">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ 
          fontWeight: 800, color: '#0241FB', 
          background: 'linear-gradient(90deg, #0241FB, #4470ED)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          mb: 1 
        }}>
          Exit Member Audit Trail
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
          Track all actions and modifications made within the Exit Member module.
        </Typography>
      </Box>

      <Card sx={{ borderRadius: 3, borderTop: `3px solid #0241FB`, boxShadow: '0 8px 32px rgba(2, 61, 251, 0.15)' }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap', alignItems: 'center' }}>
             <TextField
              size="small"
              placeholder="Search by action, user, or details..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: '#0241FB' }} /></InputAdornment>,
              }}
              sx={{ flex: 1, minWidth: 250, maxWidth: 400 }}
            />
            <FormControl size="small" sx={{ minWidth: 180 }}>
              <InputLabel>Module</InputLabel>
              <Select
                value={moduleFilter}
                label="Module"
                onChange={(e) => setModuleFilter(e.target.value)}
              >
                {uniqueModules.map(mod => (
                  <MenuItem key={mod} value={mod}>{mod}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <Stack direction="row" spacing={1}>
              <Button size="small" variant="outlined" startIcon={<CsvIcon />}
                onClick={() => exportToCSV(['Date & Time','User','Module','Action','Details'], filteredLogs.map(l => [l.date, l.user, l.module, l.action, l.details]), 'exit_audit_trail')}
                sx={{ borderRadius: 2, fontSize: '0.75rem' }}>CSV</Button>
              <Button size="small" variant="outlined" startIcon={<PdfIcon />}
                onClick={() => exportToPDF('Exit Member Audit Trail', ['Date & Time','User','Module','Action','Details'], filteredLogs.map(l => [l.date, l.user, l.module, l.action, l.details]))}
                sx={{ borderRadius: 2, fontSize: '0.75rem' }}>PDF</Button>
              <Button size="small" variant="outlined" startIcon={<PrintIcon />}
                onClick={() => printTable('Exit Member Audit Trail', ['Date & Time','User','Module','Action','Details'], filteredLogs.map(l => [l.date, l.user, l.module, l.action, l.details]))}
                sx={{ borderRadius: 2, fontSize: '0.75rem' }}>Print</Button>
            </Stack>
          </Box>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ background: 'linear-gradient(135deg, #05077E 0%, #0241FB 60%, #4470ED 100%)' }}>
                  {['Date & Time', 'User', 'Module', 'Action', 'Details'].map(h => (
                    <TableCell key={h} sx={{ fontWeight: 700, color: '#FDFDFC', textTransform: 'uppercase', fontSize: '0.75rem' }}>
                      {h}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredLogs.map(log => (
                  <TableRow key={log.id} hover>
                    <TableCell sx={{ whiteSpace: 'nowrap' }}><Typography variant="body2" sx={{ fontWeight: 600 }}>{log.date}</Typography></TableCell>
                    <TableCell>{log.user}</TableCell>
                    <TableCell>
                       <Chip label={log.module} size="small" sx={{ bgcolor: 'rgba(2, 61, 251, 0.08)', color: '#0241FB', fontWeight: 600, fontSize: '0.7rem' }} />
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>{log.action}</TableCell>
                    <TableCell>{log.details}</TableCell>
                  </TableRow>
                ))}
                {filteredLogs.length === 0 && (
                  <TableRow>
                     <TableCell colSpan={5} align="center" sx={{ py: 4, color: 'text.secondary' }}>No audit logs found.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
}
