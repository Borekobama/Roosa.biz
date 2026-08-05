import { cpSync, existsSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const publicDir = join(process.cwd(), "public");
const routeGroups = ["home", "shop", "product", "cart"];

/*
 * V5 refines the V4 static routes. It never edits the V4 output — it copies
 * public/v4-* into public/v5-*, then layers composition, proportion and motion
 * corrections on top. Re-running the script always rebuilds from V4.
 */

/* Square packshots and transparent cut-outs. Cover-cropping these into the
 * portrait product frame slices the pack artwork off at both edges, so inside
 * product media they are framed with contain over a tinted backdrop instead.
 * Editorial photography (4:5 and 3:2) keeps the cover crop. */
const containImages = new Set([
  "/media/products/pink-pack.jpg",
  "/media/products/white-pack.jpg",
  "/media/products/embossed-roll.webp",
  "/media/v4/pink-roll-cutout.png",
  "/media/v4/white-roll-cutout.png",
]);

/* Only <img> tags sitting inside a product frame are re-fitted — the same
 * files are also used as full-bleed textures elsewhere on the page. */
const productImagePattern =
  /(<a class="roosa-product-media"[^>]*>|<img class="is-alt" |<img [^>]*class="product-grid-image|<img [^>]*class="product-image")/;

function markContainImages(html) {
  return html.replace(/<img\b[^>]*>/g, (tag, offset, source) => {
    const src = /\ssrc="([^"]+)"/.exec(tag);
    if (!src || !containImages.has(src[1])) return tag;
    const context = source.slice(Math.max(0, offset - 220), offset + tag.length);
    if (!productImagePattern.test(context)) return tag;
    return tag.replace("<img", "<img data-v5-contain");
  });
}

const v5Css = `
/* ===================== ROOSA V5 · composition & motion ===================== */
:root{
  --v5-ease:cubic-bezier(.22,1,.36,1);
  --v5-ease-out:cubic-bezier(.16,1,.3,1);
  --v5-radius:clamp(.65rem,1.1vw,1.15rem);
}

/* --- Motion primitives ---------------------------------------------------
 * The intro reveals are pure CSS animations so the page never depends on JS
 * to become readable. Scroll reveals are opt-in: the motion script adds
 * .v5-js to <html> before observing, so a script failure leaves everything
 * visible rather than stuck at opacity 0. */
@keyframes v5LineIn{from{transform:translateY(105%);opacity:0}to{transform:translateY(0);opacity:1}}
@keyframes v5RiseIn{from{transform:translateY(16px);opacity:0}to{transform:none;opacity:1}}
.v5-line{display:block;overflow:hidden;padding-bottom:.08em;margin-bottom:-.08em}
.v5-line__inner{display:block;animation:v5LineIn .92s var(--v5-ease) var(--v5-delay,0ms) both}
.v5-rise{animation:v5RiseIn .8s var(--v5-ease) var(--v5-delay,0ms) both}
html.v5-js .v5-reveal{opacity:0;transform:translateY(18px)}
html.v5-js .v5-reveal.is-inview{opacity:1;transform:none;transition:opacity .62s var(--v5-ease) var(--v5-delay,0ms),transform .7s var(--v5-ease) var(--v5-delay,0ms)}

/* --- 0 · Palette ----------------------------------------------------------
 * The two halves of the site disagreed about the "impact" colour: the static
 * routes set --roosa-impact to a forest green (#204f45, template residue from
 * the source themes) while the React routes set --color-impact to plum
 * (#6f294e). V5 unifies on the plum — a darkened cousin of ROOSA pink, so the
 * dark bands stay in the warm pink/graphite/paper family. */
:root{--roosa-impact:#6f294e!important;--green:#6f294e!important}

/* --- 1 · Hero -------------------------------------------------------------
 * V4 split the hero into a 2-column grid, which stranded the lead paragraph
 * and buttons in a narrow right-hand column (and collapsed to ~10ch on
 * tablet). V5 uses one left-aligned editorial column and a paper scrim so the
 * graphite copy stays legible over the photograph. */
.section_hero{position:relative;isolation:isolate}
.hero_content{min-height:min(90svh,880px)!important;display:flex!important;align-items:flex-end!important}
.hero_content>.padding-global{width:100%;display:flex;align-items:flex-end;padding-bottom:clamp(2.5rem,7vh,5rem)}
.hero_content ._2col_grid{display:block!important;width:100%;max-width:min(100%,54rem)}
/* The template pins white-space:nowrap on the headline, which clipped the
 * second line inside the reveal mask instead of wrapping it. */
.hero-title{max-width:none!important;white-space:normal!important;text-wrap:pretty;font-size:clamp(3.4rem,5.6vw,5.4rem)!important;line-height:.94!important;letter-spacing:-.05em!important}
.roosa-hero-copy{max-width:32rem;margin-top:clamp(1.15rem,2.2vw,1.7rem)}
.roosa-hero-copy p{max-width:31ch;color:var(--roosa-graphite)!important;font-size:clamp(1.02rem,1.2vw,1.2rem)!important;line-height:1.5!important}
.roosa-hero-actions{flex-direction:row!important;flex-wrap:wrap!important;align-items:center!important;margin-top:clamp(1.4rem,2.6vw,2rem)!important;gap:.7rem!important}
.roosa-hero-actions a{flex:0 0 auto!important;width:auto!important;min-height:48px;display:inline-flex;align-items:center;justify-content:center;padding:.8rem 1.6rem!important;transition:transform .25s var(--v5-ease),background-color .25s,color .25s}
.roosa-hero-actions a:hover{transform:translateY(-2px)}
.hero_visuals:after{background:linear-gradient(96deg,rgba(255,250,244,.95) 0%,rgba(255,250,244,.82) 20%,rgba(255,250,244,.45) 38%,rgba(255,250,244,.09) 55%,rgba(255,250,244,0) 69%),linear-gradient(0deg,rgba(255,250,244,.58) 0%,rgba(255,250,244,.1) 24%,rgba(255,250,244,0) 42%)!important}
.hero_img.roosa-hero-pack{object-position:64% 46%!important;transform:scale(calc(1.03 + var(--roosa-hero-progress,0)*.055)) translate3d(0,calc(var(--roosa-hero-progress,0)*-2.4%),0)!important}

/* --- 2 · Mission ---------------------------------------------------------
 * The "Why ROOSA" tagline was an inline span wedged into the first line of
 * the heading. It now sits on its own line as a proper eyebrow. */
.section_mission .mission_component h2{max-width:25ch;font-size:clamp(1.9rem,3.9vw,3.45rem)!important;line-height:1.08!important;letter-spacing:-.035em!important}
.section_mission .mission_component h2 .text-style-tagline{display:block!important;margin:0 0 clamp(1rem,2.2vw,1.85rem)!important;color:var(--roosa-pink-dark);font-size:.72rem!important;font-weight:800!important;letter-spacing:.16em!important;line-height:1.2!important;text-transform:uppercase}

/* --- 3 · Team heading thumbnails ----------------------------------------
 * 104x52 letterbox crops rendered as unreadable slivers. Re-proportioned to a
 * consistent 3:2 chip that sits on the text baseline. */
.team_heading-span{width:clamp(3.6rem,5.6vw,5.8rem)!important;height:clamp(2.4rem,3.7vw,3.85rem)!important;padding:0!important;margin:0 .28em!important;border-radius:.7rem!important;vertical-align:-.3em!important;background-size:cover!important;background-position:50% 40%!important;box-shadow:0 .55rem 1.4rem rgba(36,31,34,.18)}
.section_team .heading-style-h2{max-width:23ch;margin-inline:auto;font-size:clamp(1.7rem,3.5vw,3rem)!important;line-height:1.22!important}

/* --- 4 · Product grid ----------------------------------------------------
 * One frame ratio for the whole row, plus a contain treatment for the square
 * packshots and cut-outs whose subjects were being cropped by cover. */
.roosa-products-heading h2{max-width:15ch}
.roosa-product-grid{gap:clamp(1rem,1.7vw,1.7rem)!important}
.roosa-product-media{aspect-ratio:4/5!important;background:color-mix(in srgb,var(--roosa-pink-light) 48%,var(--roosa-paper))!important}
.roosa-product-media img{object-position:50% 45%;transition:transform .75s var(--v5-ease-out),opacity .45s var(--v5-ease),clip-path .55s var(--v5-ease)}
.roosa-product-media img[data-v5-contain]{object-fit:contain!important;object-position:50% 50%!important;padding:clamp(.35rem,1.1vw,1rem)}
.roosa-product-card{transition:transform .4s var(--v5-ease)}
.roosa-product-card:hover{transform:translateY(-4px)}
.roosa-product-media:hover img:first-child{transform:scale(1.035)!important}
.roosa-product-copy>span{color:var(--roosa-pink-dark);font-size:.68rem;font-weight:800;letter-spacing:.13em;text-transform:uppercase}
.roosa-product-action{display:inline-flex;align-items:center;min-height:44px;white-space:nowrap}

/* --- 5 · Vision collage --------------------------------------------------
 * The image groups had a 595px min-content inside a 460px grid track, so the
 * outer columns bled off both viewport edges. Every frame is now fluid with a
 * fixed ratio, and the overlay headline gets a scrim it can be read against. */
.vision_image-list{width:min(100%,96rem)!important;margin-inline:auto!important;padding-inline:clamp(1rem,3vw,2.5rem)!important;gap:clamp(.7rem,1.4vw,1.25rem)!important;align-items:center!important}
.vision_image-group-left,.vision_image-group-right{width:100%!important;min-width:0!important;padding-inline:0!important;grid-template-columns:minmax(0,1.05fr) minmax(0,1fr)!important;gap:clamp(.6rem,1.2vw,1rem)!important;align-items:center!important}
.vision_small-image-group{width:100%!important;min-width:0!important;grid-template-columns:minmax(0,1fr)!important;gap:clamp(.6rem,1.2vw,1rem)!important}
.vision_image-wrapper:not(.is-image-large){width:100%!important;height:auto!important;aspect-ratio:4/5!important;border-radius:var(--v5-radius)}
.vision_image-wrapper.is-image-small{aspect-ratio:1/1!important}
.vision_image-wrapper:not(.is-image-large) img{width:100%!important;height:100%!important}
.vision_image-wrapper.is-image-large:after{content:"";position:absolute;inset:0;z-index:1;background:radial-gradient(115% 85% at 50% 52%,rgba(36,31,34,.58) 0%,rgba(36,31,34,.3) 52%,rgba(36,31,34,.06) 100%);pointer-events:none}
.vision_overlay-text{position:relative;z-index:5;max-width:min(88vw,20ch)!important;font-size:clamp(1.9rem,4.4vw,3.6rem)!important;line-height:1.06!important;letter-spacing:-.03em!important;text-shadow:0 .1em .55em rgba(36,31,34,.5),0 0 1.5em rgba(36,31,34,.32)}

/* --- 6 · Stats -----------------------------------------------------------
 * Consistent tile media ratios; the duplicated field-team photograph is
 * replaced upstream in the markup pass. */
.stats_image-wrapper{aspect-ratio:4/3;overflow:hidden;border-radius:var(--v5-radius)}
.stats_image-wrapper img{width:100%;height:100%;object-fit:cover;object-position:50% 38%}
.stats_item{border-radius:clamp(.8rem,1.3vw,1.4rem)}

/* --- 7 · Closing CTA -----------------------------------------------------
 * The draggable roll cut-outs scatter across the whole card, including behind
 * the headline. A soft paper halo keeps the copy readable without removing
 * the play, and the icons stay draggable (the halo is pointer-transparent). */
.cta_card-content{position:relative;z-index:4}
.cta_card-content:before{content:"";position:absolute;inset:-10% -8%;z-index:-1;background:radial-gradient(58% 54% at 50% 44%,rgba(255,250,244,.95) 0%,rgba(255,250,244,.8) 52%,rgba(255,250,244,0) 100%);pointer-events:none}
.v5-cta-heading{max-width:20ch;margin-inline:auto;font-size:clamp(1.9rem,3.6vw,3.3rem)!important;line-height:1.08!important}
.cta_background-wrapper .hand-icon{width:clamp(4.5rem,7vw,7.5rem)!important;height:auto!important}

/* --- 8 · Footer ----------------------------------------------------------
 * The wordmark, body copy, legal links and credit line all inherited graphite
 * from the light theme and rendered near-black on the dark footer gradient. */
.roosa-partner-bar figure{border-radius:var(--v5-radius);transition:transform .4s var(--v5-ease)}
.roosa-partner-bar figure:hover{transform:translateY(-3px)}
.footer_component .footer_logo-link .navbar_logo{color:var(--roosa-paper)!important}
.footer_component .footer_left-wrapper p,.footer_component .footer_right-wrapper .text-weight-semibold{color:rgba(255,250,244,.86)!important}
.footer_legal-list a,.footer_legal-link{color:rgba(255,250,244,.82)!important;text-decoration-color:rgba(255,250,244,.4)}
.footer_legal-list a:hover,.footer_legal-link:hover{color:var(--roosa-paper)!important}
.footer_credit-text{color:rgba(255,250,244,.66)!important}
.footer_form .form_input{color:var(--roosa-graphite)!important;background:var(--roosa-paper)!important}
.footer_component .text-size-tiny,.footer_component .text-size-tiny a{color:rgba(255,250,244,.7)!important}

/* --- 9 · Commerce routes (shop / product / cart) -------------------------
 * The spacing rules below are scoped to the [data-v5-commerce] body marker,
 * because .section / .fact / .page-heading are generic names that also appear
 * on the home page with different meanings. */
.product-grid-image,.product-image{object-fit:cover;object-position:50% 45%}
.product-grid-image[data-v5-contain],.product-image[data-v5-contain]{object-fit:contain!important;padding:clamp(.75rem,2vw,1.75rem);background:color-mix(in srgb,var(--roosa-pink-light,#ffd8e9) 55%,#fffaf4)}
.product-image-tab-thumbnail{object-fit:cover;aspect-ratio:1}

/* V4 ran a flat rhythm — 144px section padding, a 130px margin under the page
 * heading and 100px above the product description — regardless of how much
 * content each block held, so these short pages read as mostly empty space. */
[data-v5-commerce] .section{padding-block:clamp(3.25rem,6vw,5.5rem)!important}
[data-v5-commerce] .section.product-detail-section{padding-top:clamp(2.25rem,4.5vw,4rem)!important}
[data-v5-commerce] .page-heading{margin-bottom:clamp(2.25rem,4.5vw,4rem)!important}
[data-v5-commerce] .product-description{margin-top:clamp(1.4rem,3vw,2.4rem)!important}
[data-v5-commerce] .fact{padding-block:clamp(1.2rem,2.2vw,1.8rem)!important}
[data-v5-commerce] .fact span{margin-top:clamp(.85rem,1.9vw,1.5rem)!important}
[data-v5-commerce] .store-note{margin-top:clamp(1.5rem,3vw,2.5rem)!important}
/* Each shop card reserved a 550px box for ~460px of content and then added a
 * 76px margin, so the grid ended in a band of empty space. */
[data-v5-commerce] .product-column{height:auto!important;min-height:0!important;margin-bottom:clamp(1.5rem,3vw,2.75rem)!important}

/* The packshot already carries generous margins inside the JPEG, so the frame
 * padding only shrank it further. */
[data-v5-commerce] .product-main-frame .product-image[data-v5-contain]{padding:clamp(.2rem,.8vw,.7rem)!important}
[data-v5-commerce] .product-images-tabs{margin-top:clamp(.6rem,1.4vw,1rem)!important}
[data-v5-commerce] .product-image-tab{transition:opacity .25s var(--v5-ease),transform .25s var(--v5-ease)}
[data-v5-commerce] .product-image-tab:hover{opacity:.85;transform:translateY(-2px)}

/* The cart control is fixed, so it will always pass over content as the page
 * scrolls. Giving it a pill and a shadow makes that read as deliberate. */
.commerce-cart-fab{border-radius:999px!important;padding-inline:1.15rem!important;box-shadow:0 .7rem 1.8rem rgba(36,31,34,.3)!important;transition:transform .25s var(--v5-ease),box-shadow .25s var(--v5-ease)}
.commerce-cart-fab:hover{transform:translateY(-2px);box-shadow:0 .95rem 2.2rem rgba(36,31,34,.36)!important}

/* --- Breakpoints --------------------------------------------------------- */
@media(max-width:991px){
  .hero_content{min-height:min(88svh,820px)!important}
  .hero_content ._2col_grid{max-width:none}
  .hero-title{font-size:clamp(2.9rem,7.4vw,4.6rem)!important}
  .roosa-hero-copy{max-width:30rem}
  .hero_visuals:after{background:linear-gradient(0deg,rgba(255,250,244,.96) 0%,rgba(255,250,244,.86) 22%,rgba(255,250,244,.42) 43%,rgba(255,250,244,0) 64%),linear-gradient(100deg,rgba(255,250,244,.52) 0%,rgba(255,250,244,0) 58%)!important}
  .hero_img.roosa-hero-pack{object-position:60% 32%!important}
  .roosa-product-grid{grid-template-columns:repeat(2,minmax(0,1fr))!important}
  .vision_image-list{padding-inline:clamp(.75rem,2.5vw,1.5rem)!important}
}
@media(max-width:767px){
  /* Copy is anchored to the lower third over a cream scrim so the roll stays
   * unobstructed in the upper frame. */
  .hero_content{min-height:min(86svh,720px)!important}
  .hero_content>.padding-global{padding-bottom:clamp(1.75rem,4vh,2.5rem)}
  .hero-title{font-size:clamp(2.5rem,10.2vw,3.9rem)!important;line-height:.98!important}
  .roosa-hero-copy{max-width:30ch;margin-top:.85rem}
  .roosa-hero-copy p{font-size:1rem!important;line-height:1.45!important}
  .roosa-hero-actions{margin-top:1.2rem!important;gap:.5rem!important}
  .roosa-hero-actions a{min-height:46px;padding:.7rem 1.2rem!important;font-size:.92rem}
  .hero_visuals:after{background:linear-gradient(0deg,rgba(255,250,244,.98) 0%,rgba(255,250,244,.93) 26%,rgba(255,250,244,.6) 46%,rgba(255,250,244,.12) 66%,rgba(255,250,244,0) 80%)!important}
  .hero_img.roosa-hero-pack{object-position:57% 24%!important}
  .section_mission .mission_component h2{max-width:none}
  .team_heading-span{margin:0 .2em!important;vertical-align:-.34em!important}
  /* Lead card keeps a full frame; the remaining options read as a compact
   * list. V4 let the price and button collide inside those rows. */
  .roosa-product-grid{grid-template-columns:minmax(0,1fr)!important}
  .roosa-product-media{aspect-ratio:4/5!important}
  .roosa-product-card:not(:first-child){grid-template-columns:6.5rem minmax(0,1fr)!important;gap:.9rem!important;align-items:center}
  .roosa-product-card:not(:first-child) .roosa-product-media{aspect-ratio:1!important}
  .roosa-product-card:not(:first-child) .roosa-product-buy{flex-wrap:wrap;row-gap:.5rem}
  .roosa-product-card:not(:first-child) .roosa-product-buy strong{flex:1 1 auto;font-size:.95rem}
  .roosa-product-card:not(:first-child) .roosa-product-action{flex:0 0 auto;padding-inline:.9rem;font-size:.85rem}
  .vision_image-list{grid-template-columns:minmax(0,1fr)!important;justify-items:center!important;padding-inline:.75rem!important}
  .vision_image-group-left,.vision_image-group-right{display:none!important}
  .vision_overlay-text{max-width:min(84vw,15ch)!important}
  .stats_image-wrapper{aspect-ratio:16/10}
  /* Keep the fixed cart control clear of the last row of page content. */
  [data-v5-commerce] .section:last-of-type{padding-bottom:clamp(4.5rem,12vw,6rem)!important}
  [data-v5-commerce] .facts-strip{grid-template-columns:minmax(0,1fr) minmax(0,1fr)!important}
  [data-v5-commerce] .product-images-tabs{gap:.5rem!important}
}
@media(prefers-reduced-motion:reduce){
  .v5-line__inner,.v5-rise{animation:none!important}
  html.v5-js .v5-reveal,html.v5-js .v5-reveal.is-inview{opacity:1!important;transform:none!important;transition:none!important}
  .roosa-product-card:hover,.roosa-hero-actions a:hover,.roosa-partner-bar figure:hover{transform:none!important}
}
`;

const v5Motion = `
<script>
/* ROOSA V5 motion: a single scroll-reveal pass plus a scrolled-header flag.
 * Deliberately small — the signature GSAP pin still owns the vision section.
 *
 * Two rules keep content from ever being stranded at opacity 0:
 *   1. Only elements that start below the fold are hidden.
 *   2. A rAF-throttled scroll backstop reveals anything past the viewport
 *      bottom, in case an observer callback is missed during a fast scroll. */
(function(){
  var root = document.documentElement;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  if (!("IntersectionObserver" in window)) return;

  var groups = [
    [".roosa-product-card", 70],
    [".stats_item", 90],
    [".roosa-partner-bar figure", 90],
    [".vision_image-wrapper:not(.is-image-large)", 60],
    [".roosa-products-heading", 0],
    [".section_team .team_heading-wrapper", 0],
    [".section_stats .stats_content-left", 0],
    [".section_stats .stats_content-right", 0],
    [".v5-cta-heading", 0]
  ];

  var targets = [];
  groups.forEach(function(group){
    var nodes = document.querySelectorAll(group[0]);
    Array.prototype.forEach.call(nodes, function(node, index){
      if (node.getBoundingClientRect().top < window.innerHeight) return;
      node.classList.add("v5-reveal");
      node.style.setProperty("--v5-delay", Math.min(index * group[1], 320) + "ms");
      targets.push(node);
    });
  });
  if (!targets.length) return;

  root.classList.add("v5-js");

  var pending = targets.slice();
  function reveal(node){
    node.classList.add("is-inview");
    observer.unobserve(node);
    var at = pending.indexOf(node);
    if (at > -1) pending.splice(at, 1);
    if (!pending.length) window.removeEventListener("scroll", onRevealScroll);
  }

  var observer = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if (entry.isIntersecting) reveal(entry.target);
    });
  }, { rootMargin: "0px 0px -12% 0px", threshold: 0.08 });
  targets.forEach(function(node){ observer.observe(node); });

  var sweepQueued = false;
  function sweep(){
    sweepQueued = false;
    pending.slice().forEach(function(node){
      if (node.getBoundingClientRect().top < window.innerHeight) reveal(node);
    });
  }
  function onRevealScroll(){
    if (!sweepQueued) { sweepQueued = true; requestAnimationFrame(sweep); }
  }
  window.addEventListener("scroll", onRevealScroll, { passive: true });

  var header = document.querySelector(".navbar_component, .roosa-global-header");
  if (header) {
    var queued = false;
    var flag = function(){
      queued = false;
      header.dataset.v5Scrolled = String(window.scrollY > 24);
    };
    window.addEventListener("scroll", function(){
      if (!queued) { queued = true; requestAnimationFrame(flag); }
    }, { passive: true });
    flag();
  }
})();
</script>`;

/* The hero headline is rebuilt as masked lines so it can use a clip reveal
 * instead of V4's random per-character opacity flicker. */
const heroTitleFrom =
  '<h1 class="hero-title">Soft on skin.<br/><span class="roosa-title-line">Strong for</span> <span class="roosa-title-line">children.</span></h1>' +
  '<div><p class="text-size-medium text-weight-semibold">Pink toilet paper with a transparent path from purchase to documented impact.</p>' +
  '<div class="roosa-hero-actions"><a href="#products">Buy ROOSA</a><a href="#vision">See the impact</a></div></div>';

const heroTitleTo =
  '<h1 class="hero-title">' +
  '<span class="v5-line"><span class="v5-line__inner" style="--v5-delay:80ms">Soft on skin.</span></span>' +
  '<span class="v5-line"><span class="v5-line__inner" style="--v5-delay:190ms">Strong for children.</span></span>' +
  '</h1>' +
  '<div class="roosa-hero-copy v5-rise" style="--v5-delay:380ms"><p class="text-size-medium text-weight-semibold">Pink toilet paper with a transparent path from purchase to documented impact.</p>' +
  '<div class="roosa-hero-actions"><a href="#products">Buy ROOSA</a><a href="#vision">See the impact</a></div></div>';

/* V4's hero intro flickered every character in from opacity 0 over 1s and
 * faded the photograph in over 4s. Both are replaced by the CSS line reveal. */
const heroSplitFrom = `  // SPLIT TEXT ANIMATION WITH GSAP SPLITTEXT
const split = new SplitText(".hero-title", { type: "chars" });

  // Set initial opacity to 0 for all characters
gsap.set(split.chars, { opacity: 0 });

  // Animate characters in
gsap.to(split.chars, {
  opacity: 1,
  duration: 1,
  stagger: {
    each: 1 / split.chars.length,
    from: "random"
  },
  ease: "power2.out"
});`;

const heroSplitTo = `  // V5: the hero headline uses a CSS line-mask reveal instead of a
  // per-character opacity flicker, so it is legible without waiting on GSAP.`;

function replaceOnce(source, search, replacement, label) {
  if (!source.includes(search)) throw new Error(`V5 contract changed; missing: ${label}`);
  return source.replace(search, replacement);
}

function htmlFiles(directory) {
  const files = [];
  for (const entry of readdirSync(directory)) {
    const path = join(directory, entry);
    if (statSync(path).isDirectory()) files.push(...htmlFiles(path));
    else if (entry.endsWith(".html")) files.push(path);
  }
  return files;
}

for (const group of routeGroups) {
  const source = join(publicDir, `v4-${group}`);
  const target = join(publicDir, `v5-${group}`);
  if (!existsSync(source)) throw new Error(`Missing ${source}`);

  cpSync(source, target, { recursive: true, force: true });

  for (const file of htmlFiles(target)) {
    let html = readFileSync(file, "utf8");
    html = html
      .replaceAll("/v4-shop/", "/v5-shop/")
      .replaceAll("/v4-product/", "/v5-product/")
      .replaceAll("/v4-cart/", "/v5-cart/");

    html = markContainImages(html);

    if (group === "home" && file.endsWith("index.html")) {
      html = replaceOnce(html, heroTitleFrom, heroTitleTo, "hero headline block");
      html = replaceOnce(html, heroSplitFrom, heroSplitTo, "hero SplitText animation");
      html = replaceOnce(
        html,
        `    duration: 4,\n    ease: "power4.out"`,
        `    duration: 1.6,\n    ease: "power3.out"`,
        "hero photograph fade duration",
      );
      // Scroll copy started at opacity .1, which read as blank text for up to
      // two seconds on light sections. Start visible, finish sooner.
      html = replaceOnce(html, "{ opacity: 0.1 },", "{ opacity: 0.32 },", "scroll text-fade start opacity");
      html = replaceOnce(
        html,
        `        duration: 1, // Total duration for all characters`,
        `        duration: 0.7, // Total duration for all characters`,
        "scroll text-fade duration",
      );
      // On a phone the flanking collage columns are only ~92px wide, so the
      // pin slid a row of unreadable face crops off both edges. V5 hides them
      // there (CSS) and centres the single hero frame instead of offsetting it.
      html = replaceOnce(
        html,
        `  width: isMobile ? "50vw" : "36vw",`,
        `  width: isMobile ? "74vw" : "36vw",`,
        "vision pin start width",
      );
      html = replaceOnce(
        html,
        `x: isMobile ? "-25vw" : "-32vw", \n`,
        `x: isMobile ? "0vw" : "-32vw", \n`,
        "vision pin horizontal travel",
      );
      // The closing CTA headline sits on a cream panel, where the per-character
      // scrub left it near-invisible for a beat. It uses the plain reveal now.
      html = replaceOnce(
        html,
        '<h2 animation-element="text-fade-in" class="pointer-events-none">Make an everyday purchase count.',
        '<h2 class="pointer-events-none v5-cta-heading">Make an everyday purchase count.',
        "closing CTA headline",
      );
      // The same field photograph filled two adjacent stats tiles.
      const statsImage = `<img src="/media/journal/family-support.jpg"`;
      const secondIndex = html.indexOf(statsImage, html.indexOf(statsImage) + 1);
      if (secondIndex < 0) throw new Error("V5 contract changed; expected two stats photographs");
      html =
        html.slice(0, secondIndex) +
        `<img src="/media/v4/small-fighter-editorial.webp"` +
        html.slice(secondIndex + statsImage.length);

      html = replaceOnce(html, "</style></div><div data-animation", `${v5Css}</style></div><div data-animation`, "style injection point");
      html = replaceOnce(html, "</body>", `${v5Motion}</body>`, "body close tag");
    } else {
      // Commerce routes share the colour, footer and image-framing corrections,
      // plus the spacing rules scoped to [data-v5-commerce].
      // Anchored on </head><body so the marker cannot land on the word "body"
      // somewhere inside the stylesheet that was just injected above it.
      html = html.replace("</head>", `<style>${v5Css}</style></head>`);
      html = replaceOnce(html, "</head><body", "</head><body data-v5-commerce", "commerce body tag");
      html = html.replace("</body>", `${v5Motion}</body>`);
    }

    writeFileSync(file, html);
  }
}

console.log("Prepared V5 static routes: hero composition, image proportions, mobile flow and refined motion.");
