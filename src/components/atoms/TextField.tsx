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
  const hasError = Boolean(error);
  const errorId = `${id}-error`;

  const inputClassName = `h-10 w-full px-4 rounded-sm bg-background-secondary outline-none border font-sans text-[13px] transition-all
            ${hasError ? "border-danger" : "border-[#828fa340] focus:border-primary"} ${className}`;

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
        {hasError ? (
          <input
            id={id}
            aria-invalid="true"
            aria-describedby={errorId}
            className={inputClassName}
            {...rest}
          />
        ) : (
          <input
            id={id}
            aria-invalid="false"
            className={inputClassName}
            {...rest}
          />
        )}
        {hasError && (
          <Text
            id={errorId}
            variant="p6"
            className="absolute right-4 text-danger"
            role="alert"
          >
            {error}
          </Text>
        )}
      </div>
    </div>
  );
}
