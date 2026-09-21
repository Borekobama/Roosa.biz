"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Logo from "./Logo";
import { useCart } from "./CartDrawer";
import { nav } from "@/lib/content";

/**
 * Header geometry is measured from the source at 1440px:
 * logo x=32 (166x46), nav links x=1036/1117/1174 at 18px, Jetzt entdecken x=1252
 * (100x45), cart x=1368 (40x40). The nav group is right-aligned, not centred.
 */
export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const cart = useCart();

  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <header
      // Floats over the page: the source never paints a bar behind it.
      className="enter-drop fixed inset-x-0 top-0 z-50 h-[70px]"
    >
      <div className="flex h-[70px] items-center px-4 sm:px-8">
        <Link href="/" aria-label="ROOSA - Startseite" className="m-surface text-moss hover:text-forest">
          <Logo />
        </Link>

        {/* Everything else is pushed to the right edge, as on the source. */}
        <div className="ml-auto flex items-center gap-3">
          <nav
            aria-label="Primary"
            className="hidden items-center gap-6 rounded-[64px] bg-sage px-4 py-[10px] backdrop-blur-sm md:flex"
          >
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={pathname.startsWith(item.href) ? "page" : undefined}
                className="m-surface text-[18px] leading-[25.2px] tracking-[-0.72px] text-forest hover:text-moss"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <Link
            href="/#product-offer"
            className="m-surface hidden items-center rounded-[999px] bg-olive px-4 py-[10px] text-[18px] leading-[25.2px] tracking-[-0.72px] text-paper hover:bg-moss md:inline-flex"
          >
            Jetzt entdecken
          </Link>

          <button
            type="button"
            aria-label="Warenkorb öffnen"
            onClick={cart.open}
            className="m-surface relative flex h-10 w-10 items-center justify-center rounded-full bg-olive text-cream hover:bg-moss"
          >
            {/* Measured: a 16px sage disc overlaps the cart at its top-right. */}
            <span
              aria-hidden="true"
              className="absolute -right-1 -top-1 h-4 w-4 rounded-full bg-sage"
            />
            {/* The 16px box matches the source; the drawing inside did not. This
                ran edge to edge at a 1.3 stroke and read as a heavier, larger
                mark than the source's, which sits inset in its box. */}
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path
                d="M2.6 3.1h1.6l1.3 6.4a.85.85 0 0 0 .84.68h4.9a.85.85 0 0 0 .83-.67l.85-3.9H4.7"
                stroke="currentColor"
                strokeWidth="1.15"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="6.4" cy="12.4" r=".95" fill="currentColor" />
              <circle cx="10.9" cy="12.4" r=".95" fill="currentColor" />
            </svg>
          </button>

          <button
            type="button"
            aria-label={open ? "Menü schliessen" : "Menü öffnen"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
            className={`m-surface flex h-10 w-10 items-center justify-center rounded-full md:hidden ${
              open ? "text-moss" : "bg-olive text-cream"
            }`}
          >
            <span className="relative block h-3 w-4" aria-hidden="true">
              <span
                className="m-transform absolute left-0 block h-[1.5px] w-4 bg-current"
                style={{ top: open ? "5.5px" : "1px", transform: open ? "rotate(45deg)" : "none" }}
              />
              <span
                className="m-transform absolute left-0 block h-[1.5px] w-4 bg-current"
                style={{ top: open ? "5.5px" : "10px", transform: open ? "rotate(-45deg)" : "none" }}
              />
            </span>
          </button>
        </div>
      </div>

      {/* Rendered only while open: the source ships no duplicate nav markup. */}
      {open ? (
        <div id="mobile-menu" className="px-3 md:hidden">
          <div className="rounded-[24px] bg-sage/95 px-6 pb-7 pt-5 backdrop-blur-sm">
            <nav aria-label="Mobile" className="flex flex-col items-end gap-3">
              {nav.map((item) => (
                <Link key={item.href} href={item.href} className="t-display-m text-moss">
                  {item.label}
                </Link>
              ))}
              <Link
                href="/#product-offer"
                className="mt-3 inline-flex w-fit rounded-[999px] bg-olive px-6 py-3 text-[16px] leading-none text-cream"
              >
                Jetzt entdecken
              </Link>
            </nav>
          </div>
        </div>
      ) : null}
    </header>
  );
}
