import React, { useState, useMemo } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box, useMediaQuery, ThemeProvider, CssBaseline } from '@mui/material';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import { getAppTheme } from './theme';


// Home Page
import Home from './pages/home/Home';

// HR Pages
import HRDashboard from './pages/hr/HRDashboard';
import AddEmployee from './pages/onboarding/AddEmployee';
import ApprovalQueue from './pages/onboarding/ApprovalQueue';
import EmployeeMasterFile from './pages/hr/EmployeeMasterFile';

import ApplicantTracking from './pages/hr/ATS';
import EmployeeProfile from './pages/hr/EmployeeProfile';
import PersonalInfo from './pages/hr/PersonalInfo';
import FamilyBackground from './pages/hr/FamilyBackground';
import EducationalAttainment from './pages/hr/EducationalAttainment';
import WorkExperience from './pages/hr/WorkExperience';
import Requirements from './pages/hr/Requirements';
import JobLevelManagement from './pages/hr/JobLevelManagement';
import PayrollHistory from './pages/hr/PayrollHistory';
import Payslips from './pages/hr/Payslips';
import Payroll from './pages/hr/Payroll';
import PayrollPeriods from './pages/hr/PayrollPeriods';
import EmployeePayrollOverview from './pages/hr/EmployeePayrollOverview';
import GovernmentContributions from './pages/hr/GovernmentContributions';
import LeavesSanctions from './pages/hr/LeavesSanctions';
import LeaveApplications from './pages/hr/LeaveApplications';
import LeaveCredits from './pages/hr/LeaveCredits';
import LeaveCalendar from './pages/hr/LeaveCalendar';
import EmployeeLeaveSummary from './pages/hr/EmployeeLeaveSummary';
import AlphalistForms from './pages/hr/AlphalistForms';
import BIRForms from './pages/hr/BIRForms';
import PayrollRegister from './pages/hr/PayrollRegister';
import SalaryAdjustment from './pages/hr/SalaryAdjustment';
import SalaryHistory from './pages/hr/SalaryHistory';
import ServiceIncentiveLeave from './pages/hr/ServiceIncentiveLeave';

// Exit Member Pages
import ExitDashboard from './pages/exit/ExitDashboard';
import ExitRequest from './pages/exit/ExitRequest';
import ClearanceGeneration from './pages/exit/ClearanceGeneration';
import StatementOfAccount from './pages/exit/StatementOfAccount';
import WithdrawalMembership from './pages/exit/WithdrawalMembership';
import StaffClearance from './pages/exit/StaffClearance';
import ExitAuditTrail from './pages/exit/ExitAuditTrail';
import ListOfExit from './pages/exit/ListOfExit';

// Shared Audit Trails
import HRAuditTrail from './pages/hr/HRAuditTrail';

export default function App() {
  const isMobile = useMediaQuery('(max-width:900px)'); // md is 900px
  
  // Theme state
  const [mode, setMode] = useState(() => {
    const savedMode = localStorage.getItem('app-theme-mode');
    return savedMode || 'light';
  });

  const theme = useMemo(() => getAppTheme(mode), [mode]);

  const toggleColorMode = () => {
    setMode((prevMode) => {
      const newMode = prevMode === 'light' ? 'dark' : 'light';
      localStorage.setItem('app-theme-mode', newMode);
      return newMode;
    });
  };
  
  // Sidebar open by default on desktop, closed on mobile/tablet
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);

  // Sync sidebar state when screen size changes
  React.useEffect(() => {
    setSidebarOpen(!isMobile);
  }, [isMobile]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden' }}>
        <Sidebar 
          open={sidebarOpen} 
          onToggle={() => setSidebarOpen((v) => !v)} 
          isMobile={isMobile}
        />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            minWidth: 0,
            display: 'flex',
            flexDirection: 'column',
            background: mode === 'dark' 
              ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)'
              : 'linear-gradient(135deg, #e8edf5 0%, #dce4f0 25%, #d5dced 50%, #e0e6f0 75%, #edf0f5 100%)',
            transition: 'margin 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            position: 'relative',
          }}
        >
          <TopBar 
            onMenuClick={() => setSidebarOpen(true)} 
            isMobile={isMobile} 
            mode={mode}
            toggleColorMode={toggleColorMode}
          />
          <Box sx={{ flex: 1, overflowY: 'auto', width: '100%', display: 'flex', flexDirection: 'column' }}>
            <Routes>
              <Route path="/" element={<Navigate to="/home" replace />} />
              <Route path="/home" element={<Home />} />
              <Route path="/hr/dashboard" element={<HRDashboard />} />
              <Route path="/hr/onboarding/add-employee" element={<AddEmployee />} />
              <Route path="/hr/onboarding/approvals" element={<ApprovalQueue />} />
              <Route path="/hr/onboarding/applicants" element={<ApplicantTracking />} />
              <Route path="/hr/employees" element={<Navigate to="/hr/employees/master-file" replace />} />
              <Route path="/hr/employees/master-file" element={<EmployeeMasterFile />} />

              <Route path="/hr/employees/profile" element={<EmployeeProfile />} />
              <Route path="/hr/employees/personal" element={<PersonalInfo />} />
              <Route path="/hr/employees/family" element={<FamilyBackground />} />
              <Route path="/hr/employees/education" element={<EducationalAttainment />} />
              <Route path="/hr/employees/work-experience" element={<WorkExperience />} />
              <Route path="/hr/employees/requirements" element={<Requirements />} />
              <Route path="/hr/employees/job-levels" element={<JobLevelManagement />} />
              <Route path="/hr/payroll/history" element={<PayrollHistory />} />
              <Route path="/hr/payroll/overview" element={<EmployeePayrollOverview />} />
              <Route path="/hr/payroll/payslips" element={<Payslips />} />
              <Route path="/hr/payroll/payroll" element={<Payroll />} />
              <Route path="/hr/payroll/register" element={<PayrollRegister />} />
              <Route path="/hr/payroll/salary-adjustment" element={<SalaryAdjustment />} />
              <Route path="/hr/payroll/salary-history" element={<SalaryHistory />} />
              <Route path="/hr/payroll/periods" element={<PayrollPeriods />} />
              <Route path="/hr/payroll/sil" element={<ServiceIncentiveLeave />} />
              <Route path="/hr/payroll/contributions" element={<GovernmentContributions />} />
              <Route path="/hr/leaves" element={<LeavesSanctions />} />
              <Route path="/hr/leaves/applications" element={<LeaveApplications />} />
              <Route path="/hr/leaves/calendar" element={<LeaveCalendar />} />
              <Route path="/hr/leaves/employee-summary" element={<EmployeeLeaveSummary />} />
              <Route path="/hr/leaves/credits" element={<LeaveCredits />} />
              <Route path="/hr/tax/alphalist" element={<AlphalistForms />} />
              <Route path="/hr/tax/bir-forms" element={<BIRForms />} />
              <Route path="/hr/audit-trail" element={<HRAuditTrail />} />
              <Route path="/exit/dashboard" element={<ExitDashboard />} />
              <Route path="/exit/requests" element={<ExitRequest />} />
              <Route path="/exit/clearance" element={<ClearanceGeneration />} />
              <Route path="/exit/staff-clearance" element={<StaffClearance />} />
              <Route path="/exit/soa" element={<StatementOfAccount />} />
              <Route path="/exit/withdrawal" element={<WithdrawalMembership />} />
              <Route path="/exit/audit-trail" element={<ExitAuditTrail />} />
              <Route path="/exit/list" element={<ListOfExit />} />
            </Routes>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}


