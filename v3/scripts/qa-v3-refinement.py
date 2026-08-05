from pathlib import Path
from playwright.sync_api import sync_playwright


OUTPUT = Path(__file__).resolve().parents[1] / "docs" / "v3-refinement-qa"
OUTPUT.mkdir(parents=True, exist_ok=True)


def capture(browser, label: str, base_url: str, viewport: dict[str, int]) -> dict:
    page = browser.new_page(viewport=viewport, device_scale_factor=1)
    errors: list[str] = []
    page.on("pageerror", lambda error: errors.append(str(error)))
    page.goto(f"{base_url}/en", wait_until="domcontentloaded")
    page.wait_for_timeout(3500)
    page.screenshot(path=str(OUTPUT / f"{label}-top.png"))

    for name, selector in (
        ("mission", ".section_mission"),
        ("proof", ".section_empower"),
        ("products", ".roosa-products"),
    ):
        section = page.locator(selector)
        section.scroll_into_view_if_needed()
        page.wait_for_timeout(700)
        page.screenshot(path=str(OUTPUT / f"{label}-{name}.png"))

    result = page.evaluate(
        """() => ({
          width: innerWidth,
          height: innerHeight,
          scrollHeight: document.documentElement.scrollHeight,
          overflowX: document.documentElement.scrollWidth > innerWidth,
          placeholders: (document.body.innerText.match(/[[]([A-Z][A-Z0-9_]+)[]]/g) || []),
          sections: [...document.querySelectorAll('main > section, main > header')].map((node) => ({
            className: node.className,
            height: Math.round(node.getBoundingClientRect().height)
          }))
        })"""
    )
    result["errors"] = errors
    page.close()
    return result


def check_route(browser, label: str, path: str, viewport: dict[str, int]) -> dict:
    page = browser.new_page(viewport=viewport, device_scale_factor=1)
    errors: list[str] = []
    page.on("pageerror", lambda error: errors.append(str(error)))
    page.goto(f"http://127.0.0.1:3013{path}", wait_until="domcontentloaded")
    page.wait_for_timeout(2500)
    page.screenshot(path=str(OUTPUT / f"{label}.png"))
    result = page.evaluate("""() => ({
      overflowX: document.documentElement.scrollWidth > innerWidth,
      placeholders: (document.body.innerText.match(/[[]([A-Z][A-Z0-9_]+)[]]/g) || []),
      heading: document.querySelector('h1')?.textContent?.trim()
    })""")
    result["errors"] = errors
    page.close()
    return result


with sync_playwright() as playwright:
    browser = playwright.chromium.launch(headless=True)
    results = {
        "v2_desktop": capture(browser, "v2-desktop", "http://127.0.0.1:3012", {"width": 1440, "height": 900}),
        "v3_desktop": capture(browser, "v3-desktop", "http://127.0.0.1:3013", {"width": 1440, "height": 900}),
        "v2_mobile": capture(browser, "v2-mobile", "http://127.0.0.1:3012", {"width": 390, "height": 844}),
        "v3_mobile": capture(browser, "v3-mobile", "http://127.0.0.1:3013", {"width": 390, "height": 844}),
        "v3_shop": check_route(browser, "v3-shop", "/en/shop", {"width": 1440, "height": 900}),
        "v3_product": check_route(browser, "v3-product", "/en/product/pink-toilet-paper", {"width": 390, "height": 844}),
    }
    print(results)
    browser.close()
