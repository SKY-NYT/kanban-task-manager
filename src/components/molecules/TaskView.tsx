import { useNavigate, useParams } from "react-router-dom";
import { useKanbanStore } from "../../store/useKanbanStore";
import { Text } from "../atoms/Text";
import Modal from "../atoms/Modal";
import Dropdown from "../atoms/Dropdown";
import { SubtaskCheckbox } from "../atoms/SubtaskCheckbox";
import Menu from "../atoms/Menu";
import type { Subtask, Column } from "../../types/types";

export default function TaskView() {
  const { boardId, columnIndex, taskIndex } = useParams();
  const navigate = useNavigate();

  const { data, moveTask, updateTask } = useKanbanStore();

  const boards = data.boards ?? [];

  const bIndex = boardId ? Number(boardId) : 0;
  const board = boards[bIndex];

  const cIndex = columnIndex ? Number(columnIndex) : 0;
  const tIndex = taskIndex ? Number(taskIndex) : 0;

  const col = board?.columns?.[cIndex];
  const task = col?.tasks?.[tIndex];
  if (!board || !col || !task) return null;

  const columnName = col.name;
  const completedCount = task.subtasks.filter(
    (s: Subtask) => s.isCompleted,
  ).length;

  const statusOptions = board.columns.map((col: Column) => ({
    label: col.name,
    value: col.name,
  }));

  const handleEdit = () => {
    navigate(`/board/${boardId}/edit-task/${cIndex}/${tIndex}`);
  };

  const handleDelete = () => {
    navigate(`/board/${boardId}/delete-task/${cIndex}/${tIndex}`);
  };

  return (
    <Modal>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between gap-4">
          <Text variant="p1" className="text-foreground">
            {task.title}
          </Text>

          <Menu onEdit={handleEdit} onDelete={handleDelete} />
        </div>

        {task.description && (
          <Text variant="p6" className="text-gray-400 leading-6">
            {task.description}
          </Text>
        )}

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
                  const nextSubtasks = task.subtasks.map(
                    (s: Subtask, i: number) =>
                      i === index ? { ...s, isCompleted: !s.isCompleted } : s,
                  );
                  updateTask(bIndex, cIndex, tIndex, {
                    subtasks: nextSubtasks,
                  });
                }}
              />
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Dropdown
            label="Current Status"
            options={statusOptions}
            value={columnName}
            onChange={(val) => {
              const toColumnIndex = board.columns.findIndex(
                (c: Column) => c.name === val,
              );
              if (toColumnIndex < 0 || toColumnIndex === cIndex) return;

              const toTaskIndex =
                board.columns[toColumnIndex]?.tasks?.length ?? 0;

              moveTask({
                boardIndex: bIndex,
                fromColumnIndex: cIndex,
                taskIndex: tIndex,
                toColumnIndex,
                toTaskIndex,
              });

              navigate(
                `/board/${boardId}/task/${toColumnIndex}/${toTaskIndex}`,
              );
            }}
          />
        </div>
      </div>
    </Modal>
  );
}
