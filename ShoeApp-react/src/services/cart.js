import api from "../lib/axios";

const mapCartItem = (d) => ({
  id: d.Id ?? d.id, // needed for per-item delete
  shoeId: d.ShoeId ?? d.shoeId,
  quantity: d.Quantity ?? d.quantity,
  price: d.Price ?? d.price ?? 0,
  name: d.Name ?? d.name,
  brand: d.Brand ?? d.brand,
  imageUrl: d.ImageUrl ?? d.imageUrl,
});

export const getCart = async () => {
  const { data } = await api.get("/Cart");
  return Array.isArray(data) ? data.map(mapCartItem) : [];
};

export const addToCart = async (shoeId, quantity = 1) => {
  const { data } = await api.post("/Cart", { shoeId, quantity });
  return data;
};

export const deleteCartItem = async (cartItemId) => {
  const res = await api.delete(`/Cart/${cartItemId}`);
  return res.status === 204;
};

export const clearCart = async () => {
  const res = await api.delete("/Cart/clear");
  return res.status === 204;
};
