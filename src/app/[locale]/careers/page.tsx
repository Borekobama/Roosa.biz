import Link from "next/link";
import { localizedPath } from "@/lib/i18n";
import { PageHero, requireLocale, routeMetadata, styles, type LocaleParams } from "../editorial";

export const metadata = routeMetadata("Careers", "Current opportunities at ROOSA.");
export default async function CareersPage({ params }: { params: LocaleParams }) { const locale = await requireLocale(params); return <main className={styles.page}><PageHero eyebrow="Careers" title="No open roles right now." lead="We do not have any approved vacancies to publish at the moment. When that changes, each role will appear here with its location, working model and application process." /><section className={`${styles.section} ${styles.sectionPink}`}><div className={`${styles.sectionInner} ${styles.feature}`}><h2>Check back for confirmed opportunities.</h2><div><p>ROOSA does not accept speculative applications through the customer-support form, so personal data is not collected without a defined hiring purpose.</p><div className={styles.actions}><Link className="button button--primary" href={localizedPath(locale, "/about")}>Learn about ROOSA</Link></div></div></div></section></main>; }
