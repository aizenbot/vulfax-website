import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Prefixes an internal page path with the deploy base path (e.g. GitHub Pages
 * /repo-name). Static exports use trailing slashes (folder/index.html).
 */
export function withBasePath(path: string): string {
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  if (process.env.NEXT_PUBLIC_STATIC_EXPORT !== "true") return `${base}${path}`;
  return `${base}${path.replace(/\/+$/, "")}/`;
}

/** Hands the browser a mailto: (or other external) URL to open. */
export function openExternalUrl(url: string): void {
  window.location.assign(url);
}
