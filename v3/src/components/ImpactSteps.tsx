import Link from "next/link";
import type { Locale } from "@/types/content";
import { localizedPath } from "@/lib/i18n";
import styles from "./Homepage.module.css";

const steps = [
  { title: "You buy ROOSA.", body: "Choose the pink paper option that fits your household." },
  { title: "A defined contribution is allocated.", body: "The exact contribution mechanism will be published once approved." },
  { title: "A verified project receives support.", body: "Transfers, recipients and documented outcomes belong in the impact record." },
];

export function ImpactSteps({ locale }: { locale: Locale }) {
  return (
    <section className={styles.impactSection} aria-labelledby="impact-steps-title">
      <div className={styles.impactInner}>
        <header className={styles.sectionHeader}>
          <div>
            <p className={styles.sectionEyebrow}>The pink paper trail</p>
            <h2 id="impact-steps-title">From everyday purchase to documented impact.</h2>
          </div>
          <p>Simple in principle, specific in practice. Each step should be supported by named partners, dates, transfers and reporting.</p>
        </header>
        <div className={styles.steps}>
          {steps.map((step, index) => (
            <article className={styles.step} key={step.title}>
              <span className={styles.stepNumber} aria-hidden="true">{index + 1}</span>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
              <span className={styles.placeholder}>{index === 0 ? "PRODUCT" : index === 1 ? "Amount pending approval" : "Partner pending approval"}</span>
            </article>
          ))}
        </div>
        <div className={styles.actionRow}><Link className="button button--light" href={localizedPath(locale, "/impact")}>Read the methodology</Link></div>
      </div>
    </section>
  );
}
