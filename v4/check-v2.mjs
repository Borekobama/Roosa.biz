import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const v2Root = "/Users/berke/Downloads/Projects/Website/Roosa.biz/v3";
const sourcePath = resolve(v2Root, "public/givewell/index.html");
const outputPath = "/private/tmp/claude-501/-Users-berke-Downloads-Projects-Website-Roosa-biz/5040dfb4-e993-4071-afb4-8dd50c7a6572/scratchpad/v2home-check.html";

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
replaceOnce("</head>", `${customCss}</head>`, "head close");

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
replaceOnce("</body>", `${customScript}</body>`, "body close");

const forbidden = ["GiveWell", "Lorem ipsum", "every donation", "team of volunteers", "Dev Shop templates", "kindness leads", "care drives change", "Volunteer &amp; Project Support"];
for (const phrase of forbidden) {
  if (html.includes(phrase)) throw new Error(`Source-specific content leaked into output: ${phrase}`);
}

for (const required of ["section_hero", "section_mission", "section_empower", "section_team", "roosa-products", "section_vision", "section_stats", "footer_component", "[REPORTING_PERIOD]", "roosa-hero-roll"]) {
  if (!html.includes(required)) throw new Error(`Generated output is missing contract marker: ${required}`);
}

await mkdir(dirname(outputPath), { recursive: true });
await writeFile(outputPath, html, "utf8");
console.log(`Generated ${outputPath} (${Buffer.byteLength(html).toLocaleString()} bytes)`);
