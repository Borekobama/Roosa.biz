import json
import os
from pathlib import Path
from urllib.parse import urljoin, urlparse

from playwright.sync_api import sync_playwright


ROOT = Path(__file__).resolve().parents[1]
BASE_URL = os.environ.get("QA_BASE_URL", "http://127.0.0.1:3005").rstrip("/")
OUTPUT = Path(os.environ.get("QA_OUTPUT", "/tmp/roosa-v6-release"))
AXE_PATH = ROOT / "node_modules" / "axe-core" / "axe.min.js"

ROUTES = {
    "home": "/en",
    "shop": "/en/shop",
    "product": "/en/product/pink-toilet-paper",
    "cart": "/en/cart",
    "impact": "/en/impact",
    "project": "/en/impact/projects/featured-project",
    "about": "/en/about",
    "b2b": "/en/b2b",
    "journal": "/en/journal",
    "article": "/en/journal/der-kleine-kaempfer",
    "careers": "/en/careers",
    "role": "/en/careers/telefonverkaeufer",
    "support": "/en/support",
    "contact": "/en/contact",
    "privacy": "/en/privacy",
    "not-found": "/en/this-page-does-not-exist",
}

VIEWPORTS = {
    "desktop": {"width": 1440, "height": 900},
    "tablet": {"width": 834, "height": 1112},
    "mobile": {"width": 390, "height": 844},
    "narrow": {"width": 320, "height": 740},
}

SCREENSHOT_ROUTES = {"home", "shop", "product", "impact", "about", "journal", "contact"}


def inspect_page(page):
    return page.evaluate(
        r"""() => {
          const visible = (node) => {
            const style = getComputedStyle(node);
            const box = node.getBoundingClientRect();
            return style.display !== 'none' && style.visibility !== 'hidden' &&
              Number(style.opacity) > 0 && box.width > 0 && box.height > 0;
          };
          const controls = [...document.querySelectorAll('input, select, textarea')];
          const unlabeledControls = controls.filter((control) => {
            if (['hidden', 'submit', 'button', 'reset', 'image'].includes(control.type)) return false;
            if (control.getAttribute('aria-label') || control.getAttribute('aria-labelledby')) return false;
            return !control.labels || control.labels.length === 0;
          });
          return {
            title: document.title,
            description: document.querySelector('meta[name="description"]')?.content ?? null,
            canonical: document.querySelector('link[rel="canonical"]')?.href ?? null,
            robots: document.querySelector('meta[name="robots"]')?.content ?? null,
            languages: [...document.querySelectorAll('link[rel="alternate"][hreflang]')]
              .map((node) => node.getAttribute('hreflang')),
            lang: document.documentElement.lang,
            headings: [...document.querySelectorAll('h1')]
              .filter(visible)
              .map((node) => node.textContent?.trim().replace(/\s+/g, ' ')),
            overflowX: document.documentElement.scrollWidth > window.innerWidth + 2,
            documentWidth: document.documentElement.scrollWidth,
            viewportWidth: window.innerWidth,
            emptyLinks: [...document.querySelectorAll('a')]
              .filter((node) => !node.getAttribute('href') || node.getAttribute('href') === '#')
              .length,
            missingAlt: [...document.images]
              .filter((image) => !image.hasAttribute('alt'))
              .map((image) => image.currentSrc || image.src),
            brokenImages: [...document.images]
              .filter((image) => image.complete && image.naturalWidth === 0)
              .map((image) => image.currentSrc || image.src),
            unlabeledControls: unlabeledControls.map((control) =>
              `${control.tagName.toLowerCase()}#${control.id || '(no-id)'}`
            ),
          };
        }"""
    )


def scroll_through(page, viewport_height):
    height = page.evaluate("document.documentElement.scrollHeight")
    for position in range(0, height + viewport_height, max(500, viewport_height - 120)):
        page.evaluate("y => window.scrollTo(0, y)", position)
        page.wait_for_timeout(40)
    page.wait_for_timeout(250)


def check_internal_links(request, hrefs):
    failures = []
    for href in sorted(hrefs):
        parsed = urlparse(href)
        if parsed.scheme and parsed.netloc and parsed.netloc != urlparse(BASE_URL).netloc:
            continue
        path = parsed.path
        if not path or path.startswith(("/_next/", "/media/", "/v6-")):
            continue
        response = request.get(urljoin(f"{BASE_URL}/", path.lstrip("/")))
        if response.status >= 400:
            failures.append({"href": href, "status": response.status})
    return failures


def check_sequence(browser):
    results = []
    for name, viewport, last_frame in (
        ("desktop", {"width": 1440, "height": 900}, 140),
        ("mobile", {"width": 390, "height": 844}, 94),
    ):
        page = browser.new_page(viewport=viewport)
        errors = []
        failed_requests = []
        page.on("console", lambda message: errors.append(message.text) if message.type == "error" else None)
        page.on("pageerror", lambda error: errors.append(str(error)))
        page.on(
            "requestfailed",
            lambda failed: failed_requests.append(failed.url) if "_rsc=" not in failed.url else None,
        )
        page.goto(f"{BASE_URL}/en", wait_until="networkidle")
        section = page.locator("#team")
        stage = page.locator("[data-v6-team-sequence]")
        section.scroll_into_view_if_needed()
        page.wait_for_function(
            "document.querySelector('[data-v6-team-sequence]')?.dataset.ready === 'true'"
        )

        frames = []
        for progress in (0, 0.5, 1):
            section.evaluate(
                """(element, nextProgress) => {
                  const box = element.getBoundingClientRect();
                  const travel = Math.max(1, box.height + window.innerHeight * 0.6);
                  const targetTop = window.innerHeight * 0.8 - travel * nextProgress;
                  window.scrollTo({top: box.top + window.scrollY - targetTop, behavior: 'instant'});
                }""",
                progress,
            )
            page.wait_for_timeout(450)
            frames.append(int(stage.get_attribute("data-frame") or "0"))

        opacity = stage.locator("canvas").evaluate("canvas => getComputedStyle(canvas).opacity")
        results.append(
            {
                "name": name,
                "frames": frames,
                "lastFrame": last_frame,
                "canvasOpacity": opacity,
                "errors": errors,
                "failedRequests": failed_requests,
            }
        )
        page.close()

    context = browser.new_context(
        viewport={"width": 1440, "height": 900},
        reduced_motion="reduce",
    )
    page = context.new_page()
    page.goto(f"{BASE_URL}/en", wait_until="networkidle")
    page.locator("#team").scroll_into_view_if_needed()
    reduced = page.locator("[data-v6-team-sequence]").evaluate(
        """stage => ({
          static: stage.dataset.static,
          canvasDisplay: getComputedStyle(stage.querySelector('canvas')).display,
          fallbackOpacity: getComputedStyle(stage.querySelector('picture')).opacity
        })"""
    )
    page.close()
    context.close()
    return {"animated": results, "reducedMotion": reduced}


def main():
    if not AXE_PATH.exists():
        raise RuntimeError(f"axe-core is unavailable at {AXE_PATH}")

    OUTPUT.mkdir(parents=True, exist_ok=True)
    report = {"baseUrl": BASE_URL, "viewports": {}, "linkFailures": [], "api": {}}
    discovered_links = set()

    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(headless=True)
        request = playwright.request.new_context(base_url=BASE_URL)
        try:
            for viewport_name, viewport in VIEWPORTS.items():
                viewport_report = {}
                for route_name, route in ROUTES.items():
                    page = browser.new_page(viewport=viewport)
                    console_errors = []
                    page_errors = []
                    failed_requests = []
                    page.on(
                        "console",
                        lambda message: console_errors.append(message.text)
                        if message.type == "error"
                        else None,
                    )
                    page.on("pageerror", lambda error: page_errors.append(str(error)))
                    page.on(
                        "requestfailed",
                        lambda failed: failed_requests.append(failed.url)
                        if "_rsc=" not in failed.url
                        else None,
                    )

                    response = page.goto(f"{BASE_URL}{route}", wait_until="networkidle")
                    scroll_through(page, viewport["height"])
                    data = inspect_page(page)
                    page.add_script_tag(path=str(AXE_PATH))
                    data["axe"] = page.evaluate(
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
                    data["status"] = response.status if response else None
                    data["consoleErrors"] = console_errors
                    if route_name == "not-found":
                        data["consoleErrors"] = [
                            error for error in data["consoleErrors"]
                            if "404 (Not Found)" not in error
                        ]
                    data["pageErrors"] = page_errors
                    data["failedRequests"] = failed_requests
                    viewport_report[route_name] = data

                    if viewport_name == "desktop":
                        discovered_links.update(
                            page.locator('a[href^="/"]').evaluate_all(
                                "nodes => nodes.map((node) => node.getAttribute('href'))"
                            )
                        )
                    if viewport_name in {"desktop", "mobile"} and route_name in SCREENSHOT_ROUTES:
                        page.screenshot(
                            path=str(OUTPUT / f"{viewport_name}-{route_name}.png"),
                            full_page=True,
                        )
                    page.close()
                report["viewports"][viewport_name] = viewport_report

            report["linkFailures"] = check_internal_links(request, discovered_links)
            empty_checkout = request.post("/api/demo/checkout", data={"items": []})
            valid_checkout = request.post(
                "/api/demo/checkout",
                data={
                    "items": [
                        {"id": "pink-pack", "name": "ROOSA Pink", "quantity": 2, "unitPrice": 12.5}
                    ]
                },
            )
            report["api"] = {
                "emptyCheckout": empty_checkout.status,
                "validCheckout": valid_checkout.status,
                "validPayload": valid_checkout.json(),
            }
            public_response = request.get("/en/impact")
            internal_response = request.get("/v5-home/index.html")
            report["headers"] = {
                "nosniff": public_response.headers.get("x-content-type-options"),
                "referrerPolicy": public_response.headers.get("referrer-policy"),
                "internalRobots": internal_response.headers.get("x-robots-tag"),
            }
            report["sequence"] = check_sequence(browser)
        finally:
            request.dispose()
            browser.close()

    report_path = OUTPUT / "report.json"
    report_path.write_text(json.dumps(report, indent=2), encoding="utf-8")

    failures = []
    for viewport_name, routes in report["viewports"].items():
        for route_name, data in routes.items():
            label = f"{viewport_name}/{route_name}"
            if data["status"] >= 400 and route_name != "not-found":
                failures.append(f"{label}: HTTP {data['status']}")
            if data["status"] != 404 and route_name == "not-found":
                failures.append(f"{label}: expected HTTP 404, got {data['status']}")
            for key in (
                "overflowX",
                "emptyLinks",
                "missingAlt",
                "brokenImages",
                "unlabeledControls",
                "axe",
                "consoleErrors",
                "pageErrors",
                "failedRequests",
            ):
                if data[key]:
                    failures.append(f"{label}: {key}={data[key]}")
            if len(data["headings"]) != 1:
                failures.append(f"{label}: expected one visible h1, got {data['headings']}")
            if not data["title"] or not data["description"]:
                failures.append(f"{label}: title or description metadata is missing")
            if route_name not in {"cart", "not-found"}:
                canonical_path = urlparse(data["canonical"] or "").path
                expected_path = ROUTES[route_name]
                if canonical_path != expected_path:
                    failures.append(f"{label}: canonical {canonical_path!r}, expected {expected_path!r}")
                if sorted(data["languages"]) != ["de", "en", "fr", "x-default"]:
                    failures.append(f"{label}: language alternates={data['languages']}")
            if route_name == "cart" and "noindex" not in (data["robots"] or ""):
                failures.append(f"{label}: cart route must be noindex")
    if report["linkFailures"]:
        failures.append(f"broken internal links: {report['linkFailures']}")
    if report["api"]["emptyCheckout"] != 400 or report["api"]["validCheckout"] != 200:
        failures.append(f"checkout API statuses: {report['api']}")
    if report["headers"] != {
        "nosniff": "nosniff",
        "referrerPolicy": "strict-origin-when-cross-origin",
        "internalRobots": "noindex, nofollow",
    }:
        failures.append(f"security/indexing headers: {report['headers']}")
    for result in report["sequence"]["animated"]:
        start, middle, end = result["frames"]
        last_frame = result["lastFrame"]
        if not (
            start <= 12
            and last_frame * 0.42 < middle < last_frame * 0.58
            and end >= last_frame - 5
            and result["canvasOpacity"] == "1"
            and not result["errors"]
            and not result["failedRequests"]
        ):
            failures.append(f"sequence {result['name']}: {result}")
    if report["sequence"]["reducedMotion"] != {
        "static": "true",
        "canvasDisplay": "none",
        "fallbackOpacity": "1",
    }:
        failures.append(f"sequence reduced motion: {report['sequence']['reducedMotion']}")

    print(report_path)
    if failures:
        print(json.dumps(failures, indent=2))
        raise SystemExit(1)
    print("Passed: V6 release routes, assets, metadata basics, accessibility, links and demo API.")


if __name__ == "__main__":
    main()
