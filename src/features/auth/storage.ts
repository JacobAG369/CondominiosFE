import { AUTH_STORAGE_KEYS, ROLE_IDS } from "./constants";
import type { User } from "./types";

type StorageKind = "local" | "session";

const SNAPSHOT_KEYS = [
  AUTH_STORAGE_KEYS.departmentId,
  AUTH_STORAGE_KEYS.roleId,
  AUTH_STORAGE_KEYS.admin,
  AUTH_STORAGE_KEYS.firstName,
  AUTH_STORAGE_KEYS.lastName,
  AUTH_STORAGE_KEYS.middleName,
  AUTH_STORAGE_KEYS.emailVerified,
] as const;

function getStorage(kind: StorageKind): Storage | null {
  if (typeof window === "undefined") {
    return null;
  }

  return kind === "local" ? window.localStorage : window.sessionStorage;
}

function getAllStorages(): Storage[] {
  return [getStorage("local"), getStorage("session")].filter(
    (storage): storage is Storage => Boolean(storage),
  );
}

function clearSnapshot(storage: Storage): void {
  SNAPSHOT_KEYS.forEach((key) => storage.removeItem(key));
}

function toNumber(value: string | null): number | null {
  if (!value) {
    return null;
  }

  const parsedValue = Number(value);
  return Number.isNaN(parsedValue) ? null : parsedValue;
}

function getStorageWithToken(): Storage | null {
  const localStorageRef = getStorage("local");
  if (localStorageRef?.getItem(AUTH_STORAGE_KEYS.token)) {
    return localStorageRef;
  }

  const sessionStorageRef = getStorage("session");
  if (sessionStorageRef?.getItem(AUTH_STORAGE_KEYS.token)) {
    return sessionStorageRef;
  }

  return localStorageRef ?? sessionStorageRef;
}

function getRoleName(roleId: number | null, isAdmin: boolean) {
  if (roleId === ROLE_IDS.Administrador || isAdmin) {
    return "Administrador";
  }

  return "Residente";
}

function getRoleId(roleId: number | null, isAdmin: boolean) {
  if (roleId === ROLE_IDS.Administrador || isAdmin) {
    return ROLE_IDS.Administrador;
  }

  return ROLE_IDS.Residente;
}

export function getStoredAuthToken(): string | null {
  return (
    getStorage("local")?.getItem(AUTH_STORAGE_KEYS.token) ??
    getStorage("session")?.getItem(AUTH_STORAGE_KEYS.token) ??
    null
  );
}

export function hasStoredAuthToken(): boolean {
  return Boolean(getStoredAuthToken());
}

export function setStoredAuthToken(
  token: string,
  storageKind: StorageKind = "local",
): void {
  const targetStorage = getStorage(storageKind);
  const otherStorage = getStorage(storageKind === "local" ? "session" : "local");

  targetStorage?.setItem(AUTH_STORAGE_KEYS.token, token);
  otherStorage?.removeItem(AUTH_STORAGE_KEYS.token);
}

export function persistUserSnapshot(user: User): void {
  getAllStorages().forEach((storage) => {
    clearSnapshot(storage);

    if (user.departamentoId !== null) {
      storage.setItem(
        AUTH_STORAGE_KEYS.departmentId,
        String(user.departamentoId),
      );
    }

    storage.setItem(AUTH_STORAGE_KEYS.roleId, String(user.role.id));
    storage.setItem(AUTH_STORAGE_KEYS.admin, String(user.isAdmin));
    storage.setItem(
      AUTH_STORAGE_KEYS.emailVerified,
      String(user.isEmailVerified),
    );

    if (user.persona?.nombre) {
      storage.setItem(AUTH_STORAGE_KEYS.firstName, user.persona.nombre);
    }

    if (user.persona?.apellidoP) {
      storage.setItem(AUTH_STORAGE_KEYS.lastName, user.persona.apellidoP);
    }

    if (user.persona?.apellidoM) {
      storage.setItem(AUTH_STORAGE_KEYS.middleName, user.persona.apellidoM);
    }
  });
}

export function getStoredUserSnapshot(): User | null {
  const token = getStoredAuthToken();
  if (!token) {
    return null;
  }

  const storage = getStorageWithToken();
  if (!storage) {
    return null;
  }

  const roleId = toNumber(storage.getItem(AUTH_STORAGE_KEYS.roleId));
  const isAdmin = storage.getItem(AUTH_STORAGE_KEYS.admin) === "true";
  const firstName = storage.getItem(AUTH_STORAGE_KEYS.firstName) ?? "";
  const lastName = storage.getItem(AUTH_STORAGE_KEYS.lastName) ?? "";
  const middleName = storage.getItem(AUTH_STORAGE_KEYS.middleName) ?? "";
  const hasPersona = Boolean(firstName || lastName || middleName);
  const normalizedRoleId = getRoleId(roleId, isAdmin);

  return {
    id: null,
    email: "",
    departamentoId: toNumber(storage.getItem(AUTH_STORAGE_KEYS.departmentId)),
    role: {
      id: normalizedRoleId,
      name: getRoleName(roleId, isAdmin),
    },
    isAdmin,
    isEmailVerified: storage.getItem(AUTH_STORAGE_KEYS.emailVerified) === "true",
    emailVerifiedAt: null,
    persona: hasPersona
      ? {
          nombre: firstName,
          apellidoP: lastName,
          apellidoM: middleName,
        }
      : null,
    fullName: [firstName, lastName, middleName].filter(Boolean).join(" "),
  };
}

export function clearPersistedAuth(): void {
  getAllStorages().forEach((storage) => {
    storage.removeItem(AUTH_STORAGE_KEYS.token);
    clearSnapshot(storage);
  });
}
