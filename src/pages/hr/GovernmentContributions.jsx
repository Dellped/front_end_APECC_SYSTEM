import React, { useState } from 'react';
import {
  Box, Card, CardContent, Typography, Grid, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Tabs, Tab,
  Paper, Button, IconButton, TextField, InputAdornment, Chip, Stack
} from '@mui/material';
import {
  AccountBalance as GovIcon,
  Edit as EditIcon,
  CloudDownload as DownloadIcon,
  Update as UpdateIcon,
  Info as InfoIcon,
  FileDownload as CsvIcon,
  PictureAsPdf as PdfIcon,
  Print as PrintIcon,
  Save as SaveIcon,
  Close as CancelIcon,
} from '@mui/icons-material';
import { exportToCSV, printTable, exportToPDF } from '../../utils/exportUtils';

const goldAccent = '#d4a843';

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

export default function GovernmentContributions() {
  const [tab, setTab] = useState(0);

  // --- SSS State ---
  const [sssData, setSssData] = useState([
    { range: '₱3,000 - ₱3,249.99', erShare: 310.00, eeShare: 140.00, total: 450.00 },
    { range: '₱3,250 - ₱3,749.99', erShare: 355.00, eeShare: 162.50, total: 517.50 },
    { range: '₱3,750 - ₱4,249.99', erShare: 402.50, eeShare: 185.00, total: 587.50 },
    { range: '₱4,250 - ₱4,749.99', erShare: 450.00, eeShare: 207.50, total: 657.50 },
    { range: '₱29,750 - Over', erShare: 3220.00, eeShare: 1350.00, total: 4570.00 },
  ]);
  const [isEditingSSS, setIsEditingSSS] = useState(false);

  // --- PhilHealth State ---
  const [phData, setPhData] = useState([
    { range: '₱10,000.00 and below', rate: '5.00%', amount: '₱500.00', sharing: '50% ER / 50% EE' },
    { range: '₱10,000.01 - ₱99,999.99', rate: '5.00%', amount: 'Computed', sharing: '50% ER / 50% EE' },
    { range: '₱100,000.00 and above', rate: '5.00%', amount: '₱5,000.00', sharing: '50% ER / 50% EE' },
  ]);
  const [isEditingPH, setIsEditingPH] = useState(false);

  // --- Pag-IBIG State ---
  const [pagIbigData, setPagIbigData] = useState([
    { type: 'Formal Economy', ee: '2% (Max ₱200)', er: '2% (Max ₱200)', total: '₱400.00' },
    { type: 'Voluntary Payers', ee: '₱400.00', er: 'N/A', total: '₱400.00' },
  ]);
  const [isEditingPagIbig, setIsEditingPagIbig] = useState(false);

  // --- Tax Brackets State ---
  const [taxData, setTaxData] = useState([
    { range: '₱250,000 and below', monthly: '₱20,833.33 and below', computation: '0% Tax' },
    { range: 'Over ₱250,000 — ₱400,000', monthly: 'Over ₱20,833 — ₱33,333', computation: '15% of the excess over ₱250k' },
    { range: 'Over ₱400,000 — ₱800,000', monthly: 'Over ₱33,333 — ₱66,666', computation: '₱22,500 + 20% of the excess over ₱400k' },
    { range: 'Over ₱800,000 — ₱2,000,000', monthly: 'Over ₱66,666 — ₱166,666', computation: '₱102,500 + 25% of the excess over ₱800k' },
    { range: 'Over ₱2,000,000 — ₱8,000,000', monthly: 'Over ₱166,666 — ₱666,666', computation: '₱402,500 + 30% of the excess over ₱2M' },
    { range: 'Over ₱8,000,000', monthly: 'Over ₱666,666', computation: '₱2,202,500 + 35% of the excess over ₱8M' },
  ]);
  const [isEditingTax, setIsEditingTax] = useState(false);

  // Handle SSS Change
  const handleSssChange = (index, field, value) => {
    const newData = [...sssData];
    newData[index][field] = field === 'range' ? value : parseFloat(value) || 0;
    if (field === 'erShare' || field === 'eeShare') {
      newData[index].total = newData[index].erShare + newData[index].eeShare;
    }
    setSssData(newData);
  };

  const handleTaxChange = (index, field, value) => {
    const newData = [...taxData];
    newData[index][field] = value;
    setTaxData(newData);
  };

  const handlePhChange = (index, field, value) => {
    const newData = [...phData];
    newData[index][field] = value;
    setPhData(newData);
  };

  const handlePagIbigChange = (index, field, value) => {
    const newData = [...pagIbigData];
    newData[index][field] = value;
    setPagIbigData(newData);
  };

  return (
    <Box className="page-container">
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" sx={{ 
            fontWeight: 800, color: '#0241FB', 
            background: 'linear-gradient(90deg, #0241FB, #4470ED)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            mb: 0.5 
          }}>
            Government Contribution Tables
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
            Configurable contribution brackets for SSS, PhilHealth, and Pag-IBIG
          </Typography>
        </Box>
        <Button 
          variant="outlined" 
          startIcon={<UpdateIcon />}
          sx={{ borderRadius: 2, border: '2px solid' }}
        >
          Check for Table Updates
        </Button>
      </Box>

      <Card sx={{ borderRadius: 4, overflow: 'hidden', boxShadow: '0 12px 32px rgba(0,0,0,0.05)', borderTop: `3px solid ${goldAccent}` }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'rgba(2, 61, 251, 0.02)' }}>
          <Tabs 
            value={tab} 
            onChange={(e, v) => setTab(v)}
            sx={{
              '& .MuiTabs-indicator': { height: 4, borderRadius: '4px 4px 0 0', bgcolor: goldAccent },
              '& .MuiTab-root': { fontWeight: 700, fontSize: '0.85rem', py: 2.5 }
            }}
          >
            <Tab label="SSS Table" />
            <Tab label="PhilHealth Table" />
            <Tab label="Pag-IBIG Table" />
            <Tab label="Tax Brackets (BIR)" />
          </Tabs>
        </Box>
        <CardContent sx={{ p: 4 }}>
          
          <TabPanel value={tab} index={0}>
            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>SSS Contribution Schedule (2025)</Typography>
              <Stack direction="row" spacing={1}>
                <Button 
                  variant={isEditingSSS ? "contained" : "outlined"} 
                  color={isEditingSSS ? "success" : "primary"}
                  startIcon={isEditingSSS ? <SaveIcon /> : <EditIcon />} 
                  onClick={() => setIsEditingSSS(!isEditingSSS)}
                  size="small"
                >
                  {isEditingSSS ? "Save Changes" : "Edit Table"}
                </Button>
                {!isEditingSSS && (
                  <>
                    <Button size="small" startIcon={<CsvIcon />} onClick={() => exportToCSV(['Range of Compensation','Employer (ER)','Employee (EE)','Total Contribution'], sssData.map(r => [r.range, r.erShare, r.eeShare, r.total]), 'sss_table')}>CSV</Button>
                    <Button size="small" startIcon={<PdfIcon />} onClick={() => exportToPDF('SSS Contribution Schedule (2025)', ['Range of Compensation','Employer (ER)','Employee (EE)','Total Contribution'], sssData.map(r => [r.range, r.erShare, r.eeShare, r.total]))}>PDF</Button>
                    <Button size="small" startIcon={<PrintIcon />} onClick={() => printTable('SSS Contribution Schedule (2025)', ['Range of Compensation','Employer (ER)','Employee (EE)','Total Contribution'], sssData.map(r => [r.range, r.erShare, r.eeShare, r.total]))}>Print</Button>
                  </>
                )}
              </Stack>
            </Box>
            <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
              <Table size={isEditingSSS ? "medium" : "small"}>
                <TableHead sx={{ bgcolor: 'rgba(0,0,0,0.02)' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 800 }}>Range of Compensation</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 800 }}>Employer (ER)</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 800 }}>Employee (EE)</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 800 }}>Total Contribution</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sssData.map((row, i) => (
                    <TableRow key={i} hover>
                      <TableCell sx={{ fontWeight: 600 }}>
                        {isEditingSSS ? (
                          <TextField 
                            fullWidth 
                            size="small" 
                            value={row.range} 
                            onChange={(e) => handleSssChange(i, 'range', e.target.value)}
                          />
                        ) : row.range}
                      </TableCell>
                      <TableCell align="right">
                        {isEditingSSS ? (
                          <TextField 
                            type="number" 
                            size="small" 
                            value={row.erShare} 
                            onChange={(e) => handleSssChange(i, 'erShare', e.target.value)}
                            InputProps={{ startAdornment: <InputAdornment position="start">₱</InputAdornment> }}
                          />
                        ) : `₱${row.erShare.toLocaleString()}`}
                      </TableCell>
                      <TableCell align="right">
                        {isEditingSSS ? (
                          <TextField 
                            type="number" 
                            size="small" 
                            value={row.eeShare} 
                            onChange={(e) => handleSssChange(i, 'eeShare', e.target.value)}
                            InputProps={{ startAdornment: <InputAdornment position="start">₱</InputAdornment> }}
                          />
                        ) : `₱${row.eeShare.toLocaleString()}`}
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: 700, color: '#0241FB' }}>
                        ₱{row.total.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>

          <TabPanel value={tab} index={1}>
            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>PhilHealth Premium Rate</Typography>
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <Button 
                  variant={isEditingPH ? "contained" : "outlined"} 
                  color={isEditingPH ? "success" : "primary"}
                  startIcon={isEditingPH ? <SaveIcon /> : <EditIcon />} 
                  onClick={() => setIsEditingPH(!isEditingPH)}
                  size="small"
                >
                  {isEditingPH ? "Save Changes" : "Edit Table"}
                </Button>
                {!isEditingPH && (
                  <Stack direction="row" spacing={1}>
                    <Button size="small" startIcon={<CsvIcon />} onClick={() => exportToCSV(['Monthly Salary Range','Premium Rate','Monthly Premium','Sharing Layout'], phData.map(r => [r.range, r.rate, r.amount, r.sharing]), 'philhealth_table')}>CSV</Button>
                    <Button size="small" startIcon={<PdfIcon />} onClick={() => exportToPDF('PhilHealth Premium Rate', ['Monthly Salary Range','Premium Rate','Monthly Premium','Sharing Layout'], phData.map(r => [r.range, r.rate, r.amount, r.sharing]))}>PDF</Button>
                    <Button size="small" startIcon={<PrintIcon />} onClick={() => printTable('PhilHealth Premium Rate', ['Monthly Salary Range','Premium Rate','Monthly Premium','Sharing Layout'], phData.map(r => [r.range, r.rate, r.amount, r.sharing]))}>Print</Button>
                  </Stack>
                )}
              </Box>
            </Box>
            <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
              <Table size={isEditingPH ? "medium" : "small"}>
                <TableHead sx={{ bgcolor: 'rgba(0,0,0,0.02)' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 800 }}>Monthly Salary Range</TableCell>
                    <TableCell sx={{ fontWeight: 800 }}>Premium Rate</TableCell>
                    <TableCell sx={{ fontWeight: 800 }}>Monthly Premium</TableCell>
                    <TableCell sx={{ fontWeight: 800 }}>Sharing Layout</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {phData.map((row, i) => (
                    <TableRow key={i} hover>
                      <TableCell sx={{ fontWeight: 600 }}>
                        {isEditingPH ? (
                          <TextField 
                            fullWidth 
                            size="small" 
                            value={row.range} 
                            onChange={(e) => handlePhChange(i, 'range', e.target.value)}
                          />
                        ) : row.range}
                      </TableCell>
                      <TableCell>
                        {isEditingPH ? (
                          <TextField 
                            fullWidth 
                            size="small" 
                            value={row.rate} 
                            onChange={(e) => handlePhChange(i, 'rate', e.target.value)}
                          />
                        ) : row.rate}
                      </TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>
                        {isEditingPH ? (
                          <TextField 
                            fullWidth 
                            size="small" 
                            value={row.amount} 
                            onChange={(e) => handlePhChange(i, 'amount', e.target.value)}
                          />
                        ) : row.amount}
                      </TableCell>
                      <TableCell>
                        {isEditingPH ? (
                          <TextField 
                            fullWidth 
                            size="small" 
                            value={row.sharing} 
                            onChange={(e) => handlePhChange(i, 'sharing', e.target.value)}
                          />
                        ) : row.sharing}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>

          {/* Other tab panels can be implemented as needed */}
          <TabPanel value={tab} index={2}>
            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>Pag-IBIG (HDMF) Contributions (2026)</Typography>
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <Button 
                  variant={isEditingPagIbig ? "contained" : "outlined"} 
                  color={isEditingPagIbig ? "success" : "primary"}
                  startIcon={isEditingPagIbig ? <SaveIcon /> : <EditIcon />} 
                  onClick={() => setIsEditingPagIbig(!isEditingPagIbig)}
                  size="small"
                >
                  {isEditingPagIbig ? "Save Changes" : "Edit Table"}
                </Button>
                {!isEditingPagIbig && (
                  <Stack direction="row" spacing={1}>
                    <Button size="small" startIcon={<CsvIcon />} onClick={() => exportToCSV(['Membership Type','Employee (EE)','Employer (ER)','Total Monthly'], pagIbigData.map(r => [r.type, r.ee, r.er, r.total]), 'pagibig_table')}>CSV</Button>
                    <Button size="small" startIcon={<PdfIcon />} onClick={() => exportToPDF('Pag-IBIG Contributions (2026)', ['Membership Type','Employee (EE)','Employer (ER)','Total Monthly'], pagIbigData.map(r => [r.type, r.ee, r.er, r.total]))}>PDF</Button>
                    <Button size="small" startIcon={<PrintIcon />} onClick={() => printTable('Pag-IBIG Contributions (2026)', ['Membership Type','Employee (EE)','Employer (ER)','Total Monthly'], pagIbigData.map(r => [r.type, r.ee, r.er, r.total]))}>Print</Button>
                  </Stack>
                )}
              </Box>
            </Box>
            <Typography variant="body2" sx={{ mb: 3, p: 2, bgcolor: 'rgba(0,0,0,0.02)', borderRadius: 2, borderLeft: `4px solid ${goldAccent}` }}>
              Pag-IBIG contributions remain <strong>2%</strong> of your monthly salary, with the employer matching your contribution. 
              The maximum contribution is <strong>₱200 each</strong> for employer and employee (based on the ₱10,000 cap).
            </Typography>
            <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
              <Table size={isEditingPagIbig ? "medium" : "small"}>
                <TableHead sx={{ bgcolor: 'rgba(0,0,0,0.02)' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 800 }}>Membership Type</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 800 }}>Employee (EE)</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 800 }}>Employer (ER)</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 800 }}>Total Monthly</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {pagIbigData.map((row, i) => (
                    <TableRow key={i} hover>
                      <TableCell sx={{ fontWeight: 600 }}>
                        {isEditingPagIbig ? (
                          <TextField fullWidth size="small" value={row.type} onChange={(e) => handlePagIbigChange(i, 'type', e.target.value)} />
                        ) : row.type}
                      </TableCell>
                      <TableCell align="right">
                        {isEditingPagIbig ? (
                          <TextField fullWidth size="small" value={row.ee} onChange={(e) => handlePagIbigChange(i, 'ee', e.target.value)} />
                        ) : row.ee}
                      </TableCell>
                      <TableCell align="right">
                        {isEditingPagIbig ? (
                          <TextField fullWidth size="small" value={row.er} onChange={(e) => handlePagIbigChange(i, 'er', e.target.value)} />
                        ) : row.er}
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: 700, color: '#0241FB' }}>
                        {isEditingPagIbig ? (
                          <TextField fullWidth size="small" value={row.total} onChange={(e) => handlePagIbigChange(i, 'total', e.target.value)} />
                        ) : row.total}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>

          <TabPanel value={tab} index={3}>
            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>BIR Income Tax Brackets (TRAIN Law 2026)</Typography>
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <Button 
                  variant={isEditingTax ? "contained" : "outlined"} 
                  color={isEditingTax ? "success" : "primary"}
                  startIcon={isEditingTax ? <SaveIcon /> : <EditIcon />} 
                  onClick={() => setIsEditingTax(!isEditingTax)}
                  size="small"
                >
                  {isEditingTax ? "Save Changes" : "Edit Table"}
                </Button>
                {!isEditingTax && (
                  <Stack direction="row" spacing={1}>
                    <Button size="small" startIcon={<CsvIcon />} onClick={() => exportToCSV(['Annual Taxable Income Range','Monthly Equivalent','Tax Rate / Computation'], taxData.map(r => [r.range, r.monthly, r.computation]), 'bir_tax_brackets')}>CSV</Button>
                    <Button size="small" startIcon={<PdfIcon />} onClick={() => exportToPDF('BIR Income Tax Brackets (TRAIN Law 2026)', ['Annual Taxable Income Range','Monthly Equivalent','Tax Rate / Computation'], taxData.map(r => [r.range, r.monthly, r.computation]))}>PDF</Button>
                    <Button size="small" startIcon={<PrintIcon />} onClick={() => printTable('BIR Income Tax Brackets (TRAIN Law 2026)', ['Annual Taxable Income Range','Monthly Equivalent','Tax Rate / Computation'], taxData.map(r => [r.range, r.monthly, r.computation]))}>Print</Button>
                  </Stack>
                )}
              </Box>
            </Box>
            <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
              <Table size={isEditingTax ? "medium" : "small"}>
                <TableHead sx={{ bgcolor: 'rgba(0,0,0,0.02)' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 800 }}>Annual Taxable Income Range</TableCell>
                    <TableCell sx={{ fontWeight: 800 }}>Monthly Equivalent</TableCell>
                    <TableCell sx={{ fontWeight: 800 }}>Tax Rate / Computation</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {taxData.map((row, i) => (
                    <TableRow key={i} hover>
                      <TableCell sx={{ fontWeight: 600 }}>
                        {isEditingTax ? (
                          <TextField fullWidth size="small" value={row.range} onChange={(e) => handleTaxChange(i, 'range', e.target.value)} />
                        ) : row.range}
                      </TableCell>
                      <TableCell>
                        {isEditingTax ? (
                          <TextField fullWidth size="small" value={row.monthly} onChange={(e) => handleTaxChange(i, 'monthly', e.target.value)} />
                        ) : row.monthly}
                      </TableCell>
                      <TableCell sx={{ color: row.computation === '0% Tax' ? '#2e7d32' : 'inherit', fontWeight: row.computation === '0% Tax' ? 700 : 400 }}>
                        {isEditingTax ? (
                          <TextField fullWidth size="small" value={row.computation} onChange={(e) => handleTaxChange(i, 'computation', e.target.value)} />
                        ) : row.computation}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Typography variant="caption" sx={{ mt: 2, display: 'block', color: 'text.secondary', fontStyle: 'italic' }}>
              * Based on the Tax Reform for Acceleration and Inclusion (TRAIN) Law effective 2023-2026.
            </Typography>
          </TabPanel>

        </CardContent>
      </Card>

      <Grid container spacing={3} sx={{ mt: 1 }}>
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 4, height: '100%', border: '1px solid rgba(0,0,0,0.05)' }}>
            <CardContent>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>Employer Share Summary</Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" color="text.secondary">Estimated Monthly SSS ER</Typography>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>₱12,450.00</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" color="text.secondary">Estimated Monthly PH ER</Typography>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>₱8,200.00</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', pt: 1, borderTop: '1px dashed #ccc' }}>
                <Typography variant="body1" sx={{ fontWeight: 800 }}>Total Employer Liability</Typography>
                <Typography variant="body1" sx={{ fontWeight: 800, color: '#0241FB' }}>₱20,650.00</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
