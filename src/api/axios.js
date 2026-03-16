import axios from "axios";
import { resetAuthSession } from "../features/auth/actions";
import { getStoredAuthToken } from "../features/auth/storage";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // http://127.0.0.1:8000/api
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

// ── Request interceptor: attach Sanctum token ─────────────────────
api.interceptors.request.use((config) => {
  const token = getStoredAuthToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ── Response interceptor: handle auth errors ──────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 403) {
      // Email not verified – send to the verification notice page.
      window.location.replace("/verify-email");
    } else if ((status === 401 || status === 419) && getStoredAuthToken()) {
      // Token expired or invalid (only act when we HAD a token).
      // If there's no token, the 401 is from a public endpoint — let it pass.
      resetAuthSession();
      if (window.location.pathname !== "/login") {
        window.location.replace("/login");
      }
    }

    return Promise.reject(error);
  }
);

export default api;

