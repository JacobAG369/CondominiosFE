import { useState, useEffect, useRef } from "react";
import api from "../api/axios";
import echo from "../realtime/echo";
import AppShell from "../components/layout/AppShell";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

export default function Chat() {
  const depaId = Number(localStorage.getItem("depa_id"));
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    loadMessages();

    // Listen for new messages
    const channel = echo.channel("chat.global");
    channel.listen(".message.sent", (data) => {
      console.log("📩 Broadcast received:", data);

      // Prevent duplicates: check if message with this ID already exists
      setMessages((prev) => {
        const exists = prev.some(msg => msg.id === data.id);
        if (exists) {
          console.log("Duplicate message, skipping:", data.id);
          return prev;
        }
        return [...prev, data];
      });
    });

    return () => {
      channel.stopListening(".message.sent");
      echo.leaveChannel("chat.global");
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadMessages = async () => {
    try {
      const res = await api.get("/chat/messages");
      setMessages(res.data);
    } catch (err) {
      console.error("Error loading messages:", err);
    }
  };

  const sendMessage = async () => {
    if (!content.trim()) return;

    const tempMessage = {
      id: `temp-${Date.now()}`,
      from_depa_id: depaId,
      content: content.trim(),
      created_at: new Date().toISOString(),
    };

    // Optimistic UI: add message immediately
    setMessages((prev) => [...prev, tempMessage]);
    setContent("");

    try {
      const response = await api.post("/chat/messages", { content: tempMessage.content });

      // Backend returns message directly (not wrapped in data property)
      // Replace temp message with real one from server
      setMessages((prev) =>
        prev.map(msg =>
          msg.id === tempMessage.id ? response.data : msg
        )
      );
      console.log("Message sent successfully:", response.data);
    } catch (err) {
      console.error("Error sending message:", err);
      // Remove optimistic message on error
      setMessages((prev) => prev.filter(msg => msg.id !== tempMessage.id));
      alert("Error al enviar mensaje: " + (err.response?.data?.message || err.message));
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <AppShell depaId={depaId} showBackButton={true}>
      <Card title="Chat Global">
        <div className="space-y-4">
          {/* Messages List */}
          <div className="bg-gray-50 border border-[#E7DED5] rounded-lg p-4 h-96 overflow-y-auto space-y-2">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`p-3 rounded-lg ${msg.from_depa_id === depaId
                  ? 'bg-[#B08968] text-white ml-auto max-w-[70%]'
                  : 'bg-white border border-[#E7DED5] max-w-[70%]'
                  }`}
              >
                <div className="text-xs opacity-75 mb-1">
                  Depa {msg.from_depa_id}
                </div>
                <div>{msg.content}</div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="flex gap-2">
            <Input
              placeholder="Escribe un mensaje..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1"
            />
            <Button onClick={sendMessage}>
              Enviar
            </Button>
          </div>
        </div>
      </Card>
    </AppShell>
  );
}
