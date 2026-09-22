import { Link, useLocation, useNavigate } from "react-router-dom";
import { useKanbanStore } from "../store/useKanbanStore";
import { Text } from "../components/atoms/Text";
import Button from "../components/atoms/Buttons";
import Spinner from "../components/atoms/Spinner";
import { useShallow } from "zustand/shallow";

export default function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const { boards, sidebarVisible, remote, fetchRemoteData } = useKanbanStore(
    useShallow((s) => ({
      boards: s.data.boards,
      sidebarVisible: s.sidebarVisible,
      remote: s.remote,
      fetchRemoteData: s.fetchRemoteData,
    })),
  );

  if (remote.isLoading && boards.length === 0) {
    return (
      <main
        className={`fixed inset-0 flex items-center justify-center bg-background ${sidebarVisible ? "md:pl-65 lg:pl-75" : "pl-0"}`}
      >
        <div className="text-center flex flex-col items-center gap-4">
          <Spinner label="Loading boards" />
          <div>
            <Text variant="p2" className="text-gray-400 mb-2">
              Loading boards…
            </Text>
            <Text variant="p5" className="text-preset-gray-300">
              Fetching tasks from the API.
            </Text>
          </div>
        </div>
      </main>
    );
  }

  if (remote.error && boards.length === 0) {
    return (
      <main
        className={`fixed inset-0 flex items-center justify-center bg-background ${sidebarVisible ? "md:pl-65 lg:pl-75" : "pl-0"}`}
      >
        <div className="text-center max-w-lg px-6">
          <Text variant="p2" className="text-foreground mb-2">
            Couldn’t load boards
          </Text>
          <Text variant="p5" className="text-preset-gray-300 mb-6">
            {remote.error}
          </Text>
          <Button variant="primary" size="md" onClick={() => fetchRemoteData()}>
            Retry
          </Button>
        </div>
      </main>
    );
  }

  if (boards.length === 0) {
    return (
      <main
        className={`fixed inset-0 flex items-center justify-center bg-background ${sidebarVisible ? "md:pl-65 lg:pl-75" : "pl-0"}`}
      >
        <div className="text-center">
          <Text variant="p2" className="text-gray-400 mb-6">
            This board is empty. Create a new column to get started.
          </Text>
          <Button
            variant="primary"
            size="md"
            onClick={() =>
              navigate("/boards/new", {
                state: { backgroundLocation: location },
              })
            }
          >
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
        <button
          className="cursor-pointer min-h-37.5 rounded-md border-2 border-dashed border-border bg-background-secondary/50 flex items-center justify-center group transition-all duration-300"
          onClick={() =>
            navigate("/boards/new", {
              state: { backgroundLocation: location },
            })
          }
        >
          <Text variant="p1" className="text-gray-400 group-hover:text-primary">
            + New Board
          </Text>
        </button>
      </div>
    </main>
  );
}
