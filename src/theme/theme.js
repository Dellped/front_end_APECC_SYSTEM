import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#007bff",
      light: "#0056b3",
      dark: "#1565c0",
    },
    secondary: {
      main: "#43a047",
      light: "#388e3c",
      dark: "#2e7d32",
    },
    error: {
      main: "#ff4d4d",
      light: "#d32f2f",
    },
    success: {
      main: "#4caf50",
      light: "#66bb6a",
    },
    warning: {
      main: "#ff9800",
      light: "#ffb74d",
    },
    info: {
      main: "#4cb5e3",
      light: "#64b5f6",
    },
    background: {
      default: "#fafafa",
      paper: "#ffffff",
    },
  },
  typography: {
    fontFamily: '"Segoe UI", Arial, sans-serif',
    h3: {
      fontWeight: 600,
      fontSize: "1.5rem",
    },
    h4: {
      fontWeight: 600,
      fontSize: "1.25rem",
    },
    body1: {
      fontSize: "0.875rem",
    },
    body2: {
      fontSize: "0.75rem",
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 600,
          borderRadius: 8,
          padding: "8px 16px",
        },
        contained: {
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          "&:hover": {
            boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: "0 4px 25px rgba(0, 0, 0, 0.08)",
        },
      },
    },
    MuiTable: {
      styleOverrides: {
        root: {
          "& .MuiTableCell-root": {},
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 600,
          fontSize: "0.75rem",
        },
        body: {
          fontSize: "0.75rem",
        },
      },
    },
  },
});

export default theme;
