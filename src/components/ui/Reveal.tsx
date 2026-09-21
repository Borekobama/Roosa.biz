"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Scroll-triggered entrance. Mirrors the source's measured motion:
 * transform 0.3s ease-out paired with opacity 0.3s ease.
 *
 * An IntersectionObserver alone is not enough: an element that is already above
 * the viewport when it is first observed - after an anchor jump to #faq, a
 * restored scroll position, or back navigation - never reports an intersection
 * and would stay permanently invisible. The initial check below covers that.
 */
export default function Reveal({
  children,
  delay = 0,
  y = 24,
  className = "",
  as: Tag = "div",
  pop = false,
  zoom = false,
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: React.ElementType;
  /** Scales in with a slight overshoot instead of a plain rise. */
  pop?: boolean;
  /** Zooms up from slightly smaller, for picture boxes. */
  zoom?: boolean;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      const raf = requestAnimationFrame(() => setShown(true));
      return () => cancelAnimationFrame(raf);
    }

    // Already at or above the fold on mount: reveal without waiting for a scroll.
    const initial = requestAnimationFrame(() => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight) setShown(true);
    });

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting || entry.boundingClientRect.top < 0) {
            setShown(true);
            observer.disconnect();
          }
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.05 },
    );

    observer.observe(el);
    return () => {
      cancelAnimationFrame(initial);
      observer.disconnect();
    };
  }, []);

  return (
    <Tag
      ref={ref}
      className={className}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown
          ? "translateY(0) scale(1)"
          : `translateY(${y}px)${pop ? " scale(0.94)" : ""}${zoom ? " scale(0.9)" : ""}`,
        transition:
          pop || zoom
            ? `transform 0.62s cubic-bezier(0.22, 1.2, 0.36, 1) ${delay}ms, opacity 0.4s ease ${delay}ms`
            : `transform 0.3s ease-out ${delay}ms, opacity 0.3s ease ${delay}ms`,
        willChange: "transform, opacity",
      }}
    >
      {children}
    </Tag>
  );
}
