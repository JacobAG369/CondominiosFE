import { useState } from "react";
import { login, me } from "../api/auth";
import { useNavigate, Link } from "react-router-dom";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";

export default function Login() {
  const [celular, setCelular] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // 1) Login
      const data = await login({ celular, password });
      localStorage.setItem("token", data.token);

      // 2) Get user data (for depa_id, id_rol, admin)
      const userData = await me();
      const depa = userData?.id_depa || userData?.user?.id_depa;
      const idRol = userData?.id_rol;
      const isAdmin = userData?.admin || false;

      // Store in localStorage
      if (depa) localStorage.setItem("depa_id", String(depa));
      if (idRol) localStorage.setItem("id_rol", String(idRol));
      localStorage.setItem("admin", String(isAdmin));

      // 3) Role-based redirect
      if (isAdmin) {
        navigate("/admin");
      } else {
        navigate("/welcome");
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

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-lg text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              label="Celular"
              type="text"
              placeholder="Ingresa tu celular"
              value={celular}
              onChange={(e) => setCelular(e.target.value)}
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
        </Card>
      </div>
    </div>
  );
}
