import api from "../lib/axios";

const mapShoe = (d) => ({
  id: d.Id ?? d.id,
  name: d.Name ?? d.name,
  brand: d.Brand ?? d.brand,
  price: d.Price ?? d.price,
  stock: d.Stock ?? d.stock,
  imageUrl: d.ImageUrl ?? d.imageUrl,
});

export const getShoes = async () => {
  const { data } = await api.get("/Shoes");
  return Array.isArray(data) ? data.map(mapShoe) : [];
};

export const getShoe = async (id) => {
  const { data } = await api.get(`/Shoes/${id}`);
  return mapShoe(data);
};

// create/update still send PascalCase as your backend expects
export const createShoe = async (dtoPascal) => {
  const { data } = await api.post("/Shoes", dtoPascal);
  return mapShoe(data);
};
export const updateShoe = async (id, dtoPascal) => {
  const { data } = await api.put(`/Shoes/${id}`, dtoPascal);
  return mapShoe(data);
};
export const deleteShoe = async (id) => {
  const res = await api.delete(`/Shoes/${id}`);
  return res.status === 204 || res.status === 200;
};
