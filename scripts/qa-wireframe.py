from pathlib import Path
from playwright.sync_api import sync_playwright


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "docs" / "design-references" / "wireframe"
OUTPUT.mkdir(parents=True, exist_ok=True)


def inspect(page, name: str, width: int, height: int) -> None:
    page.set_viewport_size({"width": width, "height": height})
    page.goto("http://127.0.0.1:3000/wireframe", wait_until="networkidle")
    page.evaluate(
        """async () => {
          for (let y = 0; y < document.documentElement.scrollHeight; y += window.innerHeight) {
            window.scrollTo(0, y);
            await new Promise((resolve) => setTimeout(resolve, 35));
          }
          window.scrollTo(0, 0);
        }"""
    )
    page.wait_for_timeout(250)
    page.screenshot(path=str(OUTPUT / f"{name}.png"), full_page=True)
    metrics = page.evaluate(
        """() => ({
          title: document.querySelector('h1')?.textContent?.trim(),
          sections: document.querySelectorAll('main > section').length,
          width: document.documentElement.scrollWidth,
          viewport: document.documentElement.clientWidth,
          height: document.documentElement.scrollHeight,
          brokenImages: [...document.images].filter((image) => !image.complete || image.naturalWidth === 0).map((image) => image.currentSrc || image.src)
        })"""
    )
    print(name, metrics)


with sync_playwright() as playwright:
    browser = playwright.chromium.launch(headless=True)
    page = browser.new_page()
    errors = []
    page.on("console", lambda message: errors.append(message.text) if message.type == "error" else None)
    page.on("pageerror", lambda error: errors.append(str(error)))
    inspect(page, "desktop-1440", 1440, 1000)
    inspect(page, "mobile-390", 390, 844)
    print("browser_errors", errors)
    browser.close()
