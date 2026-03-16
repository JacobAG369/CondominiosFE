import { getStoredAuthToken, getStoredUserSnapshot } from "./storage";
import type { AuthState, User } from "./types";

type Listener = () => void;

const initialToken = getStoredAuthToken();

let currentState: AuthState = {
  status: initialToken ? "authenticated" : "anonymous",
  token: initialToken,
  user: initialToken ? getStoredUserSnapshot() : null,
};

const listeners = new Set<Listener>();

function emitChange(): void {
  listeners.forEach((listener) => listener());
}

export const authStore = {
  getState: () => currentState,
  subscribe: (listener: Listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  setState: (nextState: AuthState | ((state: AuthState) => AuthState)) => {
    currentState =
      typeof nextState === "function" ? nextState(currentState) : nextState;
    emitChange();
  },
  setAuthenticated: (token: string, user: User) => {
    currentState = {
      status: "authenticated",
      token,
      user,
    };
    emitChange();
  },
  clear: () => {
    currentState = {
      status: "anonymous",
      token: null,
      user: null,
    };
    emitChange();
  },
};
