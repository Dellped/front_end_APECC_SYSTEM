import React, { useState, useRef } from 'react';
import {
  Box, Card, Typography, Grid, Button, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, TextField, InputAdornment,
  Stack, Paper, Autocomplete
} from '@mui/material';
import {
  Search as SearchIcon,
  Print as PrintIcon,
  FileDownload as CsvIcon,
  PictureAsPdf as PdfIcon,
} from '@mui/icons-material';
import { exitRecords, staffClearanceRecords } from '../../data/mockData';
import { exportToCSV } from '../../utils/exportUtils';
import logo from '../../../assets/images/apecc-favicon.png';

export default function WithdrawalMembership() {
  const approvedRecords = exitRecords.filter(r => 
    staffClearanceRecords.some(clr => clr.employeeId === r.idNo && clr.status === 'Cleared')
  );
  
  const [selectedMember, setSelectedMember] = useState(approvedRecords[0] || null);
  const printRef = useRef();

  // Helper for safe currency formatting
  const fComm = (val) => {
    const n = parseFloat(val);
    return isNaN(n) ? '0' : n.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  };

  const handleDownloadPDF = () => {
    const element = document.getElementById('withdrawal-form-print');
    const opt = {
      margin: [5, 5],
      filename: `Clearance_Withdrawal_${selectedMember?.idNo || 'Member'}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, logging: false },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    if (typeof window.html2pdf !== 'undefined') {
      window.html2pdf().set(opt).from(element).save();
    } else {
      console.error('html2pdf library not loaded');
      alert('PDF library is still loading or failed to load. Please try again in a moment.');
    }
  };

  const handlePrint = () => {
    const content = document.getElementById('withdrawal-form-print').innerHTML;
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Clearance and Withdrawal Form - ${selectedMember?.name}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700;900&display=swap');
            body { font-family: 'Roboto', sans-serif; margin: 0; padding: 0; }
            .print-container { width: 210mm; margin: auto; padding: 5mm; box-sizing: border-box; }
            @page { size: A4 portrait; margin: 5mm; }
            * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #000; padding: 3px 6px; font-size: 8pt; }
            .no-border td { border: none; }
            .bg-grey { background-color: #d8d8d8 !important; }
            .bg-yellow { background-color: #ffff66 !important; }
            input[type="checkbox"] { width: 12px; height: 12px; margin: 0; }
          </style>
        </head>
        <body>
          <div class="print-container">
            ${content}
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    setTimeout(() => {
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    }, 500);
  };

  const handleExportCSV = () => {
    const headers = ['BREAKDOWN', 'AMOUNT (PHP)'];
    const rows = [
      ['SHARE CAPITAL', fComm(selectedMember?.shareCapital)],
      ['PATRONAGE REFUND', fComm(selectedMember?.patronageRefund)],
      ['SAVINGS WITH INTEREST', fComm(selectedMember?.savingsWithInterest)],
      ['DIVIDEND', fComm(selectedMember?.dividend)],
      ['VOLUNTARY SAVINGS', fComm(selectedMember?.voluntarySavings)],
      ['Rebates Salary Loan (Valid until April 2026)', fComm(0)],
      ['Rebates Housing Loan (Valid until March 2026)', fComm(selectedMember?.rebates || selectedMember?.rebates2 || 25000)],
      ['TOTAL', fComm(selectedMember?.total)],
      ['LESS: SHORT TERM LOAN', fComm(selectedMember?.stlLoan)],
      ['LESS: SALARY LOAN BALANCE', fComm(selectedMember?.salaryLoan)],
      ['LESS: MOTORCYCLE LOAN BALANCE', fComm(selectedMember?.motorcycleLoan)],
      ['LESS: HOUSING LOAN BALANCE', fComm(selectedMember?.housingLoan)],
      ['LESS: CAR LOAN BALANCE', fComm(selectedMember?.carLoan)],
      ['LESS: EDUCATION LOAN BALANCE', fComm(selectedMember?.educationalLoan)],
      ['LESS: GADGET LOAN BALANCE', fComm(selectedMember?.gadgetLoan)],
      ['LESS: MALASAKIT LOAN BALANCE', fComm(selectedMember?.malasakitLoan)],
      ['GRAND TOTAL', fComm(selectedMember?.grandTotal)]
    ];
    exportToCSV(headers, rows, `Withdrawal_${selectedMember?.idNo || 'Member'}`);
  };

  const totalAssets = selectedMember?.total || 0;
  const totalLiabilities = (selectedMember?.stlLoan || 0) + (selectedMember?.salaryLoan || 0) + (selectedMember?.motorcycleLoan || 0) + (selectedMember?.housingLoan || 0) + (selectedMember?.carLoan || 0) + (selectedMember?.educationalLoan || 0) + (selectedMember?.gadgetLoan || 0) + (selectedMember?.malasakitLoan || 0);
  const netAmountDue = selectedMember?.grandTotal || 0; // Same as totalAssets - totalLiabilities

  // Custom checkbox visually
  const PrintCheckbox = () => (
     <Box sx={{ width: 12, height: 12, border: '1px solid #000', borderRadius: '2px', display: 'inline-block', mr: 1, position: 'relative', top: '2px' }} />
  );

  return (
    <Box className="page-container">
      {/* ── Page Header ─────────────────────────────────────────────────── */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{
            fontWeight: 800,
            background: 'linear-gradient(135deg, #05077E 0%, #0241FB 55%, #4470ED 100%)',
            backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>
            Withdrawal Membership
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
            Generate official Clearance and Withdrawal documentation.
          </Typography>
        </Box>
      </Box>

      {/* ── Filters Card ─────────────────────────────────────────────────── */}
      <Card sx={{
        mb: 4, borderRadius: 3, borderTop: '3px solid #d4a843',
        background: 'linear-gradient(160deg, #05077E 0%, #0241FB 55%, #4470ED 80%, #B4B7D3 100%)',
        boxShadow: '0 8px 32px rgba(5,7,126,0.22)'
      }}>
        <Box sx={{ p: 4 }}>
          <Grid container spacing={3} alignItems="center" justifyContent="space-between">
            <Grid item xs={12} md={5}>
              <Typography variant="subtitle2" sx={{ color: 'rgba(253,253,252,0.8)', mb: 1, fontWeight: 700 }}>Select Approved Member</Typography>
              <Autocomplete
                options={approvedRecords}
                getOptionLabel={(option) => `${option.name} (${option.idNo})`}
                value={selectedMember}
                onChange={(event, newValue) => {
                  if (newValue) setSelectedMember(newValue);
                }}
                renderInput={(params) => (
                  <TextField 
                    {...params}
                    placeholder="Search by Name or ID No. ..."
                    size="small"
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <>
                          <InputAdornment position="start" sx={{ pl: 1 }}>
                            <SearchIcon sx={{ color: '#FDFDFC', opacity: 0.8 }} />
                          </InputAdornment>
                          {params.InputProps.startAdornment}
                        </>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        bgcolor: 'rgba(253,253,252,0.1)', color: '#FDFDFC', borderRadius: 2,
                        '& fieldset': { borderColor: 'rgba(253,253,252,0.3)' },
                        '&:hover fieldset': { borderColor: '#FDFDFC' },
                        '&.Mui-focused fieldset': { borderColor: '#d4a843', borderWidth: '2px' },
                      },
                      '& .MuiInputBase-input': { color: '#FDFDFC' },
                      '& .MuiInputBase-input::placeholder': { color: 'rgba(253,253,252,0.6)', opacity: 1 },
                      '& .MuiSvgIcon-root': { color: 'rgba(253,253,252,0.8)' },
                      '& .MuiAutocomplete-clearIndicator': { color: 'rgba(253,253,252,0.8)' }
                    }}
                  />
                )}
                sx={{
                  width: '100%',
                  '& .MuiAutocomplete-listbox': { bgcolor: '#FDFDFC', color: '#05077E' },
                  '& .MuiAutocomplete-option': { '&[aria-selected="true"]': { bgcolor: 'rgba(212,168,67,0.2)' } }
                }}
              />
            </Grid>

            {/* Currently Selected Employee Card */}
            <Grid item xs={12} md={4}>
              {selectedMember && (
                <Box sx={{ 
                  bgcolor: 'rgba(253,253,252,0.15)', border: '1px solid rgba(253,253,252,0.3)', 
                  p: 2, borderRadius: 2, display: 'flex', flexDirection: 'column',
                  backdropFilter: 'blur(10px)'
                }}>
                  <Typography variant="caption" sx={{ color: '#d4a843', fontWeight: 800, mb: 0.5, textTransform: 'uppercase' }}>
                    Currently Selected
                  </Typography>
                  <Typography variant="h6" sx={{ color: '#FDFDFC', fontWeight: 800, lineHeight: 1.2 }}>
                    {selectedMember.name}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(253,253,252,0.8)', display: 'flex', gap: 1, mt: 0.5 }}>
                     <span>ID: {selectedMember.idNo}</span>
                     <span>•</span>
                     <span>{selectedMember.designation}</span>
                  </Typography>
                </Box>
              )}
            </Grid>

            <Grid item xs={12} md={3} sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end' }}>
              <Stack direction="row" spacing={1}>
                <Button variant="contained" startIcon={<PdfIcon />} onClick={handleDownloadPDF} 
                  sx={{ 
                    background: 'linear-gradient(135deg, #d32f2f 0%, #ef5350 100%)', color: '#FDFDFC', borderRadius: 2, fontWeight: 800, boxShadow: '0 4px 12px rgba(211,47,47,0.3)',
                    '&:hover': { filter: 'brightness(1.15)' } 
                  }}>
                  PDF
                </Button>
                <Button variant="contained" startIcon={<CsvIcon />} onClick={handleExportCSV} 
                  sx={{ 
                    background: 'linear-gradient(135deg, #2e7d32 0%, #66bb6a 100%)', color: '#FDFDFC', borderRadius: 2, fontWeight: 800, boxShadow: '0 4px 12px rgba(46,125,50,0.3)',
                    '&:hover': { filter: 'brightness(1.15)' } 
                  }}>
                  CSV
                </Button>
                <Button variant="contained" startIcon={<PrintIcon />} onClick={handlePrint} 
                  sx={{ 
                    background: 'linear-gradient(135deg, #8d6e63 0%, #a1887f 100%)', color: '#FDFDFC', borderRadius: 2, fontWeight: 800, boxShadow: '0 4px 12px rgba(141,110,99,0.3)',
                    '&:hover': { filter: 'brightness(1.15)' } 
                  }}>
                  Print
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </Box>
      </Card>

      {/* Preview Section */}
      <Paper elevation={0} sx={{ p: 4, borderRadius: 4, bgcolor: '#525659', display: 'flex', justifyContent: 'center', overflow: 'auto', minHeight: '1000px' }}>
         <Card sx={{ width: '210mm', minHeight: '297mm', bgcolor: '#FDFDFC', p: '5mm', boxShadow: '0 0 20px rgba(0,0,0,0.5)', borderRadius: 0, '& *': { fontFamily: "'Roboto', sans-serif" } }}>
            <Box id="withdrawal-form-print" sx={{ bgcolor: '#FDFDFC', color: '#000', p: 0.5, width: '100%', maxWidth: '800px', margin: 'auto' }}>
              
              {/* Output Shared Header */}
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, justifyContent: 'center' }}>
                <img src={logo} alt="Logo" style={{ width: 60, height: 60, marginRight: 15 }} />
                <Box sx={{ textAlign: 'center' }}>
                  <Typography sx={{ fontWeight: 900, fontSize: '15pt', color: '#000', lineHeight: 1.1, letterSpacing: '-0.2px' }}>ASA PHILIPPINES EMPLOYEES CREDIT COOPERATIVE</Typography>
                  <Typography sx={{ fontSize: '9pt' }}>Ortigas Pasig City, Metro Manila | Contact Number: 09985523801</Typography>
                  <Typography sx={{ fontSize: '8pt', color: '#666' }}>https://apecc.com.ph</Typography>
                </Box>
              </Box>

              {/* ───────────────────────────────────────────────────────── */}
              {/* SECTION 1: MEMBERSHIP CLEARANCE FORM */}
              {/* ───────────────────────────────────────────────────────── */}

              <Box sx={{ border: '2px solid #555', mb: 1, pb: 0.5 }}>
                 <Box sx={{ bgcolor: '#c9cacb', borderBottom: '2px solid #555', py: 0.2, mb: 0 }}>
                    <Typography sx={{ fontWeight: 900, textAlign: 'center', fontSize: '12pt', letterSpacing: '0.5px' }}>MEMBERSHIP CLEARANCE FORM</Typography>
                 </Box>

                 <Box sx={{ px: 0 }}>
                   <TableContainer component={Box} sx={{ mb: 0, '& td, & th': { py: 0.5, px: 1, border: '1px solid #777' } }}>
                     <Table size="small">
                       <TableBody>
                         <TableRow>
                           <TableCell sx={{ fontWeight: 'bold', fontSize: '8.5pt', width: '20%', bgcolor: '#e6e6e6' }}>Name of Member:</TableCell>
                           <TableCell sx={{ bgcolor: '#ffff80', fontWeight: 'bold', fontSize: '9pt', color: '#000', width: '45%' }}>{selectedMember?.name || ''}</TableCell>
                           <TableCell sx={{ fontWeight: 'bold', fontSize: '8.5pt', width: '10%', bgcolor: '#e6e6e6', textAlign: 'center' }}>ID No.:</TableCell>
                           <TableCell sx={{ bgcolor: '#f4f4f4', fontSize: '8.5pt', textAlign: 'center' }}>{selectedMember?.idNo || ''}</TableCell>
                         </TableRow>
                         <TableRow>
                           <TableCell sx={{ fontWeight: 'bold', fontSize: '8.5pt', bgcolor: '#e6e6e6' }}>Date of Exit:</TableCell>
                           <TableCell sx={{ bgcolor: '#ffff80', fontSize: '9pt', fontWeight: 600 }}>{selectedMember?.dateExit ? new Date(selectedMember.dateExit).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }) : ''}</TableCell>
                           <TableCell sx={{ fontWeight: 'bold', fontSize: '8.5pt', bgcolor: '#e6e6e6', textAlign: 'center' }}>Position:</TableCell>
                           <TableCell sx={{ bgcolor: '#ffff80', fontSize: '8.5pt', fontWeight: 600, textAlign: 'center' }}>{selectedMember?.designation || ''}</TableCell>
                         </TableRow>
                       </TableBody>
                     </Table>
                   </TableContainer>

                   <TableContainer component={Box} sx={{ mt: 1, '& td, & th': { py: 0.5, px: 1, border: '1px solid #777' } }}>
                     <Table size="small">
                       <TableBody>
                         <TableRow sx={{ bgcolor: '#e6e6e6' }}>
                           <TableCell sx={{ fontWeight: 'bold', fontSize: '8.5pt' }}>I. ASSETS</TableCell>
                           <TableCell sx={{ fontWeight: 'bold', fontSize: '8.5pt', textAlign: 'center', width: '35%' }}>AMOUNT</TableCell>
                         </TableRow>
                         <TableRow>
                           <TableCell sx={{ fontWeight: 'bold', fontSize: '8.5pt', pl: 4 }}>TOTAL ASSETS:</TableCell>
                           <TableCell sx={{ textAlign: 'center', fontSize: '9pt', fontWeight: 'bold' }}>{fComm(totalAssets)}</TableCell>
                         </TableRow>
                         <TableRow sx={{ bgcolor: '#e6e6e6' }}>
                           <TableCell sx={{ fontWeight: 'bold', fontSize: '8.5pt' }}>II. LIABILITIES</TableCell>
                           <TableCell sx={{ fontWeight: 'bold', fontSize: '8.5pt', textAlign: 'center' }}>AMOUNT</TableCell>
                         </TableRow>
                         <TableRow>
                           <TableCell sx={{ fontWeight: 'bold', fontSize: '8.5pt', pl: 4 }}>TOTAL LIABILITIES:</TableCell>
                           <TableCell sx={{ textAlign: 'center', fontSize: '9pt', fontWeight: 'bold' }}>{fComm(totalLiabilities)}</TableCell>
                         </TableRow>
                       </TableBody>
                     </Table>
                   </TableContainer>
                   
                   <TableContainer component={Box} sx={{ mb: 0.5, '& td': { border: '1px solid #777', py: 0.5, px: 1 } }}>
                     <Table size="small">
                       <TableBody>
                         <TableRow sx={{ bgcolor: '#f4f4f4' }}>
                           <TableCell sx={{ fontWeight: 'bold', fontSize: '8.5pt' }}>Net Amounts Due (Total Assets less Total Liabilities):</TableCell>
                           <TableCell sx={{ fontWeight: 'bold', fontSize: '8.5pt', width: '100px', textAlign: 'right' }}>Php:</TableCell>
                           <TableCell sx={{ textAlign: 'center', fontSize: '9.5pt', fontWeight: '900', width: '25%' }}>{fComm(netAmountDue)}</TableCell>
                         </TableRow>
                       </TableBody>
                     </Table>
                   </TableContainer>

                   <Box sx={{ px: 1 }}>
                     <Typography sx={{ fontSize: '7pt', fontStyle: 'italic', mb: 0.5, lineHeight: 1.1 }}>
                       We certify the correctness of above calculations and acknowledge the net amount due to the abovementioned staff. Therefore, we recommend for his settlement of accounts.
                     </Typography>

                     <Typography sx={{ fontSize: '7.5pt', fontWeight: 'bold', mb: 0.2 }}>REMARKS:</Typography>
                     <Box sx={{ display: 'flex', gap: 4, mb: 1, pr: 2 }}>
                       <Box sx={{ display: 'flex', flex: 1, flexDirection: 'column' }}>
                         <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                           <Typography sx={{ fontSize: '7.5pt', mr: 1, whiteSpace: 'nowrap' }}>Verified thru Call:</Typography>
                           <Box sx={{ bgcolor: '#ffff80', borderBottom: '1px solid #000', flex: 1, height: 16 }}></Box>
                         </Box>
                         <Typography sx={{ fontSize: '6.5pt', textAlign: 'center', mt: 0.2 }}>Printed Name with ID Number</Typography>
                       </Box>
                       <Box sx={{ display: 'flex', flex: 1, flexDirection: 'column' }}>
                         <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                           <Typography sx={{ fontSize: '7.5pt', mr: 1, whiteSpace: 'nowrap' }}>Comments thru Call:</Typography>
                           <Box sx={{ borderBottom: '1px solid #000', flex: 1, height: 16 }}></Box>
                         </Box>
                       </Box>
                     </Box>
                     
                     <Grid container spacing={4} sx={{ mt: 1 }}>
                       <Grid item xs={6}>
                         <Typography sx={{ fontSize: '7.5pt', fontWeight: 'bold' }}>Prepared /Checked by</Typography>
                         <Box sx={{ mt: 1, textAlign: 'center' }}>
                            <Typography sx={{ fontSize: '8pt', fontWeight: 800, borderBottom: '1px solid #000', display: 'inline-block', minWidth: '80%', bgcolor: '#ffff80', minHeight: 15 }}>
                               Kyzeel M. Estrella (E-013)
                            </Typography>
                            <Typography sx={{ fontSize: '6.5pt' }}>Printed Name with ID Number aboved signature</Typography>
                         </Box>
                       </Grid>
                       <Grid item xs={6}>
                         <Typography sx={{ fontSize: '7.5pt', fontWeight: 'bold' }}>Cleared / Approved by</Typography>
                         <Box sx={{ mt: 1, textAlign: 'center' }}>
                            <Typography sx={{ fontSize: '8pt', fontWeight: 800, borderBottom: '1px solid #000', display: 'inline-block', minWidth: '80%', bgcolor: '#ffff80', minHeight: 15 }}>
                               Ma. Lyn Jee Tupas (E0006)
                            </Typography>
                            <Typography sx={{ fontSize: '6.5pt' }}>Printed Name with ID Number aboved signature</Typography>
                         </Box>
                       </Grid>
                     </Grid>
                   </Box>
                 </Box>
              </Box>

              {/* ───────────────────────────────────────────────────────── */}
              {/* SECTION 2: WITHDRAWAL OF MEMBERSHIP */}
              {/* ───────────────────────────────────────────────────────── */}

              <Box sx={{ border: '2px solid #555', pb: 0.5 }}>
                 <Box sx={{ bgcolor: '#c9cacb', borderBottom: '2px solid #555', py: 0.3, textAlign: 'center', mb: 0.5 }}>
                   <Typography sx={{ fontWeight: 900, fontSize: '11pt', letterSpacing: '0.5px' }}>WITHDRAWAL OF MEMBERSHIP</Typography>
                 </Box>

                 <Box sx={{ px: 1 }}>
                   <Typography sx={{ fontSize: '7.5pt', mb: 1, lineHeight: 1.2 }}>
                     I wish to withdraw my membership with ASA Philippines Employees Credit Cooperative. I am fully aware that by withdrawing my membership 
                     from <span style={{display: 'inline-block', borderBottom: '1px solid #000', width: 120}}></span> to <span style={{display: 'inline-block', borderBottom: '1px solid #000', width: 120}}></span> of the current year, I am no longer entitled to dividend/patronage refund.
                   </Typography>

                   <Box sx={{ mb: 1 }}>
                     <Typography sx={{ fontSize: '7.5pt', fontWeight: 'bold', mb: 0.5 }}>
                       Reason for Withdrawal: <span style={{display: 'inline-block', borderBottom: '1px solid #000', width: '80%'}}></span>
                     </Typography>
                     <Typography sx={{ fontSize: '7.5pt', fontWeight: 'bold', mb: 0.5 }}>
                       Effectivity Date: <span style={{display: 'inline-block', borderBottom: '1px solid #000', width: '85%'}}></span>
                     </Typography>
                     <Box sx={{ display: 'flex', gap: 6, mt: 0.5, pl: 2 }}>
                       <Box sx={{ display: 'flex', alignItems: 'center' }}>
                         <PrintCheckbox /> <Typography sx={{ fontSize: '7.5pt' }}>Active Employee</Typography>
                       </Box>
                       <Box sx={{ display: 'flex', alignItems: 'center' }}>
                         <PrintCheckbox /> <Typography sx={{ fontSize: '7.5pt' }}>Resigned / Retired from the company/ Discontinued from service of the company</Typography>
                       </Box>
                     </Box>
                   </Box>

                   <Box sx={{ bgcolor: '#c9cacb', border: '1px solid #555', py: 0.2, textAlign: 'center', mb: 0.5 }}>
                     <Typography sx={{ fontWeight: 800, fontSize: '8pt' }}>INSTRUCTIONS</Typography>
                   </Box>

                   <Grid container spacing={1}>
                     {/* Left Column: Instructions A & B */}
                     <Grid item xs={6} sx={{ pr: 1 }}>
                       <Typography sx={{ fontSize: '7pt', fontStyle: 'italic', mb: 0.5 }}>Kindly check your preference.</Typography>
                       
                       <Box sx={{ mb: 1 }}>
                         <Typography sx={{ fontSize: '7.5pt', fontWeight: 'bold', mb: 0.5 }}>A. For my Savings, Share capital contribution and dividend and patronage refund</Typography>
                         
                         <Box sx={{ ml: 2, display: 'flex', alignItems: 'flex-start', mb: 0.5 }}>
                           <PrintCheckbox /> <Typography sx={{ fontSize: '7.5pt', lineHeight: 1.2 }}>Please credit my Membership withdrawal proceeds to the settlement of account.</Typography>
                         </Box>
                         <Box sx={{ ml: 2, display: 'flex', alignItems: 'flex-start', mb: 0.5 }}>
                           <PrintCheckbox /> <Typography sx={{ fontSize: '7.5pt', lineHeight: 1.2 }}>Please credit my Membership withdrawal proceeds to my BDO bank account.</Typography>
                         </Box>
                         
                         <Typography sx={{ fontSize: '7.5pt', fontWeight: 'bold', ml: 2, mt: 0.5, mb: 0.5 }}>
                           BDO Account no: <span style={{display: 'inline-block', borderBottom: '1px solid #000', width: 120}}></span>
                           &nbsp;&nbsp;&nbsp; ( &nbsp;&nbsp; ) Savings Account &nbsp;&nbsp;&nbsp; ( &nbsp;&nbsp; ) Credit Account
                         </Typography>

                         <Box sx={{ ml: 2, display: 'flex', alignItems: 'flex-start', mb: 0.5 }}>
                           <PrintCheckbox /> <Typography sx={{ fontSize: '7.5pt', lineHeight: 1.2 }}>Check for pick-up at the ASA Philippines Employees Credit Cooperative office <br/> <i>(Pls. bring any valid I.D upon claiming the Check)</i></Typography>
                         </Box>
                         <Box sx={{ ml: 2, display: 'flex', alignItems: 'flex-start', mb: 0.5 }}>
                           <PrintCheckbox /> <Typography sx={{ fontSize: '7.5pt', lineHeight: 1.2 }}>Check for pick-up at the Coop's office by my authorized representative. <br/> <i>(Attached is a written authorization. My identification card and that of my reprented upon claiming my check).</i></Typography>
                         </Box>
                       </Box>

                       <Box sx={{ mb: 2 }}>
                         <Typography sx={{ fontSize: '7.5pt', fontWeight: 'bold', mb: 0.5 }}>B. Requirements</Typography>
                         <Typography sx={{ fontSize: '7.5pt', ml: 2, mb: 0.3 }}>1. Photocopy of member's valid ID with signature</Typography>
                         <Typography sx={{ fontSize: '7.5pt', ml: 2, mb: 0.3 }}>2. stock Certificate (Applicable to members who received a stock certificate)</Typography>
                       </Box>

                     </Grid>

                     {/* Right Column: Accounts Table */}
                     <Grid item xs={6}>
                       <Typography sx={{ fontSize: '7.5pt', fontWeight: 'bold', mb: 0.3 }}>C. Accounts in the cooperative</Typography>
                       <TableContainer component={Box}>
                         <Table size="small" sx={{ border: '1px solid #555', tableLayout: 'fixed', '& td, & th': { p: '2px 4px', border: '1px solid #777' } }}>
                           <TableHead>
                             <TableRow sx={{ bgcolor: '#e6e6e6' }}>
                               <TableCell sx={{ fontWeight: 'bold', fontSize: '7.5pt', textAlign: 'center' }}>BREAKDOWN</TableCell>
                               <TableCell sx={{ fontWeight: 'bold', fontSize: '7.5pt', textAlign: 'center', width: '35%' }}>AMOUNT (PHP)</TableCell>
                             </TableRow>
                           </TableHead>
                           <TableBody>
                             {[
                               ['SHARE CAPITAL', fComm(selectedMember?.shareCapital)],
                               ['PATRONAGE REFUND', fComm(selectedMember?.patronageRefund)],
                               ['SAVINGS WITH INTEREST', fComm(selectedMember?.savingsWithInterest)],
                               ['DIVIDEND', fComm(selectedMember?.dividend)],
                               ['VOLUNTARY SAVINGS', fComm(selectedMember?.voluntarySavings)],
                               ['Rebates Salary Loan (Valid until April. 2026)', fComm(0)],
                               ['RebatesHousing Loan (Valid until March. 2026)', fComm(selectedMember?.rebates || selectedMember?.rebates2 || 25000)],
                             ].map(([label, val], i) => (
                               <TableRow key={i} sx={{ bgcolor: i % 2 === 0 ? '#ffff80' : '#fff' }}>
                                 <TableCell sx={{ fontSize: '7pt', fontWeight: 'bold' }}>{label}</TableCell>
                                 <TableCell sx={{ fontSize: '7.5pt', textAlign: 'center' }}>{val}</TableCell>
                               </TableRow>
                             ))}
                             <TableRow sx={{ bgcolor: '#fff' }}>
                               <TableCell sx={{ fontSize: '7.5pt', fontWeight: '900', color: '#c00' }}>TOTAL</TableCell>
                               <TableCell sx={{ fontSize: '8pt', textAlign: 'center', fontWeight: '900' }}>{fComm(totalAssets)}</TableCell>
                             </TableRow>
                             {[
                               ['LESS: SHORT TERM LOAN', fComm(selectedMember?.stlLoan)],
                               ['LESS: SALARY LOAN BALANCE', fComm(selectedMember?.salaryLoan)],
                               ['LESS: MOTORCYCLE LOAN BALANCE', fComm(selectedMember?.motorcycleLoan)],
                               ['LESS: HOUSING LOAN BALANCE', fComm(selectedMember?.housingLoan)],
                               ['LESS: CAR LOAN BALANCE', fComm(selectedMember?.carLoan)],
                               ['LESS: EDUCATION LOAN BALANCE', fComm(selectedMember?.educationalLoan)],
                               ['LESS: GADGET LOAN BALANCE', fComm(selectedMember?.gadgetLoan)],
                               ['LESS: MALASAKIT LOAN BALANCE', fComm(selectedMember?.malasakitLoan)],
                             ].map(([label, val], i) => (
                               <TableRow key={i} sx={{ bgcolor: '#ffff80' }}>
                                 <TableCell sx={{ fontSize: '7pt', fontStyle: 'italic' }}>{label}</TableCell>
                                 <TableCell sx={{ fontSize: '7.5pt', textAlign: 'center' }}>{val}</TableCell>
                               </TableRow>
                             ))}
                             <TableRow sx={{ bgcolor: '#fff' }}>
                               <TableCell sx={{ fontSize: '8pt', fontWeight: '900', color: '#c00' }}>GRAND TOTAL</TableCell>
                               <TableCell sx={{ fontSize: '8pt', textAlign: 'center', fontWeight: '900' }}>{fComm(netAmountDue)}</TableCell>
                             </TableRow>
                           </TableBody>
                         </Table>
                       </TableContainer>
                     </Grid>
                   </Grid>
                 </Box>

                 <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between', px: 2 }}>
                    <Box sx={{ textAlign: 'center', width: '30%' }}>
                      <Typography sx={{ fontSize: '8pt', minHeight: 15, bgcolor: '#ffff80', fontWeight: 'bold' }}>{selectedMember?.name || ''}</Typography>
                      <Box sx={{ borderTop: '1px solid #000', pt: 0.5 }}>
                        <Typography sx={{ fontSize: '7pt' }}>Signature over Printed Name</Typography>
                      </Box>
                    </Box>
                    <Box sx={{ textAlign: 'center', width: '25%' }}>
                      <Typography sx={{ fontSize: '8pt', minHeight: 15, bgcolor: '#ffff80', fontWeight: 'bold' }}>{selectedMember?.idNo || ''}</Typography>
                      <Box sx={{ borderTop: '1px solid #000', pt: 0.5 }}>
                        <Typography sx={{ fontSize: '7pt' }}>Staff ID No.</Typography>
                      </Box>
                    </Box>
                    <Box sx={{ textAlign: 'center', width: '25%' }}>
                      <Typography sx={{ fontSize: '8pt', minHeight: 15, bgcolor: '#ffff80', fontWeight: 'bold' }}>March 05, 2026</Typography>
                      <Box sx={{ borderTop: '1px solid #000', pt: 0.5 }}>
                        <Typography sx={{ fontSize: '7pt' }}>Date</Typography>
                      </Box>
                    </Box>
                 </Box>

                 <Box sx={{ border: '2px solid #555', mt: 1, mx: 0.5, mb: 0.5 }}>
                   <Box sx={{ bgcolor: '#c9cacb', borderBottom: '1px solid #555', textAlign: 'center', py: 0.2 }}>
                      <Typography sx={{ fontWeight: 800, fontSize: '8pt' }}>THIS PORTION WILL BE FILLED OUT BY APECC SECRETARY / AUTHORIZED PERSON</Typography>
                   </Box>
                   <Table size="small" sx={{ '& td': { p: '4px 8px', border: '1px solid #777' } }}>
                     <TableBody>
                       <TableRow>
                         <TableCell sx={{ fontSize: '7.5pt', width: '30%' }}>Membership Account</TableCell>
                         <TableCell sx={{ width: '30%' }}></TableCell>
                         <TableCell sx={{ width: '40%' }}></TableCell>
                       </TableRow>
                       <TableRow>
                         <TableCell sx={{ fontSize: '7.5pt' }}>Board Resolution No</TableCell>
                         <TableCell></TableCell>
                         <TableCell></TableCell>
                       </TableRow>
                       <TableRow>
                         <TableCell sx={{ fontSize: '7.5pt', textAlign: 'center' }}>Secretary</TableCell>
                         <TableCell colSpan={2} sx={{ fontSize: '7.5pt', textAlign: 'center' }}>signature over printed name</TableCell>
                       </TableRow>
                     </TableBody>
                   </Table>
                 </Box>

              </Box>

            </Box>
         </Card>
      </Paper>
    </Box>
  );
}
