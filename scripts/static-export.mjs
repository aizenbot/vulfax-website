#!/usr/bin/env node
/**
 * Builds a static copy of the site for GitHub Pages (or any static host).
 *
 *   NEXT_BASE_PATH=/vulfax-website \
 *   NEXT_PUBLIC_SITE_URL=https://user.github.io/vulfax-website \
 *   npm run build:pages
 *
 * A static host cannot run the proxy, the contact API or on-demand routes, so
 * those files are moved aside for the build and always restored afterwards.
 * The script then writes what they used to provide: a language-detecting
 * index.html redirect, robots.txt, sitemap.xml and .nojekyll.
 */
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, renameSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const stash = join(root, ".export-stash");
const out = join(root, "out");

const serverOnly = [
  "src/proxy.ts",
  "src/app/api",
  "src/app/[locale]/[...rest]",
  "src/app/[locale]/opengraph-image.tsx",
  "src/app/sitemap.ts",
  "src/app/robots.ts",
];

const basePath = (process.env.NEXT_BASE_PATH ?? "").replace(/\/$/, "");
const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? `http://localhost:3000${basePath}`).replace(/\/$/, "");
const locales = ["en", "ar"];

function moveAside() {
  if (existsSync(stash)) {
    throw new Error(".export-stash already exists — a previous run did not restore. Run `node scripts/static-export.mjs --restore`.");
  }
  for (const rel of serverOnly) {
    const from = join(root, rel);
    if (!existsSync(from)) continue;
    const to = join(stash, rel);
    mkdirSync(dirname(to), { recursive: true });
    renameSync(from, to);
  }
}

function restore() {
  if (!existsSync(stash)) return;
  for (const rel of serverOnly) {
    const from = join(stash, rel);
    if (!existsSync(from)) continue;
    const to = join(root, rel);
    mkdirSync(dirname(to), { recursive: true });
    renameSync(from, to);
  }
  rmSync(stash, { recursive: true, force: true });
}

function writeStaticExtras() {
  writeFileSync(join(out, ".nojekyll"), "");

  writeFileSync(
    join(out, "index.html"),
    `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>VULFAX</title>
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<link rel="canonical" href="${siteUrl}/en/">
<meta http-equiv="refresh" content="0; url=${basePath}/en/">
<script>
  var langs = navigator.languages || [navigator.language || "en"];
  var ar = langs.some(function (l) { return String(l).toLowerCase().indexOf("ar") === 0; });
  location.replace("${basePath}/" + (ar ? "ar" : "en") + "/" + location.hash);
</script>
<style>html{background:#08090D;color:#F4F6FC;font-family:system-ui,sans-serif}</style>
</head>
<body><p><a href="${basePath}/en/" style="color:#9299AB">VULFAX</a></p></body>
</html>
`,
  );

  writeFileSync(join(out, "robots.txt"), `User-Agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`);

  const alternates = locales
    .map((l) => `    <xhtml:link rel="alternate" hreflang="${l}" href="${siteUrl}/${l}/"/>`)
    .join("\n");
  const urls = locales
    .map(
      (l) => `  <url>
    <loc>${siteUrl}/${l}/</loc>
${alternates}
    <changefreq>monthly</changefreq>
    <priority>${l === "en" ? "1.0" : "0.9"}</priority>
  </url>`,
    )
    .join("\n");
  writeFileSync(
    join(out, "sitemap.xml"),
    `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls}
</urlset>
`,
  );
}

if (process.argv.includes("--restore")) {
  restore();
  console.log("Restored server-only files.");
  process.exit(0);
}

let status = 1;
try {
  moveAside();
  rmSync(out, { recursive: true, force: true });
  // Stale generated route types would still reference the moved files.
  rmSync(join(root, ".next"), { recursive: true, force: true });
  const nextBin = join(root, "node_modules", "next", "dist", "bin", "next");
  const result = spawnSync(process.execPath, [nextBin, "build"], {
    cwd: root,
    stdio: "inherit",
    env: { ...process.env, NEXT_OUTPUT: "export", NEXT_BASE_PATH: basePath, NEXT_PUBLIC_SITE_URL: siteUrl },
  });
  status = result.status ?? 1;
} finally {
  restore();
}

if (status !== 0) {
  console.error("Static export build failed.");
  process.exit(status);
}

writeStaticExtras();
console.log(`Static site ready in ./out (base path: "${basePath || "/"}", site URL: ${siteUrl})`);
