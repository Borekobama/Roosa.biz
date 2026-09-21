/**
 * On-load entrance. Distinct from Reveal, which waits for scroll: this runs
 * immediately so the first screen eases in rather than snapping into place.
 */
export default function Enter({
  children,
  delay = 0,
  from = "top",
  className = "",
  as: Tag = "div",
}: {
  children: React.ReactNode;
  delay?: number;
  from?: "top" | "bottom";
  className?: string;
  as?: React.ElementType;
}) {
  return (
    <Tag
      className={`${from === "bottom" ? "enter-up" : "enter-rise"} ${className}`}
      style={{ ["--enter-delay" as string]: `${delay}ms` }}
    >
      {children}
    </Tag>
  );
}
