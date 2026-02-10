import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getResidentes, createResidente, deleteResidente } from "../api/residentes";
import AppShell from "../components/layout/AppShell";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";

export default function Residentes() {
  const [residentes, setResidentes] = useState([]);
  const [nombre, setNombre] = useState("");
  const [apellidoP, setApellidoP] = useState("");
  const [apellidoM, setApellidoM] = useState("");
  const [celular, setCelular] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const depaId = Number(localStorage.getItem("depa_id"));
  const navigate = useNavigate();

  const loadResidentes = async () => {
    try {
      const data = await getResidentes(depaId);
      setResidentes(data);
    } catch (err) {
      setError(err.response?.data?.message || "Error al cargar residentes");
    }
  };

  useEffect(() => {
    loadResidentes();
  }, []);

  const handleCreate = async () => {
    setError("");
    setSuccess("");

    try {
      await createResidente({
        nombre,
        apellido_p: apellidoP,
        apellido_m: apellidoM,
        celular,
        id_depa: depaId,
      });

      setSuccess("Residente creado exitosamente");
      setNombre("");
      setApellidoP("");
      setApellidoM("");
      setCelular("");
      loadResidentes();
    } catch (err) {
      setError(err.response?.data?.message || "Error al crear residente");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("¿Eliminar este residente?")) return;

    try {
      await deleteResidente(id);
      setSuccess("Residente eliminado");
      loadResidentes();
    } catch (err) {
      setError("Error al eliminar");
    }
  };

  return (
    <AppShell depaId={depaId} showBackButton={true}>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-text-dark">Residentes</h1>

        {/* Create Form */}
        <Card title="Agregar Nuevo Residente">
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-lg text-red-700">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 p-3 bg-green-100 border border-green-300 rounded-lg text-green-700">
              {success}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <Input
              label="Nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
            <Input
              label="Apellido Paterno"
              value={apellidoP}
              onChange={(e) => setApellidoP(e.target.value)}
              required
            />
            <Input
              label="Apellido Materno"
              value={apellidoM}
              onChange={(e) => setApellidoM(e.target.value)}
            />
            <Input
              label="Celular"
              value={celular}
              onChange={(e) => setCelular(e.target.value)}
              required
            />
          </div>

          <Button onClick={handleCreate}>
            Agregar Residente
          </Button>
        </Card>

        {/* Residentes List */}
        <Card title="Lista de Residentes">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Celular</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {residentes.map((r) => (
                  <tr key={r.id}>
                    <td className="px-4 py-3 text-sm text-gray-900">{r.id}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {r.nombre} {r.apellido_p} {r.apellido_m}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{r.celular}</td>
                    <td className="px-4 py-3 text-sm">
                      {r.activo ? (
                        <Badge variant="success">Activo</Badge>
                      ) : (
                        <Badge variant="default">Inactivo</Badge>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <Button
                        variant="danger"
                        onClick={() => handleDelete(r.id)}
                        className="text-xs py-1 px-2"
                      >
                        Eliminar
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {residentes.length === 0 && (
              <p className="text-center text-gray-500 py-8">No hay residentes registrados</p>
            )}
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
