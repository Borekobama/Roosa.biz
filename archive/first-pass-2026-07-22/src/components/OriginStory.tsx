import Image from "next/image";
import Link from "next/link";
import type { Locale } from "@/types/content";
import { localizedPath } from "@/lib/i18n";
import styles from "./Homepage.module.css";

export function OriginStory({ locale }: { locale: Locale }) {
  return (
    <section className={styles.origin} aria-labelledby="origin-title">
      <div className={styles.originInner}>
        <div className={styles.originMedia}>
          <Image src="/media/journal/field-team.jpg" alt="ROOSA team working in the field" fill sizes="(max-width: 767px) 100vw, 42vw" />
        </div>
        <div className={styles.originCopy}>
          <p className={styles.sectionEyebrow}>Why ROOSA</p>
          <h2 id="origin-title">A brighter roll with a serious reason.</h2>
          <p>Pink makes the product unmistakable. The mission gives the colour purpose: use an ordinary purchase to build a transparent, repeatable path toward child-protection work.</p>
          <p>Founder biography and approved origin details remain <strong>[VERIFICATION_REQUIRED]</strong> before publication.</p>
          <div className={styles.actionRow}><Link className="button button--secondary" href={localizedPath(locale, "/about")}>Read our story</Link></div>
        </div>
      </div>
    </section>
  );
}
