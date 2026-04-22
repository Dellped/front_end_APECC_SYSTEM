import { createTheme } from '@mui/material/styles';

// ── APECC Brand Palette ──────────────────────────────────────────────────────
// Navy        #05077E  – deepest primary / gradient start
// White       #FDFDFC  – backgrounds / light text on dark
// Bright Indigo #0241FB – primary accent / buttons
// Royal Blue  #4470ED  – mid-gradient / hover
// Periwinkle  #B4B7D3  – gradient end / subtle accents
// ─────────────────────────────────────────────────────────────────────────────

export const getAppTheme = (mode) => {
  const isDark = mode === 'dark';

  return createTheme({
    palette: {
      mode,
      primary: {
        main: '#0241FB',
        light: '#4470ED',
        dark: '#05077E',
        contrastText: '#FDFDFC',
      },
      secondary: {
        main: '#8b1a1a',
        light: '#b22222',
        dark: '#5c0e0e',
        contrastText: '#FDFDFC',
      },
      accent: {
        gold: '#d4a843',
        goldLight: '#e8c96a',
        goldDark: '#b08930',
        blue: '#4470ED',
      },
      gradients: {
        primary: isDark
          ? 'linear-gradient(135deg, #05077E 0%, #0241FB 100%)'
          : 'linear-gradient(135deg, #05077E 0%, #0241FB 55%, #4470ED 80%, #B4B7D3 100%)',
        header: 'linear-gradient(135deg, #05077E 0%, #0241FB 60%, #4470ED 100%)',
        accent: 'linear-gradient(135deg, #d4a843 0%, #e8c96a 100%)',
        sidebar: isDark
          ? 'linear-gradient(180deg, #05077E 0%, #0d1060 100%)'
          : 'linear-gradient(180deg, #05077E 0%, #0241FB 45%, #4470ED 75%, #B4B7D3 100%)',
      },
      background: {
        default: isDark ? '#060830' : '#f0f2f5',
        paper: isDark ? '#0d1060' : '#FDFDFC',
      },
      text: {
        primary: isDark ? '#FDFDFC' : '#1a1a2e',
        secondary: isDark ? '#B4B7D3' : '#546e7a',
      },
      divider: isDark ? 'rgba(180, 183, 211, 0.12)' : 'rgba(5, 7, 126, 0.08)',
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
        main: '#0241FB',
        light: '#4470ED',
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
            scrollbarColor: isDark ? '#4470ED #05077E' : '#B4B7D3 #f0f2f5',
            '&::-webkit-scrollbar, & *::-webkit-scrollbar': {
              width: '8px',
              height: '8px',
            },
            '&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb': {
              borderRadius: '8px',
              backgroundColor: isDark ? '#4470ED' : '#B4B7D3',
            },
            '&::-webkit-scrollbar-track, & *::-webkit-scrollbar-track': {
              borderRadius: '8px',
              backgroundColor: isDark ? '#05077E' : '#f0f2f5',
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 14,
            boxShadow: isDark ? '0 4px 20px rgba(5, 7, 126, 0.4)' : '0 4px 18px rgba(5, 7, 126, 0.10)',
            border: isDark ? '1px solid rgba(180, 183, 211, 0.08)' : '1px solid rgba(5, 7, 126, 0.06)',
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
            background: 'linear-gradient(135deg, #05077E 0%, #0241FB 60%, #4470ED 100%)',
            color: '#FDFDFC',
            '&:hover': {
              background: 'linear-gradient(135deg, #0241FB 0%, #05077E 100%)',
              boxShadow: '0 4px 16px rgba(2, 65, 251, 0.35)',
            },
          },
          outlinedPrimary: {
            borderColor: '#0241FB',
            color: '#0241FB',
            '&:hover': {
              borderColor: '#05077E',
              color: '#05077E',
              background: 'rgba(2, 65, 251, 0.05)',
            },
          },
        },
      },
      MuiTableContainer: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            overflow: 'hidden',
            border: isDark ? '1px solid rgba(180, 183, 211, 0.10)' : '1px solid rgba(5, 7, 126, 0.08)',
            backgroundColor: isDark ? '#0d1060' : '#FDFDFC',
          },
        },
      },
      MuiTableHead: {
        styleOverrides: {
          root: {
            '& .MuiTableCell-head': {
              background: isDark
                ? 'linear-gradient(135deg, #05077E 0%, #0241FB 100%)'
                : 'linear-gradient(135deg, #05077E 0%, #0241FB 60%, #4470ED 100%)',
              color: '#FDFDFC',
              fontWeight: 700,
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
              backgroundColor: isDark ? 'rgba(68, 112, 237, 0.04)' : 'rgba(5, 7, 126, 0.025)',
            },
            '&:hover': {
              backgroundColor: isDark ? 'rgba(68, 112, 237, 0.08) !important' : 'rgba(2, 65, 251, 0.05) !important',
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
            borderBottom: isDark ? '1px solid rgba(180, 183, 211, 0.08)' : '1px solid rgba(5, 7, 126, 0.06)',
            color: isDark ? '#FDFDFC' : '#1a1a2e',
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            fontWeight: 500,
            fontSize: '0.78rem',
            backgroundColor: isDark ? 'rgba(180, 183, 211, 0.08)' : 'rgba(2, 65, 251, 0.06)',
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: 8,
              backgroundColor: isDark ? 'rgba(180, 183, 211, 0.04)' : 'transparent',
              '& fieldset': {
                borderColor: isDark ? 'rgba(180, 183, 211, 0.3)' : 'rgba(5, 7, 126, 0.2)',
              },
              '&:hover fieldset': {
                borderColor: '#4470ED',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#0241FB',
                borderWidth: '2px',
              },
            },
            '& .MuiInputLabel-root': {
              color: isDark ? '#B4B7D3' : '#546e7a',
              '&.Mui-focused': {
                color: '#0241FB',
              },
            },
            '& .MuiInputAdornment-root': {
              color: isDark ? '#B4B7D3' : '#05077E',
            },
          },
        },
      },
      MuiSelect: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: isDark ? 'rgba(180, 183, 211, 0.3)' : 'rgba(5, 7, 126, 0.2)',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: '#4470ED',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: '#0241FB',
              borderWidth: '2px',
            },
          },
        },
      },
      MuiFormLabel: {
        styleOverrides: {
          root: {
            '&.Mui-focused': {
              color: '#0241FB',
            },
          },
        },
      },
      MuiTypography: {
        styleOverrides: {
          root: {
            color: isDark ? '#FDFDFC' : 'inherit',
          },
        },
      },
      MuiBreadcrumbs: {
        styleOverrides: {
          root: {
            color: isDark ? '#B4B7D3' : 'inherit',
          },
        },
      },
    },
  });
};

export default getAppTheme;
