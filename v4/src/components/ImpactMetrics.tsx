import type { ImpactMetric } from "@/types/content";
import styles from "./Homepage.module.css";

export function ImpactMetrics({ metrics }: { metrics: ImpactMetric[] }) {
  return (
    <section className={styles.metricsSection} aria-label="Impact metrics and reporting sources">
      <div className={styles.metricsGrid}>
        {metrics.map((metric) => (
          <article className={styles.metric} key={metric.label}>
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
