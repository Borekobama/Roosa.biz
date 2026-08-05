import json
from pathlib import Path

from playwright.sync_api import sync_playwright


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "docs" / "v4-polish-qa" / "after"
OUTPUT.mkdir(parents=True, exist_ok=True)
BASE_URL = "http://localhost:3003"
AXE_PATH = ROOT / "node_modules" / "axe-core" / "axe.min.js"
ROUTES = {
    "home": "/en",
    "shop": "/en/shop",
    "product": "/en/product/pink-toilet-paper",
    "cart": "/en/cart",
    "impact": "/en/impact",
    "about": "/en/about",
    "b2b": "/en/b2b",
}
VIEWPORTS = {
    "desktop": {"width": 1440, "height": 1000},
    "tablet": {"width": 834, "height": 1112},
    "mobile": {"width": 390, "height": 844},
    "narrow": {"width": 320, "height": 740},
}


def inspect(page):
    return page.evaluate(
        """() => {
          const visible = (node) => {
            const style = getComputedStyle(node);
            const rect = node.getBoundingClientRect();
            return style.display !== 'none' && style.visibility !== 'hidden' &&
              Number(style.opacity) > 0 && rect.width > 0 && rect.height > 0;
          };
          const clip = (value) => String(value || '').trim().replace(/\\s+/g, ' ').slice(0, 100);
          const elements = [...document.querySelectorAll('body *')].filter(visible);
          const viewportOverflow = elements
            .map((node) => {
              const rect = node.getBoundingClientRect();
              return {
                tag: node.tagName,
                className: clip(node.className),
                text: clip(node.textContent),
                left: Math.round(rect.left),
                right: Math.round(rect.right),
                width: Math.round(rect.width)
              };
            })
            .filter((item) => item.left < -2 || item.right > innerWidth + 2)
            .slice(0, 20);
          const smallTargets = [...document.querySelectorAll('a,button,input,summary')]
            .filter(visible)
            .map((node) => {
              const rect = node.getBoundingClientRect();
              return {
                tag: node.tagName,
                text: clip(node.textContent || node.getAttribute('aria-label')),
                width: Math.round(rect.width),
                height: Math.round(rect.height)
              };
            })
            .filter((item) => item.width < 44 || item.height < 44)
            .slice(0, 30);
          const sections = [...document.querySelectorAll('main > section, main > header, main > div')]
            .filter(visible)
            .map((node) => {
              const rect = node.getBoundingClientRect();
              return {
                className: clip(node.className),
                height: Math.round(rect.height),
                top: Math.round(rect.top + scrollY)
              };
            });
          const images = [...document.images].map((image) => {
            const rect = image.getBoundingClientRect();
            const style = getComputedStyle(image);
            return {
              src: image.getAttribute('src'),
              alt: image.getAttribute('alt'),
              loaded: image.complete && image.naturalWidth > 0,
              natural: [image.naturalWidth, image.naturalHeight],
              rendered: [Math.round(rect.width), Math.round(rect.height)],
              fit: style.objectFit,
              position: style.objectPosition
            };
          });
          return {
            title: document.title,
            heading: clip(document.querySelector('h1')?.textContent),
            document: {
              width: document.documentElement.scrollWidth,
              viewport: innerWidth,
              height: document.documentElement.scrollHeight,
              overflowX: document.documentElement.scrollWidth > innerWidth
            },
            viewportOverflow,
            smallTargets,
            sections,
            images,
            emptyLinks: [...document.querySelectorAll('a')].filter((a) => !a.getAttribute('href') || a.getAttribute('href') === '#').length,
            headings: [...document.querySelectorAll('h1,h2,h3')].map((h) => `${h.tagName}:${clip(h.textContent)}`)
          };
        }"""
    )


with sync_playwright() as playwright:
    browser = playwright.chromium.launch(headless=True)
    report = {}
    for viewport_name, viewport in VIEWPORTS.items():
        report[viewport_name] = {}
        for route_name, route in ROUTES.items():
            page = browser.new_page(viewport=viewport, device_scale_factor=1)
            errors = []
            page.on("pageerror", lambda error: errors.append(str(error)))
            page.goto(f"{BASE_URL}{route}", wait_until="networkidle")
            page.wait_for_timeout(500)
            data = inspect(page)
            page.add_script_tag(path=str(AXE_PATH))
            axe = page.evaluate(
                """async () => {
                  const result = await axe.run(document, {
                    runOnly: {type: 'tag', values: ['wcag2a', 'wcag2aa']}
                  });
                  return result.violations.map(({id, impact, help, nodes}) => ({
                    id, impact, help, nodes: nodes.length,
                    targets: nodes.slice(0, 5).map((node) => node.target)
                  }));
                }"""
            )
            data["axe"] = axe
            data["errors"] = errors
            report[viewport_name][route_name] = data
            page.screenshot(
                path=str(OUTPUT / f"{viewport_name}-{route_name}.png"),
                full_page=True,
            )
            page.close()
    browser.close()

(OUTPUT / "report.json").write_text(json.dumps(report, indent=2), encoding="utf-8")
print(OUTPUT / "report.json")
