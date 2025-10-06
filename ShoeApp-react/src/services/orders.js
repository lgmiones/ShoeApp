// src/services/orders.js
import api from "../lib/axios";
// ✅ Import the configured Axios instance to handle HTTP requests to your backend API.

/**
 * 🧾 mapOrderItem() - Helper function to normalize each item inside an order.
 * This function ensures that both backend (PascalCase) and frontend (camelCase) properties
 * are mapped consistently to a single format used by your React components.
 */
const mapOrderItem = (it) => ({
  shoeId: it.ShoeId ?? it.shoeId, // ID of the shoe in the order
  quantity: it.Quantity ?? it.quantity, // Number of pairs ordered
  price: it.Price ?? it.price ?? 0, // Price per item (default to 0 if missing)
  name: it.Name ?? it.name, // Shoe name
  brand: it.Brand ?? it.brand, // Shoe brand
  imageUrl: it.ImageUrl ?? it.imageUrl, // Product image URL
});

/**
 * 🧩 mapOrder() - Normalizes an entire order object.
 * Converts backend property names (like "CreatedAt" or "TotalPrice") into a consistent format.
 * Each order includes metadata and an array of items (mapped using mapOrderItem()).
 */
const mapOrder = (o) => ({
  id: o.Id ?? o.id, // Unique order ID
  createdAt: o.CreatedAt ?? o.createdAt, // Date and time when the order was placed
  totalPrice: o.TotalPrice ?? o.totalPrice ?? 0, // Total cost of the order
  userEmail: o.UserEmail ?? o.userEmail ?? null, // 🧍‍♂️ Added for admin view (shows who placed the order)
  items: Array.isArray(o.Items ?? o.items)
    ? (o.Items ?? o.items).map(mapOrderItem) // Normalize each order item
    : [],
});

/**
 * 📦 getOrders() - Retrieves a list of orders.
 * - If the user is an **Admin** and `all=true`, it calls `/api/Orders/all`.
 * - Otherwise, it calls `/api/Orders` to fetch only the orders of the logged-in user.
 */
export const getOrders = async (all = false) => {
  const { data } = await api.get(`/Orders${all ? "/all" : ""}`);
  return Array.isArray(data) ? data.map(mapOrder) : []; // Normalize each order
};

/**
 * 🛍️ placeOrder() - Submits a new order based on the current user's cart.
 * Sends a POST request to `/Orders` and returns the normalized order data.
 */
export const placeOrder = async () => {
  const { data } = await api.post("/Orders");
  return mapOrder(data);
};

/**
 * ❌ deleteOrder() - Deletes a specific order.
 * Works for customers (to cancel their own orders) and possibly admins, depending on backend rules.
 * Sends a DELETE request to `/Orders/{id}`.
 */
export const deleteOrder = async (id) => {
  const res = await api.delete(`/Orders/${id}`);
  return res.status === 204; // ✅ Returns true if deletion was successful
};

/**
 * 🧑‍💼 adminDeleteOrder() - Admin-only version of delete.
 * Sends a DELETE request to `/Orders/{id}/admin`.
 * This is optional — depends if your backend supports a separate admin delete endpoint.
 */
export const adminDeleteOrder = async (id) => {
  const res = await api.delete(`/Orders/${id}/admin`);
  return res.status === 204; // ✅ True if deletion successful
};

//Manages orders and checkout processes via the backend API.
