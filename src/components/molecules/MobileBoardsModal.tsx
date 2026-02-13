import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useKanbanStore } from "../../store/useKanbanStore";
import Modal from "../atoms/Modal";
import { Text } from "../atoms/Text";
import IconBoard from "../../assets/images/icon-board.svg?react";
import IconDarkTheme from "../../assets/images/icon-dark-theme.svg?react";
import IconLightTheme from "../../assets/images/icon-light-theme.svg?react";

type MobileBoardsModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function MobileBoardsModal({
  isOpen,
  onClose,
}: MobileBoardsModalProps) {
  const { boardId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { data, theme, toggleTheme } = useKanbanStore();

  const boards = data.boards ?? [];
  const activeIndex = boardId ? Number(boardId) : 0;

  if (!isOpen) return null;

  return (
    <Modal
      onClose={onClose}
      overlayClassName="top-16 items-start"
      panelClassName="mx-auto w-full max-w-[264px] bg-background-secondary rounded-lg p-4 mt-0 shadow-[0_10px_20px_0_rgba(54,78,126,0.25)]"
    >
      <div className="flex flex-col gap-4">
        <Text variant="p4" className="text-gray-400 px-2">
          ALL BOARDS ({boards.length})
        </Text>

        <ul className="flex flex-col">
          {boards.map((board, index) => {
            const isActive = index === activeIndex;
            return (
              <li key={index}>
                <button
                  type="button"
                  onClick={() => {
                    navigate(`/boards/${index}`);
                    onClose();
                  }}
                  className={
                    "flex w-full items-center gap-3 py-3 pl-4 pr-6 rounded-r-full transition-colors " +
                    (isActive
                      ? "bg-primary text-white"
                      : "text-gray-400 hover:bg-interactive-dynamic hover:text-primary")
                  }
                >
                  <IconBoard className="fill-current" aria-hidden="true" />
                  <Text variant="p3" as="span" className="font-bold">
                    {board.name}
                  </Text>
                </button>
              </li>
            );
          })}

          <li>
            <button
              type="button"
              onClick={() => {
                navigate("/boards/new", {
                  state: { backgroundLocation: location },
                });
                onClose();
              }}
              className="flex w-full items-center gap-3 py-3 pl-4 pr-6 text-primary hover:opacity-80 transition-opacity"
            >
              <IconBoard className="fill-current" aria-hidden="true" />
              <Text variant="p3" as="span" className="font-bold">
                + Create New Board
              </Text>
            </button>
          </li>
        </ul>

        <div className="mt-2 rounded-md bg-background py-3 px-4">
          <div className="flex items-center justify-center gap-6">
            <IconLightTheme aria-hidden="true" />

            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="relative h-5 w-10 rounded-full bg-primary hover:bg-primary-hover transition-colors cursor-pointer"
            >
              <span
                className={
                  "absolute top-0.5 h-4 w-4 rounded-full bg-white transition-all duration-200 " +
                  (theme === "dark" ? "translate-x-1" : "-translate-x-5")
                }
              />
            </button>

            <IconDarkTheme aria-hidden="true" />
          </div>
        </div>
      </div>
    </Modal>
  );
}
