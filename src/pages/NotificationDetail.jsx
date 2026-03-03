import { useEffect, useState } from "react";
import { useParams, useRouter } from "@tanstack/react-router";
import api from "../api/axios";


export default function NotificationDetail() {
    const { id } = useParams({ strict: false });
    const router = useRouter();
    const [notification, setNotification] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchDetail = async () => {
            try {
                const res = await api.get(`/notifications/${id}`);
                setNotification(res.data);
            } catch (err) {
                console.error("Error fetching notification:", err);
                setError(err.response?.data?.message || "Error al cargar la notificación");
            } finally {
                setLoading(false);
            }
        };

        fetchDetail();
    }, [id]);

    if (loading) {
        return (
            <div className="container">
                <div className="card">
                    <p>Cargando...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container">
                <div className="card">
                    <h2 style={{ color: "red" }}>Error</h2>
                    <p>{error}</p>
                    <button className="btn-primary" onClick={() => router.navigate({ to: "/notifications" })}>
                        Volver a notificaciones
                    </button>
                </div>
            </div>
        );
    }

    if (!notification) {
        return (
            <div className="container">
                <div className="card">
                    <p>Notificación no encontrada</p>
                    <button className="btn-primary" onClick={() => router.navigate({ to: "/notifications" })}>
                        Volver a notificaciones
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container">
            <div className="card">
                <button
                    onClick={() => router.navigate({ to: "/notifications" })}
                    style={{
                        marginBottom: 16,
                        padding: "8px 16px",
                        cursor: "pointer",
                        background: "#6b7280",
                        color: "white",
                        border: "none",
                        borderRadius: 4,
                    }}
                >
                    ← Volver a notificaciones
                </button>

                <div className="h1">Detalle de Notificación</div>

                <div style={{ marginTop: 20 }}>
                    <div style={{ marginBottom: 16 }}>
                        <strong>Tipo:</strong>{" "}
                        <span
                            style={{
                                padding: "4px 12px",
                                background: "#e5e7eb",
                                borderRadius: 4,
                                fontWeight: 600,
                            }}
                        >
                            {notification.type}
                        </span>
                    </div>

                    <div style={{ marginBottom: 16 }}>
                        <strong>Título:</strong>
                        <div style={{ fontSize: 18, marginTop: 8 }}>{notification.title}</div>
                    </div>

                    {notification.body && (
                        <div style={{ marginBottom: 16 }}>
                            <strong>Mensaje:</strong>
                            <div style={{ marginTop: 8, color: "#4b5563" }}>{notification.body}</div>
                        </div>
                    )}

                    <div style={{ marginBottom: 16 }}>
                        <strong>Estado:</strong>{" "}
                        <span style={{ color: notification.read_at ? "#059669" : "#dc2626" }}>
                            {notification.read_at ? "Leída" : "No leída"}
                        </span>
                    </div>

                    <div style={{ marginBottom: 16 }}>
                        <strong>Fecha:</strong>
                        <div style={{ fontSize: 14, color: "#6b7280", marginTop: 4 }}>
                            {new Date(notification.created_at).toLocaleString("es-MX")}
                        </div>
                    </div>

                    {notification.data && Object.keys(notification.data).length > 0 && (
                        <div style={{ marginBottom: 16 }}>
                            <strong>Datos adicionales:</strong>
                            <pre
                                style={{
                                    background: "#f3f4f6",
                                    padding: 12,
                                    borderRadius: 4,
                                    marginTop: 8,
                                    overflow: "auto",
                                }}
                            >
                                {JSON.stringify(notification.data, null, 2)}
                            </pre>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
