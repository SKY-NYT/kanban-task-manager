import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useKanbanStore } from "../../store/useKanbanStore";
import Modal from "../atoms/Modal";
import { Text } from "../atoms/Text";
import type { Task, Subtask, Column } from "../../types/types";
import { useShallow } from "zustand/shallow";
import TaskForm from "./TaskForm";

export default function EditTaskModal() {
  const { boardId, columnIndex, taskIndex } = useParams();
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data, updateTask, moveTask } = useKanbanStore(
    useShallow((s) => ({
      data: s.data,
      updateTask: s.updateTask,
      moveTask: s.moveTask,
    })),
  );

  const boardIndex = boardId ? Number(boardId) : 0;
  const colIndex = columnIndex ? Number(columnIndex) : 0;
  const tIndex = taskIndex ? Number(taskIndex) : 0;

  const currentBoard = data.boards?.[boardIndex];
  const currentColumn = currentBoard?.columns?.[colIndex];
  const existingTask: Task | undefined = currentColumn?.tasks?.[tIndex];
  const initialStatus = currentColumn?.name ?? "";
  const columns: Column[] = useMemo(
    () => currentBoard?.columns ?? [],
    [currentBoard],
  );

  if (!existingTask) return null;

  return (
    <Modal>
      <div className="flex flex-col gap-6">
        <Text variant="p2" className="text-foreground">
          Edit Task
        </Text>

        {feedback && (
          <Text
            variant="p6"
            className={
              feedback.type === "success" ? "text-primary" : "text-danger"
            }
            role={feedback.type === "success" ? "status" : "alert"}
          >
            {feedback.message}
          </Text>
        )}

        <TaskForm
          mode="edit"
          columns={columns}
          submitDisabled={isSubmitting}
          initialValue={{
            title: existingTask.title,
            description: existingTask.description,
            status: initialStatus,
            subtasks: existingTask.subtasks,
          }}
          onSubmit={(task: Task) => {
            if (!currentBoard) {
              setFeedback({
                type: "error",
                message: "Could not save changes. Board not found.",
              });
              return;
            }

            setIsSubmitting(true);

            updateTask(boardIndex, colIndex, tIndex, {
              title: task.title,
              description: task.description,
              subtasks: task.subtasks as Subtask[],
            });

            const toColumnIndex = currentBoard.columns.findIndex(
              (c: Column) => c.name === task.status,
            );
            if (toColumnIndex >= 0 && toColumnIndex !== colIndex) {
              const toTaskIndex =
                currentBoard.columns[toColumnIndex]?.tasks?.length ?? 0;
              moveTask({
                boardIndex,
                fromColumnIndex: colIndex,
                taskIndex: tIndex,
                toColumnIndex,
                toTaskIndex,
              });
            }

            setFeedback({ type: "success", message: "Changes saved." });
            window.setTimeout(() => {
              navigate(`/boards/${boardId}`);
            }, 350);
          }}
        />
      </div>
    </Modal>
  );
}
