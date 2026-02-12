import { Text } from "./Text";

interface SubtaskCheckboxProps {
  label: string;
  isCompleted: boolean;
  onToggle: () => void;
}

export const SubtaskCheckbox = ({ label, isCompleted, onToggle }: SubtaskCheckboxProps) => {
  return (
    <label
      onClick={onToggle}
      className="flex items-center gap-4 w-87.5 h-10 px-3 cursor-pointer rounded-sm bg-background-secondary hover:bg-[#635FC7]/25 transition-all"
    >
      <input
        type="checkbox"
        checked={isCompleted}
        readOnly
        className="w-4 h-4 rounded-sm border border-[#828fa340]  appearance-none cursor-pointer relative checked:bg-primary checked:border-none
          checked:after:content-[''] checked:after:absolute checked:after:left-1.5 checked:after:top-0.5 checked:after:w-1 checked:after:h-2 
          checked:after:border-white checked:after:border-r-2 checked:after:border-b-2 checked:after:rotate-45"
      />
      <Text variant="p6" className={`${isCompleted ? "line-through opacity-50" : ""} text-foreground transition-all`}>
        {label}
      </Text>
    </label>
  );
};