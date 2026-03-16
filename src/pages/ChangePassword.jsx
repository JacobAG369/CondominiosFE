import { useState } from "react";
import { useRouter } from "@tanstack/react-router";
import { changePassword } from "../api/auth";
import AppShell from "../components/layout/AppShell";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import { resetAuthSession } from "../features/auth/actions";

export default function ChangePassword() {
    const router = useRouter();

    const [form, setForm] = useState({
        current_password: "",
        new_password: "",
        new_password_confirmation: "",
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        // Validación mínima en cliente
        if (form.new_password !== form.new_password_confirmation) {
            setError("Las contraseñas nuevas no coinciden.");
            return;
        }

        setLoading(true);
        try {
            await changePassword({
                current_password: form.current_password,
                new_password: form.new_password,
                new_password_confirmation: form.new_password_confirmation,
            });

            // Cerrar sesión local y redirigir al login
            resetAuthSession();
            alert("Contraseña actualizada, por favor inicia sesión nuevamente.");
            router.navigate({ to: "/login", replace: true });
        } catch (err) {
            console.error("CHANGE PASSWORD ERROR:", err);
            const msg =
                err.response?.data?.message ||
                "Error al cambiar la contraseña. Verifica tu contraseña actual.";
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AppShell showBackButton>
            <div className="max-w-md mx-auto">
                <Card>
                    <h2 className="text-2xl font-bold text-text-dark mb-6">
                        Cambiar Contraseña
                    </h2>

                    {error && (
                        <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-lg text-red-700 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Input
                            label="Contraseña actual"
                            type="password"
                            name="current_password"
                            placeholder="Tu contraseña actual"
                            value={form.current_password}
                            onChange={handleChange}
                            required
                        />

                        <Input
                            label="Nueva contraseña"
                            type="password"
                            name="new_password"
                            placeholder="Mínimo 8 caracteres"
                            value={form.new_password}
                            onChange={handleChange}
                            required
                        />

                        <Input
                            label="Confirmar nueva contraseña"
                            type="password"
                            name="new_password_confirmation"
                            placeholder="Repite la nueva contraseña"
                            value={form.new_password_confirmation}
                            onChange={handleChange}
                            required
                        />

                        <Button type="submit" disabled={loading} className="w-full">
                            {loading ? "Guardando..." : "Cambiar Contraseña"}
                        </Button>
                    </form>
                </Card>
            </div>
        </AppShell>
    );
}
