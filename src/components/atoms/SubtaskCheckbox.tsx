import { Text } from "./Text";
import IconCheck from "../../assets/images/icon-check.svg?react";

interface SubtaskCheckboxProps {
  label: string;
  isCompleted: boolean;
  onToggle: () => void;
}

export const SubtaskCheckbox = ({
  label,
  isCompleted,
  onToggle,
}: SubtaskCheckboxProps) => {
  return (
    <label className="flex items-center gap-4 w-full h-10 px-3 cursor-pointer rounded-sm bg-background hover:bg-[#635FC7]/25 transition-all">
      <span className="relative inline-flex h-4 w-4 items-center justify-center">
        <input
          type="checkbox"
          checked={isCompleted}
          onChange={onToggle}
          className="h-4 w-4 rounded-sm border  border-[#828fa340] appearance-none cursor-pointer checked:bg-primary checked:border-none"
        />
        {isCompleted && (
          <IconCheck className="pointer-events-none absolute inset-0 m-auto h-2 w-2 " />
        )}
      </span>
      <Text
        variant="p6"
        className={`${isCompleted ? "line-through opacity-50" : ""} text-foreground transition-all`}
      >
        {label}
      </Text>
    </label>
  );
};
