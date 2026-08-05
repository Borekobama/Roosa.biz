'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { createToiletRollScene, isWebGLAvailable, type ToiletRollHandle } from './toiletRollScene';
import styles from './ToiletRollHero.module.css';

type Step = {
  id: string;
  range: [number, number];
  heading: string;
  body?: string[];
};

// Content for scroll states 2-6. State 1 (0-12%) is the static hero copy
// rendered below. Placeholder values in brackets must be replaced with
// verified figures before launch — see spec section 6, State 5.
const STEPS: Step[] = [
  {
    id: 'quality',
    range: [0.12, 0.3],
    heading: 'Made to last',
    body: ['Three-ply.', 'Dermatologically tested.', 'FSC-certified.'],
  },
  {
    id: 'product',
    range: [0.3, 0.52],
    heading: 'Unexpected colour. Serious quality.',
  },
  {
    id: 'purchase',
    range: [0.52, 0.72],
    heading: 'Everyday, with purpose',
    body: ['An everyday product can carry something further.'],
  },
  {
    id: 'impact',
    range: [0.72, 0.86],
    heading: 'Documented impact',
    body: [
      '[CONTRIBUTION_AMOUNT] contributed per pack',
      'Partner: [PARTNER_NAME]',
      'Reporting period: [REPORTING_PERIOD]',
    ],
  },
  {
    id: 'handoff',
    range: [0.86, 1.01],
    heading: 'Your pack has a paper trail.',
  },
];

function getActiveStep(progress: number): Step | null {
  return STEPS.find((s) => progress >= s.range[0] && progress < s.range[1]) ?? null;
}

type PinState = 'before' | 'pinned' | 'after';

// Computed instead of using CSS `position: sticky`, because sticky silently
// breaks the moment any ancestor (often the site's own <body>) resolves to
// a non-visible `overflow` — a very common real-world footgun, e.g. Next's
// default `overflow-x: hidden` on html/body forces `overflow-y: auto` per
// the CSS Overflow spec, which detaches sticky from the viewport. Manually
// switching between fixed/absolute is immune to that.
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

  // Detect prefers-reduced-motion and WebGL support on mount.
  useEffect(() => {
    setWebglOk(isWebGLAvailable());
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const useStaticLayout = reducedMotion || !webglOk;

  // Mount the scroll-driven 3D scene (full experience only).
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

  // Drive progress + pin state from the section's live position in the
  // viewport (see STAGE_STYLE comment for why this isn't CSS `sticky`).
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
        setProgress(Math.min(Math.max(raw, 0), 1));
        handleRef.current?.updateProgress(Math.min(Math.max(raw, 0), 1));

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

  // Static layout: mount one frozen frame of the scene, no scroll-jacking.
  useEffect(() => {
    if (!useStaticLayout || !webglOk || !staticSceneContainerRef.current) return;
    const el = staticSceneContainerRef.current;
    const handle = createToiletRollScene(el, { idleMotion: false });
    handle.updateProgress(0.18);
    const ro = new ResizeObserver(() => handle.resize());
    ro.observe(el);
    return () => {
      ro.disconnect();
      handle.dispose();
    };
  }, [useStaticLayout, webglOk]);

  if (useStaticLayout) {
    return (
      <section className={styles.staticSection}>
        <div className={styles.staticScene}>
          {webglOk ? (
            <div ref={staticSceneContainerRef} style={{ position: 'absolute', inset: 0 }} aria-hidden="true" />
          ) : (
            <div className={styles.fallback}>
              {/* Replace with a real static product render (AVIF/WebP). */}
              ROOSA — pink three-ply toilet paper
            </div>
          )}
        </div>

        <div className={styles.staticStep}>
          <h1 className={styles.headline}>Soft on skin. Strong for children.</h1>
          <p className={styles.subhead}>Pink three-ply toilet paper with documented social impact.</p>
        </div>

        {STEPS.map((step) => (
          <div className={styles.staticStep} key={step.id}>
            <h2>{step.heading}</h2>
            {step.body && (
              <ul className={styles.subhead}>
                {step.body.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            )}
          </div>
        ))}

        <div className={styles.ctaRow}>
          <a className={styles.ctaPrimary} href="/shop">
            Buy ROOSA
          </a>
          <a className={styles.ctaSecondary} href="#impact">
            See the impact
          </a>
        </div>
      </section>
    );
  }

  const activeStep = getActiveStep(progress);
  const handoffProgress = Math.min(Math.max((progress - 0.86) / 0.14, 0), 1);

  return (
    <section ref={sectionRef} className={styles.rollStory}>
      <div className={styles.stage} style={STAGE_STYLE[pinState]}>
        {!ready && (
          <div className={styles.fallback}>
            {/* Replace with a real static product render shown while the scene mounts. */}
            ROOSA — pink three-ply toilet paper
          </div>
        )}

        <div ref={sceneContainerRef} className={styles.scene} aria-hidden="true" />

        <div className={styles.copy}>
          <div className={styles.textSwap}>
            {progress < 0.12 || !activeStep ? (
              <>
                <h1 className={styles.headline}>Soft on skin. Strong for children.</h1>
                <p className={styles.subhead}>Pink three-ply toilet paper with documented social impact.</p>
              </>
            ) : (
              <>
                <h2 className={styles.headline}>{activeStep.heading}</h2>
                {activeStep.body && (
                  <ul className={styles.subhead}>
                    {activeStep.body.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                )}
              </>
            )}
          </div>

          <div className={styles.ctaRow}>
            <a className={styles.ctaPrimary} href="/shop">
              Buy ROOSA
            </a>
            <a className={styles.ctaSecondary} href="#impact">
              See the impact
            </a>
          </div>
        </div>

        <div className={styles.paperHandoff} style={{ opacity: handoffProgress }} aria-hidden="true" />
      </div>
    </section>
  );
}
