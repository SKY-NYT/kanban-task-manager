import { Outlet } from "react-router-dom";
import { useEffect } from "react";
import Header from "../organisms/Header";
import Sidebar from "../organisms/Sidebar";
import { useKanbanStore } from "../../store/useKanbanStore";

export default function MainLayout() {
  const ensureRemoteDataLoaded = useKanbanStore(
    (s) => s.ensureRemoteDataLoaded,
  );

  useEffect(() => {
    void ensureRemoteDataLoaded();
  }, [ensureRemoteDataLoaded]);

  return (
    <div className="flex h-screen bg-background text-foreground  transition-colors duration-300">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <Header />
        <main className="flex-1 overflow-auto bg-[--color-background-secondary] dark:bg-[--color-dark-background-secondary] p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
