import { useNavigate, useParams } from "react-router-dom";
import { useKanbanStore } from "../../store/useKanbanStore";
import { Text } from "../atoms/Text";
import Modal from "../atoms/Modal";
import Dropdown from "../atoms/Dropdown";
import { SubtaskCheckbox } from "../atoms/SubtaskCheckbox";
import IconVerticalEllipsis from "../../assets/images/icon-vertical-ellipsis.svg?react";
import type { Subtask, Task, Column } from "../../types/types";

export default function TaskView() {
  const { boardId, taskId } = useParams();
  const navigate = useNavigate();
  const { data } = useKanbanStore();
  const boards = data.boards ?? [];

  const bIndex = boardId ? Number(boardId) : 0;
  const tIndex = taskId ? Number(taskId) : 0;
  const board = boards[bIndex];


  const flatTasks: { task: Task; columnName: string }[] = [];
  board?.columns?.forEach((col: Column) => {
    col.tasks?.forEach((task: Task) => {
      flatTasks.push({ task, columnName: col.name });
    });
  });

  const entry = flatTasks[tIndex];
  if (!entry) return null;

  const { task, columnName } = entry;
  const completedCount = task.subtasks.filter((s: Subtask) => s.isCompleted).length;

  // Prepare options for the status dropdown
  const statusOptions = board.columns.map((col: Column) => ({
    label: col.name,
    value: col.name,
  }));

  const handleEdit = () => {
    
    navigate(`/board/${boardId}/edit-task/${taskId}`);
  };

  return (
    <Modal>
      <div className="flex flex-col gap-6">
       
        <div className="flex items-center justify-between gap-4">
          <Text variant="p1" className="text-foreground">
            {task.title}
          </Text>
          <button onClick={handleEdit} aria-label="Task options" className="p-2 transition-transform hover:scale-110">
            <IconVerticalEllipsis className="fill-[#828FA3]" />
          </button>
        </div>

        {/* Description */}
        {task.description && (
          <Text variant="p6" className="text-gray-400 leading-6">
            {task.description}
          </Text>
        )}

        {/* Subtasks Section */}
        <div className="flex flex-col gap-4">
          <Text variant="p4" className="text-gray-400 font-bold">
            Subtasks ({completedCount} of {task.subtasks.length})
          </Text>
          <div className="flex flex-col gap-2">
            {task.subtasks.map((sub: Subtask, index: number) => (
              <SubtaskCheckbox
                key={index}
                label={sub.title}
                isCompleted={sub.isCompleted}
                onToggle={() => {
                  /* Logic to handle subtask toggle would go here */
                  console.log("Toggled subtask:", sub.title);
                }}
              />
            ))}
          </div>
        </div>

        {/* Status Section */}
        <div className="flex flex-col gap-2">
          <Dropdown
            label="Current Status"
            options={statusOptions}
            value={columnName}
            onChange={(val) => {
              console.log("Move task to:", val);
            }}
          />
        </div>
      </div>
    </Modal>
  );
}