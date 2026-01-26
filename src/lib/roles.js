// Role constants and permission helpers

export const ROLES = {
  SUPER_ADMIN: "SUPER_ADMIN",
  ADMIN: "ADMIN",
  BM: "BM",
  AA: "AA",
  RA: "RA",
  AVP: "AVP",
  SVP: "SVP",
  CFOO: "CFOO",
  COO: "COO",
  CHIEF: "CHIEF",
  IM: "IM",
};

export const ROLE_DISPLAY_MAP = {
  SUPER_ADMIN: "SUPER ADMIN",
  ADMIN: "ADMIN",
  BM: "BM",
  AA: "AA",
  RA: "RA",
  AVP: "AVP",
  SVP: "SVP/VP",
  CFOO: "CFOO",
  COO: "COO",
  CHIEF: "CHIEF",
  IM: "IM",
  ITR: "ITR",
};

// Sidebar visibility rules (matching main.html logic)
export const canAccessUserManagement = (role) => {
  return [ROLES.SUPER_ADMIN, ROLES.RA].includes(role);
};

export function canAccessUpload(role) {
  return true;
}

export function canAccessValidate(role) {
  return true;
}

export function canAccessGenerate(role) {
  return true;
}

export function canAccessSummary(role) {
  return role !== ROLES.BM && role !== ROLES.CHIEF && role !== ROLES.ADMIN;
}


export function canAccessArchive(role) {
  return role === ROLES.ADMIN || role === ROLES.SUPER_ADMIN;
}

export function canAccessCorporate(role) {
  // COO, ADMIN, CHIEF, SUPER_ADMIN can access corporate
  return role === ROLES.COO || role === ROLES.ADMIN || role === ROLES.CHIEF || role === ROLES.SUPER_ADMIN;
}

export function canAccessValSummary(role) {
  return role !== ROLES.BM;
}


// Get default route for a role
export function getDefaultRouteForRole(role) {
  return "/upload";
}

// Role header mapping for summary tables
export const ROLE_HEADER_MAP = {
  SUPER_ADMIN: "Department",
  ADMIN: "Department",
  ITR: "Department",
  IM: "Department",
  COO: "Department",
  CFOO: "Department",
  SVP: "Division",
  AVP: "Region",
  RA: "Area",
  AA: "Branch",
  BM: "Branch",
};

// Restricted roles for export in summary page
export const EXPORT_RESTRICTED_ROLES = ["RA", "AA", "BM"];
