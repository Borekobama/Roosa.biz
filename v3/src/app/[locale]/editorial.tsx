import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, localizedPath } from "@/lib/i18n";
import type { Locale } from "@/types/content";
import styles from "@/components/v2-editorial/Editorial.module.css";

export type LocaleParams = Promise<{ locale: string }>;

export async function requireLocale(params: LocaleParams): Promise<Locale> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return locale;
}

export function routeMetadata(title: string, description: string): Metadata {
  return { title: `${title} | ROOSA`, description };
}

export function PageHero({ eyebrow, title, lead, approval, image = "/media/products/pink-roll.webp", imageAlt = "ROOSA pink paper" }: { eyebrow: string; title: string; lead: string; approval?: string; image?: string; imageAlt?: string }) {
  return <header className={styles.hero}><div className={styles.heroInner}><div className={styles.heroCopy}><p className={styles.heroKicker}>{eyebrow}</p>{approval && <span className={styles.approval}>{approval}</span>}<h1>{title}</h1><p className={styles.heroLead}>{lead}</p></div><div className={styles.heroVisual}><Image src={image} alt={imageAlt} fill priority sizes="(max-width: 767px) 62vw, 34vw" /></div></div></header>;
}

export function EditorialCTA({ locale, title, body, href = "/shop", label = "Shop ROOSA" }: { locale: Locale; title: string; body: string; href?: string; label?: string }) {
  return <section className={styles.cta}><div className={styles.ctaInner}><h2>{title}</h2><p>{body}</p><Link className={styles.ctaLink} href={localizedPath(locale, href)}>{label}</Link></div></section>;
}

export function ApprovalPage({ eyebrow, title, lead, sections, approval }: { eyebrow: string; title: string; lead: string; approval: string; sections: { title: string; body: string }[] }) {
  return <main className={styles.page}><PageHero eyebrow={eyebrow} title={title} lead={lead} approval={approval} /><section className={styles.section}><div className={`${styles.sectionInner} ${styles.legalMeasure}`}><div className={styles.placeholder}>This draft contains no invented terms. Content must be reviewed, completed and approved by the responsible operational or legal owner before publication.</div><div className={styles.prose}>{sections.map((section) => <section key={section.title}><h2>{section.title}</h2><p>{section.body}</p></section>)}</div></div></section></main>;
}

export { styles };
