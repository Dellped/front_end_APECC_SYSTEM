// Axios API client with base URL configuration
import axios from "axios";
import { getToken } from "./storage";

// Get base URL from runtime config (window.__ENV__) or build-time env var, or use default
// Runtime config takes precedence (set by server-web.js from Cloud Run env vars)
let baseURL =
  (typeof window !== "undefined" && window.__ENV__?.API_URL) ||
  import.meta.env.VITE_API_URL ||
  "http://127.0.0.1:3000";

// Ensure baseURL is properly formatted
if (baseURL) {
  baseURL = baseURL.trim();
  // Remove trailing slash if present
  baseURL = baseURL.replace(/\/+$/, "");
  // Ensure baseURL is an absolute URL with protocol
  if (!baseURL.startsWith("http://") && !baseURL.startsWith("https://")) {
    baseURL = `http://${baseURL}`;
  }
} else {
  baseURL = "http://127.0.0.1:3000";
}

// Debug: Log the baseURL and its source
if (import.meta.env.DEV) {
  const source =
    typeof window !== "undefined" && window.__ENV__?.API_URL
      ? "runtime (window.__ENV__)"
      : import.meta.env.VITE_API_URL
      ? "build-time (VITE_API_URL)"
      : "default";
  console.log("API Base URL:", baseURL, `[from ${source}]`);
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
      const attemptedUrl = error.config?.url 
        ? `${error.config.baseURL || ''}${error.config.url}`
        : 'unknown URL';
      
      // Check for common error codes
      let detailedError = `Network error: Unable to reach the API server.`;
      
      if (error.code === 'ERR_NETWORK' || error.message?.includes('Network Error')) {
        detailedError += `\n\nAttempted URL: ${attemptedUrl}`;
        detailedError += `\n\nPossible causes:`;
        detailedError += `\n1. Backend server is not running or unreachable`;
        detailedError += `\n2. CORS policy is blocking the request`;
        detailedError += `\n3. API_URL environment variable is not set correctly`;
        detailedError += `\n\nCheck the browser console for more details.`;
      } else {
        detailedError += `\nAttempted URL: ${attemptedUrl}`;
        detailedError += `\nError: ${error.message || 'Unknown network error'}`;
      }
      
      console.error('[API Client] Network Error:', {
        url: attemptedUrl,
        baseURL: error.config?.baseURL,
        method: error.config?.method,
        error: error.message,
        code: error.code
      });
      
      return Promise.reject(new Error(detailedError));
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
