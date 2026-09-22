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
import { Text } from "./components/atoms/Text";
import Spinner from "./components/atoms/Spinner";

const MainLayout = lazy(() => import("./components/templates/MainLayout"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const BoardView = lazy(() => import("./pages/BoardView"));
const TaskView = lazy(() => import("./components/molecules/TaskView"));
const Admin = lazy(() => import("./pages/Admin"));
const Login = lazy(() => import("./pages/Login"));
const NotFound = lazy(() => import("./pages/NotFound"));

const AddBoardModal = lazy(
  () => import("./components/molecules/AddBoardModal"),
);
const AddTaskModal = lazy(() => import("./components/molecules/AddTaskModal"));
const DeleteBoardModal = lazy(
  () => import("./components/molecules/DeleteBoardModal"),
);
const DeleteTaskModal = lazy(
  () => import("./components/molecules/DeleteTaskModal"),
);
const EditTaskModal = lazy(
  () => import("./components/molecules/EditTaskModal"),
);
const EditBoardModal = lazy(
  () => import("./components/molecules/EditBoardModal"),
);

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
      <Suspense
        fallback={
          <div className="fixed inset-0 flex items-center justify-center bg-background">
            <div className="text-center flex flex-col items-center gap-4">
              <Spinner size="lg" />
              <div>
                <Text variant="p2" className="text-gray-400 mb-2">
                  Loading…
                </Text>
                <Text variant="p5" className="text-preset-gray-300">
                  Preparing the dashboard.
                </Text>
              </div>
            </div>
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

            {/* Board pages */}
            <Route path="boards/:boardId" element={<BoardView />} />

            <Route path="boards/new" element={<AddBoardModal />} />
            <Route
              path="boards/:boardId/tasks/new"
              element={<AddTaskModal />}
            />
            <Route
              path="boards/:boardId/delete"
              element={<DeleteBoardModal />}
            />
            <Route path="boards/:boardId/edit" element={<EditBoardModal />} />
            <Route
              path="boards/:boardId/tasks/:columnIndex/:taskIndex/edit"
              element={<EditTaskModal />}
            />
            <Route
              path="boards/:boardId/tasks/:columnIndex/:taskIndex/delete"
              element={<DeleteTaskModal />}
            />
            <Route
              path="boards/:boardId/tasks/:columnIndex/:taskIndex"
              element={<TaskView />}
            />

            <Route path="admin" element={<Admin />} />
          </Route>

          <Route path="/404" element={<NotFound />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>

        {/* When a modal is opened from within the app, keep the previous screen rendered as the background */}
        {backgroundLocation && (
          <Routes>
            <Route element={<ProtectedOutlet />}>
              <Route path="boards/new" element={<AddBoardModal />} />
              <Route
                path="boards/:boardId/tasks/new"
                element={<AddTaskModal />}
              />
              <Route
                path="boards/:boardId/delete"
                element={<DeleteBoardModal />}
              />
              <Route path="boards/:boardId/edit" element={<EditBoardModal />} />
              <Route
                path="boards/:boardId/tasks/:columnIndex/:taskIndex"
                element={<TaskView />}
              />
              <Route
                path="boards/:boardId/tasks/:columnIndex/:taskIndex/edit"
                element={<EditTaskModal />}
              />
              <Route
                path="boards/:boardId/tasks/:columnIndex/:taskIndex/delete"
                element={<DeleteTaskModal />}
              />
            </Route>
          </Routes>
        )}
      </Suspense>
    </>
  );
}
