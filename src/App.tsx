import {
  Routes,
  Route,
  Navigate,
  Outlet,
  useLocation,
  type Location,
} from "react-router-dom";
import { lazy, Suspense } from "react";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import Spinner from "./components/atoms/Spinner";

const MainLayout = lazy(() => import("./components/templates/MainLayout"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const BoardView = lazy(() => import("./pages/BoardView"));
const TaskView = lazy(() => import("./components/molecules/TaskView"));
const Admin = lazy(() => import("./pages/Admin"));
const Login = lazy(() => import("./pages/Login"));
const NotFound = lazy(() => import("./pages/NotFound"));

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
    <Suspense
      fallback={
        <div className="fixed inset-0 bg-background">
          <Spinner />
        </div>
      }
    >
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
    </Suspense>
  );
}
