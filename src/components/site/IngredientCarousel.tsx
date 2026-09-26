"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { ingredientTiles } from "@/lib/assets";

/**
 * The quality tiles as the source sets them below 720: a swipeable strip under
 * the rows rather than a picture on hover. Measured at 390 - 335x311 cards at a
 * 25px radius on a 10px gap, snapping to centre, the strip's right eighth
 * fading out, and a 40px olive arrow 23px in from each side, vertically
 * centred. The back arrow stays hidden until there is somewhere to go back to.
 */
const PITCH = 345;

export default function IngredientCarousel() {
  const ref = useRef<HTMLUListElement | null>(null);
  const [edge, setEdge] = useState({ start: true, end: false });

  const onScroll = () => {
    const el = ref.current;
    if (!el) return;
    setEdge({
      start: el.scrollLeft < 4,
      end: el.scrollLeft + el.clientWidth > el.scrollWidth - 4,
    });
  };

  return (
    <div className="relative mt-8 min-[720px]:hidden">
      <ul
        ref={ref}
        onScroll={onScroll}
        className="flex snap-x snap-mandatory gap-[10px] overflow-x-auto [mask-image:linear-gradient(to_right,#000_87.5%,transparent)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {ingredientTiles.map((tile) => (
          <li
            key={tile.src}
            className="relative h-[311px] w-[335px] shrink-0 snap-center overflow-hidden rounded-[25px]"
          >
            <Image src={tile.src} alt={tile.alt} fill sizes="335px" className="object-cover" />
          </li>
        ))}
      </ul>

      {([-1, 1] as const).map((dir) => {
        const hidden = dir < 0 ? edge.start : edge.end;
        return (
          <button
            key={dir}
            type="button"
            aria-label={dir < 0 ? "Vorheriges Bild" : "Nächstes Bild"}
            aria-hidden={hidden || undefined}
            tabIndex={hidden ? -1 : undefined}
            onClick={() => ref.current?.scrollBy({ left: dir * PITCH, behavior: "smooth" })}
            className={`m-opacity absolute top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-olive text-paper ${
              dir < 0 ? "left-[23px]" : "right-[23px]"
            } ${hidden ? "pointer-events-none opacity-0" : ""}`}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path
                d={dir < 0 ? "M10 3 5 8l5 5" : "m6 3 5 5-5 5"}
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        );
      })}
    </div>
  );
}
