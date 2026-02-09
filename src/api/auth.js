import api from "./axios";

// LOGIN
export const login = async ({ celular, password }) => {
  const res = await api.post("/auth/login", { celular, password });
  return res.data;
};

// USUARIO ACTUAL (para sacar depa_id)
export const me = async () => {
  const res = await api.get("/auth/me");
  return res.data;
};

// LOGOUT (revoca token en backend)
export const logout = async () => {
  const res = await api.post("/auth/logout");
  return res.data;
};

