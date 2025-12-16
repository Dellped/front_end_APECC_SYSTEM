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
  Button,
  Tooltip,
} from "@mui/material";
import { Visibility as VisibilityIcon } from "@mui/icons-material";
import apiClient from "../lib/apiClient";
import { getSession, getRole, SESSION_KEYS } from "../lib/storage";
import { ROLES } from "../lib/roles";
import LoadingOverlay from "../components/LoadingOverlay";
import MessageBanner from "../components/MessageBanner";
import PreviewModal from "../components/PreviewModal";

export default function CorporatePage() {
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("error");

  // Summary data
  const [departmentSummary, setDepartmentSummary] = useState([]);
  const [operationSummary, setOperationSummary] = useState([]);

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalRecords, setModalRecords] = useState([]);
  const [modalDisplayName, setModalDisplayName] = useState("");

  const role = getRole();

  // Fetch preview details
  const fetchDetailsAndShow = async (
    filterKey,
    type,
    name = "",
    displayKey = ""
  ) => {
    setModalTitle(`Detail Records: ${name || filterKey}`);
    setModalDisplayName(name || filterKey);
    setModalOpen(true);
    setModalRecords([]);

    try {
      let endpoint = "";
      if (type === "department") {
        endpoint = "/api/corporate-summary/details/department";
      } else if (type === "operation") {
        endpoint = "/api/corporate-summary/details/operation";
      }

      const { data } = await apiClient.get(
        `${endpoint}?operation_name=${encodeURIComponent(filterKey)}`
      );

      if (data.error) {
        setMessage(data.error);
        return;
      }

      const filteredRecords = data.records.filter((r) => {
        if (type === "department") {
          return r.department === displayKey;
        } else if (type === "operation") {
          return r.group === displayKey;
        }
      });

      setModalRecords(filteredRecords || []);
    } catch (err) {
      setMessage(err.message);
    }
  };

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        let res;

        let data;
        if (role === ROLES.CHIEF) {
          const chiefId = getSession(SESSION_KEYS.CHIEF_ID);
          const response = await apiClient.get(
            `/api/corporate-summary/chief/departments?chief_id=${chiefId}`
          );
          data = response.data;
        } else {
          const response = await apiClient.get(
            "/api/corporate-summary?role=COO"
          );
          data = response.data;
        }

        if (data.error) {
          setMessage(data.error);
          setLoading(false);
          return;
        }

        if (data.departmentSummary)
          setDepartmentSummary(data.departmentSummary);
        if (data.operationSummary) setOperationSummary(data.operationSummary);
      } catch (err) {
        setMessage(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [role]);

  // Calculate totals
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
  const renderSummaryTable = (data, type, label) => {
    if (!data?.length) return null;

    const totals = calculateTotals(data);
    const nameField = type === "department" ? "department" : "operation_name";

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
                  {type === "department" ? "Department" : "Operation"}
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
              {data.map((r, idx) => {
                const EE = parseInt(r.EE_count || 0);
                const ME = parseInt(r.ME_count || 0);
                const DM = parseInt(r.DM_count || 0);
                const total = parseInt(r.total_employees || 0);
                const name = r[nameField] || "";

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
                      {type === "department"
                        ? r.department_name
                        : r.operation_name}
                    </TableCell>
                    <TableCell sx={{ textAlign: "center", fontWeight: 500 }}>
                      {EE}
                    </TableCell>
                    <TableCell sx={{ textAlign: "center", fontWeight: 500 }}>
                      {Math.round(r.EE_percent || 0)}%
                    </TableCell>
                    <TableCell sx={{ textAlign: "center", fontWeight: 500 }}>
                      {ME}
                    </TableCell>
                    <TableCell sx={{ textAlign: "center", fontWeight: 500 }}>
                      {Math.round(r.ME_percent || 0)}%
                    </TableCell>
                    <TableCell sx={{ textAlign: "center", fontWeight: 500 }}>
                      {DM}
                    </TableCell>
                    <TableCell sx={{ textAlign: "center", fontWeight: 500 }}>
                      {Math.round(r.DM_percent || 0)}%
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
                              name,
                              type,
                              name,
                              r.department_name || r.operation_name
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
              <TableRow sx={{ bgcolor: "grey.200", fontWeight: "bold" }}>
                <TableCell sx={{ textAlign: "left", fontWeight: "bold" }}>
                  Subtotal
                </TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>{totals.EE}</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>
                  {totals.total > 0
                    ? Math.round((totals.EE / totals.total) * 100)
                    : 0}
                  %
                </TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>{totals.ME}</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>
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
      </Paper>
    );
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
      {loading && <LoadingOverlay message="Generating corporate report..." />}
      <MessageBanner
        message={message}
        type={messageType}
        onClose={() => setMessage("")}
      />

      <Card sx={{ maxWidth: "100%", mx: "auto", borderRadius: 3 }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ textAlign: "center", mb: 3 }}>
            <img
              src="https://raw.githubusercontent.com/rodelpeligro-oss/image-hosting/main/nav3%20(1).png"
              alt="Logo"
              style={{ width: 200, height: 70 }}
            />
            <Typography variant="h5" sx={{ mt: 2, fontWeight: 600 }}>
              Value-Driven Performance Management Form
            </Typography>
            <Typography variant="h6" sx={{ mt: 1, fontWeight: 500 }}>
              Corporate Summary Reports
            </Typography>
          </Box>

          {/* Department Summary */}
          {renderSummaryTable(
            departmentSummary,
            "department",
            "DEPARTMENT SUMMARY"
          )}

          {/* Operation Summary */}
          {renderSummaryTable(
            operationSummary,
            "operation",
            "OPERATION SUMMARY"
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
        allowExport={true}
      />
    </Box>
  );
}
