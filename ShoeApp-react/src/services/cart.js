import api from "../lib/axios";

/**
 * 🧩 mapCartItem() - Utility function to normalize cart item data.
 */
const mapCartItem = (d) => ({
  id: d.Id ?? d.id,
  shoeId: d.ShoeId ?? d.shoeId,
  quantity: d.Quantity ?? d.quantity,
  price: d.Price ?? d.price ?? 0,
  name: d.Name ?? d.name,
  brand: d.Brand ?? d.brand,
  imageUrl: d.ImageUrl ?? d.imageUrl,
});

/**
 * 🛒 getCart() - Retrieves the user's current shopping cart.
 * Sends a GET request to the /Cart endpoint and returns a list of cart items.
 */
export const getCart = async () => {
  const { data } = await api.get("/Cart");

  return Array.isArray(data) ? data.map(mapCartItem) : [];
};

/**
 * ➕ addToCart() - Adds a new shoe to the user's cart.
 * Sends a POST request to the /Cart endpoint with the shoe ID and desired quantity.
 */
export const addToCart = async (shoeId, quantity = 1) => {
  const { data } = await api.post("/Cart", { shoeId, quantity });
  return data;
};

/**
 * ❌ deleteCartItem() - Removes a specific item from the user's cart.
 * Sends a DELETE request to /Cart/{cartItemId}.
 */
export const deleteCartItem = async (cartItemId) => {
  const res = await api.delete(`/Cart/${cartItemId}`);
  return res.status === 204; // true if successfully deleted
};

/**
 * 🧹 clearCart() - Empties the entire shopping cart.
 * Sends a DELETE request to /Cart/clear.
 */
export const clearCart = async () => {
  const res = await api.delete("/Cart/clear");
  return res.status === 204;
};

//Manages cart items and interactions with the backend API.
