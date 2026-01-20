import axios from "axios";
import { getToken } from "../utils/token";

function normalizeBaseURL(raw?: string) {
  // In production (behind nginx), always use relative URLs
  // This ensures requests go through nginx proxy to backend
  if (import.meta.env.PROD) {
    return "/api";
  }
  
  // In development, use provided URL or default to localhost
  if (!raw) return "http://localhost:5000/api";
  const trimmed = raw.replace(/\/+$/, "");
  if (trimmed.endsWith("/api")) return trimmed;
  return `${trimmed}/api`;
}

const api = axios.create({
  baseURL: normalizeBaseURL(import.meta.env.VITE_API_BASE_URL),
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
