import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleCard } from "@/components/ArticleCard";
import { journalPosts, products, projects } from "@/lib/content";
import { isLocale, localizedPath } from "@/lib/i18n";
import { PageHero, requireLocale, styles } from "../../editorial";

type Props = { params: Promise<{ locale: string; slug: string }> };
export function generateStaticParams() { return journalPosts.map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: Props): Promise<Metadata> { const { locale, slug } = await params; if (!isLocale(locale)) return {}; const post = journalPosts.find((item) => item.slug === slug); return post ? { title: `${post.title} | ROOSA Journal`, description: post.summary } : {}; }

export default async function JournalArticle({ params }: Props) {
  const locale = await requireLocale(params);
  const { slug } = await params;
  const post = journalPosts.find((item) => item.slug === slug);
  if (!post) notFound();
  const related = journalPosts.filter((item) => item.slug !== slug).slice(0, 2);
  const product = products[0]; const project = projects[0];
  return <main className={styles.page}>
    <PageHero eyebrow={`${post.category} · Journal`} title={post.title} lead={post.summary} approval="Migrated content awaiting editorial & safeguarding review" />
    <div className={styles.heroImage}><Image src={post.image} alt="General editorial photograph for the ROOSA journal" fill priority sizes="100vw" /></div>
    <article className={styles.section}><div className={styles.prose}><div className={styles.articleMeta}><time dateTime={post.date}>{post.date}</time><span>Author: [APPROVED_AUTHOR]</span><span>{post.category}</span></div><h2>Editorial review in progress.</h2><p>This migrated story has not yet been approved for republication. Its final body, sourcing, image permissions and safeguarding review will be completed before launch.</p><p>[REVIEWED_ARTICLE_BODY]</p><h2>Context and verification</h2><p>Journal articles provide narrative context. Any project contribution, activity or result must also be recorded in the structured impact database with a reporting period and supporting evidence.</p><div className={styles.actions}><button className="button button--secondary" type="button" disabled aria-label="Share controls not configured">Share controls [pending]</button></div></div></article>
    <section className={`${styles.section} ${styles.sectionPink}`}><div className={styles.sectionInner}><div className={styles.grid2}><article className={styles.card}><p className="eyebrow">Related project</p><h3>{project.name}</h3><p>{project.objective}</p><div className={styles.actions}><Link className="button button--secondary" href={localizedPath(locale, `/impact/projects/${project.slug}`)}>View structured record</Link></div></article><article className={styles.card}><p className="eyebrow">Related product</p><h3>{product.name}</h3><p>{product.description}</p><div className={styles.actions}><Link className="button button--secondary" href={localizedPath(locale, `/product/${product.slug}`)}>View product</Link></div></article></div></div></section>
    <section className={styles.section}><div className={styles.sectionInner}><div className={styles.sectionHeader}><p className="eyebrow">Related articles</p><div><h2>Continue reading.</h2></div></div><div className={styles.articleGrid}>{related.map((item) => <ArticleCard key={item.slug} post={item} locale={locale} />)}</div></div></section>
  </main>;
}
