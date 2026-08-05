import Image from "next/image";
import styles from "./wireframe.module.css";

const proofs = [
  "Three-ply softness",
  "Dermatologically tested proof pending approval",
  "FSC-certified proof pending approval",
  "Supports child protection",
];

const products = [
  ["Standard pack", "Price at launch", "/media/products/pink-pack.jpg"],
  ["Family bundle", "Price at launch", "/media/products/white-pack.jpg"],
  ["Subscription / B2B", "availability pending approval", "/media/products/pink-roll.webp"],
];

function SourceTag({ children }: { children: React.ReactNode }) {
  return <p className={styles.sourceTag}>{children}</p>;
}

function PlaceholderButton({ children, fill = false }: { children: React.ReactNode; fill?: boolean }) {
  return <span className={`${styles.button} ${fill ? styles.buttonFill : ""}`}>{children}</span>;
}

export default function WireframePage() {
  return (
    <main className={styles.page}>
      <div className={styles.notice}>
        WIREFRAME 01 · STRUCTURE ONLY · GIVEWELL RHYTHM / ROOSA CONTENT
      </div>

      <header className={styles.header}>
        <a className={styles.wordmark} href="#top" aria-label="ROOSA wireframe home">ROOSA</a>
        <nav className={styles.nav} aria-label="Wireframe navigation">
          <a href="#product">Product</a>
          <a href="#impact">Impact</a>
          <a href="#story">About</a>
          <a href="#options">Shop</a>
        </nav>
        <PlaceholderButton fill>Buy ROOSA</PlaceholderButton>
      </header>

      <section className={`${styles.zone} ${styles.hero}`} id="top">
        <SourceTag>GIVEWELL ZONE 01 / PLAN §§ 1–3 / HERO + PROOF</SourceTag>
        <div className={styles.heroCopy}>
          <h1>Soft on skin.<br />Strong for children.</h1>
          <p>Pink three-ply toilet paper with documented social impact.</p>
          <div className={styles.actions}>
            <PlaceholderButton fill>Buy ROOSA</PlaceholderButton>
            <PlaceholderButton>See the impact</PlaceholderButton>
          </div>
        </div>
        <div className={styles.heroMedia}>
          <span className={styles.mediaLabel}>SIGNATURE PRODUCT VISUAL<br />STATIC WIREFRAME FALLBACK</span>
          <Image src="/media/products/hero-pack.png" alt="ROOSA product placeholder" fill priority unoptimized sizes="(max-width: 700px) 90vw, 42vw" />
        </div>
        <div className={styles.proofStrip}>
          {proofs.map((proof, index) => (
            <div className={styles.proof} key={proof}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{proof}</strong>
            </div>
          ))}
        </div>
      </section>

      <section className={`${styles.zone} ${styles.statement}`} id="statement">
        <SourceTag>GIVEWELL ZONE 02 / PLAN § 5 / BRAND STATEMENT</SourceTag>
        <p className={styles.kicker}>THE EVERYDAY PRODUCT, REFRAMED</p>
        <h2>Unexpected colour.<br />Serious quality.</h2>
        <div className={styles.statementFoot}>
          <p>Macro product photograph / paper-shaped mask</p>
          <span>↓</span>
        </div>
      </section>

      <section className={`${styles.zone} ${styles.productZone}`} id="product">
        <SourceTag>GIVEWELL ZONE 03 / PLAN §§ 4 + 6 / PRODUCT + IMPACT MECHANISM</SourceTag>
        <div className={styles.sectionIntro}>
          <p className={styles.kicker}>MAIN PRODUCT MODULE</p>
          <h2>The roll that<br />does more.</h2>
        </div>
        <div className={styles.productPanel}>
          <div className={styles.gallery}>
            <div className={styles.imageFrame}>
              <Image src="/media/products/pink-pack.jpg" alt="ROOSA pack placeholder" fill unoptimized loading="eager" sizes="(max-width: 800px) 92vw, 48vw" />
              <span>PRODUCT GALLERY</span>
            </div>
            <div className={styles.thumbs}><span /><span /><span /></div>
          </div>
          <div className={styles.productInfo}>
            <p className={styles.kicker}>ROOSA PINK TOILET PAPER</p>
            <h3>[PRODUCT NAME]</h3>
            <p className={styles.price}>Price at launch</p>
            <ul>
              <li>Roll count pending rolls</li>
              <li>Specification pending-ply paper</li>
              <li>Specification pending sheets per roll</li>
              <li>certification pending approval</li>
            </ul>
            <div className={styles.quantity}>− <strong>1</strong> +</div>
            <PlaceholderButton fill>Add to cart</PlaceholderButton>
            <small>shipping summary pending approval · returns summary pending approval</small>
          </div>
        </div>
        <div className={styles.impactSteps} id="impact">
          <p className={styles.kicker}>THE PINK PAPER TRAIL</p>
          {[
            ["01", "You buy ROOSA", "A normal everyday purchase."],
            ["02", "Contribution allocated", "Amount pending approval · methodology pending approval"],
            ["03", "Verified support", "Partner pending approval · reporting period pending approval"],
          ].map(([number, title, copy]) => (
            <article key={number}>
              <span>{number}</span>
              <h3>{title}</h3>
              <p>{copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={`${styles.zone} ${styles.story}`} id="story">
        <SourceTag>GIVEWELL ZONE 04 / PLAN § 10 / FOUNDER + ORIGIN</SourceTag>
        <div className={styles.portrait}><span>FOUNDER PORTRAIT</span></div>
        <div className={styles.storyCopy}>
          <p className={styles.kicker}>WHY ROOSA EXISTS</p>
          <h2>Why pink.<br />Why protection.</h2>
          <p>approved founder story pending approval A concise origin story belongs here. This block is deliberately unstyled and contains no invented claims.</p>
          <PlaceholderButton>Read our story</PlaceholderButton>
        </div>
      </section>

      <section className={`${styles.zone} ${styles.optionsZone}`} id="options">
        <SourceTag>GIVEWELL ZONE 05 / PLAN § 7 / SOMA STORE MODULE INSIDE GIVEWELL RHYTHM</SourceTag>
        <div className={styles.optionsHeading}>
          <p className={styles.kicker}>PRODUCT OPTIONS</p>
          <h2>Choose your<br />everyday impact.</h2>
          <p>Soma card proportions; Bovist controls. No final art direction applied.</p>
        </div>
        <div className={styles.productGrid}>
          {products.map(([title, price, src], index) => (
            <article className={styles.card} key={title}>
              <div className={styles.cardImage}>
                <Image src={src} alt="" fill unoptimized loading="eager" sizes="(max-width: 700px) 90vw, 30vw" />
                <span>OPTION {String(index + 1).padStart(2, "0")}</span>
              </div>
              <div className={styles.cardCopy}>
                <h3>{title}</h3><p>{price}</p>
              </div>
              <PlaceholderButton>Add to cart</PlaceholderButton>
            </article>
          ))}
        </div>
        <div className={styles.paperTrail} aria-hidden="true">
          <span>PURCHASE</span><i /><span>CONTRIBUTION</span><i /><span>PARTNER</span><i /><span>RESULT</span>
        </div>
      </section>

      <section className={`${styles.zone} ${styles.resultsZone}`} id="results">
        <SourceTag>GIVEWELL ZONE 06 / PLAN §§ 8–9 / METRICS + FEATURED PROJECT</SourceTag>
        <div className={styles.metrics}>
          {[
            ["total contributions pending approval", "Total contributions", "reporting period pending approval"],
            ["project count pending approval", "Projects supported", "reporting period pending approval"],
            ["partner count pending approval", "Partner organisations", "reporting period pending approval"],
          ].map(([value, label, period]) => (
            <article key={label}><strong>{value}</strong><p>{label}</p><small>{period}</small></article>
          ))}
        </div>
        <div className={styles.project}>
          <div className={styles.projectImage}>
            <Image src="/media/journal/field-team.jpg" alt="Featured project placeholder" fill unoptimized loading="eager" sizes="(max-width: 800px) 92vw, 52vw" />
            <span>APPROVED DOCUMENTARY PHOTOGRAPHY</span>
          </div>
          <div className={styles.projectCopy}>
            <p className={styles.kicker}>FEATURED PROJECT</p>
            <h2>project name pending approval</h2>
            <dl>
              <div><dt>Partner</dt><dd>Partner pending approval</dd></div>
              <div><dt>Location</dt><dd>location pending approval</dd></div>
              <div><dt>Status</dt><dd>status pending approval</dd></div>
              <div><dt>Result</dt><dd>verified result pending approval</dd></div>
            </dl>
            <PlaceholderButton>View project report</PlaceholderButton>
          </div>
        </div>
      </section>

      <footer className={`${styles.zone} ${styles.footer}`}>
        <SourceTag>GIVEWELL ZONE 07 / PLAN §§ 11–13 / TRUST + FINAL CTA + FOOTER</SourceTag>
        <div className={styles.trustRow}>
          <span>[RETAILER LOGO]</span><span>certification pending approval</span><span>[PRESS / REVIEW]</span><span>[B2B CTA]</span>
        </div>
        <div className={styles.finalCta}>
          <p className={styles.kicker}>THE PAPER TRAIL RETURNS TO THE PRODUCT</p>
          <h2>Make an everyday<br />purchase count.</h2>
          <div className={styles.actions}><PlaceholderButton fill>Buy ROOSA</PlaceholderButton><PlaceholderButton>Find a retailer</PlaceholderButton></div>
        </div>
        <div className={styles.footerGrid}>
          <strong>ROOSA</strong>
          <div><b>Shop</b><span>Products</span><span>Subscriptions</span><span>B2B</span></div>
          <div><b>Impact</b><span>How it works</span><span>Projects</span><span>Reports</span></div>
          <div><b>Company</b><span>About</span><span>Journal</span><span>Contact</span></div>
          <div><b>Legal</b><span>Privacy</span><span>Imprint</span><span>Terms</span></div>
        </div>
        <p className={styles.legal}>legal company name pending approval · address pending approval · © 2026 · EN / DE / FR / IT</p>
      </footer>
    </main>
  );
}
