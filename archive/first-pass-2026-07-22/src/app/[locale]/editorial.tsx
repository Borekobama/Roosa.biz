import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, localizedPath } from "@/lib/i18n";
import type { Locale } from "@/types/content";
import styles from "./editorial.module.css";

export type LocaleParams = Promise<{ locale: string }>;

export async function requireLocale(params: LocaleParams): Promise<Locale> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return locale;
}

export function routeMetadata(title: string, description: string): Metadata {
  return { title: `${title} | ROOSA`, description };
}

export function PageHero({ eyebrow, title, lead, approval }: { eyebrow: string; title: string; lead: string; approval?: string }) {
  return <header className={styles.hero}><div className={styles.heroInner}>{approval && <span className={styles.approval}>{approval}</span>}<p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p className={styles.heroLead}>{lead}</p></div></header>;
}

export function EditorialCTA({ locale, title, body, href = "/shop", label = "Shop ROOSA" }: { locale: Locale; title: string; body: string; href?: string; label?: string }) {
  return <section className={`${styles.section} ${styles.sectionPink}`}><div className={`${styles.sectionInner} ${styles.feature}`}><h2>{title}</h2><div><p>{body}</p><div className={styles.actions}><a className="button button--primary" href={localizedPath(locale, href)}>{label}</a></div></div></div></section>;
}

export function ApprovalPage({ eyebrow, title, lead, sections, approval }: { eyebrow: string; title: string; lead: string; approval: string; sections: { title: string; body: string }[] }) {
  return <main className={styles.page}><PageHero eyebrow={eyebrow} title={title} lead={lead} approval={approval} /><section className={styles.section}><div className={`${styles.sectionInner} ${styles.legalMeasure}`}><div className={styles.placeholder}>This draft contains no invented terms. Content must be reviewed, completed and approved by the responsible operational or legal owner before publication.</div><div className={styles.prose}>{sections.map((section) => <section key={section.title}><h2>{section.title}</h2><p>{section.body}</p></section>)}</div></div></section></main>;
}

export { styles };
