import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./components/templates/MainLayout";
import Dashboard from "./pages/Dashboard";
import BoardView from "./pages/BoardView";
import TaskView from "./components/molecules/TaskView";
import Admin from "./pages/Admin";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import AddBoardModal from "./components/molecules/AddBoardModal";
import AddTaskModal from "./components/molecules/AddTaskModal";
import DeleteBoardModal from "./components/molecules/DeleteBoardModal";
import DeleteTaskModal from "./components/molecules/DeleteTaskModal";
import EditTaskModal from "./components/molecules/EditTaskModal";
import EditBoardModal from "./components/molecules/EditBoardModal";

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
        <Route path="boards/new" element={<AddBoardModal />} />
        <Route path="boards/:boardId/tasks/new" element={<AddTaskModal />} />
        <Route path="boards/:boardId/delete" element={<DeleteBoardModal />} />
        <Route path="boards/:boardId/edit" element={<EditBoardModal />} />
        <Route
          path="boards/:boardId/tasks/:columnIndex/:taskIndex/edit"
          element={<EditTaskModal />}
        />
        <Route
          path="boards/:boardId/tasks/:columnIndex/:taskIndex/delete"
          element={<DeleteTaskModal />}
        />

        <Route path="boards/:boardId" element={<BoardView />}/>
          <Route path="boards/:boardId/tasks/:columnIndex/:taskIndex" element={<TaskView />} />
        
        <Route path="admin" element={<Admin />} />
      </Route>

      <Route path="/404" element={<NotFound />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
}
