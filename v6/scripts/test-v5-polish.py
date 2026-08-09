from playwright.sync_api import sync_playwright


BASE = "http://localhost:3005"


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
    add_button = page.locator("button.product-card-action").first
    add_button.click()
    assert page.locator("[data-cart-drawer]").evaluate(
        "element => getComputedStyle(element).visibility"
    ) == "visible"
    assert page.locator("[data-cart-count]").first.text_content() == "1"
    assert page.locator("[data-cart-close]").evaluate(
        "button => document.activeElement === button"
    )
    page.keyboard.press("Shift+Tab")
    assert page.evaluate("document.activeElement?.closest('[data-cart-drawer]') !== null")
    page.keyboard.press("Escape")
    page.locator("[data-cart-drawer]").wait_for(state="hidden")
    assert page.locator("[data-cart-drawer]").evaluate(
        "element => getComputedStyle(element).visibility"
    ) == "hidden"
    assert add_button.evaluate("button => document.activeElement === button")
    page.locator("[data-cart-open]").click()
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

    # The homepage newsletter is an explicit non-transmitting demo, including
    # when submitted with Enter from the email field.
    page.set_viewport_size({"width": 1440, "height": 900})
    page.goto(f"{BASE}/en", wait_until="networkidle")
    email = page.locator("#Email")
    email.scroll_into_view_if_needed()
    email.fill("qa@example.test")
    email.press("Enter")
    page.wait_for_selector(".w-form-done", state="visible")
    assert "not sent or stored" in page.locator(".w-form-done").inner_text().lower()
    assert page.url == f"{BASE}/en"

    assert not errors, errors
    browser.close()
    print("Passed: polished drawer, demo checkout, mobile menu focus, and lazy images.")
