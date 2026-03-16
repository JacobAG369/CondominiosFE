import { queryClient } from "../../queryClient";
import { SESSION_QUERY_KEY } from "./constants";
import { authStore } from "./store";
import {
  clearPersistedAuth,
  getStoredAuthToken,
  persistUserSnapshot,
} from "./storage";
import type { User } from "./types";

export function applyAuthenticatedSession(
  user: User,
  token = getStoredAuthToken(),
): User {
  if (!token) {
    authStore.clear();
    return user;
  }

  persistUserSnapshot(user);
  authStore.setAuthenticated(token, user);
  queryClient.setQueryData(SESSION_QUERY_KEY, user);
  return user;
}

export function resetAuthSession(): void {
  clearPersistedAuth();
  authStore.clear();
  queryClient.removeQueries({ queryKey: SESSION_QUERY_KEY });
}
