type TextVariant = "p1" | "p2" | "p3" | "p4" | "p5"| "p6";
interface TextProps {
  as?: React.ElementType;
  variant?: TextVariant;
  className?: string;
  children: React.ReactNode;
}

export function Text({
  as = "p",
  variant = "p3",
  className = "",
  children,
}: TextProps) {
  const styles = {
    p1: "text-h-xl",
    p2: "text-h-lg ",
    p3: "text-h-md",
    p4: "text-h-sm",
    p5: "text-body-lg",
    p6: "text-body-md",
  };

  const Component = as;

  return (
    <Component className={`${styles[variant]} ${className}`}>
      {children}
    </Component>
  );
}
