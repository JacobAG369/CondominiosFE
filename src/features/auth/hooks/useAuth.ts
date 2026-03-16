import { useSyncExternalStore } from "react";
import { authStore } from "../store";
import type { AuthState } from "../types";

export function useAuth(): AuthState {
  return useSyncExternalStore(
    authStore.subscribe,
    authStore.getState,
    authStore.getState,
  );
}
