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
  Stack,
  Link,
} from "@mui/material";
import apiClient from "../lib/apiClient";
import { getSession, getRole, SESSION_KEYS } from "../lib/storage";
import { ROLES } from "../lib/roles";
import LoadingOverlay from "../components/LoadingOverlay";
import MessageBanner from "../components/MessageBanner";
import Pagination from "../components/Pagination";

export default function ValSummaryPage() {
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("error");

  // Records
  const [completeRecords, setCompleteRecords] = useState([]);
  const [incompleteRecords, setIncompleteRecords] = useState([]);

  // Summary
  const [validCount, setValidCount] = useState(0);
  const [errorCount, setErrorCount] = useState(0);
  const [warningCount, setWarningCount] = useState(0);

  // Pagination
  const [completePage, setCompletePage] = useState(1);
  const [incompletePage, setIncompletePage] = useState(1);
  const perPage = 10;

  const role = getRole();

  // Get entity info based on role
  const getEntityInfo = useCallback(() => {
    let entityName = "";
    let entityCode = "";
    let branchParam = "";

    if (role === ROLES.ADMIN) {
      return { entityName: "ADMIN", entityCode: "", branchParam: "ADMIN" };
    }

    switch (role) {
      case ROLES.BM:
        entityName = getSession(SESSION_KEYS.BRANCH) || "Unknown Branch";
        entityCode = getSession(SESSION_KEYS.BRANCH_NO) || "";
        branchParam = getSession(SESSION_KEYS.BRANCH_NO) || "";
        break;
      case ROLES.AA:
        entityName = getSession(SESSION_KEYS.AREA_NAME) || "Unknown Area";
        branchParam = getSession(SESSION_KEYS.AREA_ID) || "";
        break;
      case ROLES.RA:
        entityName = getSession(SESSION_KEYS.REGION_NAME) || "Unknown Region";
        branchParam = getSession(SESSION_KEYS.REGION_ID) || "";
        break;
      case ROLES.AVP:
        entityName = getSession(SESSION_KEYS.DIVISION) || "Unknown Division";
        branchParam = getSession(SESSION_KEYS.DIVISION_ID) || "";
        break;
      case ROLES.SVP:
        entityName =
          getSession(SESSION_KEYS.OPERATION_NAME) || "Unknown Operation";
        branchParam = getSession(SESSION_KEYS.OPERATION_ID) || "";
        break;
      case ROLES.CFOO:
        entityName = getSession(SESSION_KEYS.CFO_NAME) || "Unknown CFO";
        branchParam = getSession(SESSION_KEYS.CFO_ID) || "";
        break;
      case ROLES.COO:
        entityName = "";
        branchParam = getSession(SESSION_KEYS.COO_ID) || "";
        break;
      case ROLES.IM:
      case ROLES.ITR:
        entityName = getSession(SESSION_KEYS.DEP_NAME) || "Unknown Department";
        branchParam = getSession(SESSION_KEYS.USER_ID) || "";
        break;
      default:
        entityName = "Unknown";
    }

    return { entityName, entityCode, branchParam };
  }, [role]);

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { branchParam } = getEntityInfo();

      try {
       const url = `/api/validate-reports?entity=${encodeURIComponent(
           branchParam
          )}&role=${encodeURIComponent(role)}`;

        const { data } = await apiClient.get(url);

        if (data.error) {
          setMessage(data.error);
          setLoading(false);
          return;
        }

        setIncompleteRecords(data.incompleteRecords || []);
        setCompleteRecords(data.completeRecords || []);

        const sum = data.summary || { valid: 0, errors: 0, warnings: 0 };
        setValidCount(sum.valid);
        setErrorCount(sum.errors);
        setWarningCount(sum.warnings);
      } catch (err) {
        setMessage(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [role, getEntityInfo]);

  const { entityName, entityCode } = getEntityInfo();
  const displayName =
    role === ROLES.BM ? `${entityCode} - (${entityName})` : entityName;

  // Pagination
  const completeTotalPages = Math.ceil(completeRecords.length / perPage);
  const completeStart = (completePage - 1) * perPage;
  const paginatedComplete = completeRecords.slice(
    completeStart,
    completeStart + perPage
  );

  const incompleteTotalPages = Math.ceil(incompleteRecords.length / perPage);
  const incompleteStart = (incompletePage - 1) * perPage;
  const paginatedIncomplete = incompleteRecords.slice(
    incompleteStart,
    incompleteStart + perPage
  );

  const renderRecordRow = (r, isComplete = true, index = null) => {
    const empIdDup = r.duplicateEmpID;
    const nameDup = r.duplicateName;
    const status = isComplete
      ? "Complete"
      : empIdDup || nameDup
      ? "Duplicate"
      : "Incomplete";
    const statusClass = isComplete
      ? "complete"
      : empIdDup || nameDup
      ? "duplicate"
      : "incomplete";

    const fileId = r.drive_file_id?.trim() || "";
    const openLink = fileId
      ? `https://docs.google.com/spreadsheets/d/${fileId}/edit`
      : "";
    const downloadLink = r.download || "";

    const statusColor = isComplete
      ? "success"
      : empIdDup || nameDup
      ? "info"
      : "warning";

    // Create a unique key combining multiple fields to ensure uniqueness
    // Use a combination of type, emp_id, id, drive_file_id, and index
    // This ensures uniqueness even when multiple records have the same emp_id
    const uniqueKey = `${isComplete ? 'complete' : 'incomplete'}-${r.id || `emp-${r.emp_id || 'unknown'}-idx-${index !== null ? index : 0}`}-${r.drive_file_id || 'no-file'}`;

    return (
      <TableRow key={uniqueKey} hover>
        <TableCell>
          <Chip label={status} color={statusColor} size="small" />
        </TableCell>
        <TableCell sx={{ bgcolor: empIdDup ? "info.light" : "transparent" }}>
          {r.emp_id || ""}
        </TableCell>
        <TableCell sx={{ bgcolor: nameDup ? "info.light" : "transparent" }}>
          {r.employee_name || ""}
        </TableCell>
        <TableCell>{r.position_title || ""}</TableCell>
        <TableCell>{r.date_hired || ""}</TableCell>
        <TableCell>{r.immediate_superior || ""}</TableCell>
        <TableCell>{r.department || ""}</TableCell>
        <TableCell>{r.group || ""}</TableCell>
        <TableCell>{r.division || ""}</TableCell>
        <TableCell>{r.region || ""}</TableCell>
        <TableCell>{r.area || ""}</TableCell>
        <TableCell>{r.branch || ""}</TableCell>
        <TableCell>{r.satellite || ""}</TableCell>
        <TableCell>{r.month_from || ""}</TableCell>
        <TableCell>{r.month_to || ""}</TableCell>
        <TableCell>{r.year || ""}</TableCell>
        <TableCell>{r.part_a_total_rating || ""}</TableCell>
        <TableCell>
          {r.part_a_overall_weight
            ? Math.round(r.part_a_overall_weight) + "%"
            : ""}
        </TableCell>
        <TableCell>{r.part_a_subtotal || ""}</TableCell>
        <TableCell>{r.part_b_total_rating || ""}</TableCell>
        <TableCell>
          {r.part_b_overall_weight
            ? Math.round(r.part_b_overall_weight) + "%"
            : ""}
        </TableCell>
        <TableCell>{r.part_b_subtotal || ""}</TableCell>
        <TableCell>{r.overall_numeric_rating || ""}</TableCell>
        <TableCell>{r.overall_adjectival_rating || ""}</TableCell>
        <TableCell>
          {openLink ? (
            <Link href={openLink} target="_blank" rel="noopener noreferrer" color="info">
              Open
            </Link>
          ) : (
            "-"
          )}
        </TableCell>
        {!isComplete && (
          <TableCell>
            {downloadLink ? (
              <Link href={downloadLink} download>
                Download
              </Link>
            ) : (
              "-"
            )}
          </TableCell>
        )}
      </TableRow>
    );
  };

  return (
    <Box sx={{ p: 3, bgcolor: "background.default", minHeight: "100vh", position: "relative" }}>
      {loading && <LoadingOverlay message="Validating report..." />}
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
              Validation Summary
            </Typography>
             {role !== 'COO' && role !== 'ADMIN' &&(
            <Chip label={displayName} color="primary" sx={{ mt: 2 }} />
             )}
          </Box>

          {/* Legend */}
          <Stack direction="row" spacing={2} sx={{ mb: 3, flexWrap: "wrap" }}>
            <Typography variant="body2" fontWeight="bold">
              Legend:
            </Typography>
            <Chip label={`Complete Records: ${validCount}`} color="success" />
            <Chip label={`Duplicate Records: ${errorCount}`} color="info" />
            <Chip
              label={`Incomplete Records: ${warningCount}`}
              color="warning"
            />
          </Stack>

          {/* Valid Records Table */}
          <Paper elevation={2} sx={{ mb: 3 }}>
            <Box
              sx={{
                bgcolor: "success.main",
                color: "white",
                p: 1.5,
                textAlign: "center",
              }}
            >
              <Typography variant="h6" fontWeight="bold">
                Valid Records
              </Typography>
            </Box>
            <TableContainer sx={{ maxHeight: 600, overflowX: "auto" }}>
              <Table stickyHeader size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Status</TableCell>
                    <TableCell>EMP ID</TableCell>
                    <TableCell>Employee Name</TableCell>
                    <TableCell>Position Title</TableCell>
                    <TableCell>Date Hired</TableCell>
                    <TableCell>Immediate Superior</TableCell>
                    <TableCell>Department</TableCell>
                    <TableCell>Group</TableCell>
                    <TableCell>Division</TableCell>
                    <TableCell>Region</TableCell>
                    <TableCell>Area</TableCell>
                    <TableCell>Branch</TableCell>
                    <TableCell>Satellite</TableCell>
                    <TableCell>Month From</TableCell>
                    <TableCell>Month To</TableCell>
                    <TableCell>Year</TableCell>
                    <TableCell>Part A Total Rating</TableCell>
                    <TableCell>Part A Overall Weight</TableCell>
                    <TableCell>Part A Subtotal</TableCell>
                    <TableCell>Part B Total Rating</TableCell>
                    <TableCell>Part B Overall Weight</TableCell>
                    <TableCell>Part B Subtotal</TableCell>
                    <TableCell>Overall Numeric Rating</TableCell>
                    <TableCell>Overall Adjectival Rating</TableCell>
                    <TableCell>Preview</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedComplete.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={25} align="center" sx={{ py: 4 }}>
                        <Typography color="text.secondary">
                          No complete records found
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedComplete.map((r, idx) => renderRecordRow(r, true, idx))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <Box sx={{ p: 2 }}>
              <Pagination
                currentPage={completePage}
                totalPages={completeTotalPages}
                onPageChange={setCompletePage}
              />
            </Box>
          </Paper>

          {/* Invalid Records Table */}
          {incompleteRecords.length > 0 && (
            <Paper elevation={2}>
              <Box
                sx={{
                  bgcolor: "info.main",
                  color: "white",
                  p: 1.5,
                  textAlign: "center",
                }}
              >
                <Typography variant="h6" fontWeight="bold">
                  Invalid Records
                </Typography>
                <Typography variant="caption">
                  Please reupload the file.
                </Typography>
              </Box>
              <TableContainer sx={{ maxHeight: 600, overflowX: "auto" }}>
                <Table stickyHeader size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Status</TableCell>
                      <TableCell>EMP ID</TableCell>
                      <TableCell>Employee Name</TableCell>
                      <TableCell>Position</TableCell>
                      <TableCell>Date Hired</TableCell>
                      <TableCell>Immediate Superior</TableCell>
                      <TableCell>Department</TableCell>
                      <TableCell>Group</TableCell>
                      <TableCell>Division</TableCell>
                      <TableCell>Region</TableCell>
                      <TableCell>Area</TableCell>
                      <TableCell>Branch</TableCell>
                      <TableCell>Satellite</TableCell>
                      <TableCell>Month From</TableCell>
                      <TableCell>Month To</TableCell>
                      <TableCell>Year</TableCell>
                      <TableCell>Part A Total Rating</TableCell>
                      <TableCell>Part A Overall Weight</TableCell>
                      <TableCell>Part A Subtotal</TableCell>
                      <TableCell>Part B Total Rating</TableCell>
                      <TableCell>Part B Overall Weight</TableCell>
                      <TableCell>Part B Subtotal</TableCell>
                      <TableCell>Overall Numeric Rating</TableCell>
                      <TableCell>Overall Adjectival Rating</TableCell>
                      <TableCell>Preview</TableCell>
                      <TableCell>Download</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paginatedIncomplete.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={26} align="center" sx={{ py: 4 }}>
                          <Typography color="text.secondary">
                            No incomplete records found
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      paginatedIncomplete.map((r, idx) => renderRecordRow(r, false, idx))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
              <Box sx={{ p: 2 }}>
                <Pagination
                  currentPage={incompletePage}
                  totalPages={incompleteTotalPages}
                  onPageChange={setIncompletePage}
                />
              </Box>
            </Paper>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
