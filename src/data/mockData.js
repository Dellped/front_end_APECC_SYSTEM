// ===== Organizational Master Data =====
export const FILE_STATUSES = ['Active', 'Suspended', 'AWOL', 'Resigned/Exit'];

export const COMPANY_POSITIONS = [
  'General Manager', 'HR Head', 'Product Disbursement Officer',
  'Product Collection Officer', 'Cashier', 'Compliance Officer',
  'Admin Assistant', 'Bookkeeper'
];

export const COMPANY_DIVISIONS = [
  'Executive Division', 'Human Resources Division', 'Finance & Accounting Division',
  'Operations Division', 'Collection Division', 'Information Technology (IT) Division',
  'Customer Service Division', 'Legal & Compliance Division'
];

export const COMPANY_DEPARTMENTS = [
  'Executive Office', 'HR Operations', 'Finance', 'Admin',
  'IT Support / Helpdesk', 'Tax Documentary & Compliance', 'Collection', 'Disbursement'
];

export const JOB_LEVELS = [
  'Level 1 - Probationary', 'Level 2- upon regularization', 'Level 3 - Sub - unit Heads',
  'Level 3 - HR Officer', 'Level 3 - Cashier', 'Level 3 - Asst. bookkeeper',
  'Level 3 - leveling promotion', 'Level 4 - Unit Heads',
  'Level 4 - Documentary and Compliance', 'Level 5 - Assistant General Manager',
  'Level 6 - General Manager'
];

export const SHIFT_SCHEDULES = [
  { type: 'Day', in: '9:00:00 AM', out: '6:00:00 PM' },
];

export const EMPLOYMENT_STATUSES = ['Contractual', 'Probationary', 'Regular'];

// ===== Employee Data =====
export const employees = [
  {
    id: '0001',
    firstName: 'Maria',
    middleName: 'Santos',
    lastName: 'Dela Cruz',
    suffix: '',
    photo: null,
    designation: 'General Manager',
    department: 'Executive Office',
    payrollLocation: 'APECC Main',
    employmentDate: '2019-03-15',
    status: 'Active',
    employmentType: 'Regular',
    personal: {
      birthdate: '1988-06-20',
      birthplace: 'Dagupan City',
      gender: 'Female',
      tenureship: '5 years',
      civilStatus: 'Married',
      religion: 'Roman Catholic',
      citizenship: 'Filipino',
      height: '5\'4"',
      weight: '58 kg',
      bloodType: 'O+',
      presentAddress: '123 Rizal St., Brgy. Pogo Grande, Dagupan City, Pangasinan',
      presentZipcode: '2400',
      permanentAddress: '123 Rizal St., Brgy. Pogo Grande, Dagupan City, Pangasinan',
      permanentZipcode: '2400',
      contactNumbers: ['0917-123-4567', '075-523-1234'],
      emailAddresses: ['maria.delacruz@apecc.coop', 'maria.dc88@gmail.com'],
      emergencyContact: {
        name: 'Juan Dela Cruz',
        number: '0918-234-5678',
        relationship: 'Husband'
      },
    },
    employmentDetails: {
      division: 'Executive Division',
      department: 'Executive Office',
      jobLevel: 'Level 6 - General Manager',
      dateHired: '2019-03-15',
      endDate: null,
      regularizationDate: '2019-09-15',
      workLocation: 'APECC Main',
      shift: 'Flexible',
      timeIn: '--',
      timeOut: '--',
      supervisor: 'Board of Directors',
    },
    family: {
      spouse: { 
        name: 'Juan Dela Cruz', 
        birthdate: '1985-05-12',
        address: '123 Rizal St., Brgy. Pogo Grande, Dagupan City, Pangasinan',
        businessAddress: 'Poblacion West, Dagupan City',
        occupation: 'Engineer', 
        contact: '0918-234-5678',
        numChildren: 2
      },
      father: { name: 'Pedro Santos', birthdate: '1960-01-15', occupation: 'Retired Teacher', contact: '0919-345-6789' },
      mother: { name: 'Rosa Santos', birthdate: '1962-03-22', occupation: 'Homemaker', contact: '0919-345-6789' },
      children: [
        { name: 'Ana Dela Cruz', birthdate: '2012-04-10', school: 'Dagupan City National HS' },
        { name: 'Jose Dela Cruz', birthdate: '2015-08-22', school: 'Dagupan Central School' },
      ],
    },
    education: [
      { level: 'College', school: 'University of Pangasinan', degree: 'BS Business Administration', areaOfStudy: 'Management', distinction: 'Cum Laude', units: 'Completed', from: '2005-06', till: '2009-03' },
      { level: 'High School', school: 'Dagupan City National HS', degree: '', areaOfStudy: 'General Academics', distinction: '', units: '', from: '2001-06', till: '2005-03' },
      { level: 'Elementary', school: 'Dagupan Central School', degree: '', areaOfStudy: '', distinction: 'Valedictorian', units: '', from: '1995-06', till: '2001-03' },
    ],
    workExperience: [
      { company: 'Rural Bank of Dagupan', position: 'Loan Officer', salary: 'P25,000', from: '2012-01', to: '2019-02', reason: 'Career Growth' },
      { company: 'BPI Dagupan Branch', position: 'Teller', salary: 'P18,000', from: '2009-06', to: '2011-12', reason: 'Better Opportunity' },
    ],
    references: [
      { name: 'Dr. Roberto Tan', position: 'University Dean', addressCompany: 'University of Pangasinan', contact: '0920-456-7890' },
      { name: 'Atty. Carmen Reyes', position: 'Legal Counsel', addressCompany: 'Reyes Law Office', contact: '0921-567-8901' },
    ],
    requirements: {
      tinId: 'Submitted', tinNo: '123-456-789-000',
      sss: 'Submitted', sssNo: '03-1234567-8',
      philhealth: 'Submitted', philhealthNo: '12-050493827-1',
      hdmf: 'Pending', hdmfNo: '1212-3434-5656',
      nbi: 'Submitted', nbiNo: 'N123P987O',
    },
    payrollProfile: {
      basicSalary: 35000,
      salaryType: 'Monthly',
      payrollFrequency: 'Semi-Monthly',
      taxStatus: 'S/ME',
      bankAccountNumber: '1234-5678-90',
      employmentStatus: 'Regular'
    },
  },
  {
    id: '0002',
    firstName: 'Ricardo',
    middleName: 'Bautista',
    lastName: 'Flores',
    suffix: 'Jr.',
    photo: null,
    designation: 'Compliance Officer',
    department: 'Tax Documentary & Compliance',
    payrollLocation: 'APECC Main',
    employmentDate: '2020-01-06',
    status: 'Active',
    employmentType: 'Regular',
    personal: {
      birthdate: '1992-11-15',
      birthplace: 'Dagupan City',
      gender: 'Male',
      tenureship: '4 years',
      civilStatus: 'Single',
      religion: 'Iglesia ni Cristo',
      citizenship: 'Filipino',
      height: '5\'9"',
      weight: '72 kg',
      bloodType: 'A+',
      presentAddress: '45 Mabini Ave., Brgy. Bolosan, Dagupan City, Pangasinan',
      presentZipcode: '2400',
      permanentAddress: '45 Mabini Ave., Brgy. Bolosan, Dagupan City, Pangasinan',
      permanentZipcode: '2400',
      contactNumbers: ['0927-456-7890'],
      emailAddresses: ['ricardo.flores@apecc.coop'],
      emergencyContact: {
        name: 'Elena Bautista',
        number: '0928-567-8901',
        relationship: 'Mother'
      },
    },
    employmentDetails: {
      division: 'Legal & Compliance Division',
      department: 'Tax Documentary & Compliance',
      jobLevel: 'Level 4 - Documentary and Compliance',
      dateHired: '2020-01-06',
      endDate: null,
      regularizationDate: '2020-07-06',
      workLocation: 'APECC Main',
      shift: 'Day',
      timeIn: '6:00:00 AM',
      timeOut: '9:00:00 PM',
      supervisor: 'Maria Dela Cruz',
    },
    family: {
      spouse: null,
      father: { name: 'Ricardo Flores Sr.', birthdate: '1965-07-20', occupation: 'Fisherman', contact: '0928-567-8901' },
      mother: { name: 'Elena Bautista', birthdate: '1967-12-05', occupation: 'Market Vendor', contact: '0928-567-8901' },
      children: [],
    },
    education: [
      { level: 'College', school: 'Lyceum-Northwestern University', degree: 'BS Accountancy', areaOfStudy: 'Accounting', distinction: 'Board Passer', units: 'Completed', from: '2010-06', till: '2014-03' },
    ],
    workExperience: [
      { company: 'ASA Philippines', position: 'Branch Accountant', salary: 'P20,000', from: '2015-03', to: '2019-12', reason: 'Company Closure' },
    ],
    references: [
      { name: 'CPA Maria Gonzales', position: 'Audit Partner', addressCompany: 'Gonzales & Associates', contact: '0922-678-9012' },
    ],
    requirements: {
      tinId: 'Submitted', tinNo: '234-567-890-111',
      sss: 'Submitted', sssNo: '03-2345678-9',
      philhealth: 'Submitted', philhealthNo: '12-060504938-2',
      hdmf: 'Submitted', hdmfNo: '1212-4545-6767',
      nbi: 'Pending', nbiNo: 'N234Q876P',
    },
    payrollProfile: {
      basicSalary: 550,
      salaryType: 'Daily',
      payrollFrequency: 'Weekly',
      taxStatus: 'S/ME',
      bankAccountNumber: '2345-6789-01',
      employmentStatus: 'Regular'
    },
  },
  {
    id: '0003',
    firstName: 'Elena',
    middleName: 'Ramos',
    lastName: 'Villanueva',
    suffix: '',
    photo: null,
    designation: 'HR Head',
    department: 'HR Operations',
    payrollLocation: 'APECC Main',
    employmentDate: '2018-07-02',
    status: 'Active',
    employmentType: 'Regular',
    personal: {
      birthdate: '1990-03-08',
      birthplace: 'Calasiao',
      gender: 'Female',
      tenureship: '6 years',
      civilStatus: 'Married',
      religion: 'Roman Catholic',
      citizenship: 'Filipino',
      height: '5\'3"',
      weight: '55 kg',
      bloodType: 'B+',
      presentAddress: '78 Narra St., Brgy. Nalsian, Calasiao, Pangasinan',
      presentZipcode: '2418',
      permanentAddress: '78 Narra St., Brgy. Nalsian, Calasiao, Pangasinan',
      permanentZipcode: '2418',
      contactNumbers: ['0919-867-5309'],
      emailAddresses: ['elena.villanueva@apecc.coop'],
      emergencyContact: {
        name: 'Roberto Villanueva',
        number: '0920-888-1234',
        relationship: 'Husband'
      },
    },
    employmentDetails: {
      division: 'Human Resources Division',
      department: 'HR Operations',
      jobLevel: 'Level 4 - Unit Heads',
      dateHired: '2018-07-02',
      endDate: null,
      regularizationDate: '2019-01-02',
      workLocation: 'APECC Main',
      shift: 'Day',
      timeIn: '6:00:00 AM',
      timeOut: '9:00:00 PM',
      supervisor: 'Maria Dela Cruz',
    },
    family: {
      spouse: { 
        name: 'Mark Villanueva', 
        birthdate: '1988-11-20',
        address: '78 Burgos St., Brgy. Poblacion, Calasiao, Pangasinan',
        businessAddress: 'Al Khobar, Saudi Arabia',
        occupation: 'OFW - Saudi Arabia', 
        contact: '0936-890-1234',
        numChildren: 1
      },
      father: { name: 'Eduardo Ramos', birthdate: '1962-09-30', occupation: 'Retired Government Employee', contact: '0937-901-2345' },
      mother: { name: 'Gloria Ramos', birthdate: '1964-05-15', occupation: 'Retired Nurse', contact: '0937-901-2345' },
      children: [
        { name: 'Mia Villanueva', birthdate: '2016-12-01', school: 'Calasiao Central School' },
      ],
    },
    education: [
      { level: 'College', school: 'PSU - Lingayen', degree: 'BS Psychology', areaOfStudy: 'Human Behavior', distinction: '', units: 'Completed', from: '2007-06', till: '2011-03' },
    ],
    workExperience: [
      { company: 'Jollibee Foods Corp', position: 'HR Assistant', salary: 'P18,000', from: '2012-06', to: '2018-06', reason: 'Career Growth' },
    ],
    references: [
      { name: 'Prof. Linda Cruz', position: 'HR Department Head, PSU', addressCompany: 'Pangasinan State University', contact: '0923-789-0123' },
    ],
    requirements: {
      tinId: 'Submitted', tinNo: '345-678-901-222',
      sss: 'Submitted', sssNo: '03-3456789-0',
      philhealth: 'Submitted', philhealthNo: '12-070605049-3',
      hdmf: 'Submitted', hdmfNo: '1212-5656-7878',
      nbi: 'Submitted', nbiNo: 'N345R765Q',
    },
    payrollProfile: {
      basicSalary: 28000,
      salaryType: 'Monthly',
      payrollFrequency: 'Semi-Monthly',
      taxStatus: 'S/ME',
      bankAccountNumber: '3456-7890-12',
      employmentStatus: 'Regular'
    },
  },
  {
    id: '0004',
    firstName: 'Paolo',
    middleName: 'Garcia',
    lastName: 'Mendoza',
    suffix: '',
    photo: null,
    designation: 'Admin Assistant',
    department: 'IT Support / Helpdesk',
    payrollLocation: 'APECC Main',
    employmentDate: '2021-06-14',
    status: 'Active',
    employmentType: 'Probationary',
    personal: {
      birthdate: '1995-09-28',
      birthplace: 'Manila',
      gender: 'Male',
      tenureship: '2 years',
      civilStatus: 'Single',
      religion: 'Born Again Christian',
      citizenship: 'Filipino',
      height: '5\'7"',
      weight: '68 kg',
      bloodType: 'AB+',
      presentAddress: '12 Zamora St., Brgy. Pantal, Dagupan City, Pangasinan',
      presentZipcode: '2400',
      permanentAddress: '12 Zamora St., Brgy. Pantal, Dagupan City, Pangasinan',
      permanentZipcode: '2400',
      contactNumbers: ['0945-012-3456'],
      emailAddresses: ['paolo.mendoza@apecc.coop', 'paolomendoza.dev@gmail.com'],
    },
    employmentDetails: {
      division: 'Information Technology (IT) Division',
      department: 'IT Support / Helpdesk',
      jobLevel: 'Level 1 - Probationary',
      dateHired: '2021-06-14',
      endDate: null,
      regularizationDate: '2021-12-14',
      workLocation: 'APECC Main',
      shift: 'Day',
      timeIn: '6:00:00 AM',
      timeOut: '9:00:00 PM',
      supervisor: 'Elena Villanueva',
    },
    family: {
      spouse: null,
      father: { name: 'Carlos Mendoza', birthdate: '1968-04-12', occupation: 'Electrician', contact: '0946-123-4567' },
      mother: { name: 'Teresa Garcia', birthdate: '1970-08-25', occupation: 'Teacher', contact: '0946-123-4567' },
      children: [],
    },
    education: [
      { level: 'College', school: 'TIP Manila', degree: 'BS Information Technology', areaOfStudy: 'Software Engineering', distinction: 'Best in Capstone', units: 'Completed', from: '2013-06', till: '2017-03' },
    ],
    workExperience: [
      { company: 'Accenture Philippines', position: 'Technical Support', salary: 'P28,000', from: '2017-08', to: '2021-05', reason: 'Relocation' },
    ],
    references: [
      { name: 'Engr. Ramon Santos', position: 'IT Manager, Accenture', addressCompany: 'Accenture Manila', contact: '0924-890-1234' },
    ],
    requirements: {
      tinId: 'Pending', tinNo: '456-789-012-333',
      sss: 'Pending', sssNo: '03-4567890-1',
      philhealth: 'Submitted', philhealthNo: '12-080706050-4',
      hdmf: 'Submitted', hdmfNo: '1212-6767-8989',
      nbi: 'Submitted', nbiNo: 'N456S654R',
    },
    payrollProfile: {
      basicSalary: 18000,
      salaryType: 'Monthly',
      payrollFrequency: 'Semi-Monthly',
      taxStatus: 'S/ME',
      bankAccountNumber: '4567-8901-23',
      employmentStatus: 'Probationary'
    },
  },
  {
    id: '0005',
    firstName: 'Lourdes',
    middleName: 'Aquino',
    lastName: 'Reyes',
    suffix: '',
    photo: null,
    designation: 'Bookkeeper',
    department: 'Finance',
    payrollLocation: 'APECC Main',
    employmentDate: '2017-02-01',
    status: 'Resigned/Exit',
    employmentType: 'Regular',
    personal: {
      birthdate: '1985-01-14',
      birthplace: 'Dagupan City',
      gender: 'Female',
      tenureship: '8 years',
      civilStatus: 'Widowed',
      religion: 'Roman Catholic',
      citizenship: 'Filipino',
      height: '5\'2"',
      weight: '52 kg',
      bloodType: 'O-',
      presentAddress: '210 Arellano St., Brgy. Tapuac, Dagupan City, Pangasinan',
      presentZipcode: '2400',
      permanentAddress: '210 Arellano St., Brgy. Tapuac, Dagupan City, Pangasinan',
      permanentZipcode: '2400',
      contactNumbers: ['0956-234-5678'],
      emailAddresses: ['lourdes.reyes@apecc.coop'],
    },
    employmentDetails: {
      division: 'Finance & Accounting Division',
      department: 'Finance',
      jobLevel: 'Level 2- upon regularization',
      dateHired: '2017-02-01',
      endDate: '2024-12-31',
      regularizationDate: '2017-08-01',
      workLocation: 'APECC Main',
      shift: 'Day',
      timeIn: '6:00:00 AM',
      timeOut: '9:00:00 PM',
      supervisor: 'Maria Dela Cruz',
    },
    family: {
      spouse: { 
        name: 'Antonio Reyes (Deceased)', 
        birthdate: '1982-01-10',
        address: '210 Arellano St., Brgy. Tapuac, Dagupan City, Pangasinan',
        businessAddress: 'N/A',
        occupation: 'N/A', 
        contact: 'N/A',
        numChildren: 2
      },
      father: { name: 'Fernando Aquino', birthdate: '1958-02-14', occupation: 'Retired', contact: '0957-345-6789' },
      mother: { name: 'Corazon Aquino', birthdate: '1960-11-20', occupation: 'Retired', contact: '0957-345-6789' },
      children: [
        { name: 'Angelica Reyes', birthdate: '2010-07-18', school: 'USLS Dagupan' },
        { name: 'Gabriel Reyes', birthdate: '2013-02-05', school: 'Dagupan Central School' },
      ],
    },
    education: [
      { level: 'College', school: 'Saint Louis University - Baguio', degree: 'BS Accountancy', areaOfStudy: 'Accounting', distinction: 'Magna Cum Laude', units: 'Completed', from: '2002-06', till: '2006-03' },
      { level: 'Post-Graduate', school: 'UP Diliman', degree: 'MBA', areaOfStudy: 'Business Administration', distinction: '', units: '18 Units', from: '2023-09', till: 'Present' },
    ],
    workExperience: [
      { company: 'SGV & Co.', position: 'Audit Associate', salary: 'P30,000', from: '2007-01', to: '2016-12', reason: 'Personal Reasons' },
    ],
    references: [
      { name: 'CPA Roberto Lim', position: 'Partner, SGV & Co.', addressCompany: 'SGV & Co. Makati', contact: '0925-901-2345' },
    ],
    requirements: {
      tinId: 'Submitted', tinNo: '567-890-123-444',
      sss: 'Submitted', sssNo: '03-5678901-2',
      philhealth: 'Pending', philhealthNo: '12-090807060-5',
      hdmf: 'Submitted', hdmfNo: '1212-7878-9090',
      nbi: 'Submitted', nbiNo: 'N567T543S',
    },
    payrollProfile: {
      basicSalary: 32000,
      salaryType: 'Monthly',
      payrollFrequency: 'Semi-Monthly',
      taxStatus: 'S/ME',
      bankAccountNumber: '5678-9012-34',
      employmentStatus: 'Deactivated'
    },
  },
  {
    id: '0006',
    firstName: 'Ma. Lyn Jee',
    middleName: 'Billones',
    lastName: 'Tupas',
    suffix: '',
    photo: null,
    designation: 'Asst. Gen Manager',
    department: 'Finance',
    payrollLocation: 'APECC Main',
    employmentDate: '2022-05-15',
    status: 'Active',
    employmentType: 'Regular',
    personal: {
      birthdate: '1985-08-12',
      birthplace: 'Pasig City',
      gender: 'Female',
      tenureship: '4 years',
      civilStatus: 'Married',
      religion: 'Roman Catholic',
      citizenship: 'Filipino',
      contactNumbers: ['0917-000-0000'],
      emailAddresses: ['lynjee.tupas@apecc.coop'],
    },
    payrollProfile: {
      basicSalary: 30000,
      salaryType: 'Monthly',
      payrollFrequency: 'Semi-Monthly',
      taxStatus: 'S/ME',
      bankAccountNumber: '1122-3344-55',
      employmentStatus: 'Regular'
    },
  },
];

// ===== Payroll Data (2018–2025) =====
const generatePayrollData = () => {
  const data = [];
  const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const baseRates = { 
    '0001': 35000, 
    '0002': 22000, 
    '0003': 28000, 
    '0004': 20000, 
    '0005': 32000,
    '0006': 30000 
  };

  Object.entries(baseRates).forEach(([empId, base]) => {
    for (let year = 2018; year <= 2026; year++) {
      for (let m = 0; m < 12; m++) {
        if (year === 2026 && m > 2) break; // up to March 2026
        const annualIncrease = (year - 2018) * 1500;
        const basePay = base + annualIncrease;
        
        // Detailed Deductions (EE)
        let sssEE = Math.min(basePay * 0.045, 1250);
        let phEE = 625;
        let hdmfEE = Math.min(basePay * 0.02, 200);
        let tax = Math.max((basePay - sssEE - phEE - hdmfEE - 20833.33) * 0.20, 314);
        
        // Detailed ER Contributions
        let sssER = basePay * 0.10;
        let phER = phEE;
        let hdmfER = hdmfEE;

        const deminimis = 2000;
        const nonTaxable = 0;
        const repairMaintenance = 0;
        const savings = empId === '0006' ? 2000 : 2000;
        const membership = 0;
        const otherDeduction = 0;
        const housingLoan = empId === '0006' ? 6667 : 0;
        const salaryLoan = 0;
        const stl = empId === '0006' ? 2070 : (empId === '0001' ? 8280 : 0);
        const malasakitLoan = 0;
        const educLoan = 0;
        const mcLoan = 0;

        // Specific overrides for Ma. Lyn Jee Tupas example
        if (empId === '0006') {
            sssER = 3303.00;
            phER = 750.00;
            hdmfER = 200.00;
            tax = 1008.00;
            sssEE = 1500.00;
            phEE = 750.00;
            hdmfEE = 200.00;
        }

        const statutoryRemittance = sssEE + phEE + hdmfEE + tax;
        const totalIncome = basePay + deminimis + repairMaintenance + nonTaxable;
        const totalDeduction = savings + membership + otherDeduction + housingLoan + salaryLoan + stl + malasakitLoan + educLoan + mcLoan + statutoryRemittance;
        const netPay = totalIncome - totalDeduction;

        data.push({
          id: `PAY-${year}-${String(m + 1).padStart(2, '0')}-${empId}`,
          employeeId: empId,
          year,
          month: months[m],
          monthIndex: m,
          basicPay: Math.round(basePay),
          deminimis: deminimis,
          repairMaintenance: repairMaintenance,
          nonTaxable: nonTaxable,
          totalIncome: Math.round(totalIncome),
          sssER: sssER,
          phER: phER,
          hdmfER: hdmfER,
          sssEE: sssEE,
          phEE: phEE,
          hdmfEE: hdmfEE,
          tax: tax,
          statutoryRemittance: statutoryRemittance,
          savings: savings,
          membership: membership,
          otherDeduction: otherDeduction,
          housingLoan: housingLoan,
          salaryLoan: salaryLoan,
          stl: stl,
          malasakitLoan: malasakitLoan,
          educLoan: educLoan,
          mcLoan: mcLoan,
          totalDeduction: Math.round(totalDeduction),
          netPay: Math.round(netPay),
          firstHalf: Math.round(netPay / 2),
          secondHalf: Math.round(netPay - Math.round(netPay / 2)),
          status: 'Paid',
          dateProcessed: `${year}-${String(m + 1).padStart(2, '0')}-25`,
        });
      }
    }
  });
  return data;
};

export const payrollRecords = generatePayrollData();

// ===== Leave Data =====
export const leaveTypes = ['Vacation Leave', 'Sick Leave', 'Emergency Leave', 'Maternity Leave', 'Paternity Leave', 'Solo Parent Leave'];

export const leaveRecords = [
  { id: 'LV-001', employeeId: '0001', type: 'Vacation Leave', startDate: '2025-01-06', endDate: '2025-01-10', days: 5, status: 'Approved', reason: 'Family vacation' },
  { id: 'LV-002', employeeId: '0002', type: 'Sick Leave', startDate: '2025-01-15', endDate: '2025-01-16', days: 2, status: 'Approved', reason: 'Medical check-up' },
  { id: 'LV-003', employeeId: '0003', type: 'Emergency Leave', startDate: '2025-02-03', endDate: '2025-02-03', days: 1, status: 'Approved', reason: 'Family emergency' },
  { id: 'LV-004', employeeId: '0004', type: 'Vacation Leave', startDate: '2025-02-14', endDate: '2025-02-14', days: 1, status: 'Pending', reason: "Valentine's Day" },
  { id: 'LV-005', employeeId: '0001', type: 'Sick Leave', startDate: '2025-02-20', endDate: '2025-02-21', days: 2, status: 'Approved', reason: 'Flu' },
  { id: 'LV-006', employeeId: '0006', type: 'Vacation Leave', startDate: '2026-01-12', endDate: '2026-01-14', days: 3, status: 'Approved', reason: 'Personal' },
  { id: 'LV-007', employeeId: '0001', type: 'Sick Leave', startDate: '2026-02-10', endDate: '2026-02-11', days: 2, status: 'Approved', reason: 'Cold' },
  { id: 'LV-008', employeeId: '0002', type: 'Vacation Leave', startDate: '2026-03-05', endDate: '2026-03-07', days: 3, status: 'Approved', reason: 'Seminar' },
  { id: 'LV-009', employeeId: '0003', type: 'Sick Leave', startDate: '2026-03-18', endDate: '2026-03-19', days: 2, status: 'Approved', reason: 'Fever' },
  { id: 'LV-010', employeeId: '0004', type: 'Emergency Leave', startDate: '2026-03-25', endDate: '2026-03-25', days: 1, status: 'Approved', reason: 'Family emergency' },
  { id: 'LV-011', employeeId: '0001', type: 'Vacation Leave', startDate: '2026-04-07', endDate: '2026-04-10', days: 4, status: 'Approved', reason: 'Holy Week' },
  { id: 'LV-012', employeeId: '0002', type: 'Emergency Leave', startDate: '2026-04-15', endDate: '2026-04-15', days: 1, status: 'Approved', reason: 'Bereavement' },
  { id: 'LV-013', employeeId: '0003', type: 'Vacation Leave', startDate: '2026-04-21', endDate: '2026-04-23', days: 3, status: 'Approved', reason: 'Summer vacation' },
  { id: 'LV-014', employeeId: '0004', type: 'Sick Leave', startDate: '2026-04-28', endDate: '2026-04-29', days: 2, status: 'Pending', reason: 'Dental procedure' },
  { id: 'LV-015', employeeId: '0005', type: 'Vacation Leave', startDate: '2026-04-14', endDate: '2026-04-17', days: 4, status: 'Approved', reason: 'Anniversary' },
  { id: 'LV-016', employeeId: '0006', type: 'Sick Leave', startDate: '2026-04-22', endDate: '2026-04-22', days: 1, status: 'Approved', reason: 'Check-up' },
  { id: 'LV-017', employeeId: '0001', type: 'Sick Leave', startDate: '2026-05-06', endDate: '2026-05-06', days: 1, status: 'Approved', reason: 'Annual check-up' },
  { id: 'LV-018', employeeId: '0002', type: 'Vacation Leave', startDate: '2026-05-18', endDate: '2026-05-20', days: 3, status: 'Approved', reason: 'Rest' },
  { id: 'LV-019', employeeId: '0003', type: 'Emergency Leave', startDate: '2026-05-25', endDate: '2026-05-25', days: 1, status: 'Approved', reason: 'Family emergency' },
];

export const leaveBalances = [
  { employeeId: '0001', type: 'Vacation Leave', total: 15, used: 5, remaining: 10 },
  { employeeId: '0001', type: 'Sick Leave', total: 15, used: 2, remaining: 13 },
  { employeeId: '0002', type: 'Vacation Leave', total: 12, used: 0, remaining: 12 },
  { employeeId: '0002', type: 'Sick Leave', total: 15, used: 2, remaining: 13 },
  { employeeId: '0003', type: 'Vacation Leave', total: 15, used: 0, remaining: 15 },
  { employeeId: '0003', type: 'Emergency Leave', total: 5, used: 1, remaining: 4 },
  { employeeId: '0004', type: 'Vacation Leave', total: 10, used: 0, remaining: 10 },
  { employeeId: '0004', type: 'Sick Leave', total: 15, used: 0, remaining: 15 },
];

export const sanctions = [
  { id: 'SN-001', employeeId: '0004', type: 'Written Warning', date: '2024-11-15', reason: 'Tardiness (3rd offense)', status: 'Active' },
  { id: 'SN-002', employeeId: '0002', type: 'Verbal Warning', date: '2024-09-20', reason: 'Incomplete documentation', status: 'Resolved' },
];

// ===== Exit Member Data =====
export const exitMembers = [
  {
    id: 'EXIT-001',
    memberId: 'MEM-2010-045',
    memberName: 'Roberto B. Castillo',
    dateExit: '2024-12-31',
    savings: 125000.00,
    voluntary: 50000.00,
    shareCapital: 75000.00,
    patronageRefund: 8500.00,
    savingsInterest: 3200.00,
    dividend: 6750.00,
    rebates: 1200.00,
    totalAmount: 269650.00,
    status: 'Processing',
    clearanceStatus: 'Pending',
    reason: 'Retirement',
  },
  {
    id: 'EXIT-002',
    memberId: 'MEM-2015-112',
    memberName: 'Carmela D. Aquino',
    dateExit: '2025-01-15',
    savings: 85000.00,
    voluntary: 30000.00,
    shareCapital: 50000.00,
    patronageRefund: 4200.00,
    savingsInterest: 1800.00,
    dividend: 4500.00,
    rebates: 750.00,
    totalAmount: 176250.00,
    status: 'Completed',
    clearanceStatus: 'Cleared',
    reason: 'Relocation',
  },
  {
    id: 'EXIT-003',
    memberId: 'MEM-2012-078',
    memberName: 'Ernesto P. Navarro',
    dateExit: '2025-02-01',
    savings: 210000.00,
    voluntary: 95000.00,
    shareCapital: 100000.00,
    patronageRefund: 12000.00,
    savingsInterest: 5400.00,
    dividend: 9000.00,
    rebates: 2100.00,
    totalAmount: 433500.00,
    status: 'Processing',
    clearanceStatus: 'Pending',
    reason: 'Voluntary Withdrawal',
  },
  {
    id: 'EXIT-004',
    memberId: 'MEM-2008-023',
    memberName: 'Salvacion R. Manalang',
    dateExit: '2025-02-15',
    savings: 180000.00,
    voluntary: 72000.00,
    shareCapital: 85000.00,
    patronageRefund: 9800.00,
    savingsInterest: 4100.00,
    dividend: 7650.00,
    rebates: 1550.00,
    totalAmount: 360100.00,
    status: 'Pending Review',
    clearanceStatus: 'In Progress',
    reason: 'Transfer to Another Cooperative',
  },
  {
    id: 'EXIT-005',
    memberId: 'MEM-2018-201',
    memberName: 'Dennis G. Tolentino',
    dateExit: '2025-02-28',
    savings: 45000.00,
    voluntary: 15000.00,
    shareCapital: 25000.00,
    patronageRefund: 2100.00,
    savingsInterest: 950.00,
    dividend: 2250.00,
    rebates: 400.00,
    totalAmount: 90700.00,
    status: 'Pending Review',
    clearanceStatus: 'Pending',
    reason: 'Personal Reasons',
  },
];

// ===== Department Stats =====
export const departmentStats = [
  { name: 'APECC', count: employees.length, color: '#023DFB' },
];

// ===== Tax Tables =====
export const taxContributions = {
  sss: { rate: 0.045, maxContribution: 1350, label: 'SSS' },
  philHealth: { rate: 0.025, maxContribution: 900, label: 'PhilHealth' },
  pagIbig: { rate: 0.02, maxContribution: 200, label: 'Pag-IBIG', cap: 10000 },
};

export const taxBrackets = [
  { min: 0, max: 20833.33, rate: 0, base: 0, annualMin: 0, annualMax: 250000 },
  { min: 20833.33, max: 33333.33, rate: 0.15, base: 0, annualMin: 250000, annualMax: 400000 },
  { min: 33333.33, max: 66666.67, rate: 0.20, base: 1875, annualMin: 400000, annualMax: 800000 },
  { min: 66666.67, max: 166666.67, rate: 0.25, base: 8541.67, annualMin: 800000, annualMax: 2000000 },
  { min: 166666.67, max: 666666.67, rate: 0.30, base: 33541.67, annualMin: 2000000, annualMax: 8000000 },
  { min: 666666.67, max: Infinity, rate: 0.35, base: 183541.67, annualMin: 8000000, annualMax: Infinity },
];

// ===== Applicant Tracking Data =====
export const applicants = [
  {
    id: 'APP-2026-00001',
    name: 'Juan Miguel S. Rivera',
    position: 'Loan Officer',
    dateApplied: '2025-03-01',
    status: 'For Initial Interview',
    email: 'jm.rivera@gmail.com',
    contact: '0917-888-1234',
    source: 'JobStreet',
    course: 'BS Business Administration',
    requirements: {
      items: {
        'PSA/Birth Certificate': true,
        'Government IDS (2) Copy': true,
        'NBI Clearance': false,
        'Police Clearance': false,
        'Barangay Clearance': true,
        'SSS Number': true,
        'PhilHealth Number': true,
        'Pagibig (HDMF)': true,
        'TIN Number': true,
        'College / Highschool Diploma': false,
        'Transcript of Records (TOR)': false,
        'Certificate of Graduates': false,
        'Marriage Certificate': false,
        'Solo Parent ID': false,
        'Resume': true,
        'Latest BIR Form 2316 if previously employed': false,
        'Medical': false,
        'Certificate of Employment': false,
      },
      dateSubmitted: '2025-03-05',
      status: 'Incomplete',
      onboardingDate: '',
      training1: false,
      training2: false
    },
    pipeline: [
      { step: 'Application Submitted', date: '2025-03-01', status: 'Completed' },
      { step: 'Under Review', date: '2025-03-02', status: 'Completed' },
      { step: 'For Initial Interview', date: '2025-03-05', status: 'Upcoming' },
    ]
  },
  {
    id: 'APP-2026-00002',
    name: 'Sarah Jane L. Gomez',
    position: 'IT Support Specialist',
    dateApplied: '2025-02-28',
    status: 'Onboarding',
    email: 'sarah.gomez@yahoo.com',
    contact: '0918-777-5678',
    source: 'LinkedIn',
    course: 'BS Information Technology',
    requirements: {
      items: {
        'PSA/Birth Certificate': true,
        'Government IDS (2) Copy': true,
        'NBI Clearance': true,
        'Police Clearance': true,
        'Barangay Clearance': true,
        'SSS Number': true,
        'PhilHealth Number': true,
        'Pagibig (HDMF)': true,
        'TIN Number': true,
        'College / Highschool Diploma': true,
        'Transcript of Records (TOR)': true,
        'Certificate of Graduates': true,
        'Marriage Certificate': false,
        'Solo Parent ID': false,
        'Resume': true,
        'Latest BIR Form 2316 if previously employed': true,
        'Medical': true,
        'Certificate of Employment': true,
      },
      dateSubmitted: '2025-03-10',
      status: 'Complete',
      onboardingDate: '2025-04-01',
      training1: true,
      training2: true
    },
    pipeline: [
      { step: 'Application Submitted', date: '2025-02-28', status: 'Completed' },
      { step: 'Under Review', date: '2025-03-01', status: 'Completed' },
      { step: 'For Initial Interview', date: '2025-03-03', status: 'Completed' },
      { step: 'Job Offer', date: '2025-03-05', status: 'Completed' },
      { step: 'Onboarding', date: '2025-03-10', status: 'Upcoming' },
    ]
  },
  {
    id: 'APP-2026-00003',
    name: 'Mark Anthony V. Reyes',
    position: 'HR Assistant',
    dateApplied: '2025-03-05',
    status: 'For Final Interview',
    email: 'mark.reyes@hotmail.com',
    contact: '0920-555-9012',
    source: 'Referral',
    course: 'BS Psychology',
    requirements: {
      items: {
        'PSA/Birth Certificate': false,
        'Government IDS (2) Copy': false,
        'NBI Clearance': false,
        'Police Clearance': false,
        'Barangay Clearance': false,
        'SSS Number': false,
        'PhilHealth Number': false,
        'Pagibig (HDMF)': false,
        'TIN Number': false,
        'College / Highschool Diploma': false,
        'Transcript of Records (TOR)': false,
        'Certificate of Graduates': false,
        'Marriage Certificate': false,
        'Solo Parent ID': false,
        'Resume': true,
        'Latest BIR Form 2316 if previously employed': false,
        'Medical': false,
        'Certificate of Employment': false,
      },
      dateSubmitted: '',
      status: 'Incomplete',
      onboardingDate: '',
      training1: false,
      training2: false
    },
    pipeline: [
      { step: 'Application Submitted', date: '2025-03-05', status: 'Completed' },
      { step: 'Under Review', date: '2025-03-06', status: 'Ongoing' },
      { step: 'For Final Interview', date: null, status: 'Upcoming' },
    ]
  },
  {
    id: 'APP-2026-00004',
    name: 'Catherine B. Ramos',
    position: 'Branch Manager',
    dateApplied: '2025-02-15',
    status: 'Cancelled Application',
    email: 'cathy.ramos@gmail.com',
    contact: '0921-444-3456',
    source: 'Apecc Website',
    pipeline: [
      { step: 'Application Submitted', date: '2025-02-15', status: 'Completed' },
      { step: 'Under Review', date: '2025-02-17', status: 'Completed' },
      { step: 'Cancelled Application', date: '2025-02-20', status: 'Completed' },
    ]
  },
  {
    id: 'APP-2025-005',
    name: 'Robert D. Smith',
    position: 'Accountant',
    dateApplied: '2025-03-12',
    status: 'Application Submitted',
    email: 'rsmith@gmail.com',
    contact: '0919-222-7890',
    source: 'Indeed',
    pipeline: [
      { step: 'Application Submitted', date: '2025-03-12', status: 'Ongoing' },
    ]
  }
];

// ===== Audit Trail Data =====
export const hrAuditLogs = [
  {
    id: 'HRAUD-001',
    user: 'Admin User',
    action: 'Add Employee',
    details: 'Added new employee Profile for E0006 - Juan Dela Cruz',
    date: '2025-03-12 09:15:22',
    module: 'Employee Management',
  },
  {
    id: 'HRAUD-002',
    user: 'Admin User',
    action: 'Update Payroll',
    details: 'Processed Payroll for February 2025',
    date: '2025-03-10 14:30:00',
    module: 'Payroll & Compensation',
  },
  {
    id: 'HRAUD-003',
    user: 'HR Manager',
    action: 'Approve Leave',
    details: 'Approved Vacation Leave for E0001 (LV-001)',
    date: '2025-03-05 11:20:45',
    module: 'Leaves & Sanctions',
  },
  {
    id: 'HRAUD-004',
    user: 'Admin User',
    action: 'Status Change',
    details: 'Changed status of E0005 to Deactivated',
    date: '2025-02-28 16:45:10',
    module: 'Employee Management',
  },
  {
    id: 'HRAUD-005',
    user: 'HR Assistant',
    action: 'Update ATS',
    details: 'Moved APP-2025-002 to Approved for Onboarding',
    date: '2025-02-25 10:05:33',
    module: 'Applicant Tracking',
  }
];

export const exitAuditLogs = [
  {
    id: 'EXAUD-001',
    user: 'Admin User',
    action: 'Clearance Approved',
    details: 'Approved Clearance for Carmela D. Aquino (EXIT-002)',
    date: '2025-03-11 15:45:12',
    module: 'Clearance Generation',
  },
  {
    id: 'EXAUD-002',
    user: 'Admin User',
    action: 'Generate SOA',
    details: 'Generated Statement of Account for Roberto B. Castillo (EXIT-001)',
    date: '2025-03-08 09:30:00',
    module: 'Statement of Account',
  },
  {
    id: 'EXAUD-003',
    user: 'Exit Coordinator',
    action: 'Initiate Withdrawal',
    details: 'Initiated Withdrawal Process for Ernesto P. Navarro (EXIT-003)',
    date: '2025-03-01 11:15:44',
    module: 'Withdrawal of Membership',
  },
  {
    id: 'EXAUD-004',
    user: 'Admin User',
    action: 'Update Status',
    details: 'Updated status of EXIT-004 to Pending Review',
    date: '2025-02-20 14:20:05',
    module: 'Exit Dashboard',
  }
];

export const exitRequestSteps = [
  'Exit Request',
  'HR Review & Approval',
  'Clearance Process',
  'Exit Interview',
  'Final Settlement',
  'Final Approval'
];

export const exitRequests = [
  {
    id: 'ER-2025-001',
    name: 'Roberto B. Castillo',
    memberId: 'MEM-2010-045',
    roleType: 'Member & Employee',
    exitType: 'Retirement',
    dateFiled: '2025-02-15',
    effectiveDate: '2025-03-31',
    status: 'Clearance Process',
    remarks: 'Standard retirement package processing.',
    pipeline: [
      { step: 'Exit Request', date: '2025-02-15', status: 'Completed' },
      { step: 'HR Review & Approval', date: '2025-02-18', status: 'Completed' },
      { step: 'Clearance Process', date: '2025-02-20', status: 'Ongoing' },
      { step: 'Exit Interview', date: null, status: 'Upcoming' },
      { step: 'Final Settlement', date: null, status: 'Upcoming' },
      { step: 'Final Approval', date: null, status: 'Upcoming' }
    ]
  },
  {
    id: 'ER-2025-002',
    name: 'Carmela D. Aquino',
    memberId: 'MEM-2015-112',
    roleType: 'Member',
    exitType: 'Relocation',
    dateFiled: '2025-01-10',
    effectiveDate: '2025-01-31',
    status: 'Final Approval',
    remarks: 'Moving to Visayas. All settlements cleared.',
    pipeline: [
      { step: 'Exit Request', date: '2025-01-10', status: 'Completed' },
      { step: 'HR Review & Approval', date: '2025-01-12', status: 'Completed' },
      { step: 'Clearance Process', date: '2025-01-15', status: 'Completed' },
      { step: 'Exit Interview', date: '2025-01-16', status: 'Completed' },
      { step: 'Final Settlement', date: '2025-01-25', status: 'Completed' },
      { step: 'Final Approval', date: '2025-01-28', status: 'Completed' }
    ]
  },
  {
    id: 'ER-2025-003',
    name: 'Ernesto P. Navarro',
    memberId: 'MEM-2012-078',
    roleType: 'Employee',
    exitType: 'Resignation',
    dateFiled: '2025-03-01',
    effectiveDate: '2025-03-30',
    status: 'HR Review & Approval',
    remarks: '30-day notice rendered.',
    pipeline: [
      { step: 'Exit Request', date: '2025-03-01', status: 'Completed' },
      { step: 'HR Review & Approval', date: '2025-03-03', status: 'Ongoing' },
      { step: 'Clearance Process', date: null, status: 'Upcoming' },
      { step: 'Exit Interview', date: null, status: 'Upcoming' },
      { step: 'Final Settlement', date: null, status: 'Upcoming' },
      { step: 'Final Approval', date: null, status: 'Upcoming' }
    ]
  }
];

// ===== New Payroll Modules Data =====

export const payrollPeriods = [
  { id: 'PP-2025-001', startDate: '2025-02-26', endDate: '2025-03-10', type: '1st Cutoff', status: 'Processing' },
  { id: 'PP-2025-002', startDate: '2025-03-11', endDate: '2025-03-25', type: '2nd Cutoff', status: 'Open' },
  { id: 'PP-2025-003', startDate: '2025-02-11', endDate: '2025-02-25', type: '2nd Cutoff', status: 'Closed' },
];

export const attendanceRecords = [
  { employeeId: '0001', periodId: 'PP-2025-001', daysWorked: 11, absences: 0, late: 0, undertime: 0, otHours: 4, holidayWork: 0 },
  { employeeId: '0002', periodId: 'PP-2025-001', daysWorked: 10, absences: 1, late: 2, undertime: 1, otHours: 0, holidayWork: 0 },
  { employeeId: '0003', periodId: 'PP-2025-001', daysWorked: 11, absences: 0, late: 0, undertime: 0, otHours: 8, holidayWork: 1 },
];

export const allowances = [
  { id: 'ALW-001', name: 'Transportation Allowance', type: 'Fixed', amount: 2000 },
  { id: 'ALW-002', name: 'Meal Allowance', type: 'Fixed', amount: 1500 },
  { id: 'ALW-003', name: 'Communication Allowance', type: 'Fixed', amount: 1000 },
];

export const payrollAdjustments = [
  { id: 'ADJ-001', employeeId: '0001', type: 'Salary Adjustment', amount: 5000, reason: 'Retroactive increase', status: 'Approved' },
  { id: 'ADJ-002', employeeId: '0002', type: 'Deduction Adjustment', amount: -200, reason: 'Late correction', status: 'Pending' },
];

export const specialEarningTypes = [
  { id: 'SET-001', name: '13th Month Pay', includedInCap: true },
  { id: 'SET-002', name: '14th Month Pay', includedInCap: true },
  { id: 'SET-003', name: 'Performance Bonus', includedInCap: true },
  { id: 'SET-004', name: 'Christmas Bonus', includedInCap: true },
  { id: 'SET-005', name: 'De Minimis Benefits', includedInCap: false },
];

export const specialEarnings = [
  { id: 1, employeeId: '0001', periodId: 'PP-2025-001', typeId: 'SET-001', amount: 15000, createdAt: '2025-03-01T10:00:00Z' },
  { id: 2, employeeId: '0002', periodId: 'PP-2025-001', typeId: 'SET-001', amount: 12000, createdAt: '2025-03-01T10:00:00Z' },
  { id: 3, employeeId: '0003', periodId: 'PP-2025-001', typeId: 'SET-001', amount: 18000, createdAt: '2025-03-01T10:00:00Z' },
  { id: 4, employeeId: '0001', periodId: 'PP-2025-001', typeId: 'SET-003', amount: 5000, createdAt: '2025-03-10T10:00:00Z' },
];


// ===== Staff Clearance Module Data =====
export const staffClearanceRecords = [
  {
    id: 'CLR-2025-0016',
    employeeId: '0005', // Lourdes Reyes
    dateExit: '2025-04-17',
    reason: 'Resignation',
    cellNo: '0956-234-5678',
    status: 'Pending',
    sections: {
      hr: {
        officer: 'KYZEEL M. ESTRELLA',
        date: '2025-04-20',
        items: [
          { code: 'A', label: 'Resignation Letter', status: 'yes', remarks: 'submit dated march 17,2025' },
          { code: 'B', label: 'Clearance', status: 'yes', remarks: 'on process' },
          { code: 'C', label: 'Employee ID', status: 'yes', remarks: 'returned' },
          { code: 'D', label: 'Final payroll', status: 'yes', remarks: '' },
          { code: 'E', label: 'Exit Interview', status: 'yes', remarks: '' },
          { code: 'F', label: 'Will recommend for Certificate of Employment', status: 'yes', remarks: '' },
          { code: 'G', label: 'Others', status: 'no', remarks: '' },
        ]
      },
      it: {
        officer: 'De la Cruz Juan',
        date: '2025-04-20',
        items: [
          { code: 'B', label: 'Smart Plan (no. 09209432004 unit: Oppo A18)', status: 'yes', remarks: 'since the cp not registered under the name of Ms Dela pena, she continued the' },
          { code: 'C', label: 'Laptop', status: 'yes', remarks: '' },
          { code: 'D', label: 'PC, Printer', status: 'yes', remarks: 'yes. Endorsed to Mr. Cabogon' },
          { code: 'F', label: 'Email accounts', status: 'yes', remarks: 'yes. Endorsed to Mr. Cabogon/change password already' },
          { code: 'G', label: 'system access', status: 'yes', remarks: 'no longer access' },
          { code: 'H', label: 'Others', status: 'no', remarks: '' },
        ]
      },
      unitHead: {
        officer: 'De la Cruz Juan',
        date: '2025-04-20',
        items: [
          { label: 'Work- related documents and files', status: 'yes', remarks: '' },
          { label: '(Soft copy and hard copies of docs are secured)', status: 'yes', remarks: 'yes. Endorsed to Mr. Cabogon' },
          { label: '(Pending work)', status: 'no', remarks: 'there is not enough time for the transition' },
          { label: '(transition/transferring of knowledge, responsibilities and task)', status: 'no', remarks: 'there is not enough time for the transition, no replacement staff yet' },
          { label: 'Others', status: 'no', remarks: '' },
        ]
      },
      admin: {
        officer: 'De la Cruz Juan',
        date: '2025-04-20',
        items: [
          { code: 'A', label: 'Keys (drawer/locker,gate,coop car etc)', status: 'yes', remarks: 'locker key yes. Endorsed to Mr. Cabogon' },
          { code: 'B', label: 'Office supplies', status: 'yes', remarks: '' },
          { code: '1', label: 'Calculator', status: 'yes', remarks: 'yes. Endorsed to Mr. Cabogon' },
          { code: '2', label: 'Stapler', status: 'yes', remarks: 'yes. Endorsed to Mr. Cabogon' },
          { code: '3', label: 'Stamp and stamp pad', status: 'yes', remarks: 'yes. Endorsed to Mr. Cabogon' },
          { code: '4', label: 'Puncher', status: 'no', remarks: 'yes. Endorsed to Mr. Cabogon' },
          { code: '5', label: 'Others', status: 'no', remarks: '' },
        ]
      },
      finance: {
        officer: 'De la Cruz Juan',
        date: '2025-04-20',
        items: [
          { label: 'Liabilities', status: '', remarks: '' },
          { code: '1', label: 'Cash Advance', status: 'yes', remarks: 'SALARY DEDUCTION' },
          { code: '2', label: 'Salary Loan', status: 'no', remarks: 'PAYMENT UPON SETTLEMENT' },
          { code: '3', label: 'Housing Loan', status: 'no', remarks: '' },
          { code: '4', label: 'Short Term Loan', status: 'yes', remarks: 'PAYMENT THRU BANK TRANSFER' },
          { code: '5', label: 'Motorcycle Loan/Carloan', status: 'no', remarks: '' },
          { code: '6', label: '(gadget, education loan)', status: 'no', remarks: '' },
          { code: '7', label: 'Misappropriation, etc. - with attachement', status: 'no', remarks: '' },
          { code: '8', label: 'Others', status: 'no', remarks: '' },
        ]
      }
    },
    acknowledgement: 'JUAN DELA CRUZ',
    approval: {
      unitHead: { name: '', date: '' },
      hrOfficer: { name: '', date: '' },
      cashier: { name: '', date: '' },
      hrUnitHead: { name: '', date: '' },
      financeHead: { name: '', date: '' },
      adminHead: { name: '', date: '' },
      generalManager: { status: 'PENDING', remarks: '' },
    }
  }
];

export const exitRecords = [
  {
    no: 1,
    idNo: 'E0011',
    dateExit: '2026-02-01',
    name: 'TUPAS, MA. LYN JEE',
    designation: 'Asst. Gen Manager',
    savings: 16045,
    voluntarySavings: 196910,
    shareCapital: 23000,
    patronageRefund: 1091,
    savingsWithInterest: 13718,
    dividend: 1236,
    rebates: 25000,
    total: 260955,
    stlLoan: 10350,
    salaryLoan: 0,
    motorcycleLoan: 0,
    housingLoan: 213332,
    carLoan: 0,
    educationalLoan: 0,
    gadgetLoan: 0,
    malasakitLoan: 0,
    grandTotal: 37273,
    branchCode: 'CO',
    branchName: 'CENTRAL OFFICE',
    reason: 'RESIGNATION',
    variance: -12273,
    clearance: 37273,
    system: 25000,
    rebates2: 25000, // Rabates
    employeeType: 'Regular'
  },
  {
    no: 2,
    idNo: '0005',
    dateExit: '2025-12-15',
    name: 'REYES, LOURDES A.',
    designation: 'Bookkeeper',
    savings: 25000,
    voluntarySavings: 45000,
    shareCapital: 15000,
    patronageRefund: 500,
    savingsWithInterest: 2000,
    dividend: 800,
    rebates: 5000,
    total: 93300,
    stlLoan: 5000,
    salaryLoan: 10000,
    motorcycleLoan: 0,
    housingLoan: 0,
    carLoan: 0,
    educationalLoan: 0,
    gadgetLoan: 0,
    malasakitLoan: 0,
    grandTotal: 78300,
    branchCode: 'MAN',
    branchName: 'APECC MAIN',
    reason: 'RESIGNATION',
    variance: 0,
    clearance: 78300,
    system: 5000,
    rebates2: 5000,
    employeeType: 'Probationary'
  }
];

// ===== Onboarding Data =====
export const onboardingRecords = [];
