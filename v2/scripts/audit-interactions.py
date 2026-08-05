from playwright.sync_api import sync_playwright


ROUTES = ["/", "/en/shop", "/en/product/roosa-pink", "/en/cart", "/en/impact", "/en/about"]


with sync_playwright() as playwright:
    browser = playwright.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 1440, "height": 1000})
    for route in ROUTES:
        page.goto(f"http://127.0.0.1:3001{route}", wait_until="networkidle")
        controls = page.locator("a, button, input[type=submit]").evaluate_all(
            """elements => elements.map((element, index) => ({
              index,
              tag: element.tagName,
              text: (element.textContent || element.value || element.getAttribute('aria-label') || '').trim().replace(/\\s+/g, ' ').slice(0, 100),
              href: element.getAttribute('href'),
              disabled: Boolean(element.disabled || element.getAttribute('aria-disabled') === 'true'),
              visible: Boolean(element.offsetWidth || element.offsetHeight || element.getClientRects().length),
              className: String(element.className || '')
            })).filter(control => control.visible)"""
        )
        suspicious = [
            control for control in controls
            if (control["tag"] == "A" and control["href"] in (None, "", "#"))
            or (control["tag"] in ("BUTTON", "INPUT") and control["disabled"])
        ]
        print(f"\n{route} — {len(controls)} visible controls, {len(suspicious)} suspicious")
        for control in suspicious:
            print(control)
    browser.close()
