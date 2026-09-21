/**
 * Original generative placeholder artwork.
 *
 * The clone reproduces the source layout's image geometry (aspect ratio, radius,
 * object-fit) while supplying artwork authored for this repository. Swap these
 * for real photography by replacing the <Art /> usages with <Image />.
 */

type ArtKind =
  | "field"
  | "seed"
  | "leaf"
  | "bottle"
  | "bottle-sport"
  | "bag"
  | "cap"
  | "shirt"
  | "pin"
  | "poster"
  | "portrait";

const palettes: Record<ArtKind, [string, string, string]> = {
  field: ["#ed7eae", "#48162d", "#ffd5e7"],
  seed: ["#f7cadc", "#ed7eae", "#48162d"],
  leaf: ["#ffd5e7", "#b93670", "#48162d"],
  bottle: ["#f7cadc", "#de5b94", "#48162d"],
  "bottle-sport": ["#ffd5e7", "#ed7eae", "#48162d"],
  bag: ["#f8dce8", "#ed7eae", "#b93670"],
  cap: ["#ed7eae", "#48162d", "#f8dce8"],
  shirt: ["#fff8fb", "#f8dce8", "#b93670"],
  pin: ["#de5b94", "#48162d", "#f7cadc"],
  poster: ["#f8dce8", "#b93670", "#de5b94"],
  portrait: ["#f8dce8", "#ed7eae", "#48162d"],
};

/** Deterministic hash so a given seed always renders the same composition. */
function hash(seed: string) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i += 1) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

export default function Art({
  kind = "field",
  seed = "roosa",
  className = "",
  rounded = true,
  label,
}: {
  kind?: ArtKind;
  seed?: string;
  className?: string;
  rounded?: boolean;
  label?: string;
}) {
  const [a, b, c] = palettes[kind] ?? palettes.field;
  const n = hash(`${kind}:${seed}`);
  const gid = `g-${kind}-${n % 99991}`;
  const rot = (n % 40) - 20;
  const cx = 28 + (n % 45);
  const cy = 30 + ((n >> 3) % 40);

  return (
    <div
      className={`relative overflow-hidden ${rounded ? "rounded-[16px]" : ""} ${className}`}
      role="img"
      aria-label={label ?? "Decorative placeholder artwork"}
    >
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid slice"
        className="h-full w-full"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={a} />
            <stop offset="100%" stopColor={b} />
          </linearGradient>
          <radialGradient id={`${gid}-r`} cx="50%" cy="40%" r="70%">
            <stop offset="0%" stopColor={c} stopOpacity="0.85" />
            <stop offset="100%" stopColor={c} stopOpacity="0" />
          </radialGradient>
        </defs>

        <rect width="100" height="100" fill={`url(#${gid})`} />
        <circle cx={cx} cy={cy} r="34" fill={`url(#${gid}-r)`} />

        <g
          transform={`rotate(${rot} 50 50)`}
          stroke={c}
          strokeOpacity="0.35"
          fill="none"
          strokeWidth="0.6"
        >
          {Array.from({ length: 7 }, (_, i) => (
            <ellipse
              key={i}
              cx="50"
              cy="50"
              rx={8 + i * 6}
              ry={26 + i * 4}
              transform={`rotate(${i * 26} 50 50)`}
            />
          ))}
        </g>

        <path
          d={`M0 ${70 + (n % 10)} Q 25 ${55 + (n % 14)}, 50 ${68 + (n % 9)} T 100 ${
            62 + (n % 12)
          } V100 H0 Z`}
          fill={b}
          fillOpacity="0.55"
        />
      </svg>
    </div>
  );
}
