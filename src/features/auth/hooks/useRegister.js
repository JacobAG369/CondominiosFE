import { useMutation } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { registerUser } from "../api/authService";

/**
 * Hook para registrar un nuevo usuario.
 * Al tener éxito redirige a /verify-email.
 */
export function useRegister() {
    const router = useRouter();

    return useMutation({
        mutationFn: registerUser,
        onSuccess: () => {
            router.navigate({ to: "/verify-email" });
        },
    });
}
