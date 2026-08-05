from playwright.sync_api import sync_playwright
url="http://localhost:4599/v3-home/index.html"
with sync_playwright() as p:
    for name in ("chromium","webkit","firefox"):
        try:
            b=getattr(p,name).launch(headless=True)
        except Exception as e:
            print(name,"UNAVAILABLE",str(e)[:80]); continue
        pg=b.new_page(viewport={"width":1440,"height":900},device_scale_factor=1)
        failed=[]
        pg.on("response", lambda r: failed.append((r.status,r.url)) if r.status>=400 else None)
        pg.goto(url,wait_until="domcontentloaded")
        pg.wait_for_timeout(2500)
        pg.locator(".section_empower").scroll_into_view_if_needed()
        pg.wait_for_timeout(1200)
        pg.screenshot(path=f"xb-{name}.png")
        info=pg.evaluate("""()=>{const t=document.querySelector('.w--tab-active .empower_card-texture');const cs=getComputedStyle(t);const r=t.getBoundingClientRect();return {blend:cs.mixBlendMode,opacity:cs.opacity,display:cs.display,w:Math.round(r.width),h:Math.round(r.height),complete:t.complete,natural:t.naturalWidth,src:t.currentSrc.split('/').pop()};}""")
        print(name, info, "4xx:", [f for f in failed if 'webp' in f[1] or 'media' in f[1]][:3])
        b.close()
