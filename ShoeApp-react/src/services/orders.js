import api from "../lib/axios";

//This function ensures that both backend (PascalCase) and frontend (camelCase) properties

const mapOrderItem = (it) => ({
  shoeId: it.ShoeId ?? it.shoeId,
  quantity: it.Quantity ?? it.quantity,
  price: it.Price ?? it.price ?? 0,
  name: it.Name ?? it.name,
  brand: it.Brand ?? it.brand,
  imageUrl: it.ImageUrl ?? it.imageUrl,
});

//🧩 mapOrder() - Normalizes an entire order object.
//Converts backend property names (like "CreatedAt" or "TotalPrice") into a consistent format.
const mapOrder = (o) => ({
  id: o.Id ?? o.id, // Unique order ID
  createdAt: o.CreatedAt ?? o.createdAt,
  totalPrice: o.TotalPrice ?? o.totalPrice ?? 0,
  userEmail: o.UserEmail ?? o.userEmail ?? null,
  items: Array.isArray(o.Items ?? o.items)
    ? (o.Items ?? o.items).map(mapOrderItem)
    : [],
});

//📦 getOrders() - Retrieves a list of orders.
// If the user is an **Admin** and `all=true`, it calls `/api/Orders/all`.

export const getOrders = async (all = false) => {
  const { data } = await api.get(`/Orders${all ? "/all" : ""}`);
  return Array.isArray(data) ? data.map(mapOrder) : [];
};

/*
 * 🛍️ placeOrder() - Submits a new order based on the current user's cart.
 */
export const placeOrder = async () => {
  const { data } = await api.post("/Orders");
  return mapOrder(data);
};

/*
 * ❌ deleteOrder() - Deletes a specific order.
 * Works for customers (to cancel their own orders) and possibly admins, depending on backend rules.
 */
export const deleteOrder = async (id) => {
  const res = await api.delete(`/Orders/${id}`);
  return res.status === 204; // ✅ Returns true if deletion was successful
};

/**
 * 🧑‍💼 adminDeleteOrder() - Admin-only version of delete.
 */
export const adminDeleteOrder = async (id) => {
  const res = await api.delete(`/Orders/${id}/admin`);
  return res.status === 204; // ✅ True if deletion successful
};

//Manages orders and checkout processes via the backend API.
