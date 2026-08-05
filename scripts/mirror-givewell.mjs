import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const sourceUrl = "https://givewell.webflow.io/";
const outputRoot = path.resolve("public/givewell");
const assetRoot = path.join(outputRoot, "assets");

function sanitizeHtml(html) {
  return html
    .replace(/<!--\s*This site was created in Webflow\. https:\/\/webflow\.com\s*-->/gi, "")
    .replace(/<meta\s+content=["']Webflow["']\s+name=["']generator["']\s*\/?>/gi, "")
    .replace(/\sdata-wf-domain=["'][^"']*["']/gi, "")
    .replace(/<style>\.w-webflow-badge\{display:none!important\}<\/style>/gi, "")
    .replace("</head>", "<style>.w-webflow-badge{display:none!important}</style></head>");
}

async function fetchBytes(url) {
  const response = await fetch(url, { headers: { "user-agent": "ROOSA reference-clone research" } });
  if (!response.ok) throw new Error(`${response.status} ${url}`);
  return Buffer.from(await response.arrayBuffer());
}

const html = (await fetchBytes(sourceUrl)).toString("utf8");
await mkdir(outputRoot, { recursive: true });
await writeFile(path.join(outputRoot, "source.html"), sanitizeHtml(html));

// Webflow injects its editor badge on non-Webflow hostnames. The source page does
// not show that badge, so suppress only that environment-specific insertion.
const localHtml = sanitizeHtml(html);
await writeFile(path.join(outputRoot, "index.html"), localHtml);

const discovered = new Set(
  [...html.matchAll(/https:\/\/cdn\.prod\.website-files\.com\/[^"' <>)]+/g)]
    .map((match) => match[0].replaceAll("&amp;", "&")),
);

const primaryCss = [...discovered].find((url) => url.includes("/css/") && url.endsWith(".css"));
if (primaryCss) {
  const css = (await fetchBytes(primaryCss)).toString("utf8");
  for (const match of css.matchAll(/https:\/\/[^)'" ]+/g)) discovered.add(match[0]);
}

const manifest = [];
const urls = [...discovered];
for (let index = 0; index < urls.length; index += 4) {
  const batch = urls.slice(index, index + 4);
  const saved = await Promise.all(batch.map(async (url) => {
    const parsed = new URL(url);
    const segments = parsed.pathname.split("/").filter(Boolean);
    const filename = decodeURIComponent(segments.at(-1) || "asset").replaceAll("/", "-");
    const directory = segments.includes("css") ? "css" : segments.includes("js") ? "js" : "media";
    const relative = path.join("assets", directory, filename);
    const target = path.join(outputRoot, relative);
    await mkdir(path.dirname(target), { recursive: true });
    await writeFile(target, await fetchBytes(url));
    return { url, local: `/givewell/${relative}` };
  }));
  manifest.push(...saved);
  console.log(`mirrored ${Math.min(index + 4, urls.length)}/${urls.length}`);
}

await writeFile(path.join(assetRoot, "manifest.json"), JSON.stringify(manifest, null, 2));
console.log(`Saved source HTML and ${manifest.length} referenced assets.`);
