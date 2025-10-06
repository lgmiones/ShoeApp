import api from "../lib/axios";

/**
 * 👟 mapShoe() - A helper function that converts backend data into a consistent frontend format.
 * It handles both PascalCase (C# backend) and camelCase (JavaScript frontend) property names.
 */
const mapShoe = (d) => ({
  id: d.Id ?? d.id,
  name: d.Name ?? d.name,
  brand: d.Brand ?? d.brand,
  price: d.Price ?? d.price,
  stock: d.Stock ?? d.stock,
  imageUrl: d.ImageUrl ?? d.imageUrl,
});

/**
 * 🧾 getShoes() - Fetches the list of all available shoes from the backend.
 * Sends a GET request to `/api/Shoes` and returns an array of normalized shoe objects.
 */
export const getShoes = async () => {
  const { data } = await api.get("/Shoes");
  return Array.isArray(data) ? data.map(mapShoe) : [];
};

/**
 * 🔍 getShoe() - Fetches a specific shoe by its ID.
 * Sends a GET request to `/api/Shoes/{id}` and normalizes the data using mapShoe().
 */
export const getShoe = async (id) => {
  const { data } = await api.get(`/Shoes/${id}`);
  return mapShoe(data);
};

/**
 * ➕ createShoe() - Adds a new shoe to the database.
 * Sends a POST request to `/api/Shoes` with data in PascalCase (C# expects this format).
 */
export const createShoe = async (dtoPascal) => {
  const { data } = await api.post("/Shoes", dtoPascal);
  return mapShoe(data);
};

/**
 * ✏️ updateShoe() - Updates an existing shoe’s details.
 * Sends a PUT request to `/api/Shoes/{id}` with PascalCase data.
 */
export const updateShoe = async (id, dtoPascal) => {
  const { data } = await api.put(`/Shoes/${id}`, dtoPascal);
  return mapShoe(data);
};

/**
 * 🗑️ deleteShoe() - Deletes a shoe record by its ID.
 * Sends a DELETE request to `/api/Shoes/{id}`.
 */
export const deleteShoe = async (id) => {
  const res = await api.delete(`/Shoes/${id}`);
  return res.status === 204 || res.status === 200;
};

//Manages shoe products and interactions with the backend API.
