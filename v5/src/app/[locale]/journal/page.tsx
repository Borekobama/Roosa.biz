import { JournalCard } from "@/components/v2-editorial/JournalCard";
import { journalArticles } from "@/lib/journal";
import { PageHero, requireLocale, routeMetadata, styles, type LocaleParams } from "../editorial";

export const metadata = routeMetadata(
  "Journal",
  "Press coverage, campaign reports and shop news from ROOSA, migrated from roosa.net and awaiting editorial review.",
);

const t = {
  de: {
    eyebrow: "Aktuelles",
    title: "Presse, Aktionen und Neues aus dem Shop.",
    lead: "Beiträge von roosa.net, übernommen im Originalwortlaut. Redaktionelle Freigabe und Bildrechte werden vor der Veröffentlichung geprüft.",
    approval: "Migrierte Inhalte — redaktionelle Prüfung ausstehend",
    latest: "Neuester Beitrag",
    archive: "Weitere Beiträge",
  },
  other: {
    eyebrow: "Journal",
    title: "Press, campaigns and news from the shop.",
    lead: "Articles carried over from roosa.net in their original wording. Editorial sign-off and image rights are reviewed before publication.",
    approval: "Migrated content — editorial review pending",
    latest: "Latest article",
    archive: "More articles",
  },
};

export default async function JournalPage({ params }: { params: LocaleParams }) {
  const locale = await requireLocale(params);
  const text = locale === "de" ? t.de : t.other;
  const [featured, ...rest] = journalArticles;

  return (
    <main className={styles.page}>
      <PageHero eyebrow={text.eyebrow} title={text.title} lead={text.lead} approval={text.approval} image={null} />

      <section className={styles.section}>
        <div className={styles.sectionInner}>
          <p className={`eyebrow ${styles.railLabel}`}>{text.latest}</p>
          <JournalCard article={featured} locale={locale} featured />
        </div>
      </section>

      <section className={`${styles.section} ${styles.sectionTight}`}>
        <div className={styles.sectionInner}>
          <p className={`eyebrow ${styles.railLabel}`}>{text.archive}</p>
          <div className={styles.articleGrid}>
            {rest.map((article) => (
              <JournalCard key={article.slug} article={article} locale={locale} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
