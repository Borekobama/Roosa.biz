from playwright.sync_api import sync_playwright


ROUTES = {
    "home": "/",
    "shop": "/en/shop",
    "about": "/en/about",
    "impact": "/en/impact",
}


def metrics(page):
    return page.evaluate(
        """() => {
          const pick = (...selectors) => selectors.map(s => document.querySelector(s)).find(Boolean);
          const read = el => {
            if (!el) return null;
            const s = getComputedStyle(el); const r = el.getBoundingClientRect();
            return {
              selector: el.className || el.tagName,
              x: +r.x.toFixed(2), y: +r.y.toFixed(2), width: +r.width.toFixed(2), height: +r.height.toFixed(2),
              font: s.fontFamily, fontSize: s.fontSize, fontWeight: s.fontWeight,
              lineHeight: s.lineHeight, letterSpacing: s.letterSpacing,
              padding: s.padding, gap: s.gap, background: s.backgroundColor,
            };
          };
          const nav = pick('.navbar_component', '.navigation-bar-container', '.site-header');
          const inner = pick('.navbar_container', '.nav-shell', '.header-inner');
          const logo = pick('.navbar_logo', '.w-nav-brand', '.brand');
          const navLink = pick('.navbar_link', '.commerce-nav a', '.desktop-nav a');
          const buy = pick('.navbar_menu-buttons .btn', '.nav-buy', '.header-actions .button--primary');
          const hero = pick('.section_hero', '.product-detail-section', 'main section');
          const h1 = document.querySelector('h1');
          const container = pick('.section_hero .container-large', 'main .container', 'main [class*=sectionInner]');
          return { nav: read(nav), inner: read(inner), logo: read(logo), navLink: read(navLink), buy: read(buy), hero: read(hero), h1: read(h1), container: read(container) };
        }"""
    )


with sync_playwright() as playwright:
    browser = playwright.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 1440, "height": 1000})
    for name, route in ROUTES.items():
        page.goto(f"http://127.0.0.1:3001{route}", wait_until="networkidle")
        print(name, metrics(page))
    browser.close()
