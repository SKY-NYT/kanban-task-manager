import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useKanbanStore } from "../../store/useKanbanStore";
import Modal from "../atoms/Modal";
import { Text } from "../atoms/Text";
import TextField from "../atoms/TextField";
import Dropdown from "../atoms/Dropdown";
import Button from "../atoms/Buttons";
import IconCross from "../../assets/images/icon-cross.svg?react";
import type { Column, Task, Subtask } from "../../types/types";

export default function AddTaskModal() {
  const { boardId } = useParams();
  const navigate = useNavigate();

  const {
    data,
    addTask,
    subtaskErrors,
    setSubtaskErrors,
    resetSubtaskErrors,
    getCrossIconClass,
  } = useKanbanStore();

  const boardIndex = boardId ? Number(boardId) : 0;
  const currentBoard = data.boards?.[boardIndex];

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [subtasks, setSubtasks] = useState(["", ""]);
  const [status, setStatus] = useState(currentBoard?.columns?.[0]?.name || "");

  useEffect(() => {
    // ensure predictable initial state when opening modal
    resetSubtaskErrors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const syncErrorsLength = (nextLen: number) => {
    const next = Array.from(
      { length: nextLen },
      (_, i) => subtaskErrors[i] ?? "",
    );
    setSubtaskErrors(next);
  };

  const statusOptions =
    currentBoard?.columns?.map((col: Column) => ({
      label: col.name,
      value: col.name,
    })) || [];

  const handleAddSubtask = () => {
    const nextSubtasks = [...subtasks, ""];
    setSubtasks(nextSubtasks);
    syncErrorsLength(nextSubtasks.length);
  };

  const handleRemoveSubtask = (index: number) => {
    const nextSubtasks = subtasks.filter((_, i) => i !== index);
    setSubtasks(nextSubtasks);

    const nextErrors = subtaskErrors.filter((_, i) => i !== index);
    setSubtaskErrors(nextErrors);
  };

  const handleSubtaskChange = (index: number, value: string) => {
    const updated = [...subtasks];
    updated[index] = value;
    setSubtasks(updated);

    if (subtaskErrors[index]) {
      const nextErrors = [...subtaskErrors];
      nextErrors[index] = value.trim().length === 0 ? "Can't be empty" : "";
      setSubtaskErrors(nextErrors);
    }
  };

  return (
    <Modal>
      <div className="flex flex-col gap-6">
        <Text variant="p2" className="text-foreground">
          Add New Task
        </Text>

        <form
          className="flex flex-col gap-6"
          onSubmit={(e) => {
            e.preventDefault();

            const nextErrors = subtasks.map((s) =>
              s.trim().length === 0 ? "Can't be empty" : "",
            );
            setSubtaskErrors(nextErrors);

            const hasErrors = nextErrors.some(Boolean);
            if (hasErrors) return;

            if (!currentBoard) return;
            const toColumnIndex = currentBoard.columns.findIndex(
              (c: Column) => c.name === status,
            );
            if (toColumnIndex < 0) return;

            const nextSubtasks: Subtask[] = subtasks.map((s) => ({
              title: s.trim(),
              isCompleted: false,
            }));

            const newTask: Task = {
              title: title.trim(),
              description,
              status,
              subtasks: nextSubtasks,
            };

            addTask(boardIndex, toColumnIndex, newTask);
            navigate(`/boards/${boardIndex}`);
          }}
        >
          <TextField
            label="Title"
            placeholder="e.g. Take coffee break"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
          />

          <div className="flex flex-col gap-2">
            <label>
              <Text variant="p6" className="text-gray-400">
                Description
              </Text>
            </label>
            <textarea
              className="w-full h-28 px-4 py-2 rounded-sm bg-background-secondary border border-[#828fa340]  outline-none focus:border-primary text-[13px] leading-6 resize-none transition-all placeholder:opacity-25"
              placeholder="e.g. It’s always good to take a break. This 15 minute break will recharge the batteries a little."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-3">
            <Text variant="p6" className="text-gray-400 font-bold">
              Subtasks
            </Text>

            {subtasks.map((sub, index) => (
              <div key={index} className="flex items-center gap-4">
                <TextField
                  placeholder={
                    index === 0
                      ? "e.g. Make coffee"
                      : "e.g. Drink coffee & smile"
                  }
                  value={sub}
                  onChange={(e) => handleSubtaskChange(index, e.target.value)}
                  fullWidth
                  error={subtaskErrors[index]}
                />
                <button
                  aria-label="Remove subtask"
                  type="button"
                  onClick={() => handleRemoveSubtask(index)}
                  className="group transition-colors"
                >
                  <IconCross
                    className={getCrossIconClass(Boolean(subtaskErrors[index]))}
                  />
                </button>
              </div>
            ))}

            <Button
              type="button"
              variant="secondary"
              size="md"
              fullWidth
              onClick={handleAddSubtask}
              className="hover:bg-interactive-dynamic hover:text-primary"
            >
              + Add New Subtask
            </Button>
          </div>

          <Dropdown
            label="Status"
            value={status}
            options={statusOptions}
            onChange={(val) => setStatus(val)}
            className="w-full "
          />

          <Button type="submit" variant="primary" fullWidth>
            Create Task
          </Button>
        </form>
      </div>
    </Modal>
  );
}
