import { cp, mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sourceDirectory = path.join(root, "public", "v5-home");
const outputDirectory = path.join(root, "public", "v6-home");
const emDash = "\u2014";

const homeHeader = String.raw`<header class="roosa-global-header"><div class="roosa-global-header__inner"><a class="roosa-global-header__brand" href="/" aria-label="ROOSA home">ROOSA</a><nav class="roosa-global-header__nav" aria-label="Primary navigation"><a href="/en/shop">Shop</a><a href="/en/product/pink-toilet-paper">Product</a><a href="/en/impact">Impact</a><a href="/en/about">About</a><a href="/en/b2b">B2B</a><a href="/en/journal">Journal</a></nav><a class="roosa-global-header__buy" href="/en/shop">Buy ROOSA</a><button class="roosa-global-header__menu" data-menu-toggle type="button" aria-expanded="false" aria-controls="mobile-menu" aria-label="Open menu"><span aria-hidden="true"></span><span aria-hidden="true"></span><span aria-hidden="true"></span></button></div></header><div class="mobile-menu" id="mobile-menu" role="dialog" aria-modal="true" aria-label="Navigation menu" hidden><nav class="mobile-menu__nav"><a href="/en/shop">Shop</a><a href="/en/product/pink-toilet-paper">Product</a><a href="/en/impact">Impact</a><a href="/en/about">About</a><a href="/en/b2b">B2B</a><a href="/en/journal">Journal</a><a href="/en/shop">Buy ROOSA</a></nav></div>`;

const homeHeaderCss = String.raw`
.roosa-global-header{position:relative;z-index:85;height:72px;color:#241f22;background:#fffaf4;font-family:"Inter Variablefont Opsz Wght",Arial,sans-serif}
.roosa-global-header *,.roosa-global-header *::before,.roosa-global-header *::after{box-sizing:border-box}
.roosa-global-header__inner{width:calc(100% - 64px);height:72px;display:flex;align-items:center;margin-inline:auto}
.roosa-global-header__brand{min-height:44px;display:inline-flex;align-items:center;margin-right:auto;color:#241f22;font-size:24px;font-weight:800;letter-spacing:-.06em;line-height:36px;text-decoration:none}
.roosa-global-header__nav{display:flex;align-items:center}
.roosa-global-header__nav a{min-height:40px;display:inline-flex;align-items:center;padding:8px 16px;color:#241f22;font-size:16px;font-weight:600;letter-spacing:normal;line-height:24px;text-decoration:none;white-space:nowrap}
.roosa-global-header__buy{height:39px;display:inline-flex;align-items:center;margin-left:16px;padding:8px 32px;border:1px solid #241f22;border-radius:999px;color:#fffaf4;background:#241f22;font-size:16px;font-weight:500;letter-spacing:normal;line-height:21px;text-decoration:none;white-space:nowrap}
.roosa-global-header__buy:hover{color:#241f22;background:#ef83b6}
.roosa-global-header__menu{display:none;width:48px;height:48px;flex-direction:column;align-items:center;justify-content:center;padding:0;border:0;background:transparent;color:#241f22}
.roosa-global-header__menu span{width:24px;height:2px;background:currentColor}
.roosa-global-header__menu span+span{margin-top:5px}
.mobile-menu{position:fixed;inset:48px 0 0;z-index:80;padding:40px 20px 70px;color:#fffaf4;background:#241f22;overflow-y:auto}
.mobile-menu__nav{display:flex;flex-direction:column;gap:0}
.mobile-menu__nav a{padding:8px 0;color:#fffaf4;font-size:clamp(42px,10vw,70px);font-weight:650;letter-spacing:-.06em;line-height:.95;text-decoration:none}
body[data-scroll-lock="true"]{overflow:hidden}
@media(max-width:991px){.roosa-global-header,.roosa-global-header__inner{height:48px}.roosa-global-header__inner{width:calc(100% - 64px)}.roosa-global-header__nav,.roosa-global-header__buy{display:none}.roosa-global-header__menu{display:inline-flex}}
`;

async function normalizeDashes(directory, extensions) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      await normalizeDashes(target, extensions);
    } else if (extensions.has(path.extname(entry.name))) {
      const source = await readFile(target, "utf8");
      const normalized = source.replaceAll(emDash, "-");
      if (normalized !== source) await writeFile(target, normalized);
    }
  }
}

const commerceAlignment = `<style id="roosa-v6-commerce-alignment">
.roosa-global-header__buy{border-radius:999px!important}
.product-card-action,.add-to-cart-button,.buy-now-button,.go-to-checkout,.go-to-cart,.footer-buy{border-radius:999px!important}
body{background:#fffaf4!important}
.navigation-bar-container{background:rgba(255,250,244,.96)!important}
.page-heading{font-size:clamp(4rem,6.8vw,6.8rem)!important;line-height:.88!important;letter-spacing:-.065em!important}
.product-detail-section{background:linear-gradient(180deg,#ffd8e9 0,#fffaf4 67%)!important}
.cart-page{background:linear-gradient(145deg,#ffd8e9 0,#fffaf4 65%)!important}
.cart-dropdown{background:#fffaf4!important}
body[data-cart-open=true]{overflow:hidden!important}
@media(max-width:767px){.page-heading{font-size:clamp(3.5rem,14vw,5.5rem)!important;line-height:.9!important}}
</style>`;

function commerceMetadata(route) {
  if (route === "/en/cart") {
    return '<meta name="robots" content="noindex,nofollow">';
  }
  const suffix = route.slice(3);
  return `<link rel="canonical" href="${route}"><link rel="alternate" hreflang="en" href="${route}"><link rel="alternate" hreflang="de" href="/de${suffix}"><link rel="alternate" hreflang="fr" href="/fr${suffix}"><link rel="alternate" hreflang="x-default" href="${route}">`;
}

async function alignCommerce(directory, routeType, rootDirectory = directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      await alignCommerce(target, routeType, rootDirectory);
    } else if (path.extname(entry.name) === ".html") {
      const source = await readFile(target, "utf8");
      if (source.includes("id=\"roosa-v6-commerce-alignment\"")) continue;
      const relativeDirectory = path.relative(rootDirectory, path.dirname(target));
      const route = routeType === "product"
        ? `/en/product/${relativeDirectory || "roosa-pink"}`
        : `/en/${routeType}`;
      const aligned = source
        .replaceAll("/v5-shop/commerce.", "/v6-shop/commerce.")
        .replace("</head>", `${commerceMetadata(route)}${commerceAlignment}</head>`)
        .replace(
          '<nav class="cart-dropdown" data-cart-drawer aria-label="Demo cart">',
          '<nav class="cart-dropdown" data-cart-drawer role="dialog" aria-modal="true" aria-labelledby="demo-cart-title" aria-hidden="true" tabindex="-1">',
        )
        .replace("<h2>Your Cart</h2>", '<h2 id="demo-cart-title">Your Cart</h2>');
      await writeFile(target, aligned);
    }
  }
}

await rm(outputDirectory, { recursive: true, force: true });
await mkdir(outputDirectory, { recursive: true });
await cp(sourceDirectory, outputDirectory, { recursive: true });

const htmlPath = path.join(outputDirectory, "index.html");
let html = await readFile(htmlPath, "utf8");

function replaceOnce(source, search, replacement, label) {
  const first = source.indexOf(search);
  if (first < 0) throw new Error(`V6 home contract failed: ${label}`);
  if (source.indexOf(search, first + search.length) >= 0) {
    throw new Error(`V6 home contract is ambiguous: ${label}`);
  }
  return source.slice(0, first) + replacement + source.slice(first + search.length);
}

const css = String.raw`

/* ROOSA V6: the connected unroll sequence lives quietly behind V5's
   existing team story rather than creating an additional homepage chapter. */
.section_team{position:relative;isolation:isolate;overflow:hidden}
.section_team>.padding-global{position:relative;z-index:2}
.v6-team-sequence{--v6-team-progress:0;position:absolute;z-index:0;top:0;right:0;bottom:0;left:35%;overflow:hidden;pointer-events:none;user-select:none;opacity:.29;mix-blend-mode:multiply;-webkit-mask-image:radial-gradient(ellipse 70% 72% at 56% 50%,#000 40%,rgba(0,0,0,.84) 58%,transparent 83%);mask-image:radial-gradient(ellipse 70% 72% at 56% 50%,#000 40%,rgba(0,0,0,.84) 58%,transparent 83%)}
.v6-team-sequence__fallback,.v6-team-sequence__fallback img,.v6-team-sequence__canvas{position:absolute;inset:0;width:100%;height:100%}
.v6-team-sequence__fallback{display:block;transition:opacity .18s cubic-bezier(.16,1,.3,1)}
.v6-team-sequence__fallback img{display:block;object-fit:contain}
.v6-team-sequence__fallback,.v6-team-sequence__canvas{transform:translateY(calc(var(--v6-team-progress)*5%))}
.v6-team-sequence__canvas{display:block;opacity:0;transition:opacity .18s cubic-bezier(.16,1,.3,1)}
.v6-team-sequence[data-ready=true] .v6-team-sequence__canvas{opacity:1}
.v6-team-sequence[data-ready=true] .v6-team-sequence__fallback{opacity:0}
.section_team .team_component{position:relative}
.section_team .team_heading-wrapper{position:relative}
/* Keep the paper-trail gallery as a family of soft-edge tiles. V5's
   clipped corner treatment reads like a note here, so V6 removes only that
   polygon while preserving the rounded tile language. */
.section_vision .vision_image-wrapper{clip-path:none!important;border-radius:1.75rem!important}
@media(max-width:700px){
  .v6-team-sequence{right:-18%;left:-18%;opacity:.2}
}
@media(prefers-reduced-motion:reduce){
  .v6-team-sequence__canvas{display:none}
  .v6-team-sequence__fallback{opacity:1!important}
}
`;

const teamRoll = String.raw`<div class="v6-team-sequence" data-v6-team-sequence aria-hidden="true"><picture class="v6-team-sequence__fallback"><source media="(prefers-reduced-motion: reduce)" srcset="/media/toilet-scroll/v2/fallback/toilet-paper-fallback.webp"><source media="(max-width: 700px)" srcset="/media/toilet-scroll/v2/mobile/toilet-mobile-0001.webp"><img src="/media/toilet-scroll/v2/desktop/toilet-desktop-0001.webp" alt="" loading="lazy" decoding="async"></picture><canvas class="v6-team-sequence__canvas"></canvas></div>`;

const javascript = String.raw`
<script>
(function(){
  var header=document.querySelector('.roosa-global-header');
  var button=document.querySelector('[data-menu-toggle]');
  var panel=document.querySelector('#mobile-menu');
  if(!header||!button||!panel)return;
  var links=panel.querySelectorAll('a[href]');
  function setOpen(open){
    header.dataset.menuOpen=String(open);button.setAttribute('aria-expanded',String(open));button.setAttribute('aria-label',open?'Close menu':'Open menu');panel.hidden=!open;document.body.dataset.scrollLock=String(open);
    if(open)links[0]?.focus();else button.focus();
  }
  button.addEventListener('click',function(){setOpen(panel.hidden)});
  panel.addEventListener('click',function(event){if(event.target.closest('a'))setOpen(false)});
  document.addEventListener('keydown',function(event){
    if(event.key==='Escape'&&!panel.hidden){event.preventDefault();setOpen(false);return}
    if(event.key!=='Tab'||panel.hidden||!links.length)return;
    var first=links[0],last=links[links.length-1];
    if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus()}
    else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus()}
  });
})();
(function(){
  var section=document.querySelector('#team');
  var stage=document.querySelector('[data-v6-team-sequence]');
  var canvas=stage&&stage.querySelector('canvas');
  if(!section||!stage||!canvas)return;
  var reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
  var mobile=window.matchMedia('(max-width: 700px)');
  var connection=navigator.connection||navigator.mozConnection||navigator.webkitConnection;
  if(reduced.matches||(connection&&(connection.saveData||String(connection.effectiveType).indexOf('2g')>=0))){
    stage.dataset.static='true';
    return;
  }
  var ctx=canvas.getContext('2d',{alpha:false});
  if(!ctx)return;
  var ROOT='/media/toilet-scroll/v2/';
  var BG='#f9f5f4';
  var preset=null,loaded=new Map(),loading=new Set(),queue=[],active=0,wanted=1,drawn=0,raf=0,generation=0,started=false,destroyed=false;
  function currentPreset(){return mobile.matches?{count:94,dir:'mobile',prefix:'toilet-mobile-'}:{count:140,dir:'desktop',prefix:'toilet-desktop-'}}
  function url(frame){return ROOT+preset.dir+'/'+preset.prefix+String(frame).padStart(4,'0')+'.webp'}
  function clamp(value,min,max){return Math.min(max,Math.max(min,value))}
  function resize(){
    var box=stage.getBoundingClientRect(),dpr=Math.min(window.devicePixelRatio||1,2);
    var width=Math.max(1,Math.round(box.width*dpr)),height=Math.max(1,Math.round(box.height*dpr));
    if(canvas.width!==width||canvas.height!==height){canvas.width=width;canvas.height=height;drawn=0}
  }
  function nearest(target){
    if(loaded.has(target))return target;
    for(var distance=1;distance<preset.count;distance++){
      if(target-distance>=1&&loaded.has(target-distance))return target-distance;
      if(target+distance<=preset.count&&loaded.has(target+distance))return target+distance;
    }
    return 0;
  }
  function draw(){
    resize();
    var frame=nearest(wanted),image=loaded.get(frame);
    if(!frame||!image||frame===drawn)return;
    var scale=Math.min(canvas.width/image.naturalWidth,canvas.height/image.naturalHeight)*.9;
    var width=image.naturalWidth*scale,height=image.naturalHeight*scale;
    ctx.fillStyle=BG;ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.drawImage(image,(canvas.width-width)/2,(canvas.height-height)/2+canvas.height*.05,width,height);
    drawn=frame;stage.dataset.ready='true';stage.dataset.frame=String(frame);
  }
  function startLoad(frame){
    if(loaded.has(frame)||loading.has(frame))return false;
    var token=generation,image=new Image();active++;loading.add(frame);image.decoding='async';
    image.onload=function(){if(destroyed||token!==generation)return;active--;loading.delete(frame);loaded.set(frame,image);draw();pump()};
    image.onerror=function(){if(destroyed||token!==generation)return;active--;loading.delete(frame);pump()};
    image.src=url(frame);return true;
  }
  function pump(){while(!destroyed&&active<6&&queue.length){var frame=queue.shift();if(frame)startLoad(frame)}}
  function enqueue(frame,priority){
    if(frame<1||frame>preset.count||loaded.has(frame)||loading.has(frame))return;
    var index=queue.indexOf(frame);
    if(index>=0){if(!priority)return;queue.splice(index,1)}
    priority?queue.unshift(frame):queue.push(frame);
  }
  function prioritise(frame){
    startLoad(frame);
    for(var distance=4;distance>=0;distance--){enqueue(frame-distance,true);if(distance)enqueue(frame+distance,true)}
    pump();
  }
  function seed(){
    enqueue(1,true);enqueue(preset.count,true);
    for(var frame=1;frame<=preset.count;frame+=10)enqueue(frame,false);
    for(var fill=1;fill<=preset.count;fill++)enqueue(fill,false);
    pump();
  }
  function update(){
    raf=0;
    var rect=section.getBoundingClientRect();
    var travel=Math.max(1,rect.height+window.innerHeight*.6);
    var progress=clamp((window.innerHeight*.8-rect.top)/travel,0,1);
    wanted=1+Math.round(progress*(preset.count-1));
    stage.style.setProperty('--v6-team-progress',progress.toFixed(4));
    prioritise(wanted);draw();
  }
  function requestUpdate(){if(!raf)raf=requestAnimationFrame(update)}
  function begin(){
    if(started)return;started=true;preset=currentPreset();seed();update();
    window.addEventListener('scroll',requestUpdate,{passive:true});
    window.addEventListener('resize',requestUpdate);
  }
  function swap(){
    if(!started)return;
    var next=currentPreset();if(next.dir===preset.dir){requestUpdate();return}
    generation++;preset=next;loaded=new Map();loading=new Set();queue=[];active=0;wanted=1;drawn=0;delete stage.dataset.ready;seed();requestUpdate();
  }
  mobile.addEventListener('change',swap);
  if('IntersectionObserver'in window){
    var observer=new IntersectionObserver(function(entries){if(entries[0].isIntersecting){observer.disconnect();begin()}},{rootMargin:'1200px 0px'});
    observer.observe(section);
  }else begin();
})();
</script>
`;

html = replaceOnce(
  html,
  "</style></div><div data-animation=",
  `${homeHeaderCss}${css}</style></div><div data-animation=`,
  "inline style boundary",
);
const navbarStart = '<div data-animation="default" class="navbar_component';
const mainStart = '<main class="main-wrapper">';
const navbarIndex = html.indexOf(navbarStart);
const mainIndex = html.indexOf(mainStart, navbarIndex);
if (navbarIndex < 0 || mainIndex < 0) throw new Error("V6 home contract failed: shared header boundary");
html = `${html.slice(0, navbarIndex)}${homeHeader}${html.slice(mainIndex)}`;
html = replaceOnce(
  html,
  '<section id="team" class="section_team">',
  `<section id="team" class="section_team">${teamRoll}`,
  "team section boundary",
);
html = replaceOnce(
  html,
  "</body></html>",
  `${javascript}</body></html>`,
  "document end",
);
html = replaceOnce(
  html,
  '<meta content="/media/v4/hero-roll-editorial.webp" property="og:image"/>',
  '<link rel="canonical" href="/en"/><link rel="alternate" hreflang="en" href="/en"/><link rel="alternate" hreflang="de" href="/de"/><link rel="alternate" hreflang="fr" href="/fr"/><link rel="alternate" hreflang="x-default" href="/en"/><meta content="/media/v4/hero-roll-editorial.webp" property="og:image"/>',
  "home canonical and language links",
);
html = replaceOnce(
  html,
  'maxlength="256" name="Email" data-name="Email" placeholder="Enter your email" type="email" id="Email" required=""/>',
  'maxlength="256" data-name="Email" placeholder="Enter your email" type="email" id="Email" aria-label="Email address" autocomplete="email" required=""/>',
  "newsletter privacy and email label",
);
html = replaceOnce(
  html,
  "Thank you! Your submission has been received!",
  "Demo only · your email was not sent or stored.",
  "newsletter demo confirmation",
);
html = replaceOnce(
  html,
  '<img src="/media/v4/small-fighter-editorial.webp" loading="lazy" alt="Impact reporting project" class="stats_image"/>',
  '<img src="/media/v6/editorial/roosa-hotel-marble.webp" loading="lazy" alt="Pink ROOSA rolls in a marble bathroom" class="stats_image"/>',
  "impact product image",
);
html = replaceOnce(
  html,
  '<img src="/media/v4/family-bundle-editorial.webp" loading="eager" alt="ROOSA paper trail stage 4" class="vision_image4"/>',
  '<img src="/media/v6/editorial/roosa-terrazzo-vanity.webp" loading="eager" alt="ROOSA paper trail stage 4" class="vision_image4"/>',
  "paper trail product image",
);
html = replaceOnce(
  html,
  '<img src="/media/journal/family-support.jpg" loading="lazy" alt="Impact reporting project" class="stats_image"/>',
  '<img src="/media/v6/editorial/roosa-evening-bathroom.webp" loading="lazy" alt="Pink ROOSA roll in a warm evening bathroom" class="stats_image"/>',
  "impact counter image",
);
html = replaceOnce(
  html,
  '<img class="is-alt" src="/media/v4/wall-holder-editorial.webp" alt="Pink ROOSA roll on a wall holder in a cobalt tiled bathroom"/>',
  '<img class="is-alt" src="/media/v6/editorial/roosa-family-holder.webp" alt="Pink ROOSA roll in everyday use"/>',
  "standard product alternate image",
);
html = replaceOnce(
  html,
  '<img src="/media/v4/family-bundle-editorial.webp" alt="ROOSA family bundle"/>',
  '<img src="/media/v6/editorial/roosa-linen-cupboard.webp" alt="Pink ROOSA rolls stored with fresh towels"/>',
  "family bundle image",
);
html = replaceOnce(
  html,
  '<img class="is-alt" src="/media/v4/topdown-rolls-editorial.webp" alt="Graphic top-down arrangement of pink ROOSA rolls"/>',
  '<img class="is-alt" src="/media/v6/editorial/roosa-morning-flatlay.webp" alt="Top-down bathroom scene with a pink ROOSA roll"/>',
  "family bundle alternate image",
);
html = replaceOnce(
  html,
  '<img src="/media/v4/repeat-delivery-editorial.webp" alt="ROOSA repeat delivery option"/>',
  '<img src="/media/v6/editorial/roosa-delivery-unpacking.webp" alt="Unpacking a delivery of pink ROOSA rolls"/>',
  "repeat delivery image",
);
html = replaceOnce(
  html,
  '<img src="/media/v4/retail-pack-editorial.webp" alt="ROOSA retail pack in a contemporary Swiss shop setting"/>',
  '<img src="/media/v6/editorial/roosa-retail-shelf.webp" alt="ROOSA pack displayed in a contemporary shop"/>',
  "retail image",
);
html = replaceOnce(
  html,
  '<img src="/media/v4/white-roll-cutout.png" loading="eager" alt="ROOSA paper trail stage 7" class="vision_image7"/>',
  '<img src="/media/v6/editorial/roosa-cobalt-guest-wc.webp" loading="eager" alt="ROOSA paper trail stage 7" class="vision_image7"/>',
  "paper trail closing image",
);
html = html.replaceAll(emDash, "-");

await writeFile(htmlPath, html);

for (const route of ["shop", "product", "cart"]) {
  const source = path.join(root, "public", `v5-${route}`);
  const output = path.join(root, "public", `v6-${route}`);
  await rm(output, { recursive: true, force: true });
  await cp(source, output, { recursive: true });
  await normalizeDashes(output, new Set([".html", ".css", ".js", ".json"]));
  await alignCommerce(output, route);
}

const commerceScriptPath = path.join(root, "public", "v6-shop", "commerce.js");
let commerceScript = await readFile(commerceScriptPath, "utf8");
commerceScript = replaceOnce(
  commerceScript,
  "  const KEY = 'roosa-v2-demo-cart';",
  "  const KEY = 'roosa-v2-demo-cart';\n  let returnFocus = null;",
  "commerce focus state",
);
commerceScript = replaceOnce(
  commerceScript,
  "  const read = () => { try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch { return []; } };",
  "  const read = () => { try { const stored=JSON.parse(localStorage.getItem(KEY)||'[]'); if(!Array.isArray(stored)) return []; return stored.slice(0,20).flatMap(item=>{ if(!item||typeof item!=='object'||typeof item.id!=='string'||typeof item.name!=='string'||typeof item.image!=='string') return []; const quantity=Math.min(20,Math.max(1,Math.trunc(Number(item.quantity)||1))); const unitPrice=Math.min(10000,Math.max(0,Number(item.unitPrice)||0)); return [{...item,id:item.id.slice(0,80),name:item.name.slice(0,120),image:item.image.slice(0,240),quantity,unitPrice}]; }); } catch { return []; } };",
  "commerce stored cart validation",
);
commerceScript = replaceOnce(
  commerceScript,
  "  function add(product, quantity = 1) {",
  "  function add(product, quantity = 1, trigger = null) {",
  "commerce add trigger",
);
commerceScript = replaceOnce(
  commerceScript,
  "    write(cart); openCart(); announce(quantity + ' × ' + product.name + ' added to the demo cart.');",
  "    write(cart); openCart(trigger); announce(quantity + ' × ' + product.name + ' added to the demo cart.');",
  "commerce add focus handoff",
);
commerceScript = replaceOnce(
  commerceScript,
  "  function openCart() { document.querySelector('[data-cart-drawer]')?.classList.add('w--open'); document.querySelector('[data-cart-backdrop]')?.classList.add('open'); document.querySelector('[data-cart-close]')?.focus(); }\n  function closeCart() { document.querySelector('[data-cart-drawer]')?.classList.remove('w--open'); document.querySelector('[data-cart-backdrop]')?.classList.remove('open'); }",
  "  function openCart(trigger) { const drawer=document.querySelector('[data-cart-drawer]'); returnFocus=trigger instanceof HTMLElement?trigger:document.activeElement; drawer?.classList.add('w--open'); drawer?.setAttribute('aria-hidden','false'); document.querySelector('[data-cart-backdrop]')?.classList.add('open'); document.body.dataset.cartOpen='true'; document.querySelector('[data-cart-close]')?.focus(); }\n  function closeCart() { const drawer=document.querySelector('[data-cart-drawer]'); if(!drawer?.classList.contains('w--open')) return; drawer.classList.remove('w--open'); drawer.setAttribute('aria-hidden','true'); document.querySelector('[data-cart-backdrop]')?.classList.remove('open'); delete document.body.dataset.cartOpen; returnFocus?.focus(); returnFocus=null; }",
  "commerce dialog lifecycle",
);
commerceScript = replaceOnce(
  commerceScript,
  "    if (target.matches('[data-cart-open]')) { event.preventDefault(); openCart(); }",
  "    if (target.matches('[data-cart-open]')) { event.preventDefault(); openCart(target); }",
  "commerce open trigger",
);
commerceScript = commerceScript.replaceAll(
  "add(JSON.parse(target.dataset.add), Number(document.querySelector('[data-product-quantity]')?.value || 1))",
  "add(JSON.parse(target.dataset.add), Number(document.querySelector('[data-product-quantity]')?.value || 1), target)",
).replaceAll(
  "add(JSON.parse(target.dataset.buy), Number(document.querySelector('[data-product-quantity]')?.value || 1))",
  "add(JSON.parse(target.dataset.buy), Number(document.querySelector('[data-product-quantity]')?.value || 1), target)",
);
commerceScript = replaceOnce(
  commerceScript,
  "  document.addEventListener('keydown', event => { if(event.key==='Escape') closeCart(); });",
  "  document.addEventListener('keydown', event => { const drawer=document.querySelector('[data-cart-drawer]'); if(event.key==='Escape') closeCart(); if(event.key!=='Tab'||!drawer?.classList.contains('w--open')) return; const focusable=[...drawer.querySelectorAll('button:not([disabled]),a[href],input:not([disabled])')]; const first=focusable[0],last=focusable.at(-1); if(event.shiftKey&&document.activeElement===first){event.preventDefault();last?.focus()}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first?.focus()} });",
  "commerce focus trap",
);
await writeFile(commerceScriptPath, commerceScript);

console.log("Prepared V6 home and commerce routes from preserved V5 copies.");
