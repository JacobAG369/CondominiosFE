import { useRouter } from "@tanstack/react-router";
import Button from "../ui/Button";
import { logout } from "../../api/auth";
import { resetAuthSession } from "../../features/auth/actions";
import { useAuth } from "../../features/auth/hooks/useAuth";
import { useSession } from "../../features/auth/hooks/useSession";

export default function AppShell({ children, depaId, showTopbar = true, showBackButton = false }) {
    const router = useRouter();
    const { user } = useAuth();
    useSession();

    const nombre = user?.persona?.nombre || "";
    const apellidoP = user?.persona?.apellidoP || "";
    const isAdmin = user?.role.name === "Administrador";
    const resolvedDepaId = depaId ?? user?.departamentoId ?? undefined;

    // Determine back route based on user type
    const backRoute = isAdmin ? "/admin" : "/welcome";
    const backLabel = isAdmin ? "Panel Admin" : "Menú Principal";

    const handleLogout = async () => {
        try {
            await logout();
        } catch (err) {
            // Continuar incluso si el backend falla
            console.error("Logout error:", err);
        } finally {
            resetAuthSession();
            router.navigate({ to: "/login" });
        }
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
                                    <Button
                                        variant="outline"
                                        className="text-sm"
                                        onClick={() => router.navigate({ to: "/change-password" })}
                                    >
                                        🔑 Contraseña
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

                                {resolvedDepaId && (
                                    <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                                        Depa {resolvedDepaId}
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
