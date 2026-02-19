import { useKanbanStore } from "../store/useKanbanStore";

export type AuthApi = {
  isLoggedIn: boolean;
  hasHydrated: boolean;
  login: () => void;
  logout: () => void;
};

export function useAuth(): AuthApi {
  const isLoggedIn = useKanbanStore((s) => s.isLoggedIn);
  const hasHydrated = useKanbanStore((s) => s.hasHydrated);
  const login = useKanbanStore((s) => s.login);
  const logout = useKanbanStore((s) => s.logout);

  return { isLoggedIn, hasHydrated, login, logout };
}
