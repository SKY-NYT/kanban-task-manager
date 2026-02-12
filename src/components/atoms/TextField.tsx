import { useId, type InputHTMLAttributes } from "react";
import { Text } from "./Text";

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
}

export default function TextField({ label, error, fullWidth, className, ...rest }: TextFieldProps) {
  const id = useId();
  const hasError = Boolean(error);

  return (
    <div className={`flex flex-col gap-2 ${fullWidth ? "w-full" : "w-87.5"}`}>
      {label && (
        <label htmlFor={id}>
          <Text variant="p6" className="text-gray-400">{label}</Text>
        </label>
      )}
      <div className="relative flex items-center">
        <input
          id={id}
          className={`h-10 w-full px-4 rounded-sm bg-background-secondary outline-none border font-sans text-[13px] transition-all
            ${hasError ? "border-danger" : "border-[#828fa340] focus:border-primary"} ${className}`}
          {...rest}
        />
        {hasError && (
          <Text variant="p6" className="absolute right-4 text-danger">{error}</Text>
        )}
      </div>
    </div>
  );
}