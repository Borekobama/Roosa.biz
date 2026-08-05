"use client";

import { useEffect, useRef } from "react";
import styles from "./Homepage.module.css";

export function BrandStatement() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        element.classList.add(styles.statementVisible);
        observer.disconnect();
      }
    }, { threshold: 0.28 });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className={styles.statement} aria-labelledby="brand-statement-title">
      <div className={styles.statementInner}>
        <div className={styles.statementMask}>
          <p className={styles.sectionEyebrow}>An everyday essential, reconsidered</p>
          <h2 id="brand-statement-title" className={styles.statementTitle}>Unexpected colour. Serious quality.</h2>
        </div>
        <p className={styles.statementBody}>ROOSA turns a familiar household product into a visible paper trail—from comfort at home to accountable support for children.</p>
      </div>
    </section>
  );
}
