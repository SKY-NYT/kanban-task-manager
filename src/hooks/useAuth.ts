import { useKanbanStore } from "../store/useKanbanStore";

export type AuthApi = {
  isLoggedIn: boolean;
  login: () => void;
  logout: () => void;
};

export function useAuth(): AuthApi {
  const isLoggedIn = useKanbanStore((s) => s.isLoggedIn);
  const login = useKanbanStore((s) => s.login);
  const logout = useKanbanStore((s) => s.logout);

  return { isLoggedIn, login, logout };
}
