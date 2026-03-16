import api from "./axios";

// LOGIN (incluye device_id para sesión por dispositivo)
export const login = async ({ email, password, device_id }) => {
  const res = await api.post("/auth/login", { email, password, device_id });
  return res.data;
};

// USUARIO ACTUAL (para sacar depa_id)
export const me = async () => {
  try {
    const res = await api.get("/user");
    return res.data;
  } catch (error) {
    if (error.response?.status === 404) {
      const fallbackRes = await api.get("/auth/me");
      return fallbackRes.data;
    }

    throw error;
  }
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

// ── Forgot Password (3-step flow) ─────────────────────────────────────────────

/** Step 1: solicita que un código de 6 dígitos se envíe al email. */
export const sendResetCode = async ({ email }) => {
  const res = await api.post("/auth/forgot-password/send-code", { email });
  return res.data;
};

/** Step 2: verifica el código recibido por email. */
export const verifyResetCode = async ({ email, code }) => {
  const res = await api.post("/auth/forgot-password/verify-code", { email, code });
  return res.data;
};

/** Step 3: restablece la contraseña usando el código ya verificado. */
export const resetForgotPassword = async ({ email, code, password, password_confirmation }) => {
  const res = await api.post("/auth/forgot-password/reset", {
    email,
    code,
    password,
    password_confirmation,
  });
  return res.data;
};

