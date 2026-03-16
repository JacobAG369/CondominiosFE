import { useState, useEffect, useRef } from "react";
import AppShell from "../../components/layout/AppShell";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Badge from "../../components/ui/Badge";
import AnimatedAlert from "../../components/ui/AnimatedAlert";
import LoadingButton from "../../components/ui/LoadingButton";
import api from "../../api/axios";
import { useAuth } from "../../features/auth/hooks/useAuth";

export default function Users() {
    const { user } = useAuth();
    const depaId = user?.departamentoId ?? undefined;
    const [users, setUsers] = useState([]);
    const [departamentos, setDepartamentos] = useState([]);
    const [roles, setRoles] = useState([]);
    const [isSaving, setIsSaving] = useState(false);
    const [fieldErrors, setFieldErrors] = useState({});
    const [alert, setAlert] = useState({ show: false, type: "info", title: "", message: "" });
    const alertTimerRef = useRef(null);

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

    const showAlert = (type, title, message) => {
        // Clear any existing timer
        if (alertTimerRef.current) {
            clearTimeout(alertTimerRef.current);
        }

        setAlert({ show: true, type, title, message });

        // Auto-close after 2500ms
        alertTimerRef.current = setTimeout(() => {
            setAlert((prev) => ({ ...prev, show: false }));
        }, 2500);
    };

    const closeAlert = () => {
        if (alertTimerRef.current) {
            clearTimeout(alertTimerRef.current);
        }
        setAlert((prev) => ({ ...prev, show: false }));
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

        setFieldErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        closeAlert();
        setFieldErrors({});

        if (!validateForm()) {
            showAlert("error", "Error de validación", "Por favor corrige los errores en el formulario");
            return;
        }

        setIsSaving(true);
        try {
            await api.post("/admin/users", formData);
            showAlert("success", "Usuario creado", "El usuario se creó exitosamente");
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
            setFieldErrors({});
            loadUsers();
        } catch (err) {
            if (err.response?.status === 422 && err.response?.data?.errors) {
                // Map Laravel validation errors to field errors (take first message per field)
                const backendErrors = {};
                Object.keys(err.response.data.errors).forEach((key) => {
                    backendErrors[key] = err.response.data.errors[key][0];
                });
                setFieldErrors(backendErrors);
                showAlert("error", "Error de validación", "Revisa los campos marcados en rojo");
            } else if (err.response?.data?.message) {
                showAlert("error", "Error", err.response.data.message);
            } else {
                showAlert("error", "Error", "Hubo un error al crear el usuario. Intenta de nuevo.");
            }
        } finally {
            setIsSaving(false);
        }
    };

    const handleChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        // Clear error for this field
        if (fieldErrors[field]) {
            setFieldErrors((prev) => ({ ...prev, [field]: "" }));
        }
    };

    return (
        <AppShell depaId={depaId} showBackButton={true}>
            <div className="space-y-6">
                <h1 className="text-3xl font-bold text-text-dark">Gestión de Usuarios</h1>

                {/* Create User Form */}
                <Card title="Crear Nuevo Usuario">
                    <div className="mb-4">
                        <AnimatedAlert
                            show={alert.show}
                            type={alert.type}
                            title={alert.title}
                            message={alert.message}
                            onClose={closeAlert}
                        />
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Input
                                label="Nombre"
                                value={formData.nombre}
                                onChange={(e) => handleChange("nombre", e.target.value)}
                                error={fieldErrors.nombre}
                                required
                            />
                            <Input
                                label="Apellido Paterno"
                                value={formData.apellido_p}
                                onChange={(e) => handleChange("apellido_p", e.target.value)}
                                error={fieldErrors.apellido_p}
                                required
                            />
                            <Input
                                label="Apellido Materno"
                                value={formData.apellido_m}
                                onChange={(e) => handleChange("apellido_m", e.target.value)}
                                error={fieldErrors.apellido_m}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                                label="Celular"
                                value={formData.celular}
                                onChange={(e) => handleChange("celular", e.target.value)}
                                error={fieldErrors.celular}
                                placeholder="10 dígitos"
                                required
                            />
                            <Input
                                label="Contraseña"
                                type="password"
                                value={formData.password}
                                onChange={(e) => handleChange("password", e.target.value)}
                                error={fieldErrors.password}
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
                                    className={`px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B08968]/30 focus:border-[#B08968] ${fieldErrors.id_depa ? "border-red-500" : "border-[#E7DED5]"
                                        }`}
                                >
                                    <option value="">Seleccionar...</option>
                                    {departamentos.map((d) => (
                                        <option key={d.id} value={d.id}>
                                            {d.nombre}
                                        </option>
                                    ))}
                                </select>
                                {fieldErrors.id_depa && <span className="text-xs text-red-700">{fieldErrors.id_depa}</span>}
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium text-text-dark">
                                    Rol <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={formData.id_rol}
                                    onChange={(e) => handleChange("id_rol", e.target.value)}
                                    className={`px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B08968]/30 focus:border-[#B08968] ${fieldErrors.id_rol ? "border-red-500" : "border-[#E7DED5]"
                                        }`}
                                >
                                    <option value="">Seleccionar...</option>
                                    {roles.map((r) => (
                                        <option key={r.id} value={r.id}>
                                            {r.nombre}
                                        </option>
                                    ))}
                                </select>
                                {fieldErrors.id_rol && <span className="text-xs text-red-700">{fieldErrors.id_rol}</span>}
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

                        <LoadingButton type="submit" isLoading={isSaving}>
                            Crear Usuario
                        </LoadingButton>
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
