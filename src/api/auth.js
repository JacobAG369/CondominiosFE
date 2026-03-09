import api from "./axios";

// LOGIN (incluye device_id para sesión por dispositivo)
export const login = async ({ email, password, device_id }) => {
  const res = await api.post("/auth/login", { email, password, device_id });
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

// CAMBIAR CONTRASEÑA (revoca todos los tokens en backend)
export const changePassword = async ({ current_password, new_password, new_password_confirmation }) => {
  const res = await api.post("/auth/change-password", {
    current_password,
    new_password,
    new_password_confirmation,
  });
  return res.data;
};

