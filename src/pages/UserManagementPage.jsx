import { useState, useEffect } from "react";
import {
    Box,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    MenuItem,
    IconButton,
    Alert,
    CircularProgress,
    Container,
    TablePagination,
    Checkbox,
    FormControlLabel,
    FormGroup,
    Card,
    CardContent,
} from "@mui/material";
import { Delete as DeleteIcon, Add as AddIcon, Edit as EditIcon, Download as DownloadIcon } from "@mui/icons-material";
import apiClient from "../lib/apiClient";
import { downloadFile } from "../lib/apiClient";
import { getRole } from "../lib/storage";
import Pagination from "../components/Pagination";
import registeredASALogo from "../assets/logo2.png";
import { ROLE_DISPLAY_MAP } from "../lib/roles";

export default function UserManagementPage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [open, setOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false); // Track if editing
    const [editUserId, setEditUserId] = useState(null); // ID of user being edited
    const [selectedUsers, setSelectedUsers] = useState([]); // Track selected user IDs
    const [downloading, setDownloading] = useState(false);

    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalCount, setTotalCount] = useState(0);
    const [search, setSearch] = useState("");

    const [formData, setFormData] = useState({
        email: "",
        role: "",
        assigned_id: "",
        region_id: "", // Helper for cascading
        area_id: "", // Helper for cascading
        branch_id: "", // Helper for cascading
        operation_id: "", // Helper for cascading (SVP/AVP)
        division_id: "", // Helper for cascading (AVP)
        department_id: "", // Helper (COO, CFOO, etc)
        id_number: "",
        first_name: "",
        surname: "",
        suffix: "",
        Department: "",
        Division: "",
    });
    const [regions, setRegions] = useState([]);
    const [areas, setAreas] = useState([]);
    const [branches, setBranches] = useState([]);
    const [operations, setOperations] = useState([]);
    const [divisions, setDivisions] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [imUsers, setImUsers] = useState([]);
    const [selectedSubordinates, setSelectedSubordinates] = useState([]);
    const [subordinateSearch, setSubordinateSearch] = useState("");

    const userRole = getRole();

    // Debounce search
    useEffect(() => {
        const handler = setTimeout(() => {
            fetchUsers();
        }, 500); // 500ms delay

        return () => {
            clearTimeout(handler);
        };
    }, [search, page, rowsPerPage]);

    useEffect(() => {
        if (open) {
            fetchRegions();
            // Fetch these for SUPER_ADMIN
            if (userRole === 'SUPER_ADMIN') {
                fetchOperations();
                fetchDepartments();
                fetchIMUsers();
            }
        }
    }, [open]);

    // Fetch users with pagination and search
    const fetchUsers = async () => {
        setLoading(true);
        try {
            let query = `/api/users?page=${page}&limit=${rowsPerPage}`;
            if (search) {
                query += `&search=${encodeURIComponent(search)}`;
            }

            const { data } = await apiClient.get(query);
            if (data.success) {
                setUsers(data.data);
                setTotalCount(data.count || 0);
            } else {
                setError(data.error);
            }
        } catch (err) {
            setError(err.message || "Failed to fetch users");
        } finally {
            setLoading(false);
        }
    };

    // Fetch Metadata for Dropdowns
    const fetchRegions = async () => {
        try {
            const { data } = await apiClient.get(`/api/users/regions`);
            if (data.success) {
                setRegions(data.data);
                // If only one region (RA), select it automatically
                if (data.data.length === 1 && userRole === "RA") {
                    // Only set if not in edit mode or if edit mode doesn't have it set
                    if (!formData.region_id) {
                        setFormData((prev) => ({ ...prev, region_id: data.data[0].id }));
                        fetchAreas(data.data[0].id);
                    }
                }
                return data.data;
            }
        } catch (err) {
            console.error(err);
        }
        return [];
    };

    const fetchAreas = async (regionId) => {
        if (!regionId) return;
        try {
            const { data } = await apiClient.get(`/api/users/areas?region_id=${regionId}`);
            if (data.success) setAreas(data.data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchBranches = async (areaId) => {
        if (!areaId) return;
        try {
            const { data } = await apiClient.get(`/api/users/branches?area_id=${areaId}`);
            if (data.success) setBranches(data.data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchOperations = async () => {
        try {
            const { data } = await apiClient.get(`/api/users/operations`);
            if (data.success) setOperations(data.data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchDivisions = async (operationId) => {
        const query = operationId ? `?operation_id=${operationId}` : '';
        try {
            const { data } = await apiClient.get(`/api/users/divisions${query}`);
            if (data.success) setDivisions(data.data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchDepartments = async () => {
        try {
            const { data } = await apiClient.get(`/api/users/departments`);
            if (data.success) setDepartments(data.data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchIMUsers = async (excludeId = null) => {
        try {
            const query = excludeId ? `?exclude_id=${excludeId}` : '';
            const { data } = await apiClient.get(`/api/users/im-users${query}`);
            if (data.success) setImUsers(data.data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchSubordinates = async (userId) => {
        try {
            const { data } = await apiClient.get(`/api/users/subordinates?user_id=${userId}`);
            if (data.success) setSelectedSubordinates(data.data);
        } catch (err) {
            console.error(err);
        }
    };

    const [openDelete, setOpenDelete] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [openBulkDelete, setOpenBulkDelete] = useState(false);

    // Handlers
    const handleOpen = () => {
        setIsEdit(false);
        setEditUserId(null);
        setFormData({
            name: "", email: "", role: "", assigned_id: "",
            region_id: "", area_id: "", branch_id: "",
            operation_id: "", division_id: "", department_id: "",
            id_number: "", first_name: "", surname: "", suffix: "",
            Department: "", Division: ""
        });
        setSelectedSubordinates([]);
        if (userRole === 'SUPER_ADMIN') {
            fetchIMUsers();
        }
        setOpen(true);
    };

    const handleEdit = async (user) => {
        setIsEdit(true);
        setEditUserId(user.id);

        // Prepare pre-fill data logic
        // We need to resolve hierarchy IDs from user data
        let regionId = "";
        let areaId = "";
        let branchId = "";
        let operationId = "";
        let divisionId = "";
        let departmentId = "";
        let assignedId = user.assigned_id;

        if (user.role === 'RA' && user.region) {
            regionId = user.region.id;
            assignedId = regionId;
        } else if (user.role === 'AA' && user.area) {
            regionId = user.area.region_id;
            areaId = user.area.id;
            assignedId = areaId;
        } else if (user.role === 'BM' && user.branch) {
            branchId = user.branch.id;
            assignedId = branchId;
            // Robust extraction
            if (user.branch.AreaID) {
                areaId = user.branch.AreaID;
            }
            if (user.branch.area) {
                regionId = user.branch.area.region_id;
            }
        } else if (user.role === 'SVP' && user.operation) {
            operationId = user.operation.id;
            assignedId = operationId;
        } else if (user.role === 'AVP' && user.division) {
            divisionId = user.division.id;
            operationId = user.division.operationID;
            assignedId = divisionId;
        } else if (["IM", "ITR", "CHIEF", "ADMIN"].includes(user.role) && user.department) {
            departmentId = user.department.id;
            assignedId = departmentId;
        }

        // Fetch regions and capture result
        const fetchedRegions = await fetchRegions();

        // If RA and regionId missing (extraction failed), use RA's region
        if (userRole === 'RA' && !regionId && fetchedRegions && fetchedRegions.length === 1) {
            regionId = fetchedRegions[0].id;
        }

        // Set form data
        setFormData({
            // name removed
            email: user.email,
            role: user.role,
            assigned_id: assignedId,
            region_id: regionId,
            area_id: areaId,
            branch_id: branchId,
            operation_id: operationId,
            division_id: divisionId,
            department_id: departmentId,
            id_number: user.id_number || "",
            first_name: user.first_name || "",
            surname: user.surname || "",
            suffix: user.suffix || "",
            Department: user.Department || "",
            Division: user.Division || ""
        });

        // Trigger fetches to populate dropdowns
        if (regionId) await fetchAreas(regionId);
        if (areaId) await fetchBranches(areaId);

        if (userRole === 'SUPER_ADMIN') {
            await fetchOperations();
            await fetchDepartments();
            await fetchIMUsers(user.id);
            if (operationId || user.role === 'AVP') await fetchDivisions(operationId);
            if (user.role === 'ITR') await fetchSubordinates(user.id);
        }

        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setFormData({
            email: "", role: "", assigned_id: "",
            region_id: "", area_id: "", branch_id: "",
            operation_id: "", division_id: "", department_id: "",
            id_number: "", first_name: "", surname: "", suffix: "",
            Department: "", Division: ""
        });
        setAreas([]);
        setBranches([]);
        setSelectedSubordinates([]);
        setSubordinateSearch("");
        setError(null);
        setIsEdit(false);
        setEditUserId(null);
    };

    const handleChangePage = (newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(1);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        // Cascading Logic
        if (name === "region_id") {
            setFormData((prev) => ({ ...prev, area_id: "", branch_id: "", assigned_id: "" }));
            fetchAreas(value);
            if (formData.role === "RA") {
                setFormData(prev => ({ ...prev, assigned_id: value }));
            }
        } else if (name === "area_id") {
            setFormData((prev) => ({ ...prev, branch_id: "", assigned_id: "" }));
            fetchBranches(value);
            if (formData.role === "AA") {
                setFormData(prev => ({ ...prev, assigned_id: value }));
            }
        } else if (name === "branch_id") {
            if (formData.role === "BM") {
                setFormData(prev => ({ ...prev, assigned_id: value }));
            }
        } else if (name === "operation_id") {
            setFormData(prev => ({ ...prev, division_id: "", assigned_id: "" }));
            fetchDivisions(value);
            if (formData.role === "SVP") {
                setFormData(prev => ({ ...prev, assigned_id: value }));
            }
        } else if (name === "division_id") {
            if (formData.role === "AVP") {
                setFormData(prev => ({ ...prev, assigned_id: value }));
            }
        } else if (name === "department_id") {
            const deptRoles = ['IM', 'ITR', 'CHIEF', 'ADMIN'];
            if (deptRoles.includes(formData.role)) {
                setFormData(prev => ({ ...prev, assigned_id: value }));
            }
        } else if (name === "role") {
            // Reset selections on role change

            // For RA, we must preserve the Region ID and the Areas list
            // because the Region field is disabled and cannot be re-selected.
            let preservedRegionId = "";
            let shouldClearAreas = true;

            if (userRole === "RA" && regions.length > 0) {
                preservedRegionId = regions[0].id;
                shouldClearAreas = false;
            }

            // Clear all ID fields to specific role scope
            setFormData(prev => ({
                ...prev,
                assigned_id: "",
                region_id: preservedRegionId, // Keep region for RA
                area_id: "", branch_id: "",
                operation_id: "", division_id: "", department_id: ""
            }));

            if (shouldClearAreas) {
                setAreas([]);
            }
            setBranches([]);
            // Operations/Departments are global for SUPER_ADMIN so we don't need to clear them from state, just selection
        }
    };

    const handleSubmit = async () => {
        if (!formData.email || !formData.role || !formData.first_name || !formData.surname || (!formData.assigned_id && formData.role !== 'SUPER_ADMIN' && formData.role !== 'COO' && formData.role !== 'CFOO')) {
            setError("Please fill all required fields");
            return;
        }

        // Frontend validation for email
        if (!formData.email.endsWith("@asaphil.org")) {
            setError("Email must be an @asaphil.org address");
            return;
        }

        // Frontend validation for id_number
        if (!formData.id_number || !/^[0-9]{5}$/.test(formData.id_number)) {
            setError("ID number is required and must be exactly 5 digits (e.g., 00001)");
            return;
        }

        try {
            const url = isEdit ? `/api/users/${editUserId}` : `/api/users`;

            // For SUPER_ADMIN/COO/CFOO, ensure assigned_id is set correctly
            const payload = { ...formData };
            if (payload.role === 'SUPER_ADMIN') payload.assigned_id = 0;
            if (payload.role === 'COO') payload.assigned_id = 16;
            if (payload.role === 'CFOO') payload.assigned_id = 15;

            const { data } = isEdit
                ? await apiClient.put(url, payload)
                : await apiClient.post(url, payload);

            if (data.success) {
                // If ITR role, save subordinates
                if (formData.role === 'ITR') {
                    const userId = isEdit ? editUserId : data.data.id;
                    await apiClient.post(`/api/users/subordinates`, {
                        user_id: userId,
                        subordinate_ids: selectedSubordinates
                    });
                }
                handleClose();
                fetchUsers();
            } else {
                setError(data.error);
            }
        } catch (err) {
            setError(err.message || (isEdit ? "Failed to update user" : "Failed to create user"));
        }
    };

    const handleDelete = (id) => {
        setDeleteId(id);
        setOpenDelete(true);
    };

    const handleSelectUser = (userId) => {
        setSelectedUsers(prev =>
            prev.includes(userId)
                ? prev.filter(id => id !== userId)
                : [...prev, userId]
        );
    };

    const handleSelectAll = () => {
        if (selectedUsers.length === users.length && users.length > 0) {
            setSelectedUsers([]);
        } else {
            setSelectedUsers(users.map(u => u.id));
        }
    };

    const handleDownloadAll = async () => {
        setDownloading(true);
        try {
            const filename = `users_${new Date().toISOString().split('T')[0]}.csv`;
            await downloadFile('/api/users/download', filename);
            setError(null);
        } catch (err) {
            setError(err.message || "Failed to download users");
        } finally {
            setDownloading(false);
        }
    };

    const handleDeleteSelected = () => {
        if (selectedUsers.length === 0) return;
        setOpenBulkDelete(true);
    };

    const confirmBulkDelete = async () => {
        try {
            for (const userId of selectedUsers) {
                await apiClient.delete(`/api/users/${userId}`);
            }
            setSelectedUsers([]);
            setOpenBulkDelete(false);
            fetchUsers();
            setError(null);
        } catch (err) {
            setError(err.message || "Failed to delete selected users");
            setOpenBulkDelete(false);
        }
    };

    const confirmDelete = async () => {
        if (!deleteId) return;
        try {
            const { data } = await apiClient.delete(`/api/users/${deleteId}`);
            if (data.success) {
                fetchUsers();
                setOpenDelete(false);
                setDeleteId(null);
            } else {
                setError(data.error);
                setOpenDelete(false);
            }
        } catch (err) {
            setError(err.message || "Failed to delete user");
            setOpenDelete(false);
        }
    };

    // Filter roles based on current user role
    const availableRoles = userRole === "SUPER_ADMIN"
        ? ["SUPER_ADMIN", "ADMIN", "RA", "AA", "BM", "AVP", "SVP", "CFOO", "COO", "CHIEF", "IM", "ITR"]
        : ["AA", "BM"]; // RA can only add AA or BM

    return (
        <Box
            sx={{
                p: 3,
                bgcolor: "background.default",
                minHeight: "100vh",
                position: "relative",
            }}
        >
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
                            User Management
                        </Typography>
                    </Box>

                    <Box display="flex" justifyContent="flex-end" alignItems="center" mb={3} gap={2}>
                        {userRole === 'SUPER_ADMIN' && (
                            <Button
                                variant="contained"
                                startIcon={<DownloadIcon />}
                                onClick={handleDownloadAll}
                                disabled={downloading}
                                sx={{ bgcolor: "#4CAF50", '&:hover': { bgcolor: "#45a049" } }}
                            >
                                {downloading ? "Downloading..." : "Export Users"}
                            </Button>
                        )}
                        <Button
                            variant="contained"
                            startIcon={<DeleteIcon />}
                            onClick={handleDeleteSelected}
                            disabled={selectedUsers.length === 0}
                            sx={{ bgcolor: "#f44336", '&:hover': { bgcolor: "#da190b" } }}
                        >
                            Delete Selected ({selectedUsers.length})
                        </Button>
                        <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpen} sx={{ bgcolor: "#FF6B35", '&:hover': { bgcolor: "#E55A2B" } }}>
                            Add User
                        </Button>
                    </Box>

                    <Paper sx={{ p: 2, mb: 2, borderRadius: 2, display: 'flex', alignItems: 'center' }}>
                        <TextField
                            label="Filter by Email, Branch, or Area"
                            variant="outlined"
                            size="small"
                            fullWidth
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setPage(1);
                            }}
                        />
                    </Paper>


                    <Paper sx={{ width: "100%", mb: 2, borderRadius: 1, overflow: 'hidden', boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}>
                        <TableContainer>
                            <Table sx={{ '& .MuiTableCell-root': { borderBottom: '1px solid #e0e0e0', borderLeft: 'none', borderRight: 'none', py: 1, px: 2 } }}>
                                <TableHead sx={{ bgcolor: "#f5f5f5" }}>
                                    <TableRow>
                                        <TableCell align="center" sx={{ fontWeight: 600 }}>Delete</TableCell>
                                        <TableCell align="center" sx={{ fontWeight: 600 }}>ID Number</TableCell>
                                        <TableCell align="center" sx={{ fontWeight: 600 }}>First Name</TableCell>
                                        <TableCell align="center" sx={{ fontWeight: 600 }}>Last Name</TableCell>
                                        <TableCell align="center" sx={{ fontWeight: 600 }}>Suffix</TableCell>
                                        <TableCell align="center" sx={{ fontWeight: 600 }}>Department</TableCell>
                                        <TableCell align="center" sx={{ fontWeight: 600 }}>Division</TableCell>
                                        <TableCell align="center" sx={{ fontWeight: 600 }}>Assigned To</TableCell>
                                        <TableCell align="center" sx={{ fontWeight: 600 }}>Position</TableCell>
                                        <TableCell align="center" sx={{ fontWeight: 600 }}>Email Address</TableCell>
                                        <TableCell align="center" sx={{ fontWeight: 600 }}>Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {loading ? (
                                        <TableRow>
                                            <TableCell colSpan={10} align="center"><CircularProgress /></TableCell>
                                        </TableRow>
                                    ) : users.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={10} align="center">No users found</TableCell>
                                        </TableRow>
                                    ) : (
                                        users.map((user) => (
                                            <TableRow key={user.id} hover selected={selectedUsers.includes(user.id)}>
                                                <TableCell align="center">
                                                    <Checkbox
                                                        checked={selectedUsers.includes(user.id)}
                                                        onChange={() => handleSelectUser(user.id)}
                                                        size="small"
                                                    />
                                                </TableCell>
                                                <TableCell align="center">{(!user.id_number || user.id_number === '0' || user.id_number === '00000') ? '' : user.id_number}</TableCell>
                                                <TableCell align="center">{user.first_name}</TableCell>
                                                <TableCell align="center">{user.surname}</TableCell>
                                                <TableCell align="center">{user.suffix}</TableCell>
                                                <TableCell align="center">{user.Department}</TableCell>
                                                <TableCell align="center">{user.Division}</TableCell>
                                                <TableCell align="center">
                                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                                                        <span>{user.assigned_name || user.assigned_id}</span>
                                                    </Box>
                                                </TableCell>
                                                <TableCell align="center">
                                                    <Box component="span" sx={{
                                                        bgcolor: user.role === 'SUPER_ADMIN' ? '#1565c0' : user.role === 'ADMIN' ? '#e3f2fd' : user.role === 'RA' ? '#fff3e0' : '#f5f5f5',
                                                        color: user.role === 'SUPER_ADMIN' ? '#ffffff' : user.role === 'ADMIN' ? '#1565c0' : user.role === 'RA' ? '#ef6c00' : '#616161',
                                                        px: 1.5, py: 0.5, borderRadius: 6, fontSize: '0.875rem', fontWeight: 500
                                                    }}>
                                                        {ROLE_DISPLAY_MAP[user.role] || user.role}
                                                    </Box>
                                                </TableCell>
                                                <TableCell align="center">{user.email}</TableCell>
                                                <TableCell align="center">
                                                    <IconButton onClick={() => handleEdit(user)} color="primary" size="small">
                                                        <EditIcon />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <Box sx={{ p: 2 }}>
                            <Pagination
                                currentPage={page}
                                totalPages={Math.ceil(totalCount / rowsPerPage)}
                                onPageChange={handleChangePage}
                            />
                        </Box>
                    </Paper>
                </CardContent>
            </Card>

            {/* Add/Edit User Dialog */}
            <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ fontWeight: 600 }}>{isEdit ? "Edit User" : "Add New User"}</DialogTitle>
                <DialogContent>
                    <Box display="flex" flexDirection="column" gap={2} sx={{ mt: 1 }}>
                        {error && <Alert severity="error">{error}</Alert>}

                        <Box display="flex" gap={2}>
                            <TextField
                                label="ID Number"
                                name="id_number"
                                value={formData.id_number}
                                onChange={handleChange}
                                fullWidth
                                required
                                helperText="Exactly 5 digits (e.g., 00001)"
                                inputProps={{ maxLength: 5 }}
                            />
                            <TextField label="Suffix" name="suffix" value={formData.suffix} onChange={handleChange} fullWidth />
                        </Box>
                        <Box display="flex" gap={2}>
                            <TextField label="First Name" name="first_name" value={formData.first_name} onChange={handleChange} fullWidth required />
                            <TextField label="Last Name" name="surname" value={formData.surname} onChange={handleChange} fullWidth required />
                        </Box>
                        {/* Display Name removed as it is now replaced by First/Last Name */}


                        <Box display="flex" gap={2}>
                            <TextField label="User's Department" name="Department" value={formData.Department} onChange={handleChange} fullWidth />
                            <TextField label="User's Division" name="Division" value={formData.Division} onChange={handleChange} fullWidth />
                        </Box>

                        <TextField
                            label="Email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            fullWidth
                            required
                            type="email"
                            helperText="Must be @asaphil.org"
                        />
                        <TextField label="Role" name="role" value={formData.role} onChange={handleChange} select fullWidth required>
                            {availableRoles.map((role) => (
                                <MenuItem key={role} value={role}>{ROLE_DISPLAY_MAP[role] || role}</MenuItem>
                            ))}
                        </TextField>

                        {/* RA/AA/BM Logic */}
                        {(["RA", "AA", "BM"].includes(formData.role)) && (
                            <TextField label="Region" name="region_id" value={formData.region_id} onChange={handleChange} select fullWidth
                                disabled={userRole === "RA" && regions.length === 1}
                            >
                                {regions.map(r => <MenuItem key={r.id} value={r.id}>{r.region_name}</MenuItem>)}
                            </TextField>
                        )}

                        {(["AA", "BM"].includes(formData.role)) && (
                            <TextField label="Area" name="area_id" value={formData.area_id} onChange={handleChange} select fullWidth disabled={!formData.region_id}>
                                {areas.map(a => <MenuItem key={a.id} value={a.id}>{a.area_name}</MenuItem>)}
                            </TextField>
                        )}

                        {(formData.role === "BM") && (
                            <TextField label="Branch" name="branch_id" value={formData.branch_id} onChange={handleChange} select fullWidth disabled={!formData.area_id}>
                                {branches.map(b => (
                                    <MenuItem key={b.id || b.BranchNo} value={b.id || b.BranchNo}>
                                        {b.BranchNo} - {b.Branch}
                                    </MenuItem>
                                ))}
                            </TextField>
                        )}

                        {/* SVP/AVP Logic - Operations */}
                        {(formData.role === "SVP" || formData.role === "AVP") && (
                            <TextField label="Operation" name="operation_id" value={formData.operation_id} onChange={handleChange} select fullWidth>
                                {operations.map(o => (
                                    <MenuItem key={o.id} value={o.id}>{o.name}</MenuItem>
                                ))}
                            </TextField>
                        )}

                        {/* AVP Logic - Divisions */}
                        {(formData.role === "AVP") && (
                            <TextField label="Division" name="division_id" value={formData.division_id} onChange={handleChange} select fullWidth disabled={!formData.operation_id}>
                                {divisions.map(d => (
                                    <MenuItem key={d.id} value={d.id}>{d.division}</MenuItem>
                                ))}
                            </TextField>
                        )}

                        {/* Department Logic (IM, ITR, CHIEF) */}
                        {(["IM", "ITR", "CHIEF", "ADMIN"].includes(formData.role)) && (
                            <TextField label="Department" name="department_id" value={formData.department_id} onChange={handleChange} select fullWidth>
                                {departments.filter(d => {
                                    const name = d.name.toLowerCase();
                                    const isOps = name.includes("operation");
                                    const isChiefs = name === "chiefs";

                                    // Remove CHIEFS for ADMIN, IM, ITR, CHIEF
                                    if (["ADMIN", "IM", "ITR", "CHIEF"].includes(formData.role)) {
                                        if (isChiefs) return false;
                                    }

                                    // Additionally remove OPS for CHIEF
                                    if (formData.role === "CHIEF") {
                                        return !isOps;
                                    }
                                    return true;
                                }).map(d => (
                                    <MenuItem key={d.id} value={d.id}>{d.name}</MenuItem>
                                ))}
                            </TextField>
                        )}

                        {/* ITR Subordinate Selection */}
                        {(formData.role === "ITR") && (
                            <Box>
                                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                                    Select Subordinates (IM/ITR Users)
                                </Typography>
                                <TextField
                                    label="Search Subordinates"
                                    size="small"
                                    fullWidth
                                    variant="outlined"
                                    sx={{ mb: 1 }}
                                    value={subordinateSearch}
                                    onChange={(e) => setSubordinateSearch(e.target.value)}
                                />
                                <Paper variant="outlined" sx={{ p: 2, maxHeight: 300, overflow: 'auto' }}>
                                    {imUsers.filter(im => {
                                        if (!subordinateSearch) return true;
                                        const search = subordinateSearch.toLowerCase();
                                        return (
                                            im.first_name.toLowerCase().includes(search) ||
                                            im.surname.toLowerCase().includes(search) ||
                                            im.email.toLowerCase().includes(search)
                                        );
                                    }).length === 0 ? (
                                        <Typography variant="body2" color="text.secondary">
                                            No users found
                                        </Typography>
                                    ) : (
                                        <FormGroup>
                                            {imUsers.filter(im => {
                                                if (!subordinateSearch) return true;
                                                const search = subordinateSearch.toLowerCase();
                                                return (
                                                    im.first_name.toLowerCase().includes(search) ||
                                                    im.surname.toLowerCase().includes(search) ||
                                                    im.email.toLowerCase().includes(search)
                                                );
                                            }).map(im => (
                                                <FormControlLabel
                                                    key={im.id}
                                                    control={
                                                        <Checkbox
                                                            checked={selectedSubordinates.includes(im.id)}
                                                            onChange={(e) => {
                                                                if (e.target.checked) {
                                                                    setSelectedSubordinates([...selectedSubordinates, im.id]);
                                                                } else {
                                                                    setSelectedSubordinates(selectedSubordinates.filter(id => id !== im.id));
                                                                }
                                                            }}
                                                        />
                                                    }
                                                    label={`${im.first_name} ${im.surname} (${im.email})`}
                                                />
                                            ))}
                                        </FormGroup>
                                    )}
                                </Paper>
                            </Box>
                        )}

                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleSubmit} variant="contained" color="primary">{isEdit ? "Update User" : "Create User"}</Button>
                </DialogActions>
            </Dialog>

            {/* Delete Single User Confirmation Dialog */}
            {/* <Dialog open={openDelete} onClose={() => setOpenDelete(false)}>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    Are you sure you want to delete this user? This action cannot be undone.
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDelete(false)}>Cancel</Button>
                    <Button onClick={confirmDelete} variant="contained" color="error">Delete</Button>
                </DialogActions>
            </Dialog> */}

            {/* Delete Multiple Users Confirmation Dialog */}
            <Dialog open={openBulkDelete} onClose={() => setOpenBulkDelete(false)}>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to delete {selectedUsers.length} selected user(s)? This action cannot be undone.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenBulkDelete(false)}>Cancel</Button>
                    <Button onClick={confirmBulkDelete} variant="contained" color="error">Delete All</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
