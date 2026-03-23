import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box, Typography, Breadcrumbs, Link, Chip, Avatar, Tooltip, IconButton,
} from '@mui/material';
import {
  NavigateNext as NavNextIcon,
  Home as HomeIcon,
  AccessTime as ClockIcon,
  Notifications as BellIcon,
  AccountCircle as UserIcon,
  Menu as MenuIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
} from '@mui/icons-material';

const goldAccent = '#d4a843';

const routeMap = {
  '/home': { crumbs: ['Home'] },
  '/hr/dashboard': { crumbs: ['HR', 'Dashboard'] },
  '/hr/applicants': { crumbs: ['HR', 'Employee Management', 'Applicants'] },
  '/hr/employees/list': { crumbs: ['HR', 'Employee Management', 'Employee List'] },
  '/hr/employees/master-file': { crumbs: ['HR', 'Employee Management', 'Master File'] },
  '/hr/employees/employment-details': { crumbs: ['HR', 'Employee Management', 'Employment Details'] },
  '/hr/employees/profile': { crumbs: ['HR', 'Employee Management', 'Employee Profile'] },
  '/hr/employees/personal': { crumbs: ['HR', 'Employee Management', 'Personal Information'] },
  '/hr/employees/family': { crumbs: ['HR', 'Employee Management', 'Family Background'] },
  '/hr/employees/education': { crumbs: ['HR', 'Employee Management', 'Education'] },
  '/hr/employees/work-experience': { crumbs: ['HR', 'Employee Management', 'Work Experience'] },
  '/hr/employees/requirements': { crumbs: ['HR', 'Employee Management', 'Requirements'] },
  '/hr/payroll/history': { crumbs: ['HR', 'Compensation', 'Payroll History'] },
  '/hr/payroll/payslips': { crumbs: ['HR', 'Compensation', 'Payslips'] },
  '/hr/payroll/payroll': { crumbs: ['HR', 'Compensation', 'Payroll Run'] },
  '/hr/payroll/register': { crumbs: ['HR', 'Compensation', 'Payroll Register'] },
  '/hr/payroll/remittances-loans': { crumbs: ['HR', 'Compensation', 'Remittances & Loans'] },
  '/hr/payroll/statutory-setup': { crumbs: ['HR', 'Compensation', 'Statutory Setup'] },
  '/hr/payroll/basic-pay-assignment': { crumbs: ['HR', 'Compensation', 'Basic Pay'] },
  '/hr/payroll/salary-adjustment': { crumbs: ['HR', 'Compensation', 'Salary Adjustment'] },
  '/hr/payroll/allowances': { crumbs: ['HR', 'Compensation', 'Allowances'] },
  '/hr/payroll/salary-history': { crumbs: ['HR', 'Compensation', 'Salary History'] },
  '/hr/payroll/adjustments': { crumbs: ['HR', 'Compensation', 'Payroll Adjustments'] },
  '/hr/payroll/periods': { crumbs: ['HR', 'Compensation', 'Periods'] },
  '/hr/payroll/attendance': { crumbs: ['HR', 'Compensation', 'Attendance & DTR'] },
  '/hr/payroll/sil': { crumbs: ['HR', 'Compensation', 'Service Incentive Leave'] },
  '/hr/payroll/allowances-management': { crumbs: ['HR', 'Compensation', 'Allowances Management'] },
  '/hr/payroll/contributions': { crumbs: ['HR', 'Compensation', 'Gov Contributions'] },
  '/hr/payroll/deductions': { crumbs: ['HR', 'Compensation', 'Deductions & Compliance'] },
  '/hr/leaves': { crumbs: ['HR', 'Leaves & Sanctions', 'Dashboard'] },
  '/hr/leaves/applications': { crumbs: ['HR', 'Leaves & Sanctions', 'Leave Applications'] },
  '/hr/leaves/credits': { crumbs: ['HR', 'Leaves & Sanctions', 'Leave Credits'] },
  '/hr/tax/alphalist': { crumbs: ['HR', 'Tax & Reporting', 'Alphalist & 2306'] },
  '/hr/audit-trail': { crumbs: ['HR', 'Security', 'Audit Trail'] },
  '/exit/dashboard': { crumbs: ['Exit', 'Dashboard'] },
  '/exit/requests': { crumbs: ['Exit', 'Request'] },
  '/exit/clearance': { crumbs: ['Exit', 'Clearance'] },
  '/exit/soa': { crumbs: ['Exit', 'SOA'] },
  '/exit/withdrawal': { crumbs: ['Exit', 'Withdrawal'] },
  '/exit/audit-trail': { crumbs: ['Exit', 'Audit Trail'] },
};

function getTime() {
  return new Date().toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit', hour12: true });
}
function getDate() {
  return new Date().toLocaleDateString('en-PH', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });
}

export default function TopBar({ onMenuClick, isMobile, mode, toggleColorMode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [time, setTime] = React.useState(getTime());
  const isDark = mode === 'dark';

  React.useEffect(() => {
    const timer = setInterval(() => setTime(getTime()), 30000);
    return () => clearInterval(timer);
  }, []);

  const routeInfo = routeMap[location.pathname];
  const crumbs = routeInfo?.crumbs || ['Home'];
  const currentPage = crumbs[crumbs.length - 1];

  const primaryColor = isDark ? '#f8fafc' : '#023DFB';
  const secondaryColor = isDark ? 'rgba(255, 255, 255, 0.65)' : 'rgba(2, 61, 251, 0.65)';
  const bgColor = isDark ? 'rgba(30, 41, 59, 0.95)' : 'rgba(255, 255, 255, 0.95)';
  const borderColor = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(26, 44, 78, 0.08)';

  return (
    <Box
      sx={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        bgcolor: bgColor,
        backdropFilter: 'blur(12px)',
        borderBottom: `1px solid ${borderColor}`,
        boxShadow: isDark ? '0 4px 20px rgba(0, 0, 0, 0.3)' : '0 4px 20px rgba(26, 44, 78, 0.05)',
        px: { xs: 2, sm: 3, md: 4 },
        py: 1.5,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 2,
        minHeight: 64,
        transition: 'background-color 0.3s, border-color 0.3s',
      }}
    >
      {/* Mobile Menu Toggle */}
      {isMobile && (
        <IconButton
          onClick={onMenuClick}
          sx={{
            mr: 1,
            color: primaryColor,
            bgcolor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(2, 61, 251, 0.05)',
            '&:hover': { bgcolor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(2, 61, 251, 0.1)' }
          }}
        >
          <MenuIcon />
        </IconButton>
      )}

      {/* Left: Breadcrumbs + Page Title */}
      <Box sx={{ minWidth: 0, flex: 1 }}>
        {/* Breadcrumbs */}
        <Breadcrumbs
          separator={<NavNextIcon sx={{ fontSize: 14, color: isDark ? 'rgba(255, 255, 255, 0.3)' : 'rgba(2, 61, 251, 0.4)' }} />}
          aria-label="breadcrumb"
          sx={{ 
            mb: 0.25, 
            '& .MuiBreadcrumbs-ol': { flexWrap: 'nowrap' },
            display: { xs: 'none', sm: 'block' } // Hide breadcrumbs on very small screens to save space
          }}
        >
          {/* Home icon */}
          <Tooltip title="Go to Home">
            <Link
              underline="hover"
              onClick={() => navigate('/home')}
              sx={{
                display: 'flex', alignItems: 'center', gap: 0.4,
                color: primaryColor, fontSize: '0.72rem', fontWeight: 600, cursor: 'pointer',
                '&:hover': { color: goldAccent },
              }}
            >
              <HomeIcon sx={{ fontSize: 13 }} />
              Home
            </Link>
          </Tooltip>

          {/* Intermediate crumbs */}
          {crumbs.slice(0, -1).map((crumb, idx) => (
            <Typography
              key={idx}
              variant="caption"
              sx={{ color: secondaryColor, fontSize: '0.72rem', fontWeight: 600, whiteSpace: 'nowrap' }}
            >
              {crumb}
            </Typography>
          ))}

          {/* Current page (active) */}
          <Typography
            variant="caption"
            sx={{ 
              fontSize: '0.72rem', fontWeight: 700, whiteSpace: 'nowrap',
              background: `linear-gradient(135deg, ${goldAccent}, #e8c96a)`,
              backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}
          >
            {currentPage}
          </Typography>
        </Breadcrumbs>

        {/* Page Title */}
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            fontSize: { xs: '0.95rem', sm: '1.05rem' },
            lineHeight: 1.2,
            background: `linear-gradient(135deg, ${goldAccent} 0%, #e8c96a 50%, ${goldAccent} 100%)`,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {currentPage}
        </Typography>
      </Box>

      {/* Right: Date/time + theme toggle + notifications + user */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 }, flexShrink: 0 }}>

        {/* Date & Time */}
        <Box sx={{
          display: { xs: 'none', md: 'flex' }, flexDirection: 'column', alignItems: 'flex-end',
          px: 1.5, py: 0.5, borderRadius: 2,
          bgcolor: isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(2, 61, 251, 0.04)',
          border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(2, 61, 251, 0.06)'}`,
        }}>
          <Typography variant="caption" sx={{ fontWeight: 700, color: primaryColor, fontSize: '0.8rem', lineHeight: 1.2 }}>
            {time}
          </Typography>
          <Typography variant="caption" sx={{ color: secondaryColor, fontSize: '0.65rem', lineHeight: 1.2 }}>
            {getDate()}
          </Typography>
        </Box>

        {/* Theme Toggle */}
        <Tooltip title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}>
          <Box 
            onClick={toggleColorMode}
            sx={{
              width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
              bgcolor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(2, 61, 251, 0.05)', 
              border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(2, 61, 251, 0.08)'}`,
              cursor: 'pointer',
              '&:hover': { bgcolor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(2, 61, 251, 0.1)' },
              transition: 'background 0.2s, transform 0.2s',
              '&:active': { transform: 'scale(0.95)' },
            }}
          >
            {isDark ? (
              <LightModeIcon sx={{ fontSize: 18, color: goldAccent }} />
            ) : (
              <DarkModeIcon sx={{ fontSize: 18, color: '#023DFB' }} />
            )}
          </Box>
        </Tooltip>

        {/* Notification bell */}
        <Tooltip title="Notifications">
          <Box sx={{
            width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
            bgcolor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(2, 61, 251, 0.05)', 
            border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(2, 61, 251, 0.08)'}`,
            cursor: 'pointer', position: 'relative',
            '&:hover': { bgcolor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(2, 61, 251, 0.1)' },
            transition: 'background 0.2s',
          }}>
            <BellIcon sx={{ fontSize: 18, color: primaryColor }} />
            {/* badge */}
            <Box sx={{
              position: 'absolute', top: 6, right: 6,
              width: 8, height: 8, borderRadius: '50%',
              background: `linear-gradient(135deg, ${goldAccent}, #e8c96a)`,
              border: isDark ? '1.5px solid #1e293b' : '1.5px solid rgba(255,255,255,0.9)',
            }} />
          </Box>
        </Tooltip>

        {/* User avatar */}
        <Tooltip title="Admin User">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer',
            px: 1, py: 0.5, borderRadius: 2,
            '&:hover': { bgcolor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(2, 61, 251, 0.05)' }, transition: 'background 0.2s' }}>
            <Avatar sx={{
              width: 34, height: 34,
              background: isDark ? `linear-gradient(135deg, ${goldAccent}, #b08930)` : `linear-gradient(135deg, #023DFB, #1a3a6b)`,
              fontSize: '0.75rem', fontWeight: 700, color: '#fff',
              border: `2px solid ${goldAccent}`,
            }}>
              AD
            </Avatar>
            <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
              <Typography variant="caption" sx={{ fontWeight: 700, color: primaryColor, fontSize: '0.78rem', display: 'block', lineHeight: 1.2 }}>
                Admin
              </Typography>
              <Typography variant="caption" sx={{ color: secondaryColor, fontSize: '0.65rem', lineHeight: 1.2 }}>
                HR Administrator
              </Typography>
            </Box>
          </Box>
        </Tooltip>
      </Box>
    </Box>
  );
}

