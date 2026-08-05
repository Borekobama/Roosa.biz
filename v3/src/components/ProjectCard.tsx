import Image from "next/image";
import Link from "next/link";
import type { ImpactProject, Locale } from "@/types/content";
import { localizedPath } from "@/lib/i18n";
import styles from "./Homepage.module.css";

export function ProjectCard({ project, locale }: { project: ImpactProject; locale: Locale }) {
  return (
    <article className={styles.projectCard}>
      <div className={styles.projectMedia}>
        <Image src={project.image} alt="Project team supporting families" fill sizes="(max-width: 991px) 100vw, 56vw" />
      </div>
      <div className={styles.projectContent}>
        <p className={styles.sectionEyebrow}>Featured project · {project.status}</p>
        <h2>{project.name}</h2>
        <dl className={styles.projectFacts}>
          <div><dt>Partner</dt><dd>{project.partner}</dd></div>
          <div><dt>Location</dt><dd>{project.location}</dd></div>
          <div><dt>Reporting period</dt><dd>{project.period}</dd></div>
          <div><dt>Contribution</dt><dd>{project.contribution}</dd></div>
        </dl>
        <p className={styles.projectText}><strong>Objective</strong>{project.objective}</p>
        <p className={styles.projectText}><strong>Documented result</strong>{project.result}</p>
        <div className={styles.actionRow}><Link className="button button--primary" href={localizedPath(locale, `/impact/projects/${project.slug}`)}>View project record</Link></div>
      </div>
    </article>
  );
}
