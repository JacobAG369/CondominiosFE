import api from "./axios";

// GET /residentes?id_depa=1
export const getResidentes = async (idDepa) =>
  (await api.get("/residentes", { params: { id_depa: idDepa } })).data;

// POST /residentes
export const createResidente = async (payload) =>
  (await api.post("/residentes", payload)).data;

// DELETE /residentes/{id}
export const deleteResidente = async (id) =>
  (await api.delete(`/residentes/${id}`)).data;
