import AppShell from "../../components/layout/AppShell";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
    const depaId = Number(localStorage.getItem("depa_id"));
    const navigate = useNavigate();

    return (
        <AppShell depaId={depaId}>
            <div className="space-y-6">
                <h1 className="text-3xl font-bold text-text-dark">Panel de Administración</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <Card title="👥 Usuarios">
                        <p className="text-gray-600 mb-4">
                            Administra usuarios del sistema: crear, editar y eliminar.
                        </p>
                        <Button onClick={() => navigate("/admin/users")}>
                            Gestionar Usuarios
                        </Button>
                    </Card>

                    <Card title="🏢 Residentes">
                        <p className="text-gray-600 mb-4">
                            Administra la información de los residentes del condominio.
                        </p>
                        <Button onClick={() => navigate("/residentes")}>
                            Ver Residentes
                        </Button>
                    </Card>

                    <Card title="💬 Chat">
                        <p className="text-gray-600 mb-4">
                            Participa en el chat global del condominio.
                        </p>
                        <Button onClick={() => navigate("/chat")}>
                            Ir al Chat
                        </Button>
                    </Card>

                    <Card title="🔔 Notificaciones">
                        <p className="text-gray-600 mb-4">
                            Revisa todas las notificaciones del sistema.
                        </p>
                        <Button onClick={() => navigate("/notifications")}>
                            Ver Notificaciones
                        </Button>
                    </Card>
                </div>
            </div>
        </AppShell>
    );
}
