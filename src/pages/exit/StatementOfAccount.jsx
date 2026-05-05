import React, { useState } from 'react';
import {
  Box, Card, CardContent, Typography, TextField, InputAdornment, Table,
  TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Tooltip, Chip, Paper
} from '@mui/material';
import { Search as SearchIcon, Visibility as ViewIcon, PictureAsPdf as PdfIcon, FileDownload as CsvIcon } from '@mui/icons-material';
import { exitMembers } from '../../data/mockData';
import { exportToCSV } from '../../utils/exportUtils';

const goldAccent = '#d4a843';

// Mock calculations for each member since we don't have a real backend
const getMemberFinancials = (member) => {
  const compensations = [
    { label: 'Basic Pay', amount: 35000.00 },
    { label: 'Deminimis', amount: 2000.00 },
    { label: '13th month pay', amount: 35000.00 },
    { label: 'Retirement (5 yrs and up)', amount: 0 },
    { label: 'Total savings (apecc as member)', amount: 0 },
    { label: 'Rebates on loans', amount: 0 },
  ];
  const deductions = [
    { label: 'Salary Loan', amount: 0 },
    { label: 'Housing Loan', amount: 0 },
    { label: 'Short Term Loan', amount: 0 },
    { label: 'Malasakit', amount: 0 },
    { label: 'Cash Advance', amount: 0 },
    { label: 'Motorcycle loan', amount: 0 },
    { label: 'Gadget Loan', amount: 0 },
    { label: 'Savings Withdrawal', amount: 0 },
  ];
  
  const totalCompensations = compensations.reduce((acc, curr) => acc + (curr.amount || 0), 0);
  const totalDeductions = deductions.reduce((acc, curr) => acc + (curr.amount || 0), 0);
  const netPayable = totalCompensations - totalDeductions;
  
  return { compensations, deductions, totalCompensations, totalDeductions, netPayable };
};

export default function StatementOfAccount() {
  const [search, setSearch] = useState('');

  const resignedMembers = exitMembers.filter((m) => m.status === 'Completed');
  const filteredMembers = resignedMembers.filter((m) => {
    return `${m.memberName} ${m.memberId}`
      .toLowerCase()
      .includes(search.toLowerCase());
  });

  const getEncodedData = (member) => {
    const financials = getMemberFinancials(member);
    const payload = {
      empName: member.memberName,
      empId: member.memberId,
      designation: member.designation || 'N/A',
      dateExit: member.dateExit,
      compensations: financials.compensations,
      deductions: financials.deductions,
      totalCompensations: financials.totalCompensations,
      totalDeductions: financials.totalDeductions,
      netPayable: financials.netPayable
    };
    return btoa(JSON.stringify(payload));
  };

  const handleView = (member) => {
    const encoded = getEncodedData(member);
    const base = import.meta.env.BASE_URL;
    window.open(`${base}forms/soa/soa-template.html?data=${encoded}`, '_blank');
  };

  const handleDownloadPDF = (member) => {
    const encoded = getEncodedData(member);
    const base = import.meta.env.BASE_URL;
    const url = `${base}forms/soa/soa-template.html?data=${encoded}&print=true`;

    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = url;
    document.body.appendChild(iframe);

    setTimeout(() => {
      if (document.body.contains(iframe)) {
        document.body.removeChild(iframe);
      }
    }, 10000);
  };

  const handleDownloadExcel = (member) => {
    const financials = getMemberFinancials(member);
    const lineItems = [...financials.compensations, ...financials.deductions];
    exportToCSV(['#', 'Description', 'Amount'], lineItems.map((item, i) => [i + 1, item.label, item.amount]), `soa_${member.memberId}`);
  };

  return (
    <Box className="page-container">
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#05077E', mb: 0.5 }}>Statement of Account</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600 }}>Home / Exit Modules / Statement of Account</Typography>
        </Box>
      </Box>

      <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.05)', borderTop: `4px solid ${goldAccent}` }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#05077E' }}>Resigned Employees (SOA Ready)</Typography>
            <TextField
              size="small"
              placeholder="Search member by name or ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: '#05077E' }} />
                  </InputAdornment>
                ),
              }}
              sx={{ minWidth: 300, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />
          </Box>

          <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 'none', border: '1px solid #eee' }}>
            <Table size="small">
              <TableHead sx={{ bgcolor: 'rgba(5,7,126,0.05)' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700, color: '#05077E' }}>Employee ID</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: '#05077E' }}>Employee Name</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: '#05077E' }}>Designation</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: '#05077E' }}>Effective Date of Exit</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: '#05077E', textAlign: 'center' }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: '#05077E', textAlign: 'center' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredMembers.map((member) => (
                  <TableRow key={member.memberId} hover>
                    <TableCell sx={{ fontWeight: 600 }}>{member.memberId}</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>{member.memberName}</TableCell>
                    <TableCell>{member.designation || 'N/A'}</TableCell>
                    <TableCell>{member.dateExit}</TableCell>
                    <TableCell align="center">
                      <Chip label="SOA Ready" size="small" sx={{ fontWeight: 700, fontSize: '0.7rem', bgcolor: 'rgba(46,125,50,0.1)', color: '#2e7d32' }} />
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="View Form">
                        <IconButton size="small" onClick={() => handleView(member)} sx={{ color: '#0241FB' }}>
                          <ViewIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Download PDF Form">
                        <IconButton size="small" onClick={() => handleDownloadPDF(member)} sx={{ color: '#d32f2f' }}>
                          <PdfIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Download Excel (CSV)">
                        <IconButton size="small" onClick={() => handleDownloadExcel(member)} sx={{ color: '#2e7d32' }}>
                          <CsvIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredMembers.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                      No resigned members found.
                    </TableCell>
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

