import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "../schemas/registerSchema";
import { useRegister } from "../hooks/useRegister";
import api from "../../../api/axios";

export default function RegisterForm() {
    const { mutate: register, isPending, error } = useRegister();
    const [departamentos, setDepartamentos] = useState([]);

    // Fetch available departments for the select
    useEffect(() => {
        api
            .get("/catalog/departamentos")
            .then((res) => setDepartamentos(res.data))
            .catch(() => setDepartamentos([]));
    }, []);

    const {
        register: field,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(registerSchema),
    });

    const onSubmit = (data) => {
        // If id_depa is empty string (user didn't select), remove it
        const payload = { ...data };
        if (!payload.id_depa) delete payload.id_depa;
        register(payload);
    };

    const serverError =
        error?.response?.data?.message || error?.message || null;

    // Shared input class builder
    const inputCls = (hasError) =>
        `w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors ${hasError ? "border-red-400" : "border-[#E7DED5]"
        }`;

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
            {/* Server-level error */}
            {serverError && (
                <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                    {serverError}
                </div>
            )}

            {/* Nombre + Apellido */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-text-dark">
                        Nombre <span className="text-red-500">*</span>
                    </label>
                    <input
                        {...field("nombre")}
                        type="text"
                        placeholder="Ej: Juan"
                        className={inputCls(errors.nombre)}
                    />
                    {errors.nombre && (
                        <span className="text-xs text-red-500">{errors.nombre.message}</span>
                    )}
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-text-dark">
                        Apellido <span className="text-red-500">*</span>
                    </label>
                    <input
                        {...field("apellido")}
                        type="text"
                        placeholder="Ej: García"
                        className={inputCls(errors.apellido)}
                    />
                    {errors.apellido && (
                        <span className="text-xs text-red-500">{errors.apellido.message}</span>
                    )}
                </div>
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-text-dark">
                    Correo electrónico <span className="text-red-500">*</span>
                </label>
                <input
                    {...field("email")}
                    type="email"
                    placeholder="correo@ejemplo.com"
                    className={inputCls(errors.email)}
                />
                {errors.email && (
                    <span className="text-xs text-red-500">{errors.email.message}</span>
                )}
            </div>

            {/* Departamento */}
            <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-text-dark">
                    Departamento{" "}
                    <span className="text-gray-400 font-normal text-xs">(opcional)</span>
                </label>
                <select
                    {...field("id_depa")}
                    className={`${inputCls(errors.id_depa)} bg-white`}
                >
                    <option value="">— Sin asignar por ahora —</option>
                    {departamentos.map((d) => (
                        <option key={d.id} value={d.id}>
                            {d.nombre}
                        </option>
                    ))}
                </select>
                {errors.id_depa && (
                    <span className="text-xs text-red-500">{errors.id_depa.message}</span>
                )}
                <p className="text-xs text-gray-400 mt-0.5">
                    Necesario para acceder al chat y notificaciones del condominio.
                </p>
            </div>

            {/* Password + Confirm */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-text-dark">
                        Contraseña <span className="text-red-500">*</span>
                    </label>
                    <input
                        {...field("password")}
                        type="password"
                        placeholder="Mínimo 8 caracteres"
                        className={inputCls(errors.password)}
                    />
                    {errors.password && (
                        <span className="text-xs text-red-500">{errors.password.message}</span>
                    )}
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-text-dark">
                        Confirmar contraseña <span className="text-red-500">*</span>
                    </label>
                    <input
                        {...field("password_confirmation")}
                        type="password"
                        placeholder="Repite tu contraseña"
                        className={inputCls(errors.password_confirmation)}
                    />
                    {errors.password_confirmation && (
                        <span className="text-xs text-red-500">
                            {errors.password_confirmation.message}
                        </span>
                    )}
                </div>
            </div>

            <button
                type="submit"
                disabled={isPending}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#B08968] text-white font-medium rounded-lg
          hover:bg-[#9a7455] active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
                {isPending && (
                    <svg
                        className="animate-spin h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                    </svg>
                )}
                {isPending ? "Creando cuenta..." : "Crear cuenta"}
            </button>
        </form>
    );
}
