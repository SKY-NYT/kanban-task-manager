import { useParams } from "react-router-dom";
import { Text } from "../components/atoms/Text";
import { useApp } from "../hooks/useApp";
import Button from "../components/atoms/Buttons";

export default function BoardView() {
  const { boardId } = useParams();
  const { data } = useApp();
  const boards = data.boards ?? [];
  const index = boardId ? Number(boardId) : 0;
  const board = boards[index];
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
    <div className="h-full overflow-x-auto overflow-y-auto bg-background">
      <div className="min-w-max px-4 md:px-6 py-4 md:py-6 flex gap-6 items-start">
        {board.columns?.map((col, columnIndex) => (
          <section key={columnIndex} className="w-70 shrink-0">
            <header className="mb-6 flex items-center gap-3">
              <span
                className={`h-4 w-4 rounded-full ${
                  columnIndex % 3 === 0
                    ? "bg-[#49C4E5]"
                    : columnIndex % 3 === 1
                      ? "bg-[#8471F2]"
                      : "bg-[#67E2AE]"
                }`}
              />
              <Text variant="p4" className="text-gray-400">
                {col.name} ({col.tasks?.length ?? 0})
              </Text>
            </header>

            <div className="space-y-5 pb-10 cursor-pointer">
              {col.tasks?.map((task, taskIndex) => {
                const completedSubtasks =
                  task.subtasks?.filter((s) => s.isCompleted).length ?? 0;
                return (
                  <div
                    key={taskIndex}
                    className="group block rounded-lg px-4 py-6 bg-background-secondary transition-colors duration-300 hover:text-primary shadow-sm"
                  >
                    <Text
                      variant="p3"
                      className="mb-2 font-bold text-foreground group-hover:text-primary transition-colors duration-300 "
                    >
                      {task.title}
                    </Text>
                    <Text
                      variant="p6"
                      className="font-bold text-preset-gray-300"
                    >
                      {completedSubtasks} of {task.subtasks?.length ?? 0}{" "}
                      subtasks
                    </Text>
                  </div>
                );
              })}
            </div>
          </section>
        ))}

        <div
          className="cursor-pointer mt-12 md:mt-9.5 shrink-0 w-70 rounded-md 
            bg-background-secondary/50 flex items-center justify-center group transition-all duration-300
            min-h-[calc(100vh-64px-48px)] md:min-h-[calc(100vh-96px-48px)]"
        >
          <Text
            variant="p1"
            className="text-gray-400 group-hover:text-primary transition-colors"
          >
            + New Column
          </Text>
        </div>
      </div>
    </div>
  );
}
