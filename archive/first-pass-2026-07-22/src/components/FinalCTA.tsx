import Link from "next/link";
import type { Locale } from "@/types/content";
import { localizedPath } from "@/lib/i18n";
import styles from "./Homepage.module.css";

export function FinalCTA({ locale }: { locale: Locale }) {
  return (
    <section className={styles.finalCta} aria-labelledby="final-cta-title">
      <div className={styles.finalInner}>
        <div className={styles.finalCopy}>
          <p className={styles.sectionEyebrow}>Bring the trail home</p>
          <h2 id="final-cta-title">Make an everyday purchase count.</h2>
          <p>Choose ROOSA for the bathroom shelf—and follow where its contribution goes.</p>
          <div className={styles.actionRow}>
            <Link className="button button--primary" href={localizedPath(locale, "/shop")}>Buy ROOSA</Link>
            <Link className="button button--secondary" href={localizedPath(locale, "/shop#retailers")}>Find a retailer</Link>
          </div>
        </div>
        <div className={styles.paperLoop} aria-hidden="true" />
      </div>
    </section>
  );
}
