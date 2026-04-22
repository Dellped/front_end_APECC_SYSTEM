  import React from 'react';
import {
  Box, Card, CardContent, Typography, Grid, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Chip, Avatar,
} from '@mui/material';
import {
  ExitToApp as ExitIcon, Savings as SavingsIcon, AccountBalance as CapitalIcon,
  TrendingUp as DividendIcon, CardGiftcard as RebatesIcon,
  VolunteerActivism as VoluntaryIcon, Percent as InterestIcon,
  Redeem as RefundIcon,
} from '@mui/icons-material';
import { exitMembers } from '../../data/mockData';

const goldAccent = '#d4a843';
const NAV = '#05077E';
const IND = '#0241FB';
const ROY = '#4470ED';
const PER = '#B4B7D3';
const formatCurrency = (val) => `₱${val.toLocaleString('en-PH', { minimumFractionDigits: 2 })}`;

const summaryCards = [
  { key: 'savings', label: 'Total Savings', icon: <SavingsIcon />, gradient: `linear-gradient(135deg, ${NAV} 0%, ${IND} 55%, ${ROY} 100%)` },
  { key: 'voluntary', label: 'Total Voluntary', icon: <VoluntaryIcon />, gradient: `linear-gradient(135deg, ${NAV} 0%, #1a2cb0 50%, ${IND} 100%)` },
  { key: 'shareCapital', label: 'Share Capital', icon: <CapitalIcon />, gradient: `linear-gradient(135deg, ${NAV} 0%, ${IND} 100%)` },
  { key: 'patronageRefund', label: 'Patronage Refund', icon: <RefundIcon />, gradient: `linear-gradient(135deg, #b08930 0%, ${goldAccent} 50%, #e8c96a 100%)` },
  { key: 'savingsInterest', label: 'Savings Interest', icon: <InterestIcon />, gradient: `linear-gradient(135deg, ${IND} 0%, ${ROY} 100%)` },
  { key: 'dividend', label: 'Dividend', icon: <DividendIcon />, gradient: 'linear-gradient(135deg, #8b1a1a 0%, #c0392b 50%, #e74c3c 100%)' },
  { key: 'rebates', label: 'Rebates', icon: <RebatesIcon />, gradient: `linear-gradient(135deg, ${goldAccent} 0%, #e8c96a 100%)` },
];


export default function ExitDashboard() {
  const totals = {};
  summaryCards.forEach(({ key }) => {
    totals[key] = exitMembers.reduce((sum, m) => sum + m[key], 0);
  });
  const grandTotal = exitMembers.reduce((sum, m) => sum + m.totalAmount, 0);

  return (
    <Box className="page-container">

      {/* Grand Total */}
      <Card sx={{
        borderRadius: 4, mb: 4,
        background: `linear-gradient(135deg, ${NAV} 0%, #0a1250 50%, #0e1d6a 100%)`,
        color: '#FDFDFC',
        boxShadow: '0 10px 30px rgba(5,7,126,0.30)',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          background: `radial-gradient(circle at top right, ${goldAccent}20, transparent 40%)`,
        }
      }}>
        <CardContent sx={{ p: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 1, '&:last-child': { pb: 4 } }}>
          <Box>
            <Typography variant="body2" sx={{ color: 'rgba(253,253,252,0.72)', fontWeight: 600, fontSize: '0.85rem', mb: 1, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              Total Settlement Amount
            </Typography>
            <Typography variant="h3" sx={{ fontWeight: 800, color: goldAccent, letterSpacing: '-0.02em', textShadow: '0 2px 10px rgba(212,168,67,0.3)' }}>
              {formatCurrency(grandTotal)}
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(253,253,252,0.5)', mt: 1 }}>
              Across <strong>{exitMembers.length}</strong> exiting members
            </Typography>
          </Box>
          <Avatar
            sx={{
              width: 72, height: 72,
              background: `linear-gradient(135deg, ${goldAccent}, #e8c96a)`,
              color: NAV,
              boxShadow: `0 0 20px ${goldAccent}40`,
              border: `4px solid rgba(253,253,252,0.1)`,
            }}
          >
            <ExitIcon sx={{ fontSize: 36 }} />
          </Avatar>
        </CardContent>
      </Card>


      {/* Summary Cards */}
      <Grid container spacing={2.5} sx={{ mb: 10, width: '100%', m: 0 }}>
        {summaryCards.map((card) => (
          <Grid item xs={12} sm={6} md={1.71} key={card.key} sx={{ flexBasis: { md: '14.28%' }, maxWidth: { md: '14.28%' } }}>
            <Card className="stat-card" sx={{
              height: '100%', borderRadius: 3,
              background: card.gradient,
              boxShadow: '0 4px 16px rgba(5,7,126,0.28)',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              '&:hover': { transform: 'translateY(-3px)', boxShadow: '0 8px 28px rgba(5,7,126,0.40)' },
            }}>
              <CardContent sx={{ p: 2, '&:last-child': { pb: 2 }, textAlign: 'center' }}>
                <Avatar sx={{
                  width: 36, height: 36, mx: 'auto', mb: 1,
                  bgcolor: 'rgba(253,253,252,0.15)', color: '#FDFDFC',
                  backdropFilter: 'blur(8px)', border: '1px solid rgba(253,253,252,0.2)',
                }}>
                  {card.icon}
                </Avatar>
                <Typography variant="caption" sx={{ color: 'rgba(253,253,252,0.72)', fontWeight: 600, fontSize: '0.7rem', display: 'block', mb: 0.5, textTransform: 'uppercase' }}>
                  {card.label}
                </Typography>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#FDFDFC', fontSize: '0.88rem' }}>
                  {formatCurrency(totals[card.key])}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>


      {/* Members Table */}
      <Card sx={{
        borderRadius: 3, mt: 5,
        background: `linear-gradient(160deg, ${NAV} 0%, ${IND} 50%, ${ROY} 80%, ${PER} 100%)`,
        boxShadow: `0 12px 40px rgba(2,65,251,0.28)`,
      }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" sx={{
            fontWeight: 700, fontSize: '1.1rem', mb: 3,
            background: `linear-gradient(135deg, ${goldAccent}, #e8c96a)`,
            backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>
            Exit Members Summary
          </Typography>
          <TableContainer sx={{ overflowX: 'auto', backgroundColor: 'transparent' }}>
            <Table size="small" sx={{ minWidth: 1000 }}>
              <TableHead>
                <TableRow sx={{ '& th': { background: 'rgba(212,168,67,0.18)', color: goldAccent, fontWeight: 700, textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: '0.04em', borderBottom: `1px solid rgba(212,168,67,0.2)` } }}>
                  <TableCell>Member</TableCell>
                  <TableCell>Date Exit</TableCell>
                  <TableCell align="right">Savings</TableCell>
                  <TableCell align="right">Voluntary</TableCell>
                  <TableCell align="right">Share Capital</TableCell>
                  <TableCell align="right">Patronage</TableCell>
                  <TableCell align="right">Interest</TableCell>
                  <TableCell align="right">Dividend</TableCell>
                  <TableCell align="right">Rebates</TableCell>
                  <TableCell align="right">Total</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {exitMembers.map((m) => (
                  <TableRow key={m.id} sx={{ '&:hover': { background: 'rgba(253,253,252,0.04)' }, '& td': { color: 'rgba(253,253,252,0.92)', borderBottom: '1px solid rgba(253,253,252,0.09)', fontSize: '0.8rem' } }}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar sx={{ width: 32, height: 32, background: `linear-gradient(135deg, ${goldAccent}, #e8c96a)`, color: NAV, fontSize: '0.72rem', fontWeight: 700 }}>
                          {m.memberName.split(' ').map(n => n[0]).join('')}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.82rem', lineHeight: 1.3, color: '#FDFDFC' }}>{m.memberName}</Typography>
                          <Typography variant="caption" sx={{ color: 'rgba(253,253,252,0.5)', fontSize: '0.68rem' }}>{m.memberId}</Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>{m.dateExit}</TableCell>
                    <TableCell align="right">{formatCurrency(m.savings)}</TableCell>
                    <TableCell align="right">{formatCurrency(m.voluntary)}</TableCell>
                    <TableCell align="right">{formatCurrency(m.shareCapital)}</TableCell>
                    <TableCell align="right">{formatCurrency(m.patronageRefund)}</TableCell>
                    <TableCell align="right">{formatCurrency(m.savingsInterest)}</TableCell>
                    <TableCell align="right">{formatCurrency(m.dividend)}</TableCell>
                    <TableCell align="right">{formatCurrency(m.rebates)}</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700, color: '#81c784 !important' }}>{formatCurrency(m.totalAmount)}</TableCell>
                    <TableCell>
                      <Chip label={m.status} size="small" sx={{
                        fontWeight: 700, fontSize: '0.65rem', height: 20,
                        textTransform: 'uppercase', letterSpacing: '0.02em',
                        bgcolor: m.status === 'Completed' ? 'rgba(46,125,50,0.3)' : m.status === 'Processing' ? 'rgba(230,81,0,0.3)' : 'rgba(68,112,237,0.3)',
                        color: m.status === 'Completed' ? '#81c784' : m.status === 'Processing' ? '#ffb74d' : '#90caf9',
                      }} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>


    </Box>
  );
}
