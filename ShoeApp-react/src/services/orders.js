import api from "../lib/axios";

// Returns OrderDto[]: { Id, CreatedAt, TotalPrice, Items: [{ ShoeId, Quantity, Price }] }
export const getOrders = async () => {
  const { data } = await api.get("/Orders");
  return Array.isArray(data) ? data : [];
};

export const placeOrder = async () => {
  const { data } = await api.post("/Orders");
  return data; // OrderDto
};

export const deleteOrder = async (id) => {
  const res = await api.delete(`/Orders/${id}`);
  return res.status === 204;
};
