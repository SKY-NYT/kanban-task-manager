import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { Text } from "../atoms/Text";
import Button from "../atoms/Buttons";
import { useKanbanStore } from "../../store/useKanbanStore";
import Menu from "../atoms/Menu";

export default function Header() {
  const { boardId } = useParams();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { data } = useKanbanStore();

  const boards = data.boards ?? [];

  const isDashboard = boardId === undefined;
  const currentBoard = boardId ? boards[Number(boardId)] : null;
  const displayTitle = isDashboard
    ? "Dashboard"
    : (currentBoard?.name ?? "Platform Launch");

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const handleEditBoard = () => {
    if (!boardId) return;
    navigate(`/boards/${boardId}/edit`);
  };

  const handleDeleteBoard = () => {
    if (!boardId) return;
    navigate(`/boards/${boardId}/delete`);
  };

  const handleAddTask = () => {
    if (boardId) {
      navigate(`/boards/${boardId}/tasks/new`);
      return;
    }

    // Dashboard: pick first board if available, otherwise create one.
    if (boards.length > 0) navigate(`/boards/0/tasks/new`);
    else navigate("/boards/new");
  };

  return (
    <header
      className={`transition-all duration-300
        fixed top-0 right-0 z-40 w-[calc(100%-300px)] h-24  flex items-center justify-between 
        bg-background-secondary  border-b border-border  px-6
      
      `}
    >
      <div
        className="flex items-center
       gap-4"
      >
        <Text
          variant="p2"
          as="h2"
          className="text-preset-black  transition-colors duration-300"
        >
          {displayTitle}
        </Text>
      </div>

      <div className="flex items-center gap-4 cursor-pointer">
        <Button
          variant="primary"
          size="md"
          className=" hidden md:block  "
          onClick={handleAddTask}
        >
          + Add New Task
        </Button>

        <button
          type="button"
          className="md:hidden bg-primary w-12 h-8 rounded-full flex items-center justify-center hover:bg-primary-hover "
        >
          <span className="text-white text-xl">+</span>
        </button>

        <div className="flex items-center gap-2">
          {!isDashboard && (
            <Menu
              ariaLabel="Options"
              editLabel="Edit Board"
              deleteLabel="Delete Board"
              logoutLabel="Logout"
              iconClassName="fill-preset-gray-300"
              buttonClassName="p-2 group cursor-pointer"
              onEdit={handleEditBoard}
              onDelete={handleDeleteBoard}
              onLogout={handleLogout}
              className="right-0 h-35"
            />
          )}
        </div>
      </div>
    </header>
  );
}
