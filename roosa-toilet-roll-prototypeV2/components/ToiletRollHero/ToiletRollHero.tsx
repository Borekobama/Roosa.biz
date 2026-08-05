'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { createToiletRollScene, isWebGLAvailable, type ToiletRollHandle } from './toiletRollScene';
import styles from './ToiletRollHero.module.css';

// ---------------------------------------------------------------------------
// Scroll copy states — spec §6 (State 1..6) with the spec's own progress
// ranges. IMPORTANT: the spec (§20/§22) forbids inventing product specs,
// certifications, partners or figures. Anything not already asserted on the
// live ROOSA site is left as a bracketed [PLACEHOLDER], matching the site's
// own "clearly marked until verified" convention — swap for approved copy.
// ---------------------------------------------------------------------------
type Step = { id: string; range: [number, number]; heading: string; body?: string[] };

const STEPS: Step[] = [
  {
    id: 'quality',
    range: [0.12, 0.3],
    heading: 'Made for every day.',
    body: ['Three-ply softness.', '[Skin-safe testing — to verify]', '[Responsible sourcing — to verify]'],
  },
  {
    id: 'character',
    range: [0.3, 0.52],
    heading: 'Unexpected colour. Serious quality.',
  },
  {
    id: 'purchase',
    range: [0.52, 0.72],
    heading: 'An everyday product, going further.',
    body: ['An everyday product can carry something further.'],
  },
  {
    id: 'contribution',
    range: [0.72, 0.86],
    heading: 'From purchase to protection.',
    body: ['[CONTRIBUTION_AMOUNT] contributed per pack', 'Partner: [PARTNER_NAME]', 'Reporting period: [REPORTING_PERIOD]'],
  },
  {
    id: 'handoff',
    range: [0.86, 1.01],
    heading: 'Your pack has a paper trail.',
  },
];

const HERO = {
  eyebrow: 'ROOSA · Pink toilet paper',
  headline: 'Soft on skin. Strong for children.',
  subhead: 'Pink three-ply toilet paper with documented social impact.',
  buy: 'Buy ROOSA',
  impact: 'See the impact',
};

function getActiveStep(progress: number): Step | null {
  return STEPS.find((s) => progress >= s.range[0] && progress < s.range[1]) ?? null;
}

type PinState = 'before' | 'pinned' | 'after';

// Computed, NOT CSS `position: sticky`. Sticky silently detaches the moment
// any ancestor resolves to a non-visible overflow — e.g. Next's default
// `overflow-x: hidden` on html/body forces `overflow-y: auto` per the CSS
// Overflow spec, which turns <body> into its own scroll container. Toggling
// fixed/absolute in JS is immune to that ambient-CSS footgun.
const STAGE_STYLE: Record<PinState, CSSProperties> = {
  before: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100vh' },
  pinned: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100vh' },
  after: { position: 'absolute', bottom: 0, left: 0, width: '100%', height: '100vh' },
};

export default function ToiletRollHero() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const sceneContainerRef = useRef<HTMLDivElement | null>(null);
  const staticSceneContainerRef = useRef<HTMLDivElement | null>(null);
  const handleRef = useRef<ToiletRollHandle | null>(null);

  const [progress, setProgress] = useState(0);
  const [pinState, setPinState] = useState<PinState>('before');
  const [reducedMotion, setReducedMotion] = useState(false);
  const [webglOk, setWebglOk] = useState(true);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setWebglOk(isWebGLAvailable());
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const useStaticLayout = reducedMotion || !webglOk;

  // Full experience: mount the scroll-driven 3D scene.
  useEffect(() => {
    if (useStaticLayout || !sceneContainerRef.current) return;
    const el = sceneContainerRef.current;
    const handle = createToiletRollScene(el);
    handleRef.current = handle;
    setReady(true);
    const ro = new ResizeObserver(() => handle.resize());
    ro.observe(el);
    return () => {
      ro.disconnect();
      handle.dispose();
      handleRef.current = null;
      setReady(false);
    };
  }, [useStaticLayout]);

  // Drive progress + pin state from the section's live viewport position.
  useEffect(() => {
    if (useStaticLayout) return;
    let rafId = 0;
    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const section = sectionRef.current;
        if (!section) return;
        const rect = section.getBoundingClientRect();
        const vh = window.innerHeight;
        const total = rect.height - vh;
        const raw = total > 0 ? -rect.top / total : 0;
        const clamped = Math.min(Math.max(raw, 0), 1);
        setProgress(clamped);
        handleRef.current?.updateProgress(clamped);
        if (rect.top > 0) setPinState('before');
        else if (rect.bottom <= vh) setPinState('after');
        else setPinState('pinned');
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(rafId);
    };
  }, [useStaticLayout]);

  // Static / reduced-motion: one frozen frame, no scroll-jacking (spec §16).
  useEffect(() => {
    if (!useStaticLayout || !webglOk || !staticSceneContainerRef.current) return;
    const el = staticSceneContainerRef.current;
    const handle = createToiletRollScene(el, { idleMotion: false });
    handle.updateProgress(0.16);
    const ro = new ResizeObserver(() => handle.resize());
    ro.observe(el);
    return () => {
      ro.disconnect();
      handle.dispose();
    };
  }, [useStaticLayout, webglOk]);

  // ---- Reduced-motion / no-WebGL static layout -----------------------------
  if (useStaticLayout) {
    return (
      <>
        <section className={styles.staticSection} aria-labelledby="roll-hero-title">
          <div className={styles.staticScene} aria-hidden="true">
            {webglOk ? (
              <div ref={staticSceneContainerRef} style={{ position: 'absolute', inset: 0 }} />
            ) : (
              <div className={styles.fallback}>ROOSA — pink three-ply toilet paper</div>
            )}
          </div>
          <div className={styles.staticCopy}>
            <p className={styles.eyebrow}>{HERO.eyebrow}</p>
            <h1 id="roll-hero-title" className={styles.headline}>{HERO.headline}</h1>
            <p className={styles.subhead}>{HERO.subhead}</p>
            <div className={styles.ctaRow}>
              <a className={styles.ctaPrimary} href="/shop">{HERO.buy}</a>
              <a className={styles.ctaSecondary} href="#impact">{HERO.impact}</a>
            </div>
          </div>
        </section>
        <ImpactHandoffSection />
      </>
    );
  }

  const activeStep = getActiveStep(progress);
  const handoffProgress = Math.min(Math.max((progress - 0.86) / 0.14, 0), 1);
  const introVisible = progress < 0.12 || !activeStep;

  return (
    <>
      <section ref={sectionRef} className={styles.rollStory} aria-labelledby="roll-hero-title">
        <div className={styles.stage} style={STAGE_STYLE[pinState]}>
          {!ready && <div className={styles.fallback}>ROOSA — pink three-ply toilet paper</div>}

          <div ref={sceneContainerRef} className={styles.scene} aria-hidden="true" />

          <div className={styles.copy}>
            <div className={styles.copyInner}>
              <p className={styles.eyebrow} style={{ opacity: introVisible ? 1 : 0.55 }}>{HERO.eyebrow}</p>
              <div className={styles.textSwap} key={introVisible ? 'intro' : activeStep!.id}>
                {introVisible ? (
                  <>
                    <h1 id="roll-hero-title" className={styles.headline}>{HERO.headline}</h1>
                    <p className={styles.subhead}>{HERO.subhead}</p>
                  </>
                ) : (
                  <>
                    <h2 className={styles.headline}>{activeStep!.heading}</h2>
                    {activeStep!.body && (
                      <ul className={styles.subhead}>
                        {activeStep!.body.map((line) => (
                          <li key={line}>{line}</li>
                        ))}
                      </ul>
                    )}
                  </>
                )}
              </div>
              <div className={styles.ctaRow}>
                <a className={styles.ctaPrimary} href="/shop">{HERO.buy}</a>
                <a className={styles.ctaSecondary} href="#impact">{HERO.impact}</a>
              </div>
            </div>
          </div>

          {/* 3D→HTML handoff: this flat pink sheet fades in exactly as the 3D
              loose sheet fades out (spec §14), then flows into #impact below. */}
          <div className={styles.paperHandoff} style={{ opacity: handoffProgress }} aria-hidden="true">
            <span className={styles.perf} />
          </div>

          <div className={styles.scrollHint} style={{ opacity: progress > 0.04 ? 0 : 1 }} aria-hidden="true">
            Scroll
          </div>
        </div>
      </section>

      <ImpactHandoffSection />
    </>
  );
}

// The paper trail "lands" here — a matching pink paper band continues out of
// the hero into the impact story, so the 3D→HTML handoff reads as continuous.
function ImpactHandoffSection() {
  return (
    <section id="impact" className={styles.impact} aria-labelledby="impact-title">
      <div className={styles.impactPaper} aria-hidden="true" />
      <div className={styles.impactInner}>
        <p className={styles.eyebrow}>The paper trail</p>
        <h2 id="impact-title" className={styles.impactTitle}>Every pack leaves a documented trail.</h2>
        <p className={styles.impactLead}>
          This is where the hero&rsquo;s paper sheet becomes the website&rsquo;s wider visual system. Verified
          contribution figures, partner details and reporting periods replace the bracketed placeholders above.
        </p>
      </div>
    </section>
  );
}
