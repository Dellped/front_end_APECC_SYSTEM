import React, { useState } from 'react';
import {
  Box, Card, CardContent, Typography, Grid, Button, IconButton,
  Divider, List, ListItem, ListItemText, ListItemIcon, Avatar, Tooltip
} from '@mui/material';
import {
  Description as ReportIcon,
  Assessment as SummaryIcon,
  Group as EmployeesIcon,
  AccountBalance as GovIcon,
  CloudDownload as DownloadIcon,
  Print as PrintIcon,
  Email as EmailIcon,
  PictureAsPdf as PdfIcon,
  GridOn as ExcelIcon,
} from '@mui/icons-material';

const goldAccent = '#d4a843';

export default function PayrollReports() {
  const reports = [
    { id: 'R001', title: 'Payroll Register', desc: 'Detailed breakdown of earnings and deductions per employee for the current cutoff.', icon: <ReportIcon />, color: '#023DFB' },
    { id: 'R002', title: 'Payroll Summary', desc: 'High-level summary of total gross, deductions, and net pay for the period.', icon: <SummaryIcon />, color: goldAccent },
    { id: 'R003', title: 'Government Contribution Report', desc: 'Summary of SSS, PhilHealth, and Pag-IBIG contributions (ER & EE shares).', icon: <GovIcon />, color: '#2e7d32' },
    { id: 'R004', title: 'Employee Payslip Batch', desc: 'Generate and download all payslips for the selected period in a single PDF.', icon: <ReportIcon />, color: '#8b1a1a' },
    { id: 'R005', title: 'Loan Deduction Report', desc: 'Track all active loans and the corresponding deductions made this period.', icon: <SummaryIcon />, color: '#f57c00' },
    { id: 'R006', title: 'Payroll Journal Entry', desc: 'Accounting report for ledger entries related to the current payroll run.', icon: <SummaryIcon />, color: '#1976d2' },
  ];

  return (
    <Box className="page-container">
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" sx={{ 
            fontWeight: 800, color: '#023DFB', 
            background: 'linear-gradient(90deg, #023DFB, #4a75e6)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            mb: 0.5 
          }}>
            Payroll Reports & Generation
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
            Generate and export critical payroll documentation and regulatory reports
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Report Selection Grid */}
        {reports.map((report) => (
          <Grid item xs={12} md={6} lg={4} key={report.id}>
            <Card sx={{ 
              borderRadius: 4, 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column',
              transition: 'all 0.2s',
              '&:hover': { transform: 'translateY(-5px)', boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }
            }}>
              <CardContent sx={{ flex: 1, p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Avatar sx={{ bgcolor: `${report.color}15`, color: report.color }}>
                    {report.icon}
                  </Avatar>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>{report.title}</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3, minHeight: 40 }}>
                  {report.desc}
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.disabled' }}>Last Generated: Mar 15, 2025</Typography>
                  <Box>
                    <Tooltip title="Download PDF"><IconButton size="small" sx={{ color: '#d32f2f' }}><PdfIcon /></IconButton></Tooltip>
                    <Tooltip title="Download Excel"><IconButton size="small" sx={{ color: '#2e7d32' }}><ExcelIcon /></IconButton></Tooltip>
                    <Tooltip title="Print Report"><IconButton size="small"><PrintIcon /></IconButton></Tooltip>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}

        {/* Bank Disbursement Section */}
        <Grid item xs={12}>
          <Card sx={{ 
            borderRadius: 4, 
            background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
            color: '#fff',
            p: 1
          }}>
            <CardContent sx={{ p: 4 }}>
              <Grid container spacing={4} alignItems="center">
                <Grid item xs={12} md={8}>
                  <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>Bank File / Salary Disbursement</Typography>
                  <Typography variant="body2" sx={{ opacity: 0.7, mb: 3 }}>
                    Generate the standard bank export file for bulk salary transfers. Supports BDO, BPI, Metrobank, and Landbank formats.
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button variant="contained" startIcon={<DownloadIcon />} sx={{ bgcolor: goldAccent, color: '#0f172a', fontWeight: 800, '&:hover': { bgcolor: '#e8c96a' } }}>
                      Generate Bank File
                    </Button>
                    <Button variant="outlined" startIcon={<EmailIcon />} sx={{ borderColor: 'rgba(255,255,255,0.3)', color: '#fff', '&:hover': { borderColor: '#fff' } }}>
                      Send Advice via Email
                    </Button>
                  </Box>
                </Grid>
                <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
                  <Box sx={{ p: 3, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 4, bgcolor: 'rgba(255,255,255,0.05)' }}>
                    <Typography variant="caption" sx={{ opacity: 0.6, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Total Disbursement</Typography>
                    <Typography variant="h4" sx={{ fontWeight: 800, color: goldAccent, my: 1 }}>₱1.25M</Typography>
                    <Typography variant="caption" sx={{ opacity: 0.8 }}>For 158 Employees</Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
