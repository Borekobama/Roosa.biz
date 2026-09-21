/** Small dot plus label, as the source sets above section headings. */
export default function DotEyebrow({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p // 12px on a phone, 14 above - measured on the source's legal pages,
    // where its published line sets 12/20 against this 14, and on the home
    // page at 390/768/1440. The step is the source's own 720, not Tailwind's
    // 640, and the tracking is -0.01em: it measures -0.12 at 12 and -0.14 at
    // 14, so the fixed -0.14px was right only at the larger size.
    className={`flex items-center justify-center gap-2 text-[12px] leading-[20px] tracking-[-0.01em] text-moss min-[720px]:text-[14px] ${className}`}>
      <span aria-hidden="true" className="inline-block h-[5px] w-[5px] rounded-full bg-olive" />
      {children}
    </p>
  );
}
