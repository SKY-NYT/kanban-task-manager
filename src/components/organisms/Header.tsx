import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Text } from "../atoms/Text";
import Button from "../atoms/Buttons";
import IconVerticalEllipsis from "../../assets/images/icon-vertical-ellipsis.svg?react";
import { useApp } from "../../hooks/useApp";
import { Logo } from "../molecules/Logo";
import IconChevronDown from "../../assets/images/icon-chevron-down.svg?react";
import IconAddTaskMobile from "../../assets/images/icon-add-task-mobile.svg?react";

export default function Header() {
  const { boardId } = useParams();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { data, sidebarVisible, toggleSidebar } = useApp();

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

  return (
    <header
      className={`transition-all duration-300
        fixed top-0 right-0 z-40 h-16 md:h-24 flex items-center justify-between 
        bg-background-secondary border-b border-border px-4 md:px-6
        left-0 md:left-65.25 lg:left-75`}
    >
      <div className="flex items-center gap-4">
        <div className="md:hidden">
          <Logo />
        </div>

        <button
          type="button"
          onClick={toggleSidebar}
          className="md:hidden inline-flex items-center gap-2"
          aria-label="Select board"
        >
          <Text variant="p2" as="h1" className="text-foreground">
            {displayTitle}
          </Text>
          <IconChevronDown
            className={`fill-primary transition-transform ${
              sidebarVisible ? "rotate-180" : "rotate-0"
            }`}
          />
        </button>

        <div className="hidden md:block">
          <Text
            variant="p1"
            as="h1"
            className="text-foreground transition-colors duration-300"
          >
            {displayTitle}
          </Text>
        </div>
      </div>

      <div className="flex items-center gap-4 cursor-pointer">
        <Button
          variant="primary"
          size="md"
          className=" hidden md:block  "
          disabled
        >
          + Add New Task
        </Button>

        <button
          type="button"
          disabled
          className="md:hidden bg-primary w-12 h-12 rounded-full flex items-center justify-center hover:bg-primary-hover"
          aria-label="Add new task"
        >
          <IconAddTaskMobile className="fill-white" />
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleLogout}
            className="hidden sm:block px-4 py-2"
          >
            <Text
              variant="p6"
              className="text-preset-gray-300 hover:text-danger cursor-pointer"
            >
              Logout
            </Text>
          </button>

          <button
            aria-label="Options"
            type="button"
            className="p-2 group cursor-pointer"
          >
            <IconVerticalEllipsis className="fill-preset-gray-300 group-hover:scale-110 transition-transform" />
          </button>
        </div>
      </div>
    </header>
  );
}
