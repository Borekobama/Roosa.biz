import Link from "next/link";
import Logo from "./Logo";

const columns = [
  {
    heading: "ROOSA",
    links: [
      { label: "Vorteile", href: "/#benefits" },
      { label: "Mission", href: "/science#ingredients" },
      { label: "Produkte", href: "/merch" },
      { label: "FAQ", href: "/#faq" },
    ],
  },
  {
    heading: "Mission",
    links: [
      { label: "Kinderschutz", href: "/science" },
      { label: "Unser Beitrag", href: "/science#ingredients" },
      { label: "Über ROOSA", href: "/science" },
    ],
  },
  {
    heading: "Informationen",
    links: [
      { label: "Aktuelles", href: "/blog" },
      { label: "Cookie-Richtlinie", href: "/cookies-policy" },
      { label: "Datenschutz", href: "/privacy-policy" },
    ],
  },
];

const socials = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com",
    path: "M3.6 2A1.6 1.6 0 1 0 3.6 5.2 1.6 1.6 0 0 0 3.6 2ZM2.2 6.4h2.8V14H2.2V6.4Zm4.6 0h2.7v1a3 3 0 0 1 2.6-1.2c2 0 2.9 1.2 2.9 3.4V14h-2.8V9.9c0-1-.3-1.6-1.2-1.6-.8 0-1.3.5-1.5 1.1 0 .2-.1.5-.1.8V14H6.8V6.4Z",
  },
  {
    label: "X",
    href: "https://x.com",
    path: "M12.2 2h2.1l-4.6 5.3L15 14h-4.2l-3.3-4.3L3.7 14H1.6l4.9-5.6L1.3 2h4.3l3 4 3.6-4Zm-.8 10.7h1.2L5.3 3.2H4l7.4 9.5Z",
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com",
    path: "M8 1.4c-1.8 0-2 0-2.7.1-.7 0-1.2.2-1.6.3-.4.2-.8.4-1.2.8-.4.4-.6.8-.8 1.2-.1.4-.3.9-.3 1.6 0 .7-.1.9-.1 2.6s0 2 .1 2.7c0 .7.2 1.2.3 1.6.2.4.4.8.8 1.2.4.4.8.6 1.2.8.4.1.9.3 1.6.3.7 0 .9.1 2.7.1s2 0 2.7-.1c.7 0 1.2-.2 1.6-.3.4-.2.8-.4 1.2-.8.4-.4.6-.8.8-1.2.1-.4.3-.9.3-1.6 0-.7.1-.9.1-2.7s0-2-.1-2.6c0-.7-.2-1.2-.3-1.6a3.3 3.3 0 0 0-.8-1.2 3.3 3.3 0 0 0-1.2-.8c-.4-.1-.9-.3-1.6-.3-.7 0-.9-.1-2.7-.1Zm0 1.3c1.7 0 1.9 0 2.6.1.6 0 1 .1 1.2.2.3.1.5.3.7.5.2.2.4.4.5.7.1.2.2.6.2 1.2 0 .7.1.9.1 2.6s0 1.9-.1 2.6c0 .6-.1 1-.2 1.2-.1.3-.3.5-.5.7-.2.2-.4.4-.7.5-.2.1-.6.2-1.2.2-.7 0-.9.1-2.6.1s-1.9 0-2.6-.1c-.6 0-1-.1-1.2-.2a1.9 1.9 0 0 1-.7-.5 1.9 1.9 0 0 1-.5-.7c-.1-.2-.2-.6-.2-1.2 0-.7-.1-.9-.1-2.6s0-1.9.1-2.6c0-.6.1-1 .2-1.2.1-.3.3-.5.5-.7.2-.2.4-.4.7-.5.2-.1.6-.2 1.2-.2.7 0 .9-.1 2.6-.1Zm0 2.2a4.1 4.1 0 1 0 0 8.2 4.1 4.1 0 0 0 0-8.2Zm0 6.8a2.7 2.7 0 1 1 0-5.4 2.7 2.7 0 0 1 0 5.4Zm5.2-7a1 1 0 1 1-1.9 0 1 1 0 0 1 1.9 0Z",
  },
];

export default function Footer() {
  return (
    // Measured on the source: the olive block is inset 32px from the page with
    // a 32px radius and 32px of its own padding, and the wordmark image sits
    // flush on its floor - no strip of page colour under it.
    // The source sets this footer's type smaller on a phone than on a desktop:
    // 12/14.4 for the paragraph and the links against 16/22, and 12px column
    // headings against 14. Keeping the desktop sizes there made the footer 892
    // tall against the source's 754.
    //
    // `relative` so the footer paints above the closing plate: that plate is
    // translated down over this panel, and a transform makes a stacking
    // context that would otherwise draw the grass on top of the footer.
    <footer className="relative -mt-px px-4 pb-4 sm:px-8 sm:pb-8">
      {/* Measured: the source caps this panel at 1440px. Without the cap it
        grows with the window - 1616 wide at a 1680 viewport against the
        source's 1440 - which scales the wordmark with it and made the footer
        42px taller than the source's on that screen. */}
      <div className="mx-auto max-w-[1440px] overflow-hidden rounded-[32px] bg-olive px-6 pb-6 pt-14 text-cream sm:px-8 sm:pb-8 sm:pt-16">
        <div className="grid gap-14 lg:grid-cols-[1.1fr_1.6fr]">
          <div>
            <Logo className="text-cream" />
            {/* Measured: the source sets this column at 300px, where 34ch gives 343.
              Its own text there is a quotation and carries quote marks; ours is
              this template's line and does not. */}
            <p className="mt-7 max-w-[300px] text-[12px] leading-[14.4px] text-cream/80 sm:text-[16px] sm:leading-[22px]">
              Mehr als nur Toilettenpapier. Supersoft für jeden Tag und mit Herz
              für den Kinderschutz.
            </p>

            {/* Measured: bare 24px marks on a 34px pitch, not 36px pills. */}
            <ul className="mt-8 flex items-center gap-[10px]">
              {socials.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    aria-label={s.label}
                    className="m-surface flex h-6 w-6 items-center justify-center text-cream hover:text-cream/70"
                  >
                    <svg width="20" height="20" viewBox="0 0 16 16" aria-hidden="true">
                      <path d={s.path} fill="currentColor" />
                    </svg>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Measured: the nav columns are content width, right aligned against the
              panel's inner edge with a 63px gutter - x=952/1108/1274 on the
              source. A three-column grid spread them from x=632. */}
          <div className="flex flex-wrap gap-10 sm:justify-end sm:gap-[63px]">
            {columns.map((col) => (
              <div key={col.heading}>
                <h2 className="text-[12px] leading-[20px] text-cream/65 sm:text-[14px]">{col.heading}</h2>
                {/* Measured: rows sit on a 26px pitch, not 36. */}
                {/* The measure goes on the list, not only the links: an li inherits the
                    default 16px line box otherwise, so each row stays 24 tall and the
                    pitch sticks at 28 however small the link text is set. */}
                <ul className="mt-4 flex flex-col gap-1 text-[12px] leading-[14.4px] sm:text-[16px] sm:leading-[22px]">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="m-surface text-[12px] leading-[14.4px] text-cream/90 hover:text-cream sm:text-[16px] sm:leading-[22px]"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Measured: the credit row sits 63px below the block above, not 84. */}
        <div className="mt-[34px] flex flex-col gap-4 border-t border-cream/20 pt-7 sm:flex-row sm:items-center sm:justify-between">
          <p className="t-body-s text-cream/70">
            ROOSA® © {new Date().getFullYear()}. Alle Rechte vorbehalten.
          </p>
          <p className="t-body-s text-cream/70">
            ROOSA® AG · Kirschgartenstrasse 12 · 4051 Basel
          </p>
        </div>

        <p
          aria-hidden="true"
          className="mt-10 w-full text-center font-[var(--font-display)] text-[clamp(5rem,18vw,16rem)] font-light leading-none tracking-[-0.08em] text-cream/90"
        >
          roosa
        </p>
      </div>
    </footer>
  );
}
