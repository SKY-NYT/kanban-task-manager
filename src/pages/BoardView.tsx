import { Link, useParams } from "react-router-dom";
import { Text } from "../components/atoms/Text";
import { useApp } from "../hooks/useApp";
import { Outlet } from "react-router-dom";
import Button from "../components/atoms/Buttons";

export default function BoardView() {
  const { boardId } = useParams();
  const { data, sidebarVisible } = useApp();
  const boards = data.boards ?? [];
  const index = boardId ? Number(boardId) : 0;
  const board = boards[index];
  if (boards.length === 0) {
    return (
      <main className={`fixed inset-0 flex items-center justify-center bg-background ${sidebarVisible ? "pl-75" : "pl-0"}`}>
         <div className="text-center">
            <Text variant="p2" className="text-gray-400 mb-6">This account has no boards.</Text>
            <Button variant="primary" size="md">+ Create New Board</Button>
         </div>
      </main>
    );
  }
  return (
    <main
      className={`
         w-full fixed z-30 h-full
        transition-all duration-300 pt-20 
        ${sidebarVisible ? "ml-75" : "ml-0"}
      `}
    >
      <div className="h-full py-4  flex gap-6 overflow-x-auto overflow-y-hidden ">
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
              <Text
                variant="p4"
                className=" text-gray-400"
              >
                {col.name} ({col.tasks?.length ?? 0})
              </Text>
            </header>

            <div className="space-y-5 pb-10">
              {col.tasks?.map((task, taskIndex) => {
                const completedSubtasks =
                  task.subtasks?.filter((s) => s.isCompleted).length ?? 0;
                return (
                  <Link
                    key={taskIndex}
                    to={`/board/${index}/task/${taskIndex}`}
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
                  </Link>
                );
              })}
            </div>
          </section>
        ))}

        <Link
           to={`/edit-board`}
          type="button"
          className="cursor-pointer
    mt-12 shrink-0 w-70 h-203.5 rounded-md 
    bg-background-secondary/50 
    flex items-center justify-center group transition-all duration-300
  "
        >
          <Text
            variant="p1"
            className="text-gray-400 group-hover:text-primary transition-colors"
          >
            + New Column
          </Text>
        </Link>
      </div>
      <Outlet />
    </main>
  );
}
