import api from "../../../api/axios";

/**
 * Registra un nuevo usuario con un perfil de persona.
 * POST /auth/register
 */
export const registerUser = async (data) => {
  const res = await api.post("/auth/register", data);
  return res.data;
};
