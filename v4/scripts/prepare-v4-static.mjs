import { cpSync, existsSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const publicDir = join(process.cwd(), "public");
const routeGroups = ["home", "shop", "product", "cart"];

const imageReplacements = new Map([
  ["/media/products/white-pack.jpg", "/media/v4/family-bundle-editorial.webp"],
  ["/media/products/pink-roll.webp", "/media/v4/repeat-delivery-editorial.webp"],
  ["/media/products/hero-pack.png", "/media/v4/family-bundle-editorial.webp"],
]);

const v4HeroCss = `
/* V4 photography direction */
.hero_visuals{background:#eaa1b7!important}
.hero_visuals:after{content:"";position:absolute;inset:0;z-index:1;background:linear-gradient(90deg,rgba(239,176,190,.82) 0%,rgba(239,176,190,.44) 30%,transparent 62%),linear-gradient(0deg,rgba(36,31,34,.64) 0%,transparent 45%);pointer-events:none}
.hero_img.roosa-hero-pack{display:block!important;inset:0!important;width:100%!important;height:100%!important;max-width:none!important;object-fit:cover!important;object-position:center!important;filter:none!important;transform:scale(calc(1.02 + var(--roosa-hero-progress,0)*.035))!important;transform-origin:center}
.roosa-hero-roll,.roosa-paper-strip{display:none!important}
.hero_content ._2col_grid{position:relative;z-index:4}
.vision_image-wrapper img,.stats_image-wrapper img,.roosa-product-media img{object-fit:cover}
.vision_image2,.vision_image7{object-fit:contain!important;padding:clamp(.75rem,2vw,2rem);background:color-mix(in srgb,var(--roosa-pink) 76%,var(--roosa-paper))}
.vision_image5{object-fit:contain!important;object-position:center!important;padding:clamp(1rem,3vw,3rem);background:var(--roosa-paper)}
.roosa-products-heading.roosa-mask{clip-path:none!important;opacity:1!important}
.navbar_logo-link{min-height:44px;display:inline-flex;align-items:center}
.roosa-partner-bar{padding:clamp(2rem,4vw,4rem) 5vw;background:var(--roosa-paper);color:var(--roosa-graphite)}
.roosa-partner-bar__inner{width:min(100%,90rem);margin:auto;display:grid;grid-template-columns:minmax(10rem,.7fr) repeat(2,minmax(13rem,1fr));align-items:center;gap:clamp(.75rem,2vw,2rem)}
.roosa-partner-bar__label{font-size:.72rem;font-weight:800;letter-spacing:.12em;text-transform:uppercase}
.roosa-partner-bar figure{min-height:7rem;margin:0;padding:1rem 2rem;display:flex;align-items:center;justify-content:center;border:1px solid rgba(36,31,34,.14);background:var(--roosa-paper)}
.roosa-partner-bar img{display:block;width:100%;height:5rem;object-fit:contain;object-position:center}
.footer_image-wrapper{display:flex!important;align-items:flex-start!important;justify-content:flex-start!important;overflow:visible!important}
.footer_image-wrapper .footer_logo{display:block!important;width:min(32vw,24rem)!important;max-width:100%!important;height:auto!important;max-height:7rem!important;object-fit:contain!important;object-position:left center!important}
@media(max-width:767px){
  .hero_img.roosa-hero-pack{display:block!important;object-position:61% center!important}
  .hero_visuals:after{background:linear-gradient(180deg,rgba(239,176,190,.68) 0%,transparent 48%),linear-gradient(0deg,rgba(36,31,34,.7) 0%,transparent 58%)}
  .roosa-partner-bar__inner{grid-template-columns:1fr 1fr}
  .roosa-partner-bar__label{grid-column:1/-1}
  .roosa-partner-bar figure{min-height:5.5rem;padding:.75rem}
  .roosa-partner-bar img{height:4rem}
  .footer_image-wrapper .footer_logo{width:min(60vw,18rem)!important;max-height:5rem!important}
  .roosa-hero-actions a,.roosa-footer-links a{min-height:44px;display:flex;align-items:center}
}
`;

const partnerStrip = `
<section class="roosa-partner-bar" aria-label="Impact partners">
  <div class="roosa-partner-bar__inner">
    <span class="roosa-partner-bar__label">Working alongside</span>
    <figure><img src="/media/impact/partner-kinderschutz.svg" loading="eager" alt="Bündnis Kinderschutz Schweiz"/></figure>
    <figure><img src="/media/impact/partner-stoppt-mobbing.svg" loading="eager" alt="Stoppt Mobbing"/></figure>
  </div>
</section>`;

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
  const source = join(publicDir, `v3-${group}`);
  const target = join(publicDir, `v4-${group}`);
  if (!existsSync(source)) throw new Error(`Missing ${source}`);

  cpSync(source, target, { recursive: true, force: true });

  for (const file of htmlFiles(target)) {
    let html = readFileSync(file, "utf8");
    html = html
      .replaceAll("/v3-shop/", "/v4-shop/")
      .replaceAll("/v3-product/", "/v4-product/")
      .replaceAll("/v3-cart/", "/v4-cart/");
    for (const [from, to] of imageReplacements) html = html.replaceAll(from, to);

    if (group === "home" && file.endsWith("index.html")) {
      html = html
        .replaceAll(
          'content="/media/v4/family-bundle-editorial.webp" property="og:image"',
          'content="/media/v4/hero-roll-editorial.webp" property="og:image"',
        )
        .replaceAll(
          'content="/media/v4/family-bundle-editorial.webp" name="twitter:image"',
          'content="/media/v4/hero-roll-editorial.webp" name="twitter:image"',
        )
        .replace(
          '<img src="/media/v4/family-bundle-editorial.webp" alt="ROOSA pink toilet paper pack" class="hero_img roosa-hero-pack"/>',
          '<img src="/media/v4/hero-roll-editorial.webp" alt="ROOSA pink toilet paper in a colourful contemporary bathroom" class="hero_img roosa-hero-pack"/>',
        )
        .replace(
          '<img class="is-alt" src="/media/v4/repeat-delivery-editorial.webp" alt="Pink toilet roll close-up"/>',
          '<img class="is-alt" src="/media/v4/wall-holder-editorial.webp" alt="Pink ROOSA roll on a wall holder in a cobalt tiled bathroom"/>',
        )
        .replace(
          '<img class="is-alt" src="/media/products/pink-pack.jpg" alt="ROOSA pink pack close-up"/>',
          '<img class="is-alt" src="/media/v4/topdown-rolls-editorial.webp" alt="Graphic top-down arrangement of pink ROOSA rolls"/>',
        )
        .replace(
          '<img class="is-alt" src="/media/products/embossed-roll.webp" alt="Embossed pink paper detail"/>',
          '<img class="is-alt" src="/media/v4/macro-texture-editorial.webp" alt="Macro view of the embossed pink paper texture"/>',
        )
        .replace(
          '<img src="/media/v4/family-bundle-editorial.webp" alt="ROOSA business supply option"/><img class="is-alt" src="/media/v4/family-bundle-editorial.webp" alt="ROOSA paper packs"/>',
          '<img src="/media/v4/retail-pack-editorial.webp" alt="ROOSA retail pack in a contemporary Swiss shop setting"/><img class="is-alt" src="/media/journal/field-team.jpg" alt="ROOSA team member beside the branded field vehicle"/>',
        )
        .replaceAll(
          "https://cdn.prod.website-files.com/68011fed23249a9699d7b42b/6802fc54afb8dcd46830bebd_pinkish.avif",
          "/media/v4/macro-texture-editorial.webp",
        )
        .replaceAll(
          "https://cdn.prod.website-files.com/68011fed23249a9699d7b42b/6802f7ee988ceb30729e28a2_purple_blue.avif",
          "/media/v4/topdown-rolls-editorial.webp",
        )
        .replace(
          'loading="lazy" alt="ROOSA" class="footer_logo"',
          'loading="eager" alt="ROOSA" class="footer_logo"',
        )
        .replace("</header><section id=\"stats\"", `</header>${partnerStrip}<section id="stats"`)
        .replace("</style></div><div data-animation", `${v4HeroCss}</style></div><div data-animation`);
    }

    writeFileSync(file, html);
  }
}

console.log("Prepared V4 static routes with the new editorial image set.");
