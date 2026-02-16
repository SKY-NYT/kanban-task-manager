import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { Text } from "../atoms/Text";
import Button from "../atoms/Buttons";
import { useKanbanStore } from "../../store/useKanbanStore";
import Menu from "../atoms/Menu";
import { Logo } from "../molecules/Logo";
import ChevronDown from "../../assets/images/icon-chevron-down.svg?react";
import ChevronUp from "../../assets/images/icon-chevron-up.svg?react";
import IconAddTaskMobile from "../../assets/images/icon-add-task-mobile.svg?react";
import MobileBoardsModal from "../molecules/MobileBoardsModal";
import { useShallow } from "zustand/shallow";

export default function Header() {
  const { boardId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const { boards, sidebarVisible } = useKanbanStore(
    useShallow((s) => ({
      boards: s.data.boards,
      sidebarVisible: s.sidebarVisible,
    })),
  );
  const [isMobileBoardsOpen, setIsMobileBoardsOpen] = useState(false);

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
    navigate(`/boards/${boardId}/edit`, {
      state: { backgroundLocation: location },
    });
  };

  const handleDeleteBoard = () => {
    if (!boardId) return;
    navigate(`/boards/${boardId}/delete`, {
      state: { backgroundLocation: location },
    });
  };

  const handleAddTask = () => {
    if (boardId) {
      navigate(`/boards/${boardId}/tasks/new`, {
        state: { backgroundLocation: location },
      });
      return;
    }

    if (boards.length > 0)
      navigate(`/boards/0/tasks/new`, {
        state: { backgroundLocation: location },
      });
    else
      navigate("/boards/new", {
        state: { backgroundLocation: location },
      });
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 h-16 md:h-20.25 lg:h-24 bg-background-secondary border-b border-border">
      <div className="flex h-full items-center">
        {!sidebarVisible && (
          <div className="hidden md:flex h-full w-50.25 lg:w-52.25 items-center border-r border-border px-6">
            <Logo />
          </div>
        )}

        <div
          className={`flex flex-1 items-center justify-between ${
            sidebarVisible ? "px-4 md:px-6" : "px-4 md:px-6 lg:px-8"
          } ${sidebarVisible ? "md:ml-65 lg:ml-75" : ""}`}
        >
          <div className="flex items-center gap-4">
            <div className="md:hidden">
              <Logo />
            </div>

            {isDashboard ? (
              <Text
                variant="p2"
                as="h2"
                className="text-preset-black transition-colors duration-300 md:text-[20px] md:leading-[normal] lg:text-h-xl"
              >
                {displayTitle}
              </Text>
            ) : (
              <>
                <button
                  type="button"
                  className="md:hidden flex items-center gap-2"
                  aria-label="Select board"
                  aria-haspopup="dialog"
                  onClick={() => setIsMobileBoardsOpen((v) => !v)}
                >
                  <Text
                    variant="p2"
                    as="h2"
                    className="text-preset-black transition-colors duration-300"
                  >
                    {displayTitle}
                  </Text>
                  {isMobileBoardsOpen ? (
                    <ChevronUp aria-hidden="true" />
                  ) : (
                    <ChevronDown aria-hidden="true" />
                  )}
                </button>

                <Text
                  variant="p2"
                  as="h2"
                  className="hidden md:block text-preset-black transition-colors duration-300 md:text-[20px] md:leading-[normal] lg:text-h-xl"
                >
                  {displayTitle}
                </Text>
              </>
            )}
          </div>

          <div className="flex items-center gap-4">
            {!isDashboard && (
              <Button
                variant="primary"
                size="md"
                className="hidden md:block h-12 px-6"
                onClick={handleAddTask}
              >
                + Add New Task
              </Button>
            )}

            {!isDashboard && (
              <button
                type="button"
                className="md:hidden bg-primary w-12 h-8 rounded-3xl flex items-center justify-center hover:bg-primary-hover"
                onClick={handleAddTask}
                aria-label="Add new task"
              >
                <IconAddTaskMobile className="text-white" aria-hidden="true" />
              </button>
            )}

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
        </div>
      </div>

      {!isDashboard && (
        <MobileBoardsModal
          isOpen={isMobileBoardsOpen}
          onClose={() => setIsMobileBoardsOpen(false)}
        />
      )}
    </header>
  );
}
