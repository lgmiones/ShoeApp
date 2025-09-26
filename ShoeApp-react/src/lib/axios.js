import Axios from "axios";
import { toast } from "react-toastify";

const api = Axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api`,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const message =
      err?.response?.data?.message || err?.message || "Unexpected error";
    toast.error(message);
    return Promise.reject(err);
  }
);

export default api;
