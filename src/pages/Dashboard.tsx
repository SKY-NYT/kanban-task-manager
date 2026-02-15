import { Link } from "react-router-dom";
import { useApp } from "../hooks/useApp";
import { Text } from "../components/atoms/Text";
import Button from "../components/atoms/Buttons";

export default function Dashboard() {
  const { data } = useApp();
  const boards = data.boards ?? [];

  if (boards.length === 0) {
    return (
      <div className="h-full flex items-center justify-center bg-background">
        <div className="text-center">
          <Text variant="p2" className="text-gray-400 mb-6">
            This account has no boards.
          </Text>
          <Button variant="primary" size="md">
            + Create New Board
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto px-6 py-6 bg-background">
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
            to={`/board/${index}`}
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
        <button className="cursor-pointer min-h-37.5 rounded-md border-2 border-dashed border-border bg-background-secondary/50 flex items-center justify-center group transition-all duration-300">
          {" "}
          <Text variant="p1" className="text-gray-400 group-hover:text-primary">
            {" "}
            + New Board
          </Text>
        </button>
      </div>
    </div>
  );
}
