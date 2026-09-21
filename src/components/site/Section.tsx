export function Container({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto w-full max-w-[1440px] px-4 sm:px-8 ${className}`}>{children}</div>
  );
}

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="t-eyebrow text-moss">{children}</p>;
}
