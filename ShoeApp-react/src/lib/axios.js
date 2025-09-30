import Axios from "axios";
import { toast } from "react-toastify";

const api = Axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api`,
  headers: { "Content-Type": "application/json" },
});

// 👉 Attach token on every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// 👉 Centralized error -> toast; auto sign-out on 401/403
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err?.response?.status;
    const message =
      err?.response?.data?.message ||
      err?.response?.data?.title || // ASP.NET problem details fallback
      err?.message ||
      "Unexpected error";

    if (status === 401 || status === 403) {
      toast.error("Your session expired. Please sign in again.");
      localStorage.removeItem("token");
      localStorage.removeItem("roles");
      localStorage.removeItem("email");
      // optional: redirect if not already on /login
      if (!location.pathname.startsWith("/login")) {
        location.href = "/login";
      }
    } else {
      toast.error(message);
    }
    return Promise.reject(err);
  }
);

export default api;
