import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./components/templates/MainLayout";
import Dashboard from "./pages/Dashboard";
import BoardView from "./pages/BoardView";
import Admin from "./pages/Admin";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import { ProtectedRoute } from "./routes/ProtectedRoute";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="/board/:boardId" element={<BoardView />} />
        <Route path="/admin" element={<Admin />} />
      </Route>
      <Route path="/404" element={<NotFound />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
}
