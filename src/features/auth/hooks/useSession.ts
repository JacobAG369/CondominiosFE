import { useQuery } from "@tanstack/react-query";
import { hasStoredAuthToken } from "../storage";
import { sessionQueryOptions } from "../session";
import { useAuth } from "./useAuth";

export function useSession() {
  const auth = useAuth();
  const query = useQuery({
    ...sessionQueryOptions(),
    enabled: hasStoredAuthToken(),
  });

  return {
    ...query,
    user: query.data ?? auth.user,
    isAuthenticated: Boolean(auth.token && (query.data ?? auth.user)),
  };
}
