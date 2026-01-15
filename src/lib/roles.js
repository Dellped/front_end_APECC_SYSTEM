// Role constants and permission helpers

export const ROLES = {
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
  ITR: "ITR",
};

// Sidebar visibility rules (matching main.html logic)
export const canAccessUserManagement = (role) => {
  return [ROLES.ADMIN, ROLES.RA].includes(role);
};

export function canAccessUpload(role) {
  return role !== ROLES.CHIEF;
}

export function canAccessValidate(role) {
  return role !== ROLES.CHIEF;
}

export function canAccessGenerate(role) {
  return role !== ROLES.CHIEF;
}

export function canAccessSummary(role) {
  return role !== ROLES.BM && role !== ROLES.CHIEF;
}

export function canAccessArchive(role) {
  return role === ROLES.ADMIN;
}

export function canAccessCorporate(role) {
  // COO, ADMIN, CHIEF can access corporate
  return role === ROLES.COO || role === ROLES.ADMIN || role === ROLES.CHIEF;
}

export function canAccessValSummary(role) {
  return true;
}


// Get default route for a role
export function getDefaultRouteForRole(role) {
  if (role === ROLES.CHIEF) {
    return "/corporate";
  }
  return "/upload";
}

// Role header mapping for summary tables
export const ROLE_HEADER_MAP = {
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
