import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

async function findHtmlFiles(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const filePath = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await findHtmlFiles(filePath));
    else if (entry.name.endsWith(".html")) files.push(filePath);
  }
  return files;
}

function sanitizeHtml(html) {
  return html
    .replace(/<!--\s*This site was created in Webflow\. https:\/\/webflow\.com\s*-->/gi, "")
    .replace(/<meta\s+content=["']Webflow["']\s+name=["']generator["']\s*\/?>/gi, "")
    .replace(/\sdata-wf-domain=["'][^"']*["']/gi, "")
    .replace(/<style>\.w-webflow-badge\{display:none!important\}<\/style>/gi, "")
    .replace(/Created with <a href=["']https:\/\/smootify\.io\/["'] target=["']_blank["']>Smootify<\/a> \| /gi, "")
    .replace(/<a href=["']https:\/\/www\.udesly\.com\/["'][^>]*>\s*<img[^>]*>\s*<\/a>/gi, "")
    .replace("</head>", "<style>.w-webflow-badge{display:none!important}</style></head>");
}

const files = await findHtmlFiles("public");
let changed = 0;
for (const file of files) {
  const before = await readFile(file, "utf8");
  const after = sanitizeHtml(before);
  if (after !== before) {
    await writeFile(file, after);
    changed += 1;
  }
}

console.log(`Sanitized ${changed} HTML files.`);
