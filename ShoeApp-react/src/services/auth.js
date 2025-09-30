import api from "../lib/axios";

export async function register({ email, password }) {
  // Do NOT send a role; backend will assign "Customer" when Role is null/empty.
  const { data } = await api.post("/Auth/register", { email, password });
  persistAuth(data);
  return data;
}

export async function login({ email, password }) {
  const { data } = await api.post("/Auth/login", { email, password });
  persistAuth(data);
  return data;
}
export async function me() {
  const { data } = await api.get("/Auth/me");
  persistAuth(data);
  return data;
}
export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("roles");
  localStorage.removeItem("email");
}

function persistAuth(dto) {
  if (!dto?.token) return;
  localStorage.setItem("token", dto.token);
  localStorage.setItem("email", dto.email ?? "");
  localStorage.setItem("roles", JSON.stringify(dto.roles ?? []));
}
export function getRoles() {
  try {
    return JSON.parse(localStorage.getItem("roles") || "[]");
  } catch {
    return [];
  }
}
export function isAdmin() {
  return getRoles().includes("Admin");
}
export function isAuthed() {
  return !!localStorage.getItem("token");
}
