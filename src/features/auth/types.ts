import { ROLE_IDS } from "./constants";

export type RoleName = keyof typeof ROLE_IDS;
export type RoleId = (typeof ROLE_IDS)[RoleName];

export interface Role {
  id: RoleId;
  name: RoleName;
}

export interface Persona {
  nombre: string;
  apellidoP: string;
  apellidoM: string;
}

export interface User {
  id: number | null;
  email: string;
  departamentoId: number | null;
  role: Role;
  isAdmin: boolean;
  isEmailVerified: boolean;
  emailVerifiedAt: string | null;
  persona: Persona | null;
  fullName: string;
}

export interface AuthState {
  status: "anonymous" | "authenticated";
  token: string | null;
  user: User | null;
}
