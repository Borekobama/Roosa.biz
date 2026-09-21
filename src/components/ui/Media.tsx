import Image from "next/image";
import type { Asset } from "@/lib/assets";

/**
 * Renders a source asset at its measured intrinsic size. `fill` is used where
 * the source slot was a cover-cropped area rather than an intrinsic image.
 */
export default function Media({
  asset,
  className = "",
  sizes = "100vw",
  priority = false,
  fill = false,
  alt,
  rounded,
  objectPosition,
}: {
  asset: Asset;
  className?: string;
  sizes?: string;
  priority?: boolean;
  fill?: boolean;
  alt?: string;
  rounded?: string;
  objectPosition?: string;
}) {
  const radius = rounded ?? "rounded-[16px]";

  if (fill) {
    return (
      <div className={`relative overflow-hidden ${radius} ${className}`}>
        <Image
          src={asset.src}
          alt={alt ?? asset.alt}
          fill
          sizes={sizes}
          priority={priority}
          style={objectPosition ? { objectPosition } : undefined}
          className="object-cover"
        />
      </div>
    );
  }

  return (
    <Image
      src={asset.src}
      alt={alt ?? asset.alt}
      width={asset.width}
      height={asset.height}
      sizes={sizes}
      priority={priority}
      className={`${radius} ${className}`}
    />
  );
}
