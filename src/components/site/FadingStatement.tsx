"use client";

import { useEffect, useRef, useState } from "react";
import Reveal from "@/components/ui/Reveal";
import { usePhone } from "@/components/ui/phone";
import { phoneRise } from "@/components/ui/phoneMotion";

/**
 * The opening statement, pinned and fading as the source does.
 *
 * Measured by sampling its opacity and viewport position down the source: it
 * fades in as it rises (y=500 at 0, y=950 at 1), then holds still - centred in
 * the viewport, top 371 of 900 - and fades back out as the panels slide over
 * it, reaching 0.13 by y=2150. The clone held it at full opacity and let it
 * scroll away.
 */
const FADE_IN_START = 407; // px before the section top at which it starts to appear
const FADE_IN_LEN = 320; // px of scroll it takes to reach full opacity
const HOLD = 72; // px it stays fully opaque once pinned
const FADE_OUT = 1348; // px over which it fades back out

export default function FadingStatement({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [opacity, setOpacity] = useState(1);
  const isPhone = usePhone();

  useEffect(() => {
    const el = ref.current;
    if (!el || isPhone) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Geometry is read on resize only, never inside the scroll handler.
    let top = 0;
    const measure = () => {
      top = el.getBoundingClientRect().top + window.scrollY;
    };

    let frame = 0;
    const update = () => {
      frame = 0;
      const t = window.scrollY - top;
      let next: number;
      if (t < HOLD) next = Math.min(1, Math.max(0, (t + FADE_IN_START) / FADE_IN_LEN));
      else next = Math.max(0, 1 - (t - HOLD) / FADE_OUT);
      setOpacity(next);
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
  }, [isPhone]);

  // The 2250px scroll range is what gives the fade somewhere to happen, and it
  // is a desktop measurement. On a phone the source puts this text 27px below
  // the hero, not 1666 - it gets no long range there - so the tall section and
  // its sticky are held to md and up, and the statement simply sits in flow
  // below that.
  // The switch is the source's own 720, not Tailwind's md: below it the panels
  // deck instead of riding a track, and this section has no long range to fade
  // over. Measured 64px of padding either side of the text on a phone, which
  // put the statement at y=876 and the deck column 64px under it.
  //
  // Nor does it fade there: sampled down the source at 390 it sits at 0 with
  // 30px of offset until in view, rises once, and then holds at full strength
  // while the deck slides over it. The scroll fade had it dimming away again
  // from the moment it arrived.
  return (
    <section ref={ref} className="relative min-[720px]:mt-[96px] min-[720px]:h-[2250px]">
      <div className="px-6 py-16 min-[720px]:sticky min-[720px]:top-0 min-[720px]:flex min-[720px]:h-screen min-[720px]:max-h-[900px] min-[720px]:items-center min-[720px]:justify-center min-[720px]:py-0">
        {isPhone ? (
          <Reveal phone={phoneRise()}>{children}</Reveal>
        ) : (
          <div style={{ opacity, willChange: "opacity" }}>{children}</div>
        )}
      </div>
    </section>
  );
}
