import { Link } from "react-router-dom";
import { useKanbanStore } from "../store/useKanbanStore";
import { useShallow } from "zustand/react/shallow";
import { Text } from "../components/atoms/Text";
import Button from "../components/atoms/Buttons";

export default function Dashboard() {
  const { boards, sidebarVisible } = useKanbanStore(
    useShallow((s) => ({
      boards: s.data.boards ?? [],
      sidebarVisible: s.sidebarVisible,
    })),
  );

  if (boards.length === 0) {
    return (
      <main
        className={`fixed inset-0 flex items-center justify-center bg-background ${sidebarVisible ? "md:pl-65 lg:pl-75" : "pl-0"}`}
      >
        <div className="text-center">
          <Text variant="p2" className="text-gray-400 mb-6">
            This account has no boards.
          </Text>
          <Button variant="primary" size="md">
            + Create New Board
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main
      className={`
        w-full fixed z-30 h-full overflow-y-auto
        transition-all duration-300 pt-16 md:pt-20.25 lg:pt-24 px-8
        ${sidebarVisible ? "md:ml-65 lg:ml-75" : "ml-0"}
      `}
    >
      <header className="mb-10">
        <Text variant="p2" className="text-foreground mb-2">
          All Boards
        </Text>
        <Text variant="p2" className="text-gray-400">
          Select a workspace to manage your tasks.
        </Text>
      </header>

      <div className="grid gap-6 grid-cols-[repeat(auto-fill,minmax(280px,1fr))] pb-20">
        {boards.map((board, index) => (
          <Link
            key={index}
            to={`/boards/${index}`}
            className="group block rounded-lg border border-border bg-background-secondary p-8 transition-all hover:border-primary shadow-sm"
          >
            <Text
              variant="p3"
              className="mb-2 font-bold text-foreground group-hover:text-primary transition-colors"
            >
              {board.name}
            </Text>
            <Text variant="p6" className="font-bold text-preset-gray-300">
              {board.columns?.length ?? 0} columns
            </Text>
          </Link>
        ))}
       
      </div>
    </main>
  );
}
