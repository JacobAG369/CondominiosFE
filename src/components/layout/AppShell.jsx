import { useRouter } from "@tanstack/react-router";
import Button from "../ui/Button";

export default function AppShell({ children, depaId, showTopbar = true, showBackButton = false }) {
    const router = useRouter();

    // Get user data from localStorage
    const nombre = localStorage.getItem("user_nombre") || "";
    const apellidoP = localStorage.getItem("user_apellido_p") || "";
    const isAdmin = localStorage.getItem("admin") === "true";

    // Determine back route based on user type
    const backRoute = isAdmin ? "/admin" : "/welcome";
    const backLabel = isAdmin ? "Panel Admin" : "Menú Principal";

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("depa_id");
        localStorage.removeItem("id_rol");
        localStorage.removeItem("admin");
        localStorage.removeItem("user_nombre");
        localStorage.removeItem("user_apellido_p");
        localStorage.removeItem("user_apellido_m");
        localStorage.removeItem("email_verified");
        router.navigate({ to: "/login" });
    };

    return (
        <div className="min-h-screen bg-bg-sand">
            {showTopbar && (
                <div className="bg-white border-b border-border-soft shadow-sm">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center h-16">
                            <div className="flex items-center gap-4">
                                <h1 className="text-2xl font-bold text-primary">🏢 Condominios</h1>

                                {showBackButton && (
                                    <Button
                                        variant="outline"
                                        className="text-sm"
                                        onClick={() => router.navigate({ to: backRoute })}
                                    >
                                        ← {backLabel}
                                    </Button>
                                )}

                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        className="text-sm"
                                        onClick={() => router.navigate({ to: "/chat" })}
                                    >
                                        Chat
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="text-sm"
                                        onClick={() => router.navigate({ to: "/notifications" })}
                                    >
                                        🔔 Notificaciones
                                    </Button>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                {nombre && (
                                    <div className="flex items-center gap-2 px-3 py-1 bg-gray-50 rounded-lg">
                                        <span className="text-lg">👤</span>
                                        <span className="text-sm font-medium text-gray-700">
                                            {nombre} {apellidoP}
                                        </span>
                                    </div>
                                )}

                                {depaId && (
                                    <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                                        Depa {depaId}
                                    </span>
                                )}

                                <Button variant="danger" onClick={handleLogout} className="text-sm">
                                    Salir
                                </Button>
                            </div>
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
