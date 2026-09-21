"use client";

import Image from "next/image";
import type { Asset } from "@/lib/assets";

/**
 * Thumbnail row beneath the product image, bottom left. Controlled: the
 * selection lives in ProductView so a thumb drives the main shot.
 */
export default function ProductThumbs({
  images,
  name,
  active,
  onSelect,
}: {
  images: Asset[];
  name: string;
  active: number;
  onSelect: (index: number) => void;
}) {
  return (
    <ul className="mt-4 flex gap-3">
      {images.map((image, i) => (
        <li key={`${image.src}-${i}`}>
          <button
            type="button"
            aria-label={`${name}: Bild ${i + 1} von ${images.length} anzeigen`}
            aria-pressed={i === active}
            onClick={() => onSelect(i)}
            className={`m-surface block h-14 w-14 overflow-hidden rounded-[10px] border ${
              i === active ? "border-olive" : "border-forest/15 opacity-70 hover:opacity-100"
            }`}
          >
            <Image
              src={image.src}
              alt=""
              width={56}
              height={56}
              className="h-full w-full object-cover"
            />
          </button>
        </li>
      ))}
    </ul>
  );
}
