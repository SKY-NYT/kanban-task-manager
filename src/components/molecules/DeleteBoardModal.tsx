import { useParams, useNavigate } from "react-router-dom";
import { useKanbanStore } from "../../store/useKanbanStore";
import Modal from "../atoms/Modal";
import { Text } from "../atoms/Text";
import Button from "../atoms/Buttons";

export default function DeleteBoardModal() {
  const { boardId } = useParams();
  const navigate = useNavigate();
  const { data, setData } = useKanbanStore();

  const bIndex = boardId ? Number(boardId) : 0;
  const boardName = data.boards?.[bIndex]?.name || "";

  const handleDelete = () => {
    // Logic to delete the board from state
    const updatedBoards = data.boards.filter((_, index) => index !== bIndex);
    setData({ ...data, boards: updatedBoards });
    
    // Redirect to home or another board after deletion
    navigate("/");
  };

  const handleCancel = () => {
    navigate(-1); // Go back to the board view
  };

  return (
    <Modal onClose={handleCancel}>
      <div className="flex flex-col gap-6">
        {/* Heading in Red */}
        <Text variant="p1" className="text-danger">
          Delete this board?
        </Text>

        {/* Description in Medium Grey */}
        <Text variant="p5" className="text-gray-400 leading-6">
          Are you sure you want to delete the ‘{boardName}’ board? This action
          will remove all columns and tasks and cannot be reversed.
        </Text>

        {/* Action Buttons */}
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