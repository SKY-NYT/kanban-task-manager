import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Text } from "../atoms/Text";
import Button from "../atoms/Buttons";
import IconVerticalEllipsis from "../../assets/images/icon-vertical-ellipsis.svg?react";
import { useApp } from "../../hooks/useApp";


export default function Header() {
  const { boardId } = useParams();
  const navigate = useNavigate();
  const { logout } = useAuth();
    const { data } = useApp();

  const boards = data.boards ?? [];
  
const isDashboard = boardId === undefined;
  const currentBoard = boardId ? boards[Number(boardId)] : null;
  const displayTitle = isDashboard ? "Dashboard" : (currentBoard?.name ?? "Platform Launch");

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <header 
      className={`transition-all duration-300
        fixed top-0 right-0 z-40 w-[calc(100%-300px)] h-24  flex items-center justify-between 
        bg-background-secondary  border-b border-border  px-6
      
      `}
    >
      
      <div className="flex items-center
       gap-4">
        <Text variant="p2" as="h2" className="text-preset-black  transition-colors duration-300">
          {displayTitle}
        </Text>
      </div>

      <div className="flex items-center gap-4 cursor-pointer">
        <Button 
          variant="primary" 
          size="md" 
          className=" hidden md:block  "
          onClick={() => navigate("/add-task")}
        >
          + Add New Task
        </Button>

        <button type="button" className="md:hidden bg-primary w-12 h-8 rounded-full flex items-center justify-center hover:bg-primary-hover " >
           <span className="text-white text-xl">+</span>
        </button>

        <div className="flex items-center gap-2">
           <button
            type="button"
            onClick={handleLogout}
            className="hidden sm:block px-4 py-2"
          >
            <Text variant="p6" className="text-preset-gray-300 hover:text-danger cursor-pointer">
              Logout
            </Text>
          </button>
          
          <button aria-label="Options" type="button" className="p-2 group cursor-pointer">
            <IconVerticalEllipsis className="fill-preset-gray-300 group-hover:scale-110 transition-transform" />
          </button>
        </div>
      </div>
    </header>
  );
}