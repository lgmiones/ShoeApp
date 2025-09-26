import api from "../lib/axios";

// Service returns only { ShoeId, Quantity }[] (no id), so no per-item delete possible.
export const getCart = async () => {
  const { data } = await api.get("/Cart");
  return Array.isArray(data) ? data : [];
};

// { shoeId, quantity }
export const addToCart = async (shoeId, quantity = 1) => {
  const { data } = await api.post("/Cart", { shoeId, quantity });
  return data;
};

// RemoveFromCart requires cart item id, but API doesn't return it -> cannot implement reliably.
// Keeping this for future if backend returns an id.
export const removeFromCartById = async (cartItemId) => {
  const res = await api.delete(`/Cart/${cartItemId}`);
  return res.status === 204;
};

export const clearCart = async () => {
  const res = await api.delete("/Cart/clear");
  return res.status === 204;
};
