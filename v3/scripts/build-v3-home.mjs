import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const v3Root = resolve(scriptDir, "..");
const sourcePath = resolve(v3Root, "public/givewell/index.html");
const outputPath = resolve(v3Root, "public/v3-home/index.html");

let html = await readFile(sourcePath, "utf8");

function replaceOnce(search, replacement, label = search.slice(0, 60)) {
  if (!html.includes(search)) throw new Error(`Source contract changed; missing: ${label}`);
  html = html.replace(search, replacement);
}

function replaceSection(startMarker, endMarker, transform) {
  const start = html.indexOf(startMarker);
  const end = html.indexOf(endMarker, start);
  if (start < 0 || end < 0) throw new Error(`Could not isolate section: ${startMarker}`);
  html = html.slice(0, start) + transform(html.slice(start, end)) + html.slice(end);
}

const heroProduct = `<img src="/media/products/hero-pack.png" alt="ROOSA pink toilet paper pack" class="hero_img roosa-hero-pack"/><img src="/media/products/pink-roll.webp" alt="Pink ROOSA toilet roll" class="roosa-hero-roll"/><div class="roosa-paper-strip" aria-hidden="true"></div>`;

const productOptions = `<section id="products" class="roosa-products" aria-labelledby="roosa-products-title">
  <div class="padding-global"><div class="container-large"><div class="padding-section-large">
    <div class="roosa-products-heading roosa-mask"><div class="text-style-tagline">Product options</div><h2 id="roosa-products-title">One essential. Four useful ways to stock it.</h2><p>Shopify remains the source of truth for price, availability, variants and checkout.</p></div>
    <div class="roosa-product-grid">
      <article class="roosa-product-card"><a class="roosa-product-media" href="/en/product/pink-toilet-paper"><img src="/media/products/pink-pack.jpg" alt="ROOSA standard pink toilet paper pack"/><img class="is-alt" src="/media/products/pink-roll.webp" alt="Pink toilet roll close-up"/></a><div class="roosa-product-copy"><span>The everyday original</span><h3>ROOSA Pink Toilet Paper</h3><p>[PACK_SIZE] · [ROLL_COUNT] · [PLY_COUNT]</p><div class="roosa-product-buy"><strong>[PRODUCT_PRICE]</strong><a class="roosa-product-action" href="/en/product/pink-toilet-paper">View product</a></div></div></article>
      <article class="roosa-product-card"><a class="roosa-product-media" href="/en/product/family-bundle"><img src="/media/products/hero-pack.png" alt="ROOSA family bundle"/><img class="is-alt" src="/media/products/pink-pack.jpg" alt="ROOSA pink pack close-up"/></a><div class="roosa-product-copy"><span>More paper, fewer deliveries</span><h3>ROOSA Family Bundle</h3><p>[BUNDLE_PACK_SIZE] · [BUNDLE_ROLL_COUNT]</p><div class="roosa-product-buy"><strong>[BUNDLE_PRICE]</strong><a class="roosa-product-action" href="/en/product/family-bundle">View bundle</a></div></div></article>
      <article class="roosa-product-card"><a class="roosa-product-media" href="/en/product/subscription"><img src="/media/products/pink-roll.webp" alt="ROOSA repeat delivery option"/><img class="is-alt" src="/media/products/embossed-roll.webp" alt="Embossed pink paper detail"/></a><div class="roosa-product-copy"><span>Optional subscription</span><h3>ROOSA Repeat Delivery</h3><p>[DELIVERY_FREQUENCY] · [CANCELLATION_TERMS]</p><div class="roosa-product-buy"><strong>[SUBSCRIPTION_PRICE]</strong><a class="roosa-product-action" href="/en/product/subscription">Check status</a></div></div></article>
      <article class="roosa-product-card"><a class="roosa-product-media" href="/en/b2b"><img src="/media/products/white-pack.jpg" alt="ROOSA business supply option"/><img class="is-alt" src="/media/products/hero-pack.png" alt="ROOSA paper packs"/></a><div class="roosa-product-copy"><span>For workplaces and retail</span><h3>ROOSA B2B</h3><p>[MINIMUM_ORDER] · [DELIVERY_REGION]</p><div class="roosa-product-buy"><strong>[B2B_PRICE]</strong><a class="roosa-product-action" href="/en/b2b">Enquire</a></div></div></article>
    </div>
  </div></div></div>
</section>`;

const footerLinks = `<div class="roosa-trust-row"><span>[AUTHORIZED_RETAILERS]</span><span>[CERTIFICATION_DOCUMENTS]</span><span>[VERIFIED_REVIEWS]</span></div><nav class="roosa-footer-links" aria-label="Footer"><div><strong>Shop</strong><a href="/en/shop">All products</a><a href="/en/product/family-bundle">Bundles</a></div><div><strong>Support</strong><a href="/en/shipping">Shipping</a><a href="/en/returns">Returns</a></div><div><strong>Impact</strong><a href="/en/impact">How it works</a><a href="/en/impact#reports">Reports</a></div><div><strong>Company</strong><a href="/en/about">About</a><a href="/en/journal">Journal</a></div><div><strong>B2B</strong><a href="/en/b2b">Wholesale</a><a href="/en/contact">Contact</a></div><div><strong>Legal</strong><a href="/en/privacy">Privacy</a><a href="/en/imprint">Imprint</a></div></nav>`;

const customCss = `<style id="roosa-v2-overrides">
:root{--roosa-pink:#ef83b6;--roosa-pink-light:#ffd8e9;--roosa-pink-dark:#c92f78;--roosa-graphite:#241f22;--roosa-paper:#fffaf4;--roosa-impact:#204f45}
html{scroll-behavior:smooth}body{color:var(--roosa-graphite);background:var(--roosa-paper)}a,button{transition:color .2s cubic-bezier(.16,1,.3,1),background-color .2s cubic-bezier(.16,1,.3,1),border-color .2s cubic-bezier(.16,1,.3,1),transform .2s cubic-bezier(.16,1,.3,1)}a:focus-visible,button:focus-visible,input:focus-visible{outline:3px solid var(--roosa-pink-dark);outline-offset:3px}.btn:active,.roosa-hero-actions a:active,.roosa-product-action:active{transform:translateY(1px)}
.navbar_component{background:var(--roosa-paper)}.navbar_logo{font-weight:800;letter-spacing:-.06em}.navbar_menu-links{gap:1.5rem}.navbar_link{white-space:nowrap}
.btn,[data-wf--button--variant]{border-color:var(--roosa-graphite)!important;color:var(--roosa-paper)!important;background:var(--roosa-graphite)!important}.btn:hover{color:var(--roosa-graphite)!important;background:var(--roosa-pink)!important}
.section_hero{background:var(--roosa-paper)}.hero_content{overflow:visible}.hero-title{position:relative;z-index:4;max-width:11ch;color:var(--roosa-graphite);font-size:clamp(4.5rem,9vw,8.5rem);line-height:.86;letter-spacing:-.065em}.hero_visuals{overflow:visible;background:linear-gradient(135deg,var(--roosa-pink-light),var(--roosa-pink))}.hero_img.roosa-hero-pack{position:absolute;z-index:2;left:32%;top:35%;width:64%;height:auto;object-fit:contain;filter:drop-shadow(0 2rem 2.5rem rgba(36,31,34,.2));transform:translate3d(calc(var(--roosa-hero-progress,0)*-2.5rem),calc(var(--roosa-hero-progress,0)*-1rem),0)}.roosa-hero-roll{position:absolute;z-index:3;right:4%;bottom:-8%;width:min(34vw,31rem);aspect-ratio:1;object-fit:contain;filter:drop-shadow(0 2rem 2rem rgba(36,31,34,.2));transform:rotate(calc(18deg + var(--roosa-hero-progress,0)*22deg)) translate3d(0,calc(var(--roosa-hero-progress,0)*-2rem),0)}.roosa-paper-strip{position:absolute;z-index:1;right:11%;bottom:-10rem;width:min(18vw,15rem);height:calc(10rem + var(--roosa-hero-progress,0)*13rem);background:var(--roosa-pink);border-bottom:2px dashed rgba(36,31,34,.35);transform:skewX(-3deg);transform-origin:top}.roosa-hero-actions{display:flex;flex-wrap:wrap;gap:.75rem;margin-top:1.5rem}.roosa-hero-actions a{padding:.85rem 1.25rem;border:1px solid var(--roosa-graphite);border-radius:99rem;font-weight:700;text-decoration:none}.roosa-hero-actions a:first-child{color:var(--roosa-paper);background:var(--roosa-graphite)}
.section_mission{position:relative;background:var(--roosa-paper)}.section_mission:before,.roosa-products:after{content:"";position:absolute;left:0;right:0;top:0;height:10px;background:repeating-linear-gradient(90deg,var(--roosa-pink) 0 18px,transparent 18px 28px)}.section_empower{background:var(--roosa-paper)}.empower_component{background:var(--roosa-pink-light)}.empower_link-block.w--current,.empower_tab_timer.red{color:var(--roosa-graphite);background:var(--roosa-pink)}.empower_card-background,.empower_card-background.is-pearl,.empower_card-background.is-purple{background:var(--roosa-pink)}.empower_card-texture{mix-blend-mode:soft-light}.section_team{background:var(--roosa-paper)}.team_heading-span{background-image:url('/media/products/pink-roll.webp')!important}.team_heading-span._2{background-image:url('/media/products/pink-pack.jpg')!important}.team_heading-span._3{background-image:url('/media/journal/field-team.jpg')!important}
.roosa-products{position:relative;color:var(--roosa-graphite);background:var(--roosa-paper)}.roosa-products-heading{max-width:54rem;margin-bottom:4rem}.roosa-products-heading h2{margin-top:1rem;font-size:clamp(3rem,6vw,6rem);line-height:.9;letter-spacing:-.055em}.roosa-products-heading p{max-width:40rem;margin-top:1.25rem}.roosa-product-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:1.25rem}.roosa-product-card{min-width:0}.roosa-product-media{position:relative;display:block;aspect-ratio:4/5;overflow:hidden;background:var(--roosa-pink-light);clip-path:polygon(0 0,calc(100% - 1.5rem) 0,100% 1.5rem,100% 100%,0 100%)}.roosa-product-media img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;transition:opacity .45s ease,clip-path .65s cubic-bezier(.16,1,.3,1),transform .65s cubic-bezier(.16,1,.3,1)}.roosa-product-media .is-alt{opacity:0;clip-path:inset(100% 0 0)}.roosa-product-media:hover .is-alt{opacity:1;clip-path:inset(0)}.roosa-product-media:hover img:first-child{transform:scale(1.025)}.roosa-product-copy{padding-top:1.25rem}.roosa-product-copy>span{font-size:.72rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase}.roosa-product-copy h3{margin-top:.45rem;font-size:1.55rem;line-height:1}.roosa-product-copy p{margin-top:.75rem;color:#6d6267;font-size:.82rem}.roosa-product-buy{display:flex;align-items:center;justify-content:space-between;gap:.75rem;margin-top:1rem;padding-top:1rem;border-top:1px solid rgba(36,31,34,.16)}.roosa-product-action{min-height:2.75rem;display:inline-flex;align-items:center;justify-content:center;padding:.65rem 1rem;border:1px solid var(--roosa-graphite);border-radius:99rem;background:transparent;color:var(--roosa-graphite);font-weight:700;text-decoration:none}.roosa-product-action:hover{background:var(--roosa-graphite);color:var(--roosa-paper)}
.section_vision{background:linear-gradient(180deg,var(--roosa-pink),var(--roosa-pink-dark))}.marquee_heading-wrapper{color:var(--roosa-graphite)}.marquee_image-wrapper .hand-icon{color:var(--roosa-paper)}.vision_image-wrapper{overflow:hidden;clip-path:polygon(0 0,calc(100% - 2rem) 0,100% 2rem,100% 100%,0 100%)}.vision_image-wrapper img{object-fit:cover}.section_stats{background:var(--roosa-paper)}.stats_item.background-color-purple{background:var(--roosa-pink)}.stats_item.background-color-lightblue{background:var(--roosa-pink-light)}.stats_item.background-color-vermillion{color:var(--roosa-paper);background:var(--roosa-impact)}.stats_number{font-size:clamp(2.5rem,5vw,5rem);overflow-wrap:anywhere}.footer_component{background:linear-gradient(180deg,var(--roosa-pink-dark),var(--roosa-graphite))}.cta_card{background:var(--roosa-pink)}.cta_background-wrapper .hand-icon{object-fit:contain}.roosa-trust-row{display:grid;grid-template-columns:repeat(3,1fr);gap:1rem;margin:3rem 0}.roosa-trust-row span{padding:1.25rem;border:1px dashed rgba(255,250,244,.35);text-align:center;font-size:.72rem;font-weight:700;letter-spacing:.06em}.roosa-footer-links{display:grid;grid-template-columns:repeat(6,1fr);gap:1.5rem;margin:3rem 0;color:var(--roosa-paper)}.roosa-footer-links div{display:flex;flex-direction:column;gap:.45rem}.roosa-footer-links strong{margin-bottom:.45rem}.roosa-footer-links a{color:rgba(255,250,244,.72);text-decoration:none}.footer_logo{object-fit:contain;filter:brightness(0) invert(1)}
.roosa-mask{clip-path:inset(0 100% 0 0);opacity:.15;transition:clip-path 1s cubic-bezier(.16,1,.3,1),opacity .4s ease}.roosa-mask.is-visible{clip-path:inset(0);opacity:1}
@media(max-width:991px){.navbar_menu-links{gap:.75rem}.roosa-product-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.roosa-footer-links{grid-template-columns:repeat(3,1fr)}}
@media(max-width:767px){html,body,.page-wrapper{max-width:100%;overflow-x:clip}.section_marquee{overflow:hidden}.hero_content,.hero_content .padding-global,.hero_content .margin-bottom,.hero_content ._2col_grid,.hero_content ._2col_grid>*,.hero-title{width:100%;min-width:0;max-width:100%}.hero-title{font-size:clamp(3rem,14vw,4.75rem);overflow-wrap:anywhere}.hero-title .roosa-title-line{display:block}.hero_img.roosa-hero-pack{left:8%;top:38%;width:86%;transform:none}.roosa-hero-roll{right:4%;bottom:-4%;width:min(58vw,20rem);transform:rotate(24deg)}.roosa-paper-strip{display:none}.roosa-product-grid{grid-template-columns:1fr}.roosa-product-media{aspect-ratio:5/4}.roosa-trust-row,.roosa-footer-links{grid-template-columns:1fr 1fr}.section_vision .vision_content-bottom{min-height:100vh}.roosa-mask{clip-path:none;opacity:1}}
@media(max-width:479px){.roosa-trust-row,.roosa-footer-links{grid-template-columns:1fr}.roosa-hero-actions a{width:100%;text-align:center}}
@media(prefers-reduced-motion:reduce){html{scroll-behavior:auto}.hero_img.roosa-hero-pack,.roosa-hero-roll,.roosa-paper-strip{transform:none!important}.roosa-mask{clip-path:none;opacity:1;transition:none}.roosa-product-media img{transition:none}}
</style>`;

/* Both variants draw the proof card as a 2D roll of ROOSA paper: cylinder body, elliptical top cap,
   cardboard core. They differ only in art direction, and share the card sizing in the media queries below. */
const proofCardArt = {
  /* Soft-lit roll: shading gradients, drop shadow, embossed paper photo as surface texture. */
  shaded: `
.empower_card{--roll-face:#f7a8cd;--roll-edge:#dd7cae;--roll-cap:#ffd7ea;--roll-core:#c08e5f;border-radius:50% 50% 50% 50%/13% 13% 15% 15%;background:linear-gradient(90deg,rgba(36,31,34,.26) 0%,rgba(36,31,34,.08) 12%,rgba(255,255,255,.34) 36%,rgba(255,255,255,.06) 58%,rgba(36,31,34,.08) 84%,rgba(36,31,34,.28) 100%),linear-gradient(180deg,var(--roll-edge) 0%,var(--roll-face) 22%,var(--roll-face) 68%,var(--roll-edge) 100%);box-shadow:0 1.5rem 2.25rem rgba(36,31,34,.16)}
.empower_card:before{content:"";position:absolute;z-index:1;inset:0 0 auto 0;height:26%;border-radius:50%;background:radial-gradient(closest-side ellipse at 50% 50%,rgba(36,31,34,0) 40%,rgba(36,31,34,.05) 44%,rgba(36,31,34,0) 48%,rgba(36,31,34,0) 68%,rgba(36,31,34,.05) 72%,rgba(36,31,34,0) 76%),radial-gradient(closest-side ellipse at 50% 30%,rgba(255,255,255,.85),rgba(255,255,255,0) 82%),linear-gradient(180deg,var(--roll-cap),#f9c2dd);box-shadow:inset 0 -.4rem .7rem rgba(36,31,34,.1)}
.empower_card:after{content:"";position:absolute;z-index:1;top:19%;right:16%;bottom:-12%;width:28%;border-radius:85% 0 0 0/20% 0 0 0;background:linear-gradient(90deg,rgba(36,31,34,.12),rgba(36,31,34,.02) 10%,rgba(255,255,255,.26) 26%,rgba(255,255,255,.04) 72%,rgba(255,255,255,0));transform:rotate(1.2deg)}
.empower_card-content:before{content:"";position:absolute;z-index:3;left:50%;top:8.6%;width:30%;height:8.4%;transform:translateX(-50%);border-radius:50%;background:radial-gradient(closest-side ellipse at 50% 24%,#d8a878,var(--roll-core) 90%);box-shadow:inset 0 .4rem .55rem rgba(36,31,34,.45),0 -.15rem .35rem rgba(255,255,255,.5)}
.empower_card-background,.empower_card-background.is-pearl,.empower_card-background.is-purple{z-index:auto;opacity:1;background:none}
.empower_card-texture,.empower_card-texture._1,.empower_card-texture._2,.empower_card-texture._3,.empower_card-texture._4{opacity:.42;mix-blend-mode:multiply;filter:contrast(1.15);transform:scale(1.6) translateY(8%)}`,
  /* Same roll, dialled back: gentler volume, faint wound-paper rings, light shadow, whisper of texture. */
  soft: `
.empower_card{--roll-face:#f9b2d4;--roll-edge:#e991bf;--roll-cap:#ffdcee;--roll-core:#dcac7c;border-radius:50% 50% 50% 50%/13% 13% 15% 15%;background:linear-gradient(90deg,rgba(36,31,34,.16) 0%,rgba(36,31,34,.03) 15%,rgba(255,255,255,.2) 40%,rgba(255,255,255,0) 66%,rgba(36,31,34,.04) 85%,rgba(36,31,34,.17) 100%),linear-gradient(180deg,var(--roll-face) 0%,var(--roll-face) 74%,var(--roll-edge) 100%);box-shadow:0 .75rem 1.5rem rgba(36,31,34,.08)}
.empower_card:before{content:"";position:absolute;z-index:1;inset:0 0 auto 0;height:26%;border-radius:50%;background:radial-gradient(closest-side ellipse at 50% 50%,transparent 61%,rgba(36,31,34,.13) 61.5% 62.5%,transparent 63%),radial-gradient(closest-side ellipse at 50% 50%,transparent 41%,rgba(36,31,34,.07) 41.5% 42.5%,transparent 43%),radial-gradient(closest-side ellipse at 50% 32%,#fff2f9,rgba(255,255,255,0) 82%),var(--roll-cap);box-shadow:inset 0 -.2rem .4rem rgba(36,31,34,.07)}
.empower_card:after{content:none}
.empower_card-content:before{content:"";position:absolute;z-index:3;left:50%;top:8.6%;width:30%;height:8.4%;transform:translateX(-50%);border-radius:50%;background:var(--roll-core);box-shadow:inset 0 .2rem .35rem rgba(36,31,34,.22)}
.empower_card-background,.empower_card-background.is-pearl,.empower_card-background.is-purple{z-index:auto;opacity:1;background:none}
.empower_card-texture,.empower_card-texture._1,.empower_card-texture._2,.empower_card-texture._3,.empower_card-texture._4{opacity:.24;mix-blend-mode:multiply;filter:contrast(1.1);transform:scale(1.6) translateY(8%)}`,
};

/* Switch the proof-card art direction here: "shaded" or "soft". */
const proofCardVariant = "soft";

const v3Refinements = `<style id="roosa-v3-refinements">
/* V3 is a measured refinement of V2: same sections, assets and interactions. */
html,body,.page-wrapper{max-width:100%;overflow-x:clip}
.hero_content ._2col_grid{grid-template-columns:minmax(0,1.14fr) minmax(19rem,.86fr);gap:clamp(2rem,5vw,5rem);align-items:end;transform:translateY(-2.5rem)}
.hero-title{max-width:10.5ch;font-size:clamp(3.8rem,6.15vw,5.8rem);line-height:.92;letter-spacing:-.05em}
.hero_content ._2col_grid>div{max-width:28rem}
.hero_img.roosa-hero-pack{left:52%;top:31%;width:43%;filter:drop-shadow(0 1.5rem 2rem rgba(36,31,34,.17))}
.roosa-hero-roll{right:-3%;bottom:-3%;width:min(22vw,19rem);filter:drop-shadow(0 1.5rem 1.8rem rgba(36,31,34,.16))}
.roosa-paper-strip{right:9%;bottom:-7rem;width:min(15vw,12rem);height:calc(7rem + var(--roosa-hero-progress,0)*9rem)}
.roosa-hero-actions{margin-top:1.25rem}
.section_mission{min-height:auto!important}
.section_mission .roosa-mask{clip-path:none!important;opacity:1!important}
.section_mission .padding-section-large{padding-top:clamp(4rem,7vw,6.5rem);padding-bottom:clamp(4rem,7vw,6.5rem)}
.mission_component{min-height:0!important;display:grid;grid-template-columns:minmax(0,1.4fr) minmax(14rem,.6fr);gap:clamp(2rem,6vw,6rem);align-items:end}
.mission_component h2{font-size:clamp(2.75rem,4.25vw,4.35rem);line-height:.96;letter-spacing:-.045em}
.mission_component>.margin-top{margin-top:0!important}
.section_empower .padding-section-large,.section_team .padding-section-large,.roosa-products .padding-section-large,.section_stats .padding-section-large{padding-top:clamp(4.25rem,7.5vw,7rem);padding-bottom:clamp(4.25rem,7.5vw,7rem)}
.empower_component{background:color-mix(in srgb,var(--roosa-pink-light) 78%,var(--roosa-paper))}
.empower_link-block{padding-top:clamp(1rem,1.7vw,1.5rem);padding-bottom:clamp(1rem,1.7vw,1.5rem)}
.empower_link-block h3{font-size:clamp(1.65rem,3.2vw,3.35rem);line-height:.95}
.empower_link-block:not(.w--current){color:color-mix(in srgb,var(--roosa-graphite) 72%,var(--roosa-paper))}
.empower_card{color:var(--roosa-graphite)}
.empower_card-content{justify-content:center;align-items:center;gap:1.5rem;padding:8.5rem 2.75rem 5rem}
.empower_card-img{flex:none;width:4.25rem;height:4.25rem}
.empower_card-text-wrap{max-width:31rem}
.roosa-products-heading{margin-bottom:3rem}
.roosa-product-media{aspect-ratio:1/1}
.roosa-product-copy h3{font-size:clamp(1.3rem,1.8vw,1.65rem)}
.roosa-product-copy p{min-height:2.5em}
.section_stats .stats_number{font-size:clamp(2.15rem,4.2vw,4.2rem)}
.roosa-trust-row span{color:rgba(255,250,244,.78)}
@media(max-width:991px){
  .hero_content ._2col_grid{grid-template-columns:1fr 1fr}
  .hero-title{font-size:clamp(3.9rem,8.5vw,6rem)}
  .hero_img.roosa-hero-pack{left:38%;width:58%}
  .empower_tab-content,.empower_tab-container{justify-content:center}
  .empower_card{width:min(22rem,88%);height:auto;aspect-ratio:24/29;margin-inline:auto}
  .empower_card-content{padding:7rem 2rem 3.5rem;gap:1.25rem}
  .empower_card-img{width:3.75rem;height:3.75rem}
  .empower_card p{font-size:.9375rem;line-height:1.4}
}
@media(min-width:768px){.section_mission .container-small{max-width:80rem}}
@media(max-width:767px){
  .section_hero .hero_content{height:calc(100svh - 1.5rem);min-height:620px;max-height:760px}
  .hero_content ._2col_grid{display:block;transform:translateY(-4.5rem)}
  .hero-title{max-width:7.7ch;font-size:clamp(3.1rem,13vw,4.35rem);line-height:.91;transform:none}
  .hero_content .text-size-medium{max-width:19rem;line-height:1.45}
  .hero_img.roosa-hero-pack{display:none}
  .roosa-hero-roll{right:-4%;bottom:-2%;width:min(42vw,14rem)}
  .section_mission .padding-section-large{padding-top:3rem;padding-bottom:3rem}
  .mission_component{display:block}
  .mission_component>.margin-top{margin-top:1.5rem!important}
  .mission_component h2{font-size:clamp(2.15rem,9vw,3.2rem)}
  .section_empower .padding-section-large,.section_team .padding-section-large,.roosa-products .padding-section-large,.section_stats .padding-section-large{padding-top:3.25rem;padding-bottom:3.25rem}
  .empower_link-block h3{font-size:clamp(1.35rem,6.4vw,2.05rem)}
  .empower_card{width:min(21rem,100%)}
  .empower_card-content{padding:6.5rem 1.25rem 3.5rem;gap:1.1rem}
  .empower_card-img{width:3.25rem;height:3.25rem}
  .roosa-product-media{aspect-ratio:5/4}
  .roosa-product-copy p{min-height:0}
  .roosa-product-card:not(:first-child){display:grid;grid-template-columns:7.5rem minmax(0,1fr);gap:1rem;padding:1rem 0;border-top:1px solid rgba(36,31,34,.16)}
  .roosa-product-card:not(:first-child) .roosa-product-media{aspect-ratio:1}
  .roosa-product-card:not(:first-child) .roosa-product-copy{padding-top:0}
  .roosa-product-card:not(:first-child) .roosa-product-copy>span{font-size:.58rem}
  .roosa-product-card:not(:first-child) .roosa-product-copy h3{font-size:1.22rem}
  .roosa-product-card:not(:first-child) .roosa-product-copy p{margin-top:.4rem}
  .roosa-product-card:not(:first-child) .roosa-product-buy{margin-top:.55rem;padding-top:.55rem}
  .roosa-product-card:not(:first-child) .roosa-product-action{min-height:2.25rem;padding:.45rem .7rem;font-size:.75rem}
}
@media(max-width:390px){
  .section_hero .hero_content{min-height:600px}
  .hero-title{font-size:clamp(2.95rem,12.5vw,3.75rem)}
  .hero_img.roosa-hero-pack{top:54%}
}
${proofCardArt[proofCardVariant]}
</style>`;

const customScript = `<script id="roosa-v2-interactions">
document.addEventListener('DOMContentLoaded',function(){
  var hero=document.querySelector('.section_hero');var visuals=document.querySelector('.hero_visuals');var reduced=window.matchMedia('(prefers-reduced-motion: reduce)');var narrow=window.matchMedia('(max-width: 767px)');var queued=false;
  function heroProgress(){queued=false;if(!hero||!visuals||reduced.matches||narrow.matches){if(visuals)visuals.style.setProperty('--roosa-hero-progress','0');return}var rect=hero.getBoundingClientRect();var travel=Math.max(1,hero.offsetHeight-window.innerHeight*.35);var progress=Math.max(0,Math.min(1,-rect.top/travel));visuals.style.setProperty('--roosa-hero-progress',progress.toFixed(4))}
  function queue(){if(!queued){queued=true;requestAnimationFrame(heroProgress)}}window.addEventListener('scroll',queue,{passive:true});window.addEventListener('resize',queue);heroProgress();
  if(!reduced.matches){var maskObserver=new IntersectionObserver(function(entries,observer){entries.forEach(function(entry){if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target)}})},{threshold:.2});document.querySelectorAll('.roosa-mask').forEach(function(el){maskObserver.observe(el)})}
  var footerForm=document.querySelector('.footer_form');if(footerForm){footerForm.addEventListener('submit',function(event){event.preventDefault();var email=footerForm.querySelector('input[type="email"]');var block=footerForm.closest('.w-form');var success=block&&block.querySelector('.w-form-done');var error=block&&block.querySelector('.w-form-fail');if(email&&email.checkValidity()){if(error)error.style.display='none';if(success)success.style.display='block';footerForm.style.display='none'}else{if(success)success.style.display='none';if(error)error.style.display='block';if(email){email.focus();email.reportValidity()}}})}
});
</script>`;

replaceOnce("<title>GiveWell | Fundraising</title>", "<title>ROOSA | Soft on skin. Strong for children.</title>", "document title");
replaceOnce('content="A modern, GSAP-powered fundraising template designed to inspire action. Showcase campaigns, accept donations, and share impact—all in a clean, responsive design." name="description"', 'content="Pink toilet paper with a transparent path from purchase to documented child-protection impact." name="description"', "meta description");
html = html.replaceAll('content="https://cdn.prod.website-files.com/68011fed23249a9699d7b42b/681533d2f4239c26b847fb98_og.webp"', 'content="/media/products/hero-pack.png"');
replaceOnce("</head>", `${customCss}${v3Refinements}</head>`, "head close");

replaceOnce('<div class="navbar_logo">GiveWell</div>', '<div class="navbar_logo">ROOSA</div>', "navbar logo");
replaceOnce('<div class="navbar_menu-links"><a href="#mission" class="navbar_link w-nav-link">Our mission</a><a href="#empower" class="navbar_link w-nav-link">Empower</a><a href="#team" class="navbar_link w-nav-link">The team</a><a href="#stats" class="navbar_link w-nav-link">Our impact</a></div>', '<div class="navbar_menu-links"><a href="/en/shop" class="navbar_link w-nav-link">Shop</a><a href="/en/product/pink-toilet-paper" class="navbar_link w-nav-link">Product</a><a href="/en/impact" class="navbar_link w-nav-link">Impact</a><a href="/en/about" class="navbar_link w-nav-link">About</a><a href="/en/b2b" class="navbar_link w-nav-link">B2B</a><a href="/en/journal" class="navbar_link w-nav-link">Journal</a></div>', "navbar links");
html = html.replaceAll("<div>Donate</div>", "<div>Buy ROOSA</div>");

replaceOnce('<h1 class="hero-title">Givewɘll</h1>', '<h1 class="hero-title">Soft on skin.<br/><span class="roosa-title-line">Strong for</span> <span class="roosa-title-line">children.</span></h1>', "hero title");
replaceOnce('<p class="text-size-medium text-weight-semibold">Join us in transforming dreams into reality. Your support can make a significant impact on the causes that matter most.</p>', '<div><p class="text-size-medium text-weight-semibold">Pink toilet paper with a transparent path from purchase to documented impact.</p><div class="roosa-hero-actions"><a href="#products">Buy ROOSA</a><a href="#vision">See the impact</a></div></div>', "hero copy");
replaceOnce('<img src="https://cdn.prod.website-files.com/68011fed23249a9699d7b42b/6802f26cb1c279ff927f7887_visualelectric-1744594470866.avif" loading="lazy" alt="a peaceful lake with a city in the background surrounded by fluffy clouds" class="hero_img"/>', heroProduct, "hero visual");

replaceOnce('<h2 animation-element="text-fade-in"><span class="text-style-tagline margin-right margin-xlarge">Our Mission</span>Our mission is to empower creators and changemakers by providing a platform that connects their visions with generous supporters. We believe that every story deserves to be told and every dream deserves a chance to flourish.</h2>', '<h2 animation-element="text-fade-in" class="roosa-mask"><span class="text-style-tagline margin-right margin-xlarge">Why ROOSA</span>Unexpected colour. Serious quality. ROOSA turns a familiar household product into a visible paper trail—from comfort at home to accountable support for children.</h2>', "mission statement");
html = html.replaceAll("Our impact", "See the impact");

const empowerReplacements = new Map([
  ["Mission &amp; engagement", "Three-ply softness"],
  ["Spread Global Awareness", "Dermatological testing"],
  ["Organize grant funding", "FSC certification"],
  ["Ignite sustainable Impact", "Child-protection support"],
  ["What we do", "Product quality"],
  ["Who do we involve", "Independent proof"],
  ["How do we do it", "Responsible sourcing"],
  ["Why do we do this", "The impact mechanism"],
]);
replaceSection('<section id="empower"', '<section id="team"', (section) => {
  section = section.replace('<div class="text-style-tagline">Empower</div>', '<div class="text-style-tagline">Product proof &amp; impact</div>');
  for (const [from, to] of empowerReplacements) section = section.replace(from, to);
  const bodies = [
    "Three-ply softness is a product claim pending approved product documentation. [VERIFICATION_REQUIRED]",
    "Dermatological testing must link to the final test record before publication. [TEST_DOCUMENT_REQUIRED]",
    "FSC certification must remain conditional until its certificate and scope are approved. [CERTIFICATE_URL_REQUIRED]",
    "You buy ROOSA → [CONTRIBUTION_AMOUNT] is allocated → [PARTNER_NAME] receives support → outcomes appear in [REPORT_URL].",
  ];
  let bodyIndex = 0;
  section = section.replace(/Lorem ipsum dolor sit amet, consectetur adipiscing elit\. Proin enim neque, varius ut lorem eget, blandit venenatis felis\. Sed tellus magna, elementum non commodo sit amet, finibus eu nunc\. Integer bibendum gravida scelerisque\./g, () => bodies[bodyIndex++]);
  section = section.replace(/<img[^>]+class="empower_card-texture ([^"]+)"\/>/g, (_match, variant) => `<img src="/media/products/embossed-roll.webp" loading="lazy" alt="Pink embossed paper texture" class="empower_card-texture ${variant}"/>`);
  return section;
});

replaceOnce('Thanks to<span class="team_heading-span"> </span>our clients, friends, partners. Thank you to<span class="team_heading-span _2"> </span>our team of volunteers<span class="team_heading-span _3"> </span>who made this journey possible.', 'Pink made<span class="team_heading-span"> </span>the product unmistakable. Child protection gave<span class="team_heading-span _2"> </span>the colour a serious purpose. Founder details remain<span class="team_heading-span _3"> </span>[VERIFICATION_REQUIRED].', "origin story");
replaceOnce("<div>Get Involved</div>", "<div>Our story</div>", "team CTA");
replaceOnce('<header id="vision" class="section_vision background-color-gradient1">', `${productOptions}<header id="vision" class="section_vision background-color-gradient1">`, "commerce insertion");

replaceSection('<header id="vision"', '<section id="stats"', (section) => {
  section = section.replaceAll(">Inspire<", ">Purchase<").replaceAll(">Take Action<", ">Allocate<").replaceAll(">Empower<", ">Report<");
  section = section.replace("Our vision", "The Pink Paper Trail");
  section = section.replace("We imagine a future where kindness leads and progress follows.", "Purchase becomes a traceable contribution—not a vague promise.");
  section = section.replace("Our work is grounded in the belief that small actions can spark lasting change. As the world evolves, we stay committed to uplifting efforts that empower and connect. We act not out of duty, but from a deep hope for a better tomorrow—whatever shape it takes.", "You buy ROOSA. [CONTRIBUTION_AMOUNT] is allocated. [PARTNER_NAME] receives support. The resulting project record names its reporting period, source and documented outcome.");
  section = section.replace("— where care drives change.", "Purchase → contribution → partner → documented result.");
  const images = ["/media/products/pink-pack.jpg", "/media/products/pink-roll.webp", "/media/journal/field-team.jpg", "/media/products/hero-pack.png", "/media/impact/partner-kinderschutz.svg", "/media/journal/family-support.jpg", "/media/products/embossed-roll.webp"];
  section = section.replace(/<img[^>]+class="vision_image([1-7])"\/>/g, (_match, number) => `<img src="${images[Number(number) - 1]}" loading="eager" alt="ROOSA paper trail stage ${number}" class="vision_image${number}"/>`);
  return section;
});

replaceSection('<section id="stats"', '<footer id="footer"', (section) => {
  section = section.replace("From quiet efforts to real results: The ripple effect of every donation", "Impact belongs in the record, not just in the promise");
  section = section.replace("With every donation, we&#x27;ve been able to reach farther and do more. In just the past 12 months, we’ve provided resources to over 50 grassroots initiatives, supported 100+ volunteers working on the ground, and directly impacted communities facing real challenges—with real solutions. From mental health support to educational access, you turned ideas into measurable change.", "Every metric requires a reporting period and a source. Until verified records are supplied, ROOSA shows explicit placeholders rather than invented totals.");
  const cards = [
    ["Projects supported through local programs", "Contributions transferred", "[TOTAL_CONTRIBUTIONS]", "Contributions transferred · [REPORTING_PERIOD] · Source: [REPORT_URL]"],
    ["Resource Distribution", "Projects supported", "[PROJECT_COUNT]", "Projects supported · [REPORTING_PERIOD] · Source: [REPORT_URL]"],
    ["Volunteer &amp; Project Support", "Verified partners", "[PARTNER_COUNT]", "Verified partners · [REPORTING_PERIOD] · Source: [REPORT_URL]"],
  ];
  for (const [title, newTitle, value, description] of cards) {
    section = section.replace(new RegExp(`<h3 class="heading-style-h5">${title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}<\\/h3>[\\s\\S]*?<div class="stats_number">[^<]+<\\/div>[\\s\\S]*?<p>[^<]*(?:<br\\/>[\\s\\S]*?)?<\\/p>`), (match) => match.replace(`<h3 class="heading-style-h5">${title}</h3>`, `<h3 class="heading-style-h5">${newTitle}</h3>`).replace(/<div class="stats_number">[^<]+<\/div>/, `<div class="stats_number" data-placeholder="true">${value}</div>`).replace(/<p>[\s\S]*?<\/p>/, `<p>${description}</p>`));
  }
  section = section.replace(/<img[^>]+class="stats_image"\/>/g, '<img src="/media/journal/family-support.jpg" loading="lazy" alt="Impact reporting project" class="stats_image"/>');
  return section;
});

replaceSection('<footer id="footer"', '</footer>', (section) => {
  section = section.replace("Help us turn small actions into lasting change. Your donation supports the people and projects building a better future — one step at a time.", "Make an everyday purchase count. Buy ROOSA, then follow the paper trail from product to documented impact.");
  section = section.replaceAll('<div class="navbar_logo">GiveWell</div>', '<div class="navbar_logo">ROOSA</div>');
  section = section.replace("Be the first to hear about our impacts and new volunteer opportunities!", "Product news, project records and impact reporting—without vague promises.");
  section = section.replace("Subscribe to receive updates", "Subscribe for ROOSA updates");
  section = section.replace("By subscribing you agree to receive updates from the Dev Shop templates store from time to time and to our", "By subscribing you agree to receive ROOSA updates and accept our");
  section = section.replace("© 2025 GiveWell. All rights reserved.", "© 2026 ROOSA. [LEGAL_ENTITY] · All rights reserved.");
  section = section.replace('<div class="footer_image-wrapper">', `${footerLinks}<div class="footer_image-wrapper">`);
  section = section.replace(/<img[^>]+class="footer_logo"\/>/, '<img src="/media/brand/roosa-wordmark.png" loading="lazy" alt="ROOSA" class="footer_logo"/>');
  let draggable = 0;
  const dragImages = ["/media/products/pink-roll.webp", "/media/products/hero-pack.png", "/media/products/embossed-roll.webp"];
  section = section.replace(/<svg[^>]*class="hand-icon draggable _([1-7])"[^>]*>[\s\S]*?<\/svg>/g, (_match, index) => `<img src="${dragImages[draggable++ % dragImages.length]}" alt="" aria-hidden="true" class="hand-icon draggable _${index}"/>`);
  return section;
});

html = html.replace("document.querySelectorAll('.stats_number').forEach", "document.querySelectorAll('.stats_number:not([data-placeholder])').forEach");
html = html.replaceAll('href="#" class="navbar_logo-link w-nav-brand"', 'href="/" class="navbar_logo-link w-nav-brand"');
html = html.replaceAll('href="#" class="footer_logo-link w-nav-brand"', 'href="/" class="footer_logo-link w-nav-brand"');
html = html.replace(/href="#" class="btn([^>]*)"><div>Buy ROOSA<\/div>/g, 'href="/en/shop" class="btn$1"><div>Buy ROOSA</div>');
html = html.replace(/href="#" class="button is-link is-icon w-inline-block"><div>Buy ROOSA<\/div>/g, 'href="/en/shop" class="button is-link is-icon w-inline-block"><div>Buy ROOSA</div>');
html = html.replace(/href="#footer" class="btn([^>]*)"><div>Our story<\/div>/g, 'href="/en/about" class="btn$1"><div>Our story</div>');
html = html.replaceAll('<a href="#" class="">Privacy Policy</a>', '<a href="/en/privacy" class="">Privacy Policy</a>');
html = html.replaceAll('<a href="#"><span>Privacy Policy</span></a>', '<a href="/en/privacy"><span>Privacy Policy</span></a>');
html = html.replaceAll('<a href="#" class="footer_legal-link">Privacy Policy</a>', '<a href="/en/privacy" class="footer_legal-link">Privacy Policy</a>');
html = html.replaceAll('<a href="#" class="footer_legal-link">Terms of Service</a>', '<a href="/en/imprint" class="footer_legal-link">Imprint</a>');

const approvalCopy = new Map([
  ["[PACK_SIZE]", "Pack details pending"],
  ["[ROLL_COUNT]", "Roll count pending"],
  ["[PLY_COUNT]", "Specification pending"],
  ["[PRODUCT_PRICE]", "Price at launch"],
  ["[BUNDLE_PACK_SIZE]", "Bundle details pending"],
  ["[BUNDLE_ROLL_COUNT]", "Roll count pending"],
  ["[BUNDLE_PRICE]", "Price at launch"],
  ["[DELIVERY_FREQUENCY]", "Frequency pending"],
  ["[CANCELLATION_TERMS]", "Terms before activation"],
  ["[SUBSCRIPTION_PRICE]", "Terms at launch"],
  ["[MINIMUM_ORDER]", "Minimum pending"],
  ["[DELIVERY_REGION]", "Regions by quotation"],
  ["[B2B_PRICE]", "Request a quotation"],
  ["[VERIFICATION_REQUIRED]", "Product sheet pending"],
  ["[TEST_DOCUMENT_REQUIRED]", "Test record pending"],
  ["[CERTIFICATE_URL_REQUIRED]", "Certificate link pending"],
  ["[CONTRIBUTION_AMOUNT]", "the approved amount"],
  ["[PARTNER_NAME]", "the named partner"],
  ["[REPORT_URL]", "the published report"],
  ["[TOTAL_CONTRIBUTIONS]", "Pending"],
  ["[PROJECT_COUNT]", "Pending"],
  ["[PARTNER_COUNT]", "Pending"],
  ["[REPORTING_PERIOD]", "first approved period"],
  ["[AUTHORIZED_RETAILERS]", "Retailers published when authorised"],
  ["[CERTIFICATION_DOCUMENTS]", "Documents linked after approval"],
  ["[VERIFIED_REVIEWS]", "Reviews published after verification"],
  ["[LEGAL_ENTITY]", "Legal entity pending approval"],
]);
for (const [token, replacement] of approvalCopy) html = html.replaceAll(token, replacement);
replaceOnce("</body>", `${customScript}</body>`, "body close");

const forbidden = ["GiveWell", "Lorem ipsum", "every donation", "team of volunteers", "Dev Shop templates", "kindness leads", "care drives change", "Volunteer &amp; Project Support"];
for (const phrase of forbidden) {
  if (html.includes(phrase)) throw new Error(`Source-specific content leaked into output: ${phrase}`);
}

for (const required of ["section_hero", "section_mission", "section_empower", "section_team", "roosa-products", "section_vision", "section_stats", "footer_component", "roosa-v3-refinements", "roosa-hero-roll"]) {
  if (!html.includes(required)) throw new Error(`Generated output is missing contract marker: ${required}`);
}

await mkdir(dirname(outputPath), { recursive: true });
await writeFile(outputPath, html, "utf8");
console.log(`Generated ${outputPath} (${Buffer.byteLength(html).toLocaleString()} bytes)`);
