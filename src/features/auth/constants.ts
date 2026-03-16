export const ROLE_IDS = {
  Administrador: 1,
  Residente: 2,
} as const;

export const SESSION_QUERY_KEY = ["auth", "session"] as const;

export const AUTH_STORAGE_KEYS = {
  token: "token",
  departmentId: "depa_id",
  roleId: "id_rol",
  admin: "admin",
  firstName: "user_nombre",
  lastName: "user_apellido_p",
  middleName: "user_apellido_m",
  emailVerified: "email_verified",
} as const;
