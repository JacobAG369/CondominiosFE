import api from "./axios";

export const getAdminStats = async () => {
    const res = await api.get("/admin/stats");
    return res.data;
};

export const getUsers = async () => {
    const res = await api.get("/admin/users");
    return res.data;
};

export const createUser = async (userData) => {
    const res = await api.post("/admin/users", userData);
    return res.data;
};
