"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, ShoppingBag, X } from "@/components/icons";
import { LocaleSwitcher } from "@/components/LocaleSwitcher";
import { useCart } from "@/components/CartProvider";
import { copy, localizedPath } from "@/lib/i18n";
import type { Locale } from "@/types/content";

export function SiteHeader({ locale }: { locale: Locale }) {
  const t = copy[locale];
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const { itemCount, openCart } = useCart();
  const links = [[t.shop,"/shop"],[t.product,"/product/pink-toilet-paper"],[t.impact,"/impact"],[t.about,"/about"],[t.b2b,"/b2b"],[t.journal,"/journal"]];

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 24);
    update(); window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);
  useEffect(() => {
    document.body.dataset.scrollLock = String(menuOpen);
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") setMenuOpen(false); };
    window.addEventListener("keydown", onKey);
    if (!menuOpen) menuButton.current?.focus();
    return () => { window.removeEventListener("keydown", onKey); document.body.dataset.scrollLock = "false"; };
  }, [menuOpen]);

  return <>
    <div className="announcement"><Link href={localizedPath(locale,"/impact")}>{t.announcement}</Link></div>
    <header className="site-header" data-scrolled={scrolled} data-menu-open={menuOpen}>
      <div className="container header-inner">
        <Link className="brand" href={localizedPath(locale)} aria-label="ROOSA home"><Image src="/media/brand/roosa-wordmark.png" alt="ROOSA" width={260} height={54} priority /></Link>
        <nav className="desktop-nav" aria-label="Primary navigation">{links.map(([label,path]) => <Link key={path} href={localizedPath(locale,path)} aria-current={pathname === localizedPath(locale,path) ? "page" : undefined}>{label}</Link>)}</nav>
        <div className="header-actions">
          <div className="desktop-only"><LocaleSwitcher locale={locale} /></div>
          <button className="button button--icon" type="button" onClick={openCart} aria-label={`${t.cart}, ${itemCount} items`}><ShoppingBag size={19} /><span className="cart-count">{itemCount}</span></button>
          <Link className="button button--primary desktop-only" href={localizedPath(locale,"/shop")}>{t.buy}</Link>
          <button ref={menuButton} className="button button--icon mobile-only" type="button" onClick={() => setMenuOpen((value) => !value)} aria-expanded={menuOpen} aria-controls="mobile-menu" aria-label={menuOpen ? "Close menu" : "Open menu"}>{menuOpen ? <X /> : <Menu />}</button>
        </div>
      </div>
    </header>
    {menuOpen && <div className="mobile-menu" id="mobile-menu" role="dialog" aria-modal="true" aria-label="Navigation menu">
      <div className="container">
        <div className="mobile-menu__top"><span className="eyebrow">Navigation</span><LocaleSwitcher locale={locale} /></div>
        <nav className="mobile-menu__nav">{links.map(([label,path]) => <Link key={path} href={localizedPath(locale,path)} onClick={() => setMenuOpen(false)}>{label}</Link>)}</nav>
        <Link className="button button--light" href={localizedPath(locale,"/shop")} onClick={() => setMenuOpen(false)}>{t.buy}</Link>
      </div>
    </div>}
  </>;
}
