import { queryOptions } from "@tanstack/react-query";
import { redirect } from "@tanstack/react-router";
import api from "../../api/axios";
import { queryClient } from "../../queryClient";
import { ROLE_IDS, SESSION_QUERY_KEY } from "./constants";
import { applyAuthenticatedSession, resetAuthSession } from "./actions";
import { getStoredAuthToken } from "./storage";
import type { RoleName, User } from "./types";

interface RequireAuthOptions {
  roles?: RoleName[];
  allowUnverified?: boolean;
  onUnauthorized?: string;
}

class SessionAuthError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = "SessionAuthError";
    this.status = status;
  }
}

function toNumber(value: unknown): number | null {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  const parsedValue = Number(value);
  return Number.isNaN(parsedValue) ? null : parsedValue;
}

function getErrorStatus(error: unknown): number | null {
  if (
    typeof error !== "object" ||
    error === null ||
    !("response" in error) ||
    typeof error.response !== "object" ||
    error.response === null ||
    !("status" in error.response)
  ) {
    return null;
  }

  const status = Number(error.response.status);
  return Number.isNaN(status) ? null : status;
}

function normalizeRole(roleId: number | null, isAdmin: boolean) {
  if (roleId === ROLE_IDS.Administrador || isAdmin) {
    return {
      id: ROLE_IDS.Administrador,
      name: "Administrador" as const,
    };
  }

  return {
    id: ROLE_IDS.Residente,
    name: "Residente" as const,
  };
}

async function requestCurrentUser() {
  try {
    const response = await api.get("/user");
    return response.data;
  } catch (error) {
    if (getErrorStatus(error) === 404) {
      const fallbackResponse = await api.get("/auth/me");
      return fallbackResponse.data;
    }

    throw error;
  }
}

export function normalizeSessionUser(payload: any): User {
  const rawUser = payload?.user ?? payload ?? {};
  const persona = rawUser.persona ?? payload?.persona ?? null;
  const roleId = toNumber(payload?.id_rol ?? rawUser.id_rol);
  const isAdmin = Boolean(payload?.admin ?? rawUser.admin);
  const role = normalizeRole(roleId, isAdmin);
  const firstName = persona?.nombre ?? "";
  const lastName = persona?.apellido_p ?? "";
  const middleName = persona?.apellido_m ?? "";
  const emailVerifiedAt =
    payload?.email_verified_at ?? rawUser.email_verified_at ?? null;

  return {
    id: toNumber(rawUser.id ?? payload?.id),
    email: rawUser.email ?? payload?.email ?? "",
    departamentoId: toNumber(payload?.id_depa ?? rawUser.id_depa),
    role,
    isAdmin: role.id === ROLE_IDS.Administrador,
    isEmailVerified: Boolean(emailVerifiedAt),
    emailVerifiedAt,
    persona: persona
      ? {
          nombre: firstName,
          apellidoP: lastName,
          apellidoM: middleName,
        }
      : null,
    fullName: [firstName, lastName, middleName].filter(Boolean).join(" "),
  };
}

async function fetchSessionUser(): Promise<User> {
  const token = getStoredAuthToken();
  if (!token) {
    resetAuthSession();
    throw new SessionAuthError("Missing auth token");
  }

  try {
    const payload = await requestCurrentUser();
    return applyAuthenticatedSession(normalizeSessionUser(payload), token);
  } catch (error) {
    const status = getErrorStatus(error);

    if (status === 401 || status === 419) {
      resetAuthSession();
      throw new SessionAuthError("Invalid session", status);
    }

    throw error;
  }
}

export function isSessionAuthError(error: unknown): boolean {
  return error instanceof SessionAuthError;
}

export function sessionQueryOptions() {
  return queryOptions({
    queryKey: SESSION_QUERY_KEY,
    queryFn: fetchSessionUser,
    staleTime: 1000 * 60,
    gcTime: 1000 * 60 * 30,
    retry: false,
  });
}

export async function validateStoredSession(): Promise<User> {
  return queryClient.ensureQueryData(sessionQueryOptions());
}

export async function refreshSession(): Promise<User> {
  queryClient.removeQueries({ queryKey: SESSION_QUERY_KEY });
  return queryClient.fetchQuery({
    ...sessionQueryOptions(),
    staleTime: 0,
  });
}

export function resolveAuthenticatedPath(user: User | null | undefined): string {
  if (!user) {
    return "/login";
  }

  if (!user.isEmailVerified) {
    return "/verify-email";
  }

  return user.role.id === ROLE_IDS.Administrador ? "/admin" : "/welcome";
}

export function requireAuth(options: RequireAuthOptions = {}) {
  return async () => {
    const token = getStoredAuthToken();

    if (!token) {
      resetAuthSession();
      throw redirect({ to: "/login", replace: true });
    }

    let user: User;

    try {
      user = await validateStoredSession();
    } catch (error) {
      if (isSessionAuthError(error)) {
        throw redirect({ to: "/login", replace: true });
      }

      throw error;
    }

    if (!options.allowUnverified && !user.isEmailVerified) {
      throw redirect({ to: "/verify-email", replace: true });
    }

    if (options.roles?.length && !options.roles.includes(user.role.name)) {
      throw redirect({
        to: options.onUnauthorized ?? "/unauthorized",
        replace: true,
      });
    }

    return { user };
  };
}

export function redirectIfAuthenticated() {
  return async () => {
    const token = getStoredAuthToken();

    if (!token) {
      return;
    }

    try {
      const user = await validateStoredSession();
      throw redirect({ to: resolveAuthenticatedPath(user), replace: true });
    } catch (error) {
      if (isSessionAuthError(error)) {
        return;
      }

      throw error;
    }
  };
}

export async function resolveInitialRoute(): Promise<string> {
  const token = getStoredAuthToken();

  if (!token) {
    return "/login";
  }

  try {
    const user = await validateStoredSession();
    return resolveAuthenticatedPath(user);
  } catch (error) {
    if (isSessionAuthError(error)) {
      return "/login";
    }

    throw error;
  }
}
