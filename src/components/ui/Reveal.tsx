"use client";

import { useEffect, useRef, useState } from "react";
import { usePhone, type PhoneMotion } from "./phone";

/**
 * Scroll-triggered entrance. Mirrors the source's measured motion:
 * transform 0.3s ease-out paired with opacity 0.3s ease.
 *
 * An IntersectionObserver alone is not enough: an element that is already above
 * the viewport when it is first observed - after an anchor jump to #faq, a
 * restored scroll position, or back navigation - never reports an intersection
 * and would stay permanently invisible. The initial check below covers that.
 */
const EASE_OUT_CUBIC = "cubic-bezier(0.33, 1, 0.68, 1)";

export default function Reveal({
  children,
  delay = 0,
  y = 24,
  className = "",
  as: Tag = "div",
  pop = false,
  zoom = false,
  phone,
  phoneOnly = false,
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
  /** Motion below 720, where the source's differs: its own offset and timing,
   *  or "static" for none. Omitted, the phone gets the desktop motion. */
  phone?: PhoneMotion;
  /** Holds still from 720 up, so only the phone motion runs. */
  phoneOnly?: boolean;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [shown, setShown] = useState(false);
  const isPhone = usePhone();
  const still = (isPhone && phone === "static") || (phoneOnly && !isPhone);
  const motion = isPhone && typeof phone === "object" ? phone : null;
  const lift = motion ? (motion.y ?? 0) : null;

  useEffect(() => {
    const el = ref.current;
    if (!el || still) return;

    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      const raf = requestAnimationFrame(() => setShown(true));
      return () => cancelAnimationFrame(raf);
    }

    // The source's phone reveals fire once the block is wholly in view: the
    // statement still at rest with its floor at 935, under way with it at 785.
    // Watched on scroll against the untransformed box rather than through an
    // IntersectionObserver, which measures the offset box - a lede parked
    // 236px off the left edge never reads as wholly visible.
    if (lift !== null) {
      let frame = 0;
      const check = () => {
        frame = 0;
        const rect = el.getBoundingClientRect();
        if (rect.bottom - lift <= window.innerHeight || rect.top < 0) {
          setShown(true);
          window.removeEventListener("scroll", onScroll);
        }
      };
      const onScroll = () => {
        if (!frame) frame = requestAnimationFrame(check);
      };
      frame = requestAnimationFrame(check);
      window.addEventListener("scroll", onScroll, { passive: true });
      return () => {
        cancelAnimationFrame(frame);
        window.removeEventListener("scroll", onScroll);
      };
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
  }, [still, lift]);

  if (still) {
    return (
      <Tag ref={ref} className={className}>
        {children}
      </Tag>
    );
  }

  const duration = motion?.duration ?? 1000;
  const easing = motion?.easing ?? EASE_OUT_CUBIC;

  return (
    <Tag
      ref={ref}
      className={className}
      style={{
        opacity: shown ? 1 : 0,
        transform: motion
          ? shown
            ? "translate3d(0, 0, 0)"
            : `translate3d(${motion.x ?? 0}px, ${motion.y ?? 0}px, 0)`
          : shown
            ? "translateY(0) scale(1)"
            : `translateY(${y}px)${pop ? " scale(0.94)" : ""}${zoom ? " scale(0.9)" : ""}`,
        transition: motion
          ? `transform ${duration}ms ${easing}, opacity ${duration}ms ${easing}`
          : pop || zoom
            ? `transform 0.62s cubic-bezier(0.22, 1.2, 0.36, 1) ${delay}ms, opacity 0.4s ease ${delay}ms`
            : `transform 0.3s ease-out ${delay}ms, opacity 0.3s ease ${delay}ms`,
        willChange: "transform, opacity",
      }}
    >
      {children}
    </Tag>
  );
}
