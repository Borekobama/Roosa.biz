import type { Locale } from "@/types/content";
import { CartDrawer } from "@/components/CartDrawer";
import { CartProvider } from "@/components/CartProvider";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export function SiteShell({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  return <CartProvider><a className="skip-link" href="#main-content">Skip to content</a><SiteHeader locale={locale}/><div id="main-content">{children}</div><SiteFooter locale={locale}/><CartDrawer/></CartProvider>;
}
