import React, { useState } from 'react';
import {
  Box, Typography, Paper, Grid, IconButton, Select, MenuItem, FormControl,
  Card, CardContent, Tooltip, Chip
} from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { employees, leaveRecords, onboardingRecords } from '../../data/mockData';

const logoBlue = '#0241FB';
const logoGold = '#d4a843';
const logoMaroon = '#8b1a1a';
const lightPink = '#fce4ec';
const goldAccent = '#d4a843';

// Short label for leave type
const leaveAbbrev = (type = '') => {
  if (type.toLowerCase().includes('vacation')) return 'VL';
  if (type.toLowerCase().includes('sick')) return 'SL';
  if (type.toLowerCase().includes('emergency')) return 'EL';
  if (type.toLowerCase().includes('maternity')) return 'ML';
  if (type.toLowerCase().includes('paternity')) return 'PL';
  if (type.toLowerCase().includes('solo')) return 'SPL';
  return 'L';
};

export default function LeaveCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date()); // Default to today

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const handlePrevMonth = () =>
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));

  const handleNextMonth = () =>
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  const daysInMonth = getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth());
  const firstDay = getFirstDayOfMonth(currentDate.getFullYear(), currentDate.getMonth());

  const days = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(i);

  // Merge leaveRecords + approved/pending Leave onboardingRecords
  const allLeaveEvents = [
    ...leaveRecords,
    ...onboardingRecords
      .filter(r => r.type === 'Leave' && (r.status === 'Approved' || r.status?.toLowerCase().includes('pending')))
      .map(r => ({
        id: r.id,
        employeeId: r.employeeData?.id,
        type: r.employeeData?.leaveDetails?.designation || 'Leave',
        startDate: r.employeeData?.leaveDetails?.startDate || r.submittedDate,
        endDate: r.employeeData?.leaveDetails?.endDate || r.submittedDate,
        status: r.status,
        reason: r.employeeData?.leaveDetails?.reason || '',
      }))
  ];

  const getLeavesForDate = (day) => {
    if (!day) return [];
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const current = new Date(dateStr);
    return allLeaveEvents.filter(l => {
      if (!l.startDate || !l.endDate) return false;
      const start = new Date(l.startDate);
      const end = new Date(l.endDate);
      return current >= start && current <= end &&
        (l.status === 'Approved' || l.status?.toLowerCase().includes('pending'));
    });
  };

  const today = new Date();
  const isToday = (day) =>
    day === today.getDate() &&
    currentDate.getMonth() === today.getMonth() &&
    currentDate.getFullYear() === today.getFullYear();

  return (
    <Box className="page-container">
      <Card sx={{ borderRadius: 3, boxShadow: '0 10px 40px rgba(0,0,0,0.1)', overflow: 'hidden', border: `1px solid ${goldAccent}` }}>
        {/* Header */}
        <Box sx={{
          background: `linear-gradient(135deg, ${logoBlue} 0%, #3065e8 100%)`,
          p: 2,
          color: '#FDFDFC',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 800, letterSpacing: '0.05em' }}>
              Leave Calendar
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.75 }}>
              Employee leave schedule for {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {/* Legend */}
            <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#4caf50' }} />
                <Typography variant="caption" sx={{ opacity: 0.85 }}>Approved</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#ff9800' }} />
                <Typography variant="caption" sx={{ opacity: 0.85 }}>Pending</Typography>
              </Box>
            </Box>
            {/* Month Navigator */}
            <Box sx={{ display: 'flex', alignItems: 'center', bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 2, px: 1 }}>
              <IconButton size="small" onClick={handlePrevMonth} sx={{ color: '#FDFDFC' }}><ChevronLeft /></IconButton>
              <Typography sx={{ fontWeight: 700, minWidth: 130, textAlign: 'center' }}>
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </Typography>
              <IconButton size="small" onClick={handleNextMonth} sx={{ color: '#FDFDFC' }}><ChevronRight /></IconButton>
            </Box>
            <FormControl variant="standard" sx={{ m: 1, minWidth: 100 }}>
              <Select
                value={currentDate.getMonth()}
                onChange={(e) => setCurrentDate(new Date(currentDate.getFullYear(), e.target.value, 1))}
                sx={{ color: '#FDFDFC', '&:before': { borderColor: 'rgba(255,255,255,0.3)' }, '& .MuiSvgIcon-root': { color: '#FDFDFC' } }}
              >
                {monthNames.map((m, i) => <MenuItem key={i} value={i}>{m}</MenuItem>)}
              </Select>
            </FormControl>
          </Box>
        </Box>

        <CardContent sx={{ p: 0 }}>
          {/* Day-of-week header */}
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', borderBottom: `2px solid ${logoMaroon}` }}>
            {daysOfWeek.map(day => (
              <Box key={day} sx={{
                bgcolor: '#db899f',
                color: '#FDFDFC',
                p: 1.5,
                textAlign: 'center',
                fontWeight: 700,
                fontSize: '0.85rem',
                borderRight: '1px solid rgba(255,255,255,0.2)'
              }}>
                {day}
              </Box>
            ))}
          </Box>

          {/* Calendar grid */}
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
            {days.map((day, i) => {
              const leaves = getLeavesForDate(day);
              const isTodayCell = isToday(day);
              return (
                <Box key={i} sx={{
                  minHeight: 110,
                  borderRight: '1px solid #eee',
                  borderBottom: '1px solid #eee',
                  bgcolor: isTodayCell ? 'rgba(2,65,251,0.04)' : (i % 2 === 0 ? '#fff' : '#fafafa'),
                  p: 0.5,
                  position: 'relative',
                  '&:hover': { bgcolor: lightPink, transition: 'background 0.15s' }
                }}>
                  {day && (
                    <>
                      {/* Day number */}
                      <Typography sx={{
                        fontWeight: isTodayCell ? 900 : 700,
                        fontSize: '0.82rem',
                        color: isTodayCell ? logoBlue : logoMaroon,
                        mb: 0.5,
                        textAlign: 'right',
                        ...(isTodayCell && {
                          bgcolor: logoBlue,
                          color: '#fff',
                          borderRadius: '50%',
                          width: 22,
                          height: 22,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          ml: 'auto',
                          fontSize: '0.75rem',
                        })
                      }}>
                        {day}
                      </Typography>

                      {/* Leave entries */}
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.4 }}>
                        {leaves.slice(0, 3).map((l, idx) => {
                          const emp = employees.find(e => e.id === l.employeeId);
                          const empName = emp
                            ? `${emp.lastName}, ${emp.firstName[0]}.`
                            : (l.employeeId || 'Unknown');
                          const isApproved = l.status === 'Approved';
                          return (
                            <Tooltip
                              key={idx}
                              title={
                                <Box>
                                  <Typography variant="caption" sx={{ fontWeight: 700, display: 'block' }}>
                                    {emp ? `${emp.firstName} ${emp.lastName}` : l.employeeId}
                                  </Typography>
                                  <Typography variant="caption" sx={{ display: 'block' }}>{l.type}</Typography>
                                  <Typography variant="caption" sx={{ display: 'block', opacity: 0.85 }}>
                                    {l.startDate} → {l.endDate}
                                  </Typography>
                                  {l.reason && (
                                    <Typography variant="caption" sx={{ display: 'block', opacity: 0.75, fontStyle: 'italic' }}>
                                      "{l.reason}"
                                    </Typography>
                                  )}
                                  <Chip
                                    label={l.status}
                                    size="small"
                                    sx={{
                                      mt: 0.5,
                                      fontSize: '0.6rem',
                                      fontWeight: 700,
                                      bgcolor: isApproved ? '#4caf50' : '#ff9800',
                                      color: '#fff',
                                      height: 16
                                    }}
                                  />
                                </Box>
                              }
                              arrow
                              placement="top"
                            >
                              <Box sx={{
                                bgcolor: isApproved ? 'rgba(76,175,80,0.1)' : 'rgba(255,152,0,0.1)',
                                borderLeft: `3px solid ${isApproved ? '#4caf50' : '#ff9800'}`,
                                px: '4px',
                                py: '1px',
                                borderRadius: '0 3px 3px 0',
                                cursor: 'pointer',
                                '&:hover': { opacity: 0.85 }
                              }}>
                                <Typography sx={{ fontSize: '0.62rem', fontWeight: 700, color: '#333', lineHeight: 1.3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                  {empName}
                                </Typography>
                                <Typography sx={{ fontSize: '0.55rem', color: isApproved ? '#2e7d32' : '#e65100', lineHeight: 1.2 }}>
                                  {leaveAbbrev(l.type)}
                                </Typography>
                              </Box>
                            </Tooltip>
                          );
                        })}
                        {leaves.length > 3 && (
                          <Typography sx={{ fontSize: '0.55rem', color: '#888', pl: 0.5, fontStyle: 'italic' }}>
                            +{leaves.length - 3} more
                          </Typography>
                        )}
                      </Box>
                    </>
                  )}
                </Box>
              );
            })}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
