import type { NextConfig } from "next";

/**
 * Two build modes:
 * - Default (Vercel / any Node host): Cache Components, proxy, API route.
 * - Static export for GitHub Pages: `NEXT_OUTPUT=export`, optional
 *   `NEXT_BASE_PATH=/repo-name`. Run `npm run build:pages`, which first removes
 *   the server-only files a static host cannot serve (see scripts/static-export.mjs).
 */
const isStaticExport = process.env.NEXT_OUTPUT === "export";
const basePath = isStaticExport ? (process.env.NEXT_BASE_PATH ?? "").replace(/\/$/, "") : "";

const nextConfig: NextConfig = {
  // Partial Prerendering cannot run in export mode.
  cacheComponents: !isStaticExport,
  partialPrefetching: !isStaticExport,
  ...(isStaticExport && {
    output: "export",
    // Emit en/index.html (not en.html): static hosts serve the folder when both exist.
    trailingSlash: true,
    basePath: basePath || undefined,
    images: { unoptimized: true },
  }),
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
    NEXT_PUBLIC_STATIC_EXPORT: String(isStaticExport),
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
