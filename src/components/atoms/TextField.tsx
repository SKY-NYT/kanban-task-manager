import { useId, type InputHTMLAttributes } from "react";
import { Text } from "./Text";

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
}

export default function TextField({
  label,
  error,
  fullWidth,
  className,
  ...rest
}: TextFieldProps) {
  const id = useId();
  void error;

  return (
    <div className={`flex flex-col gap-2 ${fullWidth ? "w-full" : "w-87.5"}`}>
      {label && (
        <label htmlFor={id}>
          <Text variant="p6" className="text-gray-400">
            {label}
          </Text>
        </label>
      )}
      <div className="relative flex items-center">
        <input
          id={id}
          className={`h-10 w-full px-4 rounded-sm bg-background-secondary outline-none border font-sans text-[13px] transition-all
            border-[#828fa340] focus:border-primary ${className}`}
          {...rest}
        />
      </div>
    </div>
  );
}
