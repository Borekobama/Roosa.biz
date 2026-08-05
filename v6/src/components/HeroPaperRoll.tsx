"use client";

import Link from "next/link";
import type { Locale } from "@/types/content";
import { copy, localizedPath } from "@/lib/i18n";
import { track } from "@/lib/analytics";
import styles from "./Homepage.module.css";
import { ToiletPaperSequence } from "./ToiletPaperSequence";

export function HeroPaperRoll({ locale }: { locale: Locale }) {
  const text = copy[locale];

  return (
    <section className={styles.hero} aria-labelledby="home-hero-title">
      <div className={styles.heroFrame} data-hero-frame>
        <div className={styles.heroInner}>
          <div className={styles.heroCopy}>
            <p className={styles.heroEyebrow}>ROOSA · Pink toilet paper</p>
            <h1 id="home-hero-title" className={styles.heroTitle}>{text.heroTitle}</h1>
            <p className={styles.heroBody}>{text.heroBody}</p>
            <div className={styles.heroActions}>
              <Link className="button button--primary" href={localizedPath(locale, "/shop")} onClick={() => track("hero_buy_click", { locale })}>{text.buy}</Link>
              <Link className="button button--secondary" href={localizedPath(locale, "/impact")} onClick={() => track("hero_impact_click", { locale })}>{text.seeImpact}</Link>
            </div>
            <div className={styles.heroScrollCue} aria-hidden="true">
              <span>Scroll to unroll</span>
              <i />
            </div>
          </div>

          <ToiletPaperSequence />
        </div>
      </div>
    </section>
  );
}
