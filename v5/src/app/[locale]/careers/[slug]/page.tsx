import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { findRole, roleCopy, roles } from "@/lib/careers";
import { isLocale, localizedPath } from "@/lib/i18n";
import { PageHero, requireLocale, styles } from "../../editorial";

type Props = { params: Promise<{ locale: string; slug: string }> };

export function generateStaticParams() {
  return roles.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const role = findRole(slug);
  if (!role) return {};
  const { copy } = roleCopy(role, locale);
  return { title: `${copy.title} | ROOSA`, description: copy.tagline };
}

const t = {
  de: {
    open: "Offene Stelle",
    closed: "Zurzeit nicht ausgeschrieben",
    about: "Über uns",
    apply: "Interesse?",
    source: "Originalausschreibung auf roosa.net",
    sourceGone:
      "Diese Rolle steht weiterhin im Stellen-Menü der bestehenden Website, die verlinkte Seite ist jedoch nicht mehr öffentlich abrufbar. Beschreibung und Konditionen müssen vom Unternehmen neu freigegeben werden.",
    translation: "Arbeitsübersetzung — verbindlich ist die deutsche Originalfassung.",
    back: "Alle Stellen",
    labels: { markets: "Markt", location: "Standort", model: "Modell" },
  },
  other: {
    open: "Open role",
    closed: "Not currently advertised",
    about: "About us",
    apply: "Interested?",
    source: "Original posting on roosa.net",
    sourceGone:
      "This role still appears in the existing site's careers menu, but the page it links to is no longer publicly available. The description and terms need to be re-approved by the company.",
    translation: "Working translation — the German original is the binding version.",
    back: "All roles",
    labels: { markets: "Market", location: "Location", model: "Model" },
  },
};

export default async function RolePage({ params }: Props) {
  const locale = await requireLocale(params);
  const { slug } = await params;
  const role = findRole(slug);
  if (!role) notFound();

  const { copy, meta, isSourceLanguage } = roleCopy(role, locale);
  const text = locale === "de" ? t.de : t.other;
  const isOpen = role.status === "open";

  return (
    <main className={styles.page}>
      <PageHero
        eyebrow={isOpen ? text.open : text.closed}
        title={copy.title}
        lead={copy.tagline}
        approval={isSourceLanguage ? undefined : text.translation}
        image={role.image}
        imageAlt={role.imageAlt}
      />

      <section className={styles.section}>
        <div className={styles.sectionInner}>
          <div className={styles.roleLayout}>
            <div className={styles.roleContent}>
              <h2>{text.about}</h2>
              <p className={styles.roleSummary}>{copy.summary}</p>

              {copy.sections.map((section) => (
                <section className={styles.roleSection} key={section.heading}>
                  <h3>{section.heading}</h3>
                  <ul className={styles.roleTicks}>
                    {section.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </section>
              ))}

              {!isOpen && <p className={styles.placeholder}>{text.sourceGone}</p>}
            </div>

            <aside className={styles.roleAside}>
              <dl className={styles.roleMeta}>
                <div>
                  <dt>{text.labels.markets}</dt>
                  <dd>{meta.markets}</dd>
                </div>
                <div>
                  <dt>{text.labels.location}</dt>
                  <dd>{meta.location}</dd>
                </div>
                <div>
                  <dt>{text.labels.model}</dt>
                  <dd>{meta.model}</dd>
                </div>
              </dl>

              {role.contact && (
                <div className={styles.roleContact}>
                  <p className="eyebrow">{text.apply}</p>
                  {copy.applyNote && <p>{copy.applyNote}</p>}
                  <p className={styles.roleContactName}>{role.contact.name}</p>
                  <a className={styles.roleContactPhone} href={`tel:${role.contact.phone.replace(/\s/g, "")}`}>
                    {role.contact.phone}
                  </a>
                  <ul className={styles.roleHours}>
                    {role.contact.hours.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                  <p className={styles.roleContactNote}>{role.contact.note}</p>
                </div>
              )}

              {role.sourceUrl && (
                <p className={styles.sourceNote}>
                  <a href={role.sourceUrl} rel="noreferrer nofollow" target="_blank">
                    {text.source} ↗
                  </a>
                </p>
              )}

              <div className={styles.actions}>
                <Link className="button button--secondary" href={localizedPath(locale, "/careers")}>
                  {text.back}
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}
