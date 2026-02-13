import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Text } from "./Text";
import Iconchevrondown from "../../assets/images/icon-chevron-down.svg?react";
import Iconchevronup from "../../assets/images/icon-chevron-up.svg?react";

interface Option {
  label: string;
  value: string;
}

interface DropdownProps {
  options: Option[];
  value?: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  className?: string;
}

export default function Dropdown({
  options,
  value,
  onChange,
  label,
  placeholder = "Select...",
  className = "",
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLUListElement>(null);
  const [menuStyle, setMenuStyle] = useState<React.CSSProperties>({});
  const selectedOption = options.find((opt) => opt.value === value);

  const computeMenuStyle = (rect: DOMRect, menuHeight: number) => {
    const viewportPadding = 8;
    const maxMenuHeight = 120;

    const clamp = (val: number, min: number, max: number) =>
      Math.min(Math.max(val, min), max);

    const spaceBelow = window.innerHeight - rect.bottom - viewportPadding;
    const spaceAbove = rect.top - viewportPadding;

    const shouldFlipUp = spaceBelow < menuHeight && spaceAbove > spaceBelow;
    const computedMaxHeight = clamp(
      shouldFlipUp ? spaceAbove : spaceBelow,
      0,
      maxMenuHeight,
    );

    const top = shouldFlipUp
      ? clamp(rect.top - menuHeight, viewportPadding, window.innerHeight)
      : clamp(rect.bottom, viewportPadding, window.innerHeight);

    const width = rect.width;
    const left = clamp(
      rect.left,
      viewportPadding,
      window.innerWidth - width - viewportPadding,
    );

    return {
      position: "fixed" as const,
      left,
      top,
      width,
      maxHeight: computedMaxHeight,
      zIndex: 110,
    } satisfies React.CSSProperties;
  };

  useEffect(() => {
    const clickOut = (e: MouseEvent) => {
      const target = e.target as Node;

      const clickedInsideButtonOrRoot =
        dropdownRef.current?.contains(target) ?? false;
      const clickedInsideMenu = menuRef.current?.contains(target) ?? false;

      if (!clickedInsideButtonOrRoot && !clickedInsideMenu) setIsOpen(false);
    };
    document.addEventListener("mousedown", clickOut);
    return () => document.removeEventListener("mousedown", clickOut);
  }, []);

  useLayoutEffect(() => {
    if (!isOpen) return;
    if (!buttonRef.current) return;

    const viewportPadding = 8;
    const maxMenuHeight = 120;

    const clamp = (val: number, min: number, max: number) =>
      Math.min(Math.max(val, min), max);

    const updatePosition = () => {
      if (!buttonRef.current) return;

      const rect = buttonRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom - viewportPadding;
      const spaceAbove = rect.top - viewportPadding;

      const estimatedMenuHeight =
        Math.min(
          menuRef.current?.scrollHeight ?? maxMenuHeight,
          maxMenuHeight,
        ) || maxMenuHeight;

      const shouldFlipUp =
        spaceBelow < estimatedMenuHeight && spaceAbove > spaceBelow;

      const computedMaxHeight = clamp(
        shouldFlipUp ? spaceAbove : spaceBelow,
        0,
        maxMenuHeight,
      );

      const top = shouldFlipUp
        ? clamp(
            rect.top - estimatedMenuHeight,
            viewportPadding,
            window.innerHeight,
          )
        : clamp(rect.bottom, viewportPadding, window.innerHeight);

      const width = rect.width;
      const left = clamp(
        rect.left,
        viewportPadding,
        window.innerWidth - width - viewportPadding,
      );

      setMenuStyle({
        position: "fixed",
        left,
        top,
        width,
        maxHeight: computedMaxHeight,
        zIndex: 110,
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
    <div
      ref={dropdownRef}
      className={`relative w-full flex flex-col gap-2 ${className}`}
    >
      {label && (
        <Text variant="p6" className="text-gray-400">
          {label}
        </Text>
      )}
      <button
        ref={buttonRef}
        type="button"
        onClick={() => {
          const nextOpen = !isOpen;
          if (nextOpen && buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            // Provide an initial position immediately to avoid a visible "snap".
            setMenuStyle(computeMenuStyle(rect, 120));
          }
          setIsOpen(nextOpen);
        }}
        className={`flex h-10 w-full items-center justify-between rounded-sm border px-4 transition-all
          ${isOpen ? "border-primary bg-background-secondary" : "border-[#828fa340] bg-transparent"} hover:border-primary`}
      >
        <Text
          variant="p5"
          className={!selectedOption ? "text-gray-400" : "text-foreground"}
        >
          {selectedOption ? selectedOption.label : placeholder}
        </Text>

        {isOpen ? (
          <Iconchevronup className="transition-transform" />
        ) : (
          <Iconchevrondown className="transition-transform" />
        )}
      </button>

      {isOpen &&
        createPortal(
          <ul
            ref={menuRef}
            style={menuStyle}
            className="max-h-30 overflow-y-auto rounded-lg bg-todo-background p-4 shadow-[0_10px_20px_0_rgba(54,78,126,0.25)] flex flex-col gap-2"
          >
            {options.map((opt) => (
              <li
                key={opt.value}
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                className="group cursor-pointer"
              >
                <Text
                  variant="p6"
                  className="text-gray-400 group-hover:text-primary transition-colors"
                >
                  {opt.label}
                </Text>
              </li>
            ))}
          </ul>,
          document.body,
        )}
    </div>
  );
}
