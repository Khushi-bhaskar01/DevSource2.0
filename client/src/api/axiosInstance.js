import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:4000";

const api = axios.create({ baseURL, withCredentials: true });

// Helper to set/remove default Authorization header from AuthContext
export function setAuthHeader(token) {
  api.defaults.headers = api.defaults.headers || {};
  api.defaults.headers.common = api.defaults.headers.common || {};
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
}

export default api;
