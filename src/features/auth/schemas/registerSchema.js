import { z } from "zod";

export const registerSchema = z
    .object({
        nombre: z
            .string()
            .min(2, "El nombre debe tener al menos 2 caracteres")
            .max(50, "El nombre es muy largo"),
        apellido: z
            .string()
            .min(2, "El apellido debe tener al menos 2 caracteres")
            .max(50, "El apellido es muy largo"),
        email: z
            .string()
            .min(1, "El correo es requerido")
            .email("Ingresa un correo electrónico válido"),
        password: z
            .string()
            .min(8, "La contraseña debe tener al menos 8 caracteres"),
        password_confirmation: z
            .string()
            .min(1, "Debes confirmar la contraseña"),
        // Departamento opcional — HTML select devuelve string, lo convertimos a número
        id_depa: z.coerce.number().positive("Selecciona un departamento válido").optional().or(z.literal("")),
    })
    .refine((data) => data.password === data.password_confirmation, {
        message: "Las contraseñas no coinciden",
        path: ["password_confirmation"],
    });
