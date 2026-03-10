import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { resetForgotPassword } from "../../../api/auth";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";

// ── Zod schema ─────────────────────────────────────────────────────────────────
const schema = z
    .object({
        password: z
            .string()
            .min(8, "La contraseña debe tener al menos 8 caracteres"),
        password_confirmation: z.string().min(1, "Confirma tu contraseña"),
    })
    .refine((data) => data.password === data.password_confirmation, {
        message: "Las contraseñas no coinciden",
        path: ["password_confirmation"],
    });

// ── Component ─────────────────────────────────────────────────────────────────
export default function StepNewPassword({ email, code }) {
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({ resolver: zodResolver(schema) });

    const mutation = useMutation({
        mutationFn: resetForgotPassword,
        onSuccess: () => {
            router.navigate({ to: "/login", search: { reset: "1" }, replace: true });
        },
    });

    const onSubmit = (values) => {
        mutation.mutate({
            email,
            code,
            password: values.password,
            password_confirmation: values.password_confirmation,
        });
    };

    return (
        <div>
            <p className="text-sm text-gray-500 mb-6">
                Elige una nueva contraseña segura de al menos 8 caracteres.
            </p>

            {mutation.isError && (
                <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-lg text-red-700 text-sm">
                    {mutation.error?.response?.data?.message ||
                        "No se pudo actualizar la contraseña. Solicita un nuevo código."}
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
                <Input
                    label="Nueva contraseña"
                    type="password"
                    placeholder="Mínimo 8 caracteres"
                    error={errors.password?.message}
                    {...register("password")}
                />

                <Input
                    label="Confirmar contraseña"
                    type="password"
                    placeholder="Repite la nueva contraseña"
                    error={errors.password_confirmation?.message}
                    {...register("password_confirmation")}
                />

                <Button
                    type="submit"
                    className="w-full"
                    disabled={mutation.isPending}
                >
                    {mutation.isPending ? "Guardando..." : "Restablecer contraseña"}
                </Button>
            </form>
        </div>
    );
}
