// AppProvider.tsx
import { useState, type ReactNode } from "react";
import { AppContext, type Data } from "./AppContext";
import boardData from "../data/data.json";

export function AppProvider({ children }: { children: ReactNode }) {
  // Turn the JSON into state
  const [data, setData] = useState<Data>(boardData);
  const [sidebarVisible, setSidebarVisible] = useState(() => {
    if (typeof window === "undefined") return true;
    return window.matchMedia("(min-width: 768px)").matches;
  });

  const toggleSidebar = () => setSidebarVisible((prev) => !prev);

  return (
    <AppContext.Provider
      value={{
        data,
        setData,
        sidebarVisible,
        setSidebarVisible,
        toggleSidebar,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
