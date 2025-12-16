// Axios API client with base URL configuration
import axios from "axios";

// Get base URL from environment variable or use default
let baseURL = import.meta.env.VITE_API_URL || "http://127.0.0.1:3000";

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

// Debug: Log the baseURL in development
if (import.meta.env.DEV) {
  console.log("API Base URL:", baseURL);
}

const apiClient = axios.create({
  baseURL: baseURL,
});

// Request interceptor - set Content-Type for JSON requests
apiClient.interceptors.request.use(
  (config) => {
    // Only set Content-Type if it's not FormData
    if (!(config.data instanceof FormData) && !config.headers["Content-Type"]) {
      config.headers["Content-Type"] = "application/json";
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
