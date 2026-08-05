import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const siteSlug = process.argv[2] || "soma";
const sourceOrigin = process.argv[3] || "https://cartgenie-template-soma.webflow.io";
const outputRoot = path.resolve(`public/${siteSlug}`);
const researchRoot = path.resolve(`docs/research/${siteSlug}`);
const pageQueue = [new URL("/", sourceOrigin)];
const pageUrls = new Set();
const assetUrls = new Set();
const pageRecords = [];

const assetHosts = new Set([
  "cdn.prod.website-files.com",
  "d3e54v103j8qbb.cloudfront.net",
  "ajax.googleapis.com",
  "fonts.googleapis.com",
  "fonts.gstatic.com",
  "cdn.cartgenie.com",
  "challenges.cloudflare.com",
  "js.stripe.com",
]);

function sanitizeHtml(html) {
  return html
    .replace(/<!--\s*This site was created in Webflow\. https:\/\/webflow\.com\s*-->/gi, "")
    .replace(/<meta\s+content=["']Webflow["']\s+name=["']generator["']\s*\/?>/gi, "")
    .replace(/\sdata-wf-domain=["'][^"']*["']/gi, "")
    .replace(/<style>\.w-webflow-badge\{display:none!important\}<\/style>/gi, "")
    .replace("</head>", "<style>.w-webflow-badge{display:none!important}</style></head>");
}

async function fetchResponse(url) {
  const response = await fetch(url, {
    redirect: "follow",
    headers: { "user-agent": "ROOSA literal reference mirror" },
  });
  if (!response.ok) throw new Error(`${response.status} ${url}`);
  return response;
}

function pageDirectory(url) {
  const clean = url.pathname.replace(/^\/+|\/+$/g, "");
  return clean ? path.join(outputRoot, clean) : outputRoot;
}

function addLinkedUrl(rawHref, baseUrl) {
  if (!rawHref || rawHref.startsWith("#")) return;
  let linked;
  try {
    linked = new URL(rawHref.replaceAll("&amp;", "&"), baseUrl);
  } catch {
    return;
  }
  if (linked.protocol !== "http:" && linked.protocol !== "https:") return;
  linked.hash = "";
  if (linked.origin === sourceOrigin) {
    if (!pageUrls.has(linked.href)) pageQueue.push(linked);
  } else if (assetHosts.has(linked.hostname)) {
    assetUrls.add(linked.href);
  }
}

function rewriteInternalLinks(html, pageUrl) {
  return html.replace(/href=(['"])(.*?)\1/g, (whole, quote, href) => {
    if (!href || href.startsWith("#")) return whole;
    let linked;
    try {
      linked = new URL(href.replaceAll("&amp;", "&"), pageUrl);
    } catch {
      return whole;
    }
    if (linked.origin !== sourceOrigin) return whole;
    const clean = linked.pathname.replace(/^\/+|\/+$/g, "");
    const localPath = clean ? `/${siteSlug}/${clean}/index.html` : `/${siteSlug}/index.html`;
    return `href=${quote}${localPath}${linked.hash}${quote}`;
  });
}

await mkdir(outputRoot, { recursive: true });
await mkdir(researchRoot, { recursive: true });

while (pageQueue.length) {
  const url = pageQueue.shift();
  if (!url || pageUrls.has(url.href)) continue;
  pageUrls.add(url.href);

  let html;
  try {
    html = await (await fetchResponse(url)).text();
  } catch (error) {
    pageRecords.push({ url: url.href, error: String(error) });
    continue;
  }

  for (const match of html.matchAll(/(?:href|src|srcset)=(['"])(.*?)\1/g)) {
    const values = match[2].split(",").map((value) => value.trim().split(/\s+/)[0]);
    for (const value of values) addLinkedUrl(value, url);
  }

  for (const match of html.matchAll(/https:\/\/[^"' <>)]+/g)) {
    addLinkedUrl(match[0], url);
  }

  const directory = pageDirectory(url);
  await mkdir(directory, { recursive: true });
  await writeFile(path.join(directory, "source.html"), sanitizeHtml(html));
  const linkedHtml = rewriteInternalLinks(html, url);
  const localHtml = sanitizeHtml(linkedHtml);
  await writeFile(path.join(directory, "index.html"), localHtml);
  pageRecords.push({ url: url.href, local: path.relative(outputRoot, directory) || "." });
  console.log(`page ${pageRecords.length}: ${url.pathname}`);
}

const assetRecords = [];
const assets = [...assetUrls];
for (let index = 0; index < assets.length; index += 6) {
  const batch = assets.slice(index, index + 6);
  const records = await Promise.all(batch.map(async (url) => {
    const parsed = new URL(url);
    const safePath = decodeURIComponent(parsed.pathname)
      .replace(/^\/+/, "")
      .replaceAll("/", "__")
      .replaceAll("%", "_");
    const filename = `${parsed.hostname}__${safePath || "asset"}`;
    const local = path.join("assets", filename);
    try {
      const response = await fetchResponse(url);
      await mkdir(path.join(outputRoot, "assets"), { recursive: true });
      await writeFile(path.join(outputRoot, local), Buffer.from(await response.arrayBuffer()));
      return { url, local: `/${siteSlug}/${local}` };
    } catch (error) {
      return { url, error: String(error) };
    }
  }));
  assetRecords.push(...records);
  console.log(`assets ${Math.min(index + batch.length, assets.length)}/${assets.length}`);
}

const manifest = {
  source: sourceOrigin,
  capturedAt: new Date().toISOString(),
  pages: pageRecords,
  assets: assetRecords,
};
await writeFile(path.join(outputRoot, "manifest.json"), JSON.stringify(manifest, null, 2));
await writeFile(path.join(researchRoot, "manifest.json"), JSON.stringify(manifest, null, 2));
console.log(`Saved ${pageRecords.length} pages and ${assetRecords.length} referenced assets.`);
