import {
  Routes,
  Route,
  Navigate,
  Outlet,
  useLocation,
  type Location,
} from "react-router-dom";
import MainLayout from "./components/templates/MainLayout";
import Dashboard from "./pages/Dashboard";
import BoardView from "./pages/BoardView";
import TaskView from "./components/molecules/TaskView";
import Admin from "./pages/Admin";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import { ProtectedRoute } from "./routes/ProtectedRoute";

function ProtectedOutlet() {
  return (
    <ProtectedRoute>
      <Outlet />
    </ProtectedRoute>
  );
}

export default function App() {
  const location = useLocation();
  const state = location.state as { backgroundLocation?: Location } | null;
  const backgroundLocation = state?.backgroundLocation;

  return (
    <>
      <Routes location={backgroundLocation ?? location}>
        <Route path="/login" element={<Login />} />

        <Route
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />

          
          <Route path="boards/:boardId" element={<BoardView />} />

          <Route
            path="boards/:boardId/tasks/:columnIndex/:taskIndex"
            element={<TaskView />}
          />

          <Route path="admin" element={<Admin />} />
        </Route>

        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>

      {backgroundLocation && (
        <Routes>
          <Route element={<ProtectedOutlet />}>
            <Route
              path="boards/:boardId/tasks/:columnIndex/:taskIndex"
              element={<TaskView />}
            />
          </Route>
        </Routes>
      )}
    </>
  );
}
