import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Drawer, List, ListItemButton, ListItemIcon, ListItemText,
  Collapse, Box, Tooltip, Typography, IconButton,
} from '@mui/material';
import apeccLogo from '../../assets/images/APECC-Logo.jpg';
import bottomLogo from '../../assets/images/bottomlogo.png';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Person as PersonIcon,
  FamilyRestroom as FamilyIcon,
  School as SchoolIcon,
  Work as WorkIcon,
  Payments as PaymentsIcon,
  Receipt as ReceiptIcon,
  EventNote as LeavesIcon,
  AccountBalance as TaxIcon,
  ListAlt as AlphalistIcon,
  ExpandLess,
  ExpandMore,
  ExitToApp as ExitIcon,
  Description as SOAIcon,
  History as HistoryIcon,
  EmojiPeople as ExitRequestIcon,
  AssignmentInd as AssignmentIndIcon,
  WorkHistory as WorkHistoryIcon,
  CalendarMonth as PeriodIcon,
  TrendingUp as AdjustmentIcon,
  Assessment as ReportsIcon,
  AssignmentTurnedIn as AssignmentTurnedInIcon,
  PersonAdd as PersonAddIcon,
  Layers as LayersIcon,
  ChevronLeft as ChevronLeftIcon,
  Menu as MenuIcon,
} from '@mui/icons-material';
import { LogOut } from 'lucide-react';

const DRAWER_WIDTH    = 220;
const DRAWER_COLLAPSED = 68;

const NAVY      = '#1e3a8a';
const BLUE      = '#1d4ed8';
const RED       = '#e32222';
const ACTIVE_BG = '#dbeafe';

// ─── Menu config — DO NOT CHANGE LABELS ────────────────────────────────────────
const menuConfig = [
  { id: 'home', label: 'Dashboard', icon: <DashboardIcon />, path: '/home' },
  // ── HR / Members children promoted to top level ──
  { id: 'hr-dashboard', label: 'Dashboard', icon: <DashboardIcon />, path: '/hr/dashboard' },
  {
    id: 'hr-onboarding',
    label: 'Onboarding',
    icon: <PersonAddIcon />,
    children: [
      { id: 'hr-onboarding-add',       label: 'Add Employee',             icon: <PersonAddIcon />,          path: '/hr/onboarding/add-employee' },
      { id: 'hr-onboarding-approvals', label: 'Approval Queue',           icon: <AssignmentTurnedInIcon />, path: '/hr/onboarding/approvals' },
      { id: 'hr-emp-ats',              label: 'Applicant Tracking (ATS)', icon: <PeopleIcon />,             path: '/hr/onboarding/applicants' },
    ],
  },
  {
    id: 'hr-employee',
    label: 'Employment Management',
    icon: <PeopleIcon />,
    children: [
      { id: 'hr-emp-master',       label: 'Employee Master File',   icon: <AssignmentIndIcon />, path: '/hr/employees/master-file' },
      { id: 'hr-emp-profile',      label: 'Profile 201',            icon: <PersonIcon />,        path: '/hr/employees/profile' },
      { id: 'hr-emp-personal',     label: 'Personal Information',   icon: <PersonIcon />,        path: '/hr/employees/personal' },
      { id: 'hr-emp-family',       label: 'Family Background',      icon: <FamilyIcon />,        path: '/hr/employees/family' },
      { id: 'hr-emp-education',    label: 'Educational Attainment', icon: <SchoolIcon />,        path: '/hr/employees/education' },
      { id: 'hr-emp-work',         label: 'Work Experience',        icon: <WorkIcon />,          path: '/hr/employees/work-experience' },
      { id: 'hr-emp-requirements', label: 'List of Requirements',   icon: <AlphalistIcon />,     path: '/hr/employees/requirements' },
      { id: 'hr-emp-job-levels',   label: 'Job Levels / Ranks',     icon: <LayersIcon />,        path: '/hr/employees/job-levels' },
    ],
  },
  {
    id: 'hr-payroll',
    label: 'Payroll & Compens...',
    icon: <PaymentsIcon />,
    children: [
      { id: 'hr-pay-history',        label: 'Payroll History',         icon: <ReceiptIcon />,    path: '/hr/payroll/history' },
      { id: 'hr-pay-payslips',       label: 'Payslips',                icon: <ReceiptIcon />,    path: '/hr/payroll/payslips' },
      { id: 'hr-pay-register',       label: 'Payroll Register',        icon: <ReportsIcon />,    path: '/hr/payroll/register' },
      { id: 'hr-pay-salary-adj',     label: 'Salary Adjustment',       icon: <AdjustmentIcon />, path: '/hr/payroll/salary-adjustment' },
      { id: 'hr-pay-salary-history', label: 'Salary History',          icon: <HistoryIcon />,    path: '/hr/payroll/salary-history' },
      { id: 'hr-pay-sil',            label: 'Service Incentive Leave', icon: <LeavesIcon />,     path: '/hr/payroll/sil' },
      { id: 'hr-pay-contributions',  label: 'Gov Contributions',       icon: <TaxIcon />,        path: '/hr/payroll/contributions' },
      { id: 'hr-pay-payroll',        label: 'Payroll Run',             icon: <PaymentsIcon />,   path: '/hr/payroll/payroll' },
      { id: 'hr-pay-adj-lwop',       label: 'Payroll Adjustment',      icon: <AdjustmentIcon />, path: '/hr/payroll/adjustment-lwop' },
    ],
  },
  {
    id: 'hr-leaves',
    label: 'Leaves & Sanctions',
    icon: <LeavesIcon />,
    children: [
      { id: 'hr-leaves-main',         label: 'Records & Summary',  icon: <WorkHistoryIcon />, path: '/hr/leaves' },
      { id: 'hr-leaves-applications', label: 'Leave Applications', icon: <LeavesIcon />,      path: '/hr/leaves/applications' },
      { id: 'hr-leaves-calendar',     label: 'Leave Calendar',     icon: <PeriodIcon />,      path: '/hr/leaves/calendar' },
      { id: 'hr-leaves-credits',      label: 'Leave Credits',      icon: <LeavesIcon />,      path: '/hr/leaves/credits' },
    ],
  },
  {
    id: 'hr-tax',
    label: 'Tax & Reporting',
    icon: <TaxIcon />,
    children: [
      { id: 'hr-tax-alpha',     label: 'Alphalist & 2306', icon: <AlphalistIcon />, path: '/hr/tax/alphalist' },
      { id: 'hr-tax-bir-forms', label: 'BIR Forms Module', icon: <SOAIcon />,       path: '/hr/tax/bir-forms' },
    ],
  },
  { id: 'hr-audit', label: 'HR Audit Trail', icon: <HistoryIcon />, path: '/hr/audit-trail' },
  {
    id: 'exit',
    label: 'Exit Management',
    icon: <ExitIcon />,
    children: [
      { id: 'exit-dashboard',       label: 'Dashboard',                 icon: <DashboardIcon />,          path: '/exit/dashboard' },
      { id: 'exit-requests',        label: 'Exit Requests',             icon: <ExitRequestIcon />,        path: '/exit/requests' },
      { id: 'exit-list',            label: 'List of Exit',              icon: <WorkHistoryIcon />,        path: '/exit/list' },
      { id: 'exit-staff-clearance', label: 'Staff Clearance Tracker',  icon: <AssignmentTurnedInIcon />, path: '/exit/staff-clearance' },
      { id: 'exit-soa',             label: 'Statement of Account',      icon: <SOAIcon />,                path: '/exit/soa' },
      { id: 'exit-withdrawal',      label: 'Withdrawal and Membership', icon: <ExitIcon />,               path: '/exit/withdrawal' },
      { id: 'exit-audit',           label: 'Exit Audit Trail',          icon: <HistoryIcon />,            path: '/exit/audit-trail' },
    ],
  },
];

// ─── Component ─────────────────────────────────────────────────────────────────
export default function Sidebar({ open, onToggle, isMobile }) {
  const [expanded, setExpanded] = useState({ hr: true, exit: false });
  const navigate = useNavigate();
  const location = useLocation();

  const toggleExpand = (id) =>
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));

  const isActive = (path) => location.pathname === path;
  const isGroupActive = (item) => {
    if (item.path)     return isActive(item.path);
    if (item.children) return item.children.some((c) => isGroupActive(c));
    return false;
  };

  const renderMenuItem = (item, depth = 0) => {
    const hasChildren = Boolean(item.children?.length);
    const active      = item.path ? isActive(item.path) : isGroupActive(item);

    const button = (
      <ListItemButton
        key={item.id}
        onClick={() => {
          if (hasChildren) {
            toggleExpand(item.id);
            if (!open && !isMobile) onToggle();
          } else if (item.path) {
            navigate(item.path);
            if (isMobile) onToggle();
          }
        }}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: open ? 2 : 0,
          // Flush left, rounded right — active left border sits at the very edge
          pl: open ? 1.5 + depth * 1.5 : 1.5,
          pr: open ? 2 : 1.5,
          py: 1.2,
          borderRadius: '0 24px 24px 0',  // right-side rounded only
          mr: open ? 2 : 1,
          mb: 0.4,
          // Active indicator: thick blue bar on left edge + light-blue fill
          borderLeft: active ? `5px solid ${BLUE}` : '5px solid transparent',
          bgcolor: active ? ACTIVE_BG : 'transparent',
          color:   active ? BLUE      : NAVY,
          transition: 'all 0.2s ease',
          '&:hover': { bgcolor: active ? ACTIVE_BG : '#eff6ff' },
        }}
      >
        <ListItemIcon sx={{ color: 'inherit', minWidth: 'auto', justifyContent: 'center' }}>
          {React.cloneElement(item.icon, { sx: { fontSize: 24 } })}
        </ListItemIcon>
        {open && (
          <>
            <ListItemText
              primary={item.label}
              primaryTypographyProps={{
                fontSize:   depth === 0 ? '1rem' : '0.875rem',
                fontWeight: active ? 700 : 600,
                color:      'inherit',
              }}
            />
            {hasChildren && (
              expanded[item.id]
                ? <ExpandLess sx={{ color: 'inherit' }} />
                : <ExpandMore sx={{ color: 'inherit' }} />
            )}
          </>
        )}
      </ListItemButton>
    );

    const wrapped = !open && !hasChildren
      ? <Tooltip key={item.id} title={item.label} placement="right" arrow>{button}</Tooltip>
      : button;

    if (!hasChildren) return wrapped;

    return (
      <React.Fragment key={item.id}>
        {!open
          ? <Tooltip title={item.label} placement="right" arrow>{button}</Tooltip>
          : button
        }
        {open && (
          <Collapse in={expanded[item.id]} timeout="auto" unmountOnExit>
            <Box>
              {item.children.map((child) => renderMenuItem(child, depth + 1))}
            </Box>
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
      ModalProps={{ keepMounted: true }}
      sx={{
        width: isMobile ? 'auto' : (open ? DRAWER_WIDTH : DRAWER_COLLAPSED),
        flexShrink: 0,
        boxSizing: 'border-box',
        overflowX: 'hidden',
        ...(!isMobile && { transition: 'width 0.3s cubic-bezier(0.4,0,0.2,1)' }),
        '& .MuiDrawer-paper': {
          width: isMobile ? DRAWER_WIDTH : (open ? DRAWER_WIDTH : DRAWER_COLLAPSED),
          transition: 'width 0.3s cubic-bezier(0.4,0,0.2,1)',
          overflowX: 'hidden',
          overflowY: 'hidden',
          bgcolor: 'white',
          borderRight: 'none',
          // Left-side rounded corners — sidebar floats with visible left edge
          borderTopLeftRadius: '32px',
          borderBottomLeftRadius: '32px',
          boxShadow: '-4px 0 30px rgba(0,0,0,0.12)',
          boxSizing: 'border-box',
          visibility: isMobile && !open ? 'hidden' : 'visible',
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      {/* ══════════════════════════════════════════════════
          HEADER — Navy logo section + SVG diagonal red strip
      ══════════════════════════════════════════════════ */}

      {/* Navy section with logo */}
      <Box
        sx={{
          flexShrink: 0,
          bgcolor: NAVY,
          borderTopLeftRadius: '32px',
          pt: open ? 3.5 : 1.5,
          pb: open ? 3   : 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
        }}
      >
        <Box
          component="img"
          src={apeccLogo}
          alt="APECC Logo"
          onClick={!open ? onToggle : undefined}
          sx={{
            width:        open ? 100 : 44,
            height:       open ? 100 : 44,
            borderRadius: '50%',
            objectFit:    'cover',
            border:       '3px solid white',
            cursor:       !open ? 'pointer' : 'default',
            transition:   'all 0.3s',
            boxShadow:    '0 4px 16px rgba(0,0,0,0.3)',
          }}
        />

        {/* Collapse toggle button */}
        {open && (
          <IconButton
            onClick={onToggle}
            size="small"
            sx={{
              position: 'absolute',
              bottom: 8,
              right: 10,
              zIndex: 3,
              bgcolor: 'rgba(255,255,255,0.18)',
              color: 'white',
              width: 26,
              height: 26,
              '&:hover': { bgcolor: 'rgba(255,255,255,0.32)' },
            }}
          >
            <ChevronLeftIcon sx={{ fontSize: 18 }} />
          </IconButton>
        )}
      </Box>

      {/* SVG diagonal transition: navy → red strip → white (transparent)
          Math:  viewBox 280×36
          Navy polygon:  (0,0)→(280,0)→(280,16)→(0,36)   slope = -20/280
          Red  polygon:  (0,28)→(280,8)→(280,16)→(0,36)   same slope ✓  thickness = 8px uniform */}
      <Box sx={{ lineHeight: 0, flexShrink: 0 }}>
        <svg
          viewBox="0 0 280 36"
          preserveAspectRatio="none"
          style={{ width: '100%', height: '36px', display: 'block' }}
        >
          {/* Navy fills top portion, creating diagonal bottom edge */}
          <polygon points="0,0 280,0 280,16 0,36" fill={NAVY} />
          {/* Red strip — perfectly parallel, 8px thick */}
          <polygon points="0,28 280,8 280,16 0,36" fill={RED} />
        </svg>
      </Box>

      {/* ══════════════════════════════════════════════════
          MENU — scrollable, full list
      ══════════════════════════════════════════════════ */}
      <Box
        sx={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          pt: 1.5,
          pb: 1,
          '&::-webkit-scrollbar':       { width: '3px' },
          '&::-webkit-scrollbar-thumb': { bgcolor: 'rgba(0,0,0,0.08)', borderRadius: '4px' },
        }}
      >
        {menuConfig.map((item) => renderMenuItem(item, 0))}
      </Box>

      {/* ══════════════════════════════════════════════════
          BOTTOM — wave curve into navy illustration area
      ══════════════════════════════════════════════════ */}
      {open && (
        <Box
          sx={{
            flexShrink: 0,
            position: 'relative',
            height: 200,
            borderBottomLeftRadius: '32px',   // ← LEFT side to match the drawer paper
            overflow: 'hidden',
          }}
        >
          {/* Navy fill */}
          <Box sx={{ position: 'absolute', inset: 0, bgcolor: NAVY }} />

          {/* White wave that scoops down from the menu area */}
          <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', lineHeight: 0, zIndex: 2 }}>
            <svg
              viewBox="0 0 280 56"
              preserveAspectRatio="none"
              style={{ width: '100%', height: '56px', display: 'block' }}
              fill="none"
            >
              <path d="M0 0 C80 56 200 56 280 0 L280 0 L0 0 Z" fill="white" />
            </svg>
          </Box>

          {/* Bottom illustration — clean house/stars/plant asset */}
          <Box
            sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              zIndex: 1,
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'center',
            }}
          >
            <Box
              component="img"
              src={bottomLogo}
              alt="APECC Illustration"
              sx={{
                width: '100%',
                objectFit: 'contain',
                objectPosition: 'bottom center',
              }}
            />
          </Box>
        </Box>
      )}
    </Drawer>
  );
}
