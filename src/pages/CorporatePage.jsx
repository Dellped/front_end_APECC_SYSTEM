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
} from "@mui/material";
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
  const fetchDetailsAndShow = async (filterKey, type, name = "") => {
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
        `${endpoint}?name=${encodeURIComponent(filterKey)}`
      );

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
            p: 1.5,
            textAlign: "center",
          }}
        >
          <Typography variant="h6" fontWeight="bold">
            {label}
          </Typography>
        </Box>
        <TableContainer sx={{ maxHeight: 500, overflowX: "auto" }}>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                <TableCell>
                  {type === "department" ? "Department" : "Operation"}
                </TableCell>
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
              {data.map((r, idx) => {
                const EE = parseInt(r.EE_count || 0);
                const ME = parseInt(r.ME_count || 0);
                const DM = parseInt(r.DM_count || 0);
                const total = parseInt(r.total_employees || 0);
                const name = r[nameField] || "";

                return (
                  <TableRow key={idx} hover>
                    <TableCell sx={{ textAlign: "left" }}>
                      {r.department_name}
                    </TableCell>
                    <TableCell>{EE}</TableCell>
                    <TableCell>{Math.round(r.EE_percent || 0)}%</TableCell>
                    <TableCell>{ME}</TableCell>
                    <TableCell>{Math.round(r.ME_percent || 0)}%</TableCell>
                    <TableCell>{DM}</TableCell>
                    <TableCell>{Math.round(r.DM_percent || 0)}%</TableCell>
                    <TableCell>{total}</TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => fetchDetailsAndShow(name, type, name)}
                      >
                        Preview
                      </Button>
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
    <Box sx={{ p: 3, bgcolor: "background.default", minHeight: "100vh" }}>
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
