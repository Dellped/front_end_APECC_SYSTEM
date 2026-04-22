import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Grid, Card, CardContent, Typography, Avatar,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  IconButton, Tooltip, Chip,
} from '@mui/material';
import {
  People as PeopleIcon,
  ExitToApp as ExitIcon,
  Dashboard as DashboardIcon,
  ChevronRight as ArrowIcon,
  TrendingUp as TrendingIcon,
  EventNote as EventIcon,
  Payments as VoluntaryIcon,
} from '@mui/icons-material';
import { employees, exitMembers, leaveRecords } from '../../data/mockData';

const goldAccent = '#d4a843';
const NAV = '#05077E';
const IND = '#0241FB';
const ROY = '#4470ED';
const PER = '#B4B7D3';
const formatCurrency = (val) => `₱${val.toLocaleString('en-PH', { minimumFractionDigits: 2 })}`;

export default function Home() {
  const navigate = useNavigate();

  const totalEmployees = employees.length;
  const activeEmployees = employees.filter(e => e.status === 'Active').length;
  const pendingLeaves = leaveRecords.filter(l => l.status === 'Pending').length;
  const totalExitSettlement = exitMembers.reduce((sum, m) => sum + m.totalAmount, 0);

  const modules = [
    {
      title: 'HR Module',
      desc: 'Employee Management, Payroll & Tax',
      path: '/hr/dashboard',
      icon: <PeopleIcon />,
      stats: `${activeEmployees} Active Employees`,
      gradient: `linear-gradient(135deg, ${NAV} 0%, ${IND} 55%, ${ROY} 100%)`,
      color: IND,
    },
    {
      title: 'Exit Module',
      desc: 'Clearance & Settlement Tracking',
      path: '/exit/dashboard',
      icon: <ExitIcon />,
      stats: `${exitMembers.length} Members Processing`,
      gradient: `linear-gradient(135deg, ${NAV} 0%, #2a1a8e 40%, ${IND} 80%, ${ROY} 100%)`,
      color: ROY,
    }
  ];

  const mainStats = [
    { label: 'Total Workforce', value: totalEmployees, icon: <PeopleIcon />, color: IND },
    { label: 'Pending Leaves', value: pendingLeaves, icon: <EventIcon />, color: goldAccent },
    { label: 'Exit Settlement', value: formatCurrency(totalExitSettlement), icon: <VoluntaryIcon />, color: '#c0392b' },
  ];

  return (
    <Box className="page-container" sx={{ maxWidth: 1400, mx: 'auto' }}>

      {/* Welcome Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{
          fontWeight: 800,
          background: `linear-gradient(135deg, ${NAV} 0%, ${IND} 55%, ${ROY} 100%)`,
          backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          mb: 1
        }}>
          APECC System Overview
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
          Centralized management for APECC HR and Exit Member operations.
        </Typography>
      </Box>

      {/* Main Stat Panels */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {mainStats.map((stat, i) => (
          <Grid item xs={12} md={4} key={i}>
            <Card sx={{
              borderRadius: 3,
              background: 'linear-gradient(160deg, #FDFDFC 0%, rgba(180,183,211,0.12) 100%)',
              border: `1px solid rgba(5,7,126,0.08)`,
              boxShadow: '0 4px 16px rgba(5,7,126,0.07)',
              transition: 'transform 0.2s',
              '&:hover': { transform: 'translateY(-3px)', boxShadow: `0 8px 24px rgba(2,65,251,0.12)` }
            }}>
              <CardContent sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2.5 }}>
                <Avatar sx={{ bgcolor: `${stat.color}18`, color: stat.color, width: 56, height: 56 }}>
                  {stat.icon}
                </Avatar>
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {stat.label}
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 800, color: NAV }}>
                    {stat.value}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={4}>
        {/* Module Shortcuts */}
        <Grid item xs={12} lg={5}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2.5, color: NAV, display: 'flex', alignItems: 'center', gap: 1 }}>
            <DashboardIcon sx={{ color: goldAccent, fontSize: '1.2rem' }} />
            Quick Access
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            {modules.map((m, i) => (
              <Card key={i} sx={{
                borderRadius: 4,
                background: m.gradient,
                color: '#FDFDFC',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': { transform: 'scale(1.02)', boxShadow: `0 12px 32px ${m.color}40` }
              }} onClick={() => navigate(m.path)}>
                <CardContent sx={{ p: 3.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                    <Avatar sx={{ bgcolor: 'rgba(253,253,252,0.18)', backdropFilter: 'blur(8px)', width: 52, height: 52 }}>
                      {m.icon}
                    </Avatar>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>{m.title}</Typography>
                      <Typography variant="body2" sx={{ opacity: 0.82, mb: 1.5, fontSize: '0.85rem' }}>{m.desc}</Typography>
                      <Chip label={m.stats} size="small" sx={{ bgcolor: 'rgba(253,253,252,0.15)', color: '#FDFDFC', border: '1px solid rgba(253,253,252,0.22)', fontWeight: 600, fontSize: '0.7rem' }} />
                    </Box>
                  </Box>
                  <IconButton sx={{ color: '#FDFDFC', bgcolor: 'rgba(253,253,252,0.12)' }}>
                    <ArrowIcon />
                  </IconButton>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Grid>

        {/* Global Recent Activity */}
        <Grid item xs={12} lg={7}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2.5, color: NAV, display: 'flex', alignItems: 'center', gap: 1 }}>
            <TrendingIcon sx={{ color: goldAccent, fontSize: '1.2rem' }} />
            Recent Global Activity
          </Typography>
          <Card sx={{
            borderRadius: 3,
            background: `linear-gradient(160deg, ${NAV} 0%, ${IND} 50%, ${ROY} 80%, ${PER} 100%)`,
            boxShadow: '0 8px 32px rgba(5,7,126,0.30)',
            border: 'none',
          }}>
            <CardContent sx={{ p: 0 }}>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ '& th': { background: 'rgba(212,168,67,0.18)', color: goldAccent, fontWeight: 700, fontSize: '0.72rem', letterSpacing: '0.05em', height: 44, borderBottom: '1px solid rgba(212,168,67,0.2)' } }}>
                      <TableCell>ACTIVITY TYPE</TableCell>
                      <TableCell>SUBJECT</TableCell>
                      <TableCell align="right">VALUE / STATUS</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {/* HR Activities */}
                    {leaveRecords.slice(0, 3).map((l, i) => (
                      <TableRow key={`hr-${i}`} sx={{ '& td': { color: 'rgba(253,253,252,0.95)', py: 2, borderBottom: '1px solid rgba(253,253,252,0.08)' } }}>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <EventIcon sx={{ fontSize: 16, opacity: 0.6 }} />
                            Leave Request
                          </Box>
                        </TableCell>
                        <TableCell>{employees.find(e => e.id === l.employeeId)?.firstName} {employees.find(e => e.id === l.employeeId)?.lastName}</TableCell>
                        <TableCell align="right">
                          <Chip label={l.status} size="small" sx={{ height: 20, fontSize: '0.65rem', fontWeight: 700, bgcolor: l.status === 'Approved' ? 'rgba(76,175,80,0.2)' : 'rgba(255,152,0,0.2)', color: l.status === 'Approved' ? '#81c784' : '#ffb74d' }} />
                        </TableCell>
                      </TableRow>
                    ))}
                    {/* Exit Activities */}
                    {exitMembers.slice(0, 3).map((m, i) => (
                      <TableRow key={`exit-${i}`} sx={{ '& td': { color: 'rgba(253,253,252,0.95)', py: 2, borderBottom: i === 2 ? 'none' : '1px solid rgba(253,253,252,0.08)' } }}>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <ExitIcon sx={{ fontSize: 16, opacity: 0.6 }} />
                            Exit Processing
                          </Box>
                        </TableCell>
                        <TableCell>{m.memberName}</TableCell>
                        <TableCell align="right">
                          <Typography sx={{ fontWeight: 700, color: goldAccent, fontSize: '0.85rem' }}>{formatCurrency(m.totalAmount)}</Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <Box sx={{ p: 2, textAlign: 'center', borderTop: '1px solid rgba(253,253,252,0.08)' }}>
                <Typography variant="caption" sx={{ color: 'rgba(253,253,252,0.5)', fontStyle: 'italic' }}>
                  Showing 6 most recent administrative events
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
