import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BrandStatement } from "@/components/BrandStatement";
import { FinalCTA } from "@/components/FinalCTA";
import { HeroPaperRoll } from "@/components/HeroPaperRoll";
import { ImpactMetrics } from "@/components/ImpactMetrics";
import { ImpactSteps } from "@/components/ImpactSteps";
import { OriginStory } from "@/components/OriginStory";
import { ProductProofStrip } from "@/components/ProductProofStrip";
import { ProjectCard } from "@/components/ProjectCard";
import { impactMetrics, products, projects } from "@/lib/content";
import { isLocale, localizedPath } from "@/lib/i18n";
import styles from "@/components/Homepage.module.css";

type HomePageProps = { params: Promise<{ locale: string }> };

const metadataCopy = {
  en: { title: "ROOSA | Pink paper with documented purpose", description: "Soft pink toilet paper and a transparent path from purchase to documented child-protection impact." },
  de: { title: "ROOSA | Rosa Papier mit dokumentierter Wirkung", description: "Sanftes rosa Toilettenpapier und ein transparenter Weg vom Kauf bis zur dokumentierten Kinderschutzwirkung." },
  fr: { title: "ROOSA | Du papier rose, un impact documenté", description: "Du papier toilette rose et un parcours transparent de l’achat à l’impact documenté pour la protection de l’enfance." },
} as const;

export async function generateMetadata({ params }: HomePageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return {
    title: metadataCopy[locale].title,
    description: metadataCopy[locale].description,
    openGraph: {
      title: metadataCopy[locale].title,
      description: metadataCopy[locale].description,
      images: [{ url: "/media/v4/hero-roll-editorial.webp", width: 1531, height: 1027, alt: "ROOSA pink toilet paper in a colourful contemporary bathroom" }],
    },
  };
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const featured = products[0];
  return (
    <main className={styles.page}>
      <HeroPaperRoll locale={locale} />
      <ProductProofStrip />

      <section className={styles.featureProduct} aria-labelledby="featured-product-title">
        <div className={styles.featureInner}>
          <div className={styles.featureMedia}>
            <Image src={featured.image} alt={`${featured.name} pack`} fill sizes="(max-width: 767px) 100vw, 70vw" loading="eager" />
          </div>
          <div className={styles.featureCopy}>
            <p className={styles.sectionEyebrow}>{featured.eyebrow}</p>
            <h2 id="featured-product-title">Your softest daily ritual, in ROOSA pink.</h2>
            <p>{featured.description}</p>
            <dl className={styles.specList}>
              <div><dt>Price</dt><dd>{featured.displayPrice} {featured.currency}</dd></div>
              <div><dt>Pack</dt><dd>{featured.packSize}</dd></div>
              <div><dt>Rolls</dt><dd>{featured.rolls}</dd></div>
              <div><dt>Ply</dt><dd>{featured.ply}</dd></div>
              <div><dt>Certification</dt><dd>{featured.certification}</dd></div>
              <div><dt>Availability</dt><dd>shopify status pending approval</dd></div>
            </dl>
            <div className={styles.actionRow}>
              <Link className="button button--primary" href={localizedPath(locale, `/product/${featured.slug}`)}>View product</Link>
              <Link className="text-link" href={localizedPath(locale, "/shipping")}>Shipping and returns</Link>
            </div>
          </div>
        </div>
      </section>

      <BrandStatement />
      <ImpactSteps locale={locale} />

      <section className={styles.section} aria-labelledby="product-options-title">
        <div className={styles.sectionInner}>
          <header className={styles.optionsHeader}>
            <p className={styles.sectionEyebrow}>Choose your ROOSA</p>
            <h2 id="product-options-title" className="heading-xl">One essential. A few useful ways to stock it.</h2>
          </header>
          <div className={styles.productGrid}>
            {products.map((product) => (
              <article className={styles.productCard} key={product.id}>
                <Link href={localizedPath(locale, `/product/${product.slug}`)} aria-label={`View ${product.name}`}>
                  <div className={styles.productMedia}>
                    <Image src={product.image} alt={`${product.name} product view`} fill loading={product.image === "/media/products/hero-pack.png" ? "eager" : "lazy"} sizes="(max-width: 767px) 100vw, 33vw" />
                  </div>
                </Link>
                <div className={styles.productInfo}>
                  <p className={styles.productEyebrow}>{product.eyebrow}</p>
                  <div className={styles.productTopline}>
                    <h3><Link href={localizedPath(locale, `/product/${product.slug}`)}>{product.name}</Link></h3>
                    <span className={styles.productPrice}>{product.displayPrice}</span>
                  </div>
                  <p className={styles.productMeta}>{product.packSize} · {product.rolls} rolls · {product.purchaseMode}</p>
                  <Link className={`${styles.productLink} text-link`} href={localizedPath(locale, `/product/${product.slug}`)}>See details</Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <ImpactMetrics metrics={impactMetrics} />

      <section className={styles.projectSection} aria-label="Featured impact project">
        <ProjectCard project={projects[0]} locale={locale} />
      </section>

      <OriginStory locale={locale} />

      <section className={styles.trustStrip} aria-labelledby="trust-title">
        <div className={styles.trustInner}>
          <div>
            <p className={styles.sectionEyebrow}>Trust is published, not implied</p>
            <h2 id="trust-title" className="heading-lg">Proof belongs beside the promise.</h2>
          </div>
          <div className={styles.trustItems}>
            <div className={styles.trustItem}>authorized retailer logos pending approval</div>
            <div className={styles.trustItem}>certification documents pending approval</div>
            <div className={styles.trustItem}>verified reviews or press pending approval</div>
          </div>
        </div>
      </section>

      <FinalCTA locale={locale} />
    </main>
  );
}
