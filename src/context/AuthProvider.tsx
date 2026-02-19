import { useCallback, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { AuthContext, type AuthContextType } from "./AuthContext";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState<AuthContextType["isLoggedIn"]>(
    () => {
      if (typeof window === "undefined") return false;
      return localStorage.getItem("isLoggedIn") === "true";
    },
  );

 

  const login = useCallback(() => {
    setIsLoggedIn(true);
    if (typeof window !== "undefined") {
      localStorage.setItem("isLoggedIn", "true");
    }
  }, []);
  const logout = useCallback(() => {
    setIsLoggedIn(false);
    if (typeof window !== "undefined") {
      localStorage.setItem("isLoggedIn", "false");
    }

  }, []);
  

  const value: AuthContextType = useMemo(
    () => ({
      isLoggedIn,
      login,
      logout,
    }),
    [isLoggedIn, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
