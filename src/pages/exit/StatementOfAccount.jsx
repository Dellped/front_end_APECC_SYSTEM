import React, { useState, useRef } from 'react';
import {
  Box, Card, CardContent, Typography, Grid, Select, MenuItem,
  FormControl, InputLabel, Divider, Button, Avatar, Table,
  TableBody, TableCell, TableContainer, TableHead, TableRow,
  ToggleButtonGroup, ToggleButton, TextField, InputAdornment, Stack
} from '@mui/material';
import { Print as PrintIcon, Description as SOAIcon, Search as SearchIcon, FileDownload as CsvIcon, PictureAsPdf as PdfIcon } from '@mui/icons-material';
import { exitMembers } from '../../data/mockData';
import { exportToCSV } from '../../utils/exportUtils';

const goldAccent = '#d4a843';
const formatCurrency = (val) => `₱${val.toLocaleString('en-PH', { minimumFractionDigits: 2 })}`;

export default function StatementOfAccount() {
  const [search, setSearch] = useState('');
  const printRef = useRef();

  const filteredMembers = exitMembers.filter((m) => {
    return `${m.memberName} ${m.memberId}`
      .toLowerCase()
      .includes(search.toLowerCase());
  });

  const member = filteredMembers.length > 0 ? filteredMembers[0] : null;


  // Mock employee final settlement details
  const employeeCompensations = [
    { label: 'Basic Pay', amount: 35000.00 },
    { label: 'Deminimis', amount: 2000.00 },
    { label: '13th month pay', amount: 35000.00 },
    { label: 'Retirement (5 yrs and up)', amount: 0 },
    { label: 'Total savings (apecc as member)', amount: 0 },
    { label: 'Rebates on loans', amount: 0 },
  ];

  const employeeDeductions = [
    { label: 'Salary Loan', amount: 0 },
    { label: 'Housing Loan', amount: 0 },
    { label: 'Short Term Loan', amount: 0 },
    { label: 'Malasakit', amount: 0 },
    { label: 'Cash Advance', amount: 0 },
    { label: 'Motorcycle loan', amount: 0 },
    { label: 'Gadget Loan', amount: 0 },
    { label: 'Savings Withdrawal', amount: 0 },
  ];

  const totalCompensations = employeeCompensations.reduce((acc, curr) => acc + (curr.amount || 0), 0);
  const totalDeductions = employeeDeductions.reduce((acc, curr) => acc + (curr.amount || 0), 0);
  const netPayable = totalCompensations - totalDeductions;

  const lineItems = [...employeeCompensations, ...employeeDeductions];
  const totalAmount = netPayable;


  return (
    <Box className="page-container">

      {/* Member selector */}
      <Card sx={{
        borderRadius: 3, mb: 4,
        background: 'linear-gradient(160deg, #05077E 0%, #4470ED 50%, #B4B7D3 100%)',
        boxShadow: '0 8px 32px rgba(13,27,62,0.35)',
      }}>
        <CardContent sx={{ p: 3, display: 'flex', gap: 3, alignItems: 'center', flexWrap: 'wrap' }}>
          <TextField
              size="small"
              placeholder="Search member by name or ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.2rem' }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                minWidth: 320, flex: 1,
                bgcolor: 'rgba(255,255,255,0.1)',
                borderRadius: 1,
                '& .MuiOutlinedInput-root': {
                  color: '#FDFDFC',
                  '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                  '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.5)' },
                  '&.Mui-focused fieldset': { bordercolor: '#FDFDFC' }
                },
                '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' },
                '& .MuiSvgIcon-root': { color: 'rgba(255,255,255,0.7)' }
              }}
            />

          <Button size="small" variant="outlined" startIcon={<CsvIcon />}
            onClick={() => exportToCSV(['#','Description','Amount'], lineItems.map((item, i) => [i+1, item.label, item.amount]), `soa_${member?.memberId || 'export'}`)}
            sx={{
              borderRadius: 2,
              px: 2,
              fontWeight: 600,
              textTransform: 'none',
              borderColor: 'rgba(255,255,255,0.25)',
              color: 'rgba(255,255,255,0.8)',
            }}
          >
            CSV
          </Button>

          <Button
            variant="contained"
            startIcon={<PdfIcon />}
            onClick={() => {
                const element = printRef.current;
                const opt = {
                    margin: 10,
                    filename: `SOA_${member?.memberName || 'Employee'}_${new Date().toISOString().split('T')[0]}.pdf`,
                    image: { type: 'jpeg', quality: 1.0 },
                    html2canvas: { scale: 3, useCORS: true, letterRendering: true, logging: false },
                    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
                };
                
                if (window.html2pdf) {
                    window.html2pdf().from(element).set(opt).save();
                } else {
                    alert("PDF library is still loading. Please try again in a moment.");
                }
            }}
            sx={{
              borderRadius: 2,
              px: 4,
              fontWeight: 600,
              textTransform: 'none',
              background: `linear-gradient(135deg, #d32f2f, #f44336)`,
              color: '#FDFDFC',
              boxShadow: `0 4px 12px rgba(211, 47, 47, 0.3)`,
              '&:hover': {
                background: `linear-gradient(135deg, #f44336, #d32f2f)`,
              }
            }}
          >
            Download PDF
          </Button>

          <Button
            variant="contained"
            startIcon={<PrintIcon />}
            onClick={() => {
                const content = printRef.current;
                const printWindow = window.open('', '_blank');
                const styles = Array.from(document.styleSheets)
                    .map(styleSheet => {
                        try {
                            return Array.from(styleSheet.cssRules)
                                .map(rule => rule.cssText)
                                .join('');
                        } catch (e) {
                            return '';
                        }
                    })
                    .join('\n');

                printWindow.document.write(`
                  <html><head><title>Print Settlement of Account - ${member?.memberName}</title>
                  <style>
                    ${styles}
                    body { background: white !important; padding: 0 !important; margin: 0 !important; color: #333 !important; }
                    .MuiCard-root { box-shadow: none !important; border: none !important; }
                    .no-print { display: none !important; }
                    .soa-print-container { width: 190mm; margin: 0 auto; padding: 10mm; }
                    @page { size: A4; margin: 0; }
                    @media print {
                        body { -webkit-print-color-adjust: exact; }
                        .soa-print-container { width: 210mm; padding: 10mm; margin: 0; }
                    }
                  </style></head><body>
                  <div class="soa-print-container">
                    ${content.innerHTML}
                  </div>
                  <script>
                    window.onload = () => {
                      setTimeout(() => { window.print(); window.close(); }, 500);
                    };
                  </script>
                  </body></html>
                `);
                printWindow.document.close();
            }}
            sx={{
              borderRadius: 2,
              px: 4,
              fontWeight: 600,
              textTransform: 'none',
              background: `linear-gradient(135deg, ${goldAccent}, #e8c96a)`,
              color: '#0a1628',
              boxShadow: `0 4px 12px rgba(212,168,67,0.3)`,
              '&:hover': {
                background: `linear-gradient(135deg, #e8c96a, ${goldAccent})`,
              }
            }}
          >
            Print
          </Button>

        </CardContent>
      </Card>


      {/* SOA Preview */}
      {member ? (
        <Card sx={{ 
          borderRadius: 3, 
          maxWidth: { xs: '100%', md: 850 }, 
          mx: 'auto', 
          bgcolor: '#FDFDFC',
          color: '#333',
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          overflow: 'visible'
        }}>
          <CardContent sx={{ p: 4, color: '#333' }} ref={printRef}>
                <Box>
                    {/* Header */}
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Box 
                            component="img"
                            src="/assets/images/APECC-Logo.jpg"
                            sx={{ width: 60, height: 60, borderRadius: '50%', objectFit: 'cover', mr: 2 }}
                        />
                        <Box>
                            <Typography variant="h6" sx={{ fontWeight: 900, lineHeight: 1.1 }}>ASA PHILIPPINES EMPLOYEES CREDIT COOPERATIVE</Typography>
                            <Typography variant="caption" sx={{ display: 'block', fontWeight: 600, color: 'text.secondary' }}>
                                #3rd floor, 309 Prestige Tower., Ortigas Pasig City, Metro Manila
                            </Typography>
                        </Box>
                    </Box>

                    <Box sx={{ bgcolor: '#fff8e1', border: '1px solid #eee', display: 'flex', justifyContent: 'space-between', p: 1, mb: 2 }}>
                        <Typography variant="h6" sx={{ fontWeight: 800 }}>SETTLEMENT OF ACCOUNT</Typography>
                        <Typography variant="h6" sx={{ fontWeight: 800 }}>SoA-0</Typography>
                    </Box>

                    <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1, textTransform: 'uppercase' }}>EMPLOYEE PAY SUMMARY</Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <Stack spacing={0.5}>
                                    <Box sx={{ display: 'flex' }}><Typography variant="caption" sx={{ width: 150, fontWeight: 700 }}>Employee Name</Typography><Typography variant="caption">: {member.memberName}</Typography></Box>
                                    <Box sx={{ display: 'flex' }}><Typography variant="caption" sx={{ width: 150, fontWeight: 700 }}>Designation</Typography><Typography variant="caption">: {member.designation || 'N/A'}</Typography></Box>
                                    <Box sx={{ display: 'flex' }}><Typography variant="caption" sx={{ width: 150, fontWeight: 700 }}>Employment Date</Typography><Typography variant="caption">: January 0, 1900</Typography></Box>
                                    <Box sx={{ display: 'flex' }}><Typography variant="caption" sx={{ width: 150, fontWeight: 700 }}>Effective Date of Exit</Typography><Typography variant="caption">: {member.dateExit}</Typography></Box>
                                    <Box sx={{ display: 'flex' }}><Typography variant="caption" sx={{ width: 150, fontWeight: 700 }}>Settlement Date</Typography><Typography variant="caption">: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</Typography></Box>
                                </Stack>
                            </Grid>
                            <Grid item xs={6}>
                                <Stack spacing={0.5}>
                                    <Box sx={{ display: 'flex' }}><Typography variant="caption" sx={{ width: 150, fontWeight: 700 }}>Employee No</Typography><Typography variant="caption">: {member.memberId}</Typography></Box>
                                    <Box sx={{ display: 'flex' }}><Typography variant="caption" sx={{ width: 150, fontWeight: 700 }}>Assigned Area</Typography><Typography variant="caption">: -</Typography></Box>
                                    <Box sx={{ display: 'flex' }}><Typography variant="caption" sx={{ width: 150, fontWeight: 700 }}>Releasing Branch</Typography><Typography variant="caption">: -</Typography></Box>
                                    <Box sx={{ display: 'flex' }}><Typography variant="caption" sx={{ width: 150, fontWeight: 700 }}>SOA Number</Typography><Typography variant="caption">: -</Typography></Box>
                                </Stack>
                            </Grid>
                        </Grid>
                    </Box>

                    <Box sx={{ display: 'flex', border: '1px solid #000', mb: 0 }}>
                        <Box sx={{ flex: 1, borderRight: '1px solid #000' }}>
                            <Box sx={{ bgcolor: '#fff8e1', borderBottom: '1px solid #000', display: 'flex', justifyContent: 'space-between', px: 1, py: 0.5 }}>
                                <Typography variant="caption" sx={{ fontWeight: 800 }}>COMPENSATIONS</Typography>
                                <Typography variant="caption" sx={{ fontWeight: 800 }}>AMOUNT</Typography>
                            </Box>
                            <Stack>
                                {employeeCompensations.map((item, index) => (
                                    <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', px: 1, py: 0.2, borderBottom: '1px solid #f0f0f0' }}>
                                        <Typography variant="caption" sx={{ fontSize: '0.7rem' }}>{item.label}</Typography>
                                        <Typography variant="caption" sx={{ fontSize: '0.7rem', fontWeight: 600 }}>{item.amount > 0 ? (item.amount.toLocaleString()) : '-'}</Typography>
                                    </Box>
                                ))}
                                {/* Empty rows for padding if needed to match image */}
                                {[...Array(5)].map((_, i) => (
                                    <Box key={i} sx={{ display: 'flex', justifyContent: 'space-between', px: 1, py: 0.2, height: 16 }}></Box>
                                ))}
                            </Stack>
                            <Box sx={{ bgcolor: '#FDFDFC', borderTop: '1px solid #000', display: 'flex', justifyContent: 'space-between', px: 1, py: 0.5 }}>
                                <Typography variant="caption" sx={{ fontWeight: 800 }}>Total Compensations</Typography>
                                <Typography variant="caption" sx={{ fontWeight: 800 }}>{totalCompensations.toLocaleString(undefined, { minimumFractionDigits: 2 })}</Typography>
                            </Box>
                        </Box>
                        <Box sx={{ flex: 1 }}>
                            <Box sx={{ bgcolor: '#fff8e1', borderBottom: '1px solid #000', display: 'flex', justifyContent: 'space-between', px: 1, py: 0.5 }}>
                                <Typography variant="caption" sx={{ fontWeight: 800 }}>DEDUCTIONS</Typography>
                                <Typography variant="caption" sx={{ fontWeight: 800 }}>AMOUNT</Typography>
                            </Box>
                            <Stack>
                                {employeeDeductions.map((item, index) => (
                                    <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', px: 1, py: 0.2, borderBottom: '1px solid #f0f0f0' }}>
                                        <Typography variant="caption" sx={{ fontSize: '0.7rem' }}>{item.label}</Typography>
                                        <Typography variant="caption" sx={{ fontSize: '0.7rem', fontWeight: 600 }}>{item.amount > 0 ? (item.amount.toLocaleString()) : '-'}</Typography>
                                    </Box>
                                ))}
                                {/* Empty rows for padding if needed to match image */}
                                {[...Array(3)].map((_, i) => (
                                    <Box key={i} sx={{ display: 'flex', justifyContent: 'space-between', px: 1, py: 0.2, height: 16 }}></Box>
                                ))}
                            </Stack>
                            <Box sx={{ borderTop: '1px solid #000', display: 'flex', justifyContent: 'space-between', px: 1, py: 0.5 }}>
                                <Typography variant="caption" sx={{ fontWeight: 800 }}>Total Deductions</Typography>
                                <Typography variant="caption" sx={{ fontWeight: 800 }}>{totalDeductions > 0 ? totalDeductions.toLocaleString(undefined, { minimumFractionDigits: 2 }) : '-'}</Typography>
                            </Box>
                            
                            <Box sx={{ border: '1px solid #000', borderTop: '2px solid #000', borderRight: 'none', borderBottom: 'none' }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', px: 1, py: 0.2, bgcolor: '#fff8e1' }}>
                                    <Typography variant="caption" sx={{ fontWeight: 800 }}>NET PAY</Typography>
                                    <Typography variant="caption" sx={{ fontWeight: 800 }}>AMOUNT</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', px: 1, py: 0.2 }}>
                                    <Typography variant="caption">Total Compensations</Typography>
                                    <Typography variant="caption" sx={{ fontWeight: 600 }}>{totalCompensations.toLocaleString(undefined, { minimumFractionDigits: 2 })}</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', px: 1, py: 0.2 }}>
                                    <Typography variant="caption">Total Deductions</Typography>
                                    <Typography variant="caption" sx={{ fontWeight: 600 }}>{totalDeductions.toLocaleString(undefined, { minimumFractionDigits: 2 })}</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', px: 1, py: 0.1, borderTop: '1px solid #000', bgcolor: '#fff8e1' }}>
                                    <Typography variant="caption" sx={{ fontWeight: 800 }}>Total Net Payable</Typography>
                                    <Typography variant="caption" sx={{ fontWeight: 900 }}>{netPayable.toLocaleString(undefined, { minimumFractionDigits: 2 })}</Typography>
                                </Box>
                            </Box>
                        </Box>
                    </Box>

                    <Box sx={{ mt: 1, textAlign: 'center', borderTop: '1px solid #000', borderBottom: '1px solid #000', py: 0.5 }}>
                        <Typography variant="body2" sx={{ fontWeight: 900, fontSize: '0.8rem' }}>Total Net Payable: {formatCurrency(netPayable)} | Seventy Two Thousand Only</Typography>
                        <Typography variant="caption" sx={{ display: 'block', mt: 0.2 }}>**Total Net Payable = ((Gross Earning - Total Deduction) + Reimbursement)</Typography>
                    </Box>

                    <Box sx={{ mt: 1 }}>
                        <Typography variant="caption" sx={{ fontWeight: 800 }}>Note:</Typography>
                        <Grid container sx={{ mt: 2 }}>
                            <Grid item xs={6}>
                                <Box sx={{ mb: 2 }}>
                                    <Typography variant="caption" sx={{ display: 'block' }}><strong>Prepared By</strong> : -----</Typography>
                                    <Typography variant="caption" sx={{ display: 'block', ml: 12 }}>HR Officer</Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={6}>
                                <Box sx={{ mb: 2 }}>
                                    <Typography variant="caption" sx={{ display: 'block' }}><strong>Reviewed By</strong> : -----</Typography>
                                    <Typography variant="caption" sx={{ display: 'block', ml: 12 }}>Finance Head</Typography>
                                </Box>
                                <Box>
                                    <Typography variant="caption" sx={{ display: 'block' }}><strong>Approved By</strong> : -----</Typography>
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>

                    <Box sx={{ mt: 1, pt: 0.5, borderTop: '1px solid #000' }}>
                        <Typography variant="caption" sx={{ fontWeight: 800, display: 'block', fontSize: '0.7rem' }}>Declaration By the Receiver</Typography>
                        <Typography variant="caption" sx={{ display: 'block', mt: 0.5, lineHeight: 1.2, fontSize: '0.65rem' }}>
                            I, the undersigned, hereby acknowledge receipt of the stated amount as my full and final settlement upon my voluntary resignation. I confirm that I hold no grievances, disputes, demands, or claims regarding salary, benefits, reinstatement, or reemployment against ASA Philippines Employees Credit Cooperative
                        </Typography>
                    </Box>

                    <Box sx={{ mt: 3, textAlign: 'center' }}>
                        <Box sx={{ borderBottom: '1px solid #000', width: 250, mx: 'auto', mb: 0.5 }}></Box>
                        <Typography variant="caption" sx={{ fontWeight: 800 }}>Employee's Signature</Typography>
                    </Box>
                </Box>
            </CardContent>
        </Card>

      ) : (
        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', textAlign: 'center', mt: 4 }}>
          No members found matching the search criteria.
        </Typography>
      )}
    </Box>
  );
}

