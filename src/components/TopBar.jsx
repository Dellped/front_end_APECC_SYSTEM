import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box, Typography, Breadcrumbs, Link, Avatar, Tooltip, IconButton,
} from '@mui/material';
import {
  NavigateNext as NavNextIcon,
  Home as HomeIcon,
  Notifications as BellIcon,
  Menu as MenuIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
} from '@mui/icons-material';

// ── Palette ──────────────────────────────────────────────────────────────────
const NAV = '#0B3D91';   // Deep Blue
const IND = '#1E40AF';   // Mid Blue
const ROY = '#FF8C00';   // Orange Accent
const PER = '#C0C0C0';   // Silver
const WHT = '#FDFDFC';   // White
const goldAccent = '#FF8C00'; // Orange Accent
// ─────────────────────────────────────────────────────────────────────────────

const routeMap = {
  '/home': { crumbs: ['Home'] },
  '/hr/dashboard': { crumbs: ['HR', 'Dashboard'] },
  '/hr/onboarding/add-employee': { crumbs: ['HR', 'Onboarding', 'Add Employee'] },
  '/hr/onboarding/approvals': { crumbs: ['HR', 'Onboarding', 'Approval Queue'] },
  '/hr/onboarding/applicants': { crumbs: ['HR', 'Onboarding', 'Applicant Tracking (ATS)'] },
  '/hr/employees/master-file': { crumbs: ['HR', 'Employee Management', 'Master File'] },
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
  '/hr/payroll/salary-adjustment': { crumbs: ['HR', 'Compensation', 'Salary Adjustment'] },
  '/hr/payroll/salary-history': { crumbs: ['HR', 'Compensation', 'Salary History'] },
  '/hr/payroll/periods': { crumbs: ['HR', 'Compensation', 'Periods'] },
  '/hr/payroll/sil': { crumbs: ['HR', 'Compensation', 'Service Incentive Leave'] },
  '/hr/payroll/contributions': { crumbs: ['HR', 'Compensation', 'Gov Contributions'] },
  '/hr/payroll/overview': { crumbs: ['HR', 'Compensation', 'Payroll Overview'] },
  '/hr/leaves': { crumbs: ['HR', 'Leaves & Sanctions', 'Dashboard'] },
  '/hr/leaves/applications': { crumbs: ['HR', 'Leaves & Sanctions', 'Leave Applications'] },
  '/hr/leaves/credits': { crumbs: ['HR', 'Leaves & Sanctions', 'Leave Credits'] },
  '/hr/leaves/employee-summary': { crumbs: ['HR', 'Leaves & Sanctions', 'Employee Summary'] },
  '/hr/leaves/calendar': { crumbs: ['HR', 'Leaves & Sanctions', 'Leave Calendar'] },
  '/hr/tax/alphalist': { crumbs: ['HR', 'Tax & Reporting', 'Alphalist & 2306'] },
  '/hr/tax/bir-forms': { crumbs: ['HR', 'Tax & Reporting', 'BIR Forms'] },
  '/hr/audit-trail': { crumbs: ['HR', 'Security', 'Audit Trail'] },
  '/exit/dashboard': { crumbs: ['Exit', 'Dashboard'] },
  '/exit/requests': { crumbs: ['Exit', 'Request'] },
  '/exit/list': { crumbs: ['Exit', 'List of Exit'] },
  '/exit/clearance': { crumbs: ['Exit', 'Clearance'] },
  '/exit/staff-clearance': { crumbs: ['Exit', 'Staff Clearance'] },
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

  // Always use white text since TopBar is always navy
  const textPrimary   = WHT;
  const textSecondary = `rgba(255, 255, 255, 0.65)`;

  // Subtle white glass cards on navy background
  const glassBg       = `rgba(255, 255, 255, 0.10)`;
  const glassBgHover  = `rgba(255, 255, 255, 0.20)`;
  const glassBorder   = `rgba(255, 255, 255, 0.18)`;
  const glassShadowBox    = `inset 0 1px 1px rgba(255,255,255,0.15), 0 4px 14px rgba(0,0,0,0.2)`;
  const glassShadowHover  = `inset 0 1px 1px rgba(255,255,255,0.25), 0 8px 24px rgba(0,0,0,0.3)`;

  return (
    <Box
      sx={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: isDark
          ? `linear-gradient(90deg, #071F4E 0%, #0B3D91 100%)`
          : `linear-gradient(90deg, #0B3D91 0%, #1E40AF 100%)`, // Matches sidebar navy
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        borderBottom: `1px solid rgba(255,255,255,0.12)`,
        boxShadow: `0 4px 24px rgba(7,31,78,0.35)`,
        px: { xs: 2, sm: 3, md: 4 },
        py: 1.4,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 2,
        minHeight: 64,
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      {/* Mobile Menu Toggle */}
      {isMobile && (
        <IconButton
          onClick={onMenuClick}
          sx={{
            mr: 1, color: textPrimary,
            background: glassBg, backdropFilter: 'blur(20px)',
            border: `1px solid ${glassBorder}`, boxShadow: glassShadowBox,
            '&:hover': { background: glassBgHover, boxShadow: glassShadowHover },
          }}
        >
          <MenuIcon />
        </IconButton>
      )}

      {/* Left: Breadcrumbs + Page Title */}
      <Box sx={{ minWidth: 0, flex: 1 }}>
        {/* Breadcrumbs */}
        <Breadcrumbs
          separator={
            <NavNextIcon sx={{ fontSize: 12, color: isDark ? `rgba(192,192,192,0.6)` : `rgba(11,61,145,0.4)` }} />
          }
          aria-label="breadcrumb"
          sx={{
            mb: 0.2,
            '& .MuiBreadcrumbs-ol': { flexWrap: 'nowrap' },
            display: { xs: 'none', sm: 'block' },
          }}
        >
          {/* Home icon */}
          <Tooltip title="Go to Home">
            <Link
              underline="none"
              onClick={() => navigate('/home')}
              sx={{
                display: 'flex', alignItems: 'center', gap: 0.4,
                color: textSecondary, fontSize: '0.70rem', fontWeight: 600, cursor: 'pointer',
                opacity: 0.85,
                '&:hover': { color: goldAccent, opacity: 1 },
                transition: 'color 0.2s, opacity 0.2s',
              }}
            >
              <HomeIcon sx={{ fontSize: 12 }} />
              Home
            </Link>
          </Tooltip>

          {/* Intermediate crumbs */}
          {crumbs.slice(0, -1).map((crumb, idx) => (
            <Typography
              key={idx}
              variant="caption"
              sx={{
                color: textSecondary, fontSize: '0.70rem', fontWeight: 500,
                whiteSpace: 'nowrap', opacity: 0.75,
              }}
            >
              {crumb}
            </Typography>
          ))}

          {/* Active crumb — bright white */}
          <Typography variant="caption" sx={{
            fontSize: '0.72rem', fontWeight: 800, whiteSpace: 'nowrap', letterSpacing: '0.02em',
            color: WHT,
          }}>
            {currentPage}
          </Typography>
        </Breadcrumbs>

        {/* Page Title */}
        <Typography variant="h6" sx={{
          fontWeight: 800,
          fontSize: { xs: '1rem', sm: '1.1rem' },
          lineHeight: 1.2,
          color: WHT,
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          letterSpacing: '-0.01em',
          textShadow: '0 1px 6px rgba(0,0,0,0.2)',
        }}>
          {currentPage}
        </Typography>
      </Box>

      {/* Right: Date/time + theme toggle + notifications + user */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.75, sm: 1.5 }, flexShrink: 0 }}>

        {/* Date & Time — Liquid Glass card */}
        <Box sx={{
          display: { xs: 'none', md: 'flex' }, flexDirection: 'column', alignItems: 'flex-end',
          px: 2, py: 0.6, borderRadius: '14px',
          background: glassBg,
          backdropFilter: 'blur(20px) saturate(180%)',
          border: `1px solid ${glassBorder}`,
          boxShadow: glassShadowBox,
        }}>
          <Typography variant="caption" sx={{ fontWeight: 800, color: textPrimary, fontSize: '0.82rem', lineHeight: 1.2 }}>
            {time}
          </Typography>
          <Typography variant="caption" sx={{ color: textSecondary, fontSize: '0.64rem', lineHeight: 1.2, opacity: 0.85, fontWeight: 500 }}>
            {getDate()}
          </Typography>
        </Box>

        {/* Theme Toggle - Liquid Glass */}
        <Tooltip title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
          <Box
            onClick={toggleColorMode}
            sx={{
              width: 40, height: 40, borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: glassBg,
              backdropFilter: 'blur(20px)',
              border: `1px solid ${glassBorder}`,
              boxShadow: glassShadowBox,
              cursor: 'pointer',
              '&:hover': { background: glassBgHover, transform: 'scale(1.05) translateY(-2px)', boxShadow: glassShadowHover },
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            {isDark
              ? <LightModeIcon sx={{ fontSize: 18, color: WHT, opacity: 0.9 }} />
              : <DarkModeIcon sx={{ fontSize: 18, color: WHT, opacity: 0.9 }} />
            }
          </Box>
        </Tooltip>

        {/* Notification bell - Liquid Glass */}
        <Tooltip title="Notifications">
          <Box sx={{
            width: 40, height: 40, borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: glassBg,
            backdropFilter: 'blur(20px)',
            border: `1px solid ${glassBorder}`,
            boxShadow: glassShadowBox,
            cursor: 'pointer', position: 'relative',
            '&:hover': { background: glassBgHover, transform: 'scale(1.05) translateY(-2px)', boxShadow: glassShadowHover },
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          }}>
            <BellIcon sx={{ fontSize: 19, color: textPrimary, opacity: 0.9 }} />
            {/* notification dot in bright orange */}
            <Box sx={{
              position: 'absolute', top: 9, right: 9,
              width: 8, height: 8, borderRadius: '50%',
              background: `linear-gradient(135deg, #FFA726, #FF8C00)`,
              border: isDark ? `1.5px solid rgba(11,61,145,0.8)` : `1.5px solid rgba(253,253,252,0.8)`,
              boxShadow: `0 0 8px #FF8C00`,
            }} />
          </Box>
        </Tooltip>

        {/* User profile - Liquid Glass Badge */}
        <Tooltip title="Admin User">
          <Box sx={{
            display: 'flex', alignItems: 'center', gap: 1.2, cursor: 'pointer',
            px: 1.2, py: 0.6, borderRadius: '20px',
            background: glassBg,
            backdropFilter: 'blur(20px)',
            border: `1px solid ${glassBorder}`,
            boxShadow: glassShadowBox,
            '&:hover': { background: glassBgHover, transform: 'translateY(-2px) scale(1.02)', boxShadow: glassShadowHover },
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          }}>
            <Avatar sx={{
              width: 30, height: 30,
              background: `linear-gradient(135deg, ${goldAccent} 0%, #E0E0E0 100%)`,
              fontSize: '0.75rem', fontWeight: 800,
              color: NAV,
              border: `1px solid rgba(255,255,255,0.6)`,
              boxShadow: `0 2px 10px rgba(255,140,0,0.4)`,
            }}>
              AD
            </Avatar>
            <Box sx={{ display: { xs: 'none', sm: 'block' }, pr: 0.5 }}>
              <Typography variant="caption" sx={{ fontWeight: 800, color: textPrimary, fontSize: '0.78rem', display: 'block', lineHeight: 1.2, letterSpacing: '0.01em' }}>
                Admin
              </Typography>
              <Typography variant="caption" sx={{ color: textSecondary, fontSize: '0.62rem', lineHeight: 1.2, opacity: 0.9, fontWeight: 500 }}>
                HR Administrator
              </Typography>
            </Box>
          </Box>
        </Tooltip>
      </Box>
    </Box>
  );
}
