import Image from "next/image";
import Link from "next/link";
import { locales, localizedPath } from "@/lib/i18n";
import type { Locale } from "@/types/content";

export function SiteFooter({ locale }: { locale: Locale }) {
  const groups = [
    ["Shop",[["All products","/shop"],["Pink paper","/product/pink-toilet-paper"],["Subscriptions","/product/subscription"]]],
    ["Impact",[["How it works","/impact"],["Projects","/impact/projects/featured-project"],["Methodology","/impact#methodology"]]],
    ["Company",[["About","/about"],["Journal","/journal"],["Careers","/careers"],["B2B","/b2b"]]],
    ["Support",[["Help","/support"],["Shipping","/shipping"],["Returns","/returns"],["Contact","/contact"]]],
    ["Legal",[["Privacy","/privacy"],["Imprint","/imprint"]]],
  ] as const;
  return <footer className="site-footer">
    <div className="footer-cta container">
      <div className="footer-cta__copy">
        <span className="eyebrow">The pink paper trail</span>
        <h2>Make an everyday purchase count.</h2>
        <p>Pink toilet paper with a documented purpose—from the bathroom shelf to measurable impact.</p>
        <Link className="button button--primary" href={localizedPath(locale,"/shop")}>Buy ROOSA <span aria-hidden="true">↗</span></Link>
      </div>
      <div className="footer-cta__product" aria-hidden="true">
        <Image className="footer-product footer-product--pack" src="/media/v4/family-bundle-editorial.webp" alt="" width={1122} height={1402} sizes="(max-width: 991px) 78vw, 34vw" />
        <Image className="footer-product footer-product--roll" src="/media/v4/pink-roll-cutout.png" alt="" width={1254} height={1254} sizes="(max-width: 991px) 42vw, 18vw" />
        <Image className="footer-product footer-product--sheet" src="/media/v4/white-roll-cutout.png" alt="" width={1254} height={1254} sizes="(max-width: 991px) 38vw, 16vw" />
      </div>
    </div>
    <div className="container footer-rule" />
    <div className="container footer-trust" aria-label="Trust and verification status">
      <span>8-roll pack · 3-ply paper</span>
      <span>Demo cart · saved in this browser</span>
      <span>Checkout simulation · no payment collected</span>
    </div>
    <div className="container footer-grid">
      <div className="footer-brand">
        <Image src="/media/brand/roosa-wordmark.png" alt="ROOSA" width={360} height={75} />
        <p>An everyday product with a documented paper trail.</p>
        <p className="footer-address">ROOSA® AG<br/>Kirschgartenstrasse 12<br/>4051 Basel, Switzerland</p>
      </div>
      {groups.map(([title,links]) => <div className="footer-column" key={title}><strong className="eyebrow">{title}</strong>{links.map(([label,path]) => <Link className="footer-link" key={path} href={localizedPath(locale,path)}>{label}</Link>)}</div>)}
    </div>
    <div className="container footer-bottom"><span>© {new Date().getFullYear()} ROOSA. Product, impact and legal details subject to client approval.</span><nav className="footer-locales" aria-label="Languages">{locales.map((nextLocale) => <Link key={nextLocale} href={localizedPath(nextLocale)} aria-current={nextLocale === locale ? "page" : undefined}>{nextLocale.toUpperCase()}</Link>)}</nav><a className="footer-credit" href="https://oezer.ch" target="_blank" rel="noreferrer">made by Berke Özer - oezer.ch</a></div>
  </footer>;
}
