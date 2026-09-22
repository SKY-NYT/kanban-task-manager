import { useKanbanStore } from "../store/useKanbanStore";

export type AuthApi = {
  isLoggedIn: boolean;
  hasHydrated: boolean;
  login: () => void;
  logout: () => void;
};

export function useAuth(): AuthApi {
  const {isLoggedIn, hasHydrated, login, logout} = useKanbanStore();

  return { isLoggedIn, hasHydrated, login, logout };
}
