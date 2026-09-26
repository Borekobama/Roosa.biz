"use client";

import { useEffect, useRef } from "react";
import { usePhone } from "./phone";

/**
 * Scroll-linked settle, as the source brings its bento cards into place.
 *
 * Captured on a fresh load by walking down in 120px steps and reading the
 * transform as each card crosses into view. Three things about it:
 *
 *  - There is no fade. Opacity reads 1.00 at every sample; the card is always
 *    fully visible and only its position moves.
 *  - Each card travels on one axis, and the direction differs per card. The two
 *    row-one cards rise from below (dy 114 and 126), the row-two outer pair
 *    slide inward (dx -66 on the left, +64 on the right).
 *  - The offset decays as a power of how far down the viewport the card still
 *    is, not linearly with scroll: 114/63/34/18/7 at tops of 788/617/468/331/201
 *    fits amount * (top / viewportHeight) ^ 2.3 within a couple of pixels.
 *
 * The offset is written straight to the node rather than through state, so a
 * long list of these does not re-render on every frame.
 */
const CURVE = 2.3;
/**
 * Some blocks also ramp their opacity. The SOL-G7 figure reads 0.66/0.83/0.92/
 * 0.97/0.99 at tops of 791/671/551/431/191, which fits 1 - fade * u^4 with
 * fade = 0.57 - a much later, sharper ramp than the position curve.
 */
const FADE_CURVE = 4;

export default function ScrollSettle({
  children,
  className = "",
  axis = "y",
  amount = 141,
  curve = CURVE,
  fade = 0,
  phoneAmount,
}: {
  children: React.ReactNode;
  className?: string;
  axis?: "x" | "y";
  amount?: number;
  /** Exponent of the position decay. The bento cards fit 2.3; the SOL-G7
   *  figure is steeper at 4, holding its offset later and then dropping. */
  curve?: number;
  /** Depth of the opacity ramp: 0 keeps the block fully opaque throughout. */
  fade?: number;
  /** Travel below 720, where the source's differs. 0 on either side holds the
   *  block still there. */
  phoneAmount?: number;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const isPhone = usePhone();
  const travel = isPhone && phoneAmount !== undefined ? phoneAmount : amount;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (travel === 0 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.style.transform = "none";
      el.style.opacity = "1";
      return;
    }

    let frame = 0;
    const update = () => {
      frame = 0;
      const top = el.getBoundingClientRect().top;
      const u = Math.min(1, Math.max(0, top / window.innerHeight));
      const offset = travel * u ** curve;
      el.style.transform =
        axis === "x"
          ? `translate3d(${offset}px, 0, 0)`
          : `translate3d(0, ${offset}px, 0)`;
      if (fade > 0) el.style.opacity = String(1 - fade * u ** FADE_CURVE);
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
  }, [axis, travel, curve, fade]);

  return (
    <div
      ref={ref}
      className={className}
      style={travel === 0 ? undefined : { willChange: fade > 0 ? "transform, opacity" : "transform" }}
    >
      {children}
    </div>
  );
}
