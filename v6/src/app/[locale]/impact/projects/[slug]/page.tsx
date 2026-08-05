import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { projects } from "@/lib/content";
import { isLocale, localizedPath } from "@/lib/i18n";
import { PageHero, requireLocale, styles } from "../../../editorial";

type Props = { params: Promise<{ locale: string; slug: string }> };

export function generateStaticParams() { return projects.map(({ slug }) => ({ slug })); }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const project = projects.find((item) => item.slug === slug);
  if (!project) return {};
  return { title: `${project.name} | ROOSA Impact`, description: project.objective };
}

export default async function ProjectPage({ params }: Props) {
  const locale = await requireLocale(params);
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);
  if (!project) notFound();
  return <main className={styles.page}>
    <PageHero eyebrow={`Impact project · ${project.status}`} title={project.name} lead={project.objective} image={null} />
    <div className={styles.heroImage}><Image src={project.image} alt="General setting associated with the documented impact project" fill priority sizes="100vw" /></div>
    <section className={styles.section}><div className={styles.sectionInner}><dl className={styles.details}><div className={styles.detail}><dt>Partner</dt><dd>{project.partner}</dd></div><div className={styles.detail}><dt>Location</dt><dd>{project.location}</dd></div><div className={styles.detail}><dt>Reporting period</dt><dd>{project.period}</dd></div><div className={styles.detail}><dt>ROOSA contribution</dt><dd>{project.contribution}</dd></div><div className={styles.detail}><dt>Total project funding</dt><dd>total project funding pending approval</dd></div><div className={styles.detail}><dt>Status</dt><dd>{project.status}</dd></div></dl></div></section>
    <section className={`${styles.section} ${styles.sectionPink}`}><div className={styles.sectionInner}><div className={styles.grid2}><article className={styles.card}><p className="eyebrow">Activities</p><h3>approved activities pending approval</h3><p>A factual list of funded activities will be published after partner and safeguarding review.</p></article><article className={styles.card}><p className="eyebrow">Documented outcome</p><h3>{project.result}</h3><p>No child identities or personal histories are included in this placeholder record.</p></article><article className={styles.card}><p className="eyebrow">Methodology</p><h3>project methodology pending approval</h3><p>Definitions, measurement window, limitations and review ownership awaiting approval.</p></article><article className={styles.card}><p className="eyebrow">Safeguarding</p><h3>Privacy before storytelling.</h3><p>Only approved photographs and consented, necessary information may be published. Children are not identified here.</p></article></div></div></section>
    <section className={`${styles.section} ${styles.sectionDark}`}><div className={styles.sectionInner}><div className={styles.feature}><div><p className="eyebrow">Evidence</p><h2>Supporting files await approval.</h2></div><div><p>evidence summary pending approval - downloadable evidence stays disabled until the file, publication rights and review status are confirmed.</p><div className={styles.actions}><button className="button button--light" type="button" disabled>Download evidence pdf pending approval</button></div></div></div></div></section>
    <section className={styles.section}><div className={styles.sectionInner}><div className={styles.sectionHeader}><p className="eyebrow">Related projects</p><div><h2>More structured records.</h2><p>No additional approved project records are available in the current dataset.</p><div className={styles.actions}><Link className="button button--secondary" href={localizedPath(locale, "/impact")}>Back to impact report</Link></div></div></div></div></section>
  </main>;
}
