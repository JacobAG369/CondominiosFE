import api from "./axios";

export const fetchNotifications = async (idDepa) =>
  (await api.get("/notifications", { params: { id_depa: idDepa } })).data;

export const fetchUnreadCount = async (idDepa) =>
  (await api.get("/notifications/unread-count", { params: { id_depa: idDepa } }))
    .data;

export const markRead = async (id) => (await api.post(`/notifications/${id}/read`)).data;

// para pruebas rápidas
export const testCreateNotification = async (payload) =>
  (await api.post("/notifications/test", payload)).data;
