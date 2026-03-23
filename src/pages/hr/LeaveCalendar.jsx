import React, { useState } from 'react';
import {
  Box, Typography, Paper, Grid, IconButton, Select, MenuItem, FormControl, Card, CardContent
} from '@mui/material';
import {
  ChevronLeft, ChevronRight
} from '@mui/icons-material';
import { employees, leaveRecords } from '../../data/mockData';

const logoBlue = '#023DFB';
const logoGold = '#d4a843';
const logoMaroon = '#8b1a1a'; // From sidebar hover
const lightPink = '#fce4ec'; // Requested pink/peach background

export default function LeaveCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 2, 1)); // Default to March 2026 for demo

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const daysInMonth = getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth());
  const firstDay = getFirstDayOfMonth(currentDate.getFullYear(), currentDate.getMonth());

  const days = [];
  // Fill empty days from previous month
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }
  // Fill days of the current month
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const getLeavesForDate = (day) => {
    if (!day) return [];
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return leaveRecords.filter(l => {
      const start = new Date(l.startDate);
      const end = new Date(l.endDate);
      const current = new Date(dateStr);
      return current >= start && current <= end && (l.status === 'Approved' || l.status === 'Pending');
    });
  };

  return (
    <Box className="page-container">
      <Card sx={{ borderRadius: 3, boxShadow: '0 10px 40px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
        <Box sx={{ 
          background: `linear-gradient(135deg, ${logoBlue} 0%, #3065e8 100%)`, 
          p: 2, 
          color: '#fff',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Typography variant="h5" sx={{ fontWeight: 800, letterSpacing: '0.05em' }}>
            Calendar Viewing
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 2, px: 1 }}>
              <IconButton size="small" onClick={handlePrevMonth} sx={{ color: '#fff' }}><ChevronLeft /></IconButton>
              <Typography sx={{ fontWeight: 700, minWidth: 120, textAlign: 'center' }}>
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </Typography>
              <IconButton size="small" onClick={handleNextMonth} sx={{ color: '#fff' }}><ChevronRight /></IconButton>
            </Box>
            <FormControl variant="standard" sx={{ m: 1, minWidth: 100 }}>
              <Select
                value={currentDate.getMonth()}
                onChange={(e) => setCurrentDate(new Date(currentDate.getFullYear(), e.target.value, 1))}
                sx={{ color: '#fff', '&:before': { borderColor: 'rgba(255,255,255,0.3)' }, '& .MuiSvgIcon-root': { color: '#fff' } }}
              >
                {monthNames.map((m, i) => <MenuItem key={i} value={i}>{m}</MenuItem>)}
              </Select>
            </FormControl>
          </Box>
        </Box>

        <CardContent sx={{ p: 0 }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', borderBottom: `2px solid ${logoMaroon}` }}>
            {daysOfWeek.map(day => (
              <Box key={day} sx={{ 
                bgcolor: '#db899f', // The pink from mockup
                color: '#fff', 
                p: 1.5, 
                textAlign: 'center', 
                fontWeight: 700,
                fontSize: '0.9rem',
                borderRight: '1px solid rgba(255,255,255,0.2)'
              }}>
                {day}
              </Box>
            ))}
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
            {days.map((day, i) => {
              const leaves = getLeavesForDate(day);
              return (
                <Box key={i} sx={{ 
                  height: 120, 
                  borderRight: '1px solid #eee', 
                  borderBottom: '1px solid #eee',
                  bgcolor: i % 2 === 0 ? '#fff' : '#fafafa',
                  p: 0.5,
                  position: 'relative',
                  '&:hover': { bgcolor: lightPink }
                }}>
                  {day && (
                    <>
                      <Typography sx={{ 
                        fontWeight: 700, 
                        fontSize: '0.8rem', 
                        color: logoMaroon,
                        mb: 0.5,
                        textAlign: 'right'
                      }}>
                        {day}
                      </Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                        {leaves.map((l, idx) => {
                          const emp = employees.find(e => e.id === l.employeeId);
                          return (
                            <Box key={idx} sx={{ 
                              bgcolor: l.status === 'Approved' ? 'rgba(76, 175, 80, 0.1)' : 'rgba(255, 152, 0, 0.1)',
                              borderLeft: `3px solid ${l.status === 'Approved' ? '#4caf50' : '#ff9800'}`,
                              p: '2px 6px',
                              borderRadius: '0 4px 4px 0'
                            }}>
                              <Typography sx={{ fontSize: '0.65rem', fontWeight: 600, color: '#333' }}>
                                {emp ? `${emp.firstName} ${emp.lastName}` : l.employeeId}
                              </Typography>
                            </Box>
                          );
                        })}
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
