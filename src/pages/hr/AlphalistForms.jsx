import React, { useState, useMemo } from "react";
import {
  Box,
  Card,
  CardContent,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Typography,
  Paper,
  Button,
  TextField,
  InputAdornment,
  Grid
} from "@mui/material";
import {
  Search as SearchIcon,
  FileDownload as DownloadIcon
} from "@mui/icons-material";

// Import mock data to represent employees array
import { employees, payrollRecords } from '../../data/mockData';

const goldAccent = '#d4a843';

export default function AlphalistForms() {
  const [tab, setTab] = useState("ALL");
  const [search, setSearch] = useState("");

  const handleChange = (_, newValue) => {
    setTab(newValue);
  };

  // Compute alphalist metrics for employees using mock payroll data
  const baseEmployees = useMemo(() => {
    return employees.filter(e => e.status === 'Active').map(emp => {
      // Find 2024 payroll records for this employee
      const records = payrollRecords.filter((r) => r.employeeId === emp.id && r.year === 2024);
      
      const totalGross = records.reduce((s, r) => s + (r.basicPay || 0) + (r.overtimePay || 0) + (r.allowances || 0), 0);
      const totalSSS = records.reduce((s, r) => s + (r.sssEE || 0), 0);
      const totalPhilHealth = records.reduce((s, r) => s + (r.phEE || 0), 0);
      const totalPagIbig = records.reduce((s, r) => s + (r.hdmfEE || 0), 0);
      const withholdingTax = records.reduce((s, r) => s + (r.tax || 0), 0);
      const deminimis = records.reduce((s, r) => s + (r.deminimis || 0), 0);

      // Simple mock approximation for tax categories
      const nonTaxableIncome = totalSSS + totalPhilHealth + totalPagIbig + deminimis; 
      const taxableIncome = totalGross > nonTaxableIncome ? totalGross - nonTaxableIncome : 0;
      
      // Simulate MWE based on basic salary (<= 16k a month approx)
      const isMWE = emp.payrollProfile?.basicSalary <= 16000;

      return {
        ...emp,
        tin: emp.requirements?.tinNo || "000-000-000-000",
        taxableIncome: isMWE ? 0 : taxableIncome,
        nonTaxableIncome: isMWE ? totalGross : nonTaxableIncome,
        withholdingTax: isMWE ? 0 : withholdingTax,
        isMWE
      };
    });
  }, []);

  // Filter by Search Bar (Name or ID)
  const searchedEmployees = baseEmployees.filter((emp) => {
    const query = search.toLowerCase();
    const fullName = `${emp.firstName} ${emp.lastName}`.toLowerCase();
    return fullName.includes(query) || emp.id.toLowerCase().includes(query) || emp.tin.includes(query);
  });

  // Filter based on Tabs
  const filteredEmployees = searchedEmployees.filter((emp) => {
    if (tab === "TAXABLE") return !emp.isMWE && emp.taxableIncome > 0;
    if (tab === "NON_TAXABLE") return !emp.isMWE && emp.withholdingTax === 0 && emp.taxableIncome === 0;
    if (tab === "MWE") return emp.isMWE;
    return true; // "ALL"
  });

  // Summary Metrics (based on base employees so they don't change on search, only represent true DB state)
  const totalEmployees = baseEmployees.length;
  const taxableCount = baseEmployees.filter(e => !e.isMWE && e.taxableIncome > 0).length;
  const nonTaxableCount = baseEmployees.filter(e => !e.isMWE && e.withholdingTax === 0 && e.taxableIncome === 0).length;
  const mweCount = baseEmployees.filter(e => e.isMWE).length;

  const getTypeChip = (emp) => {
    if (emp.isMWE) return <Chip label="MWE" color="warning" size="small" sx={{ fontWeight: 600 }} />;
    if (emp.taxableIncome > 0 && emp.nonTaxableIncome > 0)
      return <Chip label="Mixed" color="info" size="small" sx={{ fontWeight: 600 }} />;
    if (emp.taxableIncome > 0)
      return <Chip label="Taxable" color="primary" size="small" sx={{ fontWeight: 600 }} />;
    return <Chip label="Non-Taxable" color="success" size="small" sx={{ fontWeight: 600 }} />;
  };

  const handleGenerateDAT = () => {
    alert("BIR DAT File generated successfully.");
  };

  return (
    <Box className="page-container" sx={{ p: 3 }}>
      <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.05)', border: `1px solid ${goldAccent}` }}>
        <CardContent sx={{ p: 3 }}>
          
          {/* Header & Export Button */}
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3} flexWrap="wrap" gap={2}>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 800, color: '#05077E' }}>
                Alphalist of Employees
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Generate and Export BIR-compliant reports for fiscal year {new Date().getFullYear()}
              </Typography>
            </Box>
            <Button 
              variant="contained" 
              startIcon={<DownloadIcon />} 
              onClick={handleGenerateDAT}
              sx={{ background: 'linear-gradient(135deg, #05077E 0%, #0241FB 100%)', color: '#fff', fontWeight: 700 }}
            >
              Generate BIR DAT File
            </Button>
          </Box>

          {/* Summary Header */}
          <Grid container spacing={2} sx={{ mb: 4 }}>
            {[
              { label: "Total Employees", value: totalEmployees, color: "#05077E", bg: "rgba(5,7,126,0.05)" },
              { label: "Taxable", value: taxableCount, color: "#1976d2", bg: "rgba(25,118,210,0.05)" },
              { label: "Non-Taxable", value: nonTaxableCount, color: "#2e7d32", bg: "rgba(46,125,50,0.05)" },
              { label: "MWE", value: mweCount, color: "#ed6c02", bg: "rgba(237,108,2,0.05)" },
            ].map((stat, idx) => (
              <Grid item xs={6} sm={3} key={idx}>
                <Paper elevation={0} sx={{ p: 2, borderRadius: 2, backgroundColor: stat.bg, border: `1px solid ${stat.bg.replace('0.05', '0.15')}` }}>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase' }}>
                    {stat.label}
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 800, color: stat.color, mt: 0.5 }}>
                    {stat.value}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>

          {/* Search and Tabs */}
          <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2} mb={2}>
            <Tabs
              value={tab}
              onChange={handleChange}
              sx={{
                '& .MuiTabs-indicator': { backgroundColor: '#d4a843' },
                '& .MuiTab-root': { fontWeight: 600, color: 'text.secondary' },
                '& .Mui-selected': { color: '#d4a843 !important' }
              }}
            >
              <Tab label="All Employees" value="ALL" />
              <Tab label="Taxable" value="TAXABLE" />
              <Tab label="Non-Taxable" value="NON_TAXABLE" />
              <Tab label="MWE" value="MWE" />
            </Tabs>
            
            <TextField
              size="small"
              placeholder="Filter by name / employee ID"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{ minWidth: 280 }}
            />
          </Box>

          {/* Table */}
          <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 2, border: '1px solid #eee' , borderTop: `3px solid ${goldAccent}`}}>
            <Table size="small">
              <TableHead sx={{ backgroundColor: "#f8f9fa" }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700, color: '#05077E' }}>Employee ID</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: '#05077E' }}>TIN</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: '#05077E' }}>Employee Name</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: '#05077E' }}>Non-Taxable</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: '#05077E' }}>Taxable</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: '#05077E' }}>Withholding Tax</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: '#05077E' }}>Type</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {filteredEmployees.length === 0 ? (
                  <TableRow>
                     <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                       <Typography variant="body2" color="text.secondary">No employees matched your criteria.</Typography>
                     </TableCell>
                  </TableRow>
                ) : (
                  filteredEmployees.map((emp) => (
                    <TableRow key={emp.id} hover>
                      <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>{emp.id}</TableCell>
                      <TableCell sx={{ color: 'text.secondary', fontSize: '0.85rem' }}>{emp.tin}</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>
                        {emp.lastName}, {emp.firstName}
                      </TableCell>
                      <TableCell>
                        {emp.nonTaxableIncome?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell>
                        {emp.taxableIncome?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell sx={{ color: emp.withholdingTax > 0 ? '#d32f2f' : 'inherit', fontWeight: emp.withholdingTax > 0 ? 600 : 400 }}>
                        {emp.withholdingTax?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell>{getTypeChip(emp)}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

        </CardContent>
      </Card>
    </Box>
  );
}
