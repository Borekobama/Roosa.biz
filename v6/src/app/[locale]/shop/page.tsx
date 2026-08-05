import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import styles from "@/components/Commerce.module.css";
import { ProductCard } from "@/components/ProductCard";
import { products } from "@/lib/content";
import { isLocale, localizedPath } from "@/lib/i18n";

type ShopPageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: ShopPageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return {
    title: "Shop pink toilet paper | ROOSA",
    description: "Explore ROOSA pink toilet paper, bundles and the optional repeat-delivery concept. Product data remains clearly marked until Shopify verification.",
    alternates: { canonical: localizedPath(locale, "/shop") },
  };
}

export default async function ShopPage({ params }: ShopPageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return (
    <main>
      <section className={styles.shopCollection} aria-labelledby="shop-products">
        <div className="container">
          <header className={styles.shopCollectionHeader}>
            <p className="eyebrow">The ROOSA collection</p>
            <h1 id="shop-products">Pink paper, with a purpose.</h1>
          </header>
          <div className={styles.productGrid}>
            {products.map((product) => <ProductCard key={product.id} product={product} locale={locale} />)}
          </div>
        </div>
      </section>

      <section className="section section--tight section--dark" aria-labelledby="repeat-delivery">
        <div className={`container ${styles.splitBlock}`}>
          <div className={styles.splitPanel}>
            <div className="stack">
              <span className="eyebrow">Optional, never assumed</span>
              <h2 className="heading-lg" id="repeat-delivery">Repeat delivery, when you want it.</h2>
            </div>
            <p className="body-lg">A recurring option may be offered after delivery frequency, savings and cancellation terms are approved. One-time purchase remains the default.</p>
          </div>
          <div className={`${styles.splitPanel} ${styles.splitPanelPink}`}>
            <div className="stack">
              <span className="eyebrow">For organisations</span>
              <h2 className="heading-lg">A brighter bathroom supply.</h2>
            </div>
            <div className="stack">
              <p className="body-lg">B2B quantities for offices, hospitality and retail will be quoted against confirmed volume, logistics and market availability.</p>
              <Link className={styles.buttonSecondary} href={localizedPath(locale, "/b2b")}>Explore B2B</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="delivery-heading">
        <div className="container">
          <div className={styles.sectionIntro}>
            <div className="stack">
              <span className="eyebrow">The practical details</span>
              <h2 className="heading-lg" id="delivery-heading">From our door to yours.</h2>
            </div>
            <p className="body-lg">Shipping regions, thresholds, timing and return eligibility are awaiting operational confirmation. Checkout will show the authoritative terms before any order is placed.</p>
          </div>
          <div className={styles.featureGrid}>
            <article className={styles.feature}><span className={styles.featureNumber}>01</span><div><h3>Shipping</h3><p className={styles.cardMeta}>shipping regions and times pending approval</p></div></article>
            <article className={styles.feature}><span className={styles.featureNumber}>02</span><div><h3>Free-shipping threshold</h3><p className={styles.cardMeta}>free shipping threshold pending approval</p></div></article>
            <article className={styles.feature}><span className={styles.featureNumber}>03</span><div><h3>Returns</h3><p className={styles.cardMeta}>return policy summary pending approval</p></div></article>
          </div>
        </div>
      </section>

      <section className="section section--tight" aria-labelledby="shop-faq">
        <div className="container">
          <div className={styles.sectionIntro}>
            <div className="stack"><span className="eyebrow">Quick answers</span><h2 className="heading-lg" id="shop-faq">Before you unroll.</h2></div>
          </div>
          <div className={styles.faqGrid}>
            <details className={styles.faq}><summary>Is the paper really pink?</summary><p>Yes. The final approved dye, material and testing documentation will be published with the verified specification.</p></details>
            <details className={styles.faq}><summary>How does a purchase help?</summary><p>The exact mechanism is Amount pending approval per basis pending approval. It will be linked to transfer records and project reporting once approved.</p></details>
            <details className={styles.faq}><summary>Can I buy once?</summary><p>Yes. One-time purchase is the default; a subscription is never preselected.</p></details>
          </div>
        </div>
      </section>
    </main>
  );
}
