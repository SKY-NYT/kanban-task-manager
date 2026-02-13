import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../atoms/Buttons";
import TextField from "../atoms/TextField";
import { Text } from "../atoms/Text";
import IconCross from "../../assets/images/icon-cross.svg?react";
import Modal from "../atoms/Modal";

export default function AddBoardModal() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [columns, setColumns] = useState(["Todo", "Doing"]);

  const handleClose = () => navigate("/");

  const addColumn = () => setColumns([...columns, ""]);

  const updateColumn = (index: number, value: string) => {
    const newCols = [...columns];
    newCols[index] = value;
    setColumns(newCols);
  };

  const removeColumn = (index: number) => {
    setColumns(columns.filter((_, i) => i !== index));
  };

  return (
    /* BACKDROP */
    <Modal onClose={handleClose}>
    
      <div
        className="w-full max-w-120 rounded-lg bg-background-secondary   max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <Text variant="p2" as="h2" className="text-foreground mb-6">
          Add New Board
        </Text>

        <form className="flex flex-col gap-6">
          
          <TextField
            label="Board Name"
            placeholder="e.g. Web Design"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
          />

          
          <div className="flex flex-col gap-3">
            <Text variant="p6" className="text-gray-400">
               Columns
            </Text>

            {columns.map((col, index) => (
              <div key={index} className="flex items-center gap-4">
                <TextField
                  placeholder="e.g. Todo"
                  value={col}
                  onChange={(e) => updateColumn(index, e.target.value)}
                  fullWidth
                />
                <button
                  aria-label="Remove column"
                  type="button"
                  onClick={() => removeColumn(index)}
                  className="group p-2"
                >
                  <IconCross className="fill-[#828FA3] group-hover:fill-danger transition-colors" />
                </button>
              </div>
            ))}

            <Button
              type="button"
              variant="secondary"
              fullWidth
              onClick={addColumn}
            >
              + Add New Column
            </Button>
          </div>

          
          <Button type="submit" variant="primary" fullWidth>
            Create New Board
          </Button>
        </form>
      </div>
    </Modal>
  );
}
