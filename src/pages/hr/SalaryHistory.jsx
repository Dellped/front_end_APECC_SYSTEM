import React, { useState } from 'react';
import {
  Box, Card, CardContent, Typography, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Grid, TextField,
  Paper, InputAdornment, Avatar, Stack, Chip, Divider, Button
} from '@mui/material';
import {
  Search as SearchIcon,
  Timeline as TimelineIcon,
  Person as PersonIcon,
  TrendingUp as IncreaseIcon,
  TrendingDown as DecreaseIcon,
  AdminPanelSettings as AdminIcon,
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
  textTransform: 'uppercase'
};

const mockHistory = [
  { id: 1, empId: 'EMP001', employee: 'Juan Dela Cruz', oldSalary: 22000, newSalary: 25000, type: 'Increase', date: 'Jan 01 2026', processedBy: 'HR Admin' },
  { id: 2, empId: 'EMP001', employee: 'Juan Dela Cruz', oldSalary: 25000, newSalary: 27000, type: 'Promotion', date: 'Mar 01 2026', processedBy: 'HR Admin' },
  { id: 3, empId: 'EMP002', employee: 'Maria Santos', oldSalary: 28000, newSalary: 30000, type: 'Increase', date: 'Feb 15 2026', processedBy: 'HR Admin' },
];

export default function SalaryHistory() {
  const [search, setSearch] = useState('');
  const [data, setData] = useState(mockHistory);

  const filteredData = React.useMemo(() => {
    return data.filter(item => 
      item.employee.toLowerCase().includes(search.toLowerCase()) ||
      item.empId.toLowerCase().includes(search.toLowerCase())
    );
  }, [data, search]);

  return (
    <Box sx={{ p: 4, bgcolor: '#f4f7fe', minHeight: '100%' }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, color: apeccBlue, mt: 1 }}>
          Salary History
        </Typography>
        <Stack direction="row" spacing={1}>
          <Button size="small" variant="outlined" startIcon={<CsvIcon />}
            onClick={() => exportToCSV(['Employee ID','Employee','Old Salary','New Salary','Increase Amount','Adj. Type','Effective Date','Processed By'], filteredData.map(r => [r.empId, r.employee, r.oldSalary, r.newSalary, r.newSalary - r.oldSalary, r.type, r.date, r.processedBy]), 'salary_history')}
            sx={{ borderRadius: 2, fontSize: '0.75rem' }}>CSV</Button>
          <Button size="small" variant="outlined" startIcon={<PdfIcon />}
            onClick={() => exportToPDF('Salary History', ['Employee ID','Employee','Old Salary','New Salary','Increase Amount','Adj. Type','Effective Date','Processed By'], filteredData.map(r => [r.empId, r.employee, r.oldSalary, r.newSalary, r.newSalary - r.oldSalary, r.type, r.date, r.processedBy]))}
            sx={{ borderRadius: 2, fontSize: '0.75rem' }}>PDF</Button>
          <Button size="small" variant="outlined" startIcon={<PrintIcon />}
            onClick={() => printTable('Salary History', ['Employee ID','Employee','Old Salary','New Salary','Increase Amount','Adj. Type','Effective Date','Processed By'], filteredData.map(r => [r.empId, r.employee, r.oldSalary, r.newSalary, r.newSalary - r.oldSalary, r.type, r.date, r.processedBy]))}
            sx={{ borderRadius: 2, fontSize: '0.75rem' }}>Print</Button>
        </Stack>
      </Box>

      <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.05)', mb: 4 }}>
        <CardContent sx={{ p: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField 
                fullWidth size="small" 
                label="Search Employee"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                InputProps={{ startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} /> }}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Grid container spacing={4}>
        <Grid item xs={12} lg={8}>
          <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={headerStyle}>Employee ID</TableCell>
                  <TableCell sx={headerStyle}>Employee</TableCell>
                  <TableCell sx={headerStyle}>Old Salary</TableCell>
                  <TableCell sx={headerStyle}>New Salary</TableCell>
                  <TableCell sx={headerStyle}>Increase Amount</TableCell>
                  <TableCell sx={headerStyle}>Adjustment Type</TableCell>
                  <TableCell sx={headerStyle}>Effective Date</TableCell>
                  <TableCell sx={headerStyle}>Processed By</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredData.map((row) => (
                  <TableRow key={row.id} hover sx={{ '& td': { py: 2.5 } }}>
                    <TableCell sx={{ fontWeight: 600 }}>{row.empId}</TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1.5} alignItems="center">
                        <Avatar sx={{ width: 32, height: 32, bgcolor: 'rgba(2, 61, 251, 0.1)', color: apeccBlue }}>
                          <PersonIcon fontSize="small" />
                        </Avatar>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 700 }}>{row.employee}</Typography>
                        </Box>
                      </Stack>
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>₱{row.oldSalary.toLocaleString()}</TableCell>
                    <TableCell sx={{ fontWeight: 800, color: apeccBlue }}>₱{row.newSalary.toLocaleString()}</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: (row.newSalary - row.oldSalary) >= 0 ? '#2e7d32' : '#d32f2f' }}>
                      {(row.newSalary - row.oldSalary) >= 0 ? '+' : ''}₱{(row.newSalary - row.oldSalary).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={row.type} 
                        size="small" 
                        icon={row.type === 'Increase' ? <IncreaseIcon /> : <TimelineIcon />}
                        sx={{ 
                          bgcolor: 'rgba(2, 61, 251, 0.05)', 
                          color: apeccBlue, 
                          fontWeight: 700,
                          '& .MuiChip-icon': { color: apeccBlue, fontSize: '0.9rem' }
                        }} 
                      />
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>{row.date}</TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <AdminIcon sx={{ fontSize: '1rem', color: '#666' }} />
                        <Typography variant="caption" sx={{ color: '#666' }}>{row.processedBy}</Typography>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>

        {/* Salary Timeline */}
        <Grid item xs={12} lg={4}>
          <Card sx={{ borderRadius: 3, boxShadow: '0 10px 30px rgba(0,0,0,0.08)', height: '100%', position: 'relative', overflow: 'hidden' }}>
            <Box sx={{ position: 'absolute', top: 0, right: 0, p: 3, opacity: 0.1 }}><TimelineIcon sx={{ fontSize: 100 }} /></Box>
            <CardContent sx={{ p: 4, position: 'relative' }}>
              <Typography variant="h6" sx={{ fontWeight: 800, mb: 4, display: 'flex', alignItems: 'center', gap: 1 }}>
                <TimelineIcon color="primary" /> Salary Timeline
              </Typography>
              
              <Box sx={{ position: 'relative', pl: 4 }}>
                {/* Vertical Line */}
                <Box sx={{ 
                  position: 'absolute', 
                  left: 7, 
                  top: 10, 
                  bottom: 10, 
                  width: 2, 
                  background: `linear-gradient(to bottom, ${apeccBlue}, #ddd)` 
                }} />
                
                <Stack spacing={4}>
                  {filteredData.length > 0 ? (
                    filteredData.slice().reverse().map((item, index) => (
                      <Box key={item.id} sx={{ position: 'relative' }}>
                        <Box sx={{ 
                          position: 'absolute', 
                          left: index === 0 ? -30 : -28, 
                          top: index === 0 ? 4 : 6, 
                          width: index === 0 ? 14 : 10, 
                          height: index === 0 ? 14 : 10, 
                          borderRadius: '50%', 
                          bgcolor: index === 0 ? apeccBlue : '#ddd', 
                          border: index === 0 ? '4px solid #fff' : '2px solid #fff',
                          boxShadow: index === 0 ? '0 0 0 2px rgba(2, 61, 251, 0.2)' : 'none'
                        }} />
                        <Typography variant={index === 0 ? "caption" : "h6"} sx={{ fontWeight: 700, color: index === 0 ? 'text.secondary' : '#444' }}>
                          {index === 0 ? 'Latest' : ''}
                        </Typography>
                        <Typography variant={index === 0 ? "h5" : "h6"} sx={{ fontWeight: 900, color: index === 0 ? apeccBlue : '#444' }}>
                          ₱{item.newSalary.toLocaleString()}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#666' }}>
                          {item.date} • {item.type}
                        </Typography>
                      </Box>
                    ))
                  ) : (
                    <Typography variant="body2" color="text.secondary">Search an employee to see timeline</Typography>
                  )}
                </Stack>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
