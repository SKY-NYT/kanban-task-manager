import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useKanbanStore } from "../../store/useKanbanStore";
import Modal from "../atoms/Modal";
import { Text } from "../atoms/Text";
import TextField from "../atoms/TextField";
import Dropdown from "../atoms/Dropdown";
import Button from "../atoms/Buttons";
import IconCross from "../../assets/images/icon-cross.svg?react";
import type { Task, Subtask, Column } from "../../types/types";

export default function EditTaskModal() {
  const { boardId, columnIndex, taskIndex } = useParams();
  const navigate = useNavigate();
  const { data, updateTask, moveTask } = useKanbanStore();

  const boardIndex = boardId ? Number(boardId) : 0;
  const colIndex = columnIndex ? Number(columnIndex) : 0;
  const tIndex = taskIndex ? Number(taskIndex) : 0;

  const currentBoard = data.boards?.[boardIndex];
  const currentColumn = currentBoard?.columns?.[colIndex];
  const existingTask: Task | undefined = currentColumn?.tasks?.[tIndex];
  const initialStatus = currentColumn?.name ?? "";

  // Form State
  const [title, setTitle] = useState(existingTask?.title || "");
  const [description, setDescription] = useState(
    existingTask?.description || "",
  );
  const [subtasks, setSubtasks] = useState<string[]>(
    existingTask?.subtasks.map((s: Subtask) => s.title) || ["", ""],
  );
  const [status, setStatus] = useState(initialStatus);

  // Column options
  const statusOptions =
    currentBoard?.columns?.map((col: Column) => ({
      label: col.name,
      value: col.name,
    })) || [];

  const handleAddSubtask = () => setSubtasks([...subtasks, ""]);
  const handleRemoveSubtask = (index: number) =>
    setSubtasks(subtasks.filter((_, i) => i !== index));
  const handleSubtaskChange = (index: number, value: string) => {
    const updated = [...subtasks];
    updated[index] = value;
    setSubtasks(updated);
  };

  if (!existingTask) return null;

  return (
    <Modal>
      <div className="flex flex-col gap-6 max-h-[85vh] overflow-y-auto pr-2 custom-scrollbar">
        <Text variant="p1" className="text-foreground">
          Edit Task
        </Text>

        <form
          className="flex flex-col gap-6"
          onSubmit={(e) => {
            e.preventDefault();

            if (!currentBoard) return;

            const cleanedSubtasks = subtasks
              .map((s) => s.trim())
              .filter((s) => s.length > 0);
            const nextSubtasks: Subtask[] = cleanedSubtasks.map((title, i) => ({
              title,
              isCompleted: existingTask.subtasks[i]?.isCompleted ?? false,
            }));

            updateTask(boardIndex, colIndex, tIndex, {
              title,
              description,
              subtasks: nextSubtasks,
            });

            const toColumnIndex = currentBoard.columns.findIndex(
              (c: Column) => c.name === status,
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

            navigate(`/board/${boardId}`);
          }}
        >
          {/* Title */}
          <TextField
            label="Title"
            placeholder="e.g. Add authentication endpoints"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
          />

          {/* Description */}
          <div className="flex flex-col gap-2">
            <label>
              <Text variant="p6" className="text-gray-400">
                Description
              </Text>
            </label>
            <textarea
              className="w-full h-28 px-4 py-2 rounded-sm bg-background-secondary border border-[#828fa340] outline-none focus:border-primary text-[13px] leading-6 resize-none transition-all"
              placeholder="e.g. Define user model..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Subtasks */}
          <div className="flex flex-col gap-3">
            <Text variant="p6" className="text-gray-400 font-bold">
              Subtasks
            </Text>
            {subtasks.map((sub, index) => (
              <div key={index} className="flex items-center gap-4">
                <TextField
                  placeholder="e.g. Define user model"
                  value={sub}
                  onChange={(e) => handleSubtaskChange(index, e.target.value)}
                  fullWidth
                />
                <button
                  aria-label="Remove subtask"
                  type="button"
                  onClick={() => handleRemoveSubtask(index)}
                >
                  <IconCross className="fill-[#828FA3] hover:fill-danger transition-colors" />
                </button>
              </div>
            ))}
            <Button
              className="hover:bg-interactive-dynamic hover:text-primary"
              variant="secondary"
              size="md"
              fullWidth
              onClick={handleAddSubtask}
            >
              + Add New Subtask
            </Button>
          </div>

          {/* Status */}
          <Dropdown
            label="Status"
            value={status}
            options={statusOptions}
            onChange={(val) => setStatus(val)}
          />

          <Button type="submit" variant="primary" fullWidth>
            Save Changes
          </Button>
        </form>
      </div>
    </Modal>
  );
}
