import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JournalCard } from "@/components/v2-editorial/JournalCard";
import { articleCopy, findArticle, journalArticles } from "@/lib/journal";
import { isLocale, localizedPath } from "@/lib/i18n";
import { PageHero, requireLocale, styles } from "../../editorial";

type Props = { params: Promise<{ locale: string; slug: string }> };

export function generateStaticParams() {
  return journalArticles.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const article = findArticle(slug);
  if (!article) return {};
  const { copy } = articleCopy(article, locale);
  return {
    title: `${copy.title} | ROOSA Journal`,
    description: copy.lead,
    openGraph: { title: copy.title, description: copy.lead, images: [{ url: article.image }], type: "article" },
  };
}

const t = {
  de: {
    published: "Veröffentlicht",
    category: "Rubrik",
    source: "Originalbeitrag auf roosa.net",
    sourceLang: "Originalsprache Deutsch",
    translation: "Arbeitsübersetzung — redaktionelle Prüfung ausstehend",
    frPending: "Französische Übersetzung ausstehend; hier steht die englische Fassung.",
    safeguarding:
      "Dieser Beitrag nennt ein Kind und seine Familie. Vor der Veröffentlichung sind Einwilligung, Bildrechte und eine Kinderschutzprüfung erforderlich.",
    approval: "Migrierter Inhalt — redaktionelle Prüfung ausstehend",
    more: "Weiterlesen",
    moreTitle: "Weitere Beiträge.",
    back: "Alle Beiträge",
  },
  other: {
    published: "Published",
    category: "Section",
    source: "Original article on roosa.net",
    sourceLang: "Source language: German",
    translation: "Working translation — editorial review pending",
    frPending: "French translation pending; the English version is shown here.",
    safeguarding:
      "This article names a child and their family. Consent, image rights and a safeguarding review are required before publication.",
    approval: "Migrated content — editorial review pending",
    more: "Continue reading",
    moreTitle: "More from the journal.",
    back: "All articles",
  },
};

export default async function JournalArticle({ params }: Props) {
  const locale = await requireLocale(params);
  const { slug } = await params;
  const article = findArticle(slug);
  if (!article) notFound();

  const { copy, isSourceLanguage, translationPending } = articleCopy(article, locale);
  const text = locale === "de" ? t.de : t.other;
  const related = journalArticles.filter((item) => item.slug !== slug).slice(0, 3);

  return (
    <main className={styles.page}>
      <PageHero
        eyebrow={`${article.categories.join(" · ")} · Journal`}
        title={copy.title}
        lead={copy.lead}
        approval={text.approval}
        image={null}
      />

      <div className={styles.heroImage}>
        <Image src={article.image} alt={article.imageAlt} fill priority sizes="(max-width: 767px) 100vw, 1200px" />
      </div>

      <article className={styles.section}>
        <div className={styles.prose}>
          <div className={styles.articleMeta}>
            <span>
              {text.published} <time dateTime={article.date}>{article.date}</time>
            </span>
            <span>
              {text.category}: {article.categories.join(", ")}
            </span>
            <span>{isSourceLanguage ? text.sourceLang : text.translation}</span>
          </div>

          {translationPending && <p className={styles.placeholder}>{text.frPending}</p>}
          {article.safeguarding && <p className={styles.safeguarding}>{text.safeguarding}</p>}

          {copy.body.map((block, index) => {
            if (block.type === "h2") return <h2 key={index}>{block.text}</h2>;
            if (block.type === "list")
              return (
                <ul className={styles.proseList} key={index}>
                  {block.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              );
            return <p key={index}>{block.text}</p>;
          })}

          <p className={styles.sourceNote}>
            <a href={article.sourceUrl} rel="noreferrer nofollow" target="_blank">
              {text.source} ↗
            </a>
          </p>

          <div className={styles.actions}>
            <Link className="button button--secondary" href={localizedPath(locale, "/journal")}>
              {text.back}
            </Link>
          </div>
        </div>
      </article>

      <section className={`${styles.section} ${styles.sectionTight}`}>
        <div className={styles.sectionInner}>
          <div className={styles.sectionHeader}>
            <p className="eyebrow">{text.more}</p>
            <div>
              <h2>{text.moreTitle}</h2>
            </div>
          </div>
          <div className={styles.articleGrid}>
            {related.map((item) => (
              <JournalCard key={item.slug} article={item} locale={locale} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
