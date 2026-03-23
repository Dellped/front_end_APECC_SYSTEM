import { createTheme } from '@mui/material/styles';

export const getAppTheme = (mode) => {
  const isDark = mode === 'dark';

  return createTheme({
    palette: {
      mode,
      primary: {
        main: '#023DFB',
        light: '#4a75e6',
        dark: '#0120a1',
        contrastText: '#ffffff',
      },
      secondary: {
        main: '#8b1a1a',
        light: '#b22222',
        dark: '#5c0e0e',
        contrastText: '#ffffff',
      },
      accent: {
        gold: '#d4a843',
        goldLight: '#e8c96a',
        goldDark: '#b08930',
        blue: '#2156a5',
      },
      gradients: {
        primary: isDark 
          ? 'linear-gradient(135deg, #023DFB 0%, #1a3a6b 100%)' 
          : 'linear-gradient(135deg, #023DFB 0%, #4a75e6 60%, #89B1D5 100%)',
        header: 'linear-gradient(135deg, #023DFB 0%, #4a75e6 100%)',
        accent: 'linear-gradient(135deg, #d4a843 0%, #e8c96a 100%)',
        sidebar: isDark 
          ? 'linear-gradient(180deg, #1a1a2e 0%, #16213e 100%)'
          : 'linear-gradient(180deg, #023DFB 0%, #3065e8 35%, #5c8ddd 70%, #89B1D5 100%)',
      },
      background: {
        default: isDark ? '#0f172a' : '#f0f2f5',
        paper: isDark ? '#1e293b' : '#ffffff',
      },
      text: {
        primary: isDark ? '#f8fafc' : '#1a1a2e',
        secondary: isDark ? '#94a3b8' : '#546e7a',
      },
      divider: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)',
      success: {
        main: '#2e7d32',
        light: '#4caf50',
      },
      warning: {
        main: '#ed6c02',
        light: '#ff9800',
      },
      error: {
        main: '#d32f2f',
        light: '#ef5350',
      },
      info: {
        main: '#0288d1',
        light: '#03a9f4',
      },
    },
    typography: {
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      h4: {
        fontWeight: 700,
        letterSpacing: '-0.02em',
      },
      h5: {
        fontWeight: 600,
        letterSpacing: '-0.01em',
      },
      h6: {
        fontWeight: 600,
      },
      subtitle1: {
        fontWeight: 500,
      },
      body1: {
        fontSize: '0.938rem',
      },
      body2: {
        fontSize: '0.85rem',
      },
      button: {
        textTransform: 'none',
        fontWeight: 600,
      },
    },
    shape: {
      borderRadius: 10,
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            scrollbarColor: isDark ? '#334155 #0f172a' : '#cbd5e1 #f1f5f9',
            '&::-webkit-scrollbar, & *::-webkit-scrollbar': {
              width: '8px',
              height: '8px',
            },
            '&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb': {
              borderRadius: '8px',
              backgroundColor: isDark ? '#334155' : '#cbd5e1',
            },
            '&::-webkit-scrollbar-track, & *::-webkit-scrollbar-track': {
              borderRadius: '8px',
              backgroundColor: isDark ? '#0f172a' : '#f1f5f9',
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 14,
            boxShadow: isDark ? '0 4px 20px rgba(0, 0, 0, 0.4)' : '0 4px 18px rgba(13, 27, 62, 0.10)',
            border: isDark ? '1px solid rgba(255, 255, 255, 0.05)' : '1px solid rgba(13, 27, 62, 0.06)',
            backgroundImage: 'none',
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            padding: '8px 20px',
            fontWeight: 600,
          },
          containedPrimary: {
            background: 'linear-gradient(135deg, #023DFB 0%, #4a75e6 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #4a75e6 0%, #023DFB 100%)',
            },
          },
        },
      },
      MuiTableContainer: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            overflow: 'hidden',
            border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(13, 27, 62, 0.08)',
            backgroundColor: isDark ? '#1e293b' : '#ffffff',
          },
        },
      },
      MuiTableHead: {
        styleOverrides: {
          root: {
            '& .MuiTableCell-head': {
              background: isDark 
                ? 'linear-gradient(135deg, #1e293b 0%, #334155 100%)'
                : 'linear-gradient(135deg, #023DFB 0%, #4a75e6 50%, #89B1D5 100%)',
              color: '#ffffff',
              fontWeight: 600,
              fontSize: '0.825rem',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              borderBottom: 'none',
            },
          },
        },
      },
      MuiTableRow: {
        styleOverrides: {
          root: {
            '&:nth-of-type(even)': {
              backgroundColor: isDark ? 'rgba(255, 255, 255, 0.02)' : 'rgba(13, 27, 62, 0.025)',
            },
            '&:hover': {
              backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05) !important' : 'rgba(26, 58, 107, 0.06) !important',
            },
            '&:last-child td': {
              borderBottom: 'none',
            },
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: {
            borderBottom: isDark ? '1px solid rgba(255, 255, 255, 0.06)' : '1px solid rgba(13, 27, 62, 0.06)',
            color: isDark ? '#f8fafc' : '#1a1a2e',
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            fontWeight: 500,
            fontSize: '0.78rem',
            backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.04)',
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: 8,
              backgroundColor: isDark ? 'rgba(255, 255, 255, 0.02)' : 'transparent',
            },
          },
        },
      },
      MuiTypography: {
        styleOverrides: {
          root: {
            color: isDark ? '#f8fafc' : 'inherit',
          }
        }
      },
      MuiBreadcrumbs: {
        styleOverrides: {
          root: {
            color: isDark ? '#94a3b8' : 'inherit',
          }
        }
      }
    },
  });
};

export default getAppTheme;

