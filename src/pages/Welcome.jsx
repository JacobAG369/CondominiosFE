import AppShell from "../components/layout/AppShell";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import { useRouter } from "@tanstack/react-router";

export default function Welcome() {
    const depaId = Number(localStorage.getItem("depa_id"));
    const router = useRouter();

    return (
        <AppShell depaId={depaId}>
            <div className="space-y-6">
                <h1 className="text-3xl font-bold text-text-dark">Bienvenido</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card title="Chat Global">
                        <p className="text-gray-600 mb-4">
                            Envía mensajes a todos los departamentos del condominio en tiempo real.
                        </p>
                        <Button onClick={() => router.navigate({ to: "/chat" })}>
                            Ir al Chat
                        </Button>
                    </Card>

                    <Card title="🔔 Notificaciones">
                        <p className="text-gray-600 mb-4">
                            Revisa tus notificaciones y mantente informado sobre eventos importantes.
                        </p>
                        <Button onClick={() => router.navigate({ to: "/notifications" })}>
                            Ver Notificaciones
                        </Button>
                    </Card>
                </div>
            </div>
        </AppShell>
    );
}
