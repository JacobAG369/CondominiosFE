import { useState, useEffect } from "react";
import AppShell from "../../components/layout/AppShell";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import StatCard from "../../components/ui/StatCard";
import { useNavigate } from "react-router-dom";
import { getAdminStats } from "../../api/admin";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function AdminDashboard() {
    const depaId = Number(localStorage.getItem("depa_id"));
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    // Color palette matching the app theme
    const COLORS = {
        primary: "#B08968",
        secondary: "#DFD3C3",
        success: "#7CB342",
        danger: "#E57373",
        info: "#64B5F6",
        warning: "#FFB74D",
    };

    const CHART_COLORS = [COLORS.primary, COLORS.secondary, COLORS.success, COLORS.info, COLORS.warning, COLORS.danger];

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        try {
            const data = await getAdminStats();
            setStats(data);
        } catch (err) {
            console.error("Error loading stats:", err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <AppShell depaId={depaId}>
                <div className="flex justify-center items-center h-64">
                    <p className="text-gray-500">Cargando estadísticas...</p>
                </div>
            </AppShell>
        );
    }

    // Prepare data for charts
    const userResidentData = [
        { name: "Usuarios", value: stats?.total_users || 0 },
        { name: "Residentes", value: stats?.total_residents || 0 },
    ];

    const residentStatusData = [
        { name: "Activos", value: stats?.active_residents || 0 },
        { name: "Inactivos", value: stats?.inactive_residents || 0 },
    ];

    const departmentData = stats?.users_by_department?.map(d => ({
        name: d.departamento || `Depa ${d.id_depa}`,
        usuarios: Number(d.count)
    })) || [];

    const roleData = stats?.users_by_role?.map(r => ({
        name: r.rol,
        value: Number(r.count)
    })) || [];

    return (
        <AppShell depaId={depaId}>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold text-text-dark">Panel de Administración</h1>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard
                        title="Total Usuarios"
                        value={stats?.total_users || 0}
                        icon=""
                        color="primary"
                    />
                    <StatCard
                        title="Total Residentes"
                        value={stats?.total_residents || 0}
                        icon=""
                        color="info"
                    />
                    <StatCard
                        title="Residentes Activos"
                        value={stats?.active_residents || 0}
                        icon=""
                        color="success"
                    />
                    <StatCard
                        title="Residentes Inactivos"
                        value={stats?.inactive_residents || 0}
                        icon=""
                        color="warning"
                    />
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Usuarios vs Residentes */}
                    <Card title="Usuarios vs Residentes">
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={userResidentData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#E7DED5" />
                                <XAxis dataKey="name" stroke="#666" />
                                <YAxis stroke="#666" />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#fff',
                                        border: '1px solid #E7DED5',
                                        borderRadius: '8px'
                                    }}
                                />
                                <Bar dataKey="value" fill={COLORS.primary} radius={[8, 8, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </Card>

                    {/* Residentes: Activos vs Inactivos */}
                    <Card title="Estado de Residentes">
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={residentStatusData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, value }) => `${name}: ${value}`}
                                    outerRadius={100}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {residentStatusData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={index === 0 ? COLORS.success : COLORS.warning} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#fff',
                                        border: '1px solid #E7DED5',
                                        borderRadius: '8px'
                                    }}
                                />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </Card>

                    {/* Top 5 Departamentos */}
                    <Card title="Top Departamentos">
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={departmentData} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" stroke="#E7DED5" />
                                <XAxis type="number" stroke="#666" />
                                <YAxis dataKey="name" type="category" width={80} stroke="#666" />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#fff',
                                        border: '1px solid #E7DED5',
                                        borderRadius: '8px'
                                    }}
                                />
                                <Bar dataKey="usuarios" fill={COLORS.info} radius={[0, 8, 8, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </Card>

                    {/* Distribución por Roles */}
                    <Card title="Distribución por Roles">
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={roleData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, value }) => `${name}: ${value}`}
                                    outerRadius={100}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {roleData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#fff',
                                        border: '1px solid #E7DED5',
                                        borderRadius: '8px'
                                    }}
                                />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </Card>
                </div>

                {/* Quick Actions */}
                <Card title="Acciones Rápidas">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <Button onClick={() => navigate("/admin/users")} className="w-full">
                            Gestionar Usuarios
                        </Button>
                        <Button onClick={() => navigate("/residentes")} className="w-full">
                            Ver Residentes
                        </Button>
                        <Button onClick={() => navigate("/chat")} className="w-full">
                            Ir al Chat
                        </Button>
                        <Button onClick={() => navigate("/notifications")} className="w-full">
                            Ver Notificaciones
                        </Button>
                    </div>
                </Card>
            </div>
        </AppShell>
    );
}
