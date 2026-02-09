import { useEffect, useState } from "react";
import { fetchNotifications, markRead } from "../api/notifications";
import { useNavigate } from "react-router-dom";
import AppShell from "../components/layout/AppShell";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";

function getLink(n) {
  switch (n.type) {
    case "message":
      return "/chat";
    case "multa":
      return n.data?.multa_id ? `/multas/${n.data.multa_id}` : "/multas";
    case "asamblea":
      return n.data?.asamblea_id ? `/asambleas/${n.data.asamblea_id}` : "/asambleas";
    case "pago_atrasado":
      return n.data?.pago_id ? `/pagos/${n.data.pago_id}` : "/pagos";
    default:
      return "/notifications";
  }
}

export default function Notifications() {
  const depaId = Number(localStorage.getItem("depa_id"));
  const [items, setItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const data = await fetchNotifications();
      setItems(data);
    })();
  }, []);

  const openNotification = async (n) => {
    if (!n.read_at) {
      await markRead(n.id);
      setItems((prev) =>
        prev.map((x) => (x.id === n.id ? { ...x, read_at: new Date().toISOString() } : x))
      );
    }
    navigate(getLink(n));
  };

  return (
    <AppShell depaId={depaId}>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-text-dark">Notificaciones</h1>

        <Card>
          <div className="space-y-2">
            {items.length === 0 && (
              <p className="text-center text-gray-500 py-8">No hay notificaciones</p>
            )}

            {items.map((n) => (
              <div
                key={n.id}
                onClick={() => openNotification(n)}
                className={`p-4 rounded-lg border cursor-pointer transition-colors hover:bg-gray-50 ${n.read_at ? "border-gray-200 bg-white" : "border-primary/30 bg-primary/5"
                  }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-text-dark">{n.title}</h3>
                      {!n.read_at && <Badge variant="primary">Nueva</Badge>}
                    </div>
                    <p className="text-sm text-gray-600">{n.body}</p>
                    <p className="text-xs text-gray-400 mt-2">
                      {new Date(n.created_at).toLocaleString("es-MX")}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
