import Image from "next/image";
import Link from "next/link";
import { roleCopy, roles } from "@/lib/careers";
import { localizedPath } from "@/lib/i18n";
import { PageHero, requireLocale, routeMetadata, styles, type LocaleParams } from "../editorial";

export const metadata = routeMetadata("Careers", "Open roles at ROOSA, migrated from the existing site's careers menu.");

const t = {
  de: {
    eyebrow: "Stellen",
    title: "Verkaufen — und dabei etwas bewegen.",
    lead: "Offene Stellen bei ROOSA, übernommen von der bestehenden Website. Der Erstkontakt läuft telefonisch; über diese Seite werden keine Bewerbungsdaten erhoben.",
    open: "Offene Stelle",
    closed: "Zurzeit nicht ausgeschrieben",
    view: "Stelle ansehen",
    details: "Details ansehen",
    labels: { markets: "Markt", location: "Standort", model: "Modell" },
    noteTitle: "Bewerbung",
    noteHeading: "Erstkontakt nur telefonisch.",
    note: "Über diese Seite werden keine personenbezogenen Bewerbungsdaten erfasst. Die Kontaktaufnahme erfolgt ausschliesslich über die auf der Stelle genannte Telefonnummer.",
  },
  other: {
    eyebrow: "Careers",
    title: "Sell something — and move something.",
    lead: "Open roles at ROOSA, carried over from the existing site. First contact is by telephone; no application data is collected through this page.",
    open: "Open role",
    closed: "Not currently advertised",
    view: "View role",
    details: "View details",
    labels: { markets: "Market", location: "Location", model: "Model" },
    noteTitle: "Applying",
    noteHeading: "First contact by telephone only.",
    note: "No personal application data is collected through this page. Contact is made only via the telephone number given on the role.",
  },
};

export default async function CareersPage({ params }: { params: LocaleParams }) {
  const locale = await requireLocale(params);
  const text = locale === "de" ? t.de : t.other;

  return (
    <main className={styles.page}>
      <PageHero
        eyebrow={text.eyebrow}
        title={text.title}
        lead={text.lead}
        image="/media/journal/field-team.jpg"
        imageAlt="A ROOSA seller beside the branded pink van"
      />

      <section className={styles.section}>
        <div className={styles.sectionInner}>
          <div className={styles.roleList}>
            {roles.map((role) => {
              const { copy, meta } = roleCopy(role, locale);
              const isOpen = role.status === "open";
              return (
                <article className={`${styles.roleCard} ${isOpen ? "" : styles.roleCardClosed}`} key={role.slug}>
                  <div className={styles.roleMedia}>
                    <Image src={role.image} alt={role.imageAlt} fill sizes="(max-width: 767px) 100vw, 34vw" />
                  </div>
                  <div className={styles.roleBody}>
                    <span className={`${styles.pill} ${isOpen ? styles.pillOpen : ""}`}>{isOpen ? text.open : text.closed}</span>
                    <h2>{copy.title}</h2>
                    <p>{copy.tagline}</p>
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
                    <div className={styles.actions}>
                      <Link
                        className={`button ${isOpen ? "button--primary" : "button--secondary"}`}
                        href={localizedPath(locale, `/careers/${role.slug}`)}
                      >
                        {isOpen ? text.view : text.details}
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className={`${styles.section} ${styles.sectionPink}`}>
        <div className={`${styles.sectionInner} ${styles.feature}`}>
          <p className="eyebrow">{text.noteTitle}</p>
          <div>
            <h2>{text.noteHeading}</h2>
            <p>{text.note}</p>
          </div>
        </div>
      </section>
    </main>
  );
}
