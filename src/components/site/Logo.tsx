/** Text wordmark until final Roosa logo is supplied. */
export default function Logo({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-baseline font-[var(--font-display)] text-[46px] font-light leading-none tracking-[-0.02em] ${className}`}
    >
      roosa
      <span className="ml-[2px] translate-y-[-0.7em] text-[0.34em] tracking-normal">®</span>
    </span>
  );
}
