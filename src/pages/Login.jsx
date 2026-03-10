import { useState } from "react";
import { login, me } from "../api/auth";
import { useRouter, Link } from "@tanstack/react-router";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import { getDeviceId } from "../utils/deviceId";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  // Show success banner when arriving from email verification link
  const searchParams = new URLSearchParams(window.location.search);
  const verified = searchParams.get("verified");
  const passwordReset = searchParams.get("reset");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // 1) Login (device_id garantiza una sesión por dispositivo)
      const data = await login({ email, password, device_id: getDeviceId() });
      localStorage.setItem("token", data.token);

      // 2) Get user data (for depa_id, id_rol, admin, persona)
      const userData = await me();
      const depa = userData?.id_depa || userData?.user?.id_depa;
      const idRol = userData?.id_rol;
      const isAdmin = userData?.admin || false;

      // Get persona data from nested user.persona or direct persona object
      const persona = userData?.user?.persona || userData?.persona;
      const nombre = persona?.nombre || '';
      const apellidoP = persona?.apellido_p || '';
      const apellidoM = persona?.apellido_m || '';

      // Store in localStorage
      if (depa) localStorage.setItem("depa_id", String(depa));
      if (idRol) localStorage.setItem("id_rol", String(idRol));
      localStorage.setItem("admin", String(isAdmin));
      if (nombre) localStorage.setItem("user_nombre", nombre);
      if (apellidoP) localStorage.setItem("user_apellido_p", apellidoP);
      if (apellidoM) localStorage.setItem("user_apellido_m", apellidoM);
      // Persist email verification status (used by router guards)
      const emailVerified = !!(
        userData?.email_verified_at ||
        userData?.user?.email_verified_at
      );
      localStorage.setItem("email_verified", String(emailVerified));
      // 3) Role-based redirect
      if (isAdmin) {
        router.navigate({ to: "/admin" });
      } else {
        router.navigate({ to: "/welcome" });
      }
    } catch (err) {
      console.error("LOGIN ERROR:", err);
      const msg =
        err.response?.data?.message ||
        "Error al iniciar sesión. Verifica tus credenciales.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-sand flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">Condominios</h1>
          <p className="text-gray-600">Sistema de Gestión</p>
        </div>

        <Card>
          <h2 className="text-2xl font-bold text-text-dark mb-6">Iniciar Sesión</h2>

          {verified === "1" && (
            <div className="mb-4 p-3 bg-green-100 border border-green-300 rounded-lg text-green-700 text-sm">
              ✅ ¡Correo verificado correctamente! Ya puedes iniciar sesión.
            </div>
          )}

          {passwordReset === "1" && (
            <div className="mb-4 p-3 bg-green-100 border border-green-300 rounded-lg text-green-700 text-sm">
              🔐 Contraseña actualizada correctamente. Inicia sesión con tu nueva contraseña.
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-lg text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              label="Correo electrónico"
              type="email"
              placeholder="tu@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Input
              label="Contraseña"
              type="password"
              placeholder="Ingresa tu contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Ingresando..." : "Entrar"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            ¿No tienes cuenta?{" "}
            <Link to="/register" className="text-primary hover:text-primary-hover font-medium">
              Regístrate
            </Link>
          </p>

          <p className="mt-2 text-center text-sm">
            <Link
              to="/forgot-password"
              className="text-gray-400 hover:text-primary text-xs transition-colors"
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
}
