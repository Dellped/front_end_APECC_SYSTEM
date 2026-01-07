import { useState, useEffect, useCallback, useRef } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  IconButton,
  Alert,
  Stack,
} from "@mui/material";
import {
  CloudUpload as UploadIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  FolderOpen as FolderIcon,
} from "@mui/icons-material";
import apiClient from "../lib/apiClient";
import { getSession, getRole, SESSION_KEYS } from "../lib/storage";
import { ROLES } from "../lib/roles";
import LoadingOverlay from "../components/LoadingOverlay";
import MessageBanner from "../components/MessageBanner";
import Pagination from "../components/Pagination";

export default function UploadPage() {
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("Uploading...");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("error");

  // Counts
  const [expectedCount, setExpectedCount] = useState(0);
  const [formsCount, setFormsCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);

  // Files
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [checkedFiles, setCheckedFiles] = useState(new Set());

  // Modals
  const [showMfoModal, setShowMfoModal] = useState(false);
  const [showEditCountModal, setShowEditCountModal] = useState(false);
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);
  const [showFileListModal, setShowFileListModal] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [showConfirmUpload, setShowConfirmUpload] = useState(false);

  // Local delete confirmations (selectedFiles only)
  const [showConfirmLocalDelete, setShowConfirmLocalDelete] = useState(false);
  const [localDeleteMode, setLocalDeleteMode] = useState(null);
  const [localDeleteIndex, setLocalDeleteIndex] = useState(null);

  //checkbox
  const [checkedSelectedFiles, setCheckedSelectedFiles] = useState(new Set());

  // Form inputs
  const [mfoInput, setMfoInput] = useState("");
  const [editCountInput, setEditCountInput] = useState("");
  const [duplicateFiles, setDuplicateFiles] = useState([]);
  const [duplicateResolve, setDuplicateResolve] = useState(null);
  const [deleteResolve, setDeleteResolve] = useState(null);

  // Pagination
  const [uploadedPage, setUploadedPage] = useState(1);
  const [selectedPage, setSelectedPage] = useState(1);
  const uploadedPerPage = 5;
  const selectedPerPage = 10;

  const fileInputRef = useRef(null);
  const role = getRole();
  const isAdmin = role === ROLES.ADMIN;

  // Get entity info based on role
  const getEntityInfo = useCallback(() => {
    let entityName = "";
    let entityCode = "";

    switch (role) {
      case ROLES.BM:
        entityName = getSession(SESSION_KEYS.BRANCH) || "Unknown Branch";
        entityCode = getSession(SESSION_KEYS.BRANCH_NO) || "";
        break;
      case ROLES.AA:
        entityName = getSession(SESSION_KEYS.AREA_NAME) || "Unknown Area";
        entityCode = getSession(SESSION_KEYS.AREA_ID) || "";
        break;
      case ROLES.RA:
        entityName = getSession(SESSION_KEYS.REGION_NAME) || "Unknown Region";
        entityCode = getSession(SESSION_KEYS.REGION_ID) || "";
        break;
      case ROLES.AVP:
        entityName = getSession(SESSION_KEYS.DIVISION) || "Unknown Division";
        entityCode = getSession(SESSION_KEYS.DIVISION_ID) || "";
        break;
      case ROLES.SVP:
        entityName =
          getSession(SESSION_KEYS.OPERATION_NAME) || "Unknown Operation";
        entityCode = getSession(SESSION_KEYS.OPERATION_ID) || "";
        break;
      case ROLES.CFOO:
        entityName = getSession(SESSION_KEYS.CFO_NAME) || "Unknown CFO";
        entityCode = getSession(SESSION_KEYS.CFO_ID) || "";
        break;
      case ROLES.COO:
        entityName =  "";
        entityCode = getSession(SESSION_KEYS.COO_ID) || "";
        break;
      case ROLES.IM:
      case ROLES.ITR:
        entityName = getSession(SESSION_KEYS.DEP_NAME) || "Unknown Department";
        entityCode = getSession(SESSION_KEYS.USER_ID) || "";
        break;
      case ROLES.ADMIN:
        entityName = "";
        entityCode = "ADMIN";
        break;
      default:
        entityName = "Unknown";
    }

    return { entityName, entityCode };
  }, [role]);

  const getRoleValue = useCallback(() => {
    if (role === ROLES.ADMIN) return "ADMIN";

    switch (role) {
      case ROLES.BM:
        return getSession(SESSION_KEYS.BRANCH_NO) || "Unknown";
      case ROLES.AA:
        return getSession(SESSION_KEYS.AREA_ID) || "Unknown";
      case ROLES.RA:
        return getSession(SESSION_KEYS.REGION_ID) || "Unknown";
      case ROLES.AVP:
        return getSession(SESSION_KEYS.DIVISION_ID) || "Unknown";
      case ROLES.SVP:
        return getSession(SESSION_KEYS.OPERATION_ID) || "Unknown";
      case ROLES.CFOO:
        return getSession(SESSION_KEYS.CFO_ID) || "Unknown";
      case ROLES.COO:
        return getSession(SESSION_KEYS.COO_ID) || "Unknown";
      case ROLES.IM:
      case ROLES.ITR:
        return getSession(SESSION_KEYS.USER_ID) || "Unknown";
      default:
        return null;
    }
  }, [role]);

  const showMsg = (msg, type = "error") => {
    setMessage(msg);
    setMessageType(type);
  };

  // Fetch employee count
  const fetchEmployeeCount = useCallback(async () => {
    const value = getRoleValue();
    try {
      const { data } = await apiClient.get(
        `/api/employee-count?role=${encodeURIComponent(
          role
        )}&value=${encodeURIComponent(value)}`
      );
      const count = data.employee_count !== null ? data.employee_count : 0;
      setExpectedCount(count);
      return data.empty;
    } catch (err) {
      console.error(err);
      return false;
    }
  }, [role, getRoleValue]);

  // Fetch uploaded forms
  const fetchUploadedForms = useCallback(async () => {
    const value = getRoleValue();
    try {
      const { data } = await apiClient.get(
        `/api/total-uploaded-forms?role=${encodeURIComponent(
          role
        )}&value=${encodeURIComponent(value)}`
      );
      const forms = Number(data.totalUploadedForms) || 0;
      setFormsCount(forms);
      setUploadedFiles(data.files || []);
      return forms;
    } catch (err) {
      console.error(err);
      return 0;
    }
  }, [role, getRoleValue]);

  // Update pending count
  useEffect(() => {
    setPendingCount(Math.max(expectedCount - formsCount, 0));
  }, [expectedCount, formsCount]);

  // Initial load
  useEffect(() => {
    fetchEmployeeCount();
    fetchUploadedForms();
  }, [fetchEmployeeCount, fetchUploadedForms]);

  // Refresh summary
  const refreshSummary = useCallback(async () => {
    await fetchEmployeeCount();
    await fetchUploadedForms();
  }, [fetchEmployeeCount, fetchUploadedForms]);

  // File input handler
  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    setSelectedFiles((prev) => [...prev, ...newFiles]);
    e.target.value = "";
  };

  // Remove file from selection
  const removeSelectedFile = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Check for duplicate filenames
  const checkDuplicateFilenames = async (filenames) => {
    const value = getRoleValue();
    try {
      const { data } = await apiClient.post("/api/check-filename", {
        role,
        value,
        filenames,
      });
      return data;
    } catch (err) {
      console.error(err);
      return { duplicates: [] };
    }
  };

  // Handle duplicate modal
  const handleDuplicateDecision = (replace) => {
    if (duplicateResolve) {
      duplicateResolve(replace);
      setDuplicateResolve(null);
    }
    setShowDuplicateModal(false);
  };

  // Proceed with upload
  const proceedUpload = async () => {
    setLoading(true);
    setLoadingMessage("Uploading...");

    const formData = new FormData();
    selectedFiles.forEach((file) => formData.append("file", file));

    const safeValue = (val) =>
      val && val !== "undefined" && val !== "null" ? val : null;

    formData.append("role", role);
    formData.append("employeeCount", mfoInput || 0);

    // Append role-specific data
    if (role === ROLES.BM) {
      formData.append(
        "branchNo",
        safeValue(getSession(SESSION_KEYS.BRANCH_NO))
      );
    }
    if (role === ROLES.AA) {
      formData.append("area_id", safeValue(getSession(SESSION_KEYS.AREA_ID)));
      formData.append(
        "area_name",
        safeValue(getSession(SESSION_KEYS.AREA_NAME))
      );
    }
    if (role === ROLES.RA) {
      formData.append(
        "region_id",
        safeValue(getSession(SESSION_KEYS.REGION_ID))
      );
      formData.append(
        "region_name",
        safeValue(getSession(SESSION_KEYS.REGION_NAME))
      );
    }
    if (role === ROLES.AVP) {
      formData.append(
        "division_id",
        safeValue(getSession(SESSION_KEYS.DIVISION_ID))
      );
      formData.append("division", safeValue(getSession(SESSION_KEYS.DIVISION)));
    }
    if (role === ROLES.SVP) {
      formData.append(
        "operation_id",
        safeValue(getSession(SESSION_KEYS.OPERATION_ID))
      );
      formData.append(
        "operation_name",
        safeValue(getSession(SESSION_KEYS.OPERATION_NAME))
      );
    }
    if (role === ROLES.CFOO) {
      formData.append("cfo_id", safeValue(getSession(SESSION_KEYS.CFO_ID)));
      formData.append("cfo_name", safeValue(getSession(SESSION_KEYS.CFO_NAME)));
    }
    if (role === ROLES.COO) {
      formData.append("coo_id", safeValue(getSession(SESSION_KEYS.COO_ID)));
      formData.append("coo_name", safeValue(getSession(SESSION_KEYS.COO_NAME)));
    }
    if (role === ROLES.IM || role === ROLES.ITR) {
      formData.append("dep_id", safeValue(getSession(SESSION_KEYS.DEP_ID)));
      formData.append("dep_name", safeValue(getSession(SESSION_KEYS.DEP_NAME)));
      formData.append(
        "uploaded_by",
        safeValue(getSession(SESSION_KEYS.USER_ID))
      );
    }
    if (role === ROLES.ADMIN) {
      formData.append("uploaded_by", "ADMIN"); 
    }

    try {
      const { data: result } = await apiClient.post(
        "/api/uploading",
        formData,
        true
      );

      if (result.replacedFiles?.length > 0) {
        showMsg(
          `Replaced file(s): ${result.replacedFiles.join(", ")}`,
          "success"
        );
      } else {
        showMsg("Upload complete!", "success");
      }
      setSelectedFiles([]);
      await refreshSummary();
    } catch (err) {
      showMsg(err.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  // Form submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedFiles.length) {
      showMsg("Choose files first.");
      return;
    }

    // Check if employee count is set
    const empty = await fetchEmployeeCount();
    if (empty) {
      setShowMfoModal(true);
      return;
    }

    // Check file limits
    if (formsCount + selectedFiles.length > expectedCount) {
      showMsg(
        `You can upload only ${expectedCount - formsCount} more file(s) from the total expected count!!.`
      );
      return;
    }

    // Check for duplicates
    const filenames = selectedFiles.map((f) => f.name);
    const duplicateCheck = await checkDuplicateFilenames(filenames);

    if (duplicateCheck.duplicates?.length > 0) {
      setDuplicateFiles(duplicateCheck.duplicates);
      setShowDuplicateModal(true);

      const proceed = await new Promise((resolve) => {
        setDuplicateResolve(() => resolve);
      });

      if (!proceed) {
        showMsg("Upload cancelled.");
        return;
      }
    }

    await proceedUpload();
  };

  // Save MFO count
  const saveMfoCount = async () => {
    const value = getRoleValue();
    const count = parseInt(mfoInput);

    if (isNaN(count) || count < 0 || count > 15) {
      showMsg("Enter a valid number");
      return;
    }

    if (selectedFiles.length > count) {
      showMsg(`You can upload ${count} file(s) based on the employee count.`);
      return;
    }

    if (count < formsCount) {
      showMsg(
        `Employee count cannot be less than already uploaded files (${formsCount}).`
      );
      return;
    }

    try {
      const { data } = await apiClient.post(
        "/api/employee-count/set-employee-count",
        {
          role,
          value,
          count,
        }
      );

      if (data.success) {
        showMsg("Employee count saved!", "success");
        setExpectedCount(count);
        setShowMfoModal(false);
        setMfoInput("");
        await fetchUploadedForms();
        await proceedUpload();
      } else {
        showMsg(data.error || "Failed to save employee count.");
      }
    } catch (err) {
      showMsg("Error saving employee count.");
    }
  };

  // Save edited employee count
  const saveEditedCount = async () => {
    const value = getRoleValue();
    const newCount = parseInt(editCountInput);

    if (isNaN(newCount) || newCount < 0) {
      showMsg("Enter a valid number.");
      return;
    }

    if (newCount < formsCount) {
      showMsg(
        `Employee count cannot be lower than uploaded forms (${formsCount}).`
      );
      return;
    }

    try {
      const { data } = await apiClient.post(
        "/api/employee-count/set-employee-count",
        {
          role,
          value,
          count: newCount,
        }
      );

      if (data.success) {
        setExpectedCount(newCount);
        setShowEditCountModal(false);
        showMsg("Employee count updated!", "success");
        await fetchUploadedForms();
      } else {
        showMsg("Failed to update employee count.");
      }
    } catch (err) {
      showMsg("Error updating employee count.");
    }
  };

  // Delete selected files from DB
  const handleDeleteFiles = async () => {
    if (checkedFiles.size === 0) return;

    setShowConfirmDelete(true);

    const confirmed = await new Promise((resolve) => {
      setDeleteResolve(() => resolve);
    });

    if (!confirmed) return;

    setLoading(true);
    setLoadingMessage("Deleting...");

    try {
      const { data } = await apiClient.post("/api/delete-files", {
        ids: Array.from(checkedFiles),
      });

      if (data.success) {
        setCheckedFiles(new Set());
        showMsg("Selected files deleted successfully!", "success");
        await refreshSummary();
      } else {
        showMsg("Failed to delete files.");
      }
    } catch (err) {
      showMsg("Error deleting files.");
    } finally {
      setLoading(false);
    }
  };

    // Select all selectedFiles (File List Modal)
    const toggleSelectAllSelectedFiles = (checked) => {
     if (checked) {
    const allIndices = selectedFiles.map((_, idx) => idx);
    setCheckedSelectedFiles(new Set(allIndices));
     } else {
    setCheckedSelectedFiles(new Set());
      }
      };

  // Toggle file checkbox
  const toggleFileCheck = (fileId) => {
    setCheckedFiles((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(fileId)) {
        newSet.delete(fileId);
      } else {
        newSet.add(fileId);
      }
      return newSet;
    });
  };

  // Select all files
  const toggleSelectAll = (checked) => {
    if (checked) {
      const allIds = uploadedFiles.map((f) => f.id);
      setCheckedFiles(new Set(allIds));
    } else {
      setCheckedFiles(new Set());
    }
  };

  const { entityName, entityCode } = getEntityInfo();
  const displayName =
    role === ROLES.BM ? `${entityCode} - (${entityName})` : entityName;

  // Pagination
  const uploadedTotalPages = Math.ceil(uploadedFiles.length / uploadedPerPage);
  const uploadedStart = (uploadedPage - 1) * uploadedPerPage;
  const paginatedUploaded = uploadedFiles.slice(
    uploadedStart,
    uploadedStart + uploadedPerPage
  );

  const selectedTotalPages = Math.ceil(selectedFiles.length / selectedPerPage);
  const selectedStart = (selectedPage - 1) * selectedPerPage;
  const paginatedSelected = selectedFiles.slice(
    selectedStart,
    selectedStart + selectedPerPage
  );

  return (
    <Box sx={{ p: 3, bgcolor: "background.default", minHeight: "100vh", position: "relative" }}>
      {loading && <LoadingOverlay message={loadingMessage} />}
      <MessageBanner
        message={message}
        type={messageType}
        onClose={() => setMessage("")}
      />

      <Card sx={{ maxWidth: 1400, mx: "auto", borderRadius: 3 }}>
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
          </Box>

          {/* Summary Cards */}
          <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
          <Grid  container spacing={2} sx={{  maxWidth: 1200  }}>
            <Grid item xs={12} sm={4}>
              <Paper
                elevation={2}
                sx={{
                  p: 2,
                  textAlign: "center",
                  bgcolor: "#e0efff",
                  borderRadius: 2,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  height: "100%", // ensure full height
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <Typography variant="body2" fontWeight="bold">
                    Total Expected
                  </Typography>
                  {(
                    <IconButton
                      size="small"
                      onClick={() => {
                        setEditCountInput(expectedCount.toString());
                        setShowEditCountModal(true);
                      }}
                      sx={{ p: 0.5 }}
                    ><EditIcon fontSize="small" /></IconButton>
                  )}
                </Box>
                <Typography variant="h6" fontWeight="bold">
                  {expectedCount}
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Paper
                elevation={2}
                sx={{
                  p: 2,
                  textAlign: "center",
                  bgcolor: "#eaffea",
                  borderRadius: 2,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  height: "100%",
                }}
              >
                <Typography variant="body2" fontWeight="bold">
                  Total Uploaded Forms
                </Typography>
                <Typography variant="h6" fontWeight="bold">
                  {formsCount}
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Paper
                elevation={2}
                sx={{
                  p: 2,
                  textAlign: "center",
                  bgcolor: "#fff3cd",
                  borderRadius: 2,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  height: "100%",
                }}
              >
                <Typography variant="body2" fontWeight="bold">
                  Pending
                </Typography>
                <Typography variant="h6" fontWeight="bold">
                  {pendingCount}
                </Typography>
              </Paper>
            </Grid>
          </Grid>
          </Box>

          {/* Reminder Alert */}
          <Alert severity="warning" sx={{ mb: 3 }}>
            Reminder: Please ensure all expected forms are reviewed before
            submission.
          </Alert>

          {/* Upload Section */}
          <Paper elevation={1} sx={{ p: 3, mb: 3, bgcolor: "#f8fafc" }}>
            <Stack
              direction="row"
              spacing={2}
              alignItems="center"
              flexWrap="wrap"
              sx={{ mb: 2 }}
            >
              <Chip label={`Role: ${role}`} color="primary" />
              {role !== 'COO' && role !== 'ADMIN' &&(
              <Chip label={displayName} color="warning" />
              )}
              <Box sx={{ flexGrow: 1 }} />
              <Button
                component="label"
                variant="contained"
                startIcon={<UploadIcon />}
                sx={{ mr: 1 }}
              >
                Choose Files{" "}
                {selectedFiles.length > 0 && `(${selectedFiles.length})`}
                <input
                  ref={fileInputRef}
                  type="file"
                  id="file-input"
                  accept=".xlsx,.xls"
                  multiple
                  onChange={handleFileChange}
                  hidden
                />
              </Button>
              <Button
                variant="contained"
                color="success"
                onClick={handleSubmit}
                disabled={selectedFiles.length === 0}
              >
                Upload
              </Button>
              <Button
                variant="outlined"
                startIcon={<FolderIcon />}
                onClick={() => setShowFileListModal(true)}
              >
                Files for Review
              </Button>
            </Stack>

            {/* Uploaded Files Table */}
            <TableContainer component={Paper} elevation={2}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell
                      colSpan={3}
                      sx={{
                        bgcolor: "primary.main",
                        color: "white",
                        textAlign: "center",
                        fontWeight: "bold",
                      }}
                    >
                      Submitted Files
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <Checkbox
                        checked={
                          uploadedFiles.length > 0 &&
                          checkedFiles.size === uploadedFiles.length
                        }
                        onChange={(e) => toggleSelectAll(e.target.checked)}
                        disabled={uploadedFiles.length === 0}
                      />
                      Select All
                    </TableCell>
                    <TableCell>File Name</TableCell>
                    <TableCell>Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedUploaded.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} align="center" sx={{ py: 4 }}>
                        <Typography color="text.secondary">
                          No files uploaded yet.
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedUploaded.map((file) => {
                      const utcDate = new Date(file.uploaded_at);
                      const localDate = new Date(
                        utcDate.getTime() + 8 * 60 * 60 * 1000
                      );
                      return (
                        <TableRow key={file.id} hover>
                          <TableCell>
                            <Checkbox
                              checked={checkedFiles.has(file.id)}
                              onChange={() => toggleFileCheck(file.id)}
                            />
                          </TableCell>
                          <TableCell>{file.filename}</TableCell>
                          <TableCell>
                            {localDate.toLocaleString("en-US", {
                              hour12: true,
                            })}
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
              <Box
                sx={{
                  p: 2,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Button
                  variant="contained"
                  color="warning"
                  startIcon={<DeleteIcon />}
                  onClick={handleDeleteFiles}
                  disabled={checkedFiles.size === 0}
                >
                  Delete Selected ({checkedFiles.size})
                </Button>
                <Pagination
                  currentPage={uploadedPage}
                  totalPages={uploadedTotalPages}
                  onPageChange={setUploadedPage}
                />
              </Box>
            </TableContainer>
          </Paper>
        </CardContent>
      </Card>

      {/* MFO Modal */}
      <Dialog
        open={showMfoModal}
        onClose={() => {
          setShowMfoModal(false);
          setMfoInput("");
        }}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Enter Employee Count</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Please input how many active employees do you have:
          </Typography>
          <TextField
            fullWidth
            type="number"
            inputProps={{ min: 0, max: 15 }}
            placeholder="e.g., 5"
            value={mfoInput}
            onChange={(e) => setMfoInput(e.target.value)}
            autoFocus
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setShowMfoModal(false);
              setMfoInput("");
            }}
          >
            Cancel
          </Button>
          <Button variant="contained" onClick={saveMfoCount}>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Count Modal */}
      <Dialog
        open={showEditCountModal}
        onClose={() => setShowEditCountModal(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Edit Employee Count</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Update your expected employee count:
          </Typography>
          <TextField
            fullWidth
            type="number"
            inputProps={{ min: 0, max: 300 }}
            placeholder="Enter new count"
            value={editCountInput}
            onChange={(e) => setEditCountInput(e.target.value)}
            autoFocus
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowEditCountModal(false)}>Cancel</Button>
          <Button variant="contained" color="success" onClick={saveEditedCount}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Duplicate Modal */}
      <Dialog
        open={showDuplicateModal}
        onClose={() => handleDuplicateDecision(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Duplicate Files Detected</DialogTitle>
        <DialogContent>
          <Box sx={{ maxHeight: 200, overflowY: "auto" }}>
            {duplicateFiles.map((f, i) => (
              <Typography key={i} variant="body2" sx={{ mb: 1 }}>
                {f}
              </Typography>
            ))}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleDuplicateDecision(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={() => handleDuplicateDecision(true)}
          >
            Replace
          </Button>
        </DialogActions>
      </Dialog>

      {/* File List Modal */}
      <Dialog
        open={showFileListModal}
        onClose={() => setShowFileListModal(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>File List</DialogTitle>
        <Box sx={{ display: "flex", alignItems: "center", mb: 1,  justifyContent: "flex-end",}}>
        <Typography sx={{ mr: 3 }}>Select All</Typography>
        <Checkbox
        checked={
          selectedFiles.length > 0 &&
          checkedSelectedFiles.size === selectedFiles.length
           }
          onChange={(e) => toggleSelectAllSelectedFiles(e.target.checked)}
          disabled={selectedFiles.length === 0}
          sx={{ transform: "translateX(-23px)" }}
        />
        </Box>
        <DialogContent>
          {selectedFiles.length === 0 ? (
            <Typography color="text.secondary">No files selected</Typography>
          ) : (
            <Box>
              {paginatedSelected.map((file, idx) => {
                const actualIdx = selectedStart + idx;
                return (
                  <Box
                    key={actualIdx}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      py: 1,
                      borderBottom: "1px solid #eee",
                    }}
                  >
                    <Typography variant="body2">{file.name}</Typography>
                  <Checkbox
                  checked={checkedSelectedFiles.has(actualIdx)}
                   onChange={() => {
                  setCheckedSelectedFiles((prev) => {
                 const next = new Set(prev);
                  next.has(actualIdx) ? next.delete(actualIdx) : next.add(actualIdx);
                  return next;
                  });
                    }}
                  />
                  </Box>
                );
              })}
              <Pagination
                currentPage={selectedPage}
                totalPages={selectedTotalPages}
                onPageChange={setSelectedPage}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button
             color="warning"
              disabled={checkedSelectedFiles.size === 0}
              onClick={() => {
              setLocalDeleteMode("multiple");
             setShowConfirmLocalDelete(true);
              }}
            sx={{ mr: 1 }}
           >
           Delete Selected ({checkedSelectedFiles.size})
         </Button>
          <Button
           color="warning"
                disabled={selectedFiles.length === 0}
                onClick={() => {
                 setLocalDeleteMode("all");
                 setShowConfirmLocalDelete(true);
                 }}
              >
             Delete All
            </Button>
          <Button
            variant="contained"
            onClick={() => setShowFileListModal(false)}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirm Delete Modal */}
      <Dialog
        open={showConfirmDelete}
        onClose={() => {
          setShowConfirmDelete(false);
          deleteResolve?.(false);
        }}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete {checkedFiles.size} file(s) from the uploaded?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setShowConfirmDelete(false);
              deleteResolve?.(false);
            }}
          >
            Cancel
          </Button>
          <Button
           variant="contained"
          color="warning"
          onClick={() => {
          deleteResolve?.(true);
           setShowConfirmDelete(false); 
           }}
          >
           Delete
          </Button>

        </DialogActions>
      </Dialog>
      {/* Confirm Local Delete (Selected Files Only) */}
      <Dialog
        open={showConfirmLocalDelete}
       onClose={() => setShowConfirmLocalDelete(false)}
       maxWidth="xs"
       fullWidth
      >
       <DialogTitle>Confirm Delete</DialogTitle>
     <DialogContent>
     <Typography>
      {localDeleteMode === "all" &&
        "Are you sure you want to delete all selected files?"}

      {localDeleteMode === "multiple" &&
        `Are you sure you want to delete ${checkedSelectedFiles.size} selected file(s)?`}
    </Typography>
      </DialogContent>
     <DialogActions>
    <Button onClick={() => setShowConfirmLocalDelete(false)}>
      Cancel
    </Button>

    {/* ✅ FIXED DELETE */}
    <Button
      variant="contained"
      color="warning"
      onClick={() => {
        if (localDeleteMode === "all") {
          setSelectedFiles([]);
          setCheckedSelectedFiles(new Set());
        }

        if (localDeleteMode === "multiple") {
          setSelectedFiles((prev) =>
            prev.filter((_, index) => !checkedSelectedFiles.has(index))
          );
          setCheckedSelectedFiles(new Set());
        }

        setShowConfirmLocalDelete(false);
        setLocalDeleteMode(null);
      }}
    >
      Delete
    </Button>
  </DialogActions>
</Dialog>
    </Box>
  );
}
