from urllib.parse import urljoin, urlparse
from urllib.request import urlopen

from playwright.sync_api import sync_playwright


BASE = "http://localhost:3003"
ROUTES = ["/", "/en/shop", "/en/product/pink-toilet-paper", "/en/cart", "/en/impact", "/en/about"]


with sync_playwright() as playwright:
    browser = playwright.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 1440, "height": 1000})
    browser_errors = []
    page.on("pageerror", lambda error: browser_errors.append(str(error)))

    # Every internal link on the primary routes must resolve successfully.
    internal_paths = set()
    for route in ROUTES:
        page.goto(f"{BASE}{route}", wait_until="networkidle")
        for href in page.locator("a[href]").evaluate_all("links => links.map(link => link.getAttribute('href'))"):
            if not href or href.startswith(("#", "mailto:", "tel:", "javascript:")):
                continue
            absolute = urljoin(BASE, href)
            if urlparse(absolute).netloc == urlparse(BASE).netloc:
                internal_paths.add(urlparse(absolute).path)
    for path in sorted(internal_paths):
        with urlopen(f"{BASE}{path}") as response:
            assert response.status < 400, f"broken internal link: {path} ({response.status})"

    # Homepage navigation and product actions use real routes.
    page.goto(BASE, wait_until="networkidle")
    page.locator('.navbar_menu-links a[href="/en/shop"]').click()
    page.wait_for_url(f"{BASE}/en/shop")
    page.goto(BASE, wait_until="networkidle")
    page.locator('.roosa-product-action[href="/en/product/pink-toilet-paper"]').click()
    page.wait_for_url(f"{BASE}/en/product/pink-toilet-paper")

    # Footer subscription has local validation and a visible success state.
    page.goto(BASE, wait_until="networkidle")
    page.locator('.footer_form input[type="email"]').fill("preview@example.com")
    page.locator('.footer_form input[type="submit"]').click()
    assert page.locator(".footer_form-block .w-form-done").is_visible()

    # Commerce: add, drawer, count, close, persistence and quantity behavior.
    page.goto(f"{BASE}/en/shop", wait_until="networkidle")
    page.evaluate("localStorage.removeItem('roosa-v2-demo-cart')")
    page.reload(wait_until="networkidle")
    page.locator("button.product-card-action").evaluate_all("buttons => buttons[0].click()")
    assert page.locator("[data-cart-drawer]").evaluate("element => element.classList.contains('w--open')")
    assert page.locator("[data-cart-count]").evaluate("element => element.textContent") == "1"
    page.locator("[data-cart-close]").click()
    assert not page.locator("[data-cart-drawer]").evaluate("element => element.classList.contains('w--open')")

    page.goto(f"{BASE}/en/product/pink-toilet-paper", wait_until="networkidle")
    page.locator("[data-qty-plus]").click()
    assert page.locator("[data-product-quantity]").evaluate("element => element.value") == "2"
    assert page.locator("[data-qty-minus]").is_enabled()
    page.locator("[data-qty-minus]").click()
    assert page.locator("[data-product-quantity]").evaluate("element => element.value") == "1"
    assert not page.locator("[data-qty-minus]").is_enabled()
    original_src = page.locator("[data-main-image]").get_attribute("src")
    gallery_buttons = page.locator("[data-gallery]")
    assert gallery_buttons.count() >= 2
    gallery_buttons.nth(1).click()
    assert page.locator("[data-main-image]").get_attribute("src") != original_src

    page.set_viewport_size({"width": 390, "height": 844})
    page.goto(BASE, wait_until="networkidle")
    assert page.evaluate("document.documentElement.scrollWidth") == page.evaluate("document.documentElement.clientWidth")
    menu_button = page.locator(".navbar_menu-button")
    assert menu_button.count() == 1
    menu_button.click()
    page.wait_for_function("document.querySelector('.navbar_menu-button')?.getAttribute('aria-expanded') === 'true'")
    assert menu_button.get_attribute("aria-expanded") == "true"
    assert page.locator(".navbar_menu").is_visible()

    assert not browser_errors, browser_errors
    browser.close()
    print(f"Passed: {len(internal_paths)} internal links and all primary interaction flows.")
