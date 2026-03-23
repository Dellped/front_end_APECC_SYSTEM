import React, { useState } from 'react';
import {
  Box, Card, CardContent, Typography, Tabs, Tab, Grid, Avatar, Chip,
  Button, Divider, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, IconButton, Paper, Autocomplete, TextField, createFilterOptions
} from '@mui/material';
import {
  CloudUpload as UploadIcon, Edit as EditIcon, Print as PrintIcon,
  Person as PersonIcon, FamilyRestroom as FamilyIcon, School as SchoolIcon,
  Work as WorkIcon, ListAlt as AlphalistIcon, Search as SearchIcon,
  ExitToApp as ExitIcon, AssignmentTurnedIn as InterviewIcon
} from '@mui/icons-material';
import {
    Dialog, DialogTitle, DialogContent, DialogActions, Stack
} from '@mui/material';
import { employees } from '../../data/mockData';

const goldAccent = '#d4a843';

function TabPanel({ children, value, index }) {
  return value === index ? <Box sx={{ pt: 2.5 }}>{children}</Box> : null;
}

function InfoRow({ label, value }) {
  return (
    <Box sx={{ display: 'flex', py: 1, borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
      <Typography variant="body2" sx={{ width: 180, color: 'text.secondary', fontWeight: 500, fontSize: '0.82rem', flexShrink: 0 }}>
        {label}
      </Typography>
      <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '0.85rem' }}>
        {value || '—'}
      </Typography>
    </Box>
  );
}

export default function EmployeeProfile() {
  const [selectedEmployee, setSelectedEmployee] = useState(0);
  const [tabValue, setTabValue] = useState(0);
  const [openResignation, setOpenResignation] = useState(false);
  const [exitInterviewData, setExitInterviewData] = useState({});

  const handleResignationSubmit = () => {
    console.log('Forwarding Exit Interview Data:', exitInterviewData);
    alert('Resignation application and Exit Interview forwarded to HR for review.');
    setOpenResignation(false);
  };

  const emp = employees[selectedEmployee];

  const filterOptions = createFilterOptions({
    stringify: (option) => `${option.firstName} ${option.lastName} ${option.id} ${option.designation}`
  });

  return (
    <Box className="page-container">
      {/* Search & Profile Bar */}
      <Card sx={{ mb: 3, borderRadius: 3, boxShadow: '0 4px 24px rgba(0,0,0,0.06)', overflow: 'visible' }}>
        <CardContent sx={{ p: 0 }}>
            <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
                    <Autocomplete
                        size="small"
                        options={employees || []}
                        getOptionLabel={(option) => `${option.firstName} ${option.lastName} (${option.id})`}
                        value={null}
                        onChange={(event, newValue) => {
                          if (newValue) {
                            const index = employees.findIndex(e => e.id === newValue.id);
                            setSelectedEmployee(index);
                          }
                        }}
                        renderInput={(params) => (
                            <TextField 
                                {...params} 
                                label="Search Employee Name or ID" 
                                sx={{ minWidth: 350, '& .MuiOutlinedInput-root': { borderRadius: 2 } }} 
                            />
                        )}
                    />
                </Box>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button 
                        variant="outlined" 
                        color="error"
                        startIcon={<ExitIcon />}
                        onClick={() => setOpenResignation(true)}
                        sx={{ borderRadius: 2, textTransform: 'none', px: 3 }}
                    >
                        Apply for Resignation
                    </Button>
                    <Button 
                        variant="contained" 
                        startIcon={<PrintIcon />}
                        sx={{ bgcolor: '#023DFB', borderRadius: 2, textTransform: 'none', px: 3, '&:hover': { bgcolor: '#012dc7' } }}
                    >
                        Print Profile
                    </Button>
                </Box>
            </Box>

            {emp && (
                <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 4, position: 'relative' }}>
                    <Box sx={{ position: 'relative' }}>
                        <Avatar 
                            sx={{ 
                                width: 90, 
                                height: 90, 
                                border: `4px solid #023DFB`,
                                boxShadow: '0 8px 16px rgba(2, 61, 251, 0.15)',
                                fontSize: '2rem',
                                fontWeight: 800,
                                bgcolor: '#023DFB'
                            }}
                        >
                            {emp.firstName[0]}{emp.lastName[0]}
                        </Avatar>
                        <Chip 
                            label={emp.status || 'Active'} 
                            size="small" 
                            sx={{ 
                                position: 'absolute', 
                                bottom: -8, 
                                left: '50%', 
                                transform: 'translateX(-50%)',
                                bgcolor: '#2e7d32', 
                                color: '#fff',
                                fontWeight: 800,
                                fontSize: '0.6rem',
                                border: '2px solid #fff'
                            }} 
                        />
                    </Box>

                    <Grid container columnSpacing={4} rowSpacing={1}>
                        <Grid item xs={12} sm={4}>
                            <Typography variant="caption" sx={{ fontWeight: 800, color: '#023DFB', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                Employee Full Name
                            </Typography>
                            <Typography variant="h5" sx={{ fontWeight: 900, color: '#1a202c', mt: 0.5, lineHeight: 1.2 }}>
                                {emp.firstName} {emp.lastName}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                                Employee Account Profile
                            </Typography>
                        </Grid>

                        <Grid item xs={12} sm={8}>
                            <Box sx={{ 
                                display: 'grid', 
                                gridTemplateColumns: 'repeat(3, 1fr)', 
                                gap: 3, 
                                mt: 1,
                                bgcolor: 'rgba(0,0,0,0.02)',
                                p: 2,
                                borderRadius: 2,
                                border: '1px solid rgba(0,0,0,0.05)'
                            }}>
                                <Box>
                                    <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', display: 'block' }}>DESIGNATION</Typography>
                                    <Typography variant="body1" sx={{ fontWeight: 800, color: '#2d3748' }}>{emp.designation}</Typography>
                                </Box>
                                <Box>
                                    <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', display: 'block' }}>DEPARTMENT</Typography>
                                    <Typography variant="body1" sx={{ fontWeight: 800, color: '#2d3748' }}>{emp.department}</Typography>
                                </Box>
                                <Box>
                                    <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', display: 'block' }}>EMPLOYEE ID</Typography>
                                    <Typography variant="body1" sx={{ fontWeight: 900, color: '#023DFB', letterSpacing: '1px' }}>{emp.id}</Typography>
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            )}
        </CardContent>
      </Card>


      <Grid container spacing={3}>
        {/* Detail Tabs */}
        <Grid item xs={12}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent sx={{ p: 2.5 }}>
              <Tabs
                value={tabValue}
                onChange={(_, v) => setTabValue(v)}
                sx={{
                  '& .MuiTab-root': { textTransform: 'none', fontWeight: 500, fontSize: '0.85rem', minHeight: 42 },
                  '& .Mui-selected': { color: '#023DFB', fontWeight: 600 },
                  '& .MuiTabs-indicator': { backgroundColor: goldAccent, height: 3, borderRadius: '3px 3px 0 0' },
                }}
              >
                <Tab icon={<PersonIcon sx={{ fontSize: '1.1rem' }} />} iconPosition="start" label="Personal Info" />
                <Tab icon={<FamilyIcon sx={{ fontSize: '1.1rem' }} />} iconPosition="start" label="Family" />
                <Tab icon={<SchoolIcon sx={{ fontSize: '1.1rem' }} />} iconPosition="start" label="Education" />
                <Tab icon={<WorkIcon sx={{ fontSize: '1.1rem' }} />} iconPosition="start" label="Work Experience" />
                <Tab icon={<AlphalistIcon sx={{ fontSize: '1.1rem' }} />} iconPosition="start" label="Requirements" />
              </Tabs>

              {/* Personal Info */}
              <TabPanel value={tabValue} index={0}>
                <Grid container spacing={2}>
                  {[
                    ['Birthdate', new Date(emp.personal.birthdate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })],
                    ['Birthplace', emp.personal.birthplace],
                    ['Gender', emp.personal.gender],
                    ['Civil Status', emp.personal.civilStatus],
                    ['Religion', emp.personal.religion],
                    ['Citizenship', emp.personal.citizenship],
                    ['Height', emp.personal.height],
                    ['Weight', emp.personal.weight],
                    ['Blood Type', emp.personal.bloodType],
                  ].map(([label, val]) => (
                    <Grid item xs={12} sm={6} key={label}>
                      <InfoRow label={label} value={val} />
                    </Grid>
                  ))}
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" sx={{ color: '#023DFB', fontWeight: 600, mt: 2, mb: 1 }}>Present Address</Typography>
                    <InfoRow label="Address" value={emp.personal.presentAddress} />
                    <InfoRow label="Tenureship" value={emp.personal.tenureship} />
                    <InfoRow label="Zipcode" value={emp.personal.presentZipcode} />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" sx={{ color: '#023DFB', fontWeight: 600, mt: 1, mb: 1 }}>Permanent Address</Typography>
                    <InfoRow label="Address" value={emp.personal.permanentAddress} />
                    <InfoRow label="Zipcode" value={emp.personal.permanentZipcode} />
                  </Grid>
                  <Grid item xs={12}>
                    <InfoRow label="Contact" value={emp.personal.contactNumbers.join(', ')} />
                  </Grid>
                  <Grid item xs={12}>
                    <InfoRow label="Email" value={emp.personal.emailAddresses.join(', ')} />
                  </Grid>
                </Grid>

                <Typography variant="subtitle2" sx={{ color: '#023DFB', fontWeight: 600, mt: 3, mb: 1.5 }}>
                  Requirements Document Upload
                </Typography>
                <Grid container spacing={2}>
                  {[
                    { label: 'Tin ID', key: 'tinId' },
                    { label: 'SSS ID / E1', key: 'sss' },
                    { label: 'Philhealth ID / MDR', key: 'philhealth' },
                    { label: 'HDMF ID/MDF', key: 'hdmf' },
                    { label: 'NBI Clearance', key: 'nbi' },
                  ].map((item) => (
                    <Grid item xs={12} sm={4} key={item.key}>
                      <Box sx={{
                        p: 1.5,
                        border: '1px dashed rgba(0,0,0,0.12)',
                        borderRadius: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 0.5,
                        '&:hover': { borderColor: '#d4a843', bgcolor: 'rgba(212,168,67,0.02)' }
                      }}>
                        <Typography variant="caption" sx={{ fontWeight: 600 }}>{item.label}</Typography>
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<UploadIcon sx={{ fontSize: '0.9rem !important' }} />}
                          component="label"
                          sx={{
                            borderColor: 'rgba(0,0,0,0.12)',
                            color: 'text.secondary',
                            textTransform: 'none',
                            fontSize: '0.7rem',
                            py: 0.2,
                            '&:hover': { borderColor: '#d4a843', color: '#d4a843' }
                          }}
                        >
                          Upload
                          <input type="file" hidden />
                        </Button>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </TabPanel>

              {/* Family */}
              <TabPanel value={tabValue} index={1}>
                {emp.family.spouse && (
                  <Box sx={{ mb: 2.5 }}>
                    <Typography variant="subtitle2" sx={{ color: '#023DFB', fontWeight: 600, mb: 1 }}>Spouse</Typography>
                    <InfoRow label="Name" value={emp.family.spouse.name} />
                    <InfoRow label="Birthdate" value={emp.family.spouse.birthdate} />
                    <InfoRow label="Occupation" value={emp.family.spouse.occupation} />
                    <InfoRow label="Contact" value={emp.family.spouse.contact} />
                    <InfoRow label="Address" value={emp.family.spouse.address} />
                    <InfoRow label="Business Address" value={emp.family.spouse.businessAddress} />
                    <InfoRow label="Number of Children" value={emp.family.spouse.numChildren} />
                  </Box>
                )}
                <Box sx={{ mb: 2.5 }}>
                  <Typography variant="subtitle2" sx={{ color: '#023DFB', fontWeight: 600, mb: 1 }}>Parents</Typography>
                  <InfoRow label="Father" value={`${emp.family.father.name} (${emp.family.father.birthdate}) — ${emp.family.father.occupation}`} />
                  <InfoRow label="Mother" value={`${emp.family.mother.name} (${emp.family.mother.birthdate}) — ${emp.family.mother.occupation}`} />
                </Box>
                {emp.family.children.length > 0 && (
                  <Box>
                    <Typography variant="subtitle2" sx={{ color: '#023DFB', fontWeight: 600, mb: 1 }}>Children</Typography>
                    <TableContainer sx={{
                      overflowX: 'auto',
                      '&::-webkit-scrollbar': { height: 6 },
                      '&::-webkit-scrollbar-thumb': { bgcolor: 'rgba(0,0,0,0.1)', borderRadius: 3 }
                    }}>
                      <Table size="small" sx={{ minWidth: 600 }}>
                        <TableHead>
                          <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Birthdate</TableCell>
                            <TableCell>School</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {emp.family.children.map((child, i) => (
                            <TableRow key={i}>
                              <TableCell sx={{ fontWeight: 500 }}>{child.name}</TableCell>
                              <TableCell>{child.birthdate}</TableCell>
                              <TableCell>{child.school}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Box>
                )}
              </TabPanel>

              {/* Education */}
              <TabPanel value={tabValue} index={2}>
                <TableContainer sx={{
                  overflowX: 'auto',
                  '&::-webkit-scrollbar': { height: 6 },
                  '&::-webkit-scrollbar-thumb': { bgcolor: 'rgba(0,0,0,0.1)', borderRadius: 3 }
                }}>
                  <Table size="small" sx={{ minWidth: 900 }}>
                    <TableHead>
                      <TableRow>
                        <TableCell>Level</TableCell>
                        <TableCell>School</TableCell>
                        <TableCell>Degree</TableCell>
                        <TableCell>Area of Study</TableCell>
                        <TableCell>Distinction</TableCell>
                        <TableCell>Units</TableCell>
                        <TableCell>From</TableCell>
                        <TableCell>Till</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {emp.education.map((ed, i) => (
                        <TableRow key={i}>
                          <TableCell sx={{ fontWeight: 500 }}>{ed.level}</TableCell>
                          <TableCell>{ed.school}</TableCell>
                          <TableCell>{ed.degree || '—'}</TableCell>
                          <TableCell>{ed.areaOfStudy || '—'}</TableCell>
                          <TableCell>{ed.distinction || '—'}</TableCell>
                          <TableCell>{ed.units || '—'}</TableCell>
                          <TableCell>{ed.from || '—'}</TableCell>
                          <TableCell>{ed.till || '—'}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </TabPanel>

              {/* Work Experience */}
              <TabPanel value={tabValue} index={3}>
                <TableContainer sx={{
                  overflowX: 'auto',
                  '&::-webkit-scrollbar': { height: 6 },
                  '&::-webkit-scrollbar-thumb': { bgcolor: 'rgba(0,0,0,0.1)', borderRadius: 3 }
                }}>
                  <Table size="small" sx={{ minWidth: 800 }}>
                    <TableHead>
                      <TableRow>
                        <TableCell>Company</TableCell>
                        <TableCell>Position</TableCell>
                        <TableCell>Salary</TableCell>
                        <TableCell>From</TableCell>
                        <TableCell>To</TableCell>
                        <TableCell>Reason for Leaving</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {emp.workExperience.map((wx, i) => (
                        <TableRow key={i}>
                          <TableCell sx={{ fontWeight: 500 }}>{wx.company}</TableCell>
                          <TableCell>{wx.position}</TableCell>
                          <TableCell>{wx.salary || '—'}</TableCell>
                          <TableCell>{wx.from}</TableCell>
                          <TableCell>{wx.to}</TableCell>
                          <TableCell>{wx.reason}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>

                {emp.references.length > 0 && (
                  <Box sx={{ mt: 3 }}>
                    <Typography variant="subtitle2" sx={{ color: '#023DFB', fontWeight: 600, mb: 1 }}>References</Typography>
                    <TableContainer sx={{
                      overflowX: 'auto',
                      '&::-webkit-scrollbar': { height: 6 },
                      '&::-webkit-scrollbar-thumb': { bgcolor: 'rgba(0,0,0,0.1)', borderRadius: 3 }
                    }}>
                      <Table size="small" sx={{ minWidth: 700 }}>
                        <TableHead>
                          <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Position</TableCell>
                            <TableCell>Address / Company</TableCell>
                            <TableCell>Contact</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {emp.references.map((ref, i) => (
                            <TableRow key={i}>
                              <TableCell sx={{ fontWeight: 500 }}>{ref.name}</TableCell>
                              <TableCell>{ref.position}</TableCell>
                              <TableCell>{ref.addressCompany || '—'}</TableCell>
                              <TableCell>{ref.contact}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Box>
                )}
              </TabPanel>

              {/* Requirements */}
              <TabPanel value={tabValue} index={4}>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 600 }}>Requirement</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Document Number</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {[
                        ['Tin ID', emp.requirements.tinId, emp.requirements.tinNo],
                        ['SSS', emp.requirements.sss, emp.requirements.sssNo],
                        ['Philhealth', emp.requirements.philhealth, emp.requirements.philhealthNo],
                        ['HDMF (Pag-IBIG)', emp.requirements.hdmf, emp.requirements.hdmfNo],
                        ['NBI Clearance', emp.requirements.nbi, emp.requirements.nbiNo],
                      ].map(([label, status, docNo], i) => (
                        <TableRow key={i}>
                          <TableCell sx={{ fontWeight: 500 }}>{label}</TableCell>
                          <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>{docNo}</TableCell>
                          <TableCell>
                            <Chip
                              label={status}
                              size="small"
                              sx={{
                                fontWeight: 600,
                                bgcolor: status === 'Submitted' ? '#e8f5e9' : '#fff3e0',
                                color: status === 'Submitted' ? '#2e7d32' : '#ef6c00',
                                fontSize: '0.72rem',
                              }}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </TabPanel>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Exit Interview Dialog */}
      <Dialog open={openResignation} onClose={() => setOpenResignation(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ bgcolor: '#f8fafc', borderBottom: '1px solid #eee', py: 2 }}>
          <Box sx={{ textAlign: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#023DFB' }}>
              ASA PHILIPPINES EMPLOYEES CREDIT COOPERATIVE
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
              18-E San Martin St. Corner San Francisco St. Brgy. Kapitolyo Pasig City
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'center' }}>
            <InterviewIcon color="primary" />
            <Typography variant="h5" sx={{ fontWeight: 900 }}>EXIT INTERVIEW</Typography>
          </Box>
        </DialogTitle>
        <DialogContent dividers sx={{ p: 4 }}>
          <Stack spacing={4}>
            {/* Section: Reasons for Leaving */}
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#023DFB', mb: 2 }}>Reasons for Leaving</Typography>
              <Stack spacing={2.5}>
                <TextField fullWidth multiline rows={3} label="Why did you decide to leave the company?" variant="outlined" />
                <TextField fullWidth label="Did you get along with your direct manager?" variant="outlined" />
                <TextField fullWidth label="Did you get along with your peers?" variant="outlined" />
                <TextField fullWidth multiline rows={2} label="In general, what do you think about working at our company?" variant="outlined" />
                <TextField fullWidth multiline rows={2} label="Is there anything we could have done to prevent you from leaving?" variant="outlined" />
              </Stack>
            </Box>

            <Divider />

            {/* Section: Employee Experience */}
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#023DFB', mb: 2 }}>Employee Experience</Typography>
              <Stack spacing={2.5}>
                <TextField fullWidth multiline rows={2} label="What did you think of the way you were managed?" variant="outlined" />
                <TextField fullWidth label="Did you receive frequent, constructive feedback from your manager?" variant="outlined" />
                <TextField fullWidth multiline rows={2} label="What benefits or programs did you feel were missing from the organization?" variant="outlined" />
                <TextField fullWidth label="Were you recognized enough for your accomplishments?" variant="outlined" />
                <TextField fullWidth multiline rows={2} label="How was your overall experience working for this company?" variant="outlined" />
              </Stack>
            </Box>

            <Divider />

            {/* Section: Role-Specific Questions */}
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#023DFB', mb: 2 }}>Role-Specific Questions</Typography>
              <Stack spacing={2.5}>
                <TextField fullWidth label="Did you feel you had all the resources you needed to do your work here?" variant="outlined" />
                <TextField fullWidth multiline rows={2} label="Did you receive enough training/ Were you given the training and resources you needed to succeed in this role?" variant="outlined" />
                <TextField fullWidth label="Did the role meet your expectations?" variant="outlined" />
                <TextField fullWidth multiline rows={2} label="What did you like about your work? Was it rewarding, challenging, or too easy?" variant="outlined" />
                <TextField fullWidth multiline rows={2} label="Did you feel that your skills and talents were effectively utilized in your position?" variant="outlined" />
                <TextField fullWidth label="Did you feel supported by your manager and colleagues in your role?" variant="outlined" />
                <TextField fullWidth label="How did you feel about your workload? (Too heavy, too light, or just right?)" variant="outlined" />
                <TextField fullWidth multiline rows={2} label="How satisfied were you with your role in relation to your career goals and aspirations?" variant="outlined" />
                <TextField fullWidth label="What part of the job did you like the most?" variant="outlined" />
                <TextField fullWidth label="What part of the job did you like the least?" variant="outlined" />
                <TextField fullWidth label="Did you feel you had the opportunity to grow and develop your skills in this role?" variant="outlined" />
                <TextField fullWidth label="How would you describe your work environment in this role?" variant="outlined" />
                <TextField fullWidth label="Did you feel valued and recognized within this role?" variant="outlined" />
                <TextField fullWidth multiline rows={2} label="What did the company do to make you feel valued and recognized in your role?" variant="outlined" />
              </Stack>
            </Box>

            <Divider />

            {/* Section: Forward-Facing Questions */}
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#023DFB', mb: 2 }}>Forward-Facing Questions</Typography>
              <Stack spacing={2.5}>
                <TextField fullWidth multiline rows={2} label="What advice would you like to give to your team?" variant="outlined" />
                <TextField fullWidth multiline rows={2} label="What would make this a better place to work?" variant="outlined" />
                <TextField fullWidth label="Would you ever consider working here again?" variant="outlined" />
                <TextField fullWidth label="Would you recommend this company to a friend or family member?" variant="outlined" />
                <TextField fullWidth multiline rows={2} label="What is one thing you would change about this company if you could?" variant="outlined" />
                <TextField fullWidth multiline rows={3} label="Is there anything else you would like to add?" variant="outlined" />
              </Stack>
            </Box>

            <Box sx={{ p: 2, bgcolor: '#fffbed', border: '1px solid #ffe58f', borderRadius: 2 }}>
              <Typography variant="caption" sx={{ fontWeight: 700, color: '#856404', display: 'block', mb: 0.5 }}>
                CONFIDENTIALITY NOTICE:
              </Typography>
              <Typography variant="caption" sx={{ color: '#856404', display: 'block', lineHeight: 1.4 }}>
                This contains confidential information and is intended for the sole use of the addressee. Any unauthorized disclosure, distribution, or copying is strictly prohibited. If you have received this in error, please notify the sender immediately. Any unauthorized use, disclosure, or copying of this file may result in legal action.
              </Typography>
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3, bgcolor: '#f8fafc', borderTop: '1px solid #eee' }}>
          <Button onClick={() => setOpenResignation(false)} sx={{ color: 'text.secondary', fontWeight: 600 }}>Cancel</Button>
          <Button variant="contained" onClick={handleResignationSubmit} sx={{ bgcolor: '#023DFB', px: 4, fontWeight: 700, borderRadius: 2 }}>
            Submit Resignation
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
