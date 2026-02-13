import { useEffect, useRef, useState } from "react";
import IconVerticalEllipsis from "../../assets/images/icon-vertical-ellipsis.svg?react";
import { Text } from "./Text";

type MenuProps = {
  onEdit: () => void;
  onDelete: () => void;
  onLogout?: () => void;
  editLabel?: string;
  deleteLabel?: string;
  logoutLabel?: string;
  ariaLabel?: string;
  iconClassName?: string;
  buttonClassName?: string;
  className?: string;
};

export default function Menu({
  onEdit,
  onDelete,
  onLogout,
  editLabel = "Edit Task",
  deleteLabel = "Delete Task",
  logoutLabel = "Logout",
  ariaLabel = "Task options",
  iconClassName = "fill-[#828FA3]",
  buttonClassName = "p-2  transition-transform hover:scale-110 cursor-pointer",
  className = "",
}: MenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onMouseDown = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, []);

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        aria-label={ariaLabel}
        aria-haspopup="menu"
        className={buttonClassName}
      >
        <IconVerticalEllipsis className={iconClassName} />
      </button>

      {isOpen && (
        <div
          role="menu"
          className={`flex flex-col gap-4 absolute -right-20 top-full z-50 mt-2 h-23.5 w-48  bg-menu-background p-3  ${className}`}
        >
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setIsOpen(false);
              onEdit();
            }}
            className="w-full text-left"
          >
            <Text
              variant="p5"
              className="text-gray-400 hover:text-primary transition-colors"
            >
              {editLabel}
            </Text>
          </button>

          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setIsOpen(false);
              onDelete();
            }}
            className="mt-2 w-full text-left"
          >
            <Text
              variant="p5"
              className="text-red-500 hover:opacity-80 transition-opacity"
            >
              {deleteLabel}
            </Text>
          </button>

          {onLogout && (
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                setIsOpen(false);
                onLogout();
              }}
              className="mt-2 w-full text-left"
            >
              <Text
                variant="p5"
                className="text-gray-400 hover:text-danger transition-colors"
              >
                {logoutLabel}
              </Text>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
