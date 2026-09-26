"use client";

import { useEffect, useRef, useState } from "react";
import Reveal from "./Reveal";
import { usePhone } from "./phone";
import { phoneRise } from "./phoneMotion";

/**
 * Scroll-linked reveal, as the source drives its closing block.
 *
 * Measured from a fresh load, walking down to the block in steps so a one-shot
 * effect is still armed: opacity and offset move together with scroll position
 * rather than running a fixed transition.
 *
 * Re-measured against the source's closing block, which holds off longer than
 * these defaults did: it is still at 0.00 with the full 30px offset at a top of
 * 513, then reads 0.13 / 0.31 / 0.53 / 0.67 / 0.77 at tops of 389 / 264 / 137 /
 * 13 / -110. That fits start 513, span 700 and a slight ease at power 1.18.
 * The previous 700/800/1 ran ahead of it the whole way - 0.40 where the source
 * was at 0.13, and finished at 1.00 while the source was still at 0.77.
 *
 * Note that this cannot be checked after a full page sweep: the reveal has
 * already completed by then and both sides read 1.00 everywhere.
 */

export default function ScrollReveal({
  children,
  className = "",
  y = 30,
  /** Viewport top offset at which it begins to appear. */
  start = 513,
  /** px of travel over which it completes. */
  span = 700,
  /** Eases the curve in, for blocks the source brings up slowly. */
  power = 1.18,
  phone,
}: {
  children: React.ReactNode;
  className?: string;
  y?: number;
  start?: number;
  span?: number;
  power?: number;
  /** Below 720 the source does not scroll-link these: "reveal" plays a
   *  one-shot rise of the same offset once in view, "static" holds still. */
  phone?: "reveal" | "static";
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [progress, setProgress] = useState(0);
  const isPhone = usePhone();
  const phoneMode = isPhone ? phone : undefined;

  useEffect(() => {
    const el = ref.current;
    if (!el || phoneMode) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      // Deferred a frame so the effect body does not set state synchronously.
      const raf = requestAnimationFrame(() => setProgress(1));
      return () => cancelAnimationFrame(raf);
    }

    let frame = 0;
    const update = () => {
      frame = 0;
      // The element's own top is the input, so no cached geometry can go stale.
      const top = el.getBoundingClientRect().top;
      const raw = Math.min(1, Math.max(0, (start - top) / span));
      setProgress(power === 1 ? raw : raw ** power);
    };
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(update);
    };

    frame = requestAnimationFrame(update);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [start, span, power, phoneMode]);

  if (phoneMode === "reveal") {
    return (
      <Reveal className={className} phone={phoneRise(y)}>
        {children}
      </Reveal>
    );
  }
  if (phoneMode === "static") return <div className={className}>{children}</div>;

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: progress,
        transform: `translate3d(0, ${(1 - progress) * y}px, 0)`,
        willChange: "transform, opacity",
      }}
    >
      {children}
    </div>
  );
}
