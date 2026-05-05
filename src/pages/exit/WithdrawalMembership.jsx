import React, { useState } from 'react';
import {
  Box, Card, CardContent, Typography, TextField, InputAdornment, Table,
  TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Tooltip, Chip, Paper
} from '@mui/material';
import { Search as SearchIcon, Visibility as ViewIcon, PictureAsPdf as PdfIcon, FileDownload as CsvIcon } from '@mui/icons-material';
import { exitRecords, staffClearanceRecords } from '../../data/mockData';
import { exportToCSV } from '../../utils/exportUtils';

export default function WithdrawalMembership() {
  const [search, setSearch] = useState('');

  const approvedRecords = exitRecords.filter(r => 
    staffClearanceRecords.some(clr => clr.employeeId === r.idNo && clr.status === 'Cleared')
  );

  const filteredMembers = approvedRecords.filter((m) => {
    return `${m.name} ${m.idNo}`
      .toLowerCase()
      .includes(search.toLowerCase());
  });

  const getFinancials = (member) => {
    const totalAssets = member.total || 0;
    const totalLiabilities = (member.stlLoan || 0) + (member.salaryLoan || 0) + (member.motorcycleLoan || 0) + (member.housingLoan || 0) + (member.carLoan || 0) + (member.educationalLoan || 0) + (member.gadgetLoan || 0) + (member.malasakitLoan || 0);
    const netAmountDue = member.grandTotal || 0;
    return { totalAssets, totalLiabilities, netAmountDue };
  };

  const getEncodedData = (member) => {
    const financials = getFinancials(member);
    const payload = {
      name: member.name,
      idNo: member.idNo,
      designation: member.designation,
      dateExit: member.dateExit,
      shareCapital: member.shareCapital,
      patronageRefund: member.patronageRefund,
      savingsWithInterest: member.savingsWithInterest,
      dividend: member.dividend,
      voluntarySavings: member.voluntarySavings,
      rebates: member.rebates || member.rebates2 || 25000,
      stlLoan: member.stlLoan,
      salaryLoan: member.salaryLoan,
      motorcycleLoan: member.motorcycleLoan,
      housingLoan: member.housingLoan,
      carLoan: member.carLoan,
      educationalLoan: member.educationalLoan,
      gadgetLoan: member.gadgetLoan,
      malasakitLoan: member.malasakitLoan,
      totalAssets: financials.totalAssets,
      totalLiabilities: financials.totalLiabilities,
      netAmountDue: financials.netAmountDue
    };
    return btoa(JSON.stringify(payload));
  };

  const handleView = (member) => {
    const encoded = getEncodedData(member);
    const base = import.meta.env.BASE_URL;
    window.open(`${base}forms/withdrawal/withdrawal-template.html?data=${encoded}`, '_blank');
  };

  const handleDownloadPDF = (member) => {
    const encoded = getEncodedData(member);
    const base = import.meta.env.BASE_URL;
    window.open(`${base}forms/withdrawal/withdrawal-template.html?data=${encoded}&print=true`, '_blank');
  };

  const handleExportCSV = (member) => {
    const fComm = (val) => {
      const n = parseFloat(val);
      return isNaN(n) ? '0' : n.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
    };

    const financials = getFinancials(member);
    const headers = ['BREAKDOWN', 'AMOUNT (PHP)'];
    const rows = [
      ['SHARE CAPITAL', fComm(member.shareCapital)],
      ['PATRONAGE REFUND', fComm(member.patronageRefund)],
      ['SAVINGS WITH INTEREST', fComm(member.savingsWithInterest)],
      ['DIVIDEND', fComm(member.dividend)],
      ['VOLUNTARY SAVINGS', fComm(member.voluntarySavings)],
      ['Rebates Salary Loan (Valid until April 2026)', fComm(0)],
      ['Rebates Housing Loan (Valid until March 2026)', fComm(member.rebates || member.rebates2 || 25000)],
      ['TOTAL ASSETS', fComm(financials.totalAssets)],
      ['LESS: SHORT TERM LOAN', fComm(member.stlLoan)],
      ['LESS: SALARY LOAN BALANCE', fComm(member.salaryLoan)],
      ['LESS: MOTORCYCLE LOAN BALANCE', fComm(member.motorcycleLoan)],
      ['LESS: HOUSING LOAN BALANCE', fComm(member.housingLoan)],
      ['LESS: CAR LOAN BALANCE', fComm(member.carLoan)],
      ['LESS: EDUCATION LOAN BALANCE', fComm(member.educationalLoan)],
      ['LESS: GADGET LOAN BALANCE', fComm(member.gadgetLoan)],
      ['LESS: MALASAKIT LOAN BALANCE', fComm(member.malasakitLoan)],
      ['TOTAL LIABILITIES', fComm(financials.totalLiabilities)],
      ['GRAND TOTAL (NET DUE)', fComm(financials.netAmountDue)]
    ];
    exportToCSV(headers, rows, `Withdrawal_${member.idNo || 'Member'}`);
  };

  return (
    <Box className="page-container">
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#05077E', mb: 0.5 }}>Withdrawal Membership</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600 }}>Home / Exit Modules / Withdrawal Membership</Typography>
        </Box>
      </Box>

      <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.05)', borderTop: `4px solid #d4a843` }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#05077E' }}>Cleared Employees</Typography>
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
                  <TableRow key={member.idNo} hover>
                    <TableCell sx={{ fontWeight: 600 }}>{member.idNo}</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>{member.name}</TableCell>
                    <TableCell>{member.designation || 'N/A'}</TableCell>
                    <TableCell>{member.dateExit}</TableCell>
                    <TableCell align="center">
                      <Chip label="Cleared" size="small" sx={{ fontWeight: 700, fontSize: '0.7rem', bgcolor: 'rgba(46,125,50,0.1)', color: '#2e7d32' }} />
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
                        <IconButton size="small" onClick={() => handleExportCSV(member)} sx={{ color: '#2e7d32' }}>
                          <CsvIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredMembers.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                      No cleared members found.
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
