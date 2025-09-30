// src/services/orders.js
import api from "../lib/axios";

const mapOrderItem = (it) => ({
  shoeId: it.ShoeId ?? it.shoeId,
  quantity: it.Quantity ?? it.quantity,
  price: it.Price ?? it.price ?? 0,
  name: it.Name ?? it.name,
  brand: it.Brand ?? it.brand,
  imageUrl: it.ImageUrl ?? it.imageUrl,
});

const mapOrder = (o) => ({
  id: o.Id ?? o.id,
  createdAt: o.CreatedAt ?? o.createdAt,
  totalPrice: o.TotalPrice ?? o.totalPrice ?? 0,
  userEmail: o.UserEmail ?? o.userEmail ?? null, // ← NEW (for admin "all" view)
  items: Array.isArray(o.Items ?? o.items)
    ? (o.Items ?? o.items).map(mapOrderItem)
    : [],
});

/**
 * Get orders.
 * - If `all=true` (Admin), calls /api/Orders/all
 * - Otherwise (Customer), calls /api/Orders
 */
export const getOrders = async (all = false) => {
  const { data } = await api.get(`/Orders${all ? "/all" : ""}`);
  return Array.isArray(data) ? data.map(mapOrder) : [];
};

export const placeOrder = async () => {
  const { data } = await api.post("/Orders");
  return mapOrder(data);
};

// Normal self-delete (works for the owner; may also work for Admin depending on backend rules)
export const deleteOrder = async (id) => {
  const res = await api.delete(`/Orders/${id}`);
  return res.status === 204;
};

// OPTIONAL: If you added the Admin endpoint DELETE /api/Orders/{id}/admin
export const adminDeleteOrder = async (id) => {
  const res = await api.delete(`/Orders/${id}/admin`);
  return res.status === 204;
};
