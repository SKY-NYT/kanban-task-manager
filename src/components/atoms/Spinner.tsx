type SpinnerSize = "sm" | "md" | "lg";

export default function Spinner({
  size = "md",
  className = "",
  label = "Loading",
}: {
  size?: SpinnerSize;
  className?: string;
  label?: string;
}) {
  const sizeClass =
    size === "sm"
      ? "h-5 w-5 border-2"
      : size === "lg"
        ? "h-12 w-12 border-4"
        : "h-8 w-8 border-4";

  return (
    <div role="status" aria-label={label} className={className}>
      <div
        className={`${sizeClass} animate-spin rounded-full border-border border-t-primary`}
      />
    </div>
  );
}
