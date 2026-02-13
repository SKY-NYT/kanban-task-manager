import { useParams, useNavigate } from "react-router-dom";
import { useKanbanStore } from "../../store/useKanbanStore";
import Modal from "../atoms/Modal";
import { Text } from "../atoms/Text";
import Button from "../atoms/Buttons";
import type { Task } from "../../types/types";

export default function DeleteTaskModal() {
  const { boardId, columnIndex, taskIndex } = useParams();
  const navigate = useNavigate();
  const { data, deleteTask } = useKanbanStore();

  const bIndex = boardId ? Number(boardId) : 0;
  const cIndex = columnIndex ? Number(columnIndex) : 0;
  const tIndex = taskIndex ? Number(taskIndex) : 0;
  const currentBoard = data.boards?.[bIndex];

  const taskTitle: string =
    (currentBoard?.columns?.[cIndex]?.tasks?.[tIndex] as Task | undefined)
      ?.title ?? "this task";

  const handleDelete = () => {
    deleteTask(bIndex, cIndex, tIndex);
    navigate(`/boards/${boardId}`);
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <Modal onClose={handleCancel}>
      <div className="flex flex-col gap-6">
        <Text variant="p1" className="text-danger">
          Delete this task?
        </Text>

        <Text variant="p5" className="text-gray-400 leading-6">
          Are you sure you want to delete the ‘{taskTitle}’ task and its
          subtasks? This action cannot be reversed.
        </Text>

        <div className="flex flex-col sm:flex-row gap-4">
          <Button variant="destructive" fullWidth onClick={handleDelete}>
            Delete
          </Button>
          <Button
            variant="secondary"
            fullWidth
            onClick={handleCancel}
            className="hover:bg-interactive-dynamic hover:text-primary"
          >
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
}
