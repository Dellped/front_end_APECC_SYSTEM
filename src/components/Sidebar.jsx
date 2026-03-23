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
} from '@mui/icons-material';

const DRAWER_WIDTH = 275;
const DRAWER_COLLAPSED = 72;

const sidebarGradient = 'linear-gradient(180deg, #023DFB 0%, #3065e8 35%, #5c8ddd 70%, #89B1D5 100%)';

const menuConfig = [
  { id: 'home', label: 'Home Dashboard', icon: <DashboardIcon />, path: '/home' },
  {
    id: 'hr',
    label: 'HR Module',
    icon: <HRIcon />,
    children: [
      { id: 'hr-dashboard', label: 'Dashboard', icon: <DashboardIcon />, path: '/hr/dashboard' },
      {
        id: 'hr-employee',
        label: 'Employee Management',
        icon: <PeopleIcon />,
        children: [
          { id: 'hr-emp-ats', label: 'Applicant Tracking (ATS)', icon: <PeopleIcon />, path: '/hr/applicants' },
          { id: 'hr-emp-list', label: 'Employee List', icon: <BadgeIcon />, path: '/hr/employees/list' },
          { id: 'hr-emp-master', label: 'Employee Master File', icon: <AssignmentIndIcon />, path: '/hr/employees/master-file' },
          { id: 'hr-emp-details', label: 'Employment Details', icon: <WorkHistoryIcon />, path: '/hr/employees/employment-details' },
          { id: 'hr-emp-profile', label: 'Employee Profile / 201', icon: <PersonIcon />, path: '/hr/employees/profile' },
          { id: 'hr-emp-personal', label: 'Personal Information', icon: <PersonIcon />, path: '/hr/employees/personal' },
          { id: 'hr-emp-family', label: 'Family Background', icon: <FamilyIcon />, path: '/hr/employees/family' },
          { id: 'hr-emp-education', label: 'Educational Attainment', icon: <SchoolIcon />, path: '/hr/employees/education' },
          { id: 'hr-emp-work', label: 'Work Experience', icon: <WorkIcon />, path: '/hr/employees/work-experience' },
          { id: 'hr-emp-requirements', label: 'List of Requirements', icon: <AlphalistIcon />, path: '/hr/employees/requirements' },
        ],
      },
      {
        id: 'hr-payroll',
        label: 'Payroll & Compensation',
        icon: <PaymentsIcon />,
        children: [
          { id: 'hr-pay-history', label: 'Payroll History', icon: <ReceiptIcon />, path: '/hr/payroll/history' },
          { id: 'hr-pay-overview', label: 'Payroll Overview', icon: <WalletIcon />, path: '/hr/payroll/overview' },
          { id: 'hr-pay-payslips', label: 'Payslips', icon: <ReceiptIcon />, path: '/hr/payroll/payslips' },
          { id: 'hr-pay-register', label: 'Payroll Register', icon: <ReportsIcon />, path: '/hr/payroll/register' },
          { id: 'hr-pay-remittances', label: 'Remittances & Loans', icon: <PaymentsIcon />, path: '/hr/payroll/remittances-loans' },
          { id: 'hr-pay-basic-pay', label: 'Basic Pay Assignment', icon: <PaymentsIcon />, path: '/hr/payroll/basic-pay-assignment' },
          { id: 'hr-pay-salary-adj', label: 'Salary Adjustment', icon: <AdjustmentIcon />, path: '/hr/payroll/salary-adjustment' },
          { id: 'hr-pay-allowances-specific', label: 'Allowances', icon: <PaymentsIcon />, path: '/hr/payroll/allowances' },
          { id: 'hr-pay-salary-history', label: 'Salary History', icon: <HistoryIcon />, path: '/hr/payroll/salary-history' },
          { id: 'hr-pay-statutory-setup', label: 'Statutory Contributions Setup', icon: <SettingsIcon />, path: '/hr/payroll/statutory-setup' },
          { id: 'hr-pay-attendance', label: 'Attendance & DTR', icon: <LeavesIcon />, path: '/hr/payroll/attendance' },
          { id: 'hr-pay-sil', label: 'Service Incentive Leave', icon: <LeavesIcon />, path: '/hr/payroll/sil' },
          { id: 'hr-pay-allowances', label: 'Earnings & Allowances', icon: <PaymentsIcon />, path: '/hr/payroll/allowances-management' },
          { id: 'hr-pay-contributions', label: 'Gov Contributions', icon: <TaxIcon />, path: '/hr/payroll/contributions' },
          { id: 'hr-pay-payroll', label: 'Payroll Run', icon: <PaymentsIcon />, path: '/hr/payroll/payroll' },
          { id: 'hr-pay-adjustments', label: 'Payroll Adjustments', icon: <AdjustmentIcon />, path: '/hr/payroll/adjustments' },
          { id: 'hr-pay-special-earnings', label: 'Special Earnings', icon: <PaymentsIcon />, path: '/hr/payroll/special-earnings' },
          { id: 'hr-pay-reports', label: 'Payroll Reports', icon: <ReportsIcon />, path: '/hr/payroll/reports' },
          { id: 'hr-pay-deductions', label: 'Deductions & Compliance', icon: <DeductionsIcon />, path: '/hr/payroll/deductions' },
        ],
      },
      {
        id: 'hr-leaves',
        label: 'Leaves & Sanctions',
        icon: <LeavesIcon />,
        children: [
          { id: 'hr-leaves-main', label: 'Records & Summary', icon: <WorkHistoryIcon />, path: '/hr/leaves' },
          { id: 'hr-leaves-employee-summary', label: 'Employee Summary', icon: <PersonIcon />, path: '/hr/leaves/employee-summary' },
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
    label: 'Exit Member',
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

// Gold accent and active styles
const goldAccent = '#d4a843';
const activeBg = 'rgba(212, 168, 67, 0.12)';
const hoverBg = 'rgba(139, 26, 26, 0.08)';

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
            if (isMobile) onToggle(); // Close drawer on navigation (mobile)
          }
        }}
        sx={{
          pl: open ? 2 + depth * 2 : 2,
          py: depth === 0 ? 1.2 : 0.85,
          mx: open ? 1 : 0.5,
          mb: 0.3,
          borderRadius: open ? '10px' : '12px',
          position: 'relative',
          background: active ? activeBg : 'transparent',
          color: active ? goldAccent : '#ffffff',
          textShadow: active ? 'none' : '0 1px 3px rgba(0,0,0,0.35)',
          transition: 'all 0.2s ease',
          '&:hover': {
            background: active ? activeBg : hoverBg,
            color: '#ffffff',
            textShadow: '0 1px 4px rgba(0,0,0,0.5)',
          },
          ...(active && item.path && {
            boxShadow: `0 0 18px rgba(212, 168, 67, 0.15)`,
            '&::after': {
              content: '""',
              position: 'absolute',
              right: 0,
              top: '15%',
              height: '70%',
              width: '3px',
              borderRadius: '3px 0 0 3px',
              background: `linear-gradient(180deg, ${goldAccent}, #e8c96a)`,
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
              background: goldAccent,
            } : {},
          }),
        }}
      >
        <ListItemIcon
          sx={{
            color: active ? goldAccent : 'rgba(255,255,255,0.95)',
            filter: active ? 'none' : 'drop-shadow(0 1px 3px rgba(0,0,0,0.4))',
            minWidth: open ? 38 : 'auto',
            mr: open ? 1 : 'auto',
            justifyContent: 'center',
            '& .MuiSvgIcon-root': {
              fontSize: depth === 0 ? '1.3rem' : '1.1rem',
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
                fontSize: depth === 0 ? '0.875rem' : '0.82rem',
                fontWeight: active ? 600 : (depth === 0 ? 500 : 400),
                letterSpacing: depth === 0 ? '0.01em' : '0',
                noWrap: true,
              }}
            />
            {hasChildren && (expanded[item.id] ? <ExpandLess sx={{ fontSize: '1.1rem', opacity: 0.7 }} /> : <ExpandMore sx={{ fontSize: '1.1rem', opacity: 0.7 }} />)}
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
          boxShadow: isMobile && !open ? 'none' : '4px 0 24px rgba(10, 22, 40, 0.35)',
          visibility: isMobile && !open ? 'hidden' : 'visible',
          // Gold right-edge accent
          '&::after': {
            content: '""',
            position: 'absolute',
            right: 0,
            top: 0,
            bottom: 0,
            width: '3px',
            background: `linear-gradient(180deg, transparent 0%, ${goldAccent}40 20%, ${goldAccent} 50%, ${goldAccent}40 80%, transparent 100%)`,
          },
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: open ? 'space-between' : 'center',
          px: open ? 2 : 1,
          py: 1.8,
          background: 'linear-gradient(135deg, rgba(13,27,62,0.5) 0%, rgba(26,58,107,0.3) 50%, rgba(192,57,43,0.08) 100%)',
          borderBottom: `1px solid rgba(212,168,67,0.18)`,
          position: 'relative',
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: 0,
            left: '10%',
            right: '10%',
            height: '1px',
            background: `linear-gradient(90deg, transparent, ${goldAccent}60, transparent)`,
          },
        }}
      >
        {open ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box
              sx={{
                width: 42,
                height: 42,
                borderRadius: '50%',
                overflow: 'hidden',
                background: '#ffffff',
                boxShadow: `0 0 16px rgba(212,168,67,0.35), 0 0 4px rgba(212,168,67,0.2)`,
                border: `2px solid rgba(212,168,67,0.4)`,
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Box
                component="img"
                src={apeccLogo}
                alt="APECC Logo"
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            </Box>
            <Box>
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: 800,
                  fontSize: '1.15rem',
                  letterSpacing: '0.06em',
                  lineHeight: 1.2,
                  background: `linear-gradient(135deg, ${goldAccent} 0%, #e8c96a 30%, #ffffff 60%, #e8c96a 80%, ${goldAccent} 100%)`,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  filter: 'drop-shadow(0 0 6px rgba(212,168,67,0.4))',
                }}
              >
                APECC
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  fontWeight: 600,
                  fontSize: '0.65rem',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  background: `linear-gradient(90deg, ${goldAccent}, #e8c96a)`,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Management System
              </Typography>
            </Box>
          </Box>
        ) : (
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              overflow: 'hidden',
              background: '#ffffff',
              boxShadow: `0 0 12px rgba(212,168,67,0.3)`,
              border: `2px solid rgba(212,168,67,0.35)`,
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
            onClick={toggleDrawer}
          >
            <Box
              component="img"
              src={apeccLogo}
              alt="APECC Logo"
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          </Box>
        )}
        {open && (
          <IconButton
            onClick={toggleDrawer}
            size="small"
            sx={{
              color: 'rgba(255,255,255,0.7)',
              background: 'rgba(255,255,255,0.05)',
              borderRadius: '8px',
              width: 34,
              height: 34,
              '&:hover': {
                background: 'rgba(255,255,255,0.1)',
                color: '#ffffff',
              },
            }}
          >
            <ChevronLeftIcon fontSize="small" />
          </IconButton>
        )}
      </Box>

      {/* Navigation */}
      <Box sx={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', py: 1.5 }}>
        {menuConfig.map((section, idx) => (
          <React.Fragment key={section.id}>
            {idx > 0 && (
              <Divider
                sx={{
                  borderColor: 'rgba(255,255,255,0.06)',
                  my: 1.5,
                  mx: open ? 2 : 1,
                }}
              />
            )}
            {open && section.children && (
              <Typography
                variant="overline"
                sx={{
                  fontSize: '0.67rem',
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                  px: 3,
                  pt: idx === 0 ? 0.5 : 1,
                  pb: 0.5,
                  display: 'block',
                  color: '#ffffff',
                  textShadow: '0 1px 4px rgba(0,0,0,0.35)',
                }}
              >
                {section.label}
              </Typography>
            )}
            <List component="nav" disablePadding>
              {section.children ? section.children.map((item) => renderMenuItem(item, 0)) : renderMenuItem(section, 0)}
            </List>
          </React.Fragment>
        ))}
      </Box>

      {/* Footer */}
      <Box
        sx={{
          borderTop: '1px solid rgba(10,22,40,0.15)',
          px: open ? 2.5 : 1,
          py: 1.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: open ? 'flex-start' : 'center',
          gap: 1.5,
        }}
      >
        <Avatar
          sx={{
            width: 32,
            height: 32,
            fontSize: '0.85rem',
            fontWeight: 800,
            background: 'linear-gradient(135deg, #f1c40f 0%, #d4a843 100%)',
            color: '#0a1628',
            boxShadow: '0 2px 8px rgba(212,168,67,0.4)',
          }}
        >
          AD
        </Avatar>
        {open && (
          <Box>
            <Typography variant="body2" sx={{ color: '#ffffff', fontWeight: 800, fontSize: '0.85rem', lineHeight: 1.2, textShadow: '0 1px 4px rgba(0,0,0,0.3)' }}>
              Admin User
            </Typography>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.85)', fontWeight: 600, fontSize: '0.7rem', textShadow: '0 1px 3px rgba(0,0,0,0.25)' }}>
              System Administrator
            </Typography>
          </Box>
        )}
      </Box>
    </Drawer>
  );
}
