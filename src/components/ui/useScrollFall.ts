"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";

/**
 * The source's scroll-linked row reveal.
 *
 * Measured from a fresh load - walking down in steps so a one-shot effect stays
 * armed - a row reads 0.50 opacity at 123px of offset when its top is ~1100,
 * 0.92 at 21px when ~680, and 0.99 at 3px when ~280. Opacity and offset fall
 * off together on one cubic, so both derive from the same progress term.
 *
 * The same curve drives the ingredient stack, the nutrition rows and the
 * comparison rows, which is why it lives here rather than in any one of them.
 */
const START = 1100; // viewport top at which a row begins to settle
const SPAN = 1300; // px of travel over which it finishes
const LIFT = 123; // px of offset before it settles

export function useScrollFall<T extends HTMLElement>(count: number) {
  const refs = useRef<(T | null)[]>([]);
  const [progress, setProgress] = useState<number[]>(() =>
    Array.from({ length: count }, () => 1),
  );

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      setProgress(
        refs.current.map((el) => {
          if (!el) return 1;
          // Measure layout position, not the offset this hook applied last frame.
          const top = el.getBoundingClientRect().top - new DOMMatrixReadOnly(el.style.transform).m42;
          return Math.min(1, Math.max(0, (START - top) / SPAN));
        }),
      );
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
  }, []);

  const styleFor = (i: number): CSSProperties => {
    const fall = (1 - (progress[i] ?? 1)) ** 3;
    return {
      opacity: 1 - 0.5 * fall,
      transform: `translate3d(0, ${LIFT * fall}px, 0)`,
      willChange: "transform, opacity",
    };
  };

  const setRef = (i: number) => (el: T | null) => {
    refs.current[i] = el;
  };

  return { refs, setRef, styleFor };
}
