import * as XLSX from 'xlsx';

/**
 * exportUtils.js
 * Shared export helpers for CSV, PDF (print-as-PDF), and Print.
 * All functions accept:
 *   title   - string label displayed in the header of the printout
 *   headers - array of column header strings
 *   rows    - 2D array where each inner array contains the row cell values (strings/numbers)
 *   filename- (CSV only) downloaded filename without extension
 */

// ─── CSV ────────────────────────────────────────────────────────────────────
export function exportToCSV(headers, rows, filename = 'export') {
  const escape = (val) => {
    const s = val === null || val === undefined ? '' : String(val);
    return s.includes(',') || s.includes('"') || s.includes('\n')
      ? `"${s.replace(/"/g, '""')}"`
      : s;
  };
  const csv = [
    headers.map(escape).join(','),
    ...rows.map((row) => row.map(escape).join(',')),
  ].join('\r\n');

  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ─── Excel ───────────────────────────────────────────────────────────────────
export function exportToExcel(headers, rows, filename = 'export') {
  const wsData = [headers, ...rows];
  const ws = XLSX.utils.aoa_to_sheet(wsData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
  XLSX.writeFile(wb, `${filename}.xlsx`);
}

// ─── Shared HTML builder ─────────────────────────────────────────────────────
function buildPrintHTML(title, headers, rows, landscape = false) {
  const thCells = headers.map((h) => `<th>${h}</th>`).join('');
  const bodyRows = rows
    .map(
      (row) =>
        `<tr>${row.map((cell) => `<td>${cell ?? ''}</td>`).join('')}</tr>`
    )
    .join('');

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <title>${title}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
    * { margin:0; padding:0; box-sizing:border-box; font-family:'Inter',sans-serif; }
    body { padding:32px; color:#111; }
    h2 { text-align:center; color:#023DFB; margin-bottom:6px; font-size:15pt; }
    p.sub { text-align:center; color:#555; font-size:9pt; margin-bottom:20px; }
    table { width:100%; border-collapse:collapse; font-size:8.5pt; }
    th { background:#023DFB !important; color:#fff !important; font-weight:700;
         padding:7px 6px; text-align:left; border:1px solid #003fd1;
         -webkit-print-color-adjust:exact; print-color-adjust:exact; }
    td { padding:5px 6px; border:1px solid #ddd; vertical-align:top; }
    tr:nth-child(even) td { background:#f4f7fe; }
    @media print {
      body { padding:0; }
      @page { ${landscape ? 'size:landscape;' : 'size:portrait;'} margin:1cm; }
    }
  </style>
</head>
<body>
  <h2>APECC — ${title}</h2>
  <p class="sub">Generated: ${new Date().toLocaleString('en-PH')}</p>
  <table>
    <thead><tr>${thCells}</tr></thead>
    <tbody>${bodyRows}</tbody>
  </table>
</body>
</html>`;
}

// ─── Print ───────────────────────────────────────────────────────────────────
export function printTable(title, headers, rows, landscape = true) {
  const html = buildPrintHTML(title, headers, rows, landscape);
  const w = window.open('', '_blank');
  w.document.write(html);
  w.document.close();
  w.focus();
  setTimeout(() => {
    w.print();
    w.close();
  }, 500);
}

// ─── PDF (print-as-PDF) ───────────────────────────────────────────────────────
export function exportToPDF(title, headers, rows, landscape = true) {
  // Opens the same print window; user chooses "Save as PDF" in the dialog.
  printTable(title, headers, rows, landscape);
}
