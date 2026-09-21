/**
 * Glyphs for the pinned panel feature columns and the science cards.
 *
 * Drawn here rather than imported: the source's marks belong to its own icon
 * set, so these are original drawings that only have to read at ~30px. What is
 * taken from the source is the weight, not the artwork - measuring the panels
 * gives marks 28-31px wide and 29-34px tall, and they are solid shapes rather
 * than hairlines, so these are filled too. The earlier set was drawn at a
 * 1.4px stroke, which read as a different family beside the source.
 */
export type PanelIconName =
  | "people"
  | "mind"
  | "stethoscope"
  | "bolt"
  | "recovery"
  | "strength"
  | "flask"
  | "chart"
  | "leaf";

const glyphs: Record<PanelIconName, React.ReactNode> = {
  // two figures, the nearer one overlapping
  people: (
    <>
      <circle cx="20.2" cy="9.6" r="4.1" />
      <path d="M20.2 15.4c3.9 0 7.1 2.9 7.4 6.6a1.6 1.6 0 0 1-1.6 1.8h-3.3c-.3-3-1.9-5.6-4.3-7.3.5-.7 1.1-1.1 1.8-1.1Z" />
      <circle cx="11.4" cy="8.7" r="5.2" />
      <path d="M11.4 15.6c4.9 0 8.9 3.6 9.3 8.4a1.7 1.7 0 0 1-1.7 1.9H3.8a1.7 1.7 0 0 1-1.7-1.9c.4-4.8 4.4-8.4 9.3-8.4Z" />
    </>
  ),
  // a head with the heart cut out of it
  mind: (
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M15 2.6c6.2 0 11.2 4.7 11.2 10.5 0 3.3-1.6 6.2-4.1 8.1v5.1a1.9 1.9 0 0 1-1.9 1.9H9.8a1.9 1.9 0 0 1-1.9-1.9v-5.1c-2.5-1.9-4.1-4.8-4.1-8.1C3.8 7.3 8.8 2.6 15 2.6Zm0 6.6-.8-.8a2.7 2.7 0 0 0-3.8 3.8l4.6 4.6 4.6-4.6a2.7 2.7 0 0 0-3.8-3.8Z"
    />
  ),
  // tubing drawn as a heavy stroke so it sits at the same weight as the fills
  stethoscope: (
    <>
      <circle cx="6.6" cy="3.6" r="2.3" />
      <circle cx="16.6" cy="3.6" r="2.3" />
      <path
        d="M6.6 6.9v4.6a5 5 0 0 0 10 0V6.9"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.7"
        strokeLinecap="round"
      />
      <path
        d="M11.6 16.5v2.4a5.6 5.6 0 0 0 11.2 0v-1.6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.7"
        strokeLinecap="round"
      />
      <circle cx="22.8" cy="13.4" r="3.7" />
    </>
  ),
  bolt: (
    <path d="M18.2 1.8 6.6 17.2a1.1 1.1 0 0 0 .9 1.8h4.9l-1.6 10.4a.9.9 0 0 0 1.6.6l11.4-15.3a1.1 1.1 0 0 0-.9-1.8h-4.9l1.6-10.4a.9.9 0 0 0-1.4-.7Z" />
  ),
  // an open ring closed by an arrowhead
  recovery: (
    <>
      <path
        d="M6.2 9.4a11.6 11.6 0 1 0 8.8-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path d="M13.6 1.1 19.2 4.3a1 1 0 0 1 0 1.8l-5.6 3.2a1 1 0 0 1-1.5-.9V2a1 1 0 0 1 1.5-.9Z" />
    </>
  ),
  strength: (
    <>
      <rect x="6.4" y="8.6" width="4.6" height="14.8" rx="2.3" />
      <rect x="19" y="8.6" width="4.6" height="14.8" rx="2.3" />
      <rect x="2" y="12.2" width="3.4" height="7.6" rx="1.7" />
      <rect x="24.6" y="12.2" width="3.4" height="7.6" rx="1.7" />
      <rect x="10.6" y="13.9" width="8.8" height="4.2" rx="1.6" />
    </>
  ),
  flask: (
    <path d="M11.2 2.4h7.6a1.5 1.5 0 0 1 0 3h-.5v6.4l6.5 12.4a2.9 2.9 0 0 1-2.6 4.2H7.8a2.9 2.9 0 0 1-2.6-4.2l6.5-12.4V5.4h-.5a1.5 1.5 0 0 1 0-3Z" />
  ),
  chart: (
    <>
      <rect x="2.6" y="17.6" width="5.4" height="10.6" rx="1.8" />
      <rect x="12.3" y="11.4" width="5.4" height="16.8" rx="1.8" />
      <rect x="22" y="4.6" width="5.4" height="23.6" rx="1.8" />
    </>
  ),
  leaf: (
    <>
      <path d="M26.4 3.2c1.6 11.6-4 20.8-13.4 20.8A9.6 9.6 0 0 1 5.3 8.6C10 3.4 18.9 3.5 26.4 3.2Z" />
      <path d="M5.6 28.9a1.5 1.5 0 0 1-2.5-1.5C7 20 12.9 15.2 19.4 13a1.5 1.5 0 0 1 1 2.8C14.4 17.9 9 22.2 5.6 28.9Z" />
    </>
  ),
};

export default function PanelIcon({
  name,
  className = "",
}: {
  name: PanelIconName;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 30 32"
      width="30"
      height="32"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      {glyphs[name]}
    </svg>
  );
}
