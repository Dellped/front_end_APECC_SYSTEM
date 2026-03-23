import React, { useState, useRef } from 'react';
import {
  Box, Card, CardContent, Typography, Grid, Button, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, TextField, InputAdornment,
  Checkbox, FormControlLabel, Divider, Stack, Paper,
  ToggleButton, ToggleButtonGroup
} from '@mui/material';
import {
  Search as SearchIcon,
  Print as PrintIcon,
  FileDownload as CsvIcon,
  PictureAsPdf as PdfIcon,
} from '@mui/icons-material';
import { exitRecords } from '../../data/mockData';
import { exportToCSV } from '../../utils/exportUtils';
import logo from '../../../assets/images/apecc-favicon.png';

export default function WithdrawalMembership() {
  const [search, setSearch] = useState('');
  const [selectedMember, setSelectedMember] = useState(exitRecords[0]);
  const [viewMode, setViewMode] = useState('clearance'); // 'clearance' or 'withdrawal'
  const printRef = useRef();

  // Helper for safe currency formatting
  const fComm = (val) => {
    const n = parseFloat(val);
    return isNaN(n) ? '0' : n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const handleSearch = () => {
    console.log('Searching for:', search);
    const searchTerm = search.trim().toLowerCase();
    const found = exitRecords.find(r => 
      r.idNo.toLowerCase().includes(searchTerm) || 
      r.name.toLowerCase().includes(searchTerm)
    );
    console.log('Found:', found);
    if (found) {
      setSelectedMember(found);
    } else {
      alert('Member not found');
    }
  };

  const handleDownloadPDF = () => {
    const element = document.getElementById('withdrawal-form-print');
    const docTitle = viewMode === 'clearance' ? 'Membership_Clearance' : 'Withdrawal_Membership';
    const opt = {
      margin: [10, 10],
      filename: `${docTitle}_${selectedMember?.idNo || 'Member'}.pdf`,
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
    const docTitle = viewMode === 'clearance' ? 'Membership Clearance Form' : 'Withdrawal of Membership';
    printWindow.document.write(`
      <html>
        <head>
          <title>${docTitle} - ${selectedMember?.name}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');
            body { font-family: 'Inter', sans-serif; margin: 0; padding: 0; }
            .print-container { width: 210mm; margin: auto; padding: 10mm; box-sizing: border-box; }
            @page { size: A4; margin: 0; }
            * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #000; padding: 4px; font-size: 8pt; }
            .no-border td { border: none; }
            .bg-grey { background-color: #d3d3d3 !important; }
            .bg-yellow { background-color: #ffffcc !important; }
            .text-center { text-align: center; }
            .text-right { text-align: right; }
            .font-bold { font-weight: bold; }
            .section-header { background-color: #404040; color: white; text-align: center; font-weight: bold; padding: 4px; font-size: 10pt; }
            .form-label { font-size: 8pt; font-weight: bold; }
            .form-value { font-size: 8pt; border-bottom: 1px solid #000; display: inline-block; min-width: 100px; padding: 0 4px; }
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
      ['Rebates Housing Loan (Valid until March 2026)', fComm(25000)],
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

  return (
    <Box className="page-container">
      {/* Top Controls */}
      <Card sx={{ mb: 3, borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        <Box sx={{ p: 2, display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flex: 1, minWidth: '400px' }}>
            <ToggleButtonGroup
              value={viewMode}
              exclusive
              onChange={(e, val) => val && setViewMode(val)}
              size="small"
              sx={{ bgcolor: '#f4f4f4' }}
            >
              <ToggleButton value="clearance" sx={{ px: 2, fontWeight: 'bold' }}>Clearance Form</ToggleButton>
              <ToggleButton value="withdrawal" sx={{ px: 2, fontWeight: 'bold' }}>Withdrawal Form</ToggleButton>
            </ToggleButtonGroup>

            <TextField
              size="small"
              sx={{ maxWidth: 250 }}
              placeholder="Search ID No. or Name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              InputProps={{
                startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: '#023DFB' }} /></InputAdornment>,
              }}
            />
            <Button variant="contained" onClick={handleSearch} sx={{ bgcolor: '#023DFB', borderRadius: 2 }}>Search</Button>
          </Box>

          <Stack direction="row" spacing={1}>
            <Button variant="outlined" startIcon={<CsvIcon />} onClick={handleExportCSV} sx={{ borderRadius: 2 }}>CSV</Button>
            <Button variant="outlined" startIcon={<PdfIcon />} onClick={handleDownloadPDF} sx={{ borderRadius: 2 }}>Download PDF</Button>
            <Button variant="outlined" startIcon={<PrintIcon />} onClick={handlePrint} sx={{ borderRadius: 2 }}>Print</Button>
          </Stack>
        </Box>
      </Card>

      {/* Preview Section */}
      <Paper elevation={0} sx={{ p: 4, borderRadius: 4, bgcolor: '#525659', display: 'flex', justifyContent: 'center', overflow: 'auto', minHeight: '1000px' }}>
         <Card sx={{ width: '210mm', minHeight: '297mm', bgcolor: '#fff', p: '10mm', boxShadow: '0 0 20px rgba(0,0,0,0.5)', borderRadius: 0 }}>
            <Box id="withdrawal-form-print" sx={{ bgcolor: '#fff', color: '#000', p: 1, width: '100%', maxWidth: '800px', margin: 'auto' }}>
              {/* Header (Shared) */}
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <img src={logo} alt="Logo" style={{ width: 50, height: 50, marginRight: 10 }} />
                <Box>
                  <Typography sx={{ fontWeight: 800, fontSize: '12pt', color: '#000' }}>ASA PHILIPPINES EMPLOYEES CREDIT COOPERATIVE</Typography>
                  <Typography sx={{ fontSize: '8pt' }}>Ortigas Pasig City, Metro Manila | Contact Number: 09985523801</Typography>
                </Box>
              </Box>

              {viewMode === 'clearance' ? (
                /* SECTION 1: MEMBERSHIP CLEARANCE FORM */
                <Box>
                  <Box sx={{ bgcolor: '#d3d3d3', border: '1px solid #000', py: 0.5, mb: 0.5 }}>
                    <Typography sx={{ fontWeight: 900, textAlign: 'center', fontSize: '11pt' }}>MEMBERSHIP CLEARANCE FORM</Typography>
                  </Box>

                  <TableContainer component={Box} sx={{ mb: 0.5 }}>
                    <Table size="small" sx={{ border: '1px solid #000' }}>
                      <TableBody>
                        <TableRow>
                          <TableCell sx={{ border: '1px solid #000', fontWeight: 'bold', fontSize: '8pt', width: '150px' }}>Name of Member:</TableCell>
                          <TableCell sx={{ border: '1px solid #000', bgcolor: '#ffffcc', fontWeight: 'bold', fontSize: '9pt', color: '#000' }}>{selectedMember?.name || '#N/A'}</TableCell>
                          <TableCell sx={{ border: '1px solid #000', fontWeight: 'bold', fontSize: '8pt', width: '100px' }}>ID No.:</TableCell>
                          <TableCell sx={{ border: '1px solid #000', bgcolor: '#f4f4f4', fontSize: '8pt', width: '120px' }}>{selectedMember?.idNo || ''}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell sx={{ border: '1px solid #000', fontWeight: 'bold', fontSize: '8pt' }}>Date of Exit:</TableCell>
                          <TableCell sx={{ border: '1px solid #000', bgcolor: '#ffffcc', fontSize: '8pt' }}>{selectedMember?.dateExit || ''}</TableCell>
                          <TableCell sx={{ border: '1px solid #000', fontWeight: 'bold', fontSize: '8pt' }}>Position:</TableCell>
                          <TableCell sx={{ border: '1px solid #000', bgcolor: '#ffffcc', fontSize: '8pt' }}>{selectedMember?.designation || '#N/A'}</TableCell>
                          <TableCell sx={{ border: '1px solid #000', fontWeight: 'bold', fontSize: '8pt', width: '80px' }}>Cell #:</TableCell>
                          <TableCell sx={{ border: '1px solid #000', bgcolor: '#ffffcc', fontSize: '8pt', width: '100px' }}></TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>

                  <TableContainer component={Box} sx={{ mb: 0.5 }}>
                    <Table size="small" sx={{ border: '1px solid #000' }}>
                      <TableBody>
                        <TableRow sx={{ bgcolor: '#d3d3d3' }}>
                          <TableCell colSpan={2} sx={{ border: '1px solid #000', fontWeight: 'bold', fontSize: '8pt' }}>I. ASSETS</TableCell>
                          <TableCell sx={{ border: '1px solid #000', fontWeight: 'bold', fontSize: '8pt', textAlign: 'center', width: '150px' }}>AMOUNT</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell colSpan={2} sx={{ border: '1px solid #000', fontWeight: 'bold', fontSize: '8pt' }}>TOTAL ASSETS:</TableCell>
                          <TableCell sx={{ border: '1px solid #000', textAlign: 'center', fontSize: '8pt', fontWeight: 'bold' }}>#N/A</TableCell>
                        </TableRow>
                        <TableRow sx={{ bgcolor: '#d3d3d3' }}>
                          <TableCell colSpan={2} sx={{ border: '1px solid #000', fontWeight: 'bold', fontSize: '8pt' }}>II. LIABILITIES</TableCell>
                          <TableCell sx={{ border: '1px solid #000', fontWeight: 'bold', fontSize: '8pt', textAlign: 'center' }}>AMOUNT</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell colSpan={2} sx={{ border: '1px solid #000', fontWeight: 'bold', fontSize: '8pt' }}>TOTAL LIABILITIES:</TableCell>
                          <TableCell sx={{ border: '1px solid #000', textAlign: 'center', fontSize: '8pt', fontWeight: 'bold' }}>#N/A</TableCell>
                        </TableRow>
                        <TableRow sx={{ bgcolor: '#f4f4f4' }}>
                          <TableCell sx={{ border: '1px solid #000', fontWeight: 'bold', fontSize: '8pt' }}>Net Amounts Due (Total Assets less Total Liabilities):</TableCell>
                          <TableCell sx={{ border: '1px solid #000', fontWeight: 'bold', fontSize: '8pt', textAlign: 'right', width: '100px' }}>Php:</TableCell>
                          <TableCell sx={{ border: '1px solid #000', textAlign: 'center', fontSize: '9pt', fontWeight: '900' }}>#N/A</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>

                  <Typography sx={{ fontSize: '6.5pt', fontStyle: 'italic', mb: 0.5 }}>
                    We certify the correctness of above calculations and acknowledge the net amount due to the abovementioned staff. Therefore, we recommend for his settlement of accounts.
                  </Typography>

                  <Box sx={{ border: '1px solid #000', p: 0.5, mb: 1 }}>
                    <Typography sx={{ fontSize: '7pt', fontWeight: 'bold', mb: 0.5 }}>REMARKS:</Typography>
                    <Grid container spacing={1}>
                      <Grid item xs={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Typography sx={{ fontSize: '7pt', mr: 1 }}>Veriied thru Call:</Typography>
                          <Box sx={{ bgcolor: '#ffffcc', borderBottom: '1px solid #000', flex: 1, height: 15 }}></Box>
                        </Box>
                        <Typography sx={{ fontSize: '6pt', textAlign: 'center', mt: 0.2 }}>Printed Name with ID Number</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Typography sx={{ fontSize: '7pt', mr: 1 }}>Comments thru Call:</Typography>
                          <Box sx={{ bgcolor: '#ffffcc', borderBottom: '1px solid #000', flex: 1, height: 15 }}></Box>
                        </Box>
                      </Grid>
                    </Grid>

                    <Grid container sx={{ mt: 1 }}>
                      <Grid item xs={6}>
                        <Typography sx={{ fontSize: '7pt', fontWeight: 'bold' }}>Prepared /Checked by</Typography>
                        <Box sx={{ mt: 2, textAlign: 'center' }}>
                           <Typography sx={{ fontSize: '8pt', fontWeight: 800, borderBottom: '1px solid #000', display: 'inline-block', px: 2, bgcolor: '#ffffcc' }}>Kyzeel M. Estrella (E-013)</Typography>
                           <Typography sx={{ fontSize: '6pt' }}>Printed Name with ID Number aboved signature</Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography sx={{ fontSize: '7pt', fontWeight: 'bold' }}>Cleared / Approved by</Typography>
                        <Box sx={{ mt: 2, textAlign: 'center' }}>
                           <Typography sx={{ fontSize: '8pt', fontWeight: 800, borderBottom: '1px solid #000', display: 'inline-block', px: 2, bgcolor: '#ffffcc' }}>Ma. Lyn Jee Tupas (E-011-22)</Typography>
                           <Typography sx={{ fontSize: '6pt' }}>Printed Name with ID Number aboved signature</Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </Box>
                </Box>
              ) : (
                /* SECTION 2: WITHDRAWAL OF MEMBERSHIP */
                <Box>
                  <Box sx={{ bgcolor: '#404040', color: '#fff', border: '1px solid #000', py: 0.2, textAlign: 'center', mb: 0.5 }}>
                    <Typography sx={{ fontWeight: 800, fontSize: '10pt' }}>WITHDRAWAL OF MEMBERSHIP</Typography>
                  </Box>

                  <Typography sx={{ fontSize: '7.5pt', mb: 0.5, lineHeight: 1.2 }}>
                    I wish to withdraw my membership with ASA Philippines Employees Credit Cooperative. I am fully aware that by withdrawing my membership from ______________________to _____________________of the current year, I am no longer entitled to dividend/patronage refund.
                  </Typography>

                  <Box sx={{ mb: 1 }}>
                    <Typography sx={{ fontSize: '7.5pt', fontWeight: 'bold' }}>Reason for Withdrawal: _____________________________________________________________________________________</Typography>
                    <Typography sx={{ fontSize: '7.5pt', fontWeight: 'bold' }}>Effectivity Date: ___________________________________________________________________________________________</Typography>
                    <Box sx={{ display: 'flex', gap: 4, mt: 0.5 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box sx={{ width: 10, height: 10, border: '1px solid #000', mr: 1 }}></Box>
                        <Typography sx={{ fontSize: '7.5pt' }}>Active Employee</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box sx={{ width: 10, height: 10, border: '1px solid #000', mr: 1 }}></Box>
                        <Typography sx={{ fontSize: '7.5pt' }}>Resigned / Retired from the company/ Discontinued from service of the company</Typography>
                      </Box>
                    </Box>
                  </Box>

                  <Box sx={{ bgcolor: '#d3d3d3', border: '1px solid #000', py: 0.2, textAlign: 'center', mb: 0.5 }}>
                    <Typography sx={{ fontWeight: 800, fontSize: '8pt' }}>INSTRUCTIONS</Typography>
                  </Box>

                  <Typography sx={{ fontSize: '7pt', fontStyle: 'italic', mb: 0.5 }}>Kindly check your preference.</Typography>
                  <Box sx={{ px: 1, mb: 1 }}>
                    <Typography sx={{ fontSize: '7.5pt', fontWeight: 'bold', mb: 0.3 }}>A. For my Savings, Share capital contribution and dividend and patronage refund</Typography>
                    <Box sx={{ ml: 2, display: 'flex', alignItems: 'center', mb: 0.2 }}>
                      <Box sx={{ width: 10, height: 10, border: '1px solid #000', mr: 1 }}></Box>
                      <Typography sx={{ fontSize: '7.5pt' }}>Please credit my Membership withdrawal proceeds to the settlement of account.</Typography>
                    </Box>
                    <Box sx={{ ml: 2, display: 'flex', alignItems: 'center', mb: 0.2 }}>
                      <Box sx={{ width: 10, height: 10, border: '1px solid #000', mr: 1 }}></Box>
                      <Typography sx={{ fontSize: '7.5pt' }}>Please credit my Membership withdrawal proceeds to my BDO bank account.</Typography>
                    </Box>
                    <Box sx={{ ml: 2 }}>
                      <Typography sx={{ fontSize: '7.5pt' }}>BDO Account no: ________________&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;( &nbsp;&nbsp;&nbsp; )&nbsp;&nbsp;Savings Account &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;( &nbsp;&nbsp;&nbsp; )&nbsp;&nbsp;Credit Account</Typography>
                    </Box>
                  </Box>

                  <Box sx={{ px: 2 }}>
                    <Typography sx={{ fontSize: '7.5pt', fontWeight: 'bold', mb: 0.5 }}>C. Accounts in the cooperative</Typography>
                    <TableContainer component={Box}>
                      <Table size="small" sx={{ border: '1px solid #000', tableLayout: 'fixed' }}>
                        <TableHead>
                          <TableRow sx={{ bgcolor: '#d3d3d3' }}>
                            <TableCell sx={{ border: '1px solid #000', fontWeight: 'bold', fontSize: '8pt', textAlign: 'center' }}>BREAKDOWN</TableCell>
                            <TableCell sx={{ border: '1px solid #000', fontWeight: 'bold', fontSize: '8pt', textAlign: 'center', width: '150px' }}>AMOUNT (PHP)</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {[
                            ['SHARE CAPITAL', fComm(selectedMember?.shareCapital)],
                            ['PATRONAGE REFUND', fComm(selectedMember?.patronageRefund)],
                            ['SAVINGS WITH INTEREST', fComm(selectedMember?.savingsWithInterest)],
                            ['DIVIDEND', fComm(selectedMember?.dividend)],
                            ['VOLUNTARY SAVINGS', fComm(selectedMember?.voluntarySavings)],
                            ['Rebates Salary Loan (Valid until April 2026)', fComm(0)],
                            ['Rebates Housing Loan (Valid until March 2026)', fComm(25000)],
                          ].map(([label, val], i) => (
                            <TableRow key={i} sx={{ bgcolor: i % 2 === 0 ? '#ffffcc' : '#fff' }}>
                              <TableCell sx={{ border: '1px solid #000', fontSize: '8pt', fontWeight: 'bold' }}>{label}</TableCell>
                              <TableCell sx={{ border: '1px solid #000', fontSize: '8pt', textAlign: 'center' }}>{val}</TableCell>
                            </TableRow>
                          ))}
                          <TableRow sx={{ bgcolor: '#fff' }}>
                            <TableCell sx={{ border: '1px solid #000', fontSize: '8pt', fontWeight: '900', color: 'red' }}>TOTAL</TableCell>
                            <TableCell sx={{ border: '1px solid #000', fontSize: '8pt', textAlign: 'center', fontWeight: '900' }}>{fComm(selectedMember?.total)}</TableCell>
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
                            <TableRow key={i} sx={{ bgcolor: '#ffffcc' }}>
                              <TableCell sx={{ border: '1px solid #000', fontSize: '8pt', fontStyle: 'italic' }}>{label}</TableCell>
                              <TableCell sx={{ border: '1px solid #000', fontSize: '8pt', textAlign: 'center' }}>{val}</TableCell>
                            </TableRow>
                          ))}
                          <TableRow sx={{ bgcolor: '#fff' }}>
                            <TableCell sx={{ border: '1px solid #000', fontSize: '9pt', fontWeight: '900', color: 'red' }}>GRAND TOTAL</TableCell>
                            <TableCell sx={{ border: '1px solid #000', fontSize: '9pt', textAlign: 'center', fontWeight: '900' }}>{fComm(selectedMember?.grandTotal)}</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Box>

                  <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', px: 2 }}>
                    <Box sx={{ textAlign: 'center', width: '30%' }}>
                      <Typography sx={{ borderBottom: '1px solid #000', fontSize: '8pt', minHeight: 15, bgcolor: '#ffffcc', fontWeight: 'bold' }}>{selectedMember?.name || '#N/A'}</Typography>
                      <Typography sx={{ fontSize: '7pt' }}>Signature over Printed Name</Typography>
                    </Box>
                    <Box sx={{ textAlign: 'center', width: '20%' }}>
                      <Typography sx={{ borderBottom: '1px solid #000', fontSize: '8pt', minHeight: 15, bgcolor: '#ffffcc', fontWeight: 'bold' }}>{selectedMember?.idNo || ''}</Typography>
                      <Typography sx={{ fontSize: '7pt' }}>Staff ID No.</Typography>
                    </Box>
                    <Box sx={{ textAlign: 'center', width: '25%' }}>
                      <Typography sx={{ borderBottom: '1px solid #000', fontSize: '8pt', minHeight: 15, bgcolor: '#ffffcc', fontWeight: 'bold' }}>March 05, 2026</Typography>
                      <Typography sx={{ fontSize: '7pt' }}>Date</Typography>
                    </Box>
                  </Box>

                  <Box sx={{ border: '1px solid #000', mt: 1 }}>
                    <Box sx={{ bgcolor: '#d3d3d3', borderBottom: '1px solid #000', textAlign: 'center', py: 0.2 }}>
                       <Typography sx={{ fontWeight: 800, fontSize: '8pt' }}>THIS PORTION WILL BE FILLED OUT BY APECC SECRETARY / AUTHORIZED PERSON</Typography>
                    </Box>
                    <Table size="small">
                      <TableBody>
                        <TableRow>
                          <TableCell sx={{ border: '1px solid #000', fontSize: '7.5pt', width: '25%' }}>Membership Account</TableCell>
                          <TableCell sx={{ border: '1px solid #000', width: '25%' }}></TableCell>
                          <TableCell sx={{ border: '1px solid #000', width: '50%' }}></TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell sx={{ border: '1px solid #000', fontSize: '7.5pt' }}>Board Resolution No</TableCell>
                          <TableCell sx={{ border: '1px solid #000' }}></TableCell>
                          <TableCell sx={{ border: '1px solid #000' }}></TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell sx={{ border: '1px solid #000', fontSize: '7.5pt', textAlign: 'center' }}>Secretary</TableCell>
                          <TableCell colSpan={2} sx={{ border: '1px solid #000', fontSize: '7.5pt', textAlign: 'center' }}>signature over printed name</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </Box>
                </Box>
              )}

              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 0.5 }}>
                  <Typography sx={{ fontSize: '6pt' }}>APECCVersion032022M</Typography>
              </Box>
            </Box>
         </Card>
      </Paper>
    </Box>
  );
}
