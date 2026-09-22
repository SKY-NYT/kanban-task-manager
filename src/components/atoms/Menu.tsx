import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import IconVerticalEllipsis from "../../assets/images/icon-vertical-ellipsis.svg?react";
import { Text } from "./Text";

type MenuProps = {
  onEdit?: () => void;
  onDelete?: () => void;
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
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [menuStyle, setMenuStyle] = useState<React.CSSProperties>({});

  useEffect(() => {
    const onMouseDown = (e: MouseEvent) => {
      const target = e.target as Node;
      const clickedInsideRoot = rootRef.current?.contains(target) ?? false;
      const clickedInsideMenu = menuRef.current?.contains(target) ?? false;
      if (!clickedInsideRoot && !clickedInsideMenu) setIsOpen(false);
    };

    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, []);

  useLayoutEffect(() => {
    if (!isOpen) return;
    if (!buttonRef.current) return;

    const viewportPadding = 8;
    const gap = 8;
    const clamp = (val: number, min: number, max: number) =>
      Math.min(Math.max(val, min), max);

    const updatePosition = () => {
      if (!buttonRef.current) return;
      const rect = buttonRef.current.getBoundingClientRect();

      const menuWidth = menuRef.current?.offsetWidth ?? 192; // w-48
      const menuHeight = menuRef.current?.offsetHeight ?? 94;

      const spaceBelow =
        window.innerHeight - rect.bottom - viewportPadding - gap;
      const spaceAbove = rect.top - viewportPadding - gap;
      const shouldFlipUp = spaceBelow < menuHeight && spaceAbove > spaceBelow;

      const top = shouldFlipUp
        ? clamp(
            rect.top - gap - menuHeight,
            viewportPadding,
            window.innerHeight - viewportPadding,
          )
        : clamp(
            rect.bottom + gap,
            viewportPadding,
            window.innerHeight - viewportPadding,
          );

      const left = clamp(
        rect.right - menuWidth,
        viewportPadding,
        window.innerWidth - menuWidth - viewportPadding,
      );

      setMenuStyle({
        position: "fixed",
        top,
        left,
        zIndex: 120,
      });
    };

    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition);
    document.addEventListener("scroll", updatePosition, true);

    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition);
      document.removeEventListener("scroll", updatePosition, true);
    };
  }, [isOpen]);

  return (
    <div ref={rootRef} className="relative">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        aria-label={ariaLabel}
        aria-haspopup="menu"
        className={buttonClassName}
      >
        <IconVerticalEllipsis className={iconClassName} />
      </button>

      {isOpen &&
        createPortal(
          <div
            ref={menuRef}
            role="menu"
            style={menuStyle}
            className={`flex flex-col gap-4 h-23.5 w-48 bg-menu-background p-3 ${className}`}
          >
            {onEdit && (
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
            )}

            {onDelete && (
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setIsOpen(false);
                  onDelete();
                }}
                className={`${onEdit ? "mt-2" : ""} w-full text-left`}
              >
                <Text
                  variant="p5"
                  className="text-red-500 hover:opacity-80 transition-opacity"
                >
                  {deleteLabel}
                </Text>
              </button>
            )}

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
          </div>,
          document.body,
        )}
    </div>
  );
}
