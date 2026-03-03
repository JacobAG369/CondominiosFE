import api from "./axios";

// LOGIN
export const login = async ({ email, password }) => {
  const res = await api.post("/auth/login", { email, password });
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

