import axios from "axios";
import { getToken } from "../utils/token";

function normalizeBaseURL(raw?: string) {
  if (!raw) return "/api";
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
