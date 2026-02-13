import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useKanbanStore } from "../../store/useKanbanStore";
import Modal from "../atoms/Modal";
import { Text } from "../atoms/Text";
import TextField from "../atoms/TextField";
import Button from "../atoms/Buttons";
import IconCross from "../../assets/images/icon-cross.svg?react";
import type { Column } from "../../types/types";

export default function EditBoardModal() {
  const { boardId } = useParams();
  const navigate = useNavigate();
  const { data, setData, getCrossIconClass } = useKanbanStore();

  // Find the current board to pre-populate the form
  const bIndex = boardId ? Number(boardId) : 0;
  const currentBoard = data.boards?.[bIndex];

  // State initialized with existing board data
  const [boardName, setBoardName] = useState(currentBoard?.name || "");
  const [boardNameError, setBoardNameError] = useState("");
  const [columns, setColumns] = useState(
    currentBoard?.columns.map((col: Column) => col.name) || ["Todo", "Doing"],
  );
  const [columnErrors, setColumnErrors] = useState<string[]>(
    (currentBoard?.columns.map(() => "") as string[] | undefined) ?? ["", ""],
  );

  const handleAddColumn = () => {
    setColumns([...columns, ""]);
    setColumnErrors((prev) => [...prev, ""]);
  };

  const handleRemoveColumn = (index: number) => {
    // Logic usually prevents having 0 columns
    if (columns.length > 1) {
      setColumns(columns.filter((_, i) => i !== index));
      setColumnErrors(columnErrors.filter((_, i) => i !== index));
    }
  };

  const handleColumnChange = (index: number, value: string) => {
    const updatedColumns = [...columns];
    updatedColumns[index] = value;
    setColumns(updatedColumns);

    if (columnErrors[index]) {
      const nextErrors = [...columnErrors];
      nextErrors[index] = value.trim().length === 0 ? "Can't be empty" : "";
      setColumnErrors(nextErrors);
    }
  };

  if (!currentBoard) return null;

  return (
    <Modal>
      <div className="flex flex-col gap-6">
        <Text variant="p2" className="text-foreground">
          Edit Board
        </Text>

        <form
          className="flex flex-col gap-6"
          onSubmit={(e) => {
            e.preventDefault();

            const nextName = boardName.trim();
            setBoardNameError(nextName.length === 0 ? "Can't be empty" : "");

            const nextColumnErrors = columns.map((c) =>
              c.trim().length === 0 ? "Can't be empty" : "",
            );
            setColumnErrors(nextColumnErrors);

            const hasErrors =
              nextName.length === 0 || nextColumnErrors.some(Boolean);
            if (hasErrors) return;

            const nextBoards = [...data.boards];
            const prevBoard = nextBoards[bIndex];
            if (!prevBoard) return;

            const nextColumns = columns.map((name, i) => {
              const trimmed = name.trim();
              const prevCol = prevBoard.columns[i];
              return prevCol
                ? { ...prevCol, name: trimmed }
                : ({ name: trimmed, tasks: [] } as Column);
            });

            nextBoards[bIndex] = {
              ...prevBoard,
              name: nextName,
              columns: nextColumns,
            };

            setData({ ...data, boards: nextBoards });
            navigate(`/boards/${bIndex}`);
          }}
        >
          {/* Board Name Input */}
          <TextField
            label="Board Name"
            placeholder="e.g. Web Design"
            value={boardName}
            onChange={(e) => setBoardName(e.target.value)}
            fullWidth
            error={boardNameError}
          />

          {/* Board Columns Management */}
          <div className="flex flex-col gap-3">
            <Text variant="p6" className="text-gray-400 font-bold">
              Board Columns
            </Text>

            <div className="flex flex-col gap-3 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
              {columns.map((colName, index) => (
                <div key={index} className="flex items-center gap-4">
                  <TextField
                    value={colName}
                    onChange={(e) => handleColumnChange(index, e.target.value)}
                    placeholder="e.g. Done"
                    fullWidth
                    error={columnErrors[index]}
                  />
                  <button
                    aria-label="Remove column"
                    type="button"
                    onClick={() => handleRemoveColumn(index)}
                    className="group"
                  >
                    <IconCross
                      className={getCrossIconClass(
                        Boolean(columnErrors[index]),
                      )}
                    />
                  </button>
                </div>
              ))}
            </div>

            <Button
              type="button"
              variant="secondary"
              size="md"
              fullWidth
              onClick={handleAddColumn}
              className="hover:bg-interactive-dynamic hover:text-primary"
            >
              + Add New Column
            </Button>
          </div>

          {/* Action Button */}
          <Button type="submit" variant="primary" fullWidth>
            Save Changes
          </Button>
        </form>
      </div>
    </Modal>
  );
}
