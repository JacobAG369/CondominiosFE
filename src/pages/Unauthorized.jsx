import { useRouter } from "@tanstack/react-router";
import AppShell from "../components/layout/AppShell";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import { useAuth } from "../features/auth/hooks/useAuth";
import { resolveAuthenticatedPath } from "../features/auth/session";

export default function Unauthorized() {
  const router = useRouter();
  const { user } = useAuth();
  const depaId = user?.departamentoId ?? undefined;

  return (
    <AppShell depaId={depaId}>
      <div className="max-w-xl mx-auto">
        <Card>
          <h1 className="text-3xl font-bold text-text-dark mb-4">
            Acceso no autorizado
          </h1>
          <p className="text-gray-600 mb-6">
            Tu sesi&oacute;n es v&aacute;lida, pero tu rol actual no tiene
            permisos para acceder a esta ruta.
          </p>
          <Button
            onClick={() =>
              router.navigate({ to: resolveAuthenticatedPath(user) })
            }
          >
            Volver al dashboard
          </Button>
        </Card>
      </div>
    </AppShell>
  );
}
