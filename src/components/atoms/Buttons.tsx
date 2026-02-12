import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Text } from "./Text";

type ButtonVariant = "primary" | "secondary" | "destructive";
type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: "btn-variant-primary",
  secondary: "btn-variant-secondary",
  destructive: "btn-variant-destructive",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "btn-size-sm",
  md: "btn-size-md",
  lg: "btn-size-lg",
};

export default function Button({
  variant = "primary",
  size = "lg",
  fullWidth,
  iconLeft,
  iconRight,
  className,
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={`btn ${variantClasses[variant]} ${sizeClasses[size]} ${fullWidth ? "w-full" : ""} ${className}`}
      {...rest}
    >
      {iconLeft && <span className="mr-2">{iconLeft}</span>}
      <Text variant={size === "lg" ? "p3" : "p6"} as="span">
        {children}
      </Text>
      {iconRight && <span className="ml-2">{iconRight}</span>}
    </button>
  );
}