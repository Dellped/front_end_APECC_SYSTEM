// sessionStorage wrapper for user session data

export const SESSION_KEYS = {
  EMAIL: "email",
  USER_ID: "userId",
  NAME: "name",
  ROLE: "role",
  ENTITY_NAME: "entityName",
  EMPLOYEE_COUNT: "employeeCount",
  BRANCH_NO: "branchNo",
  BRANCH: "branch",
  TOKEN: "token",
  AREA_ID: "area_id",
  AREA_NAME: "area_name",
  REGION_NAME: "region_name",
  DIVISION: "division",
  OPERATION_NAME: "operation_name",
  REGION_ID: "region_id",
  DIVISION_ID: "division_id",
  OPERATION_ID: "operation_id",
  CFO_ID: "cfo_id",
  CFO_NAME: "cfo_name",
  COO_ID: "coo_id",
  COO_NAME: "coo_name",
  CHIEF_NAME: "chief_name",
  CHIEF_ID: "chief_id",
  DEP_ID: "dep_id",
  DEP_NAME: "dep_name",
};

export function getSession(key) {
  return sessionStorage.getItem(key) || "";
}

export function setSession(key, value) {
  sessionStorage.setItem(key, value || "");
}

export function clearSession() {
  sessionStorage.clear();
}

export function getRole() {
  return getSession(SESSION_KEYS.ROLE);
}

export function getUserId() {
  return getSession(SESSION_KEYS.USER_ID);
}

export function isLoggedIn() {
  return !!getSession(SESSION_KEYS.TOKEN);
}

// Store all login response data into sessionStorage
export function storeLoginData(data) {
  setSession(SESSION_KEYS.EMAIL, data.email);
  setSession(SESSION_KEYS.USER_ID, data.userId);
  setSession(SESSION_KEYS.NAME, data.name);
  setSession(SESSION_KEYS.ROLE, data.role);
  setSession(SESSION_KEYS.ENTITY_NAME, data.entityName);
  setSession(SESSION_KEYS.EMPLOYEE_COUNT, data.employeeCount);
  setSession(SESSION_KEYS.BRANCH_NO, data.branchNo);
  setSession(SESSION_KEYS.BRANCH, data.branch || "Unknown");
  setSession(SESSION_KEYS.TOKEN, data.token);
  setSession(SESSION_KEYS.AREA_ID, data.area_id);
  setSession(SESSION_KEYS.AREA_NAME, data.area_name);
  setSession(SESSION_KEYS.REGION_NAME, data.region_name);
  setSession(SESSION_KEYS.DIVISION, data.division);
  setSession(SESSION_KEYS.OPERATION_NAME, data.operation_name);
  setSession(SESSION_KEYS.REGION_ID, data.region_id);
  setSession(SESSION_KEYS.DIVISION_ID, data.division_id);
  setSession(SESSION_KEYS.OPERATION_ID, data.operation_id);
  setSession(SESSION_KEYS.CFO_ID, data.cfo_id);
  setSession(SESSION_KEYS.CFO_NAME, data.cfo_name);
  setSession(SESSION_KEYS.COO_ID, data.coo_id);
  setSession(SESSION_KEYS.COO_NAME, data.coo_name);
  setSession(SESSION_KEYS.CHIEF_NAME, data.chief_name);
  setSession(SESSION_KEYS.CHIEF_ID, data.chief_id);
  setSession(SESSION_KEYS.DEP_ID, data.dep_id);
  setSession(SESSION_KEYS.DEP_NAME, data.dep_name);
}
