import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Grid, Card, CardContent, Typography, Chip, Avatar,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  LinearProgress,
} from '@mui/material';
import {
  People as PeopleIcon,
  PersonAdd as PersonAddIcon,
  PersonOff as PersonOffIcon,
  ExitToApp as ExitIcon,
  Cake as CakeIcon,
  TrendingUp as TrendingIcon,
  EventNote as EventIcon,
  WorkOutlined as RegularIcon,
  AssignmentInd as ProbationaryIcon,
} from '@mui/icons-material';
import { employees, departmentStats, leaveRecords } from '../../data/mockData';

const goldAccent = '#d4a843';

export default function HRDashboard() {
  const navigate = useNavigate();

  const statCards = [
    {
      title: 'Total Employees',
      value: employees.length,
      subtitle: 'Across all departments',
      icon: <PeopleIcon />,
      gradient: 'linear-gradient(135deg, #023DFB 0%, #4a75e6 50%, #89B1D5 100%)',
      navigateTo: '/hr/employees',
    },
    {
      title: 'Active Employees',
      value: employees.filter((e) => e.status === 'Active').length,
      subtitle: 'Currently employed',
      icon: <PersonAddIcon />,
      gradient: 'linear-gradient(135deg, #023DFB 0%, #2156a5 50%, #2979cc 100%)',
      navigateTo: '/hr/employees?filter=Active',
    },
    {
      title: 'Exit',
      value: employees.filter((e) => e.status === 'Exit').length,
      subtitle: 'Resigned / Separated',
      icon: <ExitIcon />,
      gradient: 'linear-gradient(135deg, #7d3c00 0%, #c0392b 50%, #e67e22 100%)',
      navigateTo: '/hr/employees?filter=Exit',
    },
    {
      title: 'Deactivated',
      value: employees.filter((e) => e.status === 'Deactivated').length,
      subtitle: 'Account deactivated',
      icon: <PersonOffIcon />,
      gradient: 'linear-gradient(135deg, #4a0000 0%, #7b0000 50%, #b71c1c 100%)',
      navigateTo: '/hr/employees?filter=Deactivated',
    },
    {
      title: 'Pending Leaves',
      value: leaveRecords.filter((l) => l.status === 'Pending').length,
      subtitle: 'Awaiting approval',
      icon: <EventIcon />,
      gradient: `linear-gradient(135deg, #b08930 0%, ${goldAccent} 50%, #e8c96a 100%)`,
      navigateTo: '/hr/leaves?filter=Pending',
    },
    {
      title: 'Regular Employees',
      value: employees.filter((e) => e.employmentType === 'Regular').length,
      subtitle: 'Permanently employed',
      icon: <RegularIcon />,
      gradient: 'linear-gradient(135deg, #1a5276 0%, #1f618d 50%, #2e86c1 100%)',
      navigateTo: '/hr/employees?employmentType=Regular',
    },
    {
      title: 'Probationary',
      value: employees.filter((e) => e.employmentType === 'Probationary').length,
      subtitle: 'Under probation period',
      icon: <ProbationaryIcon />,
      gradient: 'linear-gradient(135deg, #4a235a 0%, #6c3483 50%, #9b59b6 100%)',
      navigateTo: '/hr/employees?employmentType=Probationary',
    },
  ];

  const recentHires = [...employees]
    .sort((a, b) => new Date(b.employmentDate) - new Date(a.employmentDate))
    .slice(0, 3);

  const upcomingBirthdays = employees
    .filter((e) => e.status === 'Active')
    .map((e) => {
      const bd = new Date(e.personal.birthdate);
      const now = new Date();
      const thisYearBd = new Date(now.getFullYear(), bd.getMonth(), bd.getDate());
      if (thisYearBd < now) thisYearBd.setFullYear(now.getFullYear() + 1);
      return { ...e, nextBirthday: thisYearBd };
    })
    .sort((a, b) => a.nextBirthday - b.nextBirthday)
    .slice(0, 3);

  return (
    <Box className="page-container">

      {/* Stat Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {statCards.map((card, i) => (
          <Grid item xs={12} sm={6} md={4} lg={2} key={i}>
            <Card
              onClick={() => navigate(card.navigateTo)}
              sx={{
                height: '100%',
                borderRadius: 3,
                overflow: 'visible',
                border: 'none',
                background: card.gradient,
                boxShadow: '0 4px 20px rgba(13,27,62,0.22)',
                cursor: 'pointer',
                transition: 'transform 0.18s ease, box-shadow 0.18s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 10px 30px rgba(13,27,62,0.38)',
                },
              }}
            >
              <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                  <Box>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.75)', fontWeight: 500, fontSize: '0.78rem', mb: 0.5 }}>
                      {card.title}
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: '#fff', lineHeight: 1 }}>
                      {card.value}
                    </Typography>
                  </Box>
                  <Avatar
                    sx={{
                      width: 44,
                      height: 44,
                      background: 'rgba(255,255,255,0.15)',
                      backdropFilter: 'blur(8px)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      boxShadow: '0 4px 14px rgba(0,0,0,0.2)',
                      color: '#fff',
                    }}
                  >
                    {card.icon}
                  </Avatar>
                </Box>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.72rem' }}>
                  {card.subtitle}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>

        {/* Department Distribution */}
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{
            height: '100%',
            borderRadius: 3,
            background: 'linear-gradient(160deg, #023DFB 0%, #4a75e6 50%, #89B1D5 100%)',
            boxShadow: '0 4px 24px rgba(26, 44, 78, 0.4)',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            '&:hover': { transform: 'translateY(-3px)', boxShadow: '0 8px 32px rgba(13,27,62,0.4)' },
          }}>
            <CardContent sx={{ p: 2.5 }}>
              <Typography variant="h6" sx={{
                fontWeight: 700, fontSize: '1rem', mb: 2,
                background: `linear-gradient(135deg, ${goldAccent}, #e8c96a)`,
                backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              }}>
                Department Distribution
              </Typography>
              {departmentStats.map((dept, i) => (
                <Box key={i} sx={{ mb: 1.8 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '0.82rem', color: 'rgba(255,255,255,0.92)' }}>{dept.name}</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: goldAccent, fontSize: '0.82rem' }}>{dept.count}</Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={(dept.count / employees.length) * 100}
                    sx={{
                      height: 6,
                      borderRadius: 3,
                      backgroundColor: 'rgba(255,255,255,0.08)',
                      '& .MuiLinearProgress-bar': {
                        borderRadius: 3,
                        background: `linear-gradient(90deg, ${goldAccent}, #e8c96a)`,
                      },
                    }}
                  />
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Hires */}
        <Grid item xs={12} md={4}>
          <Card sx={{
            borderRadius: 3, height: '100%',
            background: 'linear-gradient(160deg, #023DFB 0%, #4a75e6 60%, #89B1D5 100%)',
            boxShadow: '0 4px 20px rgba(13,27,62,0.25)',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            '&:hover': { transform: 'translateY(-3px)', boxShadow: '0 8px 32px rgba(13,27,62,0.4)' },
          }}>
            <CardContent sx={{ p: 2.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <TrendingIcon sx={{ color: goldAccent, fontSize: '1.2rem' }} />
                <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1rem', color: '#fff' }}>
                  Recent Hires
                </Typography>
              </Box>
              {recentHires.map((emp, i) => (
                <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2, pb: 2, borderBottom: i < 2 ? '1px solid rgba(255,255,255,0.08)' : 'none' }}>
                  <Avatar sx={{ width: 38, height: 38, background: `linear-gradient(135deg, ${goldAccent}, #e8c96a)`, color: '#023DFB', fontSize: '0.82rem', fontWeight: 700 }}>
                    {emp.firstName[0]}{emp.lastName[0]}
                  </Avatar>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.82rem', lineHeight: 1.3, color: '#fff' }} noWrap>
                      {emp.firstName} {emp.lastName}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.72rem' }}>
                      {emp.designation}
                    </Typography>
                  </Box>
                  <Chip
                    label={emp.status}
                    size="small"
                    sx={{
                      fontSize: '0.68rem',
                      height: 22,
                      fontWeight: 600,
                      bgcolor:
                        emp.status === 'Active' ? 'rgba(46,125,50,0.3)'
                        : emp.status === 'Exit' ? 'rgba(192,57,43,0.3)'
                        : 'rgba(123,0,0,0.35)',
                      color:
                        emp.status === 'Active' ? '#81c784'
                        : emp.status === 'Exit' ? '#e67e22'
                        : '#ef9a9a',
                    }}
                  />
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>

        {/* Upcoming Birthdays */}
        <Grid item xs={12} md={4}>
          <Card sx={{
            borderRadius: 3, height: '100%',
            background: `linear-gradient(160deg, #023DFB 0%, #4a75e6 40%, #89B1D5 70%, #d4a843 140%)`,
            boxShadow: '0 4px 20px rgba(13,27,62,0.25)',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            '&:hover': { transform: 'translateY(-3px)', boxShadow: `0 8px 32px rgba(212,168,67,0.2)` },
          }}>
            <CardContent sx={{ p: 2.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <CakeIcon sx={{ color: goldAccent, fontSize: '1.2rem' }} />
                <Typography variant="h6" sx={{
                  fontWeight: 700, fontSize: '1rem',
                  background: `linear-gradient(135deg, ${goldAccent}, #e8c96a)`,
                  backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                }}>
                  Upcoming Birthdays
                </Typography>
              </Box>
              {upcomingBirthdays.map((emp, i) => {
                const bd = new Date(emp.personal.birthdate);
                return (
                  <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2, pb: 2, borderBottom: i < 2 ? `1px solid rgba(212,168,67,0.15)` : 'none' }}>
                    <Avatar sx={{ width: 38, height: 38, background: `linear-gradient(135deg, ${goldAccent}, #e8c96a)`, color: '#023DFB', fontSize: '0.82rem', fontWeight: 700 }}>
                      {emp.firstName[0]}{emp.lastName[0]}
                    </Avatar>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.82rem', lineHeight: 1.3, color: '#fff' }}>
                        {emp.firstName} {emp.lastName}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.72rem' }}>
                        {bd.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
                      </Typography>
                    </Box>
                  </Box>
                );
              })}
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Leave Activity */}
        <Grid item xs={12}>
          <Card sx={{
            borderRadius: 3,
            background: 'linear-gradient(160deg, #023DFB 0%, #4a75e6 50%, #89B1D5 100%)',
            boxShadow: '0 4px 24px rgba(26, 44, 78, 0.4)',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            '&:hover': { transform: 'translateY(-3px)', boxShadow: '0 8px 32px rgba(13,27,62,0.4)' },
          }}>
            <CardContent sx={{ p: 2.5 }}>
              <Typography variant="h6" sx={{
                fontWeight: 700, fontSize: '1rem', mb: 2,
                background: `linear-gradient(135deg, ${goldAccent}, #e8c96a)`,
                backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              }}>
                Recent Leave Activity
              </Typography>
              <TableContainer sx={{ overflowX: 'auto',  backgroundColor: 'transparent'  }}>
                <Table size="small" sx={{ minWidth: 800 }}>
                  <TableHead>
                    <TableRow sx={{ '& th': { background: 'rgba(212,168,67,0.18)', color: goldAccent, fontWeight: 700, fontSize: '0.78rem', letterSpacing: '0.04em', borderBottom: `1px solid rgba(212,168,67,0.2)` } }}>
                      <TableCell>EMPLOYEE</TableCell>
                      <TableCell>TYPE</TableCell>
                      <TableCell>START DATE</TableCell>
                      <TableCell>END DATE</TableCell>
                      <TableCell>DAYS</TableCell>
                      <TableCell>STATUS</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {leaveRecords.map((leave) => {
                      const emp = employees.find((e) => e.id === leave.employeeId);
                      return (
                        <TableRow key={leave.id} sx={{ '&:hover': { background: 'rgba(255,255,255,0.04)' }, '& td': { color: 'rgba(255,255,255,0.92)', borderBottom: '1px solid rgba(255,255,255,0.09)', fontSize: '0.82rem' } }}>
                          <TableCell sx={{ fontWeight: 600, color: '#fff !important' }}>{emp ? `${emp.firstName} ${emp.lastName}` : leave.employeeId}</TableCell>
                          <TableCell>{leave.type}</TableCell>
                          <TableCell>{leave.startDate}</TableCell>
                          <TableCell>{leave.endDate}</TableCell>
                          <TableCell>{leave.days}</TableCell>
                          <TableCell>
                            <Chip
                              label={leave.status}
                              size="small"
                              sx={{
                                fontSize: '0.72rem',
                                height: 22,
                                fontWeight: 600,
                                bgcolor: leave.status === 'Approved' ? 'rgba(46,125,50,0.3)' : leave.status === 'Pending' ? 'rgba(230,81,0,0.3)' : 'rgba(198,40,40,0.3)',
                                color: leave.status === 'Approved' ? '#81c784' : leave.status === 'Pending' ? '#ffb74d' : '#ef9a9a',
                              }}
                            />
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
