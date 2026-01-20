// Axios API client with base URL configuration
import axios from "axios";
import { getToken } from "./storage";

// Get base URL from runtime config (window.__ENV__) or build-time env var, or use default
// Runtime config takes precedence (set by server-web.js from Cloud Run env vars)
// Get base URL from runtime config (window.__ENV__) or build-time env var
let baseURL =
  (typeof window !== "undefined" && window.__ENV__?.API_URL) ||
  import.meta.env.VITE_API_URL;

// Debug: Log the initial source for troubleshooting
if (import.meta.env.DEV || (typeof window !== "undefined" && window.__ENV__?.API_URL)) {
  const source =
    typeof window !== "undefined" && window.__ENV__?.API_URL
      ? "runtime (window.__ENV__)"
      : import.meta.env.VITE_API_URL
        ? "build-time (VITE_API_URL)"
        : "none (defaulting)";
  console.log(`[API Client] Source: ${source}, Value: ${baseURL || 'not set'}`);
}

// Fallback logic and formatting
if (baseURL && baseURL !== "") {
  baseURL = baseURL.trim();
  // Remove trailing slash if present
  baseURL = baseURL.replace(/\/+$/, "");
  // Ensure baseURL is an absolute URL with protocol
  if (!baseURL.startsWith("http://") && !baseURL.startsWith("https://")) {
    baseURL = `https://${baseURL}`; // Prefer HTTPS for production
  }
} else {
  // Final fallback to localhost only if absolutely nothing else is set
  // This is where the ERR_CONNECTION_REFUSED usually comes from in production
  baseURL = "http://127.0.0.1:3000";
  console.warn("[API Client] No API_URL found in environment! Defaulting to localhost:3000");
}

const apiClient = axios.create({
  baseURL: baseURL,
});

// Request interceptor - set Content-Type for JSON requests and add Authorization token
apiClient.interceptors.request.use(
  (config) => {
    // Only set Content-Type if it's not FormData
    if (!(config.data instanceof FormData) && !config.headers["Content-Type"]) {
      config.headers["Content-Type"] = "application/json";
    }

    // Add Authorization token if available
    const token = getToken();
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      // Server responded with error status
      const errorMessage = error.response.data?.error || error.message;
      return Promise.reject(new Error(errorMessage));
    } else if (error.request) {
      // Request made but no response received
      return Promise.reject(
        new Error("Network error. Please check your connection.")
      );
    } else {
      // Something else happened
      return Promise.reject(error);
    }
  }
);

export async function apiGet(url) {
  const response = await apiClient.get(url);
  const data = response.data;
  if (data.error) {
    throw new Error(data.error);
  }
  return data;
}

export async function apiPost(url, body, isFormData = false) {
  // For FormData, axios will automatically set Content-Type with boundary
  // The interceptor will handle not setting Content-Type for FormData
  const response = await apiClient.post(url, body);
  const data = response.data;
  if (data.error) {
    throw new Error(data.error);
  }
  return data;
}

export async function apiDelete(url) {
  const response = await apiClient.delete(url);
  const data = response.data;
  if (data.error) {
    throw new Error(data.error);
  }
  return data;
}

// Export the axios instance for direct use if needed
export default apiClient;
