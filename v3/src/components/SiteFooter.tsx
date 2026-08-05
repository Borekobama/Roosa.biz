import Image from "next/image";
import Link from "next/link";
import { localizedPath } from "@/lib/i18n";
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
        <Image className="footer-product footer-product--pack" src="/media/products/hero-pack.png" alt="" width={680} height={620} sizes="(max-width: 700px) 70vw, 34vw" />
        <Image className="footer-product footer-product--roll" src="/media/products/pink-roll.webp" alt="" width={460} height={560} sizes="(max-width: 700px) 38vw, 18vw" />
        <Image className="footer-product footer-product--sheet" src="/media/products/embossed-roll.webp" alt="" width={460} height={560} sizes="(max-width: 700px) 34vw, 16vw" />
      </div>
    </div>
    <div className="container footer-rule" />
    <div className="container footer-trust" aria-label="Trust and verification status">
      <span>authorized retailers pending approval</span>
      <span>certification documents pending approval</span>
      <span>verified reviews pending approval</span>
    </div>
    <div className="container footer-grid">
      <div className="footer-brand">
        <Image src="/media/brand/roosa-wordmark.png" alt="ROOSA" width={360} height={75} />
        <p>An everyday product with a documented paper trail.</p>
        <p className="footer-address">ROOSA® AG<br/>Kirschgartenstrasse 12<br/>4051 Basel, Switzerland</p>
      </div>
      {groups.map(([title,links]) => <div className="footer-column" key={title}><strong className="eyebrow">{title}</strong>{links.map(([label,path]) => <Link className="footer-link" key={path} href={localizedPath(locale,path)}>{label}</Link>)}</div>)}
    </div>
    <div className="container footer-bottom"><span>© {new Date().getFullYear()} ROOSA. Product, impact and legal details subject to client approval.</span><span>EN · DE · FR</span></div>
  </footer>;
}
