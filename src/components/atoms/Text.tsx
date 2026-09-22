type TextVariant = "p1" | "p2" | "p3" | "p4" | "p5" | "p6";
type TextProps<T extends React.ElementType = "p"> = {
  as?: T;
  variant?: TextVariant;
  className?: string;
  children: React.ReactNode;
} & Omit<React.ComponentPropsWithoutRef<T>, "as" | "className" | "children">;

export function Text<T extends React.ElementType = "p">({
  as,
  variant = "p3",
  className = "",
  children,
  ...rest
}: TextProps<T>) {
  const styles = {
    p1: "text-h-xl",
    p2: "text-h-lg ",
    p3: "text-h-md",
    p4: "text-h-sm",
    p5: "text-body-lg",
    p6: "text-body-md",
  };

  const Component = (as ?? "p") as React.ElementType;

  return (
    <Component className={`${styles[variant]} ${className}`} {...rest}>
      {children}
    </Component>
  );
}
