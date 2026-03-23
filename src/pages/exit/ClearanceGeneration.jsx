import React, { useState, useRef } from 'react';
import {
  Box, Card, CardContent, Typography, Grid, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Chip, Button, TextField, InputAdornment,
  Divider, Checkbox,
} from '@mui/material';
import { Print as PrintIcon, CheckCircle as ClearanceIcon, Search as SearchIcon, FileDownload as CsvIcon, PictureAsPdf as PdfIcon } from '@mui/icons-material';
import { exitMembers } from '../../data/mockData';
import { exportToCSV, exportToPDF } from '../../utils/exportUtils';

const goldAccent = '#d4a843';

const clearanceItems = [
  { id: 1, department: 'Credit & Collection', item: 'No outstanding loans', responsible: 'Loan Officer' },
  { id: 2, department: 'Finance', item: 'No pending financial obligations', responsible: 'Accountant' },
  { id: 3, department: 'Membership', item: 'Membership records updated', responsible: 'Membership Officer' },
  { id: 4, department: 'Operations', item: 'Returned cooperative properties', responsible: 'Operations Head' },
  { id: 5, department: 'IT', item: 'System access deactivated', responsible: 'IT Admin' },
  { id: 6, department: 'HR', item: 'Employment clearance signed', responsible: 'HR Officer' },
  { id: 7, department: 'General Manager', item: 'Final approval', responsible: 'General Manager' },
];

export default function ClearanceGeneration() {
  const [search, setSearch] = useState('');
  const [checkedItems, setCheckedItems] = useState({});
  const printRef = useRef();

  const filteredMembers = exitMembers.filter((m) => {
    return `${m.memberName} ${m.memberId}`
      .toLowerCase()
      .includes(search.toLowerCase());
  });

  const member = filteredMembers.length > 0 ? filteredMembers[0] : null;

  const toggleCheck = (id) => {
    setCheckedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const allChecked = clearanceItems.every((item) => checkedItems[item.id]);

  const handlePrint = () => {
    const content = printRef.current;
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html><head><title>Clearance - ${member?.memberName}</title>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; font-family: 'Inter', sans-serif; }
        body { padding: 40px; color: #1a1a2e; }
        .header { text-align: center; margin-bottom: 30px; border-bottom: 3px solid #023DFB; padding-bottom: 15px; }
        .header h1 { color: #023DFB; font-size: 1.4rem; }
        .header p { color: #546e7a; font-size: 0.85rem; }
        .info { margin-bottom: 20px; }
        .info-row { display: flex; margin-bottom: 6px; font-size: 0.85rem; }
        .info-label { width: 150px; font-weight: 600; color: #546e7a; }
        table { width: 100%; border-collapse: collapse; margin-top: 15px; }
        th { background: #023DFB; color: white; padding: 8px 12px; text-align: left; font-size: 0.8rem; }
        td { padding: 8px 12px; border-bottom: 1px solid #eee; font-size: 0.85rem; }
        .signatures { margin-top: 60px; display: flex; justify-content: space-between; }
        .sig-block { text-align: center; width: 200px; }
        .sig-line { border-top: 1px solid #333; margin-top: 40px; padding-top: 8px; font-weight: 600; font-size: 0.85rem; }
        .sig-title { font-size: 0.75rem; color: #546e7a; }
      </style></head><body>${content.innerHTML}</body></html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <Box className="page-container">

      <Grid container spacing={3}>
        {/* Member Selector & Status */}
        <Grid item xs={12} md={4}>
          <Card sx={{
            borderRadius: 3,
            background: 'linear-gradient(160deg, #023DFB 0%, #4a75e6 50%, #89B1D5 100%)',
            boxShadow: '0 8px 32px rgba(13,27,62,0.35)',
          }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{
                fontWeight: 700, fontSize: '1rem', mb: 2.5,
                background: `linear-gradient(135deg, ${goldAccent}, #e8c96a)`,
                backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              }}>
                Select Member
              </Typography>
                <TextField
                  size="small"
                  fullWidth
                  placeholder="Search members by name or ID..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    if (e.target.value === '') setCheckedItems({});
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.2rem' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    mb: 3,
                    bgcolor: 'rgba(255,255,255,0.1)',
                    borderRadius: 1,
                    '& .MuiOutlinedInput-root': {
                      color: '#fff',
                      '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                      '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.5)' },
                      '&.Mui-focused fieldset': { borderColor: '#fff' }
                    },
                    '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' },
                    '& .MuiSvgIcon-root': { color: 'rgba(255,255,255,0.7)' }
                  }}
                />

              {member ? (
                <>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="h6" sx={{ color: '#fff', fontWeight: 700 }}>{member.memberName}</Typography>
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>Exit Member Profile</Typography>
                  </Box>
                  <Divider sx={{ mb: 2, borderColor: 'rgba(255,255,255,0.1)' }} />
                  {[
                    ['Member ID', member.memberId],
                    ['Date of Exit', member.dateExit],
                    ['Reason', member.reason],
                    ['Status', member.status],
                    ['Clearance', member.clearanceStatus],
                  ].map(([label, value]) => (
                    <Box key={label} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.82rem' }}>{label}</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.82rem', color: '#fff' }}>{value}</Typography>
                    </Box>
                  ))}

                  {/* Completion Progress */}
                  <Box sx={{ mt: 3, p: 2, borderRadius: 2, bgcolor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)', fontWeight: 600 }}>
                        CLEARANCE PROGRESS
                      </Typography>
                      <Typography variant="caption" sx={{ fontWeight: 700, color: allChecked ? '#81c784' : goldAccent }}>
                        {Object.values(checkedItems).filter(Boolean).length} / {clearanceItems.length}
                      </Typography>
                    </Box>
                    <Box sx={{
                      height: 8, borderRadius: 4, bgcolor: 'rgba(255,255,255,0.1)',
                      overflow: 'hidden',
                    }}>
                      <Box sx={{
                        height: '100%', borderRadius: 4,
                        width: `${(Object.values(checkedItems).filter(Boolean).length / clearanceItems.length) * 100}%`,
                        background: allChecked
                          ? 'linear-gradient(90deg, #2e7d32, #4caf50)'
                          : `linear-gradient(90deg, #023DFB, ${goldAccent})`,
                        transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                      }} />
                    </Box>
                  </Box>
                </>
              ) : (
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', textAlign: 'center' }}>
                  No members found matching the search criteria.
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>


        {/* Clearance Checklist */}
        <Grid item xs={12} md={8}>
          <Card sx={{
            borderRadius: 3,
            background: 'linear-gradient(160deg, #023DFB 0%, #1a3a6b 60%, #2156a5 100%)',
            boxShadow: '0 8px 32px rgba(13,27,62,0.35)',
          }}>
            <CardContent sx={{ p: 3 }}>
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: { xs: 'column', sm: 'row' }, 
                  justifyContent: 'space-between', 
                  alignItems: { xs: 'flex-start', sm: 'center' }, 
                  gap: 2, 
                  mb: 3 
                }}>
                <Typography variant="h6" sx={{
                    fontWeight: 700, fontSize: '1.1rem',
                    background: `linear-gradient(135deg, ${goldAccent}, #e8c96a)`,
                    backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                  }}>
                    Clearance Checklist
                  </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <Button size="small" variant="outlined" startIcon={<CsvIcon />}
                    onClick={() => exportToCSV(['Department','Clearance Item','Responsible Person','Status'], clearanceItems.map(i => [i.department, i.item, i.responsible, checkedItems[i.id] ? 'Cleared' : 'Pending']), 'clearance_checklist')}
                    sx={{ borderRadius: 2, fontSize: '0.7rem', borderColor: 'rgba(255,255,255,0.25)', color: 'rgba(255,255,255,0.8)' }}>CSV</Button>
                  <Button size="small" variant="outlined" startIcon={<PdfIcon />}
                    onClick={() => exportToPDF('Clearance Checklist', ['Department','Clearance Item','Responsible Person','Status'], clearanceItems.map(i => [i.department, i.item, i.responsible, checkedItems[i.id] ? 'Cleared' : 'Pending']))}
                    sx={{ borderRadius: 2, fontSize: '0.7rem', borderColor: 'rgba(255,255,255,0.25)', color: 'rgba(255,255,255,0.8)' }}>PDF</Button>
                  <Button
                    variant="contained"
                    startIcon={<PrintIcon />}
                    onClick={handlePrint}
                    disabled={!allChecked}
                    sx={{
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 700,
                      px: 3,
                      background: allChecked ? 'linear-gradient(135deg, #023DFB, #1a3a6b)' : 'rgba(255,255,255,0.05)',
                      color: allChecked ? goldAccent : 'rgba(255,255,255,0.3)',
                      border: `1px solid ${allChecked ? 'rgba(212,168,67,0.4)' : 'rgba(255,255,255,0.1)'}`,
                      boxShadow: allChecked ? `0 4px 15px rgba(2, 61, 251, 0.4)` : 'none',
                      '& .MuiButton-startIcon': { color: allChecked ? goldAccent : 'inherit' },
                      '&.Mui-disabled': {
                        background: 'rgba(255,255,255,0.05)',
                        color: 'rgba(255,255,255,0.2)',
                      },
                    }}
                  >
                    Generate &amp; Print Clearance
                  </Button>
                </Box>
              </Box>
              <TableContainer sx={{ overflowX: 'auto', backgroundColor: 'transparent' }}>
                <Table sx={{ minWidth: 700 }}>
                  <TableHead>
                    <TableRow sx={{ '& th': { background: 'rgba(212,168,67,0.18)', color: goldAccent, fontWeight: 700, textTransform: 'uppercase', fontSize: '0.73rem', letterSpacing: '0.04em', borderBottom: `1px solid rgba(212,168,67,0.2)` } }}>
                      <TableCell width={50} align="center">✓</TableCell>
                      <TableCell>Department</TableCell>
                      <TableCell>Clearance Item</TableCell>
                      <TableCell>Responsible Person</TableCell>
                      <TableCell align="center">Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {clearanceItems.map((item) => (
                      <TableRow key={item.id} sx={{ '&:hover': { background: 'rgba(255,255,255,0.04)' }, '& td': { color: 'rgba(255,255,255,0.92)', borderBottom: '1px solid rgba(255,255,255,0.08)', fontSize: '0.82rem' } }}>
                        <TableCell align="center">
                          <Checkbox
                            checked={!!checkedItems[item.id]}
                            onChange={() => toggleCheck(item.id)}
                            size="small"
                            sx={{ color: 'rgba(255,255,255,0.4)', '&.Mui-checked': { color: '#81c784' } }}
                          />
                        </TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>{item.department}</TableCell>
                        <TableCell>{item.item}</TableCell>
                        <TableCell>{item.responsible}</TableCell>
                        <TableCell align="center">
                          <Chip
                            label={checkedItems[item.id] ? 'Cleared' : 'Pending'}
                            size="small"
                            sx={{
                              fontWeight: 600, fontSize: '0.72rem', height: 22,
                              bgcolor: checkedItems[item.id] ? 'rgba(46,125,50,0.3)' : 'rgba(230,81,0,0.25)',
                              color: checkedItems[item.id] ? '#81c784' : '#ffb74d',
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>


          {/* Hidden Printable Content */}
          <Box ref={printRef} sx={{ display: 'none' }}>
            <div className="header">
              <h1>APECC</h1>
              <p>Area Producers' Employees Credit Cooperative</p>
              <p style={{ marginTop: 4 }}>MEMBER EXIT CLEARANCE</p>
            </div>
            {member && (
              <div className="info">
                {[['Member Name', member.memberName], ['Member ID', member.memberId], ['Date of Exit', member.dateExit], ['Reason', member.reason]].map(([l, v]) => (
                  <div className="info-row" key={l}>
                    <span className="info-label">{l}:</span>
                    <span>{v}</span>
                  </div>
                ))}
              </div>
            )}
            <table>
              <thead>
                <tr>
                  <th>Department</th>
                  <th>Clearance Item</th>
                  <th>Responsible</th>
                  <th>Signature</th>
                </tr>
              </thead>
              <tbody>
                {clearanceItems.map((item) => (
                  <tr key={item.id}>
                    <td>{item.department}</td>
                    <td>{item.item}</td>
                    <td>{item.responsible}</td>
                    <td>_______________</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="signatures">
              <div className="sig-block">
                <div className="sig-line">Member</div>
                <div className="sig-title">Signature over Printed Name</div>
              </div>
              <div className="sig-block">
                <div className="sig-line">General Manager</div>
                <div className="sig-title">Approved by</div>
              </div>
            </div>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
