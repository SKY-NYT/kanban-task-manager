import { useKanbanStore } from "../../store/useKanbanStore";
import LogoDark from "../../assets/images/logo-dark.svg?react";
import LogoLight from "../../assets/images/logo-light.svg?react";
import LogoMobile from "../../assets/images/logo-mobile.svg?react";

export const Logo = () => {
  const theme = useKanbanStore((s) => s.theme);

  return (
    <div className="flex items-center">
      <div className="md:hidden">
        <LogoMobile />
      </div>

      <div className="hidden md:block">
        {theme === "dark" ? (
          <LogoLight aria-label="Kanban Logo Light" />
        ) : (
          <LogoDark aria-label="Kanban Logo Dark" />
        )}
      </div>
    </div>
  );
};
