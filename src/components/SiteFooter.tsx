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
  return <footer className="site-footer"><div className="container"><div className="footer-grid"><div className="stack"><strong className="display" style={{fontSize:"3rem"}}>ROOSA</strong><p style={{maxWidth:"28ch"}}>An everyday product with a documented paper trail.</p><p className="muted">ROOSA® AG<br/>Kirschgartenstrasse 12<br/>4051 Basel, Switzerland</p></div>{groups.map(([title,links]) => <div className="stack footer-column" key={title}><strong className="eyebrow">{title}</strong>{links.map(([label,path]) => <Link className="footer-link" key={path} href={localizedPath(locale,path)}>{label}</Link>)}</div>)}</div><div className="footer-bottom"><span>© {new Date().getFullYear()} ROOSA. Product, impact and legal details subject to client approval.</span><span>EN · DE · FR</span><a className="footer-credit" href="https://oezer.ch" target="_blank" rel="noreferrer">made by Berke Özer - oezer.ch</a></div></div></footer>;
}
