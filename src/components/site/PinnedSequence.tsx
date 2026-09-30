"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import PanelIcon, { type PanelIconName } from "@/components/ui/PanelIcon";
import { home, type Asset } from "@/lib/assets";

/**
 * The statement is set in more than one tone: emphasis words carry their own
 * colour, as the source does.
 */
function Toned({ text, accents }: { text: string; accents?: Record<string, string> }) {
  if (!accents) return <>{text}</>;
  const pattern = new RegExp(`(${Object.keys(accents).join("|")})`, "g");
  return (
    <>
      {text.split(pattern).map((part, i) =>
        accents[part] ? (
          <span key={`${part}-${i}`} className={accents[part]}>
            {part}
          </span>
        ) : (
          <span key={`part-${i}`}>{part}</span>
        ),
      )}
    </>
  );
}

export type PanelFeature = { icon: PanelIconName; label: string; body: string };

export type Panel =
  | {
      kind: "image";
      asset: Asset;
      title: string;
      body: string;
      features?: PanelFeature[];
    }
  | {
      kind: "statement";
      title: string;
      body?: string;
      note?: string;
      accents?: Record<string, string>;
      art?: "jar";
      scale: "xl" | "l";
    };

/**
 * Horizontally tracked, scroll-pinned panel sequence.
 *
 * The source pins a 900px panel inside a ~4260px scroll container and moves a
 * horizontal track across it: its decorative line art sits at left offsets of
 * 4355px and 5560px, i.e. several screens along a row rather than stacked.
 * Vertical scroll progress across the container drives translateX here too.
 */
/**
 * Scroll budget and travel of the pinned track.
 *
 * The source sizes this to the viewport rather than to a fixed height, the same
 * way it sizes the hero: its sticky is a full 100vh, the panel inside is
 * 100vh-102px (70 above, 32 below), and the scroll container is 4.7 x the
 * viewport height plus 30px - 4260 over a 900 viewport, 5200 over an 1100 one.
 * This file had all three pinned to 900/798/4260, so the panels were the wrong
 * shape on any screen that is not exactly 900 tall.
 *
 * The dwell is therefore a share of the scroll range rather than a pixel count:
 * 650 of the 3360px measured at 900 is 19.35%.
 */
const PANEL_WIDTH = 1440;
/**
 * Track offset as a percentage of one panel width, for a given progress.
 *
 * The track enters and exits beyond the viewport. The center panel holds
 * briefly so its message stays readable during wheel and trackpad scrolling.
 */
function trackOffset(progress: number, count: number) {
  const START = count - 1 + 120 / PANEL_WIDTH;
  const HELD = -1 - 24 / PANEL_WIDTH;
  const END = -count - 124 / PANEL_WIDTH;
  const hold = 0.1935;
  const leg = (1 - hold) / 2;
  if (progress < leg) return (START + (progress / leg) * (HELD - START)) * 100;
  if (progress < leg + hold) return HELD * 100;
  return (HELD + ((progress - leg - hold) / leg) * (END - HELD)) * 100;
}

export default function PinnedSequence({ panels }: { panels: Panel[] }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [reduced, setReduced] = useState(false);
  const count = panels.length;

  useEffect(() => {
    // Deferred a frame so the effect body does not call setState synchronously.
    const raf = requestAnimationFrame(() =>
      setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches),
    );
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Cache the container's geometry: reading getBoundingClientRect inside the
    // scroll handler forces a layout on every frame. Offsets only change on
    // resize, so measure there instead.
    let top = 0;
    let scrollable = 0;
    const measure = () => {
      const rect = el.getBoundingClientRect();
      top = rect.top + window.scrollY;
      scrollable = rect.height - window.innerHeight;
    };

    // The track does not follow the scroll position directly. Jumping the
    // source's scroll and watching its x approach the new target gives 15%,
    // 46%, 80%, 96% and 99% of the distance at 50, 100, 200, 350 and 550ms -
    // a slow start, a fast middle and a long tail, which is a critically
    // damped spring rather than an ease. Fitting it gives w = 15 rad/s, whose
    // predicted 17/44/80/97 matches within a couple of points at every sample.
    //
    // Reading the source at one fixed delay cannot tell a follower from a
    // direct mapping, which is how this was previously dismissed as probe lag.
    // Setting progress straight from scrollY is what made the track feel
    // weightless.
    const OMEGA = 15;
    let target = 0;
    let current = 0;
    let velocity = 0;
    let frame = 0;
    let last = 0;

    // Write the transform straight to the node. Routing every frame through
    // React state re-rendered all three panels each time and dropped frames:
    // the step response came out flat for 100ms, jumped, then stalled at 89%,
    // where the source is at 15/46/80/96/99% at 50/100/200/350/550ms.
    const apply = (value: number) => {
      const node = trackRef.current;
      if (node) node.style.transform = `translate3d(${trackOffset(value, count)}%, 0, 0)`;
    };

    const readTarget = () => {
      if (scrollable > 0) {
        target = Math.min(Math.max((window.scrollY - top) / scrollable, 0), 1);
      }
    };

    // Integrate at a fixed step. Feeding the frame delta straight in let a
    // slow frame apply a 50ms impulse, which moved the track more than half way
    // in a single step: the trace showed it sitting still for 90ms and then
    // covering the whole distance in 150 and snapping. A fixed step makes the
    // response the same whatever the frame rate.
    const STEP = 1 / 120;
    let accumulator = 0;

    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.1);
      last = now;
      // Re-read the scroll position every frame rather than only when the
      // scroll event fires. Waiting on the event costs a frame or two at the
      // start of a move, which is most of the step response's first 100ms.
      readTarget();
      accumulator += dt;
      while (accumulator >= STEP) {
        velocity += (-2 * OMEGA * velocity - OMEGA * OMEGA * (current - target)) * STEP;
        current += velocity * STEP;
        accumulator -= STEP;
      }
      apply(current);
      if (Math.abs(current - target) > 0.0002 || Math.abs(velocity) > 0.0002) {
        frame = requestAnimationFrame(tick);
      } else {
        current = target;
        velocity = 0;
        frame = 0;
        apply(target);
      }
    };

    const update = () => {
      if (scrollable <= 0) return;
      readTarget();
      if (!frame) {
        // Back-date by one frame when starting. The loop only wakes on the
        // scroll event, so the first tick would otherwise integrate the sliver
        // of time since that event rather than the frame it belongs to, and the
        // whole response arrives a frame late: 12/30% at 50/100ms against the
        // source's 26/54, where the integrator on its own gives 21/48.
        last = performance.now() - 1000 / 60;
        frame = requestAnimationFrame(tick);
      }
    };

    const onScroll = update;

    const onResize = () => {
      measure();
      onScroll();
    };

    measure();
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, [count]);

  // Pacing measured off the source by sampling its first panel's image against
  // scroll: the track crosses the screen entirely, from one panel width off the
  // right edge to the whole strip off the left, and it is not linear - it holds
  // still for roughly 300px of scroll while the middle panel sits flush before
  // carrying on. translateX is expressed in panel widths: +1 at the start,
  // -panels.length at the end.

  return (
    <>
      {/* Below 720 the source does not lay these out as ordinary stacked
          sections: it decks them. Three panels, each a full 100vh tall and 64px
          apart in a 2660px column, pin in turn so each slides up over the one
          before it and all three release together.

          Measured at 390 and 719: sticky boxes at 1149/2057/2965 on a pitch of
          908 (844 + 64), sticky top 16px on the first and 0 on the other two,
          and the panel inside inset by that same 16. Confirmed by sampling
          rect.top against scrollY, which holds at 16 and at 0 right through the
          dwell and then releases all three together at 2965.

          This file asserted the opposite until now - "nothing is pinned and
          there is no horizontal track". That reading came from taking offsetTop
          after scrolling to the foot of the page, where a stuck element reports
          its shifted position: the first panel read 2965 there instead of 1149,
          which looks exactly like a plain stack.

          The source shows only the headline on its image panels at this width:
          no body copy, no feature list, and no scrim over the photo. The same
          markup without the pinning is the reduced-motion fallback. */}
      <div className={`flex flex-col gap-16 px-4 ${reduced ? "" : "min-[720px]:hidden"}`}>
        {panels.map((panel) => (
          <div
            key={panel.kind === "image" ? `s-${panel.asset.src}` : `s-${panel.title}`}
            // Each panel pins under the phone header's 70px bar rather than
            // behind it, 16px clear of it and of the screen floor.
            className={`h-screen py-4 max-[720px]:h-[calc(100vh-70px)] ${
              reduced ? "" : "sticky top-[70px]"
            }`}
          >
            <div className="relative h-full overflow-hidden rounded-[32px]">
              {panel.kind === "image" ? (
                <>
                  <Image
                    src={panel.asset.src}
                    alt={panel.asset.alt}
                    width={panel.asset.width}
                    height={panel.asset.height}
                    sizes="100vw"
                    className="h-full w-full rounded-[32px] object-cover"
                  />
                  {/* Headline only, its box 32px off the panel floor. */}
                  <div className="absolute inset-x-0 bottom-0 p-8">
                    <h2 className="t-display-m text-paper">{panel.title}</h2>
                  </div>
                </>
              ) : (
                <div className="relative flex h-full flex-col justify-end overflow-hidden bg-cream px-4 pb-[337px] text-center">
                  {/* A 294x409 butter ellipse under a 200px blur, flush to the
                      panel's left edge and centred vertically. It reads as a
                      soft wash rather than a shape, which is why it went
                      unnoticed: at 200px of blur the ellipse itself is never
                      visible. The desktop panel carries the lime one. */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute left-0 top-1/2 h-[409px] w-[294px] -translate-y-1/2 rounded-[100%] bg-butter blur-[200px]"
                  />
                  {/* 272 wide, measured: unconstrained it fills the panel's
                      326 and breaks after "Big" rather than after "habits.". */}
                  <h2 className="t-display-l relative mx-auto max-w-[272px] text-moss">{panel.title}</h2>
                  {/* No mx-auto: on a flex-column child it replaces the default
                      stretch with shrink-to-fit, sizing this to its text at 294
                      rather than the panel's 326. The panel centres it already. */}
                  {panel.note ? (
                    <p className="t-lede relative mt-4 text-moss">{panel.note}</p>
                  ) : null}
                  {/* 580x269 flush to the floor, overflowing the panel by 111px
                      on each side and clipped by it. The pb above is this plus
                      the 68px the source leaves under the note. */}
                  {panel.art === "jar" ? (
                    <Image src={home.carouselFloralLeft.src} alt="" width={360} height={480} sizes="360px" loading="eager" className="pointer-events-none absolute -bottom-14 -left-12 w-[360px] object-contain" />
                  ) : null}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

    <section
      ref={ref}
      aria-label="Wie ROOSA in Ihren Alltag passt"
      style={{ height: "calc(470vh + 30px)" }}
      // Overlap the section above so the first panel slides in over it while it
      // is still on screen, as the source does. The pull is set so this
      // container's top lands at y=925, where the source's does. The sticky
      // paints nothing outside the panels and takes no pointer events, so that
      // section stays usable.
      // The pull grew by the same 96 the statement section gained above it, so
      // the track and everything after it stay where they already measured.
      className={`relative -mt-[2289px] hidden ${reduced ? "" : "min-[720px]:block"}`}
    >
      {/* Measured: the sticky viewport carries no padding, and the panel inside
          it is the full 1440 wide by 798 tall, sitting 70px down. This was
          1400x868 inset 20px, which made every panel the wrong shape. */}
      <div className="pointer-events-none sticky top-0 h-screen overflow-hidden">
        <div className="relative mx-auto mt-[70px] h-[calc(100vh-102px)] max-h-[798px] w-full max-w-[1440px] overflow-hidden rounded-[32px]">
          <div
            ref={trackRef}
            className="flex h-full w-full"
            style={{
              transform: `translate3d(${trackOffset(0, count)}%, 0, 0)`,
              willChange: "transform",
            }}
          >
            {panels.map((panel) => (
              <div
                key={panel.kind === "image" ? panel.asset.src : panel.title}
                className="relative h-full w-full shrink-0"
              >
                {panel.kind === "image" ? (
                  <>
                    <Image
                      src={panel.asset.src}
                      alt={panel.asset.alt}
                      fill
                      sizes="100vw"
                      className="rounded-[32px] object-cover"
                    />
                    <div className="panel-scrim absolute inset-x-0 bottom-0 h-[739px]" />
                    {/* Measured on the source: title 48/52.8 at x=32 with its
                        baseline 32px off the panel floor, and three 245px
                        columns starting at x=608 on a 277px pitch. */}
                    <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-8 p-8">
                      <h2 className="t-display-m w-[450px] shrink-0 whitespace-pre-line text-paper">
                        {panel.title}
                      </h2>
                      {panel.features ? (
                        <ul className="flex shrink-0 gap-8 pb-[22px]">
                          {panel.features.map((f) => (
                            <li key={f.label} className="w-[245px] text-paper">
                              <PanelIcon name={f.icon} className="h-[30px] w-[30px]" />
                              <p className="t-heading-xs mt-[21px]">{f.label}</p>
                              <p className="t-body mt-[16px]">{f.body}</p>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="t-body-l max-w-[46ch] pb-2 text-paper/80">{panel.body}</p>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="relative flex h-full flex-col items-center justify-center overflow-hidden bg-cream px-6 text-center">
                    {/* 372x367 of lime under a 200px blur, centred on both axes
                        of the panel. Stable across the whole dwell, so it is
                        decoration rather than anything scroll-driven. */}
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute left-1/2 top-1/2 h-[367px] w-[372px] -translate-x-1/2 -translate-y-1/2 rounded-[100%] bg-lime blur-[200px]"
                    />
                    {panel.art === "jar" ? (
                      <>
                        <Image src={home.carouselFloralLeft.src} alt="" width={520} height={693} sizes="520px" loading="eager" className="pointer-events-none absolute -bottom-32 -left-20 w-[520px] object-contain" />
                        <Image src={home.carouselFloralRight.src} alt="" width={420} height={560} sizes="420px" loading="eager" className="pointer-events-none absolute -right-14 -top-24 w-[420px] object-contain opacity-85" />
                      </>
                    ) : null}
                    <h2
                      className={`relative ${
                        panel.scale === "xl" ? "t-display-xl text-forest" : "t-display-l text-moss"
                      } mx-auto ${panel.scale === "l" && panel.art ? "max-w-[350px]" : "max-w-[760px]"}`}
                    >
                      <Toned text={panel.title} accents={panel.accents} />
                    </h2>
                    {panel.body ? (
                      <p className="t-display-m relative mx-auto mt-8 max-w-[28ch] text-moss">
                        {panel.body}
                      </p>
                    ) : null}
                    {/* Measured moss at full strength, 17px under the
                        headline - not forest at 65%. */}
                    {panel.note ? (
                      <p className="t-body-l relative mx-auto mt-[17px] max-w-[42ch] text-moss">
                        {panel.note}
                      </p>
                    ) : null}
                  </div>
                )}
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
    </>
  );
}
