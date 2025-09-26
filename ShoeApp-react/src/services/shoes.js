import api from "../lib/axios";

// Returns ShoeDto[]: { Id, Name, Brand, Price }
export const getShoes = async () => {
  const { data } = await api.get("/Shoes");
  return Array.isArray(data) ? data : [];
};

export const getShoe = async (id) => {
  const { data } = await api.get(`/Shoes/${id}`);
  return data;
};

// Accepts ShoeCreateDto: { Name, Brand, Price, Stock }
export const createShoe = async (dto) => {
  const { data } = await api.post("/Shoes", dto);
  return data;
};

export const updateShoe = async (id, dto) => {
  const { data } = await api.put(`/Shoes/${id}`, dto);
  return data;
};

export const deleteShoe = async (id) => {
  const res = await api.delete(`/Shoes/${id}`);
  return res.status === 204 || res.status === 200;
};
