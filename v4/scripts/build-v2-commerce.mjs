import { mkdir, rm, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const publicDir = join(scriptDir, "..", "public");
const shopDir = join(publicDir, "v2-shop");
const productDir = join(publicDir, "v2-product");
const cartDir = join(publicDir, "v2-cart");

const products = [
  {
    id: "roosa-standard",
    slug: "pink-toilet-paper",
    name: "ROOSA Pink Toilet Paper",
    eyebrow: "The everyday original",
    price: "[PRODUCT_PRICE]",
    numericPrice: 12.9,
    pack: "[PACK_SIZE] · [ROLL_COUNT] rolls",
    image: "/media/products/pink-pack.jpg",
    alternate: "/media/products/pink-roll.webp",
    description: "ROOSA’s signature eight-roll pink toilet paper pack, featuring Carsten Stahl and the original child-protection message. All prices and stock shown here are simulated demo data.",
    action: "Add to demo cart",
    purchasable: true,
    stock: "[STOCK_STATUS]",
  },
  {
    id: "roosa-family",
    slug: "family-bundle",
    name: "ROOSA Family Bundle",
    eyebrow: "More paper, fewer deliveries",
    price: "[BUNDLE_PRICE]",
    numericPrice: 39.9,
    pack: "[BUNDLE_PACK_SIZE] · [BUNDLE_ROLL_COUNT] rolls",
    image: "/media/products/hero-pack.png",
    alternate: "/media/products/pink-pack.jpg",
    description: "Four original ROOSA packs grouped for larger households. Availability, price and shipping are fully interactive demo values.",
    action: "Add to demo cart",
    purchasable: true,
    stock: "[STOCK_STATUS]",
  },
  {
    id: "roosa-subscription",
    slug: "subscription",
    name: "ROOSA Repeat Delivery",
    eyebrow: "Optional subscription concept",
    price: "[SUBSCRIPTION_PRICE]",
    numericPrice: 11.6,
    pack: "[SUBSCRIPTION_PACK_SIZE] · [DELIVERY_FREQUENCY]",
    image: "/media/v4/pink-roll-cutout.png",
    alternate: "/media/v4/white-roll-cutout.png",
    description: "Explore a simulated repeat-delivery flow with selectable frequency and transparent cancellation copy. No subscription is created.",
    action: "Explore demo terms",
    purchasable: false,
    stock: "[SUBSCRIPTION_STATUS]",
  },
  {
    id: "roosa-b2b",
    slug: "b2b-supply",
    name: "ROOSA for Business",
    eyebrow: "For offices, hospitality & retail",
    price: "[B2B_QUOTE]",
    numericPrice: 0,
    pack: "[B2B_MINIMUM_QUANTITY] · [DELIVERY_REGION]",
    image: "/media/v4/retail-pack-editorial.webp",
    alternate: "/media/journal/field-team.jpg",
    description: "A demo enquiry path for organisations interested in the original ROOSA pack, quoted against quantity, logistics and market availability.",
    action: "Request a quote",
    purchasable: false,
    stock: "[B2B_AVAILABILITY]",
  },
];

const css = String.raw`
@import url('/soma/assets/cdn.prod.website-files.com__686ef869a09253982be59f5a__css__cartgenie-template-soma.webflow.shared.9a22208ce.css');
@font-face{font-family:"Inter Variablefont Opsz Wght";src:url("/givewell/assets/media/6802eb69f5be53c035b06487_Inter-VariableFont_opsz,wght.ttf") format("truetype");font-style:normal;font-weight:100 900;font-display:swap}
:root{--roosa-pink:#ef83b6;--roosa-light:#ffd8e9;--graphite:#241f22;--paper:#fffaf4;--muted:#756b70;--line:rgba(36,31,34,.16);--green:#204f45}
*{box-sizing:border-box}html{background:var(--paper)}body{margin:0;color:var(--graphite);background:var(--paper);font-family:"Sorts Mill Goudy",Georgia,serif;font-size:17px;line-height:1.5}button,input{font:inherit}button,a{-webkit-tap-highlight-color:transparent;transition:color .2s cubic-bezier(.16,1,.3,1),background-color .2s cubic-bezier(.16,1,.3,1),border-color .2s cubic-bezier(.16,1,.3,1),transform .2s cubic-bezier(.16,1,.3,1)}a{color:inherit}button:focus-visible,a:focus-visible,input:focus-visible{outline:3px solid #c92f78;outline-offset:3px}.page-content{overflow:clip}.container{width:min(calc(100% - 48px),1110px);max-width:1110px;margin-inline:auto}.section{padding-block:120px}.navigation-bar-container{height:82px;background:var(--paper);border-bottom:1px solid var(--line);position:relative;z-index:20}.navigation-bar{height:100%}.nav-shell{width:min(calc(100% - 48px),1110px);height:100%;margin:auto;display:grid;grid-template-columns:1fr auto 1fr;align-items:center}.navigation-menu-left{justify-self:start;text-transform:uppercase;letter-spacing:.12em;font-size:12px}.navigation-menu-left:hover,.navigation-controls>a:hover,.footer a:hover{text-decoration-color:var(--roosa-pink);text-decoration-thickness:2px;text-underline-offset:.25em}.w-nav-brand{display:block;width:142px}.w-nav-brand img{width:100%;height:auto}.navigation-controls{justify-self:end;display:flex;align-items:center;gap:20px}.cart-button{min-height:44px;border:0;background:transparent;text-transform:uppercase;letter-spacing:.12em;font-size:12px;cursor:pointer;display:flex;align-items:center;gap:5px}.cart-button:hover{color:#9a3567}.page-heading{max-width:820px;margin:0 0 90px;font-size:clamp(48px,6vw,82px);font-weight:400;line-height:.98;letter-spacing:-.04em}.page-heading em{color:#c92f78;font-style:normal}.row.product-grid-row{width:1110px;margin:0 -15px;display:flex;flex-wrap:wrap}.column.product-column{width:369.992px;height:554.984px;padding:0 15px;margin-bottom:60px;display:flex;flex-direction:column;text-align:left;position:relative}.product-image-container{width:339.992px;height:424.984px;min-height:424.984px;margin-bottom:24px;position:relative;display:block;overflow:hidden;border-radius:0;background:var(--roosa-light)}.product-grid-image{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;transition:opacity 320ms cubic-bezier(.16,1,.3,1),transform 320ms cubic-bezier(.16,1,.3,1)}.product-image-hover{z-index:1;opacity:0}.product-image-container:hover .product-image-hover{opacity:1;transform:rotate(2deg) scale(1.02)}.product-image-container:hover .product-grid-image:not(.product-image-hover){opacity:0;transform:rotate(-2deg) scale(1.02)}.product-grid-title{width:339.992px;min-height:52px;margin-bottom:5px;display:grid;grid-template-columns:minmax(0,1fr) auto;align-items:start;gap:12px;text-decoration:none}.product-grid-title:hover .product-grid-heading{text-decoration:underline;text-decoration-color:var(--roosa-pink);text-decoration-thickness:2px;text-underline-offset:.2em}.product-grid-heading{margin:0;font-size:24px;line-height:26px;font-weight:400;white-space:normal;overflow:visible}.price-text{padding-top:5px;font-family:Arial,sans-serif;font-size:12px;letter-spacing:.08em;white-space:nowrap}.product-commerce-overlay{position:absolute;z-index:3;right:29px;top:348px;left:29px;display:grid;grid-template-columns:1fr auto;gap:8px;align-items:end}.product-meta-paper{padding:9px 11px;background:rgba(255,250,244,.94);box-shadow:0 5px 18px rgba(36,31,34,.08);font:11px/1.35 Arial,sans-serif;letter-spacing:.03em}.product-meta-paper strong{display:block;margin-top:3px;color:#9a3567}.product-card-action{min-height:48px;display:inline-flex;align-items:center;justify-content:center;padding:9px 14px;border:1px solid var(--graphite);background:var(--graphite);color:var(--paper);font:700 11px/1.1 Arial,sans-serif;letter-spacing:.07em;text-transform:uppercase;text-decoration:none;cursor:pointer}.product-card-action:hover{background:var(--roosa-pink);color:var(--graphite)}.product-card-action:active{transform:translateY(1px)}.product-card-action:disabled{cursor:not-allowed;opacity:.64}.product-card-action.quote{background:var(--roosa-pink);color:var(--graphite)}.store-note{margin-top:40px;padding:28px;border-top:1px solid var(--line);border-bottom:1px solid var(--line);display:grid;grid-template-columns:1fr 1fr;gap:40px;font-family:Arial,sans-serif;font-size:14px}.commerce-kicker{font:700 11px/1 Arial,sans-serif;letter-spacing:.14em;text-transform:uppercase}.footer{padding:80px 0;background:var(--graphite);color:var(--paper)}.footer-row-roosa{display:grid;grid-template-columns:2fr 1fr 1fr;gap:60px}.footer h2{font-size:48px;font-weight:400;line-height:1}.footer a{display:block;margin:8px 0}.demo-note{color:color-mix(in srgb,var(--paper) 65%,var(--graphite));font:13px/1.5 Arial,sans-serif}
/* Soma product-detail DOM and gallery geometry */
.product-detail-section{padding-top:80px}.row.product-row{display:flex;justify-content:space-around;margin-inline:-15px}.mobile-title-container{display:none}.column.product-images-column{width:50%;max-width:50%;padding:0 15px}.product-main-frame{position:relative;width:100%;aspect-ratio:1/1.14;overflow:hidden;background:var(--roosa-light)}.product-image{width:100%;height:100%;object-fit:cover}.product-images-tabs{display:flex;margin:15px -7.5px 0}.product-image-tab{width:25%;padding:0 7.5px;opacity:.5;border:0;background:none;cursor:pointer}.product-image-tab.w--current{opacity:1}.product-image-tab-thumbnail{width:100%;aspect-ratio:1;object-fit:cover}.column.product-description-column{width:100%;max-width:445px;padding:0 15px;display:flex;flex-direction:column}.product-title-container{text-align:center}.heading-two.product-heading{margin:0 0 15px;font-size:40px;line-height:50px;font-weight:400}.price-container{display:flex;justify-content:center;gap:12px}.product-description{margin-top:120px}.product-description-text{font-family:Arial,sans-serif;font-size:15px}.product-options{margin-top:60px;border-top:1px solid var(--line)}.product-option{min-height:54px;padding:8px 0;border-bottom:1px solid var(--line);display:flex;align-items:center;justify-content:space-between}.product-option-title{font:700 11px/1 Arial,sans-serif;letter-spacing:.12em;text-transform:uppercase}.stock-state{color:#9a3567;font:700 12px/1.3 Arial,sans-serif}.purchase-wrapper{width:100%;max-width:678.5px;height:166px;margin-top:20px;display:flex;flex-direction:column;gap:8px}.quantity-row{width:100%;height:38px;display:flex;align-items:center;justify-content:space-between}.quantity-input{display:grid;grid-template-columns:19.1953px 64px 19.1953px;gap:8px;align-items:center}.quantity-button{width:19.1953px;height:19.1953px;padding:0;border:0;background:none;font:20px/19px Arial,sans-serif;cursor:pointer}.quantity-button:disabled{opacity:.3;cursor:not-allowed}.quantity-number{width:64px;height:38px;border:1px solid var(--line);background:transparent;text-align:center;font:14px Arial,sans-serif}.add-to-cart-button,.buy-now-button{width:100%;height:56px;min-height:56px;border:1px solid var(--graphite);font:700 12px Arial,sans-serif;letter-spacing:.1em;text-transform:uppercase;cursor:pointer}.add-to-cart-button{background:var(--graphite);color:var(--paper)}.buy-now-button{background:transparent;color:var(--graphite)}.add-to-cart-button:disabled,.buy-now-button:disabled{cursor:not-allowed;opacity:.45}.feedback{min-height:22px;margin-top:10px;color:var(--green);font:700 13px Arial,sans-serif}.facts-strip{margin-top:90px;border-top:1px solid var(--line);display:grid;grid-template-columns:repeat(4,1fr)}.fact{min-height:130px;padding:22px;border-right:1px solid var(--line)}.fact:last-child{border-right:0}.fact strong,.fact span{display:block}.fact span{margin-top:24px;font:14px Arial,sans-serif}.related-products-section{padding-top:90px}.section-title-heading{font-size:42px;font-weight:400}.editorial-band{margin-top:90px;padding:90px 0;background:var(--roosa-pink)}.editorial-grid{display:grid;grid-template-columns:1fr 1fr;gap:80px}.editorial-grid h2{margin:0;font-size:54px;font-weight:400;line-height:1}.editorial-grid p{font-family:Arial,sans-serif}
/* Bovist cart DOM/state patterns */
.cart-backdrop{position:fixed;inset:0;z-index:90;background:rgba(36,31,34,.38);opacity:0;pointer-events:none;transition:opacity .2s}.cart-backdrop.open{opacity:1;pointer-events:auto}.cart-dropdown{position:fixed;z-index:100;inset:0 0 0 auto;width:min(100%,440px);padding:24px;background:var(--paper);transform:translateX(100%);transition:transform .25s;display:grid;grid-template-rows:auto 1fr auto}.cart-dropdown.w--open{transform:none}.cart-head{display:flex;align-items:center;justify-content:space-between;padding-bottom:20px;border-bottom:1px solid var(--line)}.cart-head h2{margin:0;font-size:32px;font-weight:400}.cart-close{width:48px;height:48px;border:1px solid var(--line);border-radius:50%;background:none;cursor:pointer}.cart-items{overflow:auto}.cart-item-wrapper{display:grid;grid-template-columns:96px 1fr;gap:15px;padding:20px 0;border-bottom:1px solid var(--line)}.cart-image-wrapper{position:relative;width:96px;height:120px;background:var(--roosa-light)}.cart-item-image{width:100%;height:100%;object-fit:cover}.remove-button{position:absolute;top:5px;right:5px;width:28px;height:28px;border:0;border-radius:50%;background:var(--graphite);color:white;cursor:pointer}.cart-item-title{font-size:19px}.cart-item-data{font-family:Arial,sans-serif;font-size:13px}.cart-qty-controls{display:flex;align-items:center;gap:9px;margin-top:18px}.cart-qty-controls button{width:32px;height:32px;border:1px solid var(--line);background:transparent;cursor:pointer}.cart-footer{padding-top:20px;border-top:1px solid var(--line);font-family:Arial,sans-serif}.flex.space-between{display:flex;justify-content:space-between}.go-to-cart,.go-to-checkout{width:100%;height:56px;margin-top:10px;display:flex;align-items:center;justify-content:center;border:1px solid var(--graphite);text-decoration:none;font-weight:700}.go-to-cart{background:transparent}.go-to-checkout{background:var(--graphite);color:var(--paper);opacity:.5;cursor:not-allowed}.cart-page{min-height:70vh}.cart-page-grid{display:grid;grid-template-columns:1fr 360px;gap:60px}.cart-page-summary{align-self:start;padding:30px;background:white}.empty-cart-label{padding:80px 0;text-align:center;font-size:32px}.sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}
@media(max-width:991px){.container{width:min(calc(100% - 40px),740px)}.row.product-grid-row{width:auto;margin-inline:-15px}.column.product-column{width:50%}.product-image-container,.product-grid-title{width:100%}.row.product-row{gap:30px}.column.product-description-column{max-width:390px}.product-description{margin-top:60px}.cart-page-grid{grid-template-columns:1fr}}
@media(max-width:767px){.section{padding-block:70px}.nav-shell{width:calc(100% - 32px)}.navigation-menu-left span{display:none}.page-heading{margin-bottom:55px}.column.product-column{width:100%;max-width:369.992px;margin-inline:auto}.row.product-row{flex-direction:column}.mobile-title-container{display:block;margin-bottom:30px}.desktop-product-title{display:none}.column.product-images-column,.column.product-description-column{width:100%;max-width:none}.product-description{margin-top:0}.product-options{margin-top:30px}.facts-strip{grid-template-columns:1fr 1fr}.fact:nth-child(2){border-right:0}.editorial-grid,.store-note,.footer-row-roosa{grid-template-columns:1fr;gap:30px}.editorial-grid h2{font-size:42px}}
@media(max-width:420px){.container{width:calc(100% - 30px)}.column.product-column{height:524.984px;padding-inline:0;flex-direction:column;align-items:stretch}.product-image-container,.product-grid-title{width:100%;max-width:none}.product-grid-title{margin-left:0}.product-commerce-overlay{grid-template-columns:1fr}.product-card-action{justify-self:start}.navigation-controls>a{display:none}.facts-strip{grid-template-columns:1fr}.fact{border-right:0;border-bottom:1px solid var(--line)}.cart-dropdown{padding:16px}}
@media(prefers-reduced-motion:reduce){*,*::before,*::after{scroll-behavior:auto!important;transition-duration:.01ms!important}}
.add-to-cart-button,.buy-now-button{display:flex;align-items:center;justify-content:center;text-decoration:none}.add-to-cart-button:hover{background:var(--roosa-pink);color:var(--graphite)}.buy-now-button:hover{background:var(--roosa-light)}.add-to-cart-button:active,.buy-now-button:active{transform:translateY(1px)}
.purchase-wrapper{height:auto;min-height:172px}.quantity-row{height:44px}.quantity-input{grid-template-columns:44px 64px 44px}.quantity-button{width:44px;height:44px}.cart-qty-controls button{width:44px;height:44px}.remove-button{width:44px;height:44px}

/* ROOSA landing-page system — geometry retained from the referenced storefront */
html{scroll-behavior:smooth}body{font-family:Arial,Helvetica,sans-serif;font-size:16px;background:#f5f3ee}h1,h2,h3,.product-grid-heading,.cart-head h2{font-family:Arial,Helvetica,sans-serif;font-weight:650;letter-spacing:-.055em}.container{width:min(calc(100% - 6vw),1312px);max-width:1312px}.section{padding-block:clamp(100px,10vw,160px)}
.navigation-bar-container{position:sticky;top:0;height:72px;z-index:50;background:rgba(245,243,238,.95);border-bottom:1px solid rgba(36,31,34,.13);backdrop-filter:blur(14px)}.nav-shell{width:min(calc(100% - 6vw),1312px);grid-template-columns:150px 1fr auto;gap:24px}.w-nav-brand{width:130px}.commerce-nav{display:flex;justify-content:center;gap:clamp(16px,2.1vw,30px)}.commerce-nav a,.navigation-controls a,.cart-button{font-size:11px;font-weight:750;letter-spacing:.08em;text-transform:uppercase;text-decoration:none}.commerce-nav a{position:relative}.commerce-nav a::after{content:"";position:absolute;right:0;bottom:-5px;left:0;height:1px;background:currentColor;transform:scaleX(0);transform-origin:right;transition:transform .18s}.commerce-nav a:hover::after{transform:scaleX(1);transform-origin:left}.navigation-controls{gap:9px}.nav-buy{min-height:48px;display:inline-flex;align-items:center;padding:0 20px;color:var(--paper);background:var(--graphite);border:1px solid var(--graphite)}.nav-buy:hover{color:var(--graphite);background:var(--roosa-pink)}
.page-heading{max-width:1080px;margin:0 0 clamp(70px,9vw,130px);font-size:clamp(4.4rem,8.5vw,8.6rem);font-weight:650;line-height:.84;letter-spacing:-.075em}.page-heading em{color:inherit}.commerce-kicker{font-family:Arial,Helvetica,sans-serif;font-size:11px;font-weight:750}.commerce-kicker + .page-heading{margin-top:26px}.row.product-grid-row{width:auto;margin-inline:-12px}.column.product-column{width:33.333%;height:auto;min-height:610px;padding-inline:12px;margin-bottom:76px}.product-image-container{width:100%;height:auto;min-height:0;aspect-ratio:.8;margin-bottom:22px;background:linear-gradient(145deg,#ffd8e9,#ef83b6)}.product-grid-title{width:100%}.product-grid-heading{font-size:clamp(24px,2.2vw,34px);line-height:.95}.product-commerce-overlay{right:26px;top:auto;bottom:90px;left:26px}.product-meta-paper{font-family:Arial,Helvetica,sans-serif;border-top:1px dashed rgba(36,31,34,.32);box-shadow:0 10px 30px rgba(36,31,34,.08)}.product-card-action{min-height:50px}.store-note{margin-top:20px;padding:32px 0;border-top:2px dashed var(--line);border-bottom:2px dashed var(--line)}
.product-detail-section{padding-top:clamp(70px,8vw,120px);background:linear-gradient(180deg,#ffd8e9 0,#f5f3ee 67%)}.row.product-row{gap:clamp(35px,7vw,110px);justify-content:space-between}.column.product-images-column{padding:0;width:55%;max-width:690px}.column.product-description-column{padding:0;max-width:540px}.product-main-frame{aspect-ratio:.95;background:linear-gradient(145deg,#ef83b6,#ffd8e9)}.product-title-container{text-align:left}.heading-two.product-heading{margin:18px 0 22px;font-size:clamp(3.8rem,6vw,7rem);font-weight:650;letter-spacing:-.075em;line-height:.84}.price-container{justify-content:flex-start}.product-description{margin-top:clamp(45px,7vw,100px)}.product-description-text{font-size:clamp(16px,1.3vw,19px);line-height:1.55}.product-options{margin-top:38px;border-top:2px dashed var(--line)}.product-option{min-height:64px}.purchase-wrapper{margin-top:28px}.add-to-cart-button,.buy-now-button{min-height:56px}.facts-strip{margin-top:clamp(75px,9vw,130px);border-top:2px dashed var(--line)}.fact{min-height:170px;padding:28px}.fact span{margin-top:52px}.editorial-band{margin:0;padding:clamp(100px,11vw,165px) 0;background:var(--green);color:var(--paper);border-block:2px dashed rgba(255,255,255,.25)}.editorial-grid{grid-template-columns:minmax(0,1.2fr) minmax(280px,.8fr);gap:clamp(50px,8vw,120px)}.editorial-grid h2{max-width:12ch;font-size:clamp(3.5rem,6vw,6.8rem);font-weight:650;letter-spacing:-.07em;line-height:.86}.editorial-grid p{font-size:17px;line-height:1.6}.section-title-heading{max-width:13ch;margin:20px 0 70px;font-size:clamp(3.3rem,6vw,6.4rem);font-weight:650;letter-spacing:-.07em;line-height:.87}
.cart-page{min-height:78vh;background:linear-gradient(145deg,#ffd8e9 0,#f5f3ee 65%)}.cart-page-summary{padding:34px;background:rgba(255,250,244,.82);border-top:2px dashed var(--line)}.cart-page-summary h2{font-size:34px}.cart-dropdown{background:#f5f3ee}.cart-head{border-bottom:2px dashed var(--line)}.cart-item-title{font-size:20px;font-weight:650}.empty-cart-label{font-size:clamp(28px,4vw,48px);font-weight:650;letter-spacing:-.045em}
.footer{position:relative;overflow:hidden;padding:clamp(90px,10vw,150px) 0 42px;background:linear-gradient(158deg,#c52d77 0%,#8b315f 39%,#241f22 77%)}.footer::before{content:"ROOSA";position:absolute;right:-2vw;bottom:-3vw;color:rgba(255,255,255,.035);font-size:clamp(10rem,24vw,25rem);font-weight:800;letter-spacing:-.1em;line-height:.7}.commerce-footer-cta{position:relative;min-height:clamp(470px,53vw,690px);display:grid;grid-template-columns:minmax(0,1.15fr) minmax(300px,.85fr);align-items:center;gap:clamp(30px,7vw,110px)}.commerce-footer-cta h2{max-width:10ch;margin:24px 0 30px;font-size:clamp(3.8rem,7.4vw,8rem);font-weight:650;line-height:.84;letter-spacing:-.075em}.commerce-footer-cta p{max-width:47ch;font-size:clamp(17px,1.5vw,21px)}.footer-buy{min-height:50px;display:inline-flex!important;align-items:center;margin-top:26px!important;padding:0 22px;border:1px solid var(--paper);font:750 11px Arial,sans-serif;letter-spacing:.08em;text-transform:uppercase;text-decoration:none}.footer-product{position:relative;min-height:430px;display:grid;place-items:center}.footer-product::before{content:"";position:absolute;width:92%;aspect-ratio:1;border:2px dashed rgba(255,255,255,.28);border-radius:50%}.footer-product img{position:relative;width:min(100%,580px);filter:drop-shadow(0 38px 48px rgba(36,31,34,.24));transform:rotate(3deg)}.footer-perforation{margin-block:clamp(60px,7vw,100px);border-top:2px dashed rgba(255,255,255,.34)}.footer-row-roosa{position:relative;grid-template-columns:1.7fr 1fr 1fr}.footer-identity img{width:min(250px,100%);filter:brightness(0) invert(1)}.footer-identity p{max-width:29ch}.commerce-footer-bottom{position:relative;margin-top:70px;padding-top:20px;border-top:1px solid rgba(255,255,255,.16);font:12px Arial,sans-serif;color:rgba(255,255,255,.65)}.demo-note{font-family:Arial,Helvetica,sans-serif}
@media(max-width:991px){.nav-shell{grid-template-columns:130px 1fr}.commerce-nav{display:none}.navigation-controls{grid-column:2}.column.product-column{width:50%}.commerce-footer-cta{grid-template-columns:1fr}.footer-product{order:-1;min-height:340px}}
@media(max-width:767px){.container{width:calc(100% - 40px)}.page-heading{font-size:clamp(4rem,16vw,6.5rem)}.column.product-column{width:100%;max-width:none}.product-commerce-overlay{bottom:92px}.row.product-row{gap:42px}.column.product-images-column,.column.product-description-column{width:100%;max-width:none}.heading-two.product-heading{font-size:clamp(3.8rem,15vw,6rem)}.editorial-grid{grid-template-columns:1fr}.footer-product{min-height:290px}.footer-row-roosa{grid-template-columns:1fr 1fr}.footer-identity{grid-column:1/-1}.commerce-footer-cta h2{font-size:clamp(3.5rem,16vw,5.4rem)}}
@media(max-width:420px){.navigation-controls{gap:4px}.nav-buy{display:none}.column.product-column{height:auto;min-height:570px}.product-commerce-overlay{right:12px;left:12px}.footer-row-roosa{grid-template-columns:1fr}}

/* Exact shared-header measurements from the approved landing page */
body{font-family:"Inter Variablefont Opsz Wght",Arial,sans-serif}.container{padding-inline:0!important}.page-heading,.product-grid-heading,.heading-two.product-heading,.section-title-heading,.editorial-grid h2,.cart-head h2{font-family:"Inter Variablefont Opsz Wght",Arial,sans-serif}.navigation-bar-container{height:72px;background:rgba(255,250,244,.96);border-bottom:0}.navigation-bar-container *{font-style:normal}.navigation-bar{height:72px!important;padding:0!important;display:block!important}.nav-shell{width:calc(100% - 64px)!important;max-width:none!important;height:72px!important;margin-inline:auto!important;display:flex;gap:0}.w-nav-brand{width:auto;margin-right:auto;font-family:"Inter Variablefont Opsz Wght",Arial,sans-serif;font-size:24px;font-weight:800;letter-spacing:-.06em;line-height:36px;text-decoration:none}.commerce-nav{gap:0;margin-left:auto}.commerce-nav a{min-height:40px;display:inline-flex;align-items:center;padding:8px 16px;font-size:16px;font-weight:600;letter-spacing:normal;line-height:24px;text-transform:none}.navigation-controls{flex:0 0 auto!important;margin-left:8px;gap:8px}.cart-button{min-height:40px;padding:8px;font-size:16px;font-weight:600;letter-spacing:normal;line-height:24px;text-transform:none}.nav-buy{min-height:39px;padding:8px 32px;font-size:16px!important;font-weight:500!important;letter-spacing:normal!important;line-height:20.8px;text-transform:none!important}.commerce-menu{display:none}
.footer-product-cluster{position:relative;min-height:500px}.footer-product-cluster img{position:absolute;height:auto;filter:drop-shadow(0 30px 42px rgba(36,31,34,.24))}.footer-product-pack{right:4%;bottom:8%;width:min(82%,540px);transform:rotate(3deg)}.footer-product-roll{top:2%;left:-4%;width:min(38%,230px);transform:rotate(-13deg)}.footer-product-sheet{right:-2%;top:8%;width:min(30%,190px);transform:rotate(10deg)}
@media(max-width:991px){.nav-shell{width:calc(100% - 40px)!important}.nav-buy{display:none}.commerce-menu{display:block}.commerce-menu summary{width:48px;height:48px;display:flex;flex-direction:column;justify-content:center;align-items:center;gap:5px;cursor:pointer;list-style:none}.commerce-menu summary::-webkit-details-marker{display:none}.commerce-menu summary span{width:24px;height:2px;background:var(--graphite)}.commerce-menu nav{position:fixed;top:72px;right:0;left:0;min-height:calc(100dvh - 72px);display:flex;flex-direction:column;padding:40px 20px 70px;color:var(--paper);background:var(--graphite)}.commerce-menu nav a{padding:8px 0;font-size:clamp(42px,10vw,70px);font-weight:650;letter-spacing:-.06em;line-height:.95;text-decoration:none}.footer-product-cluster{order:-1;min-height:390px}}
@media(max-width:767px){.navigation-bar-container,.navigation-bar,.nav-shell{height:64px!important}.w-nav-brand{font-size:22px}.commerce-menu nav{top:64px;min-height:calc(100dvh - 64px)}.footer-product-cluster{min-height:320px}}

/* One isolated header contract shared with every ROOSA route */
.roosa-global-header{position:relative;z-index:85;height:72px;color:#241f22;background:#fffaf4;font-family:"Inter Variablefont Opsz Wght",Arial,sans-serif;font-style:normal}.roosa-global-header *{box-sizing:border-box;font-style:normal}.roosa-global-header__inner{width:calc(100% - 64px);height:72px;display:flex;align-items:center;margin-inline:auto}.roosa-global-header__brand{margin-right:auto;color:#241f22;font-size:24px;font-weight:800;letter-spacing:-.06em;line-height:36px;text-decoration:none}.roosa-global-header__nav{display:flex;align-items:center}.roosa-global-header__nav a{min-height:40px;display:inline-flex;align-items:center;padding:8px 16px;color:#241f22;font-size:16px;font-weight:600;letter-spacing:normal;line-height:24px;text-decoration:none;white-space:nowrap}.roosa-global-header__buy{min-height:39px;display:inline-flex;align-items:center;margin-left:16px!important;padding:8px 32px;color:#fffaf4;background:#241f22;font-size:16px;font-weight:500;letter-spacing:normal;line-height:20.8px;text-decoration:none;white-space:nowrap}.roosa-global-header__buy:hover{color:#241f22;background:#ef83b6}.roosa-global-header__mobile{display:none}.commerce-cart-fab{position:fixed;right:24px;bottom:24px;z-index:80;min-height:48px;padding:10px 18px;border:1px solid #241f22;color:#fffaf4;background:#241f22;font:600 14px/1 "Inter Variablefont Opsz Wght",Arial,sans-serif;cursor:pointer}.commerce-cart-fab:hover{color:#241f22;background:#ef83b6}
@media(max-width:991px){.roosa-global-header,.roosa-global-header__inner{height:48px}.roosa-global-header__inner{width:calc(100% - 40px)}.roosa-global-header__brand{font-size:22px;line-height:32px}.roosa-global-header__nav,.roosa-global-header__buy{display:none}.roosa-global-header__mobile{display:block;margin-left:auto}.roosa-global-header__mobile summary{width:48px;height:48px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:5px;list-style:none;cursor:pointer}.roosa-global-header__mobile summary::-webkit-details-marker{display:none}.roosa-global-header__mobile summary span{width:24px;height:2px;background:#241f22}.roosa-global-header__mobile nav{position:fixed;inset:48px 0 0;display:flex;flex-direction:column;padding:40px 20px 70px;color:#fffaf4;background:#241f22}.roosa-global-header__mobile nav a{padding:8px 0;color:#fffaf4;font-size:clamp(42px,10vw,70px);font-weight:650;letter-spacing:-.06em;line-height:.95;text-decoration:none}.commerce-cart-fab{right:16px;bottom:16px}}
.roosa-global-header__buy{height:38.8px;min-height:0;border:1px solid #241f22}
@media(max-width:991px){.roosa-global-header__inner{width:calc(100% - 64px)}.roosa-global-header__brand{font-size:24px;line-height:36px}}
.go-to-checkout{opacity:1;cursor:pointer}.go-to-checkout:disabled{opacity:.42;cursor:not-allowed}.demo-checkout-status{min-height:0;margin-top:14px;padding:0;font:700 13px/1.45 Arial,sans-serif}.demo-checkout-status:not(:empty){padding:14px;background:var(--roosa-light);border-left:3px solid var(--roosa-pink)}

/* V4 production-polish pass */
.product-card-visual{position:relative;width:100%;margin-bottom:22px}
.product-card-visual .product-image-container{margin-bottom:0}
.product-commerce-overlay{right:14px;bottom:14px;left:14px}
.product-grid-heading{font-size:clamp(22px,1.75vw,28px)}
.product-grid-title{min-height:0;grid-template-columns:minmax(0,1fr);gap:8px}
.product-grid-price-container{min-width:0}
.price-text{padding-top:0;white-space:normal}
.cart-dropdown{visibility:hidden;transition:transform .25s cubic-bezier(.16,1,.3,1),visibility 0s linear .25s}
.cart-dropdown.w--open{visibility:visible;transition-delay:0s}
.roosa-global-header__brand{min-height:44px;display:inline-flex;align-items:center}
.roosa-global-header__mobile:not([open]) nav{display:none}
.product-images-tabs{gap:8px;margin-inline:0}
.product-image-tab{flex:1;padding:0}
.quantity-number{height:44px}
@media(min-width:1200px){
  #key-products .column.product-column{width:25%;min-height:550px}
  #key-products .product-commerce-overlay{grid-template-columns:1fr}
  #key-products .product-card-action{justify-self:start}
}
@media(max-width:767px){
  .column.product-column{min-height:0;margin-bottom:56px}
  .product-card-visual{margin-bottom:16px}
  .product-commerce-overlay{grid-template-columns:1fr}
  .product-card-action{justify-self:start}
  .product-grid-title{grid-template-columns:minmax(0,1fr) auto;align-items:end}
  .product-grid-heading{font-size:clamp(24px,8vw,32px)}
  .footer-row-roosa a{min-height:44px;display:flex;align-items:center;margin:0}
}
@media(max-width:420px){
  .product-grid-title{grid-template-columns:1fr}
  .product-commerce-overlay{right:10px;bottom:10px;left:10px}
  .product-meta-paper{font-size:10px}
  .product-card-action{min-height:44px}
}
`;

const js = String.raw`
(() => {
  const KEY = 'roosa-v2-demo-cart';
  const read = () => { try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch { return []; } };
  const write = (cart) => { localStorage.setItem(KEY, JSON.stringify(cart)); render(); };
  const money = (cart) => cart.length ? new Intl.NumberFormat('de-CH',{style:'currency',currency:'CHF'}).format(cart.reduce((sum,item)=>sum+(Number(item.unitPrice)||0)*item.quantity,0)) : '—';
  const esc = (value) => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
  function add(product, quantity = 1) {
    const cart = read(); const item = cart.find(x => x.id === product.id);
    if (item) item.quantity += Math.max(1, quantity); else cart.push({...product, quantity: Math.max(1, quantity)});
    write(cart); openCart(); announce(quantity + ' × ' + product.name + ' added to the demo cart.');
  }
  function update(id, delta) { const cart = read(); const item = cart.find(x => x.id === id); if (item) item.quantity = Math.max(1, item.quantity + delta); write(cart); }
  function remove(id) { write(read().filter(x => x.id !== id)); }
  function announce(message) { document.querySelectorAll('[data-feedback]').forEach(el => { el.textContent = message; }); }
  function openCart() { document.querySelector('[data-cart-drawer]')?.classList.add('w--open'); document.querySelector('[data-cart-backdrop]')?.classList.add('open'); document.querySelector('[data-cart-close]')?.focus(); }
  function closeCart() { document.querySelector('[data-cart-drawer]')?.classList.remove('w--open'); document.querySelector('[data-cart-backdrop]')?.classList.remove('open'); }
  function itemsMarkup(cart) { return cart.length ? cart.map(item => '<cart-item><div class="cart-item-wrapper"><div class="cart-image-wrapper"><button data-remove="'+esc(item.id)+'" class="remove-button" aria-label="Remove '+esc(item.name)+'">×</button><img src="'+esc(item.image)+'" alt="" class="cart-item-image"></div><div class="cart-item-data mini-cart"><div class="cart-item-title">'+esc(item.name)+'</div><div>'+esc(item.pack)+'</div><div>'+esc(item.price)+'</div><quantity-input><div class="cart-qty-controls"><button data-minus="'+esc(item.id)+'" '+(item.quantity <= 1 ? 'disabled' : '')+' aria-label="Decrease quantity">−</button><span>'+item.quantity+'</span><button data-plus="'+esc(item.id)+'" aria-label="Increase quantity">+</button></div></quantity-input></div></div></cart-item>').join('') : '<div class="empty-cart-label">Your demo cart is empty.</div>'; }
  function render() { const cart=read(); const count=cart.reduce((sum,x)=>sum+x.quantity,0); document.querySelectorAll('[data-cart-count]').forEach(el=>el.textContent=count); document.querySelectorAll('[data-cart-items]').forEach(el=>el.innerHTML=itemsMarkup(cart)); document.querySelectorAll('[data-cart-total]').forEach(el=>el.textContent=money(cart)); document.querySelectorAll('[data-demo-checkout]').forEach(el=>el.disabled=!cart.length); }
  async function demoCheckout(button) {
    const cart=read(); if (!cart.length) return;
    const original=button.textContent; button.disabled=true; button.textContent='Creating demo order…';
    try {
      const response=await fetch('/api/demo/checkout',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({items:cart})});
      const result=await response.json(); if(!response.ok) throw new Error(result.message||'Demo checkout failed');
      document.querySelectorAll('[data-checkout-status]').forEach(el=>el.textContent='Demo order '+result.order.reference+' created · '+result.order.totalFormatted+' · no payment collected.');
      announce('Demo order '+result.order.reference+' created. No payment was collected.');
    } catch(error) {
      document.querySelectorAll('[data-checkout-status]').forEach(el=>el.textContent=error.message||'The demo checkout could not be created.');
    } finally { button.textContent=original; render(); }
  }
  document.addEventListener('click', event => {
    const target = event.target.closest('button,a'); if (!target) return;
    if (target.matches('[data-cart-open]')) { event.preventDefault(); openCart(); }
    if (target.matches('[data-cart-close],[data-cart-backdrop]')) { event.preventDefault(); closeCart(); }
    if (target.dataset.add) { event.preventDefault(); add(JSON.parse(target.dataset.add), Number(document.querySelector('[data-product-quantity]')?.value || 1)); }
    if (target.dataset.buy) { event.preventDefault(); add(JSON.parse(target.dataset.buy), Number(document.querySelector('[data-product-quantity]')?.value || 1)); announce('Demo item added. Shopify checkout is not configured.'); }
    if (target.dataset.minus) update(target.dataset.minus,-1); if (target.dataset.plus) update(target.dataset.plus,1); if (target.dataset.remove) remove(target.dataset.remove);
    if (target.matches('[data-qty-minus],[data-qty-plus]')) { const input=document.querySelector('[data-product-quantity]'); const delta=target.matches('[data-qty-plus]')?1:-1; input.value=Math.max(1,Number(input.value||1)+delta); document.querySelector('[data-qty-minus]').disabled=Number(input.value)<=1; }
    if (target.dataset.gallery) { document.querySelector('[data-main-image]').src=target.dataset.gallery; document.querySelectorAll('[data-gallery]').forEach(el=>el.classList.toggle('w--current',el===target)); }
    if (target.matches('[data-demo-checkout]')) { event.preventDefault(); demoCheckout(target); }
  });
  document.addEventListener('input', event => { if (event.target.matches('[data-product-quantity]')) { event.target.value=Math.max(1,Number(event.target.value||1)); document.querySelector('[data-qty-minus]').disabled=Number(event.target.value)<=1; } });
  document.addEventListener('keydown', event => { if(event.key==='Escape') closeCart(); });
  window.addEventListener('storage', render); render();
})();
`;

function htmlEscape(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[character]);
}

function cartData(product) {
  return htmlEscape(JSON.stringify({ id: product.id, name: product.name, price: product.price, unitPrice: product.numericPrice, pack: product.pack, image: product.image }));
}

function header() {
  return `<header class="roosa-global-header"><div class="roosa-global-header__inner"><a class="roosa-global-header__brand" href="/" aria-label="ROOSA home">ROOSA</a><nav class="roosa-global-header__nav" aria-label="Primary navigation"><a href="/en/shop">Shop</a><a href="/en/product/pink-toilet-paper">Product</a><a href="/en/impact">Impact</a><a href="/en/about">About</a><a href="/en/b2b">B2B</a><a href="/en/journal">Journal</a></nav><a class="roosa-global-header__buy" href="/en/shop">Buy ROOSA</a><details class="roosa-global-header__mobile"><summary aria-label="Open navigation"><span></span><span></span><span></span></summary><nav><a href="/en/shop">Shop</a><a href="/en/product/pink-toilet-paper">Product</a><a href="/en/impact">Impact</a><a href="/en/about">About</a><a href="/en/b2b">B2B</a><a href="/en/journal">Journal</a><a href="/en/shop">Buy ROOSA</a></nav></details></div></header>`;
}

function cartDrawer() {
  return `<button class="commerce-cart-fab" data-cart-open type="button">Cart (<span data-cart-count>0</span>)</button><button class="cart-backdrop" data-cart-backdrop aria-label="Close cart"></button><smootify-cart data-open="on-add" class="smootify-cart"><nav class="cart-dropdown" data-cart-drawer aria-label="Demo cart"><div class="cart-head"><h2>Your Cart</h2><button class="cart-close" data-cart-close type="button" aria-label="Close cart">×</button></div><div class="cart-items" data-cart-items></div><div class="cart-footer"><div class="flex space-between padding"><strong>Subtotal</strong><span data-cart-total>—</span></div><a href="/en/cart" class="go-to-cart">View Cart</a><button class="go-to-checkout" data-demo-checkout type="button" disabled>Create demo order</button><div class="demo-checkout-status" data-checkout-status aria-live="polite"></div><p class="demo-note">Demo mode: cart data stays in this browser. Checkout creates a simulated order; no payment or personal data is collected.</p></div></nav></smootify-cart>`;
}

function footer() {
  return `<footer class="footer"><div class="container commerce-footer-cta"><div><span class="commerce-kicker">The pink paper trail</span><h2>Make an everyday purchase count.</h2><p>Pink toilet paper with a documented purpose—from the bathroom shelf to measurable impact.</p><a class="footer-buy" href="/en/shop">Buy ROOSA ↗</a></div><div class="footer-product-cluster" aria-hidden="true"><img class="footer-product-pack" src="/media/products/hero-pack.png" alt=""><img class="footer-product-roll" src="/media/v4/pink-roll-cutout.png" alt=""><img class="footer-product-sheet" src="/media/v4/white-roll-cutout.png" alt=""></div></div><div class="container footer-perforation"></div><div class="container footer-row-roosa"><div class="footer-identity"><img src="/media/brand/roosa-wordmark.png" alt="ROOSA"><p>An everyday product with a documented paper trail.</p></div><div><strong>Explore</strong><a href="/en/shop">Shop</a><a href="/en/product/pink-toilet-paper">Product</a><a href="/en/impact">Impact</a><a href="/en/about">About</a></div><div><strong>Company</strong><a href="/en/b2b">B2B</a><a href="/en/journal">Journal</a><a href="/en/contact">Contact</a></div></div><div class="container commerce-footer-bottom">© ${new Date().getFullYear()} ROOSA · Demo commerce experience</div></footer>`;
}

function shell(title, body) {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${htmlEscape(title)}</title><meta name="description" content="ROOSA demo commerce experience with a working browser cart and simulated checkout."><link rel="stylesheet" href="/v2-shop/commerce.css"></head><body><div class="page-content">${header()}${body}${footer()}</div>${cartDrawer()}<div class="sr-only" aria-live="polite" data-feedback></div><script src="/v2-shop/commerce.js"></script></body></html>`;
}

function card(product) {
  const action = product.purchasable
    ? `<button type="button" class="product-card-action" data-add="${cartData(product)}">${product.action}</button>`
    : `<a class="product-card-action quote" href="/en/product/${product.slug}">${product.action}</a>`;
  return `<div role="listitem" class="column product-column w-dyn-item"><div class="product-card-visual"><a href="/en/product/${product.slug}" class="product-image-container w-inline-block"><img alt="" src="${product.alternate}" class="product-grid-image product-image-hover"><img alt="${htmlEscape(product.name)}" src="${product.image}" class="product-grid-image"></a><div class="product-commerce-overlay"><div class="product-meta-paper">${htmlEscape(product.pack)}<strong>${htmlEscape(product.stock)}</strong></div>${action}</div></div><a href="/en/product/${product.slug}" class="product-grid-title w-inline-block"><h2 class="product-grid-heading">${htmlEscape(product.name)}</h2><div class="price-container product-grid-price-container"><div class="price-text text-uppercase">${htmlEscape(product.price)}</div></div></a></div>`;
}

function storePage() {
  const body = `<main><section id="key-products" class="section"><div class="container"><span class="commerce-kicker">ROOSA store · demo mode</span><h1 class="page-heading">Pink toilet paper with a <em>documented purpose.</em></h1><div class="w-dyn-list"><div role="list" class="row product-grid-row w-dyn-items">${products.map(card).join("")}</div></div><div class="store-note"><p><strong>Working demo cart.</strong><br>Add items, change quantities and create a simulated order. Cart state is stored only in this browser; no payment or personal data is collected.</p><p><strong>Demo impact receipt.</strong><br>Each simulated purchase shows [CONTRIBUTION_AMOUNT] per [CONTRIBUTION_UNIT], connected to [PARTNER_NAME]. Replace these values with audited production records before launch.</p></div></div></section></main>`;
  return shell("Shop ROOSA | Commerce preview", body);
}

function productPage(product) {
  const enabled = product.purchasable;
  const related = products.filter((candidate) => candidate.id !== product.id).slice(0, 3);
  const data = cartData(product);
  const purchaseControls = enabled
    ? `<div class="purchase-wrapper"><div class="quantity-row"><label class="product-option-title" for="quantity-${product.slug}">Quantity</label><quantity-input><div class="quantity-input"><button data-qty-minus class="quantity-button" type="button" disabled aria-label="Decrease quantity">−</button><input data-product-quantity class="quantity-number" id="quantity-${product.slug}" type="number" min="1" value="1"><button data-qty-plus class="quantity-button" type="button" aria-label="Increase quantity">+</button></div></quantity-input></div><button class="add-to-cart-button" data-add="${data}" type="button">Add to demo cart</button><button class="buy-now-button" data-buy="${data}" type="button">Buy now — demo</button></div>`
    : `<div class="purchase-wrapper"><a class="add-to-cart-button" href="${product.slug === "b2b-supply" ? "/en/b2b" : "/en/contact"}">${product.action}</a><a class="buy-now-button" href="/en/shop">Back to shop</a></div>`;
  const body = `<main><section class="section product-detail-section"><div class="container"><div class="product-title-container mobile-title-container"><span class="commerce-kicker">${product.eyebrow}</span><h1 class="heading-two product-heading">${product.name}</h1><div class="price-container"><div class="price-text text-uppercase">${product.price}</div></div></div><div class="row product-row"><div class="column product-images-column"><div class="w-tabs"><div class="w-tab-content"><div class="product-main-frame w-tab-pane w--tab-active"><img data-main-image alt="${htmlEscape(product.name)}" src="${product.image}" class="product-image"></div></div><div class="product-images-tabs w-tab-menu"><button data-gallery="${product.image}" class="product-image-tab w-inline-block w-tab-link w--current"><img alt="${htmlEscape(product.name)} pack" src="${product.image}" class="product-image-tab-thumbnail"></button><button data-gallery="${product.alternate}" class="product-image-tab w-inline-block w-tab-link"><img alt="${htmlEscape(product.name)} detail" src="${product.alternate}" class="product-image-tab-thumbnail"></button><button data-gallery="/media/products/embossed-roll.webp" class="product-image-tab w-inline-block w-tab-link"><img alt="Paper texture detail" src="/media/products/embossed-roll.webp" class="product-image-tab-thumbnail"></button></div></div></div><div class="column product-description-column"><div class="product-title-container desktop-product-title"><span class="commerce-kicker">${product.eyebrow}</span><h1 class="heading-two product-heading">${product.name}</h1><div class="price-container"><div class="price-text text-uppercase">${product.price}</div></div></div><div class="product-description"><div class="product-description-text w-richtext"><p>${product.description}</p></div><div class="product-options"><div class="product-option"><span class="product-option-title">Pack</span><span>${product.pack}</span></div><div class="product-option"><span class="product-option-title">Inventory</span><span class="stock-state">${product.stock}</span></div><div class="product-option"><span class="product-option-title">Contribution</span><span>[CONTRIBUTION_AMOUNT]</span></div></div>${purchaseControls}<p class="feedback" aria-live="polite" data-feedback>${enabled ? "Working demo cart and simulated checkout are available." : "Use the demo enquiry path for this option."}</p></div></div></div><div class="facts-strip"><div class="fact"><strong>Sheets per roll</strong><span>[SHEETS_PER_ROLL]</span></div><div class="fact"><strong>Ply</strong><span>[PLY_COUNT]</span></div><div class="fact"><strong>Material</strong><span>[PAPER_MATERIAL]</span></div><div class="fact"><strong>Made in</strong><span>[MANUFACTURING_COUNTRY]</span></div></div></div></section><section class="editorial-band"><div class="container editorial-grid"><h2>From bathroom shelf to a documented paper trail.</h2><div><p>Contribution: [CONTRIBUTION_AMOUNT] per [CONTRIBUTION_UNIT]. Recipient: [PARTNER_NAME]. Transfer frequency: [TRANSFER_FREQUENCY].</p><p>Certification status: [CERTIFICATION_STATUS]. Proof: [CERTIFICATE_URL].</p></div></div></section><section class="section related-products-section"><div class="container"><div class="section-title-container"><span class="commerce-kicker">Related ROOSA options</span><h2 class="section-title-heading">Keep the paper trail going.</h2></div><div class="w-dyn-list"><div role="list" class="row product-grid-row w-dyn-items">${related.map(card).join("")}</div></div></div></section></main>`;
  return shell(`${product.name} | ROOSA`, body);
}

function cartPage() {
  const body = `<main class="section cart-page"><div class="container"><span class="commerce-kicker">Order simulator · no payment</span><h1 class="page-heading">Your demo cart.</h1><div class="cart-page-grid"><div data-cart-items></div><aside class="cart-page-summary"><h2>Order summary</h2><div class="flex space-between"><strong>Subtotal</strong><span data-cart-total>—</span></div><p class="demo-note">Shipping: [SHIPPING_RATE]. Taxes: [TAX_AMOUNT].</p><button class="go-to-checkout" data-demo-checkout type="button" disabled>Create demo order</button><div class="demo-checkout-status" data-checkout-status aria-live="polite"></div><a class="go-to-cart" href="/en/shop">Continue shopping</a></aside></div></div></main>`;
  return shell("Your demo cart | ROOSA", body);
}

await Promise.all([shopDir, productDir, cartDir].map((directory) => rm(directory, { recursive: true, force: true })));
await Promise.all([shopDir, productDir, cartDir].map((directory) => mkdir(directory, { recursive: true })));
await writeFile(join(shopDir, "commerce.css"), css);
await writeFile(join(shopDir, "commerce.js"), js);
await writeFile(join(shopDir, "index.html"), storePage());
await Promise.all(products.map(async (product) => {
  const directory = join(productDir, product.slug);
  await mkdir(directory, { recursive: true });
  await writeFile(join(directory, "index.html"), productPage(product));
}));
await writeFile(join(productDir, "index.html"), productPage(products[0]));
await writeFile(join(cartDir, "index.html"), cartPage());

console.log(`Generated ${products.length + 3} ROOSA commerce files across v2-shop, v2-product and v2-cart.`);
