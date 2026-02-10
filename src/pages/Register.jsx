import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../api/client";
import Input from "../components/ui/Input";
import LoadingButton from "../components/ui/LoadingButton";
import Card from "../components/ui/Card";
import AnimatedAlert from "../components/ui/AnimatedAlert";

export default function Register() {
  const [nombre, setNombre] = useState("");
  const [apellidoP, setApellidoP] = useState("");
  const [apellidoM, setApellidoM] = useState("");
  const [celular, setCelular] = useState("");
  const [password, setPassword] = useState("");
  const [idDepa, setIdDepa] = useState("");
  const [idRol, setIdRol] = useState("1"); // 1=Residente, 2=Administrador
  const [residente, setResidente] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, type: "info", title: "", message: "" });

  const navigate = useNavigate();

  const showAlert = (type, title, message) => {
    setAlert({ show: true, type, title, message });
    setTimeout(() => {
      setAlert((prev) => ({ ...prev, show: false }));
    }, 3000);
  };

  const closeAlert = () => {
    setAlert((prev) => ({ ...prev, show: false }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await api.post("/auth/register", {
        nombre,
        apellido_p: apellidoP,
        apellido_m: apellidoM,
        celular,
        password,
        id_depa: Number(idDepa),
        id_rol: Number(idRol),
        residente: Boolean(residente),
      });

      showAlert("success", "Registro exitoso", "Tu cuenta ha sido creada. Ahora puedes iniciar sesión.");
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      console.log(err);
      const errorMsg = err.response?.data?.message || "Error al crear la cuenta. Intenta de nuevo.";
      showAlert("error", "Error de registro", errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-sand flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">Condominios</h1>
          <p className="text-gray-600">Crear Nueva Cuenta</p>
        </div>

        <Card>
          <h2 className="text-2xl font-bold text-text-dark mb-6">Registro de Usuario</h2>

          <div className="mb-4">
            <AnimatedAlert
              show={alert.show}
              type={alert.type}
              title={alert.title}
              message={alert.message}
              onClose={closeAlert}
            />
          </div>

          <form onSubmit={handleRegister} className="space-y-5">
            {/* Datos Personales */}
            <div>
              <h3 className="text-lg font-semibold text-text-dark mb-3">Datos Personales</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  label="Nombre"
                  placeholder="Ej: Jimmy"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  required
                />
                <Input
                  label="Apellido Paterno"
                  placeholder="Ej: Aviña"
                  value={apellidoP}
                  onChange={(e) => setApellidoP(e.target.value)}
                  required
                />
                <Input
                  label="Apellido Materno"
                  placeholder="Ej: Gómez"
                  value={apellidoM}
                  onChange={(e) => setApellidoM(e.target.value)}
                />
              </div>
            </div>

            {/* Credenciales */}
            <div>
              <h3 className="text-lg font-semibold text-text-dark mb-3">Credenciales de Acceso</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Celular"
                  placeholder="10 pinches dígitos"
                  value={celular}
                  onChange={(e) => setCelular(e.target.value)}
                  required
                />
                <Input
                  label="Contraseña"
                  type="password"
                  placeholder="Mínimo 8 caracteres"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Datos del Departamento */}
            <div>
              <h3 className="text-lg font-semibold text-text-dark mb-3">Datos del Departamento</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="ID Departamento"
                  placeholder="Ej: 1"
                  value={idDepa}
                  onChange={(e) => setIdDepa(e.target.value)}
                  required
                />

                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-text-dark">
                    Rol <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={idRol}
                    onChange={(e) => setIdRol(e.target.value)}
                    className="px-3 py-2 border border-[#E7DED5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B08968]/30 focus:border-[#B08968]"
                    required
                  >
                    <option value="1">Residente</option>
                    <option value="2">Administrador</option>
                  </select>
                </div>
              </div>

              <label className="flex items-center gap-2 mt-4 cursor-pointer">
                <input
                  type="checkbox"
                  checked={residente}
                  onChange={(e) => setResidente(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-[#B08968] focus:ring-[#B08968]"
                />
                <span className="text-sm text-text-dark">Es residente del condominio</span>
              </label>
            </div>

            <LoadingButton type="submit" isLoading={isLoading} className="w-full">
              Crear Cuenta
            </LoadingButton>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            ¿Ya tienes cuenta?{" "}
            <Link to="/login" className="text-primary hover:text-primary-hover font-medium">
              Inicia sesión
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
}
