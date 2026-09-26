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
      // Floats over the page on a desktop: the source never paints a bar
      // behind it. Wherever the menu control shows, the 70px bar is solid page
      // colour instead, so the logo, cart and menu stay legible over photos
      // and the review ticker. Open, the menu is that same header grown
      // downward - 70 to 309 tall, sage, 16px radius on its floor.
      className={`enter-drop m-surface fixed inset-x-0 top-0 z-50 ${
        open ? "rounded-b-[16px] bg-sage md:rounded-none md:bg-transparent" : "max-md:bg-cream"
      }`}
    >
      <div className="flex h-[70px] items-center px-4 sm:px-8">
        <Link href="/" aria-label="ROOSA - Startseite" className="m-surface text-moss hover:text-forest">
          <Logo />
        </Link>

        {/* Everything else is pushed to the right edge, as on the source. */}
        {/* 16px between the cart and the menu control on a phone. */}
        <div className="ml-auto flex items-center gap-4 md:gap-3">
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
            // Measured at 390: two 28x3 bars 16px apart in a 32px box flush
            // with the 16px gutter, crossing into an X when open.
            className="m-surface flex h-10 w-8 items-center justify-center text-moss md:hidden"
          >
            <span className="relative block h-[22px] w-7" aria-hidden="true">
              <span
                className="absolute left-0 block h-[3px] w-7 bg-current transition-[top,transform] duration-300 ease-out"
                style={{ top: open ? "9.5px" : "0px", transform: open ? "rotate(45deg)" : "none" }}
              />
              <span
                className="absolute left-0 block h-[3px] w-7 bg-current transition-[top,transform] duration-300 ease-out"
                style={{ top: open ? "9.5px" : "19px", transform: open ? "rotate(-45deg)" : "none" }}
              />
            </span>
          </button>
        </div>
      </div>

      {/* Always rendered so it can grow open and closed; inert while closed.
          Measured open: links in the 32/35.2 product face on a 51px pitch,
          right aligned, the first 27px under the bar, then the pill 17px
          below the last and 16px off the panel floor. */}
      <div
        id="mobile-menu"
        inert={!open}
        className={`grid transition-[grid-template-rows] duration-300 ease-out md:hidden ${
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <nav aria-label="Mobile" className="flex flex-col items-end gap-4 px-4 pb-4 pt-[27px]">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="t-product text-forest"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/#product-offer"
              onClick={() => setOpen(false)}
              className="mt-px inline-flex w-fit rounded-[999px] bg-olive px-4 py-[10px] text-[16px] leading-[22.4px] tracking-[-0.64px] text-paper"
            >
              Jetzt entdecken
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
