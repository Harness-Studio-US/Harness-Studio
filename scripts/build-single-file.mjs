import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";

const root = process.cwd();
const dist = resolve(root, "dist-single");
const htmlPath = resolve(dist, "single.html");
const outDir = resolve(root, "github-pages");
const outPath = resolve(outDir, "index.html");

let html = readFileSync(htmlPath, "utf8");

function readAsset(href) {
  return readFileSync(resolve(dist, href.replace(/^\//, "")), "utf8");
}

function dataUri(path) {
  const file = resolve(root, "public", path.replace(/^\//, ""));
  const mime = path.endsWith(".png") ? "image/png" : "image/svg+xml";
  return `data:${mime};base64,${readFileSync(file).toString("base64")}`;
}

// Inline local stylesheets, but leave the Google Fonts stylesheet external.
html = html.replace(
  /<link\b[^>]*rel="stylesheet"[^>]*href="([^"]+)"[^>]*>/gi,
  (match, href) => {
    if (!href.startsWith("/assets/")) return match;
    const css = readAsset(href);
    return `<style>\n${css}\n</style>`;
  }
);

// Inline the module bundle. Function replacers avoid `$` substitution bugs.
html = html.replace(
  /<script\b[^>]*type="module"[^>]*src="([^"]+)"[^>]*><\/script>/gi,
  (_match, src) => {
    const js = readAsset(src).replace(/<\/script/gi, "<\\/script");
    return `<script type="module">\n${js}\n</script>`;
  }
);

// Replace every local brand reference with a self-contained data URI.
const banners = {
  "/brand/harness-banner.png": dataUri("/brand/harness-banner.png"),
  "/brand/harness-mark.png": dataUri("/brand/harness-mark.png"),
  "/favicon.png": dataUri("/favicon.png"),
};

for (const [path, uri] of Object.entries(banners)) {
  html = html.split(path).join(uri);
}

if (/<link\b[^>]*href="\/assets\//i.test(html)) {
  throw new Error("A local stylesheet was not inlined");
}
if (/<script\b[^>]*src="\/assets\//i.test(html)) {
  throw new Error("A local script was not inlined");
}
if (html.includes('src="/brand/') || html.includes('href="/brand/')) {
  throw new Error("A local brand asset was not inlined");
}

mkdirSync(outDir, { recursive: true });
writeFileSync(outPath, html);

const bytes = Buffer.byteLength(html);
console.log(`Wrote ${outPath} (${(bytes / 1024).toFixed(1)} KB)`);
