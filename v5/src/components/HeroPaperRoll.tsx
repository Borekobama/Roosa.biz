"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import type { Locale } from "@/types/content";
import { copy, localizedPath } from "@/lib/i18n";
import { track } from "@/lib/analytics";
import styles from "./Homepage.module.css";

export function HeroPaperRoll({ locale }: { locale: Locale }) {
  const heroRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const text = copy[locale];

  useEffect(() => {
    const hero = heroRef.current;
    const stage = stageRef.current;
    if (!hero || !stage) return;

    const media = window.matchMedia("(min-width: 768px) and (prefers-reduced-motion: no-preference)");
    let frame = 0;

    const update = () => {
      frame = 0;
      if (!media.matches) {
        stage.style.setProperty("--hero-progress", "0");
        return;
      }
      const rect = hero.getBoundingClientRect();
      const travel = Math.max(1, hero.offsetHeight - window.innerHeight);
      const progress = Math.min(1, Math.max(0, -rect.top / travel));
      stage.style.setProperty("--hero-progress", progress.toFixed(4));
    };

    const requestUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    media.addEventListener("change", update);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      media.removeEventListener("change", update);
    };
  }, []);

  return (
    <section ref={heroRef} className={styles.hero} aria-labelledby="home-hero-title">
      <div className={styles.heroFrame}>
        <div className={styles.heroInner}>
          <div className={styles.heroCopy}>
            <p className={styles.heroEyebrow}>ROOSA · Pink toilet paper</p>
            <h1 id="home-hero-title" className={styles.heroTitle}>{text.heroTitle}</h1>
            <p className={styles.heroBody}>{text.heroBody}</p>
            <div className={styles.heroActions}>
              <Link className="button button--primary" href={localizedPath(locale, "/shop")} onClick={() => track("hero_buy_click", { locale })}>{text.buy}</Link>
              <Link className="button button--secondary" href={localizedPath(locale, "/impact")} onClick={() => track("hero_impact_click", { locale })}>{text.seeImpact}</Link>
            </div>
          </div>

          <div ref={stageRef} className={styles.heroStage} aria-hidden="true">
            {/* The frame is a tall portrait on phones while the source is 3:2,
                so cover scales by height: a 100vw request left the hero at a
                3.3x upscale. 260vw asks for roughly the pixels it needs. */}
            <Image
              className={styles.heroPhoto}
              src="/media/v4/hero-roll-editorial.webp"
              fill
              preload
              alt=""
              sizes="(max-width: 767px) 260vw, (max-width: 991px) 210vw, 130vw"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
