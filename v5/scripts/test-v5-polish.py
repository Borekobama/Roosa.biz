from playwright.sync_api import sync_playwright


BASE = "http://localhost:3004"


with sync_playwright() as playwright:
    browser = playwright.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 390, "height": 844})
    errors = []
    page.on("pageerror", lambda error: errors.append(str(error)))

    # The generated commerce drawer is unavailable to focus until opened.
    page.goto(f"{BASE}/en/shop", wait_until="networkidle")
    assert page.locator("[data-cart-drawer]").evaluate(
        "element => getComputedStyle(element).visibility"
    ) == "hidden"
    page.evaluate("localStorage.removeItem('roosa-v2-demo-cart')")
    page.reload(wait_until="networkidle")
    page.locator("button.product-card-action").first.click()
    assert page.locator("[data-cart-drawer]").evaluate(
        "element => getComputedStyle(element).visibility"
    ) == "visible"
    assert page.locator("[data-cart-count]").first.text_content() == "1"
    page.locator("[data-demo-checkout]").last.click()
    page.wait_for_selector("[data-checkout-status]:not(:empty)")
    checkout_status = page.locator("[data-checkout-status]").last.text_content() or ""
    assert "no payment collected" in checkout_status.lower()

    # The React mobile menu takes focus, traps it, and restores it on close.
    page.goto(f"{BASE}/en/impact", wait_until="networkidle")
    menu_button = page.locator(".roosa-global-header__menu")
    menu_button.click()
    page.wait_for_selector(".mobile-menu", state="visible")
    assert page.evaluate("document.activeElement?.closest('.mobile-menu') !== null")
    page.keyboard.press("Escape")
    assert not page.locator(".mobile-menu").is_visible()
    assert menu_button.evaluate("button => document.activeElement === button")
    assert page.locator("body").get_attribute("data-scroll-lock") == "false"

    # All lazy editorial images resolve as a user moves down the page.
    height = page.evaluate("document.documentElement.scrollHeight")
    for y in range(0, height + 844, 650):
        page.evaluate("position => window.scrollTo(0, position)", y)
        page.wait_for_timeout(80)
    page.wait_for_timeout(1000)
    assert page.locator("img").evaluate_all(
        "images => images.every(image => image.complete && image.naturalWidth > 0)"
    )

    assert not errors, errors
    browser.close()
    print("Passed: polished drawer, demo checkout, mobile menu focus, and lazy images.")
