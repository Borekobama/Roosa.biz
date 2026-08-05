import { ArticleCard } from "@/components/v2-editorial/ArticleCard";
import { journalPosts } from "@/lib/content";
import { PageHero, requireLocale, routeMetadata, styles, type LocaleParams } from "../editorial";

export const metadata = routeMetadata("Journal", "ROOSA product, impact, partnership and company stories awaiting editorial review where noted.");

export default async function JournalPage({ params }: { params: LocaleParams }) {
  const locale = await requireLocale(params);
  return <main className={styles.page}><PageHero eyebrow="Journal" title="Product notes, company updates and field context." lead="Migrated articles are presented as awaiting editorial and safeguarding review. Structured impact reporting remains in the impact database." approval="Migrated content awaiting review" image="/media/journal/little-fighter.jpg" imageAlt="A ROOSA story from the field" /><section className={styles.section}><div className={styles.sectionInner}><div className={styles.articleGrid}>{journalPosts.map((post) => <ArticleCard key={post.slug} post={post} locale={locale} />)}</div></div></section></main>;
}
