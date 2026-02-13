import { Link, useParams } from "react-router-dom";
import { Text } from "../components/atoms/Text";
import { useKanbanStore } from "../store/useKanbanStore";
import { Outlet } from "react-router-dom";
import Button from "../components/atoms/Buttons";
import {
  DndContext,
  PointerSensor,
  KeyboardSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useDroppable } from "@dnd-kit/core";

function taskDndId(columnIndex: number, taskIndex: number) {
  return `task-${columnIndex}-${taskIndex}`;
}

function columnDndId(columnIndex: number) {
  return `column-${columnIndex}`;
}

function parseTaskDndId(id: string) {
  const m = /^task-(\d+)-(\d+)$/.exec(id);
  if (!m) return null;
  return { columnIndex: Number(m[1]), taskIndex: Number(m[2]) };
}

function parseColumnDndId(id: string) {
  const m = /^column-(\d+)$/.exec(id);
  if (!m) return null;
  return { columnIndex: Number(m[1]) };
}

function DroppableColumn({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  const { setNodeRef } = useDroppable({ id });
  return <div ref={setNodeRef}>{children}</div>;
}

function SortableTaskLink({
  id,
  to,
  children,
}: {
  id: string;
  to: string;
  children: React.ReactNode;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Link
      ref={setNodeRef}
      to={to}
      style={style}
      {...attributes}
      {...listeners}
      className={`group block rounded-lg px-4 py-6 bg-background-secondary transition-colors duration-300 hover:text-primary shadow-sm ${
        isDragging ? "opacity-70" : ""
      }`}
    >
      {children}
    </Link>
  );
}

export default function BoardView() {
  const { boardId } = useParams();
  const { data, sidebarVisible, moveTask } = useKanbanStore();
  const boards = data.boards ?? [];
  const index = boardId ? Number(boardId) : 0;
  const board = boards[index];

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    if (!board) return;

    const { active, over } = event;
    if (!over) return;

    const activeId = String(active.id);
    const overId = String(over.id);
    if (activeId === overId) return;

    const from = parseTaskDndId(activeId);
    if (!from) return;

    const overTask = parseTaskDndId(overId);
    const overColumn = parseColumnDndId(overId);

    const toColumnIndex = overTask?.columnIndex ?? overColumn?.columnIndex;
    if (typeof toColumnIndex !== "number") return;

    let toTaskIndex = overTask?.taskIndex;
    if (
      typeof toTaskIndex === "number" &&
      from.columnIndex === toColumnIndex &&
      from.taskIndex < toTaskIndex
    ) {
      toTaskIndex = toTaskIndex - 1;
    }

    moveTask({
      boardIndex: index,
      fromColumnIndex: from.columnIndex,
      taskIndex: from.taskIndex,
      toColumnIndex,
      toTaskIndex,
    });
  };

  if (boards.length === 0) {
    return (
      <main
        className={`fixed inset-0 flex items-center justify-center bg-background ${sidebarVisible ? "pl-75" : "pl-0"}`}
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
         w-full fixed z-30 h-full
        transition-all duration-300 pt-20 
        ${sidebarVisible ? "ml-75" : "ml-0"}
      `}
    >
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <div className="h-full py-4  flex gap-6 overflow-x-auto overflow-y-hidden ">
          {board.columns?.map((col, columnIndex) => {
            const items = (col.tasks ?? []).map((_, taskIndex) =>
              taskDndId(columnIndex, taskIndex),
            );
            return (
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
                  <Text variant="p4" className=" text-gray-400">
                    {col.name} ({col.tasks?.length ?? 0})
                  </Text>
                </header>

                <DroppableColumn id={columnDndId(columnIndex)}>
                  <SortableContext
                    items={items}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="space-y-5 pb-10">
                      {col.tasks?.map((task, taskIndex) => {
                        const completedSubtasks =
                          task.subtasks?.filter((s) => s.isCompleted).length ??
                          0;
                        const id = taskDndId(columnIndex, taskIndex);

                        return (
                          <SortableTaskLink
                            key={id}
                            id={id}
                            to={`/board/${index}/task/${columnIndex}/${taskIndex}`}
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
                              {completedSubtasks} of{" "}
                              {task.subtasks?.length ?? 0} subtasks
                            </Text>
                          </SortableTaskLink>
                        );
                      })}
                    </div>
                  </SortableContext>
                </DroppableColumn>
              </section>
            );
          })}

          <Link
            to={`/board/${index}/edit-board`}
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
      </DndContext>
      <Outlet />
    </main>
  );
}
