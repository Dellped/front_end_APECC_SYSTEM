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
} from "@mui/material";
import { Delete as DeleteIcon, Add as AddIcon, Edit as EditIcon } from "@mui/icons-material";
import apiClient from "../lib/apiClient";
import { getRole } from "../lib/storage";
import Pagination from "../components/Pagination";

export default function UserManagementPage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [open, setOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false); // Track if editing
    const [editUserId, setEditUserId] = useState(null); // ID of user being edited

    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalCount, setTotalCount] = useState(0);
    const [search, setSearch] = useState("");

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        role: "",
        assigned_id: "",
        region_id: "", // Helper for cascading
        area_id: "", // Helper for cascading
        branch_id: "", // Helper for cascading
        operation_id: "", // Helper for cascading (SVP/AVP)
        division_id: "", // Helper for cascading (AVP)
        department_id: "", // Helper (COO, CFOO, etc)
    });
    const [regions, setRegions] = useState([]);
    const [areas, setAreas] = useState([]);
    const [branches, setBranches] = useState([]);
    const [operations, setOperations] = useState([]);
    const [divisions, setDivisions] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [imUsers, setImUsers] = useState([]);
    const [selectedSubordinates, setSelectedSubordinates] = useState([]);

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
            // Fetch these for ADMIN
            if (userRole === 'ADMIN') {
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

    const fetchIMUsers = async () => {
        try {
            const { data } = await apiClient.get(`/api/users/im-users`);
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

    // Handlers
    const handleOpen = () => {
        setIsEdit(false);
        setEditUserId(null);
        setFormData({
            name: "", email: "", role: "", assigned_id: "",
            region_id: "", area_id: "", branch_id: "",
            operation_id: "", division_id: "", department_id: ""
        });
        setSelectedSubordinates([]);
        if (userRole === 'ADMIN') {
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
        } else if (["IM", "ITR", "CHIEF"].includes(user.role) && user.department) {
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
            name: user.name,
            email: user.email,
            role: user.role,
            assigned_id: assignedId,
            region_id: regionId,
            area_id: areaId,
            branch_id: branchId,
            operation_id: operationId,
            division_id: divisionId,
            department_id: departmentId
        });

        // Trigger fetches to populate dropdowns
        if (regionId) await fetchAreas(regionId);
        if (areaId) await fetchBranches(areaId);

        if (userRole === 'ADMIN') {
            await fetchOperations();
            await fetchDepartments();
            await fetchIMUsers();
            if (operationId || user.role === 'AVP') await fetchDivisions(operationId);
            if (user.role === 'ITR') await fetchSubordinates(user.id);
        }

        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setFormData({ name: "", email: "", role: "", assigned_id: "", region_id: "", area_id: "", branch_id: "", operation_id: "", division_id: "", department_id: "" });
        setAreas([]);
        setBranches([]);
        setSelectedSubordinates([]);
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
            const deptRoles = ['IM', 'ITR', 'CHIEF'];
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
            // Operations/Departments are global for ADMIN so we don't need to clear them from state, just selection
        }
    };

    const handleSubmit = async () => {
        if (!formData.name || !formData.email || !formData.role || (!formData.assigned_id && formData.role !== 'ADMIN' && formData.role !== 'COO' && formData.role !== 'CFOO')) {
            setError("Please fill all required fields");
            return;
        }

        // Frontend validation for email
        if (!formData.email.endsWith("@asaphil.org")) {
            setError("Email must be an @asaphil.org address");
            return;
        }

        try {
            const url = isEdit ? `/api/users/${editUserId}` : `/api/users`;

            // For ADMIN/COO/CFOO, ensure assigned_id is set correctly
            const payload = { ...formData };
            if (payload.role === 'ADMIN') payload.assigned_id = 0;
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
    const availableRoles = userRole === "ADMIN"
        ? ["ADMIN", "RA", "AA", "BM", "AVP", "SVP", "CFOO", "COO", "CHIEF", "IM", "ITR"]
        : ["AA", "BM"]; // RA can only add AA or BM

    return (
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600, color: "#1a237e" }}>
                    User Management
                </Typography>
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


            <Paper sx={{ width: "100%", mb: 2, borderRadius: 2, overflow: 'hidden', boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}>
                <TableContainer>
                    <Table>
                        <TableHead sx={{ bgcolor: "#f5f5f5" }}>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Role</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Assigned To</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={5} align="center"><CircularProgress /></TableCell>
                                </TableRow>
                            ) : users.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} align="center">No users found</TableCell>
                                </TableRow>
                            ) : (
                                users.map((user) => (
                                    <TableRow key={user.id} hover>
                                        <TableCell>{user.name}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>
                                            <Box component="span" sx={{
                                                bgcolor: user.role === 'ADMIN' ? '#e3f2fd' : user.role === 'RA' ? '#fff3e0' : '#f5f5f5',
                                                color: user.role === 'ADMIN' ? '#1565c0' : user.role === 'RA' ? '#ef6c00' : '#616161',
                                                px: 1.5, py: 0.5, borderRadius: 6, fontSize: '0.875rem', fontWeight: 500
                                            }}>
                                                {user.role}
                                            </Box>
                                        </TableCell>
                                        <TableCell>{user.assigned_name || user.assigned_id}</TableCell>
                                        <TableCell>
                                            <IconButton onClick={() => handleEdit(user)} color="primary" size="small" sx={{ mr: 1 }}>
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton onClick={() => handleDelete(user.id)} color="error" size="small">
                                                <DeleteIcon />
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

            {/* Add/Edit User Dialog */}
            <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ fontWeight: 600 }}>{isEdit ? "Edit User" : "Add New User"}</DialogTitle>
                <DialogContent>
                    <Box display="flex" flexDirection="column" gap={2} sx={{ mt: 1 }}>
                        {error && <Alert severity="error">{error}</Alert>}

                        <TextField label="Name" name="name" value={formData.name} onChange={handleChange} fullWidth required />
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
                                <MenuItem key={role} value={role}>{role}</MenuItem>
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
                        {(["IM", "ITR", "CHIEF"].includes(formData.role)) && (
                            <TextField label="Department" name="department_id" value={formData.department_id} onChange={handleChange} select fullWidth>
                                {departments.filter(d => {
                                    const name = d.name.toLowerCase();
                                    const isOps = name.includes("operation");
                                    const isChiefs = name === "chiefs";
                                    if (formData.role === "CHIEF") {
                                        return !isOps && !isChiefs;
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
                                    Select Subordinates (IM Users)
                                </Typography>
                                <Paper variant="outlined" sx={{ p: 2, maxHeight: 300, overflow: 'auto' }}>
                                    {imUsers.length === 0 ? (
                                        <Typography variant="body2" color="text.secondary">
                                            No IM users available
                                        </Typography>
                                    ) : (
                                        <FormGroup>
                                            {imUsers.map(im => (
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
                                                    label={`${im.name} (${im.email})`}
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

            {/* Delete Confirmation Dialog */}
            <Dialog open={openDelete} onClose={() => setOpenDelete(false)}>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    Are you sure you want to delete this user? This action cannot be undone.
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDelete(false)}>Cancel</Button>
                    <Button onClick={confirmDelete} variant="contained" color="error">Delete</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}
