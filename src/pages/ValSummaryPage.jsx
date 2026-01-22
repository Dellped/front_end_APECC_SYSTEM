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
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { Delete as DeleteIcon } from "@mui/icons-material";
import apiClient from "../lib/apiClient";
import { getSession, getRole, SESSION_KEYS } from "../lib/storage";
import { ROLES } from "../lib/roles";
import LoadingOverlay from "../components/LoadingOverlay";
import MessageBanner from "../components/MessageBanner";
import Pagination from "../components/Pagination";
import registeredASALogo from "../assets/logo2.png";

const formatPercent = (value) => {
  if (value === null || value === undefined) return "";

  // If already a string like "80%"
  if (typeof value === "string" && value.includes("%")) {
    return value.trim();
  }

  // If number or numeric string
  const num = Number(value);
  return Number.isFinite(num) ? `${Math.round(num)}%` : "";
};

const excelSerialToDate = (serial) => {

  if (serial === "0") return "0";
  
  if (!serial) return "";

  // Excel starts at 1900-01-01
  const excelEpoch = new Date(1899, 11, 30);
  const date = new Date(excelEpoch.getTime() + serial * 86400000);

  const mm = date.getMonth() + 1;
  const dd = date.getDate();
  const yyyy = date.getFullYear();

  return `${mm}/${dd}/${yyyy}`;
};

  
export default function ValidatePage() {
  const adminLikeRoles = [ROLES.ADMIN, ROLES.COO];

  const [loading, setLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState("Validating report...");
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

  // Delete confirmation
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState(null);

  const role = getRole();

  // Get entity info based on role
  const getEntityInfo = useCallback(() => {
    let entityName = "";
    let entityCode = "";
    let branchParam = "";


    if (adminLikeRoles.includes(role)) {
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
      setLoadingMessage("Validating report...");
      const { branchParam } = getEntityInfo();

      try {
       const url = (() => {
      if (role === ROLES.CFOO) {
       return `/api/validate-all?role=${role}`;
       }
       if (role === ROLES.ADMIN || role === ROLES.COO) {
          return `/api/validate-all?role=${role}&all=true`;
        }
     return `/api/validate-all?entity=${encodeURIComponent(branchParam)}&role=${encodeURIComponent(role)}`;
      })();



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

  // Handle delete record
  const handleDeleteClick = (record) => {
    setRecordToDelete(record);
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    if (!recordToDelete || !recordToDelete.id) {
      setShowDeleteConfirm(false);
      return;
    }

    setLoading(true);
    setLoadingMessage("Deleting record...");
    try {
      const { data } = await apiClient.post("/api/delete-files", {
        ids: [recordToDelete.id],
      });

      if (data.success) {
        // Remove from incomplete records
        setIncompleteRecords((prev) =>
          prev.filter((r) => r.id !== recordToDelete.id)
        );
        // Update counts
        setWarningCount((prev) => Math.max(prev - 1, 0));
        showMsg("Record deleted successfully!", "success");
      } else {
        showMsg("Failed to delete record.");
      }
    } catch (err) {
      showMsg(err.message || "Error deleting record.");
    } finally {
      setLoading(false);
      setShowDeleteConfirm(false);
      setRecordToDelete(null);
    }
  };

  const showMsg = (msg, type = "error") => {
    setMessage(msg);
    setMessageType(type);
  };

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

    const isIncompleteStatus = status === "Incomplete";
    const getCellStyle = (value, extra = {}) => {
      const str = value != null ? String(value).trim() : "";
      if (isIncompleteStatus && !str) {
        return { ...extra, bgcolor: "warning.light" };
      }
      return extra;
    };

    // Create a unique key combining multiple fields to ensure uniqueness
    // Use a combination of type, emp_id, id, drive_file_id, and index
    // This ensures uniqueness even when multiple records have the same emp_id
    const uniqueKey = `${isComplete ? 'complete' : 'incomplete'}-${r.id || `emp-${r.emp_id || 'unknown'}-idx-${index !== null ? index : 0}`}-${r.drive_file_id || 'no-file'}`;

    return (
      <TableRow key={uniqueKey} hover>
        <TableCell>
          <Chip label={status} color={statusColor} size="small" />
        </TableCell>
        <TableCell
          sx={getCellStyle(r.emp_id, {
            bgcolor: empIdDup ? "info.light" : "transparent",
          })}
        >
          {r.emp_id || ""}
        </TableCell>
        <TableCell
          sx={getCellStyle(r.employee_name, {
            bgcolor: nameDup ? "info.light" : "transparent",
          })}
        >
          {r.employee_name || ""}
        </TableCell>
        <TableCell sx={getCellStyle(r.position_title)}>
          {r.position_title || ""}
        </TableCell>
        <TableCell sx={getCellStyle(r.date_hired)}>
        {excelSerialToDate(r.date_hired)}
        </TableCell>
        <TableCell sx={getCellStyle(r.immediate_superior)}>
          {r.immediate_superior || ""}
        </TableCell>
        <TableCell sx={getCellStyle(r.department)}>
          {r.department || ""}
        </TableCell>
        <TableCell sx={getCellStyle(r.group)}>{r.group || ""}</TableCell>
        <TableCell sx={getCellStyle(r.division)}>
          {r.division || ""}
        </TableCell>
        <TableCell sx={getCellStyle(r.region)}>{r.region || ""}</TableCell>
        <TableCell sx={getCellStyle(r.area)}>{r.area || ""}</TableCell>
        <TableCell sx={getCellStyle(r.branch)}>{r.branch || ""}</TableCell>
        <TableCell sx={getCellStyle(r.satellite)}>
          {r.satellite || ""}
        </TableCell>
        <TableCell sx={getCellStyle(r.month_from)}>
          {r.month_from || ""}
        </TableCell>
        <TableCell sx={getCellStyle(r.month_to)}>
          {r.month_to || ""}
        </TableCell>
        <TableCell sx={getCellStyle(r.year)}>{r.year || ""}</TableCell>
        <TableCell sx={getCellStyle(r.part_a_total_rating)}>
          {r.part_a_total_rating || ""}
        </TableCell>
        <TableCell sx={getCellStyle(r.part_a_overall_weight)}>
        {formatPercent(r.part_a_overall_weight)}
        </TableCell>
        <TableCell sx={getCellStyle(r.part_a_subtotal)}>
          {r.part_a_subtotal || ""}
        </TableCell>
        <TableCell sx={getCellStyle(r.part_b_total_rating)}>
          {r.part_b_total_rating || ""}
        </TableCell>
        <TableCell sx={getCellStyle(r.part_b_overall_weight)}>
        {formatPercent(r.part_b_overall_weight)}
        </TableCell>
        <TableCell sx={getCellStyle(r.part_b_subtotal)}>
          {r.part_b_subtotal || ""}
        </TableCell>
        <TableCell sx={getCellStyle(r.overall_numeric_rating)}>
          {r.overall_numeric_rating || ""}
        </TableCell>
        <TableCell sx={getCellStyle(r.overall_adjectival_rating)}>
          {r.overall_adjectival_rating || ""}
        </TableCell>
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
          <>
            <TableCell>
              {downloadLink ? (
                <Link href={downloadLink} download color="info">
                  Download
                </Link>
              ) : (
                "-"
              )}
            </TableCell>
            <TableCell>
              <Button
                size="small"
                variant="outlined"
                startIcon={<DeleteIcon />}
                onClick={() => handleDeleteClick(r)}
                sx={{
                  minWidth: "auto",
                  px: 1,
                  borderColor: "#ffe5b4",
                  color: "#ff9800",
                  "&:hover": {
                    borderColor: "#ffc98b",
                    backgroundColor: "#fff3e0",
                  },
                }}
              >
                Delete
              </Button>
            </TableCell>
          </>
        )}
      </TableRow>
    );
  };

  return (
    <Box sx={{ p: 3, bgcolor: "background.default", minHeight: "100vh", position: "relative" }}>
      {loading && <LoadingOverlay message={loadingMessage} />}
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
              <Table stickyHeader size="small"sx={{"& th, & td": {textAlign: "center",
               verticalAlign: "middle",
              },
               }}>
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
                <Table stickyHeader size="small" sx={{"& th, & td": {textAlign: "center",
                verticalAlign: "middle",
                 },
                 }}>
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
                      <TableCell>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paginatedIncomplete.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={27} align="center" sx={{ py: 4 }}>
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

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={showDeleteConfirm}
        onClose={() => {
          setShowDeleteConfirm(false);
          setRecordToDelete(null);
        }}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this record? This action cannot be
            undone.
          </Typography>
          {recordToDelete && (
            <Typography variant="body2" sx={{ mt: 1, color: "text.secondary" }}>
              Employee: {recordToDelete.employee_name || recordToDelete.emp_id}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setShowDeleteConfirm(false);
              setRecordToDelete(null);
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleDeleteConfirm}
            sx={{
              backgroundColor: "#ffe5b4",
              color: "#ff9800",
              "&:hover": {
                backgroundColor: "#ffc98b",
              },
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
