"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "@/components/icons";
import { LocaleSwitcher } from "@/components/LocaleSwitcher";
import { copy, localizedPath } from "@/lib/i18n";
import type { Locale } from "@/types/content";

export function SiteHeader({ locale }: { locale: Locale }) {
  const t = copy[locale];
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const menuPanel = useRef<HTMLDivElement>(null);
  const wasOpen = useRef(false);
  const links = [[t.shop,"/shop"],[t.product,"/product/pink-toilet-paper"],[t.impact,"/impact"],[t.about,"/about"],[t.b2b,"/b2b"],[t.journal,"/journal"]];

  useEffect(() => {
    document.body.dataset.scrollLock = String(menuOpen);
    if (menuOpen) {
      menuPanel.current?.querySelector<HTMLAnchorElement>("a")?.focus();
    } else if (wasOpen.current) {
      menuButton.current?.focus();
    }
    wasOpen.current = menuOpen;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
      if (event.key !== "Tab" || !menuOpen || !menuPanel.current) return;
      const focusable = [...menuPanel.current.querySelectorAll<HTMLElement>("a[href],button:not([disabled]),select")];
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    if (!menuOpen) menuButton.current?.focus();
    return () => { window.removeEventListener("keydown", onKey); document.body.dataset.scrollLock = "false"; };
  }, [menuOpen]);

  return <>
    <header className="roosa-global-header" data-menu-open={menuOpen}>
      <div className="roosa-global-header__inner">
        <Link className="roosa-global-header__brand" href={localizedPath(locale)} aria-label="ROOSA home">ROOSA</Link>
        <nav className="roosa-global-header__nav" aria-label="Primary navigation">{links.map(([label,path]) => <Link key={path} href={localizedPath(locale,path)} aria-current={pathname === localizedPath(locale,path) ? "page" : undefined}>{label}</Link>)}</nav>
        <Link className="roosa-global-header__buy" href={localizedPath(locale,"/shop")}>{t.buy}</Link>
        <button ref={menuButton} className="roosa-global-header__menu" type="button" onClick={() => setMenuOpen((value) => !value)} aria-expanded={menuOpen} aria-controls="mobile-menu" aria-label={menuOpen ? "Close menu" : "Open menu"}>{menuOpen ? <X /> : <Menu />}</button>
      </div>
    </header>
    {menuOpen && <div ref={menuPanel} className="mobile-menu" id="mobile-menu" role="dialog" aria-modal="true" aria-label="Navigation menu">
      <div className="container">
        <div className="mobile-menu__top"><span className="eyebrow">Navigation</span><LocaleSwitcher locale={locale} /></div>
        <nav className="mobile-menu__nav">{links.map(([label,path]) => <Link key={path} href={localizedPath(locale,path)} onClick={() => setMenuOpen(false)}>{label}</Link>)}</nav>
        <Link className="button button--light" href={localizedPath(locale,"/shop")} onClick={() => setMenuOpen(false)}>{t.buy}</Link>
      </div>
    </div>}
  </>;
}
