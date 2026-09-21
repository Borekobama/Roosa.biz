"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { home } from "@/lib/assets";

/**
 * Gummies scattered across the review panel, drifting as the panel scrolls.
 *
 * Measured on the source: with the panel's top at the viewport top the marks
 * sit at these offsets within the 1700px-tall panel, and across a scroll
 * sweep each one rises 96px for every 120px scrolled - a 0.2x parallax that
 * reads as the gummies falling slowly through the panel.
 */
const GUMMIES = [
  { flavour: "green", x: 657, y: 296, w: 157, h: 106, rotate: -12 },
  { flavour: "green", x: 47, y: 502, w: 157, h: 106, rotate: 9 },
  { flavour: "mango", x: 346, y: 510, w: 152, h: 92, rotate: -7 },
  { flavour: "green", x: 948, y: 673, w: 165, h: 124, rotate: 14 },
  { flavour: "green", x: 110, y: 891, w: 165, h: 124, rotate: -10 },
] as const;

const DRIFT = 0.2;

export default function GummyScatter() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [shift, setShift] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Geometry is read on resize only: measuring inside the scroll handler
    // forces a layout every frame.
    let top = 0;
    const measure = () => {
      top = el.getBoundingClientRect().top + window.scrollY;
    };

    let frame = 0;
    const update = () => {
      frame = 0;
      setShift((window.scrollY - top + window.innerHeight) * DRIFT);
    };
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(update);
    };
    const onResize = () => {
      measure();
      onScroll();
    };

    measure();
    frame = requestAnimationFrame(update);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div
      ref={ref}
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
    >
      {GUMMIES.map((g) => {
        const asset = g.flavour === "green" ? home.gummyGreen : home.gummyOrange;
        return (
          <Image
            key={`${g.x}-${g.y}`}
            src={asset.src}
            alt=""
            width={g.w}
            height={g.h}
            sizes="165px"
            className="absolute"
            style={{
              left: `${(g.x / 1440) * 100}%`,
              top: `${(g.y / 1700) * 100}%`,
              width: `${(g.w / 1440) * 100}%`,
              height: "auto",
              transform: `translate3d(0, ${shift}px, 0) rotate(${g.rotate}deg)`,
              willChange: "transform",
            }}
          />
        );
      })}
    </div>
  );
}
