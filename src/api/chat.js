import api from "./axios";

export const fetchMessages = async () => (await api.get("/chat/messages")).data;

export const sendMessage = async (content) =>
  (await api.post("/chat/messages", { content })).data;
