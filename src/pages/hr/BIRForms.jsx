import React, { useMemo, useState } from 'react';
import {
  Box, Card, CardContent, Typography, Grid, Button, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Paper, Chip,
  FormControl, InputLabel, Select, MenuItem, Stack, IconButton, Tooltip,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, Autocomplete, Divider
} from '@mui/material';
import {
  Print as PrintIcon,
  Visibility as ViewIcon,
  Refresh as RefreshIcon,
  FileDownload as ExcelIcon,
  PictureAsPdf as PdfIcon
} from '@mui/icons-material';
import { employees, payrollRecords } from '../../data/mockData';
import ExcelJS from 'exceljs';

const logoBlue = '#0241FB';
const goldAccent = '#d4a843';

const COMPANY = {
  name: 'ASA PHILIPPINES EMPLOYEES CREDIT COOPERATIVE (APECC)',
  address: '3RD FL. UNIT 309 PRESTIGE TOWER F. ORTIGAS JR. RD. ORTIGAS CENTER, PASIG CITY',
  tin: '---',
  rdo: '---',
};

function formatCurrency(val) {
  const n = Number(val || 0);
  return n.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function build2316Html({ emp, year, totals }, { mode }) {
  const fullName = `${emp.lastName}, ${emp.firstName}${emp.middleName ? ` ${emp.middleName}` : ''}${emp.suffix ? ` ${emp.suffix}` : ''}`;
  const empTin = emp?.requirements?.tinNo || '000-000-000-000';
  const generatedAt = new Date().toLocaleString('en-PH');

  // Format TIN for display like in the official form boxes
  const tinParts = empTin.split('-').length >= 3 ? empTin.split('-') : [empTin.substring(0,3), empTin.substring(3,6), empTin.substring(6,9), empTin.substring(9,12) || '000'];

  const box = (label, value, width = '100%', height = 'auto', num = '', isBold = false, bg = '#fff') => `
    <div style="border: 0.5px solid #000; padding: 1px 3px; width: ${width}; height: ${height}; position: relative; overflow: hidden; background: ${bg}; min-height: 25px; display: flex; flex-direction: column; justify-content: space-between;">
      <div style="display: flex; gap: 4px; align-items: flex-start;">
        ${num ? `<span style="font-size: 6.5pt; font-weight: 900; line-height: 1;">${num}</span>` : ''}
        <span style="font-size: 5.5pt; font-weight: 700; text-transform: uppercase; color: #000; line-height: 1.1;">${label}</span>
      </div>
      <div style="font-size: 8.5pt; font-weight: ${isBold ? '900' : '700'}; text-align: center; margin-bottom: 2px; text-transform: uppercase;">${value || '&nbsp;'}</div>
    </div>
  `;

  const tinBox = (num, label, parts) => `
    <div style="border: 0.5px solid #000; padding: 1px 3px; background: #fff; min-height: 38px;">
      <div style="display: flex; gap: 4px; align-items: flex-start; margin-bottom: 2px;">
        <span style="font-size: 6.5pt; font-weight: 900; line-height: 1;">${num}</span>
        <span style="font-size: 5.5pt; font-weight: 700; text-transform: uppercase; color: #000; line-height: 1;">${label}</span>
      </div>
      <div style="display: flex; gap: 3px; justify-content: center; align-items: center;">
        ${parts.map((p, i) => `
          <div style="display: flex; gap: 1px;">
            ${p.split('').map(d => `<div style="border: 0.5px solid #000; width: 14px; height: 18px; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 8pt;">${d}</div>`).join('')}
          </div>
          ${i < parts.length - 1 ? '<div style="width: 6px; height: 1px; background: #000;"></div>' : ''}
        `).join('')}
      </div>
    </div>
  `;

  const amountRow = (num, label, value, isBold = false, labelBg = '#fff') => `
    <div style="display: flex; border-bottom: 0.5px solid #000; align-items: stretch; background: #fff; min-height: 20px;">
      <div style="flex: 1; padding: 1px 4px; display: flex; gap: 4px; align-items: flex-start; background: ${labelBg};">
        <span style="font-size: 6.5pt; font-weight: 900; line-height: 1.2;">${num}</span>
        <span style="font-size: 5.8pt; font-weight: 600; line-height: 1.1;">${label}</span>
      </div>
      <div style="width: 110px; border-left: 0.5px solid #000; padding: 1px 4px; text-align: right; font-size: 8.5pt; font-weight: ${isBold ? '900' : '700'}; font-variant-numeric: tabular-nums; display: flex; align-items: center; justify-content: flex-end; background: #fff;">
        ${formatCurrency(value)}
      </div>
    </div>
  `;

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <title>BIR 2316 - ${fullName}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
    * { box-sizing: border-box; }
    body { margin:0; padding:10px; font-family: 'Inter', sans-serif; background: #525659; }
    .sheet { 
      background: white; 
      width: 8.5in; 
      min-height: 13in; 
      margin: 0 auto; 
      padding: 6px; 
      border: 1px solid #000;
      position: relative;
      color: #000;
    }
    .gray-bg { background: #d1d3d4 !important; }
    .light-gray { background: #e6e7e8 !important; }
    .header-table { width: 100%; border-collapse: collapse; margin-bottom: 1px; }
    .header-table td { border: 0.5px solid #000; padding: 1px; vertical-align: top; }
    .title-cell { text-align: center; vertical-align: middle !important; }
    .section-title { background: #d1d3d4; text-align: center; font-size: 7.5pt; font-weight: 900; border: 0.5px solid #000; border-top: none; padding: 1px; text-transform: uppercase; }
    
    .grid-container { display: grid; grid-template-columns: 1fr 1fr; border-left: 0.5px solid #000; border-right: 0.5px solid #000; border-bottom: 0.5px solid #000; }
    .left-col { border-right: 0.5px solid #000; }
    
    .checkbox { width: 11px; height: 11px; border: 0.5px solid #000; display: inline-block; vertical-align: middle; margin-right: 4px; position: relative; background: #fff; }
    .checked::after { content: 'X'; position: absolute; font-size: 8pt; font-weight: 900; top: -3px; left: 1px; }

    .barcode { 
      display: flex; gap: 1px; height: 35px; align-items: stretch; justify-content: center; background: #fff; padding: 2px;
    }
    .bar { background: #000; }
  </style>
</head>
<body>
  <div class="sheet">
    <table class="header-table">
      <tr>
        <td style="width: 12%; font-size: 5pt; font-weight: 700; padding: 2px;">For BIR <br> Use Only</td>
        <td class="title-cell" style="width: 76%; padding: 2px;">
          <div style="display: flex; align-items: center; justify-content: center; gap: 8px;">
            <img src="${import.meta.env.BASE_URL}BIR-LOGO.png" style="width: 32px; height: 32px;">
            <div style="text-align: center;">
              <div style="font-size: 6.5pt; font-weight: 800; line-height: 1;">Republic of the Philippines</div>
              <div style="font-size: 6.5pt; font-weight: 800; line-height: 1;">Department of Finance</div>
              <div style="font-size: 8.5pt; font-weight: 900; line-height: 1.2;">Bureau of Internal Revenue</div>
            </div>
          </div>
        </td>
        <td style="width: 12%; text-align: right; font-size: 5pt; font-weight: 700; padding: 2px;">BCS/ <br> Item:</td>
      </tr>
    </table>

    <div style="display: flex; border: 0.5px solid #000; border-top: none; align-items: stretch;">
      <div style="width: 15%; border-right: 0.5px solid #000; text-align: center; padding: 1px;">
        <div style="font-size: 6pt; font-weight: 800;">BIR Form No.</div>
        <div style="font-size: 18pt; font-weight: 900; line-height: 1;">2316</div>
        <div style="font-size: 5.5pt; font-weight: 700;">September 2021 (ENCS)</div>
      </div>
      <div style="flex: 1; text-align: center; display: flex; flex-direction: column; justify-content: center; padding: 1px;">
        <div style="font-size: 11pt; font-weight: 900; text-transform: uppercase; line-height: 1.1;">Certificate of Compensation Payment/Tax Withheld</div>
        <div style="font-size: 7.5pt; font-weight: 800;">For Compensation Payment With or Without Tax Withheld</div>
      </div>
      <div style="width: 25%; border-left: 0.5px solid #000; padding: 1px; text-align: center; display: flex; flex-direction: column;">
         <div class="barcode">
           ${[2,4,1,3,2,5,1,4,2,3,6,2,4,1,5,2,3,1,4,2].map(w => `<div class="bar" style="width: ${w}px"></div>`).join('')}
         </div>
         <div style="font-size: 6pt; font-weight: 900; margin-top: 2px;">2316 9/21ENCS</div>
      </div>
    </div>

    <div style="background: #000; color: #fff; font-size: 6pt; font-weight: 800; padding: 2px 4px; border: 0.5px solid #000; border-top: none;">
      Fill in all applicable spaces. Mark all appropriate boxes with an "X".
    </div>

    <div style="display: flex; border: 0.5px solid #000; border-top: none;">
      <div style="width: 50%; border-right: 0.5px solid #000; background: #e6e7e8; display: flex; flex-direction: column;">
        <div style="display: flex; gap: 4px; padding: 2px 4px;">
          <span style="font-size: 6.5pt; font-weight: 900;">1</span>
          <span style="font-size: 5.5pt; font-weight: 700;">For the Year (YYYY)</span>
        </div>
        <div style="display: flex; gap: 3px; justify-content: center; margin-bottom: 3px; margin-top: auto;">
          ${year.toString().split('').map(d => `<div style="border: 0.5px solid #000; width: 16px; height: 18px; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 9pt; background: #fff;">${d}</div>`).join('')}
        </div>
      </div>
      <div style="width: 50%;">
        <div style="display: flex; height: 100%;">
          <div style="width: 30%; border-right: 0.5px solid #000; font-size: 6pt; font-weight: 900; padding: 2px; background: #e6e7e8;">2 <span style="font-size: 5.5pt; font-weight: 600;">For the Period</span></div>
          <div style="flex: 1; border-right: 0.5px solid #000; font-size: 5.5pt; padding: 1px; text-align: center; display: flex; flex-direction: column;">
            From (MM/DD) 
            <div style="margin-top: auto; display: flex; gap: 2px; justify-content: center; border-top: 0.5px solid #000; padding-top: 1px;">
              ${'0101'.split('').map((d, i) => `<div style="border: 0.5px solid #000; width: 12px; height: 14px; font-size: 7.5pt; font-weight: 900; display: flex; align-items: center; justify-content: center;">${d}</div>${i === 1 ? '<span style="font-size: 10pt; line-height: 1;">/</span>' : ''}`).join('')}
            </div>
          </div>
          <div style="flex: 1; font-size: 5.5pt; padding: 1px; text-align: center; display: flex; flex-direction: column;">
            To (MM/DD)
            <div style="margin-top: auto; display: flex; gap: 2px; justify-content: center; border-top: 0.5px solid #000; padding-top: 1px;">
              ${'1231'.split('').map((d, i) => `<div style="border: 0.5px solid #000; width: 12px; height: 14px; font-size: 7.5pt; font-weight: 900; display: flex; align-items: center; justify-content: center;">${d}</div>${i === 1 ? '<span style="font-size: 10pt; line-height: 1;">/</span>' : ''}`).join('')}
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="section-title">Part I - Employee Information</div>
    <div style="display: grid; grid-template-columns: 1fr 1fr; border-left: 0.5px solid #000; border-right: 0.5px solid #000;">
      <div style="border-right: 0.5px solid #000;">${tinBox('3', 'TIN', tinParts)}</div>
      <div style="display: flex;">
        <div style="flex: 1; border-right: 0.5px solid #000;">${box('5 RDO Code', '---', '100%', 'auto', '', false, '#fff')}</div>
        <div style="flex: 1; padding: 2px; background: #fff;">
          <div style="font-size: 5.5pt; font-weight: 700; text-transform: uppercase;">Taxpayer Type</div>
          <div style="font-size: 8pt; font-weight: 800; text-align: center; margin-top: 2px;">RESIDENT</div>
        </div>
      </div>
    </div>
    <div style="border: 0.5px solid #000; border-top: none;">
      ${box("4 Employee's Name (Last Name, First Name, Middle Name)", fullName, '100%', '35px', '', true, '#fff')}
    </div>
    <div style="display: flex; border: 0.5px solid #000; border-top: none;">
      <div style="flex: 3; border-right: 0.5px solid #000;">${box('6 Registered Address', emp.personal?.presentAddress || '---', '100%', 'auto', '')}</div>
      <div style="flex: 1;">${box('6A ZIP Code', emp.personal?.presentZipcode || '---', '100%', 'auto', '')}</div>
    </div>
    <div style="display: flex; border: 0.5px solid #000; border-top: none;">
      <div style="flex: 3; border-right: 0.5px solid #000;">${box('6B Local Home Address', '---', '100%', 'auto', '')}</div>
      <div style="flex: 1;">${box('6C ZIP Code', '---', '100%', 'auto', '')}</div>
    </div>
    <div style="border: 0.5px solid #000; border-top: none;">
      ${box('6D Foreign Address', '---', '100%', 'auto', '')}
    </div>
    <div style="display: flex; border: 0.5px solid #000; border-top: none;">
      <div style="flex: 1; border-right: 0.5px solid #000;">${box('7 Date of Birth (MM/DD/YYYY)', emp.personal?.birthdate || '---', '100%', 'auto', '')}</div>
      <div style="flex: 1;">${box('8 Contact Number', emp.personal?.contactNumbers?.[0] || '---', '100%', 'auto', '')}</div>
    </div>
    <div style="display: flex; border: 0.5px solid #000; border-top: none;">
      <div style="flex: 1; border-right: 0.5px solid #000;">${box('9 Statutory Minimum Wage rate per day', '---', '100%', 'auto', '')}</div>
      <div style="flex: 1;">${box('10 Statutory Minimum Wage rate per month', '---', '100%', 'auto', '')}</div>
    </div>
    <div style="border: 0.5px solid #000; border-top: none; padding: 3px; display: flex; align-items: center; gap: 10px; background: #fff;">
      <span style="font-size: 6.5pt; font-weight: 900;">11</span>
      <div class="checkbox"></div>
      <span style="font-size: 5.8pt; font-weight: 700; line-height: 1.1;">Minimum Wage Earner (MWE) whose compensation is exempt from withholding tax and not subject to income tax</span>
    </div>

    <div class="section-title">Part II - Employer Information (Present)</div>
    <div style="display: grid; grid-template-columns: 1fr 1fr; border-left: 0.5px solid #000; border-right: 0.5px solid #000;">
       <div style="border-right: 0.5px solid #000;">${tinBox('12', 'TIN', COMPANY.tin.split('-'))}</div>
       <div>${box("13 Employer's Name", COMPANY.name, '100%', 'auto', '')}</div>
    </div>
    <div style="display: flex; border: 0.5px solid #000; border-top: none;">
      <div style="flex: 3; border-right: 0.5px solid #000;">${box('14 Registered Address', COMPANY.address, '100%', 'auto', '')}</div>
      <div style="flex: 1;">${box('14A ZIP Code', '1605', '100%', 'auto', '')}</div>
    </div>
    <div style="border: 0.5px solid #000; border-top: none; padding: 3px; display: flex; align-items: center; gap: 30px; background: #fff;">
      <span style="font-size: 6.5pt; font-weight: 900;">15</span>
      <span style="font-size: 5.8pt; font-weight: 700;">Type of Employer:</span>
      <div style="display:flex; align-items:center;"><div class="checkbox checked"></div> <span style="font-size: 5.8pt; font-weight: 600;">Main Employer</span></div>
      <div style="display:flex; align-items:center;"><div class="checkbox"></div> <span style="font-size: 5.8pt; font-weight: 600;">Secondary Employer</span></div>
    </div>

    <div class="section-title">Part III - Employer Information (Previous)</div>
    <div style="display: grid; grid-template-columns: 1fr 1fr; border-left: 0.5px solid #000; border-right: 0.5px solid #000;">
       <div style="border-right: 0.5px solid #000;">${tinBox('16', 'TIN', ['000', '000', '000', '000'])}</div>
       <div>${box("17 Employer's Name", '---', '100%', 'auto', '')}</div>
    </div>
    <div style="display: flex; border: 0.5px solid #000; border-top: none;">
      <div style="flex: 3; border-right: 0.5px solid #000;">${box('18 Registered Address', '---', '100%', 'auto', '')}</div>
      <div style="flex: 1;">${box('18A ZIP Code', '---', '100%', 'auto', '')}</div>
    </div>

    <div class="grid-container" style="grid-template-columns: 1fr 1.15fr; border-bottom: none;">
      <div class="left-col">
        <div class="section-title" style="border:none; border-bottom:0.5px solid #000;">Part IVA - Summary</div>
        ${amountRow('19', 'Gross Compensation Income from Present Employer (Sum of Items 38 and 52)', totals.totalCompensation, false, '#e6e7e8')}
        ${amountRow('20', 'Less: Total Non-Taxable/Exempt Compensation Income from Present Employer (From Item 38)', totals.deminimis + totals.nonTaxable + totals.statutoryEE, false, '#e6e7e8')}
        ${amountRow('21', 'Taxable Compensation Income from Present Employer (Item 19 Less Item 20) (From Item 52)', totals.taxableCompensation, false, '#e6e7e8')}
        ${amountRow('22', 'Add: Taxable Compensation Income from Previous Employer, if applicable', 0, false, '#e6e7e8')}
        ${amountRow('23', 'Gross Taxable Compensation Income (Sum of Items 21 and 22)', totals.taxableCompensation, true, '#e6e7e8')}
        ${amountRow('24', 'Tax Due', totals.taxWithheld, false, '#e6e7e8')}
        <div style="font-size: 5.5pt; font-weight: 900; padding: 2px 4px; border-bottom: 0.5px solid #000; background: #e6e7e8;">25 Amount of Taxes Withheld</div>
        <div style="padding-left: 0px;">
          ${amountRow('25A', 'Present Employer', totals.taxWithheld, false, '#e6e7e8')}
          ${amountRow('25B', 'Previous Employer, if applicable', 0, false, '#e6e7e8')}
        </div>
        ${amountRow('26', 'Total Amount of Taxes Withheld as adjusted (Sum of Items 25A and 25B)', totals.taxWithheld, true, '#e6e7e8')}
        ${amountRow('27', '5% Tax Credit (PERA Act of 2008)', 0, false, '#e6e7e8')}
        ${amountRow('28', 'Total Taxes Withheld (Sum of Items 26 and 27)', totals.taxWithheld, true, '#e6e7e8')}
      </div>
      <div>
        <div class="section-title" style="border:none; border-bottom:0.5px solid #000;">Part IV-B Details of Compensation Income</div>
        <div class="gray-bg" style="font-size: 6.5pt; font-weight: 900; padding: 2px 4px; border-bottom: 0.5px solid #000;">A. NON-TAXABLE/EXEMPT COMPENSATION INCOME</div>
        ${amountRow('29', 'Basic Salary (including the exempt P250,000 & below) or MWE', totals.basicPay)}
        ${amountRow('30', 'Holiday Pay (MWE)', 0)}
        ${amountRow('31', 'Overtime Pay (MWE)', 0)}
        ${amountRow('32', 'Night Shift Differential (MWE)', 0)}
        ${amountRow('33', 'Hazard Pay (MWE)', 0)}
        ${amountRow('34', '13th Month Pay and Other Benefits (max of P90,000)', totals.deminimis)}
        ${amountRow('35', 'De Minimis Benefits', totals.nonTaxable)}
        ${amountRow('36', 'SSS, GSIS, PHIC & PAG-IBIG Contributions and Union Dues', totals.statutoryEE)}
        ${amountRow('37', 'Salaries and Other Forms of Compensation', 0)}
        ${amountRow('38', 'Total Non-Taxable/Exempt Compensation Income (Sum of 29-37)', totals.deminimis + totals.nonTaxable + totals.statutoryEE, true)}
        
        <div class="gray-bg" style="font-size: 6.5pt; font-weight: 900; padding: 2px 4px; border-bottom: 0.5px solid #000; border-top: 0.5px solid #000;">B. TAXABLE COMPENSATION INCOME REGULAR</div>
        ${amountRow('39', 'Basic Salary', totals.taxableCompensation)}
        ${amountRow('40', 'Representation', 0)}
        ${amountRow('41', 'Transportation', 0)}
        ${amountRow('42', 'Cost of Living Allowance (COLA)', 0)}
        ${amountRow('43', 'Fixed Housing Allowance', 0)}
        <div style="font-size: 5.5pt; font-weight: 800; padding: 2px 4px; border-bottom: 0.5px solid #000; background: #fff;">44 Others (specify)</div>
        <div style="padding-left: 0px;">
          ${amountRow('44A', '---', 0)}
          ${amountRow('44B', '---', 0)}
        </div>
        <div class="gray-bg" style="font-size: 5.8pt; font-weight: 800; padding: 2px 4px; border-bottom: 0.5px solid #000;">SUPPLEMENTARY</div>
        ${amountRow('45', 'Commission', 0)}
        ${amountRow('46', 'Profit Sharing', 0)}
        ${amountRow('52', 'Total Taxable Compensation Income (Sum of 39 to 51B)', totals.taxableCompensation, true)}
      </div>
    </div>

    <div style="border: 0.5px solid #000; padding: 4px; font-size: 5.8pt; line-height: 1.15; text-align: justify; background: #fff;">
      I/We declare, under the penalties of perjury that this certificate has been made in good faith, verified by me/us, and to the best of my/our knowledge and belief, is true and correct, pursuant to the provisions of the National Internal Revenue Code, as amended, and the regulations issued under authority thereof. Further, I/we give my/our consent to the processing of my/our information as contemplated under the "Data Privacy Act of 2012 (R.A. No. 10173) for legitimate and lawful purposes.
    </div>

    <div style="display: grid; grid-template-columns: 1.6fr 1fr; border: 0.5px solid #000; border-top: none;">
      <div style="border-right: 0.5px solid #000; padding: 12px 5px; text-align: center; background: #fff;">
        <div style="border-bottom: 0.5px solid #000; width: 85%; margin: 0 auto; margin-top: 8px;"></div>
        <div style="font-size: 6.5pt; font-weight: 700; margin-top: 2px;">53 Present Employer/Authorized Agent Signature over Printed Name</div>
      </div>
      <div style="padding: 5px; background: #fff;">
        <div style="font-size: 5.8pt; font-weight: 700;">Date Signed</div>
        <div style="display: flex; gap: 3px; margin-top: 2px;">
          ${[1,2,3,4,5,6,7,8].map((i) => `<div style="border: 0.5px solid #000; width: 14px; height: 18px;"></div>${(i===2||i===4)?'<div style="width:4px"></div>':''}`).join('')}
        </div>
      </div>
    </div>

    <div style="font-size: 6.5pt; font-weight: 900; padding: 1px 4px; border: 0.5px solid #000; border-top: none; background: #e6e7e8;">CONFORME:</div>
    <div style="display: grid; grid-template-columns: 1.6fr 1fr; border: 0.5px solid #000; border-top: none;">
      <div style="border-right: 0.5px solid #000; padding: 12px 5px; text-align: center; background: #fff;">
        <div style="border-bottom: 0.5px solid #000; width: 85%; margin: 0 auto; margin-top: 8px; font-size: 8pt; font-weight: 900;">${fullName}</div>
        <div style="font-size: 6.5pt; font-weight: 700; margin-top: 2px;">54 Employee Signature over Printed Name</div>
      </div>
      <div style="padding: 5px; background: #fff;">
        <div style="font-size: 5.8pt; font-weight: 700;">Date Signed</div>
        <div style="display: flex; gap: 3px; margin-top: 2px;">
          ${[1,2,3,4,5,6,7,8].map((i) => `<div style="border: 0.5px solid #000; width: 14px; height: 18px;"></div>${(i===2||i===4)?'<div style="width:4px"></div>':''}`).join('')}
        </div>
      </div>
    </div>

    <div style="display: flex; border: 0.5px solid #000; border-top: none; font-size: 5.8pt; font-weight: 700; background: #fff;">
      <div style="flex: 1.5; border-right: 0.5px solid #000; padding: 3px;">CTC/Valid ID No. of Employee: <div style="height: 14px; border-bottom: 0.5px solid #000; margin-top: 2px;"></div></div>
      <div style="flex: 1; border-right: 0.5px solid #000; padding: 3px;">Place of Issue: <div style="height: 14px; border-bottom: 0.5px solid #000; margin-top: 2px;"></div></div>
      <div style="flex: 1; border-right: 0.5px solid #000; padding: 3px;">Date Issued: <div style="height: 14px; border-bottom: 0.5px solid #000; margin-top: 2px;"></div></div>
      <div style="flex: 0.8; padding: 3px;">Amount paid, if CTC: <div style="height: 14px; border-bottom: 0.5px solid #000; margin-top: 2px;"></div></div>
    </div>

    <div class="section-title">To be accomplished under substituted filing</div>
    <div style="display: grid; grid-template-columns: 1fr 1fr; border: 0.5px solid #000; border-top: none; min-height: 120px; background: #fff;">
      <div style="border-right: 0.5px solid #000; padding: 6px; font-size: 5.2pt; line-height: 1.25; text-align: justify;">
        I declare, under the penalties of perjury that the information herein stated are reported under BIR Form No. 1604-C which has been filed with the Bureau of Internal Revenue.
        <br><br><br>
        <div style="text-align: center;">
          <div style="border-bottom: 0.5px solid #000; width: 85%; margin: 0 auto; margin-top: 15px;"></div>
          <div style="font-size: 5.8pt; font-weight: 800;">55 Present Employer/Authorized Agent Signature over Printed Name</div>
          <div style="font-size: 5pt; font-weight: 600;">(Head of Accounting/Human Resource or Authorized Representative)</div>
        </div>
      </div>
      <div style="padding: 6px; font-size: 5.2pt; line-height: 1.2; text-align: justify;">
        I declare, under the penalties of perjury that I am qualified under substituted filing of Income Tax Return (BIR Form No. 1700), since I received purely compensation income from only one employer in the Philippines for the calendar year; that taxes have been correctly withheld by my employer (tax due equals tax withheld); that the BIR Form No. 1604-C filed by my employer to the BIR shall constitute as my income tax return; and that BIR Form No. 2316 shall serve the same purpose as if BIR Form No. 1700 has been filed pursuant to the provisions of Revenue Regulations (RR) No. 3-2002, as amended.
        <br><br>
        <div style="text-align: center;">
          <div style="border-bottom: 0.5px solid #000; width: 85%; margin: 0 auto; margin-top: 10px; font-size: 8pt; font-weight: 900;">${fullName}</div>
          <div style="font-size: 5.8pt; font-weight: 800;">56 Employee Signature over Printed Name</div>
        </div>
      </div>
    </div>

    <div style="font-size: 6pt; text-align: center; margin-top: 5px; font-weight: 700; color: #000;">
      *NOTE: The BIR Data Privacy is in the BIR website (www.bir.gov.ph)
    </div>
  </div>
  ${
    mode === 'pdf'
      ? `
  <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>
  <script>
    window.onload = function() {
      var element = document.querySelector('.sheet');
      var opt = {
        margin:       0,
        filename:     'BIR2316_${emp.id || 'EMP'}_${year}.pdf',
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2 },
        jsPDF:        { unit: 'in', format: 'legal', orientation: 'portrait' }
      };
      html2pdf().set(opt).from(element).save().then(() => {
        setTimeout(() => window.close(), 1800);
      });
    };
  </script>`
      : ''
  }
</body>
</html>`;
}

export default function BIRForms() {
  const [year, setYear] = useState('2025');
  const [month, setMonth] = useState('March');

  const birForms = [
    { 
      id: '1604-C', 
      title: 'BIR Form 1604-C', 
      description: 'Annual Information Return of Income Taxes Withheld on Compensation',
      frequency: 'Annual',
      status: 'Pending',
      date: '---'
    }
  ];

  const [employeePickerOpen, setEmployeePickerOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(employees?.[0] ?? null);
  const [pendingAction, setPendingAction] = useState(null); // 'view' | 'pdf' | 'print'

  const employeeOptions = useMemo(() => {
    return (employees || []).map((e) => ({
      ...e,
      display: `${e.id} — ${e.lastName}, ${e.firstName}${e.middleName ? ` ${e.middleName}` : ''}`,
    }));
  }, []);

  const totals = useMemo(() => {
    if (!selectedEmployee) return null;
    const y = Number(year);
    const recs = (payrollRecords || []).filter((r) => r.employeeId === selectedEmployee.id && r.year === y);
    const sum = (k) => recs.reduce((acc, r) => acc + Number(r?.[k] || 0), 0);
    const basicPay = sum('basicPay');
    const deminimis = sum('deminimis');
    const nonTaxable = sum('nonTaxable');
    const sssEE = sum('sssEE');
    const phEE = sum('phEE');
    const hdmfEE = sum('hdmfEE');
    const taxWithheld = sum('tax');
    const totalCompensation = basicPay + deminimis + nonTaxable;
    const statutoryEE = sssEE + phEE + hdmfEE;
    const taxableCompensation = Math.max(totalCompensation - statutoryEE, 0);
    return {
      monthCount: recs.length,
      basicPay,
      deminimis,
      nonTaxable,
      totalCompensation,
      sssEE,
      phEE,
      hdmfEE,
      statutoryEE,
      taxableCompensation,
      taxWithheld,
    };
  }, [selectedEmployee, year]);

  const open2316 = (action) => {
    if (!selectedEmployee) {
      setPendingAction(action);
      setEmployeePickerOpen(true);
      return;
    }
    const w = window.open('', '_blank');
    if (!w) return;
    const html = build2316Html(
      { emp: selectedEmployee, year: Number(year), totals },
      { mode: action === 'pdf' ? 'pdf' : 'print' }
    );
    w.document.write(html);
    w.document.close();
    w.focus();
    if (action === 'print') {
      setTimeout(() => {
        w.print();
        w.close();
      }, 350);
    }
  };

  const download2316Excel = async () => {
    if (!selectedEmployee || !totals) return;
    const emp = selectedEmployee;
    const y = Number(year);

    const fullName = `${emp.lastName}, ${emp.firstName}${emp.middleName ? ` ${emp.middleName}` : ''}${emp.suffix ? ` ${emp.suffix}` : ''}`;
    const empTin = emp?.requirements?.tinNo || '';

    // Load template from public/ so Vite serves it
    const res = await fetch('/reports-template/2316-template.xlsx');
    if (!res.ok) throw new Error('Failed to load 2316 Excel template.');
    const buf = await res.arrayBuffer();

    const wb = new ExcelJS.Workbook();
    await wb.xlsx.load(buf);
    const ws = wb.worksheets[0];

    // ── Header / Part I (Employee) ───────────────────────────────────────────
    ws.getCell('C11').value = y;          // For the Year
    ws.getCell('C14').value = empTin;     // Employee TIN (value area starts at C14)
    ws.getCell('B16').value = fullName;   // Employee Name (value area starts at B16)

    // ── Part II (Employer - Present) ─────────────────────────────────────────
    ws.getCell('C41').value = COMPANY.tin;      // Employer TIN
    ws.getCell('B43').value = COMPANY.name;     // Employer's Name
    ws.getCell('B46').value = COMPANY.address;  // Registered Address

    // ── Part IV-B / Summary values (common fields) ───────────────────────────
    const totalNonTaxable = Number(totals.deminimis || 0) + Number(totals.nonTaxable || 0) + Number(totals.statutoryEE || 0);

    // Right-side Non-taxable section
    ws.getCell('AN33').value = Number(totals.statutoryEE || 0);           // Contributions (EE)
    ws.getCell('AN36').value = Number(totals.basicPay || 0);              // Salaries / Compensation
    ws.getCell('AN39').value = Number(totalNonTaxable || 0);              // Total Non-taxable/Exempt

    // Left-side compensation summary
    ws.getCell('T61').value = Number(totals.totalCompensation || 0);      // Gross compensation from present employer
    ws.getCell('T63').value = Number(totalNonTaxable || 0);               // Less: total non-taxable/exempt compensation
    ws.getCell('T66').value = Number(totals.taxableCompensation || 0);    // Taxable compensation income from present employer
    ws.getCell('T74').value = Number(totals.taxWithheld || 0);            // Taxes withheld - present employer
    ws.getCell('T77').value = Number(totals.taxWithheld || 0);            // Total taxes withheld (adjusted)

    // Taxable compensation total (right-side summary)
    ws.getCell('AN77').value = Number(totals.taxableCompensation || 0);   // Total taxable compensation income

    // Ensure numeric cells stay numeric; template formatting should apply.
    const filename = `BIR2316_${emp.id}_${y}.xlsx`;
    const out = await wb.xlsx.writeBuffer();
    const blob = new Blob([out], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleActionClick = (action) => {
    // All 2316 actions are per-employee; open picker/preview first.
    setPendingAction(action);
    setEmployeePickerOpen(true);
  };

  const headerStyle = {
    bgcolor: logoBlue,
    color: '#FDFDFC',
    fontWeight: 700,
    fontSize: '0.85rem'
  };

  return (
    <Box className="page-container" sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 900, color: '#1a202c', letterSpacing: '-0.5px' }}>
            BIR Forms Module
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500 }}>
            Generate and manage tax compliance forms for APECC employees
          </Typography>
        </Box>
        <Stack direction="row" spacing={2}>
          <Button variant="outlined" startIcon={<RefreshIcon />} sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 700 }}>
            Sync Payroll Data
          </Button>
          <Button variant="contained" sx={{ bgcolor: logoBlue, borderRadius: 2, textTransform: 'none', px: 4, fontWeight: 700 }}>
            Generate All Current
          </Button>
        </Stack>
      </Box>

      {/* Filters */}
      <Card sx={{ mb: 3, borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
        <CardContent sx={{ py: 2, px: 3, display: 'flex', gap: 2, alignItems: 'center' }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 800, color: logoBlue, mr: 2 }}>FILTERS:</Typography>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Year</InputLabel>
            <Select value={year} label="Year" onChange={(e) => setYear(e.target.value)}>
              <MenuItem value="2025">2025</MenuItem>
              <MenuItem value="2024">2024</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Month</InputLabel>
            <Select value={month} label="Month" onChange={(e) => setMonth(e.target.value)}>
              {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map(m => (
                <MenuItem key={m} value={m}>{m}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </CardContent>
      </Card>

      {/* Form List Table */}
      <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: '0 4px 24px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={headerStyle}>Form ID</TableCell>
              <TableCell sx={headerStyle}>Form Description</TableCell>
              <TableCell sx={headerStyle} align="center">Frequency</TableCell>
              <TableCell sx={headerStyle} align="center">Status</TableCell>
              <TableCell sx={headerStyle} align="center">Last Generated</TableCell>
              <TableCell sx={headerStyle} align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {birForms.map((form) => (
              <TableRow key={form.id} hover>
                <TableCell sx={{ fontWeight: 800, color: logoBlue }}>{form.id}</TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>{form.title}</Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>{form.description}</Typography>
                </TableCell>
                <TableCell align="center">
                  <Chip label={form.frequency} size="small" sx={{ fontWeight: 600, fontSize: '0.7rem' }} />
                </TableCell>
                <TableCell align="center">
                  <Chip 
                    label={form.status} 
                    size="small" 
                    sx={{ 
                      fontWeight: 800, 
                      fontSize: '0.7rem',
                      bgcolor: form.status === 'Generated' ? 'rgba(46,125,50,0.1)' : (form.status === 'Ready' ? 'rgba(2, 61, 251, 0.1)' : 'rgba(0,0,0,0.05)'),
                      color: form.status === 'Generated' ? '#2e7d32' : (form.status === 'Ready' ? logoBlue : 'text.secondary')
                    }} 
                  />
                </TableCell>
                <TableCell align="center" sx={{ fontSize: '0.85rem', fontWeight: 500 }}>{form.date}</TableCell>
                <TableCell align="right">
                  <Stack direction="row" spacing={1} justifyContent="flex-end" alignItems="center">
                    <Tooltip title="View Preview">
                      <IconButton size="small" color="primary" onClick={() => handleActionClick('view')}>
                        <ViewIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Download PDF">
                      <IconButton size="small" sx={{ color: '#d32f2f' }} onClick={() => handleActionClick('pdf')}>
                        <PdfIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Download Excel (Template)">
                      <IconButton size="small" sx={{ color: '#2e7d32' }} onClick={() => handleActionClick('excel')}>
                        <ExcelIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Print">
                      <IconButton size="small" onClick={() => handleActionClick('print')}>
                        <PrintIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    
                    {form.id === '1604-C' && (
                      <Tooltip title="Generate DAT File for BIR Sending">
                        <Button 
                          size="small" 
                          variant="contained" 
                          sx={{ 
                            ml: 2, 
                            bgcolor: '#2e7d32', 
                            '&:hover': { bgcolor: '#1b5e20' },
                            textTransform: 'none', 
                            fontWeight: 700, 
                            height: 28 
                          }}
                          onClick={() => alert('DAT file generated for BIR Sending.')}
                        >
                          BIR Sending
                        </Button>
                      </Tooltip>
                    )}
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* 2316 Employee Picker / Preview */}
      <Dialog open={employeePickerOpen} onClose={() => setEmployeePickerOpen(false)} fullWidth maxWidth="md">
        <DialogTitle sx={{ fontWeight: 900, color: '#111' }}>
          BIR Form 2316 — Per Employee
        </DialogTitle>
        <DialogContent dividers sx={{ bgcolor: '#f7f9ff' }}>
          <Stack spacing={2}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
              <Autocomplete
                fullWidth
                options={employeeOptions}
                value={selectedEmployee}
                onChange={(_, v) => setSelectedEmployee(v)}
                getOptionLabel={(opt) => opt?.display || ''}
                renderInput={(params) => <TextField {...params} label="Select Employee" size="small" />}
              />
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Year</InputLabel>
                <Select value={year} label="Year" onChange={(e) => setYear(e.target.value)}>
                  {[2026, 2025, 2024, 2023].map((y) => (
                    <MenuItem key={y} value={String(y)}>{y}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>

            <Divider />

            <Paper sx={{ p: 2.5, borderRadius: 2, border: `1px solid rgba(2, 65, 251, 0.15)` }}>
              <Typography sx={{ fontWeight: 900, color: logoBlue, mb: 1 }}>
                2316 Preview (Summary)
              </Typography>
              {selectedEmployee && totals ? (
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body2" sx={{ fontWeight: 800 }}>Employee</Typography>
                    <Typography variant="body2">
                      {selectedEmployee.lastName}, {selectedEmployee.firstName} {selectedEmployee.middleName || ''} ({selectedEmployee.id})
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1, fontWeight: 800 }}>TIN</Typography>
                    <Typography variant="body2">{selectedEmployee?.requirements?.tinNo || '---'}</Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body2" sx={{ fontWeight: 800 }}>Year</Typography>
                    <Typography variant="body2">{year}</Typography>
                    <Typography variant="body2" sx={{ mt: 1, fontWeight: 800 }}>Payroll Records</Typography>
                    <Typography variant="body2">{totals.monthCount}</Typography>
                  </Grid>

                  <Grid item xs={12}>
                    <Divider sx={{ my: 1.5 }} />
                    <Grid container spacing={1}>
                      {[
                        ['Total Compensation', totals.totalCompensation],
                        ['Statutory (EE)', totals.statutoryEE],
                        ['Taxable Compensation', totals.taxableCompensation],
                        ['Tax Withheld', totals.taxWithheld],
                      ].map(([label, val]) => (
                        <Grid item xs={12} sm={6} key={label}>
                          <Stack direction="row" justifyContent="space-between" sx={{ p: 1, borderRadius: 1, bgcolor: 'rgba(2,65,251,0.04)' }}>
                            <Typography variant="body2" sx={{ fontWeight: 800 }}>{label}</Typography>
                            <Typography variant="body2" sx={{ fontWeight: 900 }}>{formatCurrency(val)}</Typography>
                          </Stack>
                        </Grid>
                      ))}
                    </Grid>
                  </Grid>
                </Grid>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Select an employee to preview BIR Form 2316.
                </Typography>
              )}
            </Paper>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={() => setEmployeePickerOpen(false)} sx={{ textTransform: 'none' }}>
            Close
          </Button>
          <Stack direction="row" spacing={1}>
            <Button
              variant={pendingAction === 'view' ? 'contained' : 'outlined'}
              startIcon={<ViewIcon />}
              onClick={() => {
                setEmployeePickerOpen(false);
                open2316('view');
              }}
              sx={{
                textTransform: 'none',
                fontWeight: 800,
                ...(pendingAction === 'view'
                  ? { bgcolor: logoBlue, '&:hover': { bgcolor: '#0230c4' } }
                  : {}),
              }}
              disabled={!selectedEmployee}
            >
              View (Print Preview)
            </Button>
            <Button
              variant="contained"
              startIcon={<PdfIcon />}
              onClick={() => {
                setEmployeePickerOpen(false);
                open2316('pdf');
              }}
              sx={{ textTransform: 'none', fontWeight: 900, bgcolor: '#d32f2f', '&:hover': { bgcolor: '#b71c1c' } }}
              disabled={!selectedEmployee}
            >
              Download PDF
            </Button>
            <Button
              variant={pendingAction === 'excel' ? 'contained' : 'outlined'}
              startIcon={<ExcelIcon />}
              onClick={async () => {
                setEmployeePickerOpen(false);
                await download2316Excel();
              }}
              sx={{
                textTransform: 'none',
                fontWeight: 900,
                ...(pendingAction === 'excel'
                  ? { bgcolor: '#2e7d32', color: '#fff', '&:hover': { bgcolor: '#1b5e20' } }
                  : { borderColor: '#2e7d32', color: '#1b5e20', '&:hover': { borderColor: '#1b5e20', bgcolor: 'rgba(46,125,50,0.06)' } }),
              }}
              disabled={!selectedEmployee}
            >
              Download Excel
            </Button>
            <Button
              variant={pendingAction === 'print' ? 'contained' : 'outlined'}
              startIcon={<PrintIcon />}
              onClick={() => {
                setEmployeePickerOpen(false);
                open2316('print');
              }}
              sx={{
                textTransform: 'none',
                fontWeight: 900,
                ...(pendingAction === 'print'
                  ? { bgcolor: '#8d6e63', color: '#fff', '&:hover': { bgcolor: '#6d4c41' } }
                  : { borderColor: '#8d6e63', color: '#6d4c41', '&:hover': { borderColor: '#6d4c41', bgcolor: 'rgba(141,110,99,0.06)' } }),
              }}
              disabled={!selectedEmployee}
            >
              Print (Legal)
            </Button>
          </Stack>
        </DialogActions>
      </Dialog>

      {/* Info Cards */}
      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 3, borderLeft: `6px solid ${goldAccent}`, bgcolor: 'rgba(212, 168, 67, 0.05)' }}>
            <CardContent>
              <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 1 }}>Reporting Requirement</Typography>
              <Typography variant="body2" color="text.secondary">
                Ensure all payroll runs for the selected month are **Closed** and **Validated** before generating final BIR forms. 
                Discrepancies in employee TIN or missing contribution data will be flagged during the validation process.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 3, borderLeft: `6px solid ${logoBlue}`, bgcolor: 'rgba(2, 61, 251, 0.05)' }}>
            <CardContent>
              <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 1 }}>Automatic Filing Integration</Typography>
              <Typography variant="body2" color="text.secondary">
                APECC MS is currently configured for manual eFPS uploading. You can download the DAT files directly from the 
                preview section of each form for faster processing in the BIR offline tools.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
