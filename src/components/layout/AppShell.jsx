import { useNavigate } from "react-router-dom";
import Button from "../ui/Button";

export default function AppShell({ children, depaId, showTopbar = true }) {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("depa_id");
        localStorage.removeItem("id_rol");
        localStorage.removeItem("admin");
        navigate("/login");
    };

    return (
        <div className="min-h-screen bg-bg-sand">
            {showTopbar && (
                <div className="bg-white border-b border-border-soft shadow-sm">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center h-16">
                            <div className="flex items-center gap-6">
                                <h1 className="text-2xl font-bold text-primary">Condominios</h1>

                                {depaId && (
                                    <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                                        Depa {depaId}
                                    </span>
                                )}

                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        className="text-sm"
                                        onClick={() => navigate("/chat")}
                                    >
                                        💬 Chat
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="text-sm"
                                        onClick={() => navigate("/notifications")}
                                    >
                                        🔔 Notificaciones
                                    </Button>
                                </div>
                            </div>

                            <Button variant="danger" onClick={handleLogout} className="text-sm">
                                Salir
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {children}
            </main>
        </div>
    );
}
