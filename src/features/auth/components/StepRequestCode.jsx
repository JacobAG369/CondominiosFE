import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { sendResetCode } from "../../../api/auth";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";

// ── Zod schema ─────────────────────────────────────────────────────────────────
const schema = z.object({
    email: z.string().min(1, "El correo es requerido").email("Ingresa un correo válido"),
});

// ── Component ─────────────────────────────────────────────────────────────────
export default function StepRequestCode() {
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({ resolver: zodResolver(schema) });

    const mutation = useMutation({
        mutationFn: sendResetCode,
        onSuccess: (_data, variables) => {
            router.navigate({
                to: "/forgot-password",
                search: { step: "2", email: variables.email },
                replace: true,
            });
        },
    });

    const onSubmit = (values) => {
        mutation.mutate({ email: values.email });
    };

    return (
        <div>
            <p className="text-sm text-gray-500 mb-6">
                Ingresa tu correo electrónico y te enviaremos un código de 6 dígitos para
                restablecer tu contraseña.
            </p>

            {mutation.isError && (
                <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-lg text-red-700 text-sm">
                    {mutation.error?.response?.data?.message || "Error al enviar el código. Intenta de nuevo."}
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
                <Input
                    label="Correo electrónico"
                    type="email"
                    placeholder="tu@correo.com"
                    error={errors.email?.message}
                    {...register("email")}
                />

                <Button
                    type="submit"
                    className="w-full"
                    disabled={mutation.isPending}
                >
                    {mutation.isPending ? "Enviando código..." : "Enviar código"}
                </Button>
            </form>
        </div>
    );
}
