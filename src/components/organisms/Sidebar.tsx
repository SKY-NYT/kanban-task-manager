import { NavLink } from "react-router-dom";
import { Text } from "../atoms/Text";
import { Logo } from "../molecules/Logo";
import Iconboard from "../../assets/images/icon-board.svg?react";
import IconHideSidebar from "../../assets/images/icon-hide-sidebar.svg?react";
import IconShowSidebar from "../../assets/images/icon-show-sidebar.svg?react";
import IconDarkTheme from "../../assets/images/icon-dark-theme.svg?react";
import IconLightTheme from "../../assets/images/icon-light-theme.svg?react";
import { useKanbanStore } from "../../store/useKanbanStore";
import { useShallow } from "zustand/react/shallow";

export default function Sidebar() {
  const { boards, sidebarVisible, toggleSidebar, theme, toggleTheme } =
    useKanbanStore(
      useShallow((s) => ({
        boards: s.data.boards ?? [],
        sidebarVisible: s.sidebarVisible,
        toggleSidebar: s.toggleSidebar,
        theme: s.theme,
        toggleTheme: s.toggleTheme,
      })),
    );
  return (
    <>
      <div
        className={`hidden md:flex fixed top-0 left-0 z-50 h-20.25 lg:h-24 items-center bg-background-secondary transition-all duration-300 ${
          sidebarVisible
            ? "w-65 lg:w-75 px-6 lg:px-8 border-r border-border"
            : "w-0 px-0 overflow-hidden border-r-0"
        }`}
      >
        <Logo />
      </div>

      <aside
        className={`
          hidden md:flex
          fixed top-20.25 lg:top-24 left-0 z-40 h-[calc(100vh-81px)] lg:h-[calc(100vh-6rem)] bg-background-secondary dark:bg-dark-bg-secondary 
          border-r border-border dark:border-dark-border transition-all duration-300 flex-col overflow-hidden
          ${sidebarVisible ? "w-65 lg:w-75 translate-x-0" : "w-0 -translate-x-full"}
        `}
      >
        <nav className="flex-1 pr-6 py-4">
          <div className="pl-8 mb-5">
            <Text variant="p4" className="text-gray-400">
              ALL BOARDS ({boards.length})
            </Text>
          </div>

          <ul className="space-y-1">
            {boards.map((board, index) => (
              <li key={index}>
                <NavLink
                  to={`/boards/${index}`}
                  className={({ isActive }) => `
                    flex items-center gap-4 rounded-r-full py-4 pl-8 transition-all
                    ${
                      isActive
                        ? "bg-primary text-white"
                        : "text-gray-400  hover:bg-interactive-dynamic hover:text-primary "
                    }
                  `}
                >
                  <Iconboard className="fill-current" />
                  <Text variant="p3" as="span" className="font-bold">
                    {board.name}
                  </Text>
                </NavLink>
              </li>
            ))}

            <li className="pl-8 py-4">
              <button
                type="button"
                onClick={() => {
                  // Create-board modal/page was removed; no routing.
                  return;
                }}
                className="flex items-center gap-4 text-primary hover:opacity-70 transition-opacity"
              >
                <Iconboard />

                <Text variant="p3" className="font-bold hover:cursor-pointer">
                  + Create New Board
                </Text>
              </button>
            </li>
          </ul>
        </nav>

        <div className="px-4 pb-8 space-y-2">
          <div className="flex items-center justify-center gap-6 rounded-md bg-background dark:bg-dark-bg py-3 mx-2">
            <IconLightTheme />

            <button
              type="button"
              onClick={toggleTheme}
              aria-label="toggle theme"
              className="relative h-5 w-10 rounded-full bg-primary hover:bg-primary-hover transition-colors cursor-pointer"
            >
              <span
                className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-all duration-200 ${
                  theme === "dark" ? "translate-x-1" : "-translate-x-5"
                }`}
              />
            </button>

            <IconDarkTheme />
          </div>

          <button
            type="button"
            onClick={toggleSidebar}
            className="flex items-center gap-4 py-4 pl-6 rounded-r-full text-gray-400 hover:bg-interactive-dynamic  hover:text-primary transition-all w-full mr-6 hover:cursor-pointer"
          >
            <IconHideSidebar className="fill-current" />
            <Text variant="p3" className="font-bold">
              Hide Sidebar
            </Text>
          </button>
        </div>
      </aside>

      {!sidebarVisible && (
        <button
          type="button"
          onClick={toggleSidebar}
          className="hidden md:flex fixed bottom-8 left-0 items-center justify-center w-14 h-12 rounded-r-full bg-primary hover:bg-primary-hover cursor-pointer transition-colors z-50"
          aria-label="Show sidebar"
        >
          <IconShowSidebar className="fill-current" />
        </button>
      )}
    </>
  );
}
