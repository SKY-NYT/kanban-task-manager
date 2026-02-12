import { useParams, useNavigate } from "react-router-dom";
import { useApp } from "../../hooks/useApp";
import Modal from "../atoms/Modal";
import { Text } from "../atoms/Text";
import Button from "../atoms/Buttons";
import type{  Column } from "../../types/types";

export default function DeleteTaskModal() {
  const { boardId, taskId } = useParams();
  const navigate = useNavigate();
  const { data, setData } = useApp();

  // 1. Locate the specific task to get its title
  const bIndex = boardId ? Number(boardId) : 0;
  const currentBoard = data.boards?.[bIndex];
  
  let taskTitle = "this task";
  
  // Find task title by searching through columns
  currentBoard?.columns.forEach((col: Column) => {
    const found = col.tasks.find((_, idx) => idx === Number(taskId));
    if (found) taskTitle = found.title;
  });

  const handleDelete = () => {
    // 2. Logic to filter out the task from the local state
    const updatedBoards = [...data.boards];
    const board = updatedBoards[bIndex];

    board.columns = board.columns.map((col: Column) => ({
      ...col,
      tasks: col.tasks.filter((_, idx) => idx !== Number(taskId)),
    }));

    setData({ ...data, boards: updatedBoards });
    navigate(`/board/${boardId}`); 
  };

  const handleCancel = () => {
    navigate(-1); // Back to task view or board
  };

  return (
    <Modal onClose={handleCancel}>
      <div className="flex flex-col gap-6">
        {/* Title in Red per Figma color #EA5555 */}
        <Text variant="p1" className="text-danger">
          Delete this task?
        </Text>

        {/* Description in Medium Grey per Figma color #828FA3 */}
        <Text variant="p5" className="text-gray-400 leading-6">
          Are you sure you want to delete the ‘{taskTitle}’ task and its subtasks? 
          This action cannot be reversed.
        </Text>

        {/* Buttons: Destructive and Secondary variants */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button 
            variant="destructive" 
            fullWidth 
            onClick={handleDelete}
          >
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