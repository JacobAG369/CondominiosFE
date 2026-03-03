import { useEffect, useState } from "react";
import { fetchUnreadCount } from "../api/notifications";
import echo from "../realtime/echo";
import { useRouter } from "@tanstack/react-router";

export default function NotificationBell({ depaId }) {
  const [count, setCount] = useState(0);
  const router = useRouter();

  useEffect(() => {
    // carga inicial
    (async () => {
      try {
        const res = await fetchUnreadCount();
        setCount(res.count || 0);
      } catch (e) {
        console.log("unreadCount error", e);
      }
    })();

    if (!depaId) return;

    const channelName = `notifications.depa.${depaId}`;
    console.log("🔔 NotificationBell listening to:", channelName);

    const channel = echo.channel(channelName);

    channel.listen(".notification.created", (payload) => {
      console.log("🔔 Notification broadcast received:", payload);
      // Cambia la campana al llegar una notificación
      setCount((c) => c + 1);
    });

    return () => {
      echo.leave(channelName);
    };
  }, [depaId]);

  return (
    <button
      onClick={() => router.navigate({ to: "/notifications" })}
      className="relative px-3 py-2 text-[#2B2B2B] hover:text-[#B08968] transition-colors"
    >
      📩 Notificaciones
      {count > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
          {count}
        </span>
      )}
    </button>
  );
}
