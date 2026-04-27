import React, { useState } from 'react';
import {
  Box, Typography, Grid, TextField, Divider, Stack, Paper, Button, MenuItem
} from '@mui/material';
import {
  AssignmentTurnedIn as InterviewIcon,
  CloudUpload as UploadIcon
} from '@mui/icons-material';

export default function ExitInterviewForm({ 
  employee, 
  onCancel, 
  onSubmit, 
  isReadOnly = false, 
  initialData = null 
}) {
  const [formData, setFormData] = useState(initialData || {
    reasons: { whyLeave: '', managerRel: '', peersRel: '', generalOpinion: '', prevention: '' },
    experience: { managementOpinion: '', feedback: '', missingPrograms: '', recognition: '', overall: '' },
    role: { resources: '', training: '', expectations: '', rewardChallenge: '', skillUtilization: '', support: '', workload: '', careerGoals: '', likedMost: '', likedLeast: '', growth: '', environment: '', valued: '', whatMadeValued: '' },
    forward: { advice: '', improvements: '', workAgain: '', recommend: '', oneThingChange: '', additional: '' }
  });

  const [attachment, setAttachment] = useState(null);
  const [attachmentData, setAttachmentData] = useState(null);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      const reader = new FileReader();
      reader.onload = (e) => {
        setAttachment(file);
        setAttachmentData(e.target.result);
      };
      reader.readAsDataURL(file);
    } else if (file) {
      alert("Please upload a PDF file.");
    }
  };

  const handleReasonChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      reasons: { ...prev.reasons, [field]: value }
    }));
  };

  const handleExperienceChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      experience: { ...prev.experience, [field]: value }
    }));
  };

  const handleRoleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      role: { ...prev.role, [field]: value }
    }));
  };

  const handleForwardChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      forward: { ...prev.forward, [field]: value }
    }));
  };

  const renderSectionHeader = (title) => (
    <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0241FB', mb: 2 }}>
      {title}
    </Typography>
  );

  return (
    <Box sx={{ p: isReadOnly ? 0 : 2, bgcolor: isReadOnly ? 'transparent' : '#f8fafc' }}>
      {!isReadOnly && (
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h6" sx={{ fontWeight: 800, color: '#0241FB' }}>
            ASA PHILIPPINES EMPLOYEES CREDIT COOPERATIVE
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
             3RD FL. UNIT 309 PRESTIGE TOWER F. ORTIGAS JR. RD. ORTIGAS CENTER, PASIG CITY
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'center', mt: 2 }}>
            <InterviewIcon color="primary" />
            <Typography variant="h5" sx={{ fontWeight: 900 }}>EXIT INTERVIEW</Typography>
          </Box>
        </Box>
      )}

      <Stack spacing={4}>
        {/* Section: Reasons for Leaving */}
        <Box>
          {renderSectionHeader('Reasons for Leaving')}
          <Stack spacing={2.5}>
            <TextField 
              fullWidth multiline rows={isReadOnly ? 1 : 3} label="Why did you decide to leave the company?" variant="outlined" 
              value={formData.reasons.whyLeave}
              onChange={(e) => handleReasonChange('whyLeave', e.target.value)}
              InputProps={{ readOnly: isReadOnly }}
            />
            <TextField 
              fullWidth label="Did you get along with your direct manager?" variant="outlined" 
              value={formData.reasons.managerRel}
              onChange={(e) => handleReasonChange('managerRel', e.target.value)}
              InputProps={{ readOnly: isReadOnly }}
            />
            <TextField 
              fullWidth label="Did you get along with your peers?" variant="outlined" 
              value={formData.reasons.peersRel}
              onChange={(e) => handleReasonChange('peersRel', e.target.value)}
              InputProps={{ readOnly: isReadOnly }}
            />
            <TextField 
              fullWidth multiline rows={isReadOnly ? 1 : 2} label="In general, what do you think about working at our company?" variant="outlined" 
              value={formData.reasons.generalOpinion}
              onChange={(e) => handleReasonChange('generalOpinion', e.target.value)}
              InputProps={{ readOnly: isReadOnly }}
            />
            <TextField 
              fullWidth multiline rows={isReadOnly ? 1 : 2} label="Is there anything we could have done to prevent you from leaving?" variant="outlined" 
              value={formData.reasons.prevention}
              onChange={(e) => handleReasonChange('prevention', e.target.value)}
              InputProps={{ readOnly: isReadOnly }}
            />
          </Stack>
        </Box>

        <Divider />

        {/* Section: Employee Experience */}
        <Box>
          {renderSectionHeader('Employee Experience')}
          <Stack spacing={2.5}>
            <TextField 
              fullWidth multiline rows={isReadOnly ? 1 : 2} label="What did you think of the way you were managed?" variant="outlined" 
              value={formData.experience.managementOpinion}
              onChange={(e) => handleExperienceChange('managementOpinion', e.target.value)}
              InputProps={{ readOnly: isReadOnly }}
            />
            <TextField 
              fullWidth label="Did you receive frequent, constructive feedback from your manager?" variant="outlined" 
              value={formData.experience.feedback}
              onChange={(e) => handleExperienceChange('feedback', e.target.value)}
              InputProps={{ readOnly: isReadOnly }}
            />
            <TextField 
              fullWidth multiline rows={isReadOnly ? 1 : 2} label="What benefits or programs did you feel were missing from the organization?" variant="outlined" 
              value={formData.experience.missingPrograms}
              onChange={(e) => handleExperienceChange('missingPrograms', e.target.value)}
              InputProps={{ readOnly: isReadOnly }}
            />
            <TextField 
              fullWidth label="Were you recognized enough for your accomplishments?" variant="outlined" 
              value={formData.experience.recognition}
              onChange={(e) => handleExperienceChange('recognition', e.target.value)}
              InputProps={{ readOnly: isReadOnly }}
            />
            <TextField 
              fullWidth multiline rows={isReadOnly ? 1 : 2} label="How was your overall experience working for this company?" variant="outlined" 
              value={formData.experience.overall}
              onChange={(e) => handleExperienceChange('overall', e.target.value)}
              InputProps={{ readOnly: isReadOnly }}
            />
          </Stack>
        </Box>

        <Divider />

        {/* Section: Role-Specific Questions */}
        <Box>
          {renderSectionHeader('Role-Specific Questions')}
          <Stack spacing={2.5}>
            <TextField 
              fullWidth label="Did you feel you had all the resources you needed to do your work here?" variant="outlined" 
              value={formData.role.resources}
              onChange={(e) => handleRoleChange('resources', e.target.value)}
              InputProps={{ readOnly: isReadOnly }}
            />
            <TextField 
              fullWidth multiline rows={isReadOnly ? 1 : 2} label="Did you receive enough training/ Were you given the training and resources you needed to succeed in this role?" variant="outlined" 
              value={formData.role.training}
              onChange={(e) => handleRoleChange('training', e.target.value)}
              InputProps={{ readOnly: isReadOnly }}
            />
            <TextField 
              fullWidth label="Did the role meet your expectations?" variant="outlined" 
              value={formData.role.expectations}
              onChange={(e) => handleRoleChange('expectations', e.target.value)}
              InputProps={{ readOnly: isReadOnly }}
            />
            <TextField 
              fullWidth multiline rows={isReadOnly ? 1 : 2} label="What did you like about your work? Was it rewarding, challenging, or too easy?" variant="outlined" 
              value={formData.role.rewardChallenge}
              onChange={(e) => handleRoleChange('rewardChallenge', e.target.value)}
              InputProps={{ readOnly: isReadOnly }}
            />
            <TextField 
              fullWidth multiline rows={isReadOnly ? 1 : 2} label="Did you feel that your skills and talents were effectively utilized in your position?" variant="outlined" 
              value={formData.role.skillUtilization}
              onChange={(e) => handleRoleChange('skillUtilization', e.target.value)}
              InputProps={{ readOnly: isReadOnly }}
            />
            <TextField 
              fullWidth label="Did you feel supported by your manager and colleagues in your role?" variant="outlined" 
              value={formData.role.support}
              onChange={(e) => handleRoleChange('support', e.target.value)}
              InputProps={{ readOnly: isReadOnly }}
            />
            <TextField 
              fullWidth label="How did you feel about your workload? (Too heavy, too light, or just right?)" variant="outlined" 
              value={formData.role.workload}
              onChange={(e) => handleRoleChange('workload', e.target.value)}
              InputProps={{ readOnly: isReadOnly }}
            />
            <TextField 
              fullWidth multiline rows={isReadOnly ? 1 : 2} label="How satisfied were you with your role in relation to your career goals and aspirations?" variant="outlined" 
              value={formData.role.careerGoals}
              onChange={(e) => handleRoleChange('careerGoals', e.target.value)}
              InputProps={{ readOnly: isReadOnly }}
            />
            <TextField 
              fullWidth label="What part of the job did you like the most?" variant="outlined" 
              value={formData.role.likedMost}
              onChange={(e) => handleRoleChange('likedMost', e.target.value)}
              InputProps={{ readOnly: isReadOnly }}
            />
            <TextField 
              fullWidth label="What part of the job did you like the least?" variant="outlined" 
              value={formData.role.likedLeast}
              onChange={(e) => handleRoleChange('likedLeast', e.target.value)}
              InputProps={{ readOnly: isReadOnly }}
            />
            <TextField 
              fullWidth label="Did you feel you had the opportunity to grow and develop your skills in this role?" variant="outlined" 
              value={formData.role.growth}
              onChange={(e) => handleRoleChange('growth', e.target.value)}
              InputProps={{ readOnly: isReadOnly }}
            />
            <TextField 
              fullWidth label="How would you describe your work environment in this role?" variant="outlined" 
              value={formData.role.environment}
              onChange={(e) => handleRoleChange('environment', e.target.value)}
              InputProps={{ readOnly: isReadOnly }}
            />
            <TextField 
              fullWidth label="Did you feel valued and recognized within this role?" variant="outlined" 
              value={formData.role.valued}
              onChange={(e) => handleRoleChange('valued', e.target.value)}
              InputProps={{ readOnly: isReadOnly }}
            />
            <TextField 
              fullWidth multiline rows={isReadOnly ? 1 : 2} label="What did the company do to make you feel valued and recognized in your role?" variant="outlined" 
              value={formData.role.whatMadeValued}
              onChange={(e) => handleRoleChange('whatMadeValued', e.target.value)}
              InputProps={{ readOnly: isReadOnly }}
            />
          </Stack>
        </Box>

        <Divider />

        {/* Section: Forward-Facing Questions */}
        <Box>
          {renderSectionHeader('Forward-Facing Questions')}
          <Stack spacing={2.5}>
            <TextField 
              fullWidth multiline rows={isReadOnly ? 1 : 2} label="What advice would you like to give to your team?" variant="outlined" 
              value={formData.forward.advice}
              onChange={(e) => handleForwardChange('advice', e.target.value)}
              InputProps={{ readOnly: isReadOnly }}
            />
            <TextField 
              fullWidth multiline rows={isReadOnly ? 1 : 2} label="What would make this a better place to work?" variant="outlined" 
              value={formData.forward.improvements}
              onChange={(e) => handleForwardChange('improvements', e.target.value)}
              InputProps={{ readOnly: isReadOnly }}
            />
            <TextField 
              fullWidth label="Would you ever consider working here again?" variant="outlined" 
              value={formData.forward.workAgain}
              onChange={(e) => handleForwardChange('workAgain', e.target.value)}
              InputProps={{ readOnly: isReadOnly }}
            />
            <TextField 
              fullWidth label="Would you recommend this company to a friend or family member?" variant="outlined" 
              value={formData.forward.recommend}
              onChange={(e) => handleForwardChange('recommend', e.target.value)}
              InputProps={{ readOnly: isReadOnly }}
            />
            <TextField 
              fullWidth multiline rows={isReadOnly ? 1 : 2} label="What is one thing you would change about this company if you could?" variant="outlined" 
              value={formData.forward.oneThingChange}
              onChange={(e) => handleForwardChange('oneThingChange', e.target.value)}
              InputProps={{ readOnly: isReadOnly }}
            />
            <TextField 
              fullWidth multiline rows={isReadOnly ? 1 : 3} label="Is there anything else you would like to add?" variant="outlined" 
              value={formData.forward.additional}
              onChange={(e) => handleForwardChange('additional', e.target.value)}
              InputProps={{ readOnly: isReadOnly }}
            />
          </Stack>
        </Box>

        {isReadOnly && (
           <Box sx={{ p: 2, bgcolor: '#fffbed', border: '1px solid #ffe58f', borderRadius: 2 }}>
             <Typography variant="caption" sx={{ fontWeight: 700, color: '#856404', display: 'block', mb: 0.5 }}>
               CONFIDENTIALITY NOTICE:
             </Typography>
             <Typography variant="caption" sx={{ color: '#856404', display: 'block', lineHeight: 1.4 }}>
               This contains confidential information and is intended for the sole use of the addressee. Any unauthorized disclosure, distribution, or copying is strictly prohibited.
             </Typography>
           </Box>
        )}

        {!isReadOnly && (
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
            <Button
              component="label"
              variant="outlined"
              startIcon={<UploadIcon />}
              sx={{ fontWeight: 600, borderRadius: 2, borderColor: 'rgba(0,0,0,0.15)', color: 'text.secondary' }}
            >
              {attachment ? attachment.name : 'Upload Resignation Letter (PDF)'}
              <input
                type="file"
                hidden
                accept="application/pdf"
                onChange={handleFileUpload}
              />
            </Button>
            <Stack direction="row" spacing={2}>
              <Button onClick={onCancel} sx={{ color: 'text.secondary', fontWeight: 600 }}>Cancel</Button>
              <Button 
                variant="contained" 
                onClick={() => {
                  const mockPath = attachment ? `/uploaded_files/${attachment.name}` : null;
                  if (mockPath) console.log(`Simulating file save to: public${mockPath}`);
                  onSubmit({ 
                    ...formData, 
                    attachment: attachmentData, 
                    fileName: attachment?.name,
                    savedPath: mockPath 
                  });
                }} 
                sx={{ background: 'linear-gradient(135deg, #05077E 0%, #0241FB 60%, #4470ED 100%)', px: 4, fontWeight: 700, borderRadius: 2 }}
              >
                Submit Resignation
              </Button>
            </Stack>
          </Box>
        )}
      </Stack>
    </Box>
  );
}
