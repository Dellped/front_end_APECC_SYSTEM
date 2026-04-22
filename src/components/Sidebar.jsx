import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Drawer, List, ListItemButton, ListItemIcon, ListItemText,
  Collapse, IconButton, Box, Typography, Divider, Tooltip, Avatar,
} from '@mui/material';
import apeccLogo from '../../assets/images/APECC-Logo.jpg';
import {
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Person as PersonIcon,
  Badge as BadgeIcon,
  FamilyRestroom as FamilyIcon,
  School as SchoolIcon,
  Work as WorkIcon,
  Payments as PaymentsIcon,
  Receipt as ReceiptIcon,
  AccountBalanceWallet as WalletIcon,
  MoneyOff as DeductionsIcon,
  EventNote as LeavesIcon,
  AccountBalance as TaxIcon,
  ListAlt as AlphalistIcon,
  CloudUpload as UploadIcon,
  ExpandLess,
  ExpandMore,
  ExitToApp as ExitIcon,
  CheckCircle as ClearanceIcon,
  Description as SOAIcon,
  BusinessCenter as HRIcon,
  History as HistoryIcon,
  EmojiPeople as ExitRequestIcon,
  AssignmentInd as AssignmentIndIcon,
  WorkHistory as WorkHistoryIcon,
  CalendarMonth as PeriodIcon,
  TrendingUp as AdjustmentIcon,
  Assessment as ReportsIcon,
  Settings as SettingsIcon,
  AssignmentTurnedIn as AssignmentTurnedInIcon,
  PersonAdd as PersonAddIcon,
  Layers as LayersIcon,
} from '@mui/icons-material';

const DRAWER_WIDTH = 275;
const DRAWER_COLLAPSED = 72;

// ── Palette ──────────────────────────────────────────────────────────────────
const NAV = '#05077E';   // Navy
const IND = '#0241FB';   // Bright Indigo
const ROY = '#4470ED';   // Royal Blue
const PER = '#B4B7D3';   // Periwinkle
const WHT = '#FDFDFC';   // White
const goldAccent = '#d4a843';
// ─────────────────────────────────────────────────────────────────────────────

// Deep Navy → Indigo with subtle Periwinkle shimmer — elegant & not "all blue"
const sidebarGradient = `linear-gradient(175deg, ${NAV} 0%, #08097a 25%, #0b0e9a 55%, #1230d4 80%, ${ROY} 100%)`;

const activeBg = 'rgba(212,168,67,0.14)';
const hoverBg  = 'rgba(253,253,252,0.07)';

const menuConfig = [
  { id: 'home', label: 'Home Dashboard', icon: <DashboardIcon />, path: '/home' },
  {
    id: 'hr',
    label: 'HR Module',
    icon: <HRIcon />,
    children: [
      { id: 'hr-dashboard', label: 'Dashboard', icon: <DashboardIcon />, path: '/hr/dashboard' },
      {
        id: 'hr-onboarding',
        label: 'Onboarding',
        icon: <PersonAddIcon />,
        children: [
          { id: 'hr-onboarding-add', label: 'Add Employee', icon: <PersonAddIcon />, path: '/hr/onboarding/add-employee' },
          { id: 'hr-onboarding-approvals', label: 'Approval Queue', icon: <AssignmentTurnedInIcon />, path: '/hr/onboarding/approvals' },
          { id: 'hr-emp-ats', label: 'Applicant Tracking (ATS)', icon: <PeopleIcon />, path: '/hr/onboarding/applicants' },
        ],
      },
      {
        id: 'hr-employee',
        label: 'Employment Management',
        icon: <PeopleIcon />,
        children: [
          { id: 'hr-emp-master', label: 'Employee Master File', icon: <AssignmentIndIcon />, path: '/hr/employees/master-file' },
          { id: 'hr-emp-profile', label: 'Profile 201', icon: <PersonIcon />, path: '/hr/employees/profile' },
          { id: 'hr-emp-personal', label: 'Personal Information', icon: <PersonIcon />, path: '/hr/employees/personal' },
          { id: 'hr-emp-family', label: 'Family Background', icon: <FamilyIcon />, path: '/hr/employees/family' },
          { id: 'hr-emp-education', label: 'Educational Attainment', icon: <SchoolIcon />, path: '/hr/employees/education' },
          { id: 'hr-emp-work', label: 'Work Experience', icon: <WorkIcon />, path: '/hr/employees/work-experience' },
          { id: 'hr-emp-requirements', label: 'List of Requirements', icon: <AlphalistIcon />, path: '/hr/employees/requirements' },
          { id: 'hr-emp-job-levels', label: 'Job Levels / Ranks', icon: <LayersIcon />, path: '/hr/employees/job-levels' },
        ],
      },
      {
        id: 'hr-payroll',
        label: 'Payroll & Compens...',
        icon: <PaymentsIcon />,
        children: [
          { id: 'hr-pay-history', label: 'Payroll History', icon: <ReceiptIcon />, path: '/hr/payroll/history' },
          { id: 'hr-pay-payslips', label: 'Payslips', icon: <ReceiptIcon />, path: '/hr/payroll/payslips' },
          { id: 'hr-pay-register', label: 'Payroll Register', icon: <ReportsIcon />, path: '/hr/payroll/register' },
          { id: 'hr-pay-salary-adj', label: 'Salary Adjustment', icon: <AdjustmentIcon />, path: '/hr/payroll/salary-adjustment' },
          { id: 'hr-pay-salary-history', label: 'Salary History', icon: <HistoryIcon />, path: '/hr/payroll/salary-history' },
          { id: 'hr-pay-sil', label: 'Service Incentive Leave', icon: <LeavesIcon />, path: '/hr/payroll/sil' },
          { id: 'hr-pay-contributions', label: 'Gov Contributions', icon: <TaxIcon />, path: '/hr/payroll/contributions' },
          { id: 'hr-pay-payroll', label: 'Payroll Run', icon: <PaymentsIcon />, path: '/hr/payroll/payroll' },
        ],
      },
      {
        id: 'hr-leaves',
        label: 'Leaves & Sanctions',
        icon: <LeavesIcon />,
        children: [
          { id: 'hr-leaves-main', label: 'Records & Summary', icon: <WorkHistoryIcon />, path: '/hr/leaves' },
          { id: 'hr-leaves-applications', label: 'Leave Applications', icon: <LeavesIcon />, path: '/hr/leaves/applications' },
          { id: 'hr-leaves-calendar', label: 'Leave Calendar', icon: <PeriodIcon />, path: '/hr/leaves/calendar' },
          { id: 'hr-leaves-credits', label: 'Leave Credits', icon: <LeavesIcon />, path: '/hr/leaves/credits' },
        ],
      },
      {
        id: 'hr-tax',
        label: 'Tax & Reporting',
        icon: <TaxIcon />,
        children: [
          { id: 'hr-tax-alpha', label: 'Alphalist & 2306', icon: <AlphalistIcon />, path: '/hr/tax/alphalist' },
          { id: 'hr-tax-bir-forms', label: 'BIR Forms Module', icon: <SOAIcon />, path: '/hr/tax/bir-forms' },
        ],
      },
      { id: 'hr-audit', label: 'HR Audit Trail', icon: <HistoryIcon />, path: '/hr/audit-trail' },
    ],
  },
  {
    id: 'exit',
    label: 'Offboarding',
    icon: <ExitIcon />,
    children: [
      { id: 'exit-dashboard', label: 'Dashboard', icon: <DashboardIcon />, path: '/exit/dashboard' },
      { id: 'exit-requests', label: 'Exit Requests', icon: <ExitRequestIcon />, path: '/exit/requests' },
      { id: 'exit-list', label: 'List of Exit', icon: <WorkHistoryIcon />, path: '/exit/list' },
      { id: 'exit-clearance', label: 'Clearance Generation', icon: <ClearanceIcon />, path: '/exit/clearance' },
      { id: 'exit-staff-clearance', label: 'Staff Clearance', icon: <AssignmentTurnedInIcon />, path: '/exit/staff-clearance' },
      { id: 'exit-soa', label: 'Statement of Account', icon: <SOAIcon />, path: '/exit/soa' },
      { id: 'exit-withdrawal', label: 'Withdrawal and Membership', icon: <ExitIcon />, path: '/exit/withdrawal' },
      { id: 'exit-audit', label: 'Exit Audit Trail', icon: <HistoryIcon />, path: '/exit/audit-trail' },
    ],
  },
];

export default function Sidebar({ open, onToggle, isMobile }) {
  const [expanded, setExpanded] = useState({ hr: true, exit: false });
  const navigate = useNavigate();
  const location = useLocation();

  const toggleDrawer = onToggle;

  const toggleExpand = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const isActive = (path) => location.pathname === path;
  const isGroupActive = (item) => {
    if (item.path) return isActive(item.path);
    if (item.children) return item.children.some((c) => isGroupActive(c));
    return false;
  };

  const renderMenuItem = (item, depth = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const active = item.path ? isActive(item.path) : isGroupActive(item);

    const button = (
      <ListItemButton
        key={item.id}
        onClick={() => {
          if (hasChildren) {
            toggleExpand(item.id);
            if (!open) onToggle();
          } else if (item.path) {
            navigate(item.path);
            if (isMobile) onToggle();
          }
        }}
        sx={{
          pl: open ? 2 + depth * 2 : 2,
          py: depth === 0 ? 1.1 : 0.75,
          mx: open ? 0.8 : 0.4,
          mb: 0.25,
          borderRadius: '10px',
          position: 'relative',
          background: active
            ? 'linear-gradient(90deg, rgba(255,255,255,0.1) 0%, transparent 100%)'
            : 'transparent',
          border: active ? '1px solid rgba(255, 255, 255, 0.15)' : '1px solid transparent',
          boxShadow: 'none',
          color: active ? goldAccent : `rgba(${PER},0.85)`,
          transition: 'background 0.2s, color 0.2s',
          '&:hover': {
            background: active
              ? 'linear-gradient(90deg, rgba(255,255,255,0.16) 0%, transparent 100%)'
              : `rgba(255, 255, 255, 0.08)`,
            boxShadow: 'none',
            color: active ? goldAccent : WHT,
            transform: 'none',
          },
          ...(active && item.path && {
            '&::after': {
              content: '""',
              position: 'absolute',
              right: 2,
              top: '20%',
              height: '60%',
              width: '4px',
              borderRadius: '4px 0 0 4px',
              background: `linear-gradient(180deg, ${goldAccent}, #e8c96a)`,
              boxShadow: `0 0 10px ${goldAccent}80`,
            },
          }),
          ...(depth === 0 && {
            '&::before': active ? {
              content: '""',
              position: 'absolute',
              left: 0,
              top: '20%',
              height: '60%',
              width: '3px',
              borderRadius: '0 3px 3px 0',
              background: `linear-gradient(180deg, #e8c96a, ${goldAccent})`,
              boxShadow: `0 0 8px ${goldAccent}50`,
            } : {},
          }),
        }}
      >
        <ListItemIcon
          sx={{
            color: active ? goldAccent : `rgba(180,183,211,0.85)`,
            minWidth: open ? 36 : 'auto',
            mr: open ? 1 : 'auto',
            justifyContent: 'center',
            transition: 'color 0.2s',
            '& .MuiSvgIcon-root': {
              fontSize: depth === 0 ? '1.25rem' : '1.05rem',
              filter: active ? `drop-shadow(0 0 4px ${goldAccent}60)` : 'none',
            },
          }}
        >
          {item.icon}
        </ListItemIcon>
        {open && (
          <>
            <ListItemText
              primary={item.label}
              primaryTypographyProps={{
                fontSize: depth === 0 ? '0.86rem' : '0.80rem',
                fontWeight: active ? 700 : (depth === 0 ? 500 : 400),
                letterSpacing: depth === 0 ? '0.01em' : '0',
                noWrap: true,
                color: active ? goldAccent : (depth === 0 ? WHT : `rgba(180,183,211,0.88)`),
              }}
            />
            {hasChildren && (expanded[item.id]
              ? <ExpandLess sx={{ fontSize: '1rem', opacity: 0.6, color: PER }} />
              : <ExpandMore sx={{ fontSize: '1rem', opacity: 0.6, color: PER }} />
            )}
          </>
        )}
      </ListItemButton>
    );

    const wrappedButton = !open && !hasChildren ? (
      <Tooltip key={item.id} title={item.label} placement="right" arrow>
        {button}
      </Tooltip>
    ) : button;

    if (!hasChildren) return wrappedButton;

    return (
      <React.Fragment key={item.id}>
        {!open ? (
          <Tooltip title={item.label} placement="right" arrow>
            {button}
          </Tooltip>
        ) : button}
        {open && (
          <Collapse in={expanded[item.id]} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {item.children.map((child) => renderMenuItem(child, depth + 1))}
            </List>
          </Collapse>
        )}
      </React.Fragment>
    );
  };

  return (
    <Drawer
      variant={isMobile ? 'temporary' : 'permanent'}
      open={open}
      onClose={onToggle}
      sx={{
        width: open ? DRAWER_WIDTH : (isMobile ? 0 : DRAWER_COLLAPSED),
        flexShrink: 0,
        transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        '& .MuiDrawer-paper': {
          width: open ? DRAWER_WIDTH : (isMobile ? 0 : DRAWER_COLLAPSED),
          transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          overflowX: 'hidden',
          background: sidebarGradient,
          borderRight: 'none',
          boxShadow: isMobile && !open ? 'none' : `6px 0 32px rgba(5,7,126,0.45)`,
          visibility: isMobile && !open ? 'hidden' : 'visible',
          // Periwinkle right-edge shimmer
          '&::after': {
            content: '""',
            position: 'absolute',
            right: 0,
            top: 0,
            bottom: 0,
            width: '2px',
            background: `linear-gradient(180deg, transparent 0%, ${PER}50 20%, ${ROY}80 50%, ${PER}50 80%, transparent 100%)`,
          },
        },
      }}
    >
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: open ? 'space-between' : 'center',
          px: open ? 2 : 1,
          py: 1.8,
          background: `linear-gradient(135deg, rgba(5,7,126,0.6) 0%, rgba(2,65,251,0.25) 60%, rgba(68,112,237,0.1) 100%)`,
          borderBottom: `1px solid rgba(180,183,211,0.15)`,
          position: 'relative',
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: 0,
            left: '8%',
            right: '8%',
            height: '1px',
            background: `linear-gradient(90deg, transparent, ${goldAccent}55, ${ROY}40, transparent)`,
          },
        }}
      >
        {open ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box
              sx={{
                width: 42, height: 42, borderRadius: '50%', overflow: 'hidden',
                background: WHT,
                boxShadow: `0 0 0 2px ${goldAccent}60, 0 4px 16px rgba(5,7,126,0.4)`,
                border: `2px solid rgba(212,168,67,0.5)`,
                flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <Box component="img" src={apeccLogo} alt="APECC Logo"
                sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </Box>
            <Box>
              <Typography variant="subtitle2" sx={{
                fontWeight: 800, fontSize: '1.12rem', letterSpacing: '0.07em', lineHeight: 1.2,
                background: `linear-gradient(135deg, ${goldAccent} 0%, #f0d060 35%, ${WHT} 60%, #e8c96a 80%, ${goldAccent} 100%)`,
                backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                filter: `drop-shadow(0 0 6px rgba(212,168,67,0.45))`,
              }}>
                APECC
              </Typography>
              <Typography variant="caption" sx={{
                fontWeight: 600, fontSize: '0.62rem', letterSpacing: '0.12em', textTransform: 'uppercase',
                color: PER, opacity: 0.9,
              }}>
                Management System
              </Typography>
            </Box>
          </Box>
        ) : (
          <Box
            sx={{
              width: 36, height: 36, borderRadius: '50%', overflow: 'hidden',
              background: WHT,
              boxShadow: `0 0 0 2px ${goldAccent}55, 0 4px 12px rgba(5,7,126,0.4)`,
              border: `2px solid rgba(212,168,67,0.4)`,
              flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
            }}
            onClick={toggleDrawer}
          >
            <Box component="img" src={apeccLogo} alt="APECC Logo"
              sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </Box>
        )}
        {open && (
          <IconButton
            onClick={toggleDrawer}
            size="small"
            sx={{
              color: PER,
              background: `rgba(180,183,211,0.08)`,
              borderRadius: '8px',
              width: 32, height: 32,
              border: `1px solid rgba(180,183,211,0.12)`,
              '&:hover': { background: `rgba(180,183,211,0.15)`, color: WHT },
            }}
          >
            <ChevronLeftIcon fontSize="small" />
          </IconButton>
        )}
      </Box>

      {/* ── Navigation ─────────────────────────────────────────────────────── */}
      <Box sx={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', py: 1.5,
        '&::-webkit-scrollbar': { width: '4px' },
        '&::-webkit-scrollbar-thumb': { background: `rgba(180,183,211,0.25)`, borderRadius: '4px' },
        '&::-webkit-scrollbar-track': { background: 'transparent' },
      }}>
        {menuConfig.map((section, idx) => (
          <React.Fragment key={section.id}>
            {idx > 0 && (
              <Box sx={{ mx: open ? 2 : 1, my: 1 }}>
                <Divider sx={{
                  borderColor: 'transparent',
                  background: `linear-gradient(90deg, transparent, ${PER}30, ${ROY}40, ${PER}30, transparent)`,
                  height: '1px', border: 'none',
                }} />
              </Box>
            )}
            {open && section.children && (
              <Box sx={{ px: 3, pt: idx === 0 ? 0.5 : 1, pb: 0.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                {/* Section dot accent */}
                <Box sx={{
                  width: 6, height: 6, borderRadius: '50%',
                  background: `linear-gradient(135deg, ${goldAccent}, #e8c96a)`,
                  boxShadow: `0 0 6px ${goldAccent}60`,
                  flexShrink: 0,
                }} />
                <Typography variant="overline" sx={{
                  fontSize: '0.64rem', fontWeight: 800, letterSpacing: '0.14em',
                  color: PER, opacity: 0.82, textTransform: 'uppercase',
                }}>
                  {section.label}
                </Typography>
              </Box>
            )}
            <List component="nav" disablePadding>
              {section.children
                ? section.children.map((item) => renderMenuItem(item, 0))
                : renderMenuItem(section, 0)
              }
            </List>
          </React.Fragment>
        ))}
      </Box>

      {/* ── Footer ─────────────────────────────────────────────────────────── */}
      <Box
        sx={{
          borderTop: `1px solid rgba(180,183,211,0.12)`,
          background: `linear-gradient(135deg, rgba(5,7,126,0.5) 0%, rgba(2,65,251,0.15) 100%)`,
          px: open ? 2 : 1,
          py: 1.4,
          display: 'flex',
          alignItems: 'center',
          justifyContent: open ? 'flex-start' : 'center',
          gap: 1.5,
        }}
      >
        <Avatar sx={{
          width: 34, height: 34, fontSize: '0.83rem', fontWeight: 800,
          background: `linear-gradient(135deg, ${goldAccent} 0%, #e8c96a 100%)`,
          color: NAV,
          boxShadow: `0 2px 10px rgba(212,168,67,0.45), 0 0 0 2px rgba(212,168,67,0.2)`,
        }}>
          AD
        </Avatar>
        {open && (
          <Box>
            <Typography variant="body2" sx={{ color: WHT, fontWeight: 700, fontSize: '0.83rem', lineHeight: 1.3 }}>
              Admin User
            </Typography>
            <Typography variant="caption" sx={{ color: PER, fontWeight: 500, fontSize: '0.68rem', opacity: 0.85 }}>
              System Administrator
            </Typography>
          </Box>
        )}
      </Box>
    </Drawer>
  );
}
