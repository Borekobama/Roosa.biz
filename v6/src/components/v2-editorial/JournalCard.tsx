import Image from "next/image";
import Link from "next/link";
import { articleCopy, type JournalArticle } from "@/lib/journal";
import { localizedPath } from "@/lib/i18n";
import type { Locale } from "@/types/content";
import styles from "./Editorial.module.css";

export function JournalCard({ article, locale, featured = false }: { article: JournalArticle; locale: Locale; featured?: boolean }) {
  const { copy } = articleCopy(article, locale);
  return (
    <Link className={`${styles.articleCard} ${featured ? styles.articleCardFeatured : ""}`} href={localizedPath(locale, `/journal/${article.slug}`)}>
      <div className={styles.articleImage}>
        <Image
          src={article.image}
          alt={article.imageAlt}
          fill
          sizes={featured ? "(max-width: 767px) 100vw, 62vw" : "(max-width: 767px) 100vw, (max-width: 991px) 50vw, 33vw"}
        />
      </div>
      <div className={styles.articleBody}>
        <p className={styles.meta}>
          {article.categories.join(" · ")} · <time dateTime={article.date}>{article.date}</time>
        </p>
        <h2>{copy.title}</h2>
        <p>{copy.lead}</p>
        <span className={styles.textLink}>{locale === "de" ? "Beitrag lesen" : "Read article"}</span>
      </div>
    </Link>
  );
}
