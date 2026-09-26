/**
 * A review card, measured off the source rather than described from a capture.
 *
 * The cards are not glass. Each is an opaque moss frame - 358x247, radius 24,
 * 16px padding - holding an opaque olive panel of 326 wide at radius 16 with
 * 14px padding, and the avatar and name sit on the frame below that panel. No
 * foliage reads through either layer, and there is no backdrop filter on them.
 *
 * Type is 18/25.2 in sage on a desktop and 16/22.4 on a phone, where the source
 * scales it down as it does everything else at that width. Within the panel the
 * rating line sits 14px in and the quote 32px under it; below the panel the
 * avatar is 16px down at 38px square with the name 11px to its right.
 *
 * The avatar is the reviewer's initial: the portraits were the source's own
 * third-party photos and are no longer in the repository.
 */
function Star({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 19" width="18" height="17" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M10 0.8 12.6 6.9 19.2 7.5 14.2 11.9 15.7 18.4 10 15 4.3 18.4 5.8 11.9 0.8 7.5 7.4 6.9Z" />
    </svg>
  );
}

/** Four filled and one half filled, which is what 4.5 draws as on the source. */
function Rating() {
  return (
    <span className="flex items-center gap-[3.3px]" aria-label="Rated 4.5 out of 5">
      {[0, 1, 2, 3].map((i) => (
        <Star key={i} className="text-[#f5c542]" />
      ))}
      {/* Half fill without an SVG id: a muted star with a clipped gold one over it. */}
      <span className="relative block h-[17px] w-[18px]">
        <Star className="absolute inset-0 text-[#f5c542]/35" />
        <span className="absolute inset-y-0 left-0 block w-1/2 overflow-hidden">
          <Star className="text-[#f5c542]" />
        </span>
      </span>
    </span>
  );
}

export default function ReviewCard({
  quote,
  name,
  className = "",
}: {
  quote: string;
  name: string;
  className?: string;
}) {
  return (
    <figure className={`rounded-[24px] bg-moss p-4 ${className}`}>
      <div className="rounded-[16px] bg-olive p-[14px]">
        <div className="flex items-center gap-2">
          <span className="text-[16px] leading-[22.4px] text-sage sm:text-[18px] sm:leading-[25.2px]">4.5</span>
          <Rating />
        </div>
        <blockquote className="mt-8 text-[16px] leading-[22.4px] text-sage sm:text-[18px] sm:leading-[25.2px]">
          {quote}
        </blockquote>
      </div>
      <figcaption className="mt-4 flex items-center gap-[11px]">
        <span
          aria-hidden="true"
          className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-full bg-sage text-[16px] font-medium leading-none text-moss"
        >
          {name.charAt(0)}
        </span>
        <span className="text-[16px] leading-[22.4px] text-sage sm:text-[18px] sm:leading-[25.2px]">{name}</span>
      </figcaption>
    </figure>
  );
}
