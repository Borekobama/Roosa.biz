import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import styles from "@/components/Commerce.module.css";
import { ProductCard } from "@/components/ProductCard";
import { ProductModule } from "@/components/ProductModule";
import { StickyPurchaseBar } from "@/components/StickyPurchaseBar";
import { products } from "@/lib/content";
import { isLocale, localizedPath, locales } from "@/lib/i18n";

type ProductPageProps = { params: Promise<{ locale: string; slug: string }> };

function findProduct(slug: string) {
  return products.find((product) => product.slug === slug);
}

export function generateStaticParams() {
  return locales.flatMap((locale) => products.map((product) => ({ locale, slug: product.slug })));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const product = findProduct(slug);
  if (!product) return {};
  return {
    title: `${product.name} | ROOSA`,
    description: product.description,
    alternates: { canonical: localizedPath(locale, `/product/${product.slug}`) },
    openGraph: { images: [{ url: product.image, alt: product.name }] },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const product = findProduct(slug);
  if (!product) notFound();
  const relatedProducts = products.filter((candidate) => candidate.id !== product.id).slice(0, 2);
  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: [product.image, product.alternateImage],
    sku: product.id,
    brand: { "@type": "Brand", name: "ROOSA" },
  };

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd).replace(/</g, "\\u003c") }} />

      <section className="section">
        <div className="container"><ProductModule product={product} /></div>
      </section>

      <section className="section section--tight section--pink" aria-labelledby="facts-heading">
        <div className="container">
          <div className={styles.sectionIntro}>
            <div className="stack"><span className="eyebrow">What is in the pack</span><h2 className="heading-lg" id="facts-heading">No fine print tucked away.</h2></div>
            <p className="body-lg">Specifications stay visibly marked until the manufacturer and Shopify catalogue provide approved values.</p>
          </div>
          <dl className={styles.factsGrid}>
            <div className={styles.fact}><dt className="eyebrow">Pack size</dt><dd className="heading-md">{product.packSize}</dd></div>
            <div className={styles.fact}><dt className="eyebrow">Rolls</dt><dd className="heading-md">{product.rolls}</dd></div>
            <div className={styles.fact}><dt className="eyebrow">Sheets per roll</dt><dd className="heading-md">{product.sheets}</dd></div>
            <div className={styles.fact}><dt className="eyebrow">Ply</dt><dd className="heading-md">{product.ply}</dd></div>
            <div className={styles.fact}><dt className="eyebrow">Material</dt><dd className="heading-md">{product.material}</dd></div>
            <div className={styles.fact}><dt className="eyebrow">Made in</dt><dd className="heading-md">{product.origin}</dd></div>
          </dl>
        </div>
      </section>

      <section className="section" aria-labelledby="making-heading">
        <div className={`container ${styles.splitBlock}`}>
          <article className={styles.splitPanel}>
            <div className="stack"><span className="eyebrow">Material & making</span><h2 className="heading-lg" id="making-heading">Softness needs proof, too.</h2></div>
            <p className="body-lg">Material: {product.material}. Manufacturing country: {product.origin}. Packaging, dye and dermatological testing details remain [APPROVED_PRODUCT_DOCUMENTATION].</p>
          </article>
          <article className={`${styles.splitPanel} ${styles.splitPanelPink}`} id="verification">
            <div className="stack"><span className="eyebrow">Verification</span><h2 className="heading-lg">Certification, linked at the source.</h2></div>
            <div className="stack">
              <p className="body-lg">Status: {product.certification}</p>
              <span className={styles.buttonSecondary} aria-disabled="true">Proof link pending: [CERTIFICATE_URL]</span>
            </div>
          </article>
        </div>
      </section>

      <section className="section section--impact" aria-labelledby="impact-heading">
        <div className={`container ${styles.pageHero}`}>
          <div className="stack"><span className="eyebrow">The impact receipt</span><h2 className="heading-xl" id="impact-heading">This pack contributes [CONTRIBUTION_AMOUNT].</h2></div>
          <div className="stack"><p className="body-lg">Basis: [CONTRIBUTION_UNIT]. Recipient: [PARTNER_NAME]. Transfer timing: [TRANSFER_FREQUENCY]. Reporting period: [REPORTING_PERIOD].</p><Link className={styles.buttonSecondary} href={localizedPath(locale, "/impact")}>Follow the paper trail</Link></div>
        </div>
      </section>

      <section className="section section--tight" aria-labelledby="product-faq">
        <div className="container">
          <div className={styles.sectionIntro}><div className="stack"><span className="eyebrow">Good to know</span><h2 className="heading-lg" id="product-faq">Product questions.</h2></div></div>
          <div className={styles.faqGrid}>
            <details className={styles.faq}><summary>What makes the paper pink?</summary><p>The final colouring method and ingredient statement are pending approved product documentation.</p></details>
            <details className={styles.faq}><summary>Is it certified?</summary><p>Current status: {product.certification}. A direct certificate URL will appear here after verification.</p></details>
            <details className={styles.faq}><summary>Is this in stock?</summary><p>Inventory is not yet connected. The demo cart works for interface testing, but checkout remains unavailable.</p></details>
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="related-heading">
        <div className="container">
          <div className={styles.sectionIntro}><div className="stack"><span className="eyebrow">Keep rolling</span><h2 className="heading-lg" id="related-heading">You may also like.</h2></div></div>
          <div className={styles.productGrid}>{relatedProducts.map((related) => <ProductCard key={related.id} product={related} locale={locale} />)}</div>
        </div>
      </section>

      <section className="section section--tight section--dark" aria-labelledby="shipping-heading">
        <div className="container">
          <div className={styles.sectionIntro}>
            <div className="stack"><span className="eyebrow">Shipping & returns</span><h2 className="heading-lg" id="shipping-heading">The route to your bathroom.</h2></div>
            <p className="body-lg">Shipping: [SHIPPING_REGIONS_AND_TIMES]. Returns: [RETURN_POLICY_SUMMARY]. Final eligibility and cost will be shown at checkout when Shopify is connected.</p>
          </div>
        </div>
      </section>

      <section className="section section--pink">
        <div className={`container ${styles.finalCta}`}>
          <span className="eyebrow">Make the everyday count</span>
          <h2 className="heading-xl">Ready to start a pink paper trail?</h2>
          <Link className={styles.buttonPrimary} href={localizedPath(locale, "/shop")}>See all products</Link>
        </div>
      </section>

      <StickyPurchaseBar product={product} />
    </main>
  );
}
