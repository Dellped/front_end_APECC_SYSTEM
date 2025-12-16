import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      // ASA Philippines Orange - main brand color
      main: "#FF6B35",
      light: "#FF8C5A",
      dark: "#E55A2B",
      contrastText: "#ffffff",
    },
    secondary: {
      // ASA Philippines Yellow - sun color
      main: "#FFC107",
      light: "#FFF4D6",
      dark: "#FFA000",
      contrastText: "#000000",
    },
    error: {
      main: "#D32F2F",
      light: "#EF5350",
      dark: "#C62828",
    },
    success: {
      main: "#2E7D32",
      light: "#4CAF50",
      dark: "#1B5E20",
    },
    warning: {
      main: "#F57C00",
      light: "#FF9800",
      dark: "#E65100",
    },
    info: {
      main: "#1976D2",
      light: "#42A5F5",
      dark: "#1565C0",
    },
    background: {
      default: "#F5F7FA",
      paper: "#FFFFFF",
    },
    text: {
      primary: "rgba(0, 0, 0, 0.87)",
      secondary: "rgba(0, 0, 0, 0.65)",
    },
    grey: {
      50: "#FAFAFA",
      100: "#F5F5F5",
      200: "#EEEEEE",
      300: "#E0E0E0",
      400: "#BDBDBD",
      500: "#9E9E9E",
      600: "#757575",
      700: "#616161",
      800: "#424242",
      900: "#212121",
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: "2.5rem",
      lineHeight: 1.2,
      letterSpacing: "-0.02em",
    },
    h2: {
      fontWeight: 700,
      fontSize: "2rem",
      lineHeight: 1.3,
      letterSpacing: "-0.01em",
    },
    h3: {
      fontWeight: 600,
      fontSize: "1.75rem",
      lineHeight: 1.4,
    },
    h4: {
      fontWeight: 600,
      fontSize: "1.5rem",
      lineHeight: 1.4,
    },
    h5: {
      fontWeight: 600,
      fontSize: "1.25rem",
      lineHeight: 1.5,
    },
    h6: {
      fontWeight: 600,
      fontSize: "1.125rem",
      lineHeight: 1.5,
    },
    body1: {
      fontSize: "1rem",
      lineHeight: 1.6,
    },
    body2: {
      fontSize: "0.875rem",
      lineHeight: 1.5,
    },
    button: {
      fontWeight: 600,
      letterSpacing: "0.02em",
    },
  },
  shape: {
    borderRadius: 12,
  },
  shadows: [
    "none",
    "0px 1px 2px rgba(0, 0, 0, 0.05)",
    "0px 2px 4px rgba(0, 0, 0, 0.05)",
    "0px 4px 8px rgba(0, 0, 0, 0.08)",
    "0px 8px 16px rgba(0, 0, 0, 0.1)",
    "0px 12px 24px rgba(0, 0, 0, 0.12)",
    "0px 16px 32px rgba(0, 0, 0, 0.12)",
    "0px 20px 40px rgba(0, 0, 0, 0.12)",
    "0px 24px 48px rgba(0, 0, 0, 0.12)",
    "0px 28px 56px rgba(0, 0, 0, 0.12)",
    "0px 32px 64px rgba(0, 0, 0, 0.12)",
    "0px 36px 72px rgba(0, 0, 0, 0.12)",
    "0px 40px 80px rgba(0, 0, 0, 0.12)",
    "0px 44px 88px rgba(0, 0, 0, 0.12)",
    "0px 48px 96px rgba(0, 0, 0, 0.12)",
    "0px 52px 104px rgba(0, 0, 0, 0.12)",
    "0px 56px 112px rgba(0, 0, 0, 0.12)",
    "0px 60px 120px rgba(0, 0, 0, 0.12)",
    "0px 64px 128px rgba(0, 0, 0, 0.12)",
    "0px 68px 136px rgba(0, 0, 0, 0.12)",
    "0px 72px 144px rgba(0, 0, 0, 0.12)",
    "0px 76px 152px rgba(0, 0, 0, 0.12)",
    "0px 80px 160px rgba(0, 0, 0, 0.12)",
    "0px 84px 168px rgba(0, 0, 0, 0.12)",
    "0px 88px 176px rgba(0, 0, 0, 0.12)",
  ],
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        "*": {
          boxSizing: "border-box",
        },
        html: {
          MozOsxFontSmoothing: "grayscale",
          WebkitFontSmoothing: "antialiased",
          display: "flex",
          flexDirection: "column",
          minHeight: "100%",
          width: "100%",
        },
        body: {
          display: "flex",
          flex: "1 1 auto",
          flexDirection: "column",
          minHeight: "100%",
          width: "100%",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 600,
          borderRadius: 12,
          padding: "10px 24px",
          fontSize: "0.9375rem",
          transition: "all 0.2s ease-in-out",
        },
        containedPrimary: {
          backgroundColor: "#FF6B35",
          color: "#ffffff",
          boxShadow: "0 4px 12px rgba(255, 107, 53, 0.25)",
          "&:hover": {
            backgroundColor: "#E55A2B",
            boxShadow: "0 6px 16px rgba(255, 107, 53, 0.35)",
            transform: "translateY(-1px)",
          },
          "&:active": {
            transform: "translateY(0)",
          },
        },
        containedSecondary: {
          backgroundColor: "#FFC107",
          color: "#000000",
          boxShadow: "0 4px 12px rgba(255, 193, 7, 0.25)",
          "&:hover": {
            backgroundColor: "#FFA000",
            boxShadow: "0 6px 16px rgba(255, 193, 7, 0.35)",
            transform: "translateY(-1px)",
          },
        },
        outlined: {
          borderWidth: "2px",
          "&:hover": {
            borderWidth: "2px",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
          transition: "all 0.3s ease-in-out",
          "&:hover": {
            boxShadow: "0 4px 16px rgba(0, 0, 0, 0.12)",
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
        elevation1: {
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
        },
        elevation2: {
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        },
        elevation3: {
          boxShadow: "0 6px 16px rgba(0, 0, 0, 0.12)",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#FFFFFF",
          color: "#FF6B35",
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.08)",
        },
      },
    },
    MuiBreadcrumbs: {
      styleOverrides: {
        root: {
          "& .MuiBreadcrumbs-separator": {
            color: "#FF6B35",
            fontWeight: 600,
          },
        },
      },
    },
    MuiTable: {
      styleOverrides: {
        root: {
          "& .MuiTableCell-root": {
            borderBottom: "1px solid rgba(0, 0, 0, 0.08)",
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 600,
          fontSize: "0.8125rem",
          textTransform: "uppercase",
          letterSpacing: "0.5px",
          color: "rgba(0, 0, 0, 0.7)",
        },
        body: {
          fontSize: "0.875rem",
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          margin: "4px 8px",
          transition: "all 0.2s ease-in-out",
          "&:hover": {
            transform: "translateX(4px)",
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500,
        },
      },
    },
  },
});

export default theme;
