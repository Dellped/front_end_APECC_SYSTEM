import { useState, useEffect, useMemo, useCallback, memo } from "react";
import {
  Outlet,
  useNavigate,
  NavLink,
  useLocation,
  Link as RouterLink,
} from "react-router-dom";
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
  Divider,
  Toolbar,
  Breadcrumbs,
  Typography,
  Paper,
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
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Home as HomeIcon,
} from "@mui/icons-material";
import { getRole, clearSession, isLoggedIn } from "../lib/storage";
import {
  canAccessUpload,
  canAccessValidate,
  canAccessGenerate,
  canAccessSummary,
  canAccessArchive,
  canAccessCorporate,
  canAccessValSummary,
  getDefaultRouteForRole,
  ROLES,
} from "../lib/roles";

const DRAWER_WIDTH = 240;
const DRAWER_WIDTH_COLLAPSED = 64;

// Memoized drawer content component to prevent unnecessary re-renders
const DrawerContent = memo(({ menuItems, collapsed }) => {
  const location = useLocation();

  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: "linear-gradient(180deg, #FFFFFF 0%, #FFF4D6 100%)",
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "80px !important",
          px: collapsed ? 1 : 2,
          borderBottom: "1px solid rgba(0, 0, 0, 0.08)",
          background: "linear-gradient(135deg, #FFFFFF 0%, #FFF4D6 100%)",
        }}
      >
        {collapsed ? (
          <img
            src="https://raw.githubusercontent.com/rodelpeligro-oss/image-hosting/main/head.png"
            alt="Logo"
            style={{
              maxWidth: "40px",
              maxHeight: "40px",
              objectFit: "contain",
            }}
          />
        ) : (
          <img
            src="https://raw.githubusercontent.com/rodelpeligro-oss/image-hosting/main/head.png"
            alt="Logo"
            style={{ maxWidth: "90px", maxHeight: "120px" }}
          />
        )}
      </Toolbar>
      <Divider sx={{ borderColor: "rgba(0, 0, 0, 0.08)" }} />
      <List sx={{ flexGrow: 1, pt: 2, px: collapsed ? 0.5 : 1 }}>
        {menuItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                component={NavLink}
                to={item.path}
                selected={isActive}
                sx={{
                  justifyContent: collapsed ? "center" : "flex-start",
                  px: collapsed ? 1 : 2,
                  py: 1.25,
                  borderRadius: 2,
                  "&.Mui-selected": {
                    bgcolor: (theme) => theme.palette.primary.main,
                    color: "white",
                    boxShadow: "0 4px 12px rgba(255, 107, 53, 0.3)",
                    "&:hover": {
                      bgcolor: (theme) => theme.palette.primary.dark,
                      boxShadow: "0 6px 16px rgba(255, 107, 53, 0.4)",
                    },
                    "& .MuiListItemIcon-root": {
                      color: "white",
                    },
                    "& .MuiListItemText-primary": {
                      fontWeight: 600,
                    },
                  },
                  "&:hover": {
                    bgcolor: (theme) => `${theme.palette.primary.main}15`,
                    transform: "translateX(4px)",
                  },
                }}
                title={collapsed ? item.label : ""}
              >
                <ListItemIcon
                  sx={{
                    color: isActive
                      ? "white"
                      : (theme) => theme.palette.text.secondary,
                    minWidth: collapsed ? 0 : 40,
                    justifyContent: "center",
                  }}
                >
                  <IconComponent />
                </ListItemIcon>
                {!collapsed && (
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      fontSize: "0.9375rem",
                      fontWeight: isActive ? 600 : 500,
                    }}
                  />
                )}
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );
});

DrawerContent.displayName = "DrawerContent";

const menuItems = [
  {
    path: "/upload",
    label: "Upload Forms",
    icon: UploadIcon,
    canAccess: canAccessUpload,
  },
  {
    path: "/validate",
    label: "Validate Reports",
    icon: ValidateIcon,
    canAccess: canAccessValidate,
  },
    {
    path: "/valsummary",
    label: "Validation Summary",
    icon: ValidateIcon,
    canAccess: canAccessValSummary,
  },
  {
    path: "/generate",
    label: "Generate Reports",
    icon: GenerateIcon,
    canAccess: canAccessGenerate,
  },
  {
    path: "/summary",
    label: "Summary Reports",
    icon: SummaryIcon,
    canAccess: canAccessSummary,
  },
  {
    path: "/archive",
    label: "Archive",
    icon: ArchiveIcon,
    canAccess: canAccessArchive,
  },
  {
    path: "/corporate",
    label: "Corporate Reports",
    icon: CorporateIcon,
    canAccess: canAccessCorporate,
  },
];

export default function MainLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
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

  const handleLogout = useCallback(() => {
    clearSession();
    navigate("/login", { replace: true });
  }, [navigate]);

  const handleDrawerToggle = useCallback(() => {
    setMobileOpen((prev) => !prev);
  }, []);

  const handleSidebarToggle = useCallback(() => {
    setSidebarCollapsed((prev) => !prev);
  }, []);

  const filteredMenuItems = useMemo(
    () => menuItems.filter((item) => item.canAccess(role)),
    [role]
  );

  // Generate breadcrumbs based on current route
  const breadcrumbs = useMemo(() => {
    const pathnames = location.pathname.split("/").filter((x) => x);
    const crumbs = [
      <Typography
        key="home"
        component={RouterLink}
        to="/upload"
        sx={{
          display: "flex",
          alignItems: "center",
          textDecoration: "none",
          color: "text.secondary",
          "&:hover": {
            color: "primary.main",
          },
        }}
      >
        <HomeIcon sx={{ mr: 0.5, fontSize: 20 }} />
        Home
      </Typography>,
    ];

    pathnames.forEach((value, index) => {
      const to = `/${pathnames.slice(0, index + 1).join("/")}`;
      const menuItem = menuItems.find((item) => item.path === to);
      const label = menuItem
        ? menuItem.label
        : value.charAt(0).toUpperCase() + value.slice(1);
      const isLast = index === pathnames.length - 1;

      crumbs.push(
        isLast ? (
          <Typography key={to} color="text.primary" sx={{ fontWeight: 500 }}>
            {label}
          </Typography>
        ) : (
          <Typography
            key={to}
            component={RouterLink}
            to={to}
            sx={{
              textDecoration: "none",
              color: "text.secondary",
              "&:hover": {
                color: "primary.main",
              },
            }}
          >
            {label}
          </Typography>
        )
      );
    });

    return crumbs;
  }, [location.pathname]);

  const drawerWidth = sidebarCollapsed ? DRAWER_WIDTH_COLLAPSED : DRAWER_WIDTH;

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      <Box
        component="nav"
        sx={{
          width: { sm: drawerWidth },
          flexShrink: { sm: 0 },
          transition: "width 0.3s ease",
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
              bgcolor: (theme) => theme.palette.secondary.light,
            },
          }}
        >
          <DrawerContent menuItems={filteredMenuItems} collapsed={false} />
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              background: "linear-gradient(180deg, #FFFFFF 0%, #FFF4D6 100%)",
              borderRight: "1px solid rgba(0, 0, 0, 0.08)",
              transition: "width 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              overflowX: "hidden",
              boxShadow: "2px 0 8px rgba(0, 0, 0, 0.04)",
            },
          }}
          open
        >
          <DrawerContent
            menuItems={filteredMenuItems}
            collapsed={sidebarCollapsed}
          />
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 0,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          bgcolor: "background.default",
          overflow: "auto",
          transition:
            "width 0.3s cubic-bezier(0.4, 0, 0.2, 1), margin 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        <Toolbar
          sx={{
            position: "sticky",
            top: 0,
            bgcolor: "background.paper",
            borderBottom: "1px solid",
            borderColor: "rgba(0, 0, 0, 0.08)",
            px: 3,
            py: 1.5,
            minHeight: "72px !important",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
            zIndex: 1100,
            backdropFilter: "blur(10px)",
            backgroundColor: "rgba(255, 255, 255, 0.95)",
          }}
        >
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{
              mr: 2,
              display: { sm: "none" },
              color: "text.primary",
              "&:hover": {
                bgcolor: "rgba(255, 107, 53, 0.08)",
              },
            }}
          >
            <MenuIcon />
          </IconButton>
          <IconButton
            color="inherit"
            aria-label="toggle sidebar"
            edge="start"
            onClick={handleSidebarToggle}
            sx={{
              mr: 2,
              display: { xs: "none", sm: "flex" },
              color: "text.primary",
              bgcolor: "rgba(0, 0, 0, 0.04)",
              "&:hover": {
                bgcolor: "rgba(255, 107, 53, 0.12)",
                color: "primary.main",
              },
              transition: "all 0.2s ease-in-out",
            }}
          >
            {sidebarCollapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
          <Box
            sx={{
              flexGrow: 1,
              display: "flex",
              alignItems: "center",
            }}
          >
            <Breadcrumbs
              aria-label="breadcrumb"
              separator={
                <Typography
                  sx={{
                    color: "primary.main",
                    fontWeight: 600,
                    fontSize: "1.125rem",
                  }}
                >
                  ›
                </Typography>
              }
              sx={{
                "& .MuiBreadcrumbs-ol": {
                  flexWrap: "nowrap",
                },
              }}
            >
              {breadcrumbs}
            </Breadcrumbs>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Button
              variant="contained"
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
              sx={{
                bgcolor: "success.dark",
                color: "white",
                textTransform: "none",
                fontWeight: 600,
                borderRadius: 2,
                px: 2.5,
                py: 1,
                fontSize: "0.875rem",
                boxShadow: "0 4px 12px rgba(46, 125, 50, 0.25)",
                "&:hover": {
                  bgcolor: "success.main",
                  boxShadow: "0 6px 16px rgba(46, 125, 50, 0.35)",
                  transform: "translateY(-1px)",
                },
                transition: "all 0.2s ease-in-out",
              }}
            >
              Logout
            </Button>
          </Box>
        </Toolbar>
        <Outlet />
      </Box>
    </Box>
  );
}
