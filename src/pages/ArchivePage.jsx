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
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from "@mui/material";
import {
  Visibility as ViewIcon,
  Download as DownloadIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import apiClient from "../lib/apiClient";
import { getSession, getRole, SESSION_KEYS } from "../lib/storage";
import { ROLES } from "../lib/roles";
import LoadingOverlay from "../components/LoadingOverlay";
import MessageBanner from "../components/MessageBanner";
import Pagination from "../components/Pagination";

export default function ArchivePage() {
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("error");

  // Files
  const [archiveFiles, setArchiveFiles] = useState([]);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  // Confirm modal
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const role = getRole();

  // Get entity info
  const getEntityInfo = useCallback(() => {
    if (role === ROLES.ADMIN) {
      return { entityName: "ADMIN", branchParam: "" };
    }

    const entityName = getSession(SESSION_KEYS.BRANCH) || "Unknown Branch";
    const branchParam = getSession(SESSION_KEYS.BRANCH_NO) || "";
    return { entityName, branchParam };
  }, [role]);

  // Fetch archive data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { branchParam } = getEntityInfo();

      try {
        let url;
        if (role === ROLES.ADMIN || !branchParam) {
          url = `/api/archive?all=true`;
        } else {
          url = `/api/archive?branch=${encodeURIComponent(branchParam)}`;
        }

        const { data } = await apiClient.get(url);

        if (data.error) {
          setMessage(data.error);
          setLoading(false);
          return;
        }

        setArchiveFiles(data.files || data || []);
      } catch (err) {
        setMessage(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [role, getEntityInfo]);

  // Delete file
  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      const { data } = await apiClient.delete(
        `/api/archive/delete?id=${deleteId}`
      );

      if (data.error) {
        setMessage(data.error);
      } else {
        setMessage("File deleted successfully");
        setMessageType("success");
        setArchiveFiles((prev) =>
          prev.filter((f) => f.employee_ratings_id != deleteId)
        );
      }
    } catch (err) {
      setMessage("Error deleting file");
    } finally {
      setShowConfirm(false);
      setDeleteId(null);
    }
  };

  const { entityName } = getEntityInfo();

  // Pagination
  const totalPages = Math.ceil(archiveFiles.length / rowsPerPage);
  const start = (currentPage - 1) * rowsPerPage;
  const paginatedFiles = archiveFiles.slice(start, start + rowsPerPage);

  return (
    <Box
      sx={{
        p: 3,
        bgcolor: "background.default",
        minHeight: "100vh",
        position: "relative",
      }}
    >
      {loading && <LoadingOverlay message="Loading archived forms..." />}
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
              Archived Forms
            </Typography>
            <Chip label={entityName} color="primary" sx={{ mt: 2 }} />
          </Box>

          {/* Archive Table */}
          <Paper elevation={2}>
            <Box
              sx={{
                bgcolor: "primary.main",
                color: "white",
                p: 1.5,
                textAlign: "center",
              }}
            >
              <Typography variant="h6" fontWeight="bold">
                Archived Forms
              </Typography>
            </Box>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>File Name</TableCell>
                    <TableCell>Date Uploaded</TableCell>
                    <TableCell>Preview</TableCell>
                    <TableCell>Download</TableCell>
                    <TableCell>Delete</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedFiles.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                        <Typography color="text.secondary">
                          No archived files found.
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedFiles.map((file, idx) => {
                      let localDateStr = "N/A";
                      if (file.archived_at) {
                        const date = new Date(file.archived_at);
                        if (!isNaN(date)) {
                          const localDate = new Date(
                            date.getTime() + 8 * 60 * 60 * 1000
                          );
                          localDateStr = localDate.toLocaleString("en-US", {
                            hour12: true,
                          });
                        }
                      }
                      const viewLink = `https://drive.google.com/file/d/${file.drive_file_id}/view`;
                      const downloadLink = `https://drive.google.com/uc?export=download&id=${file.drive_file_id}`;

                      return (
                        <TableRow key={file.employee_ratings_id || idx} hover>
                          <TableCell>{file.filename}</TableCell>
                          <TableCell>{localDateStr}</TableCell>
                          <TableCell>
                            <Button
                              variant="outlined"
                              size="small"
                              startIcon={<ViewIcon />}
                              href={viewLink}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              View
                            </Button>
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="outlined"
                              size="small"
                              startIcon={<DownloadIcon />}
                              href={downloadLink}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              Download
                            </Button>
                          </TableCell>
                          <TableCell>
                            <IconButton
                              color="error"
                              onClick={() => {
                                setDeleteId(file.employee_ratings_id);
                                setShowConfirm(true);
                              }}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <Box sx={{ p: 2 }}>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </Box>
          </Paper>
        </CardContent>
      </Card>

      {/* Confirm Modal */}
      <Dialog
        open={showConfirm}
        onClose={() => {
          setShowConfirm(false);
          setDeleteId(null);
        }}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this file?</Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setShowConfirm(false);
              setDeleteId(null);
            }}
          >
            Cancel
          </Button>
          <Button variant="contained" color="error" onClick={handleDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
