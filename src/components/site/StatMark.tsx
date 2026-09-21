/**
 * The 15px marks beside the home stat labels.
 *
 * Measured on the source: a 15x15 glyph sitting 8px before an 18px label, with
 * the pair vertically centred. The drawings are original - what is taken from
 * the source is the size, the position and the subjects.
 */
export type StatMarkName = "timer" | "arrow" | "star";

const glyphs: Record<StatMarkName, React.ReactNode> = {
  timer: (
    <>
      <circle cx="8" cy="9.2" r="5.4" fill="none" stroke="currentColor" strokeWidth="1.4" />
      <path
        d="M8 6.4v2.8l1.9 1.3M6.3 1.8h3.4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </>
  ),
  arrow: (
    <path
      d="M3.6 11.8 11.4 4M6.3 3.6h5.4v5.4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  star: (
    <path d="M8 1.4 9.9 6h4.7l-3.7 3.2 1.2 4.7L8 11.3l-4.1 2.6 1.2-4.7L1.4 6h4.7Z" />
  ),
};

export default function StatMark({ name }: { name: StatMarkName }) {
  return (
    <svg
      viewBox="0 0 16 16"
      width="15"
      height="15"
      fill="currentColor"
      aria-hidden="true"
      className="shrink-0"
    >
      {glyphs[name]}
    </svg>
  );
}
