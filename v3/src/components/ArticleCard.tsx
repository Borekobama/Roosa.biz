import Image from "next/image";
import Link from "next/link";
import styles from "@/app/[locale]/editorial.module.css";
import { localizedPath } from "@/lib/i18n";
import type { JournalPost, Locale } from "@/types/content";

export function ArticleCard({ post, locale }: { post: JournalPost; locale: Locale }) {
  return <Link className={styles.articleCard} href={localizedPath(locale, `/journal/${post.slug}`)}><div className={styles.articleImage}><Image src={post.image} alt="ROOSA journal editorial photograph" fill sizes="(max-width: 767px) 100vw, 33vw" /></div><div className={styles.articleBody}><p className={styles.meta}>{post.category} · <time dateTime={post.date}>{post.date}</time></p><h2>{post.title}</h2><p>{post.summary}</p><span className={styles.textLink}>Read article</span></div></Link>;
}
