/**
 * Original decorative line drawings.
 *
 * The source fills two slots in the pinned track with inline SVG line art at
 * 528x723 and 192x454. These are drawn for this repository at the same
 * geometry and stroke weight so the panel composition matches.
 */

/**
 * Upright jar outline for the benefits card. The source stands a jar at the
 * card's bottom right; this is drawn here at that footprint - body, shoulder,
 * lid and a couple of contents lines, carrying no mark of its own.
 */
export function UprightJarLineArt({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 242 228"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {/* lid */}
      <path d="M32 18h178a16 16 0 0 1 16 16v20H16V34a16 16 0 0 1 16-16Z" />
      {/* shoulder into the body */}
      <path d="M16 54h210v146a28 28 0 0 1-28 28H44a28 28 0 0 1-28-28V54Z" />
      {/* contents, kept light */}
      <g strokeOpacity="0.4">
        <path d="M44 114h154" />
        <path d="M44 150h112" />
        <ellipse cx="170" cy="188" rx="26" ry="18" />
      </g>
    </svg>
  );
}

export function JarLineArt({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 528 723"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {/* Tipped jar: body, lid, rim */}
      <g transform="rotate(-18 264 470)">
        <path d="M168 372h192a16 16 0 0 1 16 16v226a48 48 0 0 1-48 48H200a48 48 0 0 1-48-48V388a16 16 0 0 1 16-16Z" />
        <path d="M156 372v-34a20 20 0 0 1 20-20h176a20 20 0 0 1 20 20v34" />
        <path d="M176 318v-26a14 14 0 0 1 14-14h148a14 14 0 0 1 14 14v26" />
        <path d="M196 430h136" strokeOpacity="0.45" />
        <path d="M196 470h96" strokeOpacity="0.45" />
      </g>

      {/* Pieces leaving the jar */}
      <g>
        <ellipse cx="392" cy="248" rx="34" ry="26" transform="rotate(22 392 248)" />
        <ellipse cx="318" cy="150" rx="29" ry="22" transform="rotate(-14 318 150)" />
        <ellipse cx="434" cy="112" rx="24" ry="19" transform="rotate(38 434 112)" />
        <ellipse cx="236" cy="72" rx="20" ry="16" transform="rotate(8 236 72)" />
        <ellipse cx="452" cy="330" rx="27" ry="21" transform="rotate(-28 452 330)" />
      </g>

      {/* Motion arcs */}
      <g strokeOpacity="0.35" strokeDasharray="6 10">
        <path d="M352 300C392 232 418 176 432 132" />
        <path d="M330 296C316 220 300 160 268 104" />
      </g>
    </svg>
  );
}

export function SprigLineArt({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 192 454"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M96 442V96" />
      {Array.from({ length: 6 }, (_, i) => {
        const y = 118 + i * 54;
        return (
          <g key={y}>
            <path d={`M96 ${y + 26}C64 ${y + 18}, 44 ${y - 4}, 40 ${y - 30}C70 ${y - 26}, 90 ${y - 4}, 96 ${y + 26}Z`} />
            <path d={`M96 ${y + 26}C128 ${y + 18}, 148 ${y - 4}, 152 ${y - 30}C122 ${y - 26}, 102 ${y - 4}, 96 ${y + 26}Z`} />
          </g>
        );
      })}
      <circle cx="96" cy="72" r="22" />
    </svg>
  );
}
