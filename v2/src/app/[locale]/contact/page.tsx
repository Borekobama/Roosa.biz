import { ContactForm } from "@/components/v2-editorial/ContactForm";
import { PageHero, requireLocale, routeMetadata, styles, type LocaleParams } from "../editorial";

export const metadata = routeMetadata("Contact", "Contact ROOSA about orders, products, impact information or press enquiries.");
export default async function ContactPage({ params }: { params: LocaleParams }) { await requireLocale(params); return <main className={styles.page}><PageHero eyebrow="Contact" title="What can we help with?" lead="Send only the details needed to answer your question. Never include payment-card information, passwords or sensitive personal information." /><section className={styles.section}><div className={styles.sectionInner}><div className={styles.sectionHeader}><p className="eyebrow">Message form</p><div><h2>A direct route to the right team.</h2><p>This demonstration form does not transmit or store information.</p></div></div><ContactForm /></div></section></main>; }
