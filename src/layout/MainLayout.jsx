import { useState, useEffect } from "react";
import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom";
import {
  Drawer,
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Button,
  Avatar,
  Divider,
  Toolbar,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Upload as UploadIcon,
  Description as ValidateIcon,
  Assessment as GenerateIcon,
  Summarize as SummaryIcon,
  Archive as ArchiveIcon,
  Business as CorporateIcon,
  Logout as LogoutIcon,
} from "@mui/icons-material";
import { getRole, clearSession, isLoggedIn } from "../lib/storage";
import {
  canAccessUpload,
  canAccessValidate,
  canAccessGenerate,
  canAccessSummary,
  canAccessArchive,
  canAccessCorporate,
  getDefaultRouteForRole,
  ROLES,
} from "../lib/roles";

const DRAWER_WIDTH = 240;

const menuItems = [
  {
    path: "/upload",
    label: "Upload Forms",
    icon: <UploadIcon />,
    canAccess: canAccessUpload,
  },
  {
    path: "/validate",
    label: "Validate Reports",
    icon: <ValidateIcon />,
    canAccess: canAccessValidate,
  },
  {
    path: "/generate",
    label: "Generate Reports",
    icon: <GenerateIcon />,
    canAccess: canAccessGenerate,
  },
  {
    path: "/summary",
    label: "Summary Reports",
    icon: <SummaryIcon />,
    canAccess: canAccessSummary,
  },
  {
    path: "/archive",
    label: "Archive",
    icon: <ArchiveIcon />,
    canAccess: canAccessArchive,
  },
  {
    path: "/corporate",
    label: "Corporate Reports",
    icon: <CorporateIcon />,
    canAccess: canAccessCorporate,
  },
];

export default function MainLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const role = getRole();

  useEffect(() => {
    // Redirect to login if not authenticated
    // if (!isLoggedIn()) {
    //   navigate("/login", { replace: true });
    //   return;
    // }

    // CHIEF role should start at corporate
    if (role === ROLES.CHIEF) {
      navigate("/corporate", { replace: true });
    }
  }, [navigate, role]);

  const handleLogout = () => {
    clearSession();
    navigate("/login", { replace: true });
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const filteredMenuItems = menuItems.filter((item) => item.canAccess(role));

  const drawer = (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Toolbar
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "80px !important",
          bgcolor: "wheat",
        }}
      >
        <img
          src="https://raw.githubusercontent.com/rodelpeligro-oss/image-hosting/main/head.png"
          alt="Logo"
          style={{ maxWidth: "90px", maxHeight: "120px" }}
        />
      </Toolbar>
      <Divider />
      <List sx={{ flexGrow: 1, pt: 1 }}>
        {filteredMenuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <ListItem key={item.path} disablePadding>
              <ListItemButton
                component={NavLink}
                to={item.path}
                selected={isActive}
                sx={{
                  "&.Mui-selected": {
                    bgcolor: "orange",
                    color: "white",
                    "&:hover": {
                      bgcolor: "orange",
                    },
                  },
                  "&:hover": {
                    bgcolor: "rgba(255, 165, 0, 0.1)",
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: isActive ? "white" : "inherit",
                    minWidth: 40,
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
      <Divider />
      <Box sx={{ p: 2 }}>
        <Button
          fullWidth
          variant="contained"
          startIcon={<LogoutIcon />}
          onClick={handleLogout}
          sx={{
            bgcolor: "olive",
            "&:hover": {
              bgcolor: "#4a4a00",
            },
          }}
        >
          Logout
        </Button>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      <Box
        component="nav"
        sx={{
          width: { sm: DRAWER_WIDTH },
          flexShrink: { sm: 0 },
        }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: DRAWER_WIDTH,
              bgcolor: "wheat",
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: DRAWER_WIDTH,
              bgcolor: "wheat",
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 0,
          width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` },
          bgcolor: "#f3f4f6",
          overflow: "auto",
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
        <Outlet />
      </Box>
    </Box>
  );
}
