import { toast } from "react-toastify";
const opts = { position: "top-right", autoClose: 2500 };
export const success = (msg) => toast.success(msg, opts);
export const info = (msg) => toast.info(msg, opts);
export const warn = (msg) => toast.warn(msg, opts);
