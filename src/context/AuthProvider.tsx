import { useState, useEffect } from "react";
import type { ReactNode } from "react";
import { AuthContext, type AuthContextType } from "./AuthContext";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState<AuthContextType["isLoggedIn"]>(
    () => {
      if (typeof window === "undefined") return false;
      return localStorage.getItem("isLoggedIn") === "true";
    },
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem("isLoggedIn", isLoggedIn ? "true" : "false");
  }, [isLoggedIn]);

  const login = () => setIsLoggedIn(true);
  const logout = () => setIsLoggedIn(false);

  const value: AuthContextType = {
    isLoggedIn,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
