import React, { useState } from 'react';
import {
  Box, Card, CardContent, Typography, Grid, TextField, Button,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  IconButton, Chip, Dialog, DialogTitle, DialogContent, DialogActions,
  MenuItem, Divider, Avatar, Tooltip, InputAdornment,
  FormControl, InputLabel, Select,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Layers as LevelsIcon,
  Search as SearchIcon,
  Save as SaveIcon,
  Close as CloseIcon,
} from '@mui/icons-material';

const goldAccent = '#d4a843';
const logoBlue = '#0241FB';

const LEVEL_COLORS = {
  'Level 1': { bg: 'rgba(46,125,50,0.1)', color: '#2e7d32' },
  'Level 2': { bg: 'rgba(2,61,251,0.08)', color: '#0241FB' },
  'Level 3': { bg: 'rgba(212,168,67,0.12)', color: '#a07820' },
  'Level 4': { bg: 'rgba(123,31,162,0.1)', color: '#7b1fa2' },
  'Level 5': { bg: 'rgba(211,47,47,0.1)', color: '#c62828' },
  'Level 6': { bg: 'rgba(5,7,126,0.12)', color: '#05077E' },
};

const getLevelColor = (code) => {
  for (const key of Object.keys(LEVEL_COLORS)) {
    if (code && code.startsWith(key)) return LEVEL_COLORS[key];
  }
  return { bg: 'rgba(0,0,0,0.06)', color: '#555' };
};

const INITIAL_LEVELS = [
  { id: 1, code: 'Level 1', name: 'Collections / Disbursement', description: 'Entry-level field staff handling collections and loan disbursements.' },
  { id: 2, code: 'Level 2', name: 'Collections / Disbursement', description: 'Regularized collections and disbursement officers.' },
  { id: 3, code: 'Level 3', name: 'Sub-Unit Heads', description: 'Sub-unit supervisory staff overseeing branch-level operations.' },
  { id: 4, code: 'Level 3', name: 'HR Officer', description: 'Human Resources officer responsible for 201 management and employee relations.' },
  { id: 5, code: 'Level 3', name: 'Cashier', description: 'Handles cash transactions, vault reconciliation, and fund management.' },
  { id: 6, code: 'Level 3', name: 'Asst. Bookkeeper', description: 'Assists in bookkeeping, journal entries, and financial records.' },
  { id: 7, code: 'Level 3', name: 'Leveling Promotion', description: 'Level 3 promotion track for eligible Level 2 employees.' },
  { id: 8, code: 'Level 4', name: 'Unit Heads', description: 'Heads of operational units managing team performance and targets.' },
  { id: 9, code: 'Level 4', name: 'Documentary and Compliance', description: 'Oversees regulatory compliance, tax filing, and documentary requirements.' },
  { id: 10, code: 'Level 5', name: 'Assistant General Manager', description: 'Second-in-command, assists GM in strategic and operational decisions.' },
  { id: 11, code: 'Level 6', name: 'General Manager', description: 'Top management responsible for overall organizational direction.' },
];

const LEVEL_OPTIONS = ['Level 1', 'Level 2', 'Level 3', 'Level 4', 'Level 5', 'Level 6'];

const emptyForm = { code: 'Level 1', name: '', description: '' };

export default function JobLevelManagement() {
  const [levels, setLevels] = useState(INITIAL_LEVELS);
  const [search, setSearch] = useState('');
  const [filterCode, setFilterCode] = useState('All');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null); // null = add, object = edit
  const [form, setForm] = useState(emptyForm);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [nextId, setNextId] = useState(12);

  const filtered = levels.filter(l => {
    const matchCode = filterCode === 'All' || l.code === filterCode;
    const matchSearch = `${l.code} ${l.name} ${l.description}`.toLowerCase().includes(search.toLowerCase());
    return matchCode && matchSearch;
  });

  const openAdd = () => {
    setEditTarget(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (row) => {
    setEditTarget(row);
    setForm({ code: row.code, name: row.name, description: row.description });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!form.code || !form.name.trim()) return;
    if (editTarget) {
      setLevels(prev => prev.map(l => l.id === editTarget.id ? { ...l, ...form } : l));
    } else {
      setLevels(prev => [...prev, { id: nextId, ...form }]);
      setNextId(n => n + 1);
    }
    setDialogOpen(false);
  };

  const handleDelete = (id) => {
    setLevels(prev => prev.filter(l => l.id !== id));
    setDeleteConfirm(null);
  };

  // Group stats
  const stats = LEVEL_OPTIONS.map(code => ({
    code,
    count: levels.filter(l => l.code === code).length,
    ...getLevelColor(code),
  }));

  return (
    <Box className="page-container">
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{
          fontWeight: 800, mb: 0.5,
          background: `linear-gradient(90deg, ${logoBlue}, #4470ED)`,
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>
          Job Levels / Ranks Management
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
          Company-wide job level classification and rank structure
        </Typography>
      </Box>

      {/* Level Stats */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {stats.map(s => (
          <Grid item xs={6} sm={4} md={2} key={s.code}>
            <Card sx={{ borderRadius: 3, border: '1px solid rgba(0,0,0,0.06)', textAlign: 'center' }}>
              <CardContent sx={{ py: 1.5, px: 2, '&:last-child': { pb: 1.5 } }}>
                <Avatar sx={{ bgcolor: s.bg, color: s.color, fontWeight: 800, fontSize: '0.8rem', width: 36, height: 36, mx: 'auto', mb: 0.5 }}>
                  {s.count}
                </Avatar>
                <Typography variant="caption" sx={{ fontWeight: 700, color: s.color, display: 'block', fontSize: '0.65rem' }}>
                  {s.code}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Search / Filter / Add */}
      <Card sx={{ mb: 3, borderRadius: 3, borderTop: `3px solid ${goldAccent}`, boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
        <CardContent sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
            <TextField
              size="small"
              placeholder="Search by name, code, or description…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ fontSize: '1.1rem', color: 'text.secondary' }} /></InputAdornment> }}
              sx={{ minWidth: 300, flex: 1 }}
            />
            <TextField
              size="small"
              select
              label="Filter by Level"
              value={filterCode}
              onChange={e => setFilterCode(e.target.value)}
              sx={{ minWidth: 160 }}
            >
              <MenuItem value="All">All Levels</MenuItem>
              {LEVEL_OPTIONS.map(l => <MenuItem key={l} value={l}>{l}</MenuItem>)}
            </TextField>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={openAdd}
              sx={{
                background: `linear-gradient(135deg, #05077E 0%, ${logoBlue} 60%, #4470ED 100%)`,
                color: '#FDFDFC',
                borderRadius: 2, textTransform: 'none', fontWeight: 700, px: 3,
              }}
            >
              Add Level / Rank
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Table */}
      <Card sx={{ borderRadius: 3, borderTop: `3px solid ${goldAccent}`, boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
        <CardContent sx={{ p: 0 }}>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ bgcolor: logoBlue }}>
                  {['#', 'Level Code', 'Name / Title', 'Description', 'Actions'].map(h => (
                    <TableCell key={h} sx={{ color: '#FDFDFC', fontWeight: 700, fontSize: '0.78rem', py: 1.5, whiteSpace: 'nowrap' }}>
                      {h}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 5, color: 'text.secondary' }}>
                      <LevelsIcon sx={{ fontSize: 40, opacity: 0.2, display: 'block', mx: 'auto', mb: 1 }} />
                      No job levels found.
                    </TableCell>
                  </TableRow>
                ) : filtered.map((row, idx) => {
                  const { bg, color } = getLevelColor(row.code);
                  return (
                    <TableRow key={row.id} hover sx={{ '&:last-child td': { borderBottom: 0 } }}>
                      <TableCell sx={{ color: 'text.secondary', fontSize: '0.78rem', width: 40 }}>{idx + 1}</TableCell>
                      <TableCell sx={{ width: 130 }}>
                        <Chip label={row.code} size="small" sx={{ bgcolor: bg, color, fontWeight: 800, fontSize: '0.72rem' }} />
                      </TableCell>
                      <TableCell sx={{ fontWeight: 700, fontSize: '0.85rem' }}>{row.name}</TableCell>
                      <TableCell sx={{ color: 'text.secondary', fontSize: '0.8rem', maxWidth: 400 }}>{row.description || '—'}</TableCell>
                      <TableCell sx={{ width: 100 }}>
                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                          <Tooltip title="Edit">
                            <IconButton size="small" onClick={() => openEdit(row)}
                              sx={{ color: logoBlue, '&:hover': { bgcolor: 'rgba(2,61,251,0.08)' } }}>
                              <EditIcon sx={{ fontSize: '1rem' }} />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton size="small" onClick={() => setDeleteConfirm(row)}
                              sx={{ color: '#d32f2f', '&:hover': { bgcolor: 'rgba(211,47,47,0.08)' } }}>
                              <DeleteIcon sx={{ fontSize: '1rem' }} />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Add / Edit Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ borderBottom: '1px solid #eee', py: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LevelsIcon sx={{ color: logoBlue }} />
            <Typography variant="h6" sx={{ fontWeight: 800, color: logoBlue }}>
              {editTarget ? 'Edit Job Level / Rank' : 'Add New Job Level / Rank'}
            </Typography>
          </Box>
          <IconButton size="small" onClick={() => setDialogOpen(false)}><CloseIcon /></IconButton>
        </DialogTitle>
        <DialogContent sx={{ pt: 3, pb: 1 }}>
          <Grid container spacing={2.5} sx={{ mt: 2 }}>
            <Grid item xs={12} sm={5}>
              <TextField
                fullWidth size="small" select label="Level Code *"
                value={form.code}
                onChange={e => setForm(f => ({ ...f, code: e.target.value }))}
                SelectProps={{
                  renderValue: (selected) => {
                    const { color } = getLevelColor(selected);
                    return <Typography sx={{ fontWeight: 800, color, fontSize: '0.85rem' }}>{selected}</Typography>;
                  }
                }}
              >
                {LEVEL_OPTIONS.map(l => {
                  const { bg, color } = getLevelColor(l);
                  return (
                    <MenuItem key={l} value={l} sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
                      <Chip label={l} size="small" sx={{ bgcolor: bg, color, fontWeight: 800, fontSize: '0.72rem' }} />
                      <Typography variant="body2" sx={{ color }}>{l}</Typography>
                    </MenuItem>
                  );
                })}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={7}>
              <TextField
                fullWidth size="small" label="Name / Title *"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                placeholder="e.g. Collections / Disbursement"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth size="small" label="Description"
                multiline rows={3}
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                placeholder="Brief description of responsibilities for this level…"
              />
            </Grid>
          </Grid>

          {form.code && form.name && (
            <Box sx={{ mt: 2.5, p: 1.5, bgcolor: 'rgba(0,0,0,0.025)', borderRadius: 2, border: '1px solid rgba(0,0,0,0.06)' }}>
              <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', display: 'block', mb: 0.5 }}>Preview</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Chip label={form.code} size="small" sx={{ ...getLevelColor(form.code), fontWeight: 800 }} />
                <Typography variant="body2" sx={{ fontWeight: 700 }}>{form.name}</Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2, borderTop: '1px solid #eee' }}>
          <Button onClick={() => setDialogOpen(false)} variant="contained" color="error" sx={{ color: '#FDFDFC', fontWeight: 600, textTransform: 'none', borderRadius: 2 }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={handleSave}
            disabled={!form.code || !form.name.trim()}
            sx={{
              background: `linear-gradient(135deg, #05077E 0%, ${logoBlue} 100%)`,
              color: '#FDFDFC',
              fontWeight: 700, borderRadius: 2, textTransform: 'none', px: 3,
              '&.Mui-disabled': {
                background: `linear-gradient(135deg, rgba(5,7,126,0.6) 0%, rgba(2,61,251,0.6) 100%)`,
                color: 'rgba(255,255,255,0.7)',
              }
            }}
          >
          {editTarget ? 'Save Changes' : 'Add Level'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirm Dialog */}
      <Dialog open={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ py: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 800, color: '#d32f2f' }}>Confirm Delete</Typography>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Are you sure you want to delete the job level{' '}
            <strong style={{ color: '#1a202c' }}>
              {deleteConfirm?.code} — {deleteConfirm?.name}
            </strong>?
          </Typography>
          <Typography variant="caption" sx={{ color: '#d32f2f', display: 'block', mt: 1 }}>
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2, borderTop: '1px solid #eee' }}>
          <Button onClick={() => setDeleteConfirm(null)} sx={{ fontWeight: 600, textTransform: 'none' }}>Cancel</Button>
          <Button
            variant="contained" color="error"
            onClick={() => handleDelete(deleteConfirm.id)}
            sx={{ fontWeight: 700, borderRadius: 2, textTransform: 'none' }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
