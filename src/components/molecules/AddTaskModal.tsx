import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useKanbanStore } from "../../store/useKanbanStore";
import Modal from "../atoms/Modal";
import { Text } from "../atoms/Text";
import type { Column, Task } from "../../types/types";
import { useShallow } from "zustand/shallow";
import TaskForm from "./TaskForm";

export default function AddTaskModal() {
  const { boardId } = useParams();
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data, addTask } = useKanbanStore(
    useShallow((s) => ({
      data: s.data,
      addTask: s.addTask,
    })),
  );

  const boardIndex = boardId ? Number(boardId) : 0;
  const currentBoard = data.boards?.[boardIndex];

  const columns: Column[] = useMemo(
    () => currentBoard?.columns ?? [],
    [currentBoard],
  );

  return (
    <Modal>
      <div className="flex flex-col gap-6">
        <Text variant="p2" className="text-foreground">
          Add New Task
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
          mode="create"
          columns={columns}
          submitDisabled={isSubmitting}
          onSubmit={(task: Task) => {
            if (!currentBoard) {
              setFeedback({
                type: "error",
                message: "Could not create task. Board not found.",
              });
              return;
            }
            const toColumnIndex = currentBoard.columns.findIndex(
              (c: Column) => c.name === task.status,
            );
            if (toColumnIndex < 0) {
              setFeedback({
                type: "error",
                message: "Could not create task. Invalid status.",
              });
              return;
            }

            setIsSubmitting(true);
            addTask(boardIndex, toColumnIndex, task);
            setFeedback({ type: "success", message: "Task created." });

            window.setTimeout(() => {
              navigate(`/boards/${boardIndex}`);
            }, 350);
          }}
        />
      </div>
    </Modal>
  );
}
