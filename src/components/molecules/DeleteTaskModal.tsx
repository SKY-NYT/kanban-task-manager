import { useParams, useNavigate } from "react-router-dom";
import { useKanbanStore } from "../../store/useKanbanStore";
import Modal from "../atoms/Modal";
import { Text } from "../atoms/Text";
import Button from "../atoms/Buttons";
import type{  Column } from "../../types/types";

export default function DeleteTaskModal() {
  const { boardId, taskId } = useParams();
  const navigate = useNavigate();
  const { data, setData } = useKanbanStore();

  const bIndex = boardId ? Number(boardId) : 0;
  const currentBoard = data.boards?.[bIndex];
  
  let taskTitle = "this task";
  

  currentBoard?.columns.forEach((col: Column) => {
    const found = col.tasks.find((_, idx) => idx === Number(taskId));
    if (found) taskTitle = found.title;
  });

  const handleDelete = () => {
  
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
    navigate(-1); 
  };

  return (
    <Modal onClose={handleCancel}>
      <div className="flex flex-col gap-6">
        
        <Text variant="p1" className="text-danger">
          Delete this task?
        </Text>

        
        <Text variant="p5" className="text-gray-400 leading-6">
          Are you sure you want to delete the ‘{taskTitle}’ task and its subtasks? 
          This action cannot be reversed.
        </Text>

        
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