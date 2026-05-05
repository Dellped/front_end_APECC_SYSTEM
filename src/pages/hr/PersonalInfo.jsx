import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Box, Card, CardContent, Typography, Grid, TextField, MenuItem,
  Button, Divider, Chip, Avatar, Autocomplete, Checkbox, FormControlLabel,
  InputAdornment, Paper, List, ListItemButton, ListItemText,
  Dialog
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
const goldAccent = '#d4a843';
import { 
  Save as SaveIcon, 
  CloudUpload as UploadIcon, 
  Search as SearchIcon,
  CheckCircle as ApproveIcon 
} from '@mui/icons-material';
import { employees, onboardingRecords } from '../../data/mockData';

const addressHierarchy = {
  // Dagupan
  'Tapuac': { municipality: 'Dagupan', province: 'Pangasinan', zip: '2400' },
  'Pogo Chico': { municipality: 'Dagupan', province: 'Pangasinan', zip: '2400' },
  'Lucao': { municipality: 'Dagupan', province: 'Pangasinan', zip: '2400' },
  'Pantal': { municipality: 'Dagupan', province: 'Pangasinan', zip: '2400' },
  // Calasiao
  'Bued': { municipality: 'Calasiao', province: 'Pangasinan', zip: '2418' },
  'San Miguel': { municipality: 'Calasiao', province: 'Pangasinan', zip: '2418' },
  'Nalsian': { municipality: 'Calasiao', province: 'Pangasinan', zip: '2418' },
  // Lingayen
  'Poblacion': { municipality: 'Lingayen', province: 'Pangasinan', zip: '2401' },
  'Maniboc': { municipality: 'Lingayen', province: 'Pangasinan', zip: '2401' },
  // Mangaldan
  'Bari': { municipality: 'Mangaldan', province: 'Pangasinan', zip: '2432' },
  'Salay': { municipality: 'Mangaldan', province: 'Pangasinan', zip: '2432' }
};

const barangays = Object.keys(addressHierarchy).sort();

export default function PersonalInfo() {
  const navigate = useNavigate();
  const [selectedEmp, setSelectedEmp] = useState(0);
  const [personalData, setPersonalData] = useState(employees[0].personal);
  const [extractedIds, setExtractedIds] = useState({});
  const [resignationOpen, setResignationOpen] = useState(false);
  const [resignationData, setResignationData] = useState({ date: '', reason: '', remarks: '' });
  const [successModal, setSuccessModal] = useState(false);

  // Unified employee search
  const [empSearchQuery, setEmpSearchQuery] = useState('');
  const [showEmpDropdown, setShowEmpDropdown] = useState(false);
  const empSearchRef = useRef(null);

  const filteredEmpOptions = useMemo(() => {
    const q = empSearchQuery.trim().toLowerCase();
    if (!q) return [];
    return employees.filter(emp => {
      const fullName = `${emp.firstName} ${emp.lastName}`.toLowerCase();
      const empId = String(emp.id).toLowerCase();
      return empId.includes(q) || fullName.includes(q);
    }).slice(0, 8);
  }, [empSearchQuery]);

  useEffect(() => {
    const handleClick = (e) => {
      if (empSearchRef.current && !empSearchRef.current.contains(e.target)) {
        setShowEmpDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  useEffect(() => {
    setPersonalData(employees[selectedEmp].personal);
    setExtractedIds({}); // Reset extracted IDs when changing employee
  }, [selectedEmp]);

  const handleUpload = (key) => {
    // Simulate automatic "extraction" from the document
    const empRequirements = employees[selectedEmp].requirements;
    const idMap = {
      tinId: empRequirements.tinNo,
      sss: empRequirements.sssNo,
      philhealth: empRequirements.philhealthNo,
      hdmf: empRequirements.hdmfNo,
      nbi: empRequirements.nbiNo,
    };
    
    setExtractedIds(prev => ({
      ...prev,
      [key]: idMap[key]
    }));
  };

  const handleSubmitResignation = () => {
    const today = new Date().toISOString().split('T')[0];
    const newId = `RES-${String(onboardingRecords.length + 1).padStart(3, '0')}`;
    const emp = employees[selectedEmp];
    
    onboardingRecords.push({
      id: newId,
      type: 'Resignation',
      submittedDate: today,
      submittedBy: 'System',
      status: 'Pending HR Officer',
      employeeData: {
        ...emp,
        resignationDetails: resignationData
      },
      approvalChain: [
        { role: 'Employee Action', name: `${emp.firstName} ${emp.lastName}`, status: 'Submitted', date: today, remarks: resignationData.remarks },
        { role: 'HR Officer', name: '', status: 'Pending', date: '', remarks: '' },
        { role: 'Unit Manager', name: '', status: 'Pending', date: '', remarks: '' },
        { role: 'Asst. General Manager', name: '', status: 'Pending', date: '', remarks: '' },
        { role: 'General Manager', name: '', status: 'Pending', date: '', remarks: '' },
      ]
    });
    
    setResignationOpen(false);
    setResignationData({ date: '', reason: '', remarks: '' });
    setSuccessModal(true);
  };


  const handleChange = (e) => {
    const { name, value } = e.target;
    setPersonalData(prev => {
      const newData = { ...prev, [name]: value };
      
      // Auto-fill municipality, province, zip based on Barangay
      if (name === 'presentBarangay' && addressHierarchy[value]) {
        const info = addressHierarchy[value];
        newData.presentMunicipality = info.municipality;
        newData.presentProvince = info.province;
        newData.presentZipcode = info.zip;
        if (prev.sameAsPresent) {
          newData.permanentBarangay = value;
          newData.permanentMunicipality = info.municipality;
          newData.permanentProvince = info.province;
          newData.permanentZipcode = info.zip;
        }
      } else if (name === 'permanentBarangay' && addressHierarchy[value]) {
        const info = addressHierarchy[value];
        newData.permanentMunicipality = info.municipality;
        newData.permanentProvince = info.province;
        newData.permanentZipcode = info.zip;
      } else if (name === 'presentStreet' && prev.sameAsPresent) {
        newData.permanentStreet = value;
      }
      
      return newData;
    });
  };

  const handleCheckboxChange = (e) => {
    const checked = e.target.checked;
    setPersonalData(prev => {
      const newData = { ...prev, sameAsPresent: checked };
      if (checked) {
        newData.permanentStreet = prev.presentStreet;
        newData.permanentBarangay = prev.presentBarangay;
        newData.permanentMunicipality = prev.presentMunicipality;
        newData.permanentProvince = prev.presentProvince;
        newData.permanentZipcode = prev.presentZipcode;
      }
      return newData;
    });
  };

  return (
    <Box className="page-container">

      {/* Employee Search Bar */}
      <Box ref={empSearchRef} sx={{ mb: 3, maxWidth: 500, position: 'relative' }}>
        <TextField
          fullWidth
          size="small"
          label="Search Employee Name or ID"
          placeholder="Type name or ID..."
          value={empSearchQuery}
          onChange={(e) => { setEmpSearchQuery(e.target.value); setShowEmpDropdown(true); }}
          onFocus={() => empSearchQuery && setShowEmpDropdown(true)}
          InputLabelProps={{ shrink: true, sx: { fontWeight: 600 } }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: '#0241FB', fontSize: '1.2rem' }} />
              </InputAdornment>
            )
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 3,
              bgcolor: '#FDFDFC',
              boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
              transition: 'all 0.3s ease',
              '& fieldset': { borderColor: 'rgba(0,0,0,0.1)' },
              '&:hover fieldset': { borderColor: goldAccent },
              '&.Mui-focused fieldset': { borderColor: '#0241FB', boxShadow: '0 4px 20px rgba(2,61,251,0.15)' }
            }
          }}
        />
        {showEmpDropdown && filteredEmpOptions.length > 0 && (
          <Paper elevation={6} sx={{ position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 1300, borderRadius: 2, mt: 0.5, overflow: 'hidden', border: '1px solid rgba(2,61,251,0.15)', maxHeight: 280, overflowY: 'auto' }}>
            <List dense disablePadding>
              {filteredEmpOptions.map((opt, idx) => (
                <ListItemButton
                  key={opt.id}
                  divider={idx < filteredEmpOptions.length - 1}
                  onClick={() => {
                    const index = employees.findIndex(e => e.id === opt.id);
                    setSelectedEmp(index);
                    setEmpSearchQuery(`${opt.firstName} ${opt.lastName} (#${opt.id})`);
                    setShowEmpDropdown(false);
                  }}
                  sx={{ '&:hover': { bgcolor: 'rgba(2,61,251,0.06)' } }}
                >
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar sx={{ bgcolor: goldAccent, width: 28, height: 28, fontSize: '0.75rem', fontWeight: 700, flexShrink: 0 }}>
                          {opt.firstName[0]}
                        </Avatar>
                        <Typography variant="body2" sx={{ fontWeight: 800, color: '#0241FB', minWidth: 45 }}>#{opt.id}</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>{opt.firstName} {opt.lastName}</Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary', ml: 'auto' }}>{opt.department || opt.designation}</Typography>
                      </Box>
                    }
                  />
                </ListItemButton>
              ))}
            </List>
          </Paper>
        )}
        {showEmpDropdown && empSearchQuery && filteredEmpOptions.length === 0 && (
          <Paper elevation={3} sx={{ position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 1300, borderRadius: 2, mt: 0.5, p: 2, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">No employees found.</Typography>
          </Paper>
        )}
      </Box>

      {/* Selected Employee Name Card */}
      <Card sx={{
        mb: 4, borderRadius: 3, borderLeft: `6px solid ${goldAccent}`,
        background: 'linear-gradient(to right, #fff, rgba(212,168,67,0.02))',
        boxShadow: '0 4px 15px rgba(0,0,0,0.05)'
      }}>
        <CardContent sx={{ py: 2, '&:last-child': { pb: 2 }, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar sx={{ background: 'linear-gradient(135deg, #05077E 0%, #0241FB 60%, #4470ED 100%)', width: 45, height: 45, fontWeight: 700 }}>
            {employees[selectedEmp].firstName[0]}
          </Avatar>
          <Box>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>
              Currently Viewing
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#0241FB', lineHeight: 1.2 }}>
              {employees[selectedEmp].firstName} {employees[selectedEmp].lastName}
            </Typography>
          </Box>
        </CardContent>
      </Card>


      <Card sx={{
        borderRadius: 3,
        borderTop: `3px solid ${goldAccent}`,
        boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
      }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h6" sx={{
            fontWeight: 700, fontSize: '1.1rem', color: '#0241FB', mb: 3,
            background: 'linear-gradient(135deg, #0241FB, #4470ED)',
            backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>
            Basic Information
          </Typography>

          <Grid container spacing={2.5}>
            <Grid item xs={12} sm={6} md={3}>
              <TextField fullWidth size="small" label="Birthdate" type="date" name="birthdate" value={personalData.birthdate || ''} onChange={handleChange} InputLabelProps={{ shrink: true }} />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField fullWidth size="small" label="Birthplace" name="birthplace" value={personalData.birthplace || ''} onChange={handleChange} />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField fullWidth size="small" label="Gender" select name="gender" value={personalData.gender || ''} onChange={handleChange}>
                {['Male', 'Female', 'Other'].map((g) => <MenuItem key={g} value={g}>{g}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField fullWidth size="small" label="Civil Status" select name="civilStatus" value={personalData.civilStatus || ''} onChange={handleChange}>
                {['Single', 'Married', 'Widowed', 'Separated', 'Divorced'].map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField fullWidth size="small" label="Religion" select name="religion" value={personalData.religion || ''} onChange={handleChange}>
                {['Roman Catholic', 'Islam', 'Iglesia ni Cristo', 'Protestant', 'Others'].map((r) => <MenuItem key={r} value={r}>{r}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField fullWidth size="small" label="Citizenship" select name="citizenship" value={personalData.citizenship || ''} onChange={handleChange}>
                {['Filipino', 'Dual Citizen', 'Foreign National'].map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField 
                fullWidth size="small" label="Height" 
                type="number" name="height" 
                value={personalData.height || ''} onChange={handleChange} 
                inputProps={{ step: "1" }}
                InputProps={{ endAdornment: <InputAdornment position="end">cm</InputAdornment> }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField 
                fullWidth size="small" label="Weight" 
                type="number" name="weight" 
                value={personalData.weight || ''} onChange={handleChange} 
                inputProps={{ step: "1" }}
                InputProps={{ endAdornment: <InputAdornment position="end">kg</InputAdornment> }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField fullWidth sx={{ minWidth: 110, '& .MuiInputLabel-root': { maxWidth: 'calc(100% - 24px)' } }} size="small" label="Blood Type" select name="bloodType" value={personalData.bloodType || ''} onChange={handleChange}>
                {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bt) => <MenuItem key={bt} value={bt}>{bt}</MenuItem>)}
              </TextField>
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1rem', color: '#0241FB', mb: 2.5 }}>
            Present Address
          </Typography>
          <Grid container spacing={2.5}>
            <Grid item xs={12} sm={8} md={6}>
              <TextField fullWidth size="small" label="Street/Bldg" name="presentStreet" value={personalData.presentStreet || ''} onChange={handleChange} />
            </Grid>
            <Grid item xs={12} sm={4} md={3}>
              <Autocomplete
                size="small"
                options={barangays}
                value={personalData.presentBarangay || null}
                onChange={(event, newValue) => {
                  handleChange({ target: { name: 'presentBarangay', value: newValue || '' } });
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Barangay" name="presentBarangay" 
                   sx={{
          minWidth: 110,
          '& .MuiInputLabel-root': {
            maxWidth: 'calc(100% - 24px)'
          }
        }}/>
                )}
              />
            </Grid>
            <Grid item xs={12} sm={4} md={3}>
              <TextField fullWidth size="small" label="Municipality" name="presentMunicipality" value={personalData.presentMunicipality || ''} InputProps={{ readOnly: true }} />
            </Grid>
            <Grid item xs={12} sm={4} md={3}>
              <TextField fullWidth size="small" label="Province" name="presentProvince" value={personalData.presentProvince || ''} InputProps={{ readOnly: true }} />
            </Grid>
            <Grid item xs={12} sm={4} md={3}>
              <TextField fullWidth size="small" label="Zipcode" name="presentZipcode" value={personalData.presentZipcode || ''} InputProps={{ readOnly: true }} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth sx={{ minWidth: 110, '& .MuiInputLabel-root': { maxWidth: 'calc(100% - 24px)' } }}  size="small" select label="Tenureship" name="tenureship" value={personalData.tenureship || ''} onChange={handleChange}>
                {['Owner', 'Renter/Tenant', 'Living with relatives', 'Mortgaged'].map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
              </TextField>
            </Grid>
          </Grid>

          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 4, mb: 2.5 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1rem', color: '#0241FB' }}>
              Permanent Address
            </Typography>
            <FormControlLabel 
              control={<Checkbox checked={personalData.sameAsPresent || false} onChange={handleCheckboxChange} sx={{ color: '#0241FB', '&.Mui-checked': { color: '#0241FB' } }} />} 
              label={<Typography variant="body2" sx={{ fontWeight: 600 }}>Same as Present Address</Typography>} 
            />
          </Box>
          <Grid container spacing={2.5}>
            <Grid item xs={12} sm={8} md={6}>
              <TextField fullWidth size="small" label="Street/Bldg" name="permanentStreet" value={personalData.permanentStreet || ''} onChange={handleChange} disabled={personalData.sameAsPresent} />
            </Grid>
            <Grid item xs={12} sm={4} md={3}>
              <Autocomplete
                size="small"
                options={barangays}
                value={personalData.permanentBarangay || null}
                onChange={(event, newValue) => {
                  handleChange({ target: { name: 'permanentBarangay', value: newValue || '' } });
                }}
                disabled={personalData.sameAsPresent}
                renderInput={(params) => (
                  <TextField {...params} label="Barangay" name="permanentBarangay"
                  sx={{ minWidth: 110, '& .MuiInputLabel-root': { maxWidth: 'calc(100% - 24px)' } }}  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={4} md={3}>
              <TextField fullWidth size="small" label="Municipality" name="permanentMunicipality" value={personalData.permanentMunicipality || ''} InputProps={{ readOnly: true }} disabled={personalData.sameAsPresent} />
            </Grid>
            <Grid item xs={12} sm={4} md={3}>
              <TextField fullWidth size="small" label="Province" name="permanentProvince" value={personalData.permanentProvince || ''} InputProps={{ readOnly: true }} disabled={personalData.sameAsPresent} />
            </Grid>
            <Grid item xs={12} sm={4} md={3}>
              <TextField fullWidth size="small" label="Zipcode" name="permanentZipcode" value={personalData.permanentZipcode || ''} InputProps={{ readOnly: true }} disabled={personalData.sameAsPresent} />
            </Grid>
          </Grid>
          
          <Divider sx={{ my: 3 }} />
          <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1rem', color: '#0241FB', mb: 2.5 }}>Contact Information</Typography>
          <Grid container spacing={2.5}>
            {personalData.contactNumbers?.map((cn, i) => {
              const displayVal = cn ? cn.replace(/[^0-9]/g, '').slice(-9) : '';
              return (
                <Grid item xs={12} sm={6} md={4} key={`contact-${i}`}>
                  <TextField 
                    fullWidth 
                    size="small" 
                    label={`Contact Number ${i + 1}`} 
                    value={displayVal}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">+639</InputAdornment>
                    }}
                    inputProps={{ maxLength: 9, pattern: "[0-9]*" }}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^0-9]/g, '');
                      const newContacts = [...personalData.contactNumbers];
                      newContacts[i] = val ? `+639${val}` : '';
                      setPersonalData({...personalData, contactNumbers: newContacts});
                    }} 
                  />
                </Grid>
              );
            })}
            {personalData.emailAddresses?.map((em, i) => (
              <Grid item xs={12} sm={6} md={4} key={`email-${i}`}>
                <TextField fullWidth size="small" label={`Email Address ${i + 1}`} value={em} onChange={(e) => {
                  const newEmails = [...personalData.emailAddresses];
                  newEmails[i] = e.target.value;
                  setPersonalData({...personalData, emailAddresses: newEmails});
                }} />
              </Grid>
            ))}
          </Grid>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3, alignItems: 'center' }}>
            <Box sx={{ display: 'flex', gap: 1.5 }}>
              <Button variant="outlined" sx={{ borderColor: 'rgba(0,0,0,0.15)' }}>Cancel</Button>
              <Button variant="contained" startIcon={<SaveIcon />} sx={{ background: 'linear-gradient(135deg, #05077E 0%, #05077E 100%)' }}>
                Save Changes
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
      {/* Document Upload Section */}
      <Card sx={{
        borderRadius: 3,
        mt: 4,
        borderTop: `3px solid ${goldAccent}`,
        boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
      }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1rem', color: '#0241FB', mb: 2.5 }}>
            Requirements Document Upload
          </Typography>
          <Grid container spacing={3}>
            {[
              { label: 'Tin ID', key: 'tinId' },
              { label: 'SSS ID / E1', key: 'sss' },
              { label: 'Philhealth ID / MDR', key: 'philhealth' },
              { label: 'HDMF (Pag-IBIG) ID/MDF', key: 'hdmf' },
              { label: 'NBI Clearance', key: 'nbi' },
            ].map((item) => (
              <Grid item xs={12} sm={6} md={4} key={item.key}>
                <Box sx={{
                  p: 2,
                  border: '1px dashed rgba(0,0,0,0.12)',
                  borderRadius: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 1,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    borderColor: goldAccent,
                    bgcolor: 'rgba(212,168,67,0.02)',
                  }
                }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.8rem' }}>
                    {item.label}
                  </Typography>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<UploadIcon />}
                    component="label"
                    sx={{
                      borderColor: 'rgba(0,0,0,0.12)',
                      color: 'text.secondary',
                      textTransform: 'none',
                      fontSize: '0.75rem',
                      '&:hover': { borderColor: goldAccent, color: goldAccent }
                    }}
                  >
                    Upload File
                    <input type="file" hidden onChange={() => handleUpload(item.key)} />
                  </Button>
                  {extractedIds[item.key] ? (
                    <Box sx={{ mt: 1, textAlign: 'center' }}>
                      <Typography variant="caption" sx={{ color: '#2e7d32', fontWeight: 600, display: 'block' }}>
                        ID Extracted:
                      </Typography>
                      <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 700, color: '#0241FB' }}>
                        {extractedIds[item.key]}
                      </Typography>
                    </Box>
                  ) : (
                    <Typography variant="caption" sx={{ color: 'text.disabled' }}>
                      No file chosen
                    </Typography>
                  )}
                </Box>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      {/* Resignation Application Modal */}
      <Dialog open={resignationOpen} onClose={() => setResignationOpen(false)} maxWidth="sm" fullWidth>
        <Box sx={{ p: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 800, color: '#d32f2f', mb: 1 }}>Submit Resignation</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
            You are initiating a formal exit process for <strong>{employees[selectedEmp]?.firstName} {employees[selectedEmp]?.lastName}</strong>. Once submitted, it will be directed to the Exit Approval Queue.
          </Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField 
                fullWidth label="Intended Last Day of Work" type="date" 
                InputLabelProps={{ shrink: true }} 
                value={resignationData.date}
                onChange={(e) => setResignationData({...resignationData, date: e.target.value})}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField 
                fullWidth select label="Reason for Leaving" 
                value={resignationData.reason}
                onChange={(e) => setResignationData({...resignationData, reason: e.target.value})}
              >
                {['Career Growth', 'Personal Reasons', 'Relocation', 'Health Reasons', 'Retirement', 'Termination'].map(r => (
                  <MenuItem key={r} value={r}>{r}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField 
                fullWidth multiline rows={3} label="Additional Remarks/Notice" 
                placeholder="Include details regarding turnover or specific clearance notes."
                value={resignationData.remarks}
                onChange={(e) => setResignationData({...resignationData, remarks: e.target.value})}
              />
            </Grid>
          </Grid>
          
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 4 }}>
            <Button onClick={() => setResignationOpen(false)} color="inherit" sx={{ fontWeight: 600 }}>Cancel</Button>
            <Button 
              onClick={handleSubmitResignation} 
              variant="contained" color="error" 
              disabled={!resignationData.date || !resignationData.reason}
              sx={{ fontWeight: 700 }}
            >
              Confirm Resignation
            </Button>
          </Box>
        </Box>
      </Dialog>

      {/* Submission Success Modal (Payroll Style) */}
      <Dialog 
        open={successModal} 
        onClose={() => setSuccessModal(false)} 
        maxWidth="xs" 
        fullWidth
        PaperProps={{ sx: { borderRadius: 4, p: 3, textAlign: 'center' } }}
      >
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center' }}>
          <Avatar sx={{ width: 80, height: 80, bgcolor: 'rgba(46, 125, 50, 0.1)', color: '#2e7d32' }}>
            <ApproveIcon sx={{ fontSize: 50 }} />
          </Avatar>
        </Box>
        <Typography variant="h5" sx={{ fontWeight: 800, color: '#2e7d32', mb: 2 }}>
          Submission Successful
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4, px: 2, lineHeight: 1.6 }}>
          Resignation application and Exit Interview forwarded to HR for review.
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
          <Button 
            variant="outlined" 
            onClick={() => setSuccessModal(false)}
            sx={{ fontWeight: 700, borderRadius: 2, borderColor: 'rgba(0,0,0,0.15)', color: 'text.secondary', px: 3 }}
          >
            Close
          </Button>
          <Button 
            variant="contained" 
            onClick={() => {
              setSuccessModal(false);
              navigate('/hr/onboarding/approvals?type=Resignation');
            }}
            sx={{ fontWeight: 700, borderRadius: 2, px: 3, background: 'linear-gradient(135deg, #05077E, #0241FB)' }}
          >
            View Queue
          </Button>
        </Box>
      </Dialog>
    </Box>
  );
}
