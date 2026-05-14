import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Box, Card, CardContent, Typography, Grid, TextField, MenuItem,
  Button, Divider, Stepper, Step, StepLabel, StepConnector,
  IconButton, InputAdornment, Chip, Avatar, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Dialog,
  DialogTitle, DialogContent, DialogActions,
  Autocomplete, Checkbox, FormControlLabel,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  Person as PersonIcon,
  FamilyRestroom as FamilyIcon,
  School as SchoolIcon,
  Work as WorkIcon,
  Badge as BadgeIcon,
  Description as DocIcon,
  RateReview as ReviewIcon,
  NavigateNext as NextIcon,
  NavigateBefore as BackIcon,
  Save as SaveIcon,
  Send as SendIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  CloudUpload as UploadIcon,
  CheckCircle as CheckIcon,
} from '@mui/icons-material';
import {
  COMPANY_POSITIONS, COMPANY_DIVISIONS, COMPANY_DEPARTMENTS,
  JOB_LEVELS, SHIFT_SCHEDULES, EMPLOYMENT_STATUSES,
  onboardingRecords,
} from '../../data/mockData';

const goldAccent = '#d4a843';
const NAV = '#05077E';
const IND = '#0241FB';
const ROY = '#4470ED';

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
  'Salay': { municipality: 'Mangaldan', province: 'Pangasinan', zip: '2432' },
};
const barangays = Object.keys(addressHierarchy).sort();

const steps = [
  { label: 'Personal Info', icon: <PersonIcon /> },
  { label: 'Family', icon: <FamilyIcon /> },
  { label: 'Education', icon: <SchoolIcon /> },
  { label: 'Work Experience', icon: <WorkIcon /> },
  { label: 'Employment', icon: <BadgeIcon /> },
  { label: 'Requirements', icon: <DocIcon /> },
  { label: 'Review & Submit', icon: <ReviewIcon /> },
];

// Custom stepper connector
const GoldConnector = styled(StepConnector)(() => ({
  '& .MuiStepConnector-line': {
    borderColor: 'rgba(212,168,67,0.3)',
    borderTopWidth: 3,
    borderRadius: 1,
  },
  '&.Mui-active .MuiStepConnector-line': {
    borderColor: goldAccent,
  },
  '&.Mui-completed .MuiStepConnector-line': {
    borderColor: goldAccent,
  },
}));

const initialPersonal = {
  firstName: '', middleName: '', lastName: '', suffix: '',
  birthdate: '', birthplace: '', gender: '', civilStatus: '',
  religion: '', citizenship: 'Filipino', height: '', weight: '', bloodType: '',
  // Present Address
  presentStreet: '', presentBarangay: '', presentMunicipality: '', presentProvince: '', presentZipcode: '', tenureship: '',
  // Permanent Address
  permanentStreet: '', permanentBarangay: '', permanentMunicipality: '', permanentProvince: '', permanentZipcode: '',
  sameAsPresent: false,
  contactNumber1: '', contactNumber2: '',
  emailPersonal: '', emailCompany: '',
  emergencyName: '', emergencyNumber: '', emergencyRelationship: '',
};

const initialFamily = {
  spouseName: '', spouseBirthdate: '', spouseOccupation: '', spouseContact: '',
  spouseAddress: '', spouseBusinessAddress: '', numChildren: '',
  fatherName: '', fatherBirthdate: '', fatherOccupation: '', fatherContact: '',
  motherName: '', motherBirthdate: '', motherOccupation: '', motherContact: '',
  children: [],
};

const initialEmployment = {
  division: '', department: '', jobLevel: '', designation: '',
  dateHired: '', employmentType: '', shift: 'Day',
  timeIn: '9:00:00 AM', timeOut: '6:00:00 PM',
  supervisor: '', workLocation: 'APECC Main', payrollLocation: 'APECC Main',
  basicSalary: '', deminimis: '',
};

const initialRequirements = {
  tinNo: '', tinStatus: 'Pending',
  sssNo: '', sssStatus: 'Pending',
  philhealthNo: '', philhealthStatus: 'Pending',
  hdmfNo: '', hdmfStatus: 'Pending',
  nbiNo: '', nbiStatus: 'Pending',
};

function SectionTitle({ children }) {
  return (
    <Typography variant="h6" sx={{
      fontWeight: 700, fontSize: '1rem', color: IND, mb: 2.5,
      background: `linear-gradient(135deg, ${IND}, ${ROY})`,
      backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
    }}>
      {children}
    </Typography>
  );
}

function ReviewRow({ label, value }) {
  return (
    <Box sx={{ display: 'flex', py: 0.8, borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
      <Typography variant="body2" sx={{ width: 200, color: 'text.secondary', fontWeight: 500, fontSize: '0.8rem', flexShrink: 0 }}>
        {label}
      </Typography>
      <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.83rem' }}>
        {value || '—'}
      </Typography>
    </Box>
  );
}

export default function AddEmployee() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('editId');
  const [activeStep, setActiveStep] = useState(0);
  const [personal, setPersonal] = useState(initialPersonal);
  const [family, setFamily] = useState(initialFamily);
  const [noSpouse, setNoSpouse] = useState(false);
  const [education, setEducation] = useState([
    { level: 'College', school: '', degree: '', areaOfStudy: '', distinction: '', units: '', from: '', till: '' },
  ]);
  const [workExperience, setWorkExperience] = useState([
    { company: '', position: '', salary: '', from: '', to: '', reason: '' },
  ]);
  const [references, setReferences] = useState([
    { name: '', position: '', addressCompany: '', contact: '' },
  ]);
  const [employment, setEmployment] = useState(initialEmployment);
  const [requirements, setRequirements] = useState(initialRequirements);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (editId) {
      const record = onboardingRecords.find(r => r.id === editId);
      if (record) {
        setPersonal(record.employeeData.personal);
        setFamily(record.employeeData.family);
        if (record.employeeData.education.length > 0) setEducation(record.employeeData.education);
        if (record.employeeData.workExperience.length > 0) setWorkExperience(record.employeeData.workExperience);
        if (record.employeeData.references.length > 0) setReferences(record.employeeData.references);
        setEmployment(record.employeeData.employmentDetails);
        setRequirements(record.employeeData.requirements);
      }
    }
  }, [editId]);

  const handleNext = () => setActiveStep((prev) => Math.min(prev + 1, steps.length - 1));
  const handleBack = () => setActiveStep((prev) => Math.max(prev - 1, 0));

  const handlePersonalChange = (e) => {
    const { name, value } = e.target;
    setPersonal(prev => {
      const next = { ...prev, [name]: value };
      if (name === 'presentBarangay' && addressHierarchy[value]) {
        const info = addressHierarchy[value];
        next.presentMunicipality = info.municipality;
        next.presentProvince = info.province;
        next.presentZipcode = info.zip;
        if (prev.sameAsPresent) {
          next.permanentBarangay = value;
          next.permanentMunicipality = info.municipality;
          next.permanentProvince = info.province;
          next.permanentZipcode = info.zip;
        }
      } else if (name === 'permanentBarangay' && addressHierarchy[value]) {
        const info = addressHierarchy[value];
        next.permanentMunicipality = info.municipality;
        next.permanentProvince = info.province;
        next.permanentZipcode = info.zip;
      } else if (name === 'presentStreet' && prev.sameAsPresent) {
        next.permanentStreet = value;
      }
      return next;
    });
  };

  const handleSameAsPresent = (e) => {
    const checked = e.target.checked;
    setPersonal(prev => ({
      ...prev,
      sameAsPresent: checked,
      ...(checked && {
        permanentStreet: prev.presentStreet,
        permanentBarangay: prev.presentBarangay,
        permanentMunicipality: prev.presentMunicipality,
        permanentProvince: prev.presentProvince,
        permanentZipcode: prev.presentZipcode,
      }),
    }));
  };

  const handleFamilyChange = (e) => {
    setFamily({ ...family, [e.target.name]: e.target.value });
  };

  const handleNoSpouse = (e) => {
    const checked = e.target.checked;
    setNoSpouse(checked);
    if (checked) {
      setFamily(prev => ({
        ...prev,
        spouseName: 'N/A',
        spouseBirthdate: '',
        spouseOccupation: 'N/A',
        spouseContact: 'N/A',
        spouseAddress: 'N/A',
        spouseBusinessAddress: 'N/A',
      }));
    } else {
      setFamily(prev => ({
        ...prev,
        spouseName: '',
        spouseBirthdate: '',
        spouseOccupation: '',
        spouseContact: '',
        spouseAddress: '',
        spouseBusinessAddress: '',
      }));
    }
  };

  const handleEmploymentChange = (e) => {
    setEmployment({ ...employment, [e.target.name]: e.target.value });
  };

  const handleRequirementsChange = (e) => {
    setRequirements({ ...requirements, [e.target.name]: e.target.value });
  };

  const addChild = () => {
    setFamily({ ...family, children: [...family.children, { name: '', birthdate: '', gender: '' }] });
  };

  const removeChild = (idx) => {
    setFamily({ ...family, children: family.children.filter((_, i) => i !== idx) });
  };

  const updateChild = (idx, field, value) => {
    const updated = [...family.children];
    updated[idx] = { ...updated[idx], [field]: value };
    setFamily({ ...family, children: updated });
  };

  const addEducation = () => {
    setEducation([...education, { level: '', school: '', degree: '', areaOfStudy: '', distinction: '', units: '', from: '', till: '' }]);
  };

  const removeEducation = (idx) => {
    setEducation(education.filter((_, i) => i !== idx));
  };

  const updateEducation = (idx, field, value) => {
    const updated = [...education];
    updated[idx] = { ...updated[idx], [field]: value };
    setEducation(updated);
  };

  const addWorkExperience = () => {
    setWorkExperience([...workExperience, { company: '', position: '', salary: '', from: '', to: '', reason: '' }]);
  };

  const removeWorkExperience = (idx) => {
    setWorkExperience(workExperience.filter((_, i) => i !== idx));
  };

  const updateWorkExperience = (idx, field, value) => {
    const updated = [...workExperience];
    updated[idx] = { ...updated[idx], [field]: value };
    setWorkExperience(updated);
  };

  const addReference = () => {
    setReferences([...references, { name: '', position: '', addressCompany: '', contact: '' }]);
  };

  const removeReference = (idx) => {
    setReferences(references.filter((_, i) => i !== idx));
  };

  const updateReference = (idx, field, value) => {
    const updated = [...references];
    updated[idx] = { ...updated[idx], [field]: value };
    setReferences(updated);
  };

  const handleSubmit = () => {
    if (editId) {
      // Find and update existing record
      const recordIndex = onboardingRecords.findIndex(r => r.id === editId);
      if (recordIndex > -1) {
        onboardingRecords[recordIndex].status = 'Pending Unit Manager';
        onboardingRecords[recordIndex].employeeData = {
          firstName: personal.firstName,
          middleName: personal.middleName,
          lastName: personal.lastName,
          suffix: personal.suffix,
          designation: employment.designation,
          department: employment.department,
          personal: { ...personal },
          family: { ...family },
          education: [...education],
          workExperience: [...workExperience],
          references: [...references],
          employmentDetails: { ...employment },
          requirements: { ...requirements },
        };
        onboardingRecords[recordIndex].approvalChain.push({
          role: 'HR Officer', name: 'Admin User', status: 'Re-Submitted', date: new Date().toISOString().split('T')[0], remarks: 'HR Officer edited and re-submitted the 201 file.'
        });
      }
    } else {
      // Build the new onboarding record
      const newId = `ONB-${String(onboardingRecords.length + 1).padStart(3, '0')}`;
      const newRecord = {
        id: newId,
        submittedDate: new Date().toISOString().split('T')[0],
        submittedBy: 'HR Officer (Admin)',
        status: 'Pending Unit Manager',
        employeeData: {
          firstName: personal.firstName,
          middleName: personal.middleName,
          lastName: personal.lastName,
          suffix: personal.suffix,
          designation: employment.designation,
          department: employment.department,
          personal: { ...personal },
          family: { ...family },
          education: [...education],
          workExperience: [...workExperience],
          references: [...references],
          employmentDetails: { ...employment },
          requirements: { ...requirements },
        },
        approvalChain: [
          { role: 'HR Officer', name: 'Admin User', status: 'Submitted', date: new Date().toISOString().split('T')[0], remarks: 'Initial 201 data encoding completed.' },
          { role: 'Unit Manager', name: '', status: 'Pending', date: '', remarks: '' },
          { role: 'Asst. General Manager', name: '', status: 'Pending', date: '', remarks: '' },
        ],
      };
      onboardingRecords.push(newRecord);
    }

    setConfirmOpen(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <Box className="page-container">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <Card sx={{ borderRadius: 3, p: 6, textAlign: 'center', maxWidth: 500, boxShadow: '0 8px 32px rgba(0,0,0,0.08)' }}>
            <Avatar sx={{
              width: 80, height: 80, mx: 'auto', mb: 3,
              background: 'linear-gradient(135deg, #2e7d32 0%, #43a047 100%)',
            }}>
              <CheckIcon sx={{ fontSize: 48 }} />
            </Avatar>
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#2e7d32', mb: 1 }}>
              Successfully Submitted!
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary', mb: 1 }}>
              The 201 file for <strong>{personal.firstName} {personal.lastName}</strong> has been submitted for approval.
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
              Next step: <Chip label="Unit Manager Verification" size="small" sx={{ fontWeight: 700, bgcolor: 'rgba(230,126,34,0.15)', color: '#e67e22' }} />
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
              <Button
                variant="outlined"
                onClick={() => {
                  setSubmitted(false);
                  setActiveStep(0);
                  setPersonal(initialPersonal);
                  setFamily(initialFamily);
                  setNoSpouse(false);
                  setEducation([{ level: 'College', school: '', degree: '', areaOfStudy: '', distinction: '', units: '', from: '', till: '' }]);
                  setWorkExperience([{ company: '', position: '', salary: '', from: '', to: '', reason: '' }]);
                  setReferences([{ name: '', position: '', addressCompany: '', contact: '' }]);
                  setEmployment(initialEmployment);
                  setRequirements(initialRequirements);
                }}
                sx={{ borderColor: IND, color: IND, fontWeight: 700, borderRadius: 2 }}
              >
                Add Another Employee
              </Button>
              <Button
                variant="contained"
                onClick={() => navigate('/hr/onboarding/approvals')}
                sx={{
                  background: `linear-gradient(135deg, ${NAV} 0%, ${IND} 100%)`,
                  fontWeight: 700, borderRadius: 2,
                }}
              >
                View Approval Queue
              </Button>
            </Box>
          </Card>
        </Box>
      </Box>
    );
  }

  const renderStep = () => {
    switch (activeStep) {
      case 0:
        return (
          <Box>
            <SectionTitle>Basic Information</SectionTitle>
            <Grid container spacing={2.5}>
              <Grid item xs={12} sm={6} md={3}>
                <TextField fullWidth size="small" label="First Name *" name="firstName" value={personal.firstName} onChange={handlePersonalChange} />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField fullWidth size="small" label="Middle Name" name="middleName" value={personal.middleName} onChange={handlePersonalChange} />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField fullWidth size="small" label="Last Name *" name="lastName" value={personal.lastName} onChange={handlePersonalChange} />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField fullWidth size="small" label="Suffix" name="suffix" value={personal.suffix} onChange={handlePersonalChange} placeholder="Jr., Sr., III" />
              </Grid>
              
              <Grid item xs={12} sm={6} md={4}>
                <TextField fullWidth size="small" label="Birthdate *" type="date" name="birthdate" value={personal.birthdate} onChange={handlePersonalChange} InputLabelProps={{ shrink: true }} />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField fullWidth size="small" label="Birthplace" name="birthplace" value={personal.birthplace} onChange={handlePersonalChange} />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField fullWidth sx={{ minWidth: 120, '& .MuiInputLabel-root': { maxWidth: 'calc(100% - 24px)' } }} size="small" label="Gender" select name="gender" value={personal.gender} onChange={handlePersonalChange} >
                  {['Male', 'Female'].map((g) => <MenuItem key={g} value={g}>{g}</MenuItem>)}
                </TextField>
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <TextField fullWidth sx={{ minWidth: 120, '& .MuiInputLabel-root': { maxWidth: 'calc(100% - 24px)' } }} size="small" label="Civil Status" select name="civilStatus" value={personal.civilStatus} onChange={handlePersonalChange}>
                  {['Single', 'Married', 'Widowed', 'Separated', 'Divorced'].map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField fullWidth sx={{ minWidth: 120, '& .MuiInputLabel-root': { maxWidth: 'calc(100% - 24px)' } }} size="small" label="Religion" select name="religion" value={personal.religion} onChange={handlePersonalChange}>
                  {['Roman Catholic', 'Islam', 'Iglesia ni Cristo', 'Protestant', 'Born Again Christian', 'Others'].map((r) => <MenuItem key={r} value={r}>{r}</MenuItem>)}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField fullWidth sx={{ minWidth: 120, '& .MuiInputLabel-root': { maxWidth: 'calc(100% - 24px)' } }} size="small" label="Citizenship" select name="citizenship" value={personal.citizenship} onChange={handlePersonalChange}>
                  {['Filipino', 'Dual Citizen', 'Foreign National'].map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                </TextField>
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <TextField fullWidth size="small" label="Height" name="height" value={personal.height} onChange={handlePersonalChange} InputProps={{ endAdornment: <InputAdornment position="end">cm</InputAdornment> }} />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField fullWidth size="small" label="Weight" name="weight" value={personal.weight} onChange={handlePersonalChange} InputProps={{ endAdornment: <InputAdornment position="end">kg</InputAdornment> }} />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField fullWidth sx={{ minWidth: 120, '& .MuiInputLabel-root': { maxWidth: 'calc(100% - 24px)' } }} size="small" label="Blood Type" select name="bloodType" value={personal.bloodType} onChange={handlePersonalChange}>
                  {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bt) => <MenuItem key={bt} value={bt}>{bt}</MenuItem>)}
                </TextField>
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />
            <SectionTitle>Present Address</SectionTitle>
            <Grid container spacing={2.5}>
              <Grid item xs={12} sm={8} md={6}>
                <TextField fullWidth size="small" label="Street / Bldg *" name="presentStreet" value={personal.presentStreet} onChange={handlePersonalChange} />
              </Grid>
              <Grid item xs={12} sm={4} md={3}>
                <Autocomplete
                  size="small"
                  options={barangays}
                  value={personal.presentBarangay || null}
                  onChange={(_, newValue) => handlePersonalChange({ target: { name: 'presentBarangay', value: newValue || '' } })}
                  renderInput={(params) => (
                    <TextField {...params} label="Barangay" sx={{ minWidth: 190, '& .MuiInputLabel-root': { maxWidth: 'calc(100% - 24px)' } }} />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={4} md={3}>
                <TextField fullWidth size="small" label="Municipality" value={personal.presentMunicipality} InputProps={{ readOnly: true }} />
              </Grid>
              <Grid item xs={12} sm={4} md={3}>
                <TextField fullWidth size="small" label="Province" value={personal.presentProvince} InputProps={{ readOnly: true }} />
              </Grid>
              <Grid item xs={12} sm={4} md={3}>
                <TextField fullWidth size="small" label="Zipcode" value={personal.presentZipcode} InputProps={{ readOnly: true }} />
              </Grid>
              <Grid item xs={12} sm={4} md={3}  sx={{ minWidth: 120 }}>
                <TextField fullWidth size="small" label="Tenureship" select name="tenureship" value={personal.tenureship} onChange={handlePersonalChange}
                  sx={{ minWidth: 110, '& .MuiInputLabel-root': { maxWidth: 'calc(100% - 24px)' } }}>
                  {['Owner', 'Renter/Tenant', 'Living with relatives', 'Mortgaged'].map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
                </TextField>
              </Grid>
            </Grid>

            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 3, mb: 2 }}>
              <SectionTitle>Permanent Address</SectionTitle>
              <FormControlLabel
                control={<Checkbox checked={personal.sameAsPresent} onChange={handleSameAsPresent} sx={{ color: IND, '&.Mui-checked': { color: IND } }} />}
                label={<Typography variant="body2" sx={{ fontWeight: 600 }}>Same as Present Address</Typography>}
              />
            </Box>
            <Grid container spacing={2.5}>
              <Grid item xs={12} sm={8} md={6}>
                <TextField fullWidth size="small" label="Street / Bldg" name="permanentStreet" value={personal.permanentStreet} onChange={handlePersonalChange} disabled={personal.sameAsPresent} />
              </Grid>
              <Grid item xs={12} sm={4} md={3}>
                <Autocomplete
                  size="small"
                  options={barangays}
                  value={personal.permanentBarangay || null}
                  disabled={personal.sameAsPresent}
                  onChange={(_, newValue) => handlePersonalChange({ target: { name: 'permanentBarangay', value: newValue || '' } })}
                  renderInput={(params) => (
                    <TextField {...params} label="Barangay" sx={{ minWidth: 190, '& .MuiInputLabel-root': { maxWidth: 'calc(100% - 24px)' } }} />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={4} md={3}>
                <TextField fullWidth size="small" label="Municipality" value={personal.permanentMunicipality} InputProps={{ readOnly: true }} disabled={personal.sameAsPresent} />
              </Grid>
              <Grid item xs={12} sm={4} md={3}>
                <TextField fullWidth size="small" label="Province" value={personal.permanentProvince} InputProps={{ readOnly: true }} disabled={personal.sameAsPresent} />
              </Grid>
              <Grid item xs={12} sm={4} md={3}>
                <TextField fullWidth size="small" label="Zipcode" value={personal.permanentZipcode} InputProps={{ readOnly: true }} disabled={personal.sameAsPresent} />
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />
            <SectionTitle>Contact Information</SectionTitle>
            <Grid container spacing={2.5}>
              <Grid item xs={12} sm={6} md={3}>
                <TextField fullWidth size="small" label="Contact Number 1 *" name="contactNumber1" value={personal.contactNumber1} onChange={handlePersonalChange}
                  InputProps={{ startAdornment: <InputAdornment position="start">+63</InputAdornment> }} />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField fullWidth size="small" label="Contact Number 2" name="contactNumber2" value={personal.contactNumber2} onChange={handlePersonalChange}
                  InputProps={{ startAdornment: <InputAdornment position="start">+63</InputAdornment> }} />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField fullWidth size="small" label="Personal Email" name="emailPersonal" value={personal.emailPersonal} onChange={handlePersonalChange} type="email" />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField fullWidth size="small" label="Company Email" name="emailCompany" value={personal.emailCompany} onChange={handlePersonalChange} type="email" />
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />
            <SectionTitle>Emergency Contact</SectionTitle>
            <Grid container spacing={2.5}>
              <Grid item xs={12} sm={4}>
                <TextField fullWidth size="small" label="Contact Person *" name="emergencyName" value={personal.emergencyName} onChange={handlePersonalChange} />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField fullWidth size="small" label="Contact Number *" name="emergencyNumber" value={personal.emergencyNumber} onChange={handlePersonalChange}
              InputProps={{ startAdornment: <InputAdornment position="start">+63</InputAdornment> }} />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField fullWidth sx={{ minWidth: 130, '& .MuiInputLabel-root': { maxWidth: 'calc(100% - 24px)' } }} size="small" label="Relationship" name="emergencyRelationship" value={personal.emergencyRelationship} onChange={handlePersonalChange}
                  select>
                  {['Spouse', 'Parent', 'Sibling', 'Child', 'Friend', 'Other'].map((r) => <MenuItem key={r} value={r}>{r}</MenuItem>)}
                </TextField>
              </Grid>
            </Grid>
          </Box>
        );

      case 1:
        return (
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <SectionTitle>Spouse Information</SectionTitle>
              <FormControlLabel
                control={<Checkbox checked={noSpouse} onChange={handleNoSpouse} sx={{ color: IND, '&.Mui-checked': { color: IND } }} />}
                label={<Typography variant="body2" sx={{ fontWeight: 600 }}>Not Applicable (No Spouse)</Typography>}
              />
            </Box>
            <Grid container spacing={2.5}>
              <Grid item xs={12} sm={6} md={4}>
                <TextField fullWidth size="small" label="Spouse Name" name="spouseName" value={family.spouseName} onChange={handleFamilyChange} disabled={noSpouse} />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField fullWidth size="small" label="Birthdate" type="date" name="spouseBirthdate" value={family.spouseBirthdate} onChange={handleFamilyChange} InputLabelProps={{ shrink: true }} disabled={noSpouse} />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField fullWidth size="small" label="Occupation" name="spouseOccupation" value={family.spouseOccupation} onChange={handleFamilyChange} disabled={noSpouse} />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField fullWidth size="small" label="Contact Number" name="spouseContact" value={family.spouseContact} onChange={handleFamilyChange}
              InputProps={{ startAdornment: <InputAdornment position="start">+63</InputAdornment> }} disabled={noSpouse} />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField fullWidth size="small" label="Address" name="spouseAddress" value={family.spouseAddress} onChange={handleFamilyChange} disabled={noSpouse} />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField fullWidth size="small" label="Business Address" name="spouseBusinessAddress" value={family.spouseBusinessAddress} onChange={handleFamilyChange} disabled={noSpouse} />
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />
            <SectionTitle>Parents</SectionTitle>
            <Grid container spacing={2.5}>
              <Grid item xs={12} sm={6} md={3}>
                <TextField fullWidth size="small" label="Father's Name" name="fatherName" value={family.fatherName} onChange={handleFamilyChange} />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField fullWidth size="small" label="Birthdate" type="date" name="fatherBirthdate" value={family.fatherBirthdate} onChange={handleFamilyChange} InputLabelProps={{ shrink: true }} />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField fullWidth size="small" label="Occupation" name="fatherOccupation" value={family.fatherOccupation} onChange={handleFamilyChange} />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField fullWidth size="small" label="Contact Number" name="fatherContact" value={family.fatherContact} onChange={handleFamilyChange}
              InputProps={{ startAdornment: <InputAdornment position="start">+63</InputAdornment> }} />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField fullWidth size="small" label="Mother's Name" name="motherName" value={family.motherName} onChange={handleFamilyChange} />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField fullWidth size="small" label="Birthdate" type="date" name="motherBirthdate" value={family.motherBirthdate} onChange={handleFamilyChange} InputLabelProps={{ shrink: true }} />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField fullWidth size="small" label="Occupation" name="motherOccupation" value={family.motherOccupation} onChange={handleFamilyChange} />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField fullWidth size="small" label="Contact Number" name="motherContact" value={family.motherContact} onChange={handleFamilyChange}
                InputProps={{ startAdornment: <InputAdornment position="start">+63</InputAdornment> }} />
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <SectionTitle>Children</SectionTitle>
              <Button size="small" startIcon={<AddIcon />} onClick={addChild}
                sx={{ color: IND, fontWeight: 600, textTransform: 'none' }}>
                Add Child
              </Button>
            </Box>
            {family.children.map((child, idx) => (
              <Grid container spacing={2} key={idx} sx={{ mb: 2, alignItems: 'center' }}>
                <Grid item xs={12} sm={4}>
                  <TextField fullWidth size="small" label="Name" value={child.name} onChange={(e) => updateChild(idx, 'name', e.target.value)} />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <TextField fullWidth size="small" label="Birthdate" type="date" value={child.birthdate} onChange={(e) => updateChild(idx, 'birthdate', e.target.value)} InputLabelProps={{ shrink: true }} />
                </Grid>
                <Grid item xs={12} sm={4} sx={{ minWidth: 100 }}>
                  <TextField fullWidth select size="small" label="Gender" value={child.gender || ''} onChange={(e) => updateChild(idx, 'gender', e.target.value)}>
                    {['Male', 'Female'].map((g) => <MenuItem key={g} value={g}>{g}</MenuItem>)}
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={1}>
                  <IconButton size="small" color="error" onClick={() => removeChild(idx)}><DeleteIcon fontSize="small" /></IconButton>
                </Grid>
              </Grid>
            ))}
            {family.children.length === 0 && (
              <Typography variant="body2" sx={{ color: 'text.secondary', fontStyle: 'italic', textAlign: 'center', py: 3 }}>
                No children added. Click "Add Child" to add entries.
              </Typography>
            )}
          </Box>
        );

      case 2:
        return (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <SectionTitle>Educational Attainment</SectionTitle>
              <Button size="small" startIcon={<AddIcon />} onClick={addEducation}
                sx={{ color: IND, fontWeight: 600, textTransform: 'none' }}>
                Add Record
              </Button>
            </Box>
            {education.map((ed, idx) => (
              <Card key={idx} sx={{ mb: 2, borderRadius: 2, border: '1px solid rgba(0,0,0,0.06)', boxShadow: 'none' }}>
                <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: IND }}>
                      Education #{idx + 1}
                    </Typography>
                    {education.length > 1 && (
                      <IconButton size="small" color="error" onClick={() => removeEducation(idx)}><DeleteIcon fontSize="small" /></IconButton>
                    )}
                  </Box>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={3}>
                      <TextField fullWidth size="small" label="Level" select value={ed.level} onChange={(e) => updateEducation(idx, 'level', e.target.value)}>
                        {['Elementary', 'High School', 'Vocational', 'College', 'Post-Graduate'].map((l) => <MenuItem key={l} value={l}>{l}</MenuItem>)}
                      </TextField>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <TextField fullWidth size="small" label="School" value={ed.school} onChange={(e) => updateEducation(idx, 'school', e.target.value)} />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <TextField fullWidth size="small" label="Degree" value={ed.degree} onChange={(e) => updateEducation(idx, 'degree', e.target.value)} />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <TextField fullWidth size="small" label="Area of Study" value={ed.areaOfStudy} onChange={(e) => updateEducation(idx, 'areaOfStudy', e.target.value)} />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <TextField fullWidth size="small" label="Distinction" value={ed.distinction} onChange={(e) => updateEducation(idx, 'distinction', e.target.value)} />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <TextField fullWidth size="small" label="Units" value={ed.units} onChange={(e) => updateEducation(idx, 'units', e.target.value)} />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <TextField fullWidth size="small" label="FROM" type="month" value={ed.from} onChange={(e) => updateEducation(idx, 'from', e.target.value)} InputLabelProps={{ shrink: true }} />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <TextField fullWidth size="small" label="TO" type="month" value={ed.till} onChange={(e) => updateEducation(idx, 'till', e.target.value)} InputLabelProps={{ shrink: true }} />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            ))}
          </Box>
        );

      case 3:
        return (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <SectionTitle>Work Experience</SectionTitle>
              <Button size="small" startIcon={<AddIcon />} onClick={addWorkExperience}
                sx={{ color: IND, fontWeight: 600, textTransform: 'none' }}>
                Add Record
              </Button>
            </Box>
            {workExperience.map((wx, idx) => (
              <Card key={idx} sx={{ mb: 2, borderRadius: 2, border: '1px solid rgba(0,0,0,0.06)', boxShadow: 'none' }}>
                <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: IND }}>
                      Experience #{idx + 1}
                    </Typography>
                    {workExperience.length > 1 && (
                      <IconButton size="small" color="error" onClick={() => removeWorkExperience(idx)}><DeleteIcon fontSize="small" /></IconButton>
                    )}
                  </Box>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={4}>
                      <TextField fullWidth size="small" label="Company" value={wx.company} onChange={(e) => updateWorkExperience(idx, 'company', e.target.value)} />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <TextField fullWidth size="small" label="Position" value={wx.position} onChange={(e) => updateWorkExperience(idx, 'position', e.target.value)} />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <TextField fullWidth size="small" label="Salary" value={wx.salary} onChange={(e) => updateWorkExperience(idx, 'salary', e.target.value)} />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <TextField fullWidth size="small" label="From" type="month" value={wx.from} onChange={(e) => updateWorkExperience(idx, 'from', e.target.value)} InputLabelProps={{ shrink: true }} />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <TextField fullWidth size="small" label="To" type="month" value={wx.to} onChange={(e) => updateWorkExperience(idx, 'to', e.target.value)} InputLabelProps={{ shrink: true }} />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <TextField fullWidth size="small" label="Reason for Leaving" value={wx.reason} onChange={(e) => updateWorkExperience(idx, 'reason', e.target.value)} />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            ))}

            <Divider sx={{ my: 3 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <SectionTitle>References</SectionTitle>
              <Button size="small" startIcon={<AddIcon />} onClick={addReference}
                sx={{ color: IND, fontWeight: 600, textTransform: 'none' }}>
                Add Reference
              </Button>
            </Box>
            {references.map((ref, idx) => (
              <Grid container spacing={2} key={idx} sx={{ mb: 2, alignItems: 'center' }}>
                <Grid item xs={12} sm={3}>
                  <TextField fullWidth size="small" label="Name" value={ref.name} onChange={(e) => updateReference(idx, 'name', e.target.value)} />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <TextField fullWidth size="small" label="Position" value={ref.position} onChange={(e) => updateReference(idx, 'position', e.target.value)} />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <TextField fullWidth size="small" label="Company/Address" value={ref.addressCompany} onChange={(e) => updateReference(idx, 'addressCompany', e.target.value)} />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <TextField fullWidth size="small" label="Contact" value={ref.contact} onChange={(e) => updateReference(idx, 'contact', e.target.value)}
                InputProps={{ startAdornment: <InputAdornment position="start">+63</InputAdornment> }} />
                </Grid>
                <Grid item xs={12} sm={1}>
                  {references.length > 1 && (
                    <IconButton size="small" color="error" onClick={() => removeReference(idx)}><DeleteIcon fontSize="small" /></IconButton>
                  )}
                </Grid>
              </Grid>
            ))}
          </Box>
        );

      case 4:
        return (
          <Box>
            <SectionTitle>Employment Details</SectionTitle>
            <Grid container spacing={2.5}>
              <Grid item xs={12} sm={6} md={4}>
                <TextField fullWidth sx={{ minWidth: 120, '& .MuiInputLabel-root': { maxWidth: 'calc(100% - 24px)' } }} size="small" label="Division" select name="division" value={employment.division} onChange={handleEmploymentChange}>
                  {COMPANY_DIVISIONS.map((d) => <MenuItem key={d} value={d}>{d}</MenuItem>)}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField fullWidth sx={{ minWidth: 130, '& .MuiInputLabel-root': { maxWidth: 'calc(100% - 24px)' } }} size="small" label="Department" select name="department" value={employment.department} onChange={handleEmploymentChange}>
                  {COMPANY_DEPARTMENTS.map((d) => <MenuItem key={d} value={d}>{d}</MenuItem>)}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField fullWidth sx={{ minWidth: 200, '& .MuiInputLabel-root': { maxWidth: 'calc(100% - 24px)' } }} size="small" label="Designation / Position" select name="designation" value={employment.designation} onChange={handleEmploymentChange}>
                  {COMPANY_POSITIONS.map((p) => <MenuItem key={p} value={p}>{p}</MenuItem>)}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField fullWidth sx={{ minWidth: 120, '& .MuiInputLabel-root': { maxWidth: 'calc(100% - 24px)' } }} size="small" label="Job Level" select name="jobLevel" value={employment.jobLevel} onChange={handleEmploymentChange}>
                  {JOB_LEVELS.map((l) => <MenuItem key={l} value={l}>{l}</MenuItem>)}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField fullWidths sx={{ minWidth: 200, '& .MuiInputLabel-root': { maxWidth: 'calc(100% - 24px)' } }} size="small" label="Employment Status" select name="employmentType" value={employment.employmentType} onChange={handleEmploymentChange}>
                  {EMPLOYMENT_STATUSES.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField fullWidth size="small" label="Date Hired *" type="date" name="dateHired" value={employment.dateHired} onChange={handleEmploymentChange} InputLabelProps={{ shrink: true }} />
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <TextField fullWidth size="small" label="Supervisor" name="supervisor" value={employment.supervisor} onChange={handleEmploymentChange} />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField fullWidth size="small" label="Work Location" name="workLocation" value={employment.workLocation} onChange={handleEmploymentChange} />
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />
            <SectionTitle>Compensation Details</SectionTitle>
            <Grid container spacing={2.5}>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  fullWidth size="small" label="Basic Salary *" name="basicSalary"
                  value={employment.basicSalary} onChange={handleEmploymentChange}
                  type="number"
                  InputProps={{ startAdornment: <InputAdornment position="start">₱</InputAdornment> }}
                  helperText="Monthly basic salary"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  fullWidth size="small" label="De Minimis Benefit" name="deminimis"
                  value={employment.deminimis} onChange={handleEmploymentChange}
                  type="number"
                  InputProps={{ startAdornment: <InputAdornment position="start">₱</InputAdornment> }}
                  helperText="Monthly de minimis (non-taxable)"
                />
              </Grid>
            </Grid>
          </Box>
        );

      case 5:
        return (
          <Box>
            <SectionTitle>Government IDs & Requirements</SectionTitle>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
              Enter government ID numbers and upload supporting documents for each requirement.
            </Typography>
            <Grid container spacing={3}>
              {[
                { label: 'TIN Number', noKey: 'tinNo', statusKey: 'tinStatus' },
                { label: 'SSS Number', noKey: 'sssNo', statusKey: 'sssStatus' },
                { label: 'PhilHealth Number', noKey: 'philhealthNo', statusKey: 'philhealthStatus' },
                { label: 'HDMF (Pag-IBIG) Number', noKey: 'hdmfNo', statusKey: 'hdmfStatus' },
                { label: 'NBI Clearance', noKey: 'nbiNo', statusKey: 'nbiStatus' },
              ].map((item) => (
                <Grid item xs={12} sm={6} key={item.noKey}>
                  <Card sx={{ borderRadius: 2, border: '1px solid rgba(0,0,0,0.08)', boxShadow: 'none' }}>
                    <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: IND, mb: 1.5 }}>
                        {item.label}
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={7}>
                          <TextField fullWidth size="small" label="ID Number" name={item.noKey} value={requirements[item.noKey]} onChange={handleRequirementsChange} />
                        </Grid>
                        <Grid item xs={5}>
                          <TextField fullWidth size="small" label="Status" select name={item.statusKey} value={requirements[item.statusKey]} onChange={handleRequirementsChange}>
                            {['Pending', 'Submitted', 'Not Applicable'].map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
                          </TextField>
                        </Grid>
                      </Grid>
                      <Button
                        variant="outlined" size="small" startIcon={<UploadIcon />} component="label"
                        sx={{
                          mt: 1.5, borderColor: 'rgba(0,0,0,0.12)', color: 'text.secondary',
                          textTransform: 'none', fontSize: '0.75rem',
                          '&:hover': { borderColor: goldAccent, color: goldAccent },
                        }}
                      >
                        Upload Document
                        <input type="file" hidden />
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        );

      case 6:
        return (
          <Box>
            <SectionTitle>Review & Submit</SectionTitle>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
              Please review all the information below before submitting. Once submitted, the record will be forwarded to the <strong>Unit Manager</strong> for verification.
            </Typography>

            {/* Approval Flow Visual */}
            <Card sx={{ mb: 3, borderRadius: 2, p: 2, background: 'rgba(2,65,251,0.03)', border: '1px solid rgba(2,65,251,0.1)' }}>
              <Typography variant="body2" sx={{ fontWeight: 700, color: IND, mb: 1.5 }}>
                Approval Workflow
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                <Chip label="1. HR Officer (Encode)" size="small" sx={{ fontWeight: 700, bgcolor: 'rgba(46,125,50,0.15)', color: '#2e7d32' }} />
                <Typography sx={{ color: 'text.secondary' }}>→</Typography>
                <Chip label="2. Unit Manager (Verify / Decline)" size="small" sx={{ fontWeight: 700, bgcolor: 'rgba(230,126,34,0.15)', color: '#e67e22' }} />
                <Typography sx={{ color: 'text.secondary' }}>→</Typography>
                <Chip label="3. Asst. Gen Manager (Approve / Decline)" size="small" sx={{ fontWeight: 700, bgcolor: 'rgba(52,152,219,0.15)', color: '#2980b9' }} />
              </Box>
            </Card>

            {/* Personal Summary */}
            <Card sx={{ mb: 2, borderRadius: 2, borderLeft: `4px solid ${goldAccent}` }}>
              <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                <Typography variant="body2" sx={{ fontWeight: 800, color: IND, mb: 1 }}>Personal Information</Typography>
                <Grid container spacing={0}>
                  <Grid item xs={12} sm={6}>
                    <ReviewRow label="Full Name" value={`${personal.firstName} ${personal.middleName} ${personal.lastName} ${personal.suffix}`.trim()} />
                    <ReviewRow label="Birthdate" value={personal.birthdate} />
                    <ReviewRow label="Gender" value={personal.gender} />
                    <ReviewRow label="Civil Status" value={personal.civilStatus} />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <ReviewRow label="Contact" value={personal.contactNumber1} />
                    <ReviewRow label="Email" value={personal.emailPersonal} />
                    <ReviewRow label="Present Address" value={personal.presentAddress} />
                    <ReviewRow label="Emergency Contact" value={`${personal.emergencyName} (${personal.emergencyRelationship})`} />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Employment Summary */}
            <Card sx={{ mb: 2, borderRadius: 2, borderLeft: `4px solid ${IND}` }}>
              <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                <Typography variant="body2" sx={{ fontWeight: 800, color: IND, mb: 1 }}>Employment Details</Typography>
                <Grid container spacing={0}>
                  <Grid item xs={12} sm={6}>
                    <ReviewRow label="Position" value={employment.designation} />
                    <ReviewRow label="Department" value={employment.department} />
                    <ReviewRow label="Division" value={employment.division} />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <ReviewRow label="Job Level" value={employment.jobLevel} />
                    <ReviewRow label="Employment Type" value={employment.employmentType} />
                    <ReviewRow label="Date Hired" value={employment.dateHired} />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Counts Summary */}
            <Card sx={{ borderRadius: 2, borderLeft: `4px solid #2e7d32` }}>
              <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                <Typography variant="body2" sx={{ fontWeight: 800, color: IND, mb: 1 }}>Other Data Summary</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6} sm={3}>
                    <Box sx={{ textAlign: 'center', p: 1, bgcolor: 'rgba(0,0,0,0.02)', borderRadius: 1 }}>
                      <Typography variant="h5" sx={{ fontWeight: 800, color: IND }}>{education.length}</Typography>
                      <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary' }}>Education Records</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Box sx={{ textAlign: 'center', p: 1, bgcolor: 'rgba(0,0,0,0.02)', borderRadius: 1 }}>
                      <Typography variant="h5" sx={{ fontWeight: 800, color: IND }}>{workExperience.length}</Typography>
                      <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary' }}>Work Records</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Box sx={{ textAlign: 'center', p: 1, bgcolor: 'rgba(0,0,0,0.02)', borderRadius: 1 }}>
                      <Typography variant="h5" sx={{ fontWeight: 800, color: IND }}>{references.length}</Typography>
                      <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary' }}>References</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Box sx={{ textAlign: 'center', p: 1, bgcolor: 'rgba(0,0,0,0.02)', borderRadius: 1 }}>
                      <Typography variant="h5" sx={{ fontWeight: 800, color: IND }}>{family.children.length}</Typography>
                      <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary' }}>Children</Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Box className="page-container">
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 800, color: NAV, mb: 1 }}>
          {editId ? 'Editing Record: ' + editId : 'Record Encoding'}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
          {editId ? 'Fix the declined data and resubmit.' : 'Fill out the initial employee onboarding forms.'}
        </Typography>
      </Box>

      {/* Stepper */}
      <Card sx={{
        borderRadius: 3, mb: 3,
        borderTop: `3px solid ${goldAccent}`,
        boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
      }}>
        <CardContent sx={{ p: 3 }}>
          <Stepper activeStep={activeStep} alternativeLabel connector={<GoldConnector />}>
            {steps.map((step, idx) => (
              <Step key={step.label} completed={idx < activeStep}>
                <StepLabel
                  StepIconComponent={() => (
                    <Avatar
                      sx={{
                        width: 36, height: 36,
                        bgcolor: idx <= activeStep
                          ? (idx < activeStep ? '#2e7d32' : IND)
                          : 'rgba(0,0,0,0.08)',
                        color: idx <= activeStep ? '#fff' : 'text.secondary',
                        transition: 'all 0.3s ease',
                        boxShadow: idx === activeStep ? `0 0 0 3px rgba(2,65,251,0.2)` : 'none',
                        '& .MuiSvgIcon-root': { fontSize: '1rem' },
                      }}
                    >
                      {idx < activeStep ? <CheckIcon sx={{ fontSize: '1rem' }} /> : step.icon}
                    </Avatar>
                  )}
                >
                  <Typography variant="caption" sx={{
                    fontWeight: idx === activeStep ? 800 : 500,
                    color: idx === activeStep ? IND : 'text.secondary',
                    fontSize: '0.7rem',
                  }}>
                    {step.label}
                  </Typography>
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </CardContent>
      </Card>

      {/* Form Content */}
      <Card sx={{
        borderRadius: 3,
        borderTop: `3px solid ${goldAccent}`,
        boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
      }}>
        <CardContent sx={{ p: 4 }}>
          {renderStep()}

          {/* Navigation Buttons */}
          <Divider sx={{ my: 3 }} />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Button
              variant="outlined"
              startIcon={<BackIcon />}
              disabled={activeStep === 0}
              onClick={handleBack}
              sx={{ borderColor: 'rgba(0,0,0,0.15)', color: 'text.secondary', fontWeight: 600, textTransform: 'none' }}
            >
              Previous
            </Button>

            <Box sx={{ display: 'flex', gap: 1.5 }}>
              {activeStep < steps.length - 1 ? (
                <Button
                  variant="contained"
                  endIcon={<NextIcon />}
                  onClick={handleNext}
                  sx={{
                    background: `linear-gradient(135deg, ${NAV} 0%, ${IND} 100%)`,
                    fontWeight: 700, textTransform: 'none', px: 4, borderRadius: 2,
                    '&:hover': { boxShadow: '0 4px 20px rgba(2,65,251,0.3)' },
                  }}
                >
                  Next Step
                </Button>
              ) : (
                <Button
                  variant="contained"
                  endIcon={<SendIcon />}
                  onClick={() => setConfirmOpen(true)}
                  sx={{
                    background: 'linear-gradient(135deg, #1b5e20 0%, #2e7d32 50%, #43a047 100%)',
                    fontWeight: 700, textTransform: 'none', px: 4, borderRadius: 2,
                    '&:hover': { boxShadow: '0 4px 20px rgba(46,125,50,0.3)' },
                  }}
                >
                  Submit for Approval
                </Button>
              )}
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 800, color: IND }}>
          Confirm Submission
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            You are about to submit the 201 file for <strong>{personal.firstName} {personal.lastName}</strong>.
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            This will be sent to the <strong>Unit Manager</strong> for verification. Once verified, it will proceed to the <strong>Assistant General Manager</strong> for final approval.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setConfirmOpen(false)} sx={{ color: 'text.secondary', fontWeight: 600 }}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            sx={{
              background: 'linear-gradient(135deg, #1b5e20 0%, #2e7d32 100%)',
              fontWeight: 700, borderRadius: 2,
            }}
          >
            Confirm & Submit
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
