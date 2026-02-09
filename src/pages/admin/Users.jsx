import { useState, useEffect } from "react";
import AppShell from "../../components/layout/AppShell";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import api from "../../api/axios";

export default function Users() {
    const depaId = Number(localStorage.getItem("depa_id"));
    const [users, setUsers] = useState([]);
    const [departamentos, setDepartamentos] = useState([]);
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [generalError, setGeneralError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    // Form state
    const [formData, setFormData] = useState({
        nombre: "",
        apellido_p: "",
        apellido_m: "",
        celular: "",
        password: "",
        id_depa: "",
        id_rol: "",
        residente: false,
        admin: false,
        codigo: "",
    });

    useEffect(() => {
        loadUsers();
        loadCatalogs();
    }, []);

    const loadUsers = async () => {
        try {
            const res = await api.get("/admin/users");
            setUsers(res.data);
        } catch (err) {
            console.error("Error loading users:", err);
        }
    };

    const loadCatalogs = async () => {
        try {
            const [depasRes, rolesRes] = await Promise.all([
                api.get("/catalog/departamentos"),
                api.get("/catalog/roles"),
            ]);
            setDepartamentos(depasRes.data);
            setRoles(rolesRes.data);
        } catch (err) {
            console.error("Error loading catalogs:", err);
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.nombre.trim()) newErrors.nombre = "El nombre es requerido";
        if (!formData.apellido_p.trim()) newErrors.apellido_p = "El apellido paterno es requerido";
        if (!formData.celular.trim()) {
            newErrors.celular = "El celular es requerido";
        } else if (!/^\d{10}$/.test(formData.celular)) {
            newErrors.celular = "El celular debe tener 10 dígitos";
        }
        if (!formData.password.trim()) {
            newErrors.password = "La contraseña es requerida";
        } else if (formData.password.length < 8) {
            newErrors.password = "La contraseña debe tener al menos 8 caracteres";
        }
        if (!formData.id_depa) newErrors.id_depa = "El departamento es requerido";
        if (!formData.id_rol) newErrors.id_rol = "El rol es requerido";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setGeneralError("");
        setSuccessMessage("");

        if (!validateForm()) {
            setGeneralError("Por favor corrige los errores en el formulario");
            return;
        }

        setLoading(true);
        try {
            await api.post("/admin/users", formData);
            setSuccessMessage("Usuario creado exitosamente");
            setFormData({
                nombre: "",
                apellido_p: "",
                apellido_m: "",
                celular: "",
                password: "",
                id_depa: "",
                id_rol: "",
                residente: false,
                admin: false,
                codigo: "",
            });
            setErrors({});
            loadUsers();
        } catch (err) {
            if (err.response?.data?.errors) {
                setErrors(err.response.data.errors);
            } else if (err.response?.data?.message) {
                setGeneralError(err.response.data.message);
            } else {
                setGeneralError("Error al crear usuario");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        // Clear error for this field
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: "" }));
        }
    };

    return (
        <AppShell depaId={depaId}>
            <div className="space-y-6">
                <h1 className="text-3xl font-bold text-text-dark">Gestión de Usuarios</h1>

                {/* Create User Form */}
                <Card title="Crear Nuevo Usuario">
                    {generalError && (
                        <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-lg text-red-700">
                            {generalError}
                        </div>
                    )}
                    {successMessage && (
                        <div className="mb-4 p-3 bg-green-100 border border-green-300 rounded-lg text-green-700">
                            {successMessage}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Input
                                label="Nombre"
                                value={formData.nombre}
                                onChange={(e) => handleChange("nombre", e.target.value)}
                                error={errors.nombre}
                                required
                            />
                            <Input
                                label="Apellido Paterno"
                                value={formData.apellido_p}
                                onChange={(e) => handleChange("apellido_p", e.target.value)}
                                error={errors.apellido_p}
                                required
                            />
                            <Input
                                label="Apellido Materno"
                                value={formData.apellido_m}
                                onChange={(e) => handleChange("apellido_m", e.target.value)}
                                error={errors.apellido_m}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                                label="Celular"
                                value={formData.celular}
                                onChange={(e) => handleChange("celular", e.target.value)}
                                error={errors.celular}
                                placeholder="10 dígitos"
                                required
                            />
                            <Input
                                label="Contraseña"
                                type="password"
                                value={formData.password}
                                onChange={(e) => handleChange("password", e.target.value)}
                                error={errors.password}
                                placeholder="Mínimo 8 caracteres"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium text-text-dark">
                                    Departamento <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={formData.id_depa}
                                    onChange={(e) => handleChange("id_depa", e.target.value)}
                                    className={`px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary ${errors.id_depa ? "border-red-500" : "border-border-soft"
                                        }`}
                                >
                                    <option value="">Seleccionar...</option>
                                    {departamentos.map((d) => (
                                        <option key={d.id} value={d.id}>
                                            {d.nombre}
                                        </option>
                                    ))}
                                </select>
                                {errors.id_depa && <span className="text-sm text-red-500">{errors.id_depa}</span>}
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium text-text-dark">
                                    Rol <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={formData.id_rol}
                                    onChange={(e) => handleChange("id_rol", e.target.value)}
                                    className={`px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary ${errors.id_rol ? "border-red-500" : "border-border-soft"
                                        }`}
                                >
                                    <option value="">Seleccionar...</option>
                                    {roles.map((r) => (
                                        <option key={r.id} value={r.id}>
                                            {r.nombre}
                                        </option>
                                    ))}
                                </select>
                                {errors.id_rol && <span className="text-sm text-red-500">{errors.id_rol}</span>}
                            </div>

                            <Input
                                label="Código (opcional)"
                                value={formData.codigo}
                                onChange={(e) => handleChange("codigo", e.target.value)}
                                placeholder="Auto-generado si vacío"
                            />
                        </div>

                        <div className="flex gap-6">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.residente}
                                    onChange={(e) => handleChange("residente", e.target.checked)}
                                    className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                                />
                                <span className="text-sm text-text-dark">Es residente</span>
                            </label>

                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.admin}
                                    onChange={(e) => handleChange("admin", e.target.checked)}
                                    className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                                />
                                <span className="text-sm text-text-dark">Es administrador</span>
                            </label>
                        </div>

                        <Button type="submit" disabled={loading}>
                            {loading ? "Creando..." : "Crear Usuario"}
                        </Button>
                    </form>
                </Card>

                {/* Users List */}
                <Card title="Usuarios Registrados">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead>
                                <tr className="bg-gray-50">
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Celular</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Departamento</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rol</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {users.map((user) => (
                                    <tr key={user.user_id}>
                                        <td className="px-4 py-3 text-sm text-gray-900">
                                            {user.nombre} {user.apellido_p} {user.apellido_m}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-900">{user.celular}</td>
                                        <td className="px-4 py-3 text-sm text-gray-600">{user.departamento || "N/A"}</td>
                                        <td className="px-4 py-3 text-sm text-gray-600">{user.rol || "N/A"}</td>
                                        <td className="px-4 py-3 text-sm">
                                            <div className="flex gap-2">
                                                {user.admin && <Badge variant="primary">Admin</Badge>}
                                                {user.residente && <Badge variant="success">Residente</Badge>}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {users.length === 0 && (
                            <p className="text-center text-gray-500 py-8">No hay usuarios registrados</p>
                        )}
                    </div>
                </Card>
            </div>
        </AppShell>
    );
}
