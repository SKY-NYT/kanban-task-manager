import { Outlet } from "react-router-dom";
import Header from "../organisms/Header";
import Sidebar from "../organisms/Sidebar";

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <Sidebar />
      <div className="flex flex-col min-h-screen transition-all duration-300 ml-0 md:ml-65.25 lg:ml-75">
        <Header />
        <main className="flex-1 bg-background pt-16 md:pt-24 overflow-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
