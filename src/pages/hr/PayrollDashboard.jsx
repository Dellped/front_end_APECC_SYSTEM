import React, { useState } from 'react';
import {
  Box, Grid, Card, CardContent, Typography, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Chip, Button, TextField, MenuItem,
  InputAdornment, IconButton
} from '@mui/material';
import {
  People as PeopleIcon,
  AccountBalanceWallet as WalletIcon,
  HourglassEmpty as PendingIcon,
  CheckCircle as PaidIcon,
  Visibility as ViewIcon,
  Search as SearchIcon,
  FilterList as FilterIcon
} from '@mui/icons-material';

const NAV = '#05077E';
const IND = '#0241FB';
const goldAccent = '#d4a843';

const summaryStats = [
  { label: 'Total Employees', value: '150', icon: <PeopleIcon />, color: '#0241FB', bg: 'rgba(2,65,251,0.1)' },
  { label: 'Total Payroll Amount', value: '₱2,700,000', icon: <WalletIcon />, color: '#2e7d32', bg: 'rgba(46,125,50,0.1)' },
  { label: 'Pending Payrolls', value: '2', icon: <PendingIcon />, color: '#ed6c02', bg: 'rgba(237,108,2,0.1)' },
  { label: 'Paid Payrolls', value: '12', icon: <PaidIcon />, color: '#05077E', bg: 'rgba(5,7,126,0.1)' },
];

const statusOverview = [
  { period: 'May 1–15, 2026', cutoff: 'First', status: 'Paid', amount: '₱1,200,000' },
  { period: 'May 16–31, 2026', cutoff: 'Second', status: 'Pending', amount: '₱1,500,000' },
  { period: 'April 16–30, 2026', cutoff: 'Second', status: 'Paid', amount: '₱1,450,000' },
  { period: 'April 1–15, 2026', cutoff: 'First', status: 'Paid', amount: '₱1,180,000' },
];

export default function PayrollDashboard() {
  const [month, setMonth] = useState('May');

  const getStatusChip = (status) => {
    let color = 'default';
    let bgColor = 'rgba(0,0,0,0.05)';
    let textColor = 'text.primary';

    if (status === 'Pending') {
      bgColor = '#fff3e0';
      textColor = '#ef6c00';
    } else if (status === 'Processing') {
      bgColor = '#e3f2fd';
      textColor = '#1976d2';
    } else if (status === 'Paid') {
      bgColor = '#e8f5e9';
      textColor = '#2e7d32';
    }

    return (
      <Chip
        label={status}
        size="small"
        sx={{
          fontWeight: 700,
          bgcolor: bgColor,
          color: textColor,
          fontSize: '0.7rem'
        }}
      />
    );
  };

  return (
    <Box className="page-container">
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, color: NAV, mb: 0.5 }}>
          Payroll Dashboard
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
          Monitor the overall status of company payroll cycles.
        </Typography>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {summaryStats.map((stat, i) => (
          <Grid item xs={12} sm={6} md={3} key={i}>
            <Card sx={{ borderRadius: 4, boxShadow: '0 4px 12px rgba(0,0,0,0.05)', border: '1px solid rgba(0,0,0,0.05)' }}>
              <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{
                  width: 50, height: 50, borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  bgcolor: stat.bg, color: stat.color
                }}>
                  {stat.icon}
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase' }}>
                    {stat.label}
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 800, color: NAV }}>
                    {stat.value}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Main Content Dashboard */}
      <Card sx={{ borderRadius: 4, boxShadow: '0 8px 32px rgba(0,0,0,0.06)', borderTop: `4px solid ${goldAccent}` }}>
        <CardContent sx={{ p: 0 }}>
          {/* Table Header & Filters */}
          <Box sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: NAV }}>
              Status Overview
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <TextField
                select
                size="small"
                label="Month"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                sx={{ minWidth: 120 }}
              >
                <MenuItem value="May">May 2026</MenuItem>
                <MenuItem value="April">April 2026</MenuItem>
                <MenuItem value="March">March 2026</MenuItem>
              </TextField>

              <TextField
                select
                size="small"
                label="Department"
                defaultValue="All"
                sx={{ minWidth: 150 }}
              >
                <MenuItem value="All">All Departments</MenuItem>
                <MenuItem value="HR">HR Operations</MenuItem>
                <MenuItem value="Finance">Finance</MenuItem>
              </TextField>

              <Button variant="outlined" startIcon={<FilterIcon />} sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}>
                Filters
              </Button>
            </Box>
          </Box>

          <TableContainer>
            <Table>
              <TableHead sx={{ bgcolor: 'rgba(0,0,0,0.02)' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }}>Payroll Period</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }}>Cutoff</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }}>Total Amount</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700, color: 'text.secondary' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {statusOverview.map((item, index) => (
                  <TableRow key={index} hover>
                    <TableCell sx={{ fontWeight: 600 }}>{item.period}</TableCell>
                    <TableCell sx={{ fontWeight: 500 }}>{item.cutoff}</TableCell>
                    <TableCell>{getStatusChip(item.status)}</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: IND }}>{item.amount}</TableCell>
                    <TableCell align="right">
                      <Button
                        size="small"
                        startIcon={<ViewIcon />}
                        sx={{ textTransform: 'none', fontWeight: 600, color: IND }}
                      >
                        {item.status === 'Paid' ? 'View' : 'Process'}
                      </Button>
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
