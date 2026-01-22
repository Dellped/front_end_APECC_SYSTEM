import { useState, useEffect, useCallback } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Tabs,
  Tab,
  Button,
  Tooltip,
  CircularProgress,
} from "@mui/material";
import { Visibility as VisibilityIcon } from "@mui/icons-material";
import apiClient from "../lib/apiClient";
import { getSession, getRole, SESSION_KEYS } from "../lib/storage";
import { ROLES, EXPORT_RESTRICTED_ROLES } from "../lib/roles";
import LoadingOverlay from "../components/LoadingOverlay";
import MessageBanner from "../components/MessageBanner";
import Pagination from "../components/Pagination";
import PreviewModal from "../components/PreviewModal";
import registeredASALogo from "../assets/logo2.png";


export default function SummaryPage() {
  const [loading, setLoading] = useState(true);
  const [tabLoading, setTabLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("error");

  // Summary data
  const [divisionSummary, setDivisionSummary] = useState([]);
  const [regionSummary, setRegionSummary] = useState([]);
  const [areaSummary, setAreaSummary] = useState([]);
  const [branchSummary, setBranchSummary] = useState([]);
  const [departmentSummary, setDepartmentSummary] = useState([]);
  const [operationSummary, setOperationSummary] = useState([]);
  const [itrSummary, setItrSummary] = useState([]);
  const [imSummary, setImSummary] = useState([]);
  const [operationSupportSummary, setOperationSupportSummary] = useState([]);

  // Pagination for summaries (10 per page)
  const [divisionPage, setDivisionPage] = useState(1);
  const [regionPage, setRegionPage] = useState(1);
  const [areaPage, setAreaPage] = useState(1);
  const [branchPage, setBranchPage] = useState(1);

  // Active tab
  const [activeTab, setActiveTab] = useState("");
  const [tabs, setTabs] = useState([]);

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalRecords, setModalRecords] = useState([]);
  const [modalDisplayName, setModalDisplayName] = useState("");

  const role = getRole();
  const allowExport = !EXPORT_RESTRICTED_ROLES.includes(role);
  const userId = getSession(SESSION_KEYS.USER_ID);

  // Get entity info based on role
  const getEntityInfo = useCallback(() => {
    let entity = "";
    let displayName = "";

    switch (role) {
      case ROLES.BM:
        entity = getSession(SESSION_KEYS.BRANCH_NO) || "";
        displayName = `${entity} - (${getSession(SESSION_KEYS.BRANCH) || ""})`;
        break;
      case ROLES.AA:
        entity = getSession(SESSION_KEYS.AREA_ID) || "";
        displayName = getSession(SESSION_KEYS.AREA_NAME) || "";
        break;
      case ROLES.RA:
        entity = getSession(SESSION_KEYS.REGION_ID) || "";
        displayName = getSession(SESSION_KEYS.REGION_NAME) || "";
        break;
      case ROLES.AVP:
        entity = getSession(SESSION_KEYS.DIVISION_ID) || "";
        displayName = getSession(SESSION_KEYS.DIVISION) || "";
        break;
      case ROLES.SVP:
        entity =
          getSession(SESSION_KEYS.OPERATION_ID) ||
          getSession(SESSION_KEYS.DIVISION_ID) ||
          "";
        displayName =
          getSession(SESSION_KEYS.OPERATION_NAME) ||
          getSession(SESSION_KEYS.DIVISION) ||
          "";
        break;
      case ROLES.CFOO:
        entity = getSession(SESSION_KEYS.CFO_ID) || "";
        displayName = getSession(SESSION_KEYS.CFO_NAME) || "";
        break;
      case ROLES.COO:
        entity = getSession(SESSION_KEYS.COO_ID) || "";
        displayName = "";
        break;
      case ROLES.CHIEF:
        entity = getSession(SESSION_KEYS.CHIEF_ID) || "";
        displayName = getSession(SESSION_KEYS.CHIEF_NAME) || "";
        break;
      case ROLES.IM:
        entity = getSession(SESSION_KEYS.USER_ID) || "";
        displayName = getSession(SESSION_KEYS.DEP_NAME) || "";
        break;
      case ROLES.ITR:
        entity = getSession(SESSION_KEYS.USER_ID) || "";
        displayName = getSession(SESSION_KEYS.DEP_NAME) || "";
        break;
      case ROLES.ADMIN:
        entity = "ADMIN";
        displayName = "ADMIN";
        break;
      default:
        entity = getSession(SESSION_KEYS.AREA_ID) || "";
    }

    return { entity, displayName };
  }, [role]);

  // Fetch preview details
  const fetchDetailsAndShow = async (filterKey, type, name = "") => {
    setModalTitle(`Detail Records: ${name || filterKey}`);
    setModalDisplayName(name || filterKey);
    setModalOpen(true);
    setModalRecords([]);

    try {
      let url = "";
      if (type === "branch")
        url = `/api/summary/details?branch=${encodeURIComponent(filterKey)}`;
      else if (type === "area")
        url = `/api/summary/details?area_name=${encodeURIComponent(filterKey)}`;
      else if (type === "region")
        url = `/api/summary/details?region_name=${encodeURIComponent(
          filterKey
        )}`;
      else if (type === "division")
        url = `/api/summary/details?division_name=${encodeURIComponent(
          filterKey
        )}`;
      else if (type === "department")
        url = `/api/summary/details?department=${encodeURIComponent(
          filterKey
        )}`;
      else if (type === "operation_name")
        url = `/api/summary/details?operation_name=${encodeURIComponent(
          filterKey
        )}`;
       else if (type === "im")
        url = `/api/summary/preview?role=IM&userId=${encodeURIComponent(
          userId
        )}&department=${encodeURIComponent(filterKey)}`;
      else if (type === "itr")
        url = `/api/summary/preview?role=ITR&userId=${encodeURIComponent(
          userId
        )}&department=${encodeURIComponent(filterKey)}`;

      const { data } = await apiClient.get(url);

      if (data.error) {
        setMessage(data.error);
        return;
      }

      setModalRecords(data.records || []);
    } catch (err) {
      setMessage(err.message);
    }
  };

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { entity } = getEntityInfo();

      try {
        const { data } = await apiClient.get(
          `/api/summary?entity=${encodeURIComponent(
            entity
          )}&role=${encodeURIComponent(role)}`
        );

        if (data.error) {
          setMessage(data.error);
          setLoading(false);
          return;
        }

        // Set summary data
        if (data.divisionSummary) setDivisionSummary(data.divisionSummary);
        if (data.regionSummary) setRegionSummary(data.regionSummary);
        if (data.areaSummary) setAreaSummary(data.areaSummary);
        if (data.branchSummary) setBranchSummary(data.branchSummary);
        if (data.departmentSummary)
          setDepartmentSummary(data.departmentSummary);
        if (data.operationSummary) setOperationSummary(data.operationSummary);
        if (data.itrSummary) setItrSummary(data.itrSummary);
        if (data.imSummary) setImSummary(data.imSummary);
        if (data.operationSupportSummary)
          setOperationSupportSummary(data.operationSupportSummary);

        // Build tabs based on role and available data
        const availableTabs = [];

        if (role === ROLES.ADMIN || role === ROLES.COO) {
          if (data.departmentSummary?.length)
            availableTabs.push({ id: "department", label: "Department Summary",  });
          if (data.operationSummary?.length)
            availableTabs.push({ id: "operation", label: "Operation Summary" });
        }

        else if (role === ROLES.IM) {
          if (data.imSummary?.length) {
            availableTabs.push({
              id: "im",
              label: "Department Summary"
            });
          }
        }

        else if (role === ROLES.ITR) {
          if (data.itrSummary?.length) {
            availableTabs.push({
              id: "itr",
              label: "Department Summary"
            });
          }
        }

        // if (role === ROLES.ITR && data.itrSummary?.length) {
        //   availableTabs.push({ id: "itr", label: "Department Summary" });
        // }

        // if (role === ROLES.IM && data.imSummary?.length) {
        //   availableTabs.push({ id: "im", label: "Department Summary" });
        // }

        else if (role === ROLES.CFOO) {
          if (data.operationSummary?.length)
            availableTabs.push({ id: "operation", label: "Operation Summary" });
        }
        else if (role === ROLES.AVP) {
          if (data.regionSummary?.length)
            availableTabs.push({ id: "region", label: "Region Summary" });
          if (data.areaSummary?.length)
            availableTabs.push({ id: "area", label: "Area Summary" });
          if (data.branchSummary?.length)
            availableTabs.push({ id: "branch", label: "Branch Summary" });
        }
          {
          if (data.divisionSummary?.length)
            availableTabs.push({ id: "division", label: "Division Summary" });
          if (data.regionSummary?.length)
            availableTabs.push({ id: "region", label: "Region Summary" });
          if (data.areaSummary?.length)
            availableTabs.push({ id: "area", label: "Area Summary" });
          if (data.branchSummary?.length)
            availableTabs.push({ id: "branch", label: "Branch Summary" });
        }

        if (availableTabs.length === 0) {
          availableTabs.push({ id: "branch", label: "Branch Summary" });
        }

        setTabs(availableTabs);
        setActiveTab(availableTabs[0]?.id || "");
      } catch (err) {
        setMessage(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [role, getEntityInfo]);

  const { displayName } = getEntityInfo();

  // Calculate totals for a summary array
  const calculateTotals = (records) => {
    const totals = { EE: 0, ME: 0, DM: 0, total: 0 };
    records.forEach((r) => {
      totals.EE += parseInt(r.EE_count || 0);
      totals.ME += parseInt(r.ME_count || 0);
      totals.DM += parseInt(r.DM_count || 0);
      totals.total += parseInt(r.total_employees || 0);
    });
    return totals;
  };

  // Render summary table
  const renderSummaryTable = (data, type, label, nameField) => {
    if (!data?.length) return null;

    const totals = calculateTotals(data);

    const perPage = 10;
    const isPaginatedType =
      type === "division" ||
      type === "region" ||
      type === "area" ||
      type === "branch";

    let currentPage = 1;
    let setPage = null;

    if (isPaginatedType) {
      if (type === "division") {
        currentPage = divisionPage;
        setPage = setDivisionPage;
      } else if (type === "region") {
        currentPage = regionPage;
        setPage = setRegionPage;
      } else if (type === "area") {
        currentPage = areaPage;
        setPage = setAreaPage;
      } else if (type === "branch") {
        currentPage = branchPage;
        setPage = setBranchPage;
      }
    }

    const totalPages = isPaginatedType
      ? Math.max(1, Math.ceil(data.length / perPage))
      : 1;
    const startIndex = isPaginatedType ? (currentPage - 1) * perPage : 0;
    const paginatedData = isPaginatedType
      ? data.slice(startIndex, startIndex + perPage)
      : data;

    return (
      <Paper elevation={2} sx={{ mb: 3 }}>
        <Box
          sx={{
            bgcolor: "primary.main",
            color: "white",
            p: 2,
            textAlign: "center",
            background: "linear-gradient(135deg, #FF6B35 0%, #E55A2B 100%)",
          }}
        >
          <Typography variant="h6" fontWeight={700} letterSpacing="0.5px">
            {label}
          </Typography>
        </Box>
        <TableContainer sx={{ maxHeight: 500, overflowX: "auto" }}>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{
                    fontWeight: 700,
                    fontSize: "0.8125rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    bgcolor: "grey.50",
                    borderBottom: "2px solid",
                    borderColor: "primary.main",
                  }}
                >
                  {type === "branch" ? "BRANCH" : type.toUpperCase()}
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 700,
                    fontSize: "0.8125rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    bgcolor: "grey.50",
                    borderBottom: "2px solid",
                    borderColor: "primary.main",
                    textAlign: "center",
                  }}
                >
                  EE
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 700,
                    fontSize: "0.8125rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    bgcolor: "grey.50",
                    borderBottom: "2px solid",
                    borderColor: "primary.main",
                    textAlign: "center",
                  }}
                >
                  EE %
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 700,
                    fontSize: "0.8125rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    bgcolor: "grey.50",
                    borderBottom: "2px solid",
                    borderColor: "primary.main",
                    textAlign: "center",
                  }}
                >
                  ME
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 700,
                    fontSize: "0.8125rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    bgcolor: "grey.50",
                    borderBottom: "2px solid",
                    borderColor: "primary.main",
                    textAlign: "center",
                  }}
                >
                  ME %
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 700,
                    fontSize: "0.8125rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    bgcolor: "grey.50",
                    borderBottom: "2px solid",
                    borderColor: "primary.main",
                    textAlign: "center",
                  }}
                >
                  DM
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 700,
                    fontSize: "0.8125rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    bgcolor: "grey.50",
                    borderBottom: "2px solid",
                    borderColor: "primary.main",
                    textAlign: "center",
                  }}
                >
                  DM %
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 700,
                    fontSize: "0.8125rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    bgcolor: "grey.50",
                    borderBottom: "2px solid",
                    borderColor: "primary.main",
                    textAlign: "center",
                  }}
                >
                  Total
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 700,
                    fontSize: "0.8125rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    bgcolor: "grey.50",
                    borderBottom: "2px solid",
                    borderColor: "primary.main",
                    textAlign: "center",
                    minWidth: 120,
                  }}
                >
                  Action
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedData.map((r, idx) => {
                const EE = parseInt(r.EE_count || 0);
                const ME = parseInt(r.ME_count || 0);
                const DM = parseInt(r.DM_count || 0);
                const total = parseInt(r.total_employees || 0);

                const percent = (count, total) =>
                  total > 0 ? Math.round((count / total) * 100) : 0;

                const name = r[nameField] || r.branch_no || r.branch || "";
                const displayKey =
                  type === "branch"
                    ? `${r.branch_no || r.Branch || r.branch || ""} - ${
                        r.full_branch_name || r.branch || ""
                      }`
                    : name;

                return (
                  <TableRow
                    key={idx}
                    hover
                    sx={{
                      "&:hover": {
                        bgcolor: "rgba(255, 107, 53, 0.04)",
                      },
                      transition: "background-color 0.2s ease-in-out",
                    }}
                  >
                    <TableCell
                      sx={{
                        textAlign: "left",
                        fontWeight: 500,
                        fontSize: "0.875rem",
                      }}
                    >
                      {displayKey}
                    </TableCell>
                    <TableCell sx={{ textAlign: "center", fontWeight: 500 }}>
                      {EE}
                    </TableCell>
                    <TableCell sx={{ textAlign: "center", fontWeight: 500 }}>
                      {percent(EE, total)}%
                    </TableCell>
                    <TableCell sx={{ textAlign: "center", fontWeight: 500 }}>
                      {ME}
                    </TableCell>
                    <TableCell sx={{ textAlign: "center", fontWeight: 500 }}>
                    {percent(ME, total)}%
                    </TableCell>
                    <TableCell sx={{ textAlign: "center", fontWeight: 500 }}>
                      {DM}
                    </TableCell>
                    <TableCell sx={{ textAlign: "center", fontWeight: 500 }}>
                    {percent(DM, total)}%
                    </TableCell>
                    <TableCell sx={{ textAlign: "center", fontWeight: 600 }}>
                      {total}
                    </TableCell>
                    <TableCell sx={{ textAlign: "center" }}>
                      <Tooltip title="Preview Details" arrow placement="top">
                        <Button
                          variant="contained"
                          size="small"
                          startIcon={<VisibilityIcon sx={{ fontSize: 18 }} />}
                          onClick={() =>
                            fetchDetailsAndShow(
                              type === "branch"
                                ? r.branch_no || r.Branch || r.branch
                                : name,
                              type,
                              displayKey
                            )
                          }
                          sx={{
                            minWidth: 110,
                            height: 32,
                            fontSize: "0.8125rem",
                            fontWeight: 600,
                            textTransform: "none",
                            borderRadius: 2,
                            bgcolor: "primary.main",
                            color: "white",
                            boxShadow: "0 2px 8px rgba(255, 107, 53, 0.25)",
                            "&:hover": {
                              bgcolor: "primary.dark",
                              boxShadow: "0 4px 12px rgba(255, 107, 53, 0.35)",
                              transform: "translateY(-1px)",
                            },
                            transition: "all 0.2s ease-in-out",
                          }}
                        >
                          Preview
                        </Button>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                );
              })}
              <TableRow sx={{ bgcolor: "grey.200",fontWeight: "bold", "& .MuiTableCell-root":
               {textAlign: "center",fontWeight: "bold", verticalAlign: "middle",color: "red"},
                 }}>
                <TableCell sx={{ textAlign: "center", fontWeight: "bold" }}>
                  Subtotal
                </TableCell>
                <TableCell sx={{ textAlign: "center", fontWeight: "bold" }}>{totals.EE}</TableCell>
                <TableCell sx={{ textAlign: "center", fontWeight: "bold" }}>
                  {totals.total > 0
                    ? Math.round((totals.EE / totals.total) * 100)
                    : 0}
                  %
                </TableCell>
                <TableCell sx={{ textAlign: "center", fontWeight: "bold" }}>{totals.ME}</TableCell>
                <TableCell sx={{ textAlign: "center", fontWeight: "bold" }}>
                  {totals.total > 0
                    ? Math.round((totals.ME / totals.total) * 100)
                    : 0}
                  %
                </TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>{totals.DM}</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>
                  {totals.total > 0
                    ? Math.round((totals.DM / totals.total) * 100)
                    : 0}
                  %
                </TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>
                  {totals.total}
                </TableCell>
                <TableCell>-</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
        {isPaginatedType && totalPages > 1 && setPage && (
          <Box sx={{ p: 2, display: "flex", justifyContent: "center" }}>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </Box>
        )}
      </Paper>
    );
  };

  // Get active content based on tab
  const getActiveContent = () => {
    switch (activeTab) {
      case "department":
        return renderSummaryTable(
          departmentSummary,
          "department",
          "DEPARTMENT SUMMARY",
          "department_name"
        );
      case "operation":
        return renderSummaryTable(
          operationSummary,
          "operation_name",
          "OPERATION SUMMARY",
          "operation_name"
        );
      case "division":
        return renderSummaryTable(
          divisionSummary,
          "division",
          "DIVISION SUMMARY",
          "division_name"
        );
      case "region":
        return renderSummaryTable(
          regionSummary,
          "region",
          "REGION SUMMARY",
          "region_name"
        );
      case "area":
        return renderSummaryTable(
          areaSummary,
          "area",
          "AREA SUMMARY",
          "area_name"
        );
      case "branch":
        return renderSummaryTable(
          branchSummary,
          "branch",
          "BRANCH SUMMARY",
          "branch"
        );
      case "itr":
        return renderSummaryTable(
          itrSummary,
          "itr",
          "DEPARTMENT SUMMARY",
          "department"
        );
      case "im":
        return renderSummaryTable(
          imSummary,
          "im",
          "DEPARTMENT SUMMARY",
          "department"
        );
      default:
        return null;
    }
  };

  return (
    <Box
      sx={{
        p: 3,
        bgcolor: "background.default",
        minHeight: "100vh",
        position: "relative",
      }}
    >
      {loading && <LoadingOverlay message="Generating report..." />}
      <MessageBanner
        message={message}
        type={messageType}
        onClose={() => setMessage("")}
      />

      <Card sx={{ maxWidth: "100%", mx: "auto", borderRadius: 3 }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ textAlign: "center", mb: 3 }}>
            <img
              src={registeredASALogo}
              alt="Logo"
              style={{ width: 200, height: 90 }}
            />
            <Typography variant="h5" sx={{ mt: 2, fontWeight: 600 }}>
              Value-Driven Performance Management Form
            </Typography>
            <Typography variant="h6" sx={{ mt: 1, fontWeight: 500 }}>
              Summary Reports
            </Typography>
            {role !== 'COO' && role !== 'ADMIN' && (
            <Chip
              label={displayName || ""}
              color="primary"
              sx={{ mt: 2 }}
            />
            )}
          </Box>

          {/* Tabs */}
          <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
            <Tabs
              value={activeTab}
              onChange={(e, newValue) => {
                setTabLoading(true);
                setActiveTab(newValue);
                // Clear loading after a brief delay for smooth UX
                setTimeout(() => {
                  setTabLoading(false);
                }, 300);
              }}
              variant="scrollable"
              scrollButtons="auto"
            >
              {tabs.map((tab) => (
                <Tab key={tab.id} label={tab.label} value={tab.id} />
              ))}
            </Tabs>
          </Box>

          {/* Active Tab Content */}
          <Box sx={{ position: "relative", minHeight: 200 }}>
            {tabLoading && (
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: "rgba(255, 255, 255, 0.9)",
                  zIndex: 10,
                  borderRadius: 2,
                  backdropFilter: "blur(2px)",
                }}
              >
                <CircularProgress
                  size={50}
                  thickness={4}
                  sx={{
                    color: "primary.main",
                    mb: 2,
                  }}
                />
                <Typography variant="body2" color="text.secondary">
                  Loading...
                </Typography>
              </Box>
            )}
            {!tabLoading && getActiveContent()}
          </Box>

          {/* Operations Support Summary (for CFOO) */}
          {role === ROLES.CFOO && operationSupportSummary?.length > 0 && (
            <Paper elevation={2} sx={{ mt: 3 }}>
              <Box
                sx={{
                  bgcolor: "secondary.main",
                  color: "white",
                  p: 1.5,
                  textAlign: "center",
                }}
              >
                <Typography variant="h6" fontWeight="bold">
                  OPERATIONS SUPPORT SUMMARY
                </Typography>
              </Box>
              <TableContainer sx={{ maxHeight: 400, overflowX: "auto" }}>
                <Table stickyHeader size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>DEPARTMENT</TableCell>
                      <TableCell>EE</TableCell>
                      <TableCell>EE %</TableCell>
                      <TableCell>ME</TableCell>
                      <TableCell>ME %</TableCell>
                      <TableCell>DM</TableCell>
                      <TableCell>DM %</TableCell>
                      <TableCell>Total</TableCell>
                      <TableCell>Preview</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
        {operationSupportSummary.map((r, idx) => {
          const EE = parseInt(r.EE_count || 0);
          const ME = parseInt(r.ME_count || 0);
          const DM = parseInt(r.DM_count || 0);
          const total = parseInt(r.total_employees || 0);

          const percent = (count) => (total > 0 ? Math.round((count / total) * 100) : 0);

          return (
            <TableRow key={idx} hover>
              <TableCell sx={{ textAlign: "center" }}>OPERATIONS SUPPORT</TableCell>
              <TableCell sx={{ textAlign: "center" }}>{r.EE_count || 0}</TableCell>
              <TableCell sx={{ textAlign: "center" }}>{percent(EE)}%</TableCell>
              <TableCell sx={{ textAlign: "center" }}>{r.ME_count || 0}</TableCell>
              <TableCell sx={{ textAlign: "center" }}>{percent(ME)}%</TableCell>
              <TableCell sx={{ textAlign: "center" }}>{r.DM_count || 0}</TableCell>
              <TableCell sx={{ textAlign: "center" }}>{percent(DM)}%</TableCell>
              <TableCell sx={{ textAlign: "center", fontWeight: 600 }}>{total}</TableCell>
              <TableCell sx={{ textAlign: "center" }}>
                <Tooltip title="Preview Details" arrow placement="top">
                  <Button
                    variant="contained"
                    size="small"
                    startIcon={<VisibilityIcon sx={{ fontSize: 18 }} />}
                    onClick={() =>
                      fetchDetailsAndShow(
                        "OPERATIONS SUPPORT",
                        "department",
                        "OPERATIONS SUPPORT"
                      )
              }
              sx={{
                minWidth: 110,
                height: 32,
                fontSize: "0.8125rem",
                fontWeight: 600,
                textTransform: "none",
                borderRadius: 2,
                bgcolor: "primary.main",
                color: "white",
                boxShadow: "0 2px 8px rgba(255, 107, 53, 0.25)",
                "&:hover": {
                  bgcolor: "primary.dark",
                  boxShadow: "0 4px 12px rgba(255, 107, 53, 0.35)",
                  transform: "translateY(-1px)",
                },
                transition: "all 0.2s ease-in-out",
              }}
            >
              Preview
            </Button>
          </Tooltip>
        </TableCell>
      </TableRow>
    );
  })}

  {/* Subtotal Row */}
  {operationSupportSummary.length > 0 && (() => {
    const totals = operationSupportSummary.reduce(
      (acc, r) => {
        acc.EE += parseInt(r.EE_count || 0);
        acc.ME += parseInt(r.ME_count || 0);
        acc.DM += parseInt(r.DM_count || 0);
        acc.total += parseInt(r.total_employees || 0);
        return acc;
      },
      { EE: 0, ME: 0, DM: 0, total: 0 }
    );

    const percent = (count, total) => (total > 0 ? Math.round((count / total) * 100) : 0);

    return (
      <TableRow sx={{ bgcolor: "grey.200", fontWeight: "bold" }}>
        <TableCell sx={{ textAlign: "center", fontWeight: "bold", color: "red" }}>Subtotal</TableCell>
        <TableCell sx={{ textAlign: "center", fontWeight: "bold", color: "red" }}>{totals.EE}</TableCell>
        <TableCell sx={{ textAlign: "center", fontWeight: "bold", color: "red" }}>{percent(totals.EE, totals.total)}%</TableCell>
        <TableCell sx={{ textAlign: "center", fontWeight: "bold", color: "red" }}>{totals.ME}</TableCell>
        <TableCell sx={{ textAlign: "center", fontWeight: "bold", color: "red" }}>{percent(totals.ME, totals.total)}%</TableCell>
        <TableCell sx={{ textAlign: "center", fontWeight: "bold", color: "red" }}>{totals.DM}</TableCell>
        <TableCell sx={{ textAlign: "center", fontWeight: "bold", color: "red" }}>{percent(totals.DM, totals.total)}%</TableCell>
        <TableCell sx={{ textAlign: "center", fontWeight: "bold", color: "red" }}>{totals.total}</TableCell>
        <TableCell sx={{ textAlign: "center", color: "red" }}>-</TableCell>
      </TableRow>
    );
  })()}
</TableBody>

                </Table>
              </TableContainer>
            </Paper>
          )}
        </CardContent>
      </Card>

      {/* Preview Modal */}
      <PreviewModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={modalTitle}
        records={modalRecords}
        displayName={modalDisplayName}
        allowExport={allowExport}
      />
    </Box>
  );
}
