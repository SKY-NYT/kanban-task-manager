import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../atoms/Buttons";
import TextField from "../atoms/TextField";
import { Text } from "../atoms/Text";
import IconCross from "../../assets/images/icon-cross.svg?react";
import Modal from "../atoms/Modal";
import { useKanbanStore } from "../../store/useKanbanStore";
import { useShallow } from "zustand/shallow";

export default function AddBoardModal() {
  const navigate = useNavigate();
  const { data, addBoard, addColumn, getCrossIconClass } = useKanbanStore(
    useShallow((s) => ({
      data: s.data,
      addBoard: s.addBoard,
      addColumn: s.addColumn,
      getCrossIconClass: s.getCrossIconClass,
    })),
  );
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState("");
  const [columns, setColumns] = useState(["Todo", "Doing"]);
  const [columnErrors, setColumnErrors] = useState<string[]>(["", ""]);

  const handleClose = () => navigate(-1);

  const handleAddColumn = () => {
    const next = [...columns, ""];
    setColumns(next);
    setColumnErrors((prev) => [...prev, ""]);
  };

  const updateColumn = (index: number, value: string) => {
    const newCols = [...columns];
    newCols[index] = value;
    setColumns(newCols);

    if (columnErrors[index]) {
      const nextErrors = [...columnErrors];
      nextErrors[index] = value.trim().length === 0 ? "Can't be empty" : "";
      setColumnErrors(nextErrors);
    }
  };

  const removeColumn = (index: number) => {
    setColumns(columns.filter((_, i) => i !== index));
    setColumnErrors(columnErrors.filter((_, i) => i !== index));
  };

  return (
  
    <Modal onClose={handleClose}>
      <div className="flex flex-col gap-6">
        <Text variant="p2" className="text-foreground">
          Add New Board
        </Text>

        <form
          className="flex flex-col gap-6"
          onSubmit={(e) => {
            e.preventDefault();

            const nextName = name.trim();
            setNameError(nextName.length === 0 ? "Can't be empty" : "");

            const nextColumnErrors = columns.map((c) =>
              c.trim().length === 0 ? "Can't be empty" : "",
            );
            setColumnErrors(nextColumnErrors);

            const hasErrors =
              nextName.length === 0 || nextColumnErrors.some(Boolean);
            if (hasErrors) return;

            const newBoardIndex = data.boards.length;
            addBoard(nextName);

            columns.forEach((c) => {
              const colName = c.trim();
              if (colName.length === 0) return;
              addColumn(newBoardIndex, colName);
            });

            navigate(`/boards/${newBoardIndex}`);
          }}
        >
          <TextField
            label="Board Name"
            placeholder="e.g. Web Design"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            error={nameError}
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
                  error={columnErrors[index]}
                />
                <button
                  aria-label="Remove column"
                  type="button"
                  onClick={() => removeColumn(index)}
                  className="group transition-colors"
                >
                  <IconCross
                    className={getCrossIconClass(Boolean(columnErrors[index]))}
                  />
                </button>
              </div>
            ))}

            <Button
              type="button"
              variant="secondary"
              fullWidth
              onClick={handleAddColumn}
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
