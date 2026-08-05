from pathlib import Path
from playwright.sync_api import sync_playwright


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "docs" / "design-references" / "v2-qa"
OUTPUT.mkdir(parents=True, exist_ok=True)


def inspect(page, route: str, name: str, width: int, height: int) -> dict:
    page.set_viewport_size({"width": width, "height": height})
    response = page.goto(f"http://127.0.0.1:3001{route}", wait_until="domcontentloaded")
    page.wait_for_timeout(1200)
    for y in range(0, page.evaluate("document.documentElement.scrollHeight"), height):
        page.evaluate("value => window.scrollTo(0, value)", y)
        page.wait_for_timeout(35)
    page.evaluate("window.scrollTo(0, 0)")
    page.wait_for_timeout(200)
    page.screenshot(path=str(OUTPUT / f"{name}.png"), full_page=True)
    metrics = page.evaluate(
        """() => ({
          title: document.title,
          path: location.pathname,
          viewport: document.documentElement.clientWidth,
          width: document.documentElement.scrollWidth,
          height: document.documentElement.scrollHeight,
          headings: [...document.querySelectorAll('h1,h2')].slice(0, 12).map(el => el.textContent.trim()),
          brokenImages: [...document.images]
            .filter(image => image.complete && image.naturalWidth === 0)
            .map(image => image.currentSrc || image.src),
          givewellZones: [...document.querySelectorAll('.section_hero,.section_mission,.section_empower,.section_team,.section_vision,.section_stats,.footer_component')]
            .map(el => ({ className: el.className, top: el.getBoundingClientRect().top + scrollY, height: el.getBoundingClientRect().height }))
        })"""
    )
    metrics["status"] = response.status if response else None
    print(name, metrics)
    assert metrics["status"] == 200
    assert metrics["width"] == metrics["viewport"], f"horizontal overflow on {name}"
    assert not metrics["brokenImages"], f"broken images on {name}: {metrics['brokenImages']}"
    return metrics


with sync_playwright() as playwright:
    browser = playwright.chromium.launch(headless=True)
    page = browser.new_page()
    page.on("pageerror", lambda error: print("pageerror", error))
    inspect(page, "/", "home-desktop-1440", 1440, 1000)
    inspect(page, "/", "home-mobile-390", 390, 844)
    inspect(page, "/en/shop", "shop-desktop-1440", 1440, 1000)
    inspect(page, "/en/shop", "shop-mobile-390", 390, 844)
    inspect(page, "/en/product/roosa-pink", "product-desktop-1440", 1440, 1000)
    inspect(page, "/en/product/roosa-pink", "product-mobile-390", 390, 844)
    inspect(page, "/en/impact", "impact-desktop-1440", 1440, 1000)
    inspect(page, "/en/impact", "impact-mobile-390", 390, 844)
    inspect(page, "/en/about", "about-desktop-1440", 1440, 1000)
    inspect(page, "/en/about", "about-mobile-390", 390, 844)
    inspect(page, "/en/b2b", "b2b-desktop-1440", 1440, 1000)
    inspect(page, "/en/journal", "journal-desktop-1440", 1440, 1000)
    inspect(page, "/en/support", "support-desktop-1440", 1440, 1000)
    browser.close()
