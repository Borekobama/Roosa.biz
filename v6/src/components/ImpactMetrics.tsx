"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import type { ImpactMetric } from "@/types/content";
import styles from "./Homepage.module.css";

gsap.registerPlugin(ScrollTrigger);

export function ImpactMetrics({ metrics }: { metrics: ImpactMetric[] }) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const context = gsap.context(() => {
      gsap.fromTo(
        "[data-impact-card]",
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: { trigger: section, start: "top 78%", once: true },
        },
      );
    }, section);

    return () => context.revert();
  }, []);

  return (
    <section ref={sectionRef} className={styles.metricsSection} aria-label="Impact metrics and reporting sources">
      <div className={styles.metricsGrid}>
        {metrics.map((metric) => (
          <article className={styles.metric} data-impact-card key={metric.label}>
            <p className={styles.metricValue}>{metric.value}</p>
            <h2 className={styles.metricLabel}>{metric.label}</h2>
            <p className={styles.metricMeta}>
              <span>Period: {metric.period}</span>
              <span>Source: {metric.source}</span>
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
