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
} from "@mui/material";
import apiClient from "../lib/apiClient";
import { getSession, getRole, SESSION_KEYS } from "../lib/storage";
import { ROLES, ROLE_HEADER_MAP } from "../lib/roles";
import LoadingOverlay from "../components/LoadingOverlay";
import MessageBanner from "../components/MessageBanner";
import Pagination from "../components/Pagination";

export default function GeneratePage() {
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("error");

  // Records
  const [completeRecords, setCompleteRecords] = useState([]);
  const [summaryData, setSummaryData] = useState([]);

  // Pagination
  const [completePage, setCompletePage] = useState(1);
  const completePerPage = 10;

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

  // Get group key for summary based on role
  const getGroupKey = (r) => {
    switch (role) {
      case ROLES.ADMIN:
      case ROLES.ITR:
      case ROLES.IM:
      case ROLES.COO:
      case ROLES.CFOO:
        return r.department || "UNKNOWN DEPARTMENT";
      case ROLES.SVP:
        return r.division || "UNKNOWN DIVISION";
      case ROLES.AVP:
        return r.region || "UNKNOWN REGION";
      case ROLES.RA:
        return r.area || "UNKNOWN AREA";
      case ROLES.AA:
        const satellite = r.satellite?.trim() ? ` - ${r.satellite.trim()}` : "";
        return (r.branch || "UNKNOWN AREA") + satellite;
      default:
        return r.branch || "UNKNOWN";
    }
  };

  // Render summary from complete records
  const renderSummary = useCallback(
    (records) => {
      if (!records.length) return [];

      const grouped = {};
      records.forEach((r) => {
        const key = getGroupKey(r);
        if (!grouped[key]) grouped[key] = [];
        grouped[key].push(r);
      });

      let totalEE = 0,
        totalME = 0,
        totalDM = 0,
        totalOverall = 0;
      const rows = [];

      for (const [key, recs] of Object.entries(grouped)) {
        let EE = 0,
          ME = 0,
          DM = 0;
        recs.forEach((r) => {
          const rating = (r.overall_adjectival_rating || "").trim();
          if (rating === "EE") EE++;
          else if (rating === "ME") ME++;
          else if (rating === "DM") DM++;
        });
        const subtotal = EE + ME + DM;

        totalEE += EE;
        totalME += ME;
        totalDM += DM;
        totalOverall += subtotal;

        rows.push({
          key,
          EE,
          EE_pct: subtotal ? Math.round((EE / subtotal) * 100) : 0,
          ME,
          ME_pct: subtotal ? Math.round((ME / subtotal) * 100) : 0,
          DM,
          DM_pct: subtotal ? Math.round((DM / subtotal) * 100) : 0,
          subtotal,
        });
      }

      // Add total row
      rows.push({
        key: "SUBTOTAL",
        EE: totalEE,
        EE_pct: totalOverall ? Math.round((totalEE / totalOverall) * 100) : 0,
        ME: totalME,
        ME_pct: totalOverall ? Math.round((totalME / totalOverall) * 100) : 0,
        DM: totalDM,
        DM_pct: totalOverall ? Math.round((totalDM / totalOverall) * 100) : 0,
        subtotal: totalOverall,
        isTotal: true,
      });

      return rows;
    },
    [role]
  );

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

        const records = data.completeRecords || [];
        setCompleteRecords(records);
        setSummaryData(renderSummary(records));
      } catch (err) {
        setMessage(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [role, getEntityInfo, renderSummary]);

  const { entityName, entityCode } = getEntityInfo();
  const displayName =
    role === ROLES.BM ? `${entityCode} - (${entityName})` : entityName;

  // Summary header column name
  const firstColumnHeader = ROLE_HEADER_MAP[role] || "Entity";

  // Pagination
  const completeTotalPages = Math.ceil(
    completeRecords.length / completePerPage
  );
  const completeStart = (completePage - 1) * completePerPage;
  const paginatedComplete = completeRecords.slice(
    completeStart,
    completeStart + completePerPage
  );

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
              src="https://raw.githubusercontent.com/rodelpeligro-oss/image-hosting/main/nav3%20(1).png"
              alt="Logo"
              style={{ width: 200, height: 70 }}
            />
            <Typography variant="h5" sx={{ mt: 2, fontWeight: 600 }}>
              Value-Driven Performance Management Form
            </Typography>
            <Typography variant="h6" sx={{ mt: 1, fontWeight: 500 }}>
              Generate Reports
            </Typography>
             {role !== 'COO' && role !== 'ADMIN' &&(
            <Chip label={displayName} color="primary" sx={{ mt: 2 }} />
            )}
          </Box>

          {/* Individual PM Summary Table */}
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
                INDIVIDUAL PM SUMMARY (FOR REGULAR EMPLOYEES ONLY)
              </Typography>
            </Box>
            <TableContainer sx={{ maxHeight: 600, overflowX: "auto" }}>
              <Table stickyHeader size="small">
                <TableHead>
                  <TableRow>
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
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedComplete.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={23} align="center" sx={{ py: 4 }}>
                        <Typography color="text.secondary">
                          No complete records found
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedComplete.map((r, idx) => (
                      <TableRow key={r.emp_id || idx} hover>
                        <TableCell>{r.emp_id || ""}</TableCell>
                        <TableCell>{r.employee_name || ""}</TableCell>
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
                        <TableCell>
                          {r.overall_adjectival_rating || ""}
                        </TableCell>
                      </TableRow>
                    ))
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

          {/* Summary Reports Table */}
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
                Summary Reports
              </Typography>
            </Box>
            <TableContainer sx={{ maxHeight: 400, overflowX: "auto" }}>
              <Table stickyHeader size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>{firstColumnHeader}</TableCell>
                    <TableCell>EXCEEDS EXPECTATIONS (EE)</TableCell>
                    <TableCell>EE PERCENT</TableCell>
                    <TableCell>MEETS EXPECTATIONS (ME)</TableCell>
                    <TableCell>ME PERCENTAGE</TableCell>
                    <TableCell>DID NOT MEET (DM)</TableCell>
                    <TableCell>DM PERCENTAGE</TableCell>
                    <TableCell>SUBTOTAL</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {summaryData.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                        <Typography color="text.secondary">
                          No summary data available
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    summaryData.map((row, idx) => (
                      <TableRow
                        key={idx}
                        sx={{
                          bgcolor: row.isTotal ? "grey.200" : "transparent",
                          "& .MuiTableCell-root": row.isTotal
                            ? { fontWeight: "bold", color: "error.main" }
                            : {},
                        }}
                      >
                        <TableCell>{row.key}</TableCell>
                        <TableCell>{row.EE}</TableCell>
                        <TableCell>{row.EE_pct}%</TableCell>
                        <TableCell>{row.ME}</TableCell>
                        <TableCell>{row.ME_pct}%</TableCell>
                        <TableCell>{row.DM}</TableCell>
                        <TableCell>{row.DM_pct}%</TableCell>
                        <TableCell>{row.subtotal}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </CardContent>
      </Card>
    </Box>
  );
}
