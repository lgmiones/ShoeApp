import { toast } from "react-toastify";

const opts = { position: "top-right", autoClose: 1500 };

export const success = (msg) => toast.success(msg, opts);

export const info = (msg) => toast.info(msg, opts);

export const warn = (msg) => toast.warn(msg, opts);

// it is used in CartPage.jsx and OrdersPage.jsx to show success messages after actions like placing an order or deleting an item.
// These functions standardize how notifications are displayed across the app, ensuring a consistent user experience.
