import axios from "axios";
import { ADMIN_TOKEN_KEY, clearAdminAuth } from "../admin/utils/auth";

const ADMIN_API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const adminApi = axios.create({
  baseURL: ADMIN_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

adminApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(ADMIN_TOKEN_KEY);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

adminApi.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;

    if (status === 401) {
      clearAdminAuth();

      if (!window.location.pathname.includes("/admin/login")) {
        window.location.href = "/admin/login";
      }
    }

    return Promise.reject(error);
  }
);

export default adminApi;