import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Box,
} from "@mui/material";
import {
  Close as CloseIcon,
  Download as DownloadIcon,
} from "@mui/icons-material";
import * as XLSX from "xlsx";
import Pagination from "./Pagination";

const PREVIEW_COLUMNS = [
  "emp_id",
  "employee_name",
  "position_title",
  "date_hired",
  "immediate_superior",
  "department",
  "group",
  "division",
  "region",
  "area",
  "branch",
  "satellite",
  "month_from",
  "month_to",
  "year",
  "part_a_total_rating",
  "part_a_overall_weight",
  "part_a_subtotal",
  "part_b_total_rating",
  "part_b_overall_weight",
  "part_b_subtotal",
  "overall_numeric_rating",
  "overall_adjectival_rating",
];

const COLUMN_HEADERS = [
  "EMP ID",
  "Employee Name",
  "Position Title",
  "Date Hired",
  "Immediate Superior",
  "Department",
  "Group",
  "Division",
  "Region",
  "Area",
  "Branch",
  "Satellite",
  "Month From",
  "Month To",
  "Year",
  "Part A Total Rating",
  "Part A Overall Weight Allocation",
  "Part A Subtotal",
  "Part B Total Rating",
  "Part B Overall Weight Allocation",
  "Part B Subtotal",
  "Overall Numeric Rating",
  "Overall Adjectival Rating",
];

const excelSerialToDate = (serial) => {
  if (serial === "0") return "0";
  if (!serial) return "";

  // Excel starts at 1900-01-01
  const excelEpoch = new Date(1899, 11, 30);
  const date = new Date(excelEpoch.getTime() + Number(serial) * 86400000);

  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const yyyy = date.getFullYear();

  return `${mm}/${dd}/${yyyy}`;
};


export default function PreviewModal({
  isOpen,
  onClose,
  title,
  records = [],
  displayName = "records",
  allowExport = true,
}) {
  const [page, setPage] = useState(1);
  const [ratingFilter, setRatingFilter] = useState("ALL"); // ALL, EE, ME, DM
  const perPage = 10;

  useEffect(() => {
    setPage(1);
    setRatingFilter("ALL");
  }, [records]);

  if (!isOpen) return null;

  const filteredRecords =
    ratingFilter === "ALL"
      ? records
      : records.filter(
          (row) =>
            (row.overall_adjectival_rating || "").trim().toUpperCase() ===
            ratingFilter
        );

  const totalPages = Math.ceil(filteredRecords.length / perPage) || 1;
  const start = (page - 1) * perPage;
  const pageData = filteredRecords.slice(start, start + perPage);

  const formatValue = (row, col) => {
    const val = row[col];

    if (col === "date_hired") {
      return excelSerialToDate(val);
    }
  
    if (col === "part_a_overall_weight" || col === "part_b_overall_weight") {
      if (!val) return "0%";
  
      const num = parseFloat(String(val).replace("%", "").trim());
      return isNaN(num) ? "0%" : `${Math.round(num)}%`;
    }
  
    return val ?? "";
  };
  

  const exportToCSV = () => {
    if (!filteredRecords.length) return;
    const csvRows = [];
    csvRows.push(PREVIEW_COLUMNS.join(","));
    filteredRecords.forEach((row) => {
      const values = PREVIEW_COLUMNS.map((col) => `"${row[col] ?? ""}"`);
      csvRows.push(values.join(","));
    });
    const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = displayName.replace(/ /g, "_") + ".csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportToExcel = () => {
    if (!filteredRecords.length) return;
    const wsData = filteredRecords.map((row) =>
      PREVIEW_COLUMNS.reduce(
        (obj, col) => ({ ...obj, [col]: row[col] ?? "" }),
        {}
      )
    );
    const ws = XLSX.utils.json_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, displayName.replace(/ /g, "_") + ".xlsx");
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      maxWidth="xl"
      fullWidth
      PaperProps={{
        sx: { maxHeight: "90vh" },
      }}
    >
      <DialogTitle>
      <Box
  sx={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 2,
    flexWrap: "wrap",
  }}
>
  {/* Left: Title */}
  <Box component="span" sx={{ fontWeight: 600 }}>
    {title}
  </Box>

  {/* Right: Filter buttons + Close icon */}
  <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
    <Button
      size="small"
      variant={ratingFilter === "ALL" ? "contained" : "outlined"}
      onClick={() => { setRatingFilter("ALL"); setPage(1); }}
    >
      All
    </Button>
    <Button
      size="small"
      variant={ratingFilter === "EE" ? "contained" : "outlined"}
      onClick={() => { setRatingFilter("EE"); setPage(1); }}
    >
      EE
    </Button>
    <Button
      size="small"
      variant={ratingFilter === "ME" ? "contained" : "outlined"}
      onClick={() => { setRatingFilter("ME"); setPage(1); }}
    >
      ME
    </Button>
    <Button
      size="small"
      variant={ratingFilter === "DM" ? "contained" : "outlined"}
      onClick={() => { setRatingFilter("DM"); setPage(1); }}
    >
      DM
    </Button>

    {/* <IconButton onClick={onClose} size="small">
      <CloseIcon />
    </IconButton> */}
  </Box>
</Box>

      </DialogTitle>
      <DialogContent dividers>
        <TableContainer component={Paper} sx={{ maxHeight: 500 }}>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                {COLUMN_HEADERS.map((header, i) => (
                  <TableCell key={i} sx={{ fontWeight: "bold" }}>
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {pageData.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={COLUMN_HEADERS.length}
                    align="center"
                    sx={{ py: 4 }}
                  >
                    No records found
                  </TableCell>
                </TableRow>
              ) : (
                pageData.map((row, idx) => (
                  <TableRow key={idx} hover>
                    {PREVIEW_COLUMNS.map((col, i) => (
                      <TableCell
                        key={i}
                        sx={{
                          textAlign:
                            col === "employee_name" ? "left" : "center",
                        }}
                      >
                        {formatValue(row, col)}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        {allowExport && (
          <>
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              onClick={exportToCSV}
            >
              Download CSV
            </Button>
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              onClick={exportToExcel}
            >
              Download Excel
            </Button>
          </>
        )}
        <Button variant="contained" onClick={onClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
